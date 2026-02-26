import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'evolution_incident_playbook_synthesizer',
    collectionField: 'incidents',
    idField: 'incidentId',
    defaultName: 'Evolution Incident',
    readyPosture: 'evolution_incident_playbooks_synthesized',
    defaultAgentId: 'agent:evolution-incident-playbooks',
    recommendationTypes: {
        primary: 'synthesize_evolution_incident_playbooks',
        guard: 'mitigate_evolution_incident_repeat_risk',
        audit: 'audit_evolution_incident_playbook_signals',
        publish: 'publish_evolution_incident_playbook_status'
    },
    recommendationTargetMap: {
        synthesize_evolution_incident_playbooks: 'agent:evolution',
        mitigate_evolution_incident_repeat_risk: 'agent:reliability',
        audit_evolution_incident_playbook_signals: 'agent:trust',
        publish_evolution_incident_playbook_status: 'agent:ops'
    }
});

export function synthesizeEvolutionIncidentPlaybooks(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function evolutionIncidentPlaybookSynthesizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EvolutionIncidentPlaybookSynthesizer extends BaseManager {}

export const __evolutionIncidentPlaybookSynthesizerInternals = toolkit.internals;
