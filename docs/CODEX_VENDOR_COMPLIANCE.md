# OpenAI Codex Vendor Compliance Audit

Verdict: **Compliant with core Codex guidance for AGENTS.md, skills, planning, verification, and safe configuration; production-grade adapter/plugin work remains TODO.**

This audit maps the repository to the current OpenAI Codex guidance.

## 1. Best-practice prompt structure

OpenAI recommends giving Codex goal, context, constraints, and done condition for reliable work.

Repository implementation:

- `templates/brief.template.md` captures request, assumptions, acceptance criteria, non-goals, and risks.
- `templates/spec.template.md` captures problem, users, what, why, constraints, edge cases, and success metrics.
- `AGENTS.md` defines Definition of Done.

Status: **Pass**

Reference: https://developers.openai.com/codex/learn/best-practices

## 2. Plan first for difficult tasks

OpenAI recommends planning or interviewing before coding for complex, ambiguous, or hard-to-describe tasks.

Repository implementation:

- `AGENTS.md` defines workflow depth and gates.
- `.agents/skills/clarify` handles interviews.
- `.agents/skills/plan` generates executable tasks and criteria.
- `PLANS.md` is a long-running plan template.

Status: **Pass**

## 3. Reusable guidance with AGENTS.md

OpenAI describes `AGENTS.md` as durable project guidance that loads automatically.

Repository implementation:

- Root `AGENTS.md` contains concise operating rules, commands, Definition of Done, docs index, and security rules.
- `templates/AGENTS.template.md` provides an installable scaffold.
- `doctor` checks `AGENTS.md` exists and is under the default 32 KiB project-doc threshold.
- Detailed material is referenced in `docs/` instead of bloating root guidance.

Status: **Pass**

Reference: https://developers.openai.com/codex/guides/agents-md

## 4. AGENTS.md discovery and size

OpenAI documents layered AGENTS.md discovery and a default combined project-doc size limit.

Repository implementation:

- The repo uses root `AGENTS.md` as the default control plane.
- The design allows future nested `AGENTS.md` files but does not require them.
- The doctor command warns if root `AGENTS.md` exceeds 32 KiB.

Status: **Pass for MVP**

Future improvement:

- Add nested `AGENTS.md` generation for monorepos and package-specific rules.

## 5. Skills format

OpenAI Codex skills require a skill directory with `SKILL.md`, and `SKILL.md` must include `name` and `description`. Codex scans `.agents/skills` in repo scopes.

Repository implementation:

- Skills are stored under `.agents/skills/<skill>/SKILL.md`.
- Every skill has YAML frontmatter with `name` and `description`.
- Optional `agents/openai.yaml` files are included.
- Each skill focuses on one workflow.
- Descriptions are front-loaded with trigger words.

Status: **Pass**

Reference: https://developers.openai.com/codex/skills

## 6. Skill best practices

OpenAI recommends keeping skills focused, preferring instructions over scripts unless deterministic behavior is needed, writing imperative steps with explicit inputs/outputs, and testing trigger behavior.

Repository implementation:

- Most skills are instruction-only.
- `verify` includes a small deterministic helper script.
- Inputs, outputs, steps, and completion criteria are included.
- `doctor --skills` checks skill inventory, unique folder-matching names, concise trigger descriptions, contract sections, and file size.
- The roadmap keeps semantic trigger eval optional unless static checks prove insufficient.

Status: **Pass for static skill contracts; semantic trigger eval automation remains optional TODO**

## 7. Testing and review

OpenAI recommends asking Codex to create/update tests, run checks, confirm behavior, and review diffs.

Repository implementation:

- `verify` executes command-backed criteria.
- `finish` consumes evidence and produces a `PASS`, `FAIL`, or `INCOMPLETE` verdict.
- `review` skill checks spec compliance, correctness, evidence, simplicity, security, maintainability, and regression risk.
- `templates/code_review.template.md` is intended to be referenced from AGENTS.md in downstream repos.

Status: **Pass for command-backed verification and finish verdicts; partial for richer review automation**

## 8. Security, sandboxing, approvals, network access

OpenAI Codex security guidance centers on sandbox mode, approval policy, and network controls.

Repository implementation:

- `docs/SECURITY_MODEL.md` documents safe defaults.
- `verify` enforces command policy v0 for command-backed criteria.
- `doctor --security` emits stable static findings for repo security posture.
- `.codex/config.example.toml` uses `approval_policy = "on-request"`, `sandbox_mode = "workspace-write"`, and `network_access = false`.
- No active `.codex/config.toml` is installed by default, avoiding unexpected project-local overrides.
- `AGENTS.md` prohibits `danger-full-access` as a default.

Status: **Pass for documented safe defaults, command policy v0, and shallow static audit; broader redaction remains TODO**

References:

- https://developers.openai.com/codex/agent-approvals-security
- https://developers.openai.com/codex/config-reference

## 9. Project-local configuration boundaries

OpenAI config reference notes that some config belongs at user level and some project-scoped settings are ignored or constrained.

Repository implementation:

- The repo provides `.codex/config.example.toml` rather than active `.codex/config.toml`.
- Comments tell teams to keep provider/auth/telemetry in user-level config.

Status: **Pass**

## 10. Host compatibility shims

Agent hosts use different repository instruction surfaces, but duplicating long guidance across all of them creates drift.

Repository implementation:

- `CLAUDE.md` remains a thin pointer to `AGENTS.md`.
- `init --host-shims` can optionally create `GEMINI.md`, `.github/copilot-instructions.md`, and `.cursor/rules/agent-onboard.mdc`.
- These files point back to canonical `AGENTS.md` guidance and avoid duplicating long rules.

Status: **Pass for pointer-only shims; full adapter installers remain TODO**

## 11. Improvement loop

OpenAI recommends updating AGENTS.md after repeated mistakes and using evals/scripts/artifacts for hard iterative work.

Repository implementation:

- `retro` skill turns repeated mistakes into AGENTS.md, skill, template, verifier, or eval updates.
- `evals/scenarios` and `docs/EVAL_METHODOLOGY.md` define the comparison matrix.

Status: **Partial pass** because dynamic eval execution remains TODO.

## Summary

The repository follows Codex vendor guidance in the areas that can be encoded in a static repository skeleton today. The main gaps are implementation depth, not direction:

- Browser and dynamic evidence adapters.
- Evidence freshness hardening beyond current proof flags.
- Semantic skill trigger eval automation.
- Dynamic eval runner.
- Full host adapter installers.
- Codex plugin packaging.
