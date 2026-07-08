import fs from 'node:fs';
import path from 'node:path';
import { ensureDir, writeJson } from './fs.mjs';

export function runStaticEvalReport({ cwd }) {
  const dir = path.join(cwd, 'evals', 'scenarios');
  const scenarios = [];
  if (fs.existsSync(dir)) {
    for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort()) {
      const scenario = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
      scenarios.push(scenario);
    }
  }
  const modes = [
    'baseline-no-harness',
    'skills-default',
    'skills-explicit',
    'agents-md-only',
    'agents-md-docs-index',
    'hybrid-skills-agents-evidence'
  ];
  const report = {
    created_at: new Date().toISOString(),
    note: 'Static scenario inventory. Dynamic eval execution is not implemented in this package.',
    modes,
    scenarios
  };
  const outDir = path.join(cwd, '.harness', 'reports');
  ensureDir(outDir);
  const reportPath = path.join(outDir, 'eval-static-report.json');
  writeJson(reportPath, report);
  return { ...report, reportPath };
}
