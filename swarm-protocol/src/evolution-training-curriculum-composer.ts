import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'evolution_training_curriculum_composer',
    collectionField: 'curricula',
    idField: 'curriculumId',
    defaultName: 'Evolution Curriculum',
    readyPosture: 'evolution_training_curriculum_ready',
    defaultAgentId: 'agent:evolution-training-curriculum',
    recommendationTypes: {
        primary: 'compose_evolution_training_curriculum',
        guard: 'mitigate_evolution_training_gap',
        audit: 'audit_evolution_training_curriculum_signals',
        publish: 'publish_evolution_training_curriculum_status'
    },
    recommendationTargetMap: {
        compose_evolution_training_curriculum: 'agent:learning',
        mitigate_evolution_training_gap: 'agent:operations',
        audit_evolution_training_curriculum_signals: 'agent:trust',
        publish_evolution_training_curriculum_status: 'agent:ops'
    }
});

export function composeEvolutionTrainingCurriculum(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function evolutionTrainingCurriculumComposerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EvolutionTrainingCurriculumComposer extends BaseManager {}

export const __evolutionTrainingCurriculumComposerInternals = toolkit.internals;
