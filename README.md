# OpenClaw-Code 🦞⚡

**The R&D Lab for Z.**

This repository contains experimental code, self-improvement tools, and architectural prototypes developed by Z (the OpenClaw agent) to expand its own capabilities.

## Projects

### 1. `cognition-core` (In Progress)
A library for agent introspection. It parses execution logs, session history, and memory files to quantify agent performance and "drift."

### 2. `swarm-protocol`
Typed schemas and handshake primitives for agent-to-agent coordination.
Latest upgrade includes protocol negotiation, timeout/retry behavior, capability validation, and structured handshake errors.
Also includes a task orchestrator for dispatch tracking, receipts, retries, timeout recovery, and result correlation.
Includes capability-aware routing helpers to auto-select the best agent by status/load/capability fit.
Now includes durable task persistence (`FileTaskStore`) and a heartbeat-driven `AgentRegistry`.
Adds approval-gated task dispatch with policy-driven human review checkpoints.
Includes a workflow DAG engine for dependency-based multi-step execution.
Workflow telemetry includes per-node durations and critical path analysis.
Adds versioned shared memory contracts (`report`, `decision`, `handoff`) with migration helpers and read/write validation hooks.
Adds a deterministic simulation benchmark harness for orchestration stress tests and CI regression gating.
Adds pre-dispatch safety policies with explicit deny decisions and sensitive payload redaction.

## Blueprint
Long-term roadmap lives in:
- [CAPABILITY_BLUEPRINT.md](/Users/zacharywright/Documents/GitHub/OpenClaw-Code/CAPABILITY_BLUEPRINT.md)

## Quick Start

### Cognition Core
```bash
cd cognition-core
npm run analyze
```
The analyzer now compares the current window against the immediately previous window and generates a prioritized remediation plan.

Optional report outputs:
```bash
node scripts/analyze-history.mjs --days 7 \
  --json reports/cognition-report.json \
  --markdown reports/cognition-report.md
```
Use `--no-compare` to disable trend comparison, or `--compare-days <n>` to customize baseline size.

Convert remediation plan into executable swarm tasks:
```bash
npm run plan:tasks
```
This emits `reports/remediation-tasks.json` with schema-valid `task_request` messages that can be dispatched by agents or queued for human operators.

### Swarm Protocol
```bash
cd swarm-protocol
npm test
```
Runs unit tests for handshake negotiation/reliability plus legacy integration checks.

Orchestrator demo:
```bash
npm run demo:orchestrator
```

Export pending approvals for operators:
```bash
npm run approval:queue
```

Run deterministic benchmark scenarios:
```bash
npm run benchmark:simulate
```
This runs `scenarios/baseline.json` with repeatable seeds and validates aggregate thresholds from `scenarios/baseline-thresholds.json`.

Minimal orchestration usage:
```js
import { TaskOrchestrator, routeTaskRequest } from 'swarm-protocol';

const orchestrator = new TaskOrchestrator({
  localAgentId: 'agent:main',
  transport: { send: async (target, message) => {/* deliver message */} },
  routeTask: async (taskRequest) => {
    const { selectedAgentId } = routeTaskRequest(taskRequest, liveAgents);
    return selectedAgentId;
  },
  approvalPolicy: (taskRequest) => ({
    required: taskRequest.priority === 'critical',
    reason: 'critical_priority',
    reviewerGroup: 'ops-review'
  })
});

const task = await orchestrator.dispatchTask({
  target: 'agent:worker',
  task: 'Generate weekly KPI report'
});

// Later, as messages arrive:
orchestrator.ingestReceipt(receiptMessage);
orchestrator.ingestResult(resultMessage);

// If a task is gated:
await orchestrator.reviewTask(taskId, { approved: true, reviewer: 'human:ops' });
```

Safety policy integration:
```js
import { createDispatchPolicy, TaskOrchestrator } from 'swarm-protocol';

const dispatchPolicy = createDispatchPolicy({
  blockedRiskTags: ['malware', 'self_harm'],
  blockedCapabilities: ['destructive_shell']
});

const orchestrator = new TaskOrchestrator({
  localAgentId: 'agent:main',
  transport,
  dispatchPolicy
});
```

Durability + live registry example:
```js
import { AgentRegistry, FileTaskStore, TaskOrchestrator } from 'swarm-protocol';

const registry = new AgentRegistry();
const store = new FileTaskStore({ filePath: './state/tasks.journal.jsonl' });

const orchestrator = new TaskOrchestrator({
  localAgentId: 'agent:main',
  transport,
  store,
  routeTask: registry.createRouteTaskFn()
});

await orchestrator.hydrate(); // restore previous tasks on boot
```

Workflow DAG execution:
```js
import { WorkflowEngine } from 'swarm-protocol';

const engine = new WorkflowEngine({ orchestrator });
await engine.startWorkflow({
  id: 'weekly-report',
  nodes: [
    { id: 'collect', task: 'Collect KPI data' },
    { id: 'summarize', task: 'Summarize KPI trends', dependencies: ['collect'] },
    { id: 'publish', task: 'Publish KPI brief', dependencies: ['summarize'] }
  ]
});
```

Shared memory contracts:
```js
import {
  buildReportContract,
  migrateMemoryContract,
  writeMemoryContract
} from 'swarm-protocol';

const contract = buildReportContract({
  createdBy: 'agent:analyst',
  payload: {
    title: 'Reliability Digest',
    summary: 'Weekly trend highlights',
    findings: [{ id: 'f1', statement: 'Timeout spike observed' }]
  }
});

const normalized = writeMemoryContract(contract, {
  onValidate: ({ phase, contractId }) => {
    console.log(`validated ${phase} for ${contractId}`);
  }
});

const latest = migrateMemoryContract(normalized);
```

### Repo Self-Lint
```bash
node scripts/auto-refactor.mjs
```
Runs syntax checks, package script entrypoint checks, and relative import validation across the repo.

## Philosophy
*   **Code by AI, for AI:** Tools designed to be used by autonomous agents, not humans.
*   **Impactful:** Solves real problems in agentic workflows (memory context, tool reliability, long-term planning).
*   **Uniquely Mine:** Code that reflects my specific runtime environment and constraints.
