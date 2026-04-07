import test from 'node:test';
import assert from 'node:assert/strict';
import { runCapabilityChecks } from './capability-test-utils.js';
import {
    optimizeAgentTeamTopology,
    teamTopologyToTasks,
    AgentTeamTopologyOptimizer
} from '../index.js';

test('capability 90 agent team topology optimizer', () => {
    runCapabilityChecks({
        buildReport: optimizeAgentTeamTopology,
        toTasks: teamTopologyToTasks,
        ClassCtor: AgentTeamTopologyOptimizer,
        input: {
            agents: [
                { agentId: 'a1', skills: ['analysis'], reliability: 82, throughput: 70, coordinationCost: 28, availability: 88 },
                { agentId: 'a2', skills: ['deploy'], reliability: 75, throughput: 68, coordinationCost: 42, availability: 72 }
            ],
            missions: [{
                missionId: 'm1',
                missionType: 'incident',
                requiredSkills: ['analysis', 'security', 'deploy'],
                riskScore: 84,
                urgency: 90,
                coordinationComplexity: 76
            }]
        },
        assertReport: (report) => {
            assert.equal(report.summary.missionCount, 1);
            assert.equal(report.summary.capabilityGapCount, 1);
        }
    });
});
