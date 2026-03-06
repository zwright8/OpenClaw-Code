import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'research_training_curriculum_composer',
    collectionField: 'curricula',
    idField: 'curriculumId',
    defaultName: 'Research Curriculum',
    readyPosture: 'research_training_curriculum_ready',
    defaultAgentId: 'agent:research-training-curriculum',
    recommendationTypes: {
        primary: 'compose_research_training_curriculum',
        guard: 'mitigate_research_training_sequence_risk',
        audit: 'audit_research_training_curriculum_signals',
        publish: 'publish_research_training_curriculum_status'
    },
    recommendationTargetMap: {
        compose_research_training_curriculum: 'agent:learning',
        mitigate_research_training_sequence_risk: 'agent:enablement',
        audit_research_training_curriculum_signals: 'agent:trust',
        publish_research_training_curriculum_status: 'agent:ops'
    }
});

export function composeResearchTrainingCurriculum(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function researchTrainingCurriculumComposerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ResearchTrainingCurriculumComposer extends BaseManager {}

export const __researchTrainingCurriculumComposerInternals = toolkit.internals;
