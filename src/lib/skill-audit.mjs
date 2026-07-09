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

function skillRoot(cwd) {
  return path.join(cwd, '.agents', 'skills');
}

function listSkillFiles(cwd) {
  const root = skillRoot(cwd);
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

function readSkill(file) {
  const text = fs.readFileSync(file, 'utf8');
  return { file, text, frontmatter: parseFrontmatter(text), folder: path.basename(path.dirname(file)) };
}

function skillInventory(skills) {
  if (skills.length === 0) {
    return finding({
      id: 'AOS-SKILL-001',
      title: 'Repo skills exist',
      status: 'fail',
      severity: 'medium',
      detail: 'No repo-scoped skills found under .agents/skills.'
    });
  }
  return finding({
    id: 'AOS-SKILL-001',
    title: 'Repo skills exist',
    status: 'pass',
    severity: 'low',
    detail: `${skills.length} repo-scoped skills found.`
  });
}

function metadataAndNames(skills) {
  const problems = [];
  const names = new Map();
  for (const skill of skills) {
    const name = skill.frontmatter.name;
    const description = skill.frontmatter.description;
    if (!name || !description) problems.push(`${skill.folder}: missing name or description`);
    if (name) {
      if (!/^[a-z0-9][a-z0-9-]*$/.test(name)) problems.push(`${skill.folder}: invalid name ${name}`);
      if (name !== skill.folder) problems.push(`${skill.folder}: frontmatter name is ${name}`);
      names.set(name, [...(names.get(name) || []), skill.folder]);
    }
  }
  for (const [name, folders] of names) {
    if (folders.length > 1) problems.push(`${name}: duplicate in ${folders.join(', ')}`);
  }
  return finding({
    id: 'AOS-SKILL-002',
    title: 'Skill names and metadata are unique',
    status: problems.length === 0 ? 'pass' : 'fail',
    severity: 'high',
    detail: problems.length === 0
      ? 'Every skill has name and description frontmatter, a valid folder-matching name, and no duplicate names.'
      : problems.join('; ')
  });
}

function descriptionQuality(skills) {
  const problems = [];
  for (const skill of skills) {
    const description = skill.frontmatter.description || '';
    if (description.length > 180) problems.push(`${skill.folder}: description exceeds 180 characters`);
    if (/^(does things|misc|general|helper|workflow)$/i.test(description.trim())) {
      problems.push(`${skill.folder}: description is too broad`);
    }
  }
  return finding({
    id: 'AOS-SKILL-003',
    title: 'Skill descriptions are concise triggers',
    status: problems.length === 0 ? 'pass' : 'fail',
    severity: 'medium',
    detail: problems.length === 0
      ? 'Every skill description is concise enough to act as a trigger.'
      : problems.join('; ')
  });
}

function contractSections(skills) {
  const problems = [];
  for (const skill of skills) {
    for (const section of REQUIRED_SECTIONS) {
      if (!skill.text.includes(section)) problems.push(`${skill.folder}: missing ${section}`);
    }
  }
  return finding({
    id: 'AOS-SKILL-004',
    title: 'Skill contract sections exist',
    status: problems.length === 0 ? 'pass' : 'fail',
    severity: 'high',
    detail: problems.length === 0
      ? 'Every skill defines inputs, outputs, steps, and completion criteria.'
      : problems.join('; ')
  });
}

function skillSize(skills) {
  const oversized = skills
    .map(skill => ({ skill, bytes: Buffer.byteLength(skill.text) }))
    .filter(item => item.bytes > 16 * 1024);
  return finding({
    id: 'AOS-SKILL-005',
    title: 'Skill files stay lightweight',
    status: oversized.length === 0 ? 'pass' : 'fail',
    severity: 'medium',
    detail: oversized.length === 0
      ? 'Every skill file is under 16 KiB.'
      : oversized.map(item => `${item.skill.folder}: ${item.bytes} bytes`).join('; ')
  });
}

export function runSkillAudit({ cwd }) {
  const skills = listSkillFiles(cwd).map(readSkill);
  const findings = [
    skillInventory(skills),
    metadataAndNames(skills),
    descriptionQuality(skills),
    contractSections(skills),
    skillSize(skills)
  ];
  return {
    ok: findings.every(item => item.status !== 'fail'),
    createdAt: new Date().toISOString(),
    findings
  };
}

export function printSkillAuditReport(report) {
  for (const item of report.findings) {
    console.log(`${item.status.toUpperCase()} ${item.id} ${item.title} - ${item.detail}`);
    if (item.file) console.log(`  file: ${item.file}`);
  }
}
