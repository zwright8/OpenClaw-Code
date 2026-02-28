import fs from 'fs';
import path from 'path';
import readline from 'readline';

const DAY_MS = 24 * 60 * 60 * 1000;

function createToolStats() {
    return {
        calls: 0,
        results: 0,
        errors: 0,
        totalDurationMs: 0,
        durationSamples: 0,
        maxDurationMs: 0
    };
}

function createDayStats() {
    return {
        messages: 0,
        toolCalls: 0,
        errors: 0
    };
}

function createHourStats() {
    return {
        messages: 0,
        toolCalls: 0,
        errors: 0
    };
}

function roundNumber(value, decimals = 2) {
    if (!Number.isFinite(value)) return value;
    const multiplier = 10 ** decimals;
    return Math.round(value * multiplier) / multiplier;
}

function safePercent(numerator, denominator) {
    if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator <= 0) return 0;
    return (numerator / denominator) * 100;
}

function metricDelta(current, baseline) {
    const delta = roundNumber(current - baseline, 2);
    const pctDelta = baseline === 0
        ? null
        : roundNumber((delta / Math.abs(baseline)) * 100, 2);
    return { current, baseline, delta, pctDelta };
}

function ensureToolSummary(raw) {
    if (!raw || typeof raw !== 'object') {
        return {
            calls: 0,
            results: 0,
            errors: 0,
            totalDurationMs: 0,
            durationSamples: 0,
            maxDurationMs: 0,
            avgDurationMs: null,
            errorRate: 0
        };
    }

    const calls = Number(raw.calls) || 0;
    const results = Number(raw.results) || 0;
    const errors = Number(raw.errors) || 0;
    const totalDurationMs = Number(raw.totalDurationMs) || 0;
    const durationSamples = Number(raw.durationSamples) || 0;
    const maxDurationMs = Number(raw.maxDurationMs) || 0;
    const avgDurationMs = raw.avgDurationMs === null || raw.avgDurationMs === undefined
        ? (durationSamples > 0 ? roundNumber(totalDurationMs / durationSamples, 1) : null)
        : Number(raw.avgDurationMs);
    const errorRate = raw.errorRate === undefined
        ? roundNumber(safePercent(errors, calls), 2)
        : Number(raw.errorRate);

    return {
        calls,
        results,
        errors,
        totalDurationMs,
        durationSamples,
        maxDurationMs,
        avgDurationMs: Number.isFinite(avgDurationMs) ? avgDurationMs : null,
        errorRate: Number.isFinite(errorRate) ? errorRate : 0
    };
}

export function buildComparison(currentSummary, baselineSummary) {
    if (!currentSummary || !baselineSummary) return null;

    const currentErrorRate = roundNumber(
        safePercent(currentSummary.errors, Math.max(currentSummary.toolResults || currentSummary.toolCalls, 1)),
        2
    );
    const baselineErrorRate = roundNumber(
        safePercent(baselineSummary.errors, Math.max(baselineSummary.toolResults || baselineSummary.toolCalls, 1)),
        2
    );

    const kpis = {
        reliabilityScore: metricDelta(Number(currentSummary.reliabilityScore) || 0, Number(baselineSummary.reliabilityScore) || 0),
        errors: metricDelta(Number(currentSummary.errors) || 0, Number(baselineSummary.errors) || 0),
        toolCalls: metricDelta(Number(currentSummary.toolCalls) || 0, Number(baselineSummary.toolCalls) || 0),
        toolResults: metricDelta(Number(currentSummary.toolResults) || 0, Number(baselineSummary.toolResults) || 0),
        malformedLines: metricDelta(Number(currentSummary.malformedLines) || 0, Number(baselineSummary.malformedLines) || 0),
        errorRate: metricDelta(currentErrorRate, baselineErrorRate)
    };

    const toolNames = new Set([
        ...Object.keys(currentSummary.tools || {}),
        ...Object.keys(baselineSummary.tools || {})
    ]);

    const regressions = [];
    const improvements = [];
    for (const name of toolNames) {
        const currentTool = ensureToolSummary(currentSummary.tools?.[name]);
        const baselineTool = ensureToolSummary(baselineSummary.tools?.[name]);
        const callDelta = currentTool.calls - baselineTool.calls;
        const errorRateDelta = roundNumber(currentTool.errorRate - baselineTool.errorRate, 2);
        const avgDurationDelta = currentTool.avgDurationMs === null || baselineTool.avgDurationMs === null
            ? null
            : roundNumber(currentTool.avgDurationMs - baselineTool.avgDurationMs, 1);

        let regressionScore = 0;
        if (errorRateDelta > 0 && currentTool.calls >= 3) {
            regressionScore += errorRateDelta * 2;
        }
        if (avgDurationDelta !== null && avgDurationDelta > 0 && currentTool.calls >= 3) {
            regressionScore += avgDurationDelta / 1000;
        }
        if (callDelta > 0) {
            regressionScore += Math.min(callDelta / 10, 2);
        }

        let improvementScore = 0;
        if (errorRateDelta < 0 && baselineTool.calls >= 3) {
            improvementScore += Math.abs(errorRateDelta) * 2;
        }
        if (avgDurationDelta !== null && avgDurationDelta < 0 && baselineTool.calls >= 3) {
            improvementScore += Math.abs(avgDurationDelta) / 1000;
        }

        const entry = {
            tool: name,
            currentCalls: currentTool.calls,
            baselineCalls: baselineTool.calls,
            callDelta,
            currentErrorRate: currentTool.errorRate,
            baselineErrorRate: baselineTool.errorRate,
            errorRateDelta,
            currentAvgDurationMs: currentTool.avgDurationMs,
            baselineAvgDurationMs: baselineTool.avgDurationMs,
            avgDurationDeltaMs: avgDurationDelta
        };

        if (regressionScore > 0) {
            regressions.push({ ...entry, score: roundNumber(regressionScore, 2) });
        }
        if (improvementScore > 0) {
            improvements.push({ ...entry, score: roundNumber(improvementScore, 2) });
        }
    }

    regressions.sort((a, b) => b.score - a.score);
    improvements.sort((a, b) => b.score - a.score);

    const reliabilityDelta = kpis.reliabilityScore.delta;
    const errorRateDelta = kpis.errorRate.delta;

    let status = 'stable';
    if (reliabilityDelta <= -2 || errorRateDelta >= 2) {
        status = 'regressing';
    } else if (reliabilityDelta >= 2 || errorRateDelta <= -2) {
        status = 'improving';
    }

    let summaryText = 'Performance appears stable across windows.';
    if (status === 'regressing') {
        summaryText = `Reliability dropped by ${Math.abs(reliabilityDelta)} points and error rate moved ${errorRateDelta >= 0 ? 'up' : 'down'} by ${Math.abs(errorRateDelta)} percentage points.`;
    }
    if (status === 'improving') {
        summaryText = `Reliability improved by ${Math.abs(reliabilityDelta)} points and error rate moved ${errorRateDelta <= 0 ? 'down' : 'up'} by ${Math.abs(errorRateDelta)} percentage points.`;
    }

    return {
        status,
        summaryText,
        windows: {
            current: {
                startIso: currentSummary.startIso,
                endIso: currentSummary.endIso,
                days: currentSummary.windowDays
            },
            baseline: {
                startIso: baselineSummary.startIso,
                endIso: baselineSummary.endIso,
                days: baselineSummary.windowDays
            }
        },
        kpis,
        topRegressions: regressions.slice(0, 5),
        topImprovements: improvements.slice(0, 5)
    };
}

export function buildRemediationPlan(currentSummary, comparison = null) {
    if (!currentSummary) return [];

    const plan = [];
    const seen = new Set();
    const priorityRank = { P1: 1, P2: 2, P3: 3 };

    function add(priority, title, rationale, action, impactScore = 0) {
        const key = `${priority}:${title}`;
        if (seen.has(key)) return;
        seen.add(key);
        plan.push({
            priority,
            title,
            rationale,
            action,
            impactScore: roundNumber(impactScore, 2)
        });
    }

    if ((currentSummary.malformedLines || 0) > 0) {
        add(
            'P1',
            'Fix malformed JSONL lines in session logs',
            `${currentSummary.malformedLines} malformed lines were skipped, reducing observability quality.`,
            'Identify malformed writers and enforce JSON serialization guards before writing session events.',
            currentSummary.malformedLines
        );
    }

    if ((currentSummary.sessionsMissingFile || 0) > 0) {
        add(
            'P2',
            'Repair session metadata file references',
            `${currentSummary.sessionsMissingFile} session entries pointed to missing files.`,
            'Backfill or prune stale session metadata entries and ensure session finalization writes sessionFile/sessionId consistently.',
            currentSummary.sessionsMissingFile
        );
    }

    const tools = Object.entries(currentSummary.tools || {})
        .map(([name, data]) => ({ name, ...ensureToolSummary(data) }))
        .sort((a, b) => b.calls - a.calls);

    for (const tool of tools) {
        if (tool.calls >= 5 && tool.errorRate >= 10) {
            add(
                'P1',
                `Reduce ${tool.name} failure rate`,
                `${tool.name} is failing at ${tool.errorRate}% over ${tool.calls} calls.`,
                `Add targeted retries, structured error taxonomy, and payload capture for ${tool.name} failures.`,
                tool.errorRate
            );
        } else if (tool.calls >= 5 && tool.errorRate >= 5) {
            add(
                'P2',
                `Monitor ${tool.name} error drift`,
                `${tool.name} error rate is ${tool.errorRate}% over ${tool.calls} calls.`,
                `Set alert thresholds and run focused test cases for ${tool.name} to prevent escalation.`,
                tool.errorRate
            );
        }
    }

    for (const tool of tools) {
        if (tool.calls >= 5 && tool.avgDurationMs !== null && tool.avgDurationMs >= 5000) {
            add(
                'P2',
                `Optimize ${tool.name} latency`,
                `${tool.name} averages ${tool.avgDurationMs}ms across ${tool.calls} calls.`,
                `Profile hot paths, cache repeated work, and cap long-running operations for ${tool.name}.`,
                tool.avgDurationMs / 1000
            );
        }
    }

    if (comparison) {
        if (comparison.status === 'regressing') {
            add(
                'P1',
                'Stabilize reliability trend',
                comparison.summaryText,
                'Treat top regressions as immediate fixes and gate releases on reliability score recovery.',
                Math.abs(comparison.kpis.reliabilityScore.delta)
            );
        }

        for (const regression of comparison.topRegressions || []) {
            if (regression.currentCalls < 3) continue;
            if (regression.errorRateDelta >= 5) {
                add(
                    'P1',
                    `Regressed error rate in ${regression.tool}`,
                    `${regression.tool} error rate increased by ${regression.errorRateDelta} percentage points.`,
                    `Compare successful vs failed ${regression.tool} traces between windows and patch the dominant failure mode.`,
                    regression.errorRateDelta
                );
            } else if ((regression.avgDurationDeltaMs || 0) >= 1000) {
                add(
                    'P2',
                    `Regressed latency in ${regression.tool}`,
                    `${regression.tool} average duration increased by ${regression.avgDurationDeltaMs}ms.`,
                    `Audit upstream dependencies used by ${regression.tool} and introduce timeout/fallback paths.`,
                    regression.avgDurationDeltaMs / 1000
                );
            }
        }
    }

    if (plan.length === 0) {
        add(
            'P3',
            'Maintain current quality baseline',
            'No severe reliability risks were detected in this window.',
            'Continue tracking weekly trends and keep current alerting thresholds.'
        );
    }

    plan.sort((a, b) => {
        if (priorityRank[a.priority] !== priorityRank[b.priority]) {
            return priorityRank[a.priority] - priorityRank[b.priority];
        }
        return b.impactScore - a.impactScore;
    });

    return plan.map(({ priority, title, rationale, action }) => ({
        priority,
        title,
        rationale,
        action
    }));
}

export class LogAnalyzerV2 {
    constructor(sessionsJsonPath) {
        this.sessionsPath = sessionsJsonPath;
        this.sessionsDir = path.dirname(sessionsJsonPath);
        this.stats = this._createEmptyStats();
    }

    _createEmptyStats() {
        return {
            sessionsConsidered: 0,
            sessionsDiscovered: 0,
            sessionsScanned: 0,
            sessionsSkippedOld: 0,
            sessionsSkippedFuture: 0,
            sessionsMissingFile: 0,
            sessionsMissingUpdatedAt: 0,
            sessionsDeduped: 0,
            sessionsLimited: 0,
            linesProcessed: 0,
            malformedLines: 0,
            messagesProcessed: 0,
            toolCalls: 0,
            toolResults: 0,
            errors: 0,
            tools: {},
            models: {},
            providers: {},
            stopReasons: {},
            byDay: {},
            hourlyActivity: {},
            cutoffIso: null,
            startIso: null,
            endIso: null,
            generatedAt: null,
            windowDays: null
        };
    }

    async analyze(daysBack = 1, options = {}) {
        if (!Number.isFinite(daysBack) || daysBack <= 0) {
            throw new Error(`Invalid daysBack value: ${daysBack}`);
        }

        this.stats = this._createEmptyStats();

        if (!fs.existsSync(this.sessionsPath)) {
            throw new Error(`Sessions file not found: ${this.sessionsPath}`);
        }

        const nowMs = Number.isFinite(Number(options.nowMs))
            ? Number(options.nowMs)
            : Date.now();
        const rangeEndMs = Number.isFinite(Number(options.rangeEndMs))
            ? Number(options.rangeEndMs)
            : nowMs;
        const rangeStartMs = Number.isFinite(Number(options.rangeStartMs))
            ? Number(options.rangeStartMs)
            : (rangeEndMs - (daysBack * DAY_MS));

        if (rangeEndMs <= rangeStartMs) {
            throw new Error(`Invalid range: end (${rangeEndMs}) must be greater than start (${rangeStartMs})`);
        }

        this.stats.windowDays = roundNumber((rangeEndMs - rangeStartMs) / DAY_MS, 3);
        this.stats.startIso = new Date(rangeStartMs).toISOString();
        this.stats.endIso = new Date(rangeEndMs).toISOString();
        this.stats.cutoffIso = this.stats.startIso;

        if (!options.silent) {
            console.log(`Scanning sessions updated between ${this.stats.startIso} and ${this.stats.endIso}...`);
        }

        const sessionsData = JSON.parse(fs.readFileSync(this.sessionsPath, 'utf8'));
        const candidates = this._collectCandidateSessions(sessionsData, rangeStartMs, rangeEndMs);
        const limitSessions = Number(options.limitSessions);
        const selectedSessions = Number.isInteger(limitSessions) && limitSessions > 0
            ? candidates.slice(0, limitSessions)
            : candidates;

        this.stats.sessionsDiscovered = candidates.length;
        this.stats.sessionsLimited = Math.max(candidates.length - selectedSessions.length, 0);

        for (const candidate of selectedSessions) {
            await this._processSessionFile(candidate.filePath);
            this.stats.sessionsScanned++;
        }

        this.stats.generatedAt = new Date(rangeEndMs).toISOString();
        return this.toJSON();
    }

    _collectCandidateSessions(sessionsData, rangeStartMs, rangeEndMs) {
        const candidates = [];
        const seenFiles = new Set();

        for (const meta of Object.values(sessionsData)) {
            if (!meta || typeof meta !== 'object') continue;

            const updatedAt = Number(meta.updatedAt);
            if (!Number.isFinite(updatedAt)) {
                this.stats.sessionsMissingUpdatedAt++;
                continue;
            }

            if (updatedAt < rangeStartMs) {
                this.stats.sessionsSkippedOld++;
                continue;
            }
            if (updatedAt >= rangeEndMs) {
                this.stats.sessionsSkippedFuture++;
                continue;
            }

            this.stats.sessionsConsidered++;

            const filePath = this._resolveSessionFile(meta);
            if (!filePath || !fs.existsSync(filePath)) {
                this.stats.sessionsMissingFile++;
                continue;
            }

            if (seenFiles.has(filePath)) {
                this.stats.sessionsDeduped++;
                continue;
            }

            seenFiles.add(filePath);
            candidates.push({ filePath, updatedAt });
        }

        candidates.sort((a, b) => b.updatedAt - a.updatedAt);
        return candidates;
    }

    _resolveSessionFile(meta) {
        if (typeof meta.sessionFile === 'string' && meta.sessionFile.trim()) {
            return meta.sessionFile;
        }

        if (typeof meta.sessionId === 'string' && meta.sessionId.trim()) {
            return path.join(this.sessionsDir, `${meta.sessionId}.jsonl`);
        }

        return null;
    }

    async _processSessionFile(filePath) {
        const fileStream = fs.createReadStream(filePath);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        for await (const line of rl) {
            if (!line.trim()) continue;
            this.stats.linesProcessed++;

            try {
                const event = JSON.parse(line);
                this._processEvent(event);
            } catch {
                this.stats.malformedLines++;
            }
        }
    }

    _processEvent(event) {
        if (!event || typeof event !== 'object') return;

        if (event.type === 'model_change' && typeof event.modelId === 'string') {
            this._countMap(this.stats.models, event.modelId);
        }
        if (typeof event.provider === 'string') {
            this._countMap(this.stats.providers, event.provider);
        }

        if (event.type !== 'message' || !event.message || typeof event.message !== 'object') return;
        const msg = event.message;
        this.stats.messagesProcessed++;

        if (typeof msg.model === 'string') {
            this._countMap(this.stats.models, msg.model);
        }
        if (typeof msg.provider === 'string') {
            this._countMap(this.stats.providers, msg.provider);
        }
        if (typeof msg.stopReason === 'string') {
            this._countMap(this.stats.stopReasons, msg.stopReason);
        }

        const timestampMs = this._normalizeTimestamp(msg.timestamp) ?? this._normalizeTimestamp(event.timestamp);
        this._countDay(timestampMs, 'messages');
        this._countHour(timestampMs, 'messages');

        if (msg.role === 'assistant' && Array.isArray(msg.content)) {
            for (const item of msg.content) {
                if (!item || typeof item !== 'object') continue;
                if ((item.type === 'toolCall' || item.type === 'tool_call' || item.type === 'function_call')
                    && typeof item.name === 'string' && item.name.trim()) {
                    this._countToolCall(item.name, timestampMs);
                }
            }
        }

        if (msg.role === 'toolResult') {
            this.stats.toolResults++;
            const toolName = typeof msg.toolName === 'string' && msg.toolName.trim()
                ? msg.toolName
                : 'unknown';

            const bucket = this._getToolBucket(toolName);
            bucket.results++;

            const durationMs = Number(msg.details?.durationMs);
            if (Number.isFinite(durationMs) && durationMs >= 0) {
                bucket.totalDurationMs += durationMs;
                bucket.durationSamples++;
                bucket.maxDurationMs = Math.max(bucket.maxDurationMs, durationMs);
            }

            if (msg.isError) {
                this._countError(toolName, timestampMs);
            }
        }
    }

    _countToolCall(name, timestampMs) {
        const bucket = this._getToolBucket(name);
        bucket.calls++;
        this.stats.toolCalls++;
        this._countDay(timestampMs, 'toolCalls');
        this._countHour(timestampMs, 'toolCalls');
    }

    _countError(name, timestampMs) {
        const bucket = this._getToolBucket(name);
        bucket.errors++;
        this.stats.errors++;
        this._countDay(timestampMs, 'errors');
        this._countHour(timestampMs, 'errors');
    }

    _getToolBucket(name) {
        if (!this.stats.tools[name]) this.stats.tools[name] = createToolStats();
        return this.stats.tools[name];
    }

    _countMap(map, key) {
        map[key] = (map[key] || 0) + 1;
    }

    _normalizeTimestamp(input) {
        if (typeof input === 'number' && Number.isFinite(input)) {
            return input < 1e12 ? input * 1000 : input;
        }

        if (typeof input === 'string' && input.trim()) {
            const numeric = Number(input);
            if (Number.isFinite(numeric)) {
                return numeric < 1e12 ? numeric * 1000 : numeric;
            }

            const parsed = Date.parse(input);
            if (!Number.isNaN(parsed)) return parsed;
        }

        return null;
    }

    _countDay(timestampMs, key) {
        if (!Number.isFinite(timestampMs)) return;
        const day = new Date(timestampMs).toISOString().slice(0, 10);
        if (!this.stats.byDay[day]) this.stats.byDay[day] = createDayStats();
        this.stats.byDay[day][key]++;
    }

    _countHour(timestampMs, key) {
        if (!Number.isFinite(timestampMs)) return;
        const hour = new Date(timestampMs).toISOString().slice(11, 13);
        if (!this.stats.hourlyActivity[hour]) this.stats.hourlyActivity[hour] = createHourStats();
        this.stats.hourlyActivity[hour][key]++;
    }

    _toolSummary() {
        const result = {};

        for (const [name, data] of Object.entries(this.stats.tools)) {
            const avgDurationMs = data.durationSamples > 0
                ? roundNumber(data.totalDurationMs / data.durationSamples, 1)
                : null;
            const errorRate = data.calls > 0
                ? roundNumber((data.errors / data.calls) * 100, 2)
                : 0;

            result[name] = {
                ...data,
                avgDurationMs,
                errorRate
            };
        }

        return result;
    }

    _topActiveHours(limit = 5) {
        return Object.entries(this.stats.hourlyActivity)
            .map(([hourUtc, bucket]) => ({ hourUtc, ...bucket }))
            .sort((a, b) => {
                if (b.toolCalls !== a.toolCalls) return b.toolCalls - a.toolCalls;
                if (b.messages !== a.messages) return b.messages - a.messages;
                return b.errors - a.errors;
            })
            .slice(0, limit);
    }

    _getReliabilityScore() {
        const errorRate = this.stats.errors / Math.max(this.stats.toolResults || this.stats.toolCalls, 1);
        const malformedRate = this.stats.malformedLines / Math.max(this.stats.linesProcessed, 1);
        const missingSessionRate = this.stats.sessionsMissingFile / Math.max(this.stats.sessionsConsidered, 1);

        const score = 100 - (errorRate * 70) - (malformedRate * 20) - (missingSessionRate * 10);
        return roundNumber(Math.max(0, Math.min(100, score)), 1);
    }

    getInsights() {
        const insights = [];
        const sortedTools = Object.entries(this._toolSummary())
            .sort(([, a], [, b]) => b.calls - a.calls);

        for (const [tool, data] of sortedTools) {
            if (data.calls >= 5 && data.errorRate >= 10) {
                insights.push(`High failure rate: ${tool} is at ${data.errorRate}% over ${data.calls} calls.`);
            }
            if (data.avgDurationMs !== null && data.calls >= 5 && data.avgDurationMs >= 5000) {
                insights.push(`Slow tool: ${tool} averages ${data.avgDurationMs}ms over ${data.calls} calls.`);
            }
        }

        const topHour = this._topActiveHours(1)[0];
        if (topHour && this.stats.toolCalls >= 5) {
            const concentration = safePercent(topHour.toolCalls, this.stats.toolCalls);
            if (concentration >= 40) {
                insights.push(`Tool-call activity is concentrated around ${topHour.hourUtc}:00–${topHour.hourUtc}:59 UTC (${roundNumber(concentration, 1)}% of calls).`);
            }
        }

        if (this.stats.sessionsMissingFile > 0) {
            insights.push(`Session metadata references missing files (${this.stats.sessionsMissingFile}).`);
        }

        if (this.stats.malformedLines > 0) {
            insights.push(`Malformed JSONL lines detected (${this.stats.malformedLines}).`);
        }

        if (insights.length === 0 && this.stats.errors === 0) {
            insights.push('No tool errors detected in the analysis window.');
        }

        return insights;
    }

    toJSON() {
        const tools = this._toolSummary();
        const topTools = Object.entries(tools)
            .sort(([, a], [, b]) => b.calls - a.calls)
            .slice(0, 10)
            .map(([name, data]) => ({ name, ...data }));

        return {
            ...this.stats,
            tools,
            topTools,
            topActiveHours: this._topActiveHours(),
            reliabilityScore: this._getReliabilityScore(),
            insights: this.getInsights()
        };
    }

    report(summaryOverride = null) {
        const summary = summaryOverride || this.toJSON();
        console.log('\n--- Cognition Core: Log Analysis v2 ---');
        console.log(`Window:           ${summary.windowDays} day(s)`);
        console.log(`Range:            ${summary.startIso} -> ${summary.endIso}`);
        console.log(`Sessions Scanned: ${summary.sessionsScanned}/${summary.sessionsDiscovered}`);
        console.log(`Lines Processed:  ${summary.linesProcessed}`);
        console.log(`Malformed Lines:  ${summary.malformedLines}`);
        console.log(`Total Errors:     ${summary.errors}`);
        console.log(`Reliability:      ${summary.reliabilityScore}/100`);
        console.log('\nTool Performance:');

        const sortedTools = Object.entries(summary.tools)
            .sort(([, a], [, b]) => b.calls - a.calls);

        if (sortedTools.length === 0) console.log('  (No tool calls detected)');

        console.log(`  ${'TOOL'.padEnd(20)} | ${'CALLS'.padEnd(6)} | ${'ERRORS'.padEnd(6)} | ${'RATE'.padEnd(8)} | ${'AVG_MS'.padEnd(8)}`);
        console.log('  ' + '-'.repeat(64));

        for (const [tool, data] of sortedTools) {
            const rate = `${data.errorRate.toFixed(1)}%`;
            const avgDuration = data.avgDurationMs === null ? '-' : String(data.avgDurationMs);
            console.log(`  ${tool.padEnd(20)} | ${String(data.calls).padEnd(6)} | ${String(data.errors).padEnd(6)} | ${rate.padEnd(8)} | ${avgDuration.padEnd(8)}`);
        }
        console.log('----------------------------------------------------------------');

        const activeHours = summary.topActiveHours || [];
        if (activeHours.length > 0) {
            console.log('\nTop Active UTC Hours:');
            for (const hour of activeHours) {
                console.log(`  - ${hour.hourUtc}:00 | tool calls ${hour.toolCalls}, messages ${hour.messages}, errors ${hour.errors}`);
            }
        }

        if (summary.insights.length > 0) {
            console.log('\nInsights:');
            for (const insight of summary.insights) {
                console.log(`  - ${insight}`);
            }
        }
    }
}
