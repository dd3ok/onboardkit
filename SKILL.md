---
name: onboardkit
description: "Maintain AGENTS.md and agent-facing repo docs: initialize, clean up, or route missing, bloated, stale, duplicate, or conflicting guidance. Not for unrelated product/API/feature docs."
---

# onboardkit

Never add helpers/scripts/schemas or target-repo skills.

## Workflow

1. Inventory instructions, README/docs, fallbacks, manifests/locks/CI/config, and scopes; leave global instructions; exclude installed/injected invoked-skill copies and vendored/generated trees.
2. Create root `AGENTS.md` only without active root instruction/fallback; otherwise preserve active guidance.
3. Without nested instructions, target 200-400 words; shorten with sparse evidence; omit unsupported sections.
4. Run proposed target sentences through the Evidence Gate.
5. Preserve durable content in narrowest current destination before approved deletion; verify searches, commands, diff.

## Scope

Leave unrelated docs unchanged except explicit edits/routing.

Delete only with delete/remove and literal paths or file-matching globs. Never broaden them; directories are insufficient. Otherwise retain candidates and request approval.

## Evidence Gate

- Ledger every target sentence with source class (evidence, active guidance, user fact, user rule, or workflow/placement), fact/rule modality, and file/subtree/audience scope.
- Write facts declaratively. Imperatives require explicit imperative/policy sources and retain source scope.
- Examples/templates/samples are observations, never policy/routing destinations unless current policy/user corroborates. User claims remain observations; explicit factual confirmation creates a user fact, deliberate rule-setting a user rule.
- Keep workflow/placement in run/report; initialize/reroute permits structure, not policy. Without sources, exclude generic routing, verification, future-state, scope, or command-discovery rules.
- Missing/deleted worktree content and Git history are observations until current files/users corroborate. Preserve deletions; report uncertainty as Needs Input.
- Require current sources for project commands; note runs or report `not identified`. Never change manifests/CI to fit docs.
- Reject ledger failures. With no publishable sentences, create nothing and report Needs Input.
- Protect secrets. Ask only when safety/correctness or destructive scope blocks progress; otherwise continue and report Needs Input.

## Routing

- Keep root `AGENTS.md` to broad rules; exclude handoffs, notes, plans, one-offs.
- Preserve overrides/nested rules; delete/flatten only when user discards/relocates them.
- Route durable narrow/domain material to an existing fitting doc without broadening its scope.
- Keep fitting README onboarding/install in place. Create `docs/README.md` only when multiple current durable docs need mapping; list existing destinations, never only itself or `AGENTS.md`.

## Maintenance

Re-run after merges/releases/feedback/mistakes/audits; make clean audits no-ops; retain unapproved deletion candidates and reference, never copy.

## Report

Report sources/runs, changes, placement decisions, merged/deleted docs and destinations, routing, conflicts, checks, skips, Needs Input, risks; separate command from review evidence.
