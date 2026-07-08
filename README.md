# Prooflane

Prooflane is a small, zero-dependency Node.js toolkit for AGENTS.md-first agent workflows.
It helps coding agents work from durable repo guidance, focused skills, generated planning artifacts, and fresh command-backed evidence.

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

node ./bin/prooflane.mjs help
node ./bin/prooflane.mjs doctor
node ./bin/prooflane.mjs new --slug demo-login --title "Demo login flow"
node ./bin/prooflane.mjs verify --criteria examples/criteria.sample.json
```

After linking the package locally:

```bash
npm link
prooflane doctor
```

## Repository Layout

```text
AGENTS.md                 repo guidance for agents
bin/prooflane.mjs         CLI entrypoint
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

`prooflane verify` reads a criteria JSON file and writes:

```text
.harness/evidence/<run-id>/<criterion-id>/commands.log
.harness/evidence/<run-id>/<criterion-id>/proof.json
.harness/evidence/<run-id>/run-report.json
```

Command criteria run locally, redact common secret environment variable patterns, and record timestamps, exit status, output hashes, and freshness.

## Current Limits

- Criteria input is JSON only.
- Non-command criteria are recorded as pending manual evidence.
- `eval` currently writes a static scenario inventory; it does not execute dynamic eval runs.
- Command policy enforcement is not implemented yet, so run criteria files only from trusted sources.

## License

MIT
