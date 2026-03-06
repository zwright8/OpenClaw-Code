# OpenClaw-Code Agent Guide

This repository is an external capability pack for OpenClaw and other agentic bots.
Use it as a toolkit, not as a standalone app.

## 1-Minute Start

1. Read this file fully once.
2. Parse [`AGENT_MAP.json`](./AGENT_MAP.json) for machine-routable commands.
3. Run:
   - `npm run agent:validate` before/after edits

## What Lives Where

- `cognition-core/`: telemetry analysis and learning-loop reports from task outcomes.
- `swarm-protocol/`: runtime primitives (schemas, orchestration, routing, recovery).
- `scripts/`: generators/maintenance workflows for large capability and skill surfaces.
- `skills/`: generated skill artifacts and marketplace packs.

## Intent -> Command Routing

- Validate repo health:
  - `npm run agent:validate`
- Analyze recent operational history:
  - `npm --prefix cognition-core run analyze:quick`
- Generate learning-loop report from task journal:
  - `npm --prefix cognition-core run learn:loop`
- Run swarm protocol tests only:
  - `npm --prefix swarm-protocol run test:unit`

## Safe Editing Rules

- Prefer editing:
  - `cognition-core/src/*.ts`
  - `swarm-protocol/src/*.ts`
  - `scripts/*.ts` (only when changing generation logic)
- Do not hand-edit generated outputs unless explicitly required:
  - `skills/generated-10000/**`
  - `skills/marketplace/v2/packages/**`
  - large generated catalogs/manifests
- If behavior appears duplicated in many generated files, change the source generator in `scripts/` instead of patching generated files one-by-one.

## Definition of Done

1. Changes are constrained to the smallest necessary surface area.
2. `npm run agent:validate` passes.
3. Docs or machine map updated if command paths changed.
4. Commit message describes user-facing capability change, not only refactors.
