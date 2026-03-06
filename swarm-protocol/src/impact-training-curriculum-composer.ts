import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'impact_training_curriculum_composer',
    collectionField: 'curricula',
    idField: 'curriculumId',
    defaultName: 'Impact Curriculum',
    readyPosture: 'impact_training_curriculum_ready',
    defaultAgentId: 'agent:impact-training-curriculum',
    recommendationTypes: {
        primary: 'compose_impact_training_curriculum',
        guard: 'mitigate_impact_training_gap',
        audit: 'audit_impact_training_curriculum_signals',
        publish: 'publish_impact_training_curriculum_status'
    },
    recommendationTargetMap: {
        compose_impact_training_curriculum: 'agent:learning',
        mitigate_impact_training_gap: 'agent:operations',
        audit_impact_training_curriculum_signals: 'agent:trust',
        publish_impact_training_curriculum_status: 'agent:ops'
    }
});

export function composeImpactTrainingCurriculum(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function impactTrainingCurriculumComposerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ImpactTrainingCurriculumComposer extends BaseManager {}

export const __impactTrainingCurriculumComposerInternals = toolkit.internals;
