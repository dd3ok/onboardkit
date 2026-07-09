# Decision Log

## ADR-001 — Use AGENTS.md as primary control plane

Status: Accepted

Context: Vercel evals showed `AGENTS.md` docs index outperforming skill-based retrieval for broad framework knowledge. OpenAI Codex loads AGENTS.md before work and treats it as durable project guidance.

Decision: Always-needed rules, docs index, commands, and Definition of Done live in AGENTS.md. Repo-local workflow guides are reserved for vertical procedures.

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
- File-backed artifact/manual evidence is supported.
- UI browser automation and richer runtime evidence require adapters.

## ADR-004 — Provide config example, not active project Codex config

Status: Accepted

Context: Project-scoped Codex config can change agent behavior and some settings belong at user level.

Decision: Include `.codex/config.example.toml`, not `.codex/config.toml`.

Consequences:

- Safer ZIP defaults.
- Teams opt in after trusting the project.

## ADR-005: Prioritize safety and evidence semantics before platform features

Status: Accepted

Context: Prior art and vendor guidance point toward alignment, small changes, explicit routing, policy-aware execution, reviewed learning loops, and fresh proof-of-done. Dynamic eval runners, browser automation, gateways, schedulers, persistent memory, and subagent orchestration are useful, but they can make after-init feel like a platform rather than a compact repo preparation toolkit.

Decision: At the time of this ADR, implement the next improvement pass in this order: command policy v0, shared language and role contracts, finish gate v0, artifact/manual evidence v0, and optional pointer-only run summary. Keep deterministic eval and browser automation in the non-core backlog until the safety and evidence spine is stable.

Consequences:

- Safer command execution becomes the first implementation boundary.
- "Done" is derived from fresh evidence and finish verdicts, not from activity logs.
- Security audit IDs, host shims, and reviewed retro/skill updates can be added as lightweight companion features.
- Browser automation, dynamic eval, gateways, schedulers, persistent memory, autonomous skill mutation, and subagent orchestration remain optional instead of core requirements.

## ADR-006: Enforce command policy before criteria execution

Status: Accepted

Context: `verify` executes user-authored command criteria, which is the current repository's largest safety boundary. The project needs protection from obviously destructive, publishing, network, infrastructure, and shell-chained commands without turning after-init into an OS sandbox or full command runtime.

Decision: Add command policy v0 as an exact-allow and pattern-rule gate before command execution. Deny rules win first, prompt-required rules fail closed unless explicitly approved on the criterion, and allowed commands record policy decisions, timeout, and output limits in `proof.json`.

Consequences:

- Existing sample criteria stay small and command-backed.
- Downstream repositories can commit `.harness/security-policy.json` when they need project-specific allow rules.
- v0 remains intentionally shallow; richer parsing and broader redaction stay as future hardening.

## ADR-007: Keep finish gate evidence-only in v0

Status: Accepted

Context: The project needs a completion verdict, but review blockers, subagent roles, browser automation, and task ledgers can easily turn after-init into a workflow runtime.

Decision: Add `after-init finish --run-id <id>` as an evidence-only gate. It reads `run-report.json` and referenced proofs, validates paths inside the run root, writes `finish-report.json`, and returns `PASS`, `FAIL`, or `INCOMPLETE`. It does not run commands, launch browsers, consume review state, or manage tasks.

Consequences:

- "Tests ran" is no longer equivalent to "done".
- Required missing, pending, or stale evidence blocks completion as `INCOMPLETE`.
- Required failed or policy-blocked evidence returns `FAIL`.
- Review remains a separate Definition of Done step until a machine-readable review blocker contract exists.

## ADR-008: Record non-command evidence as existing file artifacts

Status: Accepted

Context: The criteria schema already includes `artifact`, `screenshot`, `browser-log`, `review`, and `manual`, but launching browsers or collecting runtime logs would pull after-init toward a heavier automation platform.

Decision: Treat those non-command criteria as file-backed evidence in v0. The user or host tool produces the file, and after-init records project-relative path, absolute workspace path, file size, mtime, SHA-256 hash, and artifact kind. The finish gate validates that referenced artifacts still exist inside the workspace and match the recorded hash.

Consequences:

- Screenshot, browser-log, review, and manual evidence can be captured without adding browser or host dependencies.
- Missing required artifacts are `INCOMPLETE`, not behavioral failures.
- Optional missing artifacts become finish warnings.
- Browser automation remains an optional adapter rather than core runtime behavior.

## ADR-009: Keep static security audit shallow and ID-based

Status: Accepted

Context: OpenClaw-style security audit findings are useful, but after-init should not become a policy daemon or runtime permission service. The current safety boundary is local files, command policy, Codex config posture, and evidence persistence.

Decision: Add `after-init doctor --security` as a shallow static audit with stable `AFTER-SEC-*` finding IDs. The audit checks AGENTS.md security guardrails, safe Codex config example posture, unsafe active Codex config, runtime-output git ignores, fail-closed command policy defaults, and evidence redaction patterns.

Consequences:

- Security posture findings are stable enough to discuss, test, and improve over time.
- The audit remains local and deterministic.
- It does not replace host sandboxing, approvals, code review, or deeper secret scanning.
- Broader redaction, richer command parsing, and dependency/network audits remain future hardening.

## ADR-010: Keep skill checks static before semantic eval

Status: Accepted

Context: Workflow-guide routing depends on concise descriptions and predictable `SKILL.md` contracts. A full semantic trigger eval would require prompts, models, and scoring policy, which would push the core toward a benchmark system.

Decision: Add `after-init doctor --guides` as a static audit with stable `AFTER-GUIDE-*` finding IDs. The audit checks that repo-local workflow guides exist, names are unique and folder-matching, descriptions are concise trigger text, required contract sections exist, and guide files stay lightweight.

Consequences:

- Guide quality can be checked deterministically without model calls.
- The check reinforces progressive disclosure and one-job-per-skill guidance.
- Semantic LLM trigger eval remains optional and should be added only if static checks are insufficient.

## ADR-011: Keep host shims pointer-only

Status: Accepted

Context: after-init should be usable from Claude Code, Gemini, Cursor, GitHub Copilot, and similar hosts, but duplicating canonical instructions across host-specific files creates drift. A full adapter installer would be larger than the current improvement pass.

Decision: Add optional `init --host-shims` support for thin `GEMINI.md`, `.github/copilot-instructions.md`, and `.cursor/rules/after-init.mdc` files. Each shim points back to canonical `AGENTS.md` guidance and avoids copying long rules. `CLAUDE.md` remains the existing thin default shim.

Consequences:

- Teams can opt into common host compatibility files without changing the core workflow.
- Canonical project guidance remains in `AGENTS.md`.
- Full adapter installers, generated host-specific skill packages, and host runtime integration remain backlog work.
