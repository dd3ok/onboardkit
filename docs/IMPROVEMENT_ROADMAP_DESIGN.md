# onboardkit Improvement Roadmap Design

Date: 2026-07-09

Authority: future improvement design and prioritization. `docs/SOT.md` delegates roadmap ordering to this document, and implementation status must be reflected in `docs/STATUS.md`.

Synchronization: when this roadmap changes phase order or promotes backlog work into core, update `docs/SOT.md`, `docs/STATUS.md`, `docs/DECISIONS.md`, and the managed docs index in the same change.

## Product Boundary

onboardkit prepares repositories for AI coding agents after project setup as a Codex skill.

It should remain:

- a lightweight repo preparation toolkit
- a skill-first installation model
- an AGENTS.md-first guidance maintainer
- a repo-local workflow guide installer
- a command-policy and evidence verifier
- a compact finish verdict tool

It should not become:

- a full autonomous agent runtime
- a browser automation platform
- a benchmark platform
- a subagent orchestration system
- a background scheduler
- a comprehensive task ledger
- an npm package or global CLI distribution

## Core Spine

The current core is intentionally small:

1. Command policy v0
2. Shared language and role contracts
3. Finish gate v0
4. Artifact/manual evidence v0
5. Static security and workflow-guide audits

The finish gate consumes evidence and returns a verdict. It is not evidence by itself and does not manage tasks.

## Remaining Priority

Use this order only when the need is demonstrated by real use:

1. YAML criteria parser, only if JSON criteria become a usability bottleneck.
2. Optional run summary, only if `finish` or `status` needs a separate pointer file.
3. Broader redaction and structured command descriptors.
4. Semantic workflow-guide trigger eval, only if static `doctor --guides` checks are insufficient.

## Non-Core Backlog

These ideas stay outside the core pass unless a later design explicitly promotes them:

- dynamic eval
- browser automation
- subagent orchestration
- npm/package publishing or plugin packaging
- dashboard/report UI
- docs-pack registry
- monorepo nested AGENTS.md generator
- GitHub Actions installer
- automated SOT synchronization

Boundary rules:

- Do not require subagents.
- Do not require browser automation.
- Do not record every action by default.
- Do not make dynamic eval part of ordinary completion.
- Do not add production dependencies for deferred roadmap items without a specific design.

## Review Checklist

Before implementing a roadmap item, confirm:

- Does it preserve the lightweight identity?
- Does it avoid hidden runtime behavior?
- Does it keep AGENTS.md concise?
- Does it produce or consume clear evidence?
- Does it distinguish incomplete from failed?
- Does it avoid adding dependencies unless necessary?
- Does it keep browser, eval, and subagent behavior optional?
