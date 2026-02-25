import test from 'node:test';
import assert from 'node:assert/strict';
import { runCapabilityChecks } from './capability-test-utils.js';
import {
    buildCryptographicAttestationMesh,
    attestationMeshToTasks,
    CryptographicAttestationMesh
} from '../index.js';

test('capability 95 cryptographic attestation mesh', () => {
    runCapabilityChecks({
        buildReport: buildCryptographicAttestationMesh,
        toTasks: attestationMeshToTasks,
        ClassCtor: CryptographicAttestationMesh,
        input: {
            artifacts: [{
                artifactId: 'artifact-1',
                producer: 'producer:a',
                payload: 'signed payload',
                hash: 'bad-hash',
                signaturePresent: false,
                lineage: ['missing-parent']
            }],
            trustAnchors: [{ producer: 'producer:a', keyStatus: 'revoked', trustScore: 42 }]
        },
        assertReport: (report) => {
            assert.equal(report.summary.statusCounts.failed, 1);
            assert.equal(report.alerts.includes('attestation_failures_present'), true);
        }
    });
});
