import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'comms_training_curriculum_composer',
    collectionField: 'curricula',
    idField: 'curriculumId',
    defaultName: 'Comms Curriculum',
    readyPosture: 'comms_training_curriculum_ready',
    defaultAgentId: 'agent:comms-training-curriculum',
    recommendationTypes: {
        primary: 'compose_comms_training_curriculum',
        guard: 'mitigate_comms_training_gap',
        audit: 'audit_comms_training_curriculum_signals',
        publish: 'publish_comms_training_curriculum_status'
    },
    recommendationTargetMap: {
        compose_comms_training_curriculum: 'agent:learning',
        mitigate_comms_training_gap: 'agent:operations',
        audit_comms_training_curriculum_signals: 'agent:trust',
        publish_comms_training_curriculum_status: 'agent:ops'
    }
});

export function composeCommsTrainingCurriculum(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function commsTrainingCurriculumComposerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommsTrainingCurriculumComposer extends BaseManager {}

export const __commsTrainingCurriculumComposerInternals = toolkit.internals;
