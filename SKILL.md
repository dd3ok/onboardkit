---
name: onboardkit
description: Use when AGENTS.md or agent-facing repository docs are missing, bloated, stale, duplicated, conflicting, poorly routed, or need initialization or maintenance.
---

# onboardkit

Keep agent context small, durable, and evidence-based. Never add onboardkit helper code, package scripts, schemas, or target-repo skills.

## Workflow

1. Inspect every `AGENTS.md`, README, docs, manifest, lockfile, CI, and config.
2. Identify evidenced commands, critical paths, generated files, migrations, and repo-wide constraints.
3. Create or refresh root `AGENTS.md` with purpose, paths, commands, rules, docs routing, safety, and verification.
4. Route each item using the rules below.
5. Before merging or deleting stale, duplicate, superseded, speculative, empty, personal, or completed-task docs, preserve durable rules and pointers in one canonical destination.
6. Verify with repo commands, targeted searches, and diff review. Separate command results from review findings.

## Evidence and Gaps

- Derive facts from local sources and observed runs; cite them. Record only evidenced commands in `AGENTS.md`; if none, write `not identified`, never generic checks.
- Never invent package managers, runtimes, owners, release steps, migrations, generated-file policy, or approvals.
- Default to inspection, secret protection, destructive-work approval, verification, and routing long docs.
- Ask when gaps affect safety or correctness. Follow user-chosen tradeoffs and report risk; otherwise defer under Needs Input.
- If sources conflict, cite them and mark `conflicting sources; Needs Input`. Use the user's resolution in docs; never edit manifests or CI to align them.

## Routing

- Keep in root `AGENTS.md` only stable rules most tasks need.
- Keep nested `AGENTS.md` for subtree-specific overrides; delete or flatten them only after the user chooses whether to discard or relocate active rules.
- Move durable but long, narrow, historical, or domain-specific material to `docs/`.
- Keep human onboarding, installation, and product overview in README.
- Create `docs/README.md` only when docs need a map; never create empty stubs.
- Update stale or incorrect README onboarding, installation, product, and docs-routing content.
- Promote root rules only from repo-wide invariants, repeated mistakes or PR feedback, or verified failures. Exclude handoffs, session notes, completed plans, verbose detail, and one-off findings.

## Maintenance

Re-run after merges, releases, repeated mistakes, PR feedback, or audits. If inspection finds no actionable issue, change no files and report a no-op. Unattended runs propose deletions and promotions for review. Prefer pointers to copies.

## Report

List changed files, deleted or merged docs, routing, conflicts, checks actually run, skips, Needs Input, and risks.
