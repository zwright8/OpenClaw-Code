import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { buildRemediationTasks } from '../src/remediation-task-planner.js';

function printHelp() {
    console.log(`Cognition Core remediation task planner

Usage:
  tsx scripts/plan-remediation-tasks.ts [options]

Options:
  --report <path>         Path to scorecard/report JSON (default: ./reports/productivity-scorecard.latest.json)
  --from <agentId>        Source agent id for task requests (default: agent:main)
  --default-target <id>   Default target agent (default: agent:ops)
  --target-p1 <id>        Target override for P1 tasks
  --target-p2 <id>        Target override for P2 tasks
  --target-p3 <id>        Target override for P3 tasks
  --max <n>               Max remediation items to convert
  --out <path>            Write generated task requests JSON (default: ./reports/remediation-tasks.latest.json)
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

function deterministicUuid(seed) {
    const hex = createHash('sha256').update(String(seed)).digest('hex');
    const variantByte = ((parseInt(hex.slice(16, 18), 16) & 0x3f) | 0x80).toString(16).padStart(2, '0');

    return [
        hex.slice(0, 8),
        hex.slice(8, 12),
        `5${hex.slice(13, 16)}`,
        `${variantByte}${hex.slice(18, 20)}`,
        hex.slice(20, 32)
    ].join('-');
}

function parseArgs(argv) {
    const options = {
        reportPath: path.resolve(process.cwd(), 'reports/productivity-scorecard.latest.json'),
        fromAgentId: 'agent:main',
        defaultTarget: 'agent:ops',
        targetMap: {},
        maxItems: Number.POSITIVE_INFINITY,
        outPath: path.resolve(process.cwd(), 'reports/remediation-tasks.latest.json'),
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

function normalizeThresholdBreach(item, index) {
    if (!item || typeof item !== 'object') {
        return null;
    }

    const metric = typeof item.metric === 'string' ? item.metric : null;
    if (!metric) {
        return null;
    }

    const priority = typeof item.priority === 'string' ? item.priority : 'P3';
    const title = typeof item.title === 'string' && item.title.trim().length > 0
        ? item.title.trim()
        : `Resolve threshold breach for ${metric}`;
    const action = typeof item.action === 'string' && item.action.trim().length > 0
        ? item.action.trim()
        : 'Review metric breach and apply remediation.';

    return {
        metric,
        priority: ['P1', 'P2', 'P3'].includes(priority) ? priority : 'P3',
        title,
        rationale: typeof item.rationale === 'string' ? item.rationale : '',
        action,
        threshold: Number(item.threshold),
        actual: Number(item.actual),
        gap: Number(item.gap),
        comparison: typeof item.comparison === 'string' ? item.comparison : null,
        index
    };
}

function normalizeRemediationItem(item, index) {
    if (!item || typeof item !== 'object') {
        return null;
    }

    const priority = typeof item.priority === 'string' ? item.priority : 'P3';
    const title = typeof item.title === 'string' ? item.title.trim() : '';
    const action = typeof item.action === 'string' ? item.action.trim() : '';

    if (!title || !action) {
        return null;
    }

    return {
        metric: typeof item.metric === 'string' ? item.metric : null,
        priority: ['P1', 'P2', 'P3'].includes(priority) ? priority : 'P3',
        title,
        rationale: typeof item.rationale === 'string' ? item.rationale : '',
        action,
        index
    };
}

function loadReport(reportPath) {
    if (!fs.existsSync(reportPath)) {
        throw new Error(`Report file not found: ${reportPath}`);
    }

    const parsed = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

    const thresholdBreaches = Array.isArray(parsed.thresholdBreaches)
        ? parsed.thresholdBreaches
            .map((item, index) => normalizeThresholdBreach(item, index))
            .filter(Boolean)
        : [];

    let remediationPlan = Array.isArray(parsed.remediationPlan)
        ? parsed.remediationPlan
            .map((item, index) => normalizeRemediationItem(item, index))
            .filter(Boolean)
        : [];

    if (remediationPlan.length === 0 && thresholdBreaches.length > 0) {
        remediationPlan = thresholdBreaches.map((breach) => ({
            metric: breach.metric,
            priority: breach.priority,
            title: breach.title,
            rationale: breach.rationale,
            action: breach.action,
            index: breach.index
        }));
    }

    if (remediationPlan.length === 0) {
        throw new Error('Report does not contain remediationPlan or thresholdBreaches');
    }

    const normalizedPlan = remediationPlan.map((item, index) => {
        if (item.metric) {
            return item;
        }

        const byIndex = thresholdBreaches[index];
        const byTitle = thresholdBreaches.find((breach) => breach.title === item.title);
        const matched = byIndex ?? byTitle ?? null;

        return {
            ...item,
            metric: matched?.metric ?? null
        };
    });

    return {
        report: parsed,
        remediationPlan: normalizedPlan,
        thresholdBreaches
    };
}

export function buildRemediationTaskArtifacts(reportPayload, options = {}) {
    const reportPath = options.reportPath ?? 'report.json';
    const sourceGeneratedAt = typeof reportPayload?.generatedAt === 'string' ? reportPayload.generatedAt : null;
    const seedTime = Number.isFinite(Date.parse(String(sourceGeneratedAt)))
        ? Date.parse(String(sourceGeneratedAt))
        : Date.now();

    const remediationPlan = Array.isArray(reportPayload?.remediationPlan) ? reportPayload.remediationPlan : [];
    const thresholdBreaches = Array.isArray(reportPayload?.thresholdBreaches) ? reportPayload.thresholdBreaches : [];

    const sourceSeed = `${reportPath}|${sourceGeneratedAt ?? seedTime}`;

    const tasks = buildRemediationTasks(remediationPlan, {
        fromAgentId: options.fromAgentId ?? 'agent:main',
        sourceReport: reportPath,
        targetMap: options.targetMap ?? {},
        defaultTarget: options.defaultTarget ?? 'agent:ops',
        maxItems: options.maxItems ?? Number.POSITIVE_INFINITY,
        nowFactory: () => seedTime,
        idFactory: (index, item) => deterministicUuid(`${sourceSeed}|${index}|${item.priority}|${item.title}|${item.action}`)
    });

    const artifacts = tasks.map((task, index) => {
        const remediation = remediationPlan[index] ?? null;
        const breachByMetric = remediation?.metric
            ? thresholdBreaches.find((candidate) => candidate.metric === remediation.metric)
            : null;
        const breach = thresholdBreaches[index] ?? breachByMetric ?? null;

        return {
            taskId: task.id,
            sourceReport: reportPath,
            metric: remediation?.metric ?? breach?.metric ?? null,
            priority: remediation?.priority ?? breach?.priority ?? 'P3',
            target: task.target,
            swarmPriority: task.priority,
            task: task.task,
            title: remediation?.title ?? breach?.title ?? '',
            action: remediation?.action ?? breach?.action ?? '',
            threshold: breach?.threshold ?? null,
            actual: breach?.actual ?? null,
            gap: breach?.gap ?? null,
            comparison: breach?.comparison ?? null
        };
    });

    return {
        generatedAt: new Date(seedTime).toISOString(),
        sourceGeneratedAt,
        sourceReport: reportPath,
        count: tasks.length,
        tasks,
        artifacts
    };
}

function printSummary(bundle) {
    console.log(`Generated ${bundle.tasks.length} task request(s) from ${bundle.sourceReport}`);
    for (const artifact of bundle.artifacts) {
        const metricPart = artifact.metric ? ` metric=${artifact.metric}` : '';
        console.log(`- ${artifact.taskId} target=${artifact.target} priority=${artifact.priority}${metricPart} :: ${artifact.task}`);
    }
}

export function runCli(argv = process.argv.slice(2)) {
    const options = parseArgs(argv);
    if (options.help) {
        printHelp();
        return;
    }

    const { report, remediationPlan, thresholdBreaches } = loadReport(options.reportPath);
    const bundle = buildRemediationTaskArtifacts(
        {
            ...report,
            remediationPlan,
            thresholdBreaches
        },
        {
            reportPath: options.reportPath,
            fromAgentId: options.fromAgentId,
            targetMap: options.targetMap,
            defaultTarget: options.defaultTarget,
            maxItems: options.maxItems
        }
    );

    printSummary(bundle);

    if (options.outPath) {
        ensureDirForFile(options.outPath);
        fs.writeFileSync(options.outPath, `${JSON.stringify(bundle, null, 2)}\n`);
        console.log(`Task plan written to ${options.outPath}`);
    }
}

const isMain = (() => {
    if (!process.argv[1]) return false;
    return pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
})();

if (isMain) {
    try {
        runCli();
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`Planner failed: ${message}`);
        process.exit(1);
    }
}
