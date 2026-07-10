---
name: onboardkit
description: "Use for AGENTS.md and agent-facing repo documentation maintenance: initialization, cleanup, or routing when guidance is missing, bloated, stale, duplicate, or conflicting. Do not use for unrelated product, API, or feature docs."
---

# onboardkit

Keep context grounded. Never add helper code, scripts, schemas, or target-repo skills.

## Workflow

1. Inventory repo-owned `AGENTS.md`, README, and docs, including new files; skip vendored/generated trees.
2. Inspect manifests, lockfiles, CI, config, and nested scopes.
3. Create root `AGENTS.md` if missing; otherwise preserve it; change only what evidence or routing requires.
4. Without nested scopes, target 200-400 words; write less with sparse evidence and exceed only for verified constraints.
5. Use evidenced purpose, structure, commands, conventions, safety/checks, routing, and examples; omit empty or unsupported sections.
6. Before merging or removing stale, duplicate, or task-complete docs, preserve durable guidance in one canonical place.
7. Route below; verify with repo commands, searches, and diff review.

## Evidence

- Ground facts locally; cite sources/runs. Record commands or `not identified`.
- Never invent tools, owners, release steps, migrations, generated-file rules, or approvals.
- Treat Git history as observation, not policy; promote corroborated conventions from docs, config, CI, templates, or user confirmation.
- Protect secrets; ask before destructive work or safety/correctness gaps; otherwise report Needs Input.
- Report conflicts as `conflicting sources; Needs Input` until the user decides. Never alter manifests or CI to align docs.

## Routing

- Root `AGENTS.md` keeps stable, broadly needed facts and rules.
- Preserve nested overrides; delete or flatten only when the user discards or relocates active rules.
- Move durable long, narrow, historical, or domain-specific material to `docs/`.
- Keep README onboarding, installation, and product overview current.
- Create `docs/README.md` only when docs need a map; never create empty stubs.
- Promote only shared invariants, repeated mistakes or feedback, and verified failures; exclude handoffs, session notes, plans, and one-offs.

## Maintenance

Re-run after merges, releases, errors, or audits. If clean, change nothing; report a no-op. When unattended, propose deletion or promotion for review; prefer references over copies.

## Report

Report changes, merged/deleted docs and destinations, routing, conflicts, checks, skips, Needs Input, and risks; separate command results from review findings.
