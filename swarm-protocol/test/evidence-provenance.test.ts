import test from 'node:test';
import assert from 'node:assert/strict';
import {
    EvidenceProvenanceGraph,
    buildEvidenceProvenanceGraph,
    provenanceClaimLineage,
    provenanceRecommendationsToTasks
} from '../index.js';

test('buildEvidenceProvenanceGraph computes trust tiers and lineage graph structure', () => {
    const report = buildEvidenceProvenanceGraph({
        claims: [
            {
                id: 'claim-a',
                statement: 'Service latency improved after patch.',
                confidence: 70,
                evidenceIds: ['ev-1', 'ev-2']
            },
            {
                id: 'claim-b',
                statement: 'Improvement caused by new queue strategy.',
                confidence: 66,
                evidenceIds: ['ev-3'],
                derivedFromClaimIds: ['claim-a']
            }
        ],
        evidence: [
            {
                id: 'ev-1',
                reliabilityScore: 82,
                supportsClaimIds: ['claim-a']
            },
            {
                id: 'ev-2',
                reliabilityScore: 78,
                supportsClaimIds: ['claim-a']
            },
            {
                id: 'ev-3',
                reliabilityScore: 64,
                supportsClaimIds: ['claim-b']
            }
        ]
    }, {
        now: () => 120_000
    });

    assert.equal(report.graph.nodes.length >= 5, true);
    assert.equal(report.summary.claimCount, 2);
    assert.equal(report.claims.some((claim) => claim.trustTier === 'trusted' || claim.trustTier === 'needs_validation'), true);

    const lineage = provenanceClaimLineage(report, 'claim-b');
    assert.equal(lineage.claimId, 'claim-b');
    assert.equal(lineage.relations.some((edge) => edge.relation === 'derived_from'), true);
});

test('buildEvidenceProvenanceGraph surfaces contradictions and low-trust verification actions', () => {
    const report = buildEvidenceProvenanceGraph({
        claims: [
            {
                id: 'claim-risk',
                statement: 'No abuse activity detected.',
                confidence: 55,
                evidenceIds: ['ev-a', 'ev-b']
            }
        ],
        evidence: [
            {
                id: 'ev-a',
                reliabilityScore: 70,
                supportsClaimIds: ['claim-risk']
            },
            {
                id: 'ev-b',
                reliabilityScore: 92,
                contradictsClaimIds: ['claim-risk']
            }
        ]
    }, {
        now: () => 121_000
    });

    assert.equal(report.alerts.includes('claim_contradiction_detected'), true);
    assert.equal(report.recommendations.some((entry) => (
        entry.type === 'resolve_contradictory_evidence' || entry.type === 'verify_low_trust_claim'
    )), true);
});

test('provenanceRecommendationsToTasks and class wrapper emit schema-valid tasks and history', () => {
    const graph = new EvidenceProvenanceGraph({
        localAgentId: 'agent:provenance-local',
        now: () => 122_000
    });

    const report = graph.evaluate({
        claims: [
            {
                id: 'claim-z',
                statement: 'Unverified assertion',
                confidence: 28,
                evidenceIds: []
            }
        ],
        evidence: []
    });

    const tasks = provenanceRecommendationsToTasks(report, {
        fromAgentId: 'agent:planner'
    });
    const classTasks = graph.buildTasks(report);

    assert.equal(tasks.length > 0, true);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');
    assert.equal(classTasks.length > 0, true);
    assert.equal(classTasks[0].from, 'agent:provenance-local');
    assert.equal(graph.listHistory({ limit: 5 }).length, 1);
});
