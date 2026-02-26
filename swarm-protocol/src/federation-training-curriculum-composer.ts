import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'federation_training_curriculum_composer',
    collectionField: 'curricula',
    idField: 'curriculumId',
    defaultName: 'Federation Curriculum',
    readyPosture: 'federation_training_curriculum_ready',
    defaultAgentId: 'agent:federation-training-curriculum',
    recommendationTypes: {
        primary: 'compose_federation_training_curriculum',
        guard: 'mitigate_federation_training_sequence_risk',
        audit: 'audit_federation_training_curriculum_signals',
        publish: 'publish_federation_training_curriculum_status'
    },
    recommendationTargetMap: {
        compose_federation_training_curriculum: 'agent:learning',
        mitigate_federation_training_sequence_risk: 'agent:enablement',
        audit_federation_training_curriculum_signals: 'agent:trust',
        publish_federation_training_curriculum_status: 'agent:ops'
    }
});

export function composeFederationTrainingCurriculum(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function federationTrainingCurriculumComposerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class FederationTrainingCurriculumComposer extends BaseManager {}

export const __federationTrainingCurriculumComposerInternals = toolkit.internals;
