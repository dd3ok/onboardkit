import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { buildDocsIndex, formatCompressedIndex } from '../src/lib/docs-indexer.mjs';
import { runDoctor } from '../src/lib/doctor.mjs';
import { runCriteriaFile } from '../src/lib/evidence.mjs';

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
  assert.equal(report.checks.some(c => c.name.startsWith('Skill metadata') && c.ok), true);
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
    '<!-- agent-onboard:docs-index:start -->',
    '[Project Docs Index]|root: ./docs',
    '<!-- agent-onboard:docs-index:end -->',
    ''
  ].join('\n'));
  fs.writeFileSync(path.join(dir, '.agents', 'skills', 'sample', 'SKILL.md'), [
    '---',
    'name: sample',
    'description: Sample skill for doctor validation.',
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

test('command evidence proof includes schema-required creation timestamp', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ahk-evidence-'));
  const criteriaFile = path.join(dir, 'criteria.json');
  fs.writeFileSync(criteriaFile, JSON.stringify({
    criteria: [
      {
        id: 'C01',
        description: 'No-op command',
        type: 'command',
        command: 'node -e "process.exit(0)"'
      }
    ]
  }));

  const report = runCriteriaFile({ cwd: dir, criteriaFile, runId: 'test-command-proof' });
  const proof = JSON.parse(fs.readFileSync(report.results[0].evidencePath, 'utf8'));

  assert.equal(typeof proof.created_at, 'string');
  assert.match(proof.created_at, /^\d{4}-\d{2}-\d{2}T/);
});

test('syntax lint script checks every source module directly', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
  const script = pkg.scripts['lint:syntax'];

  assert.match(script, /node --check \.\/src\/lib\/fs\.mjs/);
  assert.match(script, /node --check \.\/src\/lib\/hash\.mjs/);
});

test('sample criteria runs the standard syntax lint command', () => {
  const criteria = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'examples', 'criteria.sample.json'), 'utf8'));
  const syntaxCriterion = criteria.criteria.find(item => item.id === 'C02');

  assert.equal(syntaxCriterion.description, 'Run syntax lint');
  assert.equal(syntaxCriterion.command, 'npm run lint:syntax');
});

test('project naming is consistently Agent Onboard', () => {
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

test('AGENTS guidance routes common work to explicit skills', () => {
  const requiredSkills = [
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
    assert.match(text, /When a task matches a skill trigger, invoke the skill explicitly/);
    assert.match(text, /For version-sensitive APIs, prefer the docs index in AGENTS\.md/);
    for (const skill of requiredSkills) {
      assert.match(text, new RegExp(`\`${skill}\``));
    }
  }
});
