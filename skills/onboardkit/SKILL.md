---
name: onboardkit
description: "Maintain AGENTS.md and agent-facing repo docs: initialize, audit, clean, or route missing, generated, stale, duplicate, or conflicting guidance."
---

# onboardkit

Never add helpers, scripts, schemas, or target-repo skills. Verification is read-only: do not install dependencies or create config/artifacts; run project commands only with existing dependencies and read-only behavior.

## Workflow

1. Inventory active instructions/overrides/fallbacks, docs, manifests/locks/CI/config; exclude globals, ignored/external invoked copy, and vendored/generated trees.
2. Preserve only passing guidance. Create root `AGENTS.md` only when no active root source exists and at least one durable candidate passes evidence and value gates.
3. Use no minimum or fixed sections. Prefer bullet points, keeping the total under 200 words; report missing commands only.
4. Before approved deletion, move durable detail to its narrowest destination; verify searches, commands, diff.

## Scope

Leave unrelated docs unchanged.

Delete only user-named literal paths or globs. Never broaden approval; directories are insufficient.

## Gates

- **Evidence:** Trace each sentence, including existing guidance, to current evidence, active guidance, or explicit user facts/rules; preserve modality/scope.
- State facts declaratively. Imperatives need explicit policy and scope.
- Generated/scaffolded guidance, examples/templates/samples, and unconfirmed claims are observations regardless of wording; policy requires independent evidence or user rule-setting. Confirmation yields a fact.
- Missing/deleted content and Git history remain uncorroborated observations. Do not restore deleted content; report Needs Input.
- Require current command sources; never change manifests/CI to fit docs.
- **Value:** Keep stable, non-obvious guidance that prevents recurring wrong action or wasted exploration. Safety qualifies independently; place narrower rules nearer their scope.
- Do not copy discoverable README/tree, tool/version, framework, or runner facts without non-default-action or recurring-error evidence; prefer pointers. Pair prohibitions with evidenced alternatives; otherwise report Needs Input.
- If nothing passes both gates, create nothing; report the evidence gap, commands `not identified`, and Needs Input.
- Protect secrets; ask only when safety/correctness/destructive scope blocks.

## Routing

- Root `AGENTS.md`: recurring commands, routing, verification, conventions, safety; exclude handoffs, plans, one-offs, README summaries.
- Preserve overrides/nested rules; delete/flatten only with user-directed removal/relocation.
- Route narrow material to a fitting doc without broadening it.
- Keep README human-first: purpose, audience, quickstart, usage, help. Create `docs/README.md` only to map multiple durable docs.

## Maintenance

Re-run after merges/releases/feedback/mistakes/audits; clean audits are no-ops. Keep unapproved deletions; report destinations.

## Report

Report sources/runs, changes, placement, moved/deleted docs, routing, conflicts, checks, skips, Needs Input, risks; separate command/review evidence.
