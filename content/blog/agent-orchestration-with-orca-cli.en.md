---
schema: blog-post
lang: en
title: "I Like Making AI Agents Jump Around — Orchestrating Agents with Orca CLI"
date: 2026-11-27
summary: Using the Orca CLI and Markdown skills decouples the coordinator from worker agents across Antigravity, Claude Code, and Codex—plus rule-loading quirks, similar tools, and gotchas
topics:
  - orca
  - ai-coding
  - multi-agent
  - worktree
  - cli
origin: original
translation: machine-assisted
---

<figure class="post-figure">
  <img src="/blog/assets/agent-orchestration-with-orca-cli/agent-jumping-meme.webp" alt="Hail the Judge meme with Traditional Chinese caption reading: I like having AI agents jump back and forth, what about it?" width="1200" height="741" loading="eager" decoding="async" />
  <figcaption>"I like having AI agents jump back and forth, what about it?" (AI-generated meme)</figcaption>
</figure>

## A simple question: how is the main agent controlling Orca?

In [[omp-orca-mac-mini-notes|Replacing hand-written handoffs with Oh My Pi and Orca for remote coding]], I wrote about using [Orca](https://orca.dev/) to monitor sessions and approve commands remotely. Since then, my workflow went one step further: instead of opening tabs, creating branches, and pasting prompts myself, I let a coordinator agent (usually Antigravity / agy) spin up an isolated Git worktree, open Orca terminal tabs, and dispatch implementation and independent code review to `omp-agent` workers

Once that started feeling routine, two questions came up:

1. What "magic" is the coordinator agent actually using to drive Orca?
2. Could Claude Code, Codex, or another Antigravity session do the exact same thing?

Once you look under the hood, it turns out to be refreshingly plain—and it lets me treat different AI tools as swappable components in the same workflow

## Only two pieces under the hood: a CLI remote and plain-text manuals

The coordinator agent is not using a private API or vendor-locked IDE integration. It relies on two basic building blocks:

1. **The `orca` CLI**
   Orca ships with a command-line binary (on macOS, `/Applications/Orca.app/Contents/Resources/bin/orca`). It acts like a remote control for Orca. Any agent allowed to run shell commands can call `orca` to create an isolated Git worktree, open a terminal tab, launch a worker with a specific model and prompt, read terminal output, or close tabs once a ticket is done
2. **Skills and rules (`SKILL.md` + rule files)**
   A remote control alone does not tell an agent when to press which button. My setup layers a few Markdown manuals on top:
   - `orca-cli` skill: how to manage worktrees, terminal tabs, and Orca's embedded browser
   - `orchestration` skill: how to dispatch tasks to worker agents and collect results
   - Global dispatch rules (`AGENTS.md`): personal guardrails such as using a dedicated agent account, separating implementation and review models, and capping each ticket at two tabs so tabs do not pile up

In practice, my layout uses **one worktree per ticket and two terminal tabs inside that same worktree** (so the reviewer sees the latest changes directly without syncing uncommitted code across worktrees), while separate tickets run in parallel in separate worktrees:

```text
Coordinator Agent (Antigravity / Claude Code / Codex)
   │ Reads Skills + rule files, runs `orca` CLI commands in shell
   ▼
Orca Runtime (local workbench)
   ├─ Ticket #1 Worktree
   │    ├─ Tab 1: Implementation Worker (e.g. Claude Sonnet)
   │    └─ Tab 2: Independent Reviewer (e.g. GPT / Codex)
   └─ Ticket #2 Worktree (parallel across tickets, isolated files)
```

Using a CLI as the control plane and Markdown skills as the playbook has one huge upside: **the coordinator and the workers are decoupled and can be swapped independently**

## Can Claude Code, Codex, or another Antigravity do this?

**Yes—though it is not completely zero-config.**

The `orca` CLI and `SKILL.md` guides can be shared across tools, but **each agent harness still handles rule loading and permissions differently**:

- **Another Antigravity session**: works out of the box since it reads the same global rules and skills
- **Claude Code**: linking `orca-cli` and `orchestration` into `~/.claude/skills/` (via symlinks to a shared `~/.agents/skills/`) lets it drive `orca`, but Claude Code defaults to reading `CLAUDE.md`—so reusing dispatch rules from `AGENTS.md` requires importing or syncing them separately
- **Codex**: reads `~/.agents/skills/` and `AGENTS.md` natively, but runs inside a stricter default sandbox

Sandbox permissions are the most common snag when switching tools. If an agent runs inside a strict sandbox, calling `orca` to reach the local Orca runtime can fail with `runtime_access_denied`. That does not mean `orca` is broken—the sandbox simply blocked the local IPC connection. **Granting host permission for the specific `orca` command is enough; you do not need to disable the sandbox globally**

## What actually matters: treating AI tools as swappable components

After using this setup for a while, the real win is not Orca itself—it is **not being locked into one AI tool for everything**

In day-to-day work, I choose the coordinator based on practical constraints:

- **Token quota**: if my Gemini quota just reset, I can use Antigravity with Gemini as the coordinator to slice tasks and monitor progress, while still dispatching implementation and review underneath to Claude or Codex
- **Model strengths and harness UX**: different tools feel better for planning, long context, or code review, and decoupling them lets me mix and match

To be clear, this is not a "fire and forget" autonomous factory. I am still sitting right next to it—steering, stepping in when something drifts, and approving high-risk actions. What changed is that the tedious glue work of creating branches, juggling terminals, and copying context around is now handled by whichever coordinator I pick

## Looking around: several tools are solving the same problem

Checking how other recent multi-agent tools approach this, many of them land on a similar foundation: **[Git worktrees](https://git-scm.com/docs/git-worktree) to keep task directories and branches apart, with a terminal or workbench layer on top for tabs and review**

The reason is straightforward. Running two agents inside the same checkout causes immediate collisions: one edits source files while another runs tests, corrupting working state. Worktrees give each task its own folder without cloning the whole repository repeatedly

Tools in this space roughly fall into three camps:

| Approach | Examples | How it works | Best fit |
| --- | --- | --- | --- |
| **Agent Development Environment (Worktree + Orchestration)** | **Orca**, **Paradev (formerly Superset)** | Provisions a worktree per task, manages multiple CLI agent tabs, adds diff review, and exposes a CLI so agents can dispatch to each other | Developers who want native CLI agents (Claude Code, Codex, omp) without manually juggling branches and terminals |
| **Chat-first desktop app** | **Conductor** | Maps each task to a worktree and branch inside a chat-oriented UI with inline diffs and PR tracking | Developers who prefer a GUI-driven task and PR lifecycle in one window |
| **Terminal-first multiplexers** | **cmux**, **tmux** (with Claude Squad or custom scripts) | Treats the terminal as the core primitive, combining panes, socket APIs, and shell scripts around `git worktree` | Keyboard-first workflows, lightweight setups, or remote headless servers |

Even single-agent CLIs like Claude Code now ship built-in `--worktree` flags. That does not mean every developer needs five agents running at once, but if you work on multiple tickets in parallel or separate implementation from review, these approaches are worth a look

## Common gotchas when running parallel agents

Even with good tooling, running multiple agents at once still hits a few practical bottlenecks:

- **Local port collisions**: if Agent A and Agent B both spin up a dev server on `localhost:3000`, one will crash. The usual fix is assigning per-worktree `PORT` overrides via environment variables or relying on a workbench that tracks ports automatically
- **Package manager lockfile and cache contention**: running installs or builds across worktrees at the same time can occasionally contend on shared caches depending on each package manager's concurrency behavior, so you may need isolated cache settings or shared read-only dependencies
- **Tab sprawl and overlapping file edits**: if two tickets touch the same core file (like a router or database schema), you still pay the merge-conflict tax later. Keeping each ticket to at most two reused tabs (implement + review), closing tabs when cards move to Done, and slicing tasks into non-overlapping modules upfront saves a lot of friction
- **Separate your Git / GitHub account**: Git worktrees isolate files and branches, **not security boundaries**—underlying Git refs, some repo config, accounts, `.env` secrets, and cloud environments are still shared. I used to let agents share my personal GitHub account, but once multiple agents are jumping across branches, opening PRs, and leaving review comments, it becomes hard to tell what the human did versus what the AI did. Splitting out a dedicated GitHub account for agents (with its own SSH key and `gh` token via a wrapper) keeps the audit trail clean, while still requiring human approval for irreversible actions like push, merge, and deploy

## Takeaway

Going back to the original question, the best part of this setup is portability: the core relies on **a standard CLI surface (`orca` + `git worktree`)** and **plain-text playbooks (`SKILL.md` + rule files)**

Switching harnesses still requires wiring up each tool's rule-loading and sandbox permissions, but the dispatch workflow itself does not need to be rewritten. Whether I want Gemini coordinating today or Claude Code or Codex taking over tomorrow, the pipeline keeps running

## References

- [Orca](https://orca.dev/)
- [Orca Documentation](https://orca.dev/docs)
- [Oh My Pi Documentation](https://omp.sh/docs)
- [Claude Code Documentation: Memory and CLAUDE.md](https://code.claude.com/docs/en/memory)
- [Git Documentation: git-worktree](https://git-scm.com/docs/git-worktree)
- [[omp-orca-mac-mini-notes|Replacing hand-written handoffs with Oh My Pi and Orca for remote coding]]
- [DEV.to: Orca Explained — The Agent Development Environment for Running AI Coding Agents in Parallel](https://dev.to/arshtechpro/orca-explained-the-agent-development-environment-for-running-ai-coding-agents-in-parallel-440n)
- [Alex Lavaee: Parallel Agent Sessions & the Infrastructure Gap](https://alexlavaee.me/blog/parallel-agent-sessions-infrastructure-gap/)
- [Reddit r/ClaudeCode: My thoughts on Conductor vs Superset vs cmux](https://www.reddit.com/r/ClaudeCode/comments/1rxwkoz/my_thoughts_on_conductor_vs_superset_vs_cmux_vs/)
