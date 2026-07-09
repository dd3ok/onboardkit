# Architecture

## Layer model

Agent Onboard uses a five-layer architecture.

```text
Layer 1. Control Plane
  AGENTS.md, CLAUDE.md shim, docs index, shared language, Definition of Done, security policy

Layer 2. Workflow Plane
  clarify, specify, design, plan, implement, tdd, verify, review, retro skills

Layer 3. Evidence Plane
  criteria.json, commands.log, proof.json, artifact metadata, run-report.json, finish-report.json

Layer 4. Runtime Plane
  .harness/runs, .harness/evidence, .harness/reports, doctor/status/finish commands

Layer 5. Eval Plane
  evals/scenarios, static reports, future dynamic runner
```

## Control plane

The control plane is intentionally text-first. `AGENTS.md` is short enough to be loaded automatically and stable enough to guide every task. Large docs are not pasted into context; they are indexed and retrieved from local files.

### Managed docs index

`agent-onboard index-docs` scans local docs and writes a compact index into:

```text
<!-- agent-onboard:docs-index:start -->
...
<!-- agent-onboard:docs-index:end -->
```

This mirrors the Vercel/Next.js finding that a compressed `AGENTS.md` docs index can outperform optional skill retrieval for broad framework knowledge.

## Workflow plane

Skills are on-demand vertical workflows. Each skill has:

- a single job
- frontmatter `name` and `description`
- explicit inputs and outputs
- imperative steps
- completion criteria

Skills are stored in the Codex repo-scoped location `.agents/skills`.

`doctor --skills` validates the static skill contract: inventory, frontmatter, unique folder-matching names, concise trigger descriptions, required sections, and lightweight file size.

## Evidence plane

The evidence plane separates agent claims from proof. A command criterion produces:

```text
.harness/evidence/<run-id>/<criterion-id>/commands.log
.harness/evidence/<run-id>/<criterion-id>/proof.json
.harness/evidence/<run-id>/run-report.json
```

`proof.json` includes command, normalized command, policy decision, cwd, timestamps, exit code, output hashes, freshness, limits, and pass/fail status.

For artifact-backed criteria, `proof.json` records the project-relative artifact path, absolute workspace path, file size, mtime, SHA-256 hash, and artifact kind. The artifact itself stays where the user or host tool produced it; Agent Onboard records and validates metadata.

`finish-report.json` includes the aggregate `PASS`, `FAIL`, or `INCOMPLETE` verdict for a run plus required evidence classifications and optional warnings.

## Runtime plane

The current MVP stores evidence and reports. Future runtime work should stay minimal and pointer-based:

- optional run summaries that point to evidence
- explicit approval metadata already captured in proof files
- trace links from reports to existing proof, logs, and artifacts

## Eval plane

The MVP includes scenario definitions and a static inventory report. Future dynamic evals will compare:

1. baseline without harness
2. default skills
3. explicit skills
4. AGENTS.md only
5. AGENTS.md docs index
6. hybrid AGENTS.md + skills + evidence gate

## Host adapters

The core should remain host-agnostic. Host-specific behavior belongs in adapters:

```text
adapters/codex        AGENTS.md, .agents/skills, .codex examples
adapters/claude-code  CLAUDE.md, slash command guidance
adapters/cursor       .cursor/rules mapping
adapters/copilot      .github/copilot-instructions.md mapping
adapters/opencode     opencode config mapping
```

Full host adapters are TODO; see `docs/TODO_FEATURE_DESIGNS.md`.

Pointer-only host shims are available through `init --host-shims` for Gemini, GitHub Copilot, and Cursor. They reference canonical `AGENTS.md` guidance and are not full adapter installers.
