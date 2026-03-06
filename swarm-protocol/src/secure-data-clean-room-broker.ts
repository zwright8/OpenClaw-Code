import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    broker_clean_room_session: 'agent:data-platform',
    provision_clean_room_capacity: 'agent:infra',
    enforce_clean_room_retention_controls: 'agent:security'
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

function normalizeStringArray(value) {
    if (!Array.isArray(value)) return [];
    return [...new Set(value
        .filter((entry) => typeof entry === 'string' && entry.trim())
        .map((entry) => entry.trim().toLowerCase())
    )];
}

function normalizeRooms(inputPayload) {
    const source = Array.isArray(inputPayload?.cleanRooms)
        ? inputPayload.cleanRooms
        : [];

    return source
        .filter((entry) => entry && typeof entry === 'object')
        .map((entry, index) => ({
            roomId: typeof entry.roomId === 'string' && entry.roomId.trim()
                ? entry.roomId.trim()
                : `room-${index + 1}`,
            certLevel: clamp(safeNumber(entry.certLevel, 70)),
            supportedDataClasses: normalizeStringArray(entry.supportedDataClasses),
            availability: clamp(safeNumber(entry.availability, 75)),
            maxRetentionDays: Math.max(1, Math.floor(safeNumber(entry.maxRetentionDays, 30))),
            throughput: clamp(safeNumber(entry.throughput, 62))
        }));
}

function normalizeRequests(inputPayload) {
    const source = Array.isArray(inputPayload?.exchangeRequests)
        ? inputPayload.exchangeRequests
        : [];

    return source
        .filter((entry) => entry && typeof entry === 'object')
        .map((entry, index) => ({
            requestId: typeof entry.requestId === 'string' && entry.requestId.trim()
                ? entry.requestId.trim()
                : `exchange-${index + 1}`,
            dataClass: typeof entry.dataClass === 'string' && entry.dataClass.trim()
                ? entry.dataClass.trim().toLowerCase()
                : 'internal',
            retentionDays: Math.max(1, Math.floor(safeNumber(entry.retentionDays, 14))),
            sensitivity: clamp(safeNumber(entry.sensitivity, 58)),
            computeIntensity: clamp(safeNumber(entry.computeIntensity, 54)),
            urgency: clamp(safeNumber(entry.urgency, 50))
        }));
}

function scoreRoom(room, request) {
    const classSupport = room.supportedDataClasses.includes(request.dataClass) ? 1 : 0;
    const retentionSupport = room.maxRetentionDays >= request.retentionDays ? 1 : 0;

    const fitScore = clamp(Math.round(
        classSupport * 38
        + retentionSupport * 24
        + room.certLevel * 0.2
        + room.availability * 0.1
        + room.throughput * 0.08
    ));

    return {
        roomId: room.roomId,
        fitScore,
        certLevel: room.certLevel,
        availability: room.availability,
        maxRetentionDays: room.maxRetentionDays,
        supportsDataClass: classSupport === 1,
        supportsRetention: retentionSupport === 1
    };
}

function brokerSessions(requests, rooms) {
    return requests.map((request) => {
        const rankedRooms = rooms
            .map((room) => scoreRoom(room, request))
            .sort((a, b) => b.fitScore - a.fitScore);

        const selected = rankedRooms[0] || null;
        const blocked = !selected || !selected.supportsDataClass;

        const controlRisk = clamp(Math.round(
            (selected ? (100 - selected.certLevel) : 70) * 0.38
            + request.sensitivity * 0.36
            + (selected && selected.supportsRetention ? 0 : 18)
            + request.computeIntensity * 0.14
            + (selected ? (100 - selected.availability) * 0.12 : 16)
        ));

        return {
            requestId: request.requestId,
            dataClass: request.dataClass,
            retentionDays: request.retentionDays,
            urgency: request.urgency,
            selectedRoom: selected,
            blocked,
            controlRisk,
            needsRetentionOverride: !!(selected && !selected.supportsRetention),
            needsCapacityProvision: !!(selected && selected.availability < 45)
        };
    }).sort((a, b) => {
        if (Number(b.blocked) !== Number(a.blocked)) {
            return Number(b.blocked) - Number(a.blocked);
        }
        return b.controlRisk - a.controlRisk;
    });
}

function summarizeBrokeredSessions(rows) {
    const blockedCount = rows.filter((row) => row.blocked).length;
    const retentionOverrideCount = rows.filter((row) => row.needsRetentionOverride).length;
    const capacityProvisionCount = rows.filter((row) => row.needsCapacityProvision).length;
    const avgControlRisk = rows.length > 0
        ? Number((rows.reduce((acc, row) => acc + row.controlRisk, 0) / rows.length).toFixed(2))
        : 0;

    let posture = 'brokered';
    if (blockedCount > 0 || retentionOverrideCount > 0 || avgControlRisk >= 60) posture = 'guarded';
    if (blockedCount > 0 && avgControlRisk >= 70) posture = 'restricted';

    return {
        requestCount: rows.length,
        blockedCount,
        retentionOverrideCount,
        capacityProvisionCount,
        avgControlRisk,
        posture
    };
}

function buildAlerts(summary) {
    const alerts = [];
    if (summary.blockedCount > 0) alerts.push('clean_room_requests_blocked');
    if (summary.retentionOverrideCount > 0) alerts.push('clean_room_retention_mismatch');
    if (summary.capacityProvisionCount > 0) alerts.push('clean_room_capacity_low');
    return alerts;
}

function buildRecommendations(rows, summary) {
    const recommendations = [];

    for (const row of rows) {
        if (!row.blocked && row.selectedRoom) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'broker_clean_room_session',
                requestId: row.requestId,
                roomId: row.selectedRoom.roomId,
                title: `Broker ${row.requestId} into ${row.selectedRoom.roomId}`,
                description: `Control risk ${row.controlRisk} with fit score ${row.selectedRoom.fitScore}.`,
                priority: row.controlRisk >= 70 ? 'P1' : 'P2'
            });
        }

        if (row.needsCapacityProvision || row.blocked) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'provision_clean_room_capacity',
                requestId: row.requestId,
                roomId: row.selectedRoom?.roomId || null,
                title: `Provision clean room capacity for ${row.requestId}`,
                description: 'Capacity or support mismatch requires clean room scaling.',
                priority: row.blocked ? 'P1' : 'P2'
            });
        }

        if (row.needsRetentionOverride) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'enforce_clean_room_retention_controls',
                requestId: row.requestId,
                roomId: row.selectedRoom?.roomId || null,
                title: `Enforce retention controls for ${row.requestId}`,
                description: 'Retention policy exceeds selected room retention guarantees.',
                priority: row.controlRisk >= 70 ? 'P1' : 'P2'
            });
        }
    }

    if (summary.posture === 'restricted') {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'enforce_clean_room_retention_controls',
            title: 'Run restricted clean room control review',
            description: 'Review all blocked/high-risk exchanges before approval.',
            priority: 'P1'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations
        .sort((a, b) => {
            const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
            if (p !== 0) return p;
            return String(a.requestId || '').localeCompare(String(b.requestId || ''));
        })
        .filter((entry, index, arr) => arr.findIndex((other) => (
            other.type === entry.type
            && String(other.requestId || '') === String(entry.requestId || '')
            && String(other.roomId || '') === String(entry.roomId || '')
        )) === index);
}

export function brokerSecureDataCleanRooms(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const rooms = normalizeRooms(inputPayload || {});
    const requests = normalizeRequests(inputPayload || {});
    const sessions = brokerSessions(requests, rooms);
    const summary = summarizeBrokeredSessions(sessions);
    const alerts = buildAlerts(summary);
    const recommendations = buildRecommendations(sessions, summary);

    return {
        at,
        summary,
        sessions,
        alerts,
        recommendations
    };
}

export function cleanRoomBrokerToTasks(reportPayload, {
    fromAgentId = 'agent:clean-room-broker',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('cleanRoomBrokerToTasks requires report payload');
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
            requestId: recommendation.requestId || null,
            roomId: recommendation.roomId || null,
            posture: reportPayload.summary?.posture || null
        },
        createdAt: nowMs + index
    }));
}

export class SecureDataCleanRoomBroker {
    constructor({
        localAgentId = 'agent:clean-room-broker',
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
        const report = brokerSecureDataCleanRooms(inputPayload, {
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
        return cleanRoomBrokerToTasks(reportPayload, {
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

export const __secureDataCleanRoomBrokerInternals = {
    normalizeRooms,
    normalizeRequests,
    brokerSessions,
    summarizeBrokeredSessions,
    buildRecommendations
};
