import fs from 'fs';
import path from 'path';

type SkillImplementation = {
  skillId: number;
  improvementProfile?: Record<string, unknown>;
};

type Bundle = {
  entries: SkillImplementation[];
};

const REPO_ROOT = process.cwd();
const BUNDLE_PATH = path.join(REPO_ROOT, 'skills', 'generated-10000', 'implementations.json');

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function main() {
  assert(fs.existsSync(BUNDLE_PATH), `Missing implementations bundle: ${BUNDLE_PATH}`);
  const bundle = JSON.parse(fs.readFileSync(BUNDLE_PATH, 'utf8')) as Bundle;
  assert(Array.isArray(bundle.entries), 'Invalid bundle.entries');

  const missing = bundle.entries
    .filter((entry) => Number(entry.skillId) > 0 && !entry.improvementProfile)
    .map((entry) => entry.skillId);

  assert(missing.length === 0, `Missing improvementProfile on ${missing.length} skills (sample: ${missing.slice(0, 20).join(', ')})`);
  console.log(`[validate-10000-skill-improvements] All ${bundle.entries.length} skills have improvement profiles.`);
}

main();
