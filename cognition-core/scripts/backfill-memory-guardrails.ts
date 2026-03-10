import fs from 'fs';
import os from 'os';
import path from 'path';
import { backfillMemoryGuardrailSections } from '../src/memory-guardrails.js';

const DAY_MS = 24 * 60 * 60 * 1000;

function printHelp() {
    console.log(`Backfill missing memory guardrail sections

Usage:
  tsx scripts/backfill-memory-guardrails.ts [options]

Options:
  --memory-root <path>    Root path for memory markdown files
  --days <n>              Limit to entries modified in last n days (default: 30)
  --max-entries <n>       Max entries to scan
  --max-updates <n>       Max files to update
  --dry-run               Do not write changes, only report
  --json <path>           Write JSON report
  --markdown <path>       Write markdown report
  -h, --help              Show help
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
        days: 30,
        maxEntries: Number.POSITIVE_INFINITY,
        maxUpdates: Number.POSITIVE_INFINITY,
        dryRun: false,
        jsonPath: null,
        markdownPath: null,
        help: false
    };

    for (let i = 0; i < argv.length; i++) {
        const token = argv[i];

        if (token === '--help' || token === '-h') {
            options.help = true;
            continue;
        }
        if (token === '--dry-run') {
            options.dryRun = true;
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
        if (token === '--max-entries') {
            options.maxEntries = parsePositiveInt(value, '--max-entries');
            i++;
            continue;
        }
        if (token === '--max-updates') {
            options.maxUpdates = parsePositiveInt(value, '--max-updates');
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
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function formatMarkdown(report) {
    const lines = [];
    lines.push('# Memory Guardrails Backfill');
    lines.push('');
    lines.push(`Dry run: ${report.dryRun ? 'yes' : 'no'}`);
    lines.push(`Scanned entries: ${report.scanned}`);
    lines.push(`Attempted updates: ${report.attemptedUpdates}`);
    lines.push(`Updated files: ${report.updatedFiles}`);
    lines.push('');
    lines.push(`Before status: **${report.before.status}**`);
    lines.push(`After status: **${report.after.status}**`);
    lines.push('');
    lines.push('| File | Added Sections |');
    lines.push('| --- | --- |');
    for (const update of report.updates || []) {
        lines.push(`| ${update.filePath} | ${update.addedSections.join(', ')} |`);
    }
    if ((report.updates || []).length === 0) {
        lines.push('| (none) | - |');
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

        const result = backfillMemoryGuardrailSections(options.memoryRoot, {
            rangeStartMs: startMs,
            rangeEndMs: endMs,
            maxEntries: options.maxEntries,
            maxUpdates: options.maxUpdates,
            dryRun: options.dryRun
        });

        console.log(`Backfill complete. Updated files: ${result.updatedFiles}`);
        console.log(`Status before: ${result.before.status}; after: ${result.after.status}`);

        if (options.jsonPath) {
            ensureDirForFile(options.jsonPath);
            fs.writeFileSync(options.jsonPath, `${JSON.stringify(result, null, 2)}\n`);
            console.log(`JSON report written to ${options.jsonPath}`);
        }

        if (options.markdownPath) {
            ensureDirForFile(options.markdownPath);
            fs.writeFileSync(options.markdownPath, `${formatMarkdown(result)}\n`);
            console.log(`Markdown report written to ${options.markdownPath}`);
        }
    } catch (error) {
        console.error(`Backfill failed: ${error.message}`);
        process.exit(1);
    }
})();
