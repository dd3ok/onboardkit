---
name: onboardkit
description: "Maintain AGENTS.md and agent-facing repo docs: initialize, clean up, or route missing, bloated, stale, duplicate, or conflicting guidance. Not for unrelated product/API/feature docs."
---

# onboardkit

Never add helpers/scripts/schemas or target-repo skills.

## Workflow

1. Inventory scoped instructions, docs, fallbacks, manifests/locks/CI/config; leave globals; exclude ignored/external skill copies and vendored/generated trees.
2. Create root `AGENTS.md` only if no active root instruction/fallback exists; otherwise preserve active guidance.
3. Without nested instructions, target 200-400 words; shorten when evidence is sparse; omit unsupported sections.
4. Run target sentences through the Evidence Gate.
5. Preserve durable content in narrowest current destination before approved deletion; verify searches, commands, diff.

## Scope

Leave unrelated docs unchanged except explicit edits/routing.

Delete only when the user says delete/remove and specifies literal paths or file-matching globs. Never broaden them; directories are insufficient. Otherwise retain candidates and ask approval.

## Evidence Gate

- Internally trace each target sentence to current evidence, active guidance, user fact/rule, or workflow/placement; track modality and file/subtree/audience scope. Never create a ledger file.
- Write facts declaratively. Imperatives require explicit rule/policy sources and retain source scope.
- Examples/templates/samples and unconfirmed user claims are observations, not policy or routing destinations. Explicit factual confirmation creates a user fact; deliberate rule-setting creates a user rule.
- Keep workflow/placement in run/report; initialization/rerouting permits structure, not policy. Without sources, exclude routing, verification, future-state, scope, or command-discovery rules.
- Missing/deleted worktree content and Git history remain observations without current file/user corroboration. Preserve deletions; report uncertainty as Needs Input.
- Require current sources for commands; report runs or `not identified`. Never change manifests/CI to fit docs.
- Reject untraceable sentences. If none remain, create nothing; report Needs Input.
- Protect secrets. Ask only if safety/correctness or destructive scope blocks; otherwise continue, reporting Needs Input.

## Routing

- Keep root `AGENTS.md` broad; exclude handoffs, session notes, plans, one-offs.
- Preserve overrides/nested rules; delete/flatten only with user-directed removal/relocation.
- Route durable narrow/domain material to a fitting existing doc without broadening scope.
- Keep fitting README onboarding/install in place. Create `docs/README.md` only when multiple current durable docs need mapping; list existing destinations, never only itself or `AGENTS.md`.

## Maintenance

Re-run after merges/releases/feedback/mistakes/audits; clean audits are no-ops. Retain unapproved deletion candidates; report canonical destinations instead of copying content.

## Report

Report sources/runs, changes, placement decisions, merged/deleted docs and destinations, routing, conflicts, checks, skips, Needs Input, risks; separate command from review evidence.
