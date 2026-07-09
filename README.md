# Agent Onboard

Agent Onboard is a small, zero-dependency Node.js toolkit for preparing a repository before AI coding agents start work.
It installs durable repo guidance, focused skills, generated planning artifacts, and fresh command-backed evidence workflows.

## What Is Implemented

- `AGENTS.md` guidance checks with a compact docs-index marker.
- Repo-scoped Codex-compatible skills under `.agents/skills`.
- CLI commands: `init`, `doctor`, `index-docs`, `new`, `verify`, `eval`, and `status`.
- JSON criteria execution for command-backed verification.
- Evidence output under `.harness/evidence/<run-id>/`.
- Static eval scenario inventory from `evals/scenarios`.
- Templates for brief, spec, design, tasks, criteria, review, retro, AGENTS.md, CLAUDE.md, and PLANS.md.

## Quick Start

```bash
npm test
npm run lint:syntax

node ./bin/agent-onboard.mjs help
node ./bin/agent-onboard.mjs doctor
node ./bin/agent-onboard.mjs new --slug demo-login --title "Demo login flow"
node ./bin/agent-onboard.mjs verify --criteria examples/criteria.sample.json
```

After linking the package locally:

```bash
npm link
agent-onboard doctor
```

## Repository Layout

```text
AGENTS.md                 repo guidance for agents
bin/agent-onboard.mjs     CLI entrypoint
src/lib/                  CLI implementation modules
.agents/skills/           Codex-compatible workflow skills
.codex/config.example.toml safe Codex configuration example
schemas/                  JSON schema contracts
templates/                generated workflow artifact templates
evals/scenarios/          static eval scenario definitions
examples/                 sample criteria
test/                     smoke tests
```

## Evidence

`agent-onboard verify` reads a criteria JSON file and writes:

```text
.harness/evidence/<run-id>/<criterion-id>/commands.log
.harness/evidence/<run-id>/<criterion-id>/proof.json
.harness/evidence/<run-id>/run-report.json
```

Command criteria run locally, redact common secret environment variable patterns, and record timestamps, exit status, output hashes, and freshness.

## Generated Files And Commit Policy

Commit source-of-truth files such as `AGENTS.md`, `docs/`, `.agents/skills/`, `templates/`, `schemas/`, `examples/`, and `evals/`.

Do not commit runtime outputs under `.harness/evidence/`, `.harness/runs/`, `.harness/reports/`, `.harness/tmp/`, generated docs indexes under `.harness/docs-index/`, local scratch `specs/`, or `*.log` files.

When `agent-onboard index-docs --inject` updates `AGENTS.md`, commit the `AGENTS.md` change, not the generated `.harness/docs-index/*` file.

If a generated planning artifact or scratch spec should become durable project documentation, move or copy it into `docs/`, `examples/`, or `templates/` first, then commit it there.

## Current Limits

- Criteria input is JSON only.
- Non-command criteria are recorded as pending manual evidence.
- `eval` currently writes a static scenario inventory; it does not execute dynamic eval runs.
- Command policy enforcement is not implemented yet, so run criteria files only from trusted sources.

## License

MIT
