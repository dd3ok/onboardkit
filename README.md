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

Update an existing checkout with:

```bash
git -C ~/.agents/skills/onboardkit pull --ff-only
```

Then ask your coding agent in a target repository:

```text
Use onboardkit to clean up this repo's AGENTS.md and docs.
```

Common prompts:

```text
Use $onboardkit to initialize lightweight AGENTS.md and docs routing for this repo.
Use $onboardkit to refresh this existing AGENTS.md, preserving it and changing only what evidence or routing requires.
Use $onboardkit to audit AGENTS.md and docs for stale or duplicate guidance.
Use $onboardkit to do a monthly maintenance pass on agent-facing docs.
```

## Files

```text
SKILL.md                   skill instructions
agents/openai.yaml         Codex UI metadata
evals/evals.json           behavior evaluation cases
evals/eval_queries.json    trigger boundary cases
AGENTS.md                  maintenance guidance for this repo
README.md                  user-facing summary
LICENSE                    license
.gitignore                 local-file exclusions
.gitattributes             Git text normalization
```

## Maintenance

Keep the skill instruction-only unless a future requirement clearly needs deterministic tooling.

Use the [AGENTS.md](AGENTS.md) Definition of Done as the canonical maintainer checklist. At minimum:

- `SKILL.md` has only `name` and `description` in frontmatter.
- No helper files or package metadata were reintroduced, and README, AGENTS, and `agents/openai.yaml` still match the skill boundary.
- `SKILL.md` remains within its documented word budget.
- Fresh validation uses the canonical behavior and trigger cases or a documented real-repo equivalent.

## References

- [OpenAI Codex skills](https://learn.chatgpt.com/docs/build-skills)
- [OpenAI AGENTS.md guidance](https://learn.chatgpt.com/docs/agent-configuration/agents-md)
- [OpenAI Codex best practices](https://learn.chatgpt.com/guides/best-practices)
- [Claude Code memory guidance](https://code.claude.com/docs/en/memory)
- [Claude Code skills](https://code.claude.com/docs/en/skills)
- [GitHub Copilot repository instructions](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions)
- [Agent Skills specification](https://agentskills.io/specification)
- [Agent Skills evaluation guide](https://agentskills.io/skill-creation/evaluating-skills)
- [AGENTS.md](https://agents.md/)

## License

MIT
