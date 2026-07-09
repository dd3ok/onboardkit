# Basic Harness Kit Research Addendum

Date: 2026-07-09

Authority: research addendum for future Agent Onboard improvements. This document does not replace `docs/IMPROVEMENT_ROADMAP_DESIGN.md`; it validates that roadmap against current vendor guidance and newer agent projects.

Synchronization: if any recommendation here is promoted into the roadmap, update `docs/IMPROVEMENT_ROADMAP_DESIGN.md`, `docs/STATUS.md`, `docs/DECISIONS.md`, `docs/SOT.md`, and the managed docs index in `AGENTS.md` in the same change.

## Scope

This addendum answers four questions:

1. Is the current AGENTS.md and skill strategy aligned with current vendor guidance?
2. What else belongs in a basic repo-level harness kit?
3. What should be learned from OpenClaw and Hermes without turning Agent Onboard into a full agent runtime?
4. Which additions should be core, optional adapter work, or deferred backlog?

The sources are primarily vendor docs, project docs, and project repositories. Community or news sources were treated as discovery signals only and are not used as primary proof here.

## Executive Conclusion

The current direction is sound. Agent Onboard should remain an AGENTS.md-first, skill-routed, evidence-backed repo preparation kit. The current skills are broadly compliant with the open Agent Skills shape: each skill is a focused `SKILL.md` workflow with `name`, `description`, inputs, outputs, steps, and completion criteria.

The strongest missing pieces are implementation depth, not philosophy:

1. Command policy hardening beyond v0.
2. Shared vocabulary and role contracts.
3. Finish gate with fresh evidence semantics.
4. Artifact/manual evidence with hashes and provenance.
5. Skill contract checks and optional semantic trigger evals.
6. Conflict-aware vendor shims for Claude, Gemini, Cursor, and Copilot.
7. Retro/skill-change staging so durable learning is reviewed before it lands.
8. Optional run/verify recipe capture for downstream repos.

Keep out of core: chat channels, gateways, schedulers, persistent personal memory, background agent fleets, browser automation by default, plugin marketplaces, and all-action ledgers.

## Current Compliance Snapshot

| Surface | Current status | Evidence | Gap |
| --- | --- | --- | --- |
| Root `AGENTS.md` | Pass | Concise operating principles, commands, DoD, routing, docs index, security rules | Keep under size budget as docs grow |
| Codex repo skills | Pass | `.agents/skills/<name>/SKILL.md`; all skills have frontmatter, focused bodies, and `doctor --skills` static checks | Semantic trigger eval automation remains optional |
| Claude Code compatibility | Partial pass | Root `CLAUDE.md` shim points to `AGENTS.md`; skills use `SKILL.md` format | No dedicated Claude skill/plugin adapter |
| Gemini compatibility | Partial pass | Optional `init --host-shims` creates a thin `GEMINI.md` pointer | No full Gemini adapter or generated skill package |
| Cursor compatibility | Partial pass | Optional `init --host-shims` creates `.cursor/rules/agent-onboard.mdc` as a thin pointer | No full Cursor adapter or generated skill package |
| GitHub Copilot compatibility | Partial pass | Root `AGENTS.md` helps Copilot coding agent; optional `init --host-shims` creates `.github/copilot-instructions.md` | No full Copilot adapter |
| Evidence collection | Pass for MVP | Command-backed `verify`, file-backed artifact/manual evidence, and finish gate v0 exist | Browser automation and dynamic evidence adapters remain TODO |
| Security posture | Pass for MVP | Security model, safe config example, command policy v0, and shallow `doctor --security` audit exist | Broader redaction and richer parsing remain TODO |
| Review | Pass as workflow guidance | `review` and `security-review` skills exist | Machine-readable review blocker contract is not ready |
| Eval | Partial | Static eval inventory exists | Deterministic eval runner and skill-trigger tests are TODO |

## Vendor Guidance Fit

### OpenAI Codex

OpenAI Codex guidance maps closely to the current design:

- Codex reads `AGENTS.md` before work and layers global plus project guidance.
- Root guidance should cover layout, commands, build/test/lint, conventions, constraints, and done/verification.
- Codex skills use progressive disclosure: the model sees name, description, and path first, then loads full `SKILL.md` when needed.
- Skills should be focused on one job, prefer instructions over scripts unless deterministic behavior is needed, and use concise trigger descriptions.
- Codex security separates approval policy from sandbox mode and warns against no-sandbox/no-approval operation as a default.

Assessment: pass for structure, partial for enforcement. The next implementation work should stay focused on command policy, proof freshness, and finish verdicts.

### Anthropic Claude Code

Claude Code guidance reinforces the same separation:

- Put recurring project facts in context files.
- Move repeated procedures into skills when a context file grows into process.
- Keep large memory/context files concise because they affect adherence.
- Use sandboxing, permission rules, and managed settings for repeatable security posture.

Assessment: partial. Agent Onboard already has a `CLAUDE.md` shim and focused skills, but it does not yet provide a Claude-oriented adapter that maps repo skills into the host's preferred skill distribution surface.

### Cursor

Cursor guidance distinguishes static rules from dynamic skills:

- Static always-needed rules belong in rules.
- Dynamic procedures belong in skills.
- Avoid dumping huge style guides, every command, or rare edge cases into always-on context.
- Update rules after repeated mistakes.

Assessment: partial pass. `init --host-shims` now generates a thin `.cursor/rules/agent-onboard.mdc` pointer without duplicating canonical text. A full Cursor adapter remains backlog work.

### GitHub Copilot

GitHub Copilot supports repository custom instructions and Copilot coding agent support for `AGENTS.md`.

Assessment: partial pass. Root `AGENTS.md` is useful already, and `init --host-shims` now generates a thin `.github/copilot-instructions.md` pointer. A full Copilot adapter remains backlog work because conflicting instructions are explicitly risky across custom instruction surfaces.

### Gemini CLI

Gemini CLI uses `GEMINI.md` context files with hierarchical loading.

Assessment: partial pass. `init --host-shims` now generates a thin `GEMINI.md` pointer to `AGENTS.md` for Gemini users. A full Gemini adapter remains backlog work.

### Agent Skills Open Standard

The open Agent Skills model centers on progressive disclosure:

- discovery from `name` and `description`
- activation by reading `SKILL.md`
- execution with optional references or scripts

Assessment: pass for current skills. The next useful addition is a skill-trigger and skill-contract eval so this remains true as more skills are added.

## Current Skill Compliance

All current skills pass the basic structural checks:

- `name` and `description` frontmatter exists.
- Each skill lives under `.agents/skills/<name>/SKILL.md`.
- Each skill has one primary job.
- Each skill declares inputs and outputs.
- Each skill has operational steps and completion criteria.

Detailed notes:

| Skill | Status | Notes |
| --- | --- | --- |
| `clarify` | Pass | Good fit for ambiguity, risk, acceptance criteria, and non-goals. |
| `specify` | Pass | Good product behavior and what/why separation. |
| `design` | Pass | Good for architecture, interfaces, risks, alternatives, rollback. |
| `plan` | Pass | Good executable task slicing and criteria output. |
| `tdd` | Pass | Correctly conditional on feasible automated tests. |
| `implement` | Pass | Scoped implementation and immediate verification. |
| `verify` | Pass for MVP | Correctly creates command and file-backed artifact/manual evidence under command policy and finish semantics. |
| `review` | Pass | Correctly separates review from verification. |
| `security-review` | Pass | Correctly focused on secrets, auth, network, injection, destructive ops. |
| `retro` | Pass with governance TODO | Good learning loop; should stage AGENTS/skill/template changes for review before durable updates land. |
| `docs-index` | Pass | Strong AGENTS.md-first retrieval pattern. |
| `eval` | Partial | Good concept; should distinguish current static inventory from future deterministic/dynamic eval execution. |

Recommended lightweight skill-quality additions:

1. Add `agent-onboard doctor --skills` checks for skill description length, frontmatter, duplicate names, missing inputs/outputs, and overly broad descriptions. Status: implemented v0.
2. Add a small trigger-fixture file for each skill with should-trigger and should-not-trigger prompts if static checks prove insufficient.
3. Add an eval mode that checks trigger routing without running LLM-heavy benchmarks by default if teams need semantic routing evidence.
4. Add a policy that `retro` proposes durable changes as a patch or staged artifact, not silent mutation.

## What To Add To A Basic Harness Kit

### 1. Command Policy And Security Audit

Recommendation: command policy is core. Static security audit findings are a companion slice. Status: command policy v0 and shallow static audit v0 are implemented.

Why: current command-backed criteria are the main place where the kit executes code. This is the highest leverage safety boundary.

Minimum command-policy v0 shape:

- structured command descriptors
- deny rules
- prompt-required rules
- exact allow rules
- non-interactive fail-closed behavior
- command timeout
- output size limits
- secret redaction before persistence
- policy decision recorded in `proof.json`

Static audit companion shape:

- stable finding IDs
- shallow `doctor --security` checks
- command policy, sandbox/network posture, data handling, secrets, and evidence-log checks

OpenClaw validates this direction with structured security audit findings, policy check IDs, sandbox posture checks, secret posture checks, and command approval policy checks. Hermes validates the same idea with dangerous command approval modes and explicit `--yolo`/safe-mode boundaries.

Keep it lightweight: static checks and local policy enforcement only. Do not build a full runtime permission service.

### 2. Shared Language And Role Contracts

Recommendation: core.

Why: the current workflow uses terms like criterion, proof, evidence, artifact, review, finish, and run state. These need one canonical definition so agents do not confuse "ran commands" with "done".

Minimum shape:

- `docs/shared-language.md`
- role contracts for implementer, verifier, reviewer, security reviewer
- clear states: pass, fail, incomplete, pending, missing, stale, warn

This is already correctly prioritized in the roadmap.

### 3. Finish Gate

Recommendation: core.

Why: a finish gate consumes evidence and returns a verdict. It prevents "tests ran" from being treated as "task complete".

Minimum shape:

- `agent-onboard finish --run-id <id>`
- PASS only when required evidence is fresh and passed
- FAIL for actual failed required evidence or policy denial
- INCOMPLETE for missing, stale, pending, unsupported, or unavailable required evidence
- warnings for optional evidence issues

Important boundary: self-review is not the same thing as evidence. Review remains a required workflow step when selected, but `finish` v0 should not consume review state until a machine-readable blocker contract exists.

### 4. Artifact And Manual Evidence

Recommendation: core after finish gate. Status: finish gate v0 and artifact/manual evidence v0 are implemented.

Why: basic kits need to record non-command proof without owning browser automation.

Minimum shape:

- file exists
- file size
- timestamp
- SHA-256 hash
- artifact subtype for screenshot and browser log
- manual note or external evidence reference

Do not launch a browser in core. Let host tools produce screenshots/logs; Agent Onboard records and hashes them.

### 5. Vendor Shim Generator

Recommendation: optional adapter, not core execution path. Status: implemented as pointer-only v0 through `init --host-shims`; full adapter installers remain backlog work.

Why: teams use Codex, Claude Code, Cursor, Copilot, Gemini, and other hosts. Agent Onboard should make canonical guidance portable without duplicating source of truth.

Minimum shape:

- `CLAUDE.md` shim already exists and should remain thin.
- `GEMINI.md` shim points to `AGENTS.md` and docs/SOT.
- `.github/copilot-instructions.md` shim points to `AGENTS.md` and avoids duplicate rules.
- `.cursor/rules/agent-onboard.mdc` shim maps always-on rules and points to `AGENTS.md`.
- Optional generator command, not installed by default.

Guardrail: generated shims must reference canonical guidance. They must not fork rules into drifting copies.

### 6. Skill Trigger And Contract Eval

Recommendation: core-adjacent, low overhead.

Why: skills rely on descriptions as routing triggers. As skills grow, vague descriptions cause missed or wrong activation.

Minimum shape:

- static metadata checks in `doctor`
- prompt fixtures per skill
- deterministic validations where possible
- LLM-based trigger eval only as optional/non-core

This is the most useful addition for proving that the skill set follows vendor guidance over time.

### 7. Retro And Skill-Write Approval

Recommendation: core workflow policy, optional tool support.

Why: Hermes shows the value and risk of self-improving skills. Agent Onboard should learn from repeated failures, but durable changes to AGENTS.md, skills, templates, or verifier logic should be reviewable.

Minimum shape:

- `retro` outputs a proposed patch or staged artifact.
- Durable updates require human or reviewer acceptance before merge.
- Skill changes should include trigger examples and completion criteria.
- No background autonomous skill mutation in core.

This keeps the useful part of Hermes' learning loop without inheriting a persistent self-modifying assistant.

### 8. Run/Verify Recipe Capture

Recommendation: optional.

Why: downstream repos often need "how to run locally" and "how to verify done" recipes. This is an Agent Onboard compatibility recommendation, not a stated vendor requirement.

Minimum shape:

- infer or record launch/test/lint commands
- store in docs or criteria templates
- let users confirm before writing
- keep it as repo setup material, not runtime state

## OpenClaw Analysis

OpenClaw is a personal AI assistant runtime, not just a repo harness. Its docs describe:

- a local personal assistant that answers across chat channels
- a Gateway control plane
- channel integrations
- skills as `SKILL.md` instruction packs
- workspace and personal skill roots, including `.agents/skills`
- skill gating, allowlists, environment injection, and snapshots
- security audit checks with structured `checkId` findings
- policy checks for channels, MCP, model providers, SSRF posture, workspace access, sandbox posture, data handling, secrets, and exec approvals
- SecretRefs and secret audits
- shallow vs deep status diagnostics
- subagents as separate background runs with isolated sessions and reduced tool surface
- plugin manifests and compatible bundle layouts

What to adopt:

1. Structured audit findings with stable IDs.
2. Security policy checks for command execution, sandbox/network posture, data handling, secrets, and evidence logs.
3. Skill metadata checks and optional skill allowlists.
4. Shallow `doctor` vs deeper audit modes.
5. Redaction and secret posture checks before evidence is persisted.
6. Optional compatible bundle/shim generation.

What not to adopt into core:

1. Gateway process.
2. Messaging channels.
3. Always-on personal assistant state.
4. Skill marketplace or plugin install system.
5. Environment injection into arbitrary skill runs.
6. Subagent orchestration runtime.
7. Remote node or control-plane policy.

Reasoning: those features are valuable for a personal assistant platform, but Agent Onboard's product boundary is repo preparation and completion evidence.

## Hermes Analysis

Hermes is also a broader agent runtime. Its docs and repo describe:

- a self-improving agent with a built-in learning loop
- skill creation and improvement from experience
- persistent memory and user profile data
- messaging platforms and cron jobs
- context file compatibility with `.hermes.md`, `AGENTS.md`, `CLAUDE.md`, `.cursorrules`, and `.cursor/rules`
- dangerous command approval modes: manual, smart, and off
- `--safe-mode`, `--ignore-rules`, and `--yolo` style switches
- agent-managed skills via `skill_manage`
- `skills.write_approval` that stages skill changes for approve/reject review
- memory write approval
- Kanban-style durable multi-agent collaboration board
- contribution priorities that rank bug fixes, compatibility, security hardening, performance/robustness, then new skills/tools

What to adopt:

1. Skill/retro write approval as a policy concept.
2. Clear distinction between memory facts and skill procedures.
3. Context-file compatibility strategy, with AGENTS.md as primary project context.
4. Dangerous-command approval semantics and safe diagnostic mode inspiration.
5. Evidence-based done and goal/finish clarity.
6. Preference for skills over new tools when the agent already has the needed capabilities.

What not to adopt into core:

1. Autonomous skill mutation.
2. Persistent personal memory.
3. Messaging gateway.
4. Cron scheduler.
5. Multi-agent task board.
6. Model/provider routing.
7. Background self-improvement process.

Reasoning: Hermes is strong evidence for a reviewed learning loop, but not for putting self-modifying runtime behavior into a compact repo kit.

## Recommended Revised Roadmap

The original safety spine is now implemented except for optional run summary, which remains conditional:

```text
1. Command policy v0
2. Shared language and role contracts
3. Finish gate v0
4. Artifact/manual evidence v0
5. Optional run summary, only if finish/status needs a separate pointer file
```

Status note: command policy v0, shared language and role contracts, finish gate v0, artifact/manual evidence v0, and shallow static security audit v0 are now implemented. Optional run summary is not required while `run-report.json` and `finish-report.json` cover the pointer need.

The current next implementation order is:

```text
1. YAML criteria parser, only if JSON criteria become a usability bottleneck
2. Optional run summary, only if finish/status needs a separate pointer file
3. Broader redaction and structured command descriptors
4. Semantic skill trigger eval, only if static `doctor --skills` checks are insufficient
5. Host adapter installer, only if pointer-only shims are insufficient
```

Add these as explicit companion items, not as priority blockers:

```text
1a. Static security audit output with stable finding IDs (implemented v0)
2a. Vendor compatibility matrix and shim generator design
2b. Skill trigger and contract checks in doctor (static doctor check implemented v0)
3a. Review-blocker input contract design, but not in finish v0
4a. Evidence provenance manifest for artifacts and redacted logs
5a. Retro/skill-change staging policy
```

Keep these in non-core backlog:

```text
- dynamic LLM eval runner
- browser automation runner
- subagent orchestration
- chat/channel runtime
- scheduler or cron
- plugin marketplace
- persistent memory
- all-action task ledger
- dashboards
```

## Practical Additions By Priority

| Priority | Addition | Core? | Why |
| --- | --- | --- | --- |
| P0 | Command policy v0 | Yes | Main safety boundary for command-backed criteria |
| P0 | Secret redaction and output limits | Yes | Evidence logs can leak sensitive data |
| P1 | Shared language docs | Yes | Prevents confusion between proof, review, and done |
| P1 | Finish gate | Yes | Converts evidence into PASS/FAIL/INCOMPLETE |
| P1 | Artifact/manual evidence hashes | Yes, implemented v0 | Covers screenshots, logs, docs, and manual proof without browser runtime |
| P2 | Skill contract checks | Yes, implemented v0 | Keeps skills aligned with vendor progressive-disclosure guidance |
| P2 | Static security audit IDs | Companion, implemented v0 | Useful after command policy v0; should stay shallow and local |
| P2 | Vendor shims | Optional adapter, implemented pointer-only v0 | Useful for Claude/Gemini/Cursor/Copilot without duplicating rules |
| P2 | Retro write approval | Policy now, tool later | Keeps learning loop reviewed |
| P3 | Run/verify recipe generator | Optional | Helpful setup workflow, not a completion gate |
| P3 | Nested AGENTS scanner | Optional | Good for monorepos, but generation should be explicit |

## Cross-Reference Matrix

| Idea | Source basis | Agent Onboard fit | Placement | Risk if copied too broadly | Recommendation |
| --- | --- | --- | --- | --- | --- |
| Keep durable project rules in `AGENTS.md` | AGENTS.md format, OpenAI Codex, Copilot coding agent, Hermes context files | Strong | Core control plane | Bloated always-on context | Keep concise and index docs |
| Put procedures in skills | Agent Skills standard, OpenAI Codex skills, Claude Code skills, Cursor skills, Hermes skills | Strong | Core workflow plane | Vague trigger descriptions | Keep one job per skill and run static contract checks |
| Command approval and sandbox posture | OpenAI Codex approvals, Claude sandboxing, OpenClaw policy checks, Hermes dangerous command approvals | Strong | Core safety layer | Runtime-sized policy service | Keep command policy v0 as the first safety boundary |
| Structured security audit IDs | OpenClaw security audit checks | Strong | Core-adjacent doctor/audit | Overbroad platform audit | Keep static local findings shallow and ID-based |
| Finish gate | Superloopy proof-of-done, current roadmap, Codex verification guidance | Strong | Core runtime plane | Confusing evidence with verdict | Keep evidence-only `finish` v0 |
| Artifact and manual proof | Current criteria schema, Codex verification guidance | Strong | Core evidence plane | Accidental browser runtime | Record and hash external artifacts only |
| Vendor shims | Claude, Gemini, Cursor, Copilot context surfaces; OpenClaw plugin bundle compatibility | Useful | Optional adapter | Drifting duplicate rules | Keep thin pointers to canonical docs |
| Skill write staging | Hermes `skills.write_approval`; current `retro` skill | Useful | Workflow policy, later tool support | Autonomous self-modification | Stage patches for review, never silent mutation |
| Run/verify recipes | Downstream setup needs; compatibility inference from reusable skill and command patterns | Useful | Optional templates | Mutable task ledger | Capture confirmed commands only |
| Subagents | BMAD role separation, OpenClaw subagents, Hermes Kanban/subagents | Limited | Backlog | Agent fleet/runtime management | Keep roles as contracts, not core orchestration |
| Browser automation | OpenClaw browser and broader UI-agent patterns | Limited | Backlog | Flaky runtime dependency | Use artifact evidence first |
| Persistent memory | Hermes memory and learning loop | Limited | Backlog | Personal assistant/runtime scope | Keep repo knowledge in docs and reviewed retro updates |

## Claim Traceability Notes

These notes make the more specific claims in this addendum easier to audit:

- OpenAI AGENTS.md and skill claims are grounded in the OpenAI Codex AGENTS.md guide, Codex skills guide, Codex best-practices guide, approvals/security guide, and config reference.
- Claude context and skill placement claims are grounded in Claude Code memory, skills, sandboxing, and security docs. Run/verify recipe capture is an Agent Onboard recommendation, not a vendor requirement.
- Cursor static-rules versus dynamic-skills claims are an inference from Cursor's official rules and skills pages.
- GitHub Copilot compatibility claims are grounded in Copilot repository/custom-instruction docs and Copilot coding-agent support for AGENTS.md-style instructions.
- Gemini context-file claims are grounded in Gemini CLI and Code Assist `GEMINI.md` context-file docs.
- OpenClaw skills, skill gating, allowlists, and environment-injection claims are grounded in OpenClaw skills docs.
- OpenClaw security-audit, policy, SecretRefs, and status claims are grounded in OpenClaw audit-check, policy, secrets, and status docs.
- OpenClaw subagent/background-run and reduced-tool-surface claims are treated as runtime-boundary evidence only; they support keeping subagent orchestration out of Agent Onboard core.
- Hermes skill-write approval, skill creation, memory, context-file, safe-mode, approval, and Kanban claims are grounded in Hermes skills, memory, context files, security, CLI reference, prompt assembly, and Kanban docs.

## Subagent Cross-Check Record

The addendum and related README/roadmap edits were checked by independent subagents before acceptance:

| Review lane | Result | Action taken |
| --- | --- | --- |
| Vendor compliance research | Pass with gaps | Kept Codex as pass; marked Claude, Gemini, Cursor, and Copilot as partial because pointer-only shims now exist but full adapters do not. |
| Architecture scope | Pass | Kept command policy, shared language, finish gate, and artifact/manual evidence as core; kept runtime features out of core. |
| Evidence and finish semantics | Pass | Preserved the distinction between evidence, finish verdict, review, and action logs. |
| Adversarial critique | Blocked then fixed | Added OpenClaw/Hermes coverage, reduced priority drift, tightened eval wording, and added this cross-check record. |
| Documentation quality | Pass with caveats | Added source-basis, core/optional/backlog framing, source-quality notes, and synchronization requirements. |
| Git/operations review | Blocked operationally | Identified local exclude rules that can hide `docs/`; final staging must force-add source docs that are listed in AGENTS.md. |

Operational note: if a local exclude rule hides source documentation, force-add the source docs before commit or remove the local exclude rule. The AGENTS.md docs index should not name files that are absent from the committed tree.

## Non-Goals Reaffirmed

Do not add these to the basic core:

- recording every action
- full task ledger
- subagent fleet management
- browser runner by default
- scheduler
- plugin marketplace
- live gateway
- persistent personal memory
- autonomous skill writes
- duplicated vendor-specific instruction copies

Done should mean:

```text
fresh required evidence passed
+ finish verdict PASS
+ required review has no unresolved blocker when review is part of the selected workflow
+ final report names commands and evidence paths
```

Done should not mean:

```text
the agent recorded every step
or a run summary says done
or review happened without evidence
```

## Source Quality Notes

High-confidence sources, retrieved on 2026-07-09 unless noted otherwise:

- OpenAI Codex AGENTS.md guide: https://developers.openai.com/codex/guides/agents-md
- OpenAI Codex skills guide: https://developers.openai.com/codex/skills
- OpenAI Codex best practices: https://developers.openai.com/codex/learn/best-practices
- OpenAI Codex approvals and security: https://developers.openai.com/codex/agent-approvals-security
- OpenAI Codex config reference: https://developers.openai.com/codex/config-reference
- AGENTS.md open format: https://agents.md/
- Agent Skills open standard: https://agentskills.io/home
- Claude Code skills: https://code.claude.com/docs/en/skills
- Claude Code memory: https://code.claude.com/docs/en/memory
- Claude Code sandboxing: https://code.claude.com/docs/en/sandboxing
- Claude Code security: https://code.claude.com/docs/en/security
- GitHub Copilot repository instructions: https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions
- Gemini CLI `GEMINI.md`: https://google-gemini.github.io/gemini-cli/docs/cli/gemini-md.html
- Cursor agent best practices: https://cursor.com/blog/agent-best-practices
- OpenClaw repository: https://github.com/openclaw/openclaw
- OpenClaw skills: https://docs.openclaw.ai/tools/skills
- OpenClaw security audit checks: https://docs.openclaw.ai/gateway/security/audit-checks
- OpenClaw security model: https://github.com/openclaw/openclaw/blob/main/docs/gateway/security/index.md
- OpenClaw policy checks: https://docs.openclaw.ai/cli/policy
- OpenClaw secrets: https://docs.openclaw.ai/cli/secrets
- OpenClaw status: https://docs.openclaw.ai/cli/status
- OpenClaw plugin manifest: https://docs.openclaw.ai/plugins/manifest
- OpenClaw browser: https://docs.openclaw.ai/tools/browser
- OpenClaw plugin bundles: https://docs.openclaw.ai/plugins/bundles
- OpenClaw threat model: https://docs.openclaw.ai/security/THREAT-MODEL-ATLAS
- Hermes repository: https://github.com/NousResearch/hermes-agent
- Hermes docs: https://hermes-agent.nousresearch.com/docs/
- Hermes skills system: https://hermes-agent.nousresearch.com/docs/user-guide/features/skills
- Hermes context files: https://hermes-agent.nousresearch.com/docs/user-guide/features/context-files
- Hermes security: https://hermes-agent.nousresearch.com/docs/user-guide/security
- Hermes CLI reference: https://hermes-agent.nousresearch.com/docs/reference/cli-commands
- Hermes prompt assembly: https://hermes-agent.nousresearch.com/docs/developer-guide/prompt-assembly
- Hermes Kanban: https://hermes-agent.nousresearch.com/docs/user-guide/features/kanban
- Hermes memory: https://hermes-agent.nousresearch.com/docs/user-guide/features/memory
- Hermes agent loop: https://hermes-agent.nousresearch.com/docs/developer-guide/agent-loop

Medium-confidence sources:

- Community discussions, product posts, and news coverage about agent security and skill ecosystems. These are useful for risk discovery but should not be treated as implementation authority.

## Confidence

| Claim | Confidence | Reason |
| --- | --- | --- |
| Current AGENTS.md/skills direction is vendor-aligned | High | Supported by OpenAI, AGENTS.md, Agent Skills, Claude, Cursor, and Copilot guidance |
| Command policy should stay first | High | Current verifier executes commands; OpenAI/OpenClaw/Hermes all emphasize approvals and sandbox/policy boundaries |
| Vendor shims are useful but should be optional | High | Multiple hosts use different context files; duplication creates drift risk |
| Static skill contract checks are a strong addition | High | Skill activation depends on descriptions across Codex and Agent Skills guidance |
| OpenClaw/Hermes runtime features should stay out of core | High | Their product boundary is broader than repo onboarding |
| Retro write approval is worth adding | Medium-high | Hermes provides strong prior art; current retro already proposes durable updates |
| Run/verify recipe capture is useful | Medium | Good workflow ergonomics, but lower risk than command policy and finish gate |
