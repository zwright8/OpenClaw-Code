# OpenClaw Architecture vNext

## Why This Change
Current growth has created a scaling bottleneck:
- `swarm-protocol/src` contains 700+ modules, with large generated capability families.
- `swarm-protocol/index.ts` is a large flat export barrel.
- `cognition-core` (control-loop/learning) imports task contracts from the monolithic swarm barrel instead of a narrow runtime surface.

This architecture works functionally, but it increases coupling and slows safe iteration.

## Target Architecture
Use explicit planes with strict import boundaries.

### 1) Runtime Plane (`swarm-protocol/runtime.ts`)
- Responsibility: task contracts, orchestration primitives, routing, persistence, approvals, audit, workflow/memory contracts.
- Characteristics: stable APIs, high backward-compatibility requirements, deterministic behavior.
- Consumers: `cognition-core`, operator scripts, execution agents.

### 2) Capability Plane (`swarm-protocol/src/*capability*` + generated families)
- Responsibility: domain evaluators and task conversion adapters (including toolkit-based generated modules).
- Characteristics: high-change, experiment-friendly, can grow rapidly.
- Rule: capabilities depend on runtime contracts, not the reverse.

### 3) Cognition Plane (`cognition-core`)
- Responsibility: telemetry ingestion, drift detection, error taxonomy, learning loop, readiness gates, curiosity iteration, skill-growth planning.
- Characteristics: analytics/control-plane logic, longitudinal state, remediation generation.
- Rule: imports only Runtime Plane contracts (`TaskRequest` builders and schemas), never full capability barrels.

### 4) Skill Plane (`skills/generated`)
- Responsibility: large skill catalog and rollout/promotion artifacts.
- Characteristics: generated content, governance/promotions, runtime metadata.
- Rule: plugged into Cognition + Capability planes through typed catalogs and outcome journals.

## Data Contracts (Cross-Plane)
- `task_request`, `task_receipt`, `task_result` remain the execution backbone.
- Task journal (`state/tasks.journal.jsonl`) is the main closed-loop outcome feed.
- Cognition artifacts (`reports/*.json`) are control-plane outputs and should remain append-only/history-aware where possible.
- Skill catalog (`skills/generated/runtime.catalog.json`) is advisory input for skill-growth planning.

## Import Rules
- Runtime Plane may not import Capability Plane modules.
- Cognition Plane should import from `swarm-protocol/runtime.ts` (or narrower runtime files), not `swarm-protocol/index.ts`.
- Capability Plane can import runtime contracts (`buildTaskRequest`, schemas), but should avoid control-plane internals.
- Operator scripts should prefer Runtime Plane imports.

## Immediate Moves (Implemented)
1. Added `swarm-protocol/runtime.ts` as a bounded runtime entrypoint.
2. Switched `cognition-core` task planners to import `buildTaskRequest` from `swarm-protocol/runtime.ts`.
3. Switched swarm operator/demo scripts to import from `swarm-protocol/runtime.ts`.

## Next Moves (Recommended Order)
1. Split `swarm-protocol/index.ts` into explicit public surfaces:
   - `runtime.ts` (stable)
   - `capabilities.ts` (high-change)
   - optional `control-plane.ts` (mission/governance orchestration layer)
2. Add a generated capability manifest + lazy loader to avoid massive eager export chains.
3. Move generated capability families into dedicated folders by domain (`src/capabilities/<domain>/...`) with generated index files per domain.
4. Introduce contract-versioned cognition output schemas (`readiness`, `learning-loop`, `iteration-plan`) and validate them before dispatch planning.
5. Add CI gate: `cognition-core` must not import `swarm-protocol/index.ts` directly.

## Definition of Better Architecture
- Runtime primitives are stable and isolated from rapid capability churn.
- Cognition can evolve independently while still emitting executable swarm tasks.
- Capability growth does not require touching a monolithic barrel export.
- New developments (skills, new capability families, cognition loops) can ship without cross-plane refactors.
