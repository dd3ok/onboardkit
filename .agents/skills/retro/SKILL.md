---
name: retro
description: Turn repeated mistakes or verification failures into durable after-init updates: AGENTS.md, workflow guides, templates, verifier, or eval cases.
---


# Retro Guide

Use this guide when the same mistake appears twice, evidence fails for process reasons, or a workflow instruction caused bad behavior.

## Inputs

- Failed run report
- Review findings
- User feedback

## Outputs

- `specs/<slug>/retro.md`
- Proposed patch to AGENTS.md, workflow guide, template, verifier, or eval case

## Steps

1. Identify what happened.
2. Separate model mistake from harness gap.
3. Propose one durable rule or tool change.
4. Add or update an eval case if recurrence should be prevented.
5. Keep AGENTS.md concise; move detail to referenced docs when possible.

## Completion criteria

- The next similar task has a stronger guide, sensor, or eval.
