# onboardkit

onboardkit is a lightweight Codex-compatible skill for keeping `AGENTS.md` and repository docs useful for coding agents.

It helps an agent decide:

- how to initialize a small `AGENTS.md`
- how to fill discovered facts while avoiding invented repo-specific guidance
- when to ask the user or report Needs Input instead of guessing
- what belongs in always-on `AGENTS.md`
- when to create `docs/README.md` and deeper docs
- what stale, duplicate, generated, or low-signal docs should be removed
- how README and agent-facing docs should stay aligned

There is no helper command, npm package, scaffolder, runner, dashboard, or task ledger in this repository.

## Install

Install this repository as a user-level skill in a directory your agent supports. For Codex-compatible setups, use the cross-runtime skills directory:

```bash
git clone https://github.com/dd3ok/onboardkit.git ~/.agents/skills/onboardkit
```

For other runtimes, use that runtime's current official user-level skills directory.

Then ask your coding agent in a target repository:

```text
Use onboardkit to clean up this repo's AGENTS.md and docs.
```

Common prompts:

```text
Use $onboardkit to initialize lightweight AGENTS.md and docs routing for this repo.
Use $onboardkit to audit AGENTS.md and docs for stale or duplicate guidance.
Use $onboardkit to do a monthly maintenance pass on agent-facing docs.
```

## Files

```text
SKILL.md                   skill instructions
agents/openai.yaml         Codex UI metadata
AGENTS.md                  maintenance guidance for this repo
README.md                  user-facing summary
LICENSE                    license
.gitignore                 local-file exclusions
.gitattributes             Git text normalization
```

## Maintenance

Keep the skill instruction-only unless a future requirement clearly needs deterministic tooling.

When changing the skill, check:

- `SKILL.md` has only `name` and `description` in frontmatter.
- No helper files or package metadata were reintroduced.
- README and AGENTS describe the same product boundary.
- `SKILL.md` stays at or below 400 words unless a verified scenario needs more detail.
- The skill still covers initialization, routing, cleanup, and recurring maintenance.
- The skill still fills from evidence, avoids guessing, reports Needs Input, preserves durable guidance before deletion, keeps one canonical destination per fact, requires a no-op when no actionable issue exists, stages unattended deletion or promotion for review, and distinguishes command results from review findings.
- Fresh scenario or real-repo checks show the skill avoids invented commands, routes durable docs, and reports conflicts.

## References

- [OpenAI Codex skills](https://developers.openai.com/codex/skills)
- [OpenAI AGENTS.md guidance](https://developers.openai.com/codex/guides/agents-md)
- [OpenAI Codex best practices](https://developers.openai.com/codex/learn/best-practices)
- [Claude Code memory guidance](https://code.claude.com/docs/en/memory)
- [Claude Code skills](https://code.claude.com/docs/en/skills)
- [GitHub Copilot repository instructions](https://docs.github.com/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot)
- [AGENTS.md](https://agents.md/)

## License

MIT
