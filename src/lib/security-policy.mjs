import fs from 'node:fs';
import path from 'node:path';
import { readJson } from './fs.mjs';

const DEFAULT_TIMEOUT_MS = 120000;
const DEFAULT_MAX_OUTPUT_BYTES = 1024 * 1024;

const DEFAULT_POLICY = {
  version: 1,
  source: 'default',
  unknown: 'deny',
  timeout_ms: DEFAULT_TIMEOUT_MS,
  max_output_bytes: DEFAULT_MAX_OUTPUT_BYTES,
  allow: [
    'npm test',
    'npm run lint:syntax',
    'node --test',
    'node --version',
    'node ./bin/agent-onboard.mjs doctor',
    'node ./bin/agent-onboard.mjs eval',
    'node ./bin/agent-onboard.mjs verify --criteria examples/criteria.sample.json'
  ],
  deny: [
    { id: 'shell-metacharacter', regex: '(?:&&|\\|\\||[;&|<>`]|\\$\\()', reason: 'Shell metacharacters, command chaining, pipes, and redirects are not allowed in v0 command criteria.' },
    { id: 'git-reset-hard', contains: 'git reset --hard', reason: 'Hard resets can discard local work.' },
    { id: 'git-clean', contains: 'git clean', reason: 'Git clean can delete untracked files.' },
    { id: 'recursive-remove', regex: '\\b(rm\\s+-rf|Remove-Item\\b.*\\b-Recurse\\b|rmdir\\b.*\\b/s\\b|del\\b.*\\b/s\\b)', reason: 'Recursive deletion is denied by default.' },
    { id: 'format-shutdown', regex: '\\b(format|shutdown)\\b', reason: 'Host-level destructive commands are denied by default.' },
    { id: 'database-drop', regex: '\\bdrop\\s+database\\b', reason: 'Database deletion is denied by default.' }
  ],
  prompt: [
    { id: 'npm-publish', contains: 'npm publish', reason: 'Publishing packages requires explicit approval.' },
    { id: 'git-push', contains: 'git push', reason: 'Pushing repository state requires explicit approval.' },
    { id: 'gh-release', contains: 'gh release', reason: 'Creating releases requires explicit approval.' },
    { id: 'gh-pr-merge', contains: 'gh pr merge', reason: 'Merging pull requests requires explicit approval.' },
    { id: 'network-fetch', regex: '\\b(curl|wget)\\b', reason: 'Network fetch commands require explicit approval.' },
    { id: 'infra-tool', regex: '\\b(terraform|kubectl)\\b', reason: 'Infrastructure commands require explicit approval.' },
    { id: 'remote-shell', regex: '\\b(ssh|scp)\\b', reason: 'Remote shell and copy commands require explicit approval.' }
  ]
};

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function positiveInt(value, fallback) {
  return Number.isInteger(value) && value > 0 ? value : fallback;
}

export function normalizeCommand(command) {
  if (typeof command !== 'string') return '';
  return command.replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim();
}

export function assertSafePathSegment(value, label) {
  if (typeof value !== 'string' || !/^[a-zA-Z0-9._-]+$/.test(value)) {
    throw new Error(`${label} must contain only letters, numbers, ".", "_", or "-"`);
  }
  return value;
}

export function loadSecurityPolicy({ cwd, policyFile } = {}) {
  const resolvedPolicyFile = policyFile || path.join(cwd, '.harness', 'security-policy.json');
  const local = fs.existsSync(resolvedPolicyFile) ? readJson(resolvedPolicyFile) : {};
  return {
    version: 1,
    source: fs.existsSync(resolvedPolicyFile) ? resolvedPolicyFile : 'default',
    unknown: local.unknown === 'allow' ? 'allow' : 'deny',
    timeout_ms: positiveInt(local.timeout_ms, DEFAULT_POLICY.timeout_ms),
    max_output_bytes: positiveInt(local.max_output_bytes, DEFAULT_POLICY.max_output_bytes),
    allow: [
      ...DEFAULT_POLICY.allow,
      ...toArray(local.allow)
    ].map(normalizeCommand).filter(Boolean),
    deny: [
      ...DEFAULT_POLICY.deny,
      ...toArray(local.deny)
    ],
    prompt: [
      ...DEFAULT_POLICY.prompt,
      ...toArray(local.prompt)
    ]
  };
}

function ruleId(prefix, rule, fallback) {
  return `${prefix}:${rule?.id || fallback}`;
}

function matchesRule(command, rule) {
  if (typeof rule === 'string') {
    return command.toLowerCase().includes(normalizeCommand(rule).toLowerCase());
  }
  if (!rule || typeof rule !== 'object') return false;
  if (rule.exact && normalizeCommand(rule.exact) === command) return true;
  if (rule.contains && command.toLowerCase().includes(normalizeCommand(rule.contains).toLowerCase())) return true;
  if (rule.regex) {
    const flags = typeof rule.flags === 'string' ? rule.flags : 'i';
    return new RegExp(rule.regex, flags).test(command);
  }
  return false;
}

function decision({ status, command, rule, reason }) {
  return {
    status,
    normalized_command: command,
    rule,
    reason
  };
}

export function evaluateCommandPolicy({ command, criterion = {}, policy }) {
  const normalizedCommand = normalizeCommand(command);
  if (!normalizedCommand) {
    return decision({
      status: 'denied',
      command: normalizedCommand,
      rule: 'deny:empty-command',
      reason: 'Command is empty after normalization.'
    });
  }

  const denyRule = policy.deny.find(rule => matchesRule(normalizedCommand, rule));
  if (denyRule) {
    return decision({
      status: 'denied',
      command: normalizedCommand,
      rule: ruleId('deny', denyRule, 'matched'),
      reason: denyRule.reason || 'Command matched a deny rule.'
    });
  }

  const promptRule = policy.prompt.find(rule => matchesRule(normalizedCommand, rule));
  if (promptRule && criterion.policy_approval !== true) {
    return decision({
      status: 'prompt-required',
      command: normalizedCommand,
      rule: ruleId('prompt', promptRule, 'matched'),
      reason: promptRule.reason || 'Command requires explicit approval.'
    });
  }
  if (promptRule) {
    return decision({
      status: 'allowed',
      command: normalizedCommand,
      rule: ruleId('prompt-approved', promptRule, 'matched'),
      reason: 'Command matched a prompt rule and carries explicit policy approval.'
    });
  }

  if (policy.allow.includes(normalizedCommand)) {
    return decision({
      status: 'allowed',
      command: normalizedCommand,
      rule: 'allow:exact',
      reason: 'Command matched an exact allow rule.'
    });
  }

  if (policy.unknown === 'allow') {
    return decision({
      status: 'allowed',
      command: normalizedCommand,
      rule: 'allow:unknown',
      reason: 'Policy allows unknown commands after deny and prompt checks.'
    });
  }

  return decision({
    status: 'denied',
    command: normalizedCommand,
    rule: 'deny:unknown-command',
    reason: 'Command did not match an exact allow rule.'
  });
}

export function commandExecutionLimits({ policy, criterion = {} }) {
  return {
    timeoutMs: positiveInt(criterion.timeout_ms, policy.timeout_ms),
    maxOutputBytes: positiveInt(criterion.max_output_bytes, policy.max_output_bytes)
  };
}
