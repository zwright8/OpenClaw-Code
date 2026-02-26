import fs from 'fs';
import path from 'path';

type ImprovementProfile = Record<string, unknown>;

type SkillImplementation = {
  skillId: number;
  improvementProfile?: ImprovementProfile;
  [key: string]: unknown;
};

type Bundle = {
  version: number;
  sourceFile: string;
  generatedAt: string;
  count: number;
  entries: SkillImplementation[];
};

type ImprovementCatalog = {
  entries: Array<{ skillId: number; improvementProfile: ImprovementProfile }>;
};

const REPO_ROOT = process.cwd();
const BUNDLE_PATH = path.join(REPO_ROOT, 'skills', 'generated-10000', 'implementations.json');
const IMPROVEMENTS_PATH = path.join(REPO_ROOT, 'skills', 'generated-10000', 'improvements.catalog.json');

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function main() {
  assert(fs.existsSync(BUNDLE_PATH), `Missing implementations bundle: ${BUNDLE_PATH}`);
  assert(fs.existsSync(IMPROVEMENTS_PATH), `Missing improvements catalog: ${IMPROVEMENTS_PATH}`);

  const bundle = JSON.parse(fs.readFileSync(BUNDLE_PATH, 'utf8')) as Bundle;
  const improvements = JSON.parse(fs.readFileSync(IMPROVEMENTS_PATH, 'utf8')) as ImprovementCatalog;

  const byId = new Map<number, ImprovementProfile>();
  for (const entry of improvements.entries || []) {
    if (Number.isInteger(entry?.skillId) && entry.improvementProfile && !byId.has(entry.skillId)) {
      byId.set(entry.skillId, entry.improvementProfile);
    }
  }

  let patched = 0;
  for (const entry of bundle.entries) {
    const profile = byId.get(entry.skillId);
    if (!profile) continue;
    if (!entry.improvementProfile) {
      entry.improvementProfile = profile;
      patched += 1;
    }
  }

  fs.writeFileSync(BUNDLE_PATH, `${JSON.stringify(bundle, null, 2)}\n`);
  console.log(`[improve-10000-skills] Applied missing improvement profiles: ${patched}`);
}

main();
