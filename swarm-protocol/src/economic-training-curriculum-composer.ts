import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'economic_training_curriculum_composer',
    collectionField: 'curricula',
    idField: 'curriculumId',
    defaultName: 'Economic Curriculum',
    readyPosture: 'economic_training_curriculum_ready',
    defaultAgentId: 'agent:economic-training-curriculum',
    recommendationTypes: {
        primary: 'compose_economic_training_curriculum',
        guard: 'mitigate_economic_training_sequence_risk',
        audit: 'audit_economic_training_curriculum_signals',
        publish: 'publish_economic_training_curriculum_status'
    },
    recommendationTargetMap: {
        compose_economic_training_curriculum: 'agent:learning',
        mitigate_economic_training_sequence_risk: 'agent:enablement',
        audit_economic_training_curriculum_signals: 'agent:trust',
        publish_economic_training_curriculum_status: 'agent:ops'
    }
});

export function composeEconomicTrainingCurriculum(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function economicTrainingCurriculumComposerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EconomicTrainingCurriculumComposer extends BaseManager {}

export const __economicTrainingCurriculumComposerInternals = toolkit.internals;
