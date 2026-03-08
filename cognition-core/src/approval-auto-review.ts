import {
    FileTaskStore,
    TaskOrchestrator
} from '../../swarm-protocol/runtime.js';
import {
    createFileOutboxTransport,
    isCognitionPlannedRecord
} from './queue-dispatcher.js';

const DEFAULT_ALLOW_RULES = ['critical_priority'];
const DEFAULT_DENY_RULES = ['high_risk_tag', 'sensitive_capability', 'manual_override'];

function normalizeText(input) {
    if (typeof input !== 'string') return '';
    return input.trim().toLowerCase();
}

function sortByRequestedAtAsc(records) {
    return [...records].sort((a, b) => {
        const left = Number(a?.approval?.requestedAt ?? a?.createdAt ?? 0);
        const right = Number(b?.approval?.requestedAt ?? b?.createdAt ?? 0);
        return left - right;
    });
}

function normalizeRuleList(values) {
    if (!Array.isArray(values)) return [];
    return [...new Set(values
        .map((value) => normalizeText(value))
        .filter(Boolean))];
}

function extractMatchedRules(record) {
    const explicit = normalizeRuleList(record?.approval?.matchedRules);
    if (explicit.length > 0) return explicit;

    const reason = normalizeText(record?.approval?.reason);
    if (!reason.startsWith('approval_required:')) return [];
    const raw = reason.slice('approval_required:'.length);
    return normalizeRuleList(raw.split(','));
}

export function evaluateAutoApprovalDecision(
    record,
    {
        includeNonCognition = false,
        denyUnsupported = false,
        allowUnmatchedRules = false,
        allowRules = DEFAULT_ALLOW_RULES,
        denyRules = DEFAULT_DENY_RULES
    } = {}
) {
    if (!record || typeof record !== 'object' || typeof record.taskId !== 'string') {
        return {
            action: 'skip',
            reason: 'invalid_record',
            matchedRules: []
        };
    }
    if (record.status !== 'awaiting_approval') {
        return {
            action: 'skip',
            reason: `invalid_status:${record.status || 'unknown'}`,
            matchedRules: []
        };
    }
    if (!includeNonCognition && !isCognitionPlannedRecord(record)) {
        return {
            action: 'skip',
            reason: 'non_cognition_record',
            matchedRules: []
        };
    }

    const matchedRules = extractMatchedRules(record);
    const allowSet = new Set(normalizeRuleList(allowRules));
    const denySet = new Set(normalizeRuleList(denyRules));

    if (matchedRules.length === 0 && !allowUnmatchedRules) {
        return {
            action: 'skip',
            reason: 'no_matched_rules',
            matchedRules
        };
    }

    for (const rule of matchedRules) {
        if (denySet.has(rule)) {
            return {
                action: denyUnsupported ? 'deny' : 'skip',
                reason: `blocked_rule:${rule}`,
                matchedRules
            };
        }
    }

    for (const rule of matchedRules) {
        if (!allowSet.has(rule)) {
            return {
                action: denyUnsupported ? 'deny' : 'skip',
                reason: `unsupported_rule:${rule}`,
                matchedRules
            };
        }
    }

    return {
        action: 'approve',
        reason: matchedRules.length > 0
            ? `auto_approved:${matchedRules.join(',')}`
            : 'auto_approved:no_rules',
        matchedRules
    };
}

function incrementReason(map, reason) {
    map[reason] = (map[reason] || 0) + 1;
}

export async function autoReviewAwaitingApprovals({
    storePath,
    outboxDir,
    localAgentId = 'agent:main',
    reviewer = 'agent:auto-review',
    limit = 25,
    dryRun = false,
    includeNonCognition = false,
    denyUnsupported = false,
    allowUnmatchedRules = false,
    allowRules = DEFAULT_ALLOW_RULES,
    denyRules = DEFAULT_DENY_RULES
}) {
    if (!storePath || typeof storePath !== 'string') {
        throw new Error('storePath is required');
    }
    if (!outboxDir || typeof outboxDir !== 'string') {
        throw new Error('outboxDir is required');
    }

    const store = new FileTaskStore({ filePath: storePath });
    const orchestrator = new TaskOrchestrator({
        localAgentId,
        transport: createFileOutboxTransport({ outboxDir }),
        store
    });

    const hydration = await orchestrator.hydrate();
    const pendingAll = sortByRequestedAtAsc(orchestrator.listPendingApprovals());
    const selected = pendingAll.slice(0, Math.max(1, Number(limit) || 25));

    const result = {
        stats: {
            loaded: hydration.loaded,
            pendingTotal: pendingAll.length,
            selected: selected.length,
            approved: 0,
            denied: 0,
            skipped: 0,
            dispatchedAfterApproval: 0,
            approvalFailed: 0,
            dryRun
        },
        approvedTaskIds: [],
        deniedTaskIds: [],
        skipped: [],
        failed: [],
        decisionReasons: {}
    };

    for (const record of selected) {
        const decision = evaluateAutoApprovalDecision(record, {
            includeNonCognition,
            denyUnsupported,
            allowUnmatchedRules,
            allowRules,
            denyRules
        });
        incrementReason(result.decisionReasons, decision.reason);

        if (decision.action === 'skip') {
            result.stats.skipped++;
            result.skipped.push({
                taskId: record.taskId,
                reason: decision.reason,
                matchedRules: decision.matchedRules
            });
            continue;
        }

        if (dryRun) {
            if (decision.action === 'approve') {
                result.stats.approved++;
                result.approvedTaskIds.push(record.taskId);
            } else {
                result.stats.denied++;
                result.deniedTaskIds.push(record.taskId);
            }
            continue;
        }

        try {
            // eslint-disable-next-line no-await-in-loop
            const reviewed = await orchestrator.reviewTask(record.taskId, {
                approved: decision.action === 'approve',
                reviewer,
                reason: decision.reason
            });

            if (decision.action === 'approve') {
                result.stats.approved++;
                result.approvedTaskIds.push(record.taskId);
                if (reviewed?.status === 'dispatched'
                    || reviewed?.status === 'acknowledged'
                    || reviewed?.status === 'retry_scheduled') {
                    result.stats.dispatchedAfterApproval++;
                }
            } else {
                result.stats.denied++;
                result.deniedTaskIds.push(record.taskId);
            }
        } catch (error) {
            result.stats.approvalFailed++;
            result.failed.push({
                taskId: record.taskId,
                reason: error.message
            });
        }
    }

    if (!dryRun) {
        await orchestrator.flush();
    }

    return result;
}
