---
schema: blog-post
lang: zh
title: 把家裡的 Obsidian 接上雲端 AI：一次 Cloudflare Access 的踩雷紀錄
date: 2026-09-22
summary: 我用 Cloudflare Tunnel 跟 Access 把 Mac mini 上的 Obsidian vault 變成遠端 MCP，Claude 接得上、Gemini 卡在 DCR，這是整個過程跟我劃的安全界線
topics:
  - mcp
  - obsidian
  - cloudflare
  - security
origin: original
vault_path: 30_Resources/AI/Agent 工作流/Mac mini Obsidian 遠端 MCP：Cloudflare Access 接入與 Gemini 相容性紀錄.md
---

## 我想解決什麼

我想讓手機和網頁上的 AI 用戶端讀寫 Mac mini 上的 Obsidian vault，這樣人不在家裡也能整理筆記。範圍包含 Claude 的網頁與 iOS App、ChatGPT 網頁版，以及 Gemini Apps 的網頁與 iOS App

我原本考慮用 Auth0，但手上已經有 Cloudflare Tunnel 和 Cloudflare Access，最後決定先把現有元件串起來。這樣不用再引入另一套身分系統，對外入口和 OAuth 也能集中在同一層處理

## 最後長成什麼樣

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

公開入口是 `https://mcp.example.com/mcp`，本機則由 `obsidian-mcp-server` 接到 Obsidian 的 Local REST API

本機會用到 Obsidian 插件 `obsidian-local-rest-api`（Local REST API with MCP）、`obsidian-mcp-server`、啟動包裝 `~/.local/bin/obsidian-mcp-start.sh`，以及存放日誌的 `~/Library/Logs/obsidian-mcp` 目錄。每日 vault 快照由 `~/.local/bin/obsidian-snapshot.sh` 執行，寫到 `/Volumes/Mac_mini/obsidian-snapshots`

secret token 不會記在這裡: 套件 API Token, MCP 環境設定, Cloudflare API Token, Access Token, Oauth Client Token，以及 Cloudflare 帳號/AUD 都不放在程式裡

## 關於外部存取的部份

### 只接受 loopback(127.0.0.1)

MCP 伺服器只綁 `127.0.0.1:3010`，不能直接從網路存取，Tunnel 是唯一的外部入口。Cloudflare Access 的存取政策只允許帳號擁有者的電子郵件，沒有 Everyone 或 Bypass 規則，Tunnel 端也會用 Access assertion 驗證，避免 Access 應用程式被誤刪時原始服務變成裸露服務

### OAuth 和本機 API key 分開

OAuth 由 Cloudflare Access 處理，提供授權伺服器探索、Dynamic Client Registration（DCR）、PKCE S256、15 分鐘的存取權杖和 14 天的授權工作階段。AI 用戶端只拿到 Cloudflare 發的 OAuth Token，API 只在本機這一段使用，不會交給 Claude、ChatGPT 或 Gemini

### 可讀寫，但不開 command 工具

我選擇讓 AI 用戶端可以讀寫整個 vault，所以每日 NAS 備份是前提，不是額外工作

`obsidian_execute_command` 和 `obsidian_list_commands` 這兩個指令工具沒有對外暴露，但這不等於唯讀，筆記仍可能被建立、覆寫或刪除，寫入與刪除工具應保留用戶端的人工作業確認

<aside class="post-callout post-callout--warning"><strong>這不是唯讀權限</strong><p>即使關掉 command 工具，AI 仍可能建立、覆寫或刪除筆記，寫入與刪除前要保留人工確認</p></aside>

### 關於備份

備份保留 30 天，每日一次代表最多損失一天的修改

<aside class="post-callout post-callout--warning"><strong>備份的界線</strong><p>同一帳號可寫的 NAS 備份只能提供回復點，不能當成防勒索或防主機入侵的不可變備份</p></aside>

## 實際 API 驗證結果

| 驗證 | 結果 |
| --- | --- |
| 本機初始化 / MCP session / tools list | 成功，可以列出讀寫工具 |
| 危險 command 工具 | 不在工具清單裡 |
| 公開 MCP 無 token | 401，且有 `WWW-Authenticate` |
| 公開 MCP 帶假 Bearer token | 401，沒有工具回應 |
| OAuth discovery | `/.well-known/oauth-authorization-server` 有 issuer、authorization/token/registration endpoint 與 S256 |
| Protected-resource discovery | resource 為 `https://mcp.example.com/mcp`，並宣告 authorization server |
| Access policy | 維持單一 Allow-by-email 規則，未被 OAuth 設定修改 |

## 收不到驗證信的那一小時

我直接在瀏覽器開 MCP URL，走 Cloudflare One-time PIN，頁面顯示驗證碼已寄出，但一直沒收到信。同一個帳號登入既有的 Vaultwarden 卻能收到 PIN

我比對兩個 Access app 的設定，暫時關閉 Obsidian MCP 的 Managed OAuth，再重試直接用瀏覽器登入。Managed OAuth 關掉後，PIN 電子郵件立刻收到，也能順利登入

最後我重新開啟 Managed OAuth，並保留 Claude、ChatGPT、Gemini 的 redirect URI allow-list。遠端 MCP 用戶端需要 OAuth 探索、PKCE 和 DCR，不能為了方便測試直接開網址，就長期關閉 Managed OAuth

代表第一次不要用 One-time PIN，正式入口應該走 OAuth 用戶端流程

## Gemini 為什麼沒接上

Gemini 顯示的錯誤是：

> 無法自動向這個伺服器註冊。如要連線，請輸入 OAuth 用戶端 ID 和用戶端密鑰。

我在 Cloudflare 端確認了四件事：

- Managed OAuth 已啟用
- DCR registration endpoint 已宣告
- PKCE S256 已宣告
- `https://gemini.google.com/*` 已在 DCR redirect URI allow-list

所以這次我不為 Gemini 新增靜態 OAuth 用戶端，也不做相容層。那會新增一組可存取 vault 的長期用戶端密鑰和另一個授權維護面，但 Claude 和 ChatGPT 不需要這些東西

如果 Gemini 之後修好 DCR，我可以重試同一個 URL，現有基礎設施不用重建

## 現在的狀態跟我接下來要做的

| Client | 狀態 |
| --- | --- |
| Claude（網頁 / iOS） | 已建立自訂連接器，進入 OAuth / 工具權限流程，尚未做 nonce 讀寫驗證 |
| ChatGPT（網頁） | 未實測，應在 Developer mode 用同一個 URL 選 OAuth，iOS App 不支援 |
| Gemini Apps | 實測失敗 |

我接下來會：

- 建立帶隨機 nonce 的 smoke note：`00_Inbox/mcp-smoke-<nonce>.md`
- 在終端確認檔案內容和 nonce 相符
- 要求 Claude 讀回同一個 nonce
- 測完刪除 smoke note
- Claude 通過後，用 ChatGPT 網頁 Developer mode 做一次獨立的同樣驗證
- 未來若要重啟 Gemini，先拿到它實際送出的註冊請求，不接受猜測

## 參考資料

- [Cloudflare Access Managed OAuth](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/managed-oauth/)
- [Claude Custom Connectors](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp)
- [Gemini Apps Custom Connected Apps](https://support.google.com/gemini/answer/17209137)
