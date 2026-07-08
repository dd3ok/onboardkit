---
name: design
description: Design architecture, interfaces, risks, alternatives, and rollback before code for non-trivial changes; produce design.md or ADR.
---


# Design Skill

Use this skill before changing architecture, public interfaces, data models, security boundaries, or cross-module behavior.

## Inputs

- `spec.md`
- Existing architecture docs
- Relevant source files

## Outputs

- `specs/<slug>/design.md`
- Optional ADR when trade-offs are material

## Steps

1. Inspect current architecture.
2. Propose the simplest sufficient design.
3. Define interfaces, data model, and affected files.
4. Compare alternatives.
5. Record risks, mitigations, and rollback plan.
6. Check that every proposed change traces to the spec.

## Completion criteria

- No speculative abstraction.
- Design is implementable in small slices.
- Risks and rollback path are explicit.

