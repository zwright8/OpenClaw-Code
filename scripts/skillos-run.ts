import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

type JsonObject = Record<string, unknown>;

type CliArgs = {
  query: string;
  k: number;
  dryRun: boolean;
  outDir: string;
};

type StepRecord = {
  step: string;
  startedAt: string;
  finishedAt: string;
  durationMs: number;
  file: string;
};

const REPO_ROOT = process.cwd();

function parseArgs(argv: string[]): CliArgs {
  let query = '';
  let k = 8;
  let dryRun = true;
  let outDir = path.join('reports', 'skillos-run');

  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];

    if (token === '--query' && argv[i + 1]) {
      query = argv[i + 1];
      i += 1;
      continue;
    }

    if (token === '--k' && argv[i + 1]) {
      const parsed = Number(argv[i + 1]);
      if (Number.isFinite(parsed) && parsed > 0) k = Math.floor(parsed);
      i += 1;
      continue;
    }

    if (token === '--dry-run' && argv[i + 1]) {
      const value = argv[i + 1].toLowerCase();
      dryRun = !(value === 'false' || value === '0' || value === 'no');
      i += 1;
      continue;
    }

    if (token === '--outDir' && argv[i + 1]) {
      outDir = argv[i + 1];
      i += 1;
      continue;
    }
  }

  if (!query.trim()) {
    throw new Error('Missing required --query');
  }

  return {
    query: query.trim(),
    k,
    dryRun,
    outDir: path.resolve(REPO_ROOT, outDir)
  };
}

function isoNow(): string {
  return new Date().toISOString();
}

function stampForFile(iso: string): string {
  return iso.replace(/[:.]/g, '-');
}

function safeReadJson(filePath: string): JsonObject {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as JsonObject;
}

function writeStep(outDir: string, stamp: string, step: string, payload: JsonObject): string {
  const fileName = `${stamp}-${step}.json`;
  const filePath = path.join(outDir, fileName);
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  return filePath;
}

function runTsxScript(scriptName: string, args: string[]): { stdout: string; stderr: string } {
  const result = spawnSync('npx', ['tsx', scriptName, ...args], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  });

  if (result.status !== 0) {
    const stderr = (result.stderr ?? '').trim();
    const stdout = (result.stdout ?? '').trim();
    throw new Error(`${scriptName} failed (code=${result.status})\nstdout:\n${stdout}\nstderr:\n${stderr}`);
  }

  return {
    stdout: (result.stdout ?? '').trim(),
    stderr: (result.stderr ?? '').trim()
  };
}

function requireStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
}

function main() {
  const cli = parseArgs(process.argv);
  fs.mkdirSync(cli.outDir, { recursive: true });

  const runStartedAt = isoNow();
  const stamp = stampForFile(runStartedAt);
  const steps: StepRecord[] = [];

  const runStep = (step: string, fn: () => JsonObject): JsonObject => {
    const startedAt = isoNow();
    const startedMs = Date.now();
    const payload = fn();
    const finishedAt = isoNow();
    const finishedMs = Date.now();
    const file = writeStep(cli.outDir, stamp, step, payload);
    steps.push({
      step,
      startedAt,
      finishedAt,
      durationMs: finishedMs - startedMs,
      file: path.relative(REPO_ROOT, file)
    });
    return payload;
  };

  const routed = runStep('01-route-skills', () => {
    const { stdout } = runTsxScript('scripts/route-skills.ts', ['--query', cli.query, '--k', String(cli.k)]);
    const parsed = JSON.parse(stdout) as JsonObject;

    const results = Array.isArray(parsed.results) ? parsed.results : [];
    const selectedSkillNames = results
      .map((item) => (typeof item === 'object' && item !== null ? (item as Record<string, unknown>).skillName : null))
      .filter((name): name is string => typeof name === 'string');

    return {
      version: 1,
      step: 'route-skills',
      query: cli.query,
      k: cli.k,
      selectedSkillNames,
      routed: parsed
    };
  });

  const selectedSkillNames = requireStringArray(routed.selectedSkillNames);
  if (selectedSkillNames.length === 0) {
    throw new Error('route-skills returned no matches; cannot compile workflow');
  }

  const manifestPath = path.join(REPO_ROOT, 'skills', 'generated', 'skills.manifest.json');
  const manifestEntries = JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as Array<{ name?: string }>;
  const manifestNames = new Set(manifestEntries.map((entry) => entry.name).filter((name): name is string => typeof name === 'string'));
  const compileSkillNames = selectedSkillNames.filter((name) => manifestNames.has(name));
  if (compileSkillNames.length === 0) {
    throw new Error('route-skills returned no manifest-backed skills; cannot compile workflow');
  }

  const workflowPath = path.join(cli.outDir, `${stamp}-workflow.compiled.json`);
  const compile = runStep('02-compile-workflow', () => {
    const skillsArg = compileSkillNames.join(',');
    const { stdout } = runTsxScript('scripts/compile-workflow.ts', ['--skills', skillsArg, '--out', workflowPath]);
    const workflow = safeReadJson(workflowPath);
    return {
      version: 1,
      step: 'compile-workflow',
      selectedSkillNames: compileSkillNames,
      workflowPath: path.relative(REPO_ROOT, workflowPath),
      workflow,
      commandStdout: stdout
    };
  });

  const policyPath = path.join(REPO_ROOT, 'skills', 'state', 'execution-policy.json');
  if (!fs.existsSync(policyPath)) {
    throw new Error(`Fail-closed: execution policy file missing at ${policyPath}`);
  }

  const policyEvaluatedPath = path.join(cli.outDir, `${stamp}-workflow.policy-evaluated.json`);
  const policy = runStep('03-apply-execution-policy', () => {
    const { stdout } = runTsxScript('scripts/apply-execution-policy.ts', [
      '--workflow',
      workflowPath,
      '--policy',
      policyPath,
      '--out',
      policyEvaluatedPath
    ]);

    const evaluated = safeReadJson(policyEvaluatedPath);
    const nodePolicies = Array.isArray(evaluated.nodePolicies) ? evaluated.nodePolicies : [];
    const failClosedViolations = nodePolicies
      .map((item) => (typeof item === 'object' && item !== null ? (item as Record<string, unknown>) : null))
      .filter((node): node is Record<string, unknown> => node !== null)
      .filter((node) => {
        const reasons = Array.isArray(node.reasons) ? node.reasons : [];
        return reasons.some(
          (reason) =>
            typeof reason === 'string' &&
            (reason.startsWith('MISSING_RISK_METADATA') || reason === 'UNKNOWN_RISK_TIER')
        );
      })
      .map((node) => String(node.nodeId ?? 'unknown'));

    if (failClosedViolations.length > 0) {
      throw new Error(`Fail-closed: missing or unknown risk metadata for nodes: ${failClosedViolations.join(', ')}`);
    }

    return {
      version: 1,
      step: 'apply-execution-policy',
      policyPath: path.relative(REPO_ROOT, policyPath),
      policyEvaluatedPath: path.relative(REPO_ROOT, policyEvaluatedPath),
      evaluated,
      commandStdout: stdout
    };
  });

  const execution = runStep('04-execute', () => {
    const workflow = safeReadJson(workflowPath);
    const evaluated = safeReadJson(policyEvaluatedPath);
    const nodePolicies = Array.isArray(evaluated.nodePolicies) ? evaluated.nodePolicies : [];

    const plannedActions = nodePolicies
      .map((item) => (typeof item === 'object' && item !== null ? (item as Record<string, unknown>) : null))
      .filter((node): node is Record<string, unknown> => node !== null)
      .map((node) => ({
        nodeId: String(node.nodeId ?? 'unknown'),
        action: 'simulate',
        requiresHumanApproval: Boolean(node.requiresHumanApproval ?? true),
        allowedAutoActions: Array.isArray(node.allowedAutoActions) ? node.allowedAutoActions : ['dry-run']
      }))
      .sort((a, b) => a.nodeId.localeCompare(b.nodeId));

    return {
      version: 1,
      step: 'execute',
      mode: cli.dryRun ? 'dry-run' : 'stub-dispatch',
      dryRun: cli.dryRun,
      dispatchHooks: {
        enabled: !cli.dryRun,
        hookName: 'subagent-dispatch-stub',
        status: cli.dryRun ? 'skipped' : 'not-implemented'
      },
      workflowNodeCount: Number(workflow.nodeCount ?? 0),
      plannedActions
    };
  });

  const scorePath = path.join(REPO_ROOT, 'skills', 'state', 'skill-performance.json');
  const scoring = runStep('05-score-skill-runs', () => {
    const { stdout } = runTsxScript('scripts/score-skill-runs.ts', []);
    const score = safeReadJson(scorePath);
    return {
      version: 1,
      step: 'score-skill-runs',
      scorePath: path.relative(REPO_ROOT, scorePath),
      score,
      commandStdout: stdout
    };
  });

  const recommendationsPath = path.join(REPO_ROOT, 'skills', 'state', 'skill-promotion-recommendations.json');
  const recommendations = runStep('06-recommend-promotions', () => {
    const { stdout } = runTsxScript('scripts/recommend-promotions.ts', []);
    const recommendation = safeReadJson(recommendationsPath);
    return {
      version: 1,
      step: 'recommend-promotions',
      recommendationsPath: path.relative(REPO_ROOT, recommendationsPath),
      recommendations: recommendation,
      commandStdout: stdout
    };
  });

  const runCompletedAt = isoNow();
  const summary = {
    version: 1,
    run: {
      startedAt: runStartedAt,
      completedAt: runCompletedAt,
      stamp,
      query: cli.query,
      k: cli.k,
      dryRun: cli.dryRun,
      outDir: path.relative(REPO_ROOT, cli.outDir)
    },
    steps,
    outputs: {
      routeStep: path.basename(steps[0]?.file ?? ''),
      compileStep: path.basename(steps[1]?.file ?? ''),
      policyStep: path.basename(steps[2]?.file ?? ''),
      executeStep: path.basename(steps[3]?.file ?? ''),
      scoringStep: path.basename(steps[4]?.file ?? ''),
      recommendationsStep: path.basename(steps[5]?.file ?? '')
    },
    deterministicSummary: {
      selectedSkillNames: requireStringArray(routed.selectedSkillNames),
      workflowNodeCount: Number((compile.workflow as Record<string, unknown>)?.nodeCount ?? 0),
      plannedActionCount: Array.isArray(execution.plannedActions) ? execution.plannedActions.length : 0,
      scoredSkillCount: Number((scoring.score as Record<string, unknown>)?.skillCount ?? 0),
      promotionSummary: (recommendations.recommendations as Record<string, unknown>)?.summary ?? {}
    }
  };

  const indexPath = path.join(cli.outDir, `${stamp}-index.json`);
  fs.writeFileSync(indexPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');

  console.log(
    JSON.stringify(
      {
        ok: true,
        version: 1,
        summaryPath: path.relative(REPO_ROOT, indexPath),
        outDir: path.relative(REPO_ROOT, cli.outDir),
        stamp
      },
      null,
      2
    )
  );
}

main();
