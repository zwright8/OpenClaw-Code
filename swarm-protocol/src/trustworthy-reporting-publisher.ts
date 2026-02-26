import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'trustworthy_reporting_publisher',
    collectionField: 'reports',
    idField: 'reportId',
    defaultName: 'Report',
    readyPosture: 'reporting_trustworthy',
    defaultAgentId: 'agent:trustworthy-reporting',
    recommendationTypes: {
        primary: 'publish_verifiable_report',
        guard: 'remediate_reporting_context_gap',
        audit: 'audit_reporting_verifiability',
        publish: 'issue_reporting_trust_brief'
    },
    recommendationTargetMap: {
        publish_verifiable_report: 'agent:reporting',
        remediate_reporting_context_gap: 'agent:analysis',
        audit_reporting_verifiability: 'agent:trust',
        issue_reporting_trust_brief: 'agent:ops'
    }
});

export function publishTrustworthyReporting(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function trustworthyReportingToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class TrustworthyReportingPublisher extends BaseManager {}

export const __trustworthyReportingPublisherInternals = toolkit.internals;
