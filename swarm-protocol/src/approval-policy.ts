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
    return value.toLowerCase().replace(/[_./:-]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function includesSideEffectIntent(taskRequest, sideEffectKeywords) {
    const text = normalizeText(taskRequest.task);
    if (!text) return false;

    return normalizeArray(sideEffectKeywords)
        .map((keyword) => normalizeText(keyword))
        .filter(Boolean)
        .some((keyword) => text.includes(keyword));
}

function collectStructuredIntentValues(context = {}) {
    if (!context || typeof context !== 'object') return [];

    const values = [];
    const add = (value) => {
        if (typeof value === 'string' && value.trim()) {
            values.push(value);
        }
    };

    add(context.action);
    add(context.actionType);
    add(context.intent);
    add(context.operation);
    add(context.command);
    add(context.tool);
    add(context.toolName);
    add(context.httpMethod);
    add(context.method);
    add(context.toolCall?.name);
    add(context.toolCall?.tool);
    add(context.toolCall?.toolName);
    add(context.toolCall?.function?.name);
    add(context.actionRequest?.action);
    add(context.actionRequest?.actionType);
    add(context.actionRequest?.operation);

    return values;
}

function hasStructuredSideEffectIntent(context = {}, sideEffectKeywords) {
    if (!context || typeof context !== 'object') return false;
    if (context.externalWrite === true || context.mutatesExternalState === true) {
        return true;
    }

    const normalizedKeywords = normalizeArray(sideEffectKeywords)
        .map((keyword) => normalizeText(keyword))
        .filter(Boolean);
    const normalizedValues = collectStructuredIntentValues(context)
        .map((value) => normalizeText(value))
        .filter(Boolean);

    if (normalizedValues.some((value) => ['post', 'put', 'patch', 'delete'].includes(value))) {
        return true;
    }

    return normalizedValues.some((value) => (
        normalizedKeywords.some((keyword) => value.includes(keyword))
    ));
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
        || hasStructuredSideEffectIntent(taskRequest.context, sideEffectKeywords)
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
