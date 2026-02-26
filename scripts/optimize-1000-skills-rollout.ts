import fs from 'fs';
import path from 'path';
import {
    buildRolloutOptimizationRun,
    buildRolloutPromotionPolicy,
    buildSkillRolloutWavePlan,
    decideRolloutPromotion,
    defaultRolloutPromotionScenarios,
    recommendRolloutWaveConfig,
    scoreRolloutControlForOptimization,
    rolloutControlToFollowUpTasks,
    rolloutWavePlanToTasks,
    runSkillRolloutControlLoop,
    type SkillExecutionTask,
    type SkillRolloutControlRun,
    type SkillRolloutOptimizationCandidate,
    type SkillRolloutOptimizationRun,
    type SkillRolloutPlan,
    type SkillRolloutPromotionRobustness,
    type SkillRolloutPromotionRobustnessScenario,
    type SkillRolloutWavePlan
} from '../skills/runtime/index.js';

type CliOptions = {
    failBias?: number;
    approvalBias?: number;
    maxFollowUps?: number;
    forcePromote?: boolean;
};

type RolloutConfig = {
    nowWaveCapacity: number;
    nextWaveCapacity: number;
    maxPerDomainPerWave: number;
};

type CandidateEvaluation = SkillRolloutOptimizationCandidate & {
    wavePlan: SkillRolloutWavePlan;
    waveTasks: SkillExecutionTask[];
    controlRun: SkillRolloutControlRun;
};

const REPO_ROOT = process.cwd();
const GENERATED_ROOT = path.join(REPO_ROOT, 'skills', 'generated');
const SOURCE_PLAN_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-plan.json');
const BASELINE_WAVE_PLAN_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-waves.json');
const BASELINE_CONTROL_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-control.json');
const OPTIMIZATION_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-optimization.json');
const OPTIMIZATION_MD_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-optimization.md');
const PROMOTION_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion.json');
const PROMOTION_MD_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion.md');
const SELECTED_WAVE_PLAN_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-selected-waves.json');
const SELECTED_WAVE_TASKS_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-selected-wave-tasks.json');
const SELECTED_CONTROL_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-selected-control.json');
const OPTIMIZED_WAVE_PLAN_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-optimized-waves.json');
const OPTIMIZED_WAVE_TASKS_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-optimized-wave-tasks.json');
const OPTIMIZED_CONTROL_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-optimized-control.json');
const OPTIMIZED_CONTROL_TASKS_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-optimized-control-tasks.json');

function loadJson<T>(filePath: string): T {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function roundMetric(value: number): number {
    return Number(value.toFixed(4));
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
        if (token === '--force-promote') {
            options.forcePromote = true;
            continue;
        }
        throw new Error(`Unknown or incomplete argument: ${token}`);
    }
    return options;
}

function normalizeConfig(config: RolloutConfig): RolloutConfig {
    return {
        nowWaveCapacity: Math.max(8, Math.floor(Number(config.nowWaveCapacity))),
        nextWaveCapacity: Math.max(8, Math.floor(Number(config.nextWaveCapacity))),
        maxPerDomainPerWave: Math.max(1, Math.floor(Number(config.maxPerDomainPerWave)))
    };
}

function uniqueConfigs(configs: RolloutConfig[]): RolloutConfig[] {
    const seen = new Set<string>();
    const unique: RolloutConfig[] = [];

    for (const config of configs) {
        const normalized = normalizeConfig(config);
        const key = `${normalized.nowWaveCapacity}:${normalized.nextWaveCapacity}:${normalized.maxPerDomainPerWave}`;
        if (seen.has(key)) continue;
        seen.add(key);
        unique.push(normalized);
    }

    return unique;
}

function buildCandidateConfigs(args: {
    current: RolloutConfig;
    recommended: RolloutConfig;
}): RolloutConfig[] {
    const { current, recommended } = args;
    const candidates = [
        current,
        recommended,
        { ...current, nowWaveCapacity: current.nowWaveCapacity - 4 },
        { ...current, nextWaveCapacity: current.nextWaveCapacity - 8 },
        { ...current, maxPerDomainPerWave: current.maxPerDomainPerWave - 1 },
        { ...current, nowWaveCapacity: current.nowWaveCapacity + 2 },
        { ...current, nextWaveCapacity: current.nextWaveCapacity + 4 },
        { ...current, maxPerDomainPerWave: current.maxPerDomainPerWave + 1 },
        { ...recommended, nowWaveCapacity: recommended.nowWaveCapacity - 2 },
        { ...recommended, nextWaveCapacity: recommended.nextWaveCapacity - 2 },
        { ...recommended, nowWaveCapacity: recommended.nowWaveCapacity - 2, nextWaveCapacity: recommended.nextWaveCapacity - 2 },
        { ...recommended, maxPerDomainPerWave: recommended.maxPerDomainPerWave - 1 },
        { ...recommended, maxPerDomainPerWave: recommended.maxPerDomainPerWave + 1 },
        { ...recommended, nowWaveCapacity: recommended.nowWaveCapacity + 2 },
        { ...recommended, nextWaveCapacity: recommended.nextWaveCapacity + 2 },
        { ...recommended, nowWaveCapacity: recommended.nowWaveCapacity + 2, maxPerDomainPerWave: recommended.maxPerDomainPerWave + 1 },
        { ...recommended, nextWaveCapacity: recommended.nextWaveCapacity + 2, maxPerDomainPerWave: recommended.maxPerDomainPerWave + 1 }
    ];

    return uniqueConfigs(candidates);
}

function normalizeRobustnessWeights(scenarios: SkillRolloutPromotionRobustnessScenario[]): SkillRolloutPromotionRobustnessScenario[] {
    const totalWeight = scenarios.reduce((sum, scenario) => sum + Math.max(0.001, scenario.weight), 0);
    if (totalWeight <= 0) return scenarios;

    return scenarios.map((scenario) => ({
        ...scenario,
        weight: roundMetric(Math.max(0.001, scenario.weight) / totalWeight)
    }));
}

function evaluatePromotionRobustness(args: {
    baselineWavePlan: SkillRolloutWavePlan;
    baselineWaveTasks: SkillExecutionTask[];
    candidateWavePlan: SkillRolloutWavePlan;
    candidateWaveTasks: SkillExecutionTask[];
}): SkillRolloutPromotionRobustness {
    const scenarioInputs = defaultRolloutPromotionScenarios();
    const scenarioResults: SkillRolloutPromotionRobustnessScenario[] = [];

    let totalTrials = 0;
    let totalWins = 0;
    let totalTies = 0;
    let weightedScoreDelta = 0;
    let weightedFailureRateDelta = 0;
    let weightedPendingRateDelta = 0;
    let weightedCriticalWaveDelta = 0;
    let worstScoreDelta = Number.NEGATIVE_INFINITY;

    for (const scenario of scenarioInputs) {
        let candidateWins = 0;
        let baselineWins = 0;
        let ties = 0;
        let scoreDeltaSum = 0;
        let failureRateDeltaSum = 0;
        let pendingRateDeltaSum = 0;
        let criticalWaveDeltaSum = 0;
        let scenarioWorstScoreDelta = Number.NEGATIVE_INFINITY;

        for (let trial = 0; trial < scenario.trials; trial += 1) {
            const baselineRun = runSkillRolloutControlLoop(args.baselineWavePlan, args.baselineWaveTasks, {
                failBias: scenario.failBias,
                approvalBias: scenario.approvalBias,
                seed: `openclaw-rollout-promotion-baseline-${scenario.name}-${trial + 1}`
            });
            const candidateRun = runSkillRolloutControlLoop(args.candidateWavePlan, args.candidateWaveTasks, {
                failBias: scenario.failBias,
                approvalBias: scenario.approvalBias,
                seed: `openclaw-rollout-promotion-candidate-${scenario.name}-${trial + 1}`
            });

            const baselineScore = scoreRolloutControlForOptimization(baselineRun);
            const candidateScore = scoreRolloutControlForOptimization(candidateRun);
            const scoreDelta = roundMetric(candidateScore - baselineScore);
            const baselineFailureRate = baselineRun.summary.totalTasks === 0
                ? 0
                : baselineRun.summary.failedCount / baselineRun.summary.totalTasks;
            const candidateFailureRate = candidateRun.summary.totalTasks === 0
                ? 0
                : candidateRun.summary.failedCount / candidateRun.summary.totalTasks;
            const baselinePendingRate = baselineRun.summary.totalTasks === 0
                ? 0
                : baselineRun.summary.approvalPendingCount / baselineRun.summary.totalTasks;
            const candidatePendingRate = candidateRun.summary.totalTasks === 0
                ? 0
                : candidateRun.summary.approvalPendingCount / candidateRun.summary.totalTasks;
            const criticalWaveDelta = candidateRun.summary.wavePostureCounts.critical - baselineRun.summary.wavePostureCounts.critical;

            if (scoreDelta < 0) candidateWins += 1;
            else if (scoreDelta > 0) baselineWins += 1;
            else ties += 1;

            scoreDeltaSum += scoreDelta;
            failureRateDeltaSum += (candidateFailureRate - baselineFailureRate);
            pendingRateDeltaSum += (candidatePendingRate - baselinePendingRate);
            criticalWaveDeltaSum += criticalWaveDelta;
            scenarioWorstScoreDelta = Math.max(scenarioWorstScoreDelta, scoreDelta);
        }

        const avgScoreDelta = roundMetric(scoreDeltaSum / scenario.trials);
        const avgFailureRateDelta = roundMetric(failureRateDeltaSum / scenario.trials);
        const avgApprovalPendingRateDelta = roundMetric(pendingRateDeltaSum / scenario.trials);
        const avgCriticalWaveDelta = roundMetric(criticalWaveDeltaSum / scenario.trials);

        const scenarioResult: SkillRolloutPromotionRobustnessScenario = {
            name: scenario.name,
            failBias: scenario.failBias,
            approvalBias: scenario.approvalBias,
            trials: scenario.trials,
            weight: scenario.weight,
            candidateWins,
            baselineWins,
            ties,
            avgScoreDelta,
            worstScoreDelta: roundMetric(scenarioWorstScoreDelta),
            avgFailureRateDelta,
            avgApprovalPendingRateDelta,
            avgCriticalWaveDelta
        };

        scenarioResults.push(scenarioResult);
        totalTrials += scenario.trials;
        totalWins += candidateWins;
        totalTies += ties;
        weightedScoreDelta += avgScoreDelta * scenario.weight;
        weightedFailureRateDelta += avgFailureRateDelta * scenario.weight;
        weightedPendingRateDelta += avgApprovalPendingRateDelta * scenario.weight;
        weightedCriticalWaveDelta += avgCriticalWaveDelta * scenario.weight;
        worstScoreDelta = Math.max(worstScoreDelta, scenarioWorstScoreDelta);
    }

    const normalizedScenarios = normalizeRobustnessWeights(scenarioResults);

    return {
        evaluatedTrials: totalTrials,
        scenarioCount: normalizedScenarios.length,
        candidateWinRate: roundMetric((totalWins + totalTies * 0.5) / Math.max(1, totalTrials)),
        weightedScoreDelta: roundMetric(weightedScoreDelta),
        worstScoreDelta: roundMetric(worstScoreDelta),
        avgFailureRateDelta: roundMetric(weightedFailureRateDelta),
        avgApprovalPendingRateDelta: roundMetric(weightedPendingRateDelta),
        avgCriticalWaveDelta: roundMetric(weightedCriticalWaveDelta),
        scenarios: normalizedScenarios
    };
}

function escapeCell(value: string): string {
    return value.replace(/\|/g, '\\|');
}

function renderPromotionMarkdown(run: SkillRolloutOptimizationRun): string {
    const lines: string[] = [];

    lines.push('# Skill Runtime Rollout Promotion Decision');
    lines.push('');
    lines.push(`Generated: ${run.promotion.generatedAt}`);
    lines.push(`Status: ${run.promotion.status}`);
    lines.push(`Strategy: ${run.recommendation.strategy}`);
    lines.push(`Selected config: ${run.promotion.selectedConfig.nowWaveCapacity}/${run.promotion.selectedConfig.nextWaveCapacity}/${run.promotion.selectedConfig.maxPerDomainPerWave}`);
    lines.push(`Effective config: ${run.promotion.effectiveConfig.nowWaveCapacity}/${run.promotion.effectiveConfig.nextWaveCapacity}/${run.promotion.effectiveConfig.maxPerDomainPerWave}`);
    lines.push('');
    lines.push('## Policy');
    lines.push(`- minCandidateWinRate: ${run.promotion.policy.minCandidateWinRate}`);
    lines.push(`- maxWeightedScoreDelta: ${run.promotion.policy.maxWeightedScoreDelta}`);
    lines.push(`- maxWorstScoreDelta: ${run.promotion.policy.maxWorstScoreDelta}`);
    lines.push(`- maxAvgFailureRateDelta: ${run.promotion.policy.maxAvgFailureRateDelta}`);
    lines.push(`- maxAvgCriticalWaveDelta: ${run.promotion.policy.maxAvgCriticalWaveDelta}`);
    lines.push('');
    lines.push('## Robustness Aggregate');
    lines.push(`- Trials: ${run.promotion.robustness.evaluatedTrials}`);
    lines.push(`- Candidate win rate: ${run.promotion.robustness.candidateWinRate}`);
    lines.push(`- Weighted score delta: ${run.promotion.robustness.weightedScoreDelta}`);
    lines.push(`- Worst score delta: ${run.promotion.robustness.worstScoreDelta}`);
    lines.push(`- Avg failure-rate delta: ${run.promotion.robustness.avgFailureRateDelta}`);
    lines.push(`- Avg approval-pending delta: ${run.promotion.robustness.avgApprovalPendingRateDelta}`);
    lines.push(`- Avg critical-wave delta: ${run.promotion.robustness.avgCriticalWaveDelta}`);
    lines.push('');

    if (run.promotion.violations.length > 0) {
        lines.push('## Violations');
        run.promotion.violations.forEach((violation) => lines.push(`- ${violation}`));
        lines.push('');
    }

    lines.push('## Rationale');
    run.promotion.rationale.forEach((item) => lines.push(`- ${item}`));
    lines.push('');

    return lines.join('\n');
}

function renderMarkdown(run: SkillRolloutOptimizationRun): string {
    const lines: string[] = [];
    lines.push('# Skill Runtime Rollout Optimization');
    lines.push('');
    lines.push(`Generated: ${run.generatedAt}`);
    lines.push('');
    lines.push('## Recommendation');
    lines.push(`- Strategy: ${run.recommendation.strategy}`);
    lines.push(`- Current config: now=${run.recommendation.currentConfig.nowWaveCapacity}, next=${run.recommendation.currentConfig.nextWaveCapacity}, maxDomain=${run.recommendation.currentConfig.maxPerDomainPerWave}`);
    lines.push(`- Recommended config: now=${run.recommendation.recommendedConfig.nowWaveCapacity}, next=${run.recommendation.recommendedConfig.nextWaveCapacity}, maxDomain=${run.recommendation.recommendedConfig.maxPerDomainPerWave}`);
    lines.push(`- Selected config: now=${run.search.selectedConfig.nowWaveCapacity}, next=${run.search.selectedConfig.nextWaveCapacity}, maxDomain=${run.search.selectedConfig.maxPerDomainPerWave}`);
    lines.push(`- Effective config: now=${run.promotion.effectiveConfig.nowWaveCapacity}, next=${run.promotion.effectiveConfig.nextWaveCapacity}, maxDomain=${run.promotion.effectiveConfig.maxPerDomainPerWave}`);
    lines.push(`- Promotion status: ${run.promotion.status}`);
    lines.push(`- Reasons: ${run.recommendation.reasons.join('; ')}`);
    lines.push('');
    lines.push('## Baseline vs Candidate');
    lines.push('| Metric | Baseline | Candidate | Delta |');
    lines.push('| --- | --- | --- | --- |');
    lines.push(`| Wave count | ${run.baseline.waveSummary.waveCounts.now + run.baseline.waveSummary.waveCounts.next} | ${run.candidate.waveSummary.waveCounts.now + run.candidate.waveSummary.waveCounts.next} | ${run.delta.waveCountDelta} |`);
    lines.push(`| Total tasks | ${run.baseline.controlSummary.totalTasks} | ${run.candidate.controlSummary.totalTasks} | ${run.delta.taskCountDelta} |`);
    lines.push(`| Failed tasks | ${run.baseline.controlSummary.failedCount} | ${run.candidate.controlSummary.failedCount} | ${run.delta.failureDelta} |`);
    lines.push(`| Approval pending | ${run.baseline.controlSummary.approvalPendingCount} | ${run.candidate.controlSummary.approvalPendingCount} | ${run.delta.approvalPendingDelta} |`);
    lines.push(`| Critical waves | ${run.baseline.controlSummary.wavePostureCounts.critical} | ${run.candidate.controlSummary.wavePostureCounts.critical} | ${run.delta.criticalWavesDelta} |`);
    lines.push(`| Overall posture | ${run.baseline.controlSummary.overallPosture} | ${run.candidate.controlSummary.overallPosture} | - |`);
    lines.push(`| Optimization score | ${run.search.baselineScore} | ${run.search.selectedScore} | ${run.search.scoreDelta} |`);
    lines.push('');
    lines.push('## Promotion Robustness');
    lines.push('| Metric | Value | Policy |');
    lines.push('| --- | --- | --- |');
    lines.push(`| Candidate win rate | ${run.promotion.robustness.candidateWinRate} | >= ${run.promotion.policy.minCandidateWinRate} |`);
    lines.push(`| Weighted score delta | ${run.promotion.robustness.weightedScoreDelta} | <= ${run.promotion.policy.maxWeightedScoreDelta} |`);
    lines.push(`| Worst score delta | ${run.promotion.robustness.worstScoreDelta} | <= ${run.promotion.policy.maxWorstScoreDelta} |`);
    lines.push(`| Avg failure-rate delta | ${run.promotion.robustness.avgFailureRateDelta} | <= ${run.promotion.policy.maxAvgFailureRateDelta} |`);
    lines.push(`| Avg critical-wave delta | ${run.promotion.robustness.avgCriticalWaveDelta} | <= ${run.promotion.policy.maxAvgCriticalWaveDelta} |`);
    lines.push('');
    lines.push('### Robustness Scenarios');
    lines.push('| Scenario | Trials | Weight | Avg Score Delta | Worst Score Delta | Win/Baseline/Tie | Avg Failure Delta | Avg Pending Delta | Avg Critical Delta |');
    lines.push('| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
    run.promotion.robustness.scenarios.forEach((scenario) => {
        lines.push(
            `| ${scenario.name} | ${scenario.trials} | ${scenario.weight} | ${scenario.avgScoreDelta} | ${scenario.worstScoreDelta} | ` +
            `${scenario.candidateWins}/${scenario.baselineWins}/${scenario.ties} | ${scenario.avgFailureRateDelta} | ` +
            `${scenario.avgApprovalPendingRateDelta} | ${scenario.avgCriticalWaveDelta} |`
        );
    });
    lines.push('');

    if (run.promotion.violations.length > 0) {
        lines.push('## Promotion Violations');
        run.promotion.violations.forEach((violation) => lines.push(`- ${violation}`));
        lines.push('');
    }

    lines.push('## Delta Notes');
    lines.push(`- Stable wave delta: ${run.delta.stableWavesDelta}`);
    lines.push(`- Degraded wave delta: ${run.delta.degradedWavesDelta}`);
    lines.push(`- Skipped task delta: ${run.delta.skippedDelta}`);
    lines.push(`- Candidate configs evaluated: ${run.search.evaluatedCount}`);
    lines.push('');
    lines.push('## Top Candidate Scores');
    lines.push('| Rank | Config (now/next/maxDomain) | Score | Overall Posture | Failed | Pending | Critical Waves |');
    lines.push('| --- | --- | --- | --- | --- | --- | --- |');
    run.search.candidates
        .slice()
        .sort((a, b) => a.score - b.score)
        .slice(0, 12)
        .forEach((candidate, index) => {
            lines.push(
                `| ${index + 1} | ${candidate.config.nowWaveCapacity}/${candidate.config.nextWaveCapacity}/${candidate.config.maxPerDomainPerWave} | ` +
                `${candidate.score} | ${candidate.controlSummary.overallPosture} | ${candidate.controlSummary.failedCount} | ` +
                `${candidate.controlSummary.approvalPendingCount} | ${candidate.controlSummary.wavePostureCounts.critical} |`
            );
        });
    lines.push('');
    lines.push('## Reason Digest');
    lines.push(`- ${escapeCell(run.recommendation.reasons.join(' | '))}`);
    lines.push('');
    return lines.join('\n');
}

function main() {
    for (const required of [SOURCE_PLAN_PATH, BASELINE_WAVE_PLAN_PATH, BASELINE_CONTROL_PATH]) {
        if (!fs.existsSync(required)) {
            throw new Error(`Missing required file: ${required}. Run rollout planning/control stages first.`);
        }
    }

    const options = parseArgs(process.argv.slice(2));
    const sourcePlan = loadJson<SkillRolloutPlan>(SOURCE_PLAN_PATH);
    const baselineWavePlan = loadJson<SkillRolloutWavePlan>(BASELINE_WAVE_PLAN_PATH);
    const baselineControl = loadJson<SkillRolloutControlRun>(BASELINE_CONTROL_PATH);
    const baselineWaveTasks = rolloutWavePlanToTasks(baselineWavePlan);

    const recommendation = recommendRolloutWaveConfig(baselineControl, baselineWavePlan);
    const candidateConfigs = buildCandidateConfigs({
        current: recommendation.currentConfig,
        recommended: recommendation.recommendedConfig
    });

    const candidateEvaluations: CandidateEvaluation[] = [];

    candidateConfigs.forEach((config, index) => {
        const wavePlan = buildSkillRolloutWavePlan(sourcePlan, config);
        const waveTasks = rolloutWavePlanToTasks(wavePlan);
        const controlRun = runSkillRolloutControlLoop(wavePlan, waveTasks, {
            failBias: options.failBias,
            approvalBias: options.approvalBias,
            seed: `openclaw-rollout-control-optimized-${index + 1}`
        });

        candidateEvaluations.push({
            config,
            score: scoreRolloutControlForOptimization(controlRun),
            controlSummary: controlRun.summary,
            waveSummary: wavePlan.summary,
            wavePlan,
            waveTasks,
            controlRun
        });
    });

    candidateEvaluations.sort((a, b) => {
        const scoreDelta = a.score - b.score;
        if (scoreDelta !== 0) return scoreDelta;
        const failedDelta = a.controlSummary.failedCount - b.controlSummary.failedCount;
        if (failedDelta !== 0) return failedDelta;
        return a.controlSummary.approvalPendingCount - b.controlSummary.approvalPendingCount;
    });

    const selected = candidateEvaluations[0];
    const promotionRobustness = evaluatePromotionRobustness({
        baselineWavePlan,
        baselineWaveTasks,
        candidateWavePlan: selected.wavePlan,
        candidateWaveTasks: selected.waveTasks
    });

    const promotionPolicy = buildRolloutPromotionPolicy(recommendation.strategy);
    const promotion = decideRolloutPromotion({
        recommendation,
        selectedConfig: selected.config,
        baselineConfig: recommendation.currentConfig,
        robustness: promotionRobustness,
        policy: promotionPolicy,
        forcePromote: options.forcePromote
    });

    const effectiveWavePlan = promotion.status === 'approved' ? selected.wavePlan : baselineWavePlan;
    const effectiveWaveTasks = promotion.status === 'approved' ? selected.waveTasks : baselineWaveTasks;
    const effectiveControl = promotion.status === 'approved' ? selected.controlRun : baselineControl;
    const effectiveFollowUps = rolloutControlToFollowUpTasks(effectiveControl, effectiveWavePlan, {
        maxTasks: options.maxFollowUps
    });

    const optimizationRun = buildRolloutOptimizationRun({
        recommendation,
        baselineWavePlan,
        baselineControlRun: baselineControl,
        candidateWavePlan: selected.wavePlan,
        candidateControlRun: selected.controlRun,
        search: {
            baselineScore: scoreRolloutControlForOptimization(baselineControl),
            selectedScore: selected.score,
            selectedConfig: selected.config,
            candidates: candidateEvaluations.map((entry) => ({
                config: entry.config,
                score: entry.score,
                controlSummary: entry.controlSummary,
                waveSummary: entry.waveSummary
            }))
        },
        promotion
    });

    fs.writeFileSync(OPTIMIZATION_PATH, `${JSON.stringify(optimizationRun, null, 2)}\n`);
    fs.writeFileSync(OPTIMIZATION_MD_PATH, renderMarkdown(optimizationRun));
    fs.writeFileSync(PROMOTION_PATH, `${JSON.stringify(optimizationRun.promotion, null, 2)}\n`);
    fs.writeFileSync(PROMOTION_MD_PATH, renderPromotionMarkdown(optimizationRun));
    fs.writeFileSync(SELECTED_WAVE_PLAN_PATH, `${JSON.stringify(selected.wavePlan, null, 2)}\n`);
    fs.writeFileSync(SELECTED_WAVE_TASKS_PATH, `${JSON.stringify(selected.waveTasks, null, 2)}\n`);
    fs.writeFileSync(SELECTED_CONTROL_PATH, `${JSON.stringify(selected.controlRun, null, 2)}\n`);
    fs.writeFileSync(OPTIMIZED_WAVE_PLAN_PATH, `${JSON.stringify(effectiveWavePlan, null, 2)}\n`);
    fs.writeFileSync(OPTIMIZED_WAVE_TASKS_PATH, `${JSON.stringify(effectiveWaveTasks, null, 2)}\n`);
    fs.writeFileSync(OPTIMIZED_CONTROL_PATH, `${JSON.stringify(effectiveControl, null, 2)}\n`);
    fs.writeFileSync(OPTIMIZED_CONTROL_TASKS_PATH, `${JSON.stringify(effectiveFollowUps, null, 2)}\n`);

    console.log(
        `[optimize-1000-skills-rollout] strategy=${optimizationRun.recommendation.strategy} ` +
        `promotion=${optimizationRun.promotion.status} ` +
        `evaluated=${optimizationRun.search.evaluatedCount} ` +
        `robustTrials=${optimizationRun.promotion.robustness.evaluatedTrials} ` +
        `waveDelta=${optimizationRun.delta.waveCountDelta} ` +
        `failureDelta=${optimizationRun.delta.failureDelta} ` +
        `pendingDelta=${optimizationRun.delta.approvalPendingDelta} ` +
        `scoreDelta=${optimizationRun.search.scoreDelta}`
    );
}

main();
