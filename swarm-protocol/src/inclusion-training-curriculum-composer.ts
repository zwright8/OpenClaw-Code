import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'inclusion_training_curriculum_composer',
    collectionField: 'curricula',
    idField: 'curriculumId',
    defaultName: 'Inclusion Curriculum',
    readyPosture: 'inclusion_training_curriculum_ready',
    defaultAgentId: 'agent:inclusion-training-curriculum',
    recommendationTypes: {
        primary: 'compose_inclusion_training_curriculum',
        guard: 'mitigate_inclusion_training_gap',
        audit: 'audit_inclusion_training_curriculum_signals',
        publish: 'publish_inclusion_training_curriculum_status'
    },
    recommendationTargetMap: {
        compose_inclusion_training_curriculum: 'agent:learning',
        mitigate_inclusion_training_gap: 'agent:operations',
        audit_inclusion_training_curriculum_signals: 'agent:trust',
        publish_inclusion_training_curriculum_status: 'agent:ops'
    }
});

export function composeInclusionTrainingCurriculum(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function inclusionTrainingCurriculumComposerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InclusionTrainingCurriculumComposer extends BaseManager {}

export const __inclusionTrainingCurriculumComposerInternals = toolkit.internals;
