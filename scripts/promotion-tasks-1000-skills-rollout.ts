import fs from 'fs';
import path from 'path';
import {
    rolloutPromotionToTasks,
    type SkillExecutionTask,
    type SkillRolloutOptimizationRun,
    type SkillRolloutWavePlan
} from '../skills/runtime/index.js';

type CliOptions = {
    maxSkillTasks?: number;
};

const REPO_ROOT = process.cwd();
const GENERATED_ROOT = path.join(REPO_ROOT, 'skills', 'generated');
const OPTIMIZATION_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-optimization.json');
const BASELINE_WAVES_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-waves.json');
const SELECTED_WAVES_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-selected-waves.json');
const PROMOTION_TASKS_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-tasks.json');
const PROMOTION_TASKS_MD_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-tasks.md');

function loadJson<T>(filePath: string): T {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function parseArgs(argv: string[]): CliOptions {
    const options: CliOptions = {};

    for (let index = 0; index < argv.length; index += 1) {
        const token = argv[index];
        const next = argv[index + 1];

        if (token === '--max-skill-tasks' && next) {
            options.maxSkillTasks = Number(next);
            index += 1;
            continue;
        }

        throw new Error(`Unknown or incomplete argument: ${token}`);
    }

    return options;
}

function renderMarkdown(optimization: SkillRolloutOptimizationRun, tasks: SkillExecutionTask[]): string {
    const lines: string[] = [];

    lines.push('# Skill Runtime Rollout Promotion Tasks');
    lines.push('');
    lines.push(`Generated: ${new Date().toISOString()}`);
    lines.push(`Promotion status: ${optimization.promotion.status}`);
    lines.push(`Strategy: ${optimization.recommendation.strategy}`);
    lines.push(`Task count: ${tasks.length}`);
    lines.push('');
    lines.push('## Task Summary');
    lines.push(`- Decision tasks: ${tasks.filter((task) => task.id.startsWith('promotion-decision')).length}`);
    lines.push(`- Apply/retain tasks: ${tasks.filter((task) => task.id.startsWith('promotion-apply') || task.id.startsWith('promotion-retain')).length}`);
    lines.push(`- Skill verification/shadow tasks: ${tasks.filter((task) => task.id.startsWith('promotion-verify') || task.id.startsWith('promotion-shadow')).length}`);
    lines.push(`- Audit tasks: ${tasks.filter((task) => task.id.startsWith('promotion-audit')).length}`);
    lines.push('');

    if (optimization.promotion.violations.length > 0) {
        lines.push('## Policy Violations');
        optimization.promotion.violations.forEach((violation) => lines.push(`- ${violation}`));
        lines.push('');
    }

    lines.push('## Tasks');
    lines.push('| ID | To | Priority | Task |');
    lines.push('| --- | --- | --- | --- |');
    tasks.slice(0, 200).forEach((task) => {
        lines.push(`| \`${task.id}\` | ${task.to} | ${task.priority} | ${task.task} |`);
    });
    lines.push('');

    return lines.join('\n');
}

function main() {
    for (const required of [OPTIMIZATION_PATH, BASELINE_WAVES_PATH, SELECTED_WAVES_PATH]) {
        if (!fs.existsSync(required)) {
            throw new Error(`Missing required artifact: ${required}. Run optimization stage first.`);
        }
    }

    const options = parseArgs(process.argv.slice(2));
    const optimization = loadJson<SkillRolloutOptimizationRun>(OPTIMIZATION_PATH);
    const baselineWaves = loadJson<SkillRolloutWavePlan>(BASELINE_WAVES_PATH);
    const selectedWaves = loadJson<SkillRolloutWavePlan>(SELECTED_WAVES_PATH);

    const tasks = rolloutPromotionToTasks({
        optimization,
        baselineWavePlan: baselineWaves,
        selectedWavePlan: selectedWaves,
        options: {
            maxSkillTasks: options.maxSkillTasks
        }
    });

    fs.writeFileSync(PROMOTION_TASKS_PATH, `${JSON.stringify(tasks, null, 2)}\n`);
    fs.writeFileSync(PROMOTION_TASKS_MD_PATH, renderMarkdown(optimization, tasks));

    console.log(
        `[promotion-tasks-1000-skills-rollout] promotion=${optimization.promotion.status} ` +
        `tasks=${tasks.length}`
    );
}

main();
