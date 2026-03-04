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

function parseFiniteNumberOrNull(value) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
}

function round(value, digits = 2) {
    if (!Number.isFinite(value)) return 0;
    return Number(value.toFixed(digits));
}

function hasExplicitThresholdDetails(reason) {
    if (typeof reason !== 'string') return false;
    const normalized = reason.toLowerCase();
    return normalized.includes('expected') && normalized.includes('actual') && normalized.includes('miss');
}

const METRIC_UNIT_MAP = {
    productivityIndex: 'index',
    cycleTimeSec: 'seconds',
    automationCoverage: 'percent',
    cognitionSuccessRate: 'percent',
    swarmSimSuccessRate: 'percent',
    skillUtilityComposite: 'percent'
};

const METRIC_PRECISION_MAP = {
    productivityIndex: 2,
    cycleTimeSec: 3,
    automationCoverage: 2,
    cognitionSuccessRate: 2,
    swarmSimSuccessRate: 2,
    skillUtilityComposite: 2
};

function normalizeWhitespace(value) {
    if (typeof value !== 'string') return '';
    return value.replace(/\s+/g, ' ').trim();
}

function formatMetricValue(metric, value) {
    const digits = METRIC_PRECISION_MAP[metric] ?? 2;
    return round(value, digits);
}

function normalizeThresholdReasonPayload(payload) {
    if (!payload || typeof payload !== 'object') {
        return null;
    }

    const metric = typeof payload.metric === 'string' ? payload.metric : null;
    const comparison = typeof payload.comparison === 'string' ? payload.comparison : null;
    const threshold = parseFiniteNumberOrNull(payload.threshold);
    const actual = parseFiniteNumberOrNull(payload.actual);
    const miss = parseFiniteNumberOrNull(payload.miss);
    const unit = typeof payload.unit === 'string' ? payload.unit : null;

    if (!metric || !comparison || threshold === null || actual === null || miss === null || !unit) {
        return null;
    }

    return {
        code: 'THRESHOLD_BREACH',
        metric,
        comparison,
        threshold: formatMetricValue(metric, threshold),
        actual: formatMetricValue(metric, actual),
        miss: formatMetricValue(metric, Math.abs(miss)),
        unit
    };
}

function buildThresholdReasonPayload(breach) {
    const metric = typeof breach?.metric === 'string' ? breach.metric : null;
    const comparison = typeof breach?.comparison === 'string' ? breach.comparison : null;
    const threshold = parseFiniteNumberOrNull(breach?.threshold);
    const actual = parseFiniteNumberOrNull(breach?.actual);
    const gap = parseFiniteNumberOrNull(breach?.gap);

    if (!metric || !comparison || threshold === null || actual === null) {
        return null;
    }

    const missRaw = gap !== null
        ? Math.abs(gap)
        : Math.abs((comparison === 'gte' ? threshold - actual : actual - threshold));
    const unit = METRIC_UNIT_MAP[metric] ?? 'units';

    return {
        code: 'THRESHOLD_BREACH',
        metric,
        comparison,
        threshold: formatMetricValue(metric, threshold),
        actual: formatMetricValue(metric, actual),
        miss: formatMetricValue(metric, missRaw),
        unit
    };
}

function buildReasonFromPayload(payload) {
    if (!payload) {
        return null;
    }

    return `Threshold breach for ${payload.metric}: expected ${payload.comparison} ${payload.threshold} ${payload.unit}, actual ${payload.actual} ${payload.unit}, miss ${payload.miss} ${payload.unit}.`;
}

function buildExplicitRegressionReasonBundle(breach, fallbackReason = '') {
    const reasonPayload =
        normalizeThresholdReasonPayload(breach?.reasonPayload) ??
        buildThresholdReasonPayload(breach);

    const reasonFromPayload = buildReasonFromPayload(reasonPayload);
    if (reasonFromPayload) {
        return {
            reason: reasonFromPayload,
            reasonPayload
        };
    }

    const fallback = normalizeWhitespace(fallbackReason);
    if (fallback.length > 0) {
        if (hasExplicitThresholdDetails(fallback)) {
            return {
                reason: fallback,
                reasonPayload: null
            };
        }
        return {
            reason: `Threshold breach details unavailable: ${fallback}`,
            reasonPayload: null
        };
    }

    return {
        reason: 'Threshold breach details unavailable.',
        reasonPayload: null
    };
}

const PRIORITY_ORDER = {
    P1: 0,
    P2: 1,
    P3: 2
};

function compareString(left, right) {
    if (left === right) return 0;
    return left < right ? -1 : 1;
}

function compareNumber(left, right) {
    if (left === right) return 0;
    return left < right ? -1 : 1;
}

function comparePriority(left, right) {
    const leftRank = PRIORITY_ORDER[left] ?? PRIORITY_ORDER.P3;
    const rightRank = PRIORITY_ORDER[right] ?? PRIORITY_ORDER.P3;
    return compareNumber(leftRank, rightRank);
}

function compareRemediationItems(left, right) {
    return (
        comparePriority(left?.priority, right?.priority) ||
        compareString(String(left?.metric ?? ''), String(right?.metric ?? '')) ||
        compareString(String(left?.title ?? '').trim(), String(right?.title ?? '').trim()) ||
        compareString(String(left?.action ?? '').trim(), String(right?.action ?? '').trim())
    );
}

function compareThresholdBreaches(left, right) {
    return (
        comparePriority(left?.priority, right?.priority) ||
        compareString(String(left?.metric ?? ''), String(right?.metric ?? '')) ||
        compareString(String(left?.title ?? '').trim(), String(right?.title ?? '').trim()) ||
        compareString(String(left?.action ?? '').trim(), String(right?.action ?? '').trim()) ||
        compareNumber(parseFiniteNumberOrNull(left?.threshold) ?? 0, parseFiniteNumberOrNull(right?.threshold) ?? 0) ||
        compareNumber(parseFiniteNumberOrNull(left?.actual) ?? 0, parseFiniteNumberOrNull(right?.actual) ?? 0) ||
        compareNumber(parseFiniteNumberOrNull(left?.gap) ?? 0, parseFiniteNumberOrNull(right?.gap) ?? 0)
    );
}

function remediationSignature(item) {
    if (!item || typeof item !== 'object') {
        return null;
    }
    const metric = typeof item.metric === 'string' ? item.metric : '';
    const priority = typeof item.priority === 'string' ? item.priority : 'P3';
    const title = typeof item.title === 'string' ? item.title.trim() : '';
    const action = typeof item.action === 'string' ? item.action.trim() : '';

    return [metric, priority, title, action].join('|');
}

function dequeue(queue) {
    if (!Array.isArray(queue) || queue.length === 0) {
        return null;
    }
    return queue.shift() ?? null;
}

function stableRemediationSeed(remediationPlan, thresholdBreaches) {
    const canonicalRemediationPlan = Array.isArray(remediationPlan)
        ? remediationPlan.map((item) => ({
            metric: typeof item?.metric === 'string' ? item.metric : null,
            priority: typeof item?.priority === 'string' ? item.priority : 'P3',
            title: typeof item?.title === 'string' ? item.title.trim() : '',
            action: typeof item?.action === 'string' ? item.action.trim() : ''
        })).sort(compareRemediationItems)
        : [];

    const canonicalThresholdBreaches = Array.isArray(thresholdBreaches)
        ? thresholdBreaches.map((breach) => ({
            metric: typeof breach?.metric === 'string' ? breach.metric : null,
            priority: typeof breach?.priority === 'string' ? breach.priority : 'P3',
            comparison: typeof breach?.comparison === 'string' ? breach.comparison : null,
            threshold: parseFiniteNumberOrNull(breach?.threshold),
            actual: parseFiniteNumberOrNull(breach?.actual),
            gap: parseFiniteNumberOrNull(breach?.gap),
            title: typeof breach?.title === 'string' ? breach.title.trim() : '',
            action: typeof breach?.action === 'string' ? breach.action.trim() : ''
        })).sort(compareThresholdBreaches)
        : [];

    const canonicalPayload = {
        remediationPlan: canonicalRemediationPlan,
        thresholdBreaches: canonicalThresholdBreaches
    };

    return createHash('sha256').update(JSON.stringify(canonicalPayload)).digest('hex');
}

function deterministicSeedTime(remediationPlan, thresholdBreaches) {
    const fingerprint = stableRemediationSeed(remediationPlan, thresholdBreaches).slice(0, 12);
    return Number.parseInt(fingerprint, 16);
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
        reasonPayload: normalizeThresholdReasonPayload(item.reasonPayload),
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

        const { reason, reasonPayload } = buildExplicitRegressionReasonBundle(breach, remediation?.rationale ?? '');

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
            threshold: parseFiniteNumberOrNull(breach?.threshold),
            actual: parseFiniteNumberOrNull(breach?.actual),
            gap: parseFiniteNumberOrNull(breach?.gap),
            comparison: breach?.comparison ?? null,
            regressionReason: reason,
            regressionReasonPayload: reasonPayload
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
