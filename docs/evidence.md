# Evidence Contract

Authority: proof and evidence semantics for Agent Onboard.

Synchronization: when this document changes, check `src/lib/evidence.mjs`, `src/lib/finish-gate.mjs`, `schemas/evidence.schema.json`, `docs/shared-language.md`, and `docs/finish-gate.md`.

## Evidence Layout

`agent-onboard verify` writes evidence under:

```text
.harness/evidence/<run-id>/<criterion-id>/commands.log
.harness/evidence/<run-id>/<criterion-id>/proof.json
.harness/evidence/<run-id>/run-report.json
```

`agent-onboard finish` writes:

```text
.harness/evidence/<run-id>/finish-report.json
```

## Proof

A proof is the machine-readable record for one criterion. For command criteria, proof records:

- run ID and criterion ID
- criterion hash and criteria file hash
- command and normalized command
- command policy status, rule, reason, and approval fields
- timeout and output limit
- timestamps
- exit code and signal
- output hashes
- log path
- freshness and pass/fail facts

Proof is factual. It does not decide whether the whole run is complete.

For artifact-backed criteria, proof records:

- artifact kind
- project-relative path and resolved path
- file size
- file modification timestamp
- SHA-256 hash
- observed timestamp
- pass/incomplete facts

## Run Report

`run-report.json` is the verifier's index for a run. It records the criteria file, criteria file hash, run ID, and result entries pointing to proof paths and criterion hashes.

The run report is not a finish verdict. It indexes individual criterion results; `finish` decides the aggregate run verdict.

For command proofs, the finish gate also checks that referenced command logs exist inside the same evidence run root.

For artifact-backed proofs, the finish gate checks that the referenced artifact still exists inside the workspace and that the current SHA-256 hash matches the recorded hash.

For every proof, the finish gate checks that the current criteria file still matches the recorded file hash and that each current required criterion has matching proof.

## Finish Report

`finish-report.json` is the finish gate's aggregate verdict for one run. It records:

- `PASS`, `FAIL`, or `INCOMPLETE`
- required evidence classifications
- optional warnings
- evidence paths used for the verdict

## Evidence States

`pass`: required proof exists, is fresh, and reports success.

`fail`: required proof exists and reports failure, policy-denied, or prompt-required command execution.

`incomplete`: required proof is missing, stale, pending, unsupported, tool-unavailable, invalid, outside the run root, missing an artifact, or absent from an empty run report.

`warn`: optional evidence has a non-pass state.

## Non-Command Evidence

The current CLI supports these non-command criteria as file-backed evidence:

- `artifact`
- `screenshot`
- `browser-log`
- `review`
- `manual`

Each criterion must provide a project-relative `path` to an existing file. Absolute paths, drive-relative paths, UNC paths, traversal paths, and symlink escapes are invalid. Missing or invalid required artifact paths make the finish verdict `INCOMPLETE`; optional problems become warnings.

`screenshot` and `browser-log` are artifact subtypes in core. Agent Onboard records and hashes externally produced files; it does not launch a browser.
