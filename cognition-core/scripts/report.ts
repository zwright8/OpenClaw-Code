import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { FeedbackLoopResult } from '../src/learning/feedback-loop.js';
import { buildScoreboard } from '../src/report/scoreboard.js';
import { buildDailyJsonReport } from '../src/report/json.js';
import { renderDailyMarkdownReport } from '../src/report/markdown.js';

interface CliOptions {
    evaluationPath: string;
    jsonOutPath: string;
    markdownOutPath: string;
    help: boolean;
}

function printHelp(): void {
    console.log(`Generate cognition daily reports from evaluation state

Usage:
  tsx scripts/report.ts [options]

Options:
  --evaluation <path>   Evaluation state JSON (default: skills/state/cognition-evaluation.json)
  --json <path>         JSON report output (default: cognition-core/reports/cognition-daily.json)
  --markdown <path>     Markdown report output (default: cognition-core/reports/cognition-daily.md)
  -h, --help            Show help
`);
}

function parseArgs(argv: string[], defaults: Omit<CliOptions, 'help'>): CliOptions {
    const options: CliOptions = {
        ...defaults,
        help: false
    };

    for (let i = 0; i < argv.length; i++) {
        const token = argv[i];
        if (token === '--help' || token === '-h') {
            options.help = true;
            continue;
        }

        const value = argv[i + 1];
        if (!value) throw new Error(`Missing value for ${token}`);

        if (token === '--evaluation') {
            options.evaluationPath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--json') {
            options.jsonOutPath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--markdown') {
            options.markdownOutPath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }

        throw new Error(`Unknown argument: ${token}`);
    }

    return options;
}

function ensureDir(filePath: string): void {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function loadEvaluation(filePath: string): FeedbackLoopResult {
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing evaluation state: ${filePath}`);
    }
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8')) as FeedbackLoopResult;
    return parsed;
}

(async () => {
    try {
        const scriptDir = path.dirname(fileURLToPath(import.meta.url));
        const repoRoot = path.resolve(scriptDir, '../..');

        const defaults: Omit<CliOptions, 'help'> = {
            evaluationPath: path.join(repoRoot, 'skills/state/cognition-evaluation.json'),
            jsonOutPath: path.join(repoRoot, 'cognition-core/reports/cognition-daily.json'),
            markdownOutPath: path.join(repoRoot, 'cognition-core/reports/cognition-daily.md')
        };

        const options = parseArgs(process.argv.slice(2), defaults);
        if (options.help) {
            printHelp();
            return;
        }

        const evaluation = loadEvaluation(options.evaluationPath);
        const scoreboard = buildScoreboard(evaluation);

        const report = buildDailyJsonReport(
            evaluation,
            scoreboard,
            {
                evaluationStatePath: options.evaluationPath,
                jsonReportPath: options.jsonOutPath,
                markdownReportPath: options.markdownOutPath
            },
            new Date().toISOString()
        );

        const markdown = renderDailyMarkdownReport(report);

        ensureDir(options.jsonOutPath);
        ensureDir(options.markdownOutPath);
        fs.writeFileSync(options.jsonOutPath, `${JSON.stringify(report, null, 2)}\n`);
        fs.writeFileSync(options.markdownOutPath, markdown);

        console.log(`Report JSON: ${options.jsonOutPath}`);
        console.log(`Report Markdown: ${options.markdownOutPath}`);
        console.log(`Overall status: ${report.summary.overall}`);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`Report generation failed: ${message}`);
        process.exit(1);
    }
})();
