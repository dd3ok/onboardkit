# Agent Onboard

Agent Onboard is a small, zero-dependency Node.js toolkit for preparing a repository before AI coding agents start work.
It installs durable repo guidance, focused skills, generated planning artifacts, and fresh command-backed plus file-backed evidence workflows.

## What Is Implemented

- `AGENTS.md` guidance checks with a compact docs-index marker.
- Repo-scoped Codex-compatible skills under `.agents/skills`.
- CLI commands: `init`, `doctor`, `index-docs`, `new`, `verify`, `finish`, `eval`, and `status`.
- Static security audit findings through `doctor --security`.
- Static skill contract findings through `doctor --skills`.
- Optional pointer-only host shims through `init --host-shims`.
- JSON criteria execution for command-backed verification with command policy checks.
- File-backed artifact/manual evidence for externally produced proof.
- Evidence output under `.harness/evidence/<run-id>/`.
- Static eval scenario inventory from `evals/scenarios`.
- Templates for brief, spec, design, tasks, criteria, review, retro, security policy, `.gitignore`, AGENTS.md, CLAUDE.md, GEMINI.md, Copilot, Cursor, and PLANS.md.

## Quick Start

```bash
npm test
npm run lint:syntax

node ./bin/agent-onboard.mjs help
node ./bin/agent-onboard.mjs doctor
node ./bin/agent-onboard.mjs doctor --security
node ./bin/agent-onboard.mjs doctor --skills
node ./bin/agent-onboard.mjs init --target .
node ./bin/agent-onboard.mjs new --slug demo-login --title "Demo login flow"
node ./bin/agent-onboard.mjs verify --criteria examples/criteria.sample.json
node ./bin/agent-onboard.mjs finish --run-id <id>
```

Optional host compatibility shims:

```bash
node ./bin/agent-onboard.mjs init --target . --host-shims
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

Command criteria run locally only after policy checks. Proof records the normalized command, allow/deny/prompt decision, timeout, output limit, timestamps, exit status, output hashes, and freshness.

Artifact, screenshot, browser-log, review, and manual criteria use an existing project-relative `path`; proof records file size, mtime, and SHA-256 hash. Agent Onboard does not launch a browser for these criteria.

`agent-onboard finish --run-id <id>` reads a run report and proof files, writes `finish-report.json`, and returns `PASS`, `FAIL`, or `INCOMPLETE`. It exits `0` only for `PASS`.

## Generated Files And Commit Policy

Commit source-of-truth files such as `AGENTS.md`, `docs/`, `.agents/skills/`, `templates/`, `schemas/`, `examples/`, and `evals/`.

Commit `.harness/security-policy.json` when it defines project command policy. It is configuration, not runtime evidence.

Do not commit runtime outputs under `.harness/evidence/`, `.harness/runs/`, `.harness/reports/`, `.harness/tmp/`, generated docs indexes under `.harness/docs-index/`, root local scratch `/specs/`, or `*.log` files.

When `agent-onboard index-docs --inject` updates `AGENTS.md`, commit the `AGENTS.md` change, not the generated `.harness/docs-index/*` file.

If a generated planning artifact or scratch spec should become durable project documentation, move or copy it into `docs/`, `examples/`, or `templates/` first, then commit it there.

## Current Limits

- Criteria input is JSON only.
- Browser automation is not implemented; screenshot and browser-log criteria are artifact-backed file checks.
- `eval` currently writes a static scenario inventory; it does not execute dynamic eval runs.
- Command policy v0 is exact-allow and pattern-based; it is not an OS sandbox.
- `doctor --security` is a shallow local audit, not a runtime permission system.
- `doctor --skills` is a static contract audit, not semantic LLM trigger evaluation.
- `init --host-shims` writes thin pointer files; it is not a full adapter installer.

## License

MIT
