import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'governance_experiment_design_generator',
    collectionField: 'experiments',
    idField: 'experimentId',
    defaultName: 'Governance Experiment',
    readyPosture: 'governance_experiment_design_ready',
    defaultAgentId: 'agent:governance-experiment-design',
    recommendationTypes: {
        primary: 'generate_governance_experiment_design',
        guard: 'mitigate_governance_experiment_bias_risk',
        audit: 'audit_governance_experiment_design_signals',
        publish: 'publish_governance_experiment_design_status'
    },
    recommendationTargetMap: {
        generate_governance_experiment_design: 'agent:governance',
        mitigate_governance_experiment_bias_risk: 'agent:research',
        audit_governance_experiment_design_signals: 'agent:trust',
        publish_governance_experiment_design_status: 'agent:ops'
    }
});

export function generateGovernanceExperimentDesigns(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function governanceExperimentDesignGeneratorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class GovernanceExperimentDesignGenerator extends BaseManager {}

export const __governanceExperimentDesignGeneratorInternals = toolkit.internals;
