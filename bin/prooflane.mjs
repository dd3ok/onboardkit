#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createProjectScaffold, createSpecArtifacts } from '../src/lib/specs.mjs';
import { writeDocsIndex } from '../src/lib/docs-indexer.mjs';
import { runCriteriaFile } from '../src/lib/evidence.mjs';
import { runDoctor, printDoctorReport } from '../src/lib/doctor.mjs';
import { runStaticEvalReport } from '../src/lib/eval-runner.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const toolRoot = path.resolve(__dirname, '..');
const cwd = process.cwd();
const args = process.argv.slice(2);
const command = args[0] || 'help';

function valueOf(flag, fallback = undefined) {
  const i = args.indexOf(flag);
  if (i === -1) return fallback;
  return args[i + 1] ?? fallback;
}

function has(flag) {
  return args.includes(flag);
}

function help() {
  console.log(`prooflane

Usage:
  prooflane help
  prooflane init [--target <dir>] [--force]
  prooflane doctor [--cwd <dir>]
  prooflane index-docs --source <dir> --name <name> [--inject] [--root-alias <path>]
  prooflane new --slug <slug> --title <title>
  prooflane verify --criteria <criteria.json> [--run-id <id>]
  prooflane eval
  prooflane status

Examples:
  prooflane init --target .
  prooflane index-docs --source docs --name local-docs --inject
  prooflane new --slug login-flow --title "Login flow"
  prooflane verify --criteria examples/criteria.sample.json
`);
}

try {
  if (command === 'help' || command === '--help' || command === '-h') {
    help();
  } else if (command === 'init') {
    const target = path.resolve(cwd, valueOf('--target', '.'));
    const result = createProjectScaffold({ target, toolRoot, force: has('--force') });
    console.log(`Initialized ${target}`);
    for (const item of result.created) console.log(`  created ${item}`);
    for (const item of result.skipped) console.log(`  skipped ${item}`);
  } else if (command === 'doctor') {
    const target = path.resolve(cwd, valueOf('--cwd', '.'));
    const report = runDoctor({ cwd: target });
    printDoctorReport(report);
    process.exitCode = report.ok ? 0 : 1;
  } else if (command === 'index-docs') {
    const source = valueOf('--source');
    const name = valueOf('--name', source ? path.basename(source) : 'docs');
    if (!source) throw new Error('Missing --source <dir>');
    const result = writeDocsIndex({
      cwd,
      source: path.resolve(cwd, source),
      name,
      inject: has('--inject'),
      rootAlias: valueOf('--root-alias', path.relative(cwd, path.resolve(cwd, source)) || '.')
    });
    console.log(`Wrote ${result.indexPath}`);
    if (result.injected) console.log(`Updated ${result.agentsPath}`);
  } else if (command === 'new') {
    const slug = valueOf('--slug');
    const title = valueOf('--title', slug);
    if (!slug) throw new Error('Missing --slug <slug>');
    const result = createSpecArtifacts({ cwd, toolRoot, slug, title, force: has('--force') });
    console.log(`Created spec workspace specs/${slug}`);
    for (const file of result.files) console.log(`  ${file}`);
  } else if (command === 'verify') {
    const criteria = valueOf('--criteria');
    if (!criteria) throw new Error('Missing --criteria <criteria.json>');
    const report = runCriteriaFile({ cwd, criteriaFile: path.resolve(cwd, criteria), runId: valueOf('--run-id') });
    console.log(`Evidence run: ${report.runId}`);
    for (const item of report.results) {
      const status = item.ok ? 'PASS' : (item.required ? 'FAIL' : 'WARN');
      console.log(`${status} ${item.id}: ${item.description}`);
      if (item.evidencePath) console.log(`  evidence: ${item.evidencePath}`);
    }
    process.exitCode = report.ok ? 0 : 1;
  } else if (command === 'eval') {
    const report = runStaticEvalReport({ cwd });
    console.log(`Static eval report: ${report.reportPath}`);
    for (const scenario of report.scenarios) {
      console.log(`- ${scenario.id}: ${scenario.title}`);
    }
  } else if (command === 'status') {
    console.log('CLI entrypoint: bin/prooflane.mjs');
    console.log('Library modules: src/lib/');
    console.log('Repo skills: .agents/skills/');
    console.log('Runtime evidence: .harness/evidence/<run-id>/');
  } else {
    throw new Error(`Unknown command: ${command}`);
  }
} catch (err) {
  console.error(`prooflane error: ${err.message}`);
  process.exitCode = 1;
}
