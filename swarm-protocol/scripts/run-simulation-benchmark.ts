import fs from 'fs';
import path from 'path';
import { runSimulationBenchmark } from '../index.js';

function printHelp() {
    console.log(`Run deterministic simulation benchmarks

Usage:
  tsx scripts/run-simulation-benchmark.ts [options]

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

function normalizeGeneratedAt(generatedAt) {
    if (typeof generatedAt !== 'string' || generatedAt.trim().length === 0) {
        return new Date().toISOString();
    }

    const parsedMs = Date.parse(generatedAt);
    if (!Number.isFinite(parsedMs)) {
        return new Date().toISOString();
    }

    return new Date(parsedMs).toISOString();
}

function normalizeThresholdCheck(result, thresholdsRequested) {
    const existingThresholdCheck = result && typeof result.thresholdCheck === 'object' && result.thresholdCheck !== null
        ? result.thresholdCheck
        : null;

    const requested = typeof existingThresholdCheck?.requested === 'boolean'
        ? existingThresholdCheck.requested
        : Boolean(thresholdsRequested);

    const evaluationBreaches = Array.isArray(result?.thresholds?.breaches) ? result.thresholds.breaches : [];
    const breaches = Array.isArray(existingThresholdCheck?.breaches)
        ? existingThresholdCheck.breaches
        : (requested ? evaluationBreaches : []);

    const ok = typeof existingThresholdCheck?.ok === 'boolean'
        ? existingThresholdCheck.ok
        : (requested ? Boolean(result?.thresholds?.ok) && breaches.length === 0 : true);

    const breachCount = Number.isInteger(existingThresholdCheck?.breachCount)
        ? existingThresholdCheck.breachCount
        : breaches.length;

    return {
        requested,
        ok,
        breachCount,
        breaches
    };
}

function buildBenchmarkArtifact(result, thresholdsRequested) {
    const thresholdCheck = normalizeThresholdCheck(result, thresholdsRequested);

    return {
        scenario: result.scenario,
        runCount: result.runCount,
        runs: Array.isArray(result.runs) ? result.runs : [],
        aggregate: result.aggregate,
        generatedAt: normalizeGeneratedAt(result?.generatedAt),
        thresholdCheck
    };
}

function formatThresholdSummary(thresholdCheck) {
    if (!thresholdCheck?.requested) {
        return 'NOT_REQUESTED';
    }
    if (thresholdCheck.ok) {
        return 'PASS';
    }
    return `FAIL (${thresholdCheck.breachCount} breach${thresholdCheck.breachCount === 1 ? '' : 'es'})`;
}

function formatMarkdown(result) {
    const lines = [
        '# Simulation Benchmark',
        '',
        `Scenario: ${result.scenario.name}`,
        `Runs: ${result.runCount}`,
        `Generated At: ${result.generatedAt}`,
        `Threshold Check: ${formatThresholdSummary(result.thresholdCheck)}`,
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

    if (result.thresholdCheck?.requested) {
        lines.push('', '## Threshold Evaluation', '');
        lines.push(result.thresholdCheck.ok ? 'Status: PASS' : 'Status: FAIL');

        if (!result.thresholdCheck.ok && result.thresholdCheck.breachCount > 0) {
            lines.push('', '| Metric | Expected | Actual |', '| --- | --- | ---: |');
            for (const breach of result.thresholdCheck.breaches) {
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

        const benchmarkArtifact = buildBenchmarkArtifact(result, Boolean(thresholds));

        console.log(`Scenario: ${benchmarkArtifact.scenario.name}`);
        console.log(`Runs: ${benchmarkArtifact.runCount}`);
        console.log('Aggregate:');
        console.log(`- successRateAvg=${benchmarkArtifact.aggregate.successRateAvg}`);
        console.log(`- timeoutRateAvg=${benchmarkArtifact.aggregate.timeoutRateAvg}`);
        console.log(`- failureRateAvg=${benchmarkArtifact.aggregate.failureRateAvg}`);
        console.log(`- avgLatencyMs=${benchmarkArtifact.aggregate.avgLatencyMs}`);
        console.log(`- p95LatencyMs=${benchmarkArtifact.aggregate.p95LatencyMs}`);

        if (benchmarkArtifact.thresholdCheck.requested) {
            if (benchmarkArtifact.thresholdCheck.ok) {
                console.log('Thresholds: PASS');
            } else {
                console.log('Thresholds: FAIL');
                for (const breach of benchmarkArtifact.thresholdCheck.breaches) {
                    console.log(`- ${breach.metric}: expected ${breach.expected}, actual ${breach.actual}`);
                }
                process.exitCode = 2;
            }
        } else {
            console.log('Thresholds: NOT_REQUESTED');
        }

        if (options.jsonPath) {
            ensureDir(options.jsonPath);
            fs.writeFileSync(options.jsonPath, `${JSON.stringify(benchmarkArtifact, null, 2)}\n`);
            console.log(`Benchmark JSON written to ${options.jsonPath}`);
        }

        if (options.markdownPath) {
            ensureDir(options.markdownPath);
            fs.writeFileSync(options.markdownPath, formatMarkdown(benchmarkArtifact));
            console.log(`Benchmark markdown written to ${options.markdownPath}`);
        }
    } catch (error) {
        console.error(`Benchmark failed: ${error.message}`);
        process.exit(1);
    }
})();
