---
name: docs-index
description: Build or update compressed local documentation indexes in AGENTS.md so agents use retrieval-led reasoning.
---


# Docs Index Skill

Use this skill when adding framework docs, versioned docs, internal architecture docs, or any local reference corpus for agents.

## Inputs

- Docs source directory
- Desired docs index name
- Project `AGENTS.md`

## Outputs

- `.harness/docs-index/<name>.index.md`
- Updated managed docs-index section in `AGENTS.md`

## Steps

1. Scan local docs files.
2. Build a compact directory-to-files index.
3. Inject only the compressed index into AGENTS.md.
4. Keep full docs in local files.
5. Tell agents to read relevant docs before coding against version-sensitive APIs.

## Completion criteria

- AGENTS.md remains concise.
- The docs index names the local root and entry files.

