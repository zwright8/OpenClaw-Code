import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEFAULT_THRESHOLDS, type EvaluationThresholds } from '../src/learning/threshold-tuner.js';

type JsonObj = Record<string, unknown>;

type Recommendation = JsonObj & {
  recommendationId?: string;
  title?: string;
  riskTier?: string;
  verificationPlan?: JsonObj;
  confidence?: number;
  expectedSuccessProbability?: number;
};

function asObj(v: unknown): JsonObj {
  return v && typeof v === 'object' && !Array.isArray(v) ? (v as JsonObj) : {};
}

function asNum(v: unknown, fallback = 0): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function clamp(v: number, min = 0, max = 1): number {
  return Math.max(min, Math.min(max, v));
}

function round(v: number, d = 3): number {
  const f = 10 ** d;
  return Math.round(v * f) / f;
}

function readJson(filePath: string): JsonObj {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as JsonObj;
}

function readJsonl(filePath: string): JsonObj[] {
  if (!fs.existsSync(filePath)) return [];
  const lines = fs.readFileSync(filePath, 'utf8').split('\n').map((l) => l.trim()).filter(Boolean);
  const rows: JsonObj[] = [];
  for (const line of lines) {
    try {
      rows.push(JSON.parse(line) as JsonObj);
    } catch {
      // ignore malformed lines
    }
  }
  return rows;
}

function getThresholds(evaluationRoot: JsonObj): EvaluationThresholds {
  const tuned = asObj(asObj(evaluationRoot.thresholdTuning).thresholds);
  return {
    promotionSuccessRate: asNum(tuned.promotionSuccessRate, DEFAULT_THRESHOLDS.promotionSuccessRate),
    holdSuccessRate: asNum(tuned.holdSuccessRate, DEFAULT_THRESHOLDS.holdSuccessRate),
    demotionSuccessRate: asNum(tuned.demotionSuccessRate, DEFAULT_THRESHOLDS.demotionSuccessRate),
    confidenceFloor: asNum(tuned.confidenceFloor, DEFAULT_THRESHOLDS.confidenceFloor),
    minSampleSize: asNum(tuned.minSampleSize, DEFAULT_THRESHOLDS.minSampleSize),
    maxBrierScore: asNum(tuned.maxBrierScore, DEFAULT_THRESHOLDS.maxBrierScore),
    maxCalibrationGap: asNum(tuned.maxCalibrationGap, DEFAULT_THRESHOLDS.maxCalibrationGap)
  };
}

function riskBaseProbability(riskTier: string): number {
  switch (riskTier) {
    case 'low': return 0.78;
    case 'medium': return 0.68;
    case 'high': return 0.56;
    case 'critical': return 0.48;
    default: return 0.6;
  }
}

function toStatus(v: unknown): string {
  return String(v ?? '').trim().toLowerCase();
}

(function main() {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const repoRoot = path.resolve(scriptDir, '../..');

  const recommendationsPath = path.join(repoRoot, 'skills/state/cognition-recommendations.json');
  const evaluationPath = path.join(repoRoot, 'skills/state/cognition-evaluation.json');
  const outcomesPath = path.join(repoRoot, 'cognition-core/reports/swarm-outcomes.latest.jsonl');

  const recommendationsRoot = readJson(recommendationsPath);
  const evaluationRoot = readJson(evaluationPath);
  const outcomes = readJsonl(outcomesPath);
  const thresholds = getThresholds(evaluationRoot);

  const evalRows = (asObj(evaluationRoot.evaluation).recommendations as unknown[]) ?? [];
  const byRecommendation = new Map<string, JsonObj>();
  for (const row of evalRows) {
    const r = asObj(row);
    const id = String(r.recommendationId ?? '').trim();
    if (id) byRecommendation.set(id, r);
  }

  const failedTerminalByRec = new Map<string, number>();
  const blockedByRec = new Map<string, number>();
  for (const row of outcomes) {
    const recId = String(row.recommendationId ?? '').trim();
    if (!recId) continue;
    const status = toStatus(row.status);
    if (['failed', 'timed_out', 'rejected', 'transport_error'].includes(status)) {
      failedTerminalByRec.set(recId, (failedTerminalByRec.get(recId) ?? 0) + 1);
    }
    if (['awaiting_approval', 'approval_pending', 'blocked'].includes(status)) {
      blockedByRec.set(recId, (blockedByRec.get(recId) ?? 0) + 1);
    }
  }

  const recList = Array.isArray(recommendationsRoot.recommendations)
    ? (recommendationsRoot.recommendations as Recommendation[])
    : [];

  let tunedCount = 0;
  for (const rec of recList) {
    const recommendationId = String(rec.recommendationId ?? '').trim();
    if (!recommendationId) continue;

    const evalRow = byRecommendation.get(recommendationId) ?? {};
    const outcomesCount = asNum(evalRow.outcomes, 0);
    const successRate = asNum(evalRow.successRate, 0);
    const riskTier = String(rec.riskTier ?? 'medium').trim().toLowerCase();

    let expected = riskBaseProbability(riskTier);
    if (outcomesCount > 0) {
      expected = expected * 0.7 + successRate * 0.3;
    }

    const failedTerminal = failedTerminalByRec.get(recommendationId) ?? 0;
    const blocked = blockedByRec.get(recommendationId) ?? 0;

    if (failedTerminal > 0) expected -= 0.08;
    if (blocked > 0) expected -= 0.03;
    if (outcomesCount < thresholds.minSampleSize) {
      expected = Math.min(expected, thresholds.holdSuccessRate - 0.02);
    }

    rec.expectedSuccessProbability = round(clamp(expected, 0.2, 0.92));
    rec.confidence = round(clamp(Math.max(thresholds.confidenceFloor, rec.expectedSuccessProbability - 0.05), 0.4, 0.9));

    const verification = asObj(rec.verificationPlan);
    const checks = Array.isArray(verification.checks) ? verification.checks.map((v) => String(v)) : [];
    const thresholdChecks = [
      `threshold_check: sample_size >= ${thresholds.minSampleSize}`,
      `threshold_check: success_rate >= ${thresholds.holdSuccessRate}`,
      `threshold_check: brier_score <= ${thresholds.maxBrierScore}`,
      `threshold_check: calibration_gap <= ${thresholds.maxCalibrationGap}`,
      `threshold_check: confidence >= ${thresholds.confidenceFloor}`
    ];
    const mergedChecks = [...new Set([...checks, ...thresholdChecks])];

    rec.verificationPlan = {
      ...verification,
      checks: mergedChecks,
      thresholdFeedbackChecks: {
        minSampleSize: thresholds.minSampleSize,
        holdSuccessRate: thresholds.holdSuccessRate,
        maxBrierScore: thresholds.maxBrierScore,
        maxCalibrationGap: thresholds.maxCalibrationGap,
        confidenceFloor: thresholds.confidenceFloor,
        evaluatedAt: new Date().toISOString()
      }
    };

    tunedCount += 1;
  }

  recommendationsRoot.generatedAt = new Date().toISOString();
  recommendationsRoot.tuning = {
    strategy: 'strict-threshold-feedback-v1',
    tunedCount,
    source: {
      evaluationPath,
      outcomesPath
    }
  };

  fs.writeFileSync(recommendationsPath, `${JSON.stringify(recommendationsRoot, null, 2)}\n`);

  const audit = {
    generatedAt: new Date().toISOString(),
    failedOutcomeAudit: {
      totalOutcomeRows: outcomes.length,
      failedTerminalByRecommendation: Object.fromEntries(failedTerminalByRec.entries()),
      blockedByRecommendation: Object.fromEntries(blockedByRec.entries())
    },
    thresholds,
    tunedRecommendations: tunedCount,
    notes: [
      'Non-terminal approval-pending outcomes should not be treated as hard execution failures.',
      'Recommendation verification plans now include strict threshold feedback checks.'
    ]
  };

  const auditJson = path.join(repoRoot, 'cognition-core/reports/failed-outcome-audit.latest.json');
  const auditMd = path.join(repoRoot, 'cognition-core/reports/failed-outcome-audit.latest.md');
  fs.writeFileSync(auditJson, `${JSON.stringify(audit, null, 2)}\n`);
  fs.writeFileSync(
    auditMd,
    `# Failed Outcome Audit + Recommendation Tuning\n\nGenerated: ${audit.generatedAt}\n\n- Tuned recommendations: **${tunedCount}**\n- Outcomes rows inspected: **${outcomes.length}**\n- Strategy: **strict-threshold-feedback-v1**\n\n## Findings\n- Terminal failures by recommendation: \`${JSON.stringify(audit.failedOutcomeAudit.failedTerminalByRecommendation)}\`\n- Approval/blocked outcomes by recommendation: \`${JSON.stringify(audit.failedOutcomeAudit.blockedByRecommendation)}\`\n\n## Actions applied\n- Added threshold feedback checks to each recommendation verification plan\n- Tuned expected success probability + confidence using risk, outcomes, and stricter threshold caps\n- Preserved approval gates for high-risk recommendations\n`
  );

  console.log(`[tune-recommendations] tuned=${tunedCount}`);
  console.log(`[tune-recommendations] audit=${auditJson}`);
})();
