import { buildTaskRequest } from '../../../swarm-protocol/index.js';
import type { CognitionTaskDag, CognitionTaskNode, RiskTier } from './dag-compiler.js';
import { assertValidDag } from './dag-compiler.js';

type SwarmTaskRequest = ReturnType<typeof buildTaskRequest>;

const DEFAULT_RISK_TARGETS: Record<RiskTier, string> = {
    low: 'agent:ops',
    medium: 'agent:ops',
    high: 'agent:ops:high-risk',
    critical: 'agent:ops:critical',
    unknown: 'agent:ops'
};

export type PackageOptions = {
    fromAgentId?: string;
    defaultTarget?: string;
    targetByRisk?: Partial<Record<RiskTier, string>>;
    targetByOwner?: Record<string, string>;
    includeApprovalPending?: boolean;
    createdAtBase?: number;
    constraints?: string[];
};

type BlockedTaskMetadata = {
    followUp: {
        requiredApprovers: string[];
        approverTargets: string[];
        ticket: string | null;
    };
    traceability: {
        blockedTraceId: string;
        releaseKey: string;
        releaseReady: boolean;
    };
    releaseTemplate: {
        from: string;
        target: string;
        priority: SwarmTaskRequest['priority'];
        task: string;
        context: Record<string, unknown>;
        constraints?: string[];
    };
};

export type BlockedTask = {
    taskId: string;
    recommendationId: string;
    reason: string;
    policyGate: CognitionTaskNode['policyGate'];
    dependencies: string[];
    metadata?: BlockedTaskMetadata;
};

export type PackagedTaskDag = {
    version: 1;
    generatedAt: string;
    requests: SwarmTaskRequest[];
    blocked: BlockedTask[];
    stats: {
        totalTasks: number;
        packagedTasks: number;
        blockedTasks: number;
        approvalRequiredCount: number;
    };
};

function resolveTarget(task: CognitionTaskNode, options: Required<Pick<PackageOptions, 'defaultTarget'>> & PackageOptions): string {
    if (task.owner && options.targetByOwner && options.targetByOwner[task.owner]) {
        return options.targetByOwner[task.owner] as string;
    }

    if (options.targetByRisk && options.targetByRisk[task.riskTier]) {
        return options.targetByRisk[task.riskTier] as string;
    }

    return DEFAULT_RISK_TARGETS[task.riskTier] || options.defaultTarget;
}

function buildTaskText(task: CognitionTaskNode): string {
    const primaryAction = task.actions[0] ?? `Execute ${task.title}`;
    return `[${task.priority}] ${task.title}. ${primaryAction}`;
}

function normalizeOptionalString(value: unknown): string | null {
    if (typeof value !== 'string') return null;
    const trimmed = value.trim();
    return trimmed ? trimmed : null;
}

function normalizeApproverTarget(approver: string): string {
    const trimmed = approver.trim();
    if (!trimmed) return 'agent:ops';
    if (trimmed.startsWith('agent:')) return trimmed;

    const slug = trimmed
        .toLowerCase()
        .replace(/[^a-z0-9:_-]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

    if (slug.startsWith('agent:')) return slug;
    return `agent:${slug || 'ops'}`;
}

function extractRequiredApprovers(task: CognitionTaskNode): string[] {
    const passthrough = task.policyGate.passthrough;
    if (!passthrough || typeof passthrough !== 'object' || Array.isArray(passthrough)) {
        return [];
    }

    const value = (passthrough as Record<string, unknown>).requiredApprovers;
    if (!Array.isArray(value)) return [];

    return Array.from(new Set(
        value
            .map((entry) => normalizeOptionalString(entry))
            .filter((entry): entry is string => Boolean(entry))
    )).sort((left, right) => left.localeCompare(right));
}

function extractApprovalTicket(task: CognitionTaskNode): string | null {
    const passthrough = task.policyGate.passthrough;
    if (!passthrough || typeof passthrough !== 'object' || Array.isArray(passthrough)) {
        return null;
    }

    return normalizeOptionalString((passthrough as Record<string, unknown>).ticket);
}

function toDispatchPriority(priority: CognitionTaskNode['priority']): SwarmTaskRequest['priority'] {
    if (priority === 'P0') return 'critical';
    if (priority === 'P1') return 'high';
    if (priority === 'P2') return 'normal';
    return 'low';
}

function buildRequestContext(task: CognitionTaskNode): Record<string, unknown> {
    return {
        planner: 'cognition-core/task-packager',
        recommendationId: task.recommendationId,
        dependencies: task.dependencies,
        dependencyRecommendationIds: task.dependencyRecommendationIds,
        actions: task.actions,
        successCriteria: task.successCriteria,
        rollbackPlan: task.rollbackPlan,
        policyGate: task.policyGate
    };
}

export function packageDagForSwarm(
    dag: CognitionTaskDag,
    options: PackageOptions = {}
): PackagedTaskDag {
    assertValidDag(dag);

    const normalizedOptions = {
        fromAgentId: options.fromAgentId ?? 'agent:cognition-core',
        defaultTarget: options.defaultTarget ?? 'agent:ops',
        targetByRisk: options.targetByRisk ?? {},
        targetByOwner: options.targetByOwner ?? {},
        includeApprovalPending: options.includeApprovalPending === true,
        createdAtBase: Number.isFinite(Number(options.createdAtBase))
            ? Number(options.createdAtBase)
            : Date.now(),
        constraints: Array.isArray(options.constraints)
            ? options.constraints.filter((value) => typeof value === 'string' && value.trim())
            : []
    };

    const requests: SwarmTaskRequest[] = [];
    const blocked: BlockedTask[] = [];

    for (let index = 0; index < dag.tasks.length; index += 1) {
        const task = dag.tasks[index];
        const target = resolveTarget(task, normalizedOptions);
        const createdAt = normalizedOptions.createdAtBase + index;
        const constraints = [
            ...normalizedOptions.constraints,
            ...(task.policyGate.requiresHumanApproval ? ['human-approval-required'] : [])
        ];

        const requestContext = buildRequestContext(task);
        const requestPriority = toDispatchPriority(task.priority);
        const requestTask = buildTaskText(task);

        if (task.policyGate.requiresHumanApproval && !task.policyGate.gatePassed && !normalizedOptions.includeApprovalPending) {
            const requiredApprovers = extractRequiredApprovers(task);

            blocked.push({
                taskId: task.taskId,
                recommendationId: task.recommendationId,
                reason: 'awaiting_human_approval',
                policyGate: task.policyGate,
                dependencies: task.dependencies,
                metadata: {
                    followUp: {
                        requiredApprovers,
                        approverTargets: requiredApprovers.map((approver) => normalizeApproverTarget(approver)),
                        ticket: extractApprovalTicket(task)
                    },
                    traceability: {
                        blockedTraceId: `blocked:${task.taskId}`,
                        releaseKey: `release:${task.taskId}:${task.recommendationId}`,
                        releaseReady: false
                    },
                    releaseTemplate: {
                        from: normalizedOptions.fromAgentId,
                        target,
                        priority: requestPriority,
                        task: requestTask,
                        context: requestContext,
                        constraints: constraints.length > 0 ? constraints : undefined
                    }
                }
            });
            continue;
        }

        const request = buildTaskRequest({
            id: task.taskId,
            from: normalizedOptions.fromAgentId,
            target,
            priority: requestPriority,
            task: requestTask,
            context: requestContext,
            constraints: constraints.length > 0 ? constraints : undefined,
            createdAt
        });

        requests.push(request);
    }

    return {
        version: 1,
        generatedAt: new Date().toISOString(),
        requests,
        blocked,
        stats: {
            totalTasks: dag.tasks.length,
            packagedTasks: requests.length,
            blockedTasks: blocked.length,
            approvalRequiredCount: dag.tasks.filter((task) => task.policyGate.requiresHumanApproval).length
        }
    };
}
