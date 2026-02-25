import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'digital_rights_compliance_monitor',
    collectionField: 'cases',
    idField: 'caseId',
    defaultName: 'Case',
    readyPosture: 'rights_compliant',
    defaultAgentId: 'agent:digital-rights',
    recommendationTypes: {
        primary: 'enforce_digital_rights_remedy',
        guard: 'close_due_process_gap',
        audit: 'audit_rights_compliance_evidence',
        publish: 'publish_digital_rights_report'
    },
    recommendationTargetMap: {
        enforce_digital_rights_remedy: 'agent:legal',
        close_due_process_gap: 'agent:governance',
        audit_rights_compliance_evidence: 'agent:compliance',
        publish_digital_rights_report: 'agent:ops'
    }
});

export function monitorDigitalRightsCompliance(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function digitalRightsComplianceToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class DigitalRightsComplianceMonitor extends BaseManager {}

export const __digitalRightsComplianceMonitorInternals = toolkit.internals;
