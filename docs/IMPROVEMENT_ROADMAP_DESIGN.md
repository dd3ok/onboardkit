# Agent Onboard Improvement Roadmap Design

Date: 2026-07-08

Authority: future improvement design and prioritization. `docs/SOT.md` delegates roadmap ordering to this document, and implementation status must be reflected in `docs/STATUS.md`.

Synchronization: when this roadmap changes phase order or promotes backlog work into core, update `docs/SOT.md`, `docs/STATUS.md`, `docs/DECISIONS.md`, and the managed docs index in the same change.

## Purpose

This design consolidates prior research into one roadmap. It keeps Agent Onboard focused on AGENTS.md-first guidance, lightweight workflow skills, and command-backed evidence.

The prior research included Superpowers, Superloopy, BMAD, Matt Pocock skills, Karpathy-style guidance, Spec Kit, Vercel AGENTS.md findings, and OpenAI Codex guidance. The goal is not to copy any one framework, but to adopt the strongest shared ideas:

- align before coding
- keep durable guidance in AGENTS.md
- keep procedures in skills
- keep changes small
- require fresh evidence before done
- separate review from implementation
- improve the harness after repeated failures

## Product Boundary

Agent Onboard should remain:

- a repo onboarding kit
- a compact workflow guide
- a criteria and evidence collector
- a lightweight completion gate

Agent Onboard should not become:

- a full autonomous agent runtime
- a browser automation platform
- a benchmark platform
- a subagent orchestration system
- a background scheduler
- a comprehensive task ledger

The guiding question for every proposed feature is:

```text
Does this make AGENTS.md-first repo preparation safer and more verifiable without managing the agent's work?
```

If the answer is no, the feature belongs outside core or should be deferred.

## Adopted Principles

### Matt Pocock Skills

Adopt the misalignment-reduction idea:

- clarify ambiguous requirements
- define shared language
- make acceptance criteria observable

Do not add heavy interview ceremonies for every task. Tiny tasks can use a lightweight assumption check.

### BMAD

Adopt role separation:

- implementer changes code
- verifier checks evidence
- reviewer checks scope, correctness, maintainability, and security
- security reviewer handles secrets, network, auth, deletion, and command risk

Do not implement a full multi-agent organization in core. Roles are contracts first. Subagents are an optional execution method.

### Superpowers

Adopt the SDLC loop:

```text
clarify -> specify -> design -> plan -> implement -> verify -> review -> retro
```

Keep workflow depth adaptive. Tiny fixes should not require the full loop, and `retro` is conditional on repeated failures or process gaps.

### Superloopy

Adopt proof-of-done:

- done requires fresh evidence
- command-backed criteria must be rerun near completion
- missing, stale, pending, and failed evidence must be distinct states

Do not copy the full loop runtime, fleet, hooks, or all-action ledger into core.

### Spec Kit

Keep spec, design, tasks, criteria, review, and retro as durable artifacts for non-trivial work.

Do not require these artifacts for tiny fixes.

### Karpathy-Style Guidance

Prefer:

- simple changes
- explicit assumptions
- surgical diffs
- verifiable goals

Avoid speculative abstractions and large framework-like surfaces before real usage demands them.

### Vercel AGENTS.md Findings

Keep always-needed guidance in AGENTS.md and route longer material through compressed docs indexes.

Do not rely on implicit skill discovery for project-wide knowledge.

## Architecture Boundaries

Agent Onboard keeps five responsibility planes, but features may cross planes.

```text
Control plane:
  AGENTS.md, shared language, command policy, role contracts, Definition of Done

Workflow plane:
  skills and task workflows

Evidence plane:
  criteria, proofs, command logs, artifacts, run reports

Runtime plane:
  thin CLI execution, finish gate, optional minimal run state

Eval plane:
  scenario inventory and optional deterministic grading
```

Important boundary rule:

```text
A finish gate is not evidence.
It is a control/runtime mechanism that consumes evidence and produces a verdict.
```

Evidence adapters should record facts. They should not decide whether work is done.

Dynamic eval should measure harness behavior. It should not become part of ordinary task completion.

### Content Placement Rule

Put always-on rules, command names, and routing triggers in `AGENTS.md`.

Put durable explanations, schemas, policy details, and examples in `docs/`.

Put task procedures with inputs, outputs, steps, and completion criteria in `.agents/skills/`.

Put generated starter material in `templates/`.

If content is needed on every task, summarize it in AGENTS.md and route the full detail through the docs index.

### Documentation Ownership

Each new document must declare its authority and synchronization requirements:

- `docs/shared-language.md` defines terms and role contracts.
- `docs/evidence.md` defines proof contracts and evidence states.
- `docs/finish-gate.md` defines completion verdict behavior.
- `docs/command-policy.md` defines command trust and execution rules.
- `docs/run-state.md`, if added, defines pointer-only resume metadata.

When adding these documents, update `docs/SOT.md`, `docs/STATUS.md`, and the managed docs index in the same change. This avoids a second, drifting source of truth.

## Gate Model

The roadmap implements this gate model in order: command policy first, evidence semantics second, completion verdict third, optional evidence types later.

```text
Hard gates:
  command policy permits required commands
  required evidence is fresh and passed
  required artifacts exist and match recorded hashes
  finish gate returns PASS
  required review has no unresolved blocker when the selected workflow calls for review

Soft gates:
  clarify/spec/design depth matched task risk
  optional evidence is present
  static eval inventory was generated
  subagent roles were used where helpful
```

Self-review is a soft gate unless it finds a blocker. Required review remains part of Definition of Done when the selected workflow calls for review, but `finish` v0 should not consume review state until a machine-readable review-blocker input contract exists.

## Recommended Roadmap

### Phase 1: Safety and Vocabulary

Purpose: make completion language and command execution safer before expanding features.

Add:

```text
docs/shared-language.md
src/lib/security-policy.mjs
schemas/security-policy.schema.json
templates/security-policy.template.json
```

Define canonical terms:

- criterion
- proof
- evidence
- artifact
- finish gate
- command policy
- role contract
- run state
- adapter
- pass
- fail
- incomplete
- pending
- missing
- stale
- warn

Define minimal role contracts:

```text
Implementer:
  makes the scoped change

Verifier:
  produces or checks fresh evidence

Reviewer:
  checks scope, correctness, maintainability, and regressions

Security reviewer:
  checks secrets, auth, network, destructive commands, and sandbox changes
```

Add command policy v0:

- normalize every command before policy evaluation
- prefer named command descriptors over free-form shell strings
- keep legacy command strings only as trusted input, with stricter matching
- deny clearly destructive commands
- mark risky commands as prompt-required
- fail prompt-required commands in non-interactive mode unless an explicit override is present
- allow only exact known project-local commands after deny and prompt checks
- record policy decisions in proof output

Policy precedence is deterministic:

```text
1. Normalize command.
2. Reject malformed commands.
3. Deny rules win.
4. Prompt-required rules fail closed unless explicitly approved.
5. Exact allow rules pass.
6. Unknown commands fail or warn according to policy mode.
```

Core should move toward structured command criteria:

```json
{
  "type": "command",
  "command": {
    "kind": "npm-script",
    "script": "test",
    "args": []
  }
}
```

Legacy string commands may remain for compatibility, but shell metacharacters, pipes, redirects, command chaining, environment assignment, and implicit network/destructive commands must not bypass deny or prompt rules.

Also add:

- run ID validation
- criterion ID validation
- a shared path containment helper for `.harness/evidence`, `.harness/runs`, and `.harness/reports`
- command timeout
- output size limit
- broader secret redaction

Path containment requirements:

- reject absolute user-provided output paths
- reject Windows drive-relative and UNC paths
- reject `..` traversal
- resolve and canonicalize paths before writing
- verify real paths stay inside the allowed root
- test symlink escape attempts where the platform supports symlinks

Redaction requirements:

- redact before persistence
- apply to command output, proof fields, reports, manual notes, artifact metadata, and future browser logs
- do not persist full environment dumps
- keep hashes and truncated logs when raw output is too risky or too large

Acceptance criteria:

- denied commands do not execute
- policy decision is recorded in proof
- deny rules override allow rules
- prompt-required commands fail closed without explicit approval
- existing sample criteria still pass
- invalid run IDs or criterion IDs cannot escape allowed `.harness` roots
- representative secret patterns are redacted before persistence
- command timeouts and output limits produce clear statuses
- AGENTS.md stays concise

### Phase 2: Finish Gate and Evidence Semantics

Purpose: distinguish "work ran" from "work is done".

Add:

```text
agent-onboard finish --run-id <id>
src/lib/finish-gate.mjs
docs/finish-gate.md
docs/evidence.md
```

Finish gate behavior:

- read `.harness/evidence/<run-id>/run-report.json`
- validate referenced `proof.json` files
- verify required criteria are fresh and passed
- treat required pending, missing, or stale evidence as `INCOMPLETE`
- treat required failed evidence as `FAIL`
- attach optional evidence problems to `warnings[]`
- produce one aggregate verdict
- consume evidence only in v0; review blockers stay outside `finish` until a review-state input contract is defined

Outcome model:

```text
PASS:
  all required evidence passed and is fresh
  optional evidence may still produce warnings

FAIL:
  required evidence ran and failed, or policy denied execution

INCOMPLETE:
  required evidence is missing, stale, pending, unsupported, or tool-unavailable

warnings[]:
  optional evidence is missing, stale, pending, unsupported, tool-unavailable, or failed
```

Aggregate verdicts are only `PASS`, `FAIL`, or `INCOMPLETE`. Warnings are annotations and may appear with `PASS`.

Evidence status mapping:

```text
required failed evidence -> FAIL
required policy-denied command -> FAIL
required missing evidence -> INCOMPLETE
required pending evidence -> INCOMPLETE
required stale evidence -> INCOMPLETE
required unsupported evidence -> INCOMPLETE
required tool-unavailable evidence -> INCOMPLETE
optional non-pass evidence -> warning annotation
```

V1 proof fields:

- `schema_version`
- `run_id`
- `criterion_id`
- `criterion_hash`
- `criteria_file_hash`
- `type`
- `required`
- `status`
- `freshness_status`
- `created_at`
- `observed_at`
- `freshness_basis`
- `evidence_paths`
- `artifact_sha256`
- `stdout_sha256`
- `stderr_sha256`
- `policy_status`
- `policy_rule`

Stale rules:

- criterion hash changed after proof was created
- criteria file hash changed after proof was created
- referenced log, proof, or artifact is missing
- referenced artifact hash no longer matches
- optional TTL expired when a criterion declares a TTL
- proof predates an explicit task or change marker when such a marker exists

Acceptance criteria:

- `finish` exits `0` only for PASS
- stale and missing required evidence block done without being mislabeled as behavioral failure
- optional evidence produces warnings and cannot silently make a run look complete
- final report names evidence paths

Done contract:

```text
Done = finish verdict PASS + no unresolved required review blocker when review is required + final report names evidence paths.
```

This contract does not require logging every action.

For `finish` v0, the command should report only the evidence verdict. Review blocker checks remain a separate Definition of Done step until review findings have a documented machine-readable input path.

### Phase 3: Artifact and Manual Evidence

Purpose: validate and hash existing non-command criteria types without owning browser automation.

The criteria schema already reserves `artifact`, `screenshot`, `browser-log`, `review`, and `manual`. This phase turns the current pending/manual placeholder behavior into explicit artifact-backed proof where possible.

Supported v0 types:

```text
artifact:
  file exists, hash, size, timestamp

manual:
  note or externally produced evidence reference

screenshot:
  artifact subtype for image files

browser-log:
  artifact subtype for console/network log files
```

Do not launch a browser in core for this phase. Users or host tools may produce artifacts, and Agent Onboard records and hashes them.

Acceptance criteria:

- required artifact missing => INCOMPLETE
- artifact present => proof records path, size, hash, and timestamp
- screenshot and browser-log are clearly documented as artifact-backed evidence, not automated browser verification

### Phase 4: Optional Run Summary

Purpose: summarize evidence without creating a task ledger or workflow engine.

This phase is optional. It should be implemented only if `finish` and `status` need a stable pointer file beyond `run-report.json`.

Possible file:

```text
src/lib/run-state.mjs
.harness/runs/<run-id>.summary.json
docs/run-state.md
```

Keep run state pointer-based:

```json
{
  "run_id": "example",
  "task_slug": "example-task",
  "status": "done",
  "evidence_root": ".harness/evidence/example",
  "updated_at": "2026-07-08T00:00:00.000Z"
}
```

Run summary should not duplicate proofs, logs, screenshots, task steps, or all actions. Evidence remains the durable proof source.

Completion must be derived from evidence and finish verdicts, not trusted from a separately mutable run-state file.

Acceptance criteria:

- run summary points to evidence, not the other way around
- run summary uses only statuses already supported by `schemas/run.schema.json`, or the schema is explicitly updated in the same change
- deleting run summary does not delete evidence

## Non-Core Backlog

These items are valuable but intentionally outside the core improvement pass. They should not block command policy, finish gate, or artifact evidence.

### Deterministic Eval Runner

Purpose: measure harness behavior without becoming a benchmark platform.

Only implement deterministic local graders at first:

- `command`
- `file-exists`
- `file-contains`
- `json-field`

Manual or semantic review graders should be `pending-manual-review`, not pass.

Do not add:

- model orchestration
- cost tracking
- repeated LLM runs
- external services
- browser automation

Acceptance criteria:

- static eval inventory remains available
- deterministic eval writes `.harness/reports/eval-<run-id>.json`
- unsupported graders are explicit pending items
- eval success is not required for ordinary task completion
- all eval command graders use the same command policy, timeout, output limit, containment, and redaction path as normal criteria execution

### Optional Browser Automation

Purpose: support UI evidence only when concrete usage proves artifact-backed evidence is insufficient.

This remains optional and deferred.

Constraints:

- no Playwright/Puppeteer default dependency
- no browser runner in the default verify path
- browser criteria only run when explicitly requested
- required browser criteria become `INCOMPLETE` with actionable setup guidance if tooling is missing

Acceptance criteria:

- browser artifacts flow through the same evidence contract
- screenshots/logs include viewport, URL, timestamp, hash, and source
- browser evidence is not confused with dynamic eval

## Revised Priority

The implementation order should be:

```text
1. Command policy v0
2. Shared language and role contracts
3. Finish gate v0
4. Artifact/manual evidence v0
5. Optional run summary, only if needed by finish/status
```

Command policy is placed first because current criteria execution is the main safety boundary.

Shared language and finish gate follow because they define and enforce "done" without building a full runtime.

Artifact/manual evidence replaces near-term browser automation because it provides richer proof with low overhead.

Dynamic eval and browser automation stay in the non-core backlog because they can easily expand into a benchmark platform or browser runtime.

## Subagent Policy

Subagents are valid as an optional way to execute role contracts. They should not be core infrastructure.

Core should define:

- role names
- responsibilities
- inputs
- outputs
- stop conditions

Core should not define:

- subagent spawning
- model routing
- agent fleet management
- background orchestration

This keeps Agent Onboard usable in Codex, Claude Code, Cursor, Copilot, or manual workflows.

## Non-Goals

- Do not record every action by default.
- Do not make dynamic eval part of ordinary done.
- Do not require subagents.
- Do not require browser automation.
- Do not implement YAML criteria parsing in this improvement pass.
- Do not implement host adapter installers in this improvement pass.
- Do not implement Codex plugin packaging in this improvement pass.
- Do not implement dashboard/report UI in this improvement pass.
- Do not implement docs-pack registry in this improvement pass.
- Do not implement monorepo nested AGENTS.md generation in this improvement pass.
- Do not implement GitHub Actions installer in this improvement pass.
- Do not implement automated SOT synchronization in this improvement pass.
- Do not add production dependencies for roadmap items unless a later implementation design explicitly justifies them.
- Do not move long explanations into AGENTS.md.

## Risks and Mitigations

### Risk: The tool becomes too heavy

Mitigation:

- keep AGENTS.md concise
- make finish gate explicit, not automatic background behavior
- keep run state pointer-based
- defer dynamic eval and browser automation

### Risk: Evidence creates false confidence

Mitigation:

- distinguish fail, incomplete, pending, missing, and stale
- record hashes and timestamps
- keep adapters factual
- keep review separate from evidence capture

### Risk: Command execution is unsafe

Mitigation:

- implement command policy before expanding evidence execution
- sanitize run IDs and criterion IDs
- enforce path containment
- add timeouts and output limits
- improve secret redaction

### Risk: Role contracts become orchestration

Mitigation:

- define roles in docs only
- treat subagents as optional
- avoid model routing or fleet management in core

### Risk: Browser evidence becomes flaky

Mitigation:

- start with artifact-backed evidence
- keep browser automation optional
- require explicit criteria to run browser tooling

## Review Checklist for Future Implementations

Before implementing each phase, confirm:

- Does it preserve the lightweight identity?
- Does it avoid hidden runtime behavior?
- Does it keep AGENTS.md concise?
- Does it produce or consume clear evidence?
- Does it distinguish incomplete from failed?
- Does it avoid adding dependencies unless necessary?
- Does it keep browser, eval, and subagent behavior optional?

## Decision Summary

Proceed with a thin safety and evidence spine:

```text
command policy -> shared language -> finish gate -> artifact evidence
```

Defer platform-like features:

```text
full runtime -> subagent orchestration -> browser automation -> dynamic benchmark runner
```

This preserves the best ideas from Matt Pocock skills, BMAD, Superpowers, Superloopy, Spec Kit, Karpathy-style guidance, Vercel AGENTS.md findings, and OpenAI Codex guidance without turning Agent Onboard into a heavy agent platform.
