# Vendor Skill Compliance Audit

Verdict: **Compliant with core Codex guidance and broadly compatible with Claude Code and Google Antigravity skill guidance. Distribution is skill-folder first; production-grade adapters/plugins remain non-core.**

This audit maps the repository to current skill guidance from OpenAI Codex, Claude Code/Anthropic, and Google Antigravity.

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

## 5. Skill and repo-local workflow guide format

OpenAI Codex skills require a skill directory with `SKILL.md`, and `SKILL.md` must include `name` and `description`. onboardkit now uses root `SKILL.md` as the installable skill entrypoint and stores repo-local workflow guides in the same Codex-compatible shape.

Repository implementation:

- Root `SKILL.md` defines the onboardkit skill.
- Root `agents/openai.yaml` provides UI metadata.
- Guides are stored under `.agents/skills/<guide>/SKILL.md`.
- Every guide has YAML frontmatter with `name` and `description`.
- Optional `agents/openai.yaml` files are included.
- Each guide focuses on one workflow.
- Descriptions are front-loaded with trigger words.

Status: **Pass**

Reference: https://developers.openai.com/codex/skills

## 6. Workflow guide best practices

OpenAI recommends keeping procedural files focused, preferring instructions over scripts unless deterministic behavior is needed, writing imperative steps with explicit inputs/outputs, and testing trigger behavior.

Repository implementation:

- Most guides are instruction-only.
- `verify` includes a small deterministic helper script.
- Inputs, outputs, steps, and completion criteria are included.
- `doctor --guides` checks guide inventory, unique folder-matching names, concise trigger descriptions, contract sections, and file size.
- The roadmap keeps semantic trigger eval optional unless static checks prove insufficient.

Status: **Pass for static guide contracts; semantic trigger eval automation remains optional TODO**

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

## 10. Host boundary

Agent hosts use different repository instruction surfaces, but duplicating long guidance across all of them creates drift.

Repository implementation:

- onboardkit is distributed as a Codex skill source, not as host-specific shims.
- The bundled helper installs canonical `AGENTS.md` guidance and repo-local workflow guides only.
- Additional host adapters remain outside the core unless a later design promotes them.

Status: **Pass for skill-only MVP; additional host adapters remain non-core**

## 11. Claude Code compatibility

Claude Code skills are filesystem-based. A skill has a `SKILL.md` file with YAML frontmatter and markdown instructions, and the description is the main trigger signal. Claude Code can load skills from personal `~/.claude/skills/` or project `.claude/skills/` locations; command names come from the skill directory name in those locations.

Repository implementation:

- Root `SKILL.md` has concise YAML frontmatter and markdown body.
- The skill directory name `onboardkit` should be used when installing into `~/.claude/skills/onboardkit`.
- README documents the Claude Code install path separately from Codex and Antigravity paths.
- The skill body stays concise and moves deterministic behavior into the bundled helper.
- Host-specific `CLAUDE.md` shims are not generated by default.

Status: **Pass for skill format and documented install path; no Claude-specific adapter is included**

Reference: https://code.claude.com/docs/en/skills

## 12. Anthropic Agent Skills compatibility

Anthropic describes Agent Skills as filesystem resources with instructions, metadata, and optional scripts/templates. Skills use progressive disclosure: metadata is loaded up front, the `SKILL.md` body loads when triggered, and resources/scripts are used as needed.

Repository implementation:

- Root `SKILL.md` includes `name` and `description`.
- The bundled helper under `bin/` is optional deterministic code, used only when useful.
- README keeps runtime proof as an optional receipt rather than an always-on ledger.
- `SKILL.md` includes examples and constraints so the task boundary is clear after loading.

Status: **Pass**

Reference: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview

## 13. Google Antigravity compatibility

Google Antigravity skills are directory-based packages with `SKILL.md` and optional scripts, references, or templates. The codelab documents global skills under `~/.gemini/config/skills/` and project/workspace skills under `<project-root>/.agents/skills/`.

Repository implementation:

- README documents both `~/.gemini/config/skills/onboardkit` and `<project-root>/.agents/skills/onboardkit`.
- Repo-local workflow guides are already stored under `.agents/skills`, matching Antigravity project-scope conventions.
- `SKILL.md` includes goal-oriented instructions, examples, constraints, and helper script references.
- `description` is specific enough to act as a trigger phrase for setup, refresh, docs indexing, stale guidance cleanup, and lightweight checks.

Status: **Pass**

Reference: https://codelabs.developers.google.com/getting-started-with-antigravity-skills

## 14. Improvement loop

OpenAI recommends updating AGENTS.md after repeated mistakes and using evals/scripts/artifacts for hard iterative work.

Repository implementation:

- `retro` guide turns repeated mistakes into AGENTS.md, workflow guide, template, verifier, or eval updates.
- `evals/scenarios` and `docs/EVAL_METHODOLOGY.md` define the comparison matrix.

Status: **Partial pass** because dynamic eval execution remains TODO.

## Summary

The repository follows Codex vendor guidance in the areas that can be encoded in a static repository skeleton today. The main gaps are implementation depth, not direction:

- Browser and dynamic evidence adapters.
- Evidence freshness hardening beyond current proof flags.
- Semantic workflow-guide trigger eval automation.
- Dynamic eval runner.
- Additional host adapter installers.
- Codex plugin packaging beyond the simple skill source.
