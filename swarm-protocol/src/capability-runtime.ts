const ToTasksPattern = /ToTasks$/;
const UppercaseIdentifierPattern = /^[A-Z]/;

const EvaluatePrefixOrder = [
    'evaluate',
    'run',
    'manage',
    'plan',
    'optimize',
    'orchestrate',
    'forecast',
    'prioritize',
    'enforce',
    'govern',
    'resolve',
    'route',
    'calibrate',
    'correct',
    'consolidate',
    'synthesize',
    'compose',
    'coordinate',
    'detect',
    'audit',
    'map',
    'bridge',
    'translate',
    'simulate',
    'decompose',
    'compile',
    'build',
    'auto',
    'launch',
    'monitor',
    'recommend',
    'support',
    'facilitate',
    'mediate',
    'stress',
    'verify',
    'adapt'
];

function normalizeCapabilityIdRaw(value: string): string {
    if (typeof value !== 'string') return '';
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .replace(/_+/g, '_');
}

function capabilityTokens(capabilityId: string): string[] {
    return capabilityId
        .split('_')
        .map((token) => token.trim())
        .filter(Boolean);
}

function scoreEvaluateExport(name: string, tokens: string[]): number {
    const lower = name.toLowerCase();
    let score = 0;

    for (let i = 0; i < EvaluatePrefixOrder.length; i++) {
        if (lower.startsWith(EvaluatePrefixOrder[i])) {
            score += 12 - Math.min(i, 11);
            break;
        }
    }

    for (const token of tokens) {
        if (lower.includes(token)) {
            score += 4;
        }
    }

    if (ToTasksPattern.test(name)) score -= 50;
    if (name.startsWith('__')) score -= 40;
    if (UppercaseIdentifierPattern.test(name)) score -= 20;

    return score;
}

function listFunctionExportNames(modulePayload: Record<string, unknown>): string[] {
    return Object.entries(modulePayload)
        .filter(([, value]) => typeof value === 'function')
        .map(([name]) => name)
        .sort((a, b) => a.localeCompare(b));
}

function selectEvaluateExportName(
    capabilityId: string,
    modulePayload: Record<string, unknown>
): string {
    const functionExportNames = listFunctionExportNames(modulePayload);
    const candidates = functionExportNames
        .filter((name) => !ToTasksPattern.test(name))
        .filter((name) => !name.startsWith('__'))
        .filter((name) => !UppercaseIdentifierPattern.test(name));

    const scoped = candidates.length > 0 ? candidates : functionExportNames;
    if (scoped.length === 0) {
        throw new Error(`Capability ${capabilityId} has no callable function exports`);
    }

    const tokens = capabilityTokens(capabilityId);
    const scored = scoped
        .map((name) => ({
            name,
            score: scoreEvaluateExport(name, tokens)
        }))
        .sort((left, right) => right.score - left.score || left.name.localeCompare(right.name));

    return scored[0].name;
}

function selectToTasksExportName(modulePayload: Record<string, unknown>): string | null {
    const functionExportNames = listFunctionExportNames(modulePayload);
    const toTasks = functionExportNames
        .filter((name) => ToTasksPattern.test(name))
        .sort((a, b) => a.localeCompare(b));

    return toTasks[0] || null;
}

export function normalizeCapabilityId(value: string): string {
    return normalizeCapabilityIdRaw(value);
}

export function capabilityIdToModuleBasename(capabilityId: string): string {
    const normalized = normalizeCapabilityId(capabilityId);
    if (!normalized) {
        throw new Error('capabilityId is required');
    }
    return normalized.replace(/_/g, '-');
}

export function resolveCapabilityModuleSpecifier(capabilityId: string): string {
    const moduleBasename = capabilityIdToModuleBasename(capabilityId);
    return new URL(`./${moduleBasename}.js`, import.meta.url).href;
}

export type CapabilityExecutionOptions = {
    evaluateOptions?: Record<string, unknown>;
    toTasksOptions?: Record<string, unknown>;
    abortSignal?: {
        aborted: boolean;
        reason?: unknown;
    };
};

export type CapabilityExecutionResult = {
    capabilityId: string;
    moduleSpecifier: string;
    evaluateExportName: string;
    toTasksExportName: string | null;
    report: unknown;
    followupTasks: unknown[];
};

function isAbortSignalLike(value: unknown): value is { aborted: boolean; reason?: unknown; } {
    if (!value || typeof value !== 'object') return false;
    return typeof (value as { aborted?: unknown; }).aborted === 'boolean';
}

function toAbortError(signal: { aborted: boolean; reason?: unknown; } | null): Error {
    const reason = signal?.reason;
    if (reason instanceof Error) {
        return reason;
    }
    const error = new Error('Capability execution aborted.');
    (error as Error & { name: string; }).name = 'AbortError';
    return error;
}

function throwIfAborted(signal: { aborted: boolean; reason?: unknown; } | null): void {
    if (!signal || !signal.aborted) return;
    throw toAbortError(signal);
}

function resolveAbortSignal(options: CapabilityExecutionOptions): { aborted: boolean; reason?: unknown; } | null {
    if (isAbortSignalLike(options.abortSignal)) {
        return options.abortSignal;
    }
    if (isAbortSignalLike(options.evaluateOptions?.abortSignal)) {
        return options.evaluateOptions.abortSignal;
    }
    if (isAbortSignalLike(options.evaluateOptions?.signal)) {
        return options.evaluateOptions.signal;
    }
    if (isAbortSignalLike(options.toTasksOptions?.abortSignal)) {
        return options.toTasksOptions.abortSignal;
    }
    if (isAbortSignalLike(options.toTasksOptions?.signal)) {
        return options.toTasksOptions.signal;
    }
    return null;
}

function mergeOptionsWithAbortSignal(
    options: Record<string, unknown> | undefined,
    abortSignal: { aborted: boolean; reason?: unknown; } | null
): Record<string, unknown> {
    if (!abortSignal) {
        return options || {};
    }
    const base = options || {};
    if (base.abortSignal || base.signal) {
        return base;
    }
    return {
        ...base,
        abortSignal,
        signal: abortSignal
    };
}

export async function executeCapabilityById(
    capabilityId: string,
    inputPayload: Record<string, unknown> = {},
    options: CapabilityExecutionOptions = {}
): Promise<CapabilityExecutionResult> {
    const normalizedCapabilityId = normalizeCapabilityId(capabilityId);
    if (!normalizedCapabilityId) {
        throw new Error('capabilityId is required');
    }
    const abortSignal = resolveAbortSignal(options);
    throwIfAborted(abortSignal);

    const moduleSpecifier = resolveCapabilityModuleSpecifier(normalizedCapabilityId);

    let modulePayload: Record<string, unknown>;
    try {
        modulePayload = await import(moduleSpecifier) as Record<string, unknown>;
    } catch (error) {
        throw new Error(
            `Unable to load capability module for ${normalizedCapabilityId} (${moduleSpecifier}): ${error.message}`
        );
    }

    const evaluateExportName = selectEvaluateExportName(normalizedCapabilityId, modulePayload);
    const evaluateFn = modulePayload[evaluateExportName] as ((
        payload: Record<string, unknown>,
        options?: Record<string, unknown>
    ) => unknown);

    if (typeof evaluateFn !== 'function') {
        throw new Error(`Capability ${normalizedCapabilityId} evaluate export ${evaluateExportName} is not callable`);
    }

    const report = await evaluateFn(
        inputPayload,
        mergeOptionsWithAbortSignal(options.evaluateOptions, abortSignal)
    );
    throwIfAborted(abortSignal);

    const toTasksExportName = selectToTasksExportName(modulePayload);
    const followupTasks = toTasksExportName
        ? await (modulePayload[toTasksExportName] as (
            reportPayload: unknown,
            options?: Record<string, unknown>
        ) => unknown[])(report, mergeOptionsWithAbortSignal(options.toTasksOptions, abortSignal))
        : [];
    throwIfAborted(abortSignal);

    return {
        capabilityId: normalizedCapabilityId,
        moduleSpecifier,
        evaluateExportName,
        toTasksExportName,
        report,
        followupTasks: Array.isArray(followupTasks) ? followupTasks : []
    };
}
