import test from 'node:test';
import assert from 'node:assert/strict';
import { runCapabilityChecks } from './capability-test-utils.js';
import {
    buildPrivacyPreservingCollaboration,
    privacyCollaborationToTasks,
    PrivacyPreservingCollaborationLayer
} from '../index.js';

test('capability 93 privacy-preserving collaboration layer', () => {
    runCapabilityChecks({
        buildReport: buildPrivacyPreservingCollaboration,
        toTasks: privacyCollaborationToTasks,
        ClassCtor: PrivacyPreservingCollaborationLayer,
        input: {
            privacyPolicies: [{
                policyId: 'policy-email',
                field: 'email',
                allowedPurposes: ['support'],
                requireConsent: true,
                anonymizationRequired: true,
                sensitivity: 84
            }],
            collaborationRequests: [{
                requestId: 'req-1',
                fields: ['email'],
                purpose: 'analytics',
                participantCount: 24,
                hasConsent: false,
                hasAnonymization: false
            }]
        },
        assertReport: (report) => {
            assert.equal(report.summary.decisionCounts.deny, 1);
            assert.equal(report.alerts.includes('privacy_denials_present'), true);
        }
    });
});
