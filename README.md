# after-init

after-init prepares a repo for AI coding agents after project setup.

It keeps `AGENTS.md`, agent-facing docs, and repo-local workflow guides lightweight, accurate, and useful without turning the repo into an agent runtime.

The default shape is intentionally small:

```text
AGENTS.md          always-on rules, kept short
docs/              longer context, decisions, and references
workflow guides    repo-local procedures for recurring work
guardrails         doctor, security, guide, and command-policy checks
optional proof     verify and finish when done claims need evidence
```

after-init is not an autonomous agent runtime, dashboard, browser runner, subagent orchestrator, or all-action task ledger.

## Quick Start

Install after-init once, then run `after-init init` in each repo you want to prepare. Think of it like `git init` for lightweight AI-agent context.

```bash
npm install -g after-init
```

Prepare a repo and check the lightweight setup:

```bash
after-init init
after-init doctor
```

Without a global install:

```bash
npx after-init init
npx after-init doctor
```

When a done claim needs proof:

```bash
after-init verify --criteria examples/criteria.sample.json
after-init finish --run-id <id>
```

When working in this repository:

```bash
npm test
npm run lint:syntax
```

After linking the package locally:

```bash
npm link
after-init doctor
```

## Common Workflows

### Core Workflow

Use these first. They keep the repository ready for AI coding agents without adding a heavy process.

```bash
after-init init
after-init doctor
after-init index-docs --source docs --name local-docs --inject
after-init new --slug login-flow --title "Login flow"
```

Core features:

- `AGENTS.md` guidance checks with a compact docs-index marker.
- Repo-local workflow guides under `.agents/skills`.
- Templates for brief, spec, design, tasks, criteria, review, retro, security policy, `.gitignore`, `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, Copilot, Cursor, and `PLANS.md`.
- Optional pointer-only host shims through `init --host-shims`.
- Static eval scenario inventory from `evals/scenarios`.

Optional host compatibility shims:

```bash
after-init init --host-shims
```

### Guardrails

Use these to keep the setup safe and predictable.

```bash
after-init doctor --security
after-init doctor --guides
after-init doctor --governance
```

Guardrail features:

- Static security audit findings through `doctor --security`.
- Static guide contract findings through `doctor --guides`.
- after-init governance checks through `doctor --governance` in this repository.
- Command policy checks before command-backed criteria execute.
- Safe config example in `.codex/config.example.toml`.

### Optional Proof Workflow

Use this when "done" needs a receipt, not just a confident status sentence.

```bash
after-init verify --criteria examples/criteria.sample.json --run-id <id>
after-init finish --run-id <id>
```

Proof features:

- JSON criteria execution for command-backed verification.
- File-backed artifact, screenshot, browser-log, review, and manual evidence for externally produced proof.
- Evidence output under `.harness/evidence/<run-id>/`.
- `finish` verdicts of `PASS`, `FAIL`, or `INCOMPLETE`.

## Workflow Guides

`AGENTS.md` should hold only always-needed rules. Deeper procedures live in repo-local workflow guides and should be referenced explicitly when the task matches.

Current repo-local guides:

- `clarify`: ambiguous or risky requirements.
- `specify`: product behavior and acceptance criteria.
- `design`: architecture, interfaces, risks, alternatives, and rollback.
- `plan`: executable task slices.
- `tdd`: behavior changes with feasible tests.
- `implement`: scoped implementation slices.
- `verify`: fresh command-backed evidence.
- `review`: scope, correctness, simplicity, maintainability, and regression checks.
- `security-review`: secrets, auth, network, deletion, dependencies, and sandbox risk.
- `retro`: repeated failures or process gaps that should become durable updates.
- `docs-index`: compressed local docs indexes for AGENTS.md.
- `eval`: static scenario inventory and future eval workflows.

## Optional Proof Is A Receipt, Not A Ledger

`after-init verify` reads a criteria JSON file and writes:

```text
.harness/evidence/<run-id>/<criterion-id>/commands.log
.harness/evidence/<run-id>/<criterion-id>/proof.json
.harness/evidence/<run-id>/run-report.json
```

Command criteria run locally only after policy checks. Proof records the normalized command, allow/deny/prompt decision, timeout, output limit, timestamps, exit status, output hashes, and freshness.

Artifact, screenshot, browser-log, review, and manual criteria use an existing project-relative `path`; proof records file size, mtime, and SHA-256 hash. after-init does not launch a browser for these criteria.

`after-init finish --run-id <id>` reads a run report and proof files, writes `finish-report.json`, and returns `PASS`, `FAIL`, or `INCOMPLETE`. It exits `0` only for `PASS`.

Evidence is not a record of every action. It is a small receipt for a verification run.

## Source Repository Layout

```text
AGENTS.md                 repo guidance for agents
bin/after-init.mjs        CLI entrypoint
src/lib/                  CLI implementation modules
.agents/skills/           repo-local workflow guides
.codex/config.example.toml safe Codex configuration example
docs/                     source-of-truth, architecture, status, and design docs
schemas/                  JSON schema contracts
templates/                generated workflow artifact templates
evals/scenarios/          static eval scenario definitions
examples/                 sample criteria and artifacts
test/                     smoke tests
```

The published npm package intentionally includes the runtime CLI, templates, schemas, examples, eval scenarios, and repo-local guides. Internal source-of-truth and research documents under `docs/` stay in the source repository unless they are promoted into templates or public examples.

## Generated Files And Commit Policy

Commit source-of-truth files such as `AGENTS.md`, `docs/`, `.agents/skills/`, `templates/`, `schemas/`, `examples/`, and `evals/`.

Commit `.harness/security-policy.json` when it defines project command policy. It is configuration, not runtime evidence.

Do not commit runtime outputs under `.harness/evidence/`, `.harness/runs/`, `.harness/reports/`, `.harness/tmp/`, generated docs indexes under `.harness/docs-index/`, root local scratch `/specs/`, or `*.log` files.

When `after-init index-docs --inject` updates `AGENTS.md`, commit the `AGENTS.md` change, not the generated `.harness/docs-index/*` file.

If a generated planning artifact or scratch spec should become durable project documentation, move or copy it into `docs/`, `examples/`, or `templates/` first, then commit it there.

## Current Limits

- Criteria input is JSON only.
- Browser automation is not implemented; screenshot and browser-log criteria are artifact-backed file checks.
- `eval` currently writes a static scenario inventory; it does not execute dynamic eval runs.
- Command policy v0 is exact-allow and pattern-based; it is not an OS sandbox.
- `doctor --security` is a shallow local audit, not a runtime permission system.
- `doctor --guides` is a static guide contract audit, not semantic LLM trigger evaluation.
- `init --host-shims` writes thin pointer files; it is not a full adapter installer.

## Origin And References

after-init started from a practical problem: AI coding agents can miss project guidance, follow stale docs, accumulate overly specific instructions, or run risky commands while verifying work. The design response is to keep always-needed guidance small, route deeper procedures to repo-local guides, and use proof only when a done claim needs it.

Representative research papers:

- [SWE-bench: Can Language Models Resolve Real-World GitHub Issues?](https://arxiv.org/abs/2310.06770) - real repository tasks need objective validation, not just generated patches.
- [AI Agents That Matter](https://arxiv.org/abs/2407.01502) - agent evaluation should be reproducible, standardized, and useful for real-world work.

Representative technical references:

- [Vercel: AGENTS.md outperforms skills in our agent evals](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals) - supports keeping reliable, compressed project context in `AGENTS.md`.
- [AGENTS.md open format](https://agents.md/) - common convention for durable agent-facing project instructions.
- [Agent Skills open standard](https://agentskills.io/home) - useful prior art for progressive-disclosure procedure files, even when guides stay repo-local.

Representative vendor guidance:

- [OpenAI Codex best practices](https://developers.openai.com/codex/learn/best-practices) - `AGENTS.md` should cover repo layout, commands, constraints, and how to verify done.
- [OpenAI Codex AGENTS.md guide](https://developers.openai.com/codex/guides/agents-md) - Codex loads layered `AGENTS.md` guidance before work and has a default project-doc size limit.
- [OpenAI Codex skills guide](https://developers.openai.com/codex/skills) - progressive-disclosure workflows informed the repo-local guide shape.
- [OpenAI Codex approvals and security](https://developers.openai.com/codex/agent-approvals-security) - command execution and approval posture need explicit safety boundaries.

## License

MIT
