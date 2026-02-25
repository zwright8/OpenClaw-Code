import fs from 'fs';
import path from 'path';
import { runSimulationBenchmark } from '../index.js';

function printHelp() {
    console.log(`Run deterministic simulation benchmarks

Usage:
  node scripts/run-simulation-benchmark.mjs [options]

Options:
  --scenario <path>      Scenario JSON path (default: ./scenarios/baseline.json)
  --thresholds <path>    Threshold JSON path (optional)
  --runs <n>             Number of benchmark runs (default: 8)
  --seed <value>         Base seed (string or integer)
  --json <path>          Write benchmark JSON output
  --markdown <path>      Write benchmark markdown output
  -h, --help             Show help
`);
}

function parseMaybeNumber(value) {
    if (value === undefined || value === null) return value;
    const numeric = Number(value);
    if (!Number.isNaN(numeric) && Number.isFinite(numeric) && String(numeric) === String(value).trim()) {
        return Number.isInteger(numeric) ? numeric : value;
    }
    return value;
}

function parseArgs(argv) {
    const options = {
        scenarioPath: path.resolve(process.cwd(), 'scenarios/baseline.json'),
        thresholdsPath: null,
        runs: 8,
        seed: null,
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

        if (token === '--scenario') {
            options.scenarioPath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--thresholds') {
            options.thresholdsPath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--runs') {
            options.runs = Number.parseInt(value, 10);
            i++;
            continue;
        }
        if (token === '--seed') {
            options.seed = parseMaybeNumber(value);
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

    if (!Number.isInteger(options.runs) || options.runs <= 0) {
        throw new Error('--runs must be a positive integer');
    }

    return options;
}

function readJson(filePath) {
    const source = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(source);
}

function ensureDir(filePath) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function formatMarkdown(result) {
    const lines = [
        '# Simulation Benchmark',
        '',
        `Scenario: ${result.scenario.name}`,
        `Runs: ${result.runCount}`,
        '',
        '## Aggregate Metrics',
        '',
        '| Metric | Value |',
        '| --- | ---: |',
        `| successRateAvg | ${result.aggregate.successRateAvg} |`,
        `| successRateMin | ${result.aggregate.successRateMin} |`,
        `| timeoutRateAvg | ${result.aggregate.timeoutRateAvg} |`,
        `| timeoutRateMax | ${result.aggregate.timeoutRateMax} |`,
        `| failureRateAvg | ${result.aggregate.failureRateAvg} |`,
        `| avgLatencyMs | ${result.aggregate.avgLatencyMs} |`,
        `| p95LatencyMs | ${result.aggregate.p95LatencyMs} |`,
        '',
        '## Runs',
        '',
        '| Run | Seed | Success | Timeout | Failure | Avg Latency (ms) | P95 Latency (ms) |',
        '| --- | --- | ---: | ---: | ---: | ---: | ---: |'
    ];

    for (const run of result.runs) {
        lines.push(
            `| ${run.run} | ${run.seed} | ${run.metrics.successRate} | ${run.metrics.timeoutRate} | ${run.metrics.failureRate} | ${run.metrics.avgLatencyMs} | ${run.metrics.latencyP95Ms} |`
        );
    }

    if (result.thresholds) {
        lines.push('', '## Threshold Evaluation', '');
        lines.push(result.thresholds.ok ? 'Status: PASS' : 'Status: FAIL');
        if (!result.thresholds.ok) {
            lines.push('', '| Metric | Expected | Actual |', '| --- | --- | ---: |');
            for (const breach of result.thresholds.breaches) {
                lines.push(`| ${breach.metric} | ${breach.expected} | ${breach.actual} |`);
            }
        }
    }

    return `${lines.join('\n')}\n`;
}

(async () => {
    try {
        const options = parseArgs(process.argv.slice(2));
        if (options.help) {
            printHelp();
            return;
        }

        const scenario = readJson(options.scenarioPath);
        const thresholds = options.thresholdsPath ? readJson(options.thresholdsPath) : null;

        const result = await runSimulationBenchmark({
            scenario,
            runs: options.runs,
            startSeed: options.seed,
            thresholds
        });

        console.log(`Scenario: ${result.scenario.name}`);
        console.log(`Runs: ${result.runCount}`);
        console.log('Aggregate:');
        console.log(`- successRateAvg=${result.aggregate.successRateAvg}`);
        console.log(`- timeoutRateAvg=${result.aggregate.timeoutRateAvg}`);
        console.log(`- failureRateAvg=${result.aggregate.failureRateAvg}`);
        console.log(`- avgLatencyMs=${result.aggregate.avgLatencyMs}`);
        console.log(`- p95LatencyMs=${result.aggregate.p95LatencyMs}`);

        if (result.thresholds) {
            if (result.thresholds.ok) {
                console.log('Thresholds: PASS');
            } else {
                console.log('Thresholds: FAIL');
                for (const breach of result.thresholds.breaches) {
                    console.log(`- ${breach.metric}: expected ${breach.expected}, actual ${breach.actual}`);
                }
                process.exitCode = 2;
            }
        }

        if (options.jsonPath) {
            ensureDir(options.jsonPath);
            fs.writeFileSync(options.jsonPath, `${JSON.stringify(result, null, 2)}\n`);
            console.log(`Benchmark JSON written to ${options.jsonPath}`);
        }

        if (options.markdownPath) {
            ensureDir(options.markdownPath);
            fs.writeFileSync(options.markdownPath, formatMarkdown(result));
            console.log(`Benchmark markdown written to ${options.markdownPath}`);
        }
    } catch (error) {
        console.error(`Benchmark failed: ${error.message}`);
        process.exit(1);
    }
})();
