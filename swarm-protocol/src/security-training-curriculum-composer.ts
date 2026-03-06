import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'security_training_curriculum_composer',
    collectionField: 'curricula',
    idField: 'curriculumId',
    defaultName: 'Security Curriculum',
    readyPosture: 'security_training_curriculum_ready',
    defaultAgentId: 'agent:security-training-curriculum',
    recommendationTypes: {
        primary: 'compose_security_training_curriculum',
        guard: 'mitigate_security_training_gap',
        audit: 'audit_security_training_curriculum_signals',
        publish: 'publish_security_training_curriculum_status'
    },
    recommendationTargetMap: {
        compose_security_training_curriculum: 'agent:learning',
        mitigate_security_training_gap: 'agent:operations',
        audit_security_training_curriculum_signals: 'agent:trust',
        publish_security_training_curriculum_status: 'agent:ops'
    }
});

export function composeSecurityTrainingCurriculum(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function securityTrainingCurriculumComposerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class SecurityTrainingCurriculumComposer extends BaseManager {}

export const __securityTrainingCurriculumComposerInternals = toolkit.internals;
