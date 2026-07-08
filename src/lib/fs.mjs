import fs from 'node:fs';
import path from 'node:path';

export function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

export function writeText(file, content, { force = true } = {}) {
  ensureDir(path.dirname(file));
  if (!force && fs.existsSync(file)) return false;
  fs.writeFileSync(file, content, 'utf8');
  return true;
}

export function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export function writeJson(file, value) {
  writeText(file, `${JSON.stringify(value, null, 2)}\n`);
}

export function copyDir(src, dest, { force = false } = {}) {
  ensureDir(dest);
  const created = [];
  const skipped = [];
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      const nested = copyDir(s, d, { force });
      created.push(...nested.created);
      skipped.push(...nested.skipped);
    } else {
      if (fs.existsSync(d) && !force) {
        skipped.push(d);
      } else {
        ensureDir(path.dirname(d));
        fs.copyFileSync(s, d);
        created.push(d);
      }
    }
  }
  return { created, skipped };
}

export function listFilesRecursive(root, predicate = () => true) {
  const out = [];
  if (!fs.existsSync(root)) return out;
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const p = path.join(root, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git') continue;
      out.push(...listFilesRecursive(p, predicate));
    } else if (predicate(p)) {
      out.push(p);
    }
  }
  return out;
}

export function relativePosix(from, to) {
  return path.relative(from, to).split(path.sep).join('/');
}
