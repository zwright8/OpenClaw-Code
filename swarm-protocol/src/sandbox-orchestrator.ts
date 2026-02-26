import { createHash, randomUUID } from 'crypto';
import { z } from 'zod';
import { TaskRequest } from './schemas.js';

const SandboxIsolation = z.enum(['strict', 'balanced', 'permissive']);

const SandboxProfileSchema = z.object({
    id: z.string().min(1),
    description: z.string().default(''),
    isolation: SandboxIsolation.default('balanced'),
    allowNetwork: z.boolean().default(false),
    allowFilesystemWrite: z.boolean().default(false),
    allowShell: z.boolean().default(false),
    allowedCapabilities: z.array(z.string()).default([]),
    blockedRiskTags: z.array(z.string()).default([]),
    requiresEscalation: z.boolean().default(false),
    maxRuntimeMs: z.number().int().positive().default(30_000)
});

const PrivilegedCapabilitySet = new Set([
    'destructive_shell',
    'credential_access',
    'filesystem_write',
    'production_deploy'
]);

const HighRiskTagSet = new Set([
    'security',
    'legal',
    'financial',
    'production'
]);

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function safeNow(nowFn) {
    const value = Number(nowFn());
    return Number.isFinite(value) ? value : Date.now();
}

function normalizeStringList(value) {
    if (!Array.isArray(value)) return [];
    return [...new Set(value
        .filter((item) => typeof item === 'string')
        .map((item) => item.trim())
        .filter(Boolean)
    )];
}

function canonicalize(value) {
    if (Array.isArray(value)) {
        return `[${value.map((item) => canonicalize(item)).join(',')}]`;
    }

    if (value && typeof value === 'object') {
        const keys = Object.keys(value).sort();
        return `{${keys.map((key) => `${JSON.stringify(key)}:${canonicalize(value[key])}`).join(',')}}`;
    }

    return JSON.stringify(value);
}

function hash(value) {
    return createHash('sha256').update(String(value)).digest('hex');
}

function profileFingerprint(profile) {
    return hash(canonicalize(profile));
}

function defaultProfiles() {
    return [
        {
            id: 'strict-readonly',
            description: 'Read-only profile for uncertain/high-risk tasks',
            isolation: 'strict',
            allowNetwork: false,
            allowFilesystemWrite: false,
            allowShell: false,
            allowedCapabilities: ['analysis', 'read', 'reasoning'],
            blockedRiskTags: ['security', 'production'],
            requiresEscalation: false,
            maxRuntimeMs: 10_000
        },
        {
            id: 'balanced-tooling',
            description: 'Balanced profile for standard tool usage',
            isolation: 'balanced',
            allowNetwork: true,
            allowFilesystemWrite: false,
            allowShell: false,
            allowedCapabilities: ['analysis', 'web-search', 'reporting', 'read'],
            blockedRiskTags: [],
            requiresEscalation: false,
            maxRuntimeMs: 30_000
        },
        {
            id: 'privileged-controlled',
            description: 'Privileged profile gated by human escalation',
            isolation: 'permissive',
            allowNetwork: true,
            allowFilesystemWrite: true,
            allowShell: true,
            allowedCapabilities: ['operations', 'deploy', 'filesystem_write', 'destructive_shell', 'credential_access'],
            blockedRiskTags: [],
            requiresEscalation: true,
            maxRuntimeMs: 120_000
        }
    ];
}

export class SandboxOrchestratorError extends Error {
    constructor(code, message, details = {}) {
        super(message);
        this.name = 'SandboxOrchestratorError';
        this.code = code;
        this.details = details;
    }
}

export function validateSandboxProfile(profilePayload) {
    return SandboxProfileSchema.parse({
        ...profilePayload,
        allowedCapabilities: normalizeStringList(profilePayload?.allowedCapabilities),
        blockedRiskTags: normalizeStringList(profilePayload?.blockedRiskTags)
    });
}

export function verifyReplayEvents(events) {
    const rows = Array.isArray(events) ? events : [];
    let previousHash = null;

    for (const row of rows) {
        if (!row || typeof row !== 'object') {
            return {
                ok: false,
                reason: 'invalid_event'
            };
        }

        if (row.previousHash !== previousHash) {
            return {
                ok: false,
                reason: 'previous_hash_mismatch'
            };
        }

        const payload = {
            seq: row.seq,
            at: row.at,
            type: row.type,
            data: row.data,
            previousHash: row.previousHash
        };
        const expectedHash = hash(canonicalize(payload));
        if (expectedHash !== row.eventHash) {
            return {
                ok: false,
                reason: 'event_hash_mismatch'
            };
        }

        previousHash = row.eventHash;
    }

    return {
        ok: true,
        count: rows.length,
        finalHash: previousHash
    };
}

export class SandboxOrchestrator {
    constructor({
        executor = null,
        now = Date.now,
        logger = console,
        profiles = [],
        defaultProfileId = 'balanced-tooling'
    } = {}) {
        this.now = typeof now === 'function' ? now : Date.now;
        this.logger = logger;
        this.executor = executor && typeof executor.run === 'function'
            ? executor
            : {
                async run() {
                    return {
                        status: 'success',
                        output: 'noop',
                        artifacts: [],
                        metrics: {}
                    };
                }
            };

        this.profiles = new Map();
        this.defaultProfileId = defaultProfileId;
        this.escalations = new Map();
        this.executions = new Map();

        for (const profile of defaultProfiles()) {
            this.registerProfile(profile);
        }
        for (const profile of profiles) {
            this.registerProfile(profile);
        }

        if (!this.profiles.has(this.defaultProfileId)) {
            this.defaultProfileId = 'balanced-tooling';
        }
    }

    registerProfile(profilePayload) {
        const profile = validateSandboxProfile(profilePayload);
        this.profiles.set(profile.id, profile);
        return clone(profile);
    }

    listProfiles() {
        return [...this.profiles.values()].map((profile) => clone(profile));
    }

    _extractRisk(taskRequest) {
        const requiredCaps = normalizeStringList(taskRequest?.context?.requiredCapabilities);
        const riskTags = normalizeStringList(taskRequest?.context?.riskTags).map((tag) => tag.toLowerCase());
        const privilegedCapability = requiredCaps.find((capability) => PrivilegedCapabilitySet.has(capability));
        const highRiskTag = riskTags.find((tag) => HighRiskTagSet.has(tag));

        return {
            requiredCaps,
            riskTags,
            privilegedCapability,
            highRiskTag
        };
    }

    selectProfile(taskRequestPayload, { profileId = null } = {}) {
        const taskRequest = TaskRequest.parse(taskRequestPayload);

        if (profileId) {
            const explicit = this.profiles.get(profileId);
            if (!explicit) {
                throw new SandboxOrchestratorError(
                    'UNKNOWN_PROFILE',
                    `Unknown sandbox profile: ${profileId}`,
                    { profileId }
                );
            }

            return {
                profile: clone(explicit),
                reason: 'explicit_profile',
                taskRequest
            };
        }

        const risk = this._extractRisk(taskRequest);
        const wantsNetwork = taskRequest.context?.needsNetwork === true
            || risk.requiredCaps.includes('web-search');

        let selectedProfile = this.profiles.get(this.defaultProfileId);
        let reason = 'default_profile';

        if (risk.privilegedCapability || taskRequest.context?.requiresPrivilegedAccess === true) {
            selectedProfile = this.profiles.get('privileged-controlled') || selectedProfile;
            reason = 'privileged_capability';
        } else if (risk.highRiskTag || taskRequest.priority === 'critical') {
            selectedProfile = this.profiles.get('strict-readonly') || selectedProfile;
            reason = 'high_risk_guardrail';
        } else if (wantsNetwork) {
            selectedProfile = this.profiles.get('balanced-tooling') || selectedProfile;
            reason = 'network_tooling';
        }

        if (!selectedProfile) {
            throw new SandboxOrchestratorError(
                'MISSING_PROFILE',
                'No sandbox profile available'
            );
        }

        return {
            profile: clone(selectedProfile),
            reason,
            taskRequest
        };
    }

    planExecution(taskRequestPayload, options = {}) {
        const selected = this.selectProfile(taskRequestPayload, options);
        const taskRequest = selected.taskRequest;
        const profile = selected.profile;
        const risk = this._extractRisk(taskRequest);

        const blockedTag = risk.riskTags.find((tag) => profile.blockedRiskTags.includes(tag));
        if (blockedTag) {
            throw new SandboxOrchestratorError(
                'PROFILE_BLOCKED_RISK_TAG',
                `Profile ${profile.id} blocks risk tag ${blockedTag}`,
                {
                    profileId: profile.id,
                    riskTag: blockedTag,
                    taskId: taskRequest.id
                }
            );
        }

        const escalationRequired = profile.requiresEscalation
            || Boolean(risk.privilegedCapability)
            || taskRequest.context?.requiresPrivilegedAccess === true;

        const planBase = {
            taskId: taskRequest.id,
            target: taskRequest.target || null,
            priority: taskRequest.priority,
            selectedReason: selected.reason,
            profileId: profile.id,
            profileFingerprint: profileFingerprint(profile),
            requiredCapabilities: risk.requiredCaps,
            riskTags: risk.riskTags,
            escalationRequired,
            maxRuntimeMs: profile.maxRuntimeMs
        };

        const planFingerprint = hash(canonicalize(planBase));

        return {
            ...planBase,
            planFingerprint,
            profile: clone(profile)
        };
    }

    requestEscalation(taskRequestPayload, {
        profileId = null,
        reason = 'privileged_access'
    } = {}) {
        const plan = this.planExecution(taskRequestPayload, { profileId });
        if (!plan.escalationRequired) {
            return {
                requested: false,
                reason: 'not_required',
                plan
            };
        }

        const requestToken = hash(`escalation|${plan.planFingerprint}`);
        const at = safeNow(this.now);

        const record = {
            token: requestToken,
            status: 'pending',
            reason,
            requestedAt: at,
            reviewedAt: null,
            reviewer: null,
            reviewReason: null,
            plan
        };

        this.escalations.set(requestToken, record);
        return {
            requested: true,
            escalation: clone(record)
        };
    }

    reviewEscalation(token, {
        approved,
        reviewer,
        reason = null,
        reviewedAt = safeNow(this.now)
    } = {}) {
        const record = this.escalations.get(token);
        if (!record) {
            throw new SandboxOrchestratorError(
                'UNKNOWN_ESCALATION',
                `Unknown escalation token: ${token}`
            );
        }

        record.status = approved === true ? 'approved' : 'denied';
        record.reviewedAt = reviewedAt;
        record.reviewer = reviewer || null;
        record.reviewReason = reason;

        this.escalations.set(token, record);
        return clone(record);
    }

    _makeEvent(seq, at, type, data, previousHash) {
        const payload = {
            seq,
            at,
            type,
            data,
            previousHash
        };

        return {
            ...payload,
            eventHash: hash(canonicalize(payload))
        };
    }

    async executeTask(taskRequestPayload, {
        profileId = null,
        escalationToken = null,
        metadata = {}
    } = {}) {
        const plan = this.planExecution(taskRequestPayload, { profileId });

        if (plan.escalationRequired) {
            if (!escalationToken || !this.escalations.has(escalationToken)) {
                throw new SandboxOrchestratorError(
                    'ESCALATION_REQUIRED',
                    `Task ${plan.taskId} requires approved escalation`,
                    {
                        taskId: plan.taskId,
                        planFingerprint: plan.planFingerprint
                    }
                );
            }

            const escalation = this.escalations.get(escalationToken);
            if (escalation.status !== 'approved') {
                throw new SandboxOrchestratorError(
                    'ESCALATION_NOT_APPROVED',
                    `Escalation ${escalationToken} is not approved`,
                    {
                        taskId: plan.taskId,
                        escalationStatus: escalation.status
                    }
                );
            }

            if (escalation.plan.planFingerprint !== plan.planFingerprint) {
                throw new SandboxOrchestratorError(
                    'ESCALATION_PLAN_MISMATCH',
                    'Escalation does not match current execution plan',
                    {
                        taskId: plan.taskId,
                        expected: escalation.plan.planFingerprint,
                        actual: plan.planFingerprint
                    }
                );
            }
        }

        const startedAt = safeNow(this.now);
        const events = [];
        let previousHash = null;

        const pushEvent = (type, data, at = safeNow(this.now)) => {
            const event = this._makeEvent(events.length + 1, at, type, data, previousHash);
            events.push(event);
            previousHash = event.eventHash;
        };

        pushEvent('plan_created', {
            taskId: plan.taskId,
            profileId: plan.profileId,
            planFingerprint: plan.planFingerprint,
            escalationRequired: plan.escalationRequired
        }, startedAt);

        pushEvent('execution_started', {
            metadata
        }, startedAt);

        let outcome;
        let status = 'success';
        try {
            outcome = await this.executor.run({
                taskRequest: clone(taskRequestPayload),
                plan: clone(plan),
                metadata: clone(metadata)
            });
        } catch (error) {
            status = 'failure';
            outcome = {
                status: 'failure',
                output: error.message,
                artifacts: [],
                metrics: {}
            };
        }

        const completedAt = safeNow(this.now);
        pushEvent('execution_completed', {
            status,
            outcome
        }, completedAt);

        const replayToken = hash(`replay|${plan.planFingerprint}|${previousHash}`);
        const record = {
            replayToken,
            taskId: plan.taskId,
            profileId: plan.profileId,
            plan,
            status,
            startedAt,
            completedAt,
            events,
            finalEventHash: previousHash,
            outcome
        };

        this.executions.set(replayToken, record);

        return {
            replayToken,
            status,
            profileId: plan.profileId,
            escalationUsed: Boolean(escalationToken),
            outcome: clone(outcome),
            events: clone(events)
        };
    }

    getExecution(replayToken) {
        const record = this.executions.get(replayToken);
        return record ? clone(record) : null;
    }

    getReplayPacket(replayToken) {
        const record = this.getExecution(replayToken);
        if (!record) return null;

        return {
            replayToken: record.replayToken,
            taskId: record.taskId,
            profileId: record.profileId,
            planFingerprint: record.plan.planFingerprint,
            events: record.events,
            outcome: record.outcome,
            verification: verifyReplayEvents(record.events)
        };
    }

    listEscalations({ status = null } = {}) {
        const output = [];
        for (const record of this.escalations.values()) {
            if (status && record.status !== status) continue;
            output.push(clone(record));
        }
        return output.sort((a, b) => b.requestedAt - a.requestedAt);
    }
}

export const __sandboxInternals = {
    SandboxProfileSchema,
    profileFingerprint
};
