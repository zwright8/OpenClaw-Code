import fs from 'fs';
import path from 'path';
import {
    buildSkillRolloutWavePlan,
    rolloutWavePlanToTasks,
    type SkillRolloutPlan,
    type SkillRolloutWavePlan
} from '../skills/runtime/index.js';

type CliOptions = {
    nowWaveCapacity?: number;
    nextWaveCapacity?: number;
    maxPerDomainPerWave?: number;
};

const REPO_ROOT = process.cwd();
const GENERATED_ROOT = path.join(REPO_ROOT, 'skills', 'generated');
const SOURCE_PLAN_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-plan.json');
const WAVE_PLAN_JSON_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-waves.json');
const WAVE_PLAN_MD_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-waves.md');
const WAVE_TASKS_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-wave-tasks.json');

function loadJson<T>(filePath: string): T {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function parseArgs(argv: string[]): CliOptions {
    const options: CliOptions = {};
    for (let index = 0; index < argv.length; index += 1) {
        const token = argv[index];
        const next = argv[index + 1];
        if (token === '--now-capacity' && next) {
            options.nowWaveCapacity = Number(next);
            index += 1;
            continue;
        }
        if (token === '--next-capacity' && next) {
            options.nextWaveCapacity = Number(next);
            index += 1;
            continue;
        }
        if (token === '--max-domain' && next) {
            options.maxPerDomainPerWave = Number(next);
            index += 1;
            continue;
        }
        throw new Error(`Unknown or incomplete argument: ${token}`);
    }
    return options;
}

function escapeCell(value: string): string {
    return value.replace(/\|/g, '\\|');
}

function renderWaveMarkdown(plan: SkillRolloutWavePlan): string {
    const lines: string[] = [];

    lines.push('# Skill Runtime Rollout Waves');
    lines.push('');
    lines.push(`Generated: ${plan.generatedAt}`);
    lines.push(`Source lane plan: ${plan.sourcePlanGeneratedAt}`);
    lines.push('');
    lines.push('## Configuration');
    lines.push(`- nowWaveCapacity: ${plan.config.nowWaveCapacity}`);
    lines.push(`- nextWaveCapacity: ${plan.config.nextWaveCapacity}`);
    lines.push(`- maxPerDomainPerWave: ${plan.config.maxPerDomainPerWave}`);
    lines.push('');
    lines.push('## Summary');
    lines.push(`- Scheduled skills: ${plan.summary.scheduledSkills}`);
    lines.push(`- Oversight skills: ${plan.summary.oversightSkills}`);
    lines.push(`- Now waves: ${plan.summary.waveCounts.now}`);
    lines.push(`- Next waves: ${plan.summary.waveCounts.next}`);
    lines.push(`- Average wave fill rate: ${plan.summary.avgWaveFillRate}`);
    lines.push('');
    lines.push('## Waves');
    lines.push('| Wave | Lane | Capacity | Entries | Avg Readiness | Avg Risk | Top Domains |');
    lines.push('| --- | --- | --- | --- | --- | --- | --- |');
    for (const wave of plan.waves) {
        const topDomains = wave.domainLoad
            .slice(0, 3)
            .map((entry) => `${entry.domain}(${entry.count})`)
            .join(', ');
        lines.push(
            `| ${wave.waveId} | ${wave.lane} | ${wave.capacity} | ${wave.entryCount} | ${wave.avgReadiness} | ` +
            `${wave.avgRisk} | ${escapeCell(topDomains)} |`
        );
    }
    lines.push('');
    lines.push('## Oversight Queue');
    lines.push('| Position | Skill ID | Skill Name | Domain | Risk | Readiness | Reasons |');
    lines.push('| --- | --- | --- | --- | --- | --- | --- |');
    for (const item of plan.oversightQueue) {
        lines.push(
            `| ${item.position} | ${item.skillId} | \`${item.skillName}\` | ${escapeCell(item.domain)} | ` +
            `${item.riskIndex} | ${item.readinessIndex} | ${escapeCell(item.reasons.join('; '))} |`
        );
    }
    lines.push('');

    return lines.join('\n');
}

function main() {
    if (!fs.existsSync(SOURCE_PLAN_PATH)) {
        throw new Error(`Missing rollout plan: ${SOURCE_PLAN_PATH}. Run npm run skills:plan first.`);
    }

    const sourcePlan = loadJson<SkillRolloutPlan>(SOURCE_PLAN_PATH);
    const options = parseArgs(process.argv.slice(2));
    const wavePlan = buildSkillRolloutWavePlan(sourcePlan, options);
    const tasks = rolloutWavePlanToTasks(wavePlan);

    fs.writeFileSync(WAVE_PLAN_JSON_PATH, `${JSON.stringify(wavePlan, null, 2)}\n`);
    fs.writeFileSync(WAVE_PLAN_MD_PATH, renderWaveMarkdown(wavePlan));
    fs.writeFileSync(WAVE_TASKS_PATH, `${JSON.stringify(tasks, null, 2)}\n`);

    console.log(
        `[orchestrate-1000-skills-rollout] waves=${wavePlan.waves.length} ` +
        `scheduled=${wavePlan.summary.scheduledSkills} oversight=${wavePlan.summary.oversightSkills} tasks=${tasks.length}`
    );
}

main();
