#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const inputFiles = [
  { path: path.join(repoRoot, 'TOOL_IDEAS_1000.md'), source: 'tool_ideas_1000' },
  { path: path.join(repoRoot, 'TOOL_SKILLS_12000_MORE.md'), source: 'tool_skills_12000_more' }
];

const stateDir = path.join(repoRoot, 'skills', 'state');
fs.mkdirSync(stateDir, { recursive: true });

function parseMarkdownList(filePath, source) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing input file: ${filePath}`);
  }
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  const entries = [];
  for (const line of lines) {
    const match = line.match(/^(\d+)\.\s+`([^`]+)`\s+-\s+(.+)$/);
    if (!match) continue;
    entries.push({
      id: Number(match[1]),
      title: match[2].trim(),
      purpose: match[3].trim(),
      source
    });
  }
  return entries;
}

function slugify(input) {
  return input
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function normalizeTitle(input) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const capabilityWeights = [
  ['connector', 18],
  ['auth broker', 18],
  ['permission mapper', 16],
  ['schema introspector', 20],
  ['api contract validator', 20],
  ['spec drift detector', 14],
  ['workflow compiler', 17],
  ['execution runner', 15],
  ['job scheduler', 12],
  ['retry governor', 10],
  ['rate limit optimizer', 10],
  ['state reconciler', 14],
  ['rollback coordinator', 12],
  ['migration planner', 13],
  ['evidence collector', 10],
  ['anomaly detector', 11],
  ['policy evaluator', 16],
  ['risk scorer', 16],
  ['compliance mapper', 14],
  ['pii redactor', 16],
  ['secret scanner', 17],
  ['vulnerability correlator', 16],
  ['incident triage', 14],
  ['root cause miner', 13],
  ['remediation planner', 13],
  ['runbook composer', 10],
  ['approval orchestrator', 10],
  ['quality gatekeeper', 11],
  ['outcome synthesizer', 8]
];

const domainWeights = [
  ['identity', 10],
  ['security', 10],
  ['compliance', 9],
  ['risk', 8],
  ['incident', 8],
  ['api', 8],
  ['data quality', 8],
  ['workflow', 7],
  ['billing', 7],
  ['finance', 7],
  ['healthcare', 7],
  ['government', 7],
  ['cloud', 6],
  ['kubernetes', 6],
  ['observability', 6],
  ['ai', 6],
  ['mlops', 6],
  ['knowledge graph', 6],
  ['legal', 6],
  ['procurement', 5],
  ['supply chain', 5],
  ['education', 5],
  ['nonprofit', 5],
  ['public health', 5],
  ['translation', 4],
  ['media', 4],
  ['ecommerce', 4],
  ['marketing', 4]
];

function scoreEntry(entry) {
  const text = `${entry.title} ${entry.purpose}`.toLowerCase();
  let score = 50;

  for (const [keyword, points] of capabilityWeights) {
    if (text.includes(keyword)) score += points;
  }

  for (const [keyword, points] of domainWeights) {
    if (text.includes(keyword)) score += points;
  }

  // Boost foundational enablers for "do anything" capability.
  if (/connector|auth broker|schema introspector|api contract validator|workflow compiler|execution runner/.test(text)) {
    score += 10;
  }

  // Small preference for the original first 1000 baseline skills.
  if (entry.id <= 1000) {
    score += 4;
  }

  // Generic universal placeholders get a slight penalty so concrete domains rank first.
  if (entry.title.toLowerCase().includes('universal toolchain')) {
    score -= 5;
  }

  return Math.max(1, Math.round(score));
}

function writeJson(filePath, payload) {
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

function main() {
  const merged = [];
  for (const item of inputFiles) {
    merged.push(...parseMarkdownList(item.path, item.source));
  }

  merged.sort((a, b) => a.id - b.id);

  const dedupeMap = new Map();
  const duplicates = [];

  for (const entry of merged) {
    const key = normalizeTitle(entry.title);
    const existing = dedupeMap.get(key);
    if (!existing) {
      dedupeMap.set(key, {
        ...entry,
        slug: `${String(entry.id).padStart(5, '0')}-${slugify(entry.title)}`,
        normalizedTitle: key,
        duplicateIds: []
      });
      continue;
    }

    if (entry.id < existing.id) {
      duplicates.push({ keptId: entry.id, droppedId: existing.id, title: entry.title });
      dedupeMap.set(key, {
        ...entry,
        slug: `${String(entry.id).padStart(5, '0')}-${slugify(entry.title)}`,
        normalizedTitle: key,
        duplicateIds: [...existing.duplicateIds, existing.id]
      });
    } else {
      duplicates.push({ keptId: existing.id, droppedId: entry.id, title: entry.title });
      existing.duplicateIds.push(entry.id);
    }
  }

  const deduped = Array.from(dedupeMap.values()).sort((a, b) => a.id - b.id);

  const scored = deduped.map((entry) => {
    const score = scoreEntry(entry);
    return {
      ...entry,
      score
    };
  });

  const ranked = [...scored].sort((a, b) => b.score - a.score || a.id - b.id);
  const rankById = new Map(ranked.map((entry, idx) => [entry.id, idx + 1]));

  const scoredWithRank = scored
    .map((entry) => ({
      ...entry,
      rank: rankById.get(entry.id),
      priorityBand:
        entry.score >= 95 ? 'P0' :
        entry.score >= 85 ? 'P1' :
        entry.score >= 75 ? 'P2' : 'P3'
    }))
    .sort((a, b) => a.id - b.id);

  const top500 = [...ranked].slice(0, 500).map((entry, idx) => ({
    rank: idx + 1,
    ...entry,
    priorityBand:
      entry.score >= 95 ? 'P0' :
      entry.score >= 85 ? 'P1' :
      entry.score >= 75 ? 'P2' : 'P3'
  }));

  const generatedAt = new Date().toISOString();

  writeJson(path.join(stateDir, 'tool-skills-13000.merged.json'), {
    generatedAt,
    count: merged.length,
    entries: merged
  });

  writeJson(path.join(stateDir, 'tool-skills-13000.deduped.json'), {
    generatedAt,
    sourceCount: merged.length,
    dedupedCount: deduped.length,
    duplicateCount: duplicates.length,
    entries: deduped
  });

  writeJson(path.join(stateDir, 'tool-skills-13000.scored.json'), {
    generatedAt,
    sourceCount: merged.length,
    dedupedCount: deduped.length,
    duplicateCount: duplicates.length,
    entries: scoredWithRank
  });

  writeJson(path.join(stateDir, 'tool-skills-top-500.json'), {
    generatedAt,
    sourceCount: merged.length,
    dedupedCount: deduped.length,
    topCount: top500.length,
    entries: top500
  });

  const mdLines = [];
  mdLines.push('# Build-First Top 500 Tool Skills');
  mdLines.push('');
  mdLines.push(`Generated: ${generatedAt}`);
  mdLines.push(`Source entries: ${merged.length}`);
  mdLines.push(`Deduped entries: ${deduped.length}`);
  mdLines.push(`Duplicates removed: ${duplicates.length}`);
  mdLines.push('');
  mdLines.push('| Rank | ID | Score | Priority | Skill |');
  mdLines.push('|---:|---:|---:|:---:|---|');
  for (const entry of top500) {
    mdLines.push(`| ${entry.rank} | ${entry.id} | ${entry.score} | ${entry.priorityBand} | ${entry.title} |`);
  }
  mdLines.push('');
  fs.writeFileSync(path.join(stateDir, 'tool-skills-top-500.md'), `${mdLines.join('\n')}\n`, 'utf8');

  const reportLines = [];
  reportLines.push('# Tool Skills Dedupe + Scoring Report');
  reportLines.push('');
  reportLines.push(`- Generated: ${generatedAt}`);
  reportLines.push(`- Merged count: ${merged.length}`);
  reportLines.push(`- Deduped count: ${deduped.length}`);
  reportLines.push(`- Duplicate rows removed: ${duplicates.length}`);
  reportLines.push(`- Top list size: ${top500.length}`);
  reportLines.push('');
  reportLines.push('## Output Files');
  reportLines.push('- `skills/state/tool-skills-13000.merged.json`');
  reportLines.push('- `skills/state/tool-skills-13000.deduped.json`');
  reportLines.push('- `skills/state/tool-skills-13000.scored.json`');
  reportLines.push('- `skills/state/tool-skills-top-500.json`');
  reportLines.push('- `skills/state/tool-skills-top-500.md`');
  reportLines.push('');
  fs.writeFileSync(path.join(stateDir, 'tool-skills-dedupe-score-report.md'), `${reportLines.join('\n')}\n`, 'utf8');

  console.log(`Merged: ${merged.length}`);
  console.log(`Deduped: ${deduped.length}`);
  console.log(`Duplicates removed: ${duplicates.length}`);
  console.log(`Top 500 written.`);
}

main();
