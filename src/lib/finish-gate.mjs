import fs from 'node:fs';
import path from 'node:path';
import { readJson, writeJson } from './fs.mjs';
import { sha256Buffer, sha256Json } from './hash.mjs';
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

function criteriaIssue({ id, description, reason, evidencePath }) {
  return statusItem({
    result: { id, description, required: true },
    status: 'incomplete',
    reason,
    evidencePath
  });
}

function readCurrentCriteria({ cwd, report }) {
  const issues = [];
  const byId = new Map();
  const criteriaFile = report.criteriaFile;

  if (!criteriaFile) {
    issues.push(criteriaIssue({
      id: 'criteria-file',
      description: 'Criteria file',
      reason: 'missing-criteria-file-reference',
      evidencePath: null
    }));
    return { issues, byId };
  }

  const resolved = path.resolve(criteriaFile);
  if (!inside(resolved, cwd)) {
    issues.push(criteriaIssue({
      id: 'criteria-file',
      description: 'Criteria file',
      reason: 'criteria-file-outside-workspace',
      evidencePath: resolved
    }));
    return { issues, byId };
  }

  if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) {
    issues.push(criteriaIssue({
      id: 'criteria-file',
      description: 'Criteria file',
      reason: 'missing-current-criteria-file',
      evidencePath: resolved
    }));
    return { issues, byId };
  }

  const buffer = fs.readFileSync(resolved);
  const currentHash = sha256Buffer(buffer);
  if (!report.criteriaFileHash) {
    issues.push(criteriaIssue({
      id: 'criteria-file',
      description: 'Criteria file',
      reason: 'missing-criteria-file-hash',
      evidencePath: resolved
    }));
  } else if (currentHash !== report.criteriaFileHash) {
    issues.push(criteriaIssue({
      id: 'criteria-file',
      description: 'Criteria file',
      reason: 'criteria-file-hash-mismatch',
      evidencePath: resolved
    }));
  }

  let doc;
  try {
    doc = JSON.parse(buffer.toString('utf8'));
  } catch {
    issues.push(criteriaIssue({
      id: 'criteria-file',
      description: 'Criteria file',
      reason: 'invalid-current-criteria-file',
      evidencePath: resolved
    }));
    return { issues, byId };
  }

  if (!Array.isArray(doc.criteria)) {
    issues.push(criteriaIssue({
      id: 'criteria-file',
      description: 'Criteria file',
      reason: 'invalid-current-criteria-shape',
      evidencePath: resolved
    }));
    return { issues, byId };
  }

  const reportedIds = new Set((report.results || []).map(result => result.id));
  for (const [index, criterion] of doc.criteria.entries()) {
    const id = criterion.id || `criterion-${index + 1}`;
    if (typeof id !== 'string' || !/^[a-zA-Z0-9._-]+$/.test(id)) {
      issues.push(criteriaIssue({
        id: `criterion-${index + 1}`,
        description: 'Current criterion',
        reason: 'invalid-current-criterion-id',
        evidencePath: resolved
      }));
      continue;
    }
    const entry = {
      id,
      description: criterion.description || id,
      required: criterion.required !== false,
      hash: sha256Json(criterion)
    };
    byId.set(id, entry);
    if (entry.required && !reportedIds.has(id)) {
      issues.push(criteriaIssue({
        id,
        description: entry.description,
        reason: 'missing-result-for-current-criterion',
        evidencePath: resolved
      }));
    }
  }

  return { issues, byId };
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

function classifyProof({ cwd, result, runId, runRoot, criteriaState }) {
  const read = readProof({ runRoot, runId, result });
  if (read.status === 'incomplete') {
    return statusItem({ result, status: 'incomplete', reason: read.reason, evidencePath: read.evidencePath });
  }

  const proof = read.proof;
  const currentCriterion = criteriaState.byId.get(result.id);
  if (!currentCriterion) {
    return statusItem({ result, status: 'incomplete', reason: 'criterion-missing-from-current-criteria', evidencePath: read.evidencePath });
  }
  if (!result.criterionHash || !proof.criterion_hash) {
    return statusItem({ result, status: 'incomplete', reason: 'missing-criterion-hash', evidencePath: read.evidencePath });
  }
  if (result.criterionHash !== currentCriterion.hash || proof.criterion_hash !== currentCriterion.hash) {
    return statusItem({ result, status: 'incomplete', reason: 'criterion-hash-mismatch', evidencePath: read.evidencePath });
  }
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
          reason: 'missing-run-report',
          evidencePath: reportPath
        }
      ],
      warnings: []
    };
    writeJson(path.join(runRoot, 'finish-report.json'), result);
    return result;
  }

  const report = readJson(reportPath);
  const criteriaState = readCurrentCriteria({ cwd, report });
  const classified = [
    ...criteriaState.issues,
    ...(report.results || []).map(result => classifyProof({ cwd, result, runId: safeId, runRoot, criteriaState }))
  ];
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
