# onboardkit

onboardkit is a Codex-compatible agent skill for keeping agent-facing repository guidance lightweight after project setup.

It helps an agent create and maintain:

```text
AGENTS.md          short always-on project rules
.agents/skills/   explicit workflow guides for recurring work
docs/              longer source-of-truth context
.harness/          optional policy and evidence receipts
```

onboardkit is not an npm package, autonomous agent runtime, dashboard, browser runner, subagent orchestrator, or all-action task ledger.

## Quick Start

Install this repository as a skill in the agent you use:

```bash
# Codex user skill
git clone <repo-url> ~/.agents/skills/onboardkit

# Claude Code user skill
git clone <repo-url> ~/.claude/skills/onboardkit

# Google Antigravity global skill
git clone <repo-url> ~/.gemini/config/skills/onboardkit
```

Antigravity also supports project-scoped skills under a target repository:

```bash
git clone <repo-url> <project-root>/.agents/skills/onboardkit
```

Then ask your coding agent in any target repository:

```text
Use onboardkit to set up this repo for coding agents.
```

or, when explicit skill calls are supported:

```text
$onboardkit set up this repo
```

Codex should inspect the repo, create or refresh `AGENTS.md`, install focused workflow guides, and keep longer context in docs instead of bloating `AGENTS.md`.

For Claude Code, invoke the skill as `/onboardkit` when explicit skill calls are preferred. For Codex, use `$onboardkit` when explicit skill mentions are supported. For Antigravity, ask for onboardkit by name or check `/skills` after installation.

## What The Skill Does

- Creates lightweight `AGENTS.md` guidance.
- Adds repo-local workflow guides under `.agents/skills`.
- Keeps docs and workflow procedures routed instead of pasted into `AGENTS.md`.
- Checks whether guidance is stale, duplicated, too broad, or too narrow.
- Optionally records verification evidence when a done claim needs proof.

## Normal Process

For a new repo, ask:

```text
Use onboardkit to prepare this repo.
```

For an existing repo, ask:

```text
Use onboardkit to check whether the agent docs are still lightweight and current.
```

For repeated mistakes, ask:

```text
Use onboardkit to update durable guidance so agents avoid this mistake next time.
```

The intended result is simple: the repo becomes `onboarded` for coding agents.

## Bundled Helper

The skill includes a deterministic helper for scaffolding and checks. Users do not need to install a global command; the agent can run the helper from the skill directory when useful:

```bash
node <skill-root>/bin/onboardkit.mjs init --target <repo>
node <skill-root>/bin/onboardkit.mjs doctor --cwd <repo>
node <skill-root>/bin/onboardkit.mjs index-docs --source <repo>/docs --name local-docs --inject
```

When proof is needed:

```bash
node <skill-root>/bin/onboardkit.mjs verify --criteria <criteria.json> --run-id <id>
node <skill-root>/bin/onboardkit.mjs finish --run-id <id>
```

Proof is a receipt for a verification run, not a permanent log of every action.

## Workflow Guides

`AGENTS.md` should hold only always-needed rules. Deeper procedures live in workflow guides and should be invoked explicitly when the task matches.

Current guides:

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
- `docs-index`: compressed local docs indexes for `AGENTS.md`.
- `eval`: static scenario inventory and future eval workflows.

## Source Repository Layout

```text
SKILL.md                   skill entrypoint
agents/openai.yaml         skill UI metadata
AGENTS.md                  repo guidance for this source repo
bin/onboardkit.mjs         bundled helper script
src/lib/                   helper implementation modules
.agents/skills/            workflow guides installed into target repos
.codex/config.example.toml safe Codex configuration example
docs/                      source-of-truth, architecture, status, and design docs
schemas/                   JSON schema contracts
templates/                 generated artifact templates
evals/scenarios/           static eval scenario definitions
examples/                  sample criteria and artifacts
test/                      smoke tests
```

`package.json` is private development metadata for this source repo. It is not a publishing contract.

## Generated Files And Commit Policy

Commit durable source-of-truth files such as `AGENTS.md`, `docs/`, `.agents/skills/`, `templates/`, `schemas/`, `examples/`, and `evals/`.

Commit `.harness/security-policy.json` when it defines project command policy. It is configuration, not runtime evidence.

Do not commit runtime outputs under `.harness/evidence/`, `.harness/runs/`, `.harness/reports/`, `.harness/tmp/`, generated docs indexes under `.harness/docs-index/`, root local scratch `/specs/`, or `*.log` files.

If a generated planning artifact or scratch spec should become durable project documentation, move or copy it into `docs/`, `examples/`, or `templates/` first, then commit it there.

## Current Limits

- Criteria input is JSON only.
- Browser automation is not implemented; screenshot and browser-log criteria are artifact-backed file checks.
- `eval` currently writes a static scenario inventory; it does not execute dynamic eval runs.
- Command policy v0 is exact-allow and pattern-based; it is not an OS sandbox.
- `doctor --security` is a shallow local audit, not a runtime permission system.
- `doctor --guides` is a static guide contract audit, not semantic trigger evaluation.

## Origin And References

onboardkit started from a practical problem: AI coding agents can miss project guidance, follow stale docs, accumulate overly specific instructions, or run risky commands while verifying work. The design response is to keep always-needed guidance small, route deeper procedures to repo-local guides, and use proof only when a done claim needs it.

Representative research papers:

- [SWE-bench: Can Language Models Resolve Real-World GitHub Issues?](https://arxiv.org/abs/2310.06770) - real repository tasks need objective validation, not just generated patches.
- [AI Agents That Matter](https://arxiv.org/abs/2407.01502) - agent evaluation should be reproducible, standardized, and useful for real-world work.

Representative technical references:

- [Vercel: AGENTS.md outperforms skills in our agent evals](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals) - supports keeping reliable, compressed project context in `AGENTS.md`.
- [AGENTS.md open format](https://agents.md/) - common convention for durable agent-facing project instructions.

Representative vendor guidance:

- [OpenAI Codex best practices](https://developers.openai.com/codex/learn/best-practices) - `AGENTS.md` should cover repo layout, commands, constraints, and how to verify done.
- [OpenAI Codex AGENTS.md guide](https://developers.openai.com/codex/guides/agents-md) - Codex loads layered `AGENTS.md` guidance before work.
- [OpenAI Codex skills guide](https://developers.openai.com/codex/skills) - progressive-disclosure workflows informed the skill and guide shape.
- [OpenAI Codex approvals and security](https://developers.openai.com/codex/agent-approvals-security) - command execution and approval posture need explicit safety boundaries.
- [Claude Code skills guide](https://code.claude.com/docs/en/skills) - Claude Code discovers filesystem skills and uses the description to decide when to load them.
- [Anthropic Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) - skills package instructions, metadata, and optional scripts/resources with progressive disclosure.
- [Google Antigravity skills codelab](https://codelabs.developers.google.com/getting-started-with-antigravity-skills) - Antigravity supports global skills and project-scoped `.agents/skills` folders.

## License

MIT
