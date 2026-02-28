import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

interface Scorecard {
  generatedAt: string;
  summary: {
    overall: 'strong' | 'improving' | 'needs_attention';
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
  };
  artifactPaths: Record<string, string>;
}

type JsonObject = Record<string, unknown>;

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

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function parseIsoMs(value: unknown): number | null {
  if (typeof value !== 'string') return null;
  const t = Date.parse(value);
  return Number.isFinite(t) ? t : null;
}

function toPct(v: number): number {
  return Number((clamp01(v) * 100).toFixed(2));
}

function makeMarkdown(scorecard: Scorecard): string {
  const m = scorecard.metrics;
  const d = scorecard.deltas;
  return `# Productivity Scorecard\n\nGenerated: ${scorecard.generatedAt}\n\n## Summary\n- Overall: **${scorecard.summary.overall}**\n- Productivity Index: **${scorecard.summary.productivityIndex.toFixed(1)} / 100**\n- Message: ${scorecard.summary.keyMessage}\n\n## Core Metrics\n- Cycle Time (cognition run): **${m.cycleTimeSec.toFixed(2)}s**\n- Automation Coverage (packaged+blocked over planned tasks): **${m.automationCoverage.toFixed(2)}%**\n- Dispatch Count: **${m.dispatchCount}**\n- Blocked Approvals: **${m.blockedApprovals}**\n- Cognition Outcome Success Rate: **${m.cognitionSuccessRate.toFixed(2)}%**\n- Swarm Simulation Success Rate: **${m.swarmSimSuccessRate.toFixed(2)}%**\n- Skill Utility Composite: **${m.skillUtilityComposite.toFixed(2)}%**\n\n## Improvement Deltas\n- Skill Utility Delta: **+${d.skillUtilityDelta.toFixed(2)}%**\n- Estimated Operator Step Reduction: **${d.stepReductionEstimate.toFixed(2)}%**\n\n## Artifacts\n- Run manifest: \`${scorecard.artifactPaths.runManifest}\`\n- Dispatch report: \`${scorecard.artifactPaths.dispatchReport}\`\n- Cognition daily: \`${scorecard.artifactPaths.cognitionDaily}\`\n- Swarm benchmark: \`${scorecard.artifactPaths.swarmBenchmark}\`\n- Skill utility scorecard: \`${scorecard.artifactPaths.skillUtility}\`\n`;
}

(async () => {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const repoRoot = path.resolve(scriptDir, '../..');

  const runManifestPath = path.join(repoRoot, 'cognition-core/reports/cognition-run.json');
  const dispatchReportPath = path.join(repoRoot, 'cognition-core/reports/cognition-dispatch.report.json');
  const cognitionDailyPath = path.join(repoRoot, 'cognition-core/reports/cognition-daily.json');
  const swarmBenchmarkPath = path.join(repoRoot, 'swarm-protocol/state/simulation-benchmark.json');
  const skillUtilityPath = path.join(repoRoot, 'skills/state/skills-utility-scorecard.json');

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

  const taskCount = num((planStats.taskCount ?? (dispatchStats.dagTaskCount as number | undefined)), 0);
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

  let overall: Scorecard['summary']['overall'] = 'needs_attention';
  if (productivityIndex >= 75) overall = 'strong';
  else if (productivityIndex >= 50) overall = 'improving';

  const keyMessage =
    cognitionSuccessRate < 0.5
      ? 'Execution velocity and utility are strong, but outcome success is still low; prioritize recommendation quality tuning.'
      : 'Execution and outcomes are converging; continue scaling automated dispatch with policy-gated approvals.';

  const scorecard: Scorecard = {
    generatedAt: new Date().toISOString(),
    summary: {
      overall,
      productivityIndex: Number(productivityIndex.toFixed(2)),
      keyMessage
    },
    metrics: {
      cycleTimeSec: Number(cycleTimeSec.toFixed(3)),
      automationCoverage: toPct(automationCoverage),
      dispatchCount,
      blockedApprovals: blocked,
      cognitionSuccessRate: toPct(cognitionSuccessRate),
      swarmSimSuccessRate: toPct(swarmSuccess),
      skillUtilityComposite: toPct(postComposite)
    },
    deltas: {
      skillUtilityDelta: toPct(postComposite - baselineComposite),
      stepReductionEstimate: toPct(stepReductionEstimate)
    },
    artifactPaths: {
      runManifest: runManifestPath,
      dispatchReport: dispatchReportPath,
      cognitionDaily: cognitionDailyPath,
      swarmBenchmark: swarmBenchmarkPath,
      skillUtility: skillUtilityPath
    }
  };

  const outJsonLatest = path.join(repoRoot, 'cognition-core/reports/productivity-scorecard.latest.json');
  const outMdLatest = path.join(repoRoot, 'cognition-core/reports/productivity-scorecard.latest.md');
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outJsonStamped = path.join(repoRoot, `cognition-core/reports/productivity-scorecard-${stamp}.json`);

  fs.mkdirSync(path.dirname(outJsonLatest), { recursive: true });
  fs.writeFileSync(outJsonLatest, JSON.stringify(scorecard, null, 2));
  fs.writeFileSync(outJsonStamped, JSON.stringify(scorecard, null, 2));
  fs.writeFileSync(outMdLatest, makeMarkdown(scorecard));

  console.log(`[productivity-scorecard] ${scorecard.summary.overall} index=${scorecard.summary.productivityIndex.toFixed(2)} generated`);
  console.log(`[productivity-scorecard] json=${outJsonLatest}`);
  console.log(`[productivity-scorecard] md=${outMdLatest}`);
})();
