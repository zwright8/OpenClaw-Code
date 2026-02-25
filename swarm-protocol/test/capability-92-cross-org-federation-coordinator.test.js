import test from 'node:test';
import assert from 'node:assert/strict';
import { runCapabilityChecks } from './capability-test-utils.js';
import {
    coordinateCrossOrgFederation,
    crossOrgCoordinationToTasks,
    CrossOrgFederationCoordinator
} from '../index.js';

test('capability 92 cross-org federation coordinator', () => {
    runCapabilityChecks({
        buildReport: coordinateCrossOrgFederation,
        toTasks: crossOrgCoordinationToTasks,
        ClassCtor: CrossOrgFederationCoordinator,
        input: {
            organizations: [
                { orgId: 'org-a', trustScore: 82, capabilities: ['analysis'], dataPolicies: ['public'], capacity: 68 },
                { orgId: 'org-b', trustScore: 60, capabilities: ['deploy'], dataPolicies: ['restricted'], capacity: 54 }
            ],
            initiatives: [{
                initiativeId: 'init-1',
                requiredCapabilities: ['analysis', 'security'],
                requiredDataPolicies: ['restricted'],
                urgency: 72,
                criticality: 84
            }]
        },
        assertReport: (report) => {
            assert.equal(report.summary.policyConflictCount > 0 || report.summary.underCoveredCount > 0, true);
            assert.equal(report.alerts.length > 0, true);
        }
    });
});
