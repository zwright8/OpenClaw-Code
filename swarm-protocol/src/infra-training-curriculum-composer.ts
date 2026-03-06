import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'infra_training_curriculum_composer',
    collectionField: 'curricula',
    idField: 'curriculumId',
    defaultName: 'Infra Curriculum',
    readyPosture: 'infra_training_curriculum_ready',
    defaultAgentId: 'agent:infra-training-curriculum',
    recommendationTypes: {
        primary: 'compose_infra_training_curriculum',
        guard: 'mitigate_infra_training_gap',
        audit: 'audit_infra_training_curriculum_signals',
        publish: 'publish_infra_training_curriculum_status'
    },
    recommendationTargetMap: {
        compose_infra_training_curriculum: 'agent:learning',
        mitigate_infra_training_gap: 'agent:operations',
        audit_infra_training_curriculum_signals: 'agent:trust',
        publish_infra_training_curriculum_status: 'agent:ops'
    }
});

export function composeInfraTrainingCurriculum(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function infraTrainingCurriculumComposerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InfraTrainingCurriculumComposer extends BaseManager {}

export const __infraTrainingCurriculumComposerInternals = toolkit.internals;
