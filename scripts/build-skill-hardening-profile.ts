import fs from 'fs';
import path from 'path';

const REPO_ROOT = process.cwd();
const MANIFEST_PATH = path.join(REPO_ROOT, 'skills', 'generated', 'skills.manifest.10000.json');
const OUT_PATH = path.join(REPO_ROOT, 'skills', 'state', 'skill-hardening-profile.json');

type ManifestEntry = {
  id: number;
  domain: string;
  runtimeArchetype: string;
  coreMethod: string;
};

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function main() {
  assert(fs.existsSync(MANIFEST_PATH), `Missing manifest: ${MANIFEST_PATH}`);
  const entries = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8')) as ManifestEntry[];
  assert(Array.isArray(entries), 'Manifest is invalid');

  const byDomain: Record<string, number> = {};
  const byArchetype: Record<string, number> = {};

  for (const entry of entries) {
    byDomain[entry.domain] = (byDomain[entry.domain] || 0) + 1;
    byArchetype[entry.runtimeArchetype] = (byArchetype[entry.runtimeArchetype] || 0) + 1;
  }

  const profile = {
    generatedAt: new Date().toISOString(),
    totalSkills: entries.length,
    domains: byDomain,
    runtimeArchetypes: byArchetype,
    hardeningPriorities: [
      'schema_validation',
      'deterministic_scoring',
      'rollback_and_retry_controls',
      'guardrail_automation'
    ]
  };

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, `${JSON.stringify(profile, null, 2)}\n`);
  console.log(`[build-skill-hardening-profile] Wrote profile for ${entries.length} skills to ${OUT_PATH}`);
}

main();
