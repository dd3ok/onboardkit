---
name: onboardkit
description: "Use for AGENTS.md and agent-facing repo documentation maintenance: initialization, cleanup, or routing when guidance is missing, bloated, stale, duplicate, or conflicting. Do not use for unrelated product, API, or feature docs."
---

# onboardkit

Ground guidance locally. Never add helper code, scripts, schemas, or target-repo skills.

## Workflow

1. Inventory repo `AGENTS.md`, `AGENTS.override.md`, configured fallbacks, README, and agent-facing docs, including new files; never edit global instructions; skip vendored/generated trees.
2. Inspect manifests, lockfiles, CI, config, and nested scopes.
3. Create root `AGENTS.md` only when no root instruction or active fallback exists; otherwise preserve active guidance and change only what evidence or routing requires.
4. Without nested instructions, target 200-400 words; write less with sparse evidence and exceed only for verified constraints.
5. Use evidenced purpose, structure, commands, conventions, safety/checks, routing, and examples; omit empty or unsupported sections.
6. Before authorized merge/removal, preserve durable guidance in its narrowest canonical place; never promote narrow details.
7. Route below; verify with repo commands, searches, and diff review.

## Scope

Unless the user explicitly names them, leave unrelated product/API docs unchanged except for routing references.

Delete only when the request says delete/remove and names every file or an exact file pattern; a directory alone is insufficient. Otherwise keep candidates and report required approval.

## Evidence

- Ground facts locally; cite sources/runs. Record commands or `not identified`.
- Never invent tools, owners, release steps, migrations, generated-file rules, or approvals.
- Treat Git history as observation, not policy; promote corroborated conventions from docs, config, CI, templates, or user confirmation.
- Protect secrets; ask about safety/correctness gaps or destructive work outside named approval; report remaining gaps as Needs Input.
- Treat active instructions as evidence; missing corroboration alone does not invalidate them. Replace them only with stronger local evidence; otherwise report conflicting sources and Needs Input. Never alter manifests or CI to align docs.

## Routing

- Root `AGENTS.md` keeps stable, broadly needed facts and rules.
- Preserve active overrides and nested rules; delete or flatten only when the user discards or relocates them.
- Move durable long, narrow, historical, or domain-specific material to `docs/`.
- Keep README onboarding and installation current; retain fitting content unless routing requires relocation.
- Create `docs/README.md` only when docs need a map; never create empty stubs.
- Promote only shared invariants, repeated mistakes or feedback, and verified failures; exclude handoffs, session notes, plans, and one-offs.

## Maintenance

Re-run after merges, releases, repeated mistakes, feedback, or audits. If clean, change nothing; report a no-op. Without explicit file-deletion approval, propose candidates for review; prefer references over copies.

## Report

Report changes, merged/deleted docs and destinations, routing, conflicts, checks, skips, Needs Input, and risks; separate command-backed and review-backed findings.
