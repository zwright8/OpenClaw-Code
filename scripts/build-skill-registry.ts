import { buildSkillRegistryFromShards, REGISTRY_PATH, writeRegistryToDisk } from './lib/skill-registry.js';

function main() {
  const registry = buildSkillRegistryFromShards();
  writeRegistryToDisk(registry, REGISTRY_PATH);

  console.log(
    `[build-skill-registry] wrote ${registry.entries.length} skills to ${REGISTRY_PATH} ` +
      `(risk: low=${registry.stats.riskTierCounts.low}, medium=${registry.stats.riskTierCounts.medium}, high=${registry.stats.riskTierCounts.high}, critical=${registry.stats.riskTierCounts.critical})`,
  );
}

main();
