---
schema: blog-post
lang: en
title: Connecting local agent memory to Claude and ChatGPT on the web with an MCP gateway
date: 2026-11-06
summary: I wanted web Claude and ChatGPT to use terminal agentmemory without a second MCP connection, so I added a gateway behind my Obsidian MCP and allowlisted four memory tools
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

## Unifying memory across all my agents

The goal here is pretty simple: I wanted one shared memory across all the AI agents I use, accessible from different platforms whether I'm on my home computer, laptop, or phone, with Cloudflare Tunnel and Cloudflare Access in front as basic security so external traffic never connects directly to my machine

On my Mac mini at home, my terminal coding agents (Oh My Pi / omp, Claude Code, and Codex) already share one local memory store (`agentmemory`). Once a snag or project convention gets saved there, other tools can look it up later

Once I'm away from my desk and using Claude.ai or ChatGPT on my phone or laptop to talk through an architecture problem, though, none of that history comes with me and I end up explaining the background all over again

In [[obsidian-remote-mcp-cloudflare-access|Putting my home Obsidian vault behind Cloudflare Access as a remote MCP]], I already used Cloudflare Tunnel and Cloudflare Access to connect my home Obsidian vault to web AI. This time I wanted to use a similar approach to bring that shared agent memory across platforms too

## Which memory system to share, and why I couldn't just open a port

Looking at my local setup, omp actually has two separate memory systems:

1. **Mnemopi**: omp's built-in memory (configured in `~/.omp/agent/config.yml`), used only inside the CLI with no standard external interface
2. **agentmemory**: a standalone local service (v0.9.28) with a REST API, which is where the coding agents actually share memory

So `agentmemory` was the obvious target, though exposing it to web clients immediately ran into three problems:

- The official `@agentmemory/mcp` package only speaks local stdio, which web Claude and ChatGPT can't reach
- The REST API on `127.0.0.1:3113` has no password or token check, so opening it directly through a tunnel wasn't an option
- `agentmemory` ships with 58 tools by default, including high-risk ones like full data export, memory deletion, cross-machine sync (`mesh_sync`), webhook triggers, and slot edits. Passing all 58 to a web LLM would bloat every prompt with tool schemas, and a stray delete call would be a headache

## Combining both services behind one MCP URL

I thought through three options for connectivity and access control:

- **Give agentmemory its own remote MCP URL**
  Technically the simplest path, but then both Claude and ChatGPT would need two custom connectors—one for Obsidian and one for agentmemory. On a phone screen, managing a second OAuth flow and endpoint gets tedious fast
- **Periodically export memories into Obsidian notes and read them via the existing notes MCP**
  Avoids a second connection, but it's read-only. Anything useful from a web chat couldn't be written back in real time, and I'd lose agentmemory's semantic search
- **Put a gateway behind the existing Obsidian MCP URL and merge both services**
  This is what I went with. Externally there's still just the original MCP URL, backed by a small gateway I wrote (`mcp-gateway`) that handles routing and tool filtering

Side note: this doesn't actually require Obsidian—running agentmemory on its own behind the gateway works fine too. I only kept them together because my existing Obsidian MCP was already set up and I was too lazy to change it

The resulting setup looks like this:

```text
Claude / ChatGPT
   │ HTTPS + OAuth (Cloudflare Access Managed OAuth; only my email is allowed)
   ▼
cloudflared tunnel: mcp.example.com
   ▼
mcp-gateway 127.0.0.1:3012 (re-validates Cloudflare Access JWT and email)
   ├─ Obsidian MCP 127.0.0.1:3010 → 12 note tools, forwarded as-is
   └─ agentmemory 127.0.0.1:3113 → allowlist: exposes only 4 tools
        memory_smart_search, memory_recall, memory_lesson_recall (read)
        memory_save (write)
```

The gateway doesn't do much, just three things:

1. Combines Obsidian note tools and memory tools into one external MCP tools list
2. Enforces an allowlist at the gateway layer: out of `agentmemory`'s 58 tools, only 4 are exposed (3 read, 1 write). Tools like `export`, `governance_delete`, and `mesh_sync` are omitted from the list and rejected by the gateway even if a client calls them directly, so they never reach the backend
3. Even with Cloudflare Access sitting in front, `mcp-gateway` decodes the Cloudflare Access JWT on every request to verify the email is mine

## A few details from wiring it up and testing

### One upstream going down can't take the other with it

Because the gateway sits in front of both Obsidian and agentmemory, writing tests surfaced an easy-to-miss case: if the Obsidian container happens to be restarting or briefly down when the gateway fetches its tool list, that failure can't blow up the whole response and hide the agentmemory tools along with it

Each upstream probe needs to stay independent so one side going down doesn't break the other

### Don't wrap upstream errors into a generic failure

In the first version of the gateway, any upstream tool error got wrapped into a generic `Tool operation failed.` message. During review I realized that leaves the web AI guessing—if Claude tries to read a note that doesn't exist and only gets "operation failed", it can't tell whether the connection broke or the filename is wrong. Forwarding the upstream error message directly (such as note not found) lets the model adjust on its own

### Web clients can't delete notes, and I left it that way

My existing Obsidian MCP marks note deletion as destructive and asks the client for confirmation (elicitation). Since my gateway doesn't forward that elicitation flow, deleting a note through the gateway failed in local testing

I briefly thought about implementing it, then realized I rarely need to delete local notes while chatting with AI from my phone or browser, so I left it alone. That isn't a real safety net, though: `obsidian_write_note` and `obsidian_replace_in_note` can still overwrite or clear a note. The actual fallback is the daily vault snapshot

### Web client support didn't quite match the docs

Here is where the web platforms stood when I checked them:

- **Claude on the web**: Free, Pro, and Max all allow custom remote MCP connectors. Connections come directly from Anthropic's cloud, so Cloudflare Access needs to allow OAuth discovery and callbacks
- **ChatGPT on the web**: OpenAI's docs say full custom MCP permissions are limited to Business, Enterprise, and Edu, with Pro read-only. When I tested with my own **Plus** account, it could already create notes through the Obsidian MCP. The documented limits didn't match live behavior, so testing it directly was the only reliable check
- **Gemini**: In an earlier test, Gemini Apps failed dynamic client registration (DCR) against this server for an unknown reason, and I didn't retest it this time

### Saved as fact, returned as decision

While testing reads and writes, I noticed a small quirk: saving a memory tagged as `fact` with `memory_save` came back tagged as `decision` when queried via `memory_smart_search`

I didn't dig into why. The gateway forwards the payload unchanged without touching that field, and it didn't affect search results

## Test results and current state

Before switching live traffic, I ran an acceptance test suite using self-signed test certs to simulate Cloudflare Access:

- Requests with missing certs, forged certs, or the wrong email all returned 401; wrong `Host` headers returned 403
- The tool list stayed at 16 tools (12 Obsidian + 4 memory)
- Calling a hidden memory deletion tool directly was blocked
- Simulating an Obsidian outage still returned the memory tools normally

Next I ran a local round-trip through the gateway, writing and reading back random test strings for both a memory and a note, then deleting them

Once local checks passed, I pointed the Cloudflare Tunnel at the gateway's port and reconnected on claude.ai. If anything broke, pointing the tunnel back to the original Obsidian MCP port was all it would take to roll back

In a claude.ai chat, I asked Claude to save a test string and it called `memory_save`, then asked it to search for a keyword and `memory_smart_search` returned that entry as the first result. Afterward I deleted the test entry locally

Terminal coding agents and Claude on the web now see the same Obsidian vault and the same agentmemory (Mnemopi for omp's automatic recall still lives only in the terminal). I haven't tested the new gateway from the mobile apps or ChatGPT yet

One thing I have to keep in mind is that web AI can search all memories, which inevitably contain local paths and internal URLs. I thought about it and accepted that tradeoff; an allowlist stops dangerous actions, not reading

I originally wrote the gateway just to avoid managing a second MCP URL, though once it was running, the more useful part turned out to be having a filtering layer in front to strip out tools the web shouldn't touch and noise I don't need

## References

- [Claude Help Center: Get started with custom connectors using Remote MCP](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp)
- [OpenAI Help: Connecting custom MCP servers in ChatGPT](https://help.openai.com/en/articles/12584461-connecting-custom-mcp-servers-in-chatgpt)
- [[obsidian-remote-mcp-cloudflare-access|Putting my home Obsidian vault behind Cloudflare Access as a remote MCP]]
