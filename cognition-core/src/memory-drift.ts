import fs from 'fs';
import path from 'path';

const ERROR_REGEX = /\b(error|failed|failure|incident|regression|timeout|bug)\b/gi;
const LESSON_REGEX = /\b(lesson|learned|root cause|postmortem|retrospective)\b/gi;
const ACTION_REGEX = /\b(action item|todo|fix|mitigation|follow[- ]?up|next step)\b/gi;
const EXPERIMENT_REGEX = /\b(experiment|hypothesis|counterfactual|trial|a\/b|ab test)\b/gi;
const SKILL_REGEX = /\b(skill|capability|playbook|runbook|competenc)\w*\b/gi;

function round(value, decimals = 4) {
    if (!Number.isFinite(value)) return value;
    return Number(value.toFixed(decimals));
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function countMatches(text, regex) {
    if (typeof text !== 'string' || !text.trim()) return 0;
    const matches = text.match(regex);
    return matches ? matches.length : 0;
}

function createSignalTotals() {
    return {
        entries: 0,
        errorMentions: 0,
        lessonMentions: 0,
        actionMentions: 0,
        experimentMentions: 0,
        skillMentions: 0,
        totalBytes: 0
    };
}

function summarizeSignals(entries) {
    const totals = createSignalTotals();
    let minTimestamp = null;
    let maxTimestamp = null;

    for (const entry of entries) {
        totals.entries++;
        totals.errorMentions += entry.signals.errorMentions;
        totals.lessonMentions += entry.signals.lessonMentions;
        totals.actionMentions += entry.signals.actionMentions;
        totals.experimentMentions += entry.signals.experimentMentions;
        totals.skillMentions += entry.signals.skillMentions;
        totals.totalBytes += entry.sizeBytes || 0;

        if (Number.isFinite(entry.timestampMs)) {
            minTimestamp = minTimestamp === null
                ? entry.timestampMs
                : Math.min(minTimestamp, entry.timestampMs);
            maxTimestamp = maxTimestamp === null
                ? entry.timestampMs
                : Math.max(maxTimestamp, entry.timestampMs);
        }
    }

    const reflectiveMentions = totals.lessonMentions + totals.actionMentions;
    const errorIntensity = totals.entries > 0
        ? round(totals.errorMentions / totals.entries, 3)
        : 0;
    const reflectionCoverage = totals.errorMentions > 0
        ? round(reflectiveMentions / totals.errorMentions, 3)
        : (reflectiveMentions > 0 ? 1 : 0);
    const learningDensity = totals.entries > 0
        ? round((reflectiveMentions + totals.experimentMentions + totals.skillMentions) / totals.entries, 3)
        : 0;
    const skillSignalRate = totals.entries > 0
        ? round(totals.skillMentions / totals.entries, 3)
        : 0;

    return {
        ...totals,
        reflectiveMentions,
        errorIntensity,
        reflectionCoverage,
        learningDensity,
        skillSignalRate,
        startIso: minTimestamp === null ? null : new Date(minTimestamp).toISOString(),
        endIso: maxTimestamp === null ? null : new Date(maxTimestamp).toISOString()
    };
}

function parseTimestampFromFileName(filePath) {
    const fileName = path.basename(filePath);
    const dateMatch = fileName.match(/^(\d{4})-(\d{2})-(\d{2})(?:[_.-].*)?\.md$/i);
    if (!dateMatch) return null;
    const isoDate = `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}T00:00:00.000Z`;
    const parsed = Date.parse(isoDate);
    return Number.isNaN(parsed) ? null : parsed;
}

function extractSignals(content) {
    return {
        errorMentions: countMatches(content, ERROR_REGEX),
        lessonMentions: countMatches(content, LESSON_REGEX),
        actionMentions: countMatches(content, ACTION_REGEX),
        experimentMentions: countMatches(content, EXPERIMENT_REGEX),
        skillMentions: countMatches(content, SKILL_REGEX)
    };
}

function scanMarkdownFiles(root, output = []) {
    if (!fs.existsSync(root)) return output;

    const items = fs.readdirSync(root);
    for (const item of items) {
        if (item === 'node_modules' || item === '.git') continue;
        const fullPath = path.join(root, item);
        const stats = fs.statSync(fullPath);
        if (stats.isDirectory()) {
            scanMarkdownFiles(fullPath, output);
            continue;
        }
        if (stats.isFile() && item.toLowerCase().endsWith('.md')) {
            output.push({ filePath: fullPath, stats });
        }
    }

    return output;
}

export function scanMemoryEntries(
    memoryRoot,
    {
        rangeStartMs = null,
        rangeEndMs = null,
        maxEntries = Number.POSITIVE_INFINITY
    } = {}
) {
    if (!memoryRoot || typeof memoryRoot !== 'string') {
        throw new Error('scanMemoryEntries requires memoryRoot path');
    }

    const files = scanMarkdownFiles(memoryRoot);
    const entries = [];

    for (const file of files) {
        const fallbackTimestamp = Number(file.stats.mtimeMs);
        const timestampMs = parseTimestampFromFileName(file.filePath) ?? fallbackTimestamp;
        if (!Number.isFinite(timestampMs)) continue;

        if (Number.isFinite(rangeStartMs) && timestampMs < Number(rangeStartMs)) continue;
        if (Number.isFinite(rangeEndMs) && timestampMs >= Number(rangeEndMs)) continue;

        const content = fs.readFileSync(file.filePath, 'utf8');
        entries.push({
            filePath: file.filePath,
            relativePath: path.relative(memoryRoot, file.filePath),
            timestampMs,
            timestampIso: new Date(timestampMs).toISOString(),
            sizeBytes: Buffer.byteLength(content),
            signals: extractSignals(content)
        });
    }

    entries.sort((a, b) => b.timestampMs - a.timestampMs);
    const cap = Number(maxEntries);
    if (Number.isInteger(cap) && cap > 0 && entries.length > cap) {
        return entries.slice(0, cap);
    }
    return entries;
}

export function compareMemoryWindows(currentEntries, baselineEntries = []) {
    const current = summarizeSignals(Array.isArray(currentEntries) ? currentEntries : []);
    const baseline = summarizeSignals(Array.isArray(baselineEntries) ? baselineEntries : []);

    const deltas = {
        errorIntensity: round(current.errorIntensity - baseline.errorIntensity, 3),
        reflectionCoverage: round(current.reflectionCoverage - baseline.reflectionCoverage, 3),
        learningDensity: round(current.learningDensity - baseline.learningDensity, 3),
        skillSignalRate: round(current.skillSignalRate - baseline.skillSignalRate, 3)
    };

    const errorPressure = deltas.errorIntensity;
    const reflectionDrop = -deltas.reflectionCoverage;
    const densityDrop = -deltas.learningDensity;
    const score = round(
        clamp(errorPressure * 0.45, -2, 2)
        + clamp(reflectionDrop * 0.35, -2, 2)
        + clamp(densityDrop * 0.2, -2, 2),
        3
    );

    let driftLevel = 'stable';
    if (score >= 0.7 || (current.errorIntensity >= 2 && current.reflectionCoverage < 0.5)) {
        driftLevel = 'critical';
    } else if (score >= 0.3 || (current.errorIntensity >= 1 && current.reflectionCoverage < 0.8)) {
        driftLevel = 'watch';
    } else if (score <= -0.3 || (current.reflectionCoverage >= 1.2 && current.learningDensity >= baseline.learningDensity)) {
        driftLevel = 'improving';
    }

    const insights = [];
    if (current.entries === 0) {
        insights.push('No memory entries were detected in the current window.');
    } else {
        insights.push(`Memory window has ${current.entries} entries with error intensity ${current.errorIntensity}.`);
    }

    if (current.errorMentions > 0 && current.reflectionCoverage < 0.8) {
        insights.push('Reflection coverage is low relative to error volume; lessons/actions are lagging incident count.');
    }
    if (deltas.skillSignalRate < 0) {
        insights.push('Skill references in memory decreased versus baseline.');
    }
    if (driftLevel === 'improving') {
        insights.push('Memory quality trend is improving based on reflection coverage and learning density.');
    }

    const recommendedActions = [];
    if (driftLevel === 'critical' || driftLevel === 'watch') {
        recommendedActions.push('Require each error-related memory entry to include root cause and mitigation action.');
    }
    if (current.errorMentions > 0 && current.reflectionCoverage < 1) {
        recommendedActions.push('Increase lesson-to-error ratio by appending explicit postmortem bullets to incident notes.');
    }
    if (deltas.skillSignalRate <= 0) {
        recommendedActions.push('Tag memory entries with capability/skill identifiers to improve longitudinal skill tracking.');
    }
    if (recommendedActions.length === 0) {
        recommendedActions.push('Continue current memory hygiene and monitor drift weekly.');
    }

    return {
        currentWindow: current,
        baselineWindow: baseline,
        deltas,
        driftScore: score,
        driftLevel,
        insights,
        recommendedActions
    };
}

export function analyzeMemoryDriftFromFiles(
    memoryRoot,
    {
        currentStartMs = null,
        currentEndMs = null,
        baselineStartMs = null,
        baselineEndMs = null,
        maxEntries = Number.POSITIVE_INFINITY
    } = {}
) {
    const currentEntries = scanMemoryEntries(memoryRoot, {
        rangeStartMs: currentStartMs,
        rangeEndMs: currentEndMs,
        maxEntries
    });
    const baselineEntries = Number.isFinite(baselineStartMs) || Number.isFinite(baselineEndMs)
        ? scanMemoryEntries(memoryRoot, {
            rangeStartMs: baselineStartMs,
            rangeEndMs: baselineEndMs,
            maxEntries
        })
        : [];

    const comparison = compareMemoryWindows(currentEntries, baselineEntries);
    return {
        generatedAt: new Date().toISOString(),
        memoryRoot,
        currentEntries: currentEntries.length,
        baselineEntries: baselineEntries.length,
        ...comparison
    };
}

export const __memoryDriftInternals = {
    extractSignals,
    summarizeSignals,
    parseTimestampFromFileName
};
