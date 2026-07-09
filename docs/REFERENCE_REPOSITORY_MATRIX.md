# Reference Repository Matrix

This document records what was extracted from the prior repository and document analysis.

| Source | Role in this repo | Adopted | Guardrail / compensation |
|---|---|---|---|
| Vercel AGENTS.md eval | Evidence for AGENTS.md-first docs index | Compressed docs index in AGENTS.md, local docs retrieval | Skills are not used as primary store for framework-wide docs |
| OpenAI Codex best practices | Vendor baseline for planning, AGENTS.md, testing, review, skills | AGENTS.md, PLANS.md, skills, verification, review | Compliance audit maintained in docs/CODEX_VENDOR_COMPLIANCE.md |
| OpenAI Codex AGENTS.md guide | Discovery, layering, size budget | Root AGENTS.md and doctor size check | Detailed docs live outside AGENTS.md |
| OpenAI Codex skills | Skill structure and best practice | .agents/skills/*/SKILL.md with name/description | Skills are focused vertical workflows |
| OpenAI Codex approvals/security | Safe operation model | config example, security model | Enforcement engine is TODO T06 |
| Next.js 16.2 AI improvements | Example of bundled docs, browser logs, devtools for agents | Browser evidence connector design | Browser adapter is TODO T02 |
| Superpowers | SDLC methodology | clarify -> specify -> design -> plan -> implement -> verify -> review -> retro | Workflow depth is adaptive to avoid excessive ceremony |
| Superloopy | Evidence-first done | command-backed criteria and proof.json | Semantic review is separate from command proof |
| Oh My Codex | Runtime/state layer | .harness runtime directories, doctor/status commands | Host-specific Codex features are adapter TODOs |
| LazyCodex | Hierarchical AGENTS.md and verified loops | AGENTS-first, plan-only workflow, verified completion | Monorepo/nested AGENTS generation is TODO T10 |
| Matt Pocock skills | Misalignment reduction and shared language | clarify skill, acceptance criteria, shared-language principle | Trigger eval automation is TODO T01 |
| Karpathy-inspired skills | Simplicity and surgical changes | AGENTS rules and review checklist | Future unrelated-diff metric in evals |
| BMAD | Role separation and scale-adaptive workflow | reviewer/security roles and TODO subagents | Full multi-agent orchestration is TODO T07 |
| GitHub Spec Kit | spec -> plan -> tasks -> implement artifacts | spec/design/tasks/criteria templates | Evidence gate added to tasks |
| OpenClaw | Security audit, policy checks, skill gating, compatible bundle layouts | Static security audit direction, command policy, optional host shims | Gateway, channels, marketplace, remote node control, and subagent runtime stay out of core |
| Hermes | Reviewed learning loop, skill write approval, context-file compatibility, dangerous command approvals | Retro write-approval policy, AGENTS.md-centered compatibility, safe-mode inspiration | Persistent memory, autonomous skill mutation, scheduler, provider routing, and Kanban board stay out of core |

## Canonical source URLs

- Vercel AGENTS.md eval: https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals
- OpenAI Codex best practices: https://developers.openai.com/codex/learn/best-practices
- OpenAI Codex AGENTS.md guide: https://developers.openai.com/codex/guides/agents-md
- OpenAI Codex skills: https://developers.openai.com/codex/skills
- OpenAI Codex approvals/security: https://developers.openai.com/codex/agent-approvals-security
- OpenAI Codex config reference: https://developers.openai.com/codex/config-reference
- Next.js 16.2 AI improvements: https://nextjs.org/blog/next-16-2-ai
- Superpowers: https://github.com/obra/superpowers
- Superloopy: https://github.com/beefiker/superloopy
- Oh My Codex: https://github.com/Yeachan-Heo/oh-my-codex
- LazyCodex: https://github.com/code-yeongyu/lazycodex
- Matt Pocock skills: https://github.com/mattpocock/skills
- Karpathy-inspired skills: https://github.com/multica-ai/andrej-karpathy-skills
- BMAD method: https://github.com/bmad-code-org/bmad-method
- GitHub Spec Kit: https://github.com/github/spec-kit
- OpenClaw repository: https://github.com/openclaw/openclaw
- OpenClaw skills: https://docs.openclaw.ai/tools/skills
- OpenClaw security audit checks: https://docs.openclaw.ai/gateway/security/audit-checks
- OpenClaw policy checks: https://docs.openclaw.ai/cli/policy
- Hermes repository: https://github.com/NousResearch/hermes-agent
- Hermes skills system: https://hermes-agent.nousresearch.com/docs/user-guide/features/skills
- Hermes context files: https://hermes-agent.nousresearch.com/docs/user-guide/features/context-files
- Hermes security: https://hermes-agent.nousresearch.com/docs/user-guide/security
