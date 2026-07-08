---
name: plan
description: Break approved spec/design into small executable tasks with dependencies, file targets, and verification commands.
---


# Plan Skill

Use this skill before multi-file implementation or long-running work.

## Inputs

- `spec.md`
- `design.md`
- Repo commands from `AGENTS.md`

## Outputs

- `specs/<slug>/tasks.md`
- `specs/<slug>/criteria.json`

## Steps

1. Split work into small tasks.
2. Mark dependencies and parallelizable tasks.
3. Name likely files touched.
4. Add a verification command per task.
5. Add expected evidence path per task.
6. Refuse vague tasks such as "implement feature" without verification.

## Completion criteria

- Each task is independently understandable.
- Each required task has a verification path.

