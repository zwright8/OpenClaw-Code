import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'social_simulation_sandbox',
    collectionField: 'scenarios',
    idField: 'scenarioId',
    defaultName: 'Scenario',
    readyPosture: 'simulation_ready',
    defaultAgentId: 'agent:social-simulation',
    signalMap: {
        demand: 'interactionDensity',
        capacity: 'moderationCapacity',
        risk: 'harmRisk',
        impact: 'societalImpact',
        readiness: 'modelReadiness',
        resilience: 'policyResilience',
        equity: 'inclusionScore',
        efficiency: 'simulationEfficiency',
        quality: 'dataQuality',
        trust: 'communityTrust',
        opportunity: 'learningPotential',
        criticality: 'urgency'
    },
    recommendationTypes: {
        primary: 'run_social_simulation_sandbox',
        guard: 'mitigate_social_harm_emergence',
        audit: 'validate_simulation_assumptions',
        publish: 'publish_social_simulation_brief'
    },
    recommendationTargetMap: {
        run_social_simulation_sandbox: 'agent:simulation',
        mitigate_social_harm_emergence: 'agent:safety',
        validate_simulation_assumptions: 'agent:research',
        publish_social_simulation_brief: 'agent:ops'
    }
});

export function simulateSocialDynamicsSandbox(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function socialSimulationToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class SocialSimulationSandbox extends BaseManager {}

export const __socialSimulationSandboxInternals = toolkit.internals;
