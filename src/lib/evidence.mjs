import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { ensureDir, readJson, writeJson, writeText } from './fs.mjs';
import { safeRunId, sha256 } from './hash.mjs';

function redact(text) {
  if (!text) return '';
  return text
    .replace(/(OPENAI_API_KEY=)[^\s]+/g, '$1[REDACTED]')
    .replace(/(API_KEY=)[^\s]+/g, '$1[REDACTED]')
    .replace(/(TOKEN=)[^\s]+/g, '$1[REDACTED]')
    .replace(/(SECRET=)[^\s]+/g, '$1[REDACTED]');
}

export function runCriteriaFile({ cwd, criteriaFile, runId = safeRunId('evidence') }) {
  const doc = readJson(criteriaFile);
  if (!Array.isArray(doc.criteria)) throw new Error('criteria file must contain { "criteria": [...] }');
  const runRoot = path.join(cwd, '.harness', 'evidence', runId);
  ensureDir(runRoot);
  const results = [];
  for (const criterion of doc.criteria) {
    const id = criterion.id || `criterion-${results.length + 1}`;
    const required = criterion.required !== false;
    const description = criterion.description || id;
    const itemDir = path.join(runRoot, id);
    ensureDir(itemDir);
    if (criterion.type && criterion.type !== 'command') {
      const proof = {
        run_id: runId,
        criterion_id: id,
        type: criterion.type,
        description,
        required,
        status: 'pending-manual-evidence',
        created_at: new Date().toISOString(),
        note: 'This CLI currently executes command criteria. Non-command criteria require manual or future adapter evidence.'
      };
      const evidencePath = path.join(itemDir, 'proof.json');
      writeJson(evidencePath, proof);
      results.push({ id, description, required, ok: !required, evidencePath });
      continue;
    }
    if (!criterion.command) throw new Error(`criterion ${id} is missing command`);
    const startedAt = new Date().toISOString();
    const proc = spawnSync(criterion.command, {
      cwd,
      shell: true,
      encoding: 'utf8',
      maxBuffer: 20 * 1024 * 1024
    });
    const finishedAt = new Date().toISOString();
    const stdout = redact(proc.stdout || '');
    const stderr = redact(proc.stderr || '');
    const log = [
      `$ ${criterion.command}`,
      '',
      '## stdout',
      stdout,
      '',
      '## stderr',
      stderr
    ].join('\n');
    const logPath = path.join(itemDir, 'commands.log');
    writeText(logPath, log);
    const proof = {
      run_id: runId,
      criterion_id: id,
      type: 'command',
      description,
      command: criterion.command,
      cwd,
      required,
      created_at: finishedAt,
      started_at: startedAt,
      finished_at: finishedAt,
      exit_code: proc.status,
      signal: proc.signal,
      stdout_sha256: sha256(stdout),
      stderr_sha256: sha256(stderr),
      log_path: logPath,
      fresh: true,
      ok: proc.status === 0
    };
    const evidencePath = path.join(itemDir, 'proof.json');
    writeJson(evidencePath, proof);
    results.push({ id, description, required, ok: proof.ok, evidencePath, exitCode: proc.status });
  }
  const report = {
    runId,
    ok: results.every(r => r.ok || !r.required),
    createdAt: new Date().toISOString(),
    criteriaFile,
    results
  };
  writeJson(path.join(runRoot, 'run-report.json'), report);
  return report;
}
