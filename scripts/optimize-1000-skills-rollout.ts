import fs from 'fs';
import path from 'path';
import {
    buildRolloutOptimizationRun,
    buildSkillRolloutWavePlan,
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
    type SkillRolloutWavePlan
} from '../skills/runtime/index.js';

type CliOptions = {
    failBias?: number;
    approvalBias?: number;
    maxFollowUps?: number;
};

const REPO_ROOT = process.cwd();
const GENERATED_ROOT = path.join(REPO_ROOT, 'skills', 'generated');
const SOURCE_PLAN_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-plan.json');
const BASELINE_WAVE_PLAN_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-waves.json');
const BASELINE_CONTROL_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-control.json');
const OPTIMIZATION_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-optimization.json');
const OPTIMIZATION_MD_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-optimization.md');
const OPTIMIZED_WAVE_PLAN_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-optimized-waves.json');
const OPTIMIZED_WAVE_TASKS_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-optimized-wave-tasks.json');
const OPTIMIZED_CONTROL_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-optimized-control.json');
const OPTIMIZED_CONTROL_TASKS_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-optimized-control-tasks.json');

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

function normalizeConfig(config: {
    nowWaveCapacity: number;
    nextWaveCapacity: number;
    maxPerDomainPerWave: number;
}) {
    return {
        nowWaveCapacity: Math.max(8, Math.floor(Number(config.nowWaveCapacity))),
        nextWaveCapacity: Math.max(8, Math.floor(Number(config.nextWaveCapacity))),
        maxPerDomainPerWave: Math.max(1, Math.floor(Number(config.maxPerDomainPerWave)))
    };
}

function uniqueConfigs(configs: Array<{
    nowWaveCapacity: number;
    nextWaveCapacity: number;
    maxPerDomainPerWave: number;
}>) {
    const seen = new Set<string>();
    const unique: Array<{
        nowWaveCapacity: number;
        nextWaveCapacity: number;
        maxPerDomainPerWave: number;
    }> = [];

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
    current: { nowWaveCapacity: number; nextWaveCapacity: number; maxPerDomainPerWave: number; };
    recommended: { nowWaveCapacity: number; nextWaveCapacity: number; maxPerDomainPerWave: number; };
}) {
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

function escapeCell(value: string): string {
    return value.replace(/\|/g, '\\|');
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
    lines.push('## Observed Metrics');
    lines.push('| Metric | Value | Target |');
    lines.push('| --- | --- | --- |');
    lines.push(`| Failure rate | ${run.recommendation.observedMetrics.failureRate} | ${run.recommendation.targetMetrics.failureRate} |`);
    lines.push(`| Approval pending rate | ${run.recommendation.observedMetrics.approvalPendingRate} | ${run.recommendation.targetMetrics.approvalPendingRate} |`);
    lines.push(`| Avg wave fill rate | ${run.recommendation.observedMetrics.avgWaveFillRate} | ${run.recommendation.targetMetrics.avgWaveFillRate} |`);
    lines.push(`| Critical waves | ${run.recommendation.observedMetrics.criticalWaves} | n/a |`);
    lines.push(`| Degraded waves | ${run.recommendation.observedMetrics.degradedWaves} | n/a |`);
    lines.push('');
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

    const recommendation = recommendRolloutWaveConfig(baselineControl, baselineWavePlan);
    const candidateConfigs = buildCandidateConfigs({
        current: recommendation.currentConfig,
        recommended: recommendation.recommendedConfig
    });

    const candidateEvaluations: Array<SkillRolloutOptimizationCandidate & {
        wavePlan: SkillRolloutWavePlan;
        waveTasks: SkillExecutionTask[];
        controlRun: SkillRolloutControlRun;
    }> = [];

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
    const optimizedWavePlan = selected.wavePlan;
    const optimizedWaveTasks = selected.waveTasks;
    const optimizedControl = selected.controlRun;
    const optimizedFollowUps = rolloutControlToFollowUpTasks(optimizedControl, optimizedWavePlan, {
        maxTasks: options.maxFollowUps
    });

    const optimizationRun = buildRolloutOptimizationRun({
        recommendation,
        baselineWavePlan,
        baselineControlRun: baselineControl,
        candidateWavePlan: optimizedWavePlan,
        candidateControlRun: optimizedControl,
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
        }
    });

    fs.writeFileSync(OPTIMIZATION_PATH, `${JSON.stringify(optimizationRun, null, 2)}\n`);
    fs.writeFileSync(OPTIMIZATION_MD_PATH, renderMarkdown(optimizationRun));
    fs.writeFileSync(OPTIMIZED_WAVE_PLAN_PATH, `${JSON.stringify(optimizedWavePlan, null, 2)}\n`);
    fs.writeFileSync(OPTIMIZED_WAVE_TASKS_PATH, `${JSON.stringify(optimizedWaveTasks, null, 2)}\n`);
    fs.writeFileSync(OPTIMIZED_CONTROL_PATH, `${JSON.stringify(optimizedControl, null, 2)}\n`);
    fs.writeFileSync(OPTIMIZED_CONTROL_TASKS_PATH, `${JSON.stringify(optimizedFollowUps, null, 2)}\n`);

    console.log(
        `[optimize-1000-skills-rollout] strategy=${optimizationRun.recommendation.strategy} ` +
        `evaluated=${optimizationRun.search.evaluatedCount} ` +
        `waveDelta=${optimizationRun.delta.waveCountDelta} ` +
        `failureDelta=${optimizationRun.delta.failureDelta} ` +
        `pendingDelta=${optimizationRun.delta.approvalPendingDelta} ` +
        `scoreDelta=${optimizationRun.search.scoreDelta}`
    );
}

main();
