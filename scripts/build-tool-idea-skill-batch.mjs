#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

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

function parseToolIdeas(filePath) {
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  const ideas = [];
  for (const line of lines) {
    const match = line.match(/^(\d+)\.\s+`([^`]+)`\s+-\s+(.+)$/);
    if (!match) continue;
    const id = Number(match[1]);
    const title = match[2].trim();
    const purpose = match[3].trim();
    if (!Number.isFinite(id)) continue;
    ideas.push({ id, title, purpose });
  }
  ideas.sort((a, b) => a.id - b.id);
  return ideas;
}

function skillNameFromTitle(title) {
  return slugify(title).slice(0, 63) || 'tool-skill';
}

function buildSkillMarkdown(idea) {
  const skillName = skillNameFromTitle(idea.title);
  const prettyTitle = idea.title;
  return `---
name: ${skillName}
description: Use when tasks require ${prettyTitle.toLowerCase()} capabilities and related automation workflows.
---

# ${prettyTitle}

## Purpose
${idea.purpose}

## Use This Skill When
- A task requires ${prettyTitle.toLowerCase()} operations.
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

function main() {
  const args = parseArgs(process.argv);
  const inputPath = args.input;
  const outRoot = args.out;
  const start = Number(args.start);
  const end = Number(args.end);
  const agent = String(args.agent || 'agent00');

  if (!inputPath || !outRoot || !Number.isInteger(start) || !Number.isInteger(end) || start > end) {
    console.error('Usage: node scripts/build-tool-idea-skill-batch.mjs --input TOOL_IDEAS_1000.md --out <dir> --start <n> --end <n> --agent agent01');
    process.exit(1);
  }

  const ideas = parseToolIdeas(inputPath);
  const selected = ideas.filter((item) => item.id >= start && item.id <= end);

  if (selected.length !== (end - start + 1)) {
    console.error(`Expected ${(end - start + 1)} items in range ${start}-${end}, got ${selected.length}.`);
    process.exit(2);
  }

  const agentDir = path.join(outRoot, agent);
  fs.mkdirSync(agentDir, { recursive: true });

  const manifest = [];
  for (const idea of selected) {
    const slug = slugify(idea.title);
    const folder = `${String(idea.id).padStart(4, '0')}-${slug}`;
    const skillDir = path.join(agentDir, folder);
    fs.mkdirSync(skillDir, { recursive: true });
    const skillPath = path.join(skillDir, 'SKILL.md');
    fs.writeFileSync(skillPath, buildSkillMarkdown(idea), 'utf8');
    manifest.push({
      id: idea.id,
      tool: idea.title,
      purpose: idea.purpose,
      folder,
      skillPath: path.relative(outRoot, skillPath)
    });
  }

  const reportPath = path.join(agentDir, 'manifest.json');
  fs.writeFileSync(reportPath, JSON.stringify({ agent, start, end, count: manifest.length, items: manifest }, null, 2), 'utf8');

  console.log(`${agent}: built ${manifest.length} skills (${start}-${end})`);
}

main();
