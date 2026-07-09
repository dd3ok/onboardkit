# Analysis: Common Pattern Across Agent Workflow Repositories

## Executive summary

The repository design converges on this thesis:

> AI coding should be controlled by durable project context, explicit artifacts, fresh verification evidence, and repeatable evals, not by one-off prompts.

The most important update from the Vercel eval is that **always-on context beats optional skill retrieval for broad framework knowledge**. Skills remain useful, but primarily as action-specific workflows.

## Source-by-source findings

### Vercel AGENTS.md eval

Key findings:

- Default skill behavior matched baseline in pass rate for their Next.js eval.
- The skill was not invoked in many cases.
- Explicit instructions improved skill usage but were wording-sensitive.
- A compressed docs index in `AGENTS.md` reached the strongest result in the reported eval.
- The docs index did not include full docs; it pointed agents to local docs files.

Design impact:

- Put framework/project-wide docs index in `AGENTS.md`.
- Do not rely on skill triggers for always-needed information.
- Keep docs local and retrievable.
- Build evals for APIs not already in model memory.

Reference: https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals

### OpenAI Codex best practices

Key findings:

- Provide goal, context, constraints, and done condition.
- Plan first for complex or ambiguous tasks.
- Use `AGENTS.md` for reusable guidance.
- Keep `AGENTS.md` practical and concise.
- Use tests, lint, formatting, type checks, behavior confirmation, and review.
- Turn repeatable work into skills.

Design impact:

- Root `AGENTS.md` defines workflow gates, commands, and Definition of Done.
- `templates/` provide reusable spec/design/tasks/review artifacts.
- `.agents/skills/` packages repeatable workflows.
- `doctor` checks basic Codex readiness.

Reference: https://developers.openai.com/codex/learn/best-practices

### OpenAI Codex AGENTS.md guide

Key findings:

- Codex reads `AGENTS.md` before work.
- Guidance is layered from global to project to nested directories.
- Closer files override earlier guidance.
- Combined project docs have a default size limit, so concise guidance matters.

Design impact:

- Keep root `AGENTS.md` concise.
- Put detailed explanations in `docs/` and index them.
- Use `doctor` to warn when `AGENTS.md` exceeds 32 KiB.

Reference: https://developers.openai.com/codex/guides/agents-md

### OpenAI Codex skills

Key findings:

- A skill is a directory with `SKILL.md` plus optional scripts/references/assets.
- `SKILL.md` must include `name` and `description`.
- Skills use progressive disclosure.
- Skills can be invoked explicitly or implicitly.
- Each skill should focus on one job and define explicit inputs/outputs.

Design impact:

- All skills live under `.agents/skills/<skill>/SKILL.md`.
- Skills are vertical workflow procedures, not broad knowledge stores.
- Each skill has concise frontmatter and operational steps.

Reference: https://developers.openai.com/codex/skills

### Superpowers / Superloopy / Spec Kit / BMAD / Matt Pocock / Karpathy-inspired skills

Common extracted practices:

- Clarify before coding.
- Write spec before implementation.
- Design before architecture changes.
- Break work into small verifiable tasks.
- Use TDD or focused verification.
- Review separately from implementation.
- Keep changes surgical.
- Avoid speculative abstraction.
- Store durable project memory outside chat.
- Treat evidence as completion proof.
- Adjust workflow depth to task size.

Design impact:

- Workflow skills map to clarify, specify, design, plan, implement, verify, review, retro.
- CLI and templates create persistent artifacts.
- Evidence runner stores proof JSON and logs.

## Key design synthesis

```text
Always-needed context    -> AGENTS.md + compressed docs index
Task-specific procedure  -> skills
State and artifacts      -> specs/ + .harness/runs
Proof of done            -> .harness/evidence
Quality control          -> review skill + code_review.md
Learning loop            -> retro skill + AGENTS/docs/eval updates
```
