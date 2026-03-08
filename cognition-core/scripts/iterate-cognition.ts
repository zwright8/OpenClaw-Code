import fs from 'fs';
import path from 'path';
import {
    buildCognitionIterationPlan,
    renderCognitionIterationMarkdown
} from '../src/cognition-iteration-engine.js';
import { buildCognitionIterationTasks } from '../src/cognition-iteration-task-planner.js';

function printHelp() {
    console.log(`Generate curiosity-driven cognition iteration plan

Usage:
  tsx scripts/iterate-cognition.ts [options]

Options:
  --analysis <path>       Analysis report JSON path
  --learning <path>       Learning loop report JSON path
  --readiness <path>      Readiness report JSON path
  --memory-guardrails <p> Memory guardrails report JSON path
  --history <path>        Iteration history JSONL path
  --json <path>           Output plan JSON
  --markdown <path>       Output plan markdown
  --tasks-out <path>      Output hypothesis task bundle JSON
  --no-append-history     Do not append to iteration history
  --max-tasks <n>         Max hypothesis tasks to generate
  --from <agentId>        Task source agent id
  --default-target <id>   Default task target agent id
  --target-p1 <id>        Target override for P1 tasks
  --target-p2 <id>        Target override for P2 tasks
  --target-p3 <id>        Target override for P3 tasks
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
    const reportsDir = path.resolve(process.cwd(), 'reports');
    const options = {
        analysisPath: path.join(reportsDir, 'cognition-report.json'),
        learningPath: path.join(reportsDir, 'learning-loop.json'),
        readinessPath: path.join(reportsDir, 'readiness.json'),
        memoryGuardrailsPath: path.join(reportsDir, 'memory-guardrails.json'),
        historyPath: path.join(reportsDir, 'iteration-history.jsonl'),
        jsonPath: path.join(reportsDir, 'cognition-iteration-plan.json'),
        markdownPath: path.join(reportsDir, 'cognition-iteration-plan.md'),
        tasksOutPath: path.join(reportsDir, 'cognition-iteration-tasks.json'),
        appendHistory: true,
        maxTasks: 5,
        fromAgentId: 'agent:main',
        defaultTarget: 'agent:cognition:ops',
        targetMap: {},
        help: false
    };

    for (let i = 0; i < argv.length; i++) {
        const token = argv[i];
        if (token === '--help' || token === '-h') {
            options.help = true;
            continue;
        }
        if (token === '--no-append-history') {
            options.appendHistory = false;
            continue;
        }

        const value = argv[i + 1];
        if (value === undefined) {
            throw new Error(`Missing value for ${token}`);
        }

        if (token === '--analysis') {
            options.analysisPath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--learning') {
            options.learningPath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--readiness') {
            options.readinessPath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--memory-guardrails') {
            options.memoryGuardrailsPath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--history') {
            options.historyPath = path.resolve(process.cwd(), value);
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
        if (token === '--tasks-out') {
            options.tasksOutPath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--max-tasks') {
            options.maxTasks = parsePositiveInt(value, '--max-tasks');
            i++;
            continue;
        }
        if (token === '--from') {
            options.fromAgentId = value;
            i++;
            continue;
        }
        if (token === '--default-target') {
            options.defaultTarget = value;
            i++;
            continue;
        }
        if (token === '--target-p1') {
            options.targetMap.P1 = value;
            i++;
            continue;
        }
        if (token === '--target-p2') {
            options.targetMap.P2 = value;
            i++;
            continue;
        }
        if (token === '--target-p3') {
            options.targetMap.P3 = value;
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

function readJson(filePath) {
    if (!fs.existsSync(filePath)) {
        return null;
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readHistoryJsonl(filePath) {
    if (!fs.existsSync(filePath)) return [];
    const lines = fs.readFileSync(filePath, 'utf8').split('\n').filter((line) => line.trim());
    const out = [];
    for (let i = 0; i < lines.length; i++) {
        try {
            out.push(JSON.parse(lines[i]));
        } catch {
            // skip malformed line
        }
    }
    return out;
}

function appendHistory(filePath, payload) {
    ensureDirForFile(filePath);
    fs.appendFileSync(filePath, `${JSON.stringify(payload)}\n`);
}

function snapshotFromPlan(plan, readinessStatus) {
    return {
        at: plan.generatedAt,
        posture: plan.posture,
        readinessStatus,
        memoryDriftLevel: plan.memoryDriftLevel,
        learningDriftLevel: plan.learningDriftLevel,
        hypothesisKeys: (plan.hypotheses || []).map((item) => item.id)
    };
}

(function main() {
    try {
        const options = parseArgs(process.argv.slice(2));
        if (options.help) {
            printHelp();
            return;
        }

        const analysisReport = readJson(options.analysisPath);
        const learningReport = readJson(options.learningPath);
        const readinessReport = readJson(options.readinessPath);
        const memoryGuardrailsReport = readJson(options.memoryGuardrailsPath);
        const history = readHistoryJsonl(options.historyPath);

        const plan = buildCognitionIterationPlan({
            analysisReport,
            learningReport,
            memoryGuardrailsReport,
            readinessReport,
            history
        });

        ensureDirForFile(options.jsonPath);
        fs.writeFileSync(options.jsonPath, `${JSON.stringify(plan, null, 2)}\n`);
        console.log(`Iteration plan written to ${options.jsonPath}`);

        if (options.markdownPath) {
            ensureDirForFile(options.markdownPath);
            fs.writeFileSync(options.markdownPath, `${renderCognitionIterationMarkdown(plan)}\n`);
            console.log(`Iteration markdown written to ${options.markdownPath}`);
        }

        if (options.tasksOutPath) {
            const tasks = buildCognitionIterationTasks(plan, {
                fromAgentId: options.fromAgentId,
                sourceReport: options.jsonPath,
                targetMap: options.targetMap,
                defaultTarget: options.defaultTarget,
                maxItems: options.maxTasks
            });
            ensureDirForFile(options.tasksOutPath);
            fs.writeFileSync(options.tasksOutPath, `${JSON.stringify({
                generatedAt: new Date().toISOString(),
                sourcePlan: options.jsonPath,
                count: tasks.length,
                tasks
            }, null, 2)}\n`);
            console.log(`Iteration tasks written to ${options.tasksOutPath}`);
        }

        if (options.appendHistory) {
            appendHistory(options.historyPath, snapshotFromPlan(plan, readinessReport?.status || 'unknown'));
            console.log(`Iteration history appended to ${options.historyPath}`);
        }
    } catch (error) {
        console.error(`Iteration planning failed: ${error.message}`);
        process.exit(1);
    }
})();
