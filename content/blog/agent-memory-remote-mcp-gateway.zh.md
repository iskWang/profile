---
schema: blog-post
lang: zh
title: 把本機 Agent 記憶接上 Claude 與 ChatGPT 網頁：寫一個 MCP 轉接站的踩坑紀錄
date: 2026-11-06
summary: 我想讓網頁版 Claude 與 ChatGPT 也能讀寫終端機裡的 agentmemory，但又不想開兩個 MCP 連線，最後在現有的 Obsidian MCP 後面寫了個 gateway 把兩個服務接起來，順便修剪掉五十幾個高風險工具
topics:
  - mcp
  - agentmemory
  - omp
  - claude
  - chatgpt
  - cloudflare
origin: original
vault_path: 30_Resources/AI/Agent 工作流/omp 記憶共用到 Claude 與 ChatGPT 網頁：遠端 MCP 可行性調查.md
---

## 起點：終端機裡的記憶，網頁版完全不知道

我平常在家裡的 Mac mini 上，用 Oh My Pi（omp）搭配 Orca 調度不同的 coding agent（omp、Claude Code 與 Codex），這些工具在終端機裡有一套共用的記憶系統，叫做 `agentmemory`，跑在 `127.0.0.1:3113`

每次 agent 踩到雷、或是我們定下來某個專案慣例，agent 就會把經驗寫進記憶庫；下次開新的 session 時，其他模型也能透過 recall 把這些 context 撈出來用

但這套工作流出了 terminal 就斷了

有時我出門在外，用手機或筆電開 Claude.ai 跟 ChatGPT 討論系統架構，聊到一半常會有一種強烈的斷裂感：「這個坑我上週在 terminal 裡才跟 coding agent 解決過，經驗早就記下來了，為什麼網頁上的 AI 還是一臉茫然，得讓我重講一遍？」

之前在[[obsidian-remote-mcp-cloudflare-access|把家裡的 Obsidian 接上雲端 AI：一次 Cloudflare Access 的踩雷紀錄]]這篇提過，我透過 Cloudflare Tunnel 和 Cloudflare Access，把 Mac mini 上的 Obsidian 筆記庫做成遠端 MCP，讓網頁版 AI 可以直接讀寫筆記，那我能不能把終端機裡的記憶，也用同樣的方式接給網頁版 AI？

## 盤點與限制：不能直接對外開 port

仔細盤點一下 omp 的架構，內部其實有兩套記憶機制：

1. **Mnemopi**：這是 omp 內建的記憶（設定在 `~/.omp/agent/config.yml`），純粹是 CLI 內部邏輯，沒有對外暴露任何標準介面
2. **agentmemory**：這是一個獨立的本機服務（v0.9.28），提供 REST API，也是我和幾個 coding agent 真正共用知識的地方

所以共用對象很明確是 **agentmemory**，但要把它變成遠端 MCP 給網頁用，馬上遇到三個現實問題：

- **原廠 MCP 只能跑在本地 stdio**：agentmemory 官方有提供 `@agentmemory/mcp` 套件，但它是透過本機 process 的 stdio 通訊，網頁端的 Claude 或 ChatGPT 根本連不進來
- **本地 port 完全沒有身分驗證**：`127.0.0.1:3113` 的 REST API 是赤裸裸的，沒有任何密碼或 token 檢查，絕對不能直接透過 tunnel 開給公網
- **工具數量太多，而且太危險**：agentmemory 預設提供了將近 58 個工具，除了日常讀寫，還有一大堆高風險指令，比如匯出全部資料、刪除記憶、跨機同步（mesh sync）、觸發 webhook、修改 slot 等等，如果把這 58 個工具一股腦塞給網頁版 LLM，除了 prompt context 瞬間被工具描述塞爆，哪天模型產生幻覺誤調刪除指令，資料就直接蒸發了

## 架構選擇：我不想在手機端管兩條 MCP 連線

要解決連線與安全問題，我考慮過幾種做法：

- **做法 A：替 agentmemory 另開一個獨立的遠端 MCP 網址**
  技術上最直觀，但這代表我的 Claude 和 ChatGPT 網頁端必須同時掛兩個 custom connector（一個連 Obsidian，一個連 agentmemory），手機介面本來就小，多管一組 OAuth 連線跟 endpoint，日常體驗非常瑣碎
- **做法 B：把記憶定時匯出成 Obsidian 筆記，靠現有的筆記 MCP 來讀**
  雖然不用加連線，但這樣只能單向讀取，網頁端 AI 沒辦法即時把新的 insight 寫回記憶庫，而且也失去了 agentmemory 原本的語意搜尋能力
- **做法 C：在現有的 Obsidian MCP 網址後面放轉接站，把兩個服務合併**
  這是我最後採用的方案，網頁端只認原本那一個 MCP 網址，後面由一個自寫的轉接站（`mcp-gateway`）負責分流與過濾

最後的拓撲長這樣：

```text
Claude / ChatGPT
   │ HTTPS + OAuth（Cloudflare Access Managed OAuth，只允許本人 email）
   ▼
cloudflared tunnel: mcp.example.com
   ▼
mcp-gateway 127.0.0.1:3012（二次驗證 Cloudflare Access JWT 與 email）
   ├─ Obsidian MCP 127.0.0.1:3010 → 12 個筆記工具，原樣轉送
   └─ agentmemory 127.0.0.1:3113 → 嚴格白名單：只暴露 4 個工具
        memory_smart_search、memory_recall、memory_lesson_recall（讀）
        memory_save（寫）
```

轉接站做的事情其實很單純：

1. **收斂入口**：不管是 Obsidian 筆記還是記憶工具，對外全部合併成一個 MCP tools 清單
2. **大刀修剪權限**：agentmemory 的 58 個工具裡，我只放行 4 個（3 個讀取、1 個寫入），其餘像 `export`、`governance_delete`、`mesh_sync` 等高風險工具，在轉接站就被徹底隱藏，即使外部送出 tool call 也會直接被攔截，根本進不到後端
3. **縱深防禦**：除了 Cloudflare Access 在外層擋人，`mcp-gateway` 本身收到請求時，會再解一次 Cloudflare Access JWT，確認 email 確實是本人

## 實作中的細節與意外發現

寫轉接站本身不算太複雜，但在實際串接時，有幾個細節比想像中有趣：

### 1. 單邊故障不能拖垮另一邊

轉接站後面掛了兩個 upstream（Obsidian 與 agentmemory），在寫測試時我發現一個容易忽略的邊界情況：如果哪天我的 Obsidian 容器正在重啟或短暫當掉，轉接站抓 upstream tools 失敗時，絕對不能直接拋出例外，把 agentmemory 的記憶工具也一起弄丟

兩個 upstream 的 probe 必須各自獨立，一邊掛掉，另一邊的工具依然要正常提供服務

### 2. 上游錯誤要原汁原味回傳

第一版轉接站遇到 upstream 的工具錯誤時，一律包裝成 `Tool operation failed.` 這種通用訊息，review 時才發現這樣會讓網頁端的 AI 抓瞎——例如當 Claude 試圖讀取一篇不存在的筆記時，只拿到一句「操作失敗」，模型根本不知道是連線壞了還是檔名錯了，把上游的錯誤訊息（例如「找不到該筆記」）原樣傳回，LLM 才能依據錯誤反饋自我修正

### 3. 網頁端不能刪筆記，我選擇維持現狀

在現有的 Obsidian MCP 設定裡，刪除筆記屬於破壞性操作，upstream 會要求 client 進行確認（elicitation），因為我的轉接站沒有轉送這層 elicitation 協議，本機測試時，經轉接站發動刪除會直接失敗

我原本猶豫要不要把這段補齊，但轉念一想：我在手機或網頁上跟 AI 聊天，本來就不太需要刪除本機筆記，就維持現狀，不過這不算真正的煞車，`obsidian_write_note`、`obsidian_replace_in_note` 仍然可以覆寫甚至清空一篇筆記，真正的保護還是每日的 vault 快照

### 4. 官方文件與實際狀況的落差

在調查網頁端 MCP 支援度時，各家平台的情況也很有意思：

- **Claude 網頁版**：從 Free、Pro 到 Max 都能加入遠端 MCP connector，連線是從 Anthropic 的雲端直接打到伺服器，所以 Cloudflare Access 的設定必須精確放行 OAuth 探索與 callback
- **ChatGPT 網頁版**：OpenAI 官方文件寫著自訂 MCP 的完整操作權限只開放給 Business、Enterprise 和 Edu，Pro 帳號只能唯讀，但我實際用自己的 **Plus** 帳號測試，發現它已經可以透過 Obsidian MCP 建立筆記了，文件記載的限制和線上系統的真實行為並不一致，還是得自己測了才算數
- **Gemini**：上次測試時，Gemini Apps 對這個 server 的動態客戶端註冊（DCR）失敗，原因不明，這次沒有重測

### 5. agentmemory 的型態判定

在實測寫入與查詢時，我發現把一筆記憶標記為 `fact` 寫入（`memory_save`），之後用 `memory_smart_search` 查回來時，回傳的欄位卻被標記成 `decision`

原因我沒有去查，能確定的是轉接站只負責原樣轉發，沒有動這個欄位，而且不影響檢索結果

## 驗證結果與感受

整個轉接站上線前，我先寫了一組驗收測試（用自己簽的測試憑證模擬 Cloudflare Access）：

- 沒帶憑證、偽造憑證、帶錯 email 的請求，全數被擋在門外（回傳 401），Host 不對的請求回傳 403
- 工具清單精準維持 16 個（Obsidian 12 個 + 記憶 4 個）
- 刻意去 call 被隱藏的記憶刪除工具，直接被擋掉
- 模擬 Obsidian 掛掉時，記憶工具依然能正常回傳

接著在本機實際經過轉接站，寫入再讀回一筆隨機字串的記憶和筆記，測完刪除

本機測試通過後，把 Cloudflare Tunnel 指向轉接站的 port，在 claude.ai 上重新連線，如果出問題，只要把 tunnel 改回原本 Obsidian MCP 的 port 就能回到舊狀態

實測在對話框裡叫 Claude 記下一組測試字串，Claude 順利呼叫 `memory_save`；接著請它搜尋相關關鍵字，`memory_smart_search` 第一筆就精準撈出剛剛存下的內容，測完再從本機把測試資料清掉，整個流程一氣呵成

現在坐在電腦前用 terminal 寫 code 的 agent，和網頁版 Claude 看到的是同一份 Obsidian 筆記和同一份 agentmemory（omp 自動回想用的 Mnemopi 仍然只在終端機裡），手機 App 和 ChatGPT 經過新轉接站的連線則還沒實測

要提醒自己的是，網頁端的 AI 可以搜尋**全部**記憶，而記憶裡難免有本機路徑和內部網址，這是我評估後接受的風險，白名單擋得住危險操作，擋不住「讀」

把工具收進單一 gateway 的好處，表面上是少管一個連線網址，但對我來說更有價值的，是終於可以在轉接層把「不該給網頁用的工具」與「不需要的雜訊」乾乾淨淨地修剪掉

## 參考資料

- [Claude Help Center: Get started with custom connectors using Remote MCP](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp)
- [OpenAI Help: Connecting custom MCP servers in ChatGPT](https://help.openai.com/en/articles/12584461-connecting-custom-mcp-servers-in-chatgpt)
- [[obsidian-remote-mcp-cloudflare-access|把家裡的 Obsidian 接上雲端 AI：一次 Cloudflare Access 的踩雷紀錄]]
