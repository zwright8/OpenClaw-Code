import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { compileRecommendationDag, normalizeRecommendations } from '../src/planner/dag-compiler.js';
import { packageDagForSwarm } from '../src/planner/task-packager.js';

type ParsedArgs = {
    help: boolean;
    recommendationsPath: string;
    recommendationsOutPath: string;
    dagOutPath: string;
    packageOutPath: string;
    reportOutPath: string;
    fromAgentId: string;
    defaultTarget: string;
    includeApprovalPending: boolean;
    createdAtBase?: number;
};

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..', '..');

const DEFAULT_RECOMMENDATIONS_PATH = path.join(REPO_ROOT, 'skills', 'state', 'cognition-recommendations.json');
const DEFAULT_DAG_OUT_PATH = path.join(REPO_ROOT, 'skills', 'state', 'cognition-task-dag.json');
const DEFAULT_PACKAGE_OUT_PATH = path.join(REPO_ROOT, 'reports', 'cognition-task-package.json');
const DEFAULT_REPORT_OUT_PATH = path.join(REPO_ROOT, 'reports', 'cognition-plan.report.json');

function printHelp() {
    console.log(`Cognition Core Execution Planner\n\nUsage:\n  tsx cognition-core/scripts/plan.ts [options]\n\nOptions:\n  --recommendations <path>         Recommendation input JSON (default: skills/state/cognition-recommendations.json)\n  --recommendations-out <path>     Canonical recommendations output (default: same as --recommendations)\n  --dag-out <path>                 DAG output path (default: skills/state/cognition-task-dag.json)\n  --package-out <path>             Swarm package output path (default: reports/cognition-task-package.json)\n  --report <path>                  Planner report output path (default: reports/cognition-plan.report.json)\n  --from <agentId>                 Source agent id for task requests (default: agent:cognition-core)\n  --default-target <agentId>       Default target for packaged tasks (default: agent:ops)\n  --include-approval-pending       Include tasks pending approval in package output\n  --created-at-base <ms>           Base timestamp for deterministic task request creation\n  -h, --help                       Show help\n`);
}

function ensureDir(filePath: string) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function sha256OfFile(filePath: string): string {
    const hash = crypto.createHash('sha256');
    hash.update(fs.readFileSync(filePath));
    return hash.digest('hex');
}

function parseArgs(argv: string[]): ParsedArgs {
    const parsed: ParsedArgs = {
        help: false,
        recommendationsPath: DEFAULT_RECOMMENDATIONS_PATH,
        recommendationsOutPath: DEFAULT_RECOMMENDATIONS_PATH,
        dagOutPath: DEFAULT_DAG_OUT_PATH,
        packageOutPath: DEFAULT_PACKAGE_OUT_PATH,
        reportOutPath: DEFAULT_REPORT_OUT_PATH,
        fromAgentId: 'agent:cognition-core',
        defaultTarget: 'agent:ops',
        includeApprovalPending: false
    };

    for (let index = 0; index < argv.length; index += 1) {
        const token = argv[index];

        if (token === '--help' || token === '-h') {
            parsed.help = true;
            continue;
        }

        if (token === '--include-approval-pending') {
            parsed.includeApprovalPending = true;
            continue;
        }

        const value = argv[index + 1];
        if (!value || value.startsWith('--')) {
            throw new Error(`Missing value for ${token}`);
        }

        if (token === '--recommendations') {
            parsed.recommendationsPath = path.resolve(process.cwd(), value);
            if (parsed.recommendationsOutPath === DEFAULT_RECOMMENDATIONS_PATH) {
                parsed.recommendationsOutPath = parsed.recommendationsPath;
            }
            index += 1;
            continue;
        }

        if (token === '--recommendations-out') {
            parsed.recommendationsOutPath = path.resolve(process.cwd(), value);
            index += 1;
            continue;
        }

        if (token === '--dag-out') {
            parsed.dagOutPath = path.resolve(process.cwd(), value);
            index += 1;
            continue;
        }

        if (token === '--package-out') {
            parsed.packageOutPath = path.resolve(process.cwd(), value);
            index += 1;
            continue;
        }

        if (token === '--report') {
            parsed.reportOutPath = path.resolve(process.cwd(), value);
            index += 1;
            continue;
        }

        if (token === '--from') {
            parsed.fromAgentId = value;
            index += 1;
            continue;
        }

        if (token === '--default-target') {
            parsed.defaultTarget = value;
            index += 1;
            continue;
        }

        if (token === '--created-at-base') {
            const parsedValue = Number(value);
            if (!Number.isFinite(parsedValue)) {
                throw new Error('--created-at-base must be a numeric timestamp');
            }
            parsed.createdAtBase = parsedValue;
            index += 1;
            continue;
        }

        throw new Error(`Unknown argument: ${token}`);
    }

    return parsed;
}

function readJson(filePath: string): unknown {
    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }

    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function extractRecommendationList(payload: unknown): unknown[] {
    if (Array.isArray(payload)) {
        return payload;
    }

    if (payload && typeof payload === 'object') {
        const record = payload as Record<string, unknown>;
        if (Array.isArray(record.recommendations)) {
            return record.recommendations;
        }
        if (Array.isArray(record.items)) {
            return record.items;
        }
    }

    throw new Error('Expected recommendation payload to be an array or object with recommendations[]');
}

(function main() {
    try {
        const args = parseArgs(process.argv.slice(2));
        if (args.help) {
            printHelp();
            return;
        }

        const rawPayload = readJson(args.recommendationsPath);
        const recommendationList = extractRecommendationList(rawPayload);
        const normalizedRecommendations = normalizeRecommendations(recommendationList).map((recommendation) => recommendation.source);

        const recommendationsArtifact = {
            version: 1,
            generatedAt: new Date().toISOString(),
            count: normalizedRecommendations.length,
            recommendations: normalizedRecommendations
        };

        ensureDir(args.recommendationsOutPath);
        fs.writeFileSync(args.recommendationsOutPath, `${JSON.stringify(recommendationsArtifact, null, 2)}\n`);

        const dag = compileRecommendationDag(normalizedRecommendations);
        ensureDir(args.dagOutPath);
        fs.writeFileSync(args.dagOutPath, `${JSON.stringify(dag, null, 2)}\n`);

        const packaged = packageDagForSwarm(dag, {
            fromAgentId: args.fromAgentId,
            defaultTarget: args.defaultTarget,
            includeApprovalPending: args.includeApprovalPending,
            createdAtBase: args.createdAtBase
        });

        ensureDir(args.packageOutPath);
        fs.writeFileSync(args.packageOutPath, `${JSON.stringify(packaged, null, 2)}\n`);

        const report = {
            version: 1,
            generatedAt: new Date().toISOString(),
            command: 'cognition-core/scripts/plan.ts',
            inputs: {
                recommendationsPath: args.recommendationsPath,
                recommendationsSha256: sha256OfFile(args.recommendationsPath)
            },
            outputs: {
                recommendationsPath: args.recommendationsOutPath,
                recommendationsSha256: sha256OfFile(args.recommendationsOutPath),
                dagPath: args.dagOutPath,
                dagSha256: sha256OfFile(args.dagOutPath),
                packagePath: args.packageOutPath,
                packageSha256: sha256OfFile(args.packageOutPath)
            },
            stats: {
                recommendationCount: recommendationsArtifact.count,
                taskCount: dag.summary.taskCount,
                edgeCount: dag.summary.edgeCount,
                approvalRequiredCount: dag.summary.approvalRequiredCount,
                blockedByPolicyGate: dag.summary.gateBlockedCount,
                packagedTasks: packaged.stats.packagedTasks,
                blockedTasks: packaged.stats.blockedTasks
            }
        };

        ensureDir(args.reportOutPath);
        fs.writeFileSync(args.reportOutPath, `${JSON.stringify(report, null, 2)}\n`);

        console.log(
            `[cognition-plan] recommendations=${recommendationsArtifact.count} tasks=${dag.summary.taskCount} edges=${dag.summary.edgeCount} packaged=${packaged.stats.packagedTasks} blocked=${packaged.stats.blockedTasks}`
        );
    } catch (error) {
        console.error(`[cognition-plan] failed: ${(error as Error).message}`);
        process.exit(1);
    }
})();
