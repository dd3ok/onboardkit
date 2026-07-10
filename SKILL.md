---
name: onboardkit
description: "Use for AGENTS.md and agent-facing repo documentation maintenance: initialization, cleanup, or routing when guidance is missing, bloated, stale, duplicate, or conflicting. Do not use for unrelated product, API, or feature docs."
---

# onboardkit

Keep agent context small and grounded. Never add helper code, scripts, schemas, or target-repo skills.

## Workflow

1. Inventory repo-owned `AGENTS.md`, README, and docs, including new files; skip vendored/generated trees.
2. Inspect relevant manifests, lockfiles, CI, and config; expand for conflicts or nested scopes.
3. Identify evidenced commands, paths, generated files, migrations, and constraints.
4. Create or refresh root `AGENTS.md` with purpose, paths, commands, rules, routing, safety, and checks.
5. Before merging or removing stale, duplicate, or task-complete docs, preserve durable guidance in one canonical place.
6. Route below; verify with repo commands, searches, and diff review.

## Evidence and Gaps

- Ground facts in local sources and runs; cite them in the report. Record evidenced commands or `not identified` when absent.
- Never invent repo tools, owners, release steps, migrations, generated-file rules, or approvals.
- Inspect, protect secrets, and verify. Ask the user before destructive work or when gaps affect safety or correctness; otherwise report Needs Input.
- Keep conflicts as `conflicting sources; Needs Input` until the user decides. Cite sources; never alter manifests or CI to align docs.

## Routing

- Keep in root `AGENTS.md` only stable rules most tasks need.
- Keep nested `AGENTS.md` overrides; delete or flatten only when the user discards or relocates active rules.
- Move durable but long, narrow, historical, or domain-specific material to `docs/`.
- Keep human onboarding, installation, and product overview in README.
- Create `docs/README.md` only when docs need a map; never create empty stubs.
- Update stale README content. Promote only shared invariants, repeated mistakes or PR feedback, and verified failures. Exclude handoffs, session notes, completed plans, and one-offs.

## Maintenance

Re-run after merges, releases, repeated mistakes, feedback, or audits. If no action is needed, change no files and report a no-op. Propose unattended cleanup/promotions for review. Prefer pointers.

## Report

List changes, merged or deleted docs and destinations, routing, command results, review findings, conflicts, checks run, skips, Needs Input, risks.
