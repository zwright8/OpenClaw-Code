# AGENTS.md

## Verified Workflows (README-grounded)
- `npm run capabilities:blueprint` - refresh capability blueprint artifacts.
- `npm run capabilities:audit` - run deployability audit artifacts.
- `npm run skills:sync` - execute the 1000-skill lifecycle pipeline.
- `npm run skills:improve:10000` - generate the 10k-skill improvement catalog.
- `npm run skills:harden:profile` - build hardening/deployability profile artifacts.
- `npm run skills:harden` - apply hardening and emit deployability summaries.
- `npm run skills:marketplace:build` - build marketplace skill packages.
- `npm run skills:marketplace:validate` - validate marketplace skill packages.
- `npm run skills:marketplace:analytics` - generate marketplace analytics artifacts.
- `npm run skills:marketplace:release` - package marketplace release artifacts.
- `npm run skills:marketplace:release:validate` - validate packaged marketplace release artifacts.
- `npm run skills:marketplace:ship` - run the end-to-end marketplace packaging chain.
- `npm run skills:marketplace:v2:build` - build marketplace v2 skill packages.
- `npm run skills:marketplace:v2:validate` - validate marketplace v2 skill packages.
- `npm run skills:marketplace:v2:demo` - run top-package demo for v2 outputs.
- `npm run worker:loop -- --deploy-index ../skills/state/skills.deployability.index.json --hardening-profile ../skills/state/skills.hardening.profile.json` - run worker loop with hardening inputs.
- `npm run autonomous:run -- --deploy-index ../skills/state/skills.deployability.index.json --hardening-profile ../skills/state/skills.hardening.profile.json` - run autonomous loop with hardening inputs.
- `npm run analyze` - generate cognition analysis report.
- `tsx scripts/analyze-history.ts --days 7 --json reports/cognition-report.json --markdown reports/cognition-report.md` - produce historical analysis report outputs.
- `npm run plan:tasks` - emit remediation task requests.
- `npm run learn:loop` - run learning-loop replay outputs.
- `npm run plan:skills` - emit skill-growth task planning outputs.
- `npm run build:full` - run the full cognition build pipeline.
- `npm run memory:guardrails` - generate memory guardrail reports.
- `npm run memory:backfill` - backfill memory guardrail reports.
- `npm run iterate:plan` - generate cognition iteration plan + task bundle artifacts.
- `npm test` - run swarm-protocol tests (unit + legacy).
- `npm run demo:orchestrator` - run orchestrator demo flow.
- `npm run approval:queue` - export approval queue reports.
- `npm run benchmark:simulate` - run deterministic simulation benchmarks.
- `npm run ops -- status` - inspect operator status.
- `npm run ops -- queue --limit 10` - inspect queued tasks with a bounded view.
- `npm run ops -- tail --limit 20` - tail recent lifecycle events.
- `tsx scripts/auto-refactor.ts` - run repo self-lint checks (syntax, script entrypoints, relative imports).

## TODO
- Verified `147359bd7b..22aee8f278`: `package.json` script-map diff is blocked in this checkout because root/`cognition-core`/`swarm-protocol` package manifests are absent; re-run script verification once manifests are present.
- Verified `22aee8f278..c4c4e79215`: `package.json` script-map diff is blocked in this checkout because root/`cognition-core`/`swarm-protocol` package manifests are absent; re-run script verification once manifests are present.
- Verified `c4c4e79215..19a0116019`: no new README command-map additions were found; `package.json` script-map diff remains blocked in this checkout because root/`cognition-core`/`swarm-protocol` package manifests are absent.
- Verified `19a0116019..df28e28128`: no new README command-map additions were found; `package.json` script-map diff remains blocked in this checkout because root/`cognition-core`/`swarm-protocol` package manifests are absent.
