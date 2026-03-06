import fs from 'fs';
import path from 'path';
import {
    rolloutControlToFollowUpTasks,
    runSkillRolloutControlLoop,
    type SkillExecutionTask,
    type SkillRolloutControlRun,
    type SkillRolloutWavePlan
} from '../skills/runtime/index.js';

type CliOptions = {
    failBias?: number;
    approvalBias?: number;
    maxFollowUps?: number;
};

const REPO_ROOT = process.cwd();
const GENERATED_ROOT = path.join(REPO_ROOT, 'skills', 'generated');
const WAVE_PLAN_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-waves.json');
const WAVE_TASKS_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-wave-tasks.json');
const CONTROL_RUN_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-control.json');
const CONTROL_MD_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-control.md');
const CONTROL_TASKS_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-control-tasks.json');

function loadJson<T>(filePath: string): T {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function parseArgs(argv: string[]): CliOptions {
    const options: CliOptions = {};
    for (let index = 0; index < argv.length; index += 1) {
        const token = argv[index];
        const next = argv[index + 1];

        if (token === '--fail-bias' && next) {
            options.failBias = Number(next);
            index += 1;
            continue;
        }
        if (token === '--approval-bias' && next) {
            options.approvalBias = Number(next);
            index += 1;
            continue;
        }
        if (token === '--max-followups' && next) {
            options.maxFollowUps = Number(next);
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

function renderMarkdown(run: SkillRolloutControlRun, followUpTasks: SkillExecutionTask[]): string {
    const lines: string[] = [];

    lines.push('# Skill Runtime Rollout Control Run');
    lines.push('');
    lines.push(`Generated: ${run.generatedAt}`);
    lines.push(`Source wave plan: ${run.sourceWavePlanGeneratedAt}`);
    lines.push('');
    lines.push('## Summary');
    lines.push(`- Total tasks: ${run.summary.totalTasks}`);
    lines.push(`- Success: ${run.summary.successCount}`);
    lines.push(`- Failed: ${run.summary.failedCount}`);
    lines.push(`- Approval pending: ${run.summary.approvalPendingCount}`);
    lines.push(`- Skipped: ${run.summary.skippedCount}`);
    lines.push(`- Overall posture: ${run.summary.overallPosture}`);
    lines.push(`- Follow-up tasks generated: ${followUpTasks.length}`);
    lines.push('');
    lines.push('## Wave Health');
    lines.push('| Wave | Lane | Tasks | Success | Failed | Pending | Failure Rate | Avg Latency (ms) | Posture |');
    lines.push('| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
    for (const wave of run.waveSummaries) {
        lines.push(
            `| ${wave.waveId} | ${wave.lane} | ${wave.taskCount} | ${wave.successCount} | ${wave.failedCount} | ` +
            `${wave.approvalPendingCount} | ${wave.failureRate} | ${wave.avgLatencyMs} | ${wave.posture} |`
        );
    }
    lines.push('');
    lines.push('## Top Failing Tasks');
    lines.push('| Task ID | Category | Skill ID | Wave | Reason |');
    lines.push('| --- | --- | --- | --- | --- |');
    for (const result of run.taskResults.filter((entry) => entry.status === 'failed').slice(0, 150)) {
        lines.push(
            `| \`${result.taskId}\` | ${result.category} | ${result.skillId ?? '-'} | ${result.waveId ?? '-'} | ` +
            `${escapeCell(result.reason)} |`
        );
    }
    lines.push('');

    return lines.join('\n');
}

function main() {
    if (!fs.existsSync(WAVE_PLAN_PATH)) {
        throw new Error(`Missing wave plan: ${WAVE_PLAN_PATH}. Run npm run skills:orchestrate first.`);
    }
    if (!fs.existsSync(WAVE_TASKS_PATH)) {
        throw new Error(`Missing wave task set: ${WAVE_TASKS_PATH}. Run npm run skills:orchestrate first.`);
    }

    const cliOptions = parseArgs(process.argv.slice(2));
    const wavePlan = loadJson<SkillRolloutWavePlan>(WAVE_PLAN_PATH);
    const waveTasks = loadJson<SkillExecutionTask[]>(WAVE_TASKS_PATH);

    const controlRun = runSkillRolloutControlLoop(wavePlan, waveTasks, {
        failBias: cliOptions.failBias,
        approvalBias: cliOptions.approvalBias
    });
    const followUpTasks = rolloutControlToFollowUpTasks(controlRun, wavePlan, {
        maxTasks: cliOptions.maxFollowUps
    });

    fs.writeFileSync(CONTROL_RUN_PATH, `${JSON.stringify(controlRun, null, 2)}\n`);
    fs.writeFileSync(CONTROL_MD_PATH, renderMarkdown(controlRun, followUpTasks));
    fs.writeFileSync(CONTROL_TASKS_PATH, `${JSON.stringify(followUpTasks, null, 2)}\n`);

    console.log(
        `[control-1000-skills-rollout] posture=${controlRun.summary.overallPosture} ` +
        `failed=${controlRun.summary.failedCount} pending=${controlRun.summary.approvalPendingCount} ` +
        `followups=${followUpTasks.length}`
    );
}

main();
