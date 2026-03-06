#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const repoRoot = process.cwd();
const inputPath = path.join(repoRoot, 'TOOL_IDEAS_1000.md');
const outRoot = path.join(repoRoot, 'skills', 'generated', 'tool-ideas-agents');
const ADAPTER_SCHEMA = 'openclaw-tool-skill-adapter/v1';

if (!fs.existsSync(inputPath)) {
  console.error(`Missing input file: ${inputPath}`);
  process.exit(1);
}

fs.mkdirSync(outRoot, { recursive: true });

const jobs = [];
for (let i = 0; i < 10; i += 1) {
  const agentNumber = i + 1;
  const agent = `agent${String(agentNumber).padStart(2, '0')}`;
  const start = i * 100 + 1;
  const end = start + 99;
  jobs.push({ agent, start, end });
}

function runJob(job) {
  return new Promise((resolve, reject) => {
    const args = [
      'scripts/build-tool-idea-skill-batch.mjs',
      '--input', inputPath,
      '--out', outRoot,
      '--start', String(job.start),
      '--end', String(job.end),
      '--agent', job.agent
    ];

    const child = spawn(process.execPath, args, { cwd: repoRoot, stdio: ['ignore', 'pipe', 'pipe'] });
    let stderr = '';

    child.stdout.on('data', (data) => {
      process.stdout.write(data);
    });

    child.stderr.on('data', (data) => {
      const text = data.toString('utf8');
      stderr += text;
      process.stderr.write(text);
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve({ ...job, code });
      } else {
        reject(new Error(`${job.agent} failed with exit code ${code}: ${stderr}`));
      }
    });
  });
}

function ensureTrailingNewline(text) {
  return text.endsWith('\n') ? text : `${text}\n`;
}

function buildOpenClawAdapter(item, agent) {
  const skillDir = path.dirname(item.skillPath);
  const titleLower = item.tool.toLowerCase();
  return {
    schemaVersion: ADAPTER_SCHEMA,
    target: 'openclaw',
    mode: 'extension',
    id: item.id,
    name: item.tool.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
    title: item.tool,
    description: item.purpose,
    agent,
    codex: {
      skillPath: item.skillPath,
      entrypoint: item.skillPath
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
    ],
    paths: {
      skillDir
    }
  };
}

async function main() {
  const startTime = Date.now();
  console.log(`Launching ${jobs.length} skill-build agents...`);
  await Promise.all(jobs.map(runJob));

  const manifests = [];
  for (const job of jobs) {
    const manifestPath = path.join(outRoot, job.agent, 'manifest.json');
    const payload = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    manifests.push(payload);
  }

  manifests.sort((a, b) => a.agent.localeCompare(b.agent));
  const total = manifests.reduce((sum, row) => sum + row.count, 0);

  // Materialize OpenClaw adapter manifests for each generated Codex skill.
  const adapterEntries = [];
  for (const row of manifests) {
    for (const item of row.items) {
      const skillDirAbs = path.join(outRoot, path.dirname(item.skillPath));
      const adapterDirAbs = path.join(skillDirAbs, 'openclaw');
      const adapterPathAbs = path.join(adapterDirAbs, 'skill.adapter.json');
      const adapterPathRel = path.relative(outRoot, adapterPathAbs);
      fs.mkdirSync(adapterDirAbs, { recursive: true });
      const adapterPayload = buildOpenClawAdapter(item, row.agent);
      fs.writeFileSync(adapterPathAbs, ensureTrailingNewline(JSON.stringify(adapterPayload, null, 2)), 'utf8');
      adapterEntries.push({
        id: item.id,
        tool: item.tool,
        agent: row.agent,
        skillPath: item.skillPath,
        adapterPath: adapterPathRel
      });
    }
  }
  adapterEntries.sort((a, b) => a.id - b.id);

  const lines = [];
  lines.push('# Tool Skills Build Report');
  lines.push('');
  lines.push(`Input: \`TOOL_IDEAS_1000.md\``);
  lines.push(`Output root: \`skills/generated/tool-ideas-agents\``);
  lines.push(`Total skills: ${total}`);
  lines.push(`OpenClaw adapters: ${adapterEntries.length}`);
  lines.push('');
  lines.push('| Agent | Range | Count |');
  lines.push('|---|---:|---:|');

  for (const row of manifests) {
    lines.push(`| ${row.agent} | ${row.start}-${row.end} | ${row.count} |`);
  }

  lines.push('');
  lines.push('## Notes');
  lines.push('- Each skill is generated as `SKILL.md` with frontmatter + workflow template.');
  lines.push('- This extends tool coverage without duplicating OpenClaw core utilities.');
  lines.push('- Each generated skill now includes `openclaw/skill.adapter.json` for OpenClaw integration.');

  fs.writeFileSync(path.join(outRoot, 'BUILD_REPORT.md'), lines.join('\n'), 'utf8');
  fs.writeFileSync(path.join(outRoot, 'build.manifest.json'), JSON.stringify({ total, generatedAt: new Date().toISOString(), jobs: manifests }, null, 2), 'utf8');
  fs.writeFileSync(
    path.join(outRoot, 'openclaw.adapters.manifest.json'),
    ensureTrailingNewline(JSON.stringify({
      schemaVersion: ADAPTER_SCHEMA,
      generatedAt: new Date().toISOString(),
      totalAdapters: adapterEntries.length,
      adapters: adapterEntries
    }, null, 2)),
    'utf8'
  );

  const durationMs = Date.now() - startTime;
  console.log(`Completed ${total} skills in ${Math.round(durationMs / 1000)}s.`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
