import fs from 'node:fs';
import path from 'node:path';

const LOG_FILE = process.env.OPENCLAW_GATEWAY_LOG
    || path.join(process.env.HOME || '.', '.openclaw/logs/gateway.log');

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

if (import.meta.url === `file://${process.argv[1]}`) {
    try {
        const result = readLastGatewayStatus();
        if (!result.ok) {
            console.log(`[Health] No gateway status available (${result.reason}) at ${result.logPath}`);
            process.exit(0);
        }

        console.log(`[Health] Last WhatsApp status: ${result.status}`);
    } catch (error) {
        console.error(`[Health] Failed to inspect gateway logs: ${error.message}`);
        process.exit(1);
    }
}
