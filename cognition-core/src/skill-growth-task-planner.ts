import { buildTaskRequest } from '../../swarm-protocol/runtime.js';

const DEFAULT_TARGETS = {
    P1: 'agent:learning:critical',
    P2: 'agent:learning',
    P3: 'agent:backlog'
};

const PRIORITY_TO_TASK_PRIORITY = {
    P1: 'critical',
    P2: 'high',
    P3: 'normal'
};

export function mapSkillPriorityToTaskPriority(priority) {
    return PRIORITY_TO_TASK_PRIORITY[priority] || 'normal';
}

export function resolveSkillGrowthTarget(priority, targetMap = {}, defaultTarget = 'agent:learning') {
    return targetMap[priority] || defaultTarget;
}

function normalizeFocusArea(item, index) {
    if (!item || typeof item !== 'object') {
        throw new Error(`Invalid skill focus area at index ${index}`);
    }

    const priority = typeof item.priority === 'string' ? item.priority.trim() : 'P3';
    const focus = typeof item.focus === 'string' ? item.focus.trim() : '';
    const label = typeof item.label === 'string' ? item.label.trim() : focus;
    const rationale = typeof item.rationale === 'string' ? item.rationale.trim() : '';
    const learningAction = typeof item.learningAction === 'string' ? item.learningAction.trim() : '';

    if (!focus) {
        throw new Error(`Missing skill focus key at index ${index}`);
    }
    if (!learningAction) {
        throw new Error(`Missing skill learningAction at index ${index}`);
    }

    const normalizedSkills = Array.isArray(item.suggestedSkills)
        ? item.suggestedSkills
            .map((entry) => {
                const name = typeof entry?.name === 'string' ? entry.name.trim() : '';
                return name || null;
            })
            .filter(Boolean)
        : [];

    return {
        priority: ['P1', 'P2', 'P3'].includes(priority) ? priority : 'P3',
        focus,
        label: label || focus,
        rationale,
        learningAction,
        suggestedSkills: normalizedSkills
    };
}

export function buildSkillGrowthTasks(skillGrowthPlan, options = {}) {
    if (!skillGrowthPlan || typeof skillGrowthPlan !== 'object') {
        throw new Error('skillGrowthPlan must be an object');
    }
    if (!Array.isArray(skillGrowthPlan.focusAreas)) {
        throw new Error('skillGrowthPlan.focusAreas must be an array');
    }

    const {
        fromAgentId = 'agent:main',
        sourceReport = 'learning-loop.json',
        targetMap = DEFAULT_TARGETS,
        defaultTarget = 'agent:learning',
        maxItems = Number.POSITIVE_INFINITY,
        idFactory = null,
        nowFactory = Date.now
    } = options;

    const now = Number.isFinite(Number(nowFactory()))
        ? Number(nowFactory())
        : Date.now();
    const capped = skillGrowthPlan.focusAreas.slice(0, Math.max(0, Number(maxItems) || 0) || skillGrowthPlan.focusAreas.length);
    const tasks = [];

    for (let index = 0; index < capped.length; index++) {
        const area = normalizeFocusArea(capped[index], index);
        const taskPriority = mapSkillPriorityToTaskPriority(area.priority);
        const target = resolveSkillGrowthTarget(area.priority, targetMap, defaultTarget);
        const skillsLine = area.suggestedSkills.length > 0
            ? ` Suggested skills: ${area.suggestedSkills.join(', ')}.`
            : '';
        const taskText = `[${area.priority}] Build skill focus "${area.label}". ${area.learningAction}${skillsLine}`;
        const taskId = typeof idFactory === 'function' ? idFactory(index, area) : undefined;

        tasks.push(buildTaskRequest({
            id: taskId,
            from: fromAgentId,
            target,
            priority: taskPriority,
            task: taskText,
            context: {
                sourceReport,
                skillGrowth: area,
                planner: 'cognition-core/skill-growth-task-planner'
            },
            createdAt: now + index
        }));
    }

    return tasks;
}
