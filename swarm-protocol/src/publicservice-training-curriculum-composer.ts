import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'publicservice_training_curriculum_composer',
    collectionField: 'curricula',
    idField: 'curriculumId',
    defaultName: 'PublicService Curriculum',
    readyPosture: 'publicservice_training_curriculum_ready',
    defaultAgentId: 'agent:publicservice-training-curriculum',
    recommendationTypes: {
        primary: 'compose_publicservice_training_curriculum',
        guard: 'mitigate_publicservice_training_gap',
        audit: 'audit_publicservice_training_curriculum_signals',
        publish: 'publish_publicservice_training_curriculum_status'
    },
    recommendationTargetMap: {
        compose_publicservice_training_curriculum: 'agent:learning',
        mitigate_publicservice_training_gap: 'agent:operations',
        audit_publicservice_training_curriculum_signals: 'agent:trust',
        publish_publicservice_training_curriculum_status: 'agent:ops'
    }
});

export function composePublicServiceTrainingCurriculum(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function publicServiceTrainingCurriculumComposerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class PublicServiceTrainingCurriculumComposer extends BaseManager {}

export const __publicServiceTrainingCurriculumComposerInternals = toolkit.internals;
