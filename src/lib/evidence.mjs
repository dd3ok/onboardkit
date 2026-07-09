import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { ensureDir, readJson, writeJson, writeText } from './fs.mjs';
import { safeRunId, sha256, sha256Buffer } from './hash.mjs';
import {
  assertSafePathSegment,
  commandExecutionLimits,
  evaluateCommandPolicy,
  loadSecurityPolicy
} from './security-policy.mjs';

function redact(text) {
  if (!text) return '';
  return text
    .replace(/(OPENAI_API_KEY=)[^\s]+/g, '$1[REDACTED]')
    .replace(/(API_KEY=)[^\s]+/g, '$1[REDACTED]')
    .replace(/(TOKEN=)[^\s]+/g, '$1[REDACTED]')
    .replace(/(SECRET=)[^\s]+/g, '$1[REDACTED]');
}

function isInside(child, parent) {
  const relative = path.relative(parent, child);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function resolveArtifactPath(cwd, candidate) {
  if (typeof candidate !== 'string' || candidate.trim() === '') {
    return { ok: false, status: 'missing-artifact-path', artifactPath: null, relativePath: null };
  }
  const normalized = candidate.replace(/\\/g, '/').trim();
  if (
    path.isAbsolute(candidate) ||
    path.isAbsolute(normalized) ||
    /^[A-Za-z]:/.test(normalized) ||
    normalized.startsWith('//') ||
    normalized.startsWith('../') ||
    normalized.includes('/../') ||
    normalized === '..'
  ) {
    return { ok: false, status: 'invalid-artifact-path', artifactPath: null, relativePath: normalized };
  }
  const resolved = path.resolve(cwd, normalized);
  if (!isInside(resolved, cwd)) {
    return { ok: false, status: 'invalid-artifact-path', artifactPath: null, relativePath: normalized };
  }
  return { ok: true, status: 'artifact-path-ok', artifactPath: resolved, relativePath: normalized };
}

function realPathInsideWorkspace(cwd, artifactPath) {
  const realCwd = fs.realpathSync.native(cwd);
  const realArtifact = fs.realpathSync.native(artifactPath);
  return isInside(realArtifact, realCwd);
}

function writeNonCommandProof({ cwd, runId, criterion, id, required, description, itemDir }) {
  const createdAt = new Date().toISOString();
  const artifact = resolveArtifactPath(cwd, criterion.path);
  const base = {
    run_id: runId,
    criterion_id: id,
    type: criterion.type,
    description,
    required,
    created_at: createdAt,
    observed_at: createdAt,
    artifact_relative_path: artifact.relativePath,
    artifact_path: artifact.artifactPath,
    fresh: true
  };
  const evidencePath = path.join(itemDir, 'proof.json');

  if (!artifact.ok) {
    const proof = {
      ...base,
      status: artifact.status,
      ok: false,
      note: 'Artifact-backed evidence requires a project-relative path inside the workspace.'
    };
    writeJson(evidencePath, proof);
    return { proof, evidencePath };
  }

  if (!fs.existsSync(artifact.artifactPath) || !fs.statSync(artifact.artifactPath).isFile()) {
    const proof = {
      ...base,
      status: 'missing-artifact',
      ok: false,
      note: 'Referenced evidence artifact does not exist as a file.'
    };
    writeJson(evidencePath, proof);
    return { proof, evidencePath };
  }

  if (!realPathInsideWorkspace(cwd, artifact.artifactPath)) {
    const proof = {
      ...base,
      status: 'invalid-artifact-path',
      ok: false,
      note: 'Referenced evidence artifact resolves outside the workspace.'
    };
    writeJson(evidencePath, proof);
    return { proof, evidencePath };
  }

  const stat = fs.statSync(artifact.artifactPath);
  const buffer = fs.readFileSync(artifact.artifactPath);
  const proof = {
    ...base,
    status: 'artifact-present',
    ok: true,
    artifact_kind: criterion.type,
    artifact_size_bytes: stat.size,
    artifact_mtime: stat.mtime.toISOString(),
    artifact_sha256: sha256Buffer(buffer)
  };
  writeJson(evidencePath, proof);
  return { proof, evidencePath };
}

export function runCriteriaFile({ cwd, criteriaFile, runId = safeRunId('evidence') }) {
  const doc = readJson(criteriaFile);
  if (!Array.isArray(doc.criteria)) throw new Error('criteria file must contain { "criteria": [...] }');
  const safeId = assertSafePathSegment(runId, 'run id');
  const securityPolicy = loadSecurityPolicy({ cwd });
  const runRoot = path.join(cwd, '.harness', 'evidence', safeId);
  ensureDir(runRoot);
  const results = [];
  for (const criterion of doc.criteria) {
    const id = assertSafePathSegment(criterion.id || `criterion-${results.length + 1}`, 'criterion id');
    const required = criterion.required !== false;
    const description = criterion.description || id;
    const itemDir = path.join(runRoot, id);
    ensureDir(itemDir);
    if (criterion.type && criterion.type !== 'command') {
      const { proof, evidencePath } = writeNonCommandProof({ cwd, runId: safeId, criterion, id, required, description, itemDir });
      results.push({ id, description, required, ok: proof.ok, evidencePath });
      continue;
    }
    if (!criterion.command) throw new Error(`criterion ${id} is missing command`);
    const policyDecision = evaluateCommandPolicy({ command: criterion.command, criterion, policy: securityPolicy });
    const limits = commandExecutionLimits({ policy: securityPolicy, criterion });
    const redactedCommand = redact(criterion.command);
    const redactedNormalizedCommand = redact(policyDecision.normalized_command);
    if (policyDecision.status !== 'allowed') {
      const createdAt = new Date().toISOString();
      const log = [
        `$ ${redactedNormalizedCommand}`,
        '',
        'Command was not executed.',
        `Policy status: ${policyDecision.status}`,
        `Policy rule: ${policyDecision.rule}`,
        `Reason: ${policyDecision.reason}`
      ].join('\n');
      const logPath = path.join(itemDir, 'commands.log');
      writeText(logPath, log);
      const proof = {
        run_id: safeId,
        criterion_id: id,
        type: 'command',
        description,
        command: redactedCommand,
        normalized_command: redactedNormalizedCommand,
        cwd,
        required,
        created_at: createdAt,
        started_at: null,
        finished_at: createdAt,
        exit_code: null,
        signal: null,
        stdout_sha256: sha256(''),
        stderr_sha256: sha256(''),
        log_path: logPath,
        fresh: true,
        ok: false,
        policy_status: policyDecision.status,
        policy_rule: policyDecision.rule,
        policy_reason: policyDecision.reason,
        policy_source: securityPolicy.source,
        policy_approval: criterion.policy_approval === true,
        policy_approval_reason: criterion.policy_approval_reason || null,
        timeout_ms: limits.timeoutMs,
        max_output_bytes: limits.maxOutputBytes,
        timed_out: false,
        output_limited: false
      };
      const evidencePath = path.join(itemDir, 'proof.json');
      writeJson(evidencePath, proof);
      results.push({ id, description, required, ok: false, evidencePath, exitCode: null });
      continue;
    }
    const startedAt = new Date().toISOString();
    const proc = spawnSync(policyDecision.normalized_command, {
      cwd,
      shell: true,
      encoding: 'utf8',
      timeout: limits.timeoutMs,
      maxBuffer: limits.maxOutputBytes
    });
    const finishedAt = new Date().toISOString();
    const stdout = redact(proc.stdout || '');
    const stderr = redact(proc.stderr || '');
    const timedOut = proc.error?.code === 'ETIMEDOUT';
    const outputLimited = proc.error?.code === 'ENOBUFS';
    const log = [
      `$ ${redactedNormalizedCommand}`,
      '',
      '## stdout',
      stdout,
      '',
      '## stderr',
      stderr,
      '',
      '## execution',
      proc.error ? `error: ${proc.error.code || proc.error.message}` : 'error: none'
    ].join('\n');
    const logPath = path.join(itemDir, 'commands.log');
    writeText(logPath, log);
    const proof = {
      run_id: safeId,
      criterion_id: id,
      type: 'command',
      description,
      command: redactedCommand,
      normalized_command: redactedNormalizedCommand,
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
      ok: proc.status === 0 && !timedOut && !outputLimited,
      policy_status: policyDecision.status,
      policy_rule: policyDecision.rule,
      policy_reason: policyDecision.reason,
      policy_source: securityPolicy.source,
      policy_approval: criterion.policy_approval === true,
      policy_approval_reason: criterion.policy_approval_reason || null,
      timeout_ms: limits.timeoutMs,
      max_output_bytes: limits.maxOutputBytes,
      timed_out: timedOut,
      output_limited: outputLimited,
      error_code: proc.error?.code || null
    };
    const evidencePath = path.join(itemDir, 'proof.json');
    writeJson(evidencePath, proof);
    results.push({ id, description, required, ok: proof.ok, evidencePath, exitCode: proc.status });
  }
  const report = {
    runId: safeId,
    ok: results.every(r => r.ok || !r.required),
    createdAt: new Date().toISOString(),
    criteriaFile,
    results
  };
  writeJson(path.join(runRoot, 'run-report.json'), report);
  return report;
}
