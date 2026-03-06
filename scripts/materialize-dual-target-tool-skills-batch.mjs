#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ADAPTER_SCHEMA = 'openclaw-tool-skill-adapter/v1';

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith('--')) {
      args[key] = true;
      continue;
    }
    args[key] = next;
    i += 1;
  }
  return args;
}

function slugify(input) {
  return input
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function skillNameFromTitle(title) {
  return slugify(title).slice(0, 63) || 'tool-skill';
}

function buildSkillMarkdown(entry) {
  const skillName = skillNameFromTitle(entry.title);
  const lowerTitle = entry.title.toLowerCase();
  return `---
name: ${skillName}
description: Use when tasks require ${lowerTitle} capabilities and related automation workflows.
---

# ${entry.title}

## Purpose
${entry.purpose}

## Priority Context
- Score: ${entry.score ?? 'n/a'}
- Rank: ${entry.rank ?? 'n/a'}
- Priority band: ${entry.priorityBand ?? 'n/a'}

## Use This Skill When
- A task requires ${lowerTitle} operations.
- You need a repeatable workflow that combines planning, execution, and validation.
- You want to integrate external tools while keeping OpenClaw core behavior unchanged.

## Workflow
1. Define objective, scope, and expected outputs.
2. Perform auth/session checks and confirm required permissions.
3. Execute smallest valid operation first (read-only where possible).
4. Expand to write operations with explicit validation and rollback plan.
5. Capture artifacts, logs, and next actions for handoff.

## Safety Rules
- Do not duplicate OpenClaw core utilities; use extension-layer wrappers only.
- Enforce least privilege and redact sensitive values in logs.
- Validate side effects before marking tasks complete.

## Output Contract
- summary: concise result and status
- artifacts: files, links, or IDs generated
- follow_up: next steps or blockers
`;
}

function buildOpenClawAdapter(item, agent, skillPath) {
  const titleLower = item.title.toLowerCase();
  return {
    schemaVersion: ADAPTER_SCHEMA,
    target: 'openclaw',
    mode: 'extension',
    id: item.id,
    name: item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
    title: item.title,
    description: item.purpose,
    agent,
    scoring: {
      rank: item.rank,
      score: item.score,
      priorityBand: item.priorityBand
    },
    codex: {
      skillPath,
      entrypoint: skillPath
    },
    openclaw: {
      adapterType: 'tool-skill',
      invocationModel: 'plan-execute-verify',
      outputs: ['summary', 'artifacts', 'follow_up']
    },
    triggers: [
      titleLower,
      `${titleLower} workflow`,
      `${titleLower} automation`
    ],
    constraints: [
      'Do not duplicate openclaw/openclaw core utilities.',
      'Use least privilege and redact sensitive values in logs.',
      'Validate side effects before completion.'
    ]
  };
}

function ensureTrailingNewline(text) {
  return text.endsWith('\n') ? text : `${text}\n`;
}

function main() {
  const args = parseArgs(process.argv);
  const inputPath = args.input;
  const outRoot = args.out;
  const startIndex = Number(args['start-index']);
  const endIndex = Number(args['end-index']);
  const agent = String(args.agent || 'agent00');

  if (!inputPath || !outRoot || !Number.isInteger(startIndex) || !Number.isInteger(endIndex) || startIndex > endIndex) {
    console.error('Usage: node scripts/materialize-dual-target-tool-skills-batch.mjs --input <json> --out <dir> --start-index <n> --end-index <n> --agent agent01');
    process.exit(1);
  }

  const payload = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const entries = Array.isArray(payload.entries) ? payload.entries : [];
  const selected = entries.slice(startIndex - 1, endIndex);

  if (selected.length !== (endIndex - startIndex + 1)) {
    console.error(`Expected ${(endIndex - startIndex + 1)} entries in index range ${startIndex}-${endIndex}, got ${selected.length}.`);
    process.exit(2);
  }

  const agentDir = path.join(outRoot, agent);
  fs.mkdirSync(agentDir, { recursive: true });

  const manifestItems = [];
  for (const item of selected) {
    const slug = slugify(item.title);
    const folder = `${String(item.id).padStart(5, '0')}-${slug}`;
    const skillDir = path.join(agentDir, folder);
    const adapterDir = path.join(skillDir, 'openclaw');
    fs.mkdirSync(adapterDir, { recursive: true });

    const skillPath = path.join(skillDir, 'SKILL.md');
    fs.writeFileSync(skillPath, ensureTrailingNewline(buildSkillMarkdown(item)), 'utf8');

    const skillPathRel = path.relative(outRoot, skillPath);
    const adapterPath = path.join(adapterDir, 'skill.adapter.json');
    const adapterPayload = buildOpenClawAdapter(item, agent, skillPathRel);
    fs.writeFileSync(adapterPath, ensureTrailingNewline(JSON.stringify(adapterPayload, null, 2)), 'utf8');

    manifestItems.push({
      id: item.id,
      title: item.title,
      score: item.score,
      rank: item.rank,
      priorityBand: item.priorityBand,
      skillPath: skillPathRel,
      adapterPath: path.relative(outRoot, adapterPath)
    });
  }

  const manifest = {
    agent,
    startIndex,
    endIndex,
    startId: selected[0]?.id,
    endId: selected[selected.length - 1]?.id,
    count: manifestItems.length,
    items: manifestItems
  };

  fs.writeFileSync(path.join(agentDir, 'manifest.json'), ensureTrailingNewline(JSON.stringify(manifest, null, 2)), 'utf8');
  console.log(`${agent}: materialized ${manifestItems.length} skills (indices ${startIndex}-${endIndex})`);
}

main();
