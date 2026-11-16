---
schema: blog-post
lang: en
title: Replacing hand-written handoffs with Oh My Pi and Orca for remote coding
date: 2026-10-30
summary: I used to SSH into my home Mac mini and write handoff notes when switching between Claude Code and Codex; Oh My Pi and Orca keep multi-model work and mobile approvals in one workflow
topics:
  - omp
  - orca
  - ai-coding
origin: original
translation: machine-assisted
---

<aside class="post-callout post-callout--warning">

**Warning:** Anthropic does not allow third-party tools to use login credentials from Claude subscription plans (Free, Pro, Max) to send requests, and does not allow third-party developers to collect, store, or intermediate Claude.ai credentials or session tokens. Sign-in must go through Anthropic's own flow. The official documentation is [Legal and compliance: Authentication and credential use](https://code.claude.com/docs/en/legal-and-compliance#authentication-and-credential-use). This is my personal usage log; check the terms for your own account and services before deciding whether to use it this way

</aside>

## The original problem: handing work across CLIs by hand

I often use a laptop or phone to connect back to the Mac mini at home and code

My old setup was pretty basic: SSH home as usual and run Claude Code and Codex side by side in the terminal. I like assigning different stages to different models—for example, one looks at the architecture or writes the frontend while another implements or reviews—but the two tools don't share context. Whenever work had to change hands, I had to do two things:

1. Ask the first tool to summarize the progress and context in a handoff document saved in the project
2. Switch to the other CLI, give it the document's path, and ask it to continue

Doing this once or twice was fine, but switching back and forth every day made me feel like a human message relay. What I actually needed wasn't a third CLI, but a tool that could host different models at once and keep handoffs within the same session. The answer I eventually found was [Oh My Pi](https://omp.sh/docs) (omp for short) paired with [Orca](https://www.onorca.dev/)

## Bringing multi-model handoffs into omp: separate who writes and who reviews in the config

The biggest change after switching to omp is that **I no longer have to move context around myself**. The main conversation stays in one place; when I need a model with a different specialty, I send the work to a subagent, and its result comes back to the main conversation

In omp, I can assign models to the general-purpose `task` (implementation) and `scout` (code search) roles in `config.yml` under `modelRoles`: I currently assign `task` to OpenAI Codex GPT-6 Luna, while `plan` for planning and `slow` for deeper reasoning use Claude Opus 5.5 (high)

I also keep five custom Markdown role files under `~/.omp/agent/agents/`, splitting up “reviewing the architecture,” “writing high-risk code,” “designing screens,” and “final review” across different models:

| Subagent | Responsibility | Model |
| --- | --- | --- |
| `codex-architect` | Read-only. Checks module boundaries and architectural risks before work starts; does not edit code | GPT-6 Astra (low) |
| `high-risk-implementer` | Implements high-risk changes involving public interfaces, shared state, or permissions | GPT-6 Astra (high) |
| `high-risk-implementer-sonnet` | A comparison for the previous role, used only for model A/B comparisons | Claude Sonnet 5 |
| `designer` | Frontend layout and UI changes | Claude Sonnet 5.5 |
| `claude-reviewer` | Read-only. Performs an independent code review after implementation | Claude Opus 5.5 (high) |

This split has two benefits:

- **The writer and reviewer aren't the same model**: I can send Codex's work to Claude Opus for review, or the other way around. That is much less likely to miss blind spots than asking a model to check its own work
- **High-risk changes have a clear brake point**: `task` handles ordinary small changes directly, but the rules require me to be asked first when a change touches a low-level interface or permissions. Only after I agree does the work go to `high-risk-implementer`

## Switching the remote entry point to Orca: checking progress and approving from my phone

With model handoffs sorted out, the other problem was how to keep an eye on the terminal when I'm away from the computer

SSH is enough if all I need is to connect to the Mac mini. I switched the remote entry point to Orca so I can see what omp is doing from my phone or another computer, add an instruction at any time, or approve a permission request when omp stops to wait

For commands with external effects, such as `git push`, I have omp show a confirmation prompt instead of allowing everything automatically. At the computer, I can approve it with a keypress, but I ran into a practical issue when using Orca from my phone:

**When a confirmation prompt appears, do not type `approve` into the input box and send it.** In omp, text sent to the input box is treated as a user interruption, so it interrupts and rejects the command instead of approving it. On a phone, I have to send the corresponding shortcut to approve the prompt—I currently use `Ctrl+Q` or `Ctrl+Enter`

I also have a rule against asking the model to rewrite `git push` as a variation like `git -C ... push` just to avoid pressing a confirmation key or get around rule matching. I accidentally bypassed the rule once, then realized that doing this is like taking down the safety rail I had put in place. I'd rather use the shortcut as intended

## How it feels after the switch

In this setup, omp handles **coordinating Claude and Codex in the same terminal**, while Orca handles **keeping an eye on things and approving prompts from my phone**

If, like me, you prefer to tune the rule files (`AGENTS.md`, global rules, and subagent roles) locally on the Mac mini before connecting from elsewhere, the most noticeable difference from replacing “SSH + hand-written handoff documents” with this setup is that I no longer have to relay messages between two AIs

## References

- [Oh My Pi documentation](https://omp.sh/docs)
- [Oh My Pi on GitHub: README (including installation)](https://github.com/can1357/oh-my-pi)
- [Oh My Pi: Authoring subagents](https://omp.sh/docs/subagent-authoring)
- [Oh My Pi: Agents & model roles](https://omp.sh/docs/agents-and-roles)
- [Orca official website](https://www.onorca.dev/)
- [Orca: Mobile companion](https://www.onorca.dev/docs/mobile)
- [Orca: Remote Orca Servers](https://www.onorca.dev/docs/remote-servers)
- [Anthropic: Legal and compliance](https://code.claude.com/docs/en/legal-and-compliance#authentication-and-credential-use)
