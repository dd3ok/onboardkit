import fs from 'node:fs';
import path from 'node:path';
import { copyDir, ensureDir, writeText } from './fs.mjs';

function render(text, vars) {
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? '');
}

function copyFileRendered(src, dest, vars, force = false) {
  if (fs.existsSync(dest) && !force) return false;
  const text = fs.readFileSync(src, 'utf8');
  writeText(dest, render(text, vars), { force: true });
  return true;
}

export function createSpecArtifacts({ cwd, toolRoot, slug, title, force = false }) {
  const target = path.join(cwd, 'specs', slug);
  ensureDir(target);
  const vars = { slug, title: title || slug, date: new Date().toISOString().slice(0, 10) };
  const files = [];
  const templateMap = {
    'brief.md': 'brief.template.md',
    'spec.md': 'spec.template.md',
    'design.md': 'design.template.md',
    'tasks.md': 'tasks.template.md',
    'criteria.json': 'criteria.template.json',
    'review.md': 'review.template.md',
    'retro.md': 'retro.template.md'
  };
  for (const [outName, templateName] of Object.entries(templateMap)) {
    const src = path.join(toolRoot, 'templates', templateName);
    const dest = path.join(target, outName);
    if (copyFileRendered(src, dest, vars, force)) files.push(path.relative(cwd, dest));
  }
  return { target, files };
}

export function createProjectScaffold({ target, toolRoot, force = false }) {
  ensureDir(target);
  const created = [];
  const skipped = [];
  const rootFiles = [
    ['AGENTS.md', 'AGENTS.template.md'],
    ['PLANS.md', 'PLANS.template.md'],
    ['.gitignore', 'gitignore.template'],
    ['.harness/security-policy.json', 'security-policy.template.json'],
    ['docs/code_review.md', 'code_review.template.md']
  ];
  for (const [destRel, template] of rootFiles) {
    const src = path.join(toolRoot, 'templates', template);
    const dest = path.join(target, destRel);
    if (fs.existsSync(dest) && !force) skipped.push(destRel);
    else {
      writeText(dest, fs.readFileSync(src, 'utf8'));
      created.push(destRel);
    }
  }
  for (const dir of ['.harness/docs-index', '.harness/evidence', '.harness/runs', '.harness/reports', 'specs']) {
    ensureDir(path.join(target, dir));
    created.push(dir);
  }
  const guidesSrc = path.join(toolRoot, '.agents', 'skills');
  if (fs.existsSync(guidesSrc)) {
    const copied = copyDir(guidesSrc, path.join(target, '.agents', 'skills'), { force });
    created.push(...copied.created.map(p => path.relative(target, p)));
    skipped.push(...copied.skipped.map(p => path.relative(target, p)));
  }
  return { created, skipped };
}
