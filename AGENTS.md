# AGENTS.md

## Verified Workflows (Repo-Root)
- `npm run typecheck` - typecheck root + `cognition-core` + `swarm-protocol`.
- `npm run build` - runs root lint plus tests in both packages.
- `npm run capabilities:blueprint` - regenerate capability blueprint artifacts.
- `npm run capabilities:audit` - run capability deployability audit.
- `npm run skills:sync` - execute the full 1000-skill lifecycle pipeline.
- `npm run skills:marketplace:ship` - build/validate/package/validate/demo marketplace outputs.
- `npm run skills:marketplace:v2:build` - build marketplace skill packages v2.
- `npm run skills:marketplace:v2:validate` - validate marketplace skill packages v2.
- `npm run skills:marketplace:v2:demo` - run top-package demo for v2 outputs.

## Verified Package Workflows
- `npm --prefix cognition-core run analyze` - generate 7-day cognition analysis.
- `npm --prefix cognition-core run plan:tasks` - emit remediation task requests.
- `npm --prefix cognition-core run learn:loop` - run learning-loop replay outputs.
- `npm --prefix swarm-protocol run demo:orchestrator` - run orchestrator demo flow.
- `npm --prefix swarm-protocol run approval:queue` - export approval queue reports.
- `npm --prefix swarm-protocol run benchmark:simulate` - run simulation benchmark scenario.
- `npm --prefix swarm-protocol run ops -- status` - inspect operator status.

## TODO
- README command list appears broader than current `package.json` scripts (for example `worker:loop`, `autonomous:run`, `iterate:plan`); confirm current owners before documenting additional commands here.
