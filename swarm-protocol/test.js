import { TaskRequest, TaskResult, TaskReceipt, HandshakeRequest, HandshakeResponse } from './index.js';
import { randomUUID } from 'crypto';

// Sample Request
const request = {
    kind: 'task_request',
    id: randomUUID(),
    from: 'agent:main',
    priority: 'high',
    task: 'Analyze log files',
    context: {
        logPath: '/var/log/openclaw.log'
    },
    createdAt: Date.now()
};

try {
    const parsedReq = TaskRequest.parse(request);
    console.log('✅ TaskRequest valid:', parsedReq.id);
} catch (e) {
    console.error('❌ TaskRequest invalid:', e.errors);
}

// Sample Result
const result = {
    kind: 'task_result',
    taskId: randomUUID(),
    from: 'agent:sub-1',
    status: 'success',
    output: 'Logs analyzed. Found 0 errors.',
    artifacts: [
        { name: 'report.md', path: './report.md' }
    ],
    completedAt: Date.now()
};

try {
    const parsedRes = TaskResult.parse(result);
    console.log('✅ TaskResult valid:', parsedRes.taskId);
} catch (e) {
    console.error('❌ TaskResult invalid:', e.errors);
}

// Sample Receipt
const receipt = {
    kind: 'task_receipt',
    taskId: request.id,
    from: 'agent:sub-1',
    accepted: true,
    etaMs: 1500,
    timestamp: Date.now()
};

try {
    const parsedReceipt = TaskReceipt.parse(receipt);
    console.log('✅ TaskReceipt valid:', parsedReceipt.taskId);
} catch (e) {
    console.error('❌ TaskReceipt invalid:', e.errors);
}

// Sample Handshake Request
const handshakeReq = {
    kind: 'handshake_request',
    id: randomUUID(),
    from: 'agent:new-peer',
    supportedProtocols: ['swarm/1.0', 'swarm/2.0'],
    capabilities: ['code-analysis', 'web-search'],
    timestamp: Date.now()
};

try {
    const parsedHandshake = HandshakeRequest.parse(handshakeReq);
    console.log('✅ HandshakeRequest valid:', parsedHandshake.id);
} catch (e) {
    console.error('❌ HandshakeRequest invalid:', e.errors);
}
