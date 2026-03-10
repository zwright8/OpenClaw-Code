import fs from 'fs';
import path from 'path';
import { buildSkillGrowthTasks } from '../src/skill-growth-task-planner.js';

function printHelp() {
    console.log(`Cognition Core skill-growth task planner

Usage:
  tsx scripts/plan-skill-growth-tasks.ts [options]

Options:
  --report <path>         Path to learning-loop JSON (default: ./reports/learning-loop.json)
  --from <agentId>        Source agent id for task requests (default: agent:main)
  --default-target <id>   Default target agent (default: agent:learning)
  --target-p1 <id>        Target override for P1 tasks
  --target-p2 <id>        Target override for P2 tasks
  --target-p3 <id>        Target override for P3 tasks
  --max <n>               Max focus areas to convert
  --out <path>            Write generated task requests JSON
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
        reportPath: path.resolve(process.cwd(), 'reports/learning-loop.json'),
        fromAgentId: 'agent:main',
        defaultTarget: 'agent:learning',
        targetMap: {},
        maxItems: Number.POSITIVE_INFINITY,
        outPath: null,
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

        if (token === '--report') {
            options.reportPath = path.resolve(process.cwd(), value);
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
        if (token === '--max') {
            options.maxItems = parsePositiveInt(value, '--max');
            i++;
            continue;
        }
        if (token === '--out') {
            options.outPath = path.resolve(process.cwd(), value);
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

function loadReport(reportPath) {
    if (!fs.existsSync(reportPath)) {
        throw new Error(`Learning report file not found: ${reportPath}`);
    }

    const parsed = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    if (!parsed || typeof parsed !== 'object' || !parsed.skillGrowthPlan || !Array.isArray(parsed.skillGrowthPlan.focusAreas)) {
        throw new Error('Report does not contain skillGrowthPlan.focusAreas');
    }
    return parsed;
}

function printSummary(tasks, reportPath) {
    console.log(`Generated ${tasks.length} skill-growth task request(s) from ${reportPath}`);
    for (const task of tasks) {
        console.log(`- ${task.id} target=${task.target} priority=${task.priority} :: ${task.task}`);
    }
}

(function main() {
    try {
        const options = parseArgs(process.argv.slice(2));
        if (options.help) {
            printHelp();
            return;
        }

        const report = loadReport(options.reportPath);
        const tasks = buildSkillGrowthTasks(report.skillGrowthPlan, {
            fromAgentId: options.fromAgentId,
            sourceReport: options.reportPath,
            targetMap: options.targetMap,
            defaultTarget: options.defaultTarget,
            maxItems: options.maxItems
        });

        printSummary(tasks, options.reportPath);

        if (options.outPath) {
            ensureDirForFile(options.outPath);
            fs.writeFileSync(options.outPath, `${JSON.stringify({
                generatedAt: new Date().toISOString(),
                sourceReport: options.reportPath,
                count: tasks.length,
                tasks
            }, null, 2)}\n`);
            console.log(`Skill task plan written to ${options.outPath}`);
        }
    } catch (error) {
        console.error(`Skill planner failed: ${error.message}`);
        process.exit(1);
    }
})();
