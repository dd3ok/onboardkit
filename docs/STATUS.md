# Current Status

## Implemented in current repository

### Repository skeleton

- Root `README.md`.
- Root `AGENTS.md` with workflow policy, Definition of Done, docs index policy, security rules.
- `CLAUDE.md` shim.
- `SOT.md` pointer and `docs/SOT.md` canonical source of truth.
- `PLANS.md` execution plan template.
- `.codex/config.example.toml` safe Codex configuration example.

### CLI

Implemented in `bin/agent-onboard.mjs` and `src/lib/`:

- `help`
- `init`
- `doctor`
- `index-docs`
- `new`
- `verify`
- `eval`
- `status`

### Skills

Implemented Codex-compatible skills under `.agents/skills/`:

- clarify
- specify
- design
- plan
- implement
- tdd
- verify
- review
- security-review
- retro
- docs-index
- eval

Each skill has:

- `SKILL.md`
- `name` and `description` frontmatter
- inputs, outputs, steps, completion criteria
- optional `agents/openai.yaml`

### Evidence

- `verify` command reads JSON criteria.
- Command criteria are executed.
- stdout/stderr are redacted for common secret env var patterns.
- `commands.log`, `proof.json`, and `run-report.json` are written under `.harness/evidence/<run-id>/`.

### Docs

- Source analysis.
- Architecture.
- Best-practice audit.
- Codex compliance audit.
- Security model.
- Eval methodology.
- Decision log.
- Detailed TODO feature designs.
- Improvement roadmap design.

### Schemas

- criteria
- evidence
- task
- review
- run state

### Examples and tests

- `examples/criteria.sample.json`
- `evals/scenarios/*.json`
- `test/smoke.test.mjs`

## Not done yet

These are intentionally not implemented in the MVP and are specified in `docs/TODO_FEATURE_DESIGNS.md` and `docs/IMPROVEMENT_ROADMAP_DESIGN.md`:

1. Command policy v0.
2. Shared language and role contracts.
3. Finish gate v0.
4. Artifact/manual evidence v0.
5. Optional run summary.
6. Dynamic eval runner.
7. Browser evidence connector.
8. YAML criteria parser.
9. Host adapter installer.
10. Codex plugin packaging.
11. Subagent orchestration.
12. Dashboard/report UI.
13. Docs pack registry.
14. Monorepo nested AGENTS.md generator.
15. GitHub Actions integration.
16. Automated SOT synchronization.

## Recommended next implementation order

1. Command policy v0.
2. Shared language and role contracts.
3. Finish gate v0.
4. Artifact/manual evidence v0.
5. Optional run summary, only if needed by `finish` or `status`.
