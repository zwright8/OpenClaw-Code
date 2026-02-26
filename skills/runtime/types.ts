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
