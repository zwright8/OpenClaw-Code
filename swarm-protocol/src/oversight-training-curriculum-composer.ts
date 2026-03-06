import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'oversight_training_curriculum_composer',
    collectionField: 'curricula',
    idField: 'curriculumId',
    defaultName: 'Oversight Curriculum',
    readyPosture: 'oversight_training_curriculum_ready',
    defaultAgentId: 'agent:oversight-training-curriculum',
    recommendationTypes: {
        primary: 'compose_oversight_training_curriculum',
        guard: 'mitigate_oversight_training_sequence_risk',
        audit: 'audit_oversight_training_curriculum_signals',
        publish: 'publish_oversight_training_curriculum_status'
    },
    recommendationTargetMap: {
        compose_oversight_training_curriculum: 'agent:learning',
        mitigate_oversight_training_sequence_risk: 'agent:enablement',
        audit_oversight_training_curriculum_signals: 'agent:trust',
        publish_oversight_training_curriculum_status: 'agent:ops'
    }
});

export function composeOversightTrainingCurriculum(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function oversightTrainingCurriculumComposerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class OversightTrainingCurriculumComposer extends BaseManager {}

export const __oversightTrainingCurriculumComposerInternals = toolkit.internals;
