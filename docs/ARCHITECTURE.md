# Architecture

## Layer model

onboardkit uses a five-layer architecture.

```text
Layer 1. Control Plane
  SKILL.md, AGENTS.md, docs index, shared language, Definition of Done, security policy

Layer 2. Workflow Plane
  clarify, specify, design, plan, implement, tdd, verify, review, retro workflow guides

Layer 3. Evidence Plane
  criteria.json, commands.log, proof.json, artifact metadata, run-report.json, finish-report.json

Layer 4. Runtime Plane
  .harness/runs, .harness/evidence, .harness/reports, doctor/status/finish commands

Layer 5. Eval Plane
  evals/scenarios, static reports, future dynamic runner
```

## Control plane

The control plane is intentionally text-first. Root `SKILL.md` tells Codex how to use onboardkit as a skill. Generated `AGENTS.md` files stay short enough to be loaded automatically and stable enough to guide every task. Large docs are not pasted into context; they are indexed and retrieved from local files.

### Managed docs index

The bundled helper's `index-docs` command scans local docs and writes a compact index into:

```text
<!-- onboardkit:docs-index:start -->
...
<!-- onboardkit:docs-index:end -->
```

This mirrors the Vercel/Next.js finding that a compressed `AGENTS.md` docs index can outperform optional procedure retrieval for broad framework knowledge.

## Workflow plane

Workflow guides are on-demand vertical procedures. Each guide has:

- a single job
- frontmatter `name` and `description`
- explicit inputs and outputs
- imperative steps
- completion criteria

Workflow guides are stored in the Codex-compatible repo-scoped location `.agents/skills`.

`doctor --guides` validates the static guide contract: inventory, frontmatter, unique folder-matching names, concise trigger descriptions, required sections, and lightweight file size.

## Evidence plane

The evidence plane separates agent claims from proof. A command criterion produces:

```text
.harness/evidence/<run-id>/<criterion-id>/commands.log
.harness/evidence/<run-id>/<criterion-id>/proof.json
.harness/evidence/<run-id>/run-report.json
```

`proof.json` includes command, normalized command, policy decision, cwd, timestamps, exit code, output hashes, freshness, limits, and pass/fail status.

For artifact-backed criteria, `proof.json` records the project-relative artifact path, absolute workspace path, file size, mtime, SHA-256 hash, and artifact kind. The artifact itself stays where the user or host tool produced it; onboardkit records and validates metadata.

`finish-report.json` includes the aggregate `PASS`, `FAIL`, or `INCOMPLETE` verdict for a run plus required evidence classifications and optional warnings.

## Runtime plane

The current MVP stores evidence and reports through the bundled helper. Future runtime work should stay minimal and pointer-based:

- optional run summaries that point to evidence
- explicit approval metadata already captured in proof files
- trace links from reports to existing proof, logs, and artifacts

## Eval plane

The MVP includes scenario definitions and a static inventory report. Future dynamic evals will compare:

1. baseline without harness
2. default workflow guides
3. explicit workflow guides
4. AGENTS.md only
5. AGENTS.md docs index
6. hybrid AGENTS.md + workflow guides + evidence gate

## Host Boundary

The core remains host-agnostic. onboardkit is installed as a Codex skill and installs canonical `AGENTS.md` guidance plus repo-local workflow guides into target repos; it does not generate tool-specific instruction shims in the MVP.
