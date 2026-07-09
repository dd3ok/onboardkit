# Eval Methodology

## Purpose

Measure whether workflow changes improve agent outcomes instead of merely sounding better.

## Mode matrix

| Mode | Description |
|---|---|
| baseline-no-harness | No AGENTS.md, no workflow guides, no docs index. |
| guides-default | Workflow guides installed, no explicit instruction. |
| guides-explicit | Workflow guides installed and prompt explicitly invokes the relevant guide. |
| agents-md-only | AGENTS.md rules only, no docs index. |
| agents-md-docs-index | AGENTS.md includes compressed docs index. |
| hybrid-guides-agents-evidence | AGENTS.md docs index + explicit workflow guides + evidence gate. |

## Scenario design rules

- Use behavior-based assertions.
- Avoid test leakage.
- Avoid contradictory prompts.
- Include version-sensitive APIs or repo-specific facts.
- Include ambiguity cases where clarification should happen.
- Include evidence-fraud cases where stale logs must not pass.

## Metrics

- pass rate
- build/lint/typecheck/test pass rate
- docs read rate
- guide trigger rate
- context size
- cost
- wall-clock time
- unrelated diff ratio
- review blocker count
- evidence freshness

## Current MVP

The bundled helper's `eval` command produces a static scenario inventory. Dynamic execution is TODO T01.
