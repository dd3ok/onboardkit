---
name: clarify
description: Clarify ambiguous or high-risk coding work before implementation; produce brief.md with questions, assumptions, acceptance criteria, and non-goals.
---


# Clarify Skill

Use this skill before implementation when requirements are ambiguous, risky, multi-file, user-visible, or architecture-affecting.

## Inputs

- User request
- Relevant repo files or docs
- Known constraints

## Outputs

- `specs/<slug>/brief.md`
- Clarifying questions when needed
- Assumption log when proceeding without answers

## Steps

1. Restate the request in one paragraph.
2. Identify missing information that could change implementation.
3. Ask only high-leverage questions unless the user has instructed you to proceed.
4. Convert fuzzy language into observable acceptance criteria.
5. Record assumptions and non-goals.
6. Stop before coding unless the task is tiny and unambiguous.

## Completion criteria

- Acceptance criteria are testable or reviewable.
- Non-goals are explicit.
- Remaining assumptions are visible.

