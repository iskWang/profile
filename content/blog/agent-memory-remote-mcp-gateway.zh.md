---
schema: blog-post
lang: zh
title: 把本機 Agent 記憶接上 Claude 與 ChatGPT 網頁：寫一個 MCP 轉接站的踩坑紀錄
date: 2026-11-06
summary: 想讓網頁版 Claude 跟 ChatGPT 也能讀寫終端機裡的 agentmemory，又不想多管一條 MCP 連線，最後在現有的 Obsidian MCP 後面加一層 gateway 把兩個服務合起來，順便用白名單只留四個記憶工具
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

## 想把所有 Agent 的記憶統一起來

這篇想做的事情其實很單純：我希望能把平常在用的各種 AI Agent 記憶統一起來，不管是在家裡的電腦、筆電還是手機上的不同平台都能共用，同時搭配 Cloudflare Tunnel 跟 Cloudflare Access 做一層基礎的資安防護，讓外部連線不會直接打進家裡的機器

之前在家裡的 Mac mini 上，我已經讓幾個終端機裡的 coding agent（Oh My Pi / omp、Claude Code 跟 Codex）共用同一套 `agentmemory`，平常踩過的坑或定下來的專案習慣記進去後，下次換別的工具接手都還查得到

但只要離開電腦，在外面改用手機或筆電開 Claude.ai、ChatGPT 聊架構或問題，這些記過的東西就全用不到了，常常得從頭把背景再講一遍

之前在[[obsidian-remote-mcp-cloudflare-access|把家裡的 Obsidian 接上雲端 AI：一次 Cloudflare Access 的踩雷紀錄]]裡，我已經用 Cloudflare Tunnel 加 Cloudflare Access 把家裡的 Obsidian 筆記接給網頁版 AI 用過，這次就想照著差不多的想法，把這份共用記憶也跨平台接出來

## 要接哪一套記憶，跟為什麼不能直接開 port

看了一下目前本機的結構，omp 這邊其實有兩套記憶：

1. **Mnemopi**：omp 內建的記憶（設定在 `~/.omp/agent/config.yml`），單純給 CLI 內部自己用，沒有對外提供標準介面
2. **agentmemory**：獨立跑在本機的服務（v0.9.28），有 REST API，也是幾個 coding agent 真正共用記憶的地方

要接出去的對象很明確是 `agentmemory`，不過實際要做之前馬上遇到三個卡關的地方：

- 官方提供的 `@agentmemory/mcp` 只能跑本機 stdio，網頁端的 Claude 或 ChatGPT 連不到
- `127.0.0.1:3113` 的 REST API 沒有任何密碼或 token 驗證，不可能直接透過 tunnel 對外公開
- `agentmemory` 預設開了 58 個工具，除了日常讀寫，還有匯出全部資料、刪除記憶、跨機同步（mesh sync）、觸發 webhook、改 slot 之類的高風險操作，全塞給網頁端不只會把工具描述灌滿每一輪的 context，萬一模型不小心呼叫到刪除也很麻煩

## 不想多管一條 MCP 連線，最後決定合進同一個入口

要處理連線跟權限，我原本想過三種做法：

- **幫 agentmemory 另外開一個遠端 MCP 網址**
  技術上最直接，但這樣 Claude 跟 ChatGPT 都要各掛兩個 custom connector，一個連 Obsidian、一個連 agentmemory，手機畫面已經夠小了，還要多管一組 OAuth 跟網址，日常用起來太瑣碎
- **把記憶定時匯出成 Obsidian 筆記，靠現有的筆記 MCP 讀**
  不用多一條連線，但只能單向看，網頁上聊出的結論沒辦法即時寫回記憶庫，也會少掉 agentmemory 原本的語意搜尋
- **在現有的 Obsidian MCP 後面加一層轉接站，把兩個服務合起來**
  最後我選了這個做法，對外維持原本那一個 MCP 網址，後面改接一個自己寫的轉接站（`mcp-gateway`），由它負責分流跟過濾工具

順帶一提，這套做法其實不一定要搭配 Obsidian，單獨只接 agentmemory 一樣可以跑，我把它們綁在同一個入口純粹是因為原本那套已經架好了，懶得再改

改完之後的架構大概長這樣：

```text
Claude / ChatGPT
   │ HTTPS + OAuth（Cloudflare Access Managed OAuth，只允許本人 email）
   ▼
cloudflared tunnel: mcp.example.com
   ▼
mcp-gateway 127.0.0.1:3012（再驗一次 Cloudflare Access JWT 與 email）
   ├─ Obsidian MCP 127.0.0.1:3010 → 12 個筆記工具，原樣轉送
   └─ agentmemory 127.0.0.1:3113 → 白名單：只放行 4 個工具
        memory_smart_search、memory_recall、memory_lesson_recall（讀）
        memory_save（寫）
```

轉接站做的事其實不多，主要就三件：

1. 把 Obsidian 筆記跟記憶工具合成同一份 MCP tools 清單對外提供
2. 在轉接層做白名單，`agentmemory` 的 58 個工具只放行 4 個（3 讀 1 寫），像 `export`、`governance_delete`、`mesh_sync` 這些不只不會出現在清單裡，就算外部硬送 tool call 也會直接被擋掉，不會進到後端
3. 外層已經有 Cloudflare Access 擋人，`mcp-gateway` 收到請求時還是會再解一次 Cloudflare Access JWT，確認裡面的 email 確實是我自己

## 串接跟實測時遇到的幾個細節

### 一邊掛掉不能把另一邊拖下水

轉接站後面同時掛了 Obsidian 跟 agentmemory 兩個 upstream，寫測試時才想到一個容易漏掉的狀況：如果哪天 Obsidian 容器剛好在重啟或短暫掛掉，轉接站抓它的 tools 清單失敗，不能因為這樣就直接報錯，連帶把 agentmemory 的工具也一起弄不見

兩個 upstream 的 probe 得各自獨立，一邊連不上，另一邊的工具還是要能正常用

### 上游錯誤不要包成一句通用失敗

第一版轉接站碰到 upstream 工具報錯時，我一律包成 `Tool operation failed.` 回去，後來 review 才發現這樣網頁端的 AI 根本看不懂發生什麼事，像是 Claude 去讀一篇不存在的筆記，只拿到一句「操作失敗」，它不會知道是連線斷了還是檔名打錯，把上游原本的錯誤訊息（像是找不到該筆記）直接傳回去，模型才有辦法自己修正

### 網頁端刪不了筆記，我決定先維持現狀

現有的 Obsidian MCP 把刪除筆記歸類成破壞性操作，呼叫時 upstream 會要求 client 做一次確認（elicitation），因為我的轉接站沒有轉送這層確認流程，本機測試時透過轉接站刪筆記會直接失敗

原本有猶豫要不要補齊，後來想想在手機或網頁跟 AI 聊天，本來就沒什麼機會需要刪本機筆記，就先放著不管，不過這不算什麼真正的安全機制，`obsidian_write_note` 跟 `obsidian_replace_in_note` 一樣能覆寫甚至把筆記清空，真正的保險還是每天的 vault 快照

### 各家網頁端支援度跟官方文件不太一樣

順手整理了一下幾家平台對遠端 MCP 的支援狀況：

- **Claude 網頁版**：Free、Pro、Max 都能加遠端 MCP connector，因為連線是從 Anthropic 雲端直接打進來，Cloudflare Access 那邊要記得放行 OAuth discovery 跟 callback
- **ChatGPT 網頁版**：OpenAI 官方文件寫自訂 MCP 的完整操作只開放給 Business、Enterprise 跟 Edu，Pro 帳號只能唯讀，但我拿自己的 **Plus** 帳號實測，其實已經可以透過 Obsidian MCP 建立筆記了，文件寫的限制跟線上實際行為不太一樣，還是自己測過比較準
- **Gemini**：上次測試時，Gemini Apps 連這個 server 在動態客戶端註冊（DCR）就失敗了，原因不明，這次沒有重測

### 寫成 fact，查出來變成 decision

實測讀寫時發現一個小狀況：用 `memory_save` 寫入一筆標記為 `fact` 的記憶，之後用 `memory_smart_search` 查回來，回傳欄位的類型卻被標成 `decision`

原因我沒有去追，能確定的是轉接站只是原樣轉送、沒動過這個欄位，而且也不影響搜尋結果

## 測試結果跟現在的狀態

上線前我先用自己簽的測試憑證模擬 Cloudflare Access，跑了一輪驗收測試：

- 沒帶憑證、偽造憑證或帶錯 email 的請求全部回 401，Host 不對的回 403
- 工具清單固定維持 16 個（Obsidian 12 個加記憶 4 個）
- 刻意呼叫被藏起來的記憶刪除工具，直接被擋掉
- 模擬 Obsidian 掛掉時，記憶工具還是能正常回傳

接著在本機實際透過轉接站，寫入再讀回一筆隨機字串的記憶跟筆記，測完刪掉

本機都沒問題後，把 Cloudflare Tunnel 指向轉接站的 port，再到 claude.ai 重新連線，萬一出狀況，只要把 tunnel 改回原本 Obsidian MCP 的 port 就能退回舊設定

在 claude.ai 對話框裡叫 Claude 記一組測試字串，它順利呼叫了 `memory_save`，接著請它搜相關關鍵字，`memory_smart_search` 第一筆就撈出剛剛存的內容，測完再從本機把測試資料清掉

現在在終端機裡寫 code 的 agent，跟網頁版 Claude 看到的已經是同一份 Obsidian 筆記跟同一份 agentmemory（omp 自動回想用的 Mnemopi 還是只在終端機裡），手機 App 跟 ChatGPT 走這個新轉接站的連線則還沒實際測過

要提醒自己的是，網頁端 AI 可以搜到全部記憶，記憶裡難免會有本機路徑跟內部網址，這點是我評估後決定接受的風險，白名單能擋掉危險操作，擋不住「讀」

原本做這個 gateway 只是懶得多管一條連線網址，不過跑起來之後覺得比較實際的好處反而是多了一層過濾，可以把不該給網頁碰的工具跟一堆用不到的雜訊先在轉接層擋掉

## 參考資料

- [Claude Help Center: Get started with custom connectors using Remote MCP](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp)
- [OpenAI Help: Connecting custom MCP servers in ChatGPT](https://help.openai.com/en/articles/12584461-connecting-custom-mcp-servers-in-chatgpt)
- [[obsidian-remote-mcp-cloudflare-access|把家裡的 Obsidian 接上雲端 AI：一次 Cloudflare Access 的踩雷紀錄]]
