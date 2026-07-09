import fs from 'node:fs';
import path from 'node:path';

const REQUIRED_SECTIONS = [
  '## Inputs',
  '## Outputs',
  '## Steps',
  '## Completion criteria'
];

function finding({ id, title, status, severity = 'medium', detail, file = null }) {
  return { id, title, status, severity, detail, file };
}

function guideRoot(cwd) {
  return path.join(cwd, '.agents', 'skills');
}

function listGuideFiles(cwd) {
  const root = guideRoot(cwd);
  if (!fs.existsSync(root)) return [];
  const files = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const file = path.join(root, entry.name, 'SKILL.md');
    if (fs.existsSync(file)) files.push(file);
  }
  return files.sort();
}

function parseFrontmatter(text) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!match) return {};
  const out = {};
  for (const line of match[1].split(/\r?\n/)) {
    const item = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
    if (item) out[item[1]] = item[2].trim().replace(/^["']|["']$/g, '');
  }
  return out;
}

function readGuide(file) {
  const text = fs.readFileSync(file, 'utf8');
  return { file, text, frontmatter: parseFrontmatter(text), folder: path.basename(path.dirname(file)) };
}

function guideInventory(guides) {
  if (guides.length === 0) {
    return finding({
      id: 'AFTER-GUIDE-001',
      title: 'Repo-local workflow guides exist',
      status: 'fail',
      severity: 'medium',
      detail: 'No repo-local workflow guides found under .agents/skills.'
    });
  }
  return finding({
    id: 'AFTER-GUIDE-001',
    title: 'Repo-local workflow guides exist',
    status: 'pass',
    severity: 'low',
    detail: `${guides.length} repo-local workflow guides found.`
  });
}

function metadataAndNames(guides) {
  const problems = [];
  const names = new Map();
  for (const guide of guides) {
    const name = guide.frontmatter.name;
    const description = guide.frontmatter.description;
    if (!name || !description) problems.push(`${guide.folder}: missing name or description`);
    if (name) {
      if (!/^[a-z0-9][a-z0-9-]*$/.test(name)) problems.push(`${guide.folder}: invalid name ${name}`);
      if (name !== guide.folder) problems.push(`${guide.folder}: frontmatter name is ${name}`);
      names.set(name, [...(names.get(name) || []), guide.folder]);
    }
  }
  for (const [name, folders] of names) {
    if (folders.length > 1) problems.push(`${name}: duplicate in ${folders.join(', ')}`);
  }
  return finding({
    id: 'AFTER-GUIDE-002',
    title: 'Guide names and metadata are unique',
    status: problems.length === 0 ? 'pass' : 'fail',
    severity: 'high',
    detail: problems.length === 0
      ? 'Every guide has name and description frontmatter, a valid folder-matching name, and no duplicate names.'
      : problems.join('; ')
  });
}

function descriptionQuality(guides) {
  const problems = [];
  for (const guide of guides) {
    const description = guide.frontmatter.description || '';
    if (description.length > 180) problems.push(`${guide.folder}: description exceeds 180 characters`);
    if (/^(does things|misc|general|helper|workflow)$/i.test(description.trim())) {
      problems.push(`${guide.folder}: description is too broad`);
    }
  }
  return finding({
    id: 'AFTER-GUIDE-003',
    title: 'Guide descriptions are concise triggers',
    status: problems.length === 0 ? 'pass' : 'fail',
    severity: 'medium',
    detail: problems.length === 0
      ? 'Every guide description is concise enough to act as a trigger.'
      : problems.join('; ')
  });
}

function contractSections(guides) {
  const problems = [];
  for (const guide of guides) {
    for (const section of REQUIRED_SECTIONS) {
      if (!guide.text.includes(section)) problems.push(`${guide.folder}: missing ${section}`);
    }
  }
  return finding({
    id: 'AFTER-GUIDE-004',
    title: 'Guide contract sections exist',
    status: problems.length === 0 ? 'pass' : 'fail',
    severity: 'high',
    detail: problems.length === 0
      ? 'Every guide defines inputs, outputs, steps, and completion criteria.'
      : problems.join('; ')
  });
}

function guideSize(guides) {
  const oversized = guides
    .map(guide => ({ guide, bytes: Buffer.byteLength(guide.text) }))
    .filter(item => item.bytes > 16 * 1024);
  return finding({
    id: 'AFTER-GUIDE-005',
    title: 'Guide files stay lightweight',
    status: oversized.length === 0 ? 'pass' : 'fail',
    severity: 'medium',
    detail: oversized.length === 0
      ? 'Every guide file is under 16 KiB.'
      : oversized.map(item => `${item.guide.folder}: ${item.bytes} bytes`).join('; ')
  });
}

export function runGuideAudit({ cwd }) {
  const guides = listGuideFiles(cwd).map(readGuide);
  const findings = [
    guideInventory(guides),
    metadataAndNames(guides),
    descriptionQuality(guides),
    contractSections(guides),
    guideSize(guides)
  ];
  return {
    ok: findings.every(item => item.status !== 'fail'),
    createdAt: new Date().toISOString(),
    findings
  };
}

export function printGuideAuditReport(report) {
  for (const item of report.findings) {
    console.log(`${item.status.toUpperCase()} ${item.id} ${item.title} - ${item.detail}`);
    if (item.file) console.log(`  file: ${item.file}`);
  }
}
