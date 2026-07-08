# Code Review Guide

Use this guide for reviewer agents and human reviewers.

## Blocking findings

- Fails acceptance criteria.
- Fails required verification.
- Changes unrelated behavior without approval.
- Adds risky dependency or network behavior without review.
- Leaks secrets or logs sensitive data.

## Review dimensions

1. Spec compliance
2. Correctness
3. Test coverage
4. Simplicity
5. Security
6. Maintainability
7. Performance
8. UX impact
9. Regression risk

## Severity

- blocker: must fix before completion
- major: should fix before merge unless explicitly accepted
- minor: non-blocking improvement
- note: informational
