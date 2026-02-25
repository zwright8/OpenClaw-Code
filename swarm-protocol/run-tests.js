import { performHandshake } from './index.js';

async function runTest() {
    console.log('--- Testing Handshake Logic ---');

    const mockTransport = {
        sendAndWait: async (target, request) => {
            console.log(`[MockTransport] Sending to ${target}: ${request.kind}`);
            return {
                kind: 'handshake_response',
                requestId: request.id,
                from: target,
                accepted: true,
                supportedProtocols: ['swarm/0.2', 'swarm/0.1'],
                capabilities: ['log-analysis', 'task-execution', 'web-search'],
                timestamp: Date.now()
            };
        }
    };

    try {
        const result = await performHandshake('agent:alpha', 'agent:beta', mockTransport, {
            supportedProtocols: ['swarm/0.2', 'swarm/0.1'],
            requiredCapabilities: ['task-execution']
        });

        if (!result.accepted) {
            console.error('❌ Handshake test failed: not accepted', result);
            process.exit(1);
        }

        if (result.protocol !== 'swarm/0.2') {
            console.error(`❌ Handshake test failed: expected swarm/0.2, got ${result.protocol}`);
            process.exit(1);
        }

        console.log(`✅ Handshake test passed! protocol=${result.protocol} attempts=${result.attempts}`);
    } catch (e) {
        console.error('❌ Handshake test crashed:', e);
        process.exit(1);
    }

    console.log('\n--- Testing Protocol Validation ---');
    try {
        await import('./test.js');
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

runTest();
