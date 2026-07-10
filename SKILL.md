---
name: onboardkit
description: "Maintain AGENTS.md and agent-facing repo docs: initialize, clean up, or route missing, bloated, stale, duplicate, or conflicting guidance. Not for unrelated product/API/feature docs."
---

# onboardkit

Use repo evidence. Never add helper code, scripts, schemas, or target-repo skills.

## Workflow

1. Inventory repo instructions, README overview/agent sections, agent docs, new files, and active runtime fallbacks; never edit global instructions; skip vendored/generated trees.
2. Inspect manifests, locks, CI, config, and nested scopes.
3. Create root `AGENTS.md` only when no existing nonempty root override, `AGENTS.md`, or configured fallback is active; otherwise preserve guidance and make only evidenced/routing changes.
4. Without nested instructions, target 200-400 words; less with sparse evidence, more only for verified constraints.
5. Include evidenced purpose, structure, commands, conventions, checks, and routing; omit empty/unsupported sections.
6. Before merges or approved deletion, preserve durable content in its narrowest canonical destination.
7. Verify with repo commands, searches, and diff.

## Scope

Leave unrelated product/API docs unchanged except explicit edits or routing references.

Delete only when the user says delete/remove and gives each literal path or file-matching glob. Never broaden it or treat directories as approval; otherwise retain candidates and request approval.

## Evidence

- For project commands, cite source/run or report `not identified`.
- Never invent tools, owners, release/migration steps, generated rules, or approvals.
- Git history is observation; require corroboration from docs, config, CI, templates, or the user.
- Protect secrets. Ask only when unresolved safety/correctness gaps or destructive scope block safe progress; otherwise continue and report Needs Input.
- Active instructions are evidence; replace only with stronger local evidence and report conflicts as Needs Input. Never change manifests/CI to fit docs.

## Routing

- Keep stable, broadly needed root `AGENTS.md` rules: shared invariants, repeated mistakes/feedback, and verified failures. Exclude handoffs, session notes, plans, and one-offs.
- Preserve active overrides/nested rules; delete or flatten only when the user discards or relocates them.
- Route durable long/narrow/historical/domain material to its narrowest canonical doc.
- Keep fitting README onboarding/install content current and in place. Create `docs/README.md` only for a needed map, never an empty stub.

## Maintenance

Re-run after merges, releases, feedback, repeated mistakes, or audits. Clean audits are no-ops. Retain unapproved deletion candidates; reference rather than copy.

## Report

Report changes, merged/deleted docs and destinations, routing, conflicts, checks, skips, Needs Input, and risks; distinguish command from review evidence.
