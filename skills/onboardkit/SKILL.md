---
name: onboardkit
description: "Use only to initialize, refresh, audit, trim, reconcile, clean, or route active AGENTS.md or coding-agent instructions from local evidence. Never use to review a pull request or code change, even when it changes AGENTS.md; to run the built-in Codex /init command; or for translation, grammar-only edits, release notes, summaries, ADRs, proposals, explanations, or other adjacent deliverables."
---

# onboardkit

Never add target-repo helpers, scripts, schemas, or skills. Leave unrelated docs unchanged.

## Decision Model

1. **Mode:** Audit, review, report, and explanation requests are read-only. Edit only when the user explicitly asks to change target guidance; initialize, refresh, fix, maintain, trim, reconcile, clean, route, and path/glob deletion are examples of edit intent, not required keywords. File deletion requires both explicit delete/remove intent and a user-named literal path or file-matching glob; general cleanup plus a path mention is not approval.
2. **Evidence:** Require current, undisputed evidence for facts and current policy or deliberate user rules for imperatives. Preserve modality, audience, and scope; factual confirmation establishes only its scoped fact.
3. **Authority:** Known scaffolds, examples, generated content, history, deletions, and narrative or descriptive statements are candidates, not policy; candidates cannot corroborate each other. Treat an explicit imperative in a current maintained source as policy only for its stated audience and scope when neither its provenance nor its passage marks it as scaffolded, generated, example, historical, proposed, or superseded. Never restore deleted content.
4. **Value:** Keep stable, non-obvious guidance that prevents recurring mistakes or waste; safety qualifies independently. Completed task plans and handoffs are cleanup candidates, not permanent routing destinations; preserve any still-durable guidance before proposing removal. When preserved safety guidance forbids an action, pair it with an evidenced supported alternative when available; otherwise explicitly report the missing alternative as a nonblocking safety gap and never invent one. Keep setup/install instructions only when a current source states them as policy, not merely as a workflow example. Add routing only when current policy or repeated navigation evidence shows that agents should consult the destination; a path or description alone is insufficient.
5. **Placement:** Keep valid guidance where its current audience and scope fit, even if a narrower new file could host it. Keep policy detail in its fitting canonical destination. When durable docs need a navigation map, create or update `docs/README.md`; never use `AGENTS.md` merely as a docs index. Create root `AGENTS.md` only for repo-wide guidance lacking an active root or fitting destination. The only exception is a short root pointer to a fitting canonical safety policy that agents must see before they can reasonably discover it; name the affected scope and canonical destination without copying policy detail.
6. **Projection:** Write only passing commands, recurring conventions, scoped safety, or proven routing. Keep descriptive facts/paths, evidence/rationale/provenance, rejections, uncertainty, missing commands, and conflicts report-only; never merge/generalize them into rules or turn "X lives/is under path" into "keep/put X there."
7. **Blocking:** Use Needs Input only for an unresolved conflict among applicable current policy or command evidence, or when missing authority or choice prevents an explicitly requested non-no-op edit. Evidence-gated no-ops, inactive fallbacks, rejected candidates, and undocumented unrelated commands are nonblocking; never solicit information or emit Needs Input for them.
8. **Replacement:** Treat refresh, trimming, and reconciliation alike. Test each sentence independently. For a command replacement, exclude the target sentence from evidence; it never creates a conflict with the other sources by itself. Honor an explicit user replacement, otherwise replace only when every other applicable current source agrees. If those sources disagree, leave a maintained non-scaffolded target unchanged and report Needs Input; remove only unsupported generated or scaffolded target sentences, and keep the resulting instruction file empty unless deletion is authorized.

## Workflow

1. Inventory active instructions, overrides, fallbacks, nested scopes, docs, manifests, locks, CI, and configuration. Do not treat user-global instructions, the ignored or external copy of onboardkit currently being invoked, or vendored/generated trees as target-repository evidence. Do not exclude repository-owned skills merely because they are skills.
2. Apply the decision model sentence by sentence. Before routing any safety policy, record its evidenced supported alternative or the nonblocking missing-alternative gap for the final report.
3. For initialization, first list current imperatives or deliberate user rules that pass every decision gate. If none pass, stop with a no-op and create no instruction file. Descriptions, paths, examples, missing commands, missing or empty fallbacks, and this skill's own rules never qualify alone or together.
4. Give generated root guidance no fixed sections or minimum length; prefer bullets and normally stay under 200 words. During refresh, trimming, or reconciliation, keep a scaffold that cleanup leaves empty unless deletion is authorized. Report which build, test, lint, or release commands remain undocumented.
5. Preserve fallback, override, and nested scopes. Flatten or delete only with user-directed path-level removal or relocation.
6. After editing an instruction source or discovery configuration, recompute the effective chain at that source directory and each discovered nested instruction boundary it governs; do not walk unrelated directories. For Codex, use override, `AGENTS.md`, configured fallback order, and empty-file skipping; review conflicts and report newly exposed sources only as transitions expected on the next run or session, never as active in the current session. For another runtime, follow its documented discovery rules or report the gap instead of assuming Codex semantics.
7. If an edit changes which source discovery would select, name the `old source -> new source` transition and state that the current session does not reload it; activation is expected only on the next run or session. Do not describe an emptied scaffold itself as routing agents.
8. Before deletion, preserve durable guidance and verify it in its destination as a separate completed step; only then delete. Require both explicit deletion intent and user-named literal paths or file-matching globs; never broaden approval or treat directories as approval. If deletion intent exists but no file target is authorized, report Needs Input requesting literal paths or a file-matching glob.

## Verification

Keep verification read-only. Run a package manager or project script (install, build, test, lint, format, generate, migrate, release) only when the user explicitly asks to execute that exact command. Merely mentioning a command as evidence or requesting documentation maintenance is not execution approval. Never run a command documented as mutating files.

Use searches, parsers, format checks, `git diff --check`, and status. Never create verification artifacts.

## Report

- Name sources, changes, routing, conflicts, checks, skips, and risks.
- Report unsupported, missing, and identified-but-unrun commands; label undocumented unrelated commands a `Nonblocking gap` unless they block the requested edit under the Blocking rule.
- Describe rejected, scaffolded, or example content by its provenance; never call it a rule or policy.
- Label each retained cleanup target `Deletion candidate`; name its fitting destination and the path-level approval required for deletion.
- If a preserved prohibition has no evidenced supported alternative, label it `Nonblocking safety gap` and name the missing alternative.
Apply the Blocking rule before labeling a gap Needs Input or requesting user input.
Separate command-backed from review-backed findings and protect secrets.

## Maintenance

Re-run after merges, releases, repeated mistakes, or scheduled maintenance. Clean audits are no-ops; keep unapproved deletion candidates and report destinations.
