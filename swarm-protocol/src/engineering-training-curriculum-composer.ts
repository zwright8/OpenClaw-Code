import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'engineering_training_curriculum_composer',
    collectionField: 'curricula',
    idField: 'curriculumId',
    defaultName: 'Engineering Curriculum',
    readyPosture: 'engineering_training_curriculum_ready',
    defaultAgentId: 'agent:engineering-training-curriculum',
    recommendationTypes: {
        primary: 'compose_engineering_training_curriculum',
        guard: 'mitigate_engineering_training_sequence_risk',
        audit: 'audit_engineering_training_curriculum_signals',
        publish: 'publish_engineering_training_curriculum_status'
    },
    recommendationTargetMap: {
        compose_engineering_training_curriculum: 'agent:learning',
        mitigate_engineering_training_sequence_risk: 'agent:enablement',
        audit_engineering_training_curriculum_signals: 'agent:trust',
        publish_engineering_training_curriculum_status: 'agent:ops'
    }
});

export function composeEngineeringTrainingCurriculum(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function engineeringTrainingCurriculumComposerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EngineeringTrainingCurriculumComposer extends BaseManager {}

export const __engineeringTrainingCurriculumComposerInternals = toolkit.internals;
