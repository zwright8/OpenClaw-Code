import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    publish_workflow_template: 'agent:workflow',
    optimize_template_step: 'agent:ops',
    add_template_validation_suite: 'agent:quality'
};

const RecommendationPriorityTaskMap = {
    P0: 'critical',
    P1: 'high',
    P2: 'normal',
    P3: 'low'
};

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function safeNow(nowFn) {
    const value = Number(nowFn());
    return Number.isFinite(value) ? value : Date.now();
}

function safeNumber(value, fallback = 0) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : fallback;
}

function clamp(value, min = 0, max = 100) {
    return Math.max(min, Math.min(max, value));
}

function normalizeWorkflowRuns(inputPayload) {
    const source = Array.isArray(inputPayload?.workflowRuns)
        ? inputPayload.workflowRuns
        : [];

    return source
        .filter((entry) => entry && typeof entry === 'object')
        .map((entry, index) => ({
            workflowId: typeof entry.workflowId === 'string' && entry.workflowId.trim()
                ? entry.workflowId.trim()
                : `workflow-${index + 1}`,
            domain: typeof entry.domain === 'string' && entry.domain.trim()
                ? entry.domain.trim().toLowerCase()
                : 'general',
            successRate: clamp(safeNumber(entry.successRate, 70)),
            latencyMs: Math.max(0, Math.floor(safeNumber(entry.latencyMs, 20_000))),
            runCount: Math.max(1, Math.floor(safeNumber(entry.runCount, 1))),
            steps: Array.isArray(entry.steps)
                ? entry.steps
                    .filter((step) => step && typeof step === 'object')
                    .map((step, stepIndex) => ({
                        key: typeof step.key === 'string' && step.key.trim()
                            ? step.key.trim()
                            : `step-${stepIndex + 1}`,
                        failureRate: clamp(safeNumber(step.failureRate, 12)),
                        latencyMs: Math.max(0, Math.floor(safeNumber(step.latencyMs, 2_000)))
                    }))
                : []
        }));
}

function synthesizeTemplates(workflowRuns) {
    const byDomain = new Map();

    for (const run of workflowRuns) {
        const bucket = byDomain.get(run.domain) || {
            domain: run.domain,
            runs: []
        };
        bucket.runs.push(run);
        byDomain.set(run.domain, bucket);
    }

    return Array.from(byDomain.values()).map((bucket) => {
        const totalRuns = bucket.runs.reduce((acc, run) => acc + run.runCount, 0);
        const weightedSuccess = bucket.runs.reduce((acc, run) => acc + run.successRate * run.runCount, 0);
        const weightedLatency = bucket.runs.reduce((acc, run) => acc + run.latencyMs * run.runCount, 0);

        const stepStats = new Map();
        for (const run of bucket.runs) {
            for (const step of run.steps) {
                const stats = stepStats.get(step.key) || {
                    key: step.key,
                    occurrence: 0,
                    failureTotal: 0,
                    latencyTotal: 0
                };
                stats.occurrence += 1;
                stats.failureTotal += step.failureRate;
                stats.latencyTotal += step.latencyMs;
                stepStats.set(step.key, stats);
            }
        }

        const templateSteps = Array.from(stepStats.values())
            .map((step) => ({
                key: step.key,
                occurrence: step.occurrence,
                avgFailureRate: Number((step.failureTotal / step.occurrence).toFixed(2)),
                avgLatencyMs: Number((step.latencyTotal / step.occurrence).toFixed(2)),
                bottleneck: step.failureTotal / step.occurrence >= 20 || step.latencyTotal / step.occurrence >= 6_000
            }))
            .sort((a, b) => b.occurrence - a.occurrence);

        const templateQuality = clamp(Math.round(
            (weightedSuccess / Math.max(1, totalRuns)) * 0.58
            + (100 - Math.min(100, (weightedLatency / Math.max(1, totalRuns)) / 160)) * 0.22
            + Math.min(20, totalRuns * 2)
            + (100 - templateSteps.filter((step) => step.bottleneck).length * 8) * 0.2
        ));

        return {
            templateId: `template-${bucket.domain}`,
            domain: bucket.domain,
            sourceWorkflowCount: bucket.runs.length,
            totalRuns,
            templateQuality,
            avgSuccessRate: Number((weightedSuccess / Math.max(1, totalRuns)).toFixed(2)),
            avgLatencyMs: Number((weightedLatency / Math.max(1, totalRuns)).toFixed(2)),
            steps: templateSteps,
            publishable: templateQuality >= 62
        };
    }).sort((a, b) => b.templateQuality - a.templateQuality);
}

function summarizeTemplates(templates) {
    const publishableCount = templates.filter((template) => template.publishable).length;
    const bottleneckTemplateCount = templates.filter((template) => template.steps.some((step) => step.bottleneck)).length;
    const avgTemplateQuality = templates.length > 0
        ? Number((templates.reduce((acc, template) => acc + template.templateQuality, 0) / templates.length).toFixed(2))
        : 0;

    let posture = 'productive';
    if (publishableCount < templates.length || avgTemplateQuality < 68) posture = 'improving';
    if (publishableCount === 0 || avgTemplateQuality < 52) posture = 'blocked';

    return {
        templateCount: templates.length,
        publishableCount,
        bottleneckTemplateCount,
        avgTemplateQuality,
        posture
    };
}

function buildAlerts(summary) {
    const alerts = [];
    if (summary.publishableCount === 0 && summary.templateCount > 0) alerts.push('no_publishable_templates');
    if (summary.bottleneckTemplateCount > 0) alerts.push('template_bottlenecks_detected');
    if (summary.avgTemplateQuality < 60) alerts.push('template_quality_low');
    return alerts;
}

function buildRecommendations(templates, summary, alerts) {
    const recommendations = [];

    for (const template of templates) {
        if (template.publishable) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'publish_workflow_template',
                templateId: template.templateId,
                title: `Publish workflow template ${template.templateId}`,
                description: `Template quality ${template.templateQuality} from ${template.totalRuns} runs.`,
                priority: template.templateQuality >= 80 ? 'P1' : 'P2'
            });
        }

        const bottlenecks = template.steps.filter((step) => step.bottleneck);
        for (const bottleneck of bottlenecks.slice(0, 2)) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'optimize_template_step',
                templateId: template.templateId,
                stepKey: bottleneck.key,
                title: `Optimize template step ${bottleneck.key}`,
                description: `Step bottleneck with avg failure ${bottleneck.avgFailureRate} and latency ${bottleneck.avgLatencyMs}ms.`,
                priority: bottleneck.avgFailureRate >= 30 ? 'P1' : 'P2'
            });
        }
    }

    if (alerts.length > 0) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'add_template_validation_suite',
            title: 'Add workflow template validation suite',
            description: 'Add regression validation for synthesized templates before publication.',
            priority: summary.posture === 'blocked' ? 'P1' : 'P2'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations
        .sort((a, b) => {
            const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
            if (p !== 0) return p;
            return String(a.templateId || '').localeCompare(String(b.templateId || ''));
        })
        .filter((entry, index, arr) => arr.findIndex((other) => (
            other.type === entry.type
            && String(other.templateId || '') === String(entry.templateId || '')
            && String(other.stepKey || '') === String(entry.stepKey || '')
        )) === index);
}

export function synthesizeWorkflowTemplates(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const workflowRuns = normalizeWorkflowRuns(inputPayload || {});
    const templates = synthesizeTemplates(workflowRuns);
    const summary = summarizeTemplates(templates);
    const alerts = buildAlerts(summary);
    const recommendations = buildRecommendations(templates, summary, alerts);

    return {
        at,
        summary,
        templates,
        alerts,
        recommendations
    };
}

export function workflowTemplatesToTasks(reportPayload, {
    fromAgentId = 'agent:workflow-templates',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('workflowTemplatesToTasks requires report payload');
    }

    const recommendations = Array.isArray(reportPayload.recommendations)
        ? reportPayload.recommendations
        : [];
    const targets = {
        ...RecommendationTargetMap,
        ...(targetMap || {})
    };
    const nowMs = safeNow(Date.now);

    return recommendations.map((recommendation, index) => buildTaskRequest({
        id: randomUUID(),
        from: fromAgentId,
        target: targets[recommendation.type] || defaultTarget,
        priority: RecommendationPriorityTaskMap[recommendation.priority] || 'normal',
        task: `[${recommendation.priority}] ${recommendation.title}`,
        context: {
            recommendationType: recommendation.type,
            templateId: recommendation.templateId || null,
            stepKey: recommendation.stepKey || null,
            posture: reportPayload.summary?.posture || null
        },
        createdAt: nowMs + index
    }));
}

export class WorkflowTemplateSynthesizer {
    constructor({
        localAgentId = 'agent:workflow-templates',
        now = Date.now,
        maxHistory = 120
    } = {}) {
        this.localAgentId = localAgentId;
        this.now = typeof now === 'function' ? now : Date.now;
        this.maxHistory = Number.isInteger(maxHistory) && maxHistory > 0
            ? maxHistory
            : 120;
        this.history = [];
    }

    evaluate(inputPayload, options = {}) {
        const report = synthesizeWorkflowTemplates(inputPayload, {
            now: this.now,
            ...options
        });
        this.history.push(report);
        if (this.history.length > this.maxHistory) {
            this.history.splice(0, this.history.length - this.maxHistory);
        }
        return clone(report);
    }

    buildTasks(reportPayload, options = {}) {
        return workflowTemplatesToTasks(reportPayload, {
            fromAgentId: this.localAgentId,
            ...options
        });
    }

    listHistory({ limit = 20 } = {}) {
        return this.history
            .slice(-Math.max(1, Number(limit) || 20))
            .map((entry) => clone(entry));
    }
}

export const __workflowTemplateSynthesizerInternals = {
    normalizeWorkflowRuns,
    synthesizeTemplates,
    summarizeTemplates,
    buildRecommendations
};
