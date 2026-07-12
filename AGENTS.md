# AGENTS.md

This repository contains `onboardkit`, an instruction-only skill for keeping `AGENTS.md` and repo docs lightweight, current, and well-routed for coding agents. The canonical runtime lives at `skills/onboardkit/`; root skill files are legacy compatibility shims.

## Operating Principles

1. Inspect local context and scope edits to the request.
2. Use local source and official vendor docs for version-sensitive guidance.
3. Never add user-facing helpers, package scripts, schemas, runners, or scaffolding; repository-only validation CI is allowed.
4. Verify with targeted searches, available syntax/format checks, and diff review.

## Commands

There is no project helper command or package test command.

Useful checks:

```bash
git ls-files
git diff --check
git status --short --branch
```

## Documentation Routing

Keep `AGENTS.md` to recurring actionable commands, routing, verification, conventions, and safety. Project summaries stay in README/docs unless they change agent behavior.

Identify stale or duplicate docs as cleanup candidates. Merge only when the request authorizes it; delete only when it also names literal paths or file-matching globs.

`skills/onboardkit/SKILL.md` updates preserve initialization, routing, cleanup, maintenance, and missing-information policy without helper code.

Add one-level `references/` only for essential detail; never duplicate procedure there.

Use stable shared skill paths or official runtime docs.

## Definition of Done

- Canonical runtime contains only `SKILL.md`, `LICENSE`, `agents/openai.yaml`, and essential one-level `references/`; repository docs, CI, and evals stay outside it.
- `skills/onboardkit/SKILL.md` stays below the Agent Skills recommended ceilings of 500 lines and 5,000 tokens. Prefer fewer than 100 lines and roughly 1,500 tokens, but never compress a rule until its evidence, authority, or scope becomes ambiguous. CI uses a 20,000-character backstop to catch obvious token-budget regressions without adding a tokenizer dependency; release review records an actual token count when the client exposes one.
- Root `SKILL.md` remains a minimal compatibility entrypoint; root and canonical frontmatter plus UI metadata stay synchronized, and bundled/root licenses match.
- Skill frontmatter uses this repository's deterministic YAML serialization: an unquoted `name`, a JSON-compatible double-quoted `description`, and no comments. This is a dependency-free lint profile, not an Agent Skills vendor requirement; change the validator and both entrypoints together if the profile changes.
- The description front-loads its use cases and states adjacent tasks that must not trigger the skill; optimize it with positive and near-miss negative queries rather than isolated keywords.
- README installs `skills/onboardkit/` through the built-in skill installer. Do not reintroduce direct full-repository installs, deprecated sparse-checkout commands, or non-cone patterns.
- Audit/review/report requests are read-only. Edit only when the user explicitly asks to change target guidance; edit-intent wording is semantic rather than a closed keyword list. Such requests discover active overrides and fallbacks, preserve active files and validated rules, never relocate fitting content for surface standardization, otherwise route by audience and scope, and create root guidance only for repo-wide rules when neither an active root source nor a fitting existing destination exists. After an instruction source or discovery configuration changes, recompute the effective chain only at that source directory and discovered nested instruction boundaries; use override, `AGENTS.md`, configured fallback order, and empty-file skipping only for Codex. Report any changed selection as `old source -> new source`, state that the current session does not reload it, and qualify activation as next-run or next-session; never assume Codex semantics for other runtimes.
- Generated root `AGENTS.md` has no minimum length or fixed sections, normally stays at or below 200 words, and contains only supported commands, recurring conventions, scoped safety rules, or proven routing. Report-only, rejected, or conflicting material is never merged or generalized into rules. An explicit imperative in a current maintained source is policy only for its stated audience and scope when neither its provenance nor its passage marks it as scaffolded, generated, example, historical, proposed, or superseded. Completed task plans and handoffs are cleanup candidates rather than permanent routing destinations; preserve any still-durable guidance first. Keep policy detail in its canonical destination; add only a short root safety pointer when agents must see the rule before they can reasonably discover that destination. Pair preserved safety prohibitions with evidenced supported alternatives when available; otherwise explicitly report the missing alternative as a nonblocking safety gap and invent nothing. Setup and install guidance requires current policy evidence; workflow examples are insufficient. Path existence or description alone never proves routing.
- Facts use current evidence or explicit user factual confirmation and retain their file/subtree/audience scope. Candidate-only sources never corroborate each other. Explicit user replacements are policy. Otherwise, exclude the sentence being replaced from command consensus—it never conflicts with the remaining sources by itself—and replace it only when every other applicable current source agrees. If those sources conflict, leave the active instruction unchanged, report Needs Input, and remove only unsupported generated or scaffolded sentences.
- Use Needs Input for every unresolved conflict among applicable current policy or command evidence, and for missing authority or choice that blocks an explicitly requested non-no-op change. Classify evidence-gated no-ops, inactive fallbacks, rejected candidates, and undocumented unrelated commands as nonblocking gaps; do not solicit input for them unless it blocks the requested change. Newly exposed instruction sources are next-run or next-session transitions, never current-session activations.
- Verification during documentation maintenance stays read-only: do not execute package-manager, install, build, test, lint, format, generate, migrate, release, or repository scripts unless the user explicitly requests a named command; even then, never execute a command documented as mutating files.
- Move durable guidance to its narrowest existing canonical destination before deletion. Delete only user-specified literal paths or file-matching globs; never broaden them or treat a directory alone as approval. Clean audits are no-ops.
- Reports name changes, merged or deleted docs and destinations, placement decisions, conflicts, gaps, checks, skips, Needs Input, and risks; command-backed and review-backed findings stay separate.
- Static CI validates packaging, the repository's deliberately narrow OpenAI UI metadata profile, safe paths, eval structure, and stale forbidden patterns. This profile requires the three current interface fields plus explicit implicit-invocation policy; optional vendor fields are added only with a corresponding repository decision. CI does not treat exact prose as proof of model behavior or enforce a word target that encourages dense writing.
- Evaluation JSON/fixtures cover initialization/refresh, stale-target consensus, canonical-file/audience routing, actionable no-op, generated scaffold cleanup, post-edit active-source transitions, active overrides, scoped/deleted evidence, user authority, invoked-skill exclusion without hiding repo-owned skills, conflicting commands, mutating-command exclusion, positive alternatives, provenance leakage, cleanup/no-op, and trigger boundaries.
- Every assertion must trace to prompt evidence or a general canonical runtime rule and name an observable file, report, command, source transition, or absence. Never add a fixture-only output obligation or a condition that lets opposite outcomes pass. Static phrase lint catches only known regressions; human review and model grading establish semantic objectivity. When behavior semantics change, audit the canonical skill, README, UI metadata, evals, and CI together.
- Route evaluation by changed surface. Docs, CI, packaging, root-compatibility body, or OpenAI `display_name`/`short_description` changes use static validation. Canonical or root `name`/`description`, skill inventory, implicit-invocation policy, or trigger-query changes run the trigger track. Canonical skill body, OpenAI `default_prompt`, behavior eval, or behavior fixture changes run the behavior track. Changes to a cross-track smoke prompt, assertion, fixture, label, or identity run both tracks. Classify any newly adopted metadata field when adding it. Run both tracks for changes spanning both surfaces or for a major release.
- The trigger track runs every trigger query against candidate and baseline for up to three attempts. Compute invocation rate per query: a positive passes at `>= 0.5`, a negative at `< 0.5`; after two matching outcomes, the three-attempt classification is fixed and may stop early. It also runs behavior cases 1, 29, 31, and 33 once per version as behavior smoke: grade their declared assertions, require every candidate smoke to pass, and report baseline failures separately. Every candidate trigger query must pass its label.
- The behavior track runs every behavior case once against both versions, then runs critical cases tagged `delete`, `conflict`, `safety`, or `mutating-command`, any case whose first candidate or baseline run fails, and any case whose first-run grades differ, until each selected case has three runs per version. A behavior run passes only if all assertions pass; every critical candidate run must pass, while each other candidate case must pass a majority of its runs. It also runs 1-based trigger-query positions 1, 7, 13, and 18 once per version as invocation smoke: grade only each query's declared `should_trigger` label and require every candidate smoke to pass. Report baseline deltas and within-version variability separately. CI pins the smoke cases' coverage and the smoke queries' identities.
- Model evaluations compare the candidate commit with the last published tag in independent clean contexts. Only train failures guide description edits; validation results select the final iteration. If a validation failure is adopted as training evidence, reclassify it as train and add an unseen balanced validation replacement before further tuning; never tune repeatedly against the same holdout. A behavior case that expects a file change or source-specific finding must list every required fixture; a case without listed files must be verifiable against the neutral fixture alone. Start every `(case or query, version, attempt)` from a fresh target populated from the candidate checkout, verify its manifest and SHA-256 hashes before execution, and discard it afterward.
- Run the trigger track with onboardkit alone; when description or inventory behavior changes, repeat it with a recorded fixed adjacent-skill inventory. Reuse a result when both tracks request the same case/query, version, commit, model, config, and fixture.
- Record commits, client/model/config identifiers, project-trust state, effective project configuration, date, assertion evidence, tokens, duration, early stops, and raw outputs in an external iteration workspace with outputs, timing, grading, and aggregate benchmark records. Use a separate `CODEX_HOME` per concurrent run, explicitly trust fixture repositories before relying on project-scoped `.codex/config.toml`, stage the same fixture for both versions, and count implicit invocation only when skill selection precedes ordinary repository exploration. Review failures for a general cause before changing prose; never add a rule that only memorizes one fixture.

## Security Rules

- Do not print or persist secrets.
- Ask before adding dependencies, deleting user data, or running destructive commands.
- Use project-local, reproducible checks over global assumptions.
