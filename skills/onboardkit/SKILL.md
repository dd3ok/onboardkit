---
name: onboardkit
description: "Use only for requested initialization, refresh, audit, trimming, reconciliation, or routing of AGENTS.md and durable coding-agent guidance using current repository evidence. Do not use for Codex /init, other built-in commands, or translation-only edits."
---

# onboardkit

Never add target-repo helpers, scripts, schemas, or skills. Leave unrelated docs unchanged.

## Decision Model

1. **Mode:** Audit/report and explanation requests are read-only. Edit only when the user explicitly asks to change guidance or delete paths/file-matching globs: initialize, refresh, clean, or route.
2. **Evidence:** Require current, undisputed evidence for an operational fact, or current policy/a deliberate user rule for an imperative. Preserve modality/audience/scope. User factual confirmation establishes only its scoped fact.
3. **Authority:** Treat scaffolds, examples, history, deletions, and descriptive docs as candidates, not policy. Candidate-only sources cannot corroborate each other into rules or routing. Never restore deleted content.
4. **Value:** Keep stable, non-obvious guidance preventing recurring mistakes or waste. Safety qualifies independently. Setup/install needs current non-workflow policy. Routing needs policy or repeated navigation evidence; paths/descriptions alone are insufficient.
5. **Placement:** Keep passing content in its fitting canonical file; otherwise use the narrowest existing destination matching audience/scope. Create root `AGENTS.md` only for repo-wide passing guidance when no active root source or fitting destination exists.
6. **Projection:** Write only passing supported commands, recurring conventions, scoped safety rules, or proven routing to targets. Keep descriptive facts/paths, evidence, rationale, provenance, rejected material, uncertainty, missing commands, and conflicts report-only; never merge/generalize them into rules.

Treat refresh, trimming, and reconciliation alike. After removing failing sentences, add passing scoped replacements. For command replacements, exclude the target and require other applicable current sources to agree. Honor explicit user replacements. Otherwise preserve canonical content, report Needs Input, and remove only failing generated/scaffold sentences.

## Workflow

1. Inventory active instructions/overrides/fallbacks, nested scopes, relevant docs, manifests/locks/CI/configuration. Exclude globals, the ignored/external invoked copy, and vendored/generated trees.
2. Apply the decision model sentence by sentence. Do not relocate fitting content merely to standardize surfaces.
3. Give generated root guidance no fixed sections or minimum length; prefer bullets and normally stay under 200 words. On refresh, retain an existing scaffold emptied by cleanup unless deletion is authorized. On initialization, create nothing unless guidance passes.
4. Preserve fallback, override, and nested scopes. Flatten or delete only with user-directed path-level removal or relocation.
5. Before deletion, move durable guidance to its destination. Delete only user-named literal paths or file-matching globs; never broaden approval or treat a directory alone as approval.

## Verification

Keep verification read-only. Do not run package managers or project-defined install, build, test, lint, format, generate, migrate, release, or other scripts unless the user explicitly names the command; never run a command documented as mutating files.

Use searches, parsers, format checks, `git diff --check`, and status. Never create verification artifacts.

## Report

Report sources, changes, routing, conflicts, unrun commands, checks, skips, Needs Input, and risks. Separate command-backed from review-backed findings and protect secrets.

## Maintenance

Re-run after merges/releases/repeated mistakes/audits. Clean audits are no-ops; keep unapproved deletion candidates and report destinations.
