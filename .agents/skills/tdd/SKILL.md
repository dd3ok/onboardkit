---
name: tdd
description: Run a red-green-refactor loop for behavior changes where tests are feasible.
---


# TDD Guide

Use this guide when behavior can be specified with automated tests.

## Inputs

- Acceptance criteria
- Existing test framework
- Target files

## Outputs

- Failing test
- Passing implementation
- Refactor with tests still passing

## Steps

1. Add the smallest failing test that captures the desired behavior.
2. Run the focused test and confirm it fails for the expected reason.
3. Implement the minimal code to pass.
4. Run the focused test again.
5. Refactor only if it improves clarity without changing behavior.
6. Run the relevant broader suite.

## Completion criteria

- Red failure was meaningful.
- Green pass is recorded.
- Refactor does not expand scope.
