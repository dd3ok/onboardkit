---
name: onboardkit
description: "Maintain AGENTS.md and agent-facing repo docs: initialize, clean up, or route missing, bloated, stale, duplicate, or conflicting guidance. Not for unrelated product/API/feature docs."
---

# onboardkit

Never add helpers/scripts/schemas or target-repo skills.

## Workflow

1. Inventory repo instructions, README overview/agent sections, agent docs, new files, fallbacks, manifests, locks, CI/config, and scopes; never edit global instructions; skip vendored/generated trees.
2. Create root `AGENTS.md` only if no nonempty root override, `AGENTS.md`, or configured fallback is active; otherwise preserve guidance and make only evidenced/routing changes.
3. With no nested instructions, target 200-400 words; use less for sparse evidence, more only for verified constraints.
4. Classify candidates through the Evidence Gate, route, and draft; omit empty/unsupported sections.
5. Preserve durable content in its narrowest canonical destination before merge/approved deletion; verify with repo commands, searches, and diff.

## Scope

Leave unrelated product/API docs unchanged except explicit edits/routing references.

Delete only when user says delete/remove and specifies each literal path or file-matching glob. Never broaden it or treat a directory as approval; otherwise retain candidates and request approval.

## Evidence Gate

- Classify repo facts/rules as local evidence, active guidance, explicit user rules, routing defaults, or skill workflow.
- Use workflow only for this run, never as target guidance. Write the first three classes. Allow only necessary low-risk guidance-placement defaults for explicit initialize/reroute requests; exclude verification/process rules and report additions.
- Trace every drafted fact/rule to its class; remove unsupported content or report Needs Input. Never infer repo policy from convention.
- Require local sources for project commands; note runs or report `not identified`.
- Corroborate Git history; treat active instructions as evidence. Never change manifests/CI to fit docs.
- Protect secrets. Ask when unresolved safety/correctness or destructive scope blocks safe progress; otherwise continue and report Needs Input.

## Routing

- Keep root `AGENTS.md` to stable broad rules: shared invariants, repeated mistakes/feedback, verified failures. Exclude handoffs, session notes, plans, one-offs.
- Preserve overrides/nested rules; delete/flatten only when user discards/relocates them.
- Route durable narrow/historical/domain material to its canonical doc.
- Keep fitting README onboarding/install in place and current. Create `docs/README.md` only for needed mapping, never an empty stub.

## Maintenance

Re-run after merges, releases, feedback, mistakes, or audits; make clean audits no-ops; retain unapproved deletion candidates and reference, never copy.

## Report

Report sources/runs, changes, introduced defaults, merged/deleted docs/destinations, routing, conflicts, checks, skips, Needs Input, and risks; distinguish command from review evidence.
