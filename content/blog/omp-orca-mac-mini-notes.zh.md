---
schema: blog-post
lang: zh
title: 不用再手寫 handoff 文件：我怎麼用 Oh My Pi 跟 Orca 遠端寫程式
date: 2026-10-30
summary: 以前用 SSH 連回家裡的 Mac mini，在 Claude Code 跟 Codex 之間換手都要自己生一份交接文件；換成 Oh My Pi 搭配 Orca 後，多模型分工跟手機端的權限確認終於能留在同一個工作流裡
topics:
  - omp
  - orca
  - ai-coding
origin: original
---

<aside class="post-callout post-callout--warning">

**警語：** Anthropic 官方不允許第三方工具使用 Claude 訂閱方案（Free、Pro、Max）的登入憑證來送出請求，也不允許第三方開發者收集、儲存或中介 Claude.ai 的憑證或 session token，登入必須透過 Anthropic 自己的流程。官方文件在 <a href="https://code.claude.com/docs/en/legal-and-compliance#authentication-and-credential-use">Legal and compliance 的 Authentication and credential use</a>。下面是我個人的使用紀錄，請先確認自己的帳號和服務條款，再決定要不要這樣用。

</aside>

## 原本卡在哪裡：跨 CLI 的手動交接

我很常在外面用筆電或手機連回家裡的 Mac mini 寫程式

以前的做法很陽春：開一般的 SSH 連回家，在 terminal 裡同時跑 Claude Code 和 Codex。因為我習慣讓不同模型負責不同階段——例如一邊看架構或寫前端、另一邊寫實作或做 review——但兩個工具各自的上下文不相通，只要任務要換手，我就得做兩件事：

1. 先叫前一個工具把進度跟脈絡整理成一份 handoff 文件存進專案
2. 切到另一個 CLI，把那份文件的路徑餵給它，叫它接著做

一兩次還好，每天來回切就會覺得自己像個人肉轉發器。我真正需要的不是再開第三個 CLI，而是有一個能同時掛載不同模型、把交接留在同一個 session 裡的工具——後來找到的答案就是 [Oh My Pi](https://omp.sh/docs)（以下簡稱 omp）搭配 [Orca](https://www.onorca.dev/)

## 把多模型交接收進 omp：誰寫、誰審直接在設定檔切開

換成 omp 之後，最核心的改變是**不用再自己搬運上下文**。主對話留在同一個入口，需要不同專長的模型時，直接透過 subagent 派出去，跑完的結果會自己回到主對話

在 omp 裡，通用的 `task`（一般實作）和 `scout`（翻找程式碼）可以直接在 `config.yml` 的 `modelRoles` 指定模型：我目前把 `task` 交給 OpenAI Codex 的 GPT-6 Luna，負責規劃的 `plan` 與深度推理的 `slow` 則用 Claude Opus 5.5（high）

除此之外，我在 `~/.omp/agent/agents/` 底下放了五個自訂的 Markdown 角色檔，把「看架構」、「寫高風險程式」、「切畫面」跟「最後審查」拆給不同模型：

| Subagent | 負責的事情 | 模型 |
| --- | --- | --- |
| `codex-architect` | 唯讀。動工前先看模組邊界與架構風險，不直接改 code | GPT-6 Astra（low） |
| `high-risk-implementer` | 動到公開介面、共用狀態、權限這類高風險的實作 | GPT-6 Astra（high） |
| `high-risk-implementer-sonnet` | 上一個角色的對照組，只在做模型 A/B 比較時用 | Claude Sonnet 5 |
| `designer` | 前端版面與 UI 調整 | Claude Sonnet 5.5 |
| `claude-reviewer` | 唯讀。實作完成後做獨立的 code review | Claude Opus 5.5（high） |

這樣切有兩個好處：

- **寫的人跟審的人不會是同一個模型**：Codex 寫完的東西交給 Claude Opus 審（或反過來），比叫同一個模型自己檢查盲點少得多
- **高風險改動有明確的煞車點**：一般小改動讓 `task` 直接跑，但只要碰到底層介面或權限，規則裡要求必須先問過我，我同意後才會派給 `high-risk-implementer`

## 遠端入口換成 Orca：手機上看進度與按確認的細節

解決了模型交接，另一個問題是「人不在電腦前怎麼顧 terminal」

如果只是要連進 Mac mini，SSH 就夠了；但我把遠端入口換成 Orca，主要是為了在手機或外面的電腦上，能直接看 omp 目前跑到哪一步、隨時補一句指示，或是在 omp 停下來等權限時放行

像 `git push` 這類有外部影響的指令，我會讓 omp 跳出確認框（prompt），不會全開自動放行。電腦前按個鍵就過了，但在手機上透過 Orca 操作時，我踩過一個很實際的坑：

**看到確認框時，千萬不要在輸入框打 `approve` 送出。** 在 omp 的機制裡，往輸入框送文字會被當成「使用者插話（interrupt）」，結果不是同意執行，而是直接中斷並拒絕那條指令。在手機上要同意確認框，必須送出對應的快捷鍵——我目前固定按 `Ctrl+Q` 或 `Ctrl+Enter`

另外，我也規定不要為了少按一次確認，就叫模型把 `git push` 改寫成 `git -C ... push` 之類的變形來閃避規則比對。曾經不小心繞過一次，後來發現這樣等於把設好的安全欄杆拆了，寧可乖乖按快捷鍵放行

## 換完之後的體感

整套跑下來，omp 解決的是**在同一個 terminal 裡調度 Claude 跟 Codex**，Orca 解決的是**在手機上盯場跟按確認**

如果你跟我一樣，習慣先在 Mac mini 本機把規則檔（`AGENTS.md`、全域規則、subagent 角色）調好，再從外面連回來做事，把「SSH + 手寫 handoff 文件」換成這套組合，最有感的差異就是再也不用當兩個 AI 之間的傳話筒了

## 參考資料

- [Oh My Pi 官方文件](https://omp.sh/docs)
- [Oh My Pi GitHub：README（含安裝方式）](https://github.com/can1357/oh-my-pi)
- [Oh My Pi：Authoring subagents](https://omp.sh/docs/subagent-authoring)
- [Oh My Pi：Agents & model roles](https://omp.sh/docs/agents-and-roles)
- [Orca 官方網站](https://www.onorca.dev/)
- [Orca：Mobile companion](https://www.onorca.dev/docs/mobile)
- [Orca：Remote Orca Servers](https://www.onorca.dev/docs/remote-servers)
- [Anthropic：Legal and compliance](https://code.claude.com/docs/en/legal-and-compliance#authentication-and-credential-use)
