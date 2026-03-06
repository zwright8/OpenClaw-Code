import test from 'node:test';
import assert from 'node:assert/strict';
import {
    WorldStateGraph,
    buildDecisionContract,
    buildHandoffContract,
    buildReportContract
} from '../index.js';

function buildContracts() {
    const report = buildReportContract({
        id: '11111111-aaaa-4111-8111-111111111111',
        createdBy: 'agent:analyst',
        createdAt: 1_000,
        payload: {
            title: 'Reliability Brief Agent:Ops',
            summary: 'Timeout spikes observed in worker pool alpha',
            findings: [
                {
                    id: 'f1',
                    statement: 'agent:ops observed timeout spike in queue alpha',
                    recommendation: 'scale worker pool alpha'
                }
            ]
        }
    });

    const decision = buildDecisionContract({
        id: '22222222-bbbb-4222-8222-222222222222',
        createdBy: 'agent:lead',
        createdAt: 2_000,
        payload: {
            topic: 'Queue alpha mitigation',
            decision: 'Shift traffic to agent:ops-canary',
            rationale: 'Improve latency and reduce timeout storms'
        }
    });

    const handoff = buildHandoffContract({
        id: '33333333-cccc-4333-8333-333333333333',
        createdBy: 'agent:lead',
        createdAt: 3_000,
        payload: {
            from: 'agent:lead',
            to: 'agent:ops',
            objective: 'Execute queue alpha migration',
            openQuestions: ['Can agent:ops-canary absorb extra load?'],
            artifacts: [{ name: 'migration-plan-alpha', path: 'docs/migration-alpha.md' }]
        }
    });

    return { report, decision, handoff };
}

test('ingests contracts and builds confidence-scored entity graph', () => {
    const graph = new WorldStateGraph();
    const { report, decision, handoff } = buildContracts();

    graph.ingestContracts([report, decision, handoff]);
    const snapshot = graph.getSnapshot();

    assert.ok(snapshot.nodes.length > 0);
    assert.ok(snapshot.edges.length > 0);

    const opsEntity = snapshot.nodes.find((node) => node.entity.includes('agent:ops'));
    assert.ok(opsEntity);
    assert.ok(opsEntity.confidence > 0.5);
});

test('supports temporal snapshots and snapshot diffs', () => {
    const graph = new WorldStateGraph();
    const { report, decision, handoff } = buildContracts();

    graph.ingestContract(report);
    graph.ingestContract(decision);
    graph.ingestContract(handoff);

    const early = graph.getSnapshot(1_500);
    const later = graph.getSnapshot(3_500);
    const diff = graph.diffSnapshots(1_500, 3_500);

    assert.ok(later.nodes.length >= early.nodes.length);
    assert.ok(diff.addedNodes.length > 0 || diff.changedNodes.length > 0);
    assert.ok(diff.addedEdges.length > 0 || diff.changedEdges.length > 0);
});

test('repeated mentions increase entity confidence', () => {
    const graph = new WorldStateGraph();

    const first = buildReportContract({
        id: '44444444-dddd-4444-8444-444444444444',
        createdBy: 'agent:analyst',
        createdAt: 10,
        payload: {
            title: 'Alpha queue watch',
            summary: 'Queue alpha delay noticed',
            findings: [{ id: 'x', statement: 'alpha queue delay', recommendation: 'watch alpha queue' }]
        }
    });

    const second = buildReportContract({
        id: '55555555-eeee-4555-8555-555555555555',
        createdBy: 'agent:analyst',
        createdAt: 20,
        payload: {
            title: 'Alpha queue escalation',
            summary: 'Queue alpha delay persists',
            findings: [{ id: 'y', statement: 'alpha queue delay persists', recommendation: 'migrate queue alpha' }]
        }
    });

    graph.ingestContract(first);
    const before = graph.getSnapshot();
    const alphaBefore = before.nodes.find((node) => node.entity === 'alpha');

    graph.ingestContract(second);
    const after = graph.getSnapshot();
    const alphaAfter = after.nodes.find((node) => node.entity === 'alpha');

    assert.ok(alphaBefore);
    assert.ok(alphaAfter);
    assert.ok(alphaAfter.confidence >= alphaBefore.confidence);
    assert.ok(alphaAfter.mentions > alphaBefore.mentions);
});
