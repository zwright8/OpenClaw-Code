import fs from 'fs';
import path from 'path';

type SkillImplementation = {
  skillId: number;
  skillName: string;
  title: string;
  domain: string;
};

type Bundle = {
  version: number;
  sourceFile: string;
  generatedAt: string;
  count: number;
  entries: SkillImplementation[];
};

const REPO_ROOT = process.cwd();
const BUNDLE_PATH = path.join(REPO_ROOT, 'skills', 'generated-10000', 'implementations.json');
const OUT_PATH = path.join(REPO_ROOT, 'skills', 'generated-10000', 'build.summary.json');

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function main() {
  assert(fs.existsSync(BUNDLE_PATH), `Missing bundle: ${BUNDLE_PATH}`);
  const bundle = JSON.parse(fs.readFileSync(BUNDLE_PATH, 'utf8')) as Bundle;
  assert(Array.isArray(bundle.entries), 'Bundle entries must be an array');
  assert(bundle.entries.length === bundle.count, `Count mismatch: count=${bundle.count}, entries=${bundle.entries.length}`);
  assert(bundle.entries.length === 10000, `Expected 10000 entries, got ${bundle.entries.length}`);

  const ids = bundle.entries.map((entry) => entry.skillId);
  const uniqueIds = new Set(ids);
  assert(uniqueIds.size === bundle.entries.length, 'Duplicate skillId values detected');

  const summary = {
    generatedAt: new Date().toISOString(),
    sourceFile: bundle.sourceFile,
    count: bundle.entries.length,
    idRange: { min: Math.min(...ids), max: Math.max(...ids) }
  };

  fs.writeFileSync(OUT_PATH, `${JSON.stringify(summary, null, 2)}\n`);
  console.log(`[build-10000-skills] Verified ${summary.count} skills (${summary.idRange.min}-${summary.idRange.max}).`);
  console.log(`[build-10000-skills] Summary: ${OUT_PATH}`);
}

main();
