# AGENTS.md

This repository contains `onboardkit`, an instruction-only skill for keeping `AGENTS.md` and repo docs lightweight, current, and well-routed for coding agents.

## Operating Principles

1. Inspect local context before editing guidance.
2. Keep changes scoped to the user's request.
3. Prefer official vendor docs and local source over model memory for version-sensitive guidance.
4. Do not reintroduce helper code, package scripts, schemas, runners, or scaffolding.
5. Done requires fresh verification from targeted searches, syntax/format checks when available, and diff review.

## Commands

There is no project helper command or package test command.

Useful checks:

```bash
git ls-files
git diff --check
git status --short --branch
```

## Project Structure

```text
SKILL.md                   skill entrypoint
agents/openai.yaml         Codex UI metadata
evals/evals.json           behavior evaluation cases
evals/eval_queries.json    trigger boundary cases
README.md                  user-facing overview
AGENTS.md                  repository maintenance guidance
LICENSE                    license
.gitignore                 local-file exclusions
.gitattributes             Git text normalization
```

## Documentation Routing

Keep `AGENTS.md` short and operational. Put only repo purpose, critical rules, verification expectations, and safety boundaries here.

Delete or merge docs that are stale, duplicated, generated for a completed task, or narrower than future agents need.

When updating `SKILL.md`, preserve the lightweight initialization, routing, cleanup, recurring maintenance, and missing-information policy without adding helper code.

Create one-level `references/` only when necessary detail cannot be compressed into the core workflow; never use references to preserve duplicated procedure.

Keep install instructions conservative. Prefer stable shared skill locations or official runtime docs over hard-coded paths that may drift.

## Definition of Done

- Helper artifacts are not present.
- `SKILL.md`, README, and AGENTS agree on the instruction-only product boundary.
- `SKILL.md` targets 340-360 words and stays at or below 400 unless a verified scenario needs more detail.
- `SKILL.md` covers initialization, docs routing, cleanup, maintenance, and report shape.
- `SKILL.md` tells agents to fill from evidence, use universal safe defaults, avoid guessing repo-specific facts, ask when unsafe, and report Needs Input.
- `SKILL.md` preserves durable guidance before deletion, keeps one canonical destination per fact, requires a no-op when no actionable issue exists, proposes unattended deletion or promotion for review, and separates command-backed from review-backed reporting.
- Evaluation files are valid JSON and cover missing commands, README/CI conflicts, docs routing, nested AGENTS.md handling, no-op behavior, and positive and negative trigger boundaries.
- Fresh skill checks use the canonical eval cases or a documented real-repo equivalent.
- Targeted searches show no stale helper/scaffolder instructions except historical deleted-file diffs.
- The final report names commands run and any residual risk.

## Security Rules

- Do not print or persist secrets.
- Ask before adding dependencies, deleting user data, or running destructive commands.
- Prefer project-local, reproducible checks over global machine assumptions.
