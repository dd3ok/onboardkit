# Current Status

## Implemented in current repository

### Repository skeleton

- Root `SKILL.md`.
- `agents/openai.yaml` skill metadata.
- Root `README.md`.
- Root `AGENTS.md` with workflow policy, Definition of Done, docs index policy, security rules.
- `SOT.md` pointer and `docs/SOT.md` canonical source of truth.
- `PLANS.md` execution plan template.
- `.gitignore` template for runtime outputs and local logs.
- `.codex/config.example.toml` safe Codex configuration example.

### Bundled helper

Implemented in `bin/onboardkit.mjs` and `src/lib/`:

- `help`
- `init`
- `doctor`
- `index-docs`
- `new`
- `verify`
- `finish`
- `eval`
- `status`

For this repository, `doctor --governance` also checks SOT boundaries, roadmap priority, non-core backlog boundaries, best-practice audit guardrails, and governance docs index routing.

`doctor --security` emits stable static security findings with IDs. The v0 audit checks AGENTS.md security guardrails, safe Codex config examples, unsafe active Codex config, runtime-output ignore rules, fail-closed command policy defaults, and evidence redaction patterns.

`doctor --guides` emits stable static guide findings with IDs. The v0 audit checks repo-local guide inventory, frontmatter uniqueness, folder/name alignment, concise trigger descriptions, required contract sections, and lightweight file size.

`verify` enforces command policy v0 before executing command criteria. The policy supports exact allow rules, deny rules, prompt-required rules that fail closed unless a criterion carries explicit approval, command timeout, output size limits, safe run/criterion IDs, and policy decision fields in proof output.

`finish` reads a run report and proof files, validates evidence paths inside the run root, writes `finish-report.json`, and returns `PASS`, `FAIL`, or `INCOMPLETE`.

Artifact, screenshot, browser-log, review, and manual criteria record file-backed proof for existing project-relative paths. Proof includes file size, mtime, and SHA-256 hash. `finish` checks that referenced artifacts still exist and match recorded hashes.

`docs/shared-language.md` defines canonical terms and role contracts for implementer, verifier, reviewer, and security reviewer workflows.

### Workflow guides

Implemented Codex-compatible repo-local workflow guides under `.agents/skills/`:

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

Each guide has:

- `SKILL.md`
- `name` and `description` frontmatter
- inputs, outputs, steps, completion criteria
- optional `agents/openai.yaml`

### Evidence

- `verify` command reads JSON criteria.
- Command criteria are checked against command policy before execution.
- Non-command criteria are recorded as file-backed artifact evidence when a valid project-relative path is provided.
- stdout/stderr are redacted for common secret env var patterns.
- `commands.log`, `proof.json`, and `run-report.json` are written under `.harness/evidence/<run-id>/`.
- `finish-report.json` records the aggregate finish verdict.

### Docs

- Architecture.
- Best-practice audit.
- Codex compliance audit.
- Security model.
- Eval methodology.
- Decision log.
- Detailed TODO feature designs.
- Improvement roadmap design.
- Shared language and role contracts.
- Finish gate.
- Evidence contract.

### Schemas

- criteria
- evidence
- security policy
- task
- review
- run state

### Examples and tests

- `examples/criteria.sample.json`
- `evals/scenarios/*.json`
- `test/smoke.test.mjs`

## Not done yet

These are intentionally not implemented in the MVP and are specified in `docs/TODO_FEATURE_DESIGNS.md` and `docs/IMPROVEMENT_ROADMAP_DESIGN.md`:

1. Optional run summary.
2. Dynamic eval runner.
3. Browser evidence connector.
4. YAML criteria parser.
5. npm package publishing and Codex plugin packaging.
6. Subagent orchestration.
7. Dashboard/report UI.
8. Docs pack registry.
9. Monorepo nested AGENTS.md generator.
10. GitHub Actions integration.
11. Automated SOT synchronization.
12. Semantic workflow-guide trigger eval automation.

## Recommended next implementation order

1. YAML criteria parser, only if JSON criteria become a usability bottleneck.
2. Optional run summary, only if `finish` or `status` needs a separate pointer file.
3. Broader redaction and structured command descriptors.
4. Semantic workflow-guide trigger eval, only if static `doctor --guides` checks are insufficient.
