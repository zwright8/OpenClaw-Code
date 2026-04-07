import { randomUUID } from 'crypto';
import { z } from 'zod';
import { TaskRequest } from './schemas.js';

const RiskLevel = z.enum(['low', 'medium', 'high', 'critical']);
const SkillStatus = z.enum(['active', 'degraded', 'deprecated', 'retired']);

const SkillMetadataSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    version: z.string().min(1).default('0.1.0'),
    owner: z.string().min(1).default('unknown'),
    endpointAgentId: z.string().min(1),
    capabilities: z.array(z.string().min(1)).nonempty(),
    qualityScore: z.number().min(0).max(1).default(0.7),
    costUsdPerTask: z.number().nonnegative().default(1),
    latencyMsP50: z.number().nonnegative().default(250),
    riskLevel: RiskLevel.default('medium'),
    tags: z.array(z.string().min(1)).default([]),
    status: SkillStatus.default('active'),
    createdAt: z.number().int(),
    updatedAt: z.number().int(),
    lastVerifiedAt: z.number().int().nullable().default(null),
    verification: z.object({
        attempts: z.number().int().nonnegative().default(0),
        successes: z.number().int().nonnegative().default(0),
        failures: z.number().int().nonnegative().default(0),
        consecutiveFailures: z.number().int().nonnegative().default(0),
        lastError: z.string().nullable().default(null)
    }).default({})
});

const SkillMetadataContractSchema = z.object({
    kind: z.literal('skill_metadata_contract'),
    id: z.string().uuid(),
    contractVersion: z.number().int().positive().default(1),
    createdAt: z.number().int(),
    createdBy: z.string().min(1),
    skill: z.record(z.any())
});

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function safeNow(nowFn) {
    const value = Number(nowFn());
    return Number.isFinite(value) ? value : Date.now();
}

function normalizeCapabilities(value) {
    if (!Array.isArray(value)) return [];
    return [...new Set(value
        .filter((item) => typeof item === 'string')
        .map((item) => item.trim())
        .filter(Boolean)
    )];
}

function requiredCapabilities(taskRequest) {
    return normalizeCapabilities(taskRequest?.context?.requiredCapabilities);
}

function riskPenalty(riskLevel, priority) {
    const riskWeights = {
        low: 0,
        medium: 4,
        high: 9,
        critical: 14
    };
    const base = riskWeights[riskLevel] || 0;

    if (priority === 'critical') return base * 1.4;
    if (priority === 'high') return base * 1.2;
    if (priority === 'low') return base * 0.75;
    return base;
}

function scoreSkill(taskRequest, skill, options = {}) {
    const reqCaps = requiredCapabilities(taskRequest);
    const skillCaps = normalizeCapabilities(skill.capabilities);
    const missing = reqCaps.filter((capability) => !skillCaps.includes(capability));

    if (skill.status === 'retired') {
        return {
            eligible: false,
            score: -Infinity,
            reason: 'retired',
            missingCapabilities: missing
        };
    }

    if (missing.length > 0) {
        return {
            eligible: false,
            score: -Infinity,
            reason: 'missing_capabilities',
            missingCapabilities: missing
        };
    }

    let score = 100;
    const reasons = [];

    const qualityDelta = (Number(skill.qualityScore) - 0.6) * 70;
    score += qualityDelta;
    reasons.push({ type: 'quality', delta: Number(qualityDelta.toFixed(4)) });

    const costWeight = Number.isFinite(options.costWeight) ? options.costWeight : 1;
    const latencyWeight = Number.isFinite(options.latencyWeight) ? options.latencyWeight : 1;

    const costDelta = -Number(skill.costUsdPerTask) * 7 * costWeight;
    score += costDelta;
    reasons.push({ type: 'cost', delta: Number(costDelta.toFixed(4)) });

    const latencyDelta = -(Number(skill.latencyMsP50) / 100) * 5 * latencyWeight;
    score += latencyDelta;
    reasons.push({ type: 'latency', delta: Number(latencyDelta.toFixed(4)) });

    const verification = skill.verification || {};
    const attempts = Number(verification.attempts) || 0;
    if (attempts > 0) {
        const successRate = (Number(verification.successes) || 0) / attempts;
        const verifyDelta = (successRate - 0.75) * 50;
        score += verifyDelta;
        reasons.push({ type: 'verification_success_rate', delta: Number(verifyDelta.toFixed(4)) });
    } else {
        score -= 2;
        reasons.push({ type: 'unknown_verification_penalty', delta: -2 });
    }

    if (skill.status === 'degraded') {
        score -= 12;
        reasons.push({ type: 'degraded_penalty', delta: -12 });
    }

    const priority = taskRequest.priority || 'normal';
    const riskDelta = -riskPenalty(skill.riskLevel, priority);
    score += riskDelta;
    reasons.push({ type: 'risk', delta: Number(riskDelta.toFixed(4)) });

    if (priority === 'critical') {
        const confidenceBoost = Number(skill.qualityScore) * 8;
        score += confidenceBoost;
        reasons.push({ type: 'critical_priority_quality_boost', delta: Number(confidenceBoost.toFixed(4)) });
    }

    const capabilityBonus = reqCaps.length * 10;
    score += capabilityBonus;
    reasons.push({ type: 'capability_match_bonus', delta: Number(capabilityBonus.toFixed(4)) });

    return {
        eligible: true,
        score: Number(score.toFixed(4)),
        reason: 'ok',
        missingCapabilities: [],
        reasons
    };
}

export function validateSkillMetadata(skillPayload) {
    const now = Date.now();
    return SkillMetadataSchema.parse({
        createdAt: now,
        updatedAt: now,
        ...skillPayload,
        capabilities: normalizeCapabilities(skillPayload?.capabilities),
        tags: normalizeCapabilities(skillPayload?.tags)
    });
}

export function buildSkillMetadataContract({
    createdBy,
    skill,
    id = randomUUID(),
    contractVersion = 1,
    createdAt = Date.now()
}) {
    return SkillMetadataContractSchema.parse({
        kind: 'skill_metadata_contract',
        id,
        contractVersion,
        createdAt,
        createdBy,
        skill
    });
}

export function parseSkillMetadataContract(contractPayload) {
    const parsed = SkillMetadataContractSchema.parse(contractPayload);
    if (parsed.contractVersion !== 1) {
        throw new Error(`Unsupported skill metadata contract version: ${parsed.contractVersion}`);
    }

    return {
        ...parsed,
        skill: validateSkillMetadata({
            ...parsed.skill,
            updatedAt: parsed.createdAt,
            createdAt: parsed.skill?.createdAt ?? parsed.createdAt
        })
    };
}

export class CapabilityMarketplace {
    constructor({
        now = Date.now,
        logger = console
    } = {}) {
        this.now = typeof now === 'function' ? now : Date.now;
        this.logger = logger;
        this.skills = new Map();
    }

    registerSkill(skillPayload) {
        const incoming = validateSkillMetadata({
            ...skillPayload,
            updatedAt: safeNow(this.now),
            createdAt: Number.isFinite(Number(skillPayload?.createdAt))
                ? Number(skillPayload.createdAt)
                : safeNow(this.now)
        });

        const previous = this.skills.get(incoming.id);
        const merged = previous
            ? {
                ...previous,
                ...incoming,
                verification: {
                    ...(previous.verification || {}),
                    ...(incoming.verification || {})
                },
                updatedAt: safeNow(this.now)
            }
            : incoming;

        const validated = validateSkillMetadata(merged);
        this.skills.set(validated.id, validated);
        return clone(validated);
    }

    registerSkillContract(contractPayload) {
        const contract = parseSkillMetadataContract(contractPayload);
        const skill = this.registerSkill(contract.skill);
        return {
            contract,
            skill
        };
    }

    getSkill(skillId) {
        const skill = this.skills.get(skillId);
        return skill ? clone(skill) : null;
    }

    listSkills({
        status = null,
        capability = null
    } = {}) {
        const output = [];
        for (const skill of this.skills.values()) {
            if (status && skill.status !== status) continue;
            if (capability && !skill.capabilities.includes(capability)) continue;
            output.push(clone(skill));
        }
        return output.sort((a, b) => b.qualityScore - a.qualityScore || a.id.localeCompare(b.id));
    }

    async probeSkill(skillId, probeFn, {
        timeoutMs = 2_000
    } = {}) {
        const skill = this.skills.get(skillId);
        if (!skill) {
            throw new Error(`Unknown skill: ${skillId}`);
        }

        if (typeof probeFn !== 'function') {
            throw new Error('probeFn is required');
        }

        const startedAt = safeNow(this.now);
        const timeout = Number.isFinite(timeoutMs) && timeoutMs > 0 ? Number(timeoutMs) : 2_000;

        let probeResult;
        try {
            probeResult = await Promise.race([
                Promise.resolve().then(() => probeFn(clone(skill))),
                new Promise((_, reject) => {
                    setTimeout(() => reject(new Error(`Probe timed out after ${timeout}ms`)), timeout);
                })
            ]);
        } catch (error) {
            probeResult = {
                ok: false,
                error: error.message
            };
        }

        const completedAt = safeNow(this.now);
        const ok = probeResult?.ok === true;
        const verification = {
            ...(skill.verification || {}),
            attempts: (skill.verification?.attempts || 0) + 1,
            successes: (skill.verification?.successes || 0) + (ok ? 1 : 0),
            failures: (skill.verification?.failures || 0) + (ok ? 0 : 1),
            consecutiveFailures: ok
                ? 0
                : (skill.verification?.consecutiveFailures || 0) + 1,
            lastError: ok
                ? null
                : (probeResult?.error || 'probe_failed')
        };

        skill.verification = verification;
        skill.lastVerifiedAt = completedAt;
        skill.updatedAt = completedAt;

        if (skill.status !== 'retired') {
            skill.status = ok ? 'active' : 'degraded';
        }

        this.skills.set(skill.id, validateSkillMetadata(skill));

        return {
            skillId: skill.id,
            ok,
            startedAt,
            completedAt,
            durationMs: Math.max(0, completedAt - startedAt),
            verification: clone(verification),
            result: probeResult
        };
    }

    evaluateRetirements({
        maxConsecutiveFailures = 3,
        maxFailureRate = 0.6,
        minAttemptsForFailureRate = 5,
        staleAfterMs = 7 * 24 * 60 * 60 * 1000
    } = {}) {
        const now = safeNow(this.now);
        const retired = [];

        for (const skill of this.skills.values()) {
            if (skill.status === 'retired') continue;

            const attempts = Number(skill.verification?.attempts) || 0;
            const failures = Number(skill.verification?.failures) || 0;
            const consecutiveFailures = Number(skill.verification?.consecutiveFailures) || 0;
            const lastVerifiedAt = Number(skill.lastVerifiedAt);
            const failureRate = attempts > 0 ? failures / attempts : 0;

            let reason = null;
            if (consecutiveFailures >= maxConsecutiveFailures) {
                reason = 'consecutive_probe_failures';
            } else if (
                attempts >= minAttemptsForFailureRate
                && failureRate >= maxFailureRate
            ) {
                reason = 'failure_rate_exceeded';
            } else if (
                Number.isFinite(lastVerifiedAt)
                && staleAfterMs > 0
                && now - lastVerifiedAt > staleAfterMs
            ) {
                reason = 'stale_verification';
            }

            if (!reason) continue;

            skill.status = 'retired';
            skill.updatedAt = now;
            skill.retirementReason = reason;
            this.skills.set(skill.id, validateSkillMetadata(skill));

            retired.push({
                skillId: skill.id,
                reason
            });
        }

        return {
            retired
        };
    }

    selectSkillForTask(taskRequestPayload, options = {}) {
        const taskRequest = TaskRequest.parse(taskRequestPayload);
        const ranked = [];

        for (const skill of this.skills.values()) {
            const evaluation = scoreSkill(taskRequest, skill, options);
            ranked.push({
                skillId: skill.id,
                endpointAgentId: skill.endpointAgentId,
                status: skill.status,
                capabilities: [...skill.capabilities],
                riskLevel: skill.riskLevel,
                score: evaluation.score,
                eligible: evaluation.eligible,
                reason: evaluation.reason,
                missingCapabilities: evaluation.missingCapabilities,
                reasons: evaluation.reasons || []
            });
        }

        ranked.sort((a, b) => b.score - a.score);
        const selected = ranked.find((item) => item.eligible);

        return {
            selectedSkillId: selected?.skillId || null,
            selectedAgentId: selected?.endpointAgentId || null,
            ranked
        };
    }

    createRouteTaskFn(options = {}) {
        return async (taskRequest) => {
            const selection = this.selectSkillForTask(taskRequest, options);
            return {
                selectedAgentId: selection.selectedAgentId,
                skillId: selection.selectedSkillId,
                ranked: selection.ranked
            };
        };
    }
}

export const __marketplaceInternals = {
    SkillMetadataSchema,
    SkillMetadataContractSchema,
    normalizeCapabilities,
    scoreSkill
};
