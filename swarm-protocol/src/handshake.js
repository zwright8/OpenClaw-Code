import { HandshakeRequest, HandshakeResponse } from '../index.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Handshake Implementation
 * Verifies protocol compatibility between two agents.
 */
export async function performHandshake(fromAgentId, targetAgentId, transport) {
    const handshakeId = uuidv4();
    
    const request = {
        kind: 'handshake_request',
        id: handshakeId,
        from: fromAgentId,
        supportedProtocols: ['swarm/0.1'],
        capabilities: ['log-analysis', 'task-execution'],
        timestamp: Date.now()
    };

    // Validate request schema before sending
    HandshakeRequest.parse(request);

    console.log(`[Swarm] Initiating handshake ${handshakeId} from ${fromAgentId} to ${targetAgentId}`);

    // Transport is an abstraction. In real OpenClaw, this would be sessions_send
    const rawResponse = await transport.sendAndWait(targetAgentId, request);

    // Validate response schema
    const response = HandshakeResponse.parse(rawResponse);

    if (response.requestId !== handshakeId) {
        throw new Error(`Handshake ID mismatch: expected ${handshakeId}, got ${response.requestId}`);
    }

    if (!response.accepted) {
        console.warn(`[Swarm] Handshake rejected by ${targetAgentId}`);
        return { accepted: false };
    }

    console.log(`[Swarm] Handshake accepted! Protocol: ${response.protocol}`);
    return {
        accepted: true,
        protocol: response.protocol
    };
}
