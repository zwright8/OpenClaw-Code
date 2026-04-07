import { randomUUID } from 'crypto';
import { z } from 'zod';
import { AgentId, TaskPriority, TaskRequest, Timestamp } from './schemas.js';
import { buildTaskRequest } from './task-orchestrator.js';

export const WorldSimProvider = z.enum(['mirofish']);

export const WorldSimOperation = z.enum([
    'build_world_graph',
    'prepare_world_simulation',
    'run_world_simulation',
    'generate_world_report',
    'interview_simulated_agents'
]);

export const WorldSimSeedKind = z.enum([
    'news',
    'policy',
    'financial_signal',
    'report',
    'document',
    'story',
    'transcript',
    'dataset',
    'other'
]);

export const WorldSimSeedMaterial = z.object({
    id: z.string().min(1),
    kind: WorldSimSeedKind.default('document'),
    title: z.string().min(1),
    sourceUri: z.string().min(1).optional(),
    inlineText: z.string().min(1).optional(),
    notes: z.string().min(1).optional()
}).refine((value) => Boolean(value.sourceUri || value.inlineText || value.notes), {
    message: 'World sim seed materials must include sourceUri, inlineText, or notes'
});

export const WorldSimOntologyEntityType = z.object({
    name: z.string().min(1),
    description: z.string().min(1).optional()
});

export const WorldSimOntologyRelationType = z.object({
    name: z.string().min(1),
    sourceType: z.string().min(1).optional(),
    targetType: z.string().min(1).optional(),
    description: z.string().min(1).optional()
});

export const WorldSimOntology = z.object({
    entityTypes: z.array(WorldSimOntologyEntityType).default([]),
    relationTypes: z.array(WorldSimOntologyRelationType).default([])
});

export const WorldSimResultRouting = z.object({
    artifactDir: z.string().min(1).optional(),
    publishTaskResult: z.boolean().default(true),
    memoryContractType: z.enum(['report', 'handoff']).default('report')
});

export const WorldSimGovernance = z.object({
    sensitivity: z.enum(['low', 'medium', 'high']).default('medium'),
    requiresHumanApproval: z.boolean().default(false),
    maxSimulationRounds: z.number().int().positive().max(200).default(20)
});

export const WorldSimBuildGraphRequest = z.object({
    worldId: z.string().min(1),
    projectId: z.string().min(1),
    objective: z.string().min(1),
    scenarioPrompt: z.string().min(1),
    seedMaterials: z.array(WorldSimSeedMaterial).min(1),
    ontology: WorldSimOntology.optional(),
    graphName: z.string().min(1).default('OpenClaw World Sim Graph'),
    chunkSize: z.number().int().positive().max(4_000).default(500),
    chunkOverlap: z.number().int().nonnegative().max(1_000).default(50),
    tags: z.array(z.string().min(1)).default([]),
    governance: WorldSimGovernance.default({}),
    resultRouting: WorldSimResultRouting.default({})
});

export const WorldSimBuildGraphTaskContext = z.object({
    contract: z.literal('world_sim_task'),
    contractVersion: z.literal(1),
    provider: WorldSimProvider.default('mirofish'),
    operation: z.literal('build_world_graph'),
    requestedBy: AgentId,
    requestedAt: Timestamp,
    correlationId: z.string().min(1).optional(),
    replyTarget: AgentId,
    request: WorldSimBuildGraphRequest
});

export const WorldSimBuildGraphTaskSpec = z.object({
    from: AgentId,
    target: AgentId.default('agent:world-sim'),
    priority: TaskPriority.default('high'),
    task: z.string().min(1).optional(),
    constraints: z.array(z.string().min(1)).default([]),
    correlationId: z.string().min(1).optional(),
    replyTarget: AgentId.optional(),
    provider: WorldSimProvider.default('mirofish'),
    request: WorldSimBuildGraphRequest,
    id: z.string().uuid().optional(),
    createdAt: Timestamp.optional()
});

export function buildWorldSimBuildGraphTaskRequest(taskSpec) {
    const parsed = WorldSimBuildGraphTaskSpec.parse(taskSpec);
    const createdAt = parsed.createdAt ?? Date.now();
    const task = parsed.task
        ?? `Build world graph for ${parsed.request.projectId} using ${parsed.request.seedMaterials.length} seed materials`;

    return buildTaskRequest({
        id: parsed.id ?? randomUUID(),
        from: parsed.from,
        target: parsed.target,
        priority: parsed.priority,
        task,
        constraints: parsed.constraints,
        createdAt,
        context: WorldSimBuildGraphTaskContext.parse({
            contract: 'world_sim_task',
            contractVersion: 1,
            provider: parsed.provider,
            operation: 'build_world_graph',
            requestedBy: parsed.from,
            requestedAt: createdAt,
            correlationId: parsed.correlationId,
            replyTarget: parsed.replyTarget ?? parsed.from,
            request: parsed.request
        })
    });
}
export function parseWorldSimBuildGraphTaskRequest(taskRequestPayload) {
    const taskRequest = TaskRequest.parse(taskRequestPayload);
    return {
        ...taskRequest,
        context: WorldSimBuildGraphTaskContext.parse(taskRequest.context)
    };
}
