import type { DailyJsonReport } from './json.js';

function formatPercent(value: number): string {
    return `${(value * 100).toFixed(2)}%`;
}

function formatValue(value: number | null): string {
    if (value === null) return 'n/a';
    return Number.isInteger(value) ? `${value}` : `${value}`;
}

function statusEmoji(status: string): string {
    if (status === 'pass') return '✅';
    if (status === 'warn') return '⚠️';
    if (status === 'fail') return '🛑';
    return '➖';
}

export function renderDailyMarkdownReport(report: DailyJsonReport): string {
    const lines: string[] = [];

    lines.push('# Cognition Daily Report');
    lines.push('');
    lines.push(`Generated: ${report.generatedAt}`);
    lines.push(`Overall status: ${statusEmoji(report.summary.overall)} **${report.summary.overall.toUpperCase()}**`);
    lines.push(`Headline: ${report.headline}`);
    lines.push('');

    lines.push('## Snapshot');
    lines.push('');
    lines.push(`- Outcomes evaluated: ${report.summary.outcomes}`);
    lines.push(`- Success rate: ${formatPercent(report.summary.successRate)}`);
    lines.push(`- Outcomes mapped to recommendations: ${report.summary.mappedOutcomes}`);
    lines.push('');

    lines.push('## Scoreboard');
    lines.push('');
    lines.push('| Metric | Value | Target | Status | Detail |');
    lines.push('| --- | ---: | --- | --- | --- |');
    for (const row of report.scoreboard.rows) {
        lines.push(`| ${row.label} | ${formatValue(row.value)} | ${row.target} | ${statusEmoji(row.status)} ${row.status.toUpperCase()} | ${row.detail} |`);
    }
    lines.push('');

    lines.push('## Threshold Tuning');
    lines.push('');
    if (report.thresholdTuning.changes.length === 0) {
        lines.push('- No threshold updates were required for this run.');
    } else {
        for (const change of report.thresholdTuning.changes) {
            lines.push(`- **${change.field}**: ${change.previous} → ${change.next} (${change.reason})`);
        }
    }
    lines.push('');

    lines.push('## Skill Promotion Signals');
    lines.push('');
    if (report.skillSignals.length === 0) {
        lines.push('- No owner-level signals produced (missing owner metadata or mapped outcomes).');
    } else {
        lines.push('| Owner | Outcomes | Success Rate | Signal | Rationale |');
        lines.push('| --- | ---: | ---: | --- | --- |');
        for (const signal of report.skillSignals) {
            lines.push(`| ${signal.owner} | ${signal.outcomes} | ${formatPercent(signal.successRate)} | ${signal.signal.toUpperCase()} | ${signal.rationale} |`);
        }
    }
    lines.push('');

    lines.push('## Artifact Paths');
    lines.push('');
    lines.push(`- Evaluation state: \`${report.artifacts.evaluationStatePath}\``);
    lines.push(`- JSON report: \`${report.artifacts.jsonReportPath}\``);
    lines.push(`- Markdown report: \`${report.artifacts.markdownReportPath}\``);
    lines.push('');

    return `${lines.join('\n')}\n`;
}
