import { buildTaskRequest } from '../../swarm-protocol/runtime.js';

const DEFAULT_TARGETS = {
    P1: 'agent:cognition:critical',
    P2: 'agent:cognition:ops',
    P3: 'agent:cognition:backlog'
};

const PRIORITY_TO_TASK_PRIORITY = {
    P1: 'critical',
    P2: 'high',
    P3: 'normal'
};

export function mapIterationPriorityToTaskPriority(priority) {
    return PRIORITY_TO_TASK_PRIORITY[priority] || 'normal';
}

export function resolveIterationTarget(priority, targetMap = {}, defaultTarget = 'agent:cognition:ops') {
    return targetMap[priority] || defaultTarget;
}

function normalizeHypothesis(item, index) {
    if (!item || typeof item !== 'object') {
        throw new Error(`Invalid hypothesis at index ${index}`);
    }

    const priority = typeof item.priority === 'string' ? item.priority.trim() : 'P3';
    const id = typeof item.id === 'string' ? item.id.trim() : `hypothesis-${index + 1}`;
    const title = typeof item.title === 'string' ? item.title.trim() : '';
    const question = typeof item.question === 'string' ? item.question.trim() : '';
    const experiment = typeof item.experiment === 'string' ? item.experiment.trim() : '';
    const stopCondition = typeof item.stopCondition === 'string' ? item.stopCondition.trim() : '';

    if (!title) {
        throw new Error(`Missing hypothesis title at index ${index}`);
    }
    if (!experiment) {
        throw new Error(`Missing hypothesis experiment at index ${index}`);
    }

    return {
        id,
        priority: ['P1', 'P2', 'P3'].includes(priority) ? priority : 'P3',
        title,
        question,
        experiment,
        stopCondition,
        metric: typeof item.metric === 'string' ? item.metric.trim() : null,
        target: typeof item.target === 'string' ? item.target.trim() : null
    };
}

export function buildCognitionIterationTasks(iterationPlan, options = {}) {
    if (!iterationPlan || typeof iterationPlan !== 'object') {
        throw new Error('iterationPlan must be an object');
    }
    if (!Array.isArray(iterationPlan.hypotheses)) {
        throw new Error('iterationPlan.hypotheses must be an array');
    }

    const {
        fromAgentId = 'agent:main',
        sourceReport = 'cognition-iteration-plan.json',
        targetMap = DEFAULT_TARGETS,
        defaultTarget = 'agent:cognition:ops',
        maxItems = Number.POSITIVE_INFINITY,
        idFactory = null,
        nowFactory = Date.now
    } = options;

    const now = Number.isFinite(Number(nowFactory()))
        ? Number(nowFactory())
        : Date.now();
    const capped = iterationPlan.hypotheses.slice(0, Math.max(0, Number(maxItems) || 0) || iterationPlan.hypotheses.length);
    const tasks = [];

    for (let index = 0; index < capped.length; index++) {
        const hypothesis = normalizeHypothesis(capped[index], index);
        const priority = mapIterationPriorityToTaskPriority(hypothesis.priority);
        const target = resolveIterationTarget(hypothesis.priority, targetMap, defaultTarget);
        const metricText = hypothesis.metric && hypothesis.target
            ? ` Metric target: ${hypothesis.metric} -> ${hypothesis.target}.`
            : '';
        const stopText = hypothesis.stopCondition
            ? ` Stop condition: ${hypothesis.stopCondition}.`
            : '';
        const questionText = hypothesis.question
            ? ` Question: ${hypothesis.question}.`
            : '';
        const taskText = `[${hypothesis.priority}] Run cognition experiment "${hypothesis.title}".${questionText} ${hypothesis.experiment}.${metricText}${stopText}`;
        const taskId = typeof idFactory === 'function' ? idFactory(index, hypothesis) : undefined;

        tasks.push(buildTaskRequest({
            id: taskId,
            from: fromAgentId,
            target,
            priority,
            task: taskText,
            context: {
                sourceReport,
                hypothesis,
                planner: 'cognition-core/cognition-iteration-task-planner'
            },
            createdAt: now + index
        }));
    }

    return tasks;
}
