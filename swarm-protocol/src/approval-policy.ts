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
    add(context.toolCall?.type);
    add(context.toolCall?.kind);
    add(context.toolCall?.arguments?.command);
    add(context.toolCall?.arguments?.operation);
    add(context.toolCall?.arguments?.action);
    add(context.toolCall?.input?.command);
    add(context.toolCall?.input?.operation);
    add(context.toolCall?.input?.action);
    add(context.toolCall?.args?.command);
    add(context.toolCall?.args?.operation);
    add(context.toolCall?.args?.action);
    add(context.hostedTool?.name);
    add(context.hostedTool?.type);
    add(context.hostedTool?.kind);
    add(context.builtInTool?.name);
    add(context.builtInTool?.type);
    add(context.builtInTool?.kind);
    add(context.executionTool?.name);
    add(context.executionTool?.type);
    add(context.executionTool?.kind);
    add(context.actionRequest?.action);
    add(context.actionRequest?.actionType);
    add(context.actionRequest?.operation);

    return values;
}

function usesGuardrailGapTool(context = {}, guardrailGapToolNames = []) {
    if (!context || typeof context !== 'object') return false;
    if (
        context.hostedTool === true
        || context.builtInTool === true
        || context.executionTool === true
        || context.toolGuardrailsApply === false
    ) {
        return true;
    }

    const normalizedToolNames = normalizeArray(guardrailGapToolNames)
        .map((name) => normalizeText(name))
        .filter(Boolean);
    if (normalizedToolNames.length === 0) return false;

    return collectStructuredIntentValues(context)
        .map((value) => normalizeText(value))
        .filter(Boolean)
        .some((value) => normalizedToolNames.some((toolName) => value.includes(toolName)));
}

function hasHandoffBoundaryRisk(context = {}) {
    if (!context || typeof context !== 'object') return false;
    const handoff = context.handoff ?? context.taskHandoff ?? context.delegation;
    if (!handoff || typeof handoff !== 'object') return false;

    if (
        handoff.requiresApproval === true
        || handoff.external === true
        || handoff.crossTrustBoundary === true
        || handoff.sharesConversationHistory === true
        || handoff.inputFilterApplied === false
        || handoff.inputFiltered === false
    ) {
        return true;
    }

    const trustBoundary = normalizeText(
        handoff.trustBoundary
        ?? handoff.boundary
        ?? handoff.targetTrust
        ?? handoff.targetTrustLevel
    );
    if (['external', 'untrusted', 'third party', 'third-party', 'partner'].includes(trustBoundary)) {
        return true;
    }

    return false;
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
        guardrailGapToolRequiresApproval = true,
        handoffBoundaryRequiresApproval = true,
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
        guardrailGapToolNames = [
            'computerTool',
            'computer tool',
            'shellTool',
            'shell tool',
            'applyPatchTool',
            'apply patch tool',
            'hostedMCPTool',
            'hosted mcp tool',
            'hosted tool',
            'codeInterpreterTool',
            'code interpreter',
            'codex tool'
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
    if (
        guardrailGapToolRequiresApproval
        && usesGuardrailGapTool(taskRequest.context, guardrailGapToolNames)
    ) {
        matches.push('guardrail_gap_tool');
    }
    if (
        handoffBoundaryRequiresApproval
        && hasHandoffBoundaryRisk(taskRequest.context)
    ) {
        matches.push('handoff_boundary');
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
