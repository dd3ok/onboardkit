---
name: security-review
description: Review agent-produced changes for security, secret handling, network access, authz/authn, injection, and destructive operations.
---


# Security Review Skill

Use this skill for auth, permissions, secrets, network, dependency, data deletion, or sandbox changes.

## Inputs

- Diff
- Threat model or security-sensitive files
- Evidence logs

## Outputs

- Security section in `review.md`
- Blocking findings for unsafe behavior

## Steps

1. Identify trust boundaries.
2. Check secret exposure in code, logs, and evidence.
3. Check authn/authz and data access.
4. Check command execution, shell injection, and path traversal.
5. Check dependency and network changes.
6. Check destructive operations and rollback.

## Completion criteria

- No unreviewed credential, permission, or network-risk change remains.

