---
name: eval
description: Design and run evals comparing baseline, skills-only, AGENTS.md-only, docs-index, and hybrid evidence workflows.
---


# Eval Skill

Use this skill when changing workflow design, skill behavior, docs indexing, or verification policy.

## Inputs

- Eval scenario
- Candidate workflow modes
- Pass/fail graders

## Outputs

- `.harness/reports/<eval-run>.json`
- Recommendation to promote, modify, or reject the workflow change

## Steps

1. Define behavior-based assertions.
2. Avoid test leakage and contradictory instructions.
3. Include APIs or project facts not likely to be in model memory.
4. Compare baseline, skills-only, AGENTS.md-only, docs-index, and hybrid modes.
5. Track pass rate, cost, time, context size, evidence freshness, and review findings.

## Completion criteria

- Workflow changes are justified by measured improvement, not preference.

