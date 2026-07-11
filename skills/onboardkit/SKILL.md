---
name: onboardkit
description: "Use only for requested initialization, refresh, audit, trimming, reconciliation, or routing of AGENTS.md and durable coding-agent guidance using current repository evidence. Do not use for Codex /init, other built-in commands, or translation-only edits."
---

# onboardkit

Never add target-repo helpers, scripts, schemas, or skills. Leave unrelated docs unchanged.

## Decision Model

1. **Mode:** Audit, report, and explanation requests are read-only. Edit only on explicit initialize, refresh, clean, route, or path/glob deletion requests.
2. **Evidence:** Require current, undisputed evidence for facts and current policy or deliberate user rules for imperatives. Preserve modality, audience, and scope; factual confirmation establishes only its scoped fact.
3. **Authority:** Scaffolds, examples, history, deletions, and descriptive docs are candidates, not policy; they cannot corroborate each other into rules/routing. Never restore deleted content.
4. **Value:** Keep stable, non-obvious guidance preventing recurring mistakes or waste. Safety qualifies independently. Setup/install requires current non-workflow policy; routing requires policy or repeated navigation evidence, not paths/descriptions alone.
5. **Placement:** Keep content in its fitting canonical file or narrowest existing audience/scope destination. Create root `AGENTS.md` only for repo-wide guidance lacking an active root or fitting destination.
6. **Projection:** Write only passing commands, recurring conventions, scoped safety, or proven routing. Keep descriptive facts/paths, evidence/rationale/provenance, rejections, uncertainty, missing commands, and conflicts report-only; never merge/generalize them into rules.

Treat refresh, trimming, and reconciliation alike: remove failures and add passing scoped replacements. Command replacements exclude the target and require agreement across all other applicable current sources. Honor explicit user replacements; otherwise preserve canonical content, report Needs Input, and remove only failing generated/scaffold sentences.

## Workflow

1. Inventory active instructions/overrides/fallbacks, nested scopes, docs, manifests/locks/CI/configuration. Exclude globals, the ignored/external invoked copy, and vendored/generated trees.
2. Apply the decision model sentence by sentence. Do not relocate fitting content merely to standardize surfaces.
3. Give generated root guidance no fixed sections or minimum length; prefer bullets and normally stay under 200 words. On refresh, retain a scaffold emptied by cleanup unless deletion is authorized. On initialization, create nothing unless guidance passes.
4. Preserve fallback, override, and nested scopes. Flatten or delete only with user-directed path-level removal or relocation.
5. Before deletion, move durable guidance to its destination. Delete only user-named literal paths or file-matching globs; never broaden approval or treat directories as approval.

## Verification

Keep verification read-only. Do not run package managers or project scripts (install, build, test, lint, format, generate, migrate, release) unless the user names them; never run a command documented as mutating files.

Use searches, parsers, format checks, `git diff --check`, and status. Never create verification artifacts.

## Report

Report sources, changes, routing, conflicts, unrun commands, checks, skips, Needs Input, and risks. Separate command-backed from review-backed findings and protect secrets.

## Maintenance

Re-run after merges/releases/repeated mistakes/audits. Clean audits are no-ops; keep unapproved deletion candidates and report destinations.
