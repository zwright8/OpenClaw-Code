export type SkillPosture = 'ready' | 'review_required' | 'critical';

export type SkillPriority = 'P0' | 'P1' | 'P2';

export type SkillScoringWeights = {
    truth: number;
    execution: number;
    safety: number;
    impact: number;
};

export type SkillPostureThresholds = {
    readyMin: number;
    reviewMin: number;
    reviewRisk: number;
    criticalRisk: number;
};

export type SkillRetryPolicy = {
    maxAttempts: number;
    baseDelayMs: number;
    backoff: 'exponential';
};

export type SkillOrchestrationProfile = {
    routingTag: string;
    approvalGates: string[];
    retryPolicy: SkillRetryPolicy;
    rollbackStrategy: string;
    components: string[];
};

export type SkillValidationProfile = {
    suites: string[];
    baselineRequired: boolean;
};

export type SkillRolloutProfile = {
    featureFlag: string;
    releaseCycles: number;
    telemetryAlerts: boolean;
};

export type SkillRuntimeProfile = {
    archetype: string;
    coreMethod: string;
    primaryArtifact: string;
    requiredSignals: string[];
    kpiFocus: string[];
    scoringWeights: SkillScoringWeights;
    postureThresholds: SkillPostureThresholds;
    orchestration: SkillOrchestrationProfile;
    validation: SkillValidationProfile;
    rollout: SkillRolloutProfile;
    scoringSeed: string;
};

export type SkillImplementation = {
    version: 1;
    sourceFile: string;
    skillId: number;
    skillName: string;
    title: string;
    domain: string;
    domainSlug: string;
    reason: string;
    implementationGuide: string[];
    runtimeProfile: SkillRuntimeProfile;
    traceability: {
        scopeStep: string;
        contractStep: string;
        coreStep: string;
        orchestrationStep: string;
        validationStep: string;
        rolloutStep: string;
    };
};

export type SkillManifestEntry = {
    id: number;
    name: string;
    title: string;
    domain: string;
    path: string;
    implementationPath: string;
    reason: string;
    stepCount: number;
    runtimeArchetype: string;
    coreMethod: string;
    primaryArtifact: string;
};

export type SkillRuntimeCatalogEntry = {
    id: number;
    name: string;
    domain: string;
    implementationPath: string;
    archetype: string;
    coreMethod: string;
    primaryArtifact: string;
};

export type SkillRuntimeCatalog = {
    version: number;
    sourceFile: string;
    generatedAt: string;
    count: number;
    entries: SkillRuntimeCatalogEntry[];
};

export type SkillRegistryFilters = {
    ids?: number[];
    names?: string[];
    domains?: string[];
    archetypes?: string[];
};

export type SkillExecutionInput = {
    missionId?: string;
    signalQuality?: number;
    evidenceCoverage?: number;
    confidenceHealth?: number;
    operationalReadiness?: number;
    harmPotential?: number;
    resourcePressure?: number;
    urgency?: number;
    impactPotential?: number;
    humanApprovalLatency?: number;
};

export type SkillExecutionSignals = {
    signalQuality: number;
    evidenceCoverage: number;
    confidenceHealth: number;
    operationalReadiness: number;
    harmPotential: number;
    resourcePressure: number;
    urgency: number;
    impactPotential: number;
    humanApprovalLatency: number;
};

export type SkillExecutionScores = {
    truthScore: number;
    executionScore: number;
    safetyScore: number;
    impactScore: number;
    riskScore: number;
    overallScore: number;
};

export type SkillExecutionOutput = {
    runId: string;
    missionId: string;
    skillId: number;
    skillName: string;
    title: string;
    domain: string;
    domainSlug: string;
    archetype: string;
    posture: SkillPosture;
    scores: SkillExecutionScores;
    signals: SkillExecutionSignals;
    kpiFocus: string[];
    deliverables: string[];
    actions: string[];
    approvalGates: string[];
    routingTag: string;
    rollbackStrategy: string;
    generatedAt: string;
};

export type SkillExecutionTask = {
    kind: 'task_request';
    id: string;
    from: string;
    to: string;
    task: string;
    priority: SkillPriority;
    context: Record<string, unknown>;
};

export type SkillExecutionTaskOptions = {
    fromAgentId?: string;
    toAgentId?: string;
};

export type SkillRolloutLane = 'now' | 'next' | 'hold';

export type SkillRolloutScenario = {
    name: string;
    weight: number;
    input: Required<Omit<SkillExecutionInput, 'missionId'>>;
};

export type SkillRolloutAssessment = {
    scenario: string;
    posture: SkillPosture;
    overallScore: number;
    riskScore: number;
};

export type SkillRolloutPlanEntry = {
    skillId: number;
    skillName: string;
    title: string;
    domain: string;
    domainSlug: string;
    archetype: string;
    lane: SkillRolloutLane;
    priority: SkillPriority;
    readinessIndex: number;
    riskIndex: number;
    postureDistribution: {
        ready: number;
        review_required: number;
        critical: number;
    };
    requiredApprovalGates: string[];
    featureFlag: string;
    reasons: string[];
    assessments: SkillRolloutAssessment[];
};

export type SkillRolloutPlanSummary = {
    laneCounts: Record<SkillRolloutLane, number>;
    topDomains: Array<{ domain: string; count: number; }>;
    topArchetypes: Array<{ archetype: string; count: number; }>;
};

export type SkillRolloutPlan = {
    generatedAt: string;
    totalSkills: number;
    scenarios: SkillRolloutScenario[];
    summary: SkillRolloutPlanSummary;
    entries: SkillRolloutPlanEntry[];
};

export type SkillRolloutWaveEntry = {
    skillId: number;
    skillName: string;
    title: string;
    domain: string;
    domainSlug: string;
    archetype: string;
    lane: Exclude<SkillRolloutLane, 'hold'>;
    waveId: string;
    waveIndex: number;
    executionOrder: number;
    priority: SkillPriority;
    readinessIndex: number;
    riskIndex: number;
    featureFlag: string;
    requiredApprovalGates: string[];
    reasons: string[];
};

export type SkillRolloutWave = {
    waveId: string;
    lane: Exclude<SkillRolloutLane, 'hold'>;
    waveIndex: number;
    capacity: number;
    entryCount: number;
    avgReadiness: number;
    avgRisk: number;
    domainLoad: Array<{ domain: string; count: number; }>;
    entries: SkillRolloutWaveEntry[];
};

export type SkillOversightQueueEntry = {
    position: number;
    skillId: number;
    skillName: string;
    title: string;
    domain: string;
    archetype: string;
    readinessIndex: number;
    riskIndex: number;
    priority: SkillPriority;
    reasons: string[];
    requiredApprovalGates: string[];
};

export type SkillRolloutWaveConfig = {
    nowWaveCapacity: number;
    nextWaveCapacity: number;
    maxPerDomainPerWave: number;
};

export type SkillRolloutWavePlanSummary = {
    scheduledSkills: number;
    oversightSkills: number;
    waveCounts: {
        now: number;
        next: number;
    };
    avgWaveFillRate: number;
};

export type SkillRolloutWavePlan = {
    generatedAt: string;
    sourcePlanGeneratedAt: string;
    config: SkillRolloutWaveConfig;
    summary: SkillRolloutWavePlanSummary;
    waves: SkillRolloutWave[];
    oversightQueue: SkillOversightQueueEntry[];
};
