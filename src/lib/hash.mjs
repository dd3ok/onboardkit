import crypto from 'node:crypto';

export function sha256(text) {
  return crypto.createHash('sha256').update(text ?? '', 'utf8').digest('hex');
}

export function sha256Buffer(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

export function safeRunId(prefix = 'run') {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `${stamp}-${prefix}`.replace(/[^a-zA-Z0-9._-]/g, '-');
}
