import { performHandshake } from './index.js';

async function runTest() {
    console.log('--- Testing Handshake Logic ---');

    // Mock transport
    const mockTransport = {
        sendAndWait: async (target, request) => {
            console.log(`[MockTransport] Sending to ${target}: ${request.kind}`);
            
            // Simulate agent response
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

    try {
        const result = await performHandshake('agent:alpha', 'agent:beta', mockTransport);
        if (result.accepted) {
            console.log('✅ Handshake test passed!');
        } else {
            console.error('❌ Handshake test failed: not accepted');
            process.exit(1);
        }
    } catch (e) {
        console.error('❌ Handshake test crashed:', e);
        process.exit(1);
    }

    console.log('\n--- Testing Protocol Validation ---');
    // Import from the original test for validation checks
    try {
        await import('./test.js');
    } catch (e) {
        // Handle common ESM/CJS issues in quick scripts if any
        console.error(e);
    }
}

runTest();
