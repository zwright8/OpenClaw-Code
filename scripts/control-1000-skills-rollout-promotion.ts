import fs from 'fs';
import path from 'path';
import {
    recommendSkillRolloutPromotionPolicyAdjustment,
    rolloutPromotionPolicyAdjustmentToTasks,
    runSkillRolloutPromotionControlLoop,
    type SkillExecutionTask,
    type SkillRolloutOptimizationRun,
    type SkillRolloutPromotionControlRun,
    type SkillRolloutPromotionPolicyAdjustment
} from '../skills/runtime/index.js';

type CliOptions = {
    failBias?: number;
    approvalBias?: number;
    maxAdjustmentTasks?: number;
};

const REPO_ROOT = process.cwd();
const GENERATED_ROOT = path.join(REPO_ROOT, 'skills', 'generated');
const OPTIMIZATION_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-optimization.json');
const PROMOTION_TASKS_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-tasks.json');
const PROMOTION_CONTROL_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-control.json');
const PROMOTION_CONTROL_MD_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-control.md');
const PROMOTION_POLICY_ADJUSTMENT_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-policy-adjustment.json');
const PROMOTION_POLICY_ADJUSTMENT_MD_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-policy-adjustment.md');
const PROMOTION_ADJUSTMENT_TASKS_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-adjustment-tasks.json');
const PROMOTION_ADJUSTMENT_TASKS_MD_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-adjustment-tasks.md');

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
        if (token === '--max-adjustment-tasks' && next) {
            options.maxAdjustmentTasks = Number(next);
            index += 1;
            continue;
        }

        throw new Error(`Unknown or incomplete argument: ${token}`);
    }

    return options;
}

function renderControlMarkdown(run: SkillRolloutPromotionControlRun): string {
    const lines: string[] = [];

    lines.push('# Skill Runtime Rollout Promotion Control');
    lines.push('');
    lines.push(`Generated: ${run.generatedAt}`);
    lines.push(`Source promotion decision: ${run.sourcePromotionGeneratedAt}`);
    lines.push('');
    lines.push('## Summary');
    lines.push(`- Total tasks: ${run.summary.totalTasks}`);
    lines.push(`- Success: ${run.summary.successCount}`);
    lines.push(`- Failed: ${run.summary.failedCount}`);
    lines.push(`- Approval pending: ${run.summary.approvalPendingCount}`);
    lines.push(`- Skipped: ${run.summary.skippedCount}`);
    lines.push(`- Overall posture: ${run.summary.overallPosture}`);
    lines.push('');
    lines.push('## Category Breakdown');
    lines.push('| Category | Tasks | Failed | Approval Pending |');
    lines.push('| --- | --- | --- | --- |');

    Object.keys(run.summary.categoryCounts)
        .sort()
        .forEach((category) => {
            const key = category as keyof typeof run.summary.categoryCounts;
            lines.push(
                `| ${category} | ${run.summary.categoryCounts[key]} | ` +
                `${run.summary.categoryFailureCounts[key]} | ${run.summary.categoryPendingCounts[key]} |`
            );
        });

    lines.push('');
    lines.push('## Failed Tasks');
    lines.push('| Task ID | Category | Priority | Reason |');
    lines.push('| --- | --- | --- | --- |');

    run.taskResults
        .filter((result) => result.status === 'failed')
        .slice(0, 120)
        .forEach((result) => {
            lines.push(`| \`${result.taskId}\` | ${result.category} | ${result.priority} | ${result.reason} |`);
        });

    lines.push('');
    return lines.join('\n');
}

function renderAdjustmentMarkdown(adjustment: SkillRolloutPromotionPolicyAdjustment): string {
    const lines: string[] = [];

    lines.push('# Skill Runtime Promotion Policy Adjustment');
    lines.push('');
    lines.push(`Generated: ${adjustment.generatedAt}`);
    lines.push(`Strategy: ${adjustment.strategy}`);
    lines.push(`Confidence: ${adjustment.confidence}`);
    lines.push('');

    lines.push('## Policy Delta');
    lines.push('| Metric | Current | Recommended |');
    lines.push('| --- | --- | --- |');
    lines.push(`| minCandidateWinRate | ${adjustment.currentPolicy.minCandidateWinRate} | ${adjustment.recommendedPolicy.minCandidateWinRate} |`);
    lines.push(`| maxWeightedScoreDelta | ${adjustment.currentPolicy.maxWeightedScoreDelta} | ${adjustment.recommendedPolicy.maxWeightedScoreDelta} |`);
    lines.push(`| maxWorstScoreDelta | ${adjustment.currentPolicy.maxWorstScoreDelta} | ${adjustment.recommendedPolicy.maxWorstScoreDelta} |`);
    lines.push(`| maxAvgFailureRateDelta | ${adjustment.currentPolicy.maxAvgFailureRateDelta} | ${adjustment.recommendedPolicy.maxAvgFailureRateDelta} |`);
    lines.push(`| maxAvgCriticalWaveDelta | ${adjustment.currentPolicy.maxAvgCriticalWaveDelta} | ${adjustment.recommendedPolicy.maxAvgCriticalWaveDelta} |`);
    lines.push('');

    lines.push('## Observed Metrics');
    lines.push(`- Failure rate: ${adjustment.observedMetrics.failureRate}`);
    lines.push(`- Approval pending rate: ${adjustment.observedMetrics.approvalPendingRate}`);
    lines.push(`- Success rate: ${adjustment.observedMetrics.successRate}`);
    lines.push(`- Verification failure rate: ${adjustment.observedMetrics.verificationFailureRate}`);
    lines.push(`- Shadow validation failure rate: ${adjustment.observedMetrics.shadowFailureRate}`);
    lines.push('');

    lines.push('## Reasons');
    adjustment.reasons.forEach((reason) => lines.push(`- ${reason}`));
    lines.push('');

    return lines.join('\n');
}

function renderAdjustmentTasksMarkdown(tasks: SkillExecutionTask[]): string {
    const lines: string[] = [];

    lines.push('# Skill Runtime Promotion Adjustment Tasks');
    lines.push('');
    lines.push(`Generated: ${new Date().toISOString()}`);
    lines.push(`Task count: ${tasks.length}`);
    lines.push('');

    lines.push('| ID | To | Priority | Task |');
    lines.push('| --- | --- | --- | --- |');
    tasks.slice(0, 180).forEach((task) => {
        lines.push(`| \`${task.id}\` | ${task.to} | ${task.priority} | ${task.task} |`);
    });
    lines.push('');

    return lines.join('\n');
}

function main() {
    for (const requiredPath of [OPTIMIZATION_PATH, PROMOTION_TASKS_PATH]) {
        if (!fs.existsSync(requiredPath)) {
            throw new Error(`Missing required promotion artifact: ${requiredPath}. Run promotion stage first.`);
        }
    }

    const options = parseArgs(process.argv.slice(2));
    const optimization = loadJson<SkillRolloutOptimizationRun>(OPTIMIZATION_PATH);
    const promotionTasks = loadJson<SkillExecutionTask[]>(PROMOTION_TASKS_PATH);

    const controlRun = runSkillRolloutPromotionControlLoop(optimization, promotionTasks, {
        failBias: options.failBias,
        approvalBias: options.approvalBias
    });

    const adjustment = recommendSkillRolloutPromotionPolicyAdjustment(optimization, controlRun);
    const adjustmentTasks = rolloutPromotionPolicyAdjustmentToTasks(adjustment, controlRun, {
        maxTasks: options.maxAdjustmentTasks
    });

    fs.writeFileSync(PROMOTION_CONTROL_PATH, `${JSON.stringify(controlRun, null, 2)}\n`);
    fs.writeFileSync(PROMOTION_CONTROL_MD_PATH, renderControlMarkdown(controlRun));
    fs.writeFileSync(PROMOTION_POLICY_ADJUSTMENT_PATH, `${JSON.stringify(adjustment, null, 2)}\n`);
    fs.writeFileSync(PROMOTION_POLICY_ADJUSTMENT_MD_PATH, renderAdjustmentMarkdown(adjustment));
    fs.writeFileSync(PROMOTION_ADJUSTMENT_TASKS_PATH, `${JSON.stringify(adjustmentTasks, null, 2)}\n`);
    fs.writeFileSync(PROMOTION_ADJUSTMENT_TASKS_MD_PATH, renderAdjustmentTasksMarkdown(adjustmentTasks));

    console.log(
        `[control-1000-skills-rollout-promotion] posture=${controlRun.summary.overallPosture} ` +
        `strategy=${adjustment.strategy} confidence=${adjustment.confidence} tasks=${adjustmentTasks.length}`
    );
}

main();
