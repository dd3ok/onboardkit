# Build Verification

Verified on: 2026-07-07

The ZIP was generated after running the following checks from the repository root.

```bash
node --test
node --check ./bin/onboardkit.mjs
node ./bin/onboardkit.mjs doctor
node ./bin/onboardkit.mjs eval
node ./bin/onboardkit.mjs verify --criteria examples/criteria.sample.json
```

Observed result before cleanup:

- `node --test`: pass, 2 tests.
- `node --check ./bin/onboardkit.mjs`: pass.
- `doctor`: pass, including AGENTS.md size and guide metadata.
- `eval`: static eval inventory generated successfully.
- `verify`: sample criteria generated command-backed evidence successfully.

Generated runtime evidence and eval reports were removed before packaging so the repository starts clean. Runtime directories keep `.gitkeep` placeholders.
