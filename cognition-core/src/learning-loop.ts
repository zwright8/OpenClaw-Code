function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function mean(values) {
    if (!Array.isArray(values) || values.length === 0) return 0;
    return values.reduce((acc, value) => acc + value, 0) / values.length;
}

function round(value, decimals = 4) {
    if (!Number.isFinite(value)) return value;
    return Number(value.toFixed(decimals));
}

function normalizeText(input) {
    if (typeof input !== 'string') return '';
    return input.trim().toLowerCase();
}

function normalizeStringArray(input) {
    if (!Array.isArray(input)) return [];
    return [...new Set(input
        .map((item) => normalizeText(typeof item === 'string' ? item : String(item)))
        .filter(Boolean))];
}

function compactList(values) {
    return values.filter((value) => value !== null && value !== undefined && value !== '');
}

function hasText(value) {
    return typeof value === 'string' && value.trim().length > 0;
}

function countEvidenceItems(outcome) {
    const evidenceSources = [
        outcome.evidence,
        outcome.traces,
        outcome.traceEvents,
        outcome.result?.evidence,
        outcome.result?.traces,
        outcome.result?.traceEvents,
        outcome.result?.metrics?.evidence,
        outcome.context?.evidence
    ];

    return evidenceSources.reduce((total, source) => {
        if (Array.isArray(source)) return total + source.length;
        if (source && typeof source === 'object') return total + Object.keys(source).length;
        if (hasText(source)) return total + 1;
        return total;
    }, 0);
}

function collectTraceEvents(outcome) {
    const sources = [
        outcome.traceEvents,
        outcome.traces,
        outcome.spans,
        outcome.result?.traceEvents,
        outcome.result?.traces,
        outcome.result?.spans,
        outcome.result?.metrics?.traceEvents,
        outcome.context?.traceEvents
    ];

    return sources.flatMap((source) => (Array.isArray(source) ? source : []));
}

function eventValue(event, path) {
    if (!event || typeof event !== 'object') return null;
    return path.reduce((cursor, key) => (
        cursor && typeof cursor === 'object' ? cursor[key] : null
    ), event);
}

function firstString(values) {
    return compactList(values)
        .map((item) => (typeof item === 'string' ? item.trim() : null))
        .filter(Boolean)[0] || null;
}

function parseTraceparent(value) {
    if (typeof value !== 'string') return null;
    const match = value.trim().match(/^([0-9a-f]{2})-([0-9a-f]{32})-([0-9a-f]{16})-([0-9a-f]{2})(?:-.+)?$/i);
    if (!match) return null;
    const [, version, traceId, parentSpanId, traceFlags] = match;
    if (/^0+$/.test(traceId) || /^0+$/.test(parentSpanId)) return null;
    return {
        version: version.toLowerCase(),
        traceId: traceId.toLowerCase(),
        parentSpanId: parentSpanId.toLowerCase(),
        traceFlags: traceFlags.toLowerCase()
    };
}

function traceparentFromCarrier(carrier) {
    if (!carrier || typeof carrier !== 'object') return null;
    return parseTraceparent(firstString([
        carrier.traceparent,
        carrier.traceParent,
        carrier.Traceparent,
        carrier.TraceParent,
        carrier.headers?.traceparent,
        carrier.headers?.traceParent,
        carrier.headers?.Traceparent,
        carrier.headers?.TraceParent,
        carrier.attributes?.traceparent,
        carrier.attributes?.traceParent,
        carrier.context?.traceparent,
        carrier.context?.traceParent,
        carrier.metadata?.traceparent,
        carrier.metadata?.traceParent
    ]));
}

function traceIdentity(event, fallbackTraceparent = null) {
    const traceparent = traceparentFromCarrier(event) || fallbackTraceparent;
    const traceId = firstString([
        event?.traceId,
        event?.trace_id,
        event?.traceID,
        eventValue(event, ['context', 'trace_id']),
        eventValue(event, ['context', 'traceId']),
        eventValue(event, ['spanContext', 'traceId']),
        eventValue(event, ['span_context', 'trace_id']),
        eventValue(event, ['attributes', 'trace_id']),
        eventValue(event, ['attributes', 'traceId'])
    ]) || traceparent?.traceId || null;
    const spanId = firstString([
        event?.spanId,
        event?.span_id,
        event?.spanID,
        event?.id,
        eventValue(event, ['context', 'span_id']),
        eventValue(event, ['context', 'spanId']),
        eventValue(event, ['spanContext', 'spanId']),
        eventValue(event, ['span_context', 'span_id']),
        eventValue(event, ['attributes', 'span_id']),
        eventValue(event, ['attributes', 'spanId'])
    ]) || null;
    const parentSpanId = firstString([
        event?.parentSpanId,
        event?.parent_span_id,
        event?.parentSpanID,
        event?.parent?.spanId,
        event?.parent?.span_id,
        event?.parentSpanContext?.spanId,
        event?.parentSpanContext?.span_id,
        event?.parent_span_context?.spanId,
        event?.parent_span_context?.span_id,
        eventValue(event, ['context', 'parent_span_id']),
        eventValue(event, ['context', 'parentSpanId']),
        eventValue(event, ['context', 'parent', 'span_id']),
        eventValue(event, ['context', 'parent', 'spanId']),
        eventValue(event, ['attributes', 'parent_span_id']),
        eventValue(event, ['attributes', 'parentSpanId']),
        eventValue(event, ['attributes', 'parent.span_id']),
        eventValue(event, ['attributes', 'parent.spanId'])
    ]) || traceparent?.parentSpanId || null;

    return {
        traceId,
        spanId,
        parentSpanId,
        hasTraceparent: traceparent !== null
    };
}

function classifyTraceEventKind(event) {
    if (!event || typeof event !== 'object') return null;
    const rawValues = compactList([
        event.kind,
        event.type,
        event.category,
        event.name,
        event.spanType,
        eventValue(event, ['attributes', 'gen_ai.operation.name']),
        eventValue(event, ['attributes', 'gen_ai.tool.type']),
        eventValue(event, ['span_data', 'type']),
        eventValue(event, ['spanData', 'type']),
        eventValue(event, ['data', 'sdk_span_type']),
        eventValue(event, ['data', 'type'])
    ]);
    const kind = normalizeText(rawValues.join(' '));
    if (!kind) return null;
    if (kind.includes('tool')) return 'tool';
    if (kind.includes('function') || kind.includes('execute_tool')) return 'tool';
    if (kind.includes('handoff') || kind.includes('delegate') || kind.includes('subagent')) return 'handoff';
    if (kind.includes('guardrail') || kind.includes('safety') || kind.includes('policy')) return 'guardrail';
    return 'other';
}

function summarizeTraceEvents(outcome) {
    const events = collectTraceEvents(outcome);
    const fallbackTraceparent = traceparentFromCarrier(outcome)
        || traceparentFromCarrier(outcome?.request)
        || traceparentFromCarrier(outcome?.context)
        || traceparentFromCarrier(outcome?.result)
        || traceparentFromCarrier(outcome?.result?.metrics);
    const identities = [];
    const spanIdsByTrace = new Map();
    const counts = {
        total: events.length,
        tool: 0,
        handoff: 0,
        guardrail: 0,
        other: 0,
        traceparent: 0,
        linked: 0,
        orphaned: 0,
        danglingParent: 0,
        missingTraceId: 0,
        missingSpanId: 0
    };

    for (const event of events) {
        const kind = classifyTraceEventKind(event) || 'other';
        counts[kind]++;
        const identity = traceIdentity(event, fallbackTraceparent);
        identities.push(identity);
        if (identity.traceId && identity.spanId) {
            if (!spanIdsByTrace.has(identity.traceId)) {
                spanIdsByTrace.set(identity.traceId, new Set());
            }
            spanIdsByTrace.get(identity.traceId).add(identity.spanId);
        }
        if (identity.hasTraceparent) counts.traceparent++;
        if (!identity.traceId) counts.missingTraceId++;
        if (!identity.spanId) counts.missingSpanId++;
    }

    for (const identity of identities) {
        if (identity.traceId && identity.spanId && identity.parentSpanId) {
            const parentIsTraceRoot = fallbackTraceparent?.traceId === identity.traceId
                && fallbackTraceparent?.parentSpanId === identity.parentSpanId;
            const parentObserved = spanIdsByTrace.get(identity.traceId)?.has(identity.parentSpanId) === true;
            if (!parentIsTraceRoot && !parentObserved) {
                counts.danglingParent++;
                counts.orphaned++;
                continue;
            }
            counts.linked++;
        } else if (!identity.traceId || !identity.spanId || identity.parentSpanId) {
            counts.orphaned++;
        }
    }

    return counts;
}

function deriveTraceId(outcome) {
    const explicit = firstString([
        outcome.traceId,
        outcome.trace_id,
        outcome.traceID,
        outcome.request?.traceId,
        outcome.request?.trace_id,
        outcome.context?.traceId,
        outcome.context?.trace_id,
        outcome.result?.traceId,
        outcome.result?.trace_id,
        outcome.result?.metrics?.traceId,
        outcome.result?.metrics?.trace_id,
        traceparentFromCarrier(outcome)?.traceId,
        traceparentFromCarrier(outcome.request)?.traceId,
        traceparentFromCarrier(outcome.context)?.traceId,
        traceparentFromCarrier(outcome.result)?.traceId,
        traceparentFromCarrier(outcome.result?.metrics)?.traceId
    ]);

    if (explicit) return explicit;

    for (const event of collectTraceEvents(outcome)) {
        const candidate = traceIdentity(event).traceId;
        if (candidate) return candidate;
    }

    return null;
}

const FAILURE_STATUSES = new Set([
    'timed_out',
    'rejected',
    'transport_error',
    'failed'
]);

const TERMINAL_STATUSES = new Set([
    'completed',
    'partial',
    ...FAILURE_STATUSES
]);

const KNOWN_ISSUE_CATEGORIES = [
    'timeout',
    'transport',
    'rejection',
    'execution_failure',
    'unknown_failure'
];

const PRIORITY_WEIGHT = {
    critical: 1.15,
    high: 1,
    normal: 0.85,
    low: 0.7
};

const SKILL_FOCUS_PLAYBOOK = {
    timeout: {
        focus: 'timeout_resilience',
        label: 'Timeout resilience',
        priority: 'P1',
        keywords: [
            'auto-retry-and-backoff-coordinator',
            'risk-aware-scheduler',
            'tool-health-monitor'
        ],
        action: 'Tune timeout budgets, apply jittered retry/backoff, and route long-running work to resilient workers.'
    },
    transport: {
        focus: 'transport_reliability',
        label: 'Transport reliability',
        priority: 'P1',
        keywords: [
            'tool-health-monitor',
            'disaster-recovery-orchestrator',
            'signal-ingestion-normalizer'
        ],
        action: 'Add transport heartbeat monitoring, failover routing, and retry-safe idempotency guards.'
    },
    rejection: {
        focus: 'routing_and_constraints',
        label: 'Routing and constraints',
        priority: 'P2',
        keywords: [
            'policy-constraint-compiler',
            'human-approval-router',
            'task-handoff-contractor'
        ],
        action: 'Refine request constraints, improve capability matching, and tighten preflight validation before dispatch.'
    },
    execution_failure: {
        focus: 'failure_root_cause',
        label: 'Failure root-cause mining',
        priority: 'P1',
        keywords: [
            'failure-root-cause-miner',
            'regression-sentinel',
            'continuous-improvement-planner'
        ],
        action: 'Cluster execution failures by signature, patch dominant failure classes, and gate rollout behind regression checks.'
    },
    unknown_failure: {
        focus: 'error_observability',
        label: 'Error observability',
        priority: 'P2',
        keywords: [
            'evidence-provenance-tracker',
            'kpi-dashboard-publisher',
            'context-window-prioritizer'
        ],
        action: 'Capture structured error codes/contexts and enforce richer tracing for unresolved failures.'
    }
};

const OUTCOME_BOOTSTRAP_PLAYBOOK = {
    focus: 'outcome_telemetry_bootstrap',
    label: 'Outcome telemetry bootstrap',
    priority: 'P1',
    keywords: [
        'signal-ingestion-normalizer',
        'kpi-dashboard-publisher',
        'evidence-provenance-tracker'
    ],
    action: 'Backfill execution outcomes into the task journal, enforce terminal status writes, and run synthetic failure drills to seed learning data.'
};

function classifyIssue(status, errorCode, errorMessage) {
    const normalizedStatus = normalizeText(status);
    const code = normalizeText(errorCode);
    const message = normalizeText(errorMessage);

    if (normalizedStatus === 'timed_out' || code.includes('timeout') || message.includes('timeout') || message.includes('deadline')) {
        return 'timeout';
    }
    if (normalizedStatus === 'transport_error' || code.includes('transport') || code.includes('network') || message.includes('connection')) {
        return 'transport';
    }
    if (normalizedStatus === 'rejected' || code.includes('rejected') || message.includes('rejected') || message.includes('denied')) {
        return 'rejection';
    }
    if (normalizedStatus === 'failed' || code.includes('failed') || message.includes('exception') || message.includes('stack') || message.includes('error')) {
        return 'execution_failure';
    }
    if (FAILURE_STATUSES.has(normalizedStatus)) {
        return 'unknown_failure';
    }
    return 'none';
}

function normalizeErrorSignature(outcome) {
    if (!FAILURE_STATUSES.has(outcome.status)) return null;
    const issue = outcome.issueCategory === 'none' ? 'unknown_failure' : outcome.issueCategory;
    const tool = normalizeText(outcome.toolName || 'general');
    const code = normalizeText(outcome.errorCode);
    const rawMessage = normalizeText(outcome.errorMessage);
    const message = rawMessage
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 5)
        .join('_');
    const discriminator = code || message || 'unspecified';
    return `${issue}:${tool}:${discriminator}`;
}

function collectSkillHints(outcome) {
    const hints = compactList([
        ...(Array.isArray(outcome?.request?.context?.requiredCapabilities)
            ? outcome.request.context.requiredCapabilities
            : []),
        ...(Array.isArray(outcome?.request?.context?.capabilities)
            ? outcome.request.context.capabilities
            : []),
        ...(Array.isArray(outcome?.request?.constraints?.requiredCapabilities)
            ? outcome.request.constraints.requiredCapabilities
            : []),
        ...(Array.isArray(outcome?.context?.skillHints)
            ? outcome.context.skillHints
            : [])
    ]);

    return normalizeStringArray(hints);
}

function normalizeOutcome(outcome, index) {
    if (!outcome || typeof outcome !== 'object') {
        throw new Error(`Invalid outcome at index ${index}`);
    }

    const taskId = typeof outcome.taskId === 'string'
        ? outcome.taskId
        : (typeof outcome.id === 'string' ? outcome.id : `unknown-${index}`);
    const target = typeof outcome.target === 'string'
        ? outcome.target
        : (typeof outcome.request?.target === 'string' ? outcome.request.target : 'unassigned');
    const status = normalizeText(
        typeof outcome.status === 'string'
            ? outcome.status
            : (typeof outcome.result?.status === 'string' ? outcome.result.status : 'unknown')
    ) || 'unknown';
    const attempts = Number.isFinite(Number(outcome.attempts)) ? Number(outcome.attempts) : 0;
    const priority = normalizeText(
        typeof outcome.request?.priority === 'string'
            ? outcome.request.priority
            : (typeof outcome.priority === 'string' ? outcome.priority : 'normal')
    ) || 'normal';
    const createdAtRaw = compactList([outcome.createdAt, outcome.request?.createdAt])[0];
    const closedAtRaw = compactList([outcome.closedAt, outcome.updatedAt, outcome.result?.completedAt])[0];
    const createdAt = Number.isFinite(Number(createdAtRaw)) ? Number(createdAtRaw) : null;
    const closedAt = Number.isFinite(Number(closedAtRaw)) ? Number(closedAtRaw) : null;

    const toolName = normalizeText(compactList([
        outcome.toolName,
        outcome.request?.context?.toolName,
        outcome.request?.context?.tool,
        outcome.lastError?.toolName
    ])[0]) || 'general';

    const errorCode = normalizeText(compactList([
        outcome.errorCode,
        outcome.lastError?.code,
        outcome.result?.errorCode,
        outcome.result?.metrics?.errorCode
    ])[0]) || null;

    const errorMessage = compactList([
        outcome.errorMessage,
        outcome.lastError?.message,
        outcome.result?.output?.error,
        outcome.result?.output,
        outcome.reason
    ]).map((item) => typeof item === 'string' ? item.trim() : null).filter(Boolean)[0] || null;

    const issueCategory = classifyIssue(status, errorCode, errorMessage);
    const traceId = deriveTraceId(outcome);
    const evidenceCount = countEvidenceItems(outcome);
    const traceEvents = summarizeTraceEvents(outcome);

    const normalized = {
        taskId,
        target,
        status,
        attempts,
        priority,
        createdAt,
        closedAt,
        latencyMs: createdAt !== null && closedAt !== null
            ? Math.max(0, closedAt - createdAt)
            : null,
        toolName,
        errorCode,
        errorMessage,
        issueCategory,
        skillHints: collectSkillHints(outcome),
        traceId,
        evidenceCount,
        traceEvents,
        hasTrace: traceId !== null,
        hasEvidence: evidenceCount > 0,
        hasTraceEvents: traceEvents.total > 0,
        hasToolTrace: traceEvents.tool > 0,
        hasGuardrailTrace: traceEvents.guardrail > 0,
        hasHandoffTrace: traceEvents.handoff > 0,
        hasErrorDetail: status === 'completed' || status === 'partial' || Boolean(errorCode || errorMessage),
        isFailure: FAILURE_STATUSES.has(status),
        isTerminal: TERMINAL_STATUSES.has(status)
    };

    normalized.errorSignature = normalizeErrorSignature(normalized);
    return normalized;
}

function normalizeSummaryInput(summaryOrSummarized) {
    if (!summaryOrSummarized || typeof summaryOrSummarized !== 'object') return null;
    if (Array.isArray(summaryOrSummarized.outcomes)) return summaryOrSummarized;
    return {
        outcomes: [],
        summary: summaryOrSummarized
    };
}

export function summarizeOutcomes(outcomes) {
    const normalized = outcomes.map((item, index) => normalizeOutcome(item, index));

    const totals = {
        total: normalized.length,
        terminal: 0,
        open: 0,
        success: 0,
        partial: 0,
        failure: 0,
        timedOut: 0,
        rejected: 0,
        transportError: 0,
        avgAttempts: 0,
        avgLatencyMs: 0,
        successRate: 0,
        timeoutRate: 0,
        failureRate: 0,
        traceCoverage: 0,
        evidenceCoverage: 0,
        replayableTraceCoverage: 0,
        failureTraceCoverage: 0,
        failureErrorDetailCoverage: 0,
        traceEventCoverage: 0,
        toolTraceCoverage: 0,
        guardrailTraceCoverage: 0,
        handoffTraceCoverage: 0,
        traceLinkCoverage: 0,
        traceOrphanRate: 0,
        traceparentCoverage: 0,
        observability: {
            traced: 0,
            evidenceBacked: 0,
            replayableTraces: 0,
            failuresWithTrace: 0,
            failuresWithErrorDetail: 0,
            traceEventBacked: 0,
            toolTraceBacked: 0,
            guardrailTraceBacked: 0,
            handoffTraceBacked: 0,
            linkedTraceBacked: 0,
            traceparentBacked: 0,
            orphanedTraceBacked: 0,
            orphanedTraceEvents: 0,
            danglingParentTraceEvents: 0,
            missingTraceIdEvents: 0,
            missingSpanIdEvents: 0
        },
        byStatus: {},
        byIssue: {},
        byAgent: {},
        byPriority: {}
    };

    const latencies = [];
    let attemptsTotal = 0;

    for (const outcome of normalized) {
        totals.byStatus[outcome.status] = (totals.byStatus[outcome.status] || 0) + 1;
        totals.byIssue[outcome.issueCategory] = (totals.byIssue[outcome.issueCategory] || 0) + 1;
        attemptsTotal += outcome.attempts;
        if (Number.isFinite(outcome.latencyMs)) latencies.push(outcome.latencyMs);
        if (outcome.hasTrace) totals.observability.traced++;
        if (outcome.hasEvidence) totals.observability.evidenceBacked++;
        if (outcome.hasTrace && outcome.hasEvidence) totals.observability.replayableTraces++;
        if (outcome.isFailure && outcome.hasTrace) totals.observability.failuresWithTrace++;
        if (outcome.isFailure && outcome.hasErrorDetail) totals.observability.failuresWithErrorDetail++;
        if (outcome.hasTraceEvents) totals.observability.traceEventBacked++;
        if (outcome.hasToolTrace) totals.observability.toolTraceBacked++;
        if (outcome.hasGuardrailTrace) totals.observability.guardrailTraceBacked++;
        if (outcome.hasHandoffTrace) totals.observability.handoffTraceBacked++;
        if (outcome.traceEvents.linked > 0) totals.observability.linkedTraceBacked++;
        if (outcome.traceEvents.traceparent > 0) totals.observability.traceparentBacked++;
        if (outcome.traceEvents.orphaned > 0) totals.observability.orphanedTraceBacked++;
        totals.observability.orphanedTraceEvents += outcome.traceEvents.orphaned;
        totals.observability.danglingParentTraceEvents += outcome.traceEvents.danglingParent;
        totals.observability.missingTraceIdEvents += outcome.traceEvents.missingTraceId;
        totals.observability.missingSpanIdEvents += outcome.traceEvents.missingSpanId;

        if (!totals.byAgent[outcome.target]) {
            totals.byAgent[outcome.target] = {
                tasks: 0,
                success: 0,
                failure: 0,
                timedOut: 0,
                issueCounts: {},
                avgLatencyMs: 0
            };
        }
        if (!totals.byPriority[outcome.priority]) {
            totals.byPriority[outcome.priority] = {
                tasks: 0,
                success: 0,
                failure: 0,
                timeout: 0
            };
        }

        totals.byAgent[outcome.target].tasks++;
        totals.byPriority[outcome.priority].tasks++;
        totals.byAgent[outcome.target].issueCounts[outcome.issueCategory]
            = (totals.byAgent[outcome.target].issueCounts[outcome.issueCategory] || 0) + 1;

        if (outcome.isTerminal) {
            totals.terminal++;
        } else {
            totals.open++;
        }

        if (outcome.status === 'completed') {
            totals.success++;
            totals.byAgent[outcome.target].success++;
            totals.byPriority[outcome.priority].success++;
        } else if (outcome.status === 'partial') {
            totals.partial++;
        } else if (outcome.status === 'timed_out') {
            totals.failure++;
            totals.timedOut++;
            totals.byAgent[outcome.target].failure++;
            totals.byAgent[outcome.target].timedOut++;
            totals.byPriority[outcome.priority].failure++;
            totals.byPriority[outcome.priority].timeout++;
        } else if (outcome.status === 'rejected') {
            totals.failure++;
            totals.rejected++;
            totals.byAgent[outcome.target].failure++;
            totals.byPriority[outcome.priority].failure++;
        } else if (outcome.status === 'transport_error') {
            totals.failure++;
            totals.transportError++;
            totals.byAgent[outcome.target].failure++;
            totals.byPriority[outcome.priority].failure++;
        } else if (outcome.status === 'failed') {
            totals.failure++;
            totals.byAgent[outcome.target].failure++;
            totals.byPriority[outcome.priority].failure++;
        }
    }

    for (const [agentId, agent] of Object.entries(totals.byAgent)) {
        const agentLatencies = normalized
            .filter((item) => item.target === agentId && Number.isFinite(item.latencyMs))
            .map((item) => item.latencyMs);
        agent.avgLatencyMs = agentLatencies.length > 0
            ? Number(mean(agentLatencies).toFixed(2))
            : 0;
        agent.successRate = agent.tasks > 0
            ? Number((agent.success / agent.tasks).toFixed(4))
            : 0;
        agent.timeoutRate = agent.tasks > 0
            ? Number((agent.timedOut / agent.tasks).toFixed(4))
            : 0;
        agent.failureRate = agent.tasks > 0
            ? Number((agent.failure / agent.tasks).toFixed(4))
            : 0;
    }

    totals.avgAttempts = totals.total > 0
        ? Number((attemptsTotal / totals.total).toFixed(2))
        : 0;
    totals.avgLatencyMs = latencies.length > 0
        ? Number(mean(latencies).toFixed(2))
        : 0;
    totals.successRate = totals.total > 0
        ? Number((totals.success / totals.total).toFixed(4))
        : 0;
    totals.timeoutRate = totals.total > 0
        ? Number((totals.timedOut / totals.total).toFixed(4))
        : 0;
    totals.failureRate = totals.total > 0
        ? Number((totals.failure / totals.total).toFixed(4))
        : 0;
    totals.traceCoverage = totals.total > 0
        ? Number((totals.observability.traced / totals.total).toFixed(4))
        : 0;
    totals.evidenceCoverage = totals.total > 0
        ? Number((totals.observability.evidenceBacked / totals.total).toFixed(4))
        : 0;
    totals.replayableTraceCoverage = totals.total > 0
        ? Number((totals.observability.replayableTraces / totals.total).toFixed(4))
        : 0;
    totals.failureTraceCoverage = totals.failure > 0
        ? Number((totals.observability.failuresWithTrace / totals.failure).toFixed(4))
        : 1;
    totals.failureErrorDetailCoverage = totals.failure > 0
        ? Number((totals.observability.failuresWithErrorDetail / totals.failure).toFixed(4))
        : 1;
    totals.traceEventCoverage = totals.total > 0
        ? Number((totals.observability.traceEventBacked / totals.total).toFixed(4))
        : 0;
    totals.toolTraceCoverage = totals.total > 0
        ? Number((totals.observability.toolTraceBacked / totals.total).toFixed(4))
        : 0;
    totals.guardrailTraceCoverage = totals.total > 0
        ? Number((totals.observability.guardrailTraceBacked / totals.total).toFixed(4))
        : 0;
    totals.handoffTraceCoverage = totals.total > 0
        ? Number((totals.observability.handoffTraceBacked / totals.total).toFixed(4))
        : 0;
    totals.traceLinkCoverage = totals.total > 0
        ? Number((totals.observability.linkedTraceBacked / totals.total).toFixed(4))
        : 0;
    totals.traceparentCoverage = totals.total > 0
        ? Number((totals.observability.traceparentBacked / totals.total).toFixed(4))
        : 0;
    totals.traceOrphanRate = totals.observability.traceEventBacked > 0
        ? Number((totals.observability.orphanedTraceBacked / totals.observability.traceEventBacked).toFixed(4))
        : 0;

    return {
        outcomes: normalized,
        summary: totals
    };
}

function normalizeVariant(variant, index) {
    if (!variant || typeof variant !== 'object') {
        return {
            id: `variant-${index + 1}`,
            name: `Variant ${index + 1}`,
            timeoutRecoveryRate: 0,
            retryRecoveryRate: 0,
            routingRecoveryRate: 0
        };
    }

    return {
        id: typeof variant.id === 'string' ? variant.id : `variant-${index + 1}`,
        name: typeof variant.name === 'string' ? variant.name : `Variant ${index + 1}`,
        timeoutRecoveryRate: clamp(Number(variant.timeoutRecoveryRate) || 0, 0, 1),
        retryRecoveryRate: clamp(Number(variant.retryRecoveryRate) || 0, 0, 1),
        routingRecoveryRate: clamp(Number(variant.routingRecoveryRate) || 0, 0, 1)
    };
}

function normalizeSkillCatalog(catalogLike) {
    if (!catalogLike) return [];
    if (Array.isArray(catalogLike)) return catalogLike;
    if (Array.isArray(catalogLike.entries)) return catalogLike.entries;
    return [];
}

function lookupSkillSuggestions(playbookEntry, catalog, maxPerFocus = 3) {
    if (!playbookEntry || catalog.length === 0) return [];
    const hits = [];
    const keywordSet = [...new Set(playbookEntry.keywords.map((keyword) => normalizeText(keyword)).filter(Boolean))];

    for (const entry of catalog) {
        if (!entry || typeof entry !== 'object') continue;
        const blob = normalizeText([
            entry.name,
            entry.archetype,
            entry.coreMethod,
            entry.primaryArtifact,
            entry.domain
        ].filter(Boolean).join(' '));
        const score = keywordSet.reduce((acc, keyword) => acc + (blob.includes(keyword) ? 1 : 0), 0);
        if (score <= 0) continue;

        hits.push({
            id: entry.id ?? null,
            name: entry.name || `catalog:${hits.length + 1}`,
            domain: entry.domain || null,
            archetype: entry.archetype || null,
            implementationPath: entry.implementationPath || null,
            score
        });
    }

    return hits
        .sort((a, b) => b.score - a.score)
        .slice(0, maxPerFocus);
}

function toSkillCandidate(playbookEntry) {
    return playbookEntry.keywords.map((keyword, index) => ({
        id: null,
        name: keyword,
        domain: null,
        archetype: index === 0 ? 'recommended' : null,
        implementationPath: null,
        score: 0
    }));
}

export function runCounterfactualReplay(summary, variants = []) {
    const baseline = summary?.summary || summary;
    if (!baseline || typeof baseline !== 'object') {
        throw new Error('runCounterfactualReplay requires outcome summary');
    }

    const variantList = (Array.isArray(variants) && variants.length > 0
        ? variants
        : [
            {
                id: 'retry-hardening',
                name: 'Retry hardening',
                timeoutRecoveryRate: 0.35,
                retryRecoveryRate: 0.2,
                routingRecoveryRate: 0.05
            },
            {
                id: 'routing-optimizer',
                name: 'Adaptive routing + fallback',
                timeoutRecoveryRate: 0.2,
                retryRecoveryRate: 0.12,
                routingRecoveryRate: 0.35
            },
            {
                id: 'hybrid-policy',
                name: 'Hybrid safety + routing + retry',
                timeoutRecoveryRate: 0.4,
                retryRecoveryRate: 0.22,
                routingRecoveryRate: 0.28
            }
        ]).map(normalizeVariant);

    const outcomesTotal = Number(baseline.total) || 0;
    const baselineSuccess = Number(baseline.success) || 0;
    const timedOut = Number(baseline.timedOut) || 0;
    const failed = Number(baseline.failure) || 0;
    const rejected = Number(baseline.rejected) || 0;

    const runs = variantList.map((variant) => {
        const recoveredTimeout = timedOut * variant.timeoutRecoveryRate;
        const recoveredFailure = Math.max(0, failed - timedOut) * variant.retryRecoveryRate;
        const recoveredRejected = rejected * variant.routingRecoveryRate;

        const projectedSuccess = clamp(
            baselineSuccess + recoveredTimeout + recoveredFailure + recoveredRejected,
            0,
            outcomesTotal
        );
        const projectedSuccessRate = outcomesTotal > 0
            ? projectedSuccess / outcomesTotal
            : 0;

        return {
            ...variant,
            recovered: {
                timeout: Number(recoveredTimeout.toFixed(2)),
                failure: Number(recoveredFailure.toFixed(2)),
                rejected: Number(recoveredRejected.toFixed(2))
            },
            projectedSuccess: Number(projectedSuccess.toFixed(2)),
            projectedSuccessRate: Number(projectedSuccessRate.toFixed(4)),
            deltaSuccessRate: Number((projectedSuccessRate - (baseline.successRate || 0)).toFixed(4))
        };
    }).sort((a, b) => b.deltaSuccessRate - a.deltaSuccessRate);

    return {
        baselineSuccessRate: Number(baseline.successRate || 0),
        runs,
        best: runs[0] || null
    };
}

export function buildErrorTaxonomy(summaryOrSummarized) {
    const summarized = normalizeSummaryInput(summaryOrSummarized);
    if (!summarized) {
        throw new Error('buildErrorTaxonomy requires summarized outcomes or summary object');
    }

    const outcomes = Array.isArray(summarized.outcomes) ? summarized.outcomes : [];
    const baseline = summarized.summary || {};
    const failures = outcomes.filter((outcome) => outcome.isFailure);
    const inferredFailures = Number(baseline.failure) || 0;
    const totalFailures = failures.length > 0 ? failures.length : inferredFailures;
    const totalOutcomes = Number(baseline.total) || outcomes.length || 0;

    const categoryMap = {};
    for (const category of KNOWN_ISSUE_CATEGORIES) {
        categoryMap[category] = {
            category,
            count: 0,
            weightedCount: 0
        };
    }

    const signatureMap = {};
    const byAgent = {};

    for (const outcome of failures) {
        const category = categoryMap[outcome.issueCategory]
            ? outcome.issueCategory
            : 'unknown_failure';
        const priorityWeight = PRIORITY_WEIGHT[outcome.priority] || PRIORITY_WEIGHT.normal;
        categoryMap[category].count++;
        categoryMap[category].weightedCount = round(categoryMap[category].weightedCount + priorityWeight, 2);

        if (!byAgent[outcome.target]) {
            byAgent[outcome.target] = {
                agent: outcome.target,
                failures: 0,
                weightedFailures: 0,
                categories: {}
            };
        }
        byAgent[outcome.target].failures++;
        byAgent[outcome.target].weightedFailures = round(byAgent[outcome.target].weightedFailures + priorityWeight, 2);
        byAgent[outcome.target].categories[category] = (byAgent[outcome.target].categories[category] || 0) + 1;

        const signature = outcome.errorSignature || `${category}:general:unspecified`;
        if (!signatureMap[signature]) {
            signatureMap[signature] = {
                signature,
                category,
                tool: outcome.toolName || 'general',
                errorCode: outcome.errorCode || null,
                sampleErrorMessage: outcome.errorMessage || null,
                count: 0,
                weightedCount: 0,
                firstTaskId: outcome.taskId,
                lastTaskId: outcome.taskId,
                skillHints: {}
            };
        }
        const record = signatureMap[signature];
        record.count++;
        record.weightedCount = round(record.weightedCount + priorityWeight, 2);
        record.lastTaskId = outcome.taskId;
        for (const hint of outcome.skillHints || []) {
            record.skillHints[hint] = (record.skillHints[hint] || 0) + 1;
        }
    }

    if (failures.length === 0 && totalFailures > 0) {
        const issueTotals = {
            timeout: Number(baseline?.byIssue?.timeout) || Number(baseline.timedOut) || 0,
            transport: Number(baseline?.byIssue?.transport) || Number(baseline.transportError) || 0,
            rejection: Number(baseline?.byIssue?.rejection) || Number(baseline.rejected) || 0,
            execution_failure: Number(baseline?.byIssue?.execution_failure) || Number(baseline.failed) || 0,
            unknown_failure: Number(baseline?.byIssue?.unknown_failure) || 0
        };

        let assigned = Object.values(issueTotals).reduce((acc, value) => acc + value, 0);
        if (assigned < totalFailures) {
            issueTotals.unknown_failure += (totalFailures - assigned);
            assigned = totalFailures;
        }
        if (assigned === 0 && totalFailures > 0) {
            issueTotals.unknown_failure = totalFailures;
        }

        for (const [category, count] of Object.entries(issueTotals)) {
            if (!categoryMap[category] || count <= 0) continue;
            categoryMap[category].count = count;
            categoryMap[category].weightedCount = round(count, 2);
        }
    }

    const categories = Object.values(categoryMap)
        .map((item) => ({
            ...item,
            rate: totalFailures > 0 ? round(item.count / totalFailures, 4) : 0
        }))
        .filter((item) => item.count > 0)
        .sort((a, b) => b.weightedCount - a.weightedCount || b.count - a.count);

    const topSignatures = Object.values(signatureMap)
        .map((item) => ({
            ...item,
            skillHints: Object.entries(item.skillHints)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([hint, count]) => ({ hint, count }))
        }))
        .sort((a, b) => b.weightedCount - a.weightedCount || b.count - a.count);

    const recurringSignatures = topSignatures.filter((item) => item.count >= 2).length;
    const topSignatureShare = totalFailures > 0
        ? round((topSignatures[0]?.count || 0) / totalFailures, 4)
        : 0;

    let driftLevel = 'stable';
    if (totalFailures >= 6 || (recurringSignatures >= 2 && topSignatureShare >= 0.4)) {
        driftLevel = 'critical';
    } else if (totalFailures >= 3 || recurringSignatures >= 1) {
        driftLevel = 'watch';
    }

    return {
        totalFailures,
        failureRate: totalOutcomes > 0 ? round(totalFailures / totalOutcomes, 4) : 0,
        recurringSignatures,
        driftLevel,
        categories,
        topSignatures: topSignatures.slice(0, 10),
        byAgent: Object.values(byAgent)
            .sort((a, b) => b.weightedFailures - a.weightedFailures || b.failures - a.failures),
        summaryText: totalFailures === 0
            ? 'No terminal failures were detected.'
            : `${totalFailures} failure(s) detected with ${recurringSignatures} recurring signature(s).`
    };
}

export function buildLearningRecommendations(
    summary,
    replay,
    {
        minTimeoutRateForAction = 0.1,
        minAgentSuccessRate = 0.7,
        maxAvgAttempts = 1.4
    } = {}
) {
    const baseline = summary?.summary || summary;
    if (!baseline || typeof baseline !== 'object') {
        throw new Error('buildLearningRecommendations requires outcome summary');
    }

    const recommendations = [];

    if ((baseline.timeoutRate || 0) >= minTimeoutRateForAction) {
        recommendations.push({
            priority: 'P1',
            category: 'timeout_resilience',
            title: 'Reduce timeout-driven task loss',
            rationale: `Timeout rate is ${(baseline.timeoutRate * 100).toFixed(1)}% across ${baseline.total} tasks`,
            action: 'Increase timeout budgets selectively, add fallback workers, and enforce jittered retry policies.',
            expectedImpact: {
                metric: 'timeoutRate',
                current: baseline.timeoutRate,
                target: Number(Math.max(0, baseline.timeoutRate - 0.08).toFixed(4))
            }
        });
    }

    if ((baseline.avgAttempts || 0) >= maxAvgAttempts) {
        recommendations.push({
            priority: 'P2',
            category: 'dispatch_efficiency',
            title: 'Lower retry pressure in orchestration',
            rationale: `Average attempts per task is ${baseline.avgAttempts}`,
            action: 'Prioritize stable workers and tune retry windows to avoid clustered retries.',
            expectedImpact: {
                metric: 'avgAttempts',
                current: baseline.avgAttempts,
                target: Number(Math.max(1, baseline.avgAttempts - 0.2).toFixed(2))
            }
        });
    }

    const lowPerformers = Object.entries(baseline.byAgent || {})
        .filter(([, stats]) => Number(stats.successRate || 0) < minAgentSuccessRate)
        .sort((a, b) => (a[1].successRate || 0) - (b[1].successRate || 0));

    for (const [agentId, stats] of lowPerformers.slice(0, 2)) {
        recommendations.push({
            priority: 'P2',
            category: 'routing_quality',
            title: `Improve routing quality for ${agentId}`,
            rationale: `Agent success rate is ${(stats.successRate * 100).toFixed(1)}% across ${stats.tasks} tasks`,
            action: 'Apply optimizer penalties for this agent until reliability recovers and add targeted health checks.',
            expectedImpact: {
                metric: `${agentId}.successRate`,
                current: stats.successRate,
                target: Number(Math.min(0.95, stats.successRate + 0.12).toFixed(4))
            }
        });
    }

    if (replay?.best) {
        recommendations.push({
            priority: 'P1',
            category: 'counterfactual_winner',
            title: `Adopt replay winner: ${replay.best.name}`,
            rationale: `Counterfactual replay projects +${(replay.best.deltaSuccessRate * 100).toFixed(1)}pp success rate`,
            action: 'Roll out this policy variant behind a feature flag and compare against control over next 7 days.',
            expectedImpact: {
                metric: 'successRate',
                current: replay.baselineSuccessRate,
                target: replay.best.projectedSuccessRate
            }
        });
    }

    return recommendations;
}

export function buildSkillGrowthPlan(
    summaryOrSummarized,
    taxonomy,
    {
        minFailuresForSkill = 2,
        maxFocusAreas = 6,
        maxSkillsPerFocus = 3,
        skillCatalog = [],
        previousState = null
    } = {}
) {
    const summarized = normalizeSummaryInput(summaryOrSummarized);
    const baseline = summarized?.summary || {};
    const totalOutcomes = Number(baseline.total) || 0;
    const tax = taxonomy && typeof taxonomy === 'object'
        ? taxonomy
        : buildErrorTaxonomy(summarized);
    const catalog = normalizeSkillCatalog(skillCatalog);
    const focusAreas = [];
    const seenFocus = new Set();
    const previousFocusMastery = previousState?.focusMastery || {};

    for (const categoryStats of tax.categories || []) {
        if (!categoryStats || categoryStats.count < minFailuresForSkill) continue;
        const playbook = SKILL_FOCUS_PLAYBOOK[categoryStats.category]
            || SKILL_FOCUS_PLAYBOOK.unknown_failure;
        if (seenFocus.has(playbook.focus)) continue;
        seenFocus.add(playbook.focus);

        const suggestions = lookupSkillSuggestions(playbook, catalog, maxSkillsPerFocus);
        const priorScore = Number(previousFocusMastery?.[playbook.focus]?.score);
        const skillPressure = round(categoryStats.rate * (playbook.priority === 'P1' ? 1.3 : 1), 4);

        focusAreas.push({
            focus: playbook.focus,
            label: playbook.label,
            priority: playbook.priority,
            category: categoryStats.category,
            rationale: `${categoryStats.count} ${categoryStats.category.replace('_', ' ')} failures (${(categoryStats.rate * 100).toFixed(1)}% of failures).`,
            evidence: {
                failures: categoryStats.count,
                weightedFailures: categoryStats.weightedCount,
                shareOfFailures: categoryStats.rate
            },
            learningAction: playbook.action,
            skillPressure,
            priorMasteryScore: Number.isFinite(priorScore) ? priorScore : null,
            projectedMasteryTarget: Number.isFinite(priorScore)
                ? round(clamp(priorScore + (skillPressure < 0.2 ? 0.08 : 0.03), 0, 1), 4)
                : round(clamp(0.55 + (skillPressure < 0.2 ? 0.08 : 0), 0, 1), 4),
            suggestedSkills: suggestions.length > 0
                ? suggestions
                : toSkillCandidate(playbook).slice(0, maxSkillsPerFocus)
        });
    }

    const weakAgents = Object.entries(baseline.byAgent || {})
        .filter(([, stats]) => Number(stats.failureRate || 0) >= 0.35 || Number(stats.successRate || 0) < 0.6)
        .sort((a, b) => (b[1].failureRate || 0) - (a[1].failureRate || 0));

    if (weakAgents.length > 0 && !seenFocus.has('agent_reliability_coaching')) {
        const [agentId, stats] = weakAgents[0];
        focusAreas.push({
            focus: 'agent_reliability_coaching',
            label: 'Agent reliability coaching',
            priority: 'P2',
            category: 'execution_failure',
            rationale: `${agentId} success rate ${(Number(stats.successRate || 0) * 100).toFixed(1)}% over ${stats.tasks} tasks.`,
            evidence: {
                failures: stats.failure,
                weightedFailures: stats.failure,
                shareOfFailures: baseline.failure > 0 ? round((stats.failure || 0) / baseline.failure, 4) : 0
            },
            learningAction: 'Create targeted drills and routing guardrails for the lowest-performing agent until success recovers.',
            skillPressure: round(Math.max(Number(stats.failureRate || 0), 0.35), 4),
            priorMasteryScore: Number(previousFocusMastery?.agent_reliability_coaching?.score) || null,
            projectedMasteryTarget: 0.72,
            suggestedSkills: [
                {
                    id: null,
                    name: 'skill-gap-diagnoser',
                    domain: null,
                    archetype: 'recommended',
                    implementationPath: null,
                    score: 0
                },
                {
                    id: null,
                    name: 'training-curriculum-composer',
                    domain: null,
                    archetype: null,
                    implementationPath: null,
                    score: 0
                }
            ]
        });
    }

    if (focusAreas.length === 0 && totalOutcomes === 0) {
        const playbook = OUTCOME_BOOTSTRAP_PLAYBOOK;
        const suggestions = lookupSkillSuggestions(playbook, catalog, maxSkillsPerFocus);
        const priorScore = Number(previousFocusMastery?.[playbook.focus]?.score);
        const skillPressure = 0.55;

        focusAreas.push({
            focus: playbook.focus,
            label: playbook.label,
            priority: playbook.priority,
            category: 'unknown_failure',
            rationale: 'No recent outcome records were found, so the learning loop cannot infer failure signatures yet.',
            evidence: {
                failures: 0,
                weightedFailures: 0,
                shareOfFailures: 0
            },
            learningAction: playbook.action,
            skillPressure,
            priorMasteryScore: Number.isFinite(priorScore) ? priorScore : null,
            projectedMasteryTarget: Number.isFinite(priorScore)
                ? round(clamp(priorScore + 0.08, 0, 1), 4)
                : 0.65,
            suggestedSkills: suggestions.length > 0
                ? suggestions
                : toSkillCandidate(playbook).slice(0, maxSkillsPerFocus)
        });
    }

    const sorted = focusAreas
        .sort((a, b) => {
            if (a.priority !== b.priority) return a.priority === 'P1' ? -1 : 1;
            return b.skillPressure - a.skillPressure;
        })
        .slice(0, maxFocusAreas);

    const topSkillCandidates = [];
    const seenSkillName = new Set();
    for (const area of sorted) {
        for (const candidate of area.suggestedSkills || []) {
            const key = candidate?.name;
            if (!key || seenSkillName.has(key)) continue;
            seenSkillName.add(key);
            topSkillCandidates.push({
                ...candidate,
                focus: area.focus,
                focusPriority: area.priority
            });
        }
    }

    return {
        driftLevel: tax.driftLevel,
        learningPressure: round(sorted.reduce((acc, item) => acc + item.skillPressure, 0), 4),
        focusAreas: sorted,
        topSkillCandidates: topSkillCandidates.slice(0, 12)
    };
}

export function updateLearningState(
    previousState,
    {
        summary,
        taxonomy,
        skillGrowthPlan
    }
) {
    const nowIso = new Date().toISOString();
    const previous = previousState && typeof previousState === 'object'
        ? previousState
        : {};
    const previousRunCount = Number(previous.runCount) || 0;
    const previousFailureRate = Number(previous?.baseline?.failureRate);
    const previousSuccessRate = Number(previous?.baseline?.successRate);
    const previousRecurringErrors = previous.recurringErrors && typeof previous.recurringErrors === 'object'
        ? previous.recurringErrors
        : {};
    const previousFocus = previous.focusMastery && typeof previous.focusMastery === 'object'
        ? previous.focusMastery
        : {};

    const focusMastery = {};
    const touchedFocus = new Set();

    for (const area of skillGrowthPlan.focusAreas || []) {
        const priorScore = Number(previousFocus?.[area.focus]?.score);
        const baseScore = Number.isFinite(priorScore) ? priorScore : 0.65;
        const pressurePenalty = area.skillPressure * (area.priority === 'P1' ? 0.3 : 0.2);
        const reliabilityBoost = Number(summary.successRate || 0) * 0.08;
        const nextScore = clamp(baseScore - pressurePenalty + reliabilityBoost, 0, 1);
        touchedFocus.add(area.focus);

        focusMastery[area.focus] = {
            score: round(nextScore, 4),
            priority: area.priority,
            pressure: round(area.skillPressure, 4),
            trend: nextScore > baseScore
                ? 'improving'
                : (nextScore < baseScore ? 'declining' : 'stable'),
            updatedAt: nowIso
        };
    }

    for (const [focus, snapshot] of Object.entries(previousFocus)) {
        if (touchedFocus.has(focus)) continue;
        const priorScore = Number(snapshot?.score);
        const recovered = clamp((Number.isFinite(priorScore) ? priorScore : 0.6) + 0.03, 0, 1);
        focusMastery[focus] = {
            score: round(recovered, 4),
            priority: snapshot?.priority || 'P3',
            pressure: 0,
            trend: recovered > priorScore ? 'improving' : 'stable',
            updatedAt: nowIso
        };
    }

    const recurringErrors = {};
    const currentSignatures = {};
    for (const signature of taxonomy.topSignatures || []) {
        currentSignatures[signature.signature] = signature;
    }

    const runCount = previousRunCount + 1;
    for (const [key, current] of Object.entries(currentSignatures)) {
        const prior = previousRecurringErrors[key];
        recurringErrors[key] = {
            signature: key,
            category: current.category,
            count: (Number(prior?.count) || 0) + current.count,
            occurrencesLastRun: current.count,
            streak: (Number(prior?.streak) || 0) + 1,
            firstSeenRun: Number(prior?.firstSeenRun) || runCount,
            lastSeenRun: runCount,
            sampleErrorMessage: current.sampleErrorMessage || prior?.sampleErrorMessage || null
        };
    }

    for (const [key, prior] of Object.entries(previousRecurringErrors)) {
        if (currentSignatures[key]) continue;
        const staleStreak = Math.max((Number(prior?.streak) || 1) - 1, 0);
        if ((Number(prior?.count) || 0) <= 0 && staleStreak <= 0) continue;
        recurringErrors[key] = {
            ...prior,
            occurrencesLastRun: 0,
            streak: staleStreak,
            lastSeenRun: Number(prior?.lastSeenRun) || previousRunCount
        };
    }

    const successRate = Number(summary.successRate) || 0;
    const failureRate = Number(summary.failureRate) || 0;
    const timeoutRate = Number(summary.timeoutRate) || 0;
    const successRateDelta = Number.isFinite(previousSuccessRate)
        ? round(successRate - previousSuccessRate, 4)
        : null;
    const failureRateDelta = Number.isFinite(previousFailureRate)
        ? round(failureRate - previousFailureRate, 4)
        : null;

    let driftLevel = taxonomy.driftLevel;
    if (failureRateDelta !== null && failureRateDelta >= 0.05) {
        driftLevel = 'critical';
    } else if (driftLevel === 'stable' && failureRateDelta !== null && failureRateDelta >= 0.01) {
        driftLevel = 'watch';
    }

    return {
        version: 1,
        generatedAt: nowIso,
        runCount,
        driftLevel,
        baseline: {
            total: Number(summary.total) || 0,
            successRate: round(successRate, 4),
            failureRate: round(failureRate, 4),
            timeoutRate: round(timeoutRate, 4)
        },
        trend: {
            successRateDelta,
            failureRateDelta,
            learningVelocity: failureRateDelta === null ? null : round(-failureRateDelta, 4)
        },
        focusMastery,
        recurringErrors,
        nextActions: (skillGrowthPlan.focusAreas || [])
            .slice(0, 5)
            .map((area) => ({
                focus: area.focus,
                priority: area.priority,
                action: area.learningAction
            }))
    };
}

export function evaluateLearningLoop(outcomes, options = {}) {
    if (!Array.isArray(outcomes)) {
        throw new Error('evaluateLearningLoop expects outcomes array');
    }

    const summarized = summarizeOutcomes(outcomes);
    const replay = runCounterfactualReplay(summarized, options.variants);
    const recommendations = buildLearningRecommendations(
        summarized,
        replay,
        options.thresholds || {}
    );
    const taxonomy = buildErrorTaxonomy(summarized);
    const skillGrowthPlan = buildSkillGrowthPlan(summarized, taxonomy, {
        ...options.skillGrowth,
        skillCatalog: options.skillCatalog,
        previousState: options.previousState
    });
    const state = updateLearningState(options.previousState, {
        summary: summarized.summary,
        taxonomy,
        skillGrowthPlan
    });

    return {
        summary: summarized.summary,
        replay,
        recommendations,
        errorTaxonomy: taxonomy,
        skillGrowthPlan,
        state
    };
}

export const __learningLoopInternals = {
    normalizeOutcome,
    normalizeVariant,
    classifyIssue,
    normalizeErrorSignature
};
