import { TaskRequest } from './schemas.js';

const DEFAULT_BLOCKED_RISK_TAGS = [
    'malware',
    'credential_theft',
    'data_exfiltration',
    'self_harm'
];

const DEFAULT_BLOCKED_CAPABILITIES = [
    'destructive_shell',
    'credential_access',
    'mass_messaging'
];

const DEFAULT_BLOCKED_TASK_PATTERNS = [
    {
        name: 'malware_intent',
        pattern: /\b(ransomware|malware|botnet|keylogger)\b/i
    },
    {
        name: 'credential_exfiltration_intent',
        pattern: /\b(steal|exfiltrate)\b.{0,32}\b(password|credential|token)\b/i
    }
];

const DEFAULT_REDACTION_PATTERNS = [
    {
        name: 'openai_api_key',
        pattern: /sk-[A-Za-z0-9]{20,}/g,
        replacement: '[REDACTED:OPENAI_KEY]'
    },
    {
        name: 'aws_access_key',
        pattern: /AKIA[0-9A-Z]{16}/g,
        replacement: '[REDACTED:AWS_ACCESS_KEY]'
    },
    {
        name: 'api_key_assignment',
        pattern: /(api[_-]?key|token|secret)\s*[:=]\s*[^\s,;]+/gi,
        replacement: '$1=[REDACTED]'
    },
    {
        name: 'email',
        pattern: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,
        replacement: '[REDACTED:EMAIL]'
    }
];

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function normalizeStringList(values) {
    if (!Array.isArray(values)) return [];
    return [...new Set(values
        .filter((value) => typeof value === 'string')
        .map((value) => value.trim())
        .filter(Boolean)
    )];
}

function normalizeRegexPattern(item) {
    if (!item) return null;

    if (item instanceof RegExp) {
        return {
            name: item.source,
            pattern: item
        };
    }

    if (typeof item === 'string') {
        return {
            name: item,
            pattern: new RegExp(item, 'i')
        };
    }

    if (typeof item === 'object' && item.pattern instanceof RegExp) {
        return {
            name: typeof item.name === 'string' && item.name.trim()
                ? item.name.trim()
                : item.pattern.source,
            pattern: item.pattern,
            replacement: typeof item.replacement === 'string'
                ? item.replacement
                : undefined
        };
    }

    return null;
}

function normalizePolicyOptions(options = {}) {
    const blockedRiskTags = normalizeStringList(
        options.blockedRiskTags ?? DEFAULT_BLOCKED_RISK_TAGS
    ).map((tag) => tag.toLowerCase());

    const blockedCapabilities = normalizeStringList(
        options.blockedCapabilities ?? DEFAULT_BLOCKED_CAPABILITIES
    ).map((capability) => capability.toLowerCase());

    const blockedTaskPatterns = (
        options.blockedTaskPatterns ?? DEFAULT_BLOCKED_TASK_PATTERNS
    )
        .map(normalizeRegexPattern)
        .filter(Boolean);

    const redactionPatterns = (
        options.redactionPatterns ?? DEFAULT_REDACTION_PATTERNS
    )
        .map(normalizeRegexPattern)
        .filter(Boolean)
        .map((item) => ({
            ...item,
            replacement: typeof item.replacement === 'string'
                ? item.replacement
                : '[REDACTED]'
        }));

    const customRules = Array.isArray(options.customRules)
        ? options.customRules.filter((rule) => typeof rule === 'function')
        : [];

    return {
        blockedRiskTags: new Set(blockedRiskTags),
        blockedCapabilities: new Set(blockedCapabilities),
        blockedTaskPatterns,
        redactionPatterns,
        customRules,
        redactSensitiveData: options.redactSensitiveData !== false
    };
}

function redactString(value, redactionPatterns, path) {
    let output = value;
    const redactions = [];

    for (const patternDef of redactionPatterns) {
        const expression = new RegExp(patternDef.pattern.source, patternDef.pattern.flags);
        const matches = output.match(expression);
        if (!matches || matches.length === 0) continue;

        redactions.push({
            path,
            pattern: patternDef.name,
            count: matches.length
        });
        output = output.replace(expression, patternDef.replacement);
    }

    return {
        value: output,
        redactions
    };
}

function redactValue(value, redactionPatterns, path = 'root') {
    if (typeof value === 'string') {
        return redactString(value, redactionPatterns, path);
    }

    if (Array.isArray(value)) {
        const items = [];
        const redactions = [];
        for (let index = 0; index < value.length; index++) {
            const transformed = redactValue(value[index], redactionPatterns, `${path}[${index}]`);
            items.push(transformed.value);
            redactions.push(...transformed.redactions);
        }
        return {
            value: items,
            redactions
        };
    }

    if (value && typeof value === 'object') {
        const object = {};
        const redactions = [];
        for (const [key, child] of Object.entries(value)) {
            const transformed = redactValue(child, redactionPatterns, `${path}.${key}`);
            object[key] = transformed.value;
            redactions.push(...transformed.redactions);
        }
        return {
            value: object,
            redactions
        };
    }

    return {
        value,
        redactions: []
    };
}

function evaluateCustomRules(taskRequest, customRules) {
    const reasons = [];

    for (const rule of customRules) {
        const decision = rule(taskRequest);

        if (decision === false) {
            reasons.push({
                code: 'custom_rule_denied',
                reason: rule.name || 'custom_rule'
            });
            continue;
        }

        if (decision && typeof decision === 'object' && decision.deny === true) {
            reasons.push({
                code: decision.code || 'custom_rule_denied',
                reason: decision.reason || rule.name || 'custom_rule'
            });
        }
    }

    return reasons;
}

function evaluateDispatchPolicyWithConfig(taskRequestPayload, config) {
    const taskRequest = TaskRequest.parse(taskRequestPayload);
    const reasons = [];

    const riskTags = normalizeStringList(taskRequest.context?.riskTags)
        .map((tag) => tag.toLowerCase());
    for (const tag of riskTags) {
        if (config.blockedRiskTags.has(tag)) {
            reasons.push({
                code: 'blocked_risk_tag',
                reason: tag
            });
        }
    }

    const requiredCapabilities = normalizeStringList(taskRequest.context?.requiredCapabilities)
        .map((capability) => capability.toLowerCase());
    for (const capability of requiredCapabilities) {
        if (config.blockedCapabilities.has(capability)) {
            reasons.push({
                code: 'blocked_capability',
                reason: capability
            });
        }
    }

    for (const pattern of config.blockedTaskPatterns) {
        const expression = new RegExp(pattern.pattern.source, pattern.pattern.flags);
        if (expression.test(taskRequest.task)) {
            reasons.push({
                code: 'blocked_task_pattern',
                reason: pattern.name
            });
        }
    }

    reasons.push(...evaluateCustomRules(taskRequest, config.customRules));

    const redactions = [];
    let sanitized = {
        ...taskRequest
    };

    if (config.redactSensitiveData) {
        const redactedTask = redactString(taskRequest.task, config.redactionPatterns, 'task');
        sanitized.task = redactedTask.value;
        redactions.push(...redactedTask.redactions);

        if (taskRequest.context && typeof taskRequest.context === 'object') {
            const redactedContext = redactValue(taskRequest.context, config.redactionPatterns, 'context');
            sanitized.context = redactedContext.value;
            redactions.push(...redactedContext.redactions);
        }

        if (Array.isArray(taskRequest.constraints)) {
            const redactedConstraints = redactValue(
                taskRequest.constraints,
                config.redactionPatterns,
                'constraints'
            );
            sanitized.constraints = redactedConstraints.value;
            redactions.push(...redactedConstraints.redactions);
        }
    }

    sanitized = TaskRequest.parse(sanitized);

    return {
        allowed: reasons.length === 0,
        decision: reasons.length === 0 ? 'allow' : 'deny',
        reasons,
        redactions,
        taskRequest: clone(sanitized)
    };
}

export function evaluateDispatchPolicy(taskRequestPayload, options = {}) {
    const config = normalizePolicyOptions(options);
    return evaluateDispatchPolicyWithConfig(taskRequestPayload, config);
}

export function createDispatchPolicy(options = {}) {
    const normalized = normalizePolicyOptions(options);
    return (taskRequestPayload) => evaluateDispatchPolicyWithConfig(taskRequestPayload, normalized);
}

export const __dispatchPolicyInternals = {
    DEFAULT_BLOCKED_RISK_TAGS,
    DEFAULT_BLOCKED_CAPABILITIES,
    DEFAULT_BLOCKED_TASK_PATTERNS,
    DEFAULT_REDACTION_PATTERNS,
    normalizePolicyOptions,
    redactString,
    redactValue
};
