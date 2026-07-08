import fs from 'node:fs';
import path from 'node:path';

function check(ok, name, detail, severity = 'error') {
  return { ok, name, detail, severity };
}

function hasFrontmatterNameAndDescription(file) {
  const text = fs.readFileSync(file, 'utf8');
  return /^---\n[\s\S]*?name:\s*.+\n[\s\S]*?description:\s*.+\n[\s\S]*?---/m.test(text);
}

export function runDoctor({ cwd }) {
  const checks = [];
  const agents = path.join(cwd, 'AGENTS.md');
  checks.push(check(fs.existsSync(agents), 'AGENTS.md exists', 'Codex loads AGENTS.md before work.'));
  if (fs.existsSync(agents)) {
    const size = Buffer.byteLength(fs.readFileSync(agents));
    checks.push(check(size <= 32 * 1024, 'AGENTS.md <= 32 KiB', `${size} bytes; keep root guidance concise.`));
    const text = fs.readFileSync(agents, 'utf8');
    checks.push(check(text.includes('Definition of Done'), 'Definition of Done present', 'Done must be verifiable.'));
    checks.push(check(text.includes('prooflane:docs-index:start'), 'Docs index managed section present', 'Use compressed docs index instead of full docs.'));
  }
  const skillRoot = path.join(cwd, '.agents', 'skills');
  checks.push(check(fs.existsSync(skillRoot), '.agents/skills exists', 'Codex scans repo-scoped skills from .agents/skills.'));
  if (fs.existsSync(skillRoot)) {
    const skillFiles = [];
    for (const skillName of fs.readdirSync(skillRoot)) {
      const p = path.join(skillRoot, skillName, 'SKILL.md');
      if (fs.existsSync(p)) skillFiles.push(p);
    }
    checks.push(check(skillFiles.length > 0, 'At least one skill exists', `${skillFiles.length} skills found.`));
    for (const file of skillFiles) {
      checks.push(check(hasFrontmatterNameAndDescription(file), `Skill metadata: ${path.relative(cwd, file)}`, 'SKILL.md must include name and description.'));
    }
  }
  const pkg = path.join(cwd, 'package.json');
  checks.push(check(fs.existsSync(pkg), 'package.json exists', 'Useful for repeatable CLI/test commands.', 'warning'));
  if (fs.existsSync(pkg)) {
    const parsed = JSON.parse(fs.readFileSync(pkg, 'utf8'));
    checks.push(check(Boolean(parsed.scripts?.test), 'npm test script exists', 'Agents need a standard test command.', 'warning'));
    checks.push(check(Boolean(parsed.scripts?.['lint:syntax'] || parsed.scripts?.lint), 'lint/syntax script exists', 'Agents need a fast static check.', 'warning'));
  }
  const ok = checks.every(c => c.ok || c.severity === 'warning');
  return { ok, checks };
}

export function printDoctorReport(report) {
  for (const c of report.checks) {
    const status = c.ok ? 'PASS' : (c.severity === 'warning' ? 'WARN' : 'FAIL');
    console.log(`${status} ${c.name} — ${c.detail}`);
  }
}
