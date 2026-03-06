# AGENTS.md

## Verified Workflows (Repo-Root)
- `npm run typecheck` - typecheck root + `cognition-core` + `swarm-protocol`.
- `npm run build` - runs root lint plus tests in both packages.
- `npm run capabilities:blueprint` - regenerate capability blueprint artifacts.
- `npm run capabilities:audit` - run capability deployability audit.
- `npm run skills:sync` - execute the full 1000-skill lifecycle pipeline.
- `npm run skills:marketplace:ship` - build/validate/package/validate/demo marketplace outputs.
- `npm run skills:marketplace:build` - build marketplace skills output set.
- `npm run skills:marketplace:validate` - validate marketplace skills output set.
- `npm run skills:marketplace:analytics` - generate marketplace analytics outputs.
- `npm run skills:marketplace:release` - package marketplace release artifacts.
- `npm run skills:marketplace:release:validate` - validate packaged marketplace release.
- `npm run skills:marketplace:v2:build` - build marketplace skill packages v2.
- `npm run skills:marketplace:v2:validate` - validate marketplace skill packages v2.
- `npm run skills:marketplace:v2:demo` - run top-package demo for v2 outputs.
- `npm run skills:registry:build` - build the skill registry manifest.
- `npm run skills:registry:validate` - validate the generated skill registry.
- `npm run skills:route` - run skill routing against registry metadata.
- `npm run skills:run` - execute SkillOS runtime entrypoint.

## Verified Package Workflows
- `npm --prefix cognition-core run analyze` - generate 7-day cognition analysis.
- `npm --prefix cognition-core run analyze:quick` - generate 1-day quick cognition analysis.
- `npm --prefix cognition-core run plan:tasks` - emit remediation task requests.
- `npm --prefix cognition-core run learn:loop` - run learning-loop replay outputs.
- `npm --prefix cognition-core run outcomes:export` - export swarm outcomes for analysis.
- `npm --prefix cognition-core run stability:whatsapp` - generate WhatsApp stability report.
- `npm --prefix cognition-core run ingest` - ingest new telemetry/events.
- `npm --prefix swarm-protocol run demo:orchestrator` - run orchestrator demo flow.
- `npm --prefix swarm-protocol run approval:queue` - export approval queue reports.
- `npm --prefix swarm-protocol run benchmark:simulate` - run simulation benchmark scenario.
- `npm --prefix swarm-protocol run ops -- status` - inspect operator status.
- `npm --prefix swarm-protocol run ops -- queue --limit 10` - inspect operator queue.
- `npm --prefix swarm-protocol run ops -- tail --limit 20` - tail recent operator events.

## TODO
- Confirm command ownership for newly added `cognition-core` automation scripts (`evaluate`, `report`, `run`, `dispatch`, `status`, `scorecard`, `tune:recommendations`, `full:utilization`) before promoting them to default AGENTS workflows.
