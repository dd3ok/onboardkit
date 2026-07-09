#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createProjectScaffold, createSpecArtifacts } from '../src/lib/specs.mjs';
import { writeDocsIndex } from '../src/lib/docs-indexer.mjs';
import { runCriteriaFile } from '../src/lib/evidence.mjs';
import { runDoctor, printDoctorReport } from '../src/lib/doctor.mjs';
import { runStaticEvalReport } from '../src/lib/eval-runner.mjs';
import { finishRun } from '../src/lib/finish-gate.mjs';
import { runSecurityAudit, printSecurityAuditReport } from '../src/lib/security-audit.mjs';
import { runGuideAudit, printGuideAuditReport } from '../src/lib/guide-audit.mjs';

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

function assertKnownFlags(allowed) {
  for (const arg of args.slice(1)) {
    if (arg.startsWith('--') && !allowed.includes(arg)) {
      throw new Error(`Unknown flag: ${arg}`);
    }
  }
}

function help() {
  console.log(`after-init

after-init keeps AGENTS.md, agent-facing docs, and repo-local workflow guides
lightweight after project setup.

Usage:
  after-init help
  after-init init [--target <dir>] [--force] [--host-shims]
  after-init doctor [--cwd <dir>] [--security] [--guides] [--governance]
  after-init index-docs --source <dir> --name <name> [--inject] [--root-alias <path>]
  after-init new --slug <slug> --title <title>
  after-init verify --criteria <criteria.json> [--run-id <id>]
  after-init finish --run-id <id>
  after-init eval
  after-init status

Core workflow:
  after-init init
  after-init doctor
  after-init index-docs --source docs --name local-docs --inject
  after-init new --slug login-flow --title "Login flow"

Guardrails:
  after-init doctor --security
  after-init doctor --guides
  after-init doctor --governance
  after-init init --host-shims

Optional proof workflow:
  after-init verify --criteria examples/criteria.sample.json
  after-init finish --run-id <id>
`);
}

function printFinishReport(report) {
  console.log(`Finish verdict: ${report.verdict}`);
  console.log(`Evidence run: ${report.runId}`);
  for (const item of report.required) {
    console.log(`${item.status.toUpperCase()} ${item.id}: ${item.reason}`);
    if (item.evidencePath) console.log(`  evidence: ${item.evidencePath}`);
  }
  for (const item of report.warnings) {
    console.log(`WARN ${item.id}: ${item.reason}`);
    if (item.evidencePath) console.log(`  evidence: ${item.evidencePath}`);
  }
}

try {
  if (command === 'help' || command === '--help' || command === '-h') {
    help();
  } else if (command === 'init') {
    assertKnownFlags(['--target', '--force', '--host-shims']);
    const target = path.resolve(cwd, valueOf('--target', '.'));
    const result = createProjectScaffold({ target, toolRoot, force: has('--force'), hostShims: has('--host-shims') });
    console.log(`Initialized ${target}`);
    for (const item of result.created) console.log(`  created ${item}`);
    for (const item of result.skipped) console.log(`  skipped ${item}`);
  } else if (command === 'doctor') {
    assertKnownFlags(['--cwd', '--security', '--guides', '--governance']);
    const target = path.resolve(cwd, valueOf('--cwd', '.'));
    const report = has('--security')
      ? runSecurityAudit({ cwd: target })
      : (has('--guides') ? runGuideAudit({ cwd: target }) : runDoctor({ cwd: target, governance: has('--governance') }));
    if (has('--security')) {
      printSecurityAuditReport(report);
    } else if (has('--guides')) {
      printGuideAuditReport(report);
    } else {
      printDoctorReport(report);
    }
    process.exitCode = report.ok ? 0 : 1;
  } else if (command === 'index-docs') {
    assertKnownFlags(['--source', '--name', '--inject', '--root-alias']);
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
    assertKnownFlags(['--slug', '--title', '--force']);
    const slug = valueOf('--slug');
    const title = valueOf('--title', slug);
    if (!slug) throw new Error('Missing --slug <slug>');
    const result = createSpecArtifacts({ cwd, toolRoot, slug, title, force: has('--force') });
    console.log(`Created spec workspace specs/${slug}`);
    for (const file of result.files) console.log(`  ${file}`);
  } else if (command === 'verify') {
    assertKnownFlags(['--criteria', '--run-id']);
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
  } else if (command === 'finish') {
    assertKnownFlags(['--run-id']);
    const runId = valueOf('--run-id');
    if (!runId) throw new Error('Missing --run-id <id>');
    const report = finishRun({ cwd, runId });
    printFinishReport(report);
    process.exitCode = report.ok ? 0 : 1;
  } else if (command === 'eval') {
    const report = runStaticEvalReport({ cwd });
    console.log(`Static eval report: ${report.reportPath}`);
    for (const scenario of report.scenarios) {
      console.log(`- ${scenario.id}: ${scenario.title}`);
    }
  } else if (command === 'status') {
    console.log('CLI entrypoint: bin/after-init.mjs');
    console.log('Library modules: src/lib/');
    console.log('Repo-local guides: .agents/skills/');
    console.log('Runtime evidence: .harness/evidence/<run-id>/');
  } else {
    throw new Error(`Unknown command: ${command}`);
  }
} catch (err) {
  console.error(`after-init error: ${err.message}`);
  process.exitCode = 1;
}
