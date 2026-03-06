import fs from 'fs';
import path from 'path';
import {
    promotionPolicyCanaryToTasks,
    runSkillRolloutPromotionPolicyCanary,
    type SkillExecutionTask,
    type SkillRolloutPromotionPolicyCanaryRun,
    type SkillRolloutPromotionPolicyDriftReport,
    type SkillRolloutPromotionPolicyHistory,
    type SkillRolloutPromotionPolicyLabRun
} from '../skills/runtime/index.js';

type CliOptions = {
    sampleSize?: number;
    maxScenarioTasks?: number;
};

const REPO_ROOT = process.cwd();
const GENERATED_ROOT = path.join(REPO_ROOT, 'skills', 'generated');
const POLICY_HISTORY_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-policy-history.json');
const POLICY_DRIFT_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-policy-drift.json');
const POLICY_LAB_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-policy-lab.json');
const POLICY_CANARY_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-policy-canary.json');
const POLICY_CANARY_MD_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-policy-canary.md');
const POLICY_CANARY_TASKS_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-policy-canary-tasks.json');
const POLICY_CANARY_TASKS_MD_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-policy-canary-tasks.md');

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
        if (token === '--max-scenario-tasks' && next) {
            options.maxScenarioTasks = Number(next);
            index += 1;
            continue;
        }

        throw new Error(`Unknown or incomplete argument: ${token}`);
    }
    return options;
}

function renderCanaryMarkdown(canary: SkillRolloutPromotionPolicyCanaryRun): string {
    const lines: string[] = [];

    lines.push('# Skill Runtime Promotion Policy Canary');
    lines.push('');
    lines.push(`Generated: ${canary.generatedAt}`);
    lines.push(`Decision: ${canary.decision}`);
    lines.push(`Confidence: ${canary.confidence}`);
    lines.push(`Drift level: ${canary.driftLevel}`);
    lines.push(`Sample size: ${canary.sampleSize}`);
    lines.push(`Scenario count: ${canary.scenarioCount}`);
    lines.push(`Score delta: ${canary.scoreDelta}`);
    lines.push('');

    lines.push('## Weighted Deltas');
    lines.push(`- Failure delta: ${canary.weightedFailureDelta}`);
    lines.push(`- Approval pending delta: ${canary.weightedApprovalPendingDelta}`);
    lines.push(`- Success delta: ${canary.weightedSuccessDelta}`);
    lines.push(`- Candidate win-rate delta: ${canary.weightedCandidateWinDelta}`);
    lines.push('');

    if (canary.guardrailBreaches.length > 0) {
        lines.push('## Guardrail Breaches');
        canary.guardrailBreaches.forEach((breach) => lines.push(`- ${breach}`));
        lines.push('');
    }

    lines.push('## Decision Reasons');
    canary.reasons.forEach((reason) => lines.push(`- ${reason}`));
    lines.push('');

    lines.push('## Scenario Matrix');
    lines.push('| Scenario | Weight | Score Delta | Breaches | Baseline Failure | Candidate Failure | Baseline Pending | Candidate Pending |');
    lines.push('| --- | --- | --- | --- | --- | --- | --- | --- |');
    canary.scenarios.forEach((scenario) => {
        const breaches = scenario.guardrailBreaches.length > 0 ? scenario.guardrailBreaches.join(', ') : 'none';
        lines.push(
            `| ${scenario.name} | ${scenario.weight} | ${scenario.scoreDelta} | ${breaches} | ` +
            `${scenario.baseline.failureRate} | ${scenario.candidate.failureRate} | ` +
            `${scenario.baseline.approvalPendingRate} | ${scenario.candidate.approvalPendingRate} |`
        );
    });
    lines.push('');

    return lines.join('\n');
}

function renderCanaryTasksMarkdown(tasks: SkillExecutionTask[]): string {
    const lines: string[] = [];

    lines.push('# Skill Runtime Promotion Policy Canary Tasks');
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
    for (const requiredPath of [POLICY_HISTORY_PATH, POLICY_DRIFT_PATH, POLICY_LAB_PATH]) {
        if (!fs.existsSync(requiredPath)) {
            throw new Error(`Missing required promotion policy canary input: ${requiredPath}`);
        }
    }

    const options = parseArgs(process.argv.slice(2));
    const history = loadJson<SkillRolloutPromotionPolicyHistory>(POLICY_HISTORY_PATH);
    const drift = loadJson<SkillRolloutPromotionPolicyDriftReport>(POLICY_DRIFT_PATH);
    const labRun = loadJson<SkillRolloutPromotionPolicyLabRun>(POLICY_LAB_PATH);

    const canary = runSkillRolloutPromotionPolicyCanary({
        history,
        drift,
        labRun,
        options: {
            sampleSize: options.sampleSize
        }
    });

    const canaryTasks = promotionPolicyCanaryToTasks(canary, {
        maxScenarioTasks: options.maxScenarioTasks
    });

    fs.writeFileSync(POLICY_CANARY_PATH, `${JSON.stringify(canary, null, 2)}\n`);
    fs.writeFileSync(POLICY_CANARY_MD_PATH, renderCanaryMarkdown(canary));
    fs.writeFileSync(POLICY_CANARY_TASKS_PATH, `${JSON.stringify(canaryTasks, null, 2)}\n`);
    fs.writeFileSync(POLICY_CANARY_TASKS_MD_PATH, renderCanaryTasksMarkdown(canaryTasks));

    console.log(
        `[canary-1000-skills-rollout-promotion] decision=${canary.decision} ` +
        `scoreDelta=${canary.scoreDelta} scenarios=${canary.scenarioCount} tasks=${canaryTasks.length}`
    );
}

main();
