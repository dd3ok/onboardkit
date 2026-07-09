import fs from 'node:fs';
import path from 'node:path';

function check(ok, name, detail, severity = 'error') {
  return { ok, name, detail, severity };
}

function readTextIfExists(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
}

function includesAll(text, needles) {
  return needles.every(needle => text.includes(needle));
}

function hasFrontmatterNameAndDescription(file) {
  const text = fs.readFileSync(file, 'utf8');
  return /^---\n[\s\S]*?name:\s*.+\n[\s\S]*?description:\s*.+\n[\s\S]*?---/m.test(text);
}

function isAgentOnboardRepository(cwd) {
  const pkg = path.join(cwd, 'package.json');
  if (!fs.existsSync(pkg)) return false;
  try {
    const parsed = JSON.parse(fs.readFileSync(pkg, 'utf8'));
    return parsed.name === 'agent-onboard';
  } catch {
    return false;
  }
}

function addAgentOnboardGovernanceChecks({ cwd, checks, agentsText }) {
  const docsDir = path.join(cwd, 'docs');
  const sotText = readTextIfExists(path.join(docsDir, 'SOT.md'));
  const roadmapText = readTextIfExists(path.join(docsDir, 'IMPROVEMENT_ROADMAP_DESIGN.md'));
  const auditText = readTextIfExists(path.join(docsDir, 'BEST_PRACTICES_AUDIT.md'));

  checks.push(check(
    includesAll(sotText, [
      'host-agnostic agent workflow harness',
      'It is not a full autonomous agent runtime',
      'It does not replace Codex, Claude Code, Cursor, Copilot, or other hosts',
      'It does not yet provide a full dynamic eval runner',
      'It does not yet provide browser automation evidence'
    ]),
    'Agent Onboard SOT boundary present',
    'SOT must keep the MVP product boundary and non-goals explicit.'
  ));

  checks.push(check(
    includesAll(`${agentsText}\n${roadmapText}`, [
      'Command policy v0',
      'Shared language and role contracts',
      'Finish gate v0',
      'Artifact/manual evidence v0',
      'Optional run summary'
    ]),
    'Agent Onboard roadmap priority present',
    'Governance docs must preserve the command-policy-first roadmap and current core priorities.'
  ));

  checks.push(check(
    includesAll(roadmapText, [
      '## Non-Core Backlog',
      'dynamic eval',
      'browser automation',
      'subagent orchestration',
      'Do not require subagents',
      'Do not require browser automation'
    ]),
    'Agent Onboard heavyweight work stays non-core',
    'Roadmap must keep eval, browser automation, and subagent orchestration outside the core pass.'
  ));

  checks.push(check(
    includesAll(auditText, [
      'does not bloat AGENTS.md with full documents',
      'does not trust agent completion claims without evidence',
      'does not make every task follow a heavy ceremony',
      'does not place host-specific logic in the conceptual core'
    ]),
    'Agent Onboard best-practice audit guards lightweight workflow',
    'Best-practice audit must preserve the lightweight AGENTS-first, evidence-backed structure.'
  ));

  checks.push(check(
    includesAll(agentsText, [
      'SOT.md',
      'IMPROVEMENT_ROADMAP_DESIGN.md',
      'BEST_PRACTICES_AUDIT.md',
      'STATUS.md',
      'TODO_FEATURE_DESIGNS.md'
    ]),
    'Agent Onboard docs index references governance docs',
    'AGENTS.md docs index must route agents to governance docs without inlining them.'
  ));
}

export function runDoctor({ cwd, governance = false }) {
  const checks = [];
  const agents = path.join(cwd, 'AGENTS.md');
  let agentsText = '';
  checks.push(check(fs.existsSync(agents), 'AGENTS.md exists', 'Codex loads AGENTS.md before work.'));
  if (fs.existsSync(agents)) {
    const size = Buffer.byteLength(fs.readFileSync(agents));
    checks.push(check(size <= 32 * 1024, 'AGENTS.md <= 32 KiB', `${size} bytes; keep root guidance concise.`));
    agentsText = fs.readFileSync(agents, 'utf8');
    checks.push(check(agentsText.includes('Definition of Done'), 'Definition of Done present', 'Done must be verifiable.'));
    checks.push(check(agentsText.includes('agent-onboard:docs-index:start'), 'Docs index managed section present', 'Use compressed docs index instead of full docs.'));
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
  if (governance && isAgentOnboardRepository(cwd)) {
    addAgentOnboardGovernanceChecks({ cwd, checks, agentsText });
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
