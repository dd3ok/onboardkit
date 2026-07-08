---
name: review
description: Review implemented diffs for spec compliance, correctness, simplicity, security, maintainability, and regression risk.
---


# Review Skill

Use this skill after implementation and verification, before final completion.

## Inputs

- User request
- `spec.md`, `design.md`, `tasks.md`
- Diff
- Evidence report

## Outputs

- `specs/<slug>/review.md`
- Severity-tagged findings

## Steps

1. Check spec compliance.
2. Check correctness and edge cases.
3. Check test and evidence coverage.
4. Check simplicity and unrelated changes.
5. Check security and secret handling.
6. Check maintainability and regression risk.
7. Give a final verdict: approved, approved with notes, or blocked.

## Completion criteria

- Blocking findings are fixed or explicitly accepted.
- Review references evidence paths.

