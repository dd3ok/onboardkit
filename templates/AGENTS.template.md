# AGENTS.md

## Mission

Describe this repository's product and engineering mission in one paragraph.

## Operating principles

1. Explore local context before implementation.
2. Prefer local docs and source files over model memory for version-sensitive behavior.
3. Keep changes surgical and traceable to the task.
4. Do not perform unrelated refactors.
5. Done requires fresh verification evidence.

## Repository layout

```text
src/       production source
test/      tests
docs/      project documentation
```

## Commands

```bash
# install

# test

# lint

# typecheck

# build
```

## Definition of Done

- Relevant tests pass.
- Lint/typecheck/build pass when applicable.
- Evidence paths are recorded.
- Review has no blocking findings.

## Docs index

<!-- agent-onboard:docs-index:start -->
[Project Docs Index]|root: ./docs
|IMPORTANT: Prefer retrieval-led reasoning over pretraining-led reasoning.
<!-- agent-onboard:docs-index:end -->
