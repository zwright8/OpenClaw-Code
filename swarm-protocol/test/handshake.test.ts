import test from 'node:test';
import assert from 'node:assert/strict';
import { performHandshake, HandshakeError } from '../index.js';

function createSilentLogger() {
    return {
        info() {},
        warn() {},
        error() {}
    };
}

test('accepts handshake when peer returns compatible explicit protocol', async () => {
    const transport = {
        async sendAndWait(target, request) {
            return {
                kind: 'handshake_response',
                requestId: request.id,
                from: target,
                accepted: true,
                protocol: 'swarm/0.2',
                capabilities: ['code-analysis', 'task-execution'],
                timestamp: Date.now()
            };
        }
    };

    const result = await performHandshake('agent:alpha', 'agent:beta', transport, {
        supportedProtocols: ['swarm/0.1', 'swarm/0.2'],
        logger: createSilentLogger()
    });

    assert.equal(result.accepted, true);
    assert.equal(result.protocol, 'swarm/0.2');
    assert.equal(result.attempts, 1);
    assert.deepEqual(result.missingCapabilities, []);
});

test('negotiates highest mutual protocol when peer provides supported list', async () => {
    const transport = {
        async sendAndWait(target, request) {
            return {
                kind: 'handshake_response',
                requestId: request.id,
                from: target,
                accepted: true,
                supportedProtocols: ['swarm/0.3', 'swarm/0.1'],
                timestamp: Date.now()
            };
        }
    };

    const result = await performHandshake('agent:alpha', 'agent:beta', transport, {
        supportedProtocols: ['swarm/0.2', 'swarm/0.1'],
        logger: createSilentLogger()
    });

    assert.equal(result.accepted, true);
    assert.equal(result.protocol, 'swarm/0.1');
});

test('returns rejected result when required capabilities are missing', async () => {
    const transport = {
        async sendAndWait(target, request) {
            return {
                kind: 'handshake_response',
                requestId: request.id,
                from: target,
                accepted: true,
                protocol: 'swarm/0.1',
                capabilities: ['search'],
                timestamp: Date.now()
            };
        }
    };

    const result = await performHandshake('agent:alpha', 'agent:beta', transport, {
        requiredCapabilities: ['exec', 'search'],
        logger: createSilentLogger()
    });

    assert.equal(result.accepted, false);
    assert.equal(result.reason, 'missing_capabilities');
    assert.deepEqual(result.missingCapabilities, ['exec']);
});

test('retries once on timeout and then succeeds', async () => {
    let calls = 0;
    const transport = {
        async sendAndWait(target, request) {
            calls++;
            if (calls === 1) {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({
                            kind: 'handshake_response',
                            requestId: request.id,
                            from: target,
                            accepted: true,
                            protocol: 'swarm/0.1',
                            timestamp: Date.now()
                        });
                    }, 50);
                });
            }

            return {
                kind: 'handshake_response',
                requestId: request.id,
                from: target,
                accepted: true,
                protocol: 'swarm/0.1',
                timestamp: Date.now()
            };
        }
    };

    const result = await performHandshake('agent:alpha', 'agent:beta', transport, {
        timeoutMs: 5,
        retries: 1,
        retryDelayMs: 1,
        logger: createSilentLogger()
    });

    assert.equal(result.accepted, true);
    assert.equal(result.attempts, 2);
    assert.equal(calls, 2);
});

test('throws HandshakeError when no mutual protocol exists', async () => {
    const transport = {
        async sendAndWait(target, request) {
            return {
                kind: 'handshake_response',
                requestId: request.id,
                from: target,
                accepted: true,
                protocol: 'swarm/9.9',
                timestamp: Date.now()
            };
        }
    };

    await assert.rejects(
        () => performHandshake('agent:alpha', 'agent:beta', transport, {
            supportedProtocols: ['swarm/0.1', 'swarm/0.2'],
            logger: createSilentLogger()
        }),
        (error) => {
            assert.equal(error instanceof HandshakeError, true);
            assert.equal(error.code, 'PROTOCOL_NEGOTIATION_FAILED');
            return true;
        }
    );
});

test('throws HandshakeError on request/response id mismatch', async () => {
    const transport = {
        async sendAndWait(target) {
            return {
                kind: 'handshake_response',
                requestId: '00000000-0000-4000-8000-000000000000',
                from: target,
                accepted: true,
                protocol: 'swarm/0.1',
                timestamp: Date.now()
            };
        }
    };

    await assert.rejects(
        () => performHandshake('agent:alpha', 'agent:beta', transport, {
            logger: createSilentLogger()
        }),
        (error) => {
            assert.equal(error instanceof HandshakeError, true);
            assert.equal(error.code, 'ID_MISMATCH');
            return true;
        }
    );
});
