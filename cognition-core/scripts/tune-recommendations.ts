import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEFAULT_THRESHOLDS, type EvaluationThresholds } from '../src/learning/threshold-tuner.js';

type JsonObj = Record<string, unknown>;

type Recommendation = JsonObj & {
  recommendationId?: string;
  title?: string;
  riskTier?: string;
  owner?: string;
  requiresHumanApproval?: boolean;
  approvalStatus?: string;
  policyGate?: JsonObj;
  rollbackPlan?: JsonObj | string;
  verificationPlan?: JsonObj;
  confidence?: number;
  expectedSuccessProbability?: number;
};

type OutcomeSummary = {
  total: number;
  terminalSuccess: number;
  terminalFailure: number;
  blocked: number;
  pendingApproval: number;
  nonTerminal: number;
};

function asObj(v: unknown): JsonObj {
  return v && typeof v === 'object' && !Array.isArray(v) ? (v as JsonObj) : {};
}

function asNum(v: unknown, fallback = 0): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function asString(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

function asStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.map((item) => asString(item)).filter(Boolean);
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
  const lines = fs.readFileSync(filePath, 'utf8').split('\n').map((line) => line.trim()).filter(Boolean);
  const rows: JsonObj[] = [];
  for (const line of lines) {
    try {
      rows.push(JSON.parse(line) as JsonObj);
    } catch {
      // Ignore malformed rows to keep the tuner resilient.
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
    case 'medium': return 0.7;
    case 'high': return 0.58;
    case 'critical': return 0.5;
    default: return 0.62;
  }
}

function toStatus(v: unknown): string {
  return String(v ?? '').trim().toLowerCase();
}

function isTerminalSuccess(status: string): boolean {
  return status === 'completed' || status === 'partial';
}

function isTerminalFailure(status: string): boolean {
  return ['failed', 'timed_out', 'rejected', 'transport_error'].includes(status);
}

function isBlocked(status: string): boolean {
  return ['awaiting_approval', 'approval_pending', 'blocked'].includes(status);
}

function summarizeOutcomes(outcomes: JsonObj[]): Map<string, OutcomeSummary> {
  const byRecommendation = new Map<string, OutcomeSummary>();

  for (const row of outcomes) {
    const recommendationId = asString(row.recommendationId);
    if (!recommendationId) continue;

    const status = toStatus(row.status);
    const current = byRecommendation.get(recommendationId) ?? {
      total: 0,
      terminalSuccess: 0,
      terminalFailure: 0,
      blocked: 0,
      pendingApproval: 0,
      nonTerminal: 0
    };

    current.total += 1;

    if (isTerminalSuccess(status)) {
      current.terminalSuccess += 1;
    } else if (isTerminalFailure(status)) {
      current.terminalFailure += 1;
    } else {
      current.nonTerminal += 1;
      if (isBlocked(status)) {
        current.blocked += 1;
        if (status === 'awaiting_approval' || status === 'approval_pending') {
          current.pendingApproval += 1;
        }
      }
    }

    byRecommendation.set(recommendationId, current);
  }

  return byRecommendation;
}

function hasRollbackPlan(rec: Recommendation): boolean {
  if (typeof rec.rollbackPlan === 'string') return asString(rec.rollbackPlan).length > 0;

  const rollback = asObj(rec.rollbackPlan);
  const trigger = asString(rollback.trigger);
  const steps = asStringArray(rollback.steps);
  const actions = asStringArray(rollback.actions);
  return trigger.length > 0 || steps.length > 0 || actions.length > 0;
}

function normalizeApprover(approver: string): string {
  const trimmed = approver.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('agent:')) return trimmed.slice('agent:'.length);
  return trimmed.toLowerCase();
}

function requiredApprovers(rec: Recommendation): string[] {
  const gate = asObj(rec.policyGate);
  const passthrough = asObj(gate.passthrough);
  const direct = asStringArray(gate.requiredApprovers);
  const nested = asStringArray(passthrough.requiredApprovers);
  return [...new Set([...direct, ...nested].map(normalizeApprover).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function inferOwner(rec: Recommendation, riskTier: string, approvers: string[]): string {
  const existing = asString(rec.owner);
  if (existing) return existing;

  if (approvers.length > 0) {
    return `agent:${approvers[0]}`;
  }

  if (riskTier === 'high' || riskTier === 'critical') {
    return 'agent:ops:high-risk';
  }

  return 'agent:ops';
}

function buildQualityGaps(params: {
  rec: Recommendation;
  summary: OutcomeSummary;
  owner: string;
  rollbackReady: boolean;
  approvers: string[];
}): string[] {
  const { rec, summary, owner, rollbackReady, approvers } = params;
  const gaps: string[] = [];

  const terminalCount = summary.terminalSuccess + summary.terminalFailure;
  if (terminalCount === 0) gaps.push('no-terminal-outcomes');
  if (!owner) gaps.push('owner-missing');
  if (!rollbackReady) gaps.push('rollback-plan-missing');

  const requiresApproval = rec.requiresHumanApproval === true;
  const approvalStatus = toStatus(rec.approvalStatus);

  if (requiresApproval && approvers.length === 0) gaps.push('required-approvers-missing');
  if (requiresApproval && summary.pendingApproval > 0 && approvalStatus === 'pending') gaps.push('approval-bottleneck-pending');

  return gaps;
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
  const outcomesByRecommendation = summarizeOutcomes(outcomes);

  const evalRows = (asObj(evaluationRoot.evaluation).recommendations as unknown[]) ?? [];
  const byRecommendation = new Map<string, JsonObj>();
  for (const row of evalRows) {
    const record = asObj(row);
    const recommendationId = asString(record.recommendationId);
    if (recommendationId) byRecommendation.set(recommendationId, record);
  }

  const recList = Array.isArray(recommendationsRoot.recommendations)
    ? (recommendationsRoot.recommendations as Recommendation[])
    : [];

  const failedTerminalByRec = new Map<string, number>();
  const blockedByRec = new Map<string, number>();
  const qualityGapsByRecommendation: Record<string, string[]> = {};
  const diagnostics: JsonObj[] = [];
  const blockedApprovalQueue: JsonObj[] = [];

  let tunedCount = 0;

  for (const rec of recList) {
    const recommendationId = asString(rec.recommendationId);
    if (!recommendationId) continue;

    const riskTier = asString(rec.riskTier).toLowerCase() || 'medium';
    const summary = outcomesByRecommendation.get(recommendationId) ?? {
      total: 0,
      terminalSuccess: 0,
      terminalFailure: 0,
      blocked: 0,
      pendingApproval: 0,
      nonTerminal: 0
    };

    if (summary.terminalFailure > 0) failedTerminalByRec.set(recommendationId, summary.terminalFailure);
    if (summary.blocked > 0) blockedByRec.set(recommendationId, summary.blocked);

    const approvers = requiredApprovers(rec);
    const owner = inferOwner(rec, riskTier, approvers);
    rec.owner = owner;

    const rollbackReady = hasRollbackPlan(rec);
    const evalRow = byRecommendation.get(recommendationId) ?? {};
    const evalSuccessRate = asNum(evalRow.successRate, 0);
    const evalOutcomes = asNum(evalRow.outcomes, 0);
    const terminalCount = summary.terminalSuccess + summary.terminalFailure;
    const terminalSuccessRate = terminalCount > 0 ? summary.terminalSuccess / terminalCount : null;

    let expected = riskBaseProbability(riskTier);
    if (terminalSuccessRate !== null) {
      expected = expected * 0.55 + terminalSuccessRate * 0.45;
    } else if (evalOutcomes > 0) {
      expected = expected * 0.75 + evalSuccessRate * 0.25;
    }

    expected += owner ? 0.025 : -0.02;
    expected += rollbackReady ? 0.02 : -0.03;

    if (summary.terminalFailure > 0) {
      expected -= Math.min(0.16, summary.terminalFailure * 0.08);
    }

    const requiresApproval = rec.requiresHumanApproval === true;
    const approvalStatus = toStatus(rec.approvalStatus);
    const approvalTicket = asString(asObj(rec.policyGate).ticket) || asString(asObj(asObj(rec.policyGate).passthrough).ticket);

    if (requiresApproval && summary.pendingApproval > 0) {
      rec.approvalWorkflow = {
        status: approvalStatus || 'pending',
        requiredApprovers: approvers,
        ticket: approvalTicket || null,
        blockedTasks: summary.pendingApproval,
        nextAction: approvers.length > 0
          ? `Route approval follow-up to ${approvers.map((approver) => `agent:${approver}`).join(', ')}`
          : 'Attach requiredApprovers metadata and route to approval coordinator'
      };

      expected -= approvers.length > 0 ? 0.01 : 0.04;

      blockedApprovalQueue.push({
        recommendationId,
        approvalStatus: approvalStatus || 'pending',
        requiredApprovers: approvers,
        ticket: approvalTicket || null,
        pendingOutcomes: summary.pendingApproval,
        nextAction: asObj(rec.approvalWorkflow).nextAction
      });
    }

    if (terminalCount === 0) {
      const exploratoryCap =
        riskTier === 'low'
          ? thresholds.holdSuccessRate + 0.08
          : riskTier === 'medium'
            ? thresholds.holdSuccessRate + 0.04
            : thresholds.holdSuccessRate;
      expected = Math.min(expected, exploratoryCap);
    }

    rec.expectedSuccessProbability = round(clamp(expected, 0.25, 0.92));

    let confidence = thresholds.confidenceFloor;
    if (terminalCount >= thresholds.minSampleSize) confidence += 0.1;
    else if (terminalCount > 0) confidence += 0.03;
    if (summary.pendingApproval > 0) confidence -= 0.03;
    if (!rollbackReady) confidence -= 0.03;
    if (!owner) confidence -= 0.02;

    rec.confidence = round(clamp(Math.max(confidence, rec.expectedSuccessProbability - 0.08), 0.5, 0.92));

    const verification = asObj(rec.verificationPlan);
    const checks = Array.isArray(verification.checks) ? verification.checks.map((value) => String(value)) : [];

    const riskAwareSuccessThreshold =
      riskTier === 'high' || riskTier === 'critical'
        ? thresholds.promotionSuccessRate
        : thresholds.holdSuccessRate;

    const thresholdChecks = [
      `threshold_check: terminal_outcomes >= ${Math.min(3, thresholds.minSampleSize)}`,
      `threshold_check: sample_size >= ${thresholds.minSampleSize}`,
      `threshold_check: success_rate >= ${riskAwareSuccessThreshold}`,
      `threshold_check: brier_score <= ${thresholds.maxBrierScore}`,
      `threshold_check: calibration_gap <= ${thresholds.maxCalibrationGap}`,
      `threshold_check: confidence >= ${thresholds.confidenceFloor}`,
      'readiness_check: owner_assigned',
      'readiness_check: rollback_plan_present'
    ];

    if (requiresApproval) {
      thresholdChecks.push('approval_check: required_approvers_recorded');
      thresholdChecks.push('approval_check: ticket_attached_when_available');
      thresholdChecks.push('approval_check: no_execution_without_approval');
    }

    const mergedChecks = [...new Set([...checks, ...thresholdChecks])];

    rec.verificationPlan = {
      ...verification,
      checks: mergedChecks,
      thresholdFeedbackChecks: {
        minSampleSize: thresholds.minSampleSize,
        holdSuccessRate: thresholds.holdSuccessRate,
        promotionSuccessRate: thresholds.promotionSuccessRate,
        maxBrierScore: thresholds.maxBrierScore,
        maxCalibrationGap: thresholds.maxCalibrationGap,
        confidenceFloor: thresholds.confidenceFloor,
        riskAwareSuccessThreshold,
        evaluatedAt: new Date().toISOString()
      }
    };

    const qualityGaps = buildQualityGaps({
      rec,
      summary,
      owner,
      rollbackReady,
      approvers
    });

    if (qualityGaps.length > 0) {
      qualityGapsByRecommendation[recommendationId] = qualityGaps;
    }

    diagnostics.push({
      recommendationId,
      riskTier,
      owner,
      terminalOutcomes: terminalCount,
      terminalSuccesses: summary.terminalSuccess,
      terminalFailures: summary.terminalFailure,
      blockedOutcomes: summary.blocked,
      pendingApprovals: summary.pendingApproval,
      expectedSuccessProbability: rec.expectedSuccessProbability,
      confidence: rec.confidence,
      qualityGaps
    });

    tunedCount += 1;
  }

  recommendationsRoot.generatedAt = new Date().toISOString();
  recommendationsRoot.tuning = {
    strategy: 'strict-threshold-feedback-v2',
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
    qualityGaps: {
      byRecommendation: qualityGapsByRecommendation,
      global: [
        ...new Set(Object.values(qualityGapsByRecommendation).flat())
      ].sort((left, right) => left.localeCompare(right))
    },
    blockedApprovalQueue,
    thresholds,
    recommendationDiagnostics: diagnostics,
    tunedRecommendations: tunedCount,
    notes: [
      'Pending approvals remain fail-closed and are tracked as bottlenecks, not terminal failures.',
      'Approval-bottleneck recommendations now receive explicit approval workflow metadata and follow-up actions.',
      'Verification plans now include risk-aware threshold feedback and readiness checks.'
    ]
  };

  const auditJson = path.join(repoRoot, 'cognition-core/reports/failed-outcome-audit.latest.json');
  const auditMd = path.join(repoRoot, 'cognition-core/reports/failed-outcome-audit.latest.md');
  fs.writeFileSync(auditJson, `${JSON.stringify(audit, null, 2)}\n`);

  const topGapList = Object.entries(qualityGapsByRecommendation)
    .map(([recommendationId, gaps]) => `- ${recommendationId}: ${gaps.join(', ')}`)
    .join('\n') || '- none';

  const approvalQueueList = blockedApprovalQueue
    .map((entry) => {
      const recommendationId = asString(entry.recommendationId);
      const approvers = asStringArray(entry.requiredApprovers).map((approver) => `agent:${approver}`).join(', ') || 'unassigned';
      const ticket = asString(entry.ticket) || 'none';
      const pendingOutcomes = asNum(entry.pendingOutcomes, 0);
      return `- ${recommendationId}: pending=${pendingOutcomes}, approvers=${approvers}, ticket=${ticket}`;
    })
    .join('\n') || '- none';

  fs.writeFileSync(
    auditMd,
    `# Failed Outcome Audit + Recommendation Tuning\n\nGenerated: ${audit.generatedAt}\n\n- Tuned recommendations: **${tunedCount}**\n- Outcomes rows inspected: **${outcomes.length}**\n- Strategy: **strict-threshold-feedback-v2**\n\n## Findings\n- Terminal failures by recommendation: \`${JSON.stringify(audit.failedOutcomeAudit.failedTerminalByRecommendation)}\`\n- Approval/blocked outcomes by recommendation: \`${JSON.stringify(audit.failedOutcomeAudit.blockedByRecommendation)}\`\n\n## Recommendation quality gaps\n${topGapList}\n\n## Approval bottleneck queue\n${approvalQueueList}\n\n## Actions applied\n- Added risk-aware threshold feedback checks and readiness checks to each verification plan\n- Enriched blocked approval recommendations with explicit approval-workflow metadata and next actions\n- Tuned expected success probability + confidence using terminal outcomes, readiness quality, and approval bottleneck diagnostics\n- Preserved fail-closed policy gates for high-risk recommendations\n`
  );

  console.log(`[tune-recommendations] tuned=${tunedCount}`);
  console.log(`[tune-recommendations] audit=${auditJson}`);
})();
