import fs from 'node:fs';
import path from 'node:path';
import { ensureDir, listFilesRecursive, relativePosix, writeText } from './fs.mjs';

const DOC_EXTENSIONS = new Set(['.md', '.mdx', '.txt', '.rst', '.adoc']);
const START = '<!-- prooflane:docs-index:start -->';
const END = '<!-- prooflane:docs-index:end -->';

export function buildDocsIndex({ source, name, rootAlias }) {
  if (!fs.existsSync(source)) throw new Error(`Docs source does not exist: ${source}`);
  const files = listFilesRecursive(source, p => DOC_EXTENSIONS.has(path.extname(p).toLowerCase()));
  const dirs = new Map();
  for (const file of files) {
    const rel = relativePosix(source, file);
    const dir = path.posix.dirname(rel) === '.' ? '.' : path.posix.dirname(rel);
    if (!dirs.has(dir)) dirs.set(dir, []);
    dirs.get(dir).push(path.posix.basename(rel));
  }
  const entries = [...dirs.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([dir, names]) => ({
    dir,
    files: names.sort((a, b) => a.localeCompare(b))
  }));
  return { name, rootAlias, source, entries, fileCount: files.length };
}

export function formatCompressedIndex(index) {
  const lines = [];
  lines.push(`[${index.name} Docs Index]|root: ${index.rootAlias}`);
  lines.push('|IMPORTANT: Prefer retrieval-led reasoning over pretraining-led reasoning. Read relevant local docs before coding against version-sensitive APIs.');
  for (const entry of index.entries) {
    lines.push(`|${entry.dir}:{${entry.files.join(',')}}`);
  }
  return `${lines.join('\n')}\n`;
}

export function injectIntoAgentsMd({ agentsPath, indexText }) {
  const wrapped = `${START}\n${indexText.trim()}\n${END}`;
  let current = fs.existsSync(agentsPath) ? fs.readFileSync(agentsPath, 'utf8') : '# AGENTS.md\n\n';
  if (current.includes(START) && current.includes(END)) {
    const before = current.slice(0, current.indexOf(START));
    const after = current.slice(current.indexOf(END) + END.length);
    current = `${before}${wrapped}${after}`;
  } else {
    current = `${current.trim()}\n\n## Managed docs index\n\n${wrapped}\n`;
  }
  fs.writeFileSync(agentsPath, current.endsWith('\n') ? current : `${current}\n`, 'utf8');
}

export function writeDocsIndex({ cwd, source, name, inject = false, rootAlias }) {
  const index = buildDocsIndex({ source, name, rootAlias });
  const text = formatCompressedIndex(index);
  const outDir = path.join(cwd, '.harness', 'docs-index');
  ensureDir(outDir);
  const indexPath = path.join(outDir, `${name}.index.md`);
  writeText(indexPath, text);
  const agentsPath = path.join(cwd, 'AGENTS.md');
  if (inject) injectIntoAgentsMd({ agentsPath, indexText: text });
  return { index, indexPath, agentsPath, injected: inject };
}
