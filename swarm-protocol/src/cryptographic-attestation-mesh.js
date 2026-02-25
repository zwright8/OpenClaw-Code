import { createHash, randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    reattest_artifact: 'agent:security',
    rotate_attestation_key: 'agent:platform',
    quarantine_unverified_artifact: 'agent:ops'
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

function normalizeArtifacts(inputPayload) {
    const source = Array.isArray(inputPayload?.artifacts)
        ? inputPayload.artifacts
        : [];

    return source
        .filter((entry) => entry && typeof entry === 'object')
        .map((entry, index) => ({
            artifactId: typeof entry.artifactId === 'string' && entry.artifactId.trim()
                ? entry.artifactId.trim()
                : `artifact-${index + 1}`,
            producer: typeof entry.producer === 'string' && entry.producer.trim()
                ? entry.producer.trim()
                : 'producer:unknown',
            payload: typeof entry.payload === 'string'
                ? entry.payload
                : JSON.stringify(entry.payload || {}),
            providedHash: typeof entry.hash === 'string' && entry.hash.trim()
                ? entry.hash.trim()
                : null,
            signaturePresent: Boolean(entry.signaturePresent),
            lineage: Array.isArray(entry.lineage)
                ? entry.lineage.filter((parentId) => typeof parentId === 'string' && parentId.trim()).map((parentId) => parentId.trim())
                : []
        }));
}

function normalizeTrustAnchors(inputPayload) {
    const source = Array.isArray(inputPayload?.trustAnchors)
        ? inputPayload.trustAnchors
        : [];

    return source
        .filter((entry) => entry && typeof entry === 'object')
        .map((entry, index) => ({
            producer: typeof entry.producer === 'string' && entry.producer.trim()
                ? entry.producer.trim()
                : `producer-${index + 1}`,
            keyStatus: typeof entry.keyStatus === 'string' && entry.keyStatus.trim()
                ? entry.keyStatus.trim().toLowerCase()
                : 'active',
            trustScore: clamp(safeNumber(entry.trustScore, 72))
        }));
}

function computedHash(payload) {
    return createHash('sha256').update(String(payload)).digest('hex');
}

function verifyArtifacts(artifacts, trustAnchors) {
    const anchorByProducer = new Map(trustAnchors.map((anchor) => [anchor.producer, anchor]));
    const artifactIds = new Set(artifacts.map((artifact) => artifact.artifactId));

    return artifacts.map((artifact) => {
        const hash = computedHash(artifact.payload);
        const hashMatch = artifact.providedHash ? artifact.providedHash === hash : false;
        const anchor = anchorByProducer.get(artifact.producer) || null;
        const lineageComplete = artifact.lineage.every((parentId) => artifactIds.has(parentId));

        const attestationScore = clamp(Math.round(
            (artifact.signaturePresent ? 28 : 0)
            + (hashMatch ? 28 : 0)
            + (lineageComplete ? 16 : 0)
            + (anchor ? anchor.trustScore * 0.28 : 8)
            + (anchor && anchor.keyStatus === 'active' ? 10 : 0)
        ));

        const status = attestationScore >= 75
            ? 'verified'
            : attestationScore >= 55
                ? 'degraded'
                : 'failed';

        return {
            artifactId: artifact.artifactId,
            producer: artifact.producer,
            signaturePresent: artifact.signaturePresent,
            hashMatch,
            lineageComplete,
            anchorStatus: anchor?.keyStatus || 'missing',
            anchorTrustScore: anchor?.trustScore || 0,
            attestationScore,
            status,
            needsReattestation: status !== 'verified',
            quarantineRecommended: status === 'failed' || !artifact.signaturePresent
        };
    }).sort((a, b) => a.attestationScore - b.attestationScore);
}

function summarizeMesh(rows) {
    const statusCounts = rows.reduce((acc, row) => {
        acc[row.status] = (acc[row.status] || 0) + 1;
        return acc;
    }, {
        verified: 0,
        degraded: 0,
        failed: 0
    });

    const quarantineCount = rows.filter((row) => row.quarantineRecommended).length;
    const avgAttestationScore = rows.length > 0
        ? Number((rows.reduce((acc, row) => acc + row.attestationScore, 0) / rows.length).toFixed(2))
        : 0;

    let posture = 'trusted';
    if (statusCounts.degraded > 0 || avgAttestationScore < 72) posture = 'watch';
    if (statusCounts.failed > 0 || quarantineCount > 0 || avgAttestationScore < 55) posture = 'critical';

    return {
        artifactCount: rows.length,
        statusCounts,
        quarantineCount,
        avgAttestationScore,
        posture
    };
}

function buildAlerts(summary) {
    const alerts = [];
    if (summary.statusCounts.failed > 0) alerts.push('attestation_failures_present');
    if (summary.quarantineCount > 0) alerts.push('artifact_quarantine_required');
    if (summary.avgAttestationScore < 60) alerts.push('attestation_score_low');
    return alerts;
}

function buildRecommendations(rows, summary) {
    const recommendations = [];

    for (const row of rows) {
        if (row.needsReattestation) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'reattest_artifact',
                artifactId: row.artifactId,
                title: `Reattest ${row.artifactId}`,
                description: `Attestation score ${row.attestationScore} with status ${row.status}.`,
                priority: row.status === 'failed' ? 'P1' : 'P2'
            });
        }

        if (row.anchorStatus !== 'active') {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'rotate_attestation_key',
                artifactId: row.artifactId,
                title: `Rotate key for ${row.producer}`,
                description: `Producer anchor status is ${row.anchorStatus}.`,
                priority: row.status === 'failed' ? 'P1' : 'P2'
            });
        }

        if (row.quarantineRecommended) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'quarantine_unverified_artifact',
                artifactId: row.artifactId,
                title: `Quarantine ${row.artifactId}`,
                description: 'Artifact failed attestation or lacks required cryptographic proof.',
                priority: 'P1'
            });
        }
    }

    if (summary.posture === 'critical' && !recommendations.some((entry) => entry.type === 'quarantine_unverified_artifact')) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'quarantine_unverified_artifact',
            title: 'Quarantine unverified attestation batch',
            description: 'Attestation mesh posture is critical pending remediation.',
            priority: 'P1'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations
        .sort((a, b) => {
            const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
            if (p !== 0) return p;
            return String(a.artifactId || '').localeCompare(String(b.artifactId || ''));
        })
        .filter((entry, index, arr) => arr.findIndex((other) => (
            other.type === entry.type && String(other.artifactId || '') === String(entry.artifactId || '')
        )) === index);
}

export function buildCryptographicAttestationMesh(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const artifacts = normalizeArtifacts(inputPayload || {});
    const trustAnchors = normalizeTrustAnchors(inputPayload || {});
    const attestations = verifyArtifacts(artifacts, trustAnchors);
    const summary = summarizeMesh(attestations);
    const alerts = buildAlerts(summary);
    const recommendations = buildRecommendations(attestations, summary);

    return {
        at,
        summary,
        attestations,
        alerts,
        recommendations
    };
}

export function attestationMeshToTasks(reportPayload, {
    fromAgentId = 'agent:attestation-mesh',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('attestationMeshToTasks requires report payload');
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
            artifactId: recommendation.artifactId || null,
            posture: reportPayload.summary?.posture || null
        },
        createdAt: nowMs + index
    }));
}

export class CryptographicAttestationMesh {
    constructor({
        localAgentId = 'agent:attestation-mesh',
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
        const report = buildCryptographicAttestationMesh(inputPayload, {
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
        return attestationMeshToTasks(reportPayload, {
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

export const __cryptographicAttestationMeshInternals = {
    normalizeArtifacts,
    normalizeTrustAnchors,
    verifyArtifacts,
    summarizeMesh,
    buildRecommendations
};
