# TODO Feature Designs

This document defines future work in an implementation-ready format. Each item includes goal, design, files, API, steps, tests, and acceptance criteria.

Implementation priority is governed by `docs/IMPROVEMENT_ROADMAP_DESIGN.md`. Older item numbers in this file are design inventory identifiers, not execution order.

## T01 — Dynamic eval runner

### Goal

Run repeatable evals across workflow modes and produce comparable pass-rate/cost/time reports.

### Design

Add a runner that takes a scenario, creates an isolated temp repo, applies the selected harness mode, invokes a configured agent command or deterministic mock, runs graders, and records results.

### Files to add/change

```text
src/lib/eval-dynamic.mjs
src/lib/eval-graders.mjs
src/lib/eval-modes.mjs
bin/after-init.mjs
evals/scenarios/*.json
schemas/eval.schema.json
```

### CLI API

```bash
after-init eval run --scenario evals/scenarios/version-sensitive-api.json --mode hybrid --runs 5
after-init eval compare --scenario evals/scenarios/version-sensitive-api.json --modes baseline,guides-default,agents-md-docs-index,hybrid
```

### Scenario schema

```json
{
  "id": "version-sensitive-api",
  "title": "Version-sensitive API usage",
  "fixture": "fixtures/nextjs-app",
  "prompt": "Implement ...",
  "modes": ["baseline", "guides-default", "agents-md-docs-index", "hybrid"],
  "graders": [
    {"type": "command", "command": "npm test"},
    {"type": "file-contains", "file": "app/page.tsx", "pattern": "connection()"}
  ]
}
```

### Implementation steps

1. Implement fixture copy to `.harness/tmp/evals/<run-id>/`.
2. Implement mode applier:
   - baseline: remove AGENTS.md and workflow guides.
   - guides-default: install workflow guides only.
   - guides-explicit: install workflow guides and add explicit prompt prefix.
   - agents-md-docs-index: install AGENTS.md docs index only.
   - hybrid: install AGENTS.md, workflow guides, criteria, evidence policy.
3. Implement command graders.
4. Implement file-contains and file-not-contains graders.
5. Implement JSON report writer.
6. Add aggregate comparison table.

### Tests

- Unit test mode application.
- Unit test command grader pass/fail.
- Integration test with a small fixture and deterministic shell script agent mock.

### Acceptance criteria

- Can run at least one scenario in two modes.
- Produces `.harness/reports/evals/<timestamp>.json`.
- Report includes pass rate, command outputs, duration, and failure reasons.

## T02 — Browser evidence connector

### Goal

Collect browser/runtime evidence for UI tasks, including console errors, screenshots, network logs, and accessibility summaries.

### Design

Create adapter interface and first implementation using Playwright. Add optional Next.js-specific connector that can call `next-browser` when available.

### Files to add/change

```text
src/lib/browser/adapter.mjs
src/lib/browser/playwright-adapter.mjs
src/lib/browser/next-browser-adapter.mjs
src/lib/evidence.mjs
schemas/criteria.schema.json
docs/SECURITY_MODEL.md
```

### Criteria example

```json
{
  "id": "B01",
  "description": "Login page has no browser console errors",
  "type": "browser-log",
  "url": "http://localhost:3000/login",
  "required": true
}
```

### Implementation steps

1. Extend criteria schema with `url`, `browser`, `timeout_ms`, `screenshot`.
2. Add adapter interface:
   - `start()`
   - `navigate(url)`
   - `collectConsoleErrors()`
   - `screenshot(path)`
   - `collectNetworkSummary()`
   - `stop()`
3. Add Playwright optional dependency strategy.
4. If `npx next-browser --help` is available, use Next.js connector for richer data.
5. Store artifacts under `.harness/evidence/<run-id>/<criterion-id>/artifacts/`.
6. Update `proof.json` with artifact paths.

### Tests

- Mock adapter unit tests.
- Optional integration test behind `RUN_BROWSER_TESTS=1`.

### Acceptance criteria

- Browser criteria produce proof JSON.
- Screenshots and logs are saved.
- If browser tooling is missing, required criteria fail with actionable error.

## T03 — YAML criteria parser

### Goal

Allow `criteria.yaml` in addition to `criteria.json` without forcing a heavy dependency.

### Design options

Option A: Add `yaml` package dependency.
Option B: Support a strict subset parser.

Recommendation: Use `yaml` as an optional dependency only in the CLI package, because criteria are user-authored and should parse predictably.

### Files to add/change

```text
package.json
src/lib/criteria-loader.mjs
src/lib/evidence.mjs
templates/criteria.template.yaml
```

### Implementation steps

1. Add `loadCriteria(file)`.
2. Detect `.json`, `.yaml`, `.yml`.
3. For YAML, dynamically import `yaml`.
4. If missing, print `npm install yaml` or fall back to JSON-only error.
5. Update verify command to use loader.

### Tests

- JSON load test.
- YAML load test.
- Missing dependency error test if optional dependency is not installed.

### Acceptance criteria

- `after-init verify --criteria specs/foo/criteria.yaml` works.
- JSON criteria remain supported.

## T04 — Host adapter installer

Status: Pointer-only shims are implemented through `init --host-shims`; the full adapter installer described here remains TODO.

### Goal

Install host-specific instruction files while keeping a host-agnostic core.

### Design

Add adapter modules that generate or update host-specific files from canonical templates.

### Files to add/change

```text
src/lib/adapters/codex.mjs
src/lib/adapters/claude-code.mjs
src/lib/adapters/cursor.mjs
src/lib/adapters/copilot.mjs
templates/adapters/*
bin/after-init.mjs
```

### CLI API

```bash
after-init adapter install codex
after-init adapter install claude-code
after-init adapter install cursor
after-init adapter install copilot
```

### Implementation steps

1. Define adapter interface: `detect`, `install`, `doctor`.
2. Codex adapter installs `AGENTS.md`, `.agents/skills`, `.codex/config.example.toml`.
3. Claude adapter installs `CLAUDE.md` shim and slash-command docs.
4. Cursor adapter maps AGENTS guidance to `.cursor/rules/after-init.mdc`.
5. Copilot adapter maps guidance to `.github/copilot-instructions.md`.
6. Add adapter-specific doctor checks.

### Tests

- Snapshot generated files.
- Idempotency tests.
- No overwrite unless `--force`.

### Acceptance criteria

- Running installer twice is safe.
- Adapter files reference canonical AGENTS/SOT instead of duplicating everything.

## T05 — Codex plugin packaging

### Goal

Package skills and optional app metadata as a Codex plugin for easier distribution.

### Design

Create `plugins/codex/` with manifest, bundled skills, and install instructions. Keep repo-scoped skills for local development.

### Files to add/change

```text
plugins/codex/plugin.yaml
plugins/codex/skills/*
scripts/build-codex-plugin.mjs
docs/CODEX_VENDOR_COMPLIANCE.md
```

### Implementation steps

1. Research final plugin manifest requirements against current Codex docs.
2. Add build script that copies `.agents/skills` into plugin bundle.
3. Validate every skill has frontmatter.
4. Add plugin README.
5. Add release workflow.

### Tests

- Build plugin into `dist/codex-plugin/`.
- Validate skill count and metadata.

### Acceptance criteria

- Plugin bundle can be installed in a local Codex environment.
- Repo-scoped skills and plugin skills remain generated from one source.

## T06 — Security policy engine

Status: Implemented as command policy v0 plus shallow `doctor --security` static audit; richer parsing, interactive approvals, and broader redaction remain future hardening.

### Goal

Prevent or flag risky commands before evidence execution.

### Design

Add policy file `.harness/security-policy.json` with allow, deny, prompt patterns. The verifier checks commands before running them.

### Policy example

```json
{
  "deny": ["rm -rf /", "curl * | sh", "printenv"],
  "prompt": ["npm install", "pnpm add", "git push", "kubectl", "terraform apply"],
  "allow": ["npm test", "npm run lint:syntax", "node --test"]
}
```

### Files to add/change

```text
src/lib/security-policy.mjs
src/lib/evidence.mjs
schemas/security-policy.schema.json
templates/security-policy.template.json
docs/SECURITY_MODEL.md
```

### Implementation steps

1. Add glob-like matcher.
2. Deny hard-blocked commands.
3. Fail prompt-required commands unless the criterion carries explicit approval.
4. In interactive mode, require `--approve-risky` flag.
5. Record policy decision in `proof.json`.

### Tests

- Deny pattern blocks command.
- Allow pattern runs command.
- Prompt pattern fails without approval.

### Acceptance criteria

- Required criteria cannot execute denied commands.
- Reports explain policy decision.

## T07 — Subagent orchestration

### Goal

Support role-separated workflows without binding the core to one model host.

### Design

Represent roles as markdown instructions and let adapters map them to host-specific subagent capabilities.

### Files to add/change

```text
agents/researcher.md
agents/planner.md
agents/implementer.md
agents/verifier.md
agents/reviewer.md
src/lib/roles.mjs
src/lib/adapters/codex.mjs
```

### Implementation steps

1. Define role schema with name, goal, inputs, outputs, forbidden actions.
2. Add role instruction files.
3. Codex adapter emits subagent config snippets if supported.
4. Fallback mode uses sequential role prompts.

### Tests

- Validate role schema.
- Snapshot adapter output.

### Acceptance criteria

- Reviewer and verifier roles are separate from implementer role.
- Host without subagents can still use role docs manually.

## T08 — Dashboard/report UI

### Goal

Make evidence and eval results reviewable by humans.

### Design

Generate static HTML from evidence and eval JSON.

### Files to add/change

```text
src/lib/report-html.mjs
bin/after-init.mjs
templates/report.html
```

### CLI API

```bash
after-init report evidence --run-id <id>
after-init report eval --report .harness/reports/eval.json
```

### Acceptance criteria

- Generates `.harness/reports/<id>.html`.
- Links to command logs and artifacts.
- Highlights failures and stale evidence.

## T09 — Docs pack registry

### Goal

Install versioned docs packs and inject compressed indexes into AGENTS.md.

### Design

Maintain a registry file mapping framework/package/version to docs source strategy.

### Files to add/change

```text
docs-packs/registry.json
src/lib/docs-packs.mjs
src/lib/docs-indexer.mjs
```

### CLI API

```bash
after-init docs add next --version installed
after-init docs add react --version 19
```

### Acceptance criteria

- Detects installed package version where possible.
- Stores docs under `.harness/docs/<name>/<version>/` or points to bundled docs.
- Injects compressed index.

## T10 — Monorepo nested AGENTS.md generator

### Goal

Create local guidance files near specialized packages or services.

### Design

Scan package boundaries and generate small nested AGENTS.md files that override root rules only where needed.

### Files to add/change

```text
src/lib/monorepo.mjs
src/lib/agents-md.mjs
templates/AGENTS.package.template.md
```

### Acceptance criteria

- Detects npm/pnpm/yarn workspaces.
- Generates package-specific command sections.
- Keeps root AGENTS.md under size budget.

## T11 — GitHub Actions integration

### Goal

Run doctor, tests, evidence verification, and static eval inventory in CI.

### Design

Add workflow template and installer.

### Files to add/change

```text
templates/github/workflows/after-init.yml
src/lib/adapters/github-actions.mjs
```

### Acceptance criteria

- CI runs `npm test`, `after-init doctor`, and selected eval commands.
- Uploads `.harness/reports` as artifacts.

## T12 — Automated SOT synchronization

### Goal

Detect when architecture/status/TODO docs disagree.

### Design

Add a consistency checker that reads SOT references and verifies file existence, status markers, and TODO IDs.

### Files to add/change

```text
src/lib/sot-check.mjs
bin/after-init.mjs
docs/SOT.md
docs/STATUS.md
docs/TODO_FEATURE_DESIGNS.md
```

### CLI API

```bash
after-init sot check
after-init sot update-status --todo T01 --status done
```

### Acceptance criteria

- Missing referenced docs fail doctor.
- TODO IDs in STATUS and TODO docs are consistent.
- Completed TODOs require decision log entry.
