import test from 'node:test';
import assert from 'node:assert/strict';
import {
    MemoryContractError,
    buildDecisionContract,
    buildHandoffContract,
    buildMemoryContract,
    buildReportContract,
    getLatestContractVersion,
    listContractTypes,
    migrateMemoryContract,
    readMemoryContract,
    writeMemoryContract
} from '../index.js';

test('listContractTypes and latest versions are exposed', () => {
    assert.deepEqual(
        listContractTypes().sort(),
        ['decision', 'handoff', 'report']
    );
    assert.equal(getLatestContractVersion('report'), 2);
    assert.equal(getLatestContractVersion('decision'), 1);
});

test('buildReportContract validates and defaults to latest version', () => {
    const contract = buildReportContract({
        id: '11111111-1111-4111-8111-111111111111',
        createdBy: 'agent:main',
        createdAt: 1_000,
        payload: {
            title: 'Weekly Reliability Digest',
            summary: 'Tool error rate increased in two workflows.',
            findings: [
                {
                    id: 'f1',
                    severity: 'high',
                    statement: 'Retry storms on flaky worker',
                    recommendation: 'Apply jittered backoff policy'
                }
            ]
        }
    });

    assert.equal(contract.kind, 'memory_contract');
    assert.equal(contract.contractType, 'report');
    assert.equal(contract.contractVersion, 2);
    assert.equal(contract.payload.audience, 'mixed');
    assert.deepEqual(contract.payload.actions, []);
});

test('invalid decision payload raises MemoryContractError', () => {
    assert.throws(
        () => buildDecisionContract({
            id: '22222222-2222-4222-8222-222222222222',
            createdBy: 'agent:main',
            createdAt: 2_000,
            payload: {
                topic: '',
                decision: 'Proceed',
                rationale: 'Confident'
            }
        }),
        (error) => {
            assert.equal(error instanceof MemoryContractError, true);
            assert.equal(error.code, 'INVALID_CONTRACT_PAYLOAD');
            return true;
        }
    );
});

test('migrateMemoryContract upgrades report contract v1 to v2', () => {
    const legacy = buildMemoryContract({
        id: '33333333-3333-4333-8333-333333333333',
        contractType: 'report',
        contractVersion: 1,
        createdBy: 'agent:legacy',
        createdAt: 3_000,
        payload: {
            title: 'Legacy Ops Report',
            summary: 'Single worker was overloaded.',
            findings: [
                {
                    id: 'f-legacy',
                    severity: 'high',
                    statement: 'Queue depth exceeded threshold',
                    recommendation: 'Scale out worker pool'
                }
            ]
        }
    });

    const migrated = migrateMemoryContract(legacy);
    assert.equal(migrated.contractVersion, 2);
    assert.equal(migrated.payload.audience, 'mixed');
    assert.deepEqual(migrated.payload.actions, ['Scale out worker pool']);
});

test('read/write validation hooks run for both phases', () => {
    const phases = [];
    const contract = buildHandoffContract({
        id: '44444444-4444-4444-8444-444444444444',
        createdBy: 'agent:planner',
        createdAt: 4_000,
        payload: {
            from: 'agent:planner',
            to: 'agent:executor',
            objective: 'Ship simulation benchmark MVP',
            openQuestions: ['Should we include overload spikes?'],
            artifacts: [
                {
                    name: 'Scenario seed notes',
                    path: 'reports/scenario-seeds.md'
                }
            ]
        }
    });

    const written = writeMemoryContract(contract, {
        onValidate({ phase }) {
            phases.push(phase);
        }
    });
    const read = readMemoryContract(written, {
        onValidate({ phase }) {
            phases.push(phase);
        }
    });

    assert.equal(read.contractType, 'handoff');
    assert.deepEqual(phases, ['write', 'read']);
});

test('migration rejects unsupported target version', () => {
    const decision = buildDecisionContract({
        id: '55555555-5555-4555-8555-555555555555',
        createdBy: 'agent:main',
        createdAt: 5_000,
        payload: {
            topic: 'Adopt benchmark threshold',
            decision: 'Use p95 latency gate',
            rationale: 'Protect tail latency regressions'
        }
    });

    assert.throws(
        () => migrateMemoryContract(decision, 2),
        (error) => {
            assert.equal(error instanceof MemoryContractError, true);
            assert.equal(error.code, 'TARGET_VERSION_OUT_OF_RANGE');
            return true;
        }
    );
});
