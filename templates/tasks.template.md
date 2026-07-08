# Tasks: {{title}}

Date: {{date}}
Slug: `{{slug}}`

## Dependency graph

```text
T01 -> T02 -> T03
```

## Tasks

### T01 — Prepare failing or focused verification

- Files:
- Dependencies: none
- Parallelizable: false
- Verification command:
- Evidence path: `.harness/evidence/<run-id>/T01/`

### T02 — Implement smallest slice

- Files:
- Dependencies: T01
- Parallelizable: false
- Verification command:
- Evidence path: `.harness/evidence/<run-id>/T02/`

### T03 — Review and cleanup

- Files:
- Dependencies: T02
- Parallelizable: false
- Verification command:
- Evidence path: `.harness/evidence/<run-id>/T03/`
