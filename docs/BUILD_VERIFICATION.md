# Build Verification

Verified on: 2026-07-07

The ZIP was generated after running the following checks from the repository root.

```bash
npm test
npm run lint:syntax
node ./bin/after-init.mjs doctor
node ./bin/after-init.mjs eval
node ./bin/after-init.mjs verify --criteria examples/criteria.sample.json
```

Observed result before cleanup:

- `npm test`: pass, 2 tests.
- `npm run lint:syntax`: pass.
- `doctor`: pass, including AGENTS.md size and guide metadata.
- `eval`: static eval inventory generated successfully.
- `verify`: sample criteria generated command-backed evidence successfully.

Generated runtime evidence and eval reports were removed before packaging so the repository starts clean. Runtime directories keep `.gitkeep` placeholders.
