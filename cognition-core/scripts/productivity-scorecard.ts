import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

type OverallStatus = 'strong' | 'improving' | 'needs_attention';
type Priority = 'P1' | 'P2' | 'P3';
type ThresholdComparison = 'gte' | 'lte';
type Unit = 'percent' | 'seconds' | 'index';

type BenchmarkMetricName =
  | 'productivityIndex'
  | 'cycleTimeSec'
  | 'automationCoverage'
  | 'cognitionSuccessRate'
  | 'swarmSimSuccessRate'
  | 'skillUtilityComposite';

interface BenchmarkDelta {
  before: number;
  after: number;
  delta: number;
}

interface ThresholdCheck {
  comparison: ThresholdComparison;
  threshold: number;
  actual: number;
  distance: number;
  breached: boolean;
  unit: Unit;
}

interface ThresholdBreach {
  metric: BenchmarkMetricName;
  comparison: ThresholdComparison;
  threshold: number;
  actual: number;
  gap: number;
  priority: Priority;
  title: string;
  rationale: string;
  action: string;
}

interface RemediationItem {
  priority: Priority;
  title: string;
  rationale: string;
  action: string;
}

interface Scorecard {
  generatedAt: string;
  summary: {
    overall: OverallStatus;
    productivityIndex: number;
    keyMessage: string;
  };
  metrics: {
    cycleTimeSec: number;
    automationCoverage: number;
    dispatchCount: number;
    blockedApprovals: number;
    cognitionSuccessRate: number;
    swarmSimSuccessRate: number;
    skillUtilityComposite: number;
  };
  deltas: {
    skillUtilityDelta: number;
    stepReductionEstimate: number;
    benchmarkDeltas: Record<BenchmarkMetricName, BenchmarkDelta>;
  };
  thresholds: Record<BenchmarkMetricName, Omit<ThresholdCheck, 'actual' | 'distance' | 'breached'>>;
  thresholdChecks: Record<BenchmarkMetricName, ThresholdCheck>;
  thresholdBreaches: ThresholdBreach[];
  remediationPlan: RemediationItem[];
  artifactPaths: Record<string, string>;
}

type JsonObject = Record<string, unknown>;

const BENCHMARK_THRESHOLDS: Record<BenchmarkMetricName, { comparison: ThresholdComparison; threshold: number; unit: Unit }> = {
  productivityIndex: { comparison: 'gte', threshold: 75, unit: 'index' },
  cycleTimeSec: { comparison: 'lte', threshold: 120, unit: 'seconds' },
  automationCoverage: { comparison: 'gte', threshold: 70, unit: 'percent' },
  cognitionSuccessRate: { comparison: 'gte', threshold: 60, unit: 'percent' },
  swarmSimSuccessRate: { comparison: 'gte', threshold: 75, unit: 'percent' },
  skillUtilityComposite: { comparison: 'gte', threshold: 80, unit: 'percent' }
};

function readJsonIfExists(filePath: string): JsonObject | null {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as JsonObject;
  } catch {
    return null;
  }
}

function num(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function round(value: number, digits = 2): number {
  return Number(value.toFixed(digits));
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function parseIsoMs(value: unknown): number | null {
  if (typeof value !== 'string') return null;
  const t = Date.parse(value);
  return Number.isFinite(t) ? t : null;
}

function toPct(v: number): number {
  return round(clamp01(v) * 100, 2);
}

function toSignedPct(v: number): number {
  return round(v * 100, 2);
}

function getRemediationTemplate(metric: BenchmarkMetricName): { title: string; action: string } {
  switch (metric) {
    case 'cycleTimeSec':
      return {
        title: 'Reduce cognition cycle time',
        action: 'Profile stage timings in the run manifest, parallelize bottlenecks, and rerun dispatch with a <=120s target.'
      };
    case 'automationCoverage':
      return {
        title: 'Increase automation coverage',
        action: 'Review blocked items, tighten approval routing, and convert recurring manual tasks into policy-safe auto-dispatch paths.'
      };
    case 'cognitionSuccessRate':
      return {
        title: 'Improve cognition outcome success',
        action: 'Audit failed outcomes, retrain recommendation prompts, and enforce threshold-tuning feedback checks before promotion.'
      };
    case 'swarmSimSuccessRate':
      return {
        title: 'Raise swarm simulation success rate',
        action: 'Rerun benchmark with scenario-level diagnostics and patch failure-heavy scenarios before next release gate.'
      };
    case 'skillUtilityComposite':
      return {
        title: 'Increase skill utility composite',
        action: 'Patch low-utility skills and rerun the utility audit to close rubric coverage gaps before rollout expansion.'
      };
    case 'productivityIndex':
    default:
      return {
        title: 'Recover productivity index baseline',
        action: 'Execute top-priority metric remediations, then rerun scorecard to verify index recovery above benchmark.'
      };
  }
}

function breachPriority(metric: BenchmarkMetricName, gap: number): Priority {
  const absoluteGap = Math.abs(gap);

  if (metric === 'cycleTimeSec') {
    if (absoluteGap >= 60) return 'P1';
    if (absoluteGap >= 20) return 'P2';
    return 'P3';
  }

  if (absoluteGap >= 20) return 'P1';
  if (absoluteGap >= 10) return 'P2';
  return 'P3';
}

function makeThresholdCheck(
  metric: BenchmarkMetricName,
  actual: number
): { check: ThresholdCheck; breach: ThresholdBreach | null } {
  const config = BENCHMARK_THRESHOLDS[metric];
  const distance = config.comparison === 'gte'
    ? round(actual - config.threshold, 3)
    : round(config.threshold - actual, 3);
  const breached = distance < 0;

  const check: ThresholdCheck = {
    comparison: config.comparison,
    threshold: config.threshold,
    actual: round(actual, 3),
    distance,
    breached,
    unit: config.unit
  };

  if (!breached) {
    return { check, breach: null };
  }

  const gap = round(Math.abs(distance), 3);
  const template = getRemediationTemplate(metric);

  return {
    check,
    breach: {
      metric,
      comparison: config.comparison,
      threshold: config.threshold,
      actual: round(actual, 3),
      gap,
      priority: breachPriority(metric, gap),
      title: template.title,
      rationale: `${metric} is outside benchmark (${config.comparison} ${config.threshold}); observed ${round(actual, 3)}.`,
      action: template.action
    }
  };
}

function makeMarkdown(scorecard: Scorecard): string {
  const m = scorecard.metrics;
  const d = scorecard.deltas;
  const b = scorecard.deltas.benchmarkDeltas;
  const breachLines = scorecard.thresholdBreaches.length > 0
    ? scorecard.thresholdBreaches
      .map((breach) => `- [${breach.priority}] ${breach.metric}: threshold ${breach.comparison} ${breach.threshold}, actual ${breach.actual}, gap ${breach.gap}`)
      .join('\n')
    : '- None';

  return `# Productivity Scorecard\n\nGenerated: ${scorecard.generatedAt}\n\n## Summary\n- Overall: **${scorecard.summary.overall}**\n- Productivity Index: **${scorecard.summary.productivityIndex.toFixed(1)} / 100**\n- Message: ${scorecard.summary.keyMessage}\n\n## Core Metrics\n- Cycle Time (cognition run): **${m.cycleTimeSec.toFixed(2)}s**\n- Automation Coverage (packaged+blocked over planned tasks): **${m.automationCoverage.toFixed(2)}%**\n- Dispatch Count: **${m.dispatchCount}**\n- Blocked Approvals: **${m.blockedApprovals}**\n- Cognition Outcome Success Rate: **${m.cognitionSuccessRate.toFixed(2)}%**\n- Swarm Simulation Success Rate: **${m.swarmSimSuccessRate.toFixed(2)}%**\n- Skill Utility Composite: **${m.skillUtilityComposite.toFixed(2)}%**\n\n## Improvement Deltas\n- Skill Utility Delta: **${d.skillUtilityDelta.toFixed(2)}%**\n- Estimated Operator Step Reduction: **${d.stepReductionEstimate.toFixed(2)}%**\n\n## Deterministic Benchmark Deltas (Before → After)\n- Productivity Index: **${b.productivityIndex.before.toFixed(2)} → ${b.productivityIndex.after.toFixed(2)}** (Δ ${b.productivityIndex.delta.toFixed(2)})\n- Cycle Time (s): **${b.cycleTimeSec.before.toFixed(3)} → ${b.cycleTimeSec.after.toFixed(3)}** (Δ ${b.cycleTimeSec.delta.toFixed(3)})\n- Automation Coverage (%): **${b.automationCoverage.before.toFixed(2)} → ${b.automationCoverage.after.toFixed(2)}** (Δ ${b.automationCoverage.delta.toFixed(2)})\n- Cognition Success Rate (%): **${b.cognitionSuccessRate.before.toFixed(2)} → ${b.cognitionSuccessRate.after.toFixed(2)}** (Δ ${b.cognitionSuccessRate.delta.toFixed(2)})\n- Swarm Sim Success Rate (%): **${b.swarmSimSuccessRate.before.toFixed(2)} → ${b.swarmSimSuccessRate.after.toFixed(2)}** (Δ ${b.swarmSimSuccessRate.delta.toFixed(2)})\n- Skill Utility Composite (%): **${b.skillUtilityComposite.before.toFixed(2)} → ${b.skillUtilityComposite.after.toFixed(2)}** (Δ ${b.skillUtilityComposite.delta.toFixed(2)})\n\n## Threshold Breaches\n${breachLines}\n\n## Artifacts\n- Run manifest: \`${scorecard.artifactPaths.runManifest}\`\n- Dispatch report: \`${scorecard.artifactPaths.dispatchReport}\`\n- Cognition daily: \`${scorecard.artifactPaths.cognitionDaily}\`\n- Swarm benchmark: \`${scorecard.artifactPaths.swarmBenchmark}\`\n- Skill utility scorecard: \`${scorecard.artifactPaths.skillUtility}\`\n`;
}

(async () => {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const repoRoot = path.resolve(scriptDir, '../..');

  const runManifestPath = path.join(repoRoot, 'cognition-core/reports/cognition-run.json');
  const dispatchReportPath = path.join(repoRoot, 'cognition-core/reports/cognition-dispatch.report.json');
  const cognitionDailyPath = path.join(repoRoot, 'cognition-core/reports/cognition-daily.json');
  const swarmBenchmarkPath = path.join(repoRoot, 'swarm-protocol/state/simulation-benchmark.json');
  const skillUtilityPath = path.join(repoRoot, 'skills/state/skills-utility-scorecard.json');
  const outJsonLatest = path.join(repoRoot, 'cognition-core/reports/productivity-scorecard.latest.json');
  const outMdLatest = path.join(repoRoot, 'cognition-core/reports/productivity-scorecard.latest.md');

  const previousScorecard = readJsonIfExists(outJsonLatest);

  const runManifest = readJsonIfExists(runManifestPath);
  const dispatchReport = readJsonIfExists(dispatchReportPath);
  const daily = readJsonIfExists(cognitionDailyPath);
  const swarmBenchmark = readJsonIfExists(swarmBenchmarkPath);
  const utility = readJsonIfExists(skillUtilityPath);

  const runResults = Array.isArray(runManifest?.results) ? (runManifest?.results as JsonObject[]) : [];
  let cycleTimeSec = 0;
  if (runResults.length > 0) {
    const starts = runResults.map((r) => parseIsoMs(r.startedAt)).filter((v): v is number => v !== null);
    const ends = runResults.map((r) => parseIsoMs(r.finishedAt)).filter((v): v is number => v !== null);
    if (starts.length > 0 && ends.length > 0) {
      cycleTimeSec = (Math.max(...ends) - Math.min(...starts)) / 1000;
    }
  }

  const planStats = (runResults.find((r) => r.name === 'plan') as JsonObject | undefined) ?? {};
  const dispatchStats = (dispatchReport?.stats as JsonObject | undefined) ?? {};

  const taskCount = num(planStats.taskCount ?? (dispatchStats.dagTaskCount as number | undefined), 0);
  const dispatchCount = num(dispatchStats.dispatchCount, 0);
  const blocked = num(dispatchStats.blockedCount, 0);
  const automationCoverage = taskCount > 0 ? ((dispatchCount + blocked) / taskCount) : 0;

  const dailySummary = (daily?.summary as JsonObject | undefined) ?? {};
  const cognitionSuccessRate = num(dailySummary.successRate, 0);

  const aggregate = (swarmBenchmark?.aggregate as JsonObject | undefined) ?? {};
  const swarmSuccess = num(aggregate.successRateAvg, 0);

  const baseline = (utility?.baseline as JsonObject | undefined) ?? {};
  const postEdit = (utility?.post_edit as JsonObject | undefined) ?? {};
  const baselineComposite = num(baseline.composite, 0);
  const postComposite = num(postEdit.composite, 0);

  const stepReductionEstimate = 0.667; // run+dispatch vs previous 6-step manual loop

  const productivityIndexRaw =
    clamp01(postComposite) * 0.25 +
    clamp01(swarmSuccess) * 0.2 +
    clamp01(automationCoverage) * 0.2 +
    clamp01(1 - Math.min(cycleTimeSec / 120, 1)) * 0.15 +
    clamp01(cognitionSuccessRate) * 0.2;

  const productivityIndex = productivityIndexRaw * 100;

  let overall: OverallStatus = 'needs_attention';
  if (productivityIndex >= 75) overall = 'strong';
  else if (productivityIndex >= 50) overall = 'improving';

  const keyMessage =
    cognitionSuccessRate < 0.5
      ? 'Execution velocity and utility are strong, but outcome success is still low; prioritize recommendation quality tuning.'
      : 'Execution and outcomes are converging; continue scaling automated dispatch with policy-gated approvals.';

  const metrics = {
    cycleTimeSec: round(cycleTimeSec, 3),
    automationCoverage: toPct(automationCoverage),
    dispatchCount,
    blockedApprovals: blocked,
    cognitionSuccessRate: toPct(cognitionSuccessRate),
    swarmSimSuccessRate: toPct(swarmSuccess),
    skillUtilityComposite: toPct(postComposite)
  };

  const previousSummary = (previousScorecard?.summary as JsonObject | undefined) ?? {};
  const previousMetrics = (previousScorecard?.metrics as JsonObject | undefined) ?? {};

  const benchmarkDeltas: Record<BenchmarkMetricName, BenchmarkDelta> = {
    productivityIndex: {
      before: round(num(previousSummary.productivityIndex, round(productivityIndex, 2)), 2),
      after: round(productivityIndex, 2),
      delta: round(round(productivityIndex, 2) - num(previousSummary.productivityIndex, round(productivityIndex, 2)), 2)
    },
    cycleTimeSec: {
      before: round(num(previousMetrics.cycleTimeSec, metrics.cycleTimeSec), 3),
      after: metrics.cycleTimeSec,
      delta: round(metrics.cycleTimeSec - num(previousMetrics.cycleTimeSec, metrics.cycleTimeSec), 3)
    },
    automationCoverage: {
      before: round(num(previousMetrics.automationCoverage, metrics.automationCoverage), 2),
      after: metrics.automationCoverage,
      delta: round(metrics.automationCoverage - num(previousMetrics.automationCoverage, metrics.automationCoverage), 2)
    },
    cognitionSuccessRate: {
      before: round(num(previousMetrics.cognitionSuccessRate, metrics.cognitionSuccessRate), 2),
      after: metrics.cognitionSuccessRate,
      delta: round(metrics.cognitionSuccessRate - num(previousMetrics.cognitionSuccessRate, metrics.cognitionSuccessRate), 2)
    },
    swarmSimSuccessRate: {
      before: round(num(previousMetrics.swarmSimSuccessRate, metrics.swarmSimSuccessRate), 2),
      after: metrics.swarmSimSuccessRate,
      delta: round(metrics.swarmSimSuccessRate - num(previousMetrics.swarmSimSuccessRate, metrics.swarmSimSuccessRate), 2)
    },
    skillUtilityComposite: {
      before: round(num(previousMetrics.skillUtilityComposite, metrics.skillUtilityComposite), 2),
      after: metrics.skillUtilityComposite,
      delta: round(metrics.skillUtilityComposite - num(previousMetrics.skillUtilityComposite, metrics.skillUtilityComposite), 2)
    }
  };

  const thresholdChecks = {
    productivityIndex: makeThresholdCheck('productivityIndex', round(productivityIndex, 2)),
    cycleTimeSec: makeThresholdCheck('cycleTimeSec', metrics.cycleTimeSec),
    automationCoverage: makeThresholdCheck('automationCoverage', metrics.automationCoverage),
    cognitionSuccessRate: makeThresholdCheck('cognitionSuccessRate', metrics.cognitionSuccessRate),
    swarmSimSuccessRate: makeThresholdCheck('swarmSimSuccessRate', metrics.swarmSimSuccessRate),
    skillUtilityComposite: makeThresholdCheck('skillUtilityComposite', metrics.skillUtilityComposite)
  };

  const thresholdBreaches = Object.values(thresholdChecks)
    .map((item) => item.breach)
    .filter((item): item is ThresholdBreach => item !== null);

  const remediationPlan = thresholdBreaches.map((breach) => ({
    priority: breach.priority,
    title: breach.title,
    rationale: breach.rationale,
    action: breach.action
  }));

  const scorecard: Scorecard = {
    generatedAt: new Date().toISOString(),
    summary: {
      overall,
      productivityIndex: round(productivityIndex, 2),
      keyMessage
    },
    metrics,
    deltas: {
      skillUtilityDelta: toSignedPct(postComposite - baselineComposite),
      stepReductionEstimate: toPct(stepReductionEstimate),
      benchmarkDeltas
    },
    thresholds: {
      productivityIndex: BENCHMARK_THRESHOLDS.productivityIndex,
      cycleTimeSec: BENCHMARK_THRESHOLDS.cycleTimeSec,
      automationCoverage: BENCHMARK_THRESHOLDS.automationCoverage,
      cognitionSuccessRate: BENCHMARK_THRESHOLDS.cognitionSuccessRate,
      swarmSimSuccessRate: BENCHMARK_THRESHOLDS.swarmSimSuccessRate,
      skillUtilityComposite: BENCHMARK_THRESHOLDS.skillUtilityComposite
    },
    thresholdChecks: {
      productivityIndex: thresholdChecks.productivityIndex.check,
      cycleTimeSec: thresholdChecks.cycleTimeSec.check,
      automationCoverage: thresholdChecks.automationCoverage.check,
      cognitionSuccessRate: thresholdChecks.cognitionSuccessRate.check,
      swarmSimSuccessRate: thresholdChecks.swarmSimSuccessRate.check,
      skillUtilityComposite: thresholdChecks.skillUtilityComposite.check
    },
    thresholdBreaches,
    remediationPlan,
    artifactPaths: {
      runManifest: runManifestPath,
      dispatchReport: dispatchReportPath,
      cognitionDaily: cognitionDailyPath,
      swarmBenchmark: swarmBenchmarkPath,
      skillUtility: skillUtilityPath
    }
  };

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outJsonStamped = path.join(repoRoot, `cognition-core/reports/productivity-scorecard-${stamp}.json`);

  fs.mkdirSync(path.dirname(outJsonLatest), { recursive: true });
  fs.writeFileSync(outJsonLatest, JSON.stringify(scorecard, null, 2));
  fs.writeFileSync(outJsonStamped, JSON.stringify(scorecard, null, 2));
  fs.writeFileSync(outMdLatest, makeMarkdown(scorecard));

  console.log(`[productivity-scorecard] ${scorecard.summary.overall} index=${scorecard.summary.productivityIndex.toFixed(2)} generated`);
  console.log(`[productivity-scorecard] breaches=${scorecard.thresholdBreaches.length} remediation=${scorecard.remediationPlan.length}`);
  console.log(`[productivity-scorecard] json=${outJsonLatest}`);
  console.log(`[productivity-scorecard] md=${outMdLatest}`);
})();
