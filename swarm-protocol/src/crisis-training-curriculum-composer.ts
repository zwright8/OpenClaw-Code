import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'crisis_training_curriculum_composer',
    collectionField: 'curricula',
    idField: 'curriculumId',
    defaultName: 'Crisis Curriculum',
    readyPosture: 'crisis_training_curriculum_ready',
    defaultAgentId: 'agent:crisis-training-curriculum',
    recommendationTypes: {
        primary: 'compose_crisis_training_curriculum',
        guard: 'mitigate_crisis_training_gap',
        audit: 'audit_crisis_training_curriculum_signals',
        publish: 'publish_crisis_training_curriculum_status'
    },
    recommendationTargetMap: {
        compose_crisis_training_curriculum: 'agent:learning',
        mitigate_crisis_training_gap: 'agent:operations',
        audit_crisis_training_curriculum_signals: 'agent:trust',
        publish_crisis_training_curriculum_status: 'agent:ops'
    }
});

export function composeCrisisTrainingCurriculum(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function crisisTrainingCurriculumComposerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CrisisTrainingCurriculumComposer extends BaseManager {}

export const __crisisTrainingCurriculumComposerInternals = toolkit.internals;
