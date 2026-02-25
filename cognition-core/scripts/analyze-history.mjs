import fs from 'fs';
import os from 'os';
import path from 'path';
import { LogAnalyzerV2, buildComparison, buildRemediationPlan } from '../src/log-analyzer-v2.js';

const DAY_MS = 24 * 60 * 60 * 1000;

function printHelp() {
    console.log(`Cognition Core history analyzer

Usage:
  node scripts/analyze-history.mjs [options]

Options:
  --days <n>            Analyze sessions updated in the last n days (default: 7)
  --limit <n>           Analyze at most n session files after sorting by recency
  --sessions-file <p>   Path to sessions.json
  --no-compare          Disable previous-window trend comparison
  --compare-days <n>    Baseline window size in days (default: same as --days)
  --json <p>            Write JSON summary to file
  --markdown <p>        Write Markdown report to file
  --quiet               Skip terminal report output
  -h, --help            Show help
`);
}

function parsePositiveInt(raw, flag) {
    const parsed = Number(raw);
    if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new Error(`${flag} must be a positive integer, received: ${raw}`);
    }
    return parsed;
}

function parseArgs(argv) {
    const options = {
        days: 7,
        limitSessions: null,
        sessionsFile: path.join(os.homedir(), '.openclaw/agents/main/sessions/sessions.json'),
        compare: true,
        compareDays: null,
        jsonPath: null,
        markdownPath: null,
        quiet: false,
        help: false
    };

    for (let i = 0; i < argv.length; i++) {
        const token = argv[i];

        if (token === '--help' || token === '-h') {
            options.help = true;
            continue;
        }
        if (token === '--quiet') {
            options.quiet = true;
            continue;
        }
        if (token === '--no-compare') {
            options.compare = false;
            continue;
        }

        const value = argv[i + 1];
        if (value === undefined) {
            throw new Error(`Missing value for ${token}`);
        }

        if (token === '--days') {
            options.days = parsePositiveInt(value, '--days');
            i++;
            continue;
        }
        if (token === '--limit') {
            options.limitSessions = parsePositiveInt(value, '--limit');
            i++;
            continue;
        }
        if (token === '--sessions-file') {
            options.sessionsFile = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--compare-days') {
            options.compareDays = parsePositiveInt(value, '--compare-days');
            i++;
            continue;
        }
        if (token === '--json') {
            options.jsonPath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--markdown') {
            options.markdownPath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }

        throw new Error(`Unknown argument: ${token}`);
    }

    return options;
}

function ensureDirForFile(filePath) {
    const dir = path.dirname(filePath);
    fs.mkdirSync(dir, { recursive: true });
}

function formatPercent(raw) {
    return `${Number(raw).toFixed(2)}%`;
}

function formatDelta(value, suffix = '') {
    if (value === null || value === undefined) return 'n/a';
    const rounded = Number(value);
    const sign = rounded > 0 ? '+' : '';
    return `${sign}${rounded}${suffix}`;
}

function formatMarkdown(summary) {
    const lines = [];
    lines.push('# Cognition Core Report');
    lines.push('');
    lines.push(`Generated: ${summary.generatedAt}`);
    lines.push(`Window: ${summary.startIso} -> ${summary.endIso} (${summary.windowDays} day(s))`);
    lines.push('');
    lines.push('## Summary');
    lines.push('');
    lines.push(`- Sessions scanned: ${summary.sessionsScanned}/${summary.sessionsDiscovered}`);
    lines.push(`- Tool calls: ${summary.toolCalls}`);
    lines.push(`- Tool results: ${summary.toolResults}`);
    lines.push(`- Errors: ${summary.errors}`);
    lines.push(`- Malformed lines: ${summary.malformedLines}`);
    lines.push(`- Reliability score: ${summary.reliabilityScore}/100`);
    lines.push('');
    lines.push('## Top Tools');
    lines.push('');
    lines.push('| Tool | Calls | Errors | Error Rate | Avg Duration (ms) |');
    lines.push('| --- | ---: | ---: | ---: | ---: |');
    for (const tool of summary.topTools || []) {
        const avgDuration = tool.avgDurationMs === null ? '-' : tool.avgDurationMs;
        lines.push(`| ${tool.name} | ${tool.calls} | ${tool.errors} | ${formatPercent(tool.errorRate)} | ${avgDuration} |`);
    }
    if ((summary.topTools || []).length === 0) {
        lines.push('| (no tools) | 0 | 0 | 0.00% | - |');
    }
    lines.push('');

    if (summary.comparison) {
        const comparison = summary.comparison;
        lines.push('## Trend Comparison');
        lines.push('');
        lines.push(`Current window: ${comparison.windows.current.startIso} -> ${comparison.windows.current.endIso}`);
        lines.push(`Baseline window: ${comparison.windows.baseline.startIso} -> ${comparison.windows.baseline.endIso}`);
        lines.push(`Status: **${comparison.status}**`);
        lines.push(`Narrative: ${comparison.summaryText}`);
        lines.push('');
        lines.push('| KPI | Current | Baseline | Delta | Delta % |');
        lines.push('| --- | ---: | ---: | ---: | ---: |');

        const labelMap = {
            reliabilityScore: 'Reliability',
            errors: 'Errors',
            toolCalls: 'Tool Calls',
            toolResults: 'Tool Results',
            malformedLines: 'Malformed Lines',
            errorRate: 'Error Rate (%)'
        };

        for (const [key, metric] of Object.entries(comparison.kpis)) {
            const deltaPct = metric.pctDelta === null ? 'n/a' : `${metric.pctDelta}%`;
            lines.push(`| ${labelMap[key] || key} | ${metric.current} | ${metric.baseline} | ${formatDelta(metric.delta)} | ${deltaPct} |`);
        }
        lines.push('');

        lines.push('### Top Regressions');
        lines.push('');
        lines.push('| Tool | Calls Delta | Error Rate Delta (pp) | Avg Duration Delta (ms) |');
        lines.push('| --- | ---: | ---: | ---: |');
        for (const regression of comparison.topRegressions || []) {
            const durationDelta = regression.avgDurationDeltaMs === null ? 'n/a' : regression.avgDurationDeltaMs;
            lines.push(`| ${regression.tool} | ${formatDelta(regression.callDelta)} | ${formatDelta(regression.errorRateDelta)} | ${formatDelta(durationDelta)} |`);
        }
        if ((comparison.topRegressions || []).length === 0) {
            lines.push('| (none) | 0 | 0 | n/a |');
        }
        lines.push('');
    }

    lines.push('## Prioritized Remediation Plan');
    lines.push('');
    const remediation = summary.remediationPlan || [];
    for (let i = 0; i < remediation.length; i++) {
        const item = remediation[i];
        lines.push(`${i + 1}. [${item.priority}] ${item.title}`);
        lines.push(`Why: ${item.rationale}`);
        lines.push(`Action: ${item.action}`);
        lines.push('');
    }
    if (remediation.length === 0) {
        lines.push('1. [P3] No remediation required.');
        lines.push('');
    }

    lines.push('## Daily Activity');
    lines.push('');
    lines.push('| Day (UTC) | Messages | Tool Calls | Errors |');
    lines.push('| --- | ---: | ---: | ---: |');
    const days = Object.keys(summary.byDay || {}).sort();
    for (const day of days) {
        const bucket = summary.byDay[day];
        lines.push(`| ${day} | ${bucket.messages} | ${bucket.toolCalls} | ${bucket.errors} |`);
    }
    if (days.length === 0) {
        lines.push('| (no activity) | 0 | 0 | 0 |');
    }
    lines.push('');

    lines.push('## Insights');
    lines.push('');
    for (const insight of summary.insights || []) {
        lines.push(`- ${insight}`);
    }
    if ((summary.insights || []).length === 0) {
        lines.push('- No insights generated.');
    }
    lines.push('');

    return lines.join('\n');
}

function printComparison(comparison) {
    if (!comparison) return;
    console.log('\n--- Trend Comparison ---');
    console.log(`Status:         ${comparison.status}`);
    console.log(`Summary:        ${comparison.summaryText}`);
    console.log(`Reliability Δ:  ${formatDelta(comparison.kpis.reliabilityScore.delta)}`);
    console.log(`Error Rate Δ:   ${formatDelta(comparison.kpis.errorRate.delta, 'pp')}`);

    if ((comparison.topRegressions || []).length > 0) {
        console.log('\nTop Regressions:');
        for (const regression of comparison.topRegressions) {
            const durationDelta = regression.avgDurationDeltaMs === null ? 'n/a' : `${formatDelta(regression.avgDurationDeltaMs)}ms`;
            console.log(`  - ${regression.tool}: calls ${formatDelta(regression.callDelta)}, error rate ${formatDelta(regression.errorRateDelta)}pp, avg duration ${durationDelta}`);
        }
    }
}

function printRemediationPlan(remediationPlan) {
    console.log('\n--- Prioritized Remediation Plan ---');
    for (const item of remediationPlan) {
        console.log(`- [${item.priority}] ${item.title}`);
        console.log(`  Why: ${item.rationale}`);
        console.log(`  Action: ${item.action}`);
    }
}

(async () => {
    try {
        const options = parseArgs(process.argv.slice(2));
        if (options.help) {
            printHelp();
            return;
        }

        const anchorMs = Date.now();
        const currentEndMs = anchorMs;
        const currentStartMs = currentEndMs - (options.days * DAY_MS);

        const currentAnalyzer = new LogAnalyzerV2(options.sessionsFile);
        const currentSummary = await currentAnalyzer.analyze(options.days, {
            limitSessions: options.limitSessions,
            rangeStartMs: currentStartMs,
            rangeEndMs: currentEndMs,
            silent: true
        });

        let baselineSummary = null;
        if (options.compare) {
            const compareDays = options.compareDays || options.days;
            const baselineEndMs = currentStartMs;
            const baselineStartMs = baselineEndMs - (compareDays * DAY_MS);
            const baselineAnalyzer = new LogAnalyzerV2(options.sessionsFile);
            baselineSummary = await baselineAnalyzer.analyze(compareDays, {
                limitSessions: options.limitSessions,
                rangeStartMs: baselineStartMs,
                rangeEndMs: baselineEndMs,
                silent: true
            });
        }

        const comparison = baselineSummary
            ? buildComparison(currentSummary, baselineSummary)
            : null;
        const remediationPlan = buildRemediationPlan(currentSummary, comparison);

        const finalSummary = {
            ...currentSummary,
            baseline: baselineSummary,
            comparison,
            remediationPlan
        };

        if (!options.quiet) {
            currentAnalyzer.report(currentSummary);
            printComparison(comparison);
            printRemediationPlan(remediationPlan);
        }

        if (options.jsonPath) {
            ensureDirForFile(options.jsonPath);
            fs.writeFileSync(options.jsonPath, `${JSON.stringify(finalSummary, null, 2)}\n`);
            console.log(`\nJSON report written to ${options.jsonPath}`);
        }

        if (options.markdownPath) {
            ensureDirForFile(options.markdownPath);
            fs.writeFileSync(options.markdownPath, `${formatMarkdown(finalSummary)}\n`);
            console.log(`Markdown report written to ${options.markdownPath}`);
        }
    } catch (err) {
        console.error(`Analysis failed: ${err.message}`);
        process.exit(1);
    }
})();
