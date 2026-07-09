---
name: onboardkit
description: Set up or maintain lightweight agent-facing repo context. Use when the user asks to prepare a repo for coding agents, create or refresh AGENTS.md, manage repo-local workflow guides, index local docs, remove stale agent guidance, or check that agent docs stay concise and useful.
---

# onboardkit

Use this skill to prepare and maintain a repository for AI coding agents without turning the repo into an agent runtime.

## Inputs

- Target repository path, defaulting to the current working directory.
- Existing `AGENTS.md`, docs, and `.agents/skills` if present.
- User intent: setup, check, update docs index, refresh workflow guides, or record a repeated mistake.

## Outputs

- Lightweight `AGENTS.md` with always-needed rules.
- Repo-local workflow guides under `.agents/skills`.
- Optional compact docs index in `AGENTS.md`.
- Optional `.harness/security-policy.json` and evidence metadata when verification is requested.
- A short report naming changed files and any commands run.

## Core Workflow

1. Inspect the target repository first.
2. Keep always-needed rules in `AGENTS.md`.
3. Put longer or specialized procedures in `.agents/skills/<name>/SKILL.md`.
4. Resolve `<skill-root>` as the directory containing this `SKILL.md`.
5. Use the bundled helper only when deterministic scaffolding or checks are useful:
   - `node <skill-root>/bin/onboardkit.mjs init --target <repo>`
   - `node <skill-root>/bin/onboardkit.mjs doctor --cwd <repo>`
   - `node <skill-root>/bin/onboardkit.mjs index-docs --source <dir> --name <name> --inject`
6. Do not require an npm package install or a global `onboardkit` command.

## Maintenance Rules

- Keep `AGENTS.md` small and stable.
- Route detailed procedures to workflow guides or docs.
- Prefer explicit guide use over hidden process.
- Treat evidence as a pointer-backed receipt, not a permanent activity ledger.
- Remove stale, duplicate, host-specific, or overly narrow guidance when it no longer helps agents.
- Update durable guidance only when it reflects a repeated failure, project rule, or verification gap.

## Examples

User asks: "Set up this repo for coding agents."
Do: inspect the repo, create or refresh `AGENTS.md`, install `.agents/skills`, and report changed files.

User asks: "Check whether our agent docs are still lightweight."
Do: inspect `AGENTS.md`, docs, and workflow guides; flag stale, duplicated, or overly narrow guidance.

User asks: "Agents keep making the same mistake."
Do: update durable guidance only if the mistake reflects a repeated failure, project rule, or verification gap.

## Constraints

- Do not install npm packages to use onboardkit.
- Do not create host-specific shim files unless the user explicitly asks for a separate adapter design.
- Do not turn evidence into a permanent task ledger.

## When Proof Is Needed

Use verification only for work where a done claim needs evidence. The bundled helper can run command-backed criteria and finish checks:

```bash
node <skill-root>/bin/onboardkit.mjs verify --criteria <criteria.json> --run-id <id>
node <skill-root>/bin/onboardkit.mjs finish --run-id <id>
```

For small documentation-only changes, ordinary tests, syntax checks, and review are usually enough.
