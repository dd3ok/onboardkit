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
- `skills/onboardkit/SKILL.md` stays at or below 500 words and covers initialization, routing, cleanup, maintenance, and reporting. Prefer evaluated clarity over compressing a rule into a dense sentence.
- Root `SKILL.md` remains a minimal compatibility entrypoint; root and canonical frontmatter plus UI metadata stay synchronized, and bundled/root licenses match.
- The description front-loads its use cases and states adjacent tasks that must not trigger the skill; optimize it with positive and near-miss negative queries rather than isolated keywords.
- README installs `skills/onboardkit/` through the built-in skill installer. Do not reintroduce direct full-repository installs, deprecated sparse-checkout commands, or non-cone patterns.
- Audit/report requests are read-only. Explicit initialize/refresh/clean/route/delete requests discover active overrides and fallbacks, preserve active files and validated rules, never relocate fitting content for surface standardization, otherwise route by audience and scope, and create root guidance only for repo-wide rules when neither an active root source nor a fitting existing destination exists.
- Generated root `AGENTS.md` has no minimum length or fixed sections, normally stays at or below 200 words, and contains only supported commands, recurring conventions, scoped safety rules, or proven routing. Report-only, rejected, or conflicting material is never merged or generalized into rules. Setup/install requires current non-workflow policy; routing requires policy or repeated navigation evidence, never path existence/description alone.
- Facts use current evidence or explicit user factual confirmation and retain their file/subtree/audience scope. Candidate-only sources never corroborate each other. Explicit user replacements are policy; otherwise a refreshed command target is excluded from consensus only when every other applicable current source agrees. Unresolved evidence preserves canonical content; only failing generated/scaffold sentences are removed.
- Verification during documentation maintenance stays read-only: do not execute package-manager, install, build, test, lint, format, generate, migrate, release, or repository scripts unless the user explicitly requests a named command; even then, never execute a command documented as mutating files.
- Move durable guidance to its narrowest existing canonical destination before deletion. Delete only user-specified literal paths or file-matching globs; never broaden them or treat a directory alone as approval. Clean audits are no-ops.
- Reports name changes, merged or deleted docs and destinations, placement decisions, conflicts, checks, skips, Needs Input, and risks; command-backed and review-backed findings stay separate.
- Static CI validates packaging, metadata, safe paths, eval structure, and stale forbidden patterns. It does not treat exact prose as proof of model behavior.
- Evaluation JSON/fixtures cover initialization/refresh, stale-target consensus, canonical-file/audience routing, actionable no-op, generated scaffold cleanup, active overrides, scoped/deleted evidence, user authority, invoked-skill exclusion without hiding repo-owned skills, conflicting commands, mutating-command exclusion, positive alternatives, provenance leakage, cleanup/no-op, and trigger boundaries.
- Fresh releases compare the candidate with the previous released baseline in independent clean contexts. Run each critical behavior and trigger query three times when the client permits, test the skill alone and beside adjacent skills, and record client/model/date, pass evidence, tokens, duration, and raw outputs outside the repository. Use a separate `CODEX_HOME` per concurrent run; avoid empty targets containing only the skill; count implicit invocation only when skill selection precedes ordinary repository exploration. Review failures for a general cause before changing prose; do not add a rule that only memorizes one fixture.

## Security Rules

- Do not print or persist secrets.
- Ask before adding dependencies, deleting user data, or running destructive commands.
- Use project-local, reproducible checks over global assumptions.
