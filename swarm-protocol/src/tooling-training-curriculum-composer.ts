import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'tooling_training_curriculum_composer',
    collectionField: 'curricula',
    idField: 'curriculumId',
    defaultName: 'Curriculum',
    readyPosture: 'training_curriculum_ready',
    defaultAgentId: 'agent:tooling-training-curriculum',
    recommendationTypes: {
        primary: 'compose_tooling_training_curriculum',
        guard: 'mitigate_training_sequence_risk',
        audit: 'audit_training_curriculum_signals',
        publish: 'publish_training_curriculum_status'
    },
    recommendationTargetMap: {
        compose_tooling_training_curriculum: 'agent:learning',
        mitigate_training_sequence_risk: 'agent:enablement',
        audit_training_curriculum_signals: 'agent:trust',
        publish_training_curriculum_status: 'agent:ops'
    }
});

export function composeToolingTrainingCurriculum(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function toolingTrainingCurriculumComposerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ToolingTrainingCurriculumComposer extends BaseManager {}

export const __toolingTrainingCurriculumComposerInternals = toolkit.internals;
