import fs from 'fs';
import path from 'path';
import {
    promotionPolicyLabToTasks,
    runSkillRolloutPromotionPolicyLab,
    type SkillExecutionTask,
    type SkillRolloutPromotionPolicyAdjustment,
    type SkillRolloutPromotionPolicyDriftReport,
    type SkillRolloutPromotionPolicyHistory,
    type SkillRolloutPromotionPolicyLabRun
} from '../skills/runtime/index.js';

type CliOptions = {
    sampleSize?: number;
    maxAlternatives?: number;
};

const REPO_ROOT = process.cwd();
const GENERATED_ROOT = path.join(REPO_ROOT, 'skills', 'generated');
const POLICY_HISTORY_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-policy-history.json');
const POLICY_DRIFT_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-policy-drift.json');
const POLICY_ADJUSTMENT_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-policy-adjustment.json');
const POLICY_LAB_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-policy-lab.json');
const POLICY_LAB_MD_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-policy-lab.md');
const POLICY_LAB_TASKS_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-policy-lab-tasks.json');
const POLICY_LAB_TASKS_MD_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-policy-lab-tasks.md');

function loadJson<T>(filePath: string): T {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function parseArgs(argv: string[]): CliOptions {
    const options: CliOptions = {};

    for (let index = 0; index < argv.length; index += 1) {
        const token = argv[index];
        const next = argv[index + 1];

        if (token === '--sample-size' && next) {
            options.sampleSize = Number(next);
            index += 1;
            continue;
        }
        if (token === '--max-alternatives' && next) {
            options.maxAlternatives = Number(next);
            index += 1;
            continue;
        }

        throw new Error(`Unknown or incomplete argument: ${token}`);
    }

    return options;
}

function renderLabMarkdown(labRun: SkillRolloutPromotionPolicyLabRun): string {
    const lines: string[] = [];

    lines.push('# Skill Runtime Promotion Policy Lab');
    lines.push('');
    lines.push(`Generated: ${labRun.generatedAt}`);
    lines.push(`Drift level: ${labRun.driftLevel}`);
    lines.push(`Sample size: ${labRun.sampleSize}`);
    lines.push(`Baseline score: ${labRun.baselineScore}`);
    lines.push(`Recommended score: ${labRun.recommendedScore}`);
    lines.push(`Score delta: ${labRun.scoreDelta}`);
    lines.push('');

    lines.push('## Policy Decision');
    lines.push(`- Baseline policy: winRate>=${labRun.baselinePolicy.minCandidateWinRate}, maxWeighted=${labRun.baselinePolicy.maxWeightedScoreDelta}, maxWorst=${labRun.baselinePolicy.maxWorstScoreDelta}`);
    lines.push(`- Recommended policy: winRate>=${labRun.recommendedPolicy.minCandidateWinRate}, maxWeighted=${labRun.recommendedPolicy.maxWeightedScoreDelta}, maxWorst=${labRun.recommendedPolicy.maxWorstScoreDelta}`);
    lines.push('');

    lines.push('## Variants');
    lines.push('| Rank | Variant | Score | Failure | Pending | Success | Win Rate | Rejection |');
    lines.push('| --- | --- | --- | --- | --- | --- | --- | --- |');
    labRun.variants.forEach((variant, index) => {
        lines.push(
            `| ${index + 1} | ${variant.name} | ${variant.score} | ${variant.projectedFailureRate} | ` +
            `${variant.projectedApprovalPendingRate} | ${variant.projectedSuccessRate} | ` +
            `${variant.projectedCandidateWinRate} | ${variant.projectedRejectionRate} |`
        );
    });
    lines.push('');

    lines.push('## Assumptions');
    labRun.assumptions.forEach((assumption) => lines.push(`- ${assumption}`));
    lines.push('');

    lines.push('## Top Variant Rationale');
    labRun.variants[0].rationale.forEach((line) => lines.push(`- ${line}`));
    lines.push('');

    return lines.join('\n');
}

function renderTasksMarkdown(tasks: SkillExecutionTask[]): string {
    const lines: string[] = [];

    lines.push('# Skill Runtime Promotion Policy Lab Tasks');
    lines.push('');
    lines.push(`Generated: ${new Date().toISOString()}`);
    lines.push(`Task count: ${tasks.length}`);
    lines.push('');

    lines.push('| ID | To | Priority | Task |');
    lines.push('| --- | --- | --- | --- |');
    tasks.forEach((task) => {
        lines.push(`| \`${task.id}\` | ${task.to} | ${task.priority} | ${task.task} |`);
    });
    lines.push('');

    return lines.join('\n');
}

function main() {
    for (const requiredPath of [POLICY_HISTORY_PATH, POLICY_DRIFT_PATH, POLICY_ADJUSTMENT_PATH]) {
        if (!fs.existsSync(requiredPath)) {
            throw new Error(`Missing required promotion-policy input artifact: ${requiredPath}`);
        }
    }

    const options = parseArgs(process.argv.slice(2));
    const history = loadJson<SkillRolloutPromotionPolicyHistory>(POLICY_HISTORY_PATH);
    const drift = loadJson<SkillRolloutPromotionPolicyDriftReport>(POLICY_DRIFT_PATH);
    const adjustment = loadJson<SkillRolloutPromotionPolicyAdjustment>(POLICY_ADJUSTMENT_PATH);

    const labRun = runSkillRolloutPromotionPolicyLab({
        history,
        drift,
        adjustment,
        options: {
            sampleSize: options.sampleSize
        }
    });

    const tasks = promotionPolicyLabToTasks(labRun, {
        maxAlternatives: options.maxAlternatives
    });

    fs.writeFileSync(POLICY_LAB_PATH, `${JSON.stringify(labRun, null, 2)}\n`);
    fs.writeFileSync(POLICY_LAB_MD_PATH, renderLabMarkdown(labRun));
    fs.writeFileSync(POLICY_LAB_TASKS_PATH, `${JSON.stringify(tasks, null, 2)}\n`);
    fs.writeFileSync(POLICY_LAB_TASKS_MD_PATH, renderTasksMarkdown(tasks));

    console.log(
        `[policy-lab-1000-skills-rollout-promotion] drift=${labRun.driftLevel} ` +
        `variants=${labRun.variants.length} scoreDelta=${labRun.scoreDelta} tasks=${tasks.length}`
    );
}

main();
