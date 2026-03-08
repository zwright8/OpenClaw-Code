# Tool Ideas Shard Report

- source: `skills/generated/tool-ideas-agents/build.manifest.json`
- output: `skills/generated/shards/tools01..tools10`
- total skills: 1000
- api key likely required: 160
- mission critical tier: 592

| Shard | Count |
|---|---:|
| tools01 | 100 |
| tools02 | 100 |
| tools03 | 100 |
| tools04 | 100 |
| tools05 | 100 |
| tools06 | 100 |
| tools07 | 100 |
| tools08 | 100 |
| tools09 | 100 |
| tools10 | 100 |

## Notes
- Each skill is emitted as a hardened shard with `SKILL.md`, `implementation.json`, fixtures, regression tests, and an OpenClaw adapter.
- Auth and API key handling are encoded directly into each skill via `integrationProfile` and credential-aware runbooks.
- If `skills/generated/tool-ideas-agents` exists locally, the generator removes it by default after successful materialization.
