---
name: onboardkit
description: "Maintain AGENTS.md and agent-facing repo docs: initialize, audit, clean, or route missing, generated, stale, duplicate, or conflicting guidance."
---

# onboardkit

Never add helpers, scripts, schemas, or target-repo skills.

Leave unrelated docs unchanged.

## Output Contract

Target guidance: supported commands, recurring conventions, scoped safety rules, or proven routing only.

Keep summaries, descriptive facts/paths, workflow-only setup steps, missing commands, uncertainty, and conflicts in the report, never as instructions. Never enrich rules from descriptive docs. Example: README says notes live under `notes/`; omit that fact from `AGENTS.md`.

Treat scaffolds, examples/templates/samples, history, deleted content, and descriptive docs as candidates, not policy regardless of wording. Imperatives need current policy or an explicit user rule. Never restore deleted content.

Without a target or passing candidate, create nothing. On refresh, remove failing sentences; leave the file empty unless deletion is authorized.

## Workflow

1. Inventory active instructions/overrides/fallbacks, docs, manifests/locks/CI/config; exclude globals, the ignored/external invoked copy, and vendored/generated trees.
2. Evaluate every target sentence:
   - **Evidence:** Require current policy or an explicit user rule; preserve modality/scope. Commands must agree across current sources.
   - **Value:** Keep stable, non-obvious guidance that prevents repeated mistakes, feedback, or wasted exploration. Safety may qualify independently; place narrow rules near their scope.
3. Create root `AGENTS.md` only when no active root source exists and at least one candidate passes both gates.
4. Use no minimum or fixed sections; prefer bullets and stay under 200 words.
5. Preserve fallback/override/nested scopes. Flatten or delete only with user-directed path-level removal or relocation.
6. Route detail to a fitting doc; keep README human-first. Before approved deletion, move durable guidance to its narrowest destination.
7. Delete only user-named literal paths or file-matching globs. Never broaden approval; directories are insufficient.

## Verification

Verification is read-only. Unless the user explicitly requests a named command, do not run package managers or install/build/test/lint/format/generate/migrate/release/repository scripts; even then, never run a command described as generating or mutating files.

Inspect manifests and CI; use searches, parsers, edited-doc format checks, `git diff --check`, and status. Report skipped commands. Never create then clean verification artifacts.

## Maintenance

Re-run after merges, releases, repeated feedback/mistakes, or audits; clean audits are no-ops. Keep unapproved deletion candidates and report destinations.

## Report

Report sources, guidance changes, routing, conflicts, commands identified but not run, checks, skips, Needs Input, and risks. Mark unresolved conflicts as Needs Input. Separate command evidence from review evidence. Protect secrets.
