import {
    AgentRegistry,
    TaskOrchestrator,
    buildTaskReceipt,
    buildTaskResult,
    routeTaskRequest
} from '../index.js';

function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
    const registry = new AgentRegistry();
    registry.ingestHeartbeat({
        kind: 'signal_heartbeat',
        from: 'agent:research',
        status: 'idle',
        load: 0.3,
        timestamp: Date.now()
    }, { capabilities: ['analysis', 'research'] });
    registry.ingestHeartbeat({
        kind: 'signal_heartbeat',
        from: 'agent:ops',
        status: 'idle',
        load: 0.2,
        timestamp: Date.now()
    }, { capabilities: ['operations', 'deploy', 'reliability'] });
    registry.ingestHeartbeat({
        kind: 'signal_heartbeat',
        from: 'agent:docs',
        status: 'busy',
        load: 0.6,
        timestamp: Date.now()
    }, { capabilities: ['documentation', 'writing'] });

    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        routeTask: async (taskRequest) => {
            const routed = routeTaskRequest(taskRequest, registry.listAgents(), {
                nowMs: Date.now(),
                maxStalenessMs: 60_000
            });
            return routed.selectedAgentId;
        },
        transport: {
            async send(target, request) {
                console.log(`[dispatch] -> ${target} task=${request.id} priority=${request.priority}`);

                // Simulated worker behavior.
                setTimeout(() => {
                    orchestrator.ingestReceipt(buildTaskReceipt({
                        taskId: request.id,
                        from: target,
                        accepted: true,
                        etaMs: 500,
                        timestamp: Date.now()
                    }));
                }, 100);

                setTimeout(() => {
                    orchestrator.ingestResult(buildTaskResult({
                        taskId: request.id,
                        from: target,
                        status: 'success',
                        output: `Completed: ${request.task}`,
                        completedAt: Date.now()
                    }));
                }, 350);
            }
        },
        defaultTimeoutMs: 1_000,
        maxRetries: 2,
        retryDelayMs: 150
    });

    const tasks = [
        {
            task: 'Summarize latest customer churn patterns',
            priority: 'high',
            context: { requiredCapabilities: ['analysis'] }
        },
        {
            task: 'Draft reliability checklist for weekend deploy',
            priority: 'normal',
            context: { requiredCapabilities: ['reliability'] }
        },
        {
            task: 'Generate API integration quickstart',
            priority: 'normal',
            context: { requiredCapabilities: ['documentation'] }
        }
    ];

    for (const task of tasks) {
        const record = await orchestrator.dispatchTask(task);
        console.log(`[created] ${record.taskId} status=${record.status}`);
    }

    // Maintenance loop: in production this would be a timer/cron.
    for (let tick = 0; tick < 20; tick++) {
        await orchestrator.runMaintenance(Date.now());
        const openCount = orchestrator.listTasks({ openOnly: true }).length;
        if (openCount === 0) break;
        await wait(100);
    }

    console.log('\nFinal Metrics:');
    console.log(orchestrator.getMetrics());

    console.log('\nTask Outcomes:');
    for (const task of orchestrator.listTasks()) {
        console.log(`- ${task.taskId} target=${task.target} status=${task.status} attempts=${task.attempts}`);
    }
}

main().catch((error) => {
    console.error('Demo failed:', error);
    process.exit(1);
});
