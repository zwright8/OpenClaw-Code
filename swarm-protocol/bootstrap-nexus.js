import { performHandshake } from './src/handshake.js';

class MockTransport {
    async sendAndWait(targetAgentId, request) {
        if (targetAgentId === 'nexus' && request.kind === 'handshake_request') {
            return {
                kind: 'handshake_response',
                requestId: request.id,
                from: 'nexus',
                accepted: true,
                protocol: 'swarm/0.1',
                capabilities: ['technical-research', 'data-synthesis'],
                timestamp: Date.now()
            };
        }
        throw new Error(`No response for target: ${targetAgentId}`);
    }
}

async function bootstrapNexus() {
    const transport = new MockTransport();
    try {
        const result = await performHandshake('main', 'nexus', transport, {
            supportedProtocols: ['swarm/0.1'],
            requiredCapabilities: ['technical-research']
        });
        console.log('HANDSHAKE_SUCCESS');
        console.log(JSON.stringify(result, null, 2));
    } catch (err) {
        console.error('HANDSHAKE_FAILED', err.message);
    }
}

bootstrapNexus();
