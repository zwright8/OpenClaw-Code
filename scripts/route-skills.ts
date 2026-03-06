import fs from 'fs';
import { buildSkillRegistryFromShards, REGISTRY_PATH, type SkillRegistryEntry, loadRegistry } from './lib/skill-registry.js';

type RoutedSkill = {
  rank: number;
  score: number;
  skillId: number;
  skillName: string;
  title: string;
  riskTier: SkillRegistryEntry['riskTier'];
  routingTags: string[];
  rationale: string;
};

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .filter((token) => token.length >= 2);
}

function parseArgs(argv: string[]): { query: string; k: number } {
  let query = '';
  let k = 5;

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if ((token === '--query' || token === '-q') && argv[index + 1]) {
      query = argv[index + 1];
      index += 1;
      continue;
    }

    if ((token === '--k' || token === '-k') && argv[index + 1]) {
      const parsed = Number(argv[index + 1]);
      if (Number.isFinite(parsed) && parsed > 0) k = Math.floor(parsed);
      index += 1;
      continue;
    }

    if (!token.startsWith('-')) {
      query = query ? `${query} ${token}` : token;
    }
  }

  if (!query.trim()) {
    throw new Error('Missing query. Usage: tsx scripts/route-skills.ts --query "your task" --k 5');
  }

  return { query: query.trim(), k };
}

function skillSearchBlob(skill: SkillRegistryEntry): string {
  return [
    skill.skillName,
    skill.title,
    skill.domain,
    ...skill.routingTags,
    ...skill.tags,
    skill.metadata.archetype ?? '',
    skill.metadata.coreMethod ?? '',
    ...skill.metadata.requiredSignals,
  ]
    .join(' ')
    .toLowerCase();
}

function scoreSkill(queryTokens: string[], skill: SkillRegistryEntry): { score: number; matched: string[] } {
  const blob = skillSearchBlob(skill);
  const matched = queryTokens.filter((token) => blob.includes(token));

  const coverage = queryTokens.length ? matched.length / queryTokens.length : 0;
  const routingHit = skill.routingTags.some((tag) => queryTokens.some((token) => tag.includes(token))) ? 1 : 0;
  const titleHit = queryTokens.some((token) => skill.title.toLowerCase().includes(token)) ? 1 : 0;

  const score = Number((coverage * 0.7 + routingHit * 0.2 + titleHit * 0.1).toFixed(6));
  return { score, matched };
}

function buildRationale(skill: SkillRegistryEntry, matchedTokens: string[], score: number): string {
  const reasons: string[] = [];

  if (matchedTokens.length > 0) {
    reasons.push(`matched tokens: ${Array.from(new Set(matchedTokens)).slice(0, 8).join(', ')}`);
  }
  if (skill.routingTags.length > 0) {
    reasons.push(`routing tags: ${skill.routingTags.join(', ')}`);
  }
  reasons.push(`risk tier: ${skill.riskTier}`);
  reasons.push(`score: ${score.toFixed(3)}`);

  return reasons.join(' | ');
}

function routeSkills(query: string, k: number): RoutedSkill[] {
  const registry = fs.existsSync(REGISTRY_PATH) ? loadRegistry(REGISTRY_PATH) : buildSkillRegistryFromShards();
  const queryTokens = tokenize(query);

  const ranked = registry.entries
    .map((skill) => {
      const { score, matched } = scoreSkill(queryTokens, skill);
      return {
        skill,
        score,
        matched,
      };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score || a.skill.skillId - b.skill.skillId || a.skill.skillName.localeCompare(b.skill.skillName))
    .slice(0, k)
    .map((row, index) => ({
      rank: index + 1,
      score: row.score,
      skillId: row.skill.skillId,
      skillName: row.skill.skillName,
      title: row.skill.title,
      riskTier: row.skill.riskTier,
      routingTags: row.skill.routingTags,
      rationale: buildRationale(row.skill, row.matched, row.score),
    }));

  return ranked;
}

function main() {
  const { query, k } = parseArgs(process.argv.slice(2));
  const results = routeSkills(query, k);

  const payload = {
    query,
    requestedTopK: k,
    returned: results.length,
    results,
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
