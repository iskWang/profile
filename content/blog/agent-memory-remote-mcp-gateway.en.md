---
schema: blog-post
lang: en
title: Connecting local agent memory to Claude and ChatGPT on the web with an MCP gateway
date: 2026-11-06
summary: I connected web-based Claude and ChatGPT to terminal agentmemory through my existing Obsidian MCP, with one gateway and a whitelist that removes more than fifty high-risk tools
topics:
  - mcp
  - agentmemory
  - omp
  - claude
  - chatgpt
  - cloudflare
origin: original
translation: machine-assisted
vault_path: 30_Resources/AI/Agent 工作流/omp 記憶共用到 Claude 與 ChatGPT 網頁：遠端 MCP 可行性調查.md
---

## The starting point: memory in the terminal that the web clients couldn't see

At home, I use Oh My Pi (omp) with Orca on my Mac mini to coordinate different coding agents (omp, Claude Code, and Codex). These tools share a memory system in the terminal called `agentmemory`, running at `127.0.0.1:3113`

Whenever an agent hits a snag or we settle on a project convention, the agent writes the experience to the memory store. In a new session, other models can retrieve that context with recall

But this workflow stopped at the terminal

When I'm out, I sometimes use my phone or laptop to discuss system architecture with Claude.ai and ChatGPT. Halfway through, I often feel a sharp disconnect: “I solved this problem with a coding agent in the terminal just last week and wrote down what we learned. Why is the AI on the web still completely lost, making me explain it all again?”

As I wrote in [[obsidian-remote-mcp-cloudflare-access|Putting my home Obsidian vault behind Cloudflare Access as a remote MCP]], I used Cloudflare Tunnel and Cloudflare Access to make the Obsidian vault on my Mac mini available as a remote MCP, so web-based AI could read and write notes. Could I connect the terminal's memory to web-based AI the same way?

## Taking stock and the limits: I couldn't just open a port to the internet

Looking closely at omp's architecture, I found two separate memory systems:

1. **Mnemopi**: omp's built-in memory, configured in `~/.omp/agent/config.yml`. It's purely internal CLI logic and doesn't expose a standard interface
2. **agentmemory**: a separate local service (v0.9.28) with a REST API. It's where I and several coding agents actually share knowledge

So the shared system was clearly **agentmemory**, but making it a remote MCP for web clients immediately raised three practical problems:

- **The official MCP only runs over local stdio**: agentmemory provides the `@agentmemory/mcp` package, but it communicates over the local process's stdio. Claude or ChatGPT on the web can't connect to it
- **The local port has no authentication at all**: the REST API at `127.0.0.1:3113` has no password or token check. I absolutely couldn't expose it directly to the public internet through a tunnel
- **There are too many tools, and some are dangerous**: agentmemory provides nearly 58 tools by default. Along with everyday read and write operations, there are high-risk commands for exporting all data, deleting memories, syncing between machines (mesh sync), triggering webhooks, modifying slots, and more. Giving all 58 tools to a web LLM would immediately fill its prompt context with tool descriptions, and one hallucinated deletion call could make the data disappear

## Choosing an architecture: I didn't want to manage two MCP connections on my phone

I considered a few approaches to solve the connection and security problems:

- **Option A: Give agentmemory its own remote MCP URL**
  This is the most obvious technically, but it would mean connecting both Claude and ChatGPT on the web to two custom connectors—one for Obsidian and one for agentmemory. The phone interface is already small, so managing another OAuth connection and endpoint would make everyday use needlessly fiddly
- **Option B: Periodically export memories as Obsidian notes and read them through the existing notes MCP**
  This avoids adding a connection, but only supports reading in one direction. Web-based AI couldn't write new insights back to the memory store in real time, and I'd lose agentmemory's semantic search
- **Option C: Put a gateway behind the existing Obsidian MCP URL to combine the two services**
  This is the option I chose. The web client sees just the original MCP URL, while a gateway I wrote (`mcp-gateway`) routes and filters requests behind it

The resulting topology looks like this:

```text
Claude / ChatGPT
   │ HTTPS + OAuth (Cloudflare Access Managed OAuth; only my email is allowed)
   ▼
cloudflared tunnel: mcp.example.com
   ▼
mcp-gateway 127.0.0.1:3012 (re-validates Cloudflare Access JWT and email)
   ├─ Obsidian MCP 127.0.0.1:3010 → 12 note tools, forwarded as-is
   └─ agentmemory 127.0.0.1:3113 → strict allowlist: exposes only 4 tools
        memory_smart_search, memory_recall, memory_lesson_recall (read)
        memory_save (write)
```

The gateway does three fairly simple things:

1. **Unifies the entry point**: whether it's Obsidian notes or memory tools, everything is combined into one MCP tools list externally
2. **Cuts back permissions sharply**: of agentmemory's 58 tools, I allow only 4 (3 reads and 1 write). High-risk tools such as `export`, `governance_delete`, and `mesh_sync` are completely hidden by the gateway; even if an external client sends a tool call for one, the gateway blocks it before it reaches the backend
3. **Adds defense in depth**: Cloudflare Access blocks outsiders at the edge, and `mcp-gateway` also decodes the Cloudflare Access JWT on each request and confirms the email is mine

## Implementation details and an unexpected finding

The gateway itself wasn't too complicated to write, but a few details came up during integration that were more interesting than I expected

### 1. One upstream failure must not take down the other

The gateway has two upstreams, Obsidian and agentmemory. While writing tests, I found an easy-to-miss edge case: if my Obsidian container is restarting or temporarily down, a failure to fetch upstream tools must not throw an exception that also makes the agentmemory tools disappear

The two upstream probes must be independent. If one is down, the other's tools still need to work

### 2. Return upstream errors as they are

In the first version, the gateway wrapped every upstream tool error in a generic message like `Tool operation failed.` During review, I realized this left the web AI in the dark. For example, if Claude tried to read a note that didn't exist, it would only get “operation failed” and have no way to know whether the connection was broken or the filename was wrong. Returning the upstream error as-is—for example, “note not found”—gives the LLM feedback it can use to correct itself

### 3. The web client can't delete notes; I decided to leave it that way

In my existing Obsidian MCP setup, deleting a note is a destructive operation, so the upstream asks the client for confirmation (elicitation). My gateway doesn't forward that elicitation protocol, so a delete request made through the gateway failed in my local test

I initially wondered whether I should implement that part, but then I thought about it: I don't really need to delete local notes while chatting with AI on my phone or the web, so I'll leave it as is. That isn't a real safeguard, though: `obsidian_write_note` and `obsidian_replace_in_note` can still overwrite or even empty a note. The actual protection is the daily vault snapshot

### 4. The gap between official docs and what actually happened

While checking MCP support on the web platforms, I found the situation interesting:

- **Claude on the web**: Remote MCP connectors can be added on Free, Pro, and Max. The connection comes directly from Anthropic's cloud to the server, so Cloudflare Access has to allow OAuth discovery and callbacks precisely
- **ChatGPT on the web**: OpenAI's official docs say full custom MCP operation permissions are available only on Business, Enterprise, and Edu, while Pro accounts are read-only. But when I tested with my own **Plus** account, I found it could already create notes through the Obsidian MCP. The documented limits and the live system's behavior didn't match, so I had to test it myself
- **Gemini**: In my last test, Gemini Apps failed dynamic client registration (DCR) with this server for an unknown reason. I didn't retest it this time

### 5. How agentmemory classifies a memory

When testing writes and searches, I found that a memory I wrote as `fact` with `memory_save` came back marked as `decision` when I searched for it with `memory_smart_search`

I didn't investigate the reason. What I could confirm is that the gateway only forwards the field as-is and doesn't change it, and that it doesn't affect search results

## Verification results and how it feels

Before putting the gateway online, I wrote acceptance tests using test credentials I signed myself to simulate Cloudflare Access:

- Requests without credentials, with forged credentials, or with the wrong email were all blocked at the door (401); requests with the wrong Host returned 403
- The tools list stayed precisely at 16 (12 Obsidian tools + 4 memory tools)
- I deliberately called a hidden memory deletion tool, and the gateway blocked it
- When I simulated an Obsidian outage, the memory tools still returned normally

Then I used the gateway locally to write and read back a memory and note containing random strings, and deleted them after the test

After the local tests passed, I pointed the Cloudflare Tunnel at the gateway's port and reconnected on claude.ai. If anything went wrong, I could point the tunnel back to the original Obsidian MCP port to restore the old setup

In a real chat, I asked Claude to remember a test string, and it successfully called `memory_save`. Then I asked it to search for a related keyword, and `memory_smart_search` brought back the content I had just saved as its first result. I deleted the test data locally afterward; the whole process worked smoothly

Now the agent writing code in the terminal in front of me and Claude on the web see the same Obsidian notes and the same agentmemory. Mnemopi, which omp uses for automatic recall, is still only in the terminal. I haven't tested the connection to the new gateway from the mobile apps or ChatGPT yet

One risk I need to keep in mind is that web-based AI can search **all** memories, which inevitably include local paths and internal URLs. I considered that risk and accepted it; the allowlist blocks dangerous operations, but it can't block “read”

The benefit of combining the tools behind one gateway is ostensibly one fewer connection URL to manage. More valuable to me is finally being able to cleanly trim away, at the gateway layer, both “tools that shouldn't be available to the web” and “noise I don't need”

## References

- [Claude Help Center: Get started with custom connectors using Remote MCP](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp)
- [OpenAI Help: Connecting custom MCP servers in ChatGPT](https://help.openai.com/en/articles/12584461-connecting-custom-mcp-servers-in-chatgpt)
- [[obsidian-remote-mcp-cloudflare-access|Putting my home Obsidian vault behind Cloudflare Access as a remote MCP]]
