import fs from 'fs';
import path from 'path';
import { buildSkillRegistryFromShards, REGISTRY_PATH, type SkillRegistry } from './lib/skill-registry.js';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function validateRegistryShape(registry: SkillRegistry): void {
  assert(registry.version === 1, 'Registry version must be 1');
  assert(Array.isArray(registry.entries), 'Registry entries must be an array');

  const seen = new Set<number>();
  let previousKey = '';

  for (const entry of registry.entries) {
    assert(Number.isFinite(entry.skillId), `Invalid skillId for ${entry.skillName}`);
    assert(!seen.has(entry.skillId), `Duplicate skillId ${entry.skillId}`);
    seen.add(entry.skillId);

    const sortKey = `${String(entry.skillId).padStart(8, '0')}:${entry.skillName}`;
    assert(sortKey >= previousKey, `Entries are not deterministically sorted at skillId ${entry.skillId}`);
    previousKey = sortKey;

    assert(Array.isArray(entry.routingTags), `routingTags must be array for skillId ${entry.skillId}`);
    assert(Array.isArray(entry.tags), `tags must be array for skillId ${entry.skillId}`);
  }

  assert(registry.stats.totalSkills === registry.entries.length, 'stats.totalSkills must equal entries.length');
}

function main() {
  assert(fs.existsSync(REGISTRY_PATH), `Missing registry file: ${REGISTRY_PATH}`);
  const diskRegistry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8')) as SkillRegistry;

  validateRegistryShape(diskRegistry);

  const rebuiltRegistry = buildSkillRegistryFromShards();
  const diskCanonical = JSON.stringify(diskRegistry);
  const rebuiltCanonical = JSON.stringify(rebuiltRegistry);

  assert(diskCanonical === rebuiltCanonical, 'Registry is not deterministic with current shard inputs. Re-run build script.');

  const relPath = path.relative(process.cwd(), REGISTRY_PATH);
  console.log(`[validate-skill-registry] PASS ${relPath} (${diskRegistry.entries.length} skills)`);
}

main();
