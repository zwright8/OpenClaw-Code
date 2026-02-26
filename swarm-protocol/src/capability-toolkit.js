import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const BaseSignalDefinitions = {
    demand: { field: 'demand', default: 62 },
    capacity: { field: 'capacity', default: 58 },
    risk: { field: 'risk', default: 50 },
    impact: { field: 'impact', default: 70 },
    readiness: { field: 'readiness', default: 56 },
    resilience: { field: 'resilience', default: 55 },
    equity: { field: 'equity', default: 55 },
    efficiency: { field: 'efficiency', default: 58 },
    quality: { field: 'quality', default: 64 },
    trust: { field: 'trust', default: 65 },
    opportunity: { field: 'opportunity', default: 60 },
    criticality: { field: 'criticality', default: 68 }
};

const DefaultThresholds = {
    holdGap: 70,
    nextGap: 45,
    criticalGap: 62,
    reviewGap: 40
};

const PriorityRank = { P0: 0, P1: 1, P2: 2, P3: 3 };

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

function safeFraction(value, fallback = 0) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return fallback;
    return Math.max(0, Math.min(1, numeric));
}

function clamp(value, min = 0, max = 100) {
    return Math.max(min, Math.min(max, value));
}

function sanitizeKey(value, fallback = 'capability') {
    if (typeof value !== 'string' || !value.trim()) return fallback;
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '') || fallback;
}

function normalizeSignalDefinitions(signalMap = {}) {
    const normalized = {};
    for (const [signal, base] of Object.entries(BaseSignalDefinitions)) {
        const override = signalMap[signal];
        if (!override) {
            normalized[signal] = { ...base };
            continue;
        }

        if (typeof override === 'string') {
            normalized[signal] = {
                field: override,
                default: base.default
            };
            continue;
        }

        normalized[signal] = {
            field: typeof override.field === 'string' && override.field.trim()
                ? override.field.trim()
                : base.field,
            default: clamp(safeNumber(override.default, base.default))
        };
    }

    return normalized;
}

function parseSignalValue(rawValue, fallbackValue) {
    const parsed = Number(rawValue);
    if (Number.isFinite(parsed)) {
        return {
            value: clamp(parsed),
            provided: true
        };
    }

    return {
        value: clamp(safeNumber(fallbackValue, 0)),
        provided: false
    };
}

function normalizeEntities(inputPayload, {
    collectionField,
    idField,
    nameField,
    defaultName,
    signalDefinitions
}) {
    const collection = Array.isArray(inputPayload?.[collectionField])
        ? inputPayload[collectionField]
        : (Array.isArray(inputPayload?.entities) ? inputPayload.entities : []);

    return collection
        .filter((entry) => entry && typeof entry === 'object')
        .map((entry, index) => {
            const entityId = typeof entry[idField] === 'string' && entry[idField].trim()
                ? entry[idField].trim()
                : `${sanitizeKey(defaultName, 'entity')}-${index + 1}`;
            const entityName = typeof entry[nameField] === 'string' && entry[nameField].trim()
                ? entry[nameField].trim()
                : `${defaultName} ${index + 1}`;

            const signals = {};
            let providedSignalCount = 0;
            let defaultedSignalCount = 0;
            for (const [signalName, definition] of Object.entries(signalDefinitions)) {
                const raw = entry?.[definition.field];
                const parsed = parseSignalValue(raw, definition.default);
                signals[signalName] = parsed.value;
                if (parsed.provided) providedSignalCount += 1;
                else defaultedSignalCount += 1;
            }
            const totalSignalCount = Object.keys(signalDefinitions).length;
            const signalCoverage = totalSignalCount > 0
                ? Number((providedSignalCount / totalSignalCount).toFixed(3))
                : 1;

            return {
                entityId,
                entityName,
                signals,
                signalCoverage,
                providedSignalCount,
                defaultedSignalCount,
                totalSignalCount
            };
        });
}

function normalizeCapacity(inputPayload = {}) {
    const capacity = inputPayload?.capacity && typeof inputPayload.capacity === 'object'
        ? inputPayload.capacity
        : {};
    return {
        executionSlots: Math.max(0, Math.floor(safeNumber(capacity.executionSlots, 4))),
        analysisHours: Math.max(0, Math.floor(safeNumber(capacity.analysisHours, 80))),
        reviewHours: Math.max(0, Math.floor(safeNumber(capacity.reviewHours, 30)))
    };
}

function scoreEntity(signals, signalCoverage = 1) {
    const pressureScore = clamp(Math.round(
        signals.demand * 0.42
        + signals.risk * 0.24
        + signals.impact * 0.22
        + (100 - signals.readiness) * 0.12
    ));
    const bufferScore = clamp(Math.round(
        signals.capacity * 0.4
        + signals.resilience * 0.22
        + signals.readiness * 0.2
        + signals.efficiency * 0.18
    ));
    const gapScore = clamp(Math.round(
        pressureScore
        - bufferScore * 0.56
        + (100 - signals.quality) * 0.14
    ));
    const benefitScore = clamp(Math.round(
        signals.impact * 0.34
        + signals.opportunity * 0.2
        + signals.equity * 0.16
        + signals.trust * 0.14
        + signals.quality * 0.16
    ));
    const dataReliabilityScore = clamp(Math.round(signalCoverage * 100));
    const confidencePenalty = clamp(Math.round((100 - dataReliabilityScore) * 0.18), 0, 18);
    const priorityScore = clamp(Math.round(
        gapScore * 0.56
        + benefitScore * 0.3
        + signals.criticality * 0.14
        + confidencePenalty
    ));

    return {
        pressureScore,
        bufferScore,
        gapScore,
        benefitScore,
        priorityScore,
        dataReliabilityScore
    };
}

function assessEntities(entities, capacity, thresholds) {
    let executionSlots = capacity.executionSlots;
    let analysisHours = capacity.analysisHours;
    let reviewHours = capacity.reviewHours;

    const prioritized = entities
        .map((entity) => ({
            ...entity,
            ...scoreEntity(entity.signals, entity.signalCoverage)
        }))
        .sort((a, b) => b.priorityScore - a.priorityScore);

    const assessments = [];
    for (const entity of prioritized) {
        const slotNeed = entity.gapScore >= 76 || entity.priorityScore >= 85 ? 2 : 1;
        const analysisNeed = Math.max(4, Math.round(
            entity.gapScore * 0.34
            + (100 - entity.signals.readiness) * 0.16
        ));
        const reviewNeed = Math.max(2, Math.round(
            entity.signals.risk * 0.2
            + (100 - entity.signals.trust) * 0.1
        ));

        const allocated = executionSlots >= slotNeed
            && analysisHours >= analysisNeed
            && reviewHours >= reviewNeed;

        if (allocated) {
            executionSlots -= slotNeed;
            analysisHours -= analysisNeed;
            reviewHours -= reviewNeed;
        }

        const rawProjectedLift = allocated
            ? clamp(Math.round(
                entity.signals.readiness * 0.2
                + entity.signals.capacity * 0.18
                + entity.signals.efficiency * 0.18
                + entity.signals.quality * 0.16
                + (100 - entity.signals.risk) * 0.18
                + entity.signals.resilience * 0.1
            ))
            : clamp(Math.round(
                entity.signals.readiness * 0.18
                + entity.signals.capacity * 0.16
                + entity.signals.trust * 0.14
            ));
        const reliabilityFactor = Number((0.72 + entity.signalCoverage * 0.28).toFixed(3));
        const projectedLift = clamp(Math.round(rawProjectedLift * reliabilityFactor));

        const residualGap = clamp(Math.round(
            entity.gapScore * 0.72
            - projectedLift * 0.46
            + (allocated ? 0 : 16)
        ));

        let lane = 'now';
        if (!allocated && residualGap > thresholds.holdGap) lane = 'hold';
        else if (residualGap > thresholds.nextGap || !allocated) lane = 'next';

        assessments.push({
            entityId: entity.entityId,
            entityName: entity.entityName,
            priorityScore: entity.priorityScore,
            gapScore: entity.gapScore,
            benefitScore: entity.benefitScore,
            pressureScore: entity.pressureScore,
            bufferScore: entity.bufferScore,
            projectedLift,
            residualGap,
            lane,
            allocated,
            allocation: {
                slotNeed,
                analysisNeed,
                reviewNeed
            },
            signalCoverage: entity.signalCoverage,
            providedSignalCount: entity.providedSignalCount,
            defaultedSignalCount: entity.defaultedSignalCount,
            totalSignalCount: entity.totalSignalCount,
            dataReliabilityScore: entity.dataReliabilityScore,
            signals: {
                ...entity.signals
            }
        });
    }

    const laneRank = { now: 0, next: 1, hold: 2 };
    assessments.sort((a, b) => {
        const laneDiff = laneRank[a.lane] - laneRank[b.lane];
        if (laneDiff !== 0) return laneDiff;
        return b.priorityScore - a.priorityScore;
    });

    return {
        assessments,
        remainingCapacity: {
            executionSlots,
            analysisHours,
            reviewHours
        }
    };
}

function summarizeAssessments(
    assessments,
    remainingCapacity,
    readyPosture,
    thresholds,
    reliabilityPolicy
) {
    const laneCounts = assessments.reduce((acc, item) => {
        acc[item.lane] = (acc[item.lane] || 0) + 1;
        return acc;
    }, { now: 0, next: 0, hold: 0 });

    const avgResidualGap = assessments.length > 0
        ? Number((assessments.reduce((acc, item) => acc + item.residualGap, 0) / assessments.length).toFixed(2))
        : 0;
    const avgProjectedLift = assessments.length > 0
        ? Number((assessments.reduce((acc, item) => acc + item.projectedLift, 0) / assessments.length).toFixed(2))
        : 0;
    const avgSignalCoverage = assessments.length > 0
        ? Number((assessments.reduce((acc, item) => acc + item.signalCoverage, 0) / assessments.length).toFixed(3))
        : 1;
    const lowCoverageCount = assessments.filter((item) => item.signalCoverage < reliabilityPolicy.lowCoverageThreshold).length;
    const signalTotals = assessments.reduce((acc, item) => {
        acc.total += item.totalSignalCount;
        acc.defaulted += item.defaultedSignalCount;
        return acc;
    }, { total: 0, defaulted: 0 });
    const defaultedSignalRate = signalTotals.total > 0
        ? Number((signalTotals.defaulted / signalTotals.total).toFixed(3))
        : 0;

    let posture = readyPosture;
    if (laneCounts.hold > 0 || avgResidualGap >= thresholds.criticalGap) posture = 'critical';
    else if (laneCounts.next > 0 || avgResidualGap >= thresholds.reviewGap) posture = 'review_required';
    if (posture !== 'critical' && (
        avgSignalCoverage < reliabilityPolicy.criticalCoverageThreshold
        || defaultedSignalRate >= 0.5
    )) {
        posture = 'critical';
    } else if (posture === readyPosture && (
        lowCoverageCount > 0
        || defaultedSignalRate >= reliabilityPolicy.defaultSignalRateThreshold
    )) {
        posture = 'review_required';
    }

    return {
        entityCount: assessments.length,
        laneCounts,
        avgResidualGap,
        avgProjectedLift,
        avgSignalCoverage,
        lowCoverageCount,
        defaultedSignalRate,
        remainingCapacity,
        posture
    };
}

function buildAlerts(assessments, summary, capabilityId, reliabilityPolicy) {
    const alerts = [];

    if (summary.laneCounts.hold > 0) alerts.push(`${capabilityId}_hold_queue_present`);
    if (summary.avgResidualGap > 55) alerts.push(`${capabilityId}_gap_high`);
    if (assessments.some((item) => item.lane !== 'now' && item.signals.risk >= 70)) {
        alerts.push(`${capabilityId}_risk_concentration`);
    }
    if (assessments.some((item) => item.signals.trust < 45)) {
        alerts.push(`${capabilityId}_trust_gap`);
    }
    if (assessments.some((item) => item.signals.quality < 50)) {
        alerts.push(`${capabilityId}_signal_quality_gap`);
    }
    if (summary.lowCoverageCount > 0) {
        alerts.push(`${capabilityId}_low_signal_coverage`);
    }
    if (summary.defaultedSignalRate >= reliabilityPolicy.defaultSignalRateThreshold) {
        alerts.push(`${capabilityId}_default_signal_overuse`);
    }

    return alerts;
}

function buildRecommendations(assessments, alerts, recommendationTypes, reliabilityPolicy) {
    const recommendations = [];

    for (const item of assessments) {
        const weakSignalCoverage = (
            item.signalCoverage < reliabilityPolicy.lowCoverageThreshold
            || item.defaultedSignalCount >= Math.ceil(item.totalSignalCount * 0.4)
        );

        if (item.allocated && item.lane === 'now') {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: recommendationTypes.primary,
                entityId: item.entityId,
                title: `Execute primary lane for ${item.entityName}`,
                description: `Priority ${item.priorityScore} with projected lift ${item.projectedLift}.`,
                priority: item.priorityScore >= 80 ? 'P1' : 'P2',
                lane: item.lane,
                residualGap: item.residualGap,
                signalCoverage: item.signalCoverage
            });
        }

        if (item.lane !== 'now' || item.residualGap > 58 || item.signals.risk >= 68) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: recommendationTypes.guard,
                entityId: item.entityId,
                title: `Mitigate gap for ${item.entityName}`,
                description: `Residual gap ${item.residualGap} with risk ${item.signals.risk}.`,
                priority: item.lane === 'hold' ? 'P0' : 'P1',
                lane: item.lane,
                residualGap: item.residualGap,
                signalCoverage: item.signalCoverage
            });
        }

        if (item.signals.trust < 50 || item.signals.quality < 50 || weakSignalCoverage) {
            const qualityIssues = [];
            if (item.signals.trust < 50) qualityIssues.push(`trust ${item.signals.trust}`);
            if (item.signals.quality < 50) qualityIssues.push(`quality ${item.signals.quality}`);
            if (weakSignalCoverage) {
                qualityIssues.push(`signal coverage ${(item.signalCoverage * 100).toFixed(1)}%`);
            }
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: recommendationTypes.audit,
                entityId: item.entityId,
                title: `Audit signal quality for ${item.entityName}`,
                description: `${qualityIssues.join(', ')} need verification.`,
                priority: item.lane === 'hold' ? 'P1' : 'P2',
                lane: item.lane,
                residualGap: item.residualGap,
                signalCoverage: item.signalCoverage
            });
        }
    }

    if (alerts.length > 0) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: recommendationTypes.publish,
            title: 'Publish capability status report',
            description: 'Share actionable lanes, residual risks, and capacity constraints.',
            priority: alerts.some((alert) => alert.endsWith('_hold_queue_present')) ? 'P1' : 'P2',
            lane: 'now',
            residualGap: 0,
            signalCoverage: null
        });
    }

    return recommendations
        .sort((a, b) => {
            const priorityDiff = (PriorityRank[a.priority] ?? 9) - (PriorityRank[b.priority] ?? 9);
            if (priorityDiff !== 0) return priorityDiff;
            return String(a.entityId || '').localeCompare(String(b.entityId || ''));
        })
        .filter((entry, index, arr) => arr.findIndex((other) => (
            other.type === entry.type && String(other.entityId || '') === String(entry.entityId || '')
        )) === index);
}

export function createCapabilityToolkit(config = {}) {
    const capabilityId = sanitizeKey(config.capabilityId, 'capability_toolkit');
    const collectionField = typeof config.collectionField === 'string' && config.collectionField.trim()
        ? config.collectionField.trim()
        : 'entities';
    const idField = typeof config.idField === 'string' && config.idField.trim()
        ? config.idField.trim()
        : 'entityId';
    const nameField = typeof config.nameField === 'string' && config.nameField.trim()
        ? config.nameField.trim()
        : 'name';
    const defaultName = typeof config.defaultName === 'string' && config.defaultName.trim()
        ? config.defaultName.trim()
        : 'Entity';
    const readyPosture = typeof config.readyPosture === 'string' && config.readyPosture.trim()
        ? config.readyPosture.trim()
        : 'ready';

    const recommendationTypes = {
        primary: config.recommendationTypes?.primary || `${capabilityId}_primary_action`,
        guard: config.recommendationTypes?.guard || `${capabilityId}_guard_action`,
        audit: config.recommendationTypes?.audit || `${capabilityId}_audit_action`,
        publish: config.recommendationTypes?.publish || `${capabilityId}_publish_status`
    };

    const recommendationTargetMap = {
        ...config.recommendationTargetMap
    };

    const signalDefinitions = normalizeSignalDefinitions(config.signalMap || {});
    const thresholds = {
        ...DefaultThresholds,
        ...(config.thresholds || {})
    };
    const reliabilityPolicy = {
        lowCoverageThreshold: safeFraction(config.reliabilityPolicy?.lowCoverageThreshold, 0.6),
        defaultSignalRateThreshold: safeFraction(config.reliabilityPolicy?.defaultSignalRateThreshold, 0.35),
        criticalCoverageThreshold: safeFraction(config.reliabilityPolicy?.criticalCoverageThreshold, 0.45)
    };

    function evaluate(inputPayload, { now = Date.now } = {}) {
        const at = safeNow(now);
        const entities = normalizeEntities(inputPayload || {}, {
            collectionField,
            idField,
            nameField,
            defaultName,
            signalDefinitions
        });
        const capacity = normalizeCapacity(inputPayload || {});
        const assessed = assessEntities(entities, capacity, thresholds);
        const summary = summarizeAssessments(
            assessed.assessments,
            assessed.remainingCapacity,
            readyPosture,
            thresholds,
            reliabilityPolicy
        );
        const alerts = buildAlerts(assessed.assessments, summary, capabilityId, reliabilityPolicy);
        const recommendations = buildRecommendations(
            assessed.assessments,
            alerts,
            recommendationTypes,
            reliabilityPolicy
        );

        return {
            at,
            summary,
            assessments: assessed.assessments,
            alerts,
            recommendations
        };
    }

    function toTasks(reportPayload, {
        fromAgentId = config.defaultAgentId || `agent:${capabilityId.replace(/_/g, '-')}`,
        defaultTarget = 'agent:ops',
        targetMap = {}
    } = {}) {
        if (!reportPayload || typeof reportPayload !== 'object') {
            throw new Error(`${capabilityId} toTasks requires report payload`);
        }

        const recommendations = Array.isArray(reportPayload.recommendations)
            ? reportPayload.recommendations
            : [];
        const targets = {
            ...recommendationTargetMap,
            ...(targetMap || {})
        };
        const nowMs = safeNow(Date.now);

        return recommendations.map((recommendation, index) => buildTaskRequest({
            id: randomUUID(),
            from: fromAgentId,
            target: targets[recommendation.type] || defaultTarget,
            priority: ({ P0: 'critical', P1: 'high', P2: 'normal', P3: 'low' }[recommendation.priority] || 'normal'),
            task: `[${recommendation.priority}] ${recommendation.title}`,
            context: {
                capabilityId,
                recommendationType: recommendation.type,
                entityId: recommendation.entityId || null,
                posture: reportPayload.summary?.posture || null,
                holdCount: reportPayload.summary?.laneCounts?.hold || 0,
                lane: recommendation.lane || null,
                residualGap: recommendation.residualGap ?? null,
                signalCoverage: recommendation.signalCoverage ?? null,
                defaultedSignalRate: reportPayload.summary?.defaultedSignalRate ?? null,
                lowCoverageCount: reportPayload.summary?.lowCoverageCount ?? 0
            },
            createdAt: nowMs + index
        }));
    }

    function createManagerClass({ defaultLocalAgentId = config.defaultAgentId || `agent:${capabilityId.replace(/_/g, '-')}` } = {}) {
        return class CapabilityManager {
            constructor({
                localAgentId = defaultLocalAgentId,
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
                const report = evaluate(inputPayload, {
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
                return toTasks(reportPayload, {
                    fromAgentId: this.localAgentId,
                    ...options
                });
            }

            listHistory({ limit = 20 } = {}) {
                return this.history
                    .slice(-Math.max(1, Number(limit) || 20))
                    .map((entry) => clone(entry));
            }
        };
    }

    return {
        evaluate,
        toTasks,
        createManagerClass,
        internals: {
            normalizeEntities,
            normalizeCapacity,
            scoreEntity,
            assessEntities,
            summarizeAssessments,
            buildRecommendations,
            parseSignalValue
        }
    };
}
