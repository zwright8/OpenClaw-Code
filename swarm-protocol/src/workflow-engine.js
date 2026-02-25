import { z } from 'zod';
import { TaskPriority, TaskResult } from './schemas.js';

const NODE_STATUSES = new Set([
    'pending',
    'running',
    'completed',
    'failed'
]);

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function safeNow(nowFn) {
    const value = Number(nowFn());
    return Number.isFinite(value) ? value : Date.now();
}

const WorkflowNodeSchema = z.object({
    id: z.string().min(1),
    task: z.string().min(1),
    target: z.string().optional(),
    priority: TaskPriority.default('normal'),
    context: z.record(z.any()).optional(),
    dependencies: z.array(z.string()).default([]),
    requiredCapabilities: z.array(z.string()).optional(),
    timeoutMs: z.number().int().positive().optional(),
    maxRetries: z.number().int().nonnegative().optional()
});

const WorkflowSchema = z.object({
    id: z.string().min(1),
    nodes: z.array(WorkflowNodeSchema).nonempty()
});

function assertUniqueNodeIds(nodes) {
    const seen = new Set();
    for (const node of nodes) {
        if (seen.has(node.id)) {
            throw new Error(`Duplicate workflow node id: ${node.id}`);
        }
        seen.add(node.id);
    }
}

function assertDependenciesExist(nodes) {
    const allIds = new Set(nodes.map((node) => node.id));
    for (const node of nodes) {
        for (const dep of node.dependencies) {
            if (!allIds.has(dep)) {
                throw new Error(`Node ${node.id} depends on unknown node ${dep}`);
            }
        }
    }
}

function assertAcyclic(nodes) {
    const state = new Map(); // 0 = unvisited, 1 = visiting, 2 = done
    const byId = new Map(nodes.map((node) => [node.id, node]));

    function visit(nodeId) {
        const marker = state.get(nodeId) || 0;
        if (marker === 1) {
            throw new Error(`Workflow cycle detected at node ${nodeId}`);
        }
        if (marker === 2) return;

        state.set(nodeId, 1);
        const node = byId.get(nodeId);
        for (const dep of node.dependencies) {
            visit(dep);
        }
        state.set(nodeId, 2);
    }

    for (const node of nodes) {
        visit(node.id);
    }
}

export function validateWorkflowDefinition(workflowPayload) {
    const workflow = WorkflowSchema.parse(workflowPayload);
    assertUniqueNodeIds(workflow.nodes);
    assertDependenciesExist(workflow.nodes);
    assertAcyclic(workflow.nodes);
    return workflow;
}

function createWorkflowRecord(workflow, createdAt) {
    const nodes = {};
    for (const node of workflow.nodes) {
        nodes[node.id] = {
            id: node.id,
            status: 'pending',
            taskId: null,
            target: node.target || null,
            startedAt: null,
            completedAt: null,
            resultStatus: null,
            error: null
        };
    }

    return {
        workflowId: workflow.id,
        status: 'running',
        createdAt,
        updatedAt: createdAt,
        completedAt: null,
        failedNodeId: null,
        history: [
            { at: createdAt, event: 'workflow_created' }
        ],
        workflow,
        nodes
    };
}

function nodeReady(workflowRecord, node) {
    const nodeState = workflowRecord.nodes[node.id];
    if (!nodeState || nodeState.status !== 'pending') return false;

    for (const depId of node.dependencies) {
        if (workflowRecord.nodes[depId]?.status !== 'completed') {
            return false;
        }
    }
    return true;
}

function allNodesCompleted(workflowRecord) {
    return Object.values(workflowRecord.nodes).every((node) => node.status === 'completed');
}

export class WorkflowEngine {
    constructor({
        orchestrator,
        now = Date.now,
        logger = console
    }) {
        if (!orchestrator || typeof orchestrator.dispatchTask !== 'function') {
            throw new Error('WorkflowEngine requires an orchestrator with dispatchTask()');
        }

        this.orchestrator = orchestrator;
        this.now = typeof now === 'function' ? now : Date.now;
        this.logger = logger;
        this.workflows = new Map();
        this.taskIndex = new Map(); // taskId => { workflowId, nodeId }
    }

    async startWorkflow(workflowPayload) {
        const workflow = validateWorkflowDefinition(workflowPayload);
        if (this.workflows.has(workflow.id)) {
            throw new Error(`Workflow already exists: ${workflow.id}`);
        }

        const createdAt = safeNow(this.now);
        const record = createWorkflowRecord(workflow, createdAt);
        this.workflows.set(workflow.id, record);

        await this._dispatchReadyNodes(record);
        return this.getWorkflow(workflow.id);
    }

    async _dispatchNode(workflowRecord, node) {
        const nodeState = workflowRecord.nodes[node.id];
        if (!nodeState || nodeState.status !== 'pending') return;

        const dispatchContext = {
            ...(node.context || {}),
            requiredCapabilities: node.requiredCapabilities || node.context?.requiredCapabilities,
            workflow: {
                workflowId: workflowRecord.workflowId,
                nodeId: node.id
            }
        };

        try {
            const dispatched = await this.orchestrator.dispatchTask({
                target: node.target,
                task: node.task,
                priority: node.priority,
                context: dispatchContext
            });

            nodeState.status = 'running';
            nodeState.taskId = dispatched.taskId;
            nodeState.target = dispatched.target;
            nodeState.startedAt = safeNow(this.now);
            workflowRecord.updatedAt = nodeState.startedAt;
            workflowRecord.history.push({
                at: nodeState.startedAt,
                event: 'node_dispatched',
                nodeId: node.id,
                taskId: dispatched.taskId
            });

            this.taskIndex.set(dispatched.taskId, {
                workflowId: workflowRecord.workflowId,
                nodeId: node.id
            });
        } catch (error) {
            nodeState.status = 'failed';
            nodeState.error = error.message;
            workflowRecord.status = 'failed';
            workflowRecord.failedNodeId = node.id;
            workflowRecord.updatedAt = safeNow(this.now);
            workflowRecord.completedAt = workflowRecord.updatedAt;
            workflowRecord.history.push({
                at: workflowRecord.updatedAt,
                event: 'node_dispatch_failed',
                nodeId: node.id,
                error: error.message
            });
        }
    }

    async _dispatchReadyNodes(workflowRecord) {
        if (workflowRecord.status !== 'running') return;

        for (const node of workflowRecord.workflow.nodes) {
            if (nodeReady(workflowRecord, node)) {
                await this._dispatchNode(workflowRecord, node);
                if (workflowRecord.status === 'failed') return;
            }
        }
    }

    async ingestResult(resultPayload) {
        const result = TaskResult.parse(resultPayload);
        const mapping = this.taskIndex.get(result.taskId);
        if (!mapping) return false;

        const workflowRecord = this.workflows.get(mapping.workflowId);
        if (!workflowRecord || workflowRecord.status !== 'running') return false;

        const nodeState = workflowRecord.nodes[mapping.nodeId];
        if (!nodeState || nodeState.status !== 'running') return false;

        const completedAt = result.completedAt;
        nodeState.completedAt = completedAt;
        nodeState.resultStatus = result.status;
        workflowRecord.updatedAt = completedAt;

        if (result.status === 'failure') {
            nodeState.status = 'failed';
            workflowRecord.status = 'failed';
            workflowRecord.failedNodeId = mapping.nodeId;
            workflowRecord.completedAt = completedAt;
            workflowRecord.history.push({
                at: completedAt,
                event: 'node_failed',
                nodeId: mapping.nodeId,
                taskId: result.taskId
            });
            return true;
        }

        nodeState.status = 'completed';
        workflowRecord.history.push({
            at: completedAt,
            event: 'node_completed',
            nodeId: mapping.nodeId,
            taskId: result.taskId,
            resultStatus: result.status
        });

        if (allNodesCompleted(workflowRecord)) {
            workflowRecord.status = 'completed';
            workflowRecord.completedAt = completedAt;
            workflowRecord.history.push({
                at: completedAt,
                event: 'workflow_completed'
            });
            return true;
        }

        await this._dispatchReadyNodes(workflowRecord);
        return true;
    }

    getWorkflow(workflowId) {
        const record = this.workflows.get(workflowId);
        return record ? clone(record) : null;
    }

    listWorkflows({ status = null } = {}) {
        const list = [];
        for (const record of this.workflows.values()) {
            if (status && record.status !== status) continue;
            list.push(clone(record));
        }
        return list;
    }

    getMetrics() {
        const metrics = {
            total: this.workflows.size,
            running: 0,
            completed: 0,
            failed: 0
        };

        for (const record of this.workflows.values()) {
            if (record.status === 'running') metrics.running++;
            if (record.status === 'completed') metrics.completed++;
            if (record.status === 'failed') metrics.failed++;
        }

        return metrics;
    }
}

export const __workflowInternals = {
    NODE_STATUSES
};
