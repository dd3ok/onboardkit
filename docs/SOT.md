# Source of Truth (SOT)

Updated: 2026-07-09

This document is the canonical map for onboardkit. When documents disagree, resolve conflicts using this priority order.

## Authority order

This SOT delegates future improvement priority and scope boundaries to `docs/IMPROVEMENT_ROADMAP_DESIGN.md`. If that roadmap conflicts with older TODO ordering, prefer the roadmap for future work and update `docs/STATUS.md` before implementation.

1. `docs/SOT.md` — canonical map and governance.
2. `AGENTS.md` — always-on operational rules for agents.
3. `docs/ARCHITECTURE.md` — architecture and layer model.
4. `docs/CODEX_VENDOR_COMPLIANCE.md` — OpenAI Codex compliance decisions.
5. `docs/BEST_PRACTICES_AUDIT.md` — best-practice checklist and judgment.
6. `docs/STATUS.md` — current implemented vs TODO state.
7. `docs/TODO_FEATURE_DESIGNS.md` — implementable designs for future work.
8. `docs/DECISIONS.md` — ADR-style decision history.
9. `templates/` and `.agents/skills/` — executable instructions and generated artifacts.
10. `.harness/evidence/` — run-specific proof, not durable policy.

## Product definition

onboardkit is a lightweight Codex skill for preparing repositories for AI coding agents. It combines:

- A root `SKILL.md` entrypoint for skill installation.
- AGENTS.md-first durable guidance.
- Compressed local docs indexes.
- Shared vocabulary and role contracts.
- Codex-compatible repo-local workflow guides for vertical workflows.
- Spec/design/tasks artifacts.
- Command policy before criteria execution.
- Static security audit findings with stable IDs.
- Static workflow-guide contract findings with stable IDs.
- Command-backed evidence.
- File-backed artifact/manual evidence with hashes.
- Finish verdicts over evidence runs.
- Best-practice and vendor compliance audits.
- Eval scenario inventory.

## Non-goals for the current MVP

- It is not a full autonomous agent runtime.
- It does not replace Codex, Claude Code, Cursor, Copilot, or other hosts.
- It is not an npm package or global CLI distribution.
- It does not yet provide a full dynamic eval runner.
- It does not yet provide browser automation evidence.
- It does not enforce OS-level sandboxing itself; it documents and integrates with host sandboxing.

## Canonical workflows

### Tiny fix

```text
inspect -> patch -> verify -> review
```

### Small feature

```text
clarify -> mini-spec -> plan -> implement -> verify -> review
```

### Large feature or migration

```text
clarify -> specify -> design -> tasks -> implement slices -> evidence -> review [-> retro when repeated failures or process gaps occur]
```

## SOT update protocol

Update this document when:

- A new layer is added to the architecture.
- A TODO item is promoted to implemented.
- A vendor compliance requirement changes.
- A repeated failure becomes a durable rule.
- A new docs source becomes authoritative.

Each update must also check:

- `AGENTS.md` stays concise.
- `docs/STATUS.md` reflects current state.
- `docs/DECISIONS.md` records architectural decisions.
- New features have tests or explicit verification criteria.

## Additional repository documents

- Build verification: `docs/BUILD_VERIFICATION.md`
- Improvement roadmap design: `docs/IMPROVEMENT_ROADMAP_DESIGN.md`
- Security model: `docs/SECURITY_MODEL.md`
- Shared language and role contracts: `docs/shared-language.md`
- Evidence contract: `docs/evidence.md`
- Finish gate: `docs/finish-gate.md`

## External source references

- Vercel AGENTS.md eval: https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals
- OpenAI Codex best practices: https://developers.openai.com/codex/learn/best-practices
- OpenAI Codex AGENTS.md guide: https://developers.openai.com/codex/guides/agents-md
- OpenAI Codex skills: https://developers.openai.com/codex/skills
- OpenAI Codex approvals and security: https://developers.openai.com/codex/agent-approvals-security
- OpenAI Codex config reference: https://developers.openai.com/codex/config-reference
- Next.js 16.2 AI improvements: https://nextjs.org/blog/next-16-2-ai
- OpenClaw repository: https://github.com/openclaw/openclaw
- OpenClaw skills: https://docs.openclaw.ai/tools/skills
- OpenClaw security audit checks: https://docs.openclaw.ai/gateway/security/audit-checks
- Hermes repository: https://github.com/NousResearch/hermes-agent
- Hermes skills system: https://hermes-agent.nousresearch.com/docs/user-guide/features/skills
- Hermes security: https://hermes-agent.nousresearch.com/docs/user-guide/security
