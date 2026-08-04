import fs from 'node:fs';
import path from 'node:path';

const LOG_FILE = process.env.OPENCLAW_GATEWAY_LOG
    || path.join(process.env.HOME || '.', '.openclaw/logs/gateway.log');
const WORKER_LOOP_REPORT = process.env.OPENCLAW_WORKER_LOOP_REPORT
    || path.resolve(process.cwd(), 'reports/bot-worker-loop.json');
const WORKER_APPROVAL_SLO_MS = parsePositiveInt(
    process.env.OPENCLAW_WORKER_APPROVAL_SLO_MS,
    30 * 60 * 1000
);
const WORKER_QUEUE_AGE_SLO_MS = parsePositiveInt(
    process.env.OPENCLAW_WORKER_QUEUE_AGE_SLO_MS,
    60 * 60 * 1000
);

function parsePositiveInt(value, fallback) {
    const numeric = Number(value);
    if (!Number.isInteger(numeric) || numeric <= 0) return fallback;
    return numeric;
}

function safeNumber(value) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
}

function latestTimestamp(values) {
    let latest = null;
    for (const value of values) {
        const numeric = safeNumber(value);
        if (numeric === null) continue;
        latest = latest === null ? numeric : Math.max(latest, numeric);
    }
    return latest;
}

function classifyCheckpointFreshness({
    checkpoint,
    report,
    now = Date.now(),
    approvalSloMs = WORKER_APPROVAL_SLO_MS
}) {
    const lastCycle = checkpoint?.lastCycle && typeof checkpoint.lastCycle === 'object'
        ? checkpoint.lastCycle
        : {};
    const traceEvents = Array.isArray(report?.traceEvents) ? report.traceEvents : [];
    const observedAt = latestTimestamp([
        checkpoint?.observedAt,
        checkpoint?.updatedAt,
        checkpoint?.createdAt,
        lastCycle.finishedAt,
        lastCycle.startedAt,
        ...traceEvents.map((event) => event?.at)
    ]);

    if (observedAt === null) {
        return {
            status: 'unknown',
            observedAt: null,
            ageMs: null,
            approvalSloMs
        };
    }

    const ageMs = Math.max(0, safeNumber(now) === null ? 0 : Number(now) - observedAt);
    return {
        status: ageMs > approvalSloMs ? 'stale' : 'fresh',
        observedAt,
        ageMs,
        approvalSloMs
    };
}

export function readLastGatewayStatus(logPath = LOG_FILE) {
    if (!fs.existsSync(logPath)) {
        return {
            ok: false,
            reason: 'log_missing',
            logPath
        };
    }

    const content = fs.readFileSync(logPath, 'utf8');
    const lines = content.split('\n').reverse();
    const lastStatus = lines.find((line) => line.includes('WhatsApp gateway'));

    if (!lastStatus) {
        return {
            ok: false,
            reason: 'status_not_found',
            logPath
        };
    }

    return {
        ok: true,
        status: lastStatus.trim(),
        logPath
    };
}

export function readLatestWorkerLoopCheckpoint(reportPath = WORKER_LOOP_REPORT, options = {}) {
    if (!fs.existsSync(reportPath)) {
        return {
            ok: false,
            reason: 'report_missing',
            reportPath
        };
    }

    let report;
    try {
        report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    } catch (error) {
        return {
            ok: false,
            reason: 'report_invalid_json',
            detail: error.message,
            reportPath
        };
    }

    const checkpoint = report?.lifecycleCheckpoint;
    if (!checkpoint || typeof checkpoint !== 'object') {
        return {
            ok: false,
            reason: 'checkpoint_missing',
            reportPath
        };
    }

    const freshness = classifyCheckpointFreshness({
        checkpoint,
        report,
        now: options.now,
        approvalSloMs: options.approvalSloMs
    });

    return {
        ok: true,
        reportPath,
        stopReason: report.stopReason || checkpoint.stopReason || 'unknown',
        nextAction: checkpoint.nextAction || 'unknown',
        resumeRecommended: checkpoint.resumeRecommended === true,
        resumeKey: checkpoint.resumeKey || 'unavailable',
        stateFingerprint: checkpoint.stateFingerprint || 'unavailable',
        attentionReasons: Array.isArray(checkpoint.attentionReasons)
            ? checkpoint.attentionReasons
            : [],
        queue: checkpoint.queue && typeof checkpoint.queue === 'object'
            ? checkpoint.queue
            : {},
        freshness
    };
}

function buildHealthAttention({ gateway, workerLoop, queueAgeSloMs = WORKER_QUEUE_AGE_SLO_MS }) {
    const attention = [];

    if (!gateway.ok) {
        attention.push(`gateway_${gateway.reason || 'unavailable'}`);
    }

    if (!workerLoop.ok) {
        attention.push(`worker_loop_${workerLoop.reason || 'unavailable'}`);
        return attention;
    }

    if (workerLoop.resumeRecommended) {
        attention.push(`worker_loop_resume_${workerLoop.nextAction || 'recommended'}`);
    }

    if (Number(workerLoop.queue?.openAgeMs?.oldest || 0) > queueAgeSloMs) {
        attention.push('worker_loop_open_task_age_slo_exceeded');
    }

    const hasWorkerLoopAction = workerLoop.resumeRecommended
        || Number(workerLoop.queue?.open || 0) > 0
        || (workerLoop.attentionReasons || []).length > 0;
    if (hasWorkerLoopAction && workerLoop.freshness?.status === 'stale') {
        attention.push('worker_loop_checkpoint_stale');
    }

    for (const reason of workerLoop.attentionReasons || []) {
        attention.push(`worker_loop_${reason}`);
    }

    return [...new Set(attention)];
}

function classifyHealthStatus(attention) {
    if (attention.some((item) => item.includes('missing') || item.includes('invalid'))) {
        return 'degraded';
    }
    return attention.length > 0 ? 'attention' : 'ok';
}

export function inspectOpenClawHealth({
    logPath = LOG_FILE,
    workerReportPath = WORKER_LOOP_REPORT,
    now = Date.now(),
    approvalSloMs = WORKER_APPROVAL_SLO_MS,
    queueAgeSloMs = WORKER_QUEUE_AGE_SLO_MS
} = {}) {
    const gateway = readLastGatewayStatus(logPath);
    const workerLoop = readLatestWorkerLoopCheckpoint(workerReportPath, {
        now,
        approvalSloMs
    });
    const attention = buildHealthAttention({ gateway, workerLoop, queueAgeSloMs });

    return {
        schemaVersion: 'openclaw.health.v1',
        inspectedAt: now,
        queueAgeSloMs,
        status: classifyHealthStatus(attention),
        attention,
        gateway,
        workerLoop
    };
}

function wantsJsonOutput(args) {
    return args.includes('--json');
}

if (import.meta.url === `file://${process.argv[1]}`) {
    try {
        const health = inspectOpenClawHealth();
        if (wantsJsonOutput(process.argv.slice(2))) {
            console.log(JSON.stringify(health, null, 2));
        } else {
            console.log(`[Health] Overall status: ${health.status}`);
            if (health.attention.length > 0) {
                console.log(`[Health] Attention: ${health.attention.join(', ')}`);
            }

            const gateway = health.gateway;
            if (!gateway.ok) {
                console.log(`[Health] No gateway status available (${gateway.reason}) at ${gateway.logPath}`);
            } else {
                console.log(`[Health] Last WhatsApp status: ${gateway.status}`);
            }

            const worker = health.workerLoop;
            if (!worker.ok) {
                console.log(`[Health] No worker-loop checkpoint available (${worker.reason}) at ${worker.reportPath}`);
            } else {
                console.log(`[Health] Worker loop next action: ${worker.nextAction}`);
                console.log(`[Health] Worker loop resume recommended: ${worker.resumeRecommended}`);
                console.log(`[Health] Worker loop resume key: ${worker.resumeKey}`);
                console.log(`[Health] Worker loop checkpoint freshness: ${worker.freshness.status} ageMs=${worker.freshness.ageMs ?? 'unknown'} sloMs=${worker.freshness.approvalSloMs}`);
                if (worker.queue?.openAgeMs) {
                    console.log(`[Health] Worker loop oldest open task: ${worker.queue.openAgeMs.oldest}ms sloMs=${health.queueAgeSloMs}`);
                }
                if (
                    worker.resumeRecommended
                    && worker.freshness.status === 'stale'
                    && worker.attentionReasons.includes('pending_approval')
                ) {
                    console.log('[Health] Worker loop approval pause is stale; review pending approvals or rerun the worker after clearing blockers');
                }
                if (worker.attentionReasons.length > 0) {
                    console.log(`[Health] Worker loop attention: ${worker.attentionReasons.join(', ')}`);
                }
            }
        }
    } catch (error) {
        console.error(`[Health] Failed to inspect gateway logs: ${error.message}`);
        process.exit(1);
    }
}
