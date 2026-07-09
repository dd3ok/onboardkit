# Security Model

## Scope

after-init is a repo preparation toolkit and evidence collector. It is not an OS sandbox. It must cooperate with the host agent's sandbox, approval policy, and network controls.

## Safe defaults

- Prefer Codex `sandbox_mode = "workspace-write"` for local implementation work.
- Prefer `approval_policy = "on-request"` for interactive development.
- Keep `sandbox_workspace_write.network_access = false` by default.
- Do not use `danger-full-access` as a default.
- Do not persist secrets in evidence.

## Risky actions requiring approval

- Adding production dependencies.
- Running commands that use network access.
- Deleting data or modifying migrations.
- Rotating credentials.
- Writing outside the repository.
- Running infrastructure tools such as Terraform or kubectl.
- Publishing packages or pushing tags.

## Command policy v0

`after-init verify` evaluates command criteria before execution.

- Deny rules win over allow and prompt rules.
- Prompt-required rules fail closed unless a criterion carries explicit `policy_approval: true`; approved prompt-required commands are recorded as allowed.
- Non-prompt commands must match exact allow rules unless the policy explicitly sets `unknown` to `allow`.
- Built-in defaults deny destructive commands, shell chaining, pipes, redirects, and several host-level destructive operations.
- Built-in defaults mark publish, push, release, network fetch, infrastructure, and remote shell commands as prompt-required.
- Policy decisions, timeout, and output limits are recorded in `proof.json`.

Project policy can be committed at `.harness/security-policy.json`; `templates/security-policy.template.json` shows the supported shape.

## Static security audit v0

`after-init doctor --security` emits stable findings with IDs:

- `AFTER-SEC-001`: AGENTS.md security guardrails.
- `AFTER-SEC-002`: safe `.codex/config.example.toml`.
- `AFTER-SEC-003`: no unsafe active `.codex/config.toml`.
- `AFTER-SEC-004`: runtime outputs ignored by git.
- `AFTER-SEC-005`: command policy fail-closed defaults.
- `AFTER-SEC-006`: evidence secret redaction patterns.

The audit is intentionally shallow. It checks local files and built-in policy posture; it does not replace host sandboxing, approvals, code review, or a runtime permission service.

## Evidence redaction

The MVP redacts common environment variable patterns in stdout/stderr:

- `OPENAI_API_KEY=`
- `API_KEY=`
- `TOKEN=`
- `SECRET=`

Future hardening should add broader redaction patterns.

## Codex configuration example

See `.codex/config.example.toml`.

## Limitations

- The CLI cannot prevent a host agent from running commands outside the CLI.
- Command policy v0 is exact-allow and pattern-based; it is not an OS sandbox.
- Static security audit v0 is shallow and local-file based.
- Browser evidence adapters are not implemented yet.
