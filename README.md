# onboardkit

onboardkit is a lightweight Agent Skill, designed primarily for Codex, that keeps `AGENTS.md` and agent-facing repository docs minimal, current, and correctly scoped. Codex is the only behavior-tested target; other runtime status is listed below.

It does not assume every repository needs `AGENTS.md`. It creates one only when current evidence supports durable, non-obvious guidance that should affect recurring agent work; otherwise it reports a no-op or nonblocking gap. Needs Input identifies unresolved current policy or command-evidence conflicts, or missing authority that blocks a requested non-no-op change.

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

This installer path follows `main` and is intended for local setup and evaluation. For a reproducible install, replace `main` in the URL with a published release tag. Inspect the canonical `SKILL.md` before installation; the runtime is instruction-only and contains no executable helper. For reusable workspace distribution, OpenAI recommends packaging the skill as a plugin; this repository does not currently ship one.

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

Support levels are intentionally narrow:

| Runtime | Status | Guidance |
| --- | --- | --- |
| Codex | Primary; behavior-tested | Install the canonical runtime with `$skill-installer`; release claims use the change-routed protocol in `AGENTS.md`. |
| Claude Code | Format-compatible, unverified | Claude reads `CLAUDE.md`; use a small `@AGENTS.md` router when shared guidance should apply. |
| Hermes | Agent Skills-compatible, unverified | For shared external skill directories, use filesystem permissions or `skills.write_approval: true` before allowing agent-managed updates. |
| OpenClaw | Not vendor-optimized or verified | Its current guide recommends descriptions under 160 characters; the canonical description remains longer because it is Codex-optimized. |
| GitHub Copilot | Instruction-surface integration only | Maintain `AGENTS.md` only where the active Copilot surface supports it. |

Do not infer equivalent discovery, invocation, or mutation behavior across runtimes until it has been tested on a named version.

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

The canonical runtime is `skills/onboardkit/`; root skill files are legacy compatibility shims. Repository CI checks packaging and declarative eval contracts; it does not execute a model.

Release evaluation is routed by the changed surface so documentation-only releases do not pay for model runs. See [AGENTS.md](AGENTS.md) for trigger, behavior, baseline, isolation, early-stop, and evidence rules.

### Release evaluation (2026-07-12)

Behavior-evaluated runtime commit `6e2d9b2` was compared with release `v0.1.0` (`c41f6c6`) using Codex CLI `0.144.0-alpha.4`, model `gpt-5.6-sol`, fresh isolated targets, separate `CODEX_HOME` directories, explicit project trust, and verified fixture manifests. The trigger track passed all 48 labeled query/context groups across 24 queries; early stopping produced 102 candidate runs. The baseline failed 15 groups. The unchanged final description reuses the passing trigger-description commit `b7ed008`, while runtime-commit invocation smoke passed 4/4.

The behavior track passed all 34 candidate case gates and all 14 critical cases; 31 cases received three attempts per version. Cases 19 and 21 varied within the candidate at 2/3 passes, while all other candidate cases were stable; the baseline failed 26 case gates. The trigger track used 26.78M input tokens (21.30M cached) and 341.9K output tokens. Behavior execution plus grading used 18.55M input tokens (14.60M cached) and 336.1K output tokens. These release-evaluation totals include baseline comparison and repeated isolated runs; they are not per-use runtime costs.

## Help

Report problems or behavior gaps in [GitHub Issues](https://github.com/dd3ok/onboardkit/issues).

## References

- [OpenAI Codex skills](https://learn.chatgpt.com/docs/build-skills)
- [OpenAI AGENTS.md guidance](https://learn.chatgpt.com/docs/agent-configuration/agents-md)
- [OpenAI Codex best practices](https://learn.chatgpt.com/guides/best-practices)
- [Agent Skills authoring guidance](https://agentskills.io/skill-creation/best-practices)
- [Agent Skills description optimization](https://agentskills.io/skill-creation/optimizing-descriptions)
- [Claude Code memory guidance](https://code.claude.com/docs/en/memory)
- [GitHub Copilot repository instructions](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions)
- [OpenClaw skill creation](https://docs.openclaw.ai/tools/creating-skills)
- [Hermes skills system](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills)
- [Agent Skills specification](https://agentskills.io/specification)
- [Agent Skills evaluation guide](https://agentskills.io/skill-creation/evaluating-skills)
- [AGENTS.md](https://agents.md/)

## License

MIT
