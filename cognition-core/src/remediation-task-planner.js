import { buildTaskRequest } from '../../swarm-protocol/index.js';

const DEFAULT_TARGETS = {
    P1: 'agent:ops:critical',
    P2: 'agent:ops',
    P3: 'agent:backlog'
};

const PRIORITY_TO_TASK_PRIORITY = {
    P1: 'critical',
    P2: 'high',
    P3: 'normal'
};

export function mapPriorityToTaskPriority(priority) {
    return PRIORITY_TO_TASK_PRIORITY[priority] || 'normal';
}

export function resolveTarget(priority, targetMap = {}, defaultTarget = 'agent:ops') {
    return targetMap[priority] || defaultTarget;
}

function normalizeItem(item, index) {
    if (!item || typeof item !== 'object') {
        throw new Error(`Invalid remediation item at index ${index}`);
    }

    const priority = typeof item.priority === 'string' ? item.priority.trim() : 'P3';
    const title = typeof item.title === 'string' ? item.title.trim() : '';
    const rationale = typeof item.rationale === 'string' ? item.rationale.trim() : '';
    const action = typeof item.action === 'string' ? item.action.trim() : '';

    if (!title) {
        throw new Error(`Missing remediation title at index ${index}`);
    }
    if (!action) {
        throw new Error(`Missing remediation action at index ${index}`);
    }

    return {
        priority: ['P1', 'P2', 'P3'].includes(priority) ? priority : 'P3',
        title,
        rationale,
        action
    };
}

export function buildRemediationTasks(remediationPlan, options = {}) {
    const {
        fromAgentId = 'agent:main',
        sourceReport = 'cognition-report.json',
        targetMap = DEFAULT_TARGETS,
        defaultTarget = 'agent:ops',
        maxItems = Number.POSITIVE_INFINITY,
        idFactory = null,
        nowFactory = Date.now
    } = options;

    if (!Array.isArray(remediationPlan)) {
        throw new Error('remediationPlan must be an array');
    }

    const now = Number.isFinite(Number(nowFactory()))
        ? Number(nowFactory())
        : Date.now();
    const capped = remediationPlan.slice(0, Math.max(0, Number(maxItems) || 0) || remediationPlan.length);
    const tasks = [];

    for (let index = 0; index < capped.length; index++) {
        const item = normalizeItem(capped[index], index);
        const taskPriority = mapPriorityToTaskPriority(item.priority);
        const target = resolveTarget(item.priority, targetMap, defaultTarget);
        const taskText = `[${item.priority}] ${item.title}. ${item.action}`;
        const taskId = typeof idFactory === 'function' ? idFactory(index, item) : undefined;

        tasks.push(buildTaskRequest({
            id: taskId,
            from: fromAgentId,
            target,
            priority: taskPriority,
            task: taskText,
            context: {
                sourceReport,
                remediation: item,
                planner: 'cognition-core/remediation-task-planner'
            },
            createdAt: now + index
        }));
    }

    return tasks;
}
