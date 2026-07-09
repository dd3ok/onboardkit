import crypto from 'node:crypto';

export function sha256(text) {
  return crypto.createHash('sha256').update(text ?? '', 'utf8').digest('hex');
}

export function sha256Buffer(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

export function stableJson(value) {
  if (Array.isArray(value)) {
    return `[${value.map(item => stableJson(item)).join(',')}]`;
  }
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

export function sha256Json(value) {
  return sha256(stableJson(value));
}

export function safeRunId(prefix = 'run') {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `${stamp}-${prefix}`.replace(/[^a-zA-Z0-9._-]/g, '-');
}
