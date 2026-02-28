import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
    runFeedbackLoop,
    type FeedbackLoopResult
} from '../src/learning/feedback-loop.js';
import type {
    EvaluationThresholds
} from '../src/learning/threshold-tuner.js';
import type {
    ExecutionOutcome,
    RecommendationPrediction
} from '../src/learning/evaluator.js';

interface CliOptions {
    recommendationsPath: string;
    taskDagPath: string;
    outcomesPath: string;
    thresholdsPath: string | null;
    outputPath: string;
    help: boolean;
}

function printHelp(): void {
    console.log(`Evaluate cognition outcomes and produce learning state

Usage:
  tsx scripts/evaluate.ts [options]

Options:
  --recommendations <path>   Recommendations JSON (default: skills/state/cognition-recommendations.json)
  --task-dag <path>          Task DAG JSON (default: skills/state/cognition-task-dag.json)
  --outcomes <path>          Outcomes JSON/JSONL (default: swarm-protocol/state/tasks.journal.jsonl)
  --thresholds <path>        Optional thresholds JSON
  --out <path>               Output evaluation JSON (default: skills/state/cognition-evaluation.json)
  -h, --help                 Show help
`);
}

function parseArgs(argv: string[], defaults: Omit<CliOptions, 'help'>): CliOptions {
    const options: CliOptions = {
        ...defaults,
        help: false
    };

    for (let i = 0; i < argv.length; i++) {
        const token = argv[i];
        if (token === '-h' || token === '--help') {
            options.help = true;
            continue;
        }

        const value = argv[i + 1];
        if (!value) {
            throw new Error(`Missing value for ${token}`);
        }

        if (token === '--recommendations') {
            options.recommendationsPath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--task-dag') {
            options.taskDagPath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--outcomes') {
            options.outcomesPath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--thresholds') {
            options.thresholdsPath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--out') {
            options.outputPath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }

        throw new Error(`Unknown argument: ${token}`);
    }

    return options;
}

function safeReadJson(filePath: string): unknown {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function safeReadJsonLines(filePath: string): unknown[] {
    if (!fs.existsSync(filePath)) return [];
    const raw = fs.readFileSync(filePath, 'utf8');
    const lines = raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    const parsed: unknown[] = [];
    for (const line of lines) {
        try {
            parsed.push(JSON.parse(line));
        } catch {
            // Ignore malformed lines to keep evaluator resilient.
        }
    }
    return parsed;
}

function extractArray(input: unknown): unknown[] {
    if (Array.isArray(input)) return input;
    if (input && typeof input === 'object') {
        const candidateKeys = ['items', 'recommendations', 'tasks', 'records', 'outcomes'];
        for (const key of candidateKeys) {
            const value = (input as Record<string, unknown>)[key];
            if (Array.isArray(value)) return value;
        }
    }
    return [];
}

function toPredictions(
    recommendationsRaw: unknown,
    taskDagRaw: unknown
): { predictions: RecommendationPrediction[]; recommendationByTaskId: Map<string, string> } {
    const predictions: RecommendationPrediction[] = [];
    const recommendationByTaskId = new Map<string, string>();

    const recommendations = extractArray(recommendationsRaw);
    for (const item of recommendations) {
        if (!item || typeof item !== 'object') continue;
        const row = item as Record<string, unknown>;
        const recommendationId = String(
            row.recommendationId ?? row.id ?? row.taskId ?? row.title ?? ''
        ).trim();
        if (!recommendationId) continue;

        predictions.push({
            recommendationId,
            owner: typeof row.owner === 'string'
                ? row.owner
                : (typeof row.target === 'string' ? row.target : undefined),
            riskTier: typeof row.riskTier === 'string' ? row.riskTier : undefined,
            confidence: Number.isFinite(Number(row.confidence)) ? Number(row.confidence) : undefined,
            expectedSuccessProbability: Number.isFinite(Number(row.expectedSuccessProbability))
                ? Number(row.expectedSuccessProbability)
                : undefined
        });
    }

    const tasks = extractArray(taskDagRaw);
    for (const task of tasks) {
        if (!task || typeof task !== 'object') continue;
        const row = task as Record<string, unknown>;
        const taskId = String(row.taskId ?? row.id ?? '').trim();
        const recommendationId = String(row.recommendationId ?? row.sourceRecommendationId ?? '').trim();
        if (taskId && recommendationId) {
            recommendationByTaskId.set(taskId, recommendationId);
        }

        if (recommendationId && !predictions.some((item) => item.recommendationId === recommendationId)) {
            predictions.push({
                recommendationId,
                owner: typeof row.owner === 'string'
                    ? row.owner
                    : (typeof row.target === 'string' ? row.target : undefined),
                riskTier: typeof row.riskTier === 'string' ? row.riskTier : undefined,
                confidence: Number.isFinite(Number(row.confidence)) ? Number(row.confidence) : undefined
            });
        }
    }

    return { predictions, recommendationByTaskId };
}

function toOutcomes(raw: unknown, recommendationByTaskId: Map<string, string>): ExecutionOutcome[] {
    const records = extractArray(raw);

    return records
        .map((item) => {
            if (!item || typeof item !== 'object') return null;
            const row = item as Record<string, unknown>;
            const taskId = String(row.taskId ?? row.id ?? '').trim() || undefined;
            const recommendationId = String(
                row.recommendationId ?? (taskId ? recommendationByTaskId.get(taskId) : '') ?? ''
            ).trim() || undefined;

            const status = String(row.status ?? row.result ?? 'failed');
            return {
                taskId,
                recommendationId,
                status,
                owner: typeof row.owner === 'string'
                    ? row.owner
                    : (typeof row.target === 'string' ? row.target : undefined),
                attempts: Number.isFinite(Number(row.attempts)) ? Number(row.attempts) : undefined,
                createdAt: Number.isFinite(Number(row.createdAt)) ? Number(row.createdAt) : undefined,
                closedAt: Number.isFinite(Number(row.closedAt)) ? Number(row.closedAt) : undefined
            } satisfies ExecutionOutcome;
        })
        .filter((item): item is ExecutionOutcome => item !== null);
}

function ensureDir(filePath: string): void {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function readThresholds(filePath: string | null): Partial<EvaluationThresholds> {
    if (!filePath || !fs.existsSync(filePath)) {
        return {};
    }

    const raw = safeReadJson(filePath);
    if (!raw || typeof raw !== 'object') return {};
    return raw as Partial<EvaluationThresholds>;
}

function buildOutcomesInput(outcomesPath: string): unknown {
    if (outcomesPath.endsWith('.jsonl')) {
        return safeReadJsonLines(outcomesPath);
    }

    return safeReadJson(outcomesPath);
}

function writeResult(outputPath: string, result: FeedbackLoopResult): void {
    ensureDir(outputPath);
    fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
}

(async () => {
    try {
        const scriptDir = path.dirname(fileURLToPath(import.meta.url));
        const repoRoot = path.resolve(scriptDir, '../..');

        const defaults: Omit<CliOptions, 'help'> = {
            recommendationsPath: path.join(repoRoot, 'skills/state/cognition-recommendations.json'),
            taskDagPath: path.join(repoRoot, 'skills/state/cognition-task-dag.json'),
            outcomesPath: path.join(repoRoot, 'swarm-protocol/state/tasks.journal.jsonl'),
            thresholdsPath: null,
            outputPath: path.join(repoRoot, 'skills/state/cognition-evaluation.json')
        };

        const options = parseArgs(process.argv.slice(2), defaults);
        if (options.help) {
            printHelp();
            return;
        }

        const recommendationsRaw = safeReadJson(options.recommendationsPath);
        const taskDagRaw = safeReadJson(options.taskDagPath);
        const { predictions, recommendationByTaskId } = toPredictions(recommendationsRaw, taskDagRaw);

        const outcomesRaw = buildOutcomesInput(options.outcomesPath);
        const outcomes = toOutcomes(outcomesRaw, recommendationByTaskId);
        const thresholds = readThresholds(options.thresholdsPath);

        const result = runFeedbackLoop(predictions, outcomes, { thresholds });
        writeResult(options.outputPath, result);

        console.log(`Predictions: ${predictions.length}`);
        console.log(`Outcomes: ${outcomes.length}`);
        console.log(`Success rate: ${(result.evaluation.metrics.successRate * 100).toFixed(2)}%`);
        console.log(`Evaluation output: ${options.outputPath}`);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`Evaluation failed: ${message}`);
        process.exit(1);
    }
})();
