---
schema: blog-post
lang: zh
title: 跟著我的 AI 助理跳來跳去：大家也是這樣用 Orca CLI
date: 2026-11-27
summary: 讓主 agent 透過 orca CLI 幫其他 subagent 開 worktree、開分頁並派工，背後其實不是某個工具的專屬魔法；順手查了一圈社群做法，整理這套模式怎麼跨 Claude Code、Codex 跟 Antigravity 共用，以及常見的坑
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

之前在[[omp-orca-mac-mini-notes|不用再手寫 handoff 文件：我怎麼用 Oh My Pi 跟 Orca 遠端寫程式]]裡，我記錄了怎麼把 [Orca](https://www.onorca.dev/) 當成遠端盯場跟按確認的入口。後來工作流又往前推了一步：我不再自己手動開分頁、切分支、貼 prompt，而是直接請主 agent（目前常用 Antigravity / agy）幫我開獨立的 Git worktree、叫出 Orca terminal 分頁，再把實作跟獨立 code review 派給底下的 `omp-agent`

用順了之後突然想到兩個問題：

1. 主 agent 到底是用了什麼「魔法」在管 Orca？
2. 如果今天把指揮官換成 Claude Code、Codex，或是另一個 Antigravity session，一樣做得到嗎？

拆開來看之後發現，背後其實非常樸素，而且這套做法早就變成現在平行跑多個 coding agent 的主流模式了

## 背後其實只有兩樣東西：CLI 遙控器 + 操作手冊

主 agent 能操控 Orca，靠的不是什麼隱藏 API 或某家 IDE 的專屬整合，而是兩件很單純的事：

1. **`orca` 指令工具（CLI）**
   Orca 桌面版直接內建了命令列工具（macOS 上在 `/Applications/Orca.app/Contents/Resources/bin/orca`）。它就像 Orca 的遙控器，只要 agent 有權限跑 shell 指令，就能透過 `orca` 建立隔離的 Git worktree、開 terminal 分頁、把指定模型和 prompt 送進去、讀取終端機輸出，或是任務結束後把分頁關掉
2. **操作手冊（Skills 與 Rules）**
   光有遙控器，agent 還是不知道什麼時候該按哪顆鍵。我的機器上掛了幾份說明檔：
   - `orca-cli` skill：教 agent 怎麼用 `orca` 管 worktree、分頁和內嵌瀏覽器
   - `orchestration` skill：教 agent 怎麼把工作派給其他 worker、等待結果並回收
   - `AGENTS.md` 裡的全域派工規則：寫清楚我的個人習慣，例如一律用獨立的 agent 帳號、實作跟審查分不同模型、每張票最多開兩個分頁避免越積越多

整個流程串起來大概長這樣：

```text
主 Agent（Antigravity / Claude Code / Codex）
   │ 讀 Skill + AGENTS.md，在終端機執行 orca CLI
   ▼
Orca Runtime（本機工作台）
   ├─ Worktree A + Tab 1：實作 Worker（例如 Claude Sonnet）
   └─ Worktree B + Tab 2：獨立審查 Worker（例如 GPT / Codex）
```

這種「用 CLI 當介面、用 Markdown skill 當說明書」的設計有一個很大的好處：**指揮官本身完全可替換**

## Claude Code、Codex 或另一個 Antigravity 可以做到嗎？

**全部都可以。** 只要那個工具能執行本機終端機指令，又讀得到對應的 skill，就能用同一套方式指揮 Orca：

- **另一個 Antigravity**：直接就能用，因為會讀同一份全域設定跟 skill
- **Claude Code**：直接就能用，只要把 `orca-cli` 與 `orchestration` 的 skill 掛進 `~/.claude/skills/`（透過 symlink 指到共用的 `~/.agents/skills/` 就不用維護多份）
- **Codex**：一樣可以，Codex 原生會讀 `~/.agents/skills/` 裡的說明書

不過實際切換工具時，有一個很常見的小坑：**沙盒權限**

如果 agent 跑在比較嚴格的 sandbox 環境裡（例如 Codex 預設的隔離沙盒），執行 `orca` 指令去連本機的 Orca runtime 時，可能會直接撞到 `runtime_access_denied`。這不是 `orca` 壞掉，而是沙盒擋住了本機 IPC 連線，只要對該指令放行本機權限就能恢復正常

## 查了一圈社群：大家也都在這樣做嗎？

順手查了一下最近開發者社群怎麼同時跑多個 coding agent，發現大家的收斂方向幾乎一模一樣：**Git worktree 當底層隔離 + 終端機/工作台做編排**

原因很現實：只要同時在同一個資料夾裡跑兩個 agent，一個改程式、一個跑測試或裝套件，檔案很快就會互相覆蓋、Git 狀態直接亂掉。用 [Git worktree](https://git-scm.com/docs/git-worktree) 幫每個任務切出獨立的目錄與分支，共享同一份 `.git` 歷史但不互相踩檔案，已經變成多 agent 開發的基本盤

在這個底層共識之上，社群目前大致分化出幾種主流工具路線：

| 路線 | 代表工具 | 核心做法 | 適合誰 |
| --- | --- | --- | --- |
| **ADE 工作台（Worktree + Orchestration）** | **Orca**、**Superset（Paradev）** | 自動幫每個任務建 worktree、管理多個 CLI agent 分頁、提供 diff review 介面，並附帶 CLI 讓 agent 彼此派工 | 想保留原生 CLI 能力（Claude Code、Codex、omp），又不想手動管一堆分支跟終端機的人 |
| **Chat 導向的桌面 App** | **Conductor** | 每個任務自動對應一個 worktree 與分支，介面偏向對話框與 PR 流程管理 | 偏好圖形化介面、想把 diff 與 CI 檢查收在同一個視窗的人 |
| **終端機優先（Terminal-First）** | **cmux**、**tmux**（搭配 Claude Squad 或自寫腳本） | 把終端機多工當成核心，靠 socket API 或 shell script 自己組 worktree 與分格畫面 | 習慣全鍵盤操作、追求極致效能或常在遠端伺服器跑流程的人 |

另外，像 Claude Code 本身也已經內建 `--worktree` 這類隔離選項，生態系整體都在往「**主線 Coordinator 拆任務 → 子 Agent 在各自 worktree 平行實作 → 獨立 Reviewer 檢查後合併**」的結構靠攏

## 實際跑平行 Agent 時最常踩的幾個坑

工具再順手，把多個 agent 同時放出去跑還是會遇到幾個共通的工程問題，社群討論裡幾乎每次都會提到：

- **本機 Port 撞車**：Agent A 跟 Agent B 同時在各自的 worktree 啟動開發伺服器（例如都搶 `localhost:3000`），其中一個就會起不來。解法通常是在每個 worktree 透過環境變數分配不同 port，或交給支援 port 偵測的工作台處理
- **套件快取與鎖檔互搶**：同時在多個 worktree 跑 `npm install`、`bun install` 或 `cargo build`，偶爾會互相卡住共用快取，需要設定隔離快取或透過工具共享唯讀依賴
- **分頁越開越多、任務切得不夠乾淨**：如果兩個 agent 同時改到同一個核心檔案（例如路由設定或資料庫 schema），最後合併一樣會解衝突解到懷疑人生。我的做法是在規則裡限制每張票最多兩個分頁（實作 + 審查），修改跟複審直接沿用既有分頁，任務進 Done 就順手關掉，同時一開始就讓主 agent 把修改範圍切開
- **Git / GitHub 帳號記得切開**：Git worktree 只隔離檔案跟分支，不會幫你隔離帳號、`.env` 密鑰或雲端環境。以前我也是讓 agent 直接沿用本尊的 GitHub 帳號，但只要多個 agent 在不同分支跳來跳去、開 PR、留 review，回頭看紀錄根本分不清哪筆是人寫的、哪筆是 AI 動的手。後來乾脆獨立出一個專門給 agent 用的 GitHub 帳號（透過 wrapper 切開 SSH key 跟 `gh` token），本尊跟 AI 的動作一拆開，追蹤紀錄清楚很多，高風險指令（例如 push、merge、deploy）也照樣保留人工確認點

## 結語

回頭看一開始的問題，其實挺讓人放心的：我現在這套「主 agent 透過 Orca 管 subagent」的流程，並沒有被綁死在任何單一 AI 工具上

核心資產不是某個會過期的插件，而是兩件很可攜的東西——**標準的 CLI 介面（`orca` + `git worktree`）**，以及**寫成純文字的規則與工作手冊（`SKILL.md` + `AGENTS.md`）**。之後哪天想把主控台從 Antigravity 換成 Claude Code、Codex，或是任何下一個順手的 CLI agent，只要把說明書掛上去、權限開好，整套派工流水線馬上就能接手繼續跑

## 參考資料

- [Orca 官方網站](https://www.onorca.dev/)
- [Oh My Pi 官方文件](https://omp.sh/docs)
- [Git 官方文件：git-worktree](https://git-scm.com/docs/git-worktree)
- [[omp-orca-mac-mini-notes|不用再手寫 handoff 文件：我怎麼用 Oh My Pi 跟 Orca 遠端寫程式]]
- [DEV.to：Orca Explained — The Agent Development Environment for Running AI Coding Agents in Parallel](https://dev.to/arshtechpro/orca-explained-the-agent-development-environment-for-running-ai-coding-agents-in-parallel-440n)
- [Alex Lavaee：Parallel Agent Sessions & the Infrastructure Gap](https://alexlavaee.me/blog/parallel-agent-sessions-infrastructure-gap/)
- [Reddit r/ClaudeCode：My thoughts on Conductor vs Superset vs cmux](https://www.reddit.com/r/ClaudeCode/comments/1rxwkoz/my_thoughts_on_conductor_vs_superset_vs_cmux_vs/)
