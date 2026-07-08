# AGENTS.md

## Mission

Describe this repository's product and engineering mission in one paragraph.

## Operating principles

1. Explore local context before implementation.
2. Prefer local docs and source files over model memory for version-sensitive behavior.
3. Keep changes surgical and traceable to the task.
4. Do not perform unrelated refactors.
5. Done requires fresh verification evidence. Review is a separate scope check.

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

## Routing Policy

Keep always-needed rules in AGENTS.md. Keep long procedures, interviews, and specialized checks in skills or docs.

When a task matches a skill trigger, invoke the skill explicitly instead of relying on implicit discovery:

- Ambiguous, risky, multi-file, or user-visible requirements: `clarify`
- Product behavior or acceptance criteria: `specify`
- Architecture, interfaces, data models, or security boundaries: `design`
- Multi-file or long-running implementation: `plan`
- Behavior changes with feasible tests: `tdd`
- Planned implementation slice: `implement`
- Before claiming completion: `verify`
- After implementation and verification: `review`
- Auth, secrets, network, dependencies, deletion, or sandbox changes: `security-review`
- Repeated mistakes or process failures: `retro`
- Adding or updating local docs corpus: `docs-index`
- Workflow or harness behavior changes: `eval`

For version-sensitive APIs, prefer the docs index in AGENTS.md and read the referenced local docs before using model memory.

## Docs index

<!-- agent-onboard:docs-index:start -->
[Project Docs Index]|root: ./docs
|IMPORTANT: Prefer retrieval-led reasoning over pretraining-led reasoning.
<!-- agent-onboard:docs-index:end -->
