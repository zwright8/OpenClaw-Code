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

test('uses exponential backoff with full jitter by default', async () => {
    let calls = 0;
    const delays = [];

    const transport = {
        async sendAndWait(target, request) {
            calls++;
            if (calls === 1) {
                throw new Error('temporary transport failure');
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
        retries: 1,
        retryDelayMs: 100,
        random: () => 0.5,
        sleep: async (ms) => {
            delays.push(ms);
        },
        logger: createSilentLogger()
    });

    assert.equal(result.accepted, true);
    assert.equal(result.attempts, 2);
    assert.deepEqual(delays, [50]);
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

test('uses capped exponential backoff with full jitter between retries', async () => {
    let calls = 0;
    let nowMs = 10_000;
    const delays = [];

    const transport = {
        async sendAndWait(target, request) {
            calls++;
            if (calls < 3) {
                throw new Error('temporary transport failure');
            }
            return {
                kind: 'handshake_response',
                requestId: request.id,
                from: target,
                accepted: true,
                protocol: 'swarm/0.1',
                timestamp: nowMs
            };
        }
    };

    const result = await performHandshake('agent:alpha', 'agent:beta', transport, {
        retries: 2,
        retryDelayMs: 100,
        retryStrategy: 'exponential',
        maxRetryDelayMs: 150,
        retryJitter: 'full',
        random: () => 0.5,
        now: () => nowMs,
        sleep: async (ms) => {
            delays.push(ms);
            nowMs += ms;
        },
        logger: createSilentLogger()
    });

    assert.equal(result.accepted, true);
    assert.equal(result.attempts, 3);
    assert.deepEqual(delays, [50, 75]);
});

test('throws RETRY_BUDGET_EXHAUSTED when retry budget is consumed', async () => {
    let calls = 0;
    let nowMs = 20_000;
    const delays = [];

    const transport = {
        async sendAndWait() {
            calls++;
            throw new Error('temporary transport failure');
        }
    };

    await assert.rejects(
        () => performHandshake('agent:alpha', 'agent:beta', transport, {
            retries: 3,
            retryDelayMs: 200,
            retryStrategy: 'exponential',
            retryJitter: 'none',
            retryBudgetMs: 250,
            now: () => nowMs,
            sleep: async (ms) => {
                delays.push(ms);
                nowMs += ms;
            },
            logger: createSilentLogger()
        }),
        (error) => {
            assert.equal(error instanceof HandshakeError, true);
            assert.equal(error.code, 'RETRY_BUDGET_EXHAUSTED');
            return true;
        }
    );

    assert.equal(calls, 2);
    assert.deepEqual(delays, [200, 50]);
});

test('honors structured retryAfterMs on transport error before retrying handshake', async () => {
    let calls = 0;
    const delays = [];

    const transport = {
        async sendAndWait(target, request) {
            calls++;
            if (calls === 1) {
                const error: any = new Error('HTTP 503');
                error.retryAfterMs = 350;
                throw error;
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
        retries: 1,
        retryDelayMs: 25,
        sleep: async (ms) => {
            delays.push(ms);
        },
        logger: createSilentLogger()
    });

    assert.equal(result.accepted, true);
    assert.equal(result.attempts, 2);
    assert.deepEqual(delays, [350]);
});

test('honors Retry-After header and clamps large hints with maxRetryHintMs', async () => {
    let calls = 0;
    const delays = [];

    const transport = {
        async sendAndWait(target, request) {
            calls++;
            if (calls === 1) {
                const error: any = new Error('HTTP 429 Too Many Requests');
                error.response = {
                    headers: {
                        'retry-after': '120'
                    }
                };
                throw error;
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
        retries: 1,
        retryDelayMs: 10,
        maxRetryHintMs: 1_250,
        sleep: async (ms) => {
            delays.push(ms);
        },
        logger: createSilentLogger()
    });

    assert.equal(result.accepted, true);
    assert.equal(result.attempts, 2);
    assert.deepEqual(delays, [1_250]);
});

test('honors RateLimit-Reset header when Retry-After is absent', async () => {
    let calls = 0;
    let nowMs = 50_000;
    const delays = [];

    const transport = {
        async sendAndWait(target, request) {
            calls++;
            if (calls === 1) {
                const error: any = new Error('HTTP 429 Too Many Requests');
                error.response = {
                    headers: {
                        'ratelimit-reset': '57'
                    }
                };
                throw error;
            }

            return {
                kind: 'handshake_response',
                requestId: request.id,
                from: target,
                accepted: true,
                protocol: 'swarm/0.1',
                timestamp: nowMs
            };
        }
    };

    const result = await performHandshake('agent:alpha', 'agent:beta', transport, {
        retries: 1,
        retryDelayMs: 10,
        now: () => nowMs,
        sleep: async (ms) => {
            delays.push(ms);
            nowMs += ms;
        },
        logger: createSilentLogger()
    });

    assert.equal(result.accepted, true);
    assert.equal(result.attempts, 2);
    assert.deepEqual(delays, [7_000]);
});
