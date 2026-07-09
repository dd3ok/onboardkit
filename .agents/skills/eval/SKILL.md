---
name: eval
description: Design evals, run available deterministic checks, and compare baseline, skills-only, AGENTS.md-only, docs-index, and hybrid evidence workflows.
---


# Eval Skill

Use this skill when changing workflow design, skill behavior, docs indexing, or verification policy. In the current MVP, treat dynamic or LLM-based eval execution as design/backlog work unless an explicit deterministic runner is available.

## Inputs

- Eval scenario
- Candidate workflow modes
- Pass/fail graders, or pending-manual-review graders when deterministic grading is unavailable

## Outputs

- `.harness/reports/<eval-run>.json` when an eval runner is available, or an eval design/recommendation document when it is not
- Recommendation to promote, modify, or reject the workflow change

## Steps

1. Define behavior-based assertions.
2. Avoid test leakage and contradictory instructions.
3. Include APIs or project facts not likely to be in model memory.
4. Compare baseline, skills-only, AGENTS.md-only, docs-index, and hybrid modes.
5. When an eval runner is available, run only deterministic local graders by default.
6. Mark unsupported semantic, browser, or LLM-based graders as pending manual review.
7. Track pass rate, evidence freshness, and review findings. Track cost/time only for explicit non-core dynamic eval experiments.

## Completion criteria

- Workflow changes may be recommended as pending when evidence is incomplete, but promotion requires measured improvement or explicitly accepted risk.
