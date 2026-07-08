import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { buildDocsIndex, formatCompressedIndex } from '../src/lib/docs-indexer.mjs';
import { runDoctor } from '../src/lib/doctor.mjs';
import { runCriteriaFile } from '../src/lib/evidence.mjs';

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
