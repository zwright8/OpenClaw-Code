import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ExecutionOutcome } from '../src/learning/evaluator.js';
import {
    isTerminalOutcomeStatus,
    outcomesFromJournalEntries,
    outcomesFromTaskPackage,
    type RecommendationLookup
} from '../src/learning/outcome-mapper.js';

type SourceName =
    | 'journal'
    | 'package:requests'
    | 'package:blocked';

type CandidateOutcome = {
    outcome: ExecutionOutcome;
    source: SourceName;
    score: number;
    index: number;
};

type CliOptions = {
    help: boolean;
    outputPath: string;
    taskDagPath: string;
    packagePath: string;
    journalPaths: string[];
};

function printHelp(): void {
    console.log(`Export normalized swarm execution outcomes for cognition evaluation

Usage:
  tsx scripts/export-swarm-outcomes.ts [options]

Options:
  --out <path>          Output JSONL path (default: cognition-core/reports/swarm-outcomes.latest.jsonl)
  --task-dag <path>     Task DAG JSON used for recommendation mapping
  --package <path>      Cognition task package JSON
  --journal <path>      Swarm task journal JSONL (repeatable)
  -h, --help            Show help
`);
}

function parseArgs(argv: string[], defaults: Omit<CliOptions, 'help'>): CliOptions {
    const options: CliOptions = {
        ...defaults,
        help: false
    };

    for (let index = 0; index < argv.length; index += 1) {
        const token = argv[index];
        if (token === '-h' || token === '--help') {
            options.help = true;
            continue;
        }

        const value = argv[index + 1];
        if (!value) {
            throw new Error(`Missing value for ${token}`);
        }

        if (token === '--out') {
            options.outputPath = path.resolve(process.cwd(), value);
            index += 1;
            continue;
        }
        if (token === '--task-dag') {
            options.taskDagPath = path.resolve(process.cwd(), value);
            index += 1;
            continue;
        }
        if (token === '--package') {
            options.packagePath = path.resolve(process.cwd(), value);
            index += 1;
            continue;
        }
        if (token === '--journal') {
            options.journalPaths.push(path.resolve(process.cwd(), value));
            index += 1;
            continue;
        }

        throw new Error(`Unknown argument: ${token}`);
    }

    return options;
}

function ensureDir(filePath: string): void {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function readJson(filePath: string): unknown {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonLines(filePath: string): unknown[] {
    if (!fs.existsSync(filePath)) return [];
    const raw = fs.readFileSync(filePath, 'utf8');

    return raw
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
            try {
                return JSON.parse(line);
            } catch {
                return null;
            }
        })
        .filter((row): row is unknown => row !== null);
}

function buildRecommendationByTaskId(taskDagPath: string): RecommendationLookup {
    if (!fs.existsSync(taskDagPath)) {
        return new Map();
    }

    const payload = readJson(taskDagPath);
    const root = payload && typeof payload === 'object'
        ? (payload as Record<string, unknown>)
        : {};
    const tasks = Array.isArray(root.tasks) ? root.tasks : [];

    const mapping = new Map<string, string>();
    for (const task of tasks) {
        if (!task || typeof task !== 'object') continue;
        const row = task as Record<string, unknown>;
        const taskId = typeof row.taskId === 'string' ? row.taskId.trim() : '';
        const recommendationId = typeof row.recommendationId === 'string'
            ? row.recommendationId.trim()
            : '';

        if (taskId && recommendationId) {
            mapping.set(taskId, recommendationId);
        }
    }

    return mapping;
}

function splitPackageOutcomes(outcomes: ExecutionOutcome[]): {
    requestOutcomes: ExecutionOutcome[];
    blockedOutcomes: ExecutionOutcome[];
} {
    const requestOutcomes: ExecutionOutcome[] = [];
    const blockedOutcomes: ExecutionOutcome[] = [];

    for (const outcome of outcomes) {
        const status = String(outcome.status ?? '').trim().toLowerCase();
        if (status === 'dispatched') {
            requestOutcomes.push(outcome);
        } else {
            blockedOutcomes.push(outcome);
        }
    }

    return { requestOutcomes, blockedOutcomes };
}

function scoreOutcome(outcome: ExecutionOutcome, source: SourceName): number {
    let score = source === 'journal'
        ? 300
        : source === 'package:blocked'
            ? 200
            : 100;

    if (isTerminalOutcomeStatus(String(outcome.status ?? ''))) score += 40;
    if (typeof outcome.closedAt === 'number') score += 10;
    if (typeof outcome.createdAt === 'number') score += 5;
    if (outcome.recommendationId) score += 5;

    return score;
}

function pickBetterCandidate(current: CandidateOutcome, incoming: CandidateOutcome): CandidateOutcome {
    if (incoming.score !== current.score) {
        return incoming.score > current.score ? incoming : current;
    }

    const incomingClosedAt = incoming.outcome.closedAt ?? -1;
    const currentClosedAt = current.outcome.closedAt ?? -1;
    if (incomingClosedAt !== currentClosedAt) {
        return incomingClosedAt > currentClosedAt ? incoming : current;
    }

    const incomingCreatedAt = incoming.outcome.createdAt ?? -1;
    const currentCreatedAt = current.outcome.createdAt ?? -1;
    if (incomingCreatedAt !== currentCreatedAt) {
        return incomingCreatedAt > currentCreatedAt ? incoming : current;
    }

    return incoming.index > current.index ? incoming : current;
}

function dedupeOutcomes(candidates: CandidateOutcome[]): ExecutionOutcome[] {
    const byKey = new Map<string, CandidateOutcome>();
    const anonymous: ExecutionOutcome[] = [];

    for (const candidate of candidates) {
        const taskId = candidate.outcome.taskId;
        if (!taskId) {
            anonymous.push(candidate.outcome);
            continue;
        }

        const current = byKey.get(taskId);
        if (!current) {
            byKey.set(taskId, candidate);
            continue;
        }

        byKey.set(taskId, pickBetterCandidate(current, candidate));
    }

    const deduped = [...byKey.values()].map((item) => item.outcome);
    const combined = [...deduped, ...anonymous];

    return combined.sort((left, right) => {
        const leftCreatedAt = left.createdAt ?? Number.MAX_SAFE_INTEGER;
        const rightCreatedAt = right.createdAt ?? Number.MAX_SAFE_INTEGER;
        if (leftCreatedAt !== rightCreatedAt) {
            return leftCreatedAt - rightCreatedAt;
        }

        const leftTaskId = left.taskId ?? '';
        const rightTaskId = right.taskId ?? '';
        return leftTaskId.localeCompare(rightTaskId);
    });
}

(function main() {
    try {
        const scriptDir = path.dirname(fileURLToPath(import.meta.url));
        const cognitionRoot = path.resolve(scriptDir, '..');
        const repoRoot = path.resolve(cognitionRoot, '..');

        const planReportPath = path.join(repoRoot, 'reports', 'cognition-plan.report.json');
        let packagePathFromReport: string | null = null;
        if (fs.existsSync(planReportPath)) {
            const report = readJson(planReportPath);
            const reportRoot = report && typeof report === 'object'
                ? (report as Record<string, unknown>)
                : {};
            const outputs = reportRoot.outputs && typeof reportRoot.outputs === 'object'
                ? (reportRoot.outputs as Record<string, unknown>)
                : {};
            if (typeof outputs.packagePath === 'string' && outputs.packagePath.trim()) {
                packagePathFromReport = path.resolve(outputs.packagePath);
            }
        }

        const defaultJournal = path.join(repoRoot, 'swarm-protocol', 'state', 'tasks.journal.jsonl');
        const defaults: Omit<CliOptions, 'help'> = {
            outputPath: path.join(cognitionRoot, 'reports', 'swarm-outcomes.latest.jsonl'),
            taskDagPath: path.join(repoRoot, 'skills', 'state', 'cognition-task-dag.json'),
            packagePath: packagePathFromReport ?? path.join(repoRoot, 'reports', 'cognition-task-package.json'),
            journalPaths: [defaultJournal]
        };

        const options = parseArgs(process.argv.slice(2), defaults);
        if (options.help) {
            printHelp();
            return;
        }

        const recommendationByTaskId = buildRecommendationByTaskId(options.taskDagPath);
        const candidates: CandidateOutcome[] = [];
        const sourceCounts: Record<SourceName, number> = {
            journal: 0,
            'package:requests': 0,
            'package:blocked': 0
        };

        for (const journalPath of options.journalPaths) {
            if (!fs.existsSync(journalPath)) continue;
            const entries = readJsonLines(journalPath);
            const outcomes = outcomesFromJournalEntries(entries, recommendationByTaskId);

            for (const outcome of outcomes) {
                sourceCounts.journal += 1;
                candidates.push({
                    outcome,
                    source: 'journal',
                    score: scoreOutcome(outcome, 'journal'),
                    index: candidates.length
                });
            }
        }

        if (fs.existsSync(options.packagePath)) {
            const packagePayload = readJson(options.packagePath);
            const packageOutcomes = outcomesFromTaskPackage(packagePayload, recommendationByTaskId);
            const { requestOutcomes, blockedOutcomes } = splitPackageOutcomes(packageOutcomes);

            for (const outcome of requestOutcomes) {
                sourceCounts['package:requests'] += 1;
                candidates.push({
                    outcome,
                    source: 'package:requests',
                    score: scoreOutcome(outcome, 'package:requests'),
                    index: candidates.length
                });
            }

            for (const outcome of blockedOutcomes) {
                sourceCounts['package:blocked'] += 1;
                candidates.push({
                    outcome,
                    source: 'package:blocked',
                    score: scoreOutcome(outcome, 'package:blocked'),
                    index: candidates.length
                });
            }
        }

        const outcomes = dedupeOutcomes(candidates);
        const payload = outcomes
            .map((outcome) => JSON.stringify(outcome))
            .join('\n');

        ensureDir(options.outputPath);
        fs.writeFileSync(options.outputPath, payload ? `${payload}\n` : '');

        console.log(`Exported ${outcomes.length} normalized outcomes`);
        console.log(`- journal: ${sourceCounts.journal}`);
        console.log(`- package requests: ${sourceCounts['package:requests']}`);
        console.log(`- package blocked: ${sourceCounts['package:blocked']}`);
        console.log(`Output: ${options.outputPath}`);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`Outcome export failed: ${message}`);
        process.exit(1);
    }
})();
