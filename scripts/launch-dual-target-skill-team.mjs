#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const repoRoot = process.cwd();
const inputPath = path.join(repoRoot, 'skills', 'state', 'tool-skills-13000.scored.json');
const outRoot = path.join(repoRoot, 'skills', 'generated', 'tool-skills-team10');
const teamSize = 10;

if (!fs.existsSync(inputPath)) {
  console.error(`Missing scored input: ${inputPath}`);
  process.exit(1);
}

const payload = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
const entries = Array.isArray(payload.entries) ? payload.entries : [];
if (entries.length === 0) {
  console.error('No entries found in scored input.');
  process.exit(2);
}

entries.sort((a, b) => a.id - b.id);
fs.mkdirSync(outRoot, { recursive: true });

const jobs = [];
const chunk = Math.ceil(entries.length / teamSize);
for (let i = 0; i < teamSize; i += 1) {
  const startIndex = i * chunk + 1;
  const endIndex = Math.min((i + 1) * chunk, entries.length);
  if (startIndex > endIndex) continue;
  const agent = `agent${String(i + 1).padStart(2, '0')}`;
  jobs.push({ agent, startIndex, endIndex });
}

function runJob(job) {
  return new Promise((resolve, reject) => {
    const args = [
      'scripts/materialize-dual-target-tool-skills-batch.mjs',
      '--input', inputPath,
      '--out', outRoot,
      '--start-index', String(job.startIndex),
      '--end-index', String(job.endIndex),
      '--agent', job.agent
    ];

    const child = spawn(process.execPath, args, { cwd: repoRoot, stdio: ['ignore', 'pipe', 'pipe'] });
    let stderr = '';

    child.stdout.on('data', (data) => process.stdout.write(data));
    child.stderr.on('data', (data) => {
      const text = data.toString('utf8');
      stderr += text;
      process.stderr.write(text);
    });

    child.on('close', (code) => {
      if (code === 0) resolve(job);
      else reject(new Error(`${job.agent} failed with code ${code}: ${stderr}`));
    });
  });
}

function ensureTrailingNewline(text) {
  return text.endsWith('\n') ? text : `${text}\n`;
}

async function main() {
  const startedAt = Date.now();
  console.log(`Launching ${jobs.length} dual-target build agents for ${entries.length} skills...`);

  await Promise.all(jobs.map(runJob));

  const manifests = [];
  for (const job of jobs) {
    const p = path.join(outRoot, job.agent, 'manifest.json');
    manifests.push(JSON.parse(fs.readFileSync(p, 'utf8')));
  }

  manifests.sort((a, b) => a.agent.localeCompare(b.agent));
  const totalSkills = manifests.reduce((sum, item) => sum + item.count, 0);

  const adapterCount = manifests.reduce((sum, item) => sum + item.items.length, 0);

  const report = [];
  report.push('# Team 10 Dual-Target Build Report');
  report.push('');
  report.push(`Input: \`skills/state/tool-skills-13000.scored.json\``);
  report.push(`Output root: \`skills/generated/tool-skills-team10\``);
  report.push(`Team size: ${jobs.length}`);
  report.push(`Total skills built: ${totalSkills}`);
  report.push(`Total adapters built: ${adapterCount}`);
  report.push('');
  report.push('| Agent | Index Range | ID Range | Count |');
  report.push('|---|---:|---:|---:|');
  for (const m of manifests) {
    report.push(`| ${m.agent} | ${m.startIndex}-${m.endIndex} | ${m.startId}-${m.endId} | ${m.count} |`);
  }
  report.push('');
  report.push('## Notes');
  report.push('- Each skill folder contains `SKILL.md` and `openclaw/skill.adapter.json`.');
  report.push('- This is extension-layer generation and does not duplicate OpenClaw core utilities.');

  fs.writeFileSync(path.join(outRoot, 'TEAM_BUILD_REPORT.md'), ensureTrailingNewline(report.join('\n')), 'utf8');

  const adapterEntries = manifests.flatMap((m) => m.items.map((item) => ({ ...item, agent: m.agent })));
  adapterEntries.sort((a, b) => a.id - b.id);

  fs.writeFileSync(
    path.join(outRoot, 'team.build.manifest.json'),
    ensureTrailingNewline(JSON.stringify({
      generatedAt: new Date().toISOString(),
      teamSize: jobs.length,
      totalSkills,
      totalAdapters: adapterCount,
      jobs: manifests,
      items: adapterEntries
    }, null, 2)),
    'utf8'
  );

  fs.writeFileSync(
    path.join(outRoot, 'openclaw.adapters.manifest.json'),
    ensureTrailingNewline(JSON.stringify({
      schemaVersion: 'openclaw-tool-skill-adapter/v1',
      generatedAt: new Date().toISOString(),
      totalAdapters: adapterEntries.length,
      adapters: adapterEntries.map((item) => ({
        id: item.id,
        title: item.title,
        score: item.score,
        rank: item.rank,
        priorityBand: item.priorityBand,
        agent: item.agent,
        skillPath: item.skillPath,
        adapterPath: item.adapterPath
      }))
    }, null, 2)),
    'utf8'
  );

  const elapsedSec = Math.round((Date.now() - startedAt) / 1000);
  console.log(`Completed team build: ${totalSkills} skills and ${adapterCount} adapters in ${elapsedSec}s.`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
