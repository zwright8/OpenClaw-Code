import fs from 'fs';
import path from 'path';
import { FileTaskStore } from '../../swarm-protocol/index.js';
import { evaluateLearningLoop } from '../src/learning-loop.js';

function printHelp() {
    console.log(`Learn from execution outcomes via counterfactual replay

Usage:
  node scripts/learn-from-outcomes.mjs [options]

Options:
  --input <path>       JSON file containing task outcome records
  --store <path>       Task journal path (default: ../swarm-protocol/state/tasks.journal.jsonl)
  --json <path>        Write JSON output
  --markdown <path>    Write Markdown output
  -h, --help           Show help
`);
}

function parseArgs(argv) {
    const options = {
        inputPath: null,
        storePath: path.resolve(process.cwd(), '../swarm-protocol/state/tasks.journal.jsonl'),
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

        const value = argv[i + 1];
        if (value === undefined) {
            throw new Error(`Missing value for ${token}`);
        }

        if (token === '--input') {
            options.inputPath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--store') {
            options.storePath = path.resolve(process.cwd(), value);
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

function ensureDir(filePath) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function formatMarkdown(result) {
    const lines = [
        '# Learning Loop Report',
        '',
        `Total outcomes: ${result.summary.total}`,
        `Success rate: ${(result.summary.successRate * 100).toFixed(2)}%`,
        `Timeout rate: ${(result.summary.timeoutRate * 100).toFixed(2)}%`,
        `Average attempts: ${result.summary.avgAttempts}`,
        '',
        '## Counterfactual Replay',
        '',
        '| Variant | Delta Success Rate | Projected Success Rate |',
        '| --- | ---: | ---: |'
    ];

    for (const run of result.replay.runs) {
        lines.push(`| ${run.name} | ${(run.deltaSuccessRate * 100).toFixed(2)}pp | ${(run.projectedSuccessRate * 100).toFixed(2)}% |`);
    }

    lines.push('', '## Recommendations', '');
    for (const recommendation of result.recommendations) {
        lines.push(`- [${recommendation.priority}] ${recommendation.title}`);
        lines.push(`  - Rationale: ${recommendation.rationale}`);
        lines.push(`  - Action: ${recommendation.action}`);
    }

    return `${lines.join('\n')}\n`;
}

async function loadOutcomes(options) {
    if (options.inputPath) {
        const parsed = JSON.parse(fs.readFileSync(options.inputPath, 'utf8'));
        if (!Array.isArray(parsed)) {
            throw new Error('--input must point to a JSON array');
        }
        return parsed;
    }

    const store = new FileTaskStore({ filePath: options.storePath });
    return store.loadRecords();
}

(async () => {
    try {
        const options = parseArgs(process.argv.slice(2));
        if (options.help) {
            printHelp();
            return;
        }

        const outcomes = await loadOutcomes(options);
        const result = evaluateLearningLoop(outcomes);

        console.log(`Outcomes: ${result.summary.total}`);
        console.log(`Success rate: ${(result.summary.successRate * 100).toFixed(2)}%`);
        if (result.replay.best) {
            console.log(`Best replay variant: ${result.replay.best.name} (+${(result.replay.best.deltaSuccessRate * 100).toFixed(2)}pp)`);
        }
        console.log(`Recommendations: ${result.recommendations.length}`);

        if (options.jsonPath) {
            ensureDir(options.jsonPath);
            fs.writeFileSync(options.jsonPath, `${JSON.stringify(result, null, 2)}\n`);
            console.log(`JSON written to ${options.jsonPath}`);
        }

        if (options.markdownPath) {
            ensureDir(options.markdownPath);
            fs.writeFileSync(options.markdownPath, formatMarkdown(result));
            console.log(`Markdown written to ${options.markdownPath}`);
        }
    } catch (error) {
        console.error(`Learning loop failed: ${error.message}`);
        process.exit(1);
    }
})();
