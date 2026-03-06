import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'logistics_training_curriculum_composer',
    collectionField: 'curricula',
    idField: 'curriculumId',
    defaultName: 'Logistics Curriculum',
    readyPosture: 'logistics_training_curriculum_ready',
    defaultAgentId: 'agent:logistics-training-curriculum',
    recommendationTypes: {
        primary: 'compose_logistics_training_curriculum',
        guard: 'mitigate_logistics_training_gap',
        audit: 'audit_logistics_training_curriculum_signals',
        publish: 'publish_logistics_training_curriculum_status'
    },
    recommendationTargetMap: {
        compose_logistics_training_curriculum: 'agent:learning',
        mitigate_logistics_training_gap: 'agent:operations',
        audit_logistics_training_curriculum_signals: 'agent:trust',
        publish_logistics_training_curriculum_status: 'agent:ops'
    }
});

export function composeLogisticsTrainingCurriculum(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function logisticsTrainingCurriculumComposerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class LogisticsTrainingCurriculumComposer extends BaseManager {}

export const __logisticsTrainingCurriculumComposerInternals = toolkit.internals;
