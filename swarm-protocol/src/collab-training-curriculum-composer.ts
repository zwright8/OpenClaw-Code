import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'collab_training_curriculum_composer',
    collectionField: 'curricula',
    idField: 'curriculumId',
    defaultName: 'Collab Curriculum',
    readyPosture: 'collab_training_curriculum_ready',
    defaultAgentId: 'agent:collab-training-curriculum',
    recommendationTypes: {
        primary: 'compose_collab_training_curriculum',
        guard: 'mitigate_collab_training_sequence_risk',
        audit: 'audit_collab_training_curriculum_signals',
        publish: 'publish_collab_training_curriculum_status'
    },
    recommendationTargetMap: {
        compose_collab_training_curriculum: 'agent:learning',
        mitigate_collab_training_sequence_risk: 'agent:enablement',
        audit_collab_training_curriculum_signals: 'agent:trust',
        publish_collab_training_curriculum_status: 'agent:ops'
    }
});

export function composeCollabTrainingCurriculum(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function collabTrainingCurriculumComposerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CollabTrainingCurriculumComposer extends BaseManager {}

export const __collabTrainingCurriculumComposerInternals = toolkit.internals;
