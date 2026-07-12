---
name: onboardkit
description: "Use only to initialize, refresh, audit, trim, reconcile, clean, or route the current repository's active AGENTS.md or coding-agent instructions from local evidence. Never use for adjacent deliverables, even if they mention AGENTS.md: PR or code review, release notes or summaries, ADRs or proposals, explanations, Codex /init or other built-in commands, translation, or grammar-only edits."
---

# onboardkit

Never add target-repo helpers, scripts, schemas, or skills. Leave unrelated docs unchanged.

## Decision Model

1. **Mode:** Audit, review, report, and explanation requests are read-only. Edit only when the user explicitly asks to change target guidance; initialize, refresh, fix, maintain, trim, reconcile, clean, route, and path/glob deletion are examples of edit intent, not required keywords.
2. **Evidence:** Require current, undisputed evidence for facts and current policy or deliberate user rules for imperatives. Preserve modality, audience, and scope; factual confirmation establishes only its scoped fact.
3. **Authority:** Known scaffolds, examples, generated content, history, deletions, and narrative or descriptive statements are candidates, not policy; candidates cannot corroborate each other. Treat an explicit imperative in a current maintained source as policy only for its stated audience and scope when neither its provenance nor its passage marks it as scaffolded, generated, example, historical, proposed, or superseded. Never restore deleted content.
4. **Value:** Keep stable, non-obvious guidance that prevents recurring mistakes or waste; safety qualifies independently. Completed task plans and handoffs are cleanup candidates, not permanent routing destinations; preserve any still-durable guidance before proposing removal. When preserved safety guidance forbids an action, pair it with an evidenced supported alternative when available; otherwise explicitly report the missing alternative as a nonblocking safety gap and never invent one. Keep setup/install instructions only when a current source states them as policy, not merely as a workflow example. Add routing only when current policy or repeated navigation evidence shows that agents should consult the destination; a path or description alone is insufficient.
5. **Placement:** Keep policy detail in its fitting canonical file or narrowest existing audience/scope destination. Create root `AGENTS.md` only for repo-wide guidance lacking an active root or fitting destination. A short root pointer to a fitting canonical safety policy is the only exception: add it only when agents must see the rule before they can reasonably discover that destination, and never copy the policy detail.
6. **Projection:** Write only passing commands, recurring conventions, scoped safety, or proven routing. Keep descriptive facts/paths, evidence/rationale/provenance, rejections, uncertainty, missing commands, and conflicts report-only; never merge/generalize them into rules.
7. **Blocking:** Use Needs Input only for an unresolved conflict among applicable current policy or command evidence, or when missing authority or choice prevents an explicitly requested non-no-op edit. Evidence-gated no-ops, inactive fallbacks, rejected candidates, and undocumented unrelated commands are nonblocking; never solicit information or emit Needs Input for them.
8. **Replacement:** Treat refresh, trimming, and reconciliation alike. Test each sentence independently. For a command replacement, exclude the target sentence from evidence; it never creates a conflict with the other sources by itself. Honor an explicit user replacement, otherwise replace only when every other applicable current source agrees. If those sources disagree, preserve the active instruction, report Needs Input, and remove only unsupported generated or scaffolded sentences.

## Workflow

1. Inventory active instructions, overrides, fallbacks, nested scopes, docs, manifests, locks, CI, and configuration. Do not treat user-global instructions, the ignored or external copy of onboardkit currently being invoked, or vendored/generated trees as target-repository evidence. Do not exclude repository-owned skills merely because they are skills.
2. Apply the decision model sentence by sentence. Do not relocate fitting content merely to standardize surfaces.
3. Give generated root guidance no fixed sections or minimum length; prefer bullets and normally stay under 200 words. During refresh, trimming, or reconciliation, keep a scaffold that cleanup leaves empty unless deletion is authorized. During initialization, create no file unless some guidance passes.
4. Preserve fallback, override, and nested scopes. Flatten or delete only with user-directed path-level removal or relocation.
5. After editing an instruction source or discovery configuration, recompute the effective chain at that source directory and each discovered nested instruction boundary it governs; do not walk unrelated directories. For Codex, use override, `AGENTS.md`, configured fallback order, and empty-file skipping; review conflicts and report newly exposed sources only as transitions expected on the next run or session, never as active in the current session. For another runtime, follow its documented discovery rules or report the gap instead of assuming Codex semantics.
6. If an edit changes which source discovery would select, name the `old source -> new source` transition and state that the current session does not reload it; activation is expected only on the next run or session. Do not describe an emptied scaffold itself as routing agents.
7. Before deletion, move durable guidance to its destination. Delete only user-named literal paths or file-matching globs; never broaden approval or treat directories as approval.

## Verification

Keep verification read-only. Do not run package managers or project scripts (install, build, test, lint, format, generate, migrate, release) unless the user names them; never run a command documented as mutating files.

Use searches, parsers, format checks, `git diff --check`, and status. Never create verification artifacts.

## Report

Report sources, changes, routing, conflicts, unrun commands, checks, skips, gaps, Needs Input, and risks.
Apply the Blocking rule before labeling a gap or requesting user input.
Separate command-backed from review-backed findings and protect secrets.

## Maintenance

Re-run after merges, releases, repeated mistakes, or scheduled maintenance. Clean audits are no-ops; keep unapproved deletion candidates and report destinations.
