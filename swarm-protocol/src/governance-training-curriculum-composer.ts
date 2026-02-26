import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'governance_training_curriculum_composer',
    collectionField: 'curricula',
    idField: 'curriculumId',
    defaultName: 'Governance Curriculum',
    readyPosture: 'governance_training_curriculum_ready',
    defaultAgentId: 'agent:governance-training-curriculum',
    recommendationTypes: {
        primary: 'compose_governance_training_curriculum',
        guard: 'mitigate_governance_training_sequence_risk',
        audit: 'audit_governance_training_curriculum_signals',
        publish: 'publish_governance_training_curriculum_status'
    },
    recommendationTargetMap: {
        compose_governance_training_curriculum: 'agent:learning',
        mitigate_governance_training_sequence_risk: 'agent:enablement',
        audit_governance_training_curriculum_signals: 'agent:trust',
        publish_governance_training_curriculum_status: 'agent:ops'
    }
});

export function composeGovernanceTrainingCurriculum(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function governanceTrainingCurriculumComposerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class GovernanceTrainingCurriculumComposer extends BaseManager {}

export const __governanceTrainingCurriculumComposerInternals = toolkit.internals;
