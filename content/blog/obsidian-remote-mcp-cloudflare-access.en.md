---
schema: blog-post
lang: en
title: Putting my home Obsidian vault behind Cloudflare Access as a remote MCP
date: 2026-09-22
summary: I turned my Mac mini Obsidian vault into a remote MCP with Cloudflare Tunnel and Access, got Claude connected, and hit a DCR wall with Gemini while drawing clear security boundaries
topics:
  - mcp
  - obsidian
  - cloudflare
  - security
origin: original
translation: machine-assisted
vault_path: 30_Resources/AI/Agent 工作流/Mac mini Obsidian 遠端 MCP：Cloudflare Access 接入與 Gemini 相容性紀錄.md
---

## What I wanted to solve

I wanted AI clients on my phone and in the browser to read and write the Obsidian vault on my Mac mini, so I could organize notes while away from home. The scope included Claude on the web and iOS, ChatGPT on the web, and Gemini Apps on the web and iOS

I originally considered Auth0, but I already had Cloudflare Tunnel and Cloudflare Access in place, so I decided to connect the existing pieces first. That avoided adding another identity system and kept the external entry point and OAuth handling in one layer

## What it ended up looking like

```text
Claude / ChatGPT / Gemini
        │ HTTPS + OAuth 2.1 / PKCE
        ▼
Cloudflare Access Managed OAuth
        │ Access policy
        ▼
cloudflared Tunnel
        ▼
obsidian-mcp-server（只綁 127.0.0.1:3010/mcp）
        │ 本機 API key（不對外）
        ▼
Obsidian Local REST API with MCP（https://127.0.0.1:27124）
        ▼
iCloud Obsidian vault
```

The public entry point is `https://mcp.example.com/mcp`. Locally, `obsidian-mcp-server` connects to Obsidian's Local REST API

The local pieces are the `obsidian-local-rest-api` Obsidian plugin (Local REST API with MCP), `obsidian-mcp-server`, the startup wrapper at `~/.local/bin/obsidian-mcp-start.sh`, and the log directory at `~/Library/Logs/obsidian-mcp`. A daily vault snapshot runs through `~/.local/bin/obsidian-snapshot.sh` and writes to `/Volumes/Mac_mini/obsidian-snapshots`

The secrets are not in this post: the plugin API key, MCP environment file, Cloudflare API token, Access token, OAuth client secret, and Cloudflare account/AUD identifier are all left out

## About external access

### Only accepts loopback (127.0.0.1)

The MCP server binds only to `127.0.0.1:3010`, so it cannot be reached directly from the network. The Tunnel is the only external entry point. The Cloudflare Access policy allows only the account owner's email, with no Everyone or Bypass rule, and the Tunnel also checks the Access assertion so a deleted Access app does not leave the origin exposed

### OAuth and the local API key stay separate

Cloudflare Access handles OAuth, including authorization server discovery, Dynamic Client Registration (DCR), PKCE S256, 15-minute access tokens, and 14-day grant sessions. AI clients receive only the OAuth token issued by Cloudflare. The API is only used locally and is never handed to Claude, ChatGPT, or Gemini

### Read-write access, but no command tools

I chose to let AI clients read and write the entire vault, so daily NAS backups are a prerequisite, not extra work

`obsidian_execute_command` and `obsidian_list_commands` are not exposed, but that does not make the vault read-only: notes can still be created, overwritten, or deleted, so the client should ask for human confirmation before writes and deletes

<aside class="post-callout post-callout--warning"><strong>This is not read-only access</strong><p>Even with command tools disabled, an AI can create, overwrite, or delete notes, so human confirmation should remain in place before writes and deletes</p></aside>

### About backups

Backups are kept for 30 days. With one run per day, that means I could lose at most a day's changes

<aside class="post-callout post-callout--warning"><strong>The backup boundary</strong><p>A backup on a NAS writable by the same account provides a recovery point, not an immutable backup against ransomware or host compromise</p></aside>

## Actual API verification results

| Check | Result |
| --- | --- |
| Local initialize / MCP session / tools list | Successful; read-write tools were listed |
| Dangerous command tools | Not in the tools list |
| Public MCP with no token | 401, with `WWW-Authenticate` |
| Public MCP with a fake Bearer token | 401, with no tool response |
| OAuth discovery | `/.well-known/oauth-authorization-server` had the issuer, authorization/token/registration endpoints, and S256 |
| Protected-resource discovery | The resource was `https://mcp.example.com/mcp` and declared the authorization server |
| Access policy | The single Allow-by-email rule remained unchanged by the OAuth settings |

## The hour when the verification email never arrived

I opened the MCP URL directly in a browser and used Cloudflare One-time PIN. The page said the verification code had been sent, but the email never arrived. The same account could receive a PIN when signing in to the existing Vaultwarden setup

I compared the settings for both Access apps, temporarily disabled Managed OAuth for the Obsidian MCP app, and tried the direct browser login again. As soon as Managed OAuth was disabled, the PIN email arrived and I could sign in

I re-enabled Managed OAuth and kept the redirect URI allow-list for Claude, ChatGPT, and Gemini. Remote MCP clients need OAuth discovery, PKCE, and DCR, so I could not leave Managed OAuth disabled just to make direct URL testing convenient

The takeaway: don't rely on the One-time PIN flow. The proper entry point is the OAuth client flow

## Why Gemini did not connect

Gemini showed this error:

> 無法自動向這個伺服器註冊。如要連線，請輸入 OAuth 用戶端 ID 和用戶端密鑰。

I confirmed four things on the Cloudflare side:

- Managed OAuth was enabled
- The DCR registration endpoint was declared
- PKCE S256 was declared
- `https://gemini.google.com/*` was in the DCR redirect URI allow-list

So I decided not to add a static OAuth client or compatibility layer for Gemini. That would add a long-lived client secret with access to the vault and another authorization surface to maintain, while Claude and ChatGPT do not need it

If Gemini fixes its DCR implementation later, I can retry the same URL without rebuilding the infrastructure

## Getting Claude web connected

For individual Free/Pro/Max accounts: go to **Customize > Connectors** (`https://claude.ai/customize/connectors`), click **+** next to Connectors, choose **Add custom connector**, and paste `https://mcp.example.com/mcp`. The newer two-step dialog also asks for a display name; after Continue, Claude checks the URL and marks the detected authentication method as **Detected**

For authentication you can pick Claude's built-in identity (CIMD), **Register automatically** (DCR — what I used, since Cloudflare Access advertises a `registration_endpoint`), or bring your own OAuth Client ID (the secret can stay blank). After adding it, go back to Customize > Connectors and click **Connect**; it redirects to the Cloudflare Access login page (One-time PIN, in my case) and returns to Claude once that's done

Then click **+ > Connectors** in the bottom-left of the chat composer and toggle the connector on. Per-tool allow/needs-approval/block settings live on the same Tool permissions page. Team/Enterprise accounts need an Owner to add the connector under Organization settings > Connectors first, then members click Connect from Customize > Connectors

One limitation worth noting: Claude reaches the MCP server from Anthropic's cloud, not from the browser or device, so the MCP endpoint and OAuth discovery must be publicly reachable — an internal-network or VPN-only endpoint will not work

## Getting ChatGPT connected: set up on web, use on web and iOS

The official docs only document the web setup flow: enable Developer mode (**Settings → Security and login → Developer mode**, or Settings → Apps → Advanced Settings depending on account type), open `https://chatgpt.com/plugins`, and click **+** to create a developer-mode app. The creation form has a **Name** field — I entered `obsidian-macmini`, and that name is exactly what you later type after `@` in the chat composer, so it's worth picking the handle you actually want up front. Then fill in the endpoint, choose an authentication method, click **Scan Tools**, complete OAuth if prompted, then click **Create**. A draft has to be published before it shows up in the usable connector list

But once the connector exists and is published, **I tested it on both web and the iOS app, and both work**: typing `@obsidian-macmini` directly in the chat box triggers a call to this MCP. The official FAQ saying "MCP apps are web only" refers specifically to creating/registering a connector; invoking an already-published connector happens through the `@`-mention in the composer, and I verified that on both web and iOS

**Why the `@` mention works on iOS too:** OpenAI's docs define `@`/`+` as a general, surface-agnostic way to designate an available app or plugin in a conversation — that layer of docs never says web-only. The Apps SDK explicitly says these apps are built on MCP. What is officially scoped to "web only" is Developer mode, the create/test/publish surface for connectors. The reasonable reading: `@` mention is a more general app/plugin invocation entry point that works across platforms once a connector is published, while Developer mode's web restriction is specifically about setting one up. To be precise: OpenAI has not published documentation confirming whether the iOS `@` invocation internally uses the exact same MCP tool-calling path as Developer mode, so this should be reported as an observed behavior, not as officially documented iOS MCP support

## Current status

| Client | Status |
| --- | --- |
| Claude (web / iOS) | Custom connector created and OAuth authorized; tools can be called once the connector is toggled on |
| ChatGPT (web / iOS) | Created and published via Developer mode on web; both web and the iOS app trigger it with `@obsidian-macmini`, tested on both |
| Gemini Apps | Tested and failed, stuck on DCR |

## References

- [Cloudflare Access Managed OAuth](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/managed-oauth/)
- [Claude Custom Connectors — Get started](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp)
- [Claude Remote MCP custom connector docs](https://claude.com/docs/connectors/custom/remote-mcp)
- [Claude Connectors authentication (DCR/CIMD/PKCE)](https://claude.com/docs/connectors/building/authentication)
- [ChatGPT Developer mode and MCP apps](https://help.openai.com/en/articles/12584461-developer-mode-and-mcp-apps-in-chatgpt)
- [ChatGPT Connected apps (the `@`-mention mechanism)](https://help.openai.com/en/articles/11487775-connected-apps-in-chatgpt)
- [OpenAI Apps SDK (apps are built on MCP)](https://help.openai.com/en/articles/12515353-build-with-the-apps-sdk)
- [OpenAI Platform: ChatGPT Developer mode](https://developers.openai.com/api/docs/guides/developer-mode)
- [Gemini Apps Custom Connected Apps](https://support.google.com/gemini/answer/17209137)
