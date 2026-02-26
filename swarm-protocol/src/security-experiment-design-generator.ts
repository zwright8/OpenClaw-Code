import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'security_experiment_design_generator',
    collectionField: 'experiments',
    idField: 'experimentId',
    defaultName: 'Security Experiment',
    readyPosture: 'security_experiment_design_ready',
    defaultAgentId: 'agent:security-experiment-design',
    recommendationTypes: {
        primary: 'generate_security_experiment_design',
        guard: 'mitigate_security_experiment_bias_risk',
        audit: 'audit_security_experiment_design_signals',
        publish: 'publish_security_experiment_design_status'
    },
    recommendationTargetMap: {
        generate_security_experiment_design: 'agent:security',
        mitigate_security_experiment_bias_risk: 'agent:research',
        audit_security_experiment_design_signals: 'agent:trust',
        publish_security_experiment_design_status: 'agent:ops'
    }
});

export function generateSecurityExperimentDesigns(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function securityExperimentDesignGeneratorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class SecurityExperimentDesignGenerator extends BaseManager {}

export const __securityExperimentDesignGeneratorInternals = toolkit.internals;
