# AGENTS.md

This repository contains onboardkit, a Codex skill source for keeping agent-facing repo context lightweight after project setup.

## Operating Principles

1. Explore local project context before implementation.
2. Prefer local source, templates, schemas, and official docs over model memory for version-sensitive behavior.
3. Keep changes surgical and traceable to the user request, a failing test, or an explicit verification gap.
4. Do not perform unrelated refactors.
5. Done requires fresh verification evidence from tests, syntax checks, command criteria, or recorded artifacts. Review is a separate scope check.

## Workflow Depth

Use the lightest workflow that is safe for the task.

```text
Tiny fix:
  inspect -> patch -> verify -> review

Small feature:
  clarify -> mini-spec -> plan -> implement -> verify -> review

Large feature or migration:
  clarify -> specify -> design -> tasks -> implement slices -> evidence -> review
```

Run `retro` only when repeated failures or process gaps need to become durable harness updates.

## Current Improvement Priority

When improving onboardkit itself, use this order:

1. YAML criteria parser, only if JSON criteria become a usability bottleneck.
2. Optional run summary, only if `finish` or `status` needs a separate pointer file.
3. Broader redaction and structured command descriptors.
4. Semantic workflow-guide trigger eval, only if static `doctor --guides` checks are insufficient.

Keep dynamic eval, browser automation, subagent orchestration, npm/package publishing, plugin packaging, and dashboards outside the core improvement pass unless a later design explicitly promotes them.

Read `docs/IMPROVEMENT_ROADMAP_DESIGN.md` before implementing these roadmap items.

## Commands

```bash
node --test
node --check ./bin/onboardkit.mjs
node --check ./src/lib/docs-indexer.mjs
node --check ./src/lib/evidence.mjs
node --check ./src/lib/doctor.mjs
node --check ./src/lib/specs.mjs
node --check ./src/lib/eval-runner.mjs
node --check ./src/lib/fs.mjs
node --check ./src/lib/hash.mjs
node --check ./src/lib/security-policy.mjs
node --check ./src/lib/security-audit.mjs
node --check ./src/lib/guide-audit.mjs
node --check ./src/lib/finish-gate.mjs
node ./bin/onboardkit.mjs init
node ./bin/onboardkit.mjs doctor
node ./bin/onboardkit.mjs doctor --governance
node ./bin/onboardkit.mjs doctor --security
node ./bin/onboardkit.mjs doctor --guides
node ./bin/onboardkit.mjs eval
node ./bin/onboardkit.mjs verify --criteria examples/criteria.sample.json
node ./bin/onboardkit.mjs finish --run-id <id>
```

## Definition of Done

- Relevant tests pass, or the reason they cannot be run is recorded.
- Syntax, lint, typecheck, or build checks pass when applicable.
- Command-backed criteria are re-run at completion time when applicable.
- Evidence is stored under `.harness/evidence/<run-id>/`.
- The final report names the exact commands run and evidence paths.
- The diff has been reviewed for scope, regressions, maintainability, and security.

## Project Structure

```text
SKILL.md          Codex skill entrypoint
agents/           skill UI metadata
bin/              bundled helper entrypoint
src/lib/          helper library modules
templates/        generated workflow artifacts
.agents/skills/   Codex-compatible repo-local workflow guides
schemas/          JSON schema contracts
evals/scenarios/  static eval scenario definitions
examples/         sample criteria and artifacts
test/             smoke tests
```

## Workflow Guide Policy

Workflow guides are on-demand vertical procedures stored under `.agents/skills` for Codex compatibility. Do not hide always-needed project rules inside guides.

Each guide must:

- live under `.agents/skills/<name>/SKILL.md`
- include `name` and `description` frontmatter
- focus on one job
- define explicit inputs and outputs
- prefer instructions over scripts unless deterministic behavior or tooling is required
- keep the description concise and trigger-focused

## Routing Policy

Keep always-needed rules in AGENTS.md. Keep long procedures, interviews, and specialized checks in workflow guides or docs.

When a task matches a workflow-guide trigger, invoke the corresponding guide explicitly instead of relying on implicit discovery:

- Ambiguous, risky, multi-file, or user-visible requirements: `clarify`
- Product behavior or acceptance criteria: `specify`
- Architecture, interfaces, data models, or security boundaries: `design`
- Multi-file or long-running implementation: `plan`
- Behavior changes with feasible tests: `tdd`
- Planned implementation slice: `implement`
- Before claiming completion: `verify`
- After implementation and verification: `review`
- Auth, secrets, network, dependencies, deletion, or sandbox changes: `security-review`
- Repeated mistakes or process failures: `retro`
- Adding or updating local docs corpus: `docs-index`
- Workflow or harness behavior changes: `eval`

For version-sensitive APIs, prefer the docs index in AGENTS.md and read the referenced local docs before using model memory.

## Docs Index Policy

Use `node ./bin/onboardkit.mjs index-docs` to inject a compressed docs index into the managed section below when this repository gains local docs.

<!-- onboardkit:docs-index:start -->
[Project Docs Index]|root: docs
|IMPORTANT: Prefer retrieval-led reasoning over pretraining-led reasoning. Read relevant local docs before coding against version-sensitive APIs.
|.:{ARCHITECTURE.md,BEST_PRACTICES_AUDIT.md,BUILD_VERIFICATION.md,CODEX_VENDOR_COMPLIANCE.md,DECISIONS.md,EVAL_METHODOLOGY.md,evidence.md,finish-gate.md,IMPROVEMENT_ROADMAP_DESIGN.md,SECURITY_MODEL.md,shared-language.md,SOT.md,STATUS.md,TODO_FEATURE_DESIGNS.md}
<!-- onboardkit:docs-index:end -->

## Security Rules

- Do not use `danger-full-access` as a default Codex sandbox mode.
- Keep network access off by default for agent execution unless a specific workflow requires it.
- Do not print or persist secrets in evidence logs.
- Ask for approval before adding production dependencies, rotating credentials, deleting data, or running destructive commands.
- Prefer project-local, reproducible commands over global machine assumptions.
