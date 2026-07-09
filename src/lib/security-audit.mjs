import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadSecurityPolicy } from './security-policy.mjs';

function readTextIfExists(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
}

function hasAll(text, needles) {
  return needles.every(needle => text.includes(needle));
}

function finding({ id, title, status, severity = 'medium', detail, file = null }) {
  return { id, title, status, severity, detail, file };
}

function agentsSecurityRules({ cwd }) {
  const file = path.join(cwd, 'AGENTS.md');
  const text = readTextIfExists(file);
  const required = [
    'danger-full-access',
    'network access off by default',
    'Do not print or persist secrets'
  ];
  const ok = hasAll(text, required);
  return finding({
    id: 'AOS-SEC-001',
    title: 'AGENTS.md security guardrails',
    status: ok ? 'pass' : 'fail',
    severity: 'high',
    detail: ok
      ? 'AGENTS.md includes sandbox, network, and secret-persistence guardrails.'
      : 'AGENTS.md must include default sandbox, network-off, and evidence secret-persistence guardrails.',
    file
  });
}

function codexExampleConfig({ cwd }) {
  const file = path.join(cwd, '.codex', 'config.example.toml');
  if (!fs.existsSync(file)) {
    return finding({
      id: 'AOS-SEC-002',
      title: 'Safe Codex config example',
      status: 'warn',
      severity: 'low',
      detail: 'No .codex/config.example.toml found; downstream repos should provide a safe example rather than active config.',
      file
    });
  }

  const text = readTextIfExists(file);
  const safe = hasAll(text, [
    'approval_policy = "on-request"',
    'sandbox_mode = "workspace-write"',
    'network_access = false'
  ]);
  const unsafe = /danger-full-access|approval_policy\s*=\s*"never"|network_access\s*=\s*true/.test(text);
  return finding({
    id: 'AOS-SEC-002',
    title: 'Safe Codex config example',
    status: safe && !unsafe ? 'pass' : 'fail',
    severity: 'medium',
    detail: safe && !unsafe
      ? 'The example config uses workspace-write sandboxing, on-request approvals, and network off.'
      : 'The example config should use workspace-write sandboxing, on-request approvals, and network_access = false.',
    file
  });
}

function activeCodexConfig({ cwd }) {
  const file = path.join(cwd, '.codex', 'config.toml');
  if (!fs.existsSync(file)) {
    return finding({
      id: 'AOS-SEC-003',
      title: 'No unsafe active Codex config',
      status: 'pass',
      severity: 'high',
      detail: 'No active project .codex/config.toml is present.',
      file
    });
  }

  const text = readTextIfExists(file);
  const unsafe = [];
  if (/sandbox_mode\s*=\s*"danger-full-access"/.test(text)) unsafe.push('danger-full-access');
  if (/approval_policy\s*=\s*"never"/.test(text)) unsafe.push('approval_policy = "never"');
  if (/network_access\s*=\s*true/.test(text)) unsafe.push('network_access = true');
  return finding({
    id: 'AOS-SEC-003',
    title: 'No unsafe active Codex config',
    status: unsafe.length === 0 ? 'pass' : 'fail',
    severity: 'high',
    detail: unsafe.length === 0
      ? 'Active project Codex config does not force unsafe sandbox, approval, or network settings.'
      : `Active project Codex config contains unsafe settings: ${unsafe.join(', ')}.`,
    file
  });
}

function runtimeOutputIgnores({ cwd }) {
  const file = path.join(cwd, '.gitignore');
  const text = readTextIfExists(file);
  const required = [
    '.harness/evidence/*',
    '.harness/reports/*',
    '.harness/docs-index/*',
    '.harness/tmp/',
    '*.log'
  ];
  const missing = required.filter(pattern => !text.includes(pattern));
  return finding({
    id: 'AOS-SEC-004',
    title: 'Runtime outputs ignored by git',
    status: missing.length === 0 ? 'pass' : 'fail',
    severity: 'medium',
    detail: missing.length === 0
      ? 'Runtime evidence, reports, docs indexes, tmp files, and logs are ignored.'
      : `Runtime-output ignore patterns are missing: ${missing.join(', ')}.`,
    file
  });
}

function commandPolicyDefaults({ cwd }) {
  try {
    const policy = loadSecurityPolicy({ cwd });
    const ok = policy.unknown === 'deny' &&
      policy.allow.includes('npm test') &&
      policy.deny.length > 0 &&
      policy.prompt.length > 0;
    return finding({
      id: 'AOS-SEC-005',
      title: 'Command policy fail-closed defaults',
      status: ok ? 'pass' : 'fail',
      severity: 'high',
      detail: ok
        ? 'Command policy defaults deny unknown commands and include allow, deny, and prompt rules.'
        : 'Command policy should deny unknown commands and include allow, deny, and prompt rules.',
      file: policy.source === 'default' ? null : policy.source
    });
  } catch (err) {
    return finding({
      id: 'AOS-SEC-005',
      title: 'Command policy fail-closed defaults',
      status: 'fail',
      severity: 'high',
      detail: `Command policy could not be loaded: ${err.message}`,
      file: path.join(cwd, '.harness', 'security-policy.json')
    });
  }
}

function evidenceRedaction() {
  const evidenceFile = fileURLToPath(new URL('./evidence.mjs', import.meta.url));
  const text = readTextIfExists(evidenceFile);
  const required = [
    'OPENAI_API_KEY',
    'API_KEY',
    'TOKEN',
    'SECRET'
  ];
  const ok = hasAll(text, required);
  return finding({
    id: 'AOS-SEC-006',
    title: 'Evidence secret redaction patterns',
    status: ok ? 'pass' : 'fail',
    severity: 'high',
    detail: ok
      ? 'Evidence logging redacts common secret-like environment variable patterns.'
      : 'Evidence logging must redact common secret-like environment variable patterns.',
    file: evidenceFile
  });
}

export function runSecurityAudit({ cwd }) {
  const findings = [
    agentsSecurityRules({ cwd }),
    codexExampleConfig({ cwd }),
    activeCodexConfig({ cwd }),
    runtimeOutputIgnores({ cwd }),
    commandPolicyDefaults({ cwd }),
    evidenceRedaction()
  ];
  return {
    ok: findings.every(item => item.status !== 'fail'),
    createdAt: new Date().toISOString(),
    findings
  };
}

export function printSecurityAuditReport(report) {
  for (const item of report.findings) {
    console.log(`${item.status.toUpperCase()} ${item.id} ${item.title} - ${item.detail}`);
    if (item.file) console.log(`  file: ${item.file}`);
  }
}
