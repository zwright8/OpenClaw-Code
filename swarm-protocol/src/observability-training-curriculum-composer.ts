import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'observability_training_curriculum_composer',
    collectionField: 'curricula',
    idField: 'curriculumId',
    defaultName: 'Observability Curriculum',
    readyPosture: 'observability_training_curriculum_ready',
    defaultAgentId: 'agent:observability-training-curriculum',
    recommendationTypes: {
        primary: 'compose_observability_training_curriculum',
        guard: 'mitigate_observability_training_sequence_risk',
        audit: 'audit_observability_training_curriculum_signals',
        publish: 'publish_observability_training_curriculum_status'
    },
    recommendationTargetMap: {
        compose_observability_training_curriculum: 'agent:learning',
        mitigate_observability_training_sequence_risk: 'agent:enablement',
        audit_observability_training_curriculum_signals: 'agent:trust',
        publish_observability_training_curriculum_status: 'agent:ops'
    }
});

export function composeObservabilityTrainingCurriculum(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function observabilityTrainingCurriculumComposerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ObservabilityTrainingCurriculumComposer extends BaseManager {}

export const __observabilityTrainingCurriculumComposerInternals = toolkit.internals;
