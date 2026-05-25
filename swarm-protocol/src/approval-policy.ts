import { TaskRequest } from './schemas.js';

function normalizeArray(value) {
    if (!Array.isArray(value)) return [];
    return [...new Set(value
        .filter((item) => typeof item === 'string')
        .map((item) => item.trim())
        .filter(Boolean)
    )];
}

function hasAny(a, b) {
    const setB = new Set(b);
    return a.some((item) => setB.has(item));
}

function normalizeText(value) {
    if (typeof value !== 'string') return '';
    return value.toLowerCase().replace(/\s+/g, ' ').trim();
}

function includesSideEffectIntent(taskRequest, sideEffectKeywords) {
    const text = normalizeText(taskRequest.task);
    if (!text) return false;

    return normalizeArray(sideEffectKeywords)
        .map((keyword) => normalizeText(keyword))
        .filter(Boolean)
        .some((keyword) => text.includes(keyword));
}

function hasDeclaredSideEffects(context = {}) {
    if (!context || typeof context !== 'object') return false;
    if (context.sideEffectRisk === true || context.requiresSideEffectApproval === true) {
        return true;
    }
    if (Array.isArray(context.sideEffects)) {
        return context.sideEffects.some((item) => typeof item === 'string' && item.trim());
    }
    return false;
}

export function evaluateApprovalPolicy(taskRequestPayload, config = {}) {
    const taskRequest = TaskRequest.parse(taskRequestPayload);

    const {
        criticalRequiresApproval = true,
        highPriorityRequiresApproval = false,
        highRiskTags = ['external_write', 'legal', 'finance', 'security'],
        sensitiveCapabilities = ['legal', 'finance', 'security', 'production-deploy'],
        sideEffectRequiresApproval = true,
        sideEffectKeywords = [
            'deploy',
            'delete',
            'remove',
            'send email',
            'transfer',
            'refund',
            'purchase',
            'rotate secret',
            'revoke access',
            'chmod',
            'rm -rf'
        ],
        reviewerGroup = 'human-review'
    } = config;

    const matches = [];
    const riskTags = normalizeArray(taskRequest.context?.riskTags);
    const requiredCapabilities = normalizeArray(taskRequest.context?.requiredCapabilities);
    const manualFlag = taskRequest.context?.requiresHumanApproval === true;

    if (criticalRequiresApproval && taskRequest.priority === 'critical') {
        matches.push('critical_priority');
    }
    if (highPriorityRequiresApproval && taskRequest.priority === 'high') {
        matches.push('high_priority');
    }
    if (hasAny(riskTags, highRiskTags)) {
        matches.push('high_risk_tag');
    }
    if (hasAny(requiredCapabilities, sensitiveCapabilities)) {
        matches.push('sensitive_capability');
    }
    if (sideEffectRequiresApproval && (
        hasDeclaredSideEffects(taskRequest.context)
        || includesSideEffectIntent(taskRequest, sideEffectKeywords)
    )) {
        matches.push('side_effect_intent');
    }
    if (manualFlag) {
        matches.push('manual_override');
    }

    const required = matches.length > 0;

    return {
        required,
        reviewerGroup: required ? reviewerGroup : null,
        matchedRules: matches,
        reason: required
            ? `approval_required:${matches.join(',')}`
            : null
    };
}

export function createApprovalPolicy(config = {}) {
    return (taskRequestPayload) => evaluateApprovalPolicy(taskRequestPayload, config);
}
