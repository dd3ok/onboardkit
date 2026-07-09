# Finish Gate

Authority: completion verdict behavior for onboardkit evidence runs.

Synchronization: when this document changes, check `src/lib/finish-gate.mjs`, `bin/onboardkit.mjs`, `docs/evidence.md`, `docs/shared-language.md`, `docs/STATUS.md`, and `AGENTS.md`.

## Purpose

The finish gate separates "evidence exists" from "the run is complete". It consumes `.harness/evidence/<run-id>/run-report.json` and referenced `proof.json` files, then returns one verdict.

The finish gate is not evidence. It does not run tests, launch browsers, perform review, or manage a task ledger.

## Helper Command

```bash
node ./bin/onboardkit.mjs finish --run-id <id>
```

Exit code:

- `0` only when the verdict is `PASS`.
- `1` for `FAIL`, `INCOMPLETE`, invalid input, or missing run data.

## Verdicts

`PASS`: all required evidence is present, fresh, and passing. Optional evidence may produce warnings.

`FAIL`: required evidence exists and shows failure, or command policy denied or prompt-blocked required command execution.

`INCOMPLETE`: required evidence is missing, stale, pending, unsupported, tool-unavailable, invalid, or absent from the run report.

Warnings: optional evidence that is missing, stale, pending, unsupported, tool-unavailable, failed, or policy-blocked.

## V0 Rules

- Read only the selected run's `run-report.json`.
- Re-read the current criteria file referenced by the run report.
- Require the current criteria file hash and current required criterion hashes to match recorded proof.
- Resolve each proof path and require it to stay inside `.harness/evidence/<run-id>/`.
- Resolve command log paths referenced by proofs and require them to stay inside `.harness/evidence/<run-id>/`.
- Resolve artifact paths referenced by proofs and require them to stay inside the workspace.
- Reject relative, outside-workspace, drive-relative, UNC, traversal, or symlink-escaping artifact references.
- Required missing proof blocks completion as `INCOMPLETE`.
- Required missing or changed criterion proof blocks completion as `INCOMPLETE`.
- Required missing command log blocks completion as `INCOMPLETE`.
- Required missing artifact or artifact hash mismatch blocks completion as `INCOMPLETE`.
- Required pending or stale proof blocks completion as `INCOMPLETE`.
- Required failed proof returns `FAIL`.
- Required policy-denied or prompt-required proof returns `FAIL`.
- Optional non-pass proof becomes a warning.
- Empty run reports are `INCOMPLETE`.
- Write `finish-report.json` under the selected run root for every verdict when the run root can be created safely.

## Done Contract

For the current core workflow:

```text
done = finish verdict PASS + required review step has no blocker when the selected workflow calls for review + final response names evidence paths
```

Review remains separate until review findings have a machine-readable input contract.
