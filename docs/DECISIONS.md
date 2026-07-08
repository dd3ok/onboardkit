# Decision Log

## ADR-001 — Use AGENTS.md as primary control plane

Status: Accepted

Context: Vercel evals showed `AGENTS.md` docs index outperforming skill-based retrieval for broad framework knowledge. OpenAI Codex loads AGENTS.md before work and treats it as durable project guidance.

Decision: Always-needed rules, docs index, commands, and Definition of Done live in AGENTS.md. Skills are reserved for vertical workflows.

Consequences:

- Lower trigger-decision risk.
- AGENTS.md size must be controlled.
- Detailed docs must live outside AGENTS.md and be indexed.

## ADR-002 — Use JSON criteria in MVP

Status: Accepted

Context: YAML is more human-friendly, but a robust YAML parser would add a dependency.

Decision: MVP uses JSON criteria for zero-dependency CLI. YAML support is TODO T03.

Consequences:

- CLI is immediately runnable with Node.js only.
- Future YAML parser can be added without changing evidence schema.

## ADR-003 — Evidence is machine-readable proof, not prose

Status: Accepted

Context: Agent completion claims are unreliable unless tied to fresh verification.

Decision: Command criteria produce `proof.json`, `commands.log`, and `run-report.json`.

Consequences:

- Reports are auditable.
- UI/browser/manual evidence require adapters.

## ADR-004 — Provide config example, not active project Codex config

Status: Accepted

Context: Project-scoped Codex config can change agent behavior and some settings belong at user level.

Decision: Include `.codex/config.example.toml`, not `.codex/config.toml`.

Consequences:

- Safer ZIP defaults.
- Teams opt in after trusting the project.

## ADR-005: Prioritize safety and evidence semantics before platform features

Status: Accepted

Context: Reference frameworks such as Superpowers, Superloopy, BMAD, Matt Pocock skills, Spec Kit, Vercel AGENTS.md guidance, and OpenAI Codex guidance all point toward alignment, small changes, explicit routing, and fresh proof-of-done. Dynamic eval runners, browser automation, and subagent orchestration are useful, but they can make Agent Onboard feel like a platform rather than a compact repo onboarding kit.

Decision: Implement the next improvement pass in this order: command policy v0, shared language and role contracts, finish gate v0, artifact/manual evidence v0, and optional pointer-only run summary. Keep deterministic eval and browser automation in the non-core backlog until the safety and evidence spine is stable.

Consequences:

- Safer command execution becomes the first implementation boundary.
- "Done" is derived from fresh evidence and finish verdicts, not from activity logs.
- Browser automation, dynamic eval, and subagent orchestration remain optional instead of core requirements.
