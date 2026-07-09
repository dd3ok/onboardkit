# Best-Practices Audit

Verdict: **MVP follows the intended best-practice direction; several production features remain TODO and are specified.**

## Checklist

| Practice | Status | Evidence in repo | Notes |
|---|---:|---|---|
| AGENTS.md-first durable guidance | Pass | `AGENTS.md`, `templates/AGENTS.template.md` | Always-needed rules and docs index are not hidden in skills. |
| Keep AGENTS.md concise | Pass | `doctor` size check | Warns when exceeding 32 KiB. |
| Docs index instead of full docs injection | Pass | `index-docs`, managed markers | Mirrors Vercel-style compressed index. |
| Skills for vertical workflows | Pass | `.agents/skills/*/SKILL.md` | clarify/specify/design/plan/implement/verify/review/retro. |
| Skills focused on one job | Pass | skill docs | Each skill has one primary trigger and output. |
| Explicit inputs and outputs | Pass | skill docs | Required by skill instructions. |
| Plan before difficult tasks | Pass | `plan` skill, `PLANS.md` | Workflow gates encode this. |
| Evidence-backed done | Partial pass | `verify` CLI, schemas | Command criteria implemented; finish gate and artifact/manual evidence are TODO. |
| Review separate from implementation | Pass | `review` skill, code review template | Reviewer dimensions defined. |
| Security and approvals | Partial pass | `docs/SECURITY_MODEL.md`, `.codex/config.example.toml` | Policy documented; enforcement engine TODO. |
| Eval-driven workflow improvement | Partial pass | `evals/scenarios`, `eval` command | Static inventory implemented; dynamic runner TODO. |
| Retrospective updates | Pass | `retro` skill, SOT protocol | Repeated mistakes become durable harness changes. |
| Host-agnostic core | Pass by design | architecture docs | Codex-compatible now; adapters TODO. |

## Design correctness judgment

The repo’s design is aligned with current best practice because it does not over-index on any one abstraction.

- It does not rely on skill trigger behavior for global docs.
- It does not bloat AGENTS.md with full documents.
- It does not trust agent completion claims without evidence.
- It does not make every task follow a heavy ceremony.
- It does not place host-specific logic in the conceptual core.

## Main risks

1. **MVP command execution lacks policy enforcement.** Command criteria run, but command allow/deny/prompt rules, timeouts, output limits, and policy proof fields are not implemented.
2. **MVP evidence is command-only.** Finish gate, artifact evidence, manual evidence, and stale/missing distinctions are specified but not implemented.
3. **Dynamic eval runner is not implemented.** The current eval command creates a scenario inventory.
4. **No enforcement of workflow gates.** Agents are instructed by AGENTS.md/skills, but the CLI does not yet block implementation without specs.
5. **No package/plugin distribution.** Codex plugin packaging is designed but not built.

## Required next hardening

Prioritize these TODOs:

1. Command policy v0 and static security audit.
2. Shared language and role contracts.
3. Finish gate v0.
4. Artifact/manual evidence v0.
5. Optional run summary only if needed by `finish` or `status`.
6. Skill trigger and contract checks.
7. Optional host adapter shims.

Keep browser automation and dynamic eval runner outside the next hardening pass unless a later design explicitly promotes them.
