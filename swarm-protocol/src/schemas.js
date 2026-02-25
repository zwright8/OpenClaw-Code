import { z } from 'zod';

// --- Base Types ---

export const AgentId = z.string().describe("The unique identifier of the agent (e.g., 'agent:main:sub-1')");
export const Timestamp = z.number().int().describe("Unix timestamp in milliseconds");

// --- Task Protocol ---

export const TaskPriority = z.enum(['low', 'normal', 'high', 'critical']);

export const TaskRequest = z.object({
    kind: z.literal('task_request'),
    id: z.string().uuid(),
    from: AgentId,
    target: AgentId.optional(), // If broadcast or specific
    priority: TaskPriority.default('normal'),
    task: z.string().describe("Natural language description of the objective"),
    context: z.record(z.any()).optional().describe("Structured context data needed for the task"),
    constraints: z.array(z.string()).optional().describe("List of negative constraints (do nots)"),
    createdAt: Timestamp
});

export const TaskResult = z.object({
    kind: z.literal('task_result'),
    taskId: z.string().uuid().describe("Matches the request ID"),
    from: AgentId,
    status: z.enum(['success', 'failure', 'partial']),
    output: z.string().describe("Summary of work done"),
    artifacts: z.array(z.object({
        name: z.string(),
        path: z.string(),
        type: z.string().optional()
    })).optional().describe("Files created or modified"),
    metrics: z.record(z.number()).optional(),
    completedAt: Timestamp
});

// --- Signal Protocol ---

export const HeartbeatSignal = z.object({
    kind: z.literal('signal_heartbeat'),
    from: AgentId,
    status: z.enum(['idle', 'busy', 'error', 'offline']),
    load: z.number().min(0).max(1).optional().describe("Estimated load 0-1"),
    timestamp: Timestamp
});

// --- Handshake Protocol ---

export const HandshakeRequest = z.object({
    kind: z.literal('handshake_request'),
    id: z.string().uuid(),
    from: AgentId,
    supportedProtocols: z.array(z.string()).describe("List of supported protocol versions (e.g., ['swarm/1.0'])"),
    capabilities: z.array(z.string()).optional().describe("List of agent capabilities/skills"),
    timestamp: Timestamp
});

export const HandshakeResponse = z.object({
    kind: z.literal('handshake_response'),
    requestId: z.string().uuid().describe("Matches the handshake request ID"),
    from: AgentId,
    accepted: z.boolean(),
    protocol: z.string().optional().describe("Selected protocol version"),
    timestamp: Timestamp
});

export const AnyMessage = z.discriminatedUnion('kind', [
    TaskRequest,
    TaskResult,
    HeartbeatSignal,
    HandshakeRequest,
    HandshakeResponse
]);
