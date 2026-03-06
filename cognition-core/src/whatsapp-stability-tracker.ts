import fs from 'node:fs';

export interface StabilityEvent {
  tsMs: number;
  iso: string;
  type: 'disconnect' | 'reconnect' | 'restart';
  line: string;
}

export interface StabilityAlert {
  severity: 'info' | 'warning' | 'critical';
  code: 'disconnect_volume' | 'reconnect_loop' | 'currently_disconnected' | 'log_missing';
  message: string;
}

export interface StabilitySummary {
  logPath: string;
  startIso: string;
  endIso: string;
  disconnects: number;
  reconnects: number;
  restarts: number;
  loops: Array<{ startIso: string; endIso: string; events: number }>;
  currentState: 'connected' | 'disconnected' | 'unknown';
  alerts: StabilityAlert[];
}

const DISCONNECT_PATTERNS = [
  /\[whatsapp\].*web connection closed/i,
  /\[whatsapp\].*no messages received.*restarting connection/i,
  /\[whatsapp\].*gateway disconnected/i,
  /\[whatsapp\].*disconnected/i
];

const RECONNECT_PATTERNS = [
  /\[whatsapp\].*gateway connected/i,
  /\[whatsapp\].*reconnected/i,
  /\[whatsapp\].*connection restored/i,
  /\[whatsapp\].*connected\b/i
];

const RESTART_PATTERNS = [
  /\[whatsapp\].*restarting connection/i,
  /\[whatsapp\].*retry\s+\d+\/\d+/i
];

function parseTimestampMs(line: string): number | null {
  const m = line.match(/^(\d{4}-\d{2}-\d{2}T[^\s]+)/);
  if (!m) return null;
  const ms = Date.parse(m[1]);
  return Number.isNaN(ms) ? null : ms;
}

function classifyLine(line: string): StabilityEvent['type'] | null {
  if (!/\[whatsapp\]/i.test(line)) return null;

  if (DISCONNECT_PATTERNS.some((p) => p.test(line))) return 'disconnect';
  if (RECONNECT_PATTERNS.some((p) => p.test(line))) return 'reconnect';
  if (RESTART_PATTERNS.some((p) => p.test(line))) return 'restart';
  return null;
}

export function analyzeWhatsAppStability(
  logPath: string,
  opts?: {
    nowMs?: number;
    lookbackHours?: number;
    disconnectWarnThreshold?: number;
    loopWindowMinutes?: number;
    loopEventThreshold?: number;
  }
): StabilitySummary {
  const nowMs = opts?.nowMs ?? Date.now();
  const lookbackHours = opts?.lookbackHours ?? 24;
  const disconnectWarnThreshold = opts?.disconnectWarnThreshold ?? 5;
  const loopWindowMs = (opts?.loopWindowMinutes ?? 10) * 60_000;
  const loopEventThreshold = opts?.loopEventThreshold ?? 3;
  const startMs = nowMs - (lookbackHours * 60 * 60 * 1000);

  if (!fs.existsSync(logPath)) {
    return {
      logPath,
      startIso: new Date(startMs).toISOString(),
      endIso: new Date(nowMs).toISOString(),
      disconnects: 0,
      reconnects: 0,
      restarts: 0,
      loops: [],
      currentState: 'unknown',
      alerts: [{
        severity: 'warning',
        code: 'log_missing',
        message: `Log file not found: ${logPath}`
      }]
    };
  }

  const raw = fs.readFileSync(logPath, 'utf8');
  const events: StabilityEvent[] = [];
  let restarts = 0;

  for (const line of raw.split('\n')) {
    const tsMs = parseTimestampMs(line);
    if (tsMs == null || tsMs < startMs || tsMs > nowMs) continue;
    if (!/\[whatsapp\]/i.test(line)) continue;

    if (RESTART_PATTERNS.some((p) => p.test(line))) {
      restarts += 1;
    }

    const type = classifyLine(line);
    if (!type) continue;

    events.push({
      tsMs,
      iso: new Date(tsMs).toISOString(),
      type,
      line: line.trim()
    });
  }

  events.sort((a, b) => a.tsMs - b.tsMs);

  const disconnects = events.filter((e) => e.type === 'disconnect').length;
  const reconnects = events.filter((e) => e.type === 'reconnect').length;

  const disconnectEvents = events.filter((e) => e.type === 'disconnect');
  const loops: StabilitySummary['loops'] = [];
  let i = 0;
  while (i < disconnectEvents.length) {
    const start = disconnectEvents[i].tsMs;
    let j = i;
    while (j + 1 < disconnectEvents.length && (disconnectEvents[j + 1].tsMs - start) <= loopWindowMs) {
      j += 1;
    }

    const eventsInWindow = j - i + 1;
    if (eventsInWindow >= loopEventThreshold) {
      loops.push({
        startIso: new Date(disconnectEvents[i].tsMs).toISOString(),
        endIso: new Date(disconnectEvents[j].tsMs).toISOString(),
        events: eventsInWindow
      });
      i = j + 1;
    } else {
      i += 1;
    }
  }

  const lastStateEvent = [...events].reverse().find((e) => e.type === 'disconnect' || e.type === 'reconnect');
  const currentState: StabilitySummary['currentState'] = lastStateEvent
    ? (lastStateEvent.type === 'disconnect' ? 'disconnected' : 'connected')
    : 'unknown';

  const alerts: StabilityAlert[] = [];
  if (disconnects >= disconnectWarnThreshold) {
    alerts.push({
      severity: disconnects >= disconnectWarnThreshold * 2 ? 'critical' : 'warning',
      code: 'disconnect_volume',
      message: `High disconnect volume: ${disconnects} disconnect events in last ${lookbackHours}h.`
    });
  }

  if (loops.length > 0) {
    alerts.push({
      severity: 'critical',
      code: 'reconnect_loop',
      message: `Reconnect loop detected: ${loops.length} burst(s) with >=${loopEventThreshold} disconnects within ${(loopWindowMs / 60_000)}m.`
    });
  }

  if (currentState === 'disconnected') {
    alerts.push({
      severity: 'warning',
      code: 'currently_disconnected',
      message: 'Latest WhatsApp state appears disconnected.'
    });
  }

  return {
    logPath,
    startIso: new Date(startMs).toISOString(),
    endIso: new Date(nowMs).toISOString(),
    disconnects,
    reconnects,
    restarts,
    loops,
    currentState,
    alerts
  };
}

export function renderStabilityMarkdown(summary: StabilitySummary): string {
  const lines = [
    '# WhatsApp Stability Tracker',
    '',
    `Window: ${summary.startIso} → ${summary.endIso}`,
    `Log: ${summary.logPath}`,
    '',
    `- Disconnects: **${summary.disconnects}**`,
    `- Reconnects: **${summary.reconnects}**`,
    `- Restarts/Retry signals: **${summary.restarts}**`,
    `- Current State: **${summary.currentState}**`
  ];

  if (summary.loops.length > 0) {
    lines.push('', '## Reconnect loops');
    for (const loop of summary.loops) {
      lines.push(`- ${loop.startIso} → ${loop.endIso} (${loop.events} disconnects)`);
    }
  }

  lines.push('', '## Alerts');
  if (summary.alerts.length === 0) {
    lines.push('- none ✅');
  } else {
    for (const alert of summary.alerts) {
      lines.push(`- [${alert.severity}] ${alert.code}: ${alert.message}`);
    }
  }

  lines.push('');
  return lines.join('\n');
}
