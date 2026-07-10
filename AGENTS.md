# AGENTS.md

This repository contains `onboardkit`, an instruction-only skill for keeping `AGENTS.md` and repo docs lightweight, current, and well-routed for coding agents.

## Operating Principles

1. Inspect local context and scope edits to the request.
2. Use local source and official vendor docs for version-sensitive guidance.
3. Never add user-facing helpers, package scripts, schemas, runners, or scaffolding; repository-only validation CI is allowed.
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

Keep `AGENTS.md` to purpose, critical rules, verification, and safety.

Delete or merge stale or duplicate docs after preserving durable guidance.

`SKILL.md` updates preserve initialization, routing, cleanup, maintenance, and missing-information policy without helper code.

Add one-level `references/` only for essential detail; never duplicate procedure there.

Use stable shared skill paths or official runtime docs.

## Definition of Done

- No user-facing helper artifacts; `SKILL.md`, README, AGENTS, and UI metadata share the instruction-only boundary.
- `SKILL.md` stays at or below 400 words and covers initialization, routing, cleanup, maintenance, and reporting.
- Initialization discovers active overrides and fallbacks, creates root guidance only when none exists, preserves active files and rules, and changes only what evidence or routing requires.
- Generated root `AGENTS.md` without nested instructions targets 200-400 words without filler and omits unsupported sections.
- Facts use local evidence. Product/API docs stay unchanged except routing references. Git history needs corroboration from docs, config, CI, templates, or user confirmation.
- Move durable guidance to its narrowest existing canonical destination before deletion. Delete only user-specified literal paths or file-matching globs; never broaden them or treat a directory alone as approval. Clean audits are no-ops.
- Reports name changes, merged or deleted docs and destinations, routing, conflicts, checks, skips, Needs Input, and risks; command-backed and review-backed findings stay separate.
- Evaluation JSON/fixtures cover initialization/refresh, active overrides, scope/deletion, sparse/conflicting evidence, provenance leakage, routing-default transparency, cleanup/no-op, and trigger boundaries.
- Fresh releases compare isolated fixture runs against baseline, search stale helper guidance, validate syntax/format, review the diff, and report commands/residual risk.

## Security Rules

- Do not print or persist secrets.
- Ask before adding dependencies, deleting user data, or running destructive commands.
- Use project-local, reproducible checks over global assumptions.
