import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'community_training_curriculum_composer',
    collectionField: 'curricula',
    idField: 'curriculumId',
    defaultName: 'Community Curriculum',
    readyPosture: 'community_training_curriculum_ready',
    defaultAgentId: 'agent:community-training-curriculum',
    recommendationTypes: {
        primary: 'compose_community_training_curriculum',
        guard: 'mitigate_community_training_gap',
        audit: 'audit_community_training_curriculum_signals',
        publish: 'publish_community_training_curriculum_status'
    },
    recommendationTargetMap: {
        compose_community_training_curriculum: 'agent:learning',
        mitigate_community_training_gap: 'agent:operations',
        audit_community_training_curriculum_signals: 'agent:trust',
        publish_community_training_curriculum_status: 'agent:ops'
    }
});

export function composeCommunityTrainingCurriculum(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function communityTrainingCurriculumComposerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommunityTrainingCurriculumComposer extends BaseManager {}

export const __communityTrainingCurriculumComposerInternals = toolkit.internals;
