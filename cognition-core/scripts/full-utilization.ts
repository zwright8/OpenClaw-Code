import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

type LayerName = 'layer1' | 'layer2' | 'layer3';

type Step = {
  name: string;
  script: string;
  args?: string[];
  required?: boolean;
  captureJsonTo?: string;
};

type StepResult = {
  layer: LayerName;
  name: string;
  script: string;
  args: string[];
  required: boolean;
  status: 'ok' | 'failed' | 'skipped';
  code: number | null;
  startedAt: string;
  finishedAt: string;
  note?: string;
};

type RunOptions = {
  layer: 'all' | LayerName;
  help: boolean;
};

type JsonObj = Record<string, unknown>;

function printHelp(): void {
  console.log(`Run cognition-core full utilization workflow (Layer 1 + 2 + 3)

Usage:
  tsx scripts/full-utilization.ts [options]

Options:
  --layer <all|layer1|layer2|layer3>   Run only one layer or all (default: all)
  -h, --help                            Show help
`);
}

function parseArgs(argv: string[]): RunOptions {
  const options: RunOptions = {
    layer: 'all',
    help: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === '--help' || token === '-h') {
      options.help = true;
      continue;
    }

    if (token === '--layer') {
      const value = argv[index + 1];
      if (!value) {
        throw new Error('Missing value for --layer');
      }
      if (value !== 'all' && value !== 'layer1' && value !== 'layer2' && value !== 'layer3') {
        throw new Error(`Invalid --layer value: ${value}`);
      }
      options.layer = value;
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${token}`);
  }

  return options;
}

function ensureDir(filePath: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function readJsonIfExists(filePath: string): JsonObj | null {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as JsonObj;
  } catch {
    return null;
  }
}

function writeJson(filePath: string, payload: unknown): void {
  ensureDir(filePath);
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`);
}

function asNum(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function asStr(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asArr<T = unknown>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function runStep(cognitionCoreDir: string, layer: LayerName, step: Step): StepResult {
  const startedAt = new Date().toISOString();
  const args = step.args ?? [];
  const stepResult: StepResult = {
    layer,
    name: step.name,
    script: step.script,
    args,
    required: step.required === true,
    status: 'skipped',
    code: null,
    startedAt,
    finishedAt: startedAt
  };

  const scriptPath = path.join(cognitionCoreDir, step.script);
  if (!fs.existsSync(scriptPath)) {
    return {
      ...stepResult,
      status: step.required ? 'failed' : 'skipped',
      finishedAt: new Date().toISOString(),
      note: 'script_missing'
    };
  }

  const captureOutput = typeof step.captureJsonTo === 'string';

  const child = spawnSync('tsx', [step.script, ...args], {
    cwd: cognitionCoreDir,
    stdio: captureOutput ? 'pipe' : 'inherit',
    encoding: 'utf8'
  });

  const code = typeof child.status === 'number' ? child.status : 1;

  if (captureOutput) {
    if (child.stdout) process.stdout.write(child.stdout);
    if (child.stderr) process.stderr.write(child.stderr);

    if (code === 0 && step.captureJsonTo) {
      const payload = (child.stdout ?? '').trim();
      try {
        const parsed = JSON.parse(payload);
        writeJson(path.join(cognitionCoreDir, step.captureJsonTo), parsed);
      } catch {
        return {
          ...stepResult,
          code,
          status: 'failed',
          finishedAt: new Date().toISOString(),
          note: 'capture_json_parse_failed'
        };
      }
    }
  }

  return {
    ...stepResult,
    code,
    status: code === 0 ? 'ok' : 'failed',
    finishedAt: new Date().toISOString()
  };
}

function buildLayer2ExperimentBacklog(cognitionCoreDir: string): string {
  const auditPath = path.join(cognitionCoreDir, 'reports/failed-outcome-audit.latest.json');
  const learningPath = path.join(cognitionCoreDir, 'reports/learning-loop.layer2.json');
  const outPath = path.join(cognitionCoreDir, 'reports/experiment-backlog.layer2.json');

  const audit = readJsonIfExists(auditPath) ?? {};
  const learning = readJsonIfExists(learningPath) ?? {};

  const qualityGapsRoot = ((audit.qualityGaps ?? {}) as JsonObj).byRecommendation;
  const byRecommendation = (qualityGapsRoot && typeof qualityGapsRoot === 'object')
    ? (qualityGapsRoot as Record<string, unknown>)
    : {};

  const experiments: Array<Record<string, unknown>> = [];

  for (const [recommendationId, gapsRaw] of Object.entries(byRecommendation)) {
    const gaps = asArr<string>(gapsRaw)
      .map((item) => asStr(item).trim())
      .filter(Boolean);

    for (const gap of gaps) {
      if (gap === 'no-terminal-outcomes') {
        experiments.push({
          recommendationId,
          experimentId: `exp-terminal-outcome-${recommendationId}`,
          hypothesis: 'Adding explicit terminal-outcome checkpoints increases evaluable outcomes and lowers calibration gap.',
          change: 'Append terminal success/failure evidence tasks to recommendation execution.',
          successMetric: 'terminal_outcomes_per_recommendation >= 1 in next run',
          priority: 'high'
        });
      }

      if (gap === 'rollback-plan-missing') {
        experiments.push({
          recommendationId,
          experimentId: `exp-rollback-template-${recommendationId}`,
          hypothesis: 'Structured rollback templates reduce high-risk hesitation and improve dispatch confidence.',
          change: 'Inject rollback trigger + action list into recommendation metadata before dispatch.',
          successMetric: 'rollback_plan_missing gap cleared for recommendation',
          priority: 'high'
        });
      }

      if (gap === 'required-approvers-missing') {
        experiments.push({
          recommendationId,
          experimentId: `exp-approver-contract-${recommendationId}`,
          hypothesis: 'Explicit approver metadata shortens approval cycle time and prevents routing ambiguity.',
          change: 'Attach requiredApprovers + ticket and route follow-up task automatically.',
          successMetric: 'approval metadata completeness 100% for gated recs',
          priority: 'high'
        });
      }
    }
  }

  const learnedRecommendations = asArr<JsonObj>(learning.recommendations);
  for (const item of learnedRecommendations.slice(0, 3)) {
    experiments.push({
      recommendationId: asStr(item.recommendationId, 'global'),
      experimentId: `exp-learning-${experiments.length + 1}`,
      hypothesis: asStr(item.rationale, 'Counterfactual replay can improve success rate.'),
      change: asStr(item.action, 'Apply top replay recommendation in next dispatch cycle.'),
      successMetric: 'improve projected success rate in learning loop report',
      priority: asStr(item.priority, 'medium').toLowerCase()
    });
  }

  const backlog = {
    generatedAt: new Date().toISOString(),
    count: experiments.length,
    experiments
  };

  writeJson(outPath, backlog);
  return outPath;
}

function buildLayer3RoutingAndForecast(repoRoot: string, cognitionCoreDir: string): { routingPath: string; forecastPath: string } {
  const recommendationsPath = path.join(repoRoot, 'skills/state/cognition-recommendations.json');
  const auditPath = path.join(cognitionCoreDir, 'reports/failed-outcome-audit.latest.json');
  const dailyPath = path.join(cognitionCoreDir, 'reports/cognition-daily.json');
  const scorecardPath = path.join(cognitionCoreDir, 'reports/productivity-scorecard.latest.json');
  const learningPath = path.join(cognitionCoreDir, 'reports/learning-loop.layer2.json');

  const recommendationsRoot = readJsonIfExists(recommendationsPath) ?? {};
  const auditRoot = readJsonIfExists(auditPath) ?? {};
  const dailyRoot = readJsonIfExists(dailyPath) ?? {};
  const scorecardRoot = readJsonIfExists(scorecardPath) ?? {};
  const learningRoot = readJsonIfExists(learningPath) ?? {};

  const recs = asArr<JsonObj>(recommendationsRoot.recommendations);
  const gapsByRec = ((((auditRoot.qualityGaps ?? {}) as JsonObj).byRecommendation ?? {}) as Record<string, unknown>);

  const routes = recs.map((rec) => {
    const recommendationId = asStr(rec.recommendationId);
    const riskTier = asStr(rec.riskTier, 'medium');
    const owner = asStr(rec.owner, 'agent:ops');
    const requiresApproval = rec.requiresHumanApproval === true;
    const approvalStatus = asStr(rec.approvalStatus, 'pending').toLowerCase();
    const qualityGaps = asArr<string>(gapsByRec[recommendationId]).map((gap) => asStr(gap)).filter(Boolean);

    let target = owner;
    let priority: 'low' | 'normal' | 'high' | 'critical' = 'normal';
    let reason = 'default_owner_route';

    if (requiresApproval && approvalStatus !== 'approved') {
      const gate = (rec.policyGate ?? {}) as JsonObj;
      const passthrough = (gate.passthrough ?? {}) as JsonObj;
      const approvers = asArr<string>(passthrough.requiredApprovers).map((item) => asStr(item)).filter(Boolean);
      const approver = approvers[0];
      target = approver ? (approver.startsWith('agent:') ? approver : `agent:${approver}`) : 'agent:approval-coordinator';
      priority = riskTier === 'critical' || riskTier === 'high' ? 'critical' : 'high';
      reason = 'approval_gate_pending';
    } else if (riskTier === 'critical' || riskTier === 'high') {
      target = 'agent:ops:high-risk';
      priority = 'high';
      reason = 'risk_tier_route';
    } else if (qualityGaps.includes('no-terminal-outcomes')) {
      target = 'agent:experimentation';
      priority = 'normal';
      reason = 'terminal_outcome_gap_route';
    }

    return {
      recommendationId,
      target,
      priority,
      reason,
      qualityGaps,
      riskTier
    };
  });

  const routingArtifact = {
    generatedAt: new Date().toISOString(),
    mode: 'adaptive-routing-v1',
    count: routes.length,
    routes
  };

  const routingPath = path.join(cognitionCoreDir, 'reports/dispatch-routing.layer3.json');
  writeJson(routingPath, routingArtifact);

  const scoreboardRows = asArr<JsonObj>(((dailyRoot.scoreboard ?? {}) as JsonObj).rows);
  const calibrationRow = scoreboardRows.find((row) => asStr(row.metric) === 'calibration_gap') ?? {};
  const calibrationGap = asNum(calibrationRow.value, asNum(((dailyRoot.evaluation ?? {}) as JsonObj).metrics && (((dailyRoot.evaluation ?? {}) as JsonObj).metrics as JsonObj).calibrationGap));
  const calibrationTargetRaw = asStr(calibrationRow.target, '<= 0.20');
  const calibrationTarget = Number((calibrationTargetRaw.match(/[0-9.]+/) ?? ['0.2'])[0]);

  const productivityIndex = asNum(((scorecardRoot.summary ?? {}) as JsonObj).productivityIndex, 0);
  const overallStatus = asStr(((dailyRoot.summary ?? {}) as JsonObj).overall, 'unknown');

  const learned = asArr<JsonObj>(learningRoot.recommendations).slice(0, 5).map((item) => ({
    title: asStr(item.title, 'Learning recommendation'),
    action: asStr(item.action, 'Apply recommendation'),
    priority: asStr(item.priority, 'medium')
  }));

  const defaultPlaybook = [
    {
      title: 'Auto-append terminal evidence tasks on high-impact recommendations',
      action: 'Before dispatch, require at least one terminal success/failure checkpoint task.',
      priority: 'high'
    },
    {
      title: 'Approval-contract completeness gate',
      action: 'Block gated recommendations without requiredApprovers + ticket metadata.',
      priority: 'high'
    },
    {
      title: 'Rollback-template injection',
      action: 'Add rollback trigger/actions to every high-risk recommendation before dispatch.',
      priority: 'high'
    }
  ];

  const forecastArtifact = {
    generatedAt: new Date().toISOString(),
    forecastWindowHours: 24,
    current: {
      overallStatus,
      productivityIndex,
      calibrationGap,
      calibrationTarget
    },
    forecast: {
      projectedOverall: calibrationGap > calibrationTarget ? 'warn' : 'pass',
      confidence: calibrationGap > calibrationTarget ? 0.78 : 0.86,
      rationale: calibrationGap > calibrationTarget
        ? 'Calibration gap remains above target; metadata + terminal outcomes are still the bottleneck.'
        : 'Calibration and readiness checks are within threshold; expected stable pass status.'
    },
    nextActions: routes
      .filter((route) => route.reason !== 'default_owner_route')
      .slice(0, 6)
      .map((route) => ({
        recommendationId: route.recommendationId,
        action: `Route to ${route.target} (${route.reason})`,
        priority: route.priority
      })),
    playbookUpdates: learned.length > 0 ? learned : defaultPlaybook
  };

  const forecastPath = path.join(cognitionCoreDir, 'reports/strategy-forecast.layer3.json');
  writeJson(forecastPath, forecastArtifact);

  return { routingPath, forecastPath };
}

(function main() {
  try {
    const options = parseArgs(process.argv.slice(2));
    if (options.help) {
      printHelp();
      return;
    }

    const scriptDir = path.dirname(fileURLToPath(import.meta.url));
    const cognitionCoreDir = path.resolve(scriptDir, '..');
    const repoRoot = path.resolve(cognitionCoreDir, '..');

    const layerSteps: Record<LayerName, Step[]> = {
      layer1: [
        { name: 'pipeline_run', script: 'scripts/run.ts', args: ['--dispatch', 'true'], required: true },
        { name: 'outcomes_export', script: 'scripts/export-swarm-outcomes.ts', required: true },
        { name: 'evaluate', script: 'scripts/evaluate.ts', required: true },
        { name: 'tune_recommendations', script: 'scripts/tune-recommendations.ts', required: true },
        { name: 'report', script: 'scripts/report.ts', required: true },
        { name: 'scorecard', script: 'scripts/productivity-scorecard.ts', required: true }
      ],
      layer2: [
        {
          name: 'learning_loop',
          script: 'scripts/learn-from-outcomes.ts',
          args: [
            '--store',
            '../swarm-protocol/state/tasks.journal.jsonl',
            '--json',
            'reports/learning-loop.layer2.json',
            '--markdown',
            'reports/learning-loop.layer2.md'
          ],
          required: true
        },
        {
          name: 'history_analysis',
          script: 'scripts/analyze-history.ts',
          args: [
            '--days',
            '7',
            '--json',
            'reports/cognition-history.layer2.json',
            '--markdown',
            'reports/cognition-history.layer2.md',
            '--quiet'
          ],
          required: false
        },
        {
          name: 'remediation_plan',
          script: 'scripts/plan-remediation-tasks.ts',
          args: [
            '--report',
            'reports/productivity-scorecard.latest.json',
            '--out',
            'reports/remediation-tasks.layer2.json'
          ],
          required: false
        }
      ],
      layer3: [
        {
          name: 'status_snapshot',
          script: 'scripts/status.ts',
          args: ['--json'],
          required: true,
          captureJsonTo: 'reports/status.layer3.json'
        },
        {
          name: 'whatsapp_stability',
          script: 'scripts/whatsapp-stability.ts',
          args: ['--hours', '24', '--json', 'reports/whatsapp-stability.layer3.json', '--markdown', 'reports/whatsapp-stability.layer3.md'],
          required: false
        },
        {
          name: 'gateway_health_monitor',
          script: 'scripts/health-monitor.ts',
          required: false
        }
      ]
    };

    const layersToRun: LayerName[] = options.layer === 'all'
      ? ['layer1', 'layer2', 'layer3']
      : [options.layer];

    const results: StepResult[] = [];
    const derivedArtifacts: Record<string, string> = {};

    for (const layer of layersToRun) {
      console.log(`\n=== ${layer.toUpperCase()} ===`);
      const steps = layerSteps[layer];

      let stopLayer = false;
      for (const step of steps) {
        if (stopLayer) {
          results.push({
            layer,
            name: step.name,
            script: step.script,
            args: step.args ?? [],
            required: step.required === true,
            status: 'skipped',
            code: null,
            startedAt: new Date().toISOString(),
            finishedAt: new Date().toISOString(),
            note: 'skipped_after_required_failure'
          });
          continue;
        }

        const result = runStep(cognitionCoreDir, layer, step);
        results.push(result);

        if (result.status === 'failed' && result.required) {
          stopLayer = true;
          console.error(`[full-utilization] required step failed: ${layer}/${step.name}`);
        }
      }

      if (layer === 'layer2') {
        const experimentPath = buildLayer2ExperimentBacklog(cognitionCoreDir);
        derivedArtifacts.layer2ExperimentBacklog = experimentPath;
      }

      if (layer === 'layer3') {
        const derived = buildLayer3RoutingAndForecast(repoRoot, cognitionCoreDir);
        derivedArtifacts.layer3Routing = derived.routingPath;
        derivedArtifacts.layer3Forecast = derived.forecastPath;
      }
    }

    const failedRequired = results.some((item) => item.required && item.status !== 'ok');
    const summary = {
      generatedAt: new Date().toISOString(),
      mode: options.layer,
      status: failedRequired ? 'partial_failure' : 'ok',
      counts: {
        total: results.length,
        ok: results.filter((item) => item.status === 'ok').length,
        failed: results.filter((item) => item.status === 'failed').length,
        skipped: results.filter((item) => item.status === 'skipped').length
      },
      results,
      derivedArtifacts
    };

    const outPath = path.join(cognitionCoreDir, 'reports/cognition-full-utilization.latest.json');
    writeJson(outPath, summary);

    console.log(`\n[full-utilization] status=${summary.status}`);
    console.log(`[full-utilization] report=${outPath}`);
    for (const [key, value] of Object.entries(derivedArtifacts)) {
      console.log(`[full-utilization] ${key}=${value}`);
    }

    if (failedRequired) {
      process.exit(1);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[full-utilization] failed: ${message}`);
    process.exit(1);
  }
})();
