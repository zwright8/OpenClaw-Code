import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'learning_curriculum_generator',
    collectionField: 'learners',
    idField: 'learnerId',
    defaultName: 'Learner',
    readyPosture: 'curriculum_ready',
    defaultAgentId: 'agent:curriculum-generator',
    recommendationTypes: {
        primary: 'generate_adaptive_curriculum',
        guard: 'close_learning_pathway_gap',
        audit: 'audit_curriculum_alignment',
        publish: 'publish_curriculum_progress_report'
    },
    recommendationTargetMap: {
        generate_adaptive_curriculum: 'agent:education',
        close_learning_pathway_gap: 'agent:coaching',
        audit_curriculum_alignment: 'agent:quality',
        publish_curriculum_progress_report: 'agent:ops'
    }
});

export function generateLearningCurriculum(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function learningCurriculumToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class LearningCurriculumGenerator extends BaseManager {}

export const __learningCurriculumGeneratorInternals = toolkit.internals;
