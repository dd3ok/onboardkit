---
name: verify
description: Create fresh command-backed evidence for done criteria; produce proof.json and command logs.
---


# Verify Skill

Use this skill before claiming completion.

## Inputs

- `criteria.json`
- Repo commands from `AGENTS.md`
- Current diff

## Outputs

- `.harness/evidence/<run-id>/<criterion-id>/commands.log`
- `.harness/evidence/<run-id>/<criterion-id>/proof.json`
- `.harness/evidence/<run-id>/run-report.json`

## Steps

1. Re-run command-backed criteria at completion time.
2. Record command, cwd, timestamp, exit code, and output digest.
3. Redact secrets from logs.
4. Mark non-command criteria as pending manual evidence unless an adapter exists.
5. Do not claim done if required evidence is missing or stale.

## Completion criteria

- All required command criteria pass.
- Evidence paths are included in the final report.

