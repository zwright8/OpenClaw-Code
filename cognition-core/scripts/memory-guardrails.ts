import fs from 'fs';
import os from 'os';
import path from 'path';
import {
    buildMemoryEntryTemplate,
    ensureMemoryTemplateFile,
    scanMemoryGuardrails
} from '../src/memory-guardrails.js';

const DAY_MS = 24 * 60 * 60 * 1000;

function printHelp() {
    console.log(`Cognition Core memory guardrails

Usage:
  tsx scripts/memory-guardrails.ts [options]

Options:
  --memory-root <path>      Root path for memory markdown files
  --days <n>                Analyze entries modified in last n days (default: 7)
  --max <n>                 Limit scanned entries
  --json <path>             Write JSON report
  --markdown <path>         Write Markdown report
  --template-out <path>     Write memory entry template markdown
  --template-date <YYYY-MM-DD>  Date used in template heading/file naming context
  --overwrite-template      Overwrite template file if it exists
  --enforce                 Exit non-zero if guardrail status is warn/fail
  -h, --help                Show help
`);
}

function parsePositiveInt(raw, flag) {
    const value = Number(raw);
    if (!Number.isInteger(value) || value <= 0) {
        throw new Error(`${flag} must be a positive integer`);
    }
    return value;
}

function parseArgs(argv) {
    const options = {
        memoryRoot: path.join(os.homedir(), '.openclaw/workspace/memory'),
        days: 7,
        maxEntries: Number.POSITIVE_INFINITY,
        jsonPath: null,
        markdownPath: null,
        templateOutPath: null,
        templateDate: null,
        overwriteTemplate: false,
        enforce: false,
        help: false
    };

    for (let i = 0; i < argv.length; i++) {
        const token = argv[i];

        if (token === '--help' || token === '-h') {
            options.help = true;
            continue;
        }
        if (token === '--overwrite-template') {
            options.overwriteTemplate = true;
            continue;
        }
        if (token === '--enforce') {
            options.enforce = true;
            continue;
        }

        const value = argv[i + 1];
        if (value === undefined) {
            throw new Error(`Missing value for ${token}`);
        }

        if (token === '--memory-root') {
            options.memoryRoot = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--days') {
            options.days = parsePositiveInt(value, '--days');
            i++;
            continue;
        }
        if (token === '--max') {
            options.maxEntries = parsePositiveInt(value, '--max');
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
        if (token === '--template-out') {
            options.templateOutPath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--template-date') {
            options.templateDate = value;
            i++;
            continue;
        }

        throw new Error(`Unknown argument: ${token}`);
    }

    return options;
}

function ensureDirForFile(filePath) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function formatMarkdown(report) {
    const lines = [];
    lines.push('# Memory Guardrails');
    lines.push('');
    lines.push(`Generated: ${report.generatedAt}`);
    lines.push(`Memory root: ${report.memoryRoot}`);
    lines.push(`Status: **${report.status}**`);
    lines.push(`Compliance rate: ${(report.totals.complianceRate * 100).toFixed(2)}%`);
    lines.push(`Average score: ${report.totals.averageScore}`);
    lines.push('');
    lines.push('## Missing Sections');
    lines.push('');
    lines.push('| Section | Missing Count |');
    lines.push('| --- | ---: |');
    for (const [section, count] of Object.entries(report.missingSectionCounts || {})) {
        lines.push(`| ${section} | ${count} |`);
    }
    lines.push('');
    lines.push('## Non-Compliant Entries');
    lines.push('');
    lines.push('| Entry | Status | Missing Sections |');
    lines.push('| --- | --- | --- |');
    for (const entry of report.topNonCompliant || []) {
        lines.push(`| ${entry.relativePath} | ${entry.status} | ${entry.missingSections.join(', ')} |`);
    }
    if ((report.topNonCompliant || []).length === 0) {
        lines.push('| (none) | pass | - |');
    }
    lines.push('');
    lines.push('## Insights');
    lines.push('');
    for (const insight of report.insights || []) {
        lines.push(`- ${insight}`);
    }
    if ((report.insights || []).length === 0) {
        lines.push('- No insights generated.');
    }
    lines.push('');
    return lines.join('\n');
}

(function main() {
    try {
        const options = parseArgs(process.argv.slice(2));
        if (options.help) {
            printHelp();
            return;
        }

        const endMs = Date.now();
        const startMs = endMs - (options.days * DAY_MS);

        const report = scanMemoryGuardrails(options.memoryRoot, {
            rangeStartMs: startMs,
            rangeEndMs: endMs,
            maxEntries: options.maxEntries
        });

        console.log(`Memory guardrails status: ${report.status}`);
        console.log(`Entries scanned: ${report.totals.entries}`);
        console.log(`Compliance rate: ${(report.totals.complianceRate * 100).toFixed(2)}%`);

        if (options.templateOutPath) {
            const writeResult = ensureMemoryTemplateFile(options.templateOutPath, {
                overwrite: options.overwriteTemplate,
                date: options.templateDate
            });
            if (writeResult.written) {
                console.log(`Template written to ${writeResult.filePath}`);
            } else {
                console.log(`Template not written (${writeResult.reason}) at ${writeResult.filePath}`);
            }
        }

        if (options.jsonPath) {
            ensureDirForFile(options.jsonPath);
            fs.writeFileSync(options.jsonPath, `${JSON.stringify(report, null, 2)}\n`);
            console.log(`JSON report written to ${options.jsonPath}`);
        }

        if (options.markdownPath) {
            ensureDirForFile(options.markdownPath);
            fs.writeFileSync(options.markdownPath, `${formatMarkdown(report)}\n`);
            console.log(`Markdown report written to ${options.markdownPath}`);
        }

        if (options.enforce && report.status !== 'pass') {
            process.exit(2);
        }
    } catch (error) {
        console.error(`Memory guardrails failed: ${error.message}`);
        process.exit(1);
    }
})();

export {
    buildMemoryEntryTemplate
};
