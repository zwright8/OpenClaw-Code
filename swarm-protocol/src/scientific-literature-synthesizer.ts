import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'scientific_literature_synthesizer',
    collectionField: 'papers',
    idField: 'paperId',
    defaultName: 'Paper',
    readyPosture: 'synthesis_ready',
    defaultAgentId: 'agent:literature-synthesizer',
    recommendationTypes: {
        primary: 'synthesize_literature_insights',
        guard: 'close_evidence_coverage_gap',
        audit: 'audit_literature_provenance',
        publish: 'publish_literature_synthesis_report'
    },
    recommendationTargetMap: {
        synthesize_literature_insights: 'agent:research',
        close_evidence_coverage_gap: 'agent:analysis',
        audit_literature_provenance: 'agent:trust',
        publish_literature_synthesis_report: 'agent:ops'
    }
});

export function synthesizeScientificLiterature(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function scientificLiteratureToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ScientificLiteratureSynthesizer extends BaseManager {}

export const __scientificLiteratureSynthesizerInternals = toolkit.internals;
