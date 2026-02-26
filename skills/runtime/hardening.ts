import {
    executeSkillImplementation,
    skillExecutionToTasks
} from './engine.js';
import type {
    SkillDeployabilityIndex,
    SkillDeployabilityIndexEntry,
    SkillExecutionInput,
    SkillHardeningBatchReport,
    SkillHardeningBatchSummary,
    SkillHardeningCheck,
    SkillHardeningCheckId,
    SkillHardeningCheckStatus,
    SkillHardeningFinding,
    SkillHardeningPolicyConfig,
    SkillHardeningPolicyResolutionInput,
    SkillHardeningProfile,
    SkillHardeningProfileRule,
    SkillHardeningPolicy,
    SkillHardeningReport,
    SkillHardeningResolvedPolicy,
    SkillHardeningScenario,
    SkillHardeningScenarioResult,
    SkillHardeningSeverity,
    SkillHardeningSource,
    SkillImplementation
} from './types.js';

const DEFAULT_MIN_DEPLOYABLE_SCORE = 82;
const DEFAULT_SOURCE: SkillHardeningSource = 'runtime';
const DEFAULT_STRICT = true;
const VALID_HARDENING_POLICIES = new Set<SkillHardeningPolicy>([
    'off',
    'report',
    'enforce'
]);

const DEFAULT_SCENARIOS: SkillHardeningScenario[] = [
    {
        name: 'baseline_ready',
        input: {
            signalQuality: 92,
            evidenceCoverage: 90,
            confidenceHealth: 88,
            operationalReadiness: 86,
            harmPotential: 15,
            resourcePressure: 24,
            urgency: 60,
            impactPotential: 82,
            humanApprovalLatency: 12
        }
    },
    {
        name: 'degraded_review',
        input: {
            signalQuality: 62,
            evidenceCoverage: 60,
            confidenceHealth: 58,
            operationalReadiness: 55,
            harmPotential: 60,
            resourcePressure: 62,
            urgency: 70,
            impactPotential: 66,
            humanApprovalLatency: 54
        }
    },
    {
        name: 'high_risk',
        input: {
            signalQuality: 35,
            evidenceCoverage: 33,
            confidenceHealth: 30,
            operationalReadiness: 32,
            harmPotential: 88,
            resourcePressure: 82,
            urgency: 86,
            impactPotential: 64,
            humanApprovalLatency: 82
        }
    }
];

type SkillHardeningOptions = {
    source?: SkillHardeningSource;
    policy?: SkillHardeningPolicy;
    minDeployableScore?: number;
    strict?: boolean;
    profile?: SkillHardeningProfile;
    resolvedPolicy?: SkillHardeningResolvedPolicy;
    scenarios?: SkillHardeningScenario[];
};

type SkillHardeningBatchEntry = {
    source?: SkillHardeningSource;
    implementation: SkillImplementation;
};

type SkillHardeningBatchOptions = {
    policy?: SkillHardeningPolicy;
    minDeployableScore?: number;
    strict?: boolean;
    profile?: SkillHardeningProfile;
    scenarios?: SkillHardeningScenario[];
};

function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

function toNumber(value: unknown, fallback = 0): number {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : fallback;
}

function roundScore(value: number): number {
    return Math.round(clamp(value, 0, 100));
}

function normalizeMinScore(value: unknown): number {
    return roundScore(toNumber(value, DEFAULT_MIN_DEPLOYABLE_SCORE));
}

function normalizePolicy(value: unknown, fallback: SkillHardeningPolicy = 'enforce'): SkillHardeningPolicy {
    if (typeof value !== 'string') return fallback;
    const normalized = value.trim().toLowerCase() as SkillHardeningPolicy;
    return VALID_HARDENING_POLICIES.has(normalized) ? normalized : fallback;
}

function normalizeStrict(value: unknown, fallback = DEFAULT_STRICT): boolean {
    if (typeof value === 'boolean') return value;
    return fallback;
}

function normalizeSource(value: unknown, fallback = DEFAULT_SOURCE): SkillHardeningSource {
    if (value === 'manifest' || value === 'external' || value === 'runtime') return value;
    return fallback;
}

function asStringList(value: unknown): string[] {
    if (!Array.isArray(value)) return [];
    return value
        .filter((entry) => typeof entry === 'string')
        .map((entry) => entry.trim())
        .filter(Boolean);
}

function hasUniqueEntries(values: string[]): boolean {
    return new Set(values).size === values.length;
}

function normalizeText(value: unknown): string {
    return String(value || '')
        .trim()
        .toLowerCase();
}

function normalizeRulePatterns(value: unknown): string[] {
    return asStringList(value)
        .map((entry) => normalizeText(entry))
        .filter(Boolean);
}

function matchesPattern(value: string, patterns: string[]): boolean {
    if (patterns.length === 0) return true;
    const normalized = normalizeText(value);
    if (!normalized) return false;
    return patterns.some((pattern) => normalized === pattern || normalized.includes(pattern));
}

function normalizeRule(rule: SkillHardeningProfileRule, index: number): SkillHardeningProfileRule {
    const id = typeof rule.id === 'string' && rule.id.trim()
        ? rule.id.trim()
        : `rule-${index + 1}`;
    return {
        ...rule,
        id,
        policy: rule.policy ? normalizePolicy(rule.policy, 'enforce') : undefined,
        minDeployableScore: rule.minDeployableScore === undefined
            ? undefined
            : normalizeMinScore(rule.minDeployableScore),
        strict: rule.strict === undefined ? undefined : normalizeStrict(rule.strict),
        sources: Array.isArray(rule.sources)
            ? rule.sources.filter((entry) => entry === 'manifest' || entry === 'external' || entry === 'runtime')
            : undefined,
        domains: rule.domains ? normalizeRulePatterns(rule.domains) : undefined,
        domainSlugs: rule.domainSlugs ? normalizeRulePatterns(rule.domainSlugs) : undefined,
        archetypes: rule.archetypes ? normalizeRulePatterns(rule.archetypes) : undefined,
        skillIds: Array.isArray(rule.skillIds)
            ? [...new Set(rule.skillIds.map((value) => Number(value)).filter((value) => Number.isInteger(value) && value > 0))]
            : undefined,
        skillIdMin: rule.skillIdMin === undefined ? undefined : Math.max(1, Math.floor(Number(rule.skillIdMin))),
        skillIdMax: rule.skillIdMax === undefined ? undefined : Math.max(1, Math.floor(Number(rule.skillIdMax)))
    };
}

export function createDefaultSkillHardeningProfile(
    {
        policy = 'enforce',
        minDeployableScore = DEFAULT_MIN_DEPLOYABLE_SCORE,
        strict = DEFAULT_STRICT
    }: Partial<SkillHardeningPolicyConfig> = {}
): SkillHardeningProfile {
    const normalizedPolicy = normalizePolicy(policy, 'enforce');
    const normalizedMinScore = normalizeMinScore(minDeployableScore);
    const normalizedStrict = normalizeStrict(strict, DEFAULT_STRICT);

    return {
        version: 1,
        generatedAt: new Date().toISOString(),
        defaultPolicy: {
            policy: normalizedPolicy,
            minDeployableScore: normalizedMinScore,
            strict: normalizedStrict
        },
        rules: [
            {
                id: 'critical-safety-domains',
                description: 'Enforce stricter deployability in safety-critical or rights-critical domains.',
                domains: [
                    'health',
                    'medical',
                    'clinical',
                    'security',
                    'privacy',
                    'safety',
                    'rights',
                    'crisis',
                    'disaster',
                    'infra',
                    'compliance',
                    'governance',
                    'legal',
                    'finance'
                ],
                minDeployableScore: Math.max(normalizedMinScore + 8, 90),
                strict: true,
                policy: 'enforce'
            },
            {
                id: 'high-public-impact-domains',
                description: 'Use elevated guardrails for high public impact domains.',
                domains: [
                    'publicservice',
                    'public service',
                    'education',
                    'community',
                    'inclusion',
                    'equity',
                    'economic',
                    'logistics',
                    'impact'
                ],
                minDeployableScore: Math.max(normalizedMinScore + 4, 86),
                strict: true,
                policy: 'enforce'
            },
            {
                id: 'creative-exploratory-domains',
                description: 'Allow report-only hardening in creative exploratory domains while preserving telemetry.',
                domains: [
                    'aesthetic',
                    'beauty',
                    'creative',
                    'journal',
                    'storytelling',
                    'ideation'
                ],
                minDeployableScore: Math.max(normalizedMinScore - 4, 70),
                strict: false,
                policy: normalizedPolicy === 'off' ? 'off' : 'report'
            }
        ]
    };
}

export function normalizeSkillHardeningProfile(
    profile: SkillHardeningProfile | null | undefined,
    defaults: Partial<SkillHardeningPolicyConfig> = {}
): SkillHardeningProfile {
    const fallback = createDefaultSkillHardeningProfile(defaults);
    if (!profile || typeof profile !== 'object' || !Array.isArray(profile.rules)) {
        return fallback;
    }

    const defaultPolicy = profile.defaultPolicy && typeof profile.defaultPolicy === 'object'
        ? profile.defaultPolicy
        : fallback.defaultPolicy;

    const normalizedDefaultPolicy: SkillHardeningPolicyConfig = {
        policy: normalizePolicy(defaultPolicy.policy, fallback.defaultPolicy.policy),
        minDeployableScore: normalizeMinScore(defaultPolicy.minDeployableScore),
        strict: normalizeStrict(defaultPolicy.strict, fallback.defaultPolicy.strict)
    };

    const normalizedRules = profile.rules
        .filter((rule) => rule && typeof rule === 'object')
        .map((rule, index) => normalizeRule(rule, index));

    return {
        version: 1,
        generatedAt: typeof profile.generatedAt === 'string' && profile.generatedAt.trim()
            ? profile.generatedAt
            : fallback.generatedAt,
        defaultPolicy: normalizedDefaultPolicy,
        rules: normalizedRules
    };
}

function ruleMatchesInput(
    rule: SkillHardeningProfileRule,
    input: SkillHardeningPolicyResolutionInput
): boolean {
    if (Array.isArray(rule.sources) && rule.sources.length > 0 && !rule.sources.includes(input.source)) {
        return false;
    }

    if (Array.isArray(rule.skillIds) && rule.skillIds.length > 0 && !rule.skillIds.includes(input.skillId)) {
        return false;
    }

    if (Number.isInteger(rule.skillIdMin) && input.skillId < Number(rule.skillIdMin)) {
        return false;
    }
    if (Number.isInteger(rule.skillIdMax) && input.skillId > Number(rule.skillIdMax)) {
        return false;
    }

    if (Array.isArray(rule.domains) && rule.domains.length > 0 && !matchesPattern(input.domain, rule.domains)) {
        return false;
    }
    if (Array.isArray(rule.domainSlugs) && rule.domainSlugs.length > 0 && !matchesPattern(input.domainSlug, rule.domainSlugs)) {
        return false;
    }
    if (Array.isArray(rule.archetypes) && rule.archetypes.length > 0 && !matchesPattern(input.archetype, rule.archetypes)) {
        return false;
    }

    return true;
}

export function resolveSkillHardeningPolicy(
    input: SkillHardeningPolicyResolutionInput,
    {
        profile = null,
        policy = undefined,
        minDeployableScore = undefined,
        strict = undefined
    }: {
        profile?: SkillHardeningProfile | null;
        policy?: SkillHardeningPolicy;
        minDeployableScore?: number;
        strict?: boolean;
    } = {}
): SkillHardeningResolvedPolicy {
    const normalizedInput: SkillHardeningPolicyResolutionInput = {
        source: normalizeSource(input.source),
        skillId: Number.isInteger(input.skillId) ? input.skillId : 0,
        skillName: String(input.skillName || ''),
        domain: normalizeText(input.domain),
        domainSlug: normalizeText(input.domainSlug),
        archetype: normalizeText(input.archetype)
    };

    const normalizedProfile = normalizeSkillHardeningProfile(profile, {
        policy: policy || 'enforce',
        minDeployableScore: minDeployableScore ?? DEFAULT_MIN_DEPLOYABLE_SCORE,
        strict: strict ?? DEFAULT_STRICT
    });

    let resolved: SkillHardeningResolvedPolicy = {
        policy: normalizePolicy(policy ?? normalizedProfile.defaultPolicy.policy, normalizedProfile.defaultPolicy.policy),
        minDeployableScore: normalizeMinScore(minDeployableScore ?? normalizedProfile.defaultPolicy.minDeployableScore),
        strict: normalizeStrict(strict ?? normalizedProfile.defaultPolicy.strict, normalizedProfile.defaultPolicy.strict),
        matchedRuleIds: []
    };

    for (const rule of normalizedProfile.rules) {
        if (!ruleMatchesInput(rule, normalizedInput)) continue;
        resolved = {
            policy: rule.policy ? normalizePolicy(rule.policy, resolved.policy) : resolved.policy,
            minDeployableScore: rule.minDeployableScore === undefined
                ? resolved.minDeployableScore
                : normalizeMinScore(rule.minDeployableScore),
            strict: rule.strict === undefined ? resolved.strict : normalizeStrict(rule.strict, resolved.strict),
            matchedRuleIds: [...resolved.matchedRuleIds, rule.id]
        };
    }

    return resolved;
}

function pushFinding(
    findings: SkillHardeningFinding[],
    {
        checkId,
        severity,
        message,
        field,
        blocking
    }: {
        checkId: SkillHardeningCheckId;
        severity: SkillHardeningSeverity;
        message: string;
        field?: string;
        blocking?: boolean;
    }
) {
    findings.push({
        checkId,
        severity,
        message,
        field,
        blocking: Boolean(blocking)
    });
}

function determineCheckStatus(findings: SkillHardeningFinding[]): SkillHardeningCheckStatus {
    if (findings.some((finding) => finding.blocking)) {
        return 'fail';
    }
    if (findings.length > 0) {
        return 'warn';
    }
    return 'pass';
}

function createCheck(
    id: SkillHardeningCheckId,
    label: string,
    maxScore: number,
    findings: SkillHardeningFinding[],
    rawScore: number
): SkillHardeningCheck {
    return {
        id,
        label,
        status: determineCheckStatus(findings),
        score: roundScore(rawScore),
        maxScore: roundScore(maxScore),
        findings
    };
}

function checkIdentity(implementation: SkillImplementation): SkillHardeningCheck {
    const checkId: SkillHardeningCheckId = 'identity';
    const findings: SkillHardeningFinding[] = [];
    let score = 20;

    if (!Number.isInteger(implementation.skillId) || implementation.skillId <= 0) {
        pushFinding(findings, {
            checkId,
            severity: 'critical',
            message: 'skillId must be a positive integer.',
            field: 'skillId',
            blocking: true
        });
        score -= 8;
    }

    if (!/^[a-z0-9][a-z0-9-]{2,96}$/.test(String(implementation.skillName || ''))) {
        pushFinding(findings, {
            checkId,
            severity: 'high',
            message: 'skillName must be lowercase hyphen-case and stable for routing.',
            field: 'skillName',
            blocking: true
        });
        score -= 5;
    }

    if (String(implementation.title || '').trim().length < 12) {
        pushFinding(findings, {
            checkId,
            severity: 'high',
            message: 'title is too short for professional execution context.',
            field: 'title',
            blocking: true
        });
        score -= 3;
    }

    if (String(implementation.domain || '').trim().length < 3) {
        pushFinding(findings, {
            checkId,
            severity: 'high',
            message: 'domain is missing or too short.',
            field: 'domain',
            blocking: true
        });
        score -= 2;
    }

    if (String(implementation.reason || '').trim().length < 30) {
        pushFinding(findings, {
            checkId,
            severity: 'medium',
            message: 'reason should include a concrete operational benefit.',
            field: 'reason'
        });
        score -= 2;
    }

    return createCheck(checkId, 'Identity & Intent', 20, findings, score);
}

function checkImplementationGuide(implementation: SkillImplementation): SkillHardeningCheck {
    const checkId: SkillHardeningCheckId = 'implementation_guide';
    const findings: SkillHardeningFinding[] = [];
    let score = 20;

    const guide = Array.isArray(implementation.implementationGuide)
        ? implementation.implementationGuide
        : [];
    if (guide.length < 6) {
        pushFinding(findings, {
            checkId,
            severity: 'critical',
            message: 'implementationGuide must contain at least 6 steps.',
            field: 'implementationGuide',
            blocking: true
        });
        score -= 10;
    }

    const normalizedGuide = guide
        .filter((entry) => typeof entry === 'string')
        .map((entry) => entry.trim())
        .filter(Boolean);

    if (normalizedGuide.length !== guide.length) {
        pushFinding(findings, {
            checkId,
            severity: 'high',
            message: 'implementationGuide contains empty or invalid steps.',
            field: 'implementationGuide',
            blocking: true
        });
        score -= 4;
    }

    if (!hasUniqueEntries(normalizedGuide)) {
        pushFinding(findings, {
            checkId,
            severity: 'medium',
            message: 'implementationGuide contains duplicate steps; this weakens runbooks.',
            field: 'implementationGuide'
        });
        score -= 3;
    }

    const shortStepCount = normalizedGuide.filter((step) => step.length < 18).length;
    if (shortStepCount > 0) {
        pushFinding(findings, {
            checkId,
            severity: 'medium',
            message: `${shortStepCount} guide steps are too short to be actionable.`,
            field: 'implementationGuide'
        });
        score -= Math.min(3, shortStepCount);
    }

    return createCheck(checkId, 'Implementation Guide Quality', 20, findings, score);
}

function checkRuntimeContract(implementation: SkillImplementation): SkillHardeningCheck {
    const checkId: SkillHardeningCheckId = 'runtime_contract';
    const findings: SkillHardeningFinding[] = [];
    let score = 25;
    const runtimeProfile = implementation.runtimeProfile as Record<string, unknown> | undefined;

    if (!runtimeProfile || typeof runtimeProfile !== 'object') {
        pushFinding(findings, {
            checkId,
            severity: 'critical',
            message: 'runtimeProfile is required.',
            field: 'runtimeProfile',
            blocking: true
        });
        return createCheck(checkId, 'Runtime Contract Integrity', 25, findings, 0);
    }

    const archetype = String(runtimeProfile.archetype || '').trim();
    const coreMethod = String(runtimeProfile.coreMethod || '').trim();
    const primaryArtifact = String(runtimeProfile.primaryArtifact || '').trim();

    if (!archetype) {
        pushFinding(findings, {
            checkId,
            severity: 'critical',
            message: 'runtimeProfile.archetype is required.',
            field: 'runtimeProfile.archetype',
            blocking: true
        });
        score -= 4;
    }
    if (!coreMethod) {
        pushFinding(findings, {
            checkId,
            severity: 'critical',
            message: 'runtimeProfile.coreMethod is required.',
            field: 'runtimeProfile.coreMethod',
            blocking: true
        });
        score -= 4;
    }
    if (!primaryArtifact) {
        pushFinding(findings, {
            checkId,
            severity: 'high',
            message: 'runtimeProfile.primaryArtifact is required.',
            field: 'runtimeProfile.primaryArtifact',
            blocking: true
        });
        score -= 3;
    }

    const requiredSignals = asStringList(runtimeProfile.requiredSignals);
    if (requiredSignals.length < 3) {
        pushFinding(findings, {
            checkId,
            severity: 'high',
            message: 'requiredSignals must include at least 3 signals.',
            field: 'runtimeProfile.requiredSignals',
            blocking: true
        });
        score -= 4;
    } else if (!hasUniqueEntries(requiredSignals)) {
        pushFinding(findings, {
            checkId,
            severity: 'medium',
            message: 'requiredSignals should not contain duplicates.',
            field: 'runtimeProfile.requiredSignals'
        });
        score -= 1;
    }

    const kpiFocus = asStringList(runtimeProfile.kpiFocus);
    if (kpiFocus.length < 2) {
        pushFinding(findings, {
            checkId,
            severity: 'high',
            message: 'kpiFocus must include at least 2 KPI targets.',
            field: 'runtimeProfile.kpiFocus',
            blocking: true
        });
        score -= 3;
    }

    const scoringWeights = (runtimeProfile.scoringWeights || {}) as Record<string, unknown>;
    const truthWeight = toNumber(scoringWeights.truth, -1);
    const executionWeight = toNumber(scoringWeights.execution, -1);
    const safetyWeight = toNumber(scoringWeights.safety, -1);
    const impactWeight = toNumber(scoringWeights.impact, -1);
    const weightValues = [truthWeight, executionWeight, safetyWeight, impactWeight];
    const hasInvalidWeight = weightValues.some((value) => value <= 0 || value > 1);
    const totalWeight = weightValues.reduce((sum, value) => sum + value, 0);

    if (hasInvalidWeight || Math.abs(totalWeight - 1) > 0.02) {
        pushFinding(findings, {
            checkId,
            severity: 'critical',
            message: 'scoringWeights must be positive and sum to 1.',
            field: 'runtimeProfile.scoringWeights',
            blocking: true
        });
        score -= 5;
    }

    const thresholds = (runtimeProfile.postureThresholds || {}) as Record<string, unknown>;
    const readyMin = toNumber(thresholds.readyMin, NaN);
    const reviewMin = toNumber(thresholds.reviewMin, NaN);
    const reviewRisk = toNumber(thresholds.reviewRisk, NaN);
    const criticalRisk = toNumber(thresholds.criticalRisk, NaN);
    const thresholdValues = [readyMin, reviewMin, reviewRisk, criticalRisk];
    const invalidThresholdRange = thresholdValues.some((value) => !Number.isFinite(value) || value < 0 || value > 100);

    if (invalidThresholdRange || readyMin <= reviewMin || criticalRisk <= reviewRisk) {
        pushFinding(findings, {
            checkId,
            severity: 'critical',
            message: 'postureThresholds must be valid and ordered (readyMin > reviewMin, criticalRisk > reviewRisk).',
            field: 'runtimeProfile.postureThresholds',
            blocking: true
        });
        score -= 4;
    }

    const validation = (runtimeProfile.validation || {}) as Record<string, unknown>;
    const suites = asStringList(validation.suites);
    if (!suites.includes('unit') || !suites.includes('integration')) {
        pushFinding(findings, {
            checkId,
            severity: 'high',
            message: 'validation.suites should include unit and integration.',
            field: 'runtimeProfile.validation.suites',
            blocking: true
        });
        score -= 3;
    }

    const rollout = (runtimeProfile.rollout || {}) as Record<string, unknown>;
    const featureFlag = String(rollout.featureFlag || '').trim();
    if (!featureFlag || featureFlag.length < 8) {
        pushFinding(findings, {
            checkId,
            severity: 'high',
            message: 'rollout.featureFlag is required for deployability.',
            field: 'runtimeProfile.rollout.featureFlag',
            blocking: true
        });
        score -= 2;
    }

    return createCheck(checkId, 'Runtime Contract Integrity', 25, findings, score);
}

function checkOrchestrationSafety(implementation: SkillImplementation): SkillHardeningCheck {
    const checkId: SkillHardeningCheckId = 'orchestration_safety';
    const findings: SkillHardeningFinding[] = [];
    let score = 15;

    const orchestration = (implementation.runtimeProfile?.orchestration || {}) as Record<string, unknown>;
    const approvalGates = asStringList(orchestration.approvalGates);
    const routingTag = String(orchestration.routingTag || '').trim();
    const rollbackStrategy = String(orchestration.rollbackStrategy || '').trim().toLowerCase();
    const components = asStringList(orchestration.components);

    if (!routingTag) {
        pushFinding(findings, {
            checkId,
            severity: 'high',
            message: 'orchestration.routingTag is required.',
            field: 'runtimeProfile.orchestration.routingTag',
            blocking: true
        });
        score -= 3;
    }

    if (approvalGates.length < 2) {
        pushFinding(findings, {
            checkId,
            severity: 'critical',
            message: 'At least two approval gates are required.',
            field: 'runtimeProfile.orchestration.approvalGates',
            blocking: true
        });
        score -= 4;
    }

    const hasGovernanceGate = approvalGates.some((gate) => /policy|approval|review/.test(gate.toLowerCase()));
    if (!hasGovernanceGate) {
        pushFinding(findings, {
            checkId,
            severity: 'high',
            message: 'approvalGates should include a policy/approval/review gate.',
            field: 'runtimeProfile.orchestration.approvalGates',
            blocking: true
        });
        score -= 2;
    }

    if (!rollbackStrategy || !rollbackStrategy.includes('rollback')) {
        pushFinding(findings, {
            checkId,
            severity: 'high',
            message: 'rollbackStrategy must define explicit rollback behavior.',
            field: 'runtimeProfile.orchestration.rollbackStrategy',
            blocking: true
        });
        score -= 2;
    }

    if (components.length < 3) {
        pushFinding(findings, {
            checkId,
            severity: 'medium',
            message: 'orchestration.components should enumerate at least 3 control points.',
            field: 'runtimeProfile.orchestration.components'
        });
        score -= 1;
    }

    const retryPolicy = (orchestration.retryPolicy || {}) as Record<string, unknown>;
    const maxAttempts = toNumber(retryPolicy.maxAttempts, 0);
    const baseDelayMs = toNumber(retryPolicy.baseDelayMs, 0);
    const backoff = String(retryPolicy.backoff || '').trim().toLowerCase();

    if (maxAttempts < 2 || maxAttempts > 8) {
        pushFinding(findings, {
            checkId,
            severity: 'high',
            message: 'retryPolicy.maxAttempts should be between 2 and 8.',
            field: 'runtimeProfile.orchestration.retryPolicy.maxAttempts',
            blocking: true
        });
        score -= 2;
    }

    if (baseDelayMs < 200 || baseDelayMs > 15_000) {
        pushFinding(findings, {
            checkId,
            severity: 'medium',
            message: 'retryPolicy.baseDelayMs should be in the 200-15000ms range.',
            field: 'runtimeProfile.orchestration.retryPolicy.baseDelayMs'
        });
        score -= 1;
    }

    if (backoff !== 'exponential') {
        pushFinding(findings, {
            checkId,
            severity: 'high',
            message: 'retryPolicy.backoff must be exponential.',
            field: 'runtimeProfile.orchestration.retryPolicy.backoff',
            blocking: true
        });
        score -= 2;
    }

    return createCheck(checkId, 'Orchestration & Safety Controls', 15, findings, score);
}

function hasActionPrefix(actions: string[], prefix: string): boolean {
    return actions.some((action) => action.startsWith(prefix));
}

function checkSimulation(
    implementation: SkillImplementation,
    scenarios: SkillHardeningScenario[]
): {
    check: SkillHardeningCheck;
    scenarioResults: SkillHardeningScenarioResult[];
} {
    const checkId: SkillHardeningCheckId = 'simulation';
    const findings: SkillHardeningFinding[] = [];
    let score = 20;
    const scenarioResults: SkillHardeningScenarioResult[] = [];

    for (const scenario of scenarios) {
        let execution;
        try {
            execution = executeSkillImplementation(implementation, {
                missionId: `hardening-${implementation.skillId}-${scenario.name}`,
                ...(scenario.input as Required<SkillExecutionInput>)
            });
        } catch (error) {
            pushFinding(findings, {
                checkId,
                severity: 'critical',
                message: `Scenario ${scenario.name} failed to execute: ${error instanceof Error ? error.message : String(error)}`,
                field: `scenario:${scenario.name}`,
                blocking: true
            });
            score -= 8;
            continue;
        }

        const tasks = skillExecutionToTasks(execution, {
            fromAgentId: 'agent:skills-hardening',
            toAgentId: `agent:${implementation.domainSlug || 'ops'}-swarm`
        });
        scenarioResults.push({
            name: scenario.name,
            posture: execution.posture,
            overallScore: execution.scores.overallScore,
            riskScore: execution.scores.riskScore,
            followupTaskCount: tasks.length
        });

        if (tasks.length < 3) {
            pushFinding(findings, {
                checkId,
                severity: 'high',
                message: `Scenario ${scenario.name} generated fewer than 3 follow-up tasks.`,
                field: `scenario:${scenario.name}`,
                blocking: true
            });
            score -= 3;
        }

        if (execution.posture !== 'ready' && !tasks.some((task) => task.to === 'agent:human-oversight')) {
            pushFinding(findings, {
                checkId,
                severity: 'high',
                message: `Scenario ${scenario.name} requires human oversight escalation for non-ready posture.`,
                field: `scenario:${scenario.name}`,
                blocking: true
            });
            score -= 2;
        }

        if (execution.posture === 'ready' && !hasActionPrefix(execution.actions, 'deploy-flag:')) {
            pushFinding(findings, {
                checkId,
                severity: 'high',
                message: `Scenario ${scenario.name} missing deploy-flag action for ready posture.`,
                field: `scenario:${scenario.name}`,
                blocking: true
            });
            score -= 2;
        }

        if (execution.posture === 'review_required' && !hasActionPrefix(execution.actions, 'queue-approval:')) {
            pushFinding(findings, {
                checkId,
                severity: 'high',
                message: `Scenario ${scenario.name} missing queue-approval action for review posture.`,
                field: `scenario:${scenario.name}`,
                blocking: true
            });
            score -= 2;
        }

        if (execution.posture === 'critical' && !hasActionPrefix(execution.actions, 'rollback:')) {
            pushFinding(findings, {
                checkId,
                severity: 'critical',
                message: `Scenario ${scenario.name} missing rollback action for critical posture.`,
                field: `scenario:${scenario.name}`,
                blocking: true
            });
            score -= 3;
        }
    }

    const baseline = scenarioResults.find((result) => result.name === 'baseline_ready');
    const degraded = scenarioResults.find((result) => result.name === 'degraded_review');
    const risk = scenarioResults.find((result) => result.name === 'high_risk');

    if (baseline && baseline.posture === 'critical') {
        pushFinding(findings, {
            checkId,
            severity: 'high',
            message: 'baseline_ready scenario should not enter critical posture.',
            field: 'scenario:baseline_ready',
            blocking: true
        });
        score -= 3;
    }

    if (degraded && degraded.posture === 'ready') {
        pushFinding(findings, {
            checkId,
            severity: 'medium',
            message: 'degraded_review scenario remained ready; consider stricter thresholds.',
            field: 'scenario:degraded_review'
        });
        score -= 2;
    }

    if (risk && risk.posture === 'ready') {
        pushFinding(findings, {
            checkId,
            severity: 'critical',
            message: 'high_risk scenario remained ready; safety model is too permissive.',
            field: 'scenario:high_risk',
            blocking: true
        });
        score -= 6;
    }

    return {
        check: createCheck(checkId, 'Simulation Reliability', 20, findings, score),
        scenarioResults
    };
}

function shouldTreatAsBlocking(
    finding: SkillHardeningFinding,
    strict: boolean
): boolean {
    if (finding.blocking) return true;
    if (!strict) return false;
    return finding.severity === 'high' || finding.severity === 'critical';
}

function buildReasons({
    policy,
    deployable,
    hardeningGatePass,
    score,
    minScore,
    findings
}: {
    policy: SkillHardeningPolicy;
    deployable: boolean;
    hardeningGatePass: boolean;
    score: number;
    minScore: number;
    findings: SkillHardeningFinding[];
}): string[] {
    if (deployable) {
        if (hardeningGatePass) {
            return [
                `Hardening score ${score} meets deployable threshold ${minScore}.`,
                `Policy ${policy} permits execution and no blocking findings were detected.`
            ];
        }
        return [
            `Policy ${policy} permits execution even though hardening gate is below threshold ${minScore}.`,
            `Hardening score ${score} is tracked for remediation via report-only policy.`
        ];
    }

    const reasons = findings
        .filter((finding) => finding.blocking)
        .slice(0, 6)
        .map((finding) => `${finding.checkId}: ${finding.message}`);

    if (reasons.length === 0) {
        reasons.push(`Hardening score ${score} is below deployable threshold ${minScore} under policy ${policy}.`);
    }

    return reasons;
}

export function assessSkillImplementationHardening(
    implementation: SkillImplementation,
    {
        source = DEFAULT_SOURCE,
        policy = 'enforce',
        minDeployableScore = DEFAULT_MIN_DEPLOYABLE_SCORE,
        strict = true,
        profile = null,
        resolvedPolicy = undefined,
        scenarios = DEFAULT_SCENARIOS
    }: SkillHardeningOptions = {}
): SkillHardeningReport {
    const normalizedSource = normalizeSource(source);
    const effectivePolicy = resolvedPolicy || resolveSkillHardeningPolicy({
        source: normalizedSource,
        skillId: implementation.skillId,
        skillName: implementation.skillName,
        domain: implementation.domain,
        domainSlug: implementation.domainSlug,
        archetype: implementation.runtimeProfile?.archetype || ''
    }, {
        profile,
        policy: normalizePolicy(policy, 'enforce'),
        minDeployableScore: normalizeMinScore(minDeployableScore),
        strict: normalizeStrict(strict, true)
    });
    const normalizedMinScore = normalizeMinScore(effectivePolicy.minDeployableScore);
    const normalizedStrict = normalizeStrict(effectivePolicy.strict, true);

    const checkIdentityResult = checkIdentity(implementation);
    const checkGuideResult = checkImplementationGuide(implementation);
    const checkRuntimeResult = checkRuntimeContract(implementation);
    const checkOrchestrationResult = checkOrchestrationSafety(implementation);
    const simulationResult = checkSimulation(implementation, scenarios);

    const checks = [
        checkIdentityResult,
        checkGuideResult,
        checkRuntimeResult,
        checkOrchestrationResult,
        simulationResult.check
    ];
    const findings = checks.flatMap((check) => check.findings);
    const blockingFindings = findings.filter((finding) => shouldTreatAsBlocking(finding, normalizedStrict)).length;
    const totalScore = checks.reduce((sum, check) => sum + check.score, 0);
    const hardeningScore = roundScore(totalScore);
    const hardeningGatePass = blockingFindings === 0 && hardeningScore >= normalizedMinScore;
    const deployable = effectivePolicy.policy === 'enforce'
        ? hardeningGatePass
        : true;

    return {
        generatedAt: new Date().toISOString(),
        source: normalizedSource,
        skillId: implementation.skillId,
        skillName: implementation.skillName,
        title: implementation.title,
        deployable,
        hardeningGatePass,
        hardeningScore,
        blockingFindings,
        checks,
        findings,
        scenarioResults: simulationResult.scenarioResults,
        appliedPolicy: effectivePolicy,
        reasons: buildReasons({
            policy: effectivePolicy.policy,
            deployable,
            hardeningGatePass,
            score: hardeningScore,
            minScore: normalizedMinScore,
            findings
        })
    };
}

function initSourceCounts(): Record<SkillHardeningSource, number> {
    return {
        manifest: 0,
        external: 0,
        runtime: 0
    };
}

function initPolicyUsageCounts(): Record<SkillHardeningPolicy, number> {
    return {
        off: 0,
        report: 0,
        enforce: 0
    };
}

function summarizeBatch(reports: SkillHardeningReport[]): SkillHardeningBatchSummary {
    const sourceCounts = initSourceCounts();
    const policyUsage = initPolicyUsageCounts();
    let scoreSum = 0;
    let minScore = Number.POSITIVE_INFINITY;
    let maxScore = Number.NEGATIVE_INFINITY;
    let deployable = 0;
    let blockingFindings = 0;
    let strictCount = 0;

    for (const report of reports) {
        sourceCounts[report.source] += 1;
        policyUsage[report.appliedPolicy.policy] += 1;
        if (report.appliedPolicy.strict) strictCount++;
        scoreSum += report.hardeningScore;
        minScore = Math.min(minScore, report.hardeningScore);
        maxScore = Math.max(maxScore, report.hardeningScore);
        blockingFindings += report.blockingFindings;
        if (report.deployable) deployable++;
    }

    const evaluated = reports.length;
    const nonDeployable = Math.max(0, evaluated - deployable);

    return {
        generatedAt: new Date().toISOString(),
        sourceCounts,
        policyUsage,
        strictCount,
        evaluated,
        deployable,
        nonDeployable,
        averageScore: evaluated > 0 ? Number((scoreSum / evaluated).toFixed(2)) : 0,
        minScore: evaluated > 0 ? minScore : 0,
        maxScore: evaluated > 0 ? maxScore : 0,
        blockingFindings
    };
}

export function assessSkillImplementationHardeningBatch(
    entries: SkillHardeningBatchEntry[],
    options: SkillHardeningBatchOptions = {}
): SkillHardeningBatchReport {
    const fallbackPolicy = normalizePolicy(options.policy, 'enforce');
    const fallbackMinDeployableScore = normalizeMinScore(options.minDeployableScore);
    const fallbackStrict = normalizeStrict(options.strict, true);
    const profile = normalizeSkillHardeningProfile(options.profile, {
        policy: fallbackPolicy,
        minDeployableScore: fallbackMinDeployableScore,
        strict: fallbackStrict
    });

    const reports = entries.map((entry) => {
        const source = normalizeSource(entry.source, DEFAULT_SOURCE);
        const resolvedPolicy = resolveSkillHardeningPolicy({
            source,
            skillId: entry.implementation.skillId,
            skillName: entry.implementation.skillName,
            domain: entry.implementation.domain,
            domainSlug: entry.implementation.domainSlug,
            archetype: entry.implementation.runtimeProfile?.archetype || ''
        }, {
            profile
        });

        return assessSkillImplementationHardening(entry.implementation, {
            source,
            resolvedPolicy,
            scenarios: options.scenarios
        });
    });

    reports.sort((a, b) => {
        if (a.deployable !== b.deployable) return a.deployable ? 1 : -1;
        if (a.hardeningScore !== b.hardeningScore) return a.hardeningScore - b.hardeningScore;
        if (a.source !== b.source) return a.source.localeCompare(b.source);
        return a.skillId - b.skillId;
    });

    return {
        generatedAt: new Date().toISOString(),
        minDeployableScore: profile.defaultPolicy.minDeployableScore,
        strict: profile.defaultPolicy.strict,
        profile,
        summary: summarizeBatch(reports),
        reports
    };
}

export function makeSkillDeployabilityKey(source: SkillHardeningSource, skillId: number): string {
    return `${source}:${skillId}`;
}

export function buildSkillDeployabilityIndex(
    batchReport: SkillHardeningBatchReport
): SkillDeployabilityIndex {
    const entries: SkillDeployabilityIndexEntry[] = batchReport.reports.map((report) => ({
        key: makeSkillDeployabilityKey(report.source, report.skillId),
        source: report.source,
        skillId: report.skillId,
        skillName: report.skillName,
        title: report.title,
        policy: report.appliedPolicy.policy,
        minDeployableScore: report.appliedPolicy.minDeployableScore,
        strict: report.appliedPolicy.strict,
        matchedRuleIds: report.appliedPolicy.matchedRuleIds,
        deployable: report.deployable,
        hardeningGatePass: report.hardeningGatePass,
        hardeningScore: report.hardeningScore,
        blockingFindings: report.blockingFindings,
        generatedAt: report.generatedAt
    }));

    entries.sort((a, b) => {
        if (a.source !== b.source) return a.source.localeCompare(b.source);
        return a.skillId - b.skillId;
    });

    return {
        version: 1,
        generatedAt: new Date().toISOString(),
        profile: batchReport.profile,
        entries
    };
}

export function indexSkillDeployabilityByKey(
    index: SkillDeployabilityIndex
): Map<string, SkillDeployabilityIndexEntry> {
    const map = new Map<string, SkillDeployabilityIndexEntry>();
    const entries = Array.isArray(index?.entries) ? index.entries : [];
    for (const entry of entries) {
        if (!entry || typeof entry !== 'object') continue;
        const key = typeof entry.key === 'string' && entry.key.trim()
            ? entry.key.trim()
            : makeSkillDeployabilityKey(entry.source, entry.skillId);
        map.set(key, entry);
    }
    return map;
}

export function isSkillExecutionAllowed({
    policy = undefined,
    report
}: {
    policy?: SkillHardeningPolicy;
    report: SkillHardeningReport;
}): boolean {
    const effectivePolicy = normalizePolicy(policy ?? report?.appliedPolicy?.policy, 'enforce');
    if (effectivePolicy === 'off') return true;
    if (effectivePolicy === 'report') return true;
    return Boolean(report?.deployable);
}
