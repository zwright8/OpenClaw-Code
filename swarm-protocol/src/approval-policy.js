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

export function evaluateApprovalPolicy(taskRequestPayload, config = {}) {
    const taskRequest = TaskRequest.parse(taskRequestPayload);

    const {
        criticalRequiresApproval = true,
        highPriorityRequiresApproval = false,
        highRiskTags = ['external_write', 'legal', 'finance', 'security'],
        sensitiveCapabilities = ['legal', 'finance', 'security', 'production-deploy'],
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
