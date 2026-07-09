---
name: implement
description: Implement one planned task slice at a time with surgical diffs and immediate verification.
---


# Implement Guide

Use this guide only after scope is clear. For large tasks, require `tasks.md` first.

## Inputs

- Task ID
- `tasks.md`
- Relevant source files
- Verification command

## Outputs

- Minimal diff
- Updated tests when appropriate
- Evidence from focused verification

## Steps

1. Read the task and acceptance criteria.
2. Inspect the smallest relevant source area.
3. Write or update a failing/focused test when feasible.
4. Implement the smallest slice.
5. Run the task verification command.
6. Do not touch unrelated files.

## Completion criteria

- Diff is scoped to the task.
- No drive-by refactors.
- Verification has fresh evidence.
