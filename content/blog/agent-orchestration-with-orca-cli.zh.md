---
schema: blog-post
lang: zh
title: 我喜歡叫 AI Agent 跳來跳去，怎麼樣？
date: 2026-11-27
summary: 透過 Orca CLI 與 Markdown Skills，把指揮者跟實作者拆開，讓 Antigravity、Claude Code、Codex 都能接手同一套工作流；順手記錄跨工具載入規則的差異、幾款類似工具的做法，以及實戰踩過的坑
topics:
  - orca
  - ai-coding
  - multi-agent
  - worktree
  - cli
origin: original
---

<figure class="post-figure">
  <img src="/blog/assets/agent-orchestration-with-orca-cli/agent-jumping-meme.webp" alt="九品芝麻官梗圖，字幕寫著：我喜歡叫 AI Agent 跳來跳去，怎麼樣？" width="1200" height="741" loading="eager" decoding="async" />
  <figcaption>我喜歡叫 AI Agent 跳來跳去，怎麼樣？（圖片為 AI 生成）</figcaption>
</figure>

## 一個好奇的問題：主 Agent 是靠什麼遙控 Orca 的？

之前在[[omp-orca-mac-mini-notes|不用再手寫 handoff 文件：我怎麼用 Oh My Pi 跟 Orca 遠端寫程式]]裡，我記錄了怎麼把 [Orca](https://orca.dev/) 當成遠端盯場跟按確認的入口。後來工作流又往前推了一步：我不再自己手動開分頁、切分支、貼 prompt，而是直接請主 agent（目前常用 Antigravity / agy）幫我開獨立的 Git worktree、叫出 Orca terminal 分頁，再把實作跟獨立 code review 派給底下的 `omp-agent`

用順了之後突然想到兩個問題：

1. 主 agent 到底是用了什麼「魔法」在管 Orca？
2. 如果今天把指揮官換成 Claude Code、Codex，或是另一個 Antigravity session，一樣做得到嗎？

拆開來看之後發現，背後其實非常樸素，而且這套做法讓我能把不同 AI 工具當成可替換的元件來調度

## 背後其實只有兩樣東西：CLI 遙控器 + 操作手冊

主 agent 能操控 Orca，靠的不是什麼隱藏 API 或某家 IDE 的專屬整合，而是兩件很單純的事：

1. **`orca` 指令工具（CLI）**
   Orca 桌面版直接內建了命令列工具（macOS 上在 `/Applications/Orca.app/Contents/Resources/bin/orca`）。它就像 Orca 的遙控器，只要 agent 有權限跑 shell 指令，就能透過 `orca` 建立獨立的 Git worktree、開 terminal 分頁、把指定模型和 prompt 送進去、讀取終端機輸出，或是任務結束後把分頁關掉
2. **操作手冊（Skills 與 Rules）**
   光有遙控器，agent 還是不知道什麼時候該按哪顆鍵。我的機器上掛了幾份說明檔：
   - `orca-cli` skill：教 agent 怎麼用 `orca` 管 worktree、分頁和內嵌瀏覽器
   - `orchestration` skill：教 agent 怎麼把工作派給其他 worker、等待結果並回收
   - 全域派工規則（`AGENTS.md`）：寫清楚我的個人習慣，例如一律用獨立的 agent 帳號、實作跟審查分不同模型、每張票最多開兩個分頁避免越積越多

我實際在用的結構是**跨票分 worktree，同一張票內把實作跟審查拆成兩個分頁**（這樣 reviewer 直接在同一個 worktree 裡看最新變更，不用煩惱未提交程式碼的同步問題）：

```text
主 Agent（Antigravity / Claude Code / Codex）
   │ 讀 Skills + 規則檔，在終端機執行 orca CLI
   ▼
Orca Runtime（本機工作台）
   ├─ Ticket #1 Worktree
   │    ├─ Tab 1：實作 Worker（例如 Claude Sonnet）
   │    └─ Tab 2：獨立審查 Worker（例如 GPT / Codex）
   └─ Ticket #2 Worktree（跨票平行，檔案互不干擾）
```

這種「用 CLI 當介面、用 Markdown skill 當說明書」的設計有一個很大的好處：**指揮官跟實作者解耦，可以各自替換**

## Claude Code、Codex 或另一個 Antigravity 可以做到嗎？

**都可以，但不是「掛上 skill 就完全零設定」。**

`orca` CLI 跟 `SKILL.md` 本身可以共用，不過各家 Agent Harness（外層執行框架）的**規則載入方式**跟**權限設定**還是得個別處理：

- **另一個 Antigravity**：直接就能用，共用同一份全域規則跟 skill
- **Claude Code**：把 `orca-cli` 與 `orchestration` 的 skill 掛進 `~/.claude/skills/`（用 symlink 指到共用的 `~/.agents/skills/`）就能呼叫 `orca`，但 Claude Code 預設讀的是 `CLAUDE.md`，如果想沿用 `AGENTS.md` 裡的派工規則，還需要另外設定匯入或同步
- **Codex**：原生會讀 `~/.agents/skills/` 與 `AGENTS.md`，但預設跑在比較嚴格的沙盒環境裡

講到沙盒，這是切換工具時最容易遇到的小坑：如果 agent 跑在隔離沙盒裡，執行 `orca` 去連本機 Orca runtime 時，可能會直接撞到 `runtime_access_denied`。這不是 `orca` 壞掉，而是沙盒擋住了本機 IPC 連線——**只要針對需要的 `orca` 指令單獨授權放行就好，不需要把整個沙盒關掉**

## 真正有用的點：把不同 AI 工具當成可替換元件

用了一陣子之後，我覺得這套做法最有價值的其實不是 Orca 本身，而是**我不再被綁死在單一 AI 工具裡**

實際工作上，我常會根據當下的狀況挑指揮官：

- **看剩餘 Token 額度**：例如某天 Gemini 的額度剛重置，我就讓 Antigravity 掛 Gemini 當指揮官來拆任務、盯進度，但底下真正寫程式或做 review 的 worker 還是可以照舊交給 Claude 或 Codex
- **看模型專長與操作手感**：不同工具的互動體驗、長文脈絡處理能力不太一樣，拆開之後，指揮官跟實作者可以各自挑順手的組合

另外也老實說，這不是那種「丟給 AI 就能去睡覺」的全自動流水線。我現在大部分時間還是會在旁邊看進度、隨時插話修正方向，或是在高風險步驟停下來確認——只是原本最煩的開分支、切終端、來回貼脈絡，終於可以交給主 agent 去處理

## 查了一圈：不少工具都在解類似的問題

順手查了一下最近幾款主打多 agent 開發的工具，發現它們在底層解法上走的方向很接近：**用 [Git worktree](https://git-scm.com/docs/git-worktree) 把不同任務的目錄與分支隔開，再往上疊一層終端機或工作台來管分頁與審查**

原因很現實：只要同時在同一個資料夾裡跑兩個 agent，一個改程式、一個跑測試，檔案很快就會互相覆蓋、Git 狀態亂成一團。用 Git worktree 切出獨立目錄，就能在不重複 clone 整個 repo 的情況下避免彼此踩檔案

幾款常見工具的切入點大致可以分成三類：

| 路線 | 代表工具 | 核心做法 | 適合誰 |
| --- | --- | --- | --- |
| **ADE 工作台（Worktree + Orchestration）** | **Orca**、**Paradev（原 Superset）** | 自動幫每個任務建 worktree、管理多個 CLI agent 分頁、提供 diff review 介面，並附帶 CLI 讓 agent 彼此派工 | 想保留原生 CLI 能力（Claude Code、Codex、omp），又不想手動管一堆分支跟終端機的人 |
| **Chat 導向的桌面 App** | **Conductor** | 每個任務自動對應一個 worktree 與分支，介面偏向對話框與 PR 流程管理 | 偏好圖形化介面、想把 diff 與 CI 檢查收在同一個視窗的人 |
| **終端機優先（Terminal-First）** | **cmux**、**tmux**（搭配 Claude Squad 或自寫腳本） | 把終端機多工當成核心，靠 socket API 或 shell script 自己組 worktree 與分格畫面 | 習慣全鍵盤操作、追求輕量或常在遠端伺服器跑流程的人 |

連單一工具（例如 Claude Code）也開始內建 `--worktree` 這類隔離選項。這不代表每個開發者都需要一次開五個 agent，但如果你剛好有「多張票同時推」或「實作跟審查分開跑」的需求，這幾類工具都蠻值得參考的

## 實際跑平行 Agent 時最常踩的幾個坑

工具再順手，把多個 agent 同時放出去跑還是會遇到幾個很實際的工程問題：

- **本機 Port 撞車**：Agent A 跟 Agent B 同時在各自的 worktree 啟動開發伺服器（例如都搶 `localhost:3000`），其中一個就會起不來。解法通常是在每個 worktree 透過環境變數分配不同 port，或交給支援 port 偵測的工作台處理
- **套件快取與鎖檔互搶**：同時在多個 worktree 跑安裝或編譯指令時，視套件管理工具本身的並行鎖定機制而定，偶爾還是會遇到共用快取互卡的狀況，必要時要調整快取設定或共享唯讀依賴
- **分頁越開越多、任務切得不夠乾淨**：如果兩張票同時改到同一個核心檔案（例如路由設定或資料庫 schema），最後合併一樣得解衝突。我的做法是在規則裡限制每張票最多兩個分頁（實作 + 審查），修改跟複審直接沿用既有分頁，任務進 Done 就順手關掉，同時一開始就盡量把修改範圍切開
- **Git / GitHub 帳號記得切開**：Git worktree 只是檔案與分支隔離，**並不是安全沙盒**——底層的 Git refs、部分 repo 設定，以及帳號、`.env` 密鑰與雲端環境都還是共用的。以前我也是讓 agent 直接沿用本尊的 GitHub 帳號，但只要多個 agent 在不同分支跳來跳去、開 PR、留 review，回頭看紀錄根本分不清哪筆是人寫的、哪筆是 AI 動的手。後來乾脆獨立出一個專門給 agent 用的 GitHub 帳號（透過 wrapper 切開 SSH key 跟 `gh` token），本尊跟 AI 的動作一拆開，追蹤紀錄清楚很多，高風險指令（例如 push、merge、deploy）也照樣保留人工確認點

## 結語

回頭看一開始的問題，我覺得這套做法最省心的地方在於可攜性：核心靠的是**標準的 CLI 介面（`orca` + `git worktree`）**，加上**純文字的操作手冊（`SKILL.md` + 規則檔）**

雖然換不同工具時還是得處理各自的規則載入與沙盒權限，但至少整套派工邏輯不用重寫。今天想讓 Gemini 當指揮官、明天想換 Claude Code 或 Codex 接手，把規則接好、權限放行，這套工作流就能繼續往下跑

## 參考資料

- [Orca 官方網站](https://orca.dev/)
- [Orca 官方文件](https://orca.dev/docs)
- [Oh My Pi 官方文件](https://omp.sh/docs)
- [Claude Code 官方文件：Memory 與 CLAUDE.md](https://code.claude.com/docs/en/memory)
- [Git 官方文件：git-worktree](https://git-scm.com/docs/git-worktree)
- [[omp-orca-mac-mini-notes|不用再手寫 handoff 文件：我怎麼用 Oh My Pi 跟 Orca 遠端寫程式]]
- [DEV.to：Orca Explained — The Agent Development Environment for Running AI Coding Agents in Parallel](https://dev.to/arshtechpro/orca-explained-the-agent-development-environment-for-running-ai-coding-agents-in-parallel-440n)
- [Alex Lavaee：Parallel Agent Sessions & the Infrastructure Gap](https://alexlavaee.me/blog/parallel-agent-sessions-infrastructure-gap/)
- [Reddit r/ClaudeCode：My thoughts on Conductor vs Superset vs cmux](https://www.reddit.com/r/ClaudeCode/comments/1rxwkoz/my_thoughts_on_conductor_vs_superset_vs_cmux_vs/)
