# AGENTS.md

This repository contains `onboardkit`, an instruction-only skill for keeping `AGENTS.md` and repo docs lightweight, current, and well-routed for coding agents. The canonical runtime lives at `skills/onboardkit/`; root skill files are legacy compatibility shims.

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

Keep `AGENTS.md` to recurring actionable commands, routing, verification, conventions, and safety. Project summaries stay in README/docs unless they change agent behavior.

Delete or merge stale or duplicate docs after preserving durable guidance.

`skills/onboardkit/SKILL.md` updates preserve initialization, routing, cleanup, maintenance, and missing-information policy without helper code.

Add one-level `references/` only for essential detail; never duplicate procedure there.

Use stable shared skill paths or official runtime docs.

## Definition of Done

- Canonical runtime contains only `SKILL.md`, `LICENSE`, `agents/openai.yaml`, and essential one-level `references/`; repository docs, CI, and evals stay outside it.
- `skills/onboardkit/SKILL.md` stays at or below 400 words and covers initialization, routing, cleanup, maintenance, and reporting.
- Root `SKILL.md` remains a minimal compatibility entrypoint; root and canonical frontmatter plus UI metadata stay synchronized, and bundled/root licenses match.
- README installs `skills/onboardkit/` through the built-in skill installer. Do not reintroduce direct full-repository installs, deprecated sparse-checkout commands, or non-cone patterns.
- Initialization discovers active overrides and fallbacks, preserves active files and validated rules, and creates root guidance only when no active root source exists and at least one durable candidate passes evidence and value gates.
- Generated root `AGENTS.md` has no minimum length or fixed sections, normally stays at or below 200 words, and contains only supported commands, recurring conventions, scoped safety rules, or proven routing. Evidence summaries, descriptive paths, missing commands, uncertainty, and conflicts belong only in the report.
- Facts use current evidence or explicit user factual confirmation and retain their file/subtree/audience scope. Deleted content, Git history, examples, templates, and samples remain observations unless corroborated; only explicit policy or deliberate user rule-setting makes them rules.
- Verification during documentation maintenance stays read-only: do not execute package-manager, install, build, test, lint, format, generate, migrate, release, or repository scripts unless the user explicitly requests a named command; even then, never execute a command documented as mutating files.
- Move durable guidance to its narrowest existing canonical destination before deletion. Delete only user-specified literal paths or file-matching globs; never broaden them or treat a directory alone as approval. Clean audits are no-ops.
- Reports name changes, merged or deleted docs and destinations, placement decisions, conflicts, checks, skips, Needs Input, and risks; command-backed and review-backed findings stay separate.
- Evaluation JSON/fixtures cover initialization/refresh, actionable no-op, generated scaffold cleanup, active overrides, scoped/deleted evidence, user authority, invoked-skill exclusion without hiding repo-owned skills, conflicting command sources, mutating-command exclusion, positive alternatives, provenance leakage, placement-decision transparency, cleanup/no-op, and trigger boundaries.
- Fresh releases run critical no-op, descriptive-path, conflict, and mutating-command scenarios at least twice in independent fresh contexts; compare artifacts, search stale guidance, validate syntax/format, review the diff, and report residual risk.

## Security Rules

- Do not print or persist secrets.
- Ask before adding dependencies, deleting user data, or running destructive commands.
- Use project-local, reproducible checks over global assumptions.
