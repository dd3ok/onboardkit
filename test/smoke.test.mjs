import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { buildDocsIndex, formatCompressedIndex } from '../src/lib/docs-indexer.mjs';
import { runDoctor } from '../src/lib/doctor.mjs';
import { runCriteriaFile } from '../src/lib/evidence.mjs';
import { runSecurityAudit } from '../src/lib/security-audit.mjs';
import { runGuideAudit } from '../src/lib/guide-audit.mjs';
import { createProjectScaffold } from '../src/lib/specs.mjs';
import { sha256Buffer, sha256Json } from '../src/lib/hash.mjs';

function listTextFiles(root) {
  const out = [];
  const skipDirs = new Set([
    '.git',
    '.harness',
    'node_modules',
    'dist',
    'build',
    'coverage',
    '.next',
    '.vercel',
    '.nyc_output'
  ]);
  const skipFiles = new Set(['package-lock.json', 'pnpm-lock.yaml', 'yarn.lock']);
  const textExts = new Set(['.json', '.md', '.mjs', '.toml', '.txt', '.yaml', '.yml']);

  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (skipDirs.has(entry.name)) continue;
    const p = path.join(root, entry.name);
    if (entry.isDirectory()) {
      out.push(...listTextFiles(p));
    } else if (entry.isFile()) {
      if (skipFiles.has(entry.name)) continue;
      if (textExts.has(path.extname(entry.name)) || entry.name === 'LICENSE') {
        out.push(p);
      }
    }
  }
  return out;
}

function writeProof(root, runId, item) {
  const itemDir = path.join(root, '.harness', 'evidence', runId, item.id);
  fs.mkdirSync(itemDir, { recursive: true });
  const proofPath = path.join(itemDir, 'proof.json');
  const proof = {
    run_id: runId,
    criterion_id: item.id,
    type: item.type || 'command',
    description: item.description || item.id,
    criterion_hash: item.criterionHash,
    criteria_file: item.criteriaFile,
    criteria_file_sha256: item.criteriaFileHash,
    required: item.required !== false,
    created_at: item.created_at || new Date().toISOString(),
    fresh: item.fresh !== false,
    ok: item.ok === true,
    status: item.status,
    policy_status: item.policy_status,
    log_path: item.log_path || path.join(itemDir, 'commands.log')
  };
  if (!item.missingLog && proof.log_path) {
    fs.mkdirSync(path.dirname(proof.log_path), { recursive: true });
    fs.writeFileSync(proof.log_path, 'log');
  }
  fs.writeFileSync(proofPath, JSON.stringify(proof, null, 2));
  return proofPath;
}

function writeRunReport(root, runId, items) {
  const runRoot = path.join(root, '.harness', 'evidence', runId);
  fs.mkdirSync(runRoot, { recursive: true });
  const criteriaFile = path.join(root, 'criteria.json');
  const criteria = items.map(item => ({
    id: item.id,
    description: item.description || item.id,
    type: item.type || 'command',
    required: item.required !== false,
    command: 'node --version'
  }));
  fs.writeFileSync(criteriaFile, JSON.stringify({ criteria }, null, 2));
  const criteriaFileHash = sha256Buffer(fs.readFileSync(criteriaFile));
  const results = items.map(item => {
    const criterion = criteria.find(candidate => candidate.id === item.id);
    const criterionHash = criterion ? sha256Json(criterion) : null;
    const itemWithHashes = { ...item, criterionHash, criteriaFile, criteriaFileHash };
    const evidencePath = item.missing ? path.join(runRoot, item.id, 'proof.json') : writeProof(root, runId, itemWithHashes);
    return {
      id: item.id,
      description: item.description || item.id,
      required: item.required !== false,
      ok: item.ok === true,
      criterionHash,
      evidencePath
    };
  });
  fs.writeFileSync(path.join(runRoot, 'run-report.json'), JSON.stringify({
    runId,
    ok: results.every(item => item.ok || !item.required),
    createdAt: new Date().toISOString(),
    criteriaFile,
    criteriaFileHash,
    criteriaCount: criteria.length,
    results
  }, null, 2));
}

test('docs indexer creates compact index', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ahk-docs-'));
  fs.mkdirSync(path.join(dir, 'guide'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'guide', 'intro.md'), '# Intro');
  const index = buildDocsIndex({ source: dir, name: 'tmp', rootAlias: './docs' });
  const text = formatCompressedIndex(index);
  assert.match(text, /\[tmp Docs Index\]/);
  assert.match(text, /guide:\{intro.md\}/);
});

test('doctor validates current repository basics', () => {
  const report = runDoctor({ cwd: process.cwd() });
  assert.equal(report.checks.some(c => c.name === 'AGENTS.md exists' && c.ok), true);
  assert.equal(report.checks.some(c => c.name.startsWith('Guide metadata') && c.ok), true);
});

test('doctor leaves after-init governance checks opt-in', () => {
  const report = runDoctor({ cwd: process.cwd() });

  assert.equal(report.ok, true);
  assert.equal(report.checks.some(c => c.name === 'after-init SOT boundary present'), false);
});

test('doctor validates after-init governance boundaries when requested', () => {
  const report = runDoctor({ cwd: process.cwd(), governance: true });
  const requiredChecks = [
    'after-init SOT boundary present',
    'after-init roadmap priority present',
    'after-init heavyweight work stays non-core',
    'after-init best-practice audit guards lightweight workflow',
    'after-init docs index references governance docs'
  ];

  for (const name of requiredChecks) {
    assert.equal(report.checks.some(c => c.name === name && c.ok), true, name);
  }
});

test('security audit emits stable finding IDs for current repository', () => {
  const report = runSecurityAudit({ cwd: process.cwd() });

  assert.equal(report.ok, true);
  assert.deepEqual(report.findings.map(finding => finding.id), [
    'AFTER-SEC-001',
    'AFTER-SEC-002',
    'AFTER-SEC-003',
    'AFTER-SEC-004',
    'AFTER-SEC-005',
    'AFTER-SEC-006'
  ]);
  assert.equal(report.findings.every(finding => ['pass', 'warn', 'fail'].includes(finding.status)), true);
});

test('security audit fails unsafe active Codex config', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ahk-security-audit-'));
  fs.mkdirSync(path.join(dir, '.codex'), { recursive: true });
  fs.writeFileSync(path.join(dir, '.codex', 'config.toml'), [
    'approval_policy = "never"',
    'sandbox_mode = "danger-full-access"',
    '',
    '[sandbox_workspace_write]',
    'network_access = true',
    ''
  ].join('\n'));

  const report = runSecurityAudit({ cwd: dir });
  const finding = report.findings.find(item => item.id === 'AFTER-SEC-003');

  assert.equal(report.ok, false);
  assert.equal(finding.status, 'fail');
  assert.match(finding.detail, /danger-full-access/);
  assert.match(finding.detail, /approval_policy = "never"/);
  assert.match(finding.detail, /network_access = true/);
});

test('guide audit emits stable finding IDs for current repository', () => {
  const report = runGuideAudit({ cwd: process.cwd() });

  assert.equal(report.ok, true);
  assert.deepEqual(report.findings.map(finding => finding.id), [
    'AFTER-GUIDE-001',
    'AFTER-GUIDE-002',
    'AFTER-GUIDE-003',
    'AFTER-GUIDE-004',
    'AFTER-GUIDE-005'
  ]);
  assert.equal(report.findings.every(finding => ['pass', 'warn', 'fail'].includes(finding.status)), true);
});

test('guide audit fails duplicate names and missing contracts', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ahk-guide-audit-'));
  fs.mkdirSync(path.join(dir, '.agents', 'skills', 'bad-one'), { recursive: true });
  fs.mkdirSync(path.join(dir, '.agents', 'skills', 'bad-two'), { recursive: true });
  fs.writeFileSync(path.join(dir, '.agents', 'skills', 'bad-one', 'SKILL.md'), [
    '---',
    'name: duplicate',
    `description: ${'Long trigger text '.repeat(20)}`,
    '---',
    '',
    '# Bad One',
    '',
    'No contract sections.',
    'x'.repeat(17 * 1024),
    ''
  ].join('\n'));
  fs.writeFileSync(path.join(dir, '.agents', 'skills', 'bad-two', 'SKILL.md'), [
    '---',
    'name: duplicate',
    'description: Duplicate guide name.',
    '---',
    '',
    '# Bad Two',
    '',
    '## Inputs',
    '- input',
    '',
    '## Outputs',
    '- output',
    ''
  ].join('\n'));

  const report = runGuideAudit({ cwd: dir });
  const byId = new Map(report.findings.map(finding => [finding.id, finding]));

  assert.equal(report.ok, false);
  assert.equal(byId.get('AFTER-GUIDE-002').status, 'fail');
  assert.match(byId.get('AFTER-GUIDE-002').detail, /duplicate/);
  assert.equal(byId.get('AFTER-GUIDE-003').status, 'fail');
  assert.equal(byId.get('AFTER-GUIDE-004').status, 'fail');
  assert.equal(byId.get('AFTER-GUIDE-005').status, 'fail');
});

test('doctor does not require internal planning or SOT documents', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ahk-doctor-'));
  fs.mkdirSync(path.join(dir, '.agents', 'skills', 'sample'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'AGENTS.md'), [
    '# AGENTS.md',
    '',
    '## Definition of Done',
    '',
    '- Run checks.',
    '',
    '<!-- after-init:docs-index:start -->',
    '[Project Docs Index]|root: ./docs',
    '<!-- after-init:docs-index:end -->',
    ''
  ].join('\n'));
  fs.writeFileSync(path.join(dir, '.agents', 'skills', 'sample', 'SKILL.md'), [
    '---',
    'name: sample',
    'description: Sample guide for doctor validation.',
    '---',
    '',
    'Sample instructions.',
    ''
  ].join('\n'));

  const report = runDoctor({ cwd: dir });

  assert.equal(report.ok, true);
  assert.equal(report.checks.some(c => c.name.includes('SOT')), false);
  assert.equal(report.checks.some(c => c.name.includes('TODO')), false);
});

test('init scaffold includes security policy template', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ahk-init-'));
  createProjectScaffold({ target: dir, toolRoot: process.cwd() });
  const policy = JSON.parse(fs.readFileSync(path.join(dir, '.harness', 'security-policy.json'), 'utf8'));
  const agents = fs.readFileSync(path.join(dir, 'AGENTS.md'), 'utf8');
  const gitignore = fs.readFileSync(path.join(dir, '.gitignore'), 'utf8');

  assert.equal(policy.version, 1);
  assert.equal(policy.unknown, 'deny');
  assert.equal(policy.allow.includes('npm test'), true);
  assert.match(agents, /danger-full-access/);
  assert.match(agents, /network access off by default/);
  assert.match(gitignore, /\.harness\/evidence\/\*/);
  assert.match(gitignore, /\.harness\/reports\/\*/);
});

test('init scaffold installs optional host adapter shims only when requested', () => {
  const basicDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ahk-init-basic-'));
  const shimDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ahk-init-shims-'));

  createProjectScaffold({ target: basicDir, toolRoot: process.cwd() });
  const result = createProjectScaffold({ target: shimDir, toolRoot: process.cwd(), hostShims: true });

  const gemini = path.join(shimDir, 'GEMINI.md');
  const copilot = path.join(shimDir, '.github', 'copilot-instructions.md');
  const cursor = path.join(shimDir, '.cursor', 'rules', 'after-init.mdc');

  assert.equal(fs.existsSync(path.join(basicDir, 'GEMINI.md')), false);
  assert.equal(fs.existsSync(path.join(basicDir, '.github', 'copilot-instructions.md')), false);
  assert.equal(fs.existsSync(path.join(basicDir, '.cursor', 'rules', 'after-init.mdc')), false);
  assert.equal(fs.existsSync(gemini), true);
  assert.equal(fs.existsSync(copilot), true);
  assert.equal(fs.existsSync(cursor), true);
  assert.equal(result.created.includes('GEMINI.md'), true);
  assert.equal(result.created.includes('.github/copilot-instructions.md'), true);
  assert.equal(result.created.includes('.cursor/rules/after-init.mdc'), true);
  for (const file of [gemini, copilot, cursor]) {
    const text = fs.readFileSync(file, 'utf8');
    assert.match(text, /AGENTS\.md/);
    assert.match(text, /canonical/i);
  }
});

test('command evidence proof includes schema-required creation timestamp', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ahk-evidence-'));
  const criteriaFile = path.join(dir, 'criteria.json');
  fs.writeFileSync(criteriaFile, JSON.stringify({
    criteria: [
      {
        id: 'C01',
        description: 'No-op command',
        type: 'command',
        command: 'node --version'
      }
    ]
  }));

  const report = runCriteriaFile({ cwd: dir, criteriaFile, runId: 'test-command-proof' });
  const proof = JSON.parse(fs.readFileSync(report.results[0].evidencePath, 'utf8'));

  assert.equal(typeof proof.created_at, 'string');
  assert.match(proof.created_at, /^\d{4}-\d{2}-\d{2}T/);
  assert.equal(proof.policy_status, 'allowed');
  assert.equal(proof.normalized_command, 'node --version');
});

test('command policy denies destructive commands before execution', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ahk-policy-deny-'));
  const criteriaFile = path.join(dir, 'criteria.json');
  fs.writeFileSync(criteriaFile, JSON.stringify({
    criteria: [
      {
        id: 'C01',
        description: 'Dangerous command',
        type: 'command',
        command: 'git reset --hard'
      }
    ]
  }));

  const report = runCriteriaFile({ cwd: dir, criteriaFile, runId: 'test-policy-deny' });
  const proof = JSON.parse(fs.readFileSync(report.results[0].evidencePath, 'utf8'));
  const log = fs.readFileSync(proof.log_path, 'utf8');

  assert.equal(report.ok, false);
  assert.equal(proof.ok, false);
  assert.equal(proof.policy_status, 'denied');
  assert.equal(proof.policy_rule, 'deny:git-reset-hard');
  assert.match(log, /Command was not executed/);
});

test('command policy fails prompt-required commands closed', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ahk-policy-prompt-'));
  const criteriaFile = path.join(dir, 'criteria.json');
  fs.writeFileSync(criteriaFile, JSON.stringify({
    criteria: [
      {
        id: 'C01',
        description: 'Publishing command',
        type: 'command',
        command: 'npm publish'
      }
    ]
  }));

  const report = runCriteriaFile({ cwd: dir, criteriaFile, runId: 'test-policy-prompt' });
  const proof = JSON.parse(fs.readFileSync(report.results[0].evidencePath, 'utf8'));

  assert.equal(report.ok, false);
  assert.equal(proof.ok, false);
  assert.equal(proof.policy_status, 'prompt-required');
  assert.equal(proof.policy_rule, 'prompt:npm-publish');
});

test('command policy allows explicitly approved prompt-required commands', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ahk-policy-approved-prompt-'));
  fs.mkdirSync(path.join(dir, '.harness'), { recursive: true });
  fs.writeFileSync(path.join(dir, '.harness', 'security-policy.json'), JSON.stringify({
    version: 1,
    unknown: 'deny',
    prompt: [
      {
        id: 'approved-safe-command',
        exact: 'node -e "process.exit(0)"',
        reason: 'Test-only prompt-required safe command.'
      }
    ]
  }));
  const criteriaFile = path.join(dir, 'criteria.json');
  fs.writeFileSync(criteriaFile, JSON.stringify({
    criteria: [
      {
        id: 'C01',
        description: 'Approved prompt command',
        type: 'command',
        command: 'node -e "process.exit(0)"',
        policy_approval: true,
        policy_approval_reason: 'Safe test command.'
      }
    ]
  }));

  const report = runCriteriaFile({ cwd: dir, criteriaFile, runId: 'test-policy-approved-prompt' });
  const proof = JSON.parse(fs.readFileSync(report.results[0].evidencePath, 'utf8'));

  assert.equal(report.ok, true);
  assert.equal(proof.ok, true);
  assert.equal(proof.policy_status, 'allowed');
  assert.equal(proof.policy_rule, 'prompt-approved:approved-safe-command');
  assert.equal(proof.policy_approval, true);
});

test('command policy redacts command secrets before persistence', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ahk-policy-redact-'));
  const criteriaFile = path.join(dir, 'criteria.json');
  fs.writeFileSync(criteriaFile, JSON.stringify({
    criteria: [
      {
        id: 'C01',
        description: 'Command with secret-like argument',
        type: 'command',
        command: 'OPENAI_API_KEY=sk-test-secret node --version'
      }
    ]
  }));

  const report = runCriteriaFile({ cwd: dir, criteriaFile, runId: 'test-policy-redact' });
  const proof = JSON.parse(fs.readFileSync(report.results[0].evidencePath, 'utf8'));
  const log = fs.readFileSync(proof.log_path, 'utf8');

  assert.equal(proof.command.includes('sk-test-secret'), false);
  assert.equal(proof.normalized_command.includes('sk-test-secret'), false);
  assert.equal(log.includes('sk-test-secret'), false);
  assert.match(proof.command, /OPENAI_API_KEY=\[REDACTED\]/);
});

test('command policy records timeout and output limit failures', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ahk-policy-limits-'));
  fs.mkdirSync(path.join(dir, '.harness'), { recursive: true });
  fs.writeFileSync(path.join(dir, '.harness', 'security-policy.json'), JSON.stringify({
    version: 1,
    allow: [
      'node -e "setTimeout(function(){}, 2000)"',
      'node -e "console.log(\'x\'.repeat(100000))"'
    ],
    timeout_ms: 50,
    max_output_bytes: 64
  }));
  const criteriaFile = path.join(dir, 'criteria.json');
  fs.writeFileSync(criteriaFile, JSON.stringify({
    criteria: [
      {
        id: 'T01',
        description: 'Timeout command',
        type: 'command',
        command: 'node -e "setTimeout(function(){}, 2000)"'
      },
      {
        id: 'O01',
        description: 'Large output command',
        type: 'command',
        command: 'node -e "console.log(\'x\'.repeat(100000))"',
        timeout_ms: 2000
      }
    ]
  }));

  const report = runCriteriaFile({ cwd: dir, criteriaFile, runId: 'test-policy-limits' });
  const timeoutProof = JSON.parse(fs.readFileSync(report.results[0].evidencePath, 'utf8'));
  const outputProof = JSON.parse(fs.readFileSync(report.results[1].evidencePath, 'utf8'));

  assert.equal(report.ok, false);
  assert.equal(timeoutProof.timed_out, true);
  assert.equal(timeoutProof.ok, false);
  assert.equal(outputProof.output_limited, true);
  assert.equal(outputProof.ok, false);
});

test('artifact evidence records file hash size and timestamp', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ahk-artifact-evidence-'));
  fs.mkdirSync(path.join(dir, 'artifacts'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'artifacts', 'report.txt'), 'artifact evidence');
  const criteriaFile = path.join(dir, 'criteria.json');
  fs.writeFileSync(criteriaFile, JSON.stringify({
    criteria: [
      {
        id: 'A01',
        description: 'Generated report exists',
        type: 'artifact',
        path: 'artifacts/report.txt'
      }
    ]
  }));

  const report = runCriteriaFile({ cwd: dir, criteriaFile, runId: 'test-artifact-evidence' });
  const proof = JSON.parse(fs.readFileSync(report.results[0].evidencePath, 'utf8'));

  assert.equal(report.ok, true);
  assert.equal(proof.ok, true);
  assert.equal(proof.status, 'artifact-present');
  assert.equal(proof.artifact_path, path.join(dir, 'artifacts', 'report.txt'));
  assert.equal(proof.artifact_size_bytes, 'artifact evidence'.length);
  assert.equal(typeof proof.artifact_sha256, 'string');
  assert.match(proof.artifact_mtime, /^\d{4}-\d{2}-\d{2}T/);
});

test('finish gate marks required missing artifact evidence incomplete', async () => {
  const { finishRun } = await import('../src/lib/finish-gate.mjs');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ahk-artifact-missing-'));
  const criteriaFile = path.join(dir, 'criteria.json');
  fs.writeFileSync(criteriaFile, JSON.stringify({
    criteria: [
      {
        id: 'A01',
        description: 'Missing report',
        type: 'artifact',
        path: 'artifacts/missing.txt'
      }
    ]
  }));

  runCriteriaFile({ cwd: dir, criteriaFile, runId: 'test-artifact-missing' });
  const verdict = finishRun({ cwd: dir, runId: 'test-artifact-missing' });

  assert.equal(verdict.verdict, 'INCOMPLETE');
  assert.equal(verdict.required[0].reason, 'missing-artifact');
});

test('finish gate warns on optional missing artifact evidence', async () => {
  const { finishRun } = await import('../src/lib/finish-gate.mjs');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ahk-artifact-optional-'));
  const criteriaFile = path.join(dir, 'criteria.json');
  fs.writeFileSync(criteriaFile, JSON.stringify({
    criteria: [
      {
        id: 'C01',
        description: 'Pass command',
        type: 'command',
        command: 'node --version'
      },
      {
        id: 'A01',
        description: 'Optional missing report',
        type: 'artifact',
        path: 'artifacts/missing.txt',
        required: false
      }
    ]
  }));

  runCriteriaFile({ cwd: dir, criteriaFile, runId: 'test-artifact-optional' });
  const verdict = finishRun({ cwd: dir, runId: 'test-artifact-optional' });

  assert.equal(verdict.verdict, 'PASS');
  assert.equal(verdict.warnings.length, 1);
  assert.equal(verdict.warnings[0].reason, 'missing-artifact');
});

test('artifact evidence rejects paths outside the workspace', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ahk-artifact-path-'));
  const criteriaFile = path.join(dir, 'criteria.json');
  fs.writeFileSync(criteriaFile, JSON.stringify({
    criteria: [
      {
        id: 'A01',
        description: 'Unsafe artifact path',
        type: 'artifact',
        path: '../outside.txt'
      },
      {
        id: 'A02',
        description: 'Drive-relative artifact path',
        type: 'artifact',
        path: 'C:outside.txt'
      }
    ]
  }));

  const report = runCriteriaFile({ cwd: dir, criteriaFile, runId: 'test-artifact-path' });
  const proof = JSON.parse(fs.readFileSync(report.results[0].evidencePath, 'utf8'));
  const driveProof = JSON.parse(fs.readFileSync(report.results[1].evidencePath, 'utf8'));

  assert.equal(report.ok, false);
  assert.equal(proof.ok, false);
  assert.equal(proof.status, 'invalid-artifact-path');
  assert.equal(driveProof.ok, false);
  assert.equal(driveProof.status, 'invalid-artifact-path');
});

test('manual and browser-adjacent evidence types are file-backed artifacts', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ahk-artifact-types-'));
  fs.mkdirSync(path.join(dir, 'artifacts'), { recursive: true });
  const types = ['manual', 'review', 'screenshot', 'browser-log'];
  for (const type of types) {
    fs.writeFileSync(path.join(dir, 'artifacts', `${type}.txt`), `${type} evidence`);
  }
  const criteriaFile = path.join(dir, 'criteria.json');
  fs.writeFileSync(criteriaFile, JSON.stringify({
    criteria: types.map((type, index) => ({
      id: `A0${index + 1}`,
      description: `${type} evidence`,
      type,
      path: `artifacts/${type}.txt`
    }))
  }));

  const report = runCriteriaFile({ cwd: dir, criteriaFile, runId: 'test-artifact-types' });

  assert.equal(report.ok, true);
  for (const result of report.results) {
    const proof = JSON.parse(fs.readFileSync(result.evidencePath, 'utf8'));
    assert.equal(proof.status, 'artifact-present');
    assert.equal(proof.artifact_kind, proof.type);
  }
});

test('finish gate marks missing or changed artifacts incomplete', async () => {
  const { finishRun } = await import('../src/lib/finish-gate.mjs');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ahk-artifact-stale-'));
  fs.mkdirSync(path.join(dir, 'artifacts'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'artifacts', 'missing.txt'), 'will be deleted');
  fs.writeFileSync(path.join(dir, 'artifacts', 'changed.txt'), 'original');
  const criteriaFile = path.join(dir, 'criteria.json');
  fs.writeFileSync(criteriaFile, JSON.stringify({
    criteria: [
      {
        id: 'A01',
        description: 'Deleted artifact',
        type: 'artifact',
        path: 'artifacts/missing.txt'
      },
      {
        id: 'A02',
        description: 'Changed artifact',
        type: 'artifact',
        path: 'artifacts/changed.txt'
      }
    ]
  }));

  runCriteriaFile({ cwd: dir, criteriaFile, runId: 'test-artifact-stale' });
  fs.unlinkSync(path.join(dir, 'artifacts', 'missing.txt'));
  fs.writeFileSync(path.join(dir, 'artifacts', 'changed.txt'), 'changed');
  const verdict = finishRun({ cwd: dir, runId: 'test-artifact-stale' });

  assert.equal(verdict.verdict, 'INCOMPLETE');
  assert.deepEqual(verdict.required.map(item => item.reason), ['missing-artifact', 'artifact-hash-mismatch']);
});

test('finish gate marks changed criteria incomplete', async () => {
  const { finishRun } = await import('../src/lib/finish-gate.mjs');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ahk-finish-criteria-stale-'));
  const criteriaFile = path.join(dir, 'criteria.json');
  fs.writeFileSync(criteriaFile, JSON.stringify({
    criteria: [
      {
        id: 'C01',
        description: 'Original command',
        type: 'command',
        command: 'node --version'
      }
    ]
  }));

  runCriteriaFile({ cwd: dir, criteriaFile, runId: 'criteria-stale-run' });
  fs.writeFileSync(criteriaFile, JSON.stringify({
    criteria: [
      {
        id: 'C01',
        description: 'Changed command',
        type: 'command',
        command: 'node --version'
      },
      {
        id: 'C02',
        description: 'New required command',
        type: 'command',
        command: 'node --version'
      }
    ]
  }));
  const verdict = finishRun({ cwd: dir, runId: 'criteria-stale-run' });
  const reasons = verdict.required.map(item => item.reason);

  assert.equal(verdict.verdict, 'INCOMPLETE');
  assert.equal(reasons.includes('criteria-file-hash-mismatch'), true);
  assert.equal(reasons.includes('criterion-hash-mismatch'), true);
  assert.equal(reasons.includes('missing-result-for-current-criterion'), true);
});

test('finish gate passes required fresh evidence and warns on optional failures', async () => {
  const { finishRun } = await import('../src/lib/finish-gate.mjs');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ahk-finish-pass-'));
  writeRunReport(dir, 'pass-run', [
    { id: 'C01', ok: true, required: true },
    { id: 'C02', ok: false, required: false }
  ]);

  const verdict = finishRun({ cwd: dir, runId: 'pass-run' });

  assert.equal(verdict.verdict, 'PASS');
  assert.equal(verdict.ok, true);
  assert.equal(verdict.required.length, 1);
  assert.equal(verdict.warnings.length, 1);
  assert.equal(verdict.warnings[0].status, 'warn');
});

test('finish gate fails required failed or policy-denied evidence', async () => {
  const { finishRun } = await import('../src/lib/finish-gate.mjs');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ahk-finish-fail-'));
  writeRunReport(dir, 'fail-run', [
    { id: 'C01', ok: false, required: true, policy_status: 'denied' }
  ]);

  const verdict = finishRun({ cwd: dir, runId: 'fail-run' });

  assert.equal(verdict.verdict, 'FAIL');
  assert.equal(verdict.ok, false);
  assert.equal(verdict.required[0].status, 'fail');
  assert.equal(verdict.required[0].reason, 'policy-denied');
});

test('finish gate marks missing, pending, or stale required evidence incomplete', async () => {
  const { finishRun } = await import('../src/lib/finish-gate.mjs');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ahk-finish-incomplete-'));
  writeRunReport(dir, 'incomplete-run', [
    { id: 'M01', ok: false, required: true, missing: true },
    { id: 'P01', ok: false, required: true, type: 'manual', status: 'pending-manual-evidence' },
    { id: 'S01', ok: true, required: true, fresh: false }
  ]);

  const verdict = finishRun({ cwd: dir, runId: 'incomplete-run' });
  const reasons = verdict.required.map(item => item.reason);

  assert.equal(verdict.verdict, 'INCOMPLETE');
  assert.equal(verdict.ok, false);
  assert.deepEqual(reasons, ['missing-proof', 'pending-evidence', 'stale-evidence']);
});

test('finish gate marks missing referenced command logs incomplete', async () => {
  const { finishRun } = await import('../src/lib/finish-gate.mjs');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ahk-finish-missing-log-'));
  writeRunReport(dir, 'missing-log-run', [
    { id: 'C01', ok: true, required: true, missingLog: true }
  ]);

  const verdict = finishRun({ cwd: dir, runId: 'missing-log-run' });

  assert.equal(verdict.verdict, 'INCOMPLETE');
  assert.equal(verdict.required[0].reason, 'missing-log');
});

test('finish gate writes report when run report is missing', async () => {
  const { finishRun } = await import('../src/lib/finish-gate.mjs');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ahk-finish-missing-report-'));
  const runId = 'missing-run-report-run';
  const finishPath = path.join(dir, '.harness', 'evidence', runId, 'finish-report.json');

  const verdict = finishRun({ cwd: dir, runId });

  assert.equal(verdict.verdict, 'INCOMPLETE');
  assert.equal(verdict.required[0].reason, 'missing-run-report');
  assert.equal(fs.existsSync(finishPath), true);
  const report = JSON.parse(fs.readFileSync(finishPath, 'utf8'));
  assert.equal(report.verdict, 'INCOMPLETE');
  assert.equal(report.required[0].reason, 'missing-run-report');
});

test('finish gate marks empty run reports incomplete', async () => {
  const { finishRun } = await import('../src/lib/finish-gate.mjs');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ahk-finish-empty-'));
  writeRunReport(dir, 'empty-run', []);

  const verdict = finishRun({ cwd: dir, runId: 'empty-run' });

  assert.equal(verdict.verdict, 'INCOMPLETE');
  assert.equal(verdict.required[0].reason, 'no-results');
});

test('finish CLI exits zero only for PASS verdict', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ahk-finish-cli-'));
  const bin = path.join(process.cwd(), 'bin', 'after-init.mjs');
  writeRunReport(dir, 'pass-run', [
    { id: 'C01', ok: true, required: true }
  ]);
  writeRunReport(dir, 'fail-run', [
    { id: 'C01', ok: false, required: true }
  ]);

  const pass = spawnSync(process.execPath, [bin, 'finish', '--run-id', 'pass-run'], {
    cwd: dir,
    encoding: 'utf8'
  });
  const fail = spawnSync(process.execPath, [bin, 'finish', '--run-id', 'fail-run'], {
    cwd: dir,
    encoding: 'utf8'
  });

  assert.equal(pass.status, 0);
  assert.match(pass.stdout, /Finish verdict: PASS/);
  assert.equal(fail.status, 1);
  assert.match(fail.stdout, /Finish verdict: FAIL/);
});

test('help presents lightweight workflow groups', () => {
  const bin = path.join(process.cwd(), 'bin', 'after-init.mjs');
  const result = spawnSync(process.execPath, [bin, 'help'], {
    cwd: process.cwd(),
    encoding: 'utf8'
  });

  assert.equal(result.status, 0);
  assert.match(result.stdout, /Core workflow/);
  assert.match(result.stdout, /after-init init\n/);
  assert.match(result.stdout, /Guardrails/);
  assert.match(result.stdout, /after-init doctor --security/);
  assert.match(result.stdout, /after-init doctor --guides/);
  assert.match(result.stdout, /Optional proof workflow/);
  assert.match(result.stdout, /after-init verify --criteria/);
});

test('removed doctor skills flag is rejected', () => {
  const bin = path.join(process.cwd(), 'bin', 'after-init.mjs');
  const result = spawnSync(process.execPath, [bin, 'doctor', '--skills'], {
    cwd: process.cwd(),
    encoding: 'utf8'
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Unknown flag: --skills/);
});

test('README leads with lightweight agent context and workflow guides', () => {
  const text = fs.readFileSync(path.join(process.cwd(), 'README.md'), 'utf8');

  assert.match(text, /prepares a repo for AI coding agents/i);
  assert.match(text, /AGENTS\.md[\s\S]*repo-local workflow guides/);
  assert.match(text, /Optional Proof Workflow/);
  assert.match(text, /Origin And References/);
  assert.match(text, /SWE-bench/);
  assert.match(text, /Vercel/);
  assert.match(text, /OpenAI Codex/);
});

test('syntax lint script checks every source module directly', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
  const script = pkg.scripts['lint:syntax'];

  assert.match(script, /node --check \.\/bin\/after-init\.mjs/);
  assert.match(script, /node --check \.\/src\/lib\/fs\.mjs/);
  assert.match(script, /node --check \.\/src\/lib\/hash\.mjs/);
  assert.match(script, /node --check \.\/src\/lib\/security-policy\.mjs/);
  assert.match(script, /node --check \.\/src\/lib\/security-audit\.mjs/);
  assert.match(script, /node --check \.\/src\/lib\/guide-audit\.mjs/);
  assert.match(script, /node --check \.\/src\/lib\/finish-gate\.mjs/);
});

test('package manifest is ready for npm distribution', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));

  assert.equal(pkg.name, 'after-init');
  assert.equal(pkg.bin['after-init'], 'bin/after-init.mjs');
  assert.equal(pkg.publishConfig.access, 'public');
  assert.match(pkg.scripts.prepublishOnly, /npm test/);
  assert.match(pkg.scripts.prepublishOnly, /npm run lint:syntax/);
  assert.equal(pkg.files.includes('bin/'), true);
  assert.equal(pkg.files.includes('src/'), true);
  assert.equal(pkg.files.includes('templates/'), true);
  assert.equal(pkg.files.includes('.agents/skills/'), true);
  assert.equal(pkg.files.some(item => item.startsWith('.harness')), false);
});

test('package-facing repository content uses after-init names', () => {
  const license = fs.readFileSync(path.join(process.cwd(), 'LICENSE'), 'utf8');
  const gemini = fs.readFileSync(path.join(process.cwd(), 'templates', 'GEMINI.template.md'), 'utf8');
  const cursor = fs.readFileSync(path.join(process.cwd(), 'templates', 'cursor-rule.template.mdc'), 'utf8');
  const evalScenarioFiles = fs.readdirSync(path.join(process.cwd(), 'evals', 'scenarios'))
    .filter(file => file.endsWith('.json'));

  assert.match(license, /after-init contributors/);
  assert.doesNotMatch(gemini, /docs\/SOT\.md/);
  assert.doesNotMatch(cursor, /docs\/SOT\.md/);

  for (const file of evalScenarioFiles) {
    const scenario = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'evals', 'scenarios', file), 'utf8'));
    assert.equal(scenario.recommended_modes.some(mode => mode.includes('skills')), false, file);
  }
});

test('sample criteria runs the standard syntax lint command', () => {
  const criteria = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'examples', 'criteria.sample.json'), 'utf8'));
  const syntaxCriterion = criteria.criteria.find(item => item.id === 'C02');

  assert.equal(syntaxCriterion.description, 'Run syntax lint');
  assert.equal(syntaxCriterion.command, 'npm run lint:syntax');
});

test('project naming avoids stale harness terms', () => {
  const staleTerms = [
    ['Agent', 'Harness'].join(' '),
    ['agent', 'harness', 'kit'].join('-'),
    `${['agent', 'harness'].join('-')}.mjs`,
    ['agent', 'harness'].join('-')
  ];
  const offenders = [];

  for (const file of listTextFiles(process.cwd())) {
    const text = fs.readFileSync(file, 'utf8');
    for (const term of staleTerms) {
      if (text.includes(term)) {
        offenders.push(`${path.relative(process.cwd(), file)} contains ${term}`);
      }
    }
  }

  assert.deepEqual(offenders, []);
});

test('AGENTS guidance routes common work to explicit workflow guides', () => {
  const requiredGuides = [
    'clarify',
    'specify',
    'design',
    'plan',
    'tdd',
    'implement',
    'verify',
    'review',
    'security-review',
    'retro',
    'docs-index',
    'eval'
  ];

  for (const rel of ['AGENTS.md', path.join('templates', 'AGENTS.template.md')]) {
    const text = fs.readFileSync(path.join(process.cwd(), rel), 'utf8');

    assert.match(text, /## Routing Policy/);
    assert.match(text, /When a task matches a workflow-guide trigger, invoke the corresponding guide explicitly/);
    assert.match(text, /For version-sensitive APIs, prefer the docs index in AGENTS\.md/);
    for (const guide of requiredGuides) {
      assert.match(text, new RegExp(`\`${guide}\``));
    }
  }
});

test('shared language document defines terms and role contracts', () => {
  const rel = path.join('docs', 'shared-language.md');
  const text = fs.readFileSync(path.join(process.cwd(), rel), 'utf8');
  const requiredTerms = [
    'criterion',
    'proof',
    'evidence',
    'artifact',
    'finish gate',
    'command policy',
    'role contract',
    'run state',
    'adapter',
    'pass',
    'fail',
    'incomplete',
    'pending',
    'missing',
    'stale',
    'warn'
  ];
  const requiredRoles = [
    'Implementer',
    'Verifier',
    'Reviewer',
    'Security Reviewer'
  ];
  const agents = fs.readFileSync(path.join(process.cwd(), 'AGENTS.md'), 'utf8');

  assert.match(text, /Authority:/);
  assert.match(text, /Synchronization:/);
  assert.match(text, /Subagents are optional execution/);
  for (const term of requiredTerms) {
    assert.match(text, new RegExp(`\\b${term}\\b`, 'i'));
  }
  for (const role of requiredRoles) {
    assert.match(text, new RegExp(`### ${role}`));
  }
  assert.match(agents, /shared-language\.md/);
});
