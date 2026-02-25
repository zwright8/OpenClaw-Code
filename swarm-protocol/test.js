import { TaskRequest, TaskResult } from './index.js';
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
