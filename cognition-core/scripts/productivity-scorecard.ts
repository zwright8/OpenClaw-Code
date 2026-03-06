import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { buildRemediationTasks } from '../src/remediation-task-planner.js';

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

interface ThresholdBreachReasonPayload {
  code: 'THRESHOLD_BREACH';
  metric: BenchmarkMetricName;
  comparison: ThresholdComparison;
  threshold: number;
  actual: number;
  miss: number;
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
  reasonPayload: ThresholdBreachReasonPayload;
  action: string;
}

interface RegressionGateCheck {
  metric: BenchmarkMetricName;
  comparison: ThresholdComparison;
  threshold: number;
  actual: number;
  delta: number;
  unit: Unit;
  passed: boolean;
  priority: Priority;
  reason: string;
  reasonPayload: ThresholdBreachReasonPayload | null;
}

interface RegressionGateSummary {
  passed: boolean;
  failureCount: number;
  checks: Record<BenchmarkMetricName, RegressionGateCheck>;
  failures: Array<{
    metric: BenchmarkMetricName;
    priority: Priority;
    reason: string;
    reasonPayload: ThresholdBreachReasonPayload;
  }>;
}

interface RemediationItem {
  metric: BenchmarkMetricName;
  priority: Priority;
  title: string;
  rationale: string;
  action: string;
}

interface RemediationTaskArtifact {
  taskId: string;
  sourceReport: string;
  metric: BenchmarkMetricName;
  priority: Priority;
  threshold: number | null;
  actual: number | null;
  gap: number | null;
  comparison: ThresholdComparison | null;
  regressionReason: string;
  regressionReasonPayload: ThresholdBreachReasonPayload | null;
  target: string;
  swarmPriority: string;
  task: string;
  title: string;
  action: string;
}

interface RemediationTaskPlanArtifact {
  generatedAt: string;
  sourceReport: string;
  count: number;
  tasks: unknown[];
  artifacts: RemediationTaskArtifact[];
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
  regressionGates: RegressionGateSummary;
  thresholdBreaches: ThresholdBreach[];
  remediationPlan: RemediationItem[];
  remediationTaskArtifacts: RemediationTaskArtifact[];
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

const METRIC_PRECISION: Record<BenchmarkMetricName, number> = {
  productivityIndex: 2,
  cycleTimeSec: 3,
  automationCoverage: 2,
  cognitionSuccessRate: 2,
  swarmSimSuccessRate: 2,
  skillUtilityComposite: 2
};

const PRIORITY_ORDER: Record<Priority, number> = {
  P1: 0,
  P2: 1,
  P3: 2
};

function compareString(left: string, right: string): number {
  if (left === right) return 0;
  return left < right ? -1 : 1;
}

function compareNumber(left: number, right: number): number {
  if (left === right) return 0;
  return left < right ? -1 : 1;
}

function comparePriority(left: Priority, right: Priority): number {
  return compareNumber(PRIORITY_ORDER[left], PRIORITY_ORDER[right]);
}

function compareThresholdBreaches(left: ThresholdBreach, right: ThresholdBreach): number {
  return (
    comparePriority(left.priority, right.priority) ||
    compareString(left.metric, right.metric) ||
    compareString(left.title.trim(), right.title.trim()) ||
    compareString(left.action.trim(), right.action.trim()) ||
    compareNumber(left.threshold, right.threshold) ||
    compareNumber(left.actual, right.actual) ||
    compareNumber(left.gap, right.gap)
  );
}

function compareRemediationItems(left: RemediationItem, right: RemediationItem): number {
  return (
    comparePriority(left.priority, right.priority) ||
    compareString(left.metric, right.metric) ||
    compareString(left.title.trim(), right.title.trim()) ||
    compareString(left.action.trim(), right.action.trim())
  );
}

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
  if (!Number.isFinite(value)) return 0;
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

const DETERMINISTIC_TIMESTAMP_WINDOW_START_MS = Date.UTC(2024, 0, 1, 0, 0, 0, 0);
const DETERMINISTIC_TIMESTAMP_WINDOW_END_MS = Date.UTC(2101, 0, 1, 0, 0, 0, 0) - 1;
const DETERMINISTIC_TIMESTAMP_WINDOW_SPAN_MS =
  BigInt(DETERMINISTIC_TIMESTAMP_WINDOW_END_MS - DETERMINISTIC_TIMESTAMP_WINDOW_START_MS + 1);

function deterministicEpochMsFromSeed(seed: string): number {
  const hex = createHash('sha256').update(seed).digest('hex').slice(0, 16);
  const offset = BigInt(`0x${hex}`) % DETERMINISTIC_TIMESTAMP_WINDOW_SPAN_MS;
  return DETERMINISTIC_TIMESTAMP_WINDOW_START_MS + Number(offset);
}

function deterministicIsoFromSeed(seed: string): string {
  return new Date(deterministicEpochMsFromSeed(seed)).toISOString();
}

function deterministicUuid(seed: string): string {
  const hex = createHash('sha256').update(seed).digest('hex');
  const variantByte = ((parseInt(hex.slice(16, 18), 16) & 0x3f) | 0x80).toString(16).padStart(2, '0');

  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    `5${hex.slice(13, 16)}`,
    `${variantByte}${hex.slice(18, 20)}`,
    hex.slice(20, 32)
  ].join('-');
}

function remediationSignature(item: Pick<RemediationItem, 'metric' | 'priority' | 'title' | 'action'>): string {
  return [item.metric, item.priority, item.title.trim(), item.action.trim()].join('|');
}

function stableRemediationSeed(
  remediationPlan: RemediationItem[],
  thresholdBreaches: ThresholdBreach[]
): string {
  const canonicalRemediationPlan = remediationPlan
    .map((item) => ({
      metric: item.metric,
      priority: item.priority,
      title: item.title.trim(),
      action: item.action.trim()
    }))
    .sort((left, right) => (
      comparePriority(left.priority, right.priority) ||
      compareString(left.metric, right.metric) ||
      compareString(left.title, right.title) ||
      compareString(left.action, right.action)
    ));

  const canonicalThresholdBreaches = thresholdBreaches
    .map((breach) => ({
      metric: breach.metric,
      priority: breach.priority,
      comparison: breach.comparison,
      threshold: round(breach.threshold, METRIC_PRECISION[breach.metric]),
      actual: round(breach.actual, METRIC_PRECISION[breach.metric]),
      gap: round(breach.gap, METRIC_PRECISION[breach.metric]),
      title: breach.title.trim(),
      action: breach.action.trim()
    }))
    .sort((left, right) => (
      comparePriority(left.priority, right.priority) ||
      compareString(left.metric, right.metric) ||
      compareString(left.title, right.title) ||
      compareString(left.action, right.action) ||
      compareNumber(left.threshold, right.threshold) ||
      compareNumber(left.actual, right.actual) ||
      compareNumber(left.gap, right.gap)
    ));

  const canonicalPayload = {
    remediationPlan: canonicalRemediationPlan,
    thresholdBreaches: canonicalThresholdBreaches
  };

  return createHash('sha256').update(JSON.stringify(canonicalPayload)).digest('hex');
}

function dequeueBreach(queue: ThresholdBreach[] | undefined): ThresholdBreach | null {
  if (!queue || queue.length === 0) return null;
  return queue.shift() ?? null;
}

function toFiniteOrNull(value: unknown, digits = 2): number | null {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  return round(numeric, digits);
}

export function buildDeterministicBenchmarkDeltas(
  actuals: Record<BenchmarkMetricName, number>
): Record<BenchmarkMetricName, BenchmarkDelta> {
  const entries = (Object.keys(BENCHMARK_THRESHOLDS) as BenchmarkMetricName[]).map((metric) => {
    const config = BENCHMARK_THRESHOLDS[metric];
    const digits = METRIC_PRECISION[metric];
    const before = round(config.threshold, digits);
    const rawActual = Number(actuals[metric]);
    const after = round(Number.isFinite(rawActual) ? rawActual : config.threshold, digits);
    const deltaRaw = config.comparison === 'gte' ? after - before : before - after;

    return [
      metric,
      {
        before,
        after,
        delta: round(deltaRaw, digits)
      }
    ] as const;
  });

  return Object.fromEntries(entries) as Record<BenchmarkMetricName, BenchmarkDelta>;
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

function formatReasonValue(metric: BenchmarkMetricName, value: number): number {
  return round(value, METRIC_PRECISION[metric]);
}

function buildThresholdBreachReasonPayload(
  metric: BenchmarkMetricName,
  comparison: ThresholdComparison,
  threshold: number,
  actual: number,
  miss: number,
  unit: Unit
): ThresholdBreachReasonPayload {
  return {
    code: 'THRESHOLD_BREACH',
    metric,
    comparison,
    threshold: formatReasonValue(metric, threshold),
    actual: formatReasonValue(metric, actual),
    miss: formatReasonValue(metric, miss),
    unit
  };
}

function buildThresholdFailureReason(payload: ThresholdBreachReasonPayload): string {
  return `Threshold breach for ${payload.metric}: expected ${payload.comparison} ${payload.threshold} ${payload.unit}, actual ${payload.actual} ${payload.unit}, miss ${payload.miss} ${payload.unit}.`;
}


function makeThresholdCheck(
  metric: BenchmarkMetricName,
  actual: number
): { check: ThresholdCheck; breach: ThresholdBreach | null } {
  const config = BENCHMARK_THRESHOLDS[metric];
  const digits = METRIC_PRECISION[metric];
  const distance = config.comparison === 'gte'
    ? round(actual - config.threshold, digits)
    : round(config.threshold - actual, digits);
  const breached = distance < 0;

  const check: ThresholdCheck = {
    comparison: config.comparison,
    threshold: config.threshold,
    actual: round(actual, digits),
    distance,
    breached,
    unit: config.unit
  };

  if (!breached) {
    return { check, breach: null };
  }

  const gap = round(Math.abs(distance), digits);
  const actualRounded = round(actual, digits);
  const reasonPayload = buildThresholdBreachReasonPayload(
    metric,
    config.comparison,
    config.threshold,
    actualRounded,
    gap,
    config.unit
  );
  const template = getRemediationTemplate(metric);

  return {
    check,
    breach: {
      metric,
      comparison: config.comparison,
      threshold: config.threshold,
      actual: actualRounded,
      gap,
      priority: breachPriority(metric, gap),
      title: template.title,
      rationale: buildThresholdFailureReason(reasonPayload),
      reasonPayload,
      action: template.action
    }
  };
}

export function buildRegressionGateSummary(
  thresholdChecks: Record<BenchmarkMetricName, ThresholdCheck>,
  thresholdBreaches: ThresholdBreach[]
): RegressionGateSummary {
  const breachByMetric = new Map<BenchmarkMetricName, ThresholdBreach>();
  thresholdBreaches.forEach((breach) => breachByMetric.set(breach.metric, breach));

  const checks = Object.fromEntries(
    (Object.keys(BENCHMARK_THRESHOLDS) as BenchmarkMetricName[]).map((metric) => {
      const check = thresholdChecks[metric];
      const breach = breachByMetric.get(metric);
      const delta = round(check.distance, METRIC_PRECISION[metric]);
      const missDistance = round(Math.abs(delta), METRIC_PRECISION[metric]);
      const synthesizedPayload = buildThresholdBreachReasonPayload(
        metric,
        check.comparison,
        check.threshold,
        check.actual,
        missDistance,
        check.unit
      );
      const reasonPayload = check.breached ? (breach?.reasonPayload ?? synthesizedPayload) : null;
      const defaultFailureReason = buildThresholdFailureReason(reasonPayload ?? synthesizedPayload);
      const thresholdValue = formatReasonValue(metric, check.threshold);
      const actualValue = formatReasonValue(metric, check.actual);
      const marginValue = formatReasonValue(metric, delta);

      const reason = check.breached
        ? defaultFailureReason
        : `No threshold breach for ${metric}: expected ${check.comparison} ${thresholdValue} ${check.unit}, actual ${actualValue} ${check.unit}, margin ${marginValue} ${check.unit}.`;

      return [
        metric,
        {
          metric,
          comparison: check.comparison,
          threshold: check.threshold,
          actual: check.actual,
          delta,
          unit: check.unit,
          passed: !check.breached,
          priority: breach?.priority ?? (check.breached ? breachPriority(metric, missDistance) : 'P3'),
          reason,
          reasonPayload
        }
      ] as const;
    })
  ) as Record<BenchmarkMetricName, RegressionGateCheck>;

  const failures = (Object.values(checks) as RegressionGateCheck[])
    .filter((check) => !check.passed)
    .map((check) => ({
      metric: check.metric,
      priority: check.priority,
      reason: check.reason,
      reasonPayload: check.reasonPayload ?? buildThresholdBreachReasonPayload(
        check.metric,
        check.comparison,
        check.threshold,
        check.actual,
        Math.abs(check.delta),
        check.unit
      )
    }))
    .sort((left, right) => (
      comparePriority(left.priority, right.priority) ||
      compareString(left.metric, right.metric) ||
      compareString(left.reason, right.reason)
    ));

  return {
    passed: failures.length === 0,
    failureCount: failures.length,
    checks,
    failures
  };
}

export function buildRemediationTaskPlanArtifact(
  remediationPlan: RemediationItem[],
  thresholdBreaches: ThresholdBreach[],
  sourceReport: string
): RemediationTaskPlanArtifact {
  const orderedRemediationPlan = [...remediationPlan].sort(compareRemediationItems);
  const orderedThresholdBreaches = [...thresholdBreaches].sort(compareThresholdBreaches);
  const planSeed = stableRemediationSeed(orderedRemediationPlan, orderedThresholdBreaches);
  const seedTime = deterministicEpochMsFromSeed(`${sourceReport}|${planSeed}`);
  const sourceSeed = `${sourceReport}|${planSeed}`;
  const generatedAt = new Date(seedTime).toISOString();

  const signatureQueues = new Map<string, ThresholdBreach[]>();
  const metricQueues = new Map<BenchmarkMetricName, ThresholdBreach[]>();

  orderedThresholdBreaches.forEach((breach) => {
    const signature = remediationSignature({
      metric: breach.metric,
      priority: breach.priority,
      title: breach.title,
      action: breach.action
    });

    const bySignature = signatureQueues.get(signature) ?? [];
    bySignature.push(breach);
    signatureQueues.set(signature, bySignature);

    const byMetric = metricQueues.get(breach.metric) ?? [];
    byMetric.push(breach);
    metricQueues.set(breach.metric, byMetric);
  });

  const tasks = buildRemediationTasks(orderedRemediationPlan, {
    fromAgentId: 'agent:main',
    sourceReport,
    targetMap: {
      P1: 'agent:ops:critical',
      P2: 'agent:ops',
      P3: 'agent:backlog'
    },
    defaultTarget: 'agent:ops',
    maxItems: orderedRemediationPlan.length,
    nowFactory: () => seedTime,
    idFactory: (index: number, item: { priority: string; title: string; action: string }) =>
      deterministicUuid(`${sourceSeed}|${index}|${item.priority}|${item.title}|${item.action}`)
  }) as unknown[];

  const artifacts = orderedRemediationPlan.map((item, index) => {
    const signature = remediationSignature(item);
    const breach =
      dequeueBreach(signatureQueues.get(signature)) ??
      dequeueBreach(metricQueues.get(item.metric)) ??
      orderedThresholdBreaches[index] ??
      null;
    const task = (tasks[index] ?? {}) as Record<string, unknown>;
    const metricPrecision = METRIC_PRECISION[item.metric] ?? 3;

    return {
      taskId: String(task.id ?? deterministicUuid(`${sourceSeed}|fallback|${index}|${item.metric}|${item.priority}`)),
      sourceReport,
      metric: item.metric,
      priority: item.priority,
      threshold: toFiniteOrNull(breach?.threshold, metricPrecision),
      actual: toFiniteOrNull(breach?.actual, metricPrecision),
      gap: toFiniteOrNull(breach?.gap, metricPrecision),
      comparison: breach?.comparison ?? null,
      regressionReason: breach?.rationale ?? item.rationale,
      regressionReasonPayload: breach?.reasonPayload ?? null,
      target: String(task.target ?? ''),
      swarmPriority: String(task.priority ?? ''),
      task: String(task.task ?? ''),
      title: item.title,
      action: item.action
    };
  });

  return {
    generatedAt,
    sourceReport,
    count: tasks.length,
    tasks,
    artifacts
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
  const regressionGateLines = scorecard.regressionGates.failures.length > 0
    ? scorecard.regressionGates.failures
      .map((failure) => `- [${failure.priority}] ${failure.metric}: ${failure.reason}`)
      .join('\n')
    : '- All regression gates passed.';

  return `# Productivity Scorecard\n\nGenerated: ${scorecard.generatedAt}\n\n## Summary\n- Overall: **${scorecard.summary.overall}**\n- Productivity Index: **${scorecard.summary.productivityIndex.toFixed(1)} / 100**\n- Message: ${scorecard.summary.keyMessage}\n\n## Core Metrics\n- Cycle Time (cognition run): **${m.cycleTimeSec.toFixed(2)}s**\n- Automation Coverage (packaged+blocked over planned tasks): **${m.automationCoverage.toFixed(2)}%**\n- Dispatch Count: **${m.dispatchCount}**\n- Blocked Approvals: **${m.blockedApprovals}**\n- Cognition Outcome Success Rate: **${m.cognitionSuccessRate.toFixed(2)}%**\n- Swarm Simulation Success Rate: **${m.swarmSimSuccessRate.toFixed(2)}%**\n- Skill Utility Composite: **${m.skillUtilityComposite.toFixed(2)}%**\n\n## Improvement Deltas\n- Skill Utility Delta: **${d.skillUtilityDelta.toFixed(2)}%**\n- Estimated Operator Step Reduction: **${d.stepReductionEstimate.toFixed(2)}%**\n\n## Deterministic Benchmark Deltas (Benchmark Threshold → Observed)\n- Productivity Index: **${b.productivityIndex.before.toFixed(2)} → ${b.productivityIndex.after.toFixed(2)}** (Δ ${b.productivityIndex.delta.toFixed(2)})\n- Cycle Time (s): **${b.cycleTimeSec.before.toFixed(3)} → ${b.cycleTimeSec.after.toFixed(3)}** (Δ ${b.cycleTimeSec.delta.toFixed(3)})\n- Automation Coverage (%): **${b.automationCoverage.before.toFixed(2)} → ${b.automationCoverage.after.toFixed(2)}** (Δ ${b.automationCoverage.delta.toFixed(2)})\n- Cognition Success Rate (%): **${b.cognitionSuccessRate.before.toFixed(2)} → ${b.cognitionSuccessRate.after.toFixed(2)}** (Δ ${b.cognitionSuccessRate.delta.toFixed(2)})\n- Swarm Sim Success Rate (%): **${b.swarmSimSuccessRate.before.toFixed(2)} → ${b.swarmSimSuccessRate.after.toFixed(2)}** (Δ ${b.swarmSimSuccessRate.delta.toFixed(2)})\n- Skill Utility Composite (%): **${b.skillUtilityComposite.before.toFixed(2)} → ${b.skillUtilityComposite.after.toFixed(2)}** (Δ ${b.skillUtilityComposite.delta.toFixed(2)})\n\n> Delta is comparator-aware: positive means better vs benchmark (\`gte\`: above threshold, \`lte\`: below threshold).\n\n## Threshold Breaches\n${breachLines}\n\n## Regression Gate Failures\n${regressionGateLines}\n\n## Artifacts\n- Run manifest: \`${scorecard.artifactPaths.runManifest}\`\n- Dispatch report: \`${scorecard.artifactPaths.dispatchReport}\`\n- Cognition daily: \`${scorecard.artifactPaths.cognitionDaily}\`\n- Swarm benchmark: \`${scorecard.artifactPaths.swarmBenchmark}\`\n- Skill utility scorecard: \`${scorecard.artifactPaths.skillUtility}\`\n- Remediation task plan: \`${scorecard.artifactPaths.remediationTaskPlan}\`\n`;
}

export async function generateProductivityScorecard(): Promise<Scorecard> {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const repoRoot = path.resolve(scriptDir, '../..');

  const runManifestPath = path.join(repoRoot, 'cognition-core/reports/cognition-run.json');
  const dispatchReportPath = path.join(repoRoot, 'cognition-core/reports/cognition-dispatch.report.json');
  const cognitionDailyPath = path.join(repoRoot, 'cognition-core/reports/cognition-daily.json');
  const swarmBenchmarkPath = path.join(repoRoot, 'swarm-protocol/state/simulation-benchmark.json');
  const skillUtilityPath = path.join(repoRoot, 'skills/state/skills-utility-scorecard.json');
  const outJsonLatest = path.join(repoRoot, 'cognition-core/reports/productivity-scorecard.latest.json');
  const outMdLatest = path.join(repoRoot, 'cognition-core/reports/productivity-scorecard.latest.md');
  const outRemediationLatest = path.join(repoRoot, 'cognition-core/reports/remediation-tasks.latest.json');

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

  const benchmarkDeltas = buildDeterministicBenchmarkDeltas({
    productivityIndex: round(productivityIndex, 2),
    cycleTimeSec: metrics.cycleTimeSec,
    automationCoverage: metrics.automationCoverage,
    cognitionSuccessRate: metrics.cognitionSuccessRate,
    swarmSimSuccessRate: metrics.swarmSimSuccessRate,
    skillUtilityComposite: metrics.skillUtilityComposite
  });

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
    .filter((item): item is ThresholdBreach => item !== null)
    .sort(compareThresholdBreaches);

  const regressionGates = buildRegressionGateSummary(
    {
      productivityIndex: thresholdChecks.productivityIndex.check,
      cycleTimeSec: thresholdChecks.cycleTimeSec.check,
      automationCoverage: thresholdChecks.automationCoverage.check,
      cognitionSuccessRate: thresholdChecks.cognitionSuccessRate.check,
      swarmSimSuccessRate: thresholdChecks.swarmSimSuccessRate.check,
      skillUtilityComposite: thresholdChecks.skillUtilityComposite.check
    },
    thresholdBreaches
  );

  const remediationPlan: RemediationItem[] = thresholdBreaches
    .map((breach) => ({
      metric: breach.metric,
      priority: breach.priority,
      title: breach.title,
      rationale: breach.rationale,
      action: breach.action
    }))
    .sort(compareRemediationItems);

  const summary = {
    overall,
    productivityIndex: round(productivityIndex, 2),
    keyMessage
  };

  const deltas = {
    skillUtilityDelta: toSignedPct(postComposite - baselineComposite),
    stepReductionEstimate: toPct(stepReductionEstimate),
    benchmarkDeltas
  };

  const thresholds = {
    productivityIndex: BENCHMARK_THRESHOLDS.productivityIndex,
    cycleTimeSec: BENCHMARK_THRESHOLDS.cycleTimeSec,
    automationCoverage: BENCHMARK_THRESHOLDS.automationCoverage,
    cognitionSuccessRate: BENCHMARK_THRESHOLDS.cognitionSuccessRate,
    swarmSimSuccessRate: BENCHMARK_THRESHOLDS.swarmSimSuccessRate,
    skillUtilityComposite: BENCHMARK_THRESHOLDS.skillUtilityComposite
  };

  const thresholdCheckSummary = {
    productivityIndex: thresholdChecks.productivityIndex.check,
    cycleTimeSec: thresholdChecks.cycleTimeSec.check,
    automationCoverage: thresholdChecks.automationCoverage.check,
    cognitionSuccessRate: thresholdChecks.cognitionSuccessRate.check,
    swarmSimSuccessRate: thresholdChecks.swarmSimSuccessRate.check,
    skillUtilityComposite: thresholdChecks.skillUtilityComposite.check
  };

  const artifactPaths = {
    runManifest: runManifestPath,
    dispatchReport: dispatchReportPath,
    cognitionDaily: cognitionDailyPath,
    swarmBenchmark: swarmBenchmarkPath,
    skillUtility: skillUtilityPath,
    remediationTaskPlan: outRemediationLatest
  };

  const generatedAt = deterministicIsoFromSeed(JSON.stringify({
    summary,
    metrics,
    deltas,
    thresholds,
    thresholdChecks: thresholdCheckSummary,
    regressionGates,
    thresholdBreaches,
    remediationPlan,
    artifactPaths
  }));

  const scorecard: Scorecard = {
    generatedAt,
    summary,
    metrics,
    deltas,
    thresholds,
    thresholdChecks: thresholdCheckSummary,
    regressionGates,
    thresholdBreaches,
    remediationPlan,
    remediationTaskArtifacts: [],
    artifactPaths
  };

  const remediationTaskPlan = buildRemediationTaskPlanArtifact(
    remediationPlan,
    thresholdBreaches,
    'cognition-core/reports/productivity-scorecard.latest.json'
  );
  scorecard.remediationTaskArtifacts = remediationTaskPlan.artifacts;

  const stamp = generatedAt.replace(/[:.]/g, '-');
  const outJsonStamped = path.join(repoRoot, `cognition-core/reports/productivity-scorecard-${stamp}.json`);
  const outRemediationStamped = path.join(repoRoot, `cognition-core/reports/remediation-tasks-${stamp}.json`);

  fs.mkdirSync(path.dirname(outJsonLatest), { recursive: true });
  fs.writeFileSync(outJsonLatest, JSON.stringify(scorecard, null, 2));
  fs.writeFileSync(outJsonStamped, JSON.stringify(scorecard, null, 2));
  fs.writeFileSync(outMdLatest, makeMarkdown(scorecard));
  fs.writeFileSync(outRemediationLatest, JSON.stringify(remediationTaskPlan, null, 2));
  fs.writeFileSync(outRemediationStamped, JSON.stringify(remediationTaskPlan, null, 2));

  console.log(`[productivity-scorecard] ${scorecard.summary.overall} index=${scorecard.summary.productivityIndex.toFixed(2)} generated`);
  console.log(`[productivity-scorecard] breaches=${scorecard.thresholdBreaches.length} remediation=${scorecard.remediationPlan.length}`);
  console.log(`[productivity-scorecard] json=${outJsonLatest}`);
  console.log(`[productivity-scorecard] md=${outMdLatest}`);
  console.log(`[productivity-scorecard] remediation=${outRemediationLatest}`);

  return scorecard;
}

const isMain = (() => {
  if (!process.argv[1]) return false;
  return path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
})();

if (isMain) {
  generateProductivityScorecard().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[productivity-scorecard] failed: ${message}`);
    process.exit(1);
  });
}
