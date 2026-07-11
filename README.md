# onboardkit

onboardkit is a lightweight Agent Skill, designed primarily for Codex, that keeps `AGENTS.md` and agent-facing repository docs minimal, current, and correctly scoped. Other Agent Skills runtimes are format-compatibility targets, not verified support.

It does not assume every repository needs `AGENTS.md`. It creates one only when current evidence supports durable, non-obvious guidance that should affect recurring agent work; otherwise it reports a no-op or Needs Input.

There is no helper command, package, scaffolder, runner, dashboard, or task ledger.

## Quickstart

1. Ask Codex's built-in installer to copy only the canonical runtime:

   ```text
   Use $skill-installer to install onboardkit from https://github.com/dd3ok/onboardkit/tree/main/skills/onboardkit
   ```

2. Restart Codex if the skill does not appear.
3. In the target repository, start with an audit or initialization:

   ```text
   Use $onboardkit to initialize only durable, actionable AGENTS.md guidance and docs routing for this repo.
   ```

onboardkit inventories active overrides, configured fallbacks, nested scopes, current docs, manifests, CI, and configuration. It may create a few bullets, update existing guidance, or create nothing.

## What it maintains

- recurring commands, verification, routing, conventions, and safety rules
- active overrides, fallbacks, and subtree-specific guidance
- README onboarding and usage without copying it into always-on agent context
- stale, duplicate, generated, or conflicting guidance
- detailed docs routed to their narrowest current canonical destination

Facts must have current evidence. Imperatives need an explicit policy or user rule. Generated scaffolds, examples, Git history, deleted content, and unconfirmed claims are candidates or observations, not authority.

## Compared with Codex `/init`

Codex [`/init`](https://learn.chatgpt.com/docs/reference/slash-commands) creates a quick starter `AGENTS.md` scaffold for the current project. OpenAI recommends reviewing that draft and adapting it to the team's actual workflow.

onboardkit adds evidence and recurring-value gates, discovers active fallback and nested guidance, maintains existing files, routes detail, and may produce a smaller file—or no file. It does not run `/init` first or copy its fixed outline.

## Safety and compatibility

Deletion is authorized only when the request says delete/remove and supplies each literal file path or a file-matching glob. A directory alone is insufficient, and the agent must not broaden the request.

For other runtimes, install only `skills/onboardkit/` in that runtime's current official skills location. Claude Code supports Agent Skills but reads `CLAUDE.md`, not `AGENTS.md`; use a small `CLAUDE.md` router such as `@AGENTS.md` when shared guidance should apply. Other runtimes remain unverified.

Common prompts:

```text
Use $onboardkit to refresh this existing AGENTS.md without replacing valid guidance.
Use $onboardkit to audit agent-facing docs for stale or duplicate guidance without deleting files.
Use $onboardkit to trim this generated AGENTS.md to recurring actionable rules.
```

## Updating

For an installer-managed copy, remove its installed `onboardkit` directory and repeat the installer prompt.

Existing full-repository installations remain compatible through the root `SKILL.md`. Update a legacy checkout with:

```bash
git -C ~/.agents/skills/onboardkit pull --ff-only
```

Do not use a full-repository checkout for new installations. Clone normally outside a skills directory for source development or repository validation.

## Maintenance

The canonical runtime is `skills/onboardkit/`; root skill files are legacy compatibility shims. Repository CI checks packaging and declarative eval contracts; it does not execute a model. Before release, repeat the critical no-op, descriptive-path, conflicting-command, and mutating-command cases in independent fresh sessions. See [AGENTS.md](AGENTS.md) for the maintainer checklist.

## Help

Report problems or behavior gaps in [GitHub Issues](https://github.com/dd3ok/onboardkit/issues).

## References

- [OpenAI Codex skills](https://learn.chatgpt.com/docs/build-skills)
- [OpenAI AGENTS.md guidance](https://learn.chatgpt.com/docs/agent-configuration/agents-md)
- [OpenAI Codex best practices](https://learn.chatgpt.com/guides/best-practices)
- [Claude Code memory guidance](https://code.claude.com/docs/en/memory)
- [GitHub Copilot repository instructions](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions)
- [Agent Skills specification](https://agentskills.io/specification)
- [Agent Skills evaluation guide](https://agentskills.io/skill-creation/evaluating-skills)
- [AGENTS.md](https://agents.md/)

## License

MIT
