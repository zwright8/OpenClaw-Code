import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'rights_training_curriculum_composer',
    collectionField: 'curricula',
    idField: 'curriculumId',
    defaultName: 'Rights Curriculum',
    readyPosture: 'rights_training_curriculum_ready',
    defaultAgentId: 'agent:rights-training-curriculum',
    recommendationTypes: {
        primary: 'compose_rights_training_curriculum',
        guard: 'mitigate_rights_training_gap',
        audit: 'audit_rights_training_curriculum_signals',
        publish: 'publish_rights_training_curriculum_status'
    },
    recommendationTargetMap: {
        compose_rights_training_curriculum: 'agent:learning',
        mitigate_rights_training_gap: 'agent:operations',
        audit_rights_training_curriculum_signals: 'agent:trust',
        publish_rights_training_curriculum_status: 'agent:ops'
    }
});

export function composeRightsTrainingCurriculum(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function rightsTrainingCurriculumComposerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class RightsTrainingCurriculumComposer extends BaseManager {}

export const __rightsTrainingCurriculumComposerInternals = toolkit.internals;
