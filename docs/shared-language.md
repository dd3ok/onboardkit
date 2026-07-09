# Shared Language And Role Contracts

Authority: canonical vocabulary and role contracts for after-init core workflows.

Synchronization: when this document changes, check `AGENTS.md`, `docs/SOT.md`, `docs/STATUS.md`, `docs/IMPROVEMENT_ROADMAP_DESIGN.md`, and schemas that use the changed terms.

## Purpose

after-init uses these terms so agents do not confuse "a command ran" with "work is done". This document defines words only. It does not add orchestration, subagent routing, or a task ledger.

Subagents are optional execution helpers. Role contracts are valid whether one agent performs every role or separate agents perform them.

## Canonical Terms

criterion: a user, project, or harness requirement that can be checked. A criterion may be command-backed, artifact-backed, manual, or unsupported by the current CLI.

proof: a machine-readable record for one criterion. A proof records what was checked, when it was checked, the outcome facts, and paths or hashes needed for audit.

evidence: the collection of proofs, logs, artifacts, and reports for a run. Evidence supports a verdict but does not decide completion by itself.

artifact: a file or externally produced object used as evidence, such as a screenshot, browser log, review note, generated report, or build output.

command policy: the allow, deny, prompt-required, timeout, output-limit, and redaction rules applied before command criteria execute.

finish gate: a command or process that consumes evidence and returns one completion verdict. A finish gate is not evidence.

role contract: a documented responsibility boundary with inputs, outputs, and stop conditions. A role contract is not a requirement to spawn a subagent.

run state: lightweight pointer metadata for a verification or workflow run. Run state may point to evidence but must not duplicate proofs, logs, or all actions.

adapter: optional host-specific or tool-specific glue that maps after-init contracts to another environment without changing the core contract.

pass: required evidence exists, is fresh, and shows the criterion succeeded.

fail: required evidence exists and shows the criterion failed, or command policy denied required command execution.

incomplete: required evidence cannot support a pass or fail verdict because it is missing, stale, pending, unsupported, or tool-unavailable.

pending: evidence is expected from a manual step, external tool, or future adapter and is not available yet.

missing: referenced proof, log, artifact, report, or required evidence path does not exist.

stale: evidence exists but is no longer valid for the current criterion, criteria file, artifact hash, task marker, or declared freshness window.

warn: an optional evidence problem or non-blocking condition that should be reported but does not by itself fail required completion.

## Role Contracts

### Implementer

Responsibility: make the scoped change requested by the user, spec, or task.

Inputs: user request, relevant source files, selected spec/design/task artifacts, and applicable AGENTS.md rules.

Outputs: minimal diff, updated tests or examples when needed, and notes about assumptions or skipped checks.

Stop conditions: unclear or unsafe scope, missing required context, failing verification that needs debugging, or a change that would require unrelated refactoring.

### Verifier

Responsibility: produce or check fresh evidence for the selected done criteria.

Inputs: criteria file, command policy, changed files, expected commands, and existing evidence root when re-checking.

Outputs: proof files, command logs, run report, and clear status for pass, fail, incomplete, pending, missing, stale, and warn conditions.

Stop conditions: denied command policy, missing required tools, stale or missing required evidence, unsafe path, unredacted secret risk, or unsupported non-command evidence without an existing artifact path or adapter.

### Reviewer

Responsibility: check scope, correctness, maintainability, regression risk, and whether the selected workflow was followed.

Inputs: user request, spec/design/task artifacts when present, diff, tests, evidence paths, and known risks.

Outputs: blocking findings, non-blocking notes, and a verdict of approved, approved with notes, or blocked.

Stop conditions: unresolved blocker, missing required evidence, unreviewed broad refactor, or mismatch between implementation and accepted scope.

### Security Reviewer

Responsibility: check secrets, command execution, network access, auth boundaries, destructive operations, dependencies, and evidence persistence.

Inputs: diff, command policy decisions, evidence logs, configuration files, dependency changes, and security model.

Outputs: blocking security findings, accepted residual risks, and required follow-up hardening if needed.

Stop conditions: secret exposure, unsafe command path, destructive operation without approval, unexpected network or dependency change, or evidence that persists sensitive data.

## Boundary Rules

- Do not treat role contracts as mandatory subagent orchestration.
- Do not treat run state as a task ledger.
- Do not treat evidence as a completion verdict.
- Do not treat review as proof; review is a separate scope and quality check.
- Do not classify missing or stale required evidence as fail. Use incomplete unless evidence proves the behavior failed.
