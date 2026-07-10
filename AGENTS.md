# AGENTS.md

This repository contains `onboardkit`, an instruction-only skill for keeping `AGENTS.md` and repo docs lightweight, current, and well-routed for coding agents.

## Operating Principles

1. Inspect local context and scope edits to the request.
2. Prefer local source and official vendor docs over memory for version-sensitive guidance.
3. Never add helper code, package scripts, schemas, runners, or scaffolding.
4. Verify with targeted searches, available syntax/format checks, and diff review.

## Commands

There is no project helper command or package test command.

Useful checks:

```bash
git ls-files
git diff --check
git status --short --branch
```

## Documentation Routing

Keep `AGENTS.md` to repo purpose, critical rules, verification, and safety.

Delete or merge stale, duplicate, completed-task, or overly narrow docs after preserving durable guidance canonically.

`SKILL.md` updates must preserve initialization, routing, cleanup, maintenance, and missing-information policy without helper code.

Add one-level `references/` only when essential detail cannot fit; never duplicate procedure there.

Keep install guidance conservative; prefer stable shared paths or official runtime docs.

## Definition of Done

- No helper artifacts exist; `SKILL.md`, README, AGENTS, and UI metadata agree on the instruction-only boundary.
- `SKILL.md` stays at 340-360 words and never exceeds 400 without a verified need; it covers initialization, routing, cleanup, maintenance, and reporting.
- Initialization creates missing root guidance, preserves existing files, and changes only what evidence or routing requires.
- Generated root `AGENTS.md` without nested scopes targets 200-400 words without filler and omits unsupported sections.
- Facts come from local evidence. Git history remains observation unless docs, config, CI, templates, or user confirmation corroborate a convention. Unsafe gaps require a question; others become Needs Input.
- Durable guidance has one canonical destination before deletion. Clean audits are no-ops; unattended deletion or promotion is proposed for review.
- Reports name changes, merged or deleted docs and destinations, routing, conflicts, checks, skips, Needs Input, and risks; command-backed and review-backed findings stay separate.
- Evaluation files are valid JSON and cover create/refresh behavior, sparse evidence, history conflicts, conditional sections, docs routing, cleanup, no-op behavior, and positive and negative trigger boundaries.
- Fresh checks use canonical evals or a documented real-repo equivalent, search for stale helper guidance, validate syntax/format, and review the diff; the final report lists commands and residual risk.

## Security Rules

- Do not print or persist secrets.
- Ask before adding dependencies, deleting user data, or running destructive commands.
- Prefer project-local, reproducible checks over global machine assumptions.
