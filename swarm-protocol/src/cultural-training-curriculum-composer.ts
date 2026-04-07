import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'cultural_training_curriculum_composer',
    collectionField: 'curricula',
    idField: 'curriculumId',
    defaultName: 'Cultural Curriculum',
    readyPosture: 'cultural_training_curriculum_ready',
    defaultAgentId: 'agent:cultural-training-curriculum',
    recommendationTypes: {
        primary: 'compose_cultural_training_curriculum',
        guard: 'mitigate_cultural_training_gap',
        audit: 'audit_cultural_training_curriculum_signals',
        publish: 'publish_cultural_training_curriculum_status'
    },
    recommendationTargetMap: {
        compose_cultural_training_curriculum: 'agent:learning',
        mitigate_cultural_training_gap: 'agent:operations',
        audit_cultural_training_curriculum_signals: 'agent:trust',
        publish_cultural_training_curriculum_status: 'agent:ops'
    }
});

export function composeCulturalTrainingCurriculum(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function culturalTrainingCurriculumComposerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CulturalTrainingCurriculumComposer extends BaseManager {}

export const __culturalTrainingCurriculumComposerInternals = toolkit.internals;
