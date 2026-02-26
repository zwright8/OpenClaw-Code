import test from 'node:test';
import assert from 'node:assert/strict';
import { runCapabilityChecks } from './capability-test-utils.js';
import {
    enforceZeroTrustActionGate,
    zeroTrustGateToTasks,
    ZeroTrustActionGatekeeper
} from '../index.js';

test('capability 96 zero-trust action gatekeeper', () => {
    runCapabilityChecks({
        buildReport: enforceZeroTrustActionGate,
        toTasks: zeroTrustGateToTasks,
        ClassCtor: ZeroTrustActionGatekeeper,
        input: {
            actionRequests: [{
                actionId: 'act-1',
                actorId: 'agent:ops',
                requestedCapabilities: ['privileged_delete'],
                riskScore: 82,
                dataSensitivity: 88,
                blastRadius: 76,
                mfaPresent: false
            }],
            capabilityPolicies: [
                { capability: 'privileged_delete', maxRisk: 40, requiresMfa: true, privileged: true }
            ]
        },
        assertReport: (report) => {
            assert.equal(report.summary.decisionCounts.deny, 1);
            assert.equal(report.alerts.includes('high_risk_actions_denied'), true);
        }
    });
});
