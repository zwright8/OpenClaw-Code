import { randomUUID } from 'crypto';
import { z } from 'zod';
import { AgentId, Timestamp } from './schemas.js';

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

const ContractType = z.enum(['report', 'decision', 'handoff']);
const ContractVersion = z.number().int().positive();

const MemoryContractEnvelopeSchema = z.object({
    kind: z.literal('memory_contract'),
    id: z.string().uuid(),
    contractType: ContractType,
    contractVersion: ContractVersion,
    createdAt: Timestamp,
    createdBy: AgentId,
    payload: z.record(z.any()),
    metadata: z.record(z.any()).default({})
});

const FindingSeverity = z.enum(['low', 'medium', 'high', 'critical']);

const ReportFindingSchemaV1 = z.object({
    id: z.string().min(1),
    severity: FindingSeverity.default('medium'),
    statement: z.string().min(1),
    recommendation: z.string().optional()
});

const ReportContractPayloadV1 = z.object({
    title: z.string().min(1),
    summary: z.string().min(1),
    findings: z.array(ReportFindingSchemaV1).default([]),
    references: z.array(z.object({
        label: z.string().min(1),
        path: z.string().min(1)
    })).default([])
});

const ReportContractPayloadV2 = z.object({
    title: z.string().min(1),
    summary: z.string().min(1),
    audience: z.enum(['agent', 'human', 'mixed']).default('mixed'),
    findings: z.array(ReportFindingSchemaV1).default([]),
    actions: z.array(z.string().min(1)).default([]),
    references: z.array(z.object({
        label: z.string().min(1),
        path: z.string().min(1)
    })).default([])
});

const DecisionContractPayloadV1 = z.object({
    topic: z.string().min(1),
    decision: z.string().min(1),
    rationale: z.string().min(1),
    approvers: z.array(AgentId).default([]),
    confidence: z.number().min(0).max(1).optional(),
    decidedAt: Timestamp.optional()
});

const HandoffArtifactSchema = z.object({
    name: z.string().min(1),
    path: z.string().min(1),
    type: z.string().optional()
});

const HandoffContractPayloadV1 = z.object({
    from: AgentId,
    to: AgentId,
    objective: z.string().min(1),
    context: z.string().optional(),
    openQuestions: z.array(z.string().min(1)).default([]),
    artifacts: z.array(HandoffArtifactSchema).default([])
});

function migrateReportV1ToV2(payload) {
    const v1 = ReportContractPayloadV1.parse(payload);
    const seen = new Set();
    const actions = [];

    for (const finding of v1.findings) {
        const recommendation = typeof finding.recommendation === 'string'
            ? finding.recommendation.trim()
            : '';
        if (!recommendation || seen.has(recommendation)) continue;
        seen.add(recommendation);
        actions.push(recommendation);
    }

    return ReportContractPayloadV2.parse({
        ...v1,
        audience: 'mixed',
        actions
    });
}

const CONTRACT_REGISTRY = {
    report: {
        latestVersion: 2,
        versions: {
            1: {
                schema: ReportContractPayloadV1,
                migrateToNext: migrateReportV1ToV2
            },
            2: {
                schema: ReportContractPayloadV2
            }
        }
    },
    decision: {
        latestVersion: 1,
        versions: {
            1: {
                schema: DecisionContractPayloadV1
            }
        }
    },
    handoff: {
        latestVersion: 1,
        versions: {
            1: {
                schema: HandoffContractPayloadV1
            }
        }
    }
};

function getContractDefinition(contractType) {
    const definition = CONTRACT_REGISTRY[contractType];
    if (!definition) {
        throw new MemoryContractError(
            'UNKNOWN_CONTRACT_TYPE',
            `Unknown contract type: ${contractType}`,
            { contractType }
        );
    }
    return definition;
}

function getVersionDefinition(contractType, contractVersion) {
    const definition = getContractDefinition(contractType);
    const versionDefinition = definition.versions[contractVersion];
    if (!versionDefinition) {
        throw new MemoryContractError(
            'UNSUPPORTED_CONTRACT_VERSION',
            `Unsupported contract version ${contractVersion} for type ${contractType}`,
            { contractType, contractVersion }
        );
    }
    return versionDefinition;
}

function runValidationHook(onValidate, phase, contract) {
    if (typeof onValidate !== 'function') return;
    onValidate({
        phase,
        contractType: contract.contractType,
        contractVersion: contract.contractVersion,
        contractId: contract.id,
        contract: clone(contract)
    });
}

export class MemoryContractError extends Error {
    constructor(code, message, details = {}) {
        super(message);
        this.name = 'MemoryContractError';
        this.code = code;
        this.details = details;
    }
}

export function listContractTypes() {
    return Object.keys(CONTRACT_REGISTRY);
}

export function getLatestContractVersion(contractType) {
    return getContractDefinition(contractType).latestVersion;
}

export function validateMemoryContract(contract) {
    const envelope = MemoryContractEnvelopeSchema.parse(contract);

    let payload;
    try {
        const versionDefinition = getVersionDefinition(
            envelope.contractType,
            envelope.contractVersion
        );
        payload = versionDefinition.schema.parse(envelope.payload);
    } catch (error) {
        if (error instanceof MemoryContractError) throw error;
        throw new MemoryContractError(
            'INVALID_CONTRACT_PAYLOAD',
            `Invalid payload for ${envelope.contractType}@v${envelope.contractVersion}`,
            {
                contractType: envelope.contractType,
                contractVersion: envelope.contractVersion,
                reason: error.message
            }
        );
    }

    return {
        ...envelope,
        payload
    };
}

export function migrateMemoryContract(contract, targetVersion = null) {
    const current = validateMemoryContract(contract);
    const target = targetVersion == null
        ? getLatestContractVersion(current.contractType)
        : Number(targetVersion);

    if (!Number.isInteger(target) || target <= 0) {
        throw new MemoryContractError(
            'INVALID_TARGET_VERSION',
            `Target version must be a positive integer, got ${targetVersion}`,
            { targetVersion }
        );
    }

    if (target === current.contractVersion) {
        return clone(current);
    }

    if (target < current.contractVersion) {
        throw new MemoryContractError(
            'DOWNGRADE_NOT_SUPPORTED',
            `Cannot downgrade ${current.contractType} contract from v${current.contractVersion} to v${target}`,
            {
                contractType: current.contractType,
                fromVersion: current.contractVersion,
                toVersion: target
            }
        );
    }

    const latest = getLatestContractVersion(current.contractType);
    if (target > latest) {
        throw new MemoryContractError(
            'TARGET_VERSION_OUT_OF_RANGE',
            `Cannot migrate ${current.contractType} past latest version v${latest}`,
            {
                contractType: current.contractType,
                targetVersion: target,
                latestVersion: latest
            }
        );
    }

    let payload = current.payload;
    let version = current.contractVersion;

    while (version < target) {
        const versionDefinition = getVersionDefinition(current.contractType, version);
        if (typeof versionDefinition.migrateToNext !== 'function') {
            throw new MemoryContractError(
                'MIGRATION_UNAVAILABLE',
                `Missing migration path for ${current.contractType} v${version} -> v${version + 1}`,
                {
                    contractType: current.contractType,
                    fromVersion: version,
                    toVersion: version + 1
                }
            );
        }

        payload = versionDefinition.migrateToNext(payload);
        version += 1;
        payload = getVersionDefinition(current.contractType, version).schema.parse(payload);
    }

    return {
        ...current,
        contractVersion: version,
        payload
    };
}

export function writeMemoryContract(contract, { onValidate = null } = {}) {
    const validated = validateMemoryContract(contract);
    runValidationHook(onValidate, 'write', validated);
    return clone(validated);
}

export function readMemoryContract(
    contract,
    {
        migrate = true,
        targetVersion = null,
        onValidate = null
    } = {}
) {
    const validated = migrate
        ? migrateMemoryContract(contract, targetVersion)
        : validateMemoryContract(contract);
    runValidationHook(onValidate, 'read', validated);
    return clone(validated);
}

export function buildMemoryContract({
    contractType,
    payload,
    createdBy,
    contractVersion = null,
    id = randomUUID(),
    createdAt = Date.now(),
    metadata = {}
}) {
    const version = contractVersion == null
        ? getLatestContractVersion(contractType)
        : Number(contractVersion);

    return validateMemoryContract({
        kind: 'memory_contract',
        id,
        contractType,
        contractVersion: version,
        createdAt,
        createdBy,
        payload,
        metadata
    });
}

export function buildReportContract(options) {
    return buildMemoryContract({
        contractType: 'report',
        ...options
    });
}

export function buildDecisionContract(options) {
    return buildMemoryContract({
        contractType: 'decision',
        ...options
    });
}

export function buildHandoffContract(options) {
    return buildMemoryContract({
        contractType: 'handoff',
        ...options
    });
}

export const __memoryContractInternals = {
    CONTRACT_REGISTRY,
    MemoryContractEnvelopeSchema,
    ReportContractPayloadV1,
    ReportContractPayloadV2,
    DecisionContractPayloadV1,
    HandoffContractPayloadV1
};
