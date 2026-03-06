import fs from 'fs';
import path from 'path';
import readline from 'readline';

const DAY_MS = 24 * 60 * 60 * 1000;

function createToolStats() {
    return {
        calls: 0,
        results: 0,
        errors: 0,
        unresolvedCalls: 0,
        orphanResults: 0,
        totalDurationMs: 0,
        durationSamples: 0,
        durationSampleValuesMs: [],
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
        errors: 0,
        tools: {}
    };
}

function createHourToolStats() {
    return {
        toolCalls: 0,
        errors: 0,
        durationSamples: 0,
        totalDurationMs: 0,
        durationSampleValuesMs: [],
        maxDurationMs: 0
    };
}

function createHourWindowStats() {
    return {
        messages: 0,
        toolCalls: 0,
        errors: 0,
        tools: {}
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

function computePercentile(values, percentile) {
    if (!Array.isArray(values) || values.length === 0) return null;
    if (!Number.isFinite(percentile) || percentile < 0 || percentile > 1) return null;

    const sorted = [...values]
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value) && value >= 0)
        .sort((a, b) => a - b);

    if (sorted.length === 0) return null;
    if (sorted.length === 1) return roundNumber(sorted[0], 1);

    const index = (sorted.length - 1) * percentile;
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    if (lower === upper) {
        return roundNumber(sorted[lower], 1);
    }

    const weight = index - lower;
    const value = sorted[lower] + ((sorted[upper] - sorted[lower]) * weight);
    return roundNumber(value, 1);
}

function computeMedian(values) {
    if (!Array.isArray(values) || values.length === 0) return null;
    const sorted = [...values]
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value))
        .sort((a, b) => a - b);

    if (sorted.length === 0) return null;
    const mid = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
        return roundNumber((sorted[mid - 1] + sorted[mid]) / 2, 2);
    }
    return roundNumber(sorted[mid], 2);
}

function metricDelta(current, baseline) {
    const delta = roundNumber(current - baseline, 2);
    const pctDelta = baseline === 0
        ? null
        : roundNumber((delta / Math.abs(baseline)) * 100, 2);
    return { current, baseline, delta, pctDelta };
}


function summarizeHourTool(raw) {
    if (!raw || typeof raw !== 'object') {
        return {
            calls: 0,
            errors: 0,
            errorRate: 0,
            durationSamples: 0,
            p95DurationMs: null
        };
    }

    const calls = Number(raw.toolCalls) || 0;
    const errors = Number(raw.errors) || 0;
    const durationSamples = Number(raw.durationSamples) || 0;
    const durationValues = Array.isArray(raw.durationSampleValuesMs)
        ? raw.durationSampleValuesMs
            .map((value) => Number(value))
            .filter((value) => Number.isFinite(value) && value >= 0)
        : [];

    return {
        calls,
        errors,
        errorRate: roundNumber(safePercent(errors, calls), 2),
        durationSamples,
        p95DurationMs: computePercentile(durationValues, 0.95)
    };
}

function detectHourlyIncidents(hourlyWindows, options = {}) {
    if (!hourlyWindows || typeof hourlyWindows !== 'object') return [];

    const minCalls = Number.isFinite(Number(options.minCalls))
        ? Number(options.minCalls)
        : 5;
    const minDurationSamples = Number.isFinite(Number(options.minDurationSamples))
        ? Number(options.minDurationSamples)
        : 5;
    const baselineLookback = Number.isFinite(Number(options.baselineLookback))
        ? Number(options.baselineLookback)
        : 24;
    const minBaselineSamples = Number.isFinite(Number(options.minBaselineSamples))
        ? Number(options.minBaselineSamples)
        : 3;

    const incidents = [];
    const toolSeries = {};

    const sortedWindows = Object.entries(hourlyWindows)
        .sort(([left], [right]) => left.localeCompare(right));

    for (const [windowStartIso, bucket] of sortedWindows) {
        const hourUtc = windowStartIso.slice(11, 13);

        for (const [toolName, rawTool] of Object.entries(bucket?.tools || {})) {
            const snapshot = {
                windowStartIso,
                hourUtc,
                ...summarizeHourTool(rawTool)
            };

            if (!toolSeries[toolName]) {
                toolSeries[toolName] = [];
            }

            const history = toolSeries[toolName];
            const baseline = history.slice(-baselineLookback);

            const errorBaseline = baseline.filter((entry) => entry.calls >= minCalls);
            if (snapshot.calls >= minCalls && errorBaseline.length >= minBaselineSamples) {
                const baselineMedianErrorRate = computeMedian(errorBaseline.map((entry) => entry.errorRate)) || 0;
                const absoluteErrorThreshold = Math.max(15, baselineMedianErrorRate + 10);
                const relativeErrorThreshold = baselineMedianErrorRate > 0
                    ? baselineMedianErrorRate * 2
                    : absoluteErrorThreshold;
                const triggered = snapshot.errorRate >= Math.max(absoluteErrorThreshold, relativeErrorThreshold)
                    && snapshot.errors >= 2;

                if (triggered) {
                    const delta = roundNumber(snapshot.errorRate - baselineMedianErrorRate, 2);
                    const severityScore = roundNumber((delta * 1.2) + (snapshot.errors * 3), 2);
                    incidents.push({
                        type: 'error_spike',
                        severity: severityScore >= 35 ? 'high' : 'medium',
                        severityScore,
                        tool: toolName,
                        windowStartIso,
                        hourUtc,
                        observed: {
                            calls: snapshot.calls,
                            errors: snapshot.errors,
                            errorRate: snapshot.errorRate
                        },
                        baseline: {
                            sampleCount: errorBaseline.length,
                            medianErrorRate: baselineMedianErrorRate
                        },
                        summary: `${toolName} error spike at ${windowStartIso} (${snapshot.errorRate}% vs baseline ${baselineMedianErrorRate}%).`
                    });
                }
            }

            const latencyBaseline = baseline
                .filter((entry) => entry.durationSamples >= minDurationSamples && Number.isFinite(entry.p95DurationMs));
            if (snapshot.durationSamples >= minDurationSamples
                && Number.isFinite(snapshot.p95DurationMs)
                && latencyBaseline.length >= minBaselineSamples) {
                const baselineMedianP95 = computeMedian(latencyBaseline.map((entry) => entry.p95DurationMs)) || 0;
                const deltaP95 = roundNumber(snapshot.p95DurationMs - baselineMedianP95, 1);
                const absoluteThreshold = Math.max(5000, baselineMedianP95 + 1500);
                const relativeThreshold = baselineMedianP95 > 0
                    ? baselineMedianP95 * 1.75
                    : absoluteThreshold;

                const triggered = snapshot.p95DurationMs >= Math.max(absoluteThreshold, relativeThreshold)
                    && deltaP95 >= 1500;

                if (triggered) {
                    const severityScore = roundNumber((deltaP95 / 250) + (snapshot.durationSamples * 0.5), 2);
                    incidents.push({
                        type: 'latency_spike',
                        severity: severityScore >= 35 ? 'high' : 'medium',
                        severityScore,
                        tool: toolName,
                        windowStartIso,
                        hourUtc,
                        observed: {
                            calls: snapshot.calls,
                            durationSamples: snapshot.durationSamples,
                            p95DurationMs: snapshot.p95DurationMs
                        },
                        baseline: {
                            sampleCount: latencyBaseline.length,
                            medianP95DurationMs: baselineMedianP95
                        },
                        summary: `${toolName} latency spike at ${windowStartIso} (p95 ${snapshot.p95DurationMs}ms vs baseline ${baselineMedianP95}ms).`
                    });
                }
            }

            history.push(snapshot);
        }
    }

    return incidents
        .sort((a, b) => {
            if (b.severityScore !== a.severityScore) {
                return b.severityScore - a.severityScore;
            }
            return b.windowStartIso.localeCompare(a.windowStartIso);
        })
        .slice(0, 25);
}

function ensureToolSummary(raw) {
    if (!raw || typeof raw !== 'object') {
        return {
            calls: 0,
            results: 0,
            errors: 0,
            unresolvedCalls: 0,
            orphanResults: 0,
            totalDurationMs: 0,
            durationSamples: 0,
            durationSampleValuesMs: [],
            maxDurationMs: 0,
            avgDurationMs: null,
            p50DurationMs: null,
            p95DurationMs: null,
            errorRate: 0,
            unresolvedRate: 0,
            orphanResultRate: 0
        };
    }

    const calls = Number(raw.calls) || 0;
    const results = Number(raw.results) || 0;
    const errors = Number(raw.errors) || 0;
    const unresolvedCalls = Number(raw.unresolvedCalls) || 0;
    const orphanResults = Number(raw.orphanResults) || 0;
    const totalDurationMs = Number(raw.totalDurationMs) || 0;
    const durationSamples = Number(raw.durationSamples) || 0;
    const durationSampleValuesMs = Array.isArray(raw.durationSampleValuesMs)
        ? raw.durationSampleValuesMs
            .map((value) => Number(value))
            .filter((value) => Number.isFinite(value) && value >= 0)
        : [];
    const maxDurationMs = Number(raw.maxDurationMs) || 0;
    const avgDurationMs = raw.avgDurationMs === null || raw.avgDurationMs === undefined
        ? (durationSamples > 0 ? roundNumber(totalDurationMs / durationSamples, 1) : null)
        : Number(raw.avgDurationMs);
    const p50DurationMs = raw.p50DurationMs === null || raw.p50DurationMs === undefined
        ? computePercentile(durationSampleValuesMs, 0.5)
        : Number(raw.p50DurationMs);
    const p95DurationMs = raw.p95DurationMs === null || raw.p95DurationMs === undefined
        ? computePercentile(durationSampleValuesMs, 0.95)
        : Number(raw.p95DurationMs);
    const errorRate = raw.errorRate === undefined
        ? roundNumber(safePercent(errors, calls), 2)
        : Number(raw.errorRate);
    const unresolvedRate = raw.unresolvedRate === undefined
        ? roundNumber(safePercent(unresolvedCalls, calls), 2)
        : Number(raw.unresolvedRate);
    const orphanResultRate = raw.orphanResultRate === undefined
        ? roundNumber(safePercent(orphanResults, results), 2)
        : Number(raw.orphanResultRate);

    return {
        calls,
        results,
        errors,
        unresolvedCalls,
        orphanResults,
        totalDurationMs,
        durationSamples,
        durationSampleValuesMs,
        maxDurationMs,
        avgDurationMs: Number.isFinite(avgDurationMs) ? avgDurationMs : null,
        p50DurationMs: Number.isFinite(p50DurationMs) ? p50DurationMs : null,
        p95DurationMs: Number.isFinite(p95DurationMs) ? p95DurationMs : null,
        errorRate: Number.isFinite(errorRate) ? errorRate : 0,
        unresolvedRate: Number.isFinite(unresolvedRate) ? unresolvedRate : 0,
        orphanResultRate: Number.isFinite(orphanResultRate) ? orphanResultRate : 0
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
        unresolvedToolCalls: metricDelta(Number(currentSummary.unresolvedToolCalls) || 0, Number(baselineSummary.unresolvedToolCalls) || 0),
        orphanToolResults: metricDelta(Number(currentSummary.orphanToolResults) || 0, Number(baselineSummary.orphanToolResults) || 0),
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
        const unresolvedRateDelta = roundNumber(currentTool.unresolvedRate - baselineTool.unresolvedRate, 2);
        const avgDurationDelta = currentTool.avgDurationMs === null || baselineTool.avgDurationMs === null
            ? null
            : roundNumber(currentTool.avgDurationMs - baselineTool.avgDurationMs, 1);
        const p95DurationDelta = currentTool.p95DurationMs === null || baselineTool.p95DurationMs === null
            ? null
            : roundNumber(currentTool.p95DurationMs - baselineTool.p95DurationMs, 1);

        let regressionScore = 0;
        if (errorRateDelta > 0 && currentTool.calls >= 3) {
            regressionScore += errorRateDelta * 2;
        }
        if (avgDurationDelta !== null && avgDurationDelta > 0 && currentTool.calls >= 3) {
            regressionScore += avgDurationDelta / 1000;
        }
        if (p95DurationDelta !== null && p95DurationDelta > 0 && currentTool.calls >= 3) {
            regressionScore += p95DurationDelta / 2000;
        }
        if (callDelta > 0) {
            regressionScore += Math.min(callDelta / 10, 2);
        }
        if (unresolvedRateDelta > 0 && currentTool.calls >= 3) {
            regressionScore += unresolvedRateDelta * 1.5;
        }

        let improvementScore = 0;
        if (errorRateDelta < 0 && baselineTool.calls >= 3) {
            improvementScore += Math.abs(errorRateDelta) * 2;
        }
        if (avgDurationDelta !== null && avgDurationDelta < 0 && baselineTool.calls >= 3) {
            improvementScore += Math.abs(avgDurationDelta) / 1000;
        }
        if (p95DurationDelta !== null && p95DurationDelta < 0 && baselineTool.calls >= 3) {
            improvementScore += Math.abs(p95DurationDelta) / 2000;
        }

        const entry = {
            tool: name,
            currentCalls: currentTool.calls,
            baselineCalls: baselineTool.calls,
            callDelta,
            currentErrorRate: currentTool.errorRate,
            baselineErrorRate: baselineTool.errorRate,
            errorRateDelta,
            currentUnresolvedRate: currentTool.unresolvedRate,
            baselineUnresolvedRate: baselineTool.unresolvedRate,
            unresolvedRateDelta,
            currentAvgDurationMs: currentTool.avgDurationMs,
            baselineAvgDurationMs: baselineTool.avgDurationMs,
            avgDurationDeltaMs: avgDurationDelta,
            currentP50DurationMs: currentTool.p50DurationMs,
            baselineP50DurationMs: baselineTool.p50DurationMs,
            currentP95DurationMs: currentTool.p95DurationMs,
            baselineP95DurationMs: baselineTool.p95DurationMs,
            p95DurationDeltaMs: p95DurationDelta
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

    const incidents = Array.isArray(currentSummary.incidents)
        ? currentSummary.incidents
        : [];
    for (const incident of incidents.slice(0, 5)) {
        if (incident.type === 'error_spike') {
            add(
                'P1',
                `Contain ${incident.tool} error spike (${incident.hourUtc}:00 UTC)`,
                incident.summary,
                `Inspect ${incident.tool} traces for ${incident.windowStartIso}, identify the triggering change, and deploy rollback/fix plus an hourly alert guardrail.`,
                incident.severityScore || 0
            );
        } else if (incident.type === 'latency_spike') {
            add(
                'P1',
                `Contain ${incident.tool} latency spike (${incident.hourUtc}:00 UTC)`,
                incident.summary,
                `Profile the slowest ${incident.tool} executions during ${incident.windowStartIso}, cap tail execution time, and add fallback paths before the next run window.`,
                incident.severityScore || 0
            );
        }
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

    if ((currentSummary.unresolvedToolCalls || 0) > 0) {
        add(
            'P1',
            'Resolve dangling tool calls',
            `${currentSummary.unresolvedToolCalls} tool calls had no matching toolResult event.`,
            'Ensure every toolCall carries a stable call id and that toolResult events always emit for success/failure terminal states.',
            currentSummary.unresolvedToolCalls
        );
    }

    if ((currentSummary.orphanToolResults || 0) > 0) {
        add(
            'P2',
            'Investigate orphan tool results',
            `${currentSummary.orphanToolResults} toolResult events arrived without a visible prior toolCall in the same session stream.`,
            'Audit message ordering and replay behavior to guarantee call/result pairing remains in-order and lossless.',
            currentSummary.orphanToolResults
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

        if (tool.calls >= 5 && tool.unresolvedRate >= 5) {
            add(
                'P1',
                `Close ${tool.name} tool-call/result gaps`,
                `${tool.name} has ${tool.unresolvedRate}% unresolved calls (${tool.unresolvedCalls}/${tool.calls}).`,
                `Patch ${tool.name} call-id propagation and enforce terminal toolResult emission in all error/timeout paths.`,
                tool.unresolvedRate
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

        if (tool.calls >= 5 && tool.p95DurationMs !== null && tool.p95DurationMs >= 8000) {
            add(
                'P2',
                `Reduce ${tool.name} tail latency`,
                `${tool.name} p95 duration is ${tool.p95DurationMs}ms across ${tool.calls} calls.`,
                `Inspect slowest ${tool.name} traces and introduce bounded fallbacks for outlier paths.`,
                tool.p95DurationMs / 1000
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
            } else if ((regression.p95DurationDeltaMs || 0) >= 2000) {
                add(
                    'P2',
                    `Regressed tail latency in ${regression.tool}`,
                    `${regression.tool} p95 duration increased by ${regression.p95DurationDeltaMs}ms.`,
                    `Identify outlier traces for ${regression.tool}, then cap long-tail operations with staged fallbacks.`,
                    regression.p95DurationDeltaMs / 2000
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
        this.hourlyWindows = {};
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
            unresolvedToolCalls: 0,
            orphanToolResults: 0,
            tools: {},
            models: {},
            providers: {},
            stopReasons: {},
            byDay: {},
            hourlyActivity: {},
            incidents: [],
            incidentCount: 0,
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
        this.hourlyWindows = {};

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
        this.stats.incidents = detectHourlyIncidents(this.hourlyWindows);
        this.stats.incidentCount = this.stats.incidents.length;
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
        const sessionState = {
            pendingById: new Map(),
            pendingByTool: {}
        };

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
                this._processEvent(event, sessionState);
            } catch {
                this.stats.malformedLines++;
            }
        }

        this._flushPendingToolCalls(sessionState);
    }

    _processEvent(event, sessionState = null) {
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
                    const callId = this._extractToolCallId(item);
                    this._countToolCall(item.name, timestampMs, { callId, sessionState });
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
                bucket.durationSampleValuesMs.push(durationMs);
                bucket.maxDurationMs = Math.max(bucket.maxDurationMs, durationMs);
                this._recordHourDuration(timestampMs, toolName, durationMs);
            }

            if (sessionState) {
                const matched = this._matchToolResult(toolName, msg, sessionState);
                if (!matched) {
                    this._countOrphanResult(toolName);
                }
            }

            if (msg.isError) {
                this._countError(toolName, timestampMs);
            }
        }
    }

    _countToolCall(name, timestampMs, options = {}) {
        const bucket = this._getToolBucket(name);
        bucket.calls++;
        this.stats.toolCalls++;
        this._countDay(timestampMs, 'toolCalls');
        this._countHour(timestampMs, 'toolCalls', name);

        if (options.sessionState) {
            this._enqueuePendingToolCall(name, options.callId, options.sessionState);
        }
    }

    _countError(name, timestampMs) {
        const bucket = this._getToolBucket(name);
        bucket.errors++;
        this.stats.errors++;
        this._countDay(timestampMs, 'errors');
        this._countHour(timestampMs, 'errors', name);
    }

    _countUnresolvedCall(name) {
        const bucket = this._getToolBucket(name);
        bucket.unresolvedCalls++;
        this.stats.unresolvedToolCalls++;
    }

    _countOrphanResult(name) {
        const bucket = this._getToolBucket(name);
        bucket.orphanResults++;
        this.stats.orphanToolResults++;
    }

    _getToolBucket(name) {
        if (!this.stats.tools[name]) this.stats.tools[name] = createToolStats();
        return this.stats.tools[name];
    }

    _countMap(map, key) {
        map[key] = (map[key] || 0) + 1;
    }

    _enqueuePendingToolCall(toolName, rawCallId, sessionState) {
        const callId = this._normalizeToolCallId(rawCallId);
        if (callId) {
            sessionState.pendingById.set(callId, { toolName });
            return;
        }

        if (!sessionState.pendingByTool[toolName]) {
            sessionState.pendingByTool[toolName] = [];
        }
        sessionState.pendingByTool[toolName].push({ toolName });
    }

    _extractToolCallId(item) {
        if (!item || typeof item !== 'object') return null;

        return this._normalizeToolCallId(
            item.id
            ?? item.callId
            ?? item.toolCallId
            ?? item.tool_call_id
            ?? item.request?.id
        );
    }

    _extractToolResultCallId(message) {
        if (!message || typeof message !== 'object') return null;

        return this._normalizeToolCallId(
            message.callId
            ?? message.toolCallId
            ?? message.tool_call_id
            ?? message.details?.callId
            ?? message.details?.toolCallId
            ?? message.details?.tool_call_id
        );
    }

    _normalizeToolCallId(value) {
        if (typeof value !== 'string') return null;
        const trimmed = value.trim();
        return trimmed ? trimmed : null;
    }

    _matchToolResult(toolName, message, sessionState) {
        const resultCallId = this._extractToolResultCallId(message);
        if (resultCallId && sessionState.pendingById.has(resultCallId)) {
            sessionState.pendingById.delete(resultCallId);
            return true;
        }

        const queue = sessionState.pendingByTool[toolName];
        if (Array.isArray(queue) && queue.length > 0) {
            queue.shift();
            return true;
        }

        return false;
    }

    _flushPendingToolCalls(sessionState) {
        for (const pending of sessionState.pendingById.values()) {
            this._countUnresolvedCall(pending.toolName || 'unknown');
        }
        sessionState.pendingById.clear();

        for (const [toolName, queue] of Object.entries(sessionState.pendingByTool)) {
            if (!Array.isArray(queue) || queue.length === 0) continue;
            for (let i = 0; i < queue.length; i++) {
                this._countUnresolvedCall(toolName);
            }
            queue.length = 0;
        }
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

    _countHour(timestampMs, key, toolName = null) {
        if (!Number.isFinite(timestampMs)) return;
        const hour = new Date(timestampMs).toISOString().slice(11, 13);
        if (!this.stats.hourlyActivity[hour]) this.stats.hourlyActivity[hour] = createHourStats();

        const hourStats = this.stats.hourlyActivity[hour];
        hourStats[key]++;

        if (toolName) {
            if (!hourStats.tools[toolName]) {
                hourStats.tools[toolName] = { toolCalls: 0, errors: 0 };
            }
            if (key === 'toolCalls') hourStats.tools[toolName].toolCalls++;
            if (key === 'errors') hourStats.tools[toolName].errors++;
        }

        const windowStats = this._getHourWindowBucket(timestampMs);
        windowStats[key]++;

        if (toolName) {
            if (!windowStats.tools[toolName]) {
                windowStats.tools[toolName] = createHourToolStats();
            }
            if (key === 'toolCalls') windowStats.tools[toolName].toolCalls++;
            if (key === 'errors') windowStats.tools[toolName].errors++;
        }
    }

    _getHourWindowKey(timestampMs) {
        return `${new Date(timestampMs).toISOString().slice(0, 13)}:00:00.000Z`;
    }

    _getHourWindowBucket(timestampMs) {
        const key = this._getHourWindowKey(timestampMs);
        if (!this.hourlyWindows[key]) {
            this.hourlyWindows[key] = createHourWindowStats();
        }
        return this.hourlyWindows[key];
    }

    _recordHourDuration(timestampMs, toolName, durationMs) {
        if (!Number.isFinite(timestampMs)) return;
        if (!Number.isFinite(durationMs) || durationMs < 0) return;
        if (typeof toolName !== 'string' || !toolName.trim()) return;

        const windowStats = this._getHourWindowBucket(timestampMs);
        if (!windowStats.tools[toolName]) {
            windowStats.tools[toolName] = createHourToolStats();
        }

        const toolStats = windowStats.tools[toolName];
        toolStats.durationSamples++;
        toolStats.totalDurationMs += durationMs;
        toolStats.durationSampleValuesMs.push(durationMs);
        toolStats.maxDurationMs = Math.max(toolStats.maxDurationMs, durationMs);
    }

    _toolSummary() {
        const result = {};

        for (const [name, data] of Object.entries(this.stats.tools)) {
            const avgDurationMs = data.durationSamples > 0
                ? roundNumber(data.totalDurationMs / data.durationSamples, 1)
                : null;
            const p50DurationMs = computePercentile(data.durationSampleValuesMs, 0.5);
            const p95DurationMs = computePercentile(data.durationSampleValuesMs, 0.95);
            const errorRate = data.calls > 0
                ? roundNumber((data.errors / data.calls) * 100, 2)
                : 0;
            const unresolvedRate = data.calls > 0
                ? roundNumber((data.unresolvedCalls / data.calls) * 100, 2)
                : 0;
            const orphanResultRate = data.results > 0
                ? roundNumber((data.orphanResults / data.results) * 100, 2)
                : 0;

            result[name] = {
                calls: data.calls,
                results: data.results,
                errors: data.errors,
                unresolvedCalls: data.unresolvedCalls,
                orphanResults: data.orphanResults,
                totalDurationMs: data.totalDurationMs,
                durationSamples: data.durationSamples,
                maxDurationMs: data.maxDurationMs,
                avgDurationMs,
                p50DurationMs,
                p95DurationMs,
                errorRate,
                unresolvedRate,
                orphanResultRate
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
        const unresolvedRate = this.stats.unresolvedToolCalls / Math.max(this.stats.toolCalls, 1);

        const score = 100 - (errorRate * 65) - (malformedRate * 15) - (missingSessionRate * 10) - (unresolvedRate * 10);
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
            if (data.p95DurationMs !== null && data.calls >= 5 && data.p95DurationMs >= 8000) {
                insights.push(`Tail latency risk: ${tool} p95 is ${data.p95DurationMs}ms over ${data.calls} calls.`);
            }
            if (data.calls >= 5 && data.unresolvedRate >= 5) {
                insights.push(`Unresolved tool calls: ${tool} has ${data.unresolvedCalls}/${data.calls} calls without matching results (${data.unresolvedRate}%).`);
            }
            if (data.results >= 5 && data.orphanResultRate >= 5) {
                insights.push(`Orphan tool results: ${tool} has ${data.orphanResults}/${data.results} results without visible calls (${data.orphanResultRate}%).`);
            }
        }

        const topHour = this._topActiveHours(1)[0];
        if (topHour && this.stats.toolCalls >= 5) {
            const concentration = safePercent(topHour.toolCalls, this.stats.toolCalls);
            if (concentration >= 40) {
                insights.push(`Tool-call activity is concentrated around ${topHour.hourUtc}:00–${topHour.hourUtc}:59 UTC (${roundNumber(concentration, 1)}% of calls).`);
            }
        }

        const incidents = Array.isArray(this.stats.incidents) ? this.stats.incidents : [];
        for (const incident of incidents.slice(0, 3)) {
            if (incident.type === 'error_spike') {
                insights.push(`Incident detected: ${incident.tool} error spike at ${incident.windowStartIso} (${incident.observed.errorRate}% vs baseline ${incident.baseline.medianErrorRate}%).`);
            } else if (incident.type === 'latency_spike') {
                insights.push(`Incident detected: ${incident.tool} latency spike at ${incident.windowStartIso} (p95 ${incident.observed.p95DurationMs}ms vs baseline ${incident.baseline.medianP95DurationMs}ms).`);
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
        console.log(`Unresolved Calls: ${summary.unresolvedToolCalls}`);
        console.log(`Orphan Results:   ${summary.orphanToolResults}`);
        console.log(`Incidents:        ${summary.incidentCount || 0}`);
        console.log(`Reliability:      ${summary.reliabilityScore}/100`);
        console.log('\nTool Performance:');

        const sortedTools = Object.entries(summary.tools)
            .sort(([, a], [, b]) => b.calls - a.calls);

        if (sortedTools.length === 0) console.log('  (No tool calls detected)');

        console.log(`  ${'TOOL'.padEnd(20)} | ${'CALLS'.padEnd(6)} | ${'ERRORS'.padEnd(6)} | ${'RATE'.padEnd(8)} | ${'AVG_MS'.padEnd(8)} | ${'P95_MS'.padEnd(8)}`);
        console.log('  ' + '-'.repeat(76));

        for (const [tool, data] of sortedTools) {
            const rate = `${data.errorRate.toFixed(1)}%`;
            const avgDuration = data.avgDurationMs === null ? '-' : String(data.avgDurationMs);
            const p95Duration = data.p95DurationMs === null ? '-' : String(data.p95DurationMs);
            console.log(`  ${tool.padEnd(20)} | ${String(data.calls).padEnd(6)} | ${String(data.errors).padEnd(6)} | ${rate.padEnd(8)} | ${avgDuration.padEnd(8)} | ${p95Duration.padEnd(8)}`);
        }
        console.log('----------------------------------------------------------------------------');

        const activeHours = summary.topActiveHours || [];
        if (activeHours.length > 0) {
            console.log('\nTop Active UTC Hours:');
            for (const hour of activeHours) {
                console.log(`  - ${hour.hourUtc}:00 | tool calls ${hour.toolCalls}, messages ${hour.messages}, errors ${hour.errors}`);
            }
        }

        const incidents = Array.isArray(summary.incidents) ? summary.incidents : [];
        if (incidents.length > 0) {
            console.log('\nDetected Incidents:');
            for (const incident of incidents.slice(0, 5)) {
                console.log(`  - [${incident.type}] ${incident.summary}`);
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
