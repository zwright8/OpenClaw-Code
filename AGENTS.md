# AGENTS.md

## Repository Workflows (Verified)

### Core checks
- `npm run typecheck`
- `npm run build`
- `npm run capabilities:blueprint`
- `npm run capabilities:audit`

### Skills pipeline
- `npm run skills:sync`
- `npm run skills:marketplace:ship`
- `npm run skills:marketplace:v2:build`
- `npm run skills:marketplace:v2:validate`
- `npm run skills:marketplace:v2:demo`

### Newly discovered scale workflows
- `npm run skills:build:10000`
- `npm run skills:materialize:10000`
- `npm run skills:improve:10000`
- `npm run skills:improve:10000:validate`

### Subproject workflows
- `npm --prefix cognition-core run analyze`
- `npm --prefix cognition-core run plan:tasks`
- `npm --prefix cognition-core run learn:loop`
- `npm --prefix swarm-protocol run test`
- `npm --prefix swarm-protocol run demo:orchestrator`
- `npm --prefix swarm-protocol run approval:queue`
- `npm --prefix swarm-protocol run benchmark:simulate`
- `npm --prefix swarm-protocol run ops -- status`

### TODO
- Confirm whether `README.md` references to `cognition-core` commands (`build:full`, `memory:*`, `iterate:plan`) are current; these scripts are not present in `cognition-core/package.json`.
