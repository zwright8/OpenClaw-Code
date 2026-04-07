# MiroFish Integration Plan

## Goal

Use `MiroFish` as OpenClaw's world-simulation plane while keeping OpenClaw responsible for planning, approvals, routing, journaling, and learning loops.

This keeps the architecture aligned with [OPENCLAW_ARCHITECTURE_VNEXT.md](./OPENCLAW_ARCHITECTURE_VNEXT.md):

- `cognition-core`: decides what to simulate and why
- `swarm-protocol/runtime`: owns the stable task contract
- `agent:world-sim`: translates stable OpenClaw tasks into MiroFish API calls
- `MiroFish`: builds the world graph, runs simulations, and generates reports

## Why This Split

- OpenClaw already has the control plane: queueing, approvals, dispatch, audits, retries, and longitudinal learning.
- MiroFish already has the simulation plane: graph building, persona generation, OASIS/CAMEL simulation, report generation, and interview endpoints.
- MiroFish is licensed under `AGPL-3.0`, so the safest first move is service isolation rather than code-copying.

## First Milestone

Implement one stable task contract for `agent:world-sim`:

- Operation: `build_world_graph`
- Provider: `mirofish`
- Target agent: `agent:world-sim`

This contract is defined in [world-sim-contracts.ts](./swarm-protocol/src/world-sim-contracts.ts).

The contract carries:

- mission metadata: `worldId`, `projectId`, `objective`, `scenarioPrompt`
- seed materials: news, policy drafts, reports, documents, stories, datasets, or transcripts
- optional ontology hints for entity/relation extraction
- graph build settings: `graphName`, `chunkSize`, `chunkOverlap`
- governance hints: `sensitivity`, `requiresHumanApproval`, `maxSimulationRounds`
- result routing: artifact directory and preferred memory contract type

## Task-to-Endpoint Mapping

The intended adapter mapping is:

1. `build_world_graph`
   - MiroFish endpoints:
   - `POST /api/graph/build`
   - `GET /api/graph/task/<task_id>`
   - `GET /api/graph/data/<graph_id>`
2. `prepare_world_simulation`
   - MiroFish endpoints:
   - `POST /api/simulation/create`
   - `POST /api/simulation/prepare`
   - `POST /api/simulation/prepare/status`
3. `run_world_simulation`
   - MiroFish endpoints:
   - `POST /api/simulation/start`
   - `GET /api/simulation/<simulation_id>/run-status`
   - `GET /api/simulation/<simulation_id>/timeline`
4. `generate_world_report`
   - MiroFish endpoints:
   - `POST /api/report/generate`
   - `POST /api/report/generate/status`
   - `GET /api/report/<report_id>`
5. `interview_simulated_agents`
   - MiroFish endpoints:
   - `POST /api/simulation/interview`
   - `POST /api/simulation/interview/batch`
   - `POST /api/simulation/interview/all`

## Adapter Responsibilities

`agent:world-sim` should be a thin translator, not a second planner.

It should:

1. Accept OpenClaw `task_request` messages and parse the typed `world_sim_task` context.
2. Translate the task into the right MiroFish API call sequence.
3. Poll provider task status until completion or timeout.
4. Save provider outputs under `reports/world-sim/<worldId>/`.
5. Emit a normal OpenClaw `task_result`.
6. Optionally emit a memory contract summarizing graph, simulation, or report outputs.

It should not:

- invent new goals
- bypass OpenClaw approval policy
- couple `cognition-core` directly to MiroFish endpoints

## Suggested Artifact Layout

Store adapter outputs here:

- `reports/world-sim/<worldId>/graph-build.request.json`
- `reports/world-sim/<worldId>/graph-build.response.json`
- `reports/world-sim/<worldId>/graph-data.json`
- `reports/world-sim/<worldId>/simulation-config.json`
- `reports/world-sim/<worldId>/simulation-status.json`
- `reports/world-sim/<worldId>/timeline.json`
- `reports/world-sim/<worldId>/report.md`
- `reports/world-sim/<worldId>/report-meta.json`

## Example Usage

The first contract can now be built in code like this:

```ts
import { buildWorldSimBuildGraphTaskRequest } from './swarm-protocol/runtime.js';

const task = buildWorldSimBuildGraphTaskRequest({
  from: 'agent:planning',
  request: {
    worldId: 'world-policy-001',
    projectId: 'policy-lab',
    objective: 'Model downstream reaction to a proposed policy change',
    scenarioPrompt: 'Simulate the first 72 hours of stakeholder reaction.',
    seedMaterials: [
      {
        id: 'seed-1',
        kind: 'policy',
        title: 'Draft policy summary',
        inlineText: 'The draft introduces a new compliance regime for large platforms.'
      }
    ]
  }
});
```

## Recommended Next Steps

1. Add a small `cognition-core` planner that generates `build_world_graph` tasks for high-uncertainty or high-impact scenarios.
2. Implement a standalone `agent:world-sim` worker outside this repo or in a clearly isolated package.
3. Feed completed world-sim outputs back into OpenClaw as report or handoff memory contracts.
4. Add follow-on contracts for simulation runs, report generation, and agent interviews after the graph-build loop is stable.
