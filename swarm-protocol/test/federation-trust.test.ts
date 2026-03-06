import test from 'node:test';
import assert from 'node:assert/strict';
import {
    FederationKeyring,
    ProtocolBridge,
    evaluateTenantBoundary
} from '../index.js';

test('signEnvelope + verifyEnvelope roundtrip', () => {
    const keyring = new FederationKeyring({ now: () => 1_000 });
    keyring.addKey({
        tenantId: 'tenant:alpha',
        keyId: 'k1',
        secret: 'alpha-secret',
        createdAt: 1_000
    });

    const envelope = keyring.signEnvelope({
        tenantId: 'tenant:alpha',
        from: 'agent:alpha',
        to: 'agent:beta',
        protocol: 'swarm/0.2',
        payload: {
            kind: 'task_request',
            context: {
                requiredCapabilities: ['analysis']
            }
        }
    });

    const verification = keyring.verifyEnvelope(envelope);
    assert.equal(verification.ok, true);
    assert.equal(verification.keyId, 'k1');
});

test('key rotation retires previous active key and signs with new key', () => {
    const keyring = new FederationKeyring({ now: () => 2_000 });
    keyring.addKey({
        tenantId: 'tenant:alpha',
        keyId: 'k1',
        secret: 'alpha-secret-v1',
        createdAt: 2_000
    });

    keyring.rotateKey({
        tenantId: 'tenant:alpha',
        newKeyId: 'k2',
        newSecret: 'alpha-secret-v2'
    });

    const envelope = keyring.signEnvelope({
        tenantId: 'tenant:alpha',
        from: 'agent:alpha',
        to: 'agent:gamma',
        protocol: 'swarm/0.2',
        payload: { kind: 'task_request' }
    });

    assert.equal(envelope.keyId, 'k2');

    const keys = keyring.listKeys('tenant:alpha');
    const retired = keys.find((key) => key.keyId === 'k1');
    const active = keys.find((key) => key.keyId === 'k2');
    assert.equal(retired.status, 'retired');
    assert.equal(active.status, 'active');
});

test('evaluateTenantBoundary enforces pair allowlist and blocked capabilities', () => {
    const keyring = new FederationKeyring({ now: () => 3_000 });
    keyring.addKey({
        tenantId: 'tenant:alpha',
        keyId: 'k1',
        secret: 'alpha-secret',
        createdAt: 3_000
    });

    const envelope = keyring.signEnvelope({
        tenantId: 'tenant:alpha',
        from: 'agent:alpha',
        to: 'agent:beta',
        protocol: 'swarm/0.2',
        payload: {
            kind: 'task_request',
            context: {
                requiredCapabilities: ['credential_access']
            }
        },
        metadata: {
            targetTenantId: 'tenant:beta'
        }
    });

    const denied = evaluateTenantBoundary(envelope, {
        localTenantId: 'tenant:beta',
        allowedTenantPairs: ['tenant:alpha->tenant:beta'],
        blockedCrossTenantCapabilities: ['credential_access']
    });

    assert.equal(denied.allowed, false);
    assert.ok(denied.reasons.some((item) => item.code === 'blocked_cross_tenant_capability'));

    const allowed = evaluateTenantBoundary(envelope, {
        localTenantId: 'tenant:beta',
        allowedTenantPairs: ['tenant:alpha->tenant:beta'],
        blockedCrossTenantCapabilities: []
    });

    assert.equal(allowed.allowed, true);
});

test('ProtocolBridge translates between swarm, autogen, and jsonrpc', () => {
    const bridge = new ProtocolBridge();

    const swarmMessage = {
        kind: 'task_request',
        id: '11111111-1111-4111-8111-111111111111',
        from: 'agent:swarm',
        target: 'agent:target',
        priority: 'high',
        task: 'Analyze logs',
        context: { source: 'swarm' },
        constraints: [],
        createdAt: 100
    };

    const autogen = bridge.bridge(swarmMessage, {
        fromProtocol: 'swarm',
        toProtocol: 'autogen-v1'
    });
    assert.equal(autogen.type, 'task');
    assert.equal(autogen.task_id, swarmMessage.id);

    const jsonrpc = bridge.bridge(autogen, {
        fromProtocol: 'autogen-v1',
        toProtocol: 'jsonrpc-2.0'
    });
    assert.equal(jsonrpc.jsonrpc, '2.0');
    assert.equal(jsonrpc.method, 'task.dispatch');

    const backToSwarm = bridge.bridge(jsonrpc, {
        fromProtocol: 'jsonrpc-2.0',
        toProtocol: 'swarm'
    });
    assert.equal(backToSwarm.kind, 'task_request');
    assert.equal(backToSwarm.task, 'Analyze logs');
});
