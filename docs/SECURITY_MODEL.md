# Security Model

## Scope

Agent Onboard is a workflow harness and evidence collector. It is not an OS sandbox. It must cooperate with the host agent's sandbox, approval policy, and network controls.

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

## Evidence redaction

The MVP redacts common environment variable patterns in stdout/stderr:

- `OPENAI_API_KEY=`
- `API_KEY=`
- `TOKEN=`
- `SECRET=`

Future work T06 adds a security policy engine and stronger redaction.

## Codex configuration example

See `.codex/config.example.toml`.

## Limitations

- The CLI cannot prevent a host agent from running commands outside the CLI.
- The CLI does not yet enforce allow/deny command policy.
- Browser evidence adapters are not implemented yet.
