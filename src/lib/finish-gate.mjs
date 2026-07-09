import fs from 'node:fs';
import path from 'node:path';
import { readJson, writeJson } from './fs.mjs';
import { sha256Buffer } from './hash.mjs';
import { assertSafePathSegment } from './security-policy.mjs';

function inside(child, parent) {
  const relative = path.relative(parent, child);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function validateArtifact({ cwd, proof }) {
  if (!proof.artifact_path || !proof.artifact_sha256) return null;
  if (typeof proof.artifact_path !== 'string' || !path.isAbsolute(proof.artifact_path)) {
    return 'artifact-path-outside-workspace';
  }
  const artifactPath = path.resolve(proof.artifact_path);
  if (!inside(artifactPath, cwd)) return 'artifact-path-outside-workspace';
  if (!fs.existsSync(artifactPath) || !fs.statSync(artifactPath).isFile()) return 'missing-artifact';
  const realCwd = fs.realpathSync.native(cwd);
  const realArtifact = fs.realpathSync.native(artifactPath);
  if (!inside(realArtifact, realCwd)) return 'artifact-path-outside-workspace';
  const currentHash = sha256Buffer(fs.readFileSync(artifactPath));
  if (currentHash !== proof.artifact_sha256) return 'artifact-hash-mismatch';
  return null;
}

function statusItem({ result, status, reason, evidencePath }) {
  return {
    id: result.id,
    description: result.description || result.id,
    required: result.required !== false,
    status,
    reason,
    evidencePath
  };
}

function readProof({ runRoot, runId, result }) {
  const evidencePath = result.evidencePath;
  if (!evidencePath) {
    return { status: 'incomplete', reason: 'missing-evidence-path', evidencePath: null, proof: null };
  }

  const resolved = path.resolve(evidencePath);
  if (!inside(resolved, runRoot)) {
    return { status: 'incomplete', reason: 'evidence-path-outside-run', evidencePath: resolved, proof: null };
  }

  if (!fs.existsSync(resolved)) {
    return { status: 'incomplete', reason: 'missing-proof', evidencePath: resolved, proof: null };
  }

  try {
    const proof = readJson(resolved);
    if (proof.run_id !== runId || proof.criterion_id !== result.id) {
      return { status: 'incomplete', reason: 'proof-mismatch', evidencePath: resolved, proof };
    }
    if (proof.type === 'command' && proof.log_path) {
      const logPath = path.resolve(proof.log_path);
      if (!inside(logPath, runRoot)) {
        return { status: 'incomplete', reason: 'log-path-outside-run', evidencePath: resolved, proof };
      }
      if (!fs.existsSync(logPath)) {
        return { status: 'incomplete', reason: 'missing-log', evidencePath: resolved, proof };
      }
    }
    return { status: 'read', reason: 'proof-read', evidencePath: resolved, proof };
  } catch {
    return { status: 'incomplete', reason: 'invalid-proof', evidencePath: resolved, proof: null };
  }
}

function classifyProof({ cwd, result, runId, runRoot }) {
  const read = readProof({ runRoot, runId, result });
  if (read.status === 'incomplete') {
    return statusItem({ result, status: 'incomplete', reason: read.reason, evidencePath: read.evidencePath });
  }

  const proof = read.proof;
  const artifactProblem = validateArtifact({ cwd, proof });
  if (artifactProblem) {
    return statusItem({ result, status: 'incomplete', reason: artifactProblem, evidencePath: read.evidencePath });
  }
  if (proof.fresh === false) {
    return statusItem({ result, status: 'incomplete', reason: 'stale-evidence', evidencePath: read.evidencePath });
  }
  if (typeof proof.status === 'string' && proof.status.includes('pending')) {
    return statusItem({ result, status: 'incomplete', reason: 'pending-evidence', evidencePath: read.evidencePath });
  }
  if (['missing-artifact', 'invalid-artifact-path', 'missing-artifact-path', 'unsupported', 'tool-unavailable'].includes(proof.status)) {
    return statusItem({ result, status: 'incomplete', reason: proof.status, evidencePath: read.evidencePath });
  }
  if (proof.policy_status === 'denied') {
    return statusItem({ result, status: 'fail', reason: 'policy-denied', evidencePath: read.evidencePath });
  }
  if (proof.policy_status === 'prompt-required') {
    return statusItem({ result, status: 'fail', reason: 'policy-prompt-required', evidencePath: read.evidencePath });
  }
  if (result.ok === true && proof.ok === true) {
    return statusItem({ result, status: 'pass', reason: 'fresh-pass', evidencePath: read.evidencePath });
  }
  if (result.ok === false || proof.ok === false) {
    return statusItem({ result, status: 'fail', reason: 'failed-evidence', evidencePath: read.evidencePath });
  }
  return statusItem({ result, status: 'incomplete', reason: 'unknown-proof-status', evidencePath: read.evidencePath });
}

function optionalWarning(item) {
  return {
    ...item,
    status: 'warn'
  };
}

export function finishRun({ cwd, runId }) {
  const safeId = assertSafePathSegment(runId, 'run id');
  const runRoot = path.join(cwd, '.harness', 'evidence', safeId);
  const reportPath = path.join(runRoot, 'run-report.json');
  const createdAt = new Date().toISOString();

  if (!fs.existsSync(reportPath)) {
    return {
      runId: safeId,
      verdict: 'INCOMPLETE',
      ok: false,
      createdAt,
      reportPath,
      evidenceRoot: runRoot,
      required: [
        {
          id: 'run-report',
          description: 'Run report',
          required: true,
          status: 'incomplete',
          reason: 'missing-run-report',
          evidencePath: reportPath
        }
      ],
      warnings: []
    };
  }

  const report = readJson(reportPath);
  const classified = (report.results || []).map(result => classifyProof({ cwd, result, runId: safeId, runRoot }));
  if (classified.length === 0) {
    const result = {
      runId: safeId,
      verdict: 'INCOMPLETE',
      ok: false,
      createdAt,
      reportPath,
      evidenceRoot: runRoot,
      required: [
        {
          id: 'run-report',
          description: 'Run report',
          required: true,
          status: 'incomplete',
          reason: 'no-results',
          evidencePath: reportPath
        }
      ],
      warnings: []
    };
    writeJson(path.join(runRoot, 'finish-report.json'), result);
    return result;
  }
  const required = classified.filter(item => item.required);
  const warnings = classified.filter(item => !item.required && item.status !== 'pass').map(optionalWarning);
  const hasFail = required.some(item => item.status === 'fail');
  const hasIncomplete = required.some(item => item.status === 'incomplete');
  const verdict = hasFail ? 'FAIL' : (hasIncomplete ? 'INCOMPLETE' : 'PASS');
  const result = {
    runId: safeId,
    verdict,
    ok: verdict === 'PASS',
    createdAt,
    reportPath,
    evidenceRoot: runRoot,
    required,
    warnings
  };
  writeJson(path.join(runRoot, 'finish-report.json'), result);
  return result;
}
