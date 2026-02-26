import { createHash, randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    activate_compiled_policy: 'agent:policy',
    resolve_rule_conflict: 'agent:review',
    add_rule_test_case: 'agent:qa',
    publish_policy_changelog: 'agent:ops'
};

const RecommendationPriorityTaskMap = {
    P0: 'critical',
    P1: 'high',
    P2: 'normal',
    P3: 'low'
};

const SeverityRank = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1
};

const DecisionRank = {
    deny: 4,
    require_approval: 3,
    allow_with_sandbox: 2,
    allow: 1
};

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function safeNow(nowFn) {
    const value = Number(nowFn());
    return Number.isFinite(value) ? value : Date.now();
}

function safeNumber(value, fallback = 0) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : fallback;
}

function clamp(value, min = 0, max = 100) {
    return Math.max(min, Math.min(max, value));
}

function normalizeStringArray(value) {
    if (!Array.isArray(value)) return [];
    return value
        .filter((entry) => typeof entry === 'string' && entry.trim())
        .map((entry) => entry.trim());
}

function normalizeIntents(inputPayload) {
    const intents = Array.isArray(inputPayload?.intents)
        ? inputPayload.intents
        : [];

    return intents
        .filter((intent) => intent && typeof intent === 'object')
        .map((intent, index) => {
            const id = typeof intent.id === 'string' && intent.id.trim()
                ? intent.id.trim()
                : `intent-${index + 1}`;
            const name = typeof intent.name === 'string' && intent.name.trim()
                ? intent.name.trim()
                : `Intent ${index + 1}`;
            const scope = typeof intent.scope === 'string' && intent.scope.trim()
                ? intent.scope.trim()
                : 'global';
            const severity = typeof intent.severity === 'string' && SeverityRank[intent.severity.trim()]
                ? intent.severity.trim()
                : 'medium';
            const priority = clamp(safeNumber(intent.priority, 50));

            const conditionRaw = intent.condition && typeof intent.condition === 'object'
                ? intent.condition
                : {};
            const condition = {
                riskTagsAny: normalizeStringArray(conditionRaw.riskTagsAny),
                capabilitiesAny: normalizeStringArray(conditionRaw.capabilitiesAny),
                tenantsAny: normalizeStringArray(conditionRaw.tenantsAny),
                prioritiesAny: normalizeStringArray(conditionRaw.prioritiesAny),
                requiresApproval: conditionRaw.requiresApproval === true
            };

            const actionRaw = intent.action && typeof intent.action === 'object'
                ? intent.action
                : {};
            const decision = typeof actionRaw.decision === 'string' && DecisionRank[actionRaw.decision.trim()]
                ? actionRaw.decision.trim()
                : 'require_approval';
            const action = {
                decision,
                reviewerGroup: typeof actionRaw.reviewerGroup === 'string' && actionRaw.reviewerGroup.trim()
                    ? actionRaw.reviewerGroup.trim()
                    : null,
                sandboxProfile: typeof actionRaw.sandboxProfile === 'string' && actionRaw.sandboxProfile.trim()
                    ? actionRaw.sandboxProfile.trim()
                    : null,
                redactFields: normalizeStringArray(actionRaw.redactFields)
            };

            return {
                id,
                name,
                scope,
                severity,
                priority,
                condition,
                action
            };
        });
}

function conditionComplexity(condition) {
    return clamp(Math.round(
        condition.riskTagsAny.length * 12
        + condition.capabilitiesAny.length * 10
        + condition.tenantsAny.length * 8
        + condition.prioritiesAny.length * 7
        + (condition.requiresApproval ? 15 : 0)
    ));
}

function compileCondition(condition) {
    return {
        matchAny: {
            riskTags: [...condition.riskTagsAny],
            capabilities: [...condition.capabilitiesAny],
            tenants: [...condition.tenantsAny],
            priorities: [...condition.prioritiesAny]
        },
        requiresApproval: condition.requiresApproval
    };
}

function compileIntent(intent) {
    const compiledCondition = compileCondition(intent.condition);
    const precedenceScore = clamp(Math.round(
        SeverityRank[intent.severity] * 18
        + intent.priority * 0.6
        + DecisionRank[intent.action.decision] * 6
        + conditionComplexity(intent.condition) * 0.2
    ));
    const ruleFingerprint = createHash('sha1')
        .update(JSON.stringify({
            scope: intent.scope,
            condition: compiledCondition,
            action: intent.action
        }))
        .digest('hex')
        .slice(0, 12);

    return {
        ruleId: `rule-${intent.id}`,
        intentId: intent.id,
        name: intent.name,
        scope: intent.scope,
        severity: intent.severity,
        priority: intent.priority,
        precedenceScore,
        fingerprint: ruleFingerprint,
        compiledCondition,
        action: clone(intent.action),
        metadata: {
            complexity: conditionComplexity(intent.condition),
            decisionWeight: DecisionRank[intent.action.decision] || 0
        }
    };
}

function ruleOverlapScore(left, right) {
    let overlap = 0;
    const pairs = [
        [left.compiledCondition.matchAny.riskTags, right.compiledCondition.matchAny.riskTags],
        [left.compiledCondition.matchAny.capabilities, right.compiledCondition.matchAny.capabilities],
        [left.compiledCondition.matchAny.tenants, right.compiledCondition.matchAny.tenants],
        [left.compiledCondition.matchAny.priorities, right.compiledCondition.matchAny.priorities]
    ];
    for (const [a, b] of pairs) {
        if (a.length === 0 || b.length === 0) continue;
        const set = new Set(a);
        const shared = b.filter((entry) => set.has(entry)).length;
        if (shared > 0) overlap += clamp((shared / Math.max(a.length, b.length)) * 25, 0, 25);
    }
    if (left.scope === right.scope) overlap += 15;
    if (left.compiledCondition.requiresApproval === right.compiledCondition.requiresApproval) overlap += 10;
    return clamp(Math.round(overlap));
}

function detectConflicts(rules) {
    const conflicts = [];
    for (let i = 0; i < rules.length; i++) {
        for (let j = i + 1; j < rules.length; j++) {
            const left = rules[i];
            const right = rules[j];
            const overlapScore = ruleOverlapScore(left, right);
            if (overlapScore < 35) continue;
            if (left.action.decision === right.action.decision) continue;

            const severity = clamp(Math.round(
                overlapScore * 0.6
                + Math.abs(left.precedenceScore - right.precedenceScore) * 0.3
                + Math.abs(DecisionRank[left.action.decision] - DecisionRank[right.action.decision]) * 8
            ));

            conflicts.push({
                conflictId: `conflict-${randomUUID().slice(0, 8)}`,
                leftRuleId: left.ruleId,
                rightRuleId: right.ruleId,
                leftDecision: left.action.decision,
                rightDecision: right.action.decision,
                overlapScore,
                severity
            });
        }
    }

    return conflicts.sort((a, b) => b.severity - a.severity);
}

function summarizeRules(rules, conflicts) {
    const avgComplexity = rules.length > 0
        ? Number((rules.reduce((acc, rule) => acc + rule.metadata.complexity, 0) / rules.length).toFixed(2))
        : 0;
    const maxConflictSeverity = conflicts.length > 0 ? conflicts[0].severity : 0;
    const deniedCount = rules.filter((rule) => rule.action.decision === 'deny').length;
    const approvalCount = rules.filter((rule) => rule.action.decision === 'require_approval').length;

    let posture = 'compiled';
    if (maxConflictSeverity >= 75 || conflicts.length >= 3) posture = 'conflicted';
    else if (conflicts.length > 0) posture = 'review_required';

    return {
        ruleCount: rules.length,
        deniedCount,
        approvalCount,
        conflictCount: conflicts.length,
        maxConflictSeverity,
        avgComplexity,
        posture
    };
}

function buildAlerts(summary, rules, conflicts) {
    const alerts = [];
    if (summary.conflictCount > 0) alerts.push('governance_rule_conflict_detected');
    if (summary.maxConflictSeverity >= 75) alerts.push('governance_conflict_severe');
    if (summary.avgComplexity > 70) alerts.push('governance_rules_complexity_high');
    if (rules.some((rule) => rule.action.decision === 'allow' && rule.severity === 'critical')) {
        alerts.push('critical_intent_allows_without_guard');
    }
    if (conflicts.length === 0 && summary.ruleCount > 0) alerts.push('governance_compilation_ready');
    return alerts;
}

function buildRecommendations(summary, rules, conflicts, alerts) {
    const recommendations = [];

    if (summary.posture === 'compiled') {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'activate_compiled_policy',
            title: 'Activate compiled governance policy set',
            description: `Compiled ${summary.ruleCount} rules with no unresolved conflicts.`,
            priority: 'P1'
        });
    }

    for (const conflict of conflicts.slice(0, 5)) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'resolve_rule_conflict',
            conflictId: conflict.conflictId,
            title: `Resolve governance conflict ${conflict.conflictId}`,
            description: `Conflicting decisions (${conflict.leftDecision} vs ${conflict.rightDecision}) with severity ${conflict.severity}.`,
            priority: conflict.severity >= 75 ? 'P0' : 'P1'
        });
    }

    for (const rule of rules.filter((entry) => entry.metadata.complexity >= 65).slice(0, 5)) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'add_rule_test_case',
            ruleId: rule.ruleId,
            title: `Add policy test coverage for ${rule.name}`,
            description: `Rule complexity ${rule.metadata.complexity} warrants explicit regression tests.`,
            priority: 'P2'
        });
    }

    if (alerts.length > 0) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'publish_policy_changelog',
            title: 'Publish governance policy changelog',
            description: 'Document compiled rules, conflicts, and resolution decisions for operators.',
            priority: alerts.includes('governance_conflict_severe') ? 'P1' : 'P2'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations
        .sort((a, b) => {
            const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
            if (p !== 0) return p;
            return String(a.conflictId || a.ruleId || '').localeCompare(String(b.conflictId || b.ruleId || ''));
        })
        .filter((entry, index, arr) => arr.findIndex((other) => (
            other.type === entry.type
            && String(other.conflictId || '') === String(entry.conflictId || '')
            && String(other.ruleId || '') === String(entry.ruleId || '')
        )) === index);
}

export function compileGovernanceRules(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const intents = normalizeIntents(inputPayload || {});
    const rules = intents.map((intent) => compileIntent(intent))
        .sort((a, b) => {
            if (b.precedenceScore !== a.precedenceScore) return b.precedenceScore - a.precedenceScore;
            return String(a.ruleId).localeCompare(String(b.ruleId));
        });
    const conflicts = detectConflicts(rules);
    const summary = summarizeRules(rules, conflicts);
    const alerts = buildAlerts(summary, rules, conflicts);
    const recommendations = buildRecommendations(summary, rules, conflicts, alerts);

    return {
        at,
        summary,
        rules,
        conflicts,
        alerts,
        recommendations
    };
}

export function governanceRulesToTasks(reportPayload, {
    fromAgentId = 'agent:governance',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('governanceRulesToTasks requires report payload');
    }

    const recommendations = Array.isArray(reportPayload.recommendations)
        ? reportPayload.recommendations
        : [];
    const targets = {
        ...RecommendationTargetMap,
        ...(targetMap || {})
    };
    const nowMs = safeNow(Date.now);

    return recommendations.map((recommendation, index) => buildTaskRequest({
        id: randomUUID(),
        from: fromAgentId,
        target: targets[recommendation.type] || defaultTarget,
        priority: RecommendationPriorityTaskMap[recommendation.priority] || 'normal',
        task: `[${recommendation.priority}] ${recommendation.title}`,
        context: {
            recommendationType: recommendation.type,
            conflictId: recommendation.conflictId || null,
            ruleId: recommendation.ruleId || null,
            posture: reportPayload.summary?.posture || null,
            conflictCount: reportPayload.summary?.conflictCount || 0
        },
        createdAt: nowMs + index
    }));
}

export class GovernanceRuleCompiler {
    constructor({
        localAgentId = 'agent:governance',
        now = Date.now,
        maxHistory = 120
    } = {}) {
        this.localAgentId = localAgentId;
        this.now = typeof now === 'function' ? now : Date.now;
        this.maxHistory = Number.isInteger(maxHistory) && maxHistory > 0
            ? maxHistory
            : 120;
        this.history = [];
    }

    evaluate(inputPayload, options = {}) {
        const report = compileGovernanceRules(inputPayload, {
            now: this.now,
            ...options
        });
        this.history.push(report);
        if (this.history.length > this.maxHistory) {
            this.history.splice(0, this.history.length - this.maxHistory);
        }
        return clone(report);
    }

    buildTasks(reportPayload, options = {}) {
        return governanceRulesToTasks(reportPayload, {
            fromAgentId: this.localAgentId,
            ...options
        });
    }

    listHistory({ limit = 20 } = {}) {
        return this.history
            .slice(-Math.max(1, Number(limit) || 20))
            .map((entry) => clone(entry));
    }
}

export const __governanceRuleCompilerInternals = {
    normalizeIntents,
    compileIntent,
    detectConflicts,
    summarizeRules,
    buildRecommendations
};
