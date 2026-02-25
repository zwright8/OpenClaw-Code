import test from 'node:test';
import assert from 'node:assert/strict';
import { runCapabilityChecks } from './capability-test-utils.js';
import {
    runMultiAgentNegotiation,
    negotiationToTasks,
    MultiAgentNegotiationProtocol
} from '../index.js';

test('capability 91 multi-agent negotiation protocol', () => {
    runCapabilityChecks({
        buildReport: runMultiAgentNegotiation,
        toTasks: negotiationToTasks,
        ClassCtor: MultiAgentNegotiationProtocol,
        input: {
            proposals: [
                { proposalId: 'p1', agentId: 'agent:a', resource: 'gpu', requestedUnits: 4, priority: 'P1', justificationQuality: 72, missionCriticality: 86 },
                { proposalId: 'p2', agentId: 'agent:b', resource: 'gpu', requestedUnits: 4, priority: 'P2', justificationQuality: 58, missionCriticality: 54 }
            ],
            availableResources: { gpu: 4 }
        },
        assertReport: (report) => {
            assert.equal(report.summary.contestedCount > 0, true);
            assert.equal(report.alerts.includes('resource_contention_detected'), true);
        }
    });
});
