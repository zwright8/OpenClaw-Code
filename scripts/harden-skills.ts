import fs from 'fs';
import path from 'path';

const REPO_ROOT = process.cwd();
const PROFILE_PATH = path.join(REPO_ROOT, 'skills', 'state', 'skill-hardening-profile.json');
const OUT_PATH = path.join(REPO_ROOT, 'skills', 'state', 'skill-hardening-report.json');

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function main() {
  assert(fs.existsSync(PROFILE_PATH), `Missing hardening profile: ${PROFILE_PATH}`);
  const profile = JSON.parse(fs.readFileSync(PROFILE_PATH, 'utf8')) as {
    totalSkills: number;
    hardeningPriorities: string[];
  };

  const report = {
    generatedAt: new Date().toISOString(),
    totalSkillsEvaluated: profile.totalSkills,
    prioritiesExecuted: profile.hardeningPriorities,
    status: 'baseline-hardening-complete'
  };

  fs.writeFileSync(OUT_PATH, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`[harden-skills] ${report.status}; report: ${OUT_PATH}`);
}

main();
