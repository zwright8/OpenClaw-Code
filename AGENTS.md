# AGENTS.md

## Verified Workflows (Repo-Root)
- `npm run typecheck` - typecheck root + `cognition-core` + `swarm-protocol`.
- `npm run build` - runs root lint plus tests in both packages.
- `npm run capabilities:blueprint` - regenerate capability blueprint artifacts.
- `npm run capabilities:audit` - run capability deployability audit.
- `npm run skills:sync` - execute the full 1000-skill lifecycle pipeline.
- `npm run skills:marketplace:ship` - build/validate/package/validate/demo marketplace outputs.
- `npm run skills:marketplace:build` - build marketplace skill packages (v1).
- `npm run skills:marketplace:validate` - validate marketplace skill packages (v1).
- `npm run skills:marketplace:analytics` - generate marketplace analytics artifacts.
- `npm run skills:marketplace:release` - package marketplace release artifacts.
- `npm run skills:marketplace:release:validate` - validate packaged marketplace release artifacts.
- `npm run skills:marketplace:v2:build` - build marketplace skill packages v2.
- `npm run skills:marketplace:v2:validate` - validate marketplace skill packages v2.
- `npm run skills:marketplace:v2:demo` - run top-package demo for v2 outputs.
- `npm run skills:improve:10000` - generate improvement catalog for the 10k skill corpus.
- `npm run skills:improve:10000:validate` - validate generated 10k skill improvement artifacts.
- `npm run skills:harden:profile` - build the hardening/deployability profile.
- `npm run skills:harden` - apply hardening and emit deployability summaries.
- `npm run skills:build:10000` - generate the 10k skill corpus.
- `npm run skills:materialize:10000` - materialize generated 10k skill outputs.

## Verified Package Workflows
- `npm --prefix cognition-core run analyze` - generate 7-day cognition analysis.
- `npm --prefix cognition-core run plan:tasks` - emit remediation task requests.
- `npm --prefix cognition-core run learn:loop` - run learning-loop replay outputs.
- `npm --prefix cognition-core run analyze:quick` - generate 1-day fast cognition analysis.
- `npm --prefix cognition-core run graph` - rebuild cognition graph artifacts.
- `npm --prefix swarm-protocol run demo:orchestrator` - run orchestrator demo flow.
- `npm --prefix swarm-protocol run approval:queue` - export approval queue reports.
- `npm --prefix swarm-protocol run benchmark:simulate` - run simulation benchmark scenario.
- `npm --prefix swarm-protocol run ops -- status` - inspect operator status.
- `npm --prefix swarm-protocol run ops -- queue --limit 10` - inspect queued tasks with a bounded view.
- `npm --prefix swarm-protocol run ops -- queue --approvals` - inspect approval-pending tasks only.
- `npm --prefix swarm-protocol run ops -- tail --limit 20` - tail recent lifecycle events.
- `npm --prefix swarm-protocol run ops -- audit-verify` - verify signed operator audit chain integrity.

## TODO
- README command list appears broader than current `package.json` scripts (for example `worker:loop`, `autonomous:run`, `iterate:plan`); confirm current owners before documenting additional commands here.
