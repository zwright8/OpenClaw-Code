import crypto from 'node:crypto';

export type TaskPriority = 'P0' | 'P1' | 'P2' | 'P3';
export type RiskTier = 'low' | 'medium' | 'high' | 'critical' | 'unknown';

export type TaskRollbackPlan = {
    trigger: string;
    owner: string | null;
    steps: string[];
    dataRecovery: string | null;
};

export type TaskPolicyGate = {
    riskTier: RiskTier;
    requiresHumanApproval: boolean;
    approvalStatus: string | null;
    approvalMarkerPresent: boolean;
    gatePassed: boolean;
    passthrough: Record<string, unknown> | null;
};

export type CognitionTaskNode = {
    taskId: string;
    recommendationId: string;
    title: string;
    priority: TaskPriority;
    priorityScore: number;
    riskTier: RiskTier;
    owner: string | null;
    dependencies: string[];
    dependencyRecommendationIds: string[];
    actions: string[];
    successCriteria: string[];
    rollbackPlan: TaskRollbackPlan;
    policyGate: TaskPolicyGate;
    source: Record<string, unknown>;
};

export type CognitionTaskDagEdge = {
    id: string;
    from: string;
    to: string;
    kind: 'depends_on';
};

export type CognitionTaskDag = {
    version: 1;
    generatedAt: string;
    tasks: CognitionTaskNode[];
    edges: CognitionTaskDagEdge[];
    summary: {
        taskCount: number;
        edgeCount: number;
        approvalRequiredCount: number;
        approvalPendingCount: number;
        gateBlockedCount: number;
        rootTaskCount: number;
        maxDepth: number;
    };
};

type NormalizedRecommendation = {
    recommendationId: string;
    title: string;
    priority: TaskPriority;
    priorityScore: number;
    riskTier: RiskTier;
    requiresHumanApproval: boolean;
    approvalStatus: string | null;
    policyPassthrough: Record<string, unknown> | null;
    owner: string | null;
    dependencies: string[];
    actions: string[];
    successCriteria: string[];
    rollbackPlan: TaskRollbackPlan;
    source: Record<string, unknown>;
    originalIndex: number;
};

const PRIORITY_SCORE: Record<TaskPriority, number> = {
    P0: 0,
    P1: 1,
    P2: 2,
    P3: 3
};

const HIGH_RISK_TIERS = new Set<RiskTier>(['high', 'critical']);

function asRecord(value: unknown): Record<string, unknown> {
    return value && typeof value === 'object' && !Array.isArray(value)
        ? (value as Record<string, unknown>)
        : {};
}

function normalizeStringList(values: unknown): string[] {
    if (Array.isArray(values)) {
        return values
            .map((value) => String(value ?? '').trim())
            .filter(Boolean);
    }

    if (typeof values === 'string') {
        const trimmed = values.trim();
        return trimmed ? [trimmed] : [];
    }

    return [];
}

function uniqueSorted(values: string[]): string[] {
    return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

function toPriority(value: unknown): TaskPriority {
    if (typeof value === 'number' && Number.isFinite(value)) {
        if (value <= 0) return 'P0';
        if (value <= 1) return 'P1';
        if (value <= 2) return 'P2';
        return 'P3';
    }

    const normalized = String(value ?? '').trim().toLowerCase();
    if (normalized === 'p0' || normalized === 'critical') return 'P0';
    if (normalized === 'p1' || normalized === 'high') return 'P1';
    if (normalized === 'p2' || normalized === 'medium' || normalized === 'normal') return 'P2';
    if (normalized === 'p3' || normalized === 'low') return 'P3';
    return 'P2';
}

function toRiskTier(value: unknown): RiskTier {
    const normalized = String(value ?? '').trim().toLowerCase();
    if (normalized === 'low' || normalized === 'medium' || normalized === 'high' || normalized === 'critical') {
        return normalized;
    }
    return 'unknown';
}

function normalizeApprovalStatus(value: unknown): string | null {
    if (typeof value !== 'string') {
        return null;
    }

    const normalized = value.trim().toLowerCase();
    if (!normalized) return null;
    if (['approved', 'granted', 'accepted'].includes(normalized)) return 'approved';
    if (['pending', 'required', 'requested', 'awaiting_approval'].includes(normalized)) return 'pending';
    if (['denied', 'rejected'].includes(normalized)) return 'denied';
    if (['not_required', 'none', 'n/a'].includes(normalized)) return 'not_required';
    return normalized;
}

function extractDependencies(record: Record<string, unknown>): string[] {
    const merged = [
        ...normalizeStringList(record.dependencies),
        ...normalizeStringList(record.dependsOn),
        ...normalizeStringList(record.prerequisiteIds),
        ...normalizeStringList(record.blockedBy)
    ];

    return uniqueSorted(merged);
}

function extractActions(record: Record<string, unknown>, title: string): string[] {
    const merged = [
        ...normalizeStringList(record.actions),
        ...normalizeStringList(record.commands),
        ...normalizeStringList(record.command),
        ...normalizeStringList(asRecord(record.execution).actions)
    ];

    const deduped = uniqueSorted(merged);
    if (deduped.length > 0) {
        return deduped;
    }

    return [`Execute recommendation: ${title}`];
}

function extractSuccessCriteria(record: Record<string, unknown>, recommendationId: string): string[] {
    const direct = normalizeStringList(record.successCriteria);
    if (direct.length > 0) {
        return uniqueSorted(direct);
    }

    const verificationPlan = record.verificationPlan;
    if (typeof verificationPlan === 'string') {
        return [verificationPlan.trim()].filter(Boolean);
    }

    if (Array.isArray(verificationPlan)) {
        return uniqueSorted(normalizeStringList(verificationPlan));
    }

    const verificationRecord = asRecord(verificationPlan);
    const fromObject = [
        ...normalizeStringList(verificationRecord.successCriteria),
        ...normalizeStringList(verificationRecord.criteria),
        ...normalizeStringList(verificationRecord.checks)
    ];

    if (fromObject.length > 0) {
        return uniqueSorted(fromObject);
    }

    return [`Verify ${recommendationId} meets expected outcome`];
}

function extractRollbackPlan(record: Record<string, unknown>, owner: string | null): TaskRollbackPlan {
    const source = asRecord(record.rollbackPlan);
    const fallback = asRecord(record.rollback);
    const merged = {
        ...fallback,
        ...source
    };

    const trigger = typeof merged.trigger === 'string' && merged.trigger.trim()
        ? merged.trigger.trim()
        : 'Regression, policy breach, or failed verification';

    const planOwner = typeof merged.owner === 'string' && merged.owner.trim()
        ? merged.owner.trim()
        : owner;

    const steps = uniqueSorted([
        ...normalizeStringList(merged.steps),
        ...normalizeStringList(merged.actions)
    ]);

    const rollbackSteps = steps.length > 0
        ? steps
        : [
            'Disable or revert the change',
            'Restore the last known good state',
            'Re-run verification checks'
        ];

    const dataRecovery = typeof merged.dataRecovery === 'string' && merged.dataRecovery.trim()
        ? merged.dataRecovery.trim()
        : null;

    return {
        trigger,
        owner: planOwner,
        steps: rollbackSteps,
        dataRecovery
    };
}

function deterministicUuid(seed: string): string {
    const hash = crypto.createHash('sha1').update(seed).digest();
    const bytes = Uint8Array.from(hash.subarray(0, 16));
    bytes[6] = (bytes[6] & 0x0f) | 0x50;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const hex = [...bytes].map((part) => part.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function buildAdjacency(tasks: CognitionTaskNode[]): Map<string, string[]> {
    const adjacency = new Map<string, string[]>();
    for (const task of tasks) {
        adjacency.set(task.taskId, []);
    }

    for (const task of tasks) {
        for (const dependencyId of task.dependencies) {
            if (!adjacency.has(dependencyId)) continue;
            adjacency.get(dependencyId)?.push(task.taskId);
        }
    }

    for (const [nodeId, neighbors] of adjacency.entries()) {
        adjacency.set(nodeId, uniqueSorted(neighbors));
    }

    return adjacency;
}

export function normalizeRecommendations(recommendations: unknown[]): NormalizedRecommendation[] {
    return recommendations.map((candidate, index) => {
        const record = asRecord(candidate);
        const recommendationIdRaw = record.recommendationId ?? record.id ?? `rec-${index + 1}`;
        const recommendationId = String(recommendationIdRaw).trim() || `rec-${index + 1}`;
        const titleRaw = record.title ?? record.summary ?? recommendationId;
        const title = String(titleRaw).trim() || recommendationId;
        const priority = toPriority(record.priority);
        const priorityScore = PRIORITY_SCORE[priority];
        const riskTier = toRiskTier(record.riskTier ?? asRecord(record.risk).tier ?? asRecord(record.risk).level);

        const explicitRequiresApproval = typeof record.requiresHumanApproval === 'boolean'
            ? record.requiresHumanApproval
            : null;

        const approvalStatus = normalizeApprovalStatus(
            record.approvalStatus ?? asRecord(record.approval).status
        );

        const requiresHumanApproval = explicitRequiresApproval !== null
            ? explicitRequiresApproval
            : HIGH_RISK_TIERS.has(riskTier);

        const ownerRaw = record.owner ?? record.ownerSuggestion ?? record.routeTo ?? asRecord(record.routing).owner;
        const owner = typeof ownerRaw === 'string' && ownerRaw.trim()
            ? ownerRaw.trim()
            : null;

        const dependencies = extractDependencies(record);
        const actions = extractActions(record, title);
        const successCriteria = extractSuccessCriteria(record, recommendationId);
        const rollbackPlan = extractRollbackPlan(record, owner);

        const policyPassthrough = asRecord(record.policyGate);
        const policyPayload = Object.keys(policyPassthrough).length > 0
            ? policyPassthrough
            : asRecord(record.approval);

        return {
            recommendationId,
            title,
            priority,
            priorityScore,
            riskTier,
            requiresHumanApproval,
            approvalStatus,
            policyPassthrough: Object.keys(policyPayload).length > 0 ? policyPayload : null,
            owner,
            dependencies,
            actions,
            successCriteria,
            rollbackPlan,
            source: record,
            originalIndex: index
        };
    }).sort((a, b) => {
        if (a.priorityScore !== b.priorityScore) {
            return a.priorityScore - b.priorityScore;
        }

        const byId = a.recommendationId.localeCompare(b.recommendationId);
        if (byId !== 0) {
            return byId;
        }

        return a.originalIndex - b.originalIndex;
    });
}

export function compileRecommendationDag(
    recommendations: unknown[],
    options: {
        generatedAt?: string;
        failOnInvalidDependencies?: boolean;
    } = {}
): CognitionTaskDag {
    if (!Array.isArray(recommendations)) {
        throw new Error('recommendations must be an array');
    }

    const normalized = normalizeRecommendations(recommendations);
    const byRecommendationId = new Map<string, NormalizedRecommendation>();
    for (const item of normalized) {
        if (byRecommendationId.has(item.recommendationId)) {
            throw new Error(`Duplicate recommendationId: ${item.recommendationId}`);
        }
        byRecommendationId.set(item.recommendationId, item);
    }

    const recommendationToTaskId = new Map<string, string>();
    for (const recommendation of normalized) {
        recommendationToTaskId.set(
            recommendation.recommendationId,
            deterministicUuid(`cognition-task:${recommendation.recommendationId}`)
        );
    }

    const dependencyErrors: string[] = [];

    const tasks: CognitionTaskNode[] = normalized.map((recommendation) => {
        const dependencyRecommendationIds = recommendation.dependencies
            .filter((dependencyId) => {
                if (dependencyId === recommendation.recommendationId) {
                    dependencyErrors.push(`Self dependency detected for ${recommendation.recommendationId}`);
                    return false;
                }

                if (!byRecommendationId.has(dependencyId)) {
                    dependencyErrors.push(
                        `Unknown dependency \"${dependencyId}\" referenced by ${recommendation.recommendationId}`
                    );
                    return false;
                }

                return true;
            });

        const dependencies = uniqueSorted(
            dependencyRecommendationIds
                .map((dependencyId) => recommendationToTaskId.get(dependencyId) ?? '')
                .filter(Boolean)
        );

        const approvalMarkerPresent = recommendation.approvalStatus !== null;
        const gatePassed = !recommendation.requiresHumanApproval
            || recommendation.approvalStatus === 'approved'
            || recommendation.approvalStatus === 'not_required';

        const taskId = recommendationToTaskId.get(recommendation.recommendationId) as string;

        return {
            taskId,
            recommendationId: recommendation.recommendationId,
            title: recommendation.title,
            priority: recommendation.priority,
            priorityScore: recommendation.priorityScore,
            riskTier: recommendation.riskTier,
            owner: recommendation.owner,
            dependencies,
            dependencyRecommendationIds: uniqueSorted(dependencyRecommendationIds),
            actions: recommendation.actions,
            successCriteria: recommendation.successCriteria,
            rollbackPlan: recommendation.rollbackPlan,
            policyGate: {
                riskTier: recommendation.riskTier,
                requiresHumanApproval: recommendation.requiresHumanApproval,
                approvalStatus: recommendation.approvalStatus,
                approvalMarkerPresent,
                gatePassed,
                passthrough: recommendation.policyPassthrough
            },
            source: recommendation.source
        };
    });

    if (dependencyErrors.length > 0 && options.failOnInvalidDependencies !== false) {
        throw new Error(`Invalid dependencies:\n${dependencyErrors.join('\n')}`);
    }

    const edges: CognitionTaskDagEdge[] = [];
    for (const task of tasks) {
        for (const dependencyId of task.dependencies) {
            edges.push({
                id: `${dependencyId}->${task.taskId}`,
                from: dependencyId,
                to: task.taskId,
                kind: 'depends_on'
            });
        }
    }

    edges.sort((a, b) => a.id.localeCompare(b.id));

    const dag: CognitionTaskDag = {
        version: 1,
        generatedAt: options.generatedAt ?? new Date().toISOString(),
        tasks,
        edges,
        summary: {
            taskCount: tasks.length,
            edgeCount: edges.length,
            approvalRequiredCount: tasks.filter((task) => task.policyGate.requiresHumanApproval).length,
            approvalPendingCount: tasks.filter((task) => task.policyGate.approvalStatus === 'pending').length,
            gateBlockedCount: tasks.filter((task) => !task.policyGate.gatePassed).length,
            rootTaskCount: tasks.filter((task) => task.dependencies.length === 0).length,
            maxDepth: 0
        }
    };

    const validity = validateDag(dag);
    if (!validity.valid) {
        throw new Error(`Invalid task DAG:\n${validity.errors.join('\n')}`);
    }

    dag.summary.maxDepth = computeDagDepth(dag);
    return dag;
}

function computeDagDepth(dag: CognitionTaskDag): number {
    const inDegree = new Map<string, number>();
    const adjacency = buildAdjacency(dag.tasks);
    const depth = new Map<string, number>();

    for (const task of dag.tasks) {
        inDegree.set(task.taskId, task.dependencies.length);
        depth.set(task.taskId, 0);
    }

    const queue = dag.tasks
        .filter((task) => (inDegree.get(task.taskId) ?? 0) === 0)
        .map((task) => task.taskId)
        .sort((a, b) => a.localeCompare(b));

    let cursor = 0;
    while (cursor < queue.length) {
        const current = queue[cursor++];
        const currentDepth = depth.get(current) ?? 0;

        for (const next of adjacency.get(current) ?? []) {
            const nextDepth = Math.max(depth.get(next) ?? 0, currentDepth + 1);
            depth.set(next, nextDepth);
            inDegree.set(next, (inDegree.get(next) ?? 0) - 1);
            if ((inDegree.get(next) ?? 0) === 0) {
                queue.push(next);
            }
        }
    }

    return Math.max(0, ...depth.values());
}

export function validateDag(dag: CognitionTaskDag): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!dag || typeof dag !== 'object') {
        return { valid: false, errors: ['DAG payload is missing'] };
    }

    if (!Array.isArray(dag.tasks)) {
        return { valid: false, errors: ['DAG tasks must be an array'] };
    }

    const taskIds = new Set<string>();
    for (const task of dag.tasks) {
        if (!task || typeof task !== 'object') {
            errors.push('Task entry is not an object');
            continue;
        }

        if (typeof task.taskId !== 'string' || !task.taskId.trim()) {
            errors.push('Task is missing taskId');
            continue;
        }

        if (taskIds.has(task.taskId)) {
            errors.push(`Duplicate taskId: ${task.taskId}`);
            continue;
        }

        taskIds.add(task.taskId);
    }

    for (const task of dag.tasks) {
        if (!taskIds.has(task.taskId)) continue;

        if (!Array.isArray(task.dependencies)) {
            errors.push(`Task ${task.taskId} dependencies must be an array`);
            continue;
        }

        for (const dependencyId of task.dependencies) {
            if (!taskIds.has(dependencyId)) {
                errors.push(`Task ${task.taskId} has unknown dependency ${dependencyId}`);
            }
            if (dependencyId === task.taskId) {
                errors.push(`Task ${task.taskId} cannot depend on itself`);
            }
        }
    }

    const cycleCheck = detectCycles(dag.tasks);
    if (cycleCheck.hasCycle) {
        errors.push(`Cycle detected: ${cycleCheck.path.join(' -> ')}`);
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

function detectCycles(tasks: CognitionTaskNode[]): { hasCycle: boolean; path: string[] } {
    const byTaskId = new Map(tasks.map((task) => [task.taskId, task]));
    const visited = new Set<string>();
    const active = new Set<string>();
    const stack: string[] = [];

    function dfs(taskId: string): string[] | null {
        if (active.has(taskId)) {
            const startIndex = stack.indexOf(taskId);
            return [...stack.slice(startIndex), taskId];
        }

        if (visited.has(taskId)) {
            return null;
        }

        visited.add(taskId);
        active.add(taskId);
        stack.push(taskId);

        const node = byTaskId.get(taskId);
        for (const dependencyId of node?.dependencies ?? []) {
            const path = dfs(dependencyId);
            if (path) {
                return path;
            }
        }

        stack.pop();
        active.delete(taskId);
        return null;
    }

    for (const task of tasks) {
        const path = dfs(task.taskId);
        if (path) {
            return { hasCycle: true, path };
        }
    }

    return { hasCycle: false, path: [] };
}

export function assertValidDag(dag: CognitionTaskDag): void {
    const validation = validateDag(dag);
    if (!validation.valid) {
        throw new Error(`DAG validation failed:\n${validation.errors.join('\n')}`);
    }
}
