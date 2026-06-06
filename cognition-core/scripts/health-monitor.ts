import fs from 'node:fs';
import path from 'node:path';

const LOG_FILE = process.env.OPENCLAW_GATEWAY_LOG
    || path.join(process.env.HOME || '.', '.openclaw/logs/gateway.log');
const WORKER_LOOP_REPORT = process.env.OPENCLAW_WORKER_LOOP_REPORT
    || path.resolve(process.cwd(), 'reports/bot-worker-loop.json');

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

export function readLatestWorkerLoopCheckpoint(reportPath = WORKER_LOOP_REPORT) {
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
            : {}
    };
}

if (import.meta.url === `file://${process.argv[1]}`) {
    try {
        const result = readLastGatewayStatus();
        if (!result.ok) {
            console.log(`[Health] No gateway status available (${result.reason}) at ${result.logPath}`);
            process.exit(0);
        }

        console.log(`[Health] Last WhatsApp status: ${result.status}`);

        const worker = readLatestWorkerLoopCheckpoint();
        if (!worker.ok) {
            console.log(`[Health] No worker-loop checkpoint available (${worker.reason}) at ${worker.reportPath}`);
        } else {
            console.log(`[Health] Worker loop next action: ${worker.nextAction}`);
            console.log(`[Health] Worker loop resume recommended: ${worker.resumeRecommended}`);
            console.log(`[Health] Worker loop resume key: ${worker.resumeKey}`);
            if (worker.attentionReasons.length > 0) {
                console.log(`[Health] Worker loop attention: ${worker.attentionReasons.join(', ')}`);
            }
        }
    } catch (error) {
        console.error(`[Health] Failed to inspect gateway logs: ${error.message}`);
        process.exit(1);
    }
}
