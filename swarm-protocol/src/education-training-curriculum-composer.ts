import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'education_training_curriculum_composer',
    collectionField: 'curricula',
    idField: 'curriculumId',
    defaultName: 'Education Curriculum',
    readyPosture: 'education_training_curriculum_ready',
    defaultAgentId: 'agent:education-training-curriculum',
    recommendationTypes: {
        primary: 'compose_education_training_curriculum',
        guard: 'mitigate_education_training_sequence_risk',
        audit: 'audit_education_training_curriculum_signals',
        publish: 'publish_education_training_curriculum_status'
    },
    recommendationTargetMap: {
        compose_education_training_curriculum: 'agent:learning',
        mitigate_education_training_sequence_risk: 'agent:enablement',
        audit_education_training_curriculum_signals: 'agent:trust',
        publish_education_training_curriculum_status: 'agent:ops'
    }
});

export function composeEducationTrainingCurriculum(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function educationTrainingCurriculumComposerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EducationTrainingCurriculumComposer extends BaseManager {}

export const __educationTrainingCurriculumComposerInternals = toolkit.internals;
