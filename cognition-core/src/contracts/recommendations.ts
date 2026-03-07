import {
    COGNITION_RISK_TIERS,
    type CognitionRiskTier,
    type ContractValidationIssue,
    type ContractValidationResult
} from './events.js';

export const COGNITION_RECOMMENDATION_PRIORITIES = ['P0', 'P1', 'P2', 'P3'] as const;
export type CognitionRecommendationPriority = (typeof COGNITION_RECOMMENDATION_PRIORITIES)[number];

export const COGNITION_EVIDENCE_TYPES = ['event', 'metric', 'report', 'manual'] as const;
export type CognitionEvidenceType = (typeof COGNITION_EVIDENCE_TYPES)[number];

export interface CognitionRecommendationEvidence {
    evidenceId: string;
    type: CognitionEvidenceType;
    reference: string;
    summary?: string;
    confidence: number;
}

export interface CognitionEstimatedImpact {
    metric: string;
    unit: string;
    expectedDelta: number;
    confidence: number;
}

export interface CognitionVerificationStep {
    stepId: string;
    description: string;
    successMetric?: string;
    expectedValue?: string | number | boolean;
}

export interface CognitionVerificationPlan {
    owner?: string;
    dueAt?: number;
    steps: CognitionVerificationStep[];
}

export interface CognitionRecommendation {
    recommendationId: string;
    title: string;
    reasoning: string;
    evidence: CognitionRecommendationEvidence[];
    priority: CognitionRecommendationPriority;
    riskTier: CognitionRiskTier;
    requiresHumanApproval: boolean;
    estimatedImpact: CognitionEstimatedImpact;
    verificationPlan: CognitionVerificationPlan;
    metadata?: Record<string, unknown>;
}

export interface CognitionTask {
    taskId: string;
    owner: string;
    dependencies: string[];
    commands: string[];
    actions: string[];
    successCriteria: string[];
    rollbackPlan: string[];
    metadata?: Record<string, unknown>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function normalizeString(value: unknown): string | null {
    if (typeof value !== 'string') return null;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
}

function normalizeNumber(value: unknown): number | null {
    const numeric = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(numeric)) return null;
    return numeric;
}

function normalizeConfidence(value: unknown): number | null {
    const numeric = normalizeNumber(value);
    if (numeric === null) return null;
    if (numeric < 0 || numeric > 1) return null;
    return numeric;
}

function normalizeTimestamp(value: unknown): number | null {
    if (typeof value === 'number' && Number.isFinite(value)) return Math.floor(value);
    if (typeof value === 'string') {
        const trimmed = value.trim();
        if (!trimmed) return null;

        const asNumber = Number(trimmed);
        if (Number.isFinite(asNumber)) return Math.floor(asNumber);

        const asDate = Date.parse(trimmed);
        if (Number.isFinite(asDate)) return Math.floor(asDate);
    }

    return null;
}


function compareStringsDeterministically(left: string, right: string): number {
    if (left < right) return -1;
    if (left > right) return 1;
    return 0;
}

function normalizeStringArray(value: unknown, path: string): ContractValidationResult<string[]> {
    if (!Array.isArray(value)) {
        return { ok: false, errors: [{ path, message: 'must be an array of strings.' }] };
    }

    const errors: ContractValidationIssue[] = [];
    const out: string[] = [];

    for (let index = 0; index < value.length; index += 1) {
        const normalized = normalizeString(value[index]);
        if (!normalized) {
            errors.push({ path: `${path}[${index}]`, message: 'must be a non-empty string.' });
            continue;
        }
        out.push(normalized);
    }

    if (errors.length > 0) {
        return { ok: false, errors };
    }

    return { ok: true, value: out };
}


function extractRequiredApproversFromTaskMetadata(metadata: Record<string, unknown>): string[] {
    const directRequiredApprovers = Array.isArray(metadata.requiredApprovers)
        ? metadata.requiredApprovers
        : [];

    const policyGate = isRecord(metadata.policyGate) ? metadata.policyGate : null;
    const policyGateRequiredApprovers = policyGate && Array.isArray(policyGate.requiredApprovers)
        ? policyGate.requiredApprovers
        : [];

    const passthrough = policyGate && isRecord(policyGate.passthrough)
        ? policyGate.passthrough
        : null;
    const policyPassthroughRequiredApprovers = passthrough && Array.isArray(passthrough.requiredApprovers)
        ? passthrough.requiredApprovers
        : [];

    return Array.from(new Set(
        [
            ...directRequiredApprovers,
            ...policyGateRequiredApprovers,
            ...policyPassthroughRequiredApprovers
        ]
            .map((entry) => normalizeString(entry))
            .filter((entry): entry is string => Boolean(entry))
    )).sort(compareStringsDeterministically);
}

function metadataRequiresHumanApproval(metadata: Record<string, unknown>): boolean {
    if (typeof metadata.requiresHumanApproval === 'boolean') {
        return metadata.requiresHumanApproval;
    }

    const policyGate = isRecord(metadata.policyGate) ? metadata.policyGate : null;
    return policyGate?.requiresHumanApproval === true;
}

const HIGH_RISK_RECOMMENDATION_TIERS = new Set<CognitionRiskTier>(['high', 'critical']);

type RecommendationContractDiagnosticCode =
    | 'high_risk_human_approval_required'
    | 'required_approvers_missing'
    | 'rollback_metadata_missing'
    | 'rollback_trigger_missing'
    | 'rollback_steps_missing';

type RecommendationContractDiagnosticDefinition = {
    code: RecommendationContractDiagnosticCode;
    path: string;
    detail: string;
};

const RECOMMENDATION_REASON_PAYLOAD_MARKER = ' reason_payload=';

function formatRecommendationContractDiagnostic(
    definition: RecommendationContractDiagnosticDefinition
): string {
    return `[${definition.code}] ${definition.detail}${RECOMMENDATION_REASON_PAYLOAD_MARKER}${JSON.stringify({
        code: definition.code,
        path: definition.path,
        contract: 'recommendation_fail_closed'
    })}`;
}

const RECOMMENDATION_CONTRACT_DIAGNOSTICS = {
    highRiskHumanApprovalRequired: {
        code: 'high_risk_human_approval_required',
        path: 'requiresHumanApproval',
        detail: 'requiresHumanApproval must be true for high-risk recommendations (fail-closed approval contract).'
    },
    requiredApproversMissing: {
        code: 'required_approvers_missing',
        path: 'metadata.requiredApprovers',
        detail: 'requiredApprovers are required for high-risk recommendations (fail-closed approval contract).'
    },
    rollbackMetadataMissing: {
        code: 'rollback_metadata_missing',
        path: 'metadata.rollbackPlan',
        detail: 'rollbackPlan metadata is required for high-risk recommendations (fail-closed rollback contract).'
    },
    rollbackTriggerMissing: {
        code: 'rollback_trigger_missing',
        path: 'metadata.rollbackPlan.trigger',
        detail: 'rollbackPlan.trigger is required for high-risk recommendations (fail-closed rollback contract).'
    },
    rollbackStepsMissing: {
        code: 'rollback_steps_missing',
        path: 'metadata.rollbackPlan.steps',
        detail: 'rollbackPlan.steps must include at least one recovery step for high-risk recommendations (fail-closed rollback contract).'
    }
} as const satisfies Record<string, RecommendationContractDiagnosticDefinition>;

type NormalizedRecommendationRollbackMetadata = {
    present: boolean;
    trigger: string | null;
    steps: string[];
};

function normalizeRecommendationRollbackMetadata(
    metadata: Record<string, unknown>
): NormalizedRecommendationRollbackMetadata {
    const policyGate = isRecord(metadata.policyGate) ? metadata.policyGate : null;
    const policyPassthrough = policyGate && isRecord(policyGate.passthrough)
        ? policyGate.passthrough
        : null;

    const rollbackCandidate = isRecord(metadata.rollbackPlan)
        ? metadata.rollbackPlan
        : (isRecord(metadata.rollback)
            ? metadata.rollback
            : (isRecord(policyGate?.rollbackPlan)
                ? policyGate.rollbackPlan
                : (isRecord(policyPassthrough?.rollbackPlan)
                    ? policyPassthrough.rollbackPlan
                    : null)));

    if (!rollbackCandidate) {
        return {
            present: false,
            trigger: null,
            steps: []
        };
    }

    const trigger = normalizeString(rollbackCandidate.trigger);
    const steps = Array.isArray(rollbackCandidate.steps)
        ? rollbackCandidate.steps
            .map((entry) => normalizeString(entry))
            .filter((entry): entry is string => Boolean(entry))
        : [];

    return {
        present: true,
        trigger,
        steps: Array.from(new Set(steps)).sort(compareStringsDeterministically)
    };
}


export function normalizeRecommendationPriority(value: unknown): CognitionRecommendationPriority | null {
    if (typeof value !== 'string') return null;

    const normalized = value.trim().toUpperCase();
    if (COGNITION_RECOMMENDATION_PRIORITIES.includes(normalized as CognitionRecommendationPriority)) {
        return normalized as CognitionRecommendationPriority;
    }

    if (normalized === 'CRITICAL' || normalized === 'HIGH') return 'P0';
    if (normalized === 'MEDIUM') return 'P2';
    if (normalized === 'LOW') return 'P3';

    return null;
}

function normalizeRiskTier(value: unknown): CognitionRiskTier | null {
    if (typeof value !== 'string') return null;
    const normalized = value.trim().toLowerCase();
    if (COGNITION_RISK_TIERS.includes(normalized as CognitionRiskTier)) {
        return normalized as CognitionRiskTier;
    }
    return null;
}

function validateEvidence(value: unknown, index: number): ContractValidationResult<CognitionRecommendationEvidence> {
    const path = `evidence[${index}]`;
    if (!isRecord(value)) {
        return { ok: false, errors: [{ path, message: 'must be an object.' }] };
    }

    const errors: ContractValidationIssue[] = [];

    const evidenceId = normalizeString(value.evidenceId) ?? normalizeString(value.id);
    if (!evidenceId) errors.push({ path: `${path}.evidenceId`, message: 'evidenceId is required.' });

    const typeRaw = typeof value.type === 'string' ? value.type.trim().toLowerCase() : null;
    const type = typeRaw && COGNITION_EVIDENCE_TYPES.includes(typeRaw as CognitionEvidenceType)
        ? (typeRaw as CognitionEvidenceType)
        : null;
    if (!type) {
        errors.push({
            path: `${path}.type`,
            message: `type must be one of: ${COGNITION_EVIDENCE_TYPES.join(', ')}.`
        });
    }

    const reference = normalizeString(value.reference);
    if (!reference) errors.push({ path: `${path}.reference`, message: 'reference is required.' });

    const summaryRaw = value.summary;
    const summary = summaryRaw === undefined ? undefined : normalizeString(summaryRaw) ?? undefined;

    const confidence = normalizeConfidence(value.confidence);
    if (confidence === null) {
        errors.push({ path: `${path}.confidence`, message: 'confidence must be a number between 0 and 1.' });
    }

    if (errors.length > 0 || !evidenceId || !type || !reference || confidence === null) {
        return { ok: false, errors };
    }

    return {
        ok: true,
        value: {
            evidenceId,
            type,
            reference,
            summary,
            confidence
        }
    };
}

function validateEstimatedImpact(value: unknown): ContractValidationResult<CognitionEstimatedImpact> {
    if (!isRecord(value)) {
        return {
            ok: false,
            errors: [{ path: 'estimatedImpact', message: 'estimatedImpact must be an object.' }]
        };
    }

    const errors: ContractValidationIssue[] = [];

    const metric = normalizeString(value.metric);
    if (!metric) errors.push({ path: 'estimatedImpact.metric', message: 'metric is required.' });

    const unit = normalizeString(value.unit);
    if (!unit) errors.push({ path: 'estimatedImpact.unit', message: 'unit is required.' });

    const expectedDelta = normalizeNumber(value.expectedDelta);
    if (expectedDelta === null) {
        errors.push({ path: 'estimatedImpact.expectedDelta', message: 'expectedDelta must be numeric.' });
    }

    const confidence = normalizeConfidence(value.confidence);
    if (confidence === null) {
        errors.push({ path: 'estimatedImpact.confidence', message: 'confidence must be between 0 and 1.' });
    }

    if (errors.length > 0 || !metric || !unit || expectedDelta === null || confidence === null) {
        return { ok: false, errors };
    }

    return {
        ok: true,
        value: {
            metric,
            unit,
            expectedDelta,
            confidence
        }
    };
}

function validateVerificationStep(value: unknown, index: number): ContractValidationResult<CognitionVerificationStep> {
    const path = `verificationPlan.steps[${index}]`;
    if (!isRecord(value)) {
        return { ok: false, errors: [{ path, message: 'must be an object.' }] };
    }

    const errors: ContractValidationIssue[] = [];

    const stepId = normalizeString(value.stepId) ?? normalizeString(value.id);
    if (!stepId) errors.push({ path: `${path}.stepId`, message: 'stepId is required.' });

    const description = normalizeString(value.description);
    if (!description) errors.push({ path: `${path}.description`, message: 'description is required.' });

    const successMetricRaw = value.successMetric;
    const successMetric = successMetricRaw === undefined
        ? undefined
        : normalizeString(successMetricRaw) ?? undefined;

    const expectedValue = value.expectedValue as string | number | boolean | undefined;
    if (
        expectedValue !== undefined &&
        typeof expectedValue !== 'string' &&
        typeof expectedValue !== 'number' &&
        typeof expectedValue !== 'boolean'
    ) {
        errors.push({
            path: `${path}.expectedValue`,
            message: 'expectedValue must be a string, number, or boolean.'
        });
    }

    if (errors.length > 0 || !stepId || !description) {
        return { ok: false, errors };
    }

    return {
        ok: true,
        value: {
            stepId,
            description,
            successMetric,
            expectedValue
        }
    };
}

function validateVerificationPlan(value: unknown): ContractValidationResult<CognitionVerificationPlan> {
    if (!isRecord(value)) {
        return {
            ok: false,
            errors: [{ path: 'verificationPlan', message: 'verificationPlan must be an object.' }]
        };
    }

    const errors: ContractValidationIssue[] = [];

    const ownerRaw = value.owner;
    const owner = ownerRaw === undefined ? undefined : normalizeString(ownerRaw) ?? undefined;

    const dueAtRaw = value.dueAt;
    const dueAt = dueAtRaw === undefined ? undefined : normalizeTimestamp(dueAtRaw);
    if (dueAtRaw !== undefined && dueAt === null) {
        errors.push({ path: 'verificationPlan.dueAt', message: 'dueAt must be a timestamp.' });
    }

    const stepsRaw = value.steps;
    const steps: CognitionVerificationStep[] = [];
    if (!Array.isArray(stepsRaw)) {
        errors.push({ path: 'verificationPlan.steps', message: 'steps must be an array.' });
    } else {
        for (let index = 0; index < stepsRaw.length; index += 1) {
            const stepResult = validateVerificationStep(stepsRaw[index], index);
            if (stepResult.ok) {
                steps.push(stepResult.value);
            } else {
                errors.push(...stepResult.errors);
            }
        }
    }

    if (errors.length > 0 || !Array.isArray(stepsRaw)) {
        return { ok: false, errors };
    }

    return {
        ok: true,
        value: {
            owner,
            dueAt: dueAt ?? undefined,
            steps
        }
    };
}

export function validateCognitionRecommendation(value: unknown): ContractValidationResult<CognitionRecommendation> {
    if (!isRecord(value)) {
        return { ok: false, errors: [{ path: '$', message: 'Recommendation must be an object.' }] };
    }

    const errors: ContractValidationIssue[] = [];

    const recommendationId = normalizeString(value.recommendationId) ?? normalizeString(value.id);
    if (!recommendationId) errors.push({ path: 'recommendationId', message: 'recommendationId is required.' });

    const title = normalizeString(value.title);
    if (!title) errors.push({ path: 'title', message: 'title is required.' });

    const reasoning = normalizeString(value.reasoning);
    if (!reasoning) errors.push({ path: 'reasoning', message: 'reasoning is required.' });

    const evidenceRaw = value.evidence;
    const evidence: CognitionRecommendationEvidence[] = [];
    if (!Array.isArray(evidenceRaw)) {
        errors.push({ path: 'evidence', message: 'evidence must be an array.' });
    } else {
        for (let index = 0; index < evidenceRaw.length; index += 1) {
            const evidenceResult = validateEvidence(evidenceRaw[index], index);
            if (evidenceResult.ok) {
                evidence.push(evidenceResult.value);
            } else {
                errors.push(...evidenceResult.errors);
            }
        }
    }

    const priority = normalizeRecommendationPriority(value.priority);
    if (!priority) {
        errors.push({
            path: 'priority',
            message: `priority must be one of: ${COGNITION_RECOMMENDATION_PRIORITIES.join(', ')}.`
        });
    }

    const riskTier = normalizeRiskTier(value.riskTier);
    if (!riskTier) {
        errors.push({
            path: 'riskTier',
            message: `riskTier must be one of: ${COGNITION_RISK_TIERS.join(', ')}.`
        });
    }

    const requiresHumanApproval = value.requiresHumanApproval;
    if (typeof requiresHumanApproval !== 'boolean') {
        errors.push({ path: 'requiresHumanApproval', message: 'requiresHumanApproval must be a boolean.' });
    }

    const impactResult = validateEstimatedImpact(value.estimatedImpact);
    if (!impactResult.ok) errors.push(...impactResult.errors);

    const planResult = validateVerificationPlan(value.verificationPlan);
    if (!planResult.ok) errors.push(...planResult.errors);

    const metadataRaw = value.metadata;
    const metadata = isRecord(metadataRaw) ? metadataRaw : null;
    if (metadataRaw !== undefined && !metadata) {
        errors.push({ path: 'metadata', message: 'metadata must be an object.' });
    }

    if (riskTier && HIGH_RISK_RECOMMENDATION_TIERS.has(riskTier)) {
        if (requiresHumanApproval !== true) {
            errors.push({
                path: RECOMMENDATION_CONTRACT_DIAGNOSTICS.highRiskHumanApprovalRequired.path,
                message: formatRecommendationContractDiagnostic(
                    RECOMMENDATION_CONTRACT_DIAGNOSTICS.highRiskHumanApprovalRequired
                )
            });
        }

        const requiredApprovers = metadata ? extractRequiredApproversFromTaskMetadata(metadata) : [];
        if (requiredApprovers.length === 0) {
            errors.push({
                path: RECOMMENDATION_CONTRACT_DIAGNOSTICS.requiredApproversMissing.path,
                message: formatRecommendationContractDiagnostic(
                    RECOMMENDATION_CONTRACT_DIAGNOSTICS.requiredApproversMissing
                )
            });
        }

        const rollbackMetadata = metadata
            ? normalizeRecommendationRollbackMetadata(metadata)
            : { present: false, trigger: null, steps: [] };

        if (!rollbackMetadata.present) {
            errors.push({
                path: RECOMMENDATION_CONTRACT_DIAGNOSTICS.rollbackMetadataMissing.path,
                message: formatRecommendationContractDiagnostic(
                    RECOMMENDATION_CONTRACT_DIAGNOSTICS.rollbackMetadataMissing
                )
            });
        } else {
            if (!rollbackMetadata.trigger) {
                errors.push({
                    path: RECOMMENDATION_CONTRACT_DIAGNOSTICS.rollbackTriggerMissing.path,
                    message: formatRecommendationContractDiagnostic(
                        RECOMMENDATION_CONTRACT_DIAGNOSTICS.rollbackTriggerMissing
                    )
                });
            }

            if (rollbackMetadata.steps.length === 0) {
                errors.push({
                    path: RECOMMENDATION_CONTRACT_DIAGNOSTICS.rollbackStepsMissing.path,
                    message: formatRecommendationContractDiagnostic(
                        RECOMMENDATION_CONTRACT_DIAGNOSTICS.rollbackStepsMissing
                    )
                });
            }
        }
    }

    if (
        errors.length > 0 ||
        !recommendationId ||
        !title ||
        !reasoning ||
        !Array.isArray(evidenceRaw) ||
        !priority ||
        !riskTier ||
        typeof requiresHumanApproval !== 'boolean' ||
        !impactResult.ok ||
        !planResult.ok
    ) {
        return { ok: false, errors };
    }

    return {
        ok: true,
        value: {
            recommendationId,
            title,
            reasoning,
            evidence,
            priority,
            riskTier,
            requiresHumanApproval,
            estimatedImpact: impactResult.value,
            verificationPlan: planResult.value,
            metadata: metadataRaw as Record<string, unknown> | undefined
        }
    };
}

export function validateCognitionTask(value: unknown): ContractValidationResult<CognitionTask> {
    if (!isRecord(value)) {
        return { ok: false, errors: [{ path: '$', message: 'Task must be an object.' }] };
    }

    const errors: ContractValidationIssue[] = [];

    const taskId = normalizeString(value.taskId) ?? normalizeString(value.id);
    if (!taskId) errors.push({ path: 'taskId', message: 'taskId is required.' });

    const owner = normalizeString(value.owner);
    if (!owner) errors.push({ path: 'owner', message: 'owner is required.' });

    const dependenciesResult = normalizeStringArray(value.dependencies ?? [], 'dependencies');
    if (!dependenciesResult.ok) errors.push(...dependenciesResult.errors);

    const commandsCandidate = value.commands ?? value.actions;
    const commandsResult = normalizeStringArray(commandsCandidate, 'commands');
    if (!commandsResult.ok) errors.push(...commandsResult.errors);

    const actionsResult = normalizeStringArray(value.actions ?? value.commands ?? [], 'actions');
    if (!actionsResult.ok) errors.push(...actionsResult.errors);

    const successCriteriaCandidate = value.successCriteria ?? value.verificationCriteria;
    const successCriteriaResult = normalizeStringArray(successCriteriaCandidate ?? [], 'successCriteria');
    if (!successCriteriaResult.ok) errors.push(...successCriteriaResult.errors);

    const rollbackRaw = value.rollbackPlan;
    let rollbackPlanResult: ContractValidationResult<string[]>;
    if (typeof rollbackRaw === 'string') {
        const normalized = normalizeString(rollbackRaw);
        rollbackPlanResult = normalized
            ? { ok: true, value: [normalized] }
            : { ok: false, errors: [{ path: 'rollbackPlan', message: 'rollbackPlan string cannot be empty.' }] };
    } else {
        rollbackPlanResult = normalizeStringArray(rollbackRaw ?? [], 'rollbackPlan');
    }
    if (!rollbackPlanResult.ok) errors.push(...rollbackPlanResult.errors);
    if (rollbackPlanResult.ok && rollbackPlanResult.value.length === 0) {
        errors.push({
            path: 'rollbackPlan',
            message: 'rollbackPlan must include at least one recovery step (fail-closed rollback readiness).'
        });
    }

    const metadataRaw = value.metadata;
    const metadata = isRecord(metadataRaw) ? metadataRaw : null;
    if (metadataRaw !== undefined && !metadata) {
        errors.push({ path: 'metadata', message: 'metadata must be an object.' });
    }

    if (metadata && metadataRequiresHumanApproval(metadata)) {
        const requiredApprovers = extractRequiredApproversFromTaskMetadata(metadata);
        if (requiredApprovers.length === 0) {
            errors.push({
                path: 'metadata.requiredApprovers',
                message: 'requiredApprovers are required when human approval is required (fail-closed approval contract).'
            });
        }
    }

    const rollbackReadinessMetadata = metadata && isRecord(metadata.rollbackReadiness)
        ? metadata.rollbackReadiness
        : null;

    if (rollbackReadinessMetadata && rollbackReadinessMetadata.ready === false) {
        const blockers = Array.isArray(rollbackReadinessMetadata.blockers)
            ? rollbackReadinessMetadata.blockers
                .map((entry) => normalizeString(entry))
                .filter((entry): entry is string => Boolean(entry))
            : [];

        errors.push({
            path: 'metadata.rollbackReadiness',
            message: blockers.length > 0
                ? `rollback readiness contract is not satisfied: ${blockers.join(', ')}.`
                : 'rollback readiness contract is not satisfied.'
        });
    }

    if (
        errors.length > 0 ||
        !taskId ||
        !owner ||
        !dependenciesResult.ok ||
        !commandsResult.ok ||
        !actionsResult.ok ||
        !successCriteriaResult.ok ||
        !rollbackPlanResult.ok
    ) {
        return { ok: false, errors };
    }

    return {
        ok: true,
        value: {
            taskId,
            owner,
            dependencies: dependenciesResult.value,
            commands: commandsResult.value,
            actions: actionsResult.value,
            successCriteria: successCriteriaResult.value,
            rollbackPlan: rollbackPlanResult.value,
            metadata: metadataRaw as Record<string, unknown> | undefined
        }
    };
}

export function assertCognitionRecommendation(value: unknown): CognitionRecommendation {
    const result = validateCognitionRecommendation(value);
    if (result.ok) return result.value;
    const message = result.errors.map((issue) => `${issue.path}: ${issue.message}`).join(' | ');
    throw new Error(`Invalid CognitionRecommendation: ${message}`);
}

export function assertCognitionTask(value: unknown): CognitionTask {
    const result = validateCognitionTask(value);
    if (result.ok) return result.value;
    const message = result.errors.map((issue) => `${issue.path}: ${issue.message}`).join(' | ');
    throw new Error(`Invalid CognitionTask: ${message}`);
}
