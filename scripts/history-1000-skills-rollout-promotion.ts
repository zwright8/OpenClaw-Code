import fs from 'fs';
import path from 'path';
import {
    evaluateSkillRolloutPromotionPolicyDrift,
    rolloutPromotionPolicyDriftToTasks,
    updateSkillRolloutPromotionPolicyHistory,
    type SkillExecutionTask,
    type SkillRolloutOptimizationRun,
    type SkillRolloutPromotionControlRun,
    type SkillRolloutPromotionPolicyAdjustment,
    type SkillRolloutPromotionPolicyDriftReport,
    type SkillRolloutPromotionPolicyHistory
} from '../skills/runtime/index.js';

type CliOptions = {
    maxEntries?: number;
    sampleSize?: number;
};

const REPO_ROOT = process.cwd();
const GENERATED_ROOT = path.join(REPO_ROOT, 'skills', 'generated');
const STATE_ROOT = path.join(REPO_ROOT, 'skills', 'state');
const OPTIMIZATION_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-optimization.json');
const PROMOTION_CONTROL_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-control.json');
const PROMOTION_ADJUSTMENT_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-policy-adjustment.json');
const POLICY_HISTORY_STATE_PATH = path.join(STATE_ROOT, 'runtime.rollout-promotion-policy-history.state.json');
const POLICY_HISTORY_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-policy-history.json');
const POLICY_HISTORY_MD_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-policy-history.md');
const POLICY_DRIFT_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-policy-drift.json');
const POLICY_DRIFT_MD_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-policy-drift.md');
const POLICY_DRIFT_TASKS_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-drift-tasks.json');
const POLICY_DRIFT_TASKS_MD_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-drift-tasks.md');

function loadJson<T>(filePath: string): T {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function parseArgs(argv: string[]): CliOptions {
    const options: CliOptions = {};

    for (let index = 0; index < argv.length; index += 1) {
        const token = argv[index];
        const next = argv[index + 1];

        if (token === '--max-entries' && next) {
            options.maxEntries = Number(next);
            index += 1;
            continue;
        }
        if (token === '--sample-size' && next) {
            options.sampleSize = Number(next);
            index += 1;
            continue;
        }

        throw new Error(`Unknown or incomplete argument: ${token}`);
    }

    return options;
}

function renderHistoryMarkdown(history: SkillRolloutPromotionPolicyHistory): string {
    const lines: string[] = [];

    lines.push('# Skill Runtime Promotion Policy History');
    lines.push('');
    lines.push(`Generated: ${history.generatedAt}`);
    lines.push(`Entry count: ${history.entryCount}`);
    lines.push('');
    lines.push('| Recorded At | Promotion | Control Posture | Strategy | Failure | Pending | Success | Win Rate | Weighted Score Delta |');
    lines.push('| --- | --- | --- | --- | --- | --- | --- | --- | --- |');

    history.entries
        .slice(-60)
        .forEach((entry) => {
            lines.push(
                `| ${entry.recordedAt} | ${entry.promotionStatus} | ${entry.controlPosture} | ${entry.adjustmentStrategy} | ` +
                `${entry.metrics.failureRate} | ${entry.metrics.approvalPendingRate} | ${entry.metrics.successRate} | ` +
                `${entry.metrics.candidateWinRate} | ${entry.metrics.weightedScoreDelta} |`
            );
        });

    lines.push('');
    return lines.join('\n');
}

function renderDriftMarkdown(drift: SkillRolloutPromotionPolicyDriftReport): string {
    const lines: string[] = [];

    lines.push('# Skill Runtime Promotion Policy Drift');
    lines.push('');
    lines.push(`Generated: ${drift.generatedAt}`);
    lines.push(`Drift level: ${drift.driftLevel}`);
    lines.push(`Sample size: ${drift.sampleSize}`);
    lines.push('');

    lines.push('## Trend Deltas');
    lines.push(`- Failure rate delta: ${drift.trend.failureRateDelta}`);
    lines.push(`- Approval pending rate delta: ${drift.trend.approvalPendingRateDelta}`);
    lines.push(`- Success rate delta: ${drift.trend.successRateDelta}`);
    lines.push(`- minCandidateWinRate delta: ${drift.trend.minCandidateWinRateDelta}`);
    lines.push(`- maxWeightedScoreDelta delta: ${drift.trend.maxWeightedScoreDeltaDelta}`);
    lines.push(`- Candidate win-rate delta: ${drift.trend.candidateWinRateDelta}`);
    lines.push('');

    lines.push('## Reasons');
    drift.reasons.forEach((reason) => lines.push(`- ${reason}`));
    lines.push('');

    lines.push('## Recommended Actions');
    drift.recommendedActions.forEach((action) => lines.push(`- ${action}`));
    lines.push('');

    return lines.join('\n');
}

function renderDriftTasksMarkdown(tasks: SkillExecutionTask[]): string {
    const lines: string[] = [];

    lines.push('# Skill Runtime Promotion Drift Tasks');
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
    for (const requiredPath of [OPTIMIZATION_PATH, PROMOTION_CONTROL_PATH, PROMOTION_ADJUSTMENT_PATH]) {
        if (!fs.existsSync(requiredPath)) {
            throw new Error(`Missing required promotion-control artifact: ${requiredPath}`);
        }
    }

    const options = parseArgs(process.argv.slice(2));
    const optimization = loadJson<SkillRolloutOptimizationRun>(OPTIMIZATION_PATH);
    const controlRun = loadJson<SkillRolloutPromotionControlRun>(PROMOTION_CONTROL_PATH);
    const adjustment = loadJson<SkillRolloutPromotionPolicyAdjustment>(PROMOTION_ADJUSTMENT_PATH);
    const priorHistory = fs.existsSync(POLICY_HISTORY_STATE_PATH)
        ? loadJson<SkillRolloutPromotionPolicyHistory>(POLICY_HISTORY_STATE_PATH)
        : fs.existsSync(POLICY_HISTORY_PATH)
            ? loadJson<SkillRolloutPromotionPolicyHistory>(POLICY_HISTORY_PATH)
            : undefined;

    const history = updateSkillRolloutPromotionPolicyHistory({
        history: priorHistory,
        optimization,
        controlRun,
        adjustment,
        options: {
            maxEntries: options.maxEntries
        }
    });

    const drift = evaluateSkillRolloutPromotionPolicyDrift(history, options.sampleSize);
    const driftTasks = rolloutPromotionPolicyDriftToTasks(drift);

    fs.mkdirSync(STATE_ROOT, { recursive: true });
    fs.writeFileSync(POLICY_HISTORY_STATE_PATH, `${JSON.stringify(history, null, 2)}\n`);
    fs.writeFileSync(POLICY_HISTORY_PATH, `${JSON.stringify(history, null, 2)}\n`);
    fs.writeFileSync(POLICY_HISTORY_MD_PATH, renderHistoryMarkdown(history));
    fs.writeFileSync(POLICY_DRIFT_PATH, `${JSON.stringify(drift, null, 2)}\n`);
    fs.writeFileSync(POLICY_DRIFT_MD_PATH, renderDriftMarkdown(drift));
    fs.writeFileSync(POLICY_DRIFT_TASKS_PATH, `${JSON.stringify(driftTasks, null, 2)}\n`);
    fs.writeFileSync(POLICY_DRIFT_TASKS_MD_PATH, renderDriftTasksMarkdown(driftTasks));

    console.log(
        `[history-1000-skills-rollout-promotion] entries=${history.entryCount} ` +
        `drift=${drift.driftLevel} sampleSize=${drift.sampleSize} tasks=${driftTasks.length}`
    );
}

main();
