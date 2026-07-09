# Best-Practices Audit

Verdict: **MVP follows the intended best-practice direction; several production features remain TODO and are specified.**

## Checklist

| Practice | Status | Evidence in repo | Notes |
|---|---:|---|---|
| AGENTS.md-first durable guidance | Pass | `AGENTS.md`, `templates/AGENTS.template.md` | Always-needed rules and docs index are not hidden in workflow guides. |
| Keep AGENTS.md concise | Pass | `doctor` size check | Warns when exceeding 32 KiB. |
| Docs index instead of full docs injection | Pass | `index-docs`, managed markers | Mirrors Vercel-style compressed index. |
| Workflow guides for vertical procedures | Pass | `.agents/skills/*/SKILL.md` | clarify/specify/design/plan/implement/verify/review/retro. |
| Workflow guides focused on one job | Pass | guide docs, `doctor --guides` | Each guide has one primary trigger and output; static contract checks are enforced. |
| Explicit inputs and outputs | Pass | guide docs, `doctor --guides` | Required by guide instructions and checked by static audit. |
| Shared language and role contracts | Pass | `docs/shared-language.md` | Canonical terms and role boundaries are defined without requiring subagents. |
| Plan before difficult tasks | Pass | `plan` guide, `PLANS.md` | Workflow gates encode this. |
| Evidence-backed done | Pass for MVP | `verify`, `finish`, schemas | Command criteria, file-backed artifact/manual evidence, and finish verdicts implemented. |
| Review separate from implementation | Pass | `review` guide, code review template | Reviewer dimensions defined. |
| Security and approvals | Pass for MVP | `src/lib/security-policy.mjs`, `src/lib/security-audit.mjs`, `docs/SECURITY_MODEL.md`, `.codex/config.example.toml` | Command policy v0 and shallow static audit are implemented; broader redaction and richer parsing remain TODO. |
| Eval-driven workflow improvement | Partial pass | `evals/scenarios`, `eval` command | Static inventory implemented; dynamic runner TODO. |
| Retrospective updates | Pass | `retro` guide, SOT protocol | Repeated mistakes become durable onboardkit changes. |
| Host-agnostic core | Pass by design | architecture docs, root `SKILL.md` | Codex skill source now; host-specific shims stay outside the core. |
| Skill-only distribution | Pass | `SKILL.md`, `agents/openai.yaml`, private `package.json` | npm publishing metadata is intentionally absent. |

## Design correctness judgment

The repo’s design is aligned with current best practice because it does not over-index on any one abstraction.

- It does not rely on guide trigger behavior for global docs.
- It does not bloat AGENTS.md with full documents.
- It does not trust agent completion claims without evidence.
- It does not make every task follow a heavy ceremony.
- It does not place host-specific logic in the conceptual core.

## Main risks

1. **Command policy v0 is intentionally shallow.** It enforces exact allow, deny, prompt-required, timeout, and output limits, but it is not an OS sandbox and does not parse structured command ASTs.
2. **MVP evidence is file-backed, not tool-backed.** Command and artifact/manual proof are implemented, but browser automation and dynamic evidence adapters remain TODO.
3. **Dynamic eval runner is not implemented.** The current eval command creates a scenario inventory.
4. **No enforcement of workflow gates.** Agents are instructed by AGENTS.md/skills, but the helper does not yet block implementation without specs.
5. **No npm package distribution.** This is intentional; onboardkit is a skill source with a bundled helper.

## Required next hardening

Prioritize these TODOs:

1. YAML criteria parser only if JSON criteria become a usability bottleneck.
2. Optional run summary only if `finish` or `status` needs a separate pointer file.
3. Broader redaction and structured command descriptors.
4. Semantic workflow-guide trigger eval only if static `doctor --guides` checks are insufficient.
5. Host adapter installer only if skill-only usage proves insufficient.

Keep browser automation and dynamic eval runner outside the next hardening pass unless a later design explicitly promotes them.
