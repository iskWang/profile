---
schema: blog-post
lang: en
title: "Jumping Between AI Agents: How Everyone Uses the Orca CLI Too"
date: 2026-11-27
summary: Letting a main agent spawn worktrees and tabs via the orca CLI isn't tool-specific magic—here is how it works across Claude Code, Codex, and Antigravity, plus community patterns
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
  <img src="/blog/assets/agent-orchestration-with-orca-cli/agent-jumping-meme.webp" alt="Hail the Judge meme with Traditional Chinese caption reading: I like jumping AI agents back and forth, what about it?" width="1200" height="741" loading="eager" decoding="async" />
  <figcaption>"I like jumping AI agents back and forth, what about it?" (AI-generated meme)</figcaption>
</figure>

## A simple question: how is the main agent controlling Orca?

In [[omp-orca-mac-mini-notes|Replacing hand-written handoffs with Oh My Pi and Orca for remote coding]], I wrote about using [Orca](https://www.onorca.dev/) to monitor sessions and approve commands remotely. Since then, my workflow went one step further: instead of opening tabs, creating branches, and pasting prompts myself, I let a coordinator agent (usually Antigravity / agy) spin up an isolated Git worktree, open Orca terminal tabs, and dispatch implementation and independent code review to `omp-agent` workers

Once that started feeling routine, two questions came up:

1. What "magic" is the coordinator agent actually using to drive Orca?
2. Could Claude Code, Codex, or another Antigravity session do the exact same thing?

Once you look under the hood, it turns out to be refreshingly plain—and very close to where the wider developer community has converged for parallel coding agents

## Only two pieces under the hood: a CLI remote and plain-text manuals

The coordinator agent is not using a private API or vendor-locked IDE integration. It relies on two basic building blocks:

1. **The `orca` CLI**
   Orca ships with a command-line binary (on macOS, `/Applications/Orca.app/Contents/Resources/bin/orca`). It acts like a remote control for Orca. Any agent allowed to run shell commands can call `orca` to create an isolated Git worktree, open a terminal tab, launch a worker with a specific model and prompt, read terminal output, or close tabs once a ticket is done
2. **Skills and rules (`SKILL.md` + `AGENTS.md`)**
   A remote control alone does not tell an agent when to press which button. My setup layers a few Markdown manuals on top:
   - `orca-cli` skill: how to manage worktrees, terminal tabs, and Orca's embedded browser
   - `orchestration` skill: how to dispatch tasks to worker agents and collect results
   - Global dispatch rules in `AGENTS.md`: personal guardrails such as using a dedicated agent account, separating implementation and review models, and capping each ticket at two tabs so tabs do not pile up

Put together, the loop looks like this:

```text
Coordinator Agent (Antigravity / Claude Code / Codex)
   │ Reads Skills + AGENTS.md, runs `orca` CLI commands in shell
   ▼
Orca Runtime (local workbench)
   ├─ Worktree A + Tab 1: Implementation Worker (e.g. Claude Sonnet)
   └─ Worktree B + Tab 2: Independent Reviewer (e.g. GPT / Codex)
```

Using a CLI as the control plane and Markdown skills as the playbook has one huge upside: **the coordinator itself is completely swappable**

## Can Claude Code, Codex, or another Antigravity do this?

**Yes—all of them.** Any tool that can run local shell commands and read the skill instructions can orchestrate Orca the exact same way:

- **Another Antigravity session**: works out of the box since it reads the same global config and skills
- **Claude Code**: works out of the box once `orca-cli` and `orchestration` are linked into `~/.claude/skills/` (symlinking from a shared `~/.agents/skills/` avoids duplicate copies)
- **Codex**: works as well, since Codex reads skills from `~/.agents/skills/` natively

There is one practical snag to watch out for when switching tools: **sandbox permissions**

If an agent runs inside a strict sandbox (such as Codex's default sandbox), calling `orca` to talk to the local Orca runtime can fail with `runtime_access_denied`. That does not mean `orca` is broken—the sandbox simply blocked the local IPC connection. Granting host command execution for that call fixes it right away

## Checking the community: is everyone else doing this too?

Looking around at how developers run multiple coding agents in parallel today, the ecosystem has largely converged on the same core pattern: **Git worktrees for filesystem isolation + a terminal or workbench layer for orchestration**

The reason is straightforward. Running two agents inside the same checkout causes immediate collisions: one edits source files while another runs tests or package installs, corrupting working state. Using [Git worktrees](https://git-scm.com/docs/git-worktree) gives each task its own directory and branch while sharing one `.git` object store, and it has become the standard foundation for parallel agent work

On top of that shared primitive, community tools generally fall into three camps:

| Approach | Examples | How it works | Best fit |
| --- | --- | --- | --- |
| **Agent Development Environment (Worktree + Orchestration)** | **Orca**, **Superset (Paradev)** | Provisions a worktree per task, manages multiple CLI agent tabs, adds diff review, and exposes a CLI so agents can dispatch to each other | Developers who want native CLI agents (Claude Code, Codex, omp) without manually juggling branches and terminals |
| **Chat-first desktop app** | **Conductor** | Maps each task to a worktree and branch inside a chat-oriented UI with inline diffs and PR tracking | Developers who prefer a GUI-driven task and PR lifecycle in one window |
| **Terminal-first multiplexers** | **cmux**, **tmux** (with Claude Squad or custom scripts) | Treats the terminal as the core primitive, combining panes, socket APIs, and shell scripts around `git worktree` | Keyboard-first workflows, minimal framework lock-in, or remote headless servers |

Even individual agents like Claude Code now ship native `--worktree` isolation flags. Overall, the pattern is moving toward a **Coordinator → parallel worktree workers → independent review and merge** pipeline

## Common gotchas when running parallel agents

Even with good tooling, running multiple agents at once hits the same operational bottlenecks across almost every setup:

- **Local port collisions**: if Agent A and Agent B both spin up a dev server on `localhost:3000`, one will crash. The usual fix is assigning per-worktree `PORT` overrides via environment variables or relying on a workbench that tracks ports automatically
- **Package manager lockfile and cache contention**: running `npm install`, `bun install`, or `cargo build` simultaneously across worktrees can trip over shared caches unless caches are isolated or shared read-only
- **Tab sprawl and overlapping file edits**: if two agents touch the same core file (like a router or database schema), you still pay the merge-conflict tax later. Keeping each ticket to at most two reused tabs (implement + review), closing tabs when cards move to Done, and slicing tasks into non-overlapping modules upfront saves a lot of friction
- **Worktrees do not isolate credentials or external state**: Git worktrees isolate files and branches, not `.env` secrets, SSH keys, GitHub identities, or remote databases. Keeping a dedicated agent identity (`omp-agent`) and requiring human approval for irreversible actions like push, merge, and deploy remains essential

## Takeaway

Going back to the original question, the best part of this setup is that it is not tied to any single AI tool

The durable pieces are not proprietary plugins—they are **a standard CLI surface (`orca` + `git worktree`)** and **plain-text playbooks (`SKILL.md` + `AGENTS.md`)**. If I decide to switch the coordinator from Antigravity to Claude Code, Codex, or whatever CLI agent comes next, the same orchestration workflow keeps running with almost no rewiring

## References

- [Orca](https://www.onorca.dev/)
- [Oh My Pi Documentation](https://omp.sh/docs)
- [Git Documentation: git-worktree](https://git-scm.com/docs/git-worktree)
- [[omp-orca-mac-mini-notes|Replacing hand-written handoffs with Oh My Pi and Orca for remote coding]]
- [DEV.to: Orca Explained — The Agent Development Environment for Running AI Coding Agents in Parallel](https://dev.to/arshtechpro/orca-explained-the-agent-development-environment-for-running-ai-coding-agents-in-parallel-440n)
- [Alex Lavaee: Parallel Agent Sessions & the Infrastructure Gap](https://alexlavaee.me/blog/parallel-agent-sessions-infrastructure-gap/)
- [Reddit r/ClaudeCode: My thoughts on Conductor vs Superset vs cmux](https://www.reddit.com/r/ClaudeCode/comments/1rxwkoz/my_thoughts_on_conductor_vs_superset_vs_cmux_vs/)
