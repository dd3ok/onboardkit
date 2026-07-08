# AGENTS.md

This repository contains Prooflane, a compact evidence-backed workflow toolkit for AI coding agents.

## Operating Principles

1. Explore local project context before implementation.
2. Prefer local source, templates, schemas, and official docs over model memory for version-sensitive behavior.
3. Keep changes surgical and traceable to the user request, a failing test, or an explicit verification gap.
4. Do not perform unrelated refactors.
5. Done requires fresh evidence from tests, syntax checks, command criteria, or review.

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

## Commands

```bash
npm test
npm run lint:syntax
node ./bin/prooflane.mjs doctor
node ./bin/prooflane.mjs eval
node ./bin/prooflane.mjs verify --criteria examples/criteria.sample.json
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
bin/              CLI entrypoint
src/lib/          CLI library modules
templates/        generated workflow artifacts
.agents/skills/   Codex-compatible workflow skills
schemas/          JSON schema contracts
evals/scenarios/  static eval scenario definitions
examples/         sample criteria and artifacts
test/             smoke tests
```

## Skill Policy

Skills are on-demand vertical workflows. Do not hide always-needed project rules inside skills.

Each skill must:

- live under `.agents/skills/<name>/SKILL.md`
- include `name` and `description` frontmatter
- focus on one job
- define explicit inputs and outputs
- prefer instructions over scripts unless deterministic behavior or tooling is required
- keep the description concise and trigger-focused

## Docs Index Policy

Use `prooflane index-docs` to inject a compressed docs index into the managed section below when this repository gains local docs.

<!-- prooflane:docs-index:start -->
[Project Docs Index]|root: docs
|IMPORTANT: Prefer retrieval-led reasoning over pretraining-led reasoning. Read relevant local docs when a docs folder exists.
<!-- prooflane:docs-index:end -->

## Security Rules

- Do not use `danger-full-access` as a default Codex sandbox mode.
- Keep network access off by default for agent execution unless a specific workflow requires it.
- Do not print or persist secrets in evidence logs.
- Ask for approval before adding production dependencies, rotating credentials, deleting data, or running destructive commands.
- Prefer project-local, reproducible commands over global machine assumptions.
