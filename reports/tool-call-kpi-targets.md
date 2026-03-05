# Tool Call Implementation KPI Target Set

Generated: 2026-03-05T07:20:46.995178+00:00

## Scope
- Scan root: `skills/generated/shards`
- Skills: **10553** (numeric: **10000**, nexus: **553**)

## KPI Table (Before vs After vs Target)
| KPI | Description | Before | After | Target | Unit | Direction |
|---|---|---:|---:|---:|---|---|
| `tool_api_coverage_pct` | Skills with both tool inventory and API protocol/auth sections | 5.24 | 100.0 | 100.0 | percent | higher_is_better |
| `tool_call_implementation_pct` | Skills with explicit Tool Call Implementation section | 0.0 | 100.0 | 100.0 | percent | higher_is_better |
| `credential_reuse_policy_pct` | Skills with explicit credential reuse-first policy | 100.0 | 100.0 | 100.0 | percent | higher_is_better |
| `skills_missing_tool_calls_count` | Skills lacking detailed tool/API call sections | 10000 | 0 | 0 | count | lower_is_better |
| `p0_gap_without_tool_calls_count` | Tool-primary (P0) numeric skills that lacked detailed tool-call docs at baseline | 2900 | 0 | 0 | count | lower_is_better |
| `p1_gap_without_tool_calls_count` | Hybrid (P1) numeric skills that lacked detailed tool-call docs at baseline | 5275 | 0 | 0 | count | lower_is_better |
| `p2_gap_without_tool_calls_count` | Model-primary (P2) numeric skills that lacked detailed tool-call docs at baseline | 1825 | 0 | 0 | count | lower_is_better |

## Interpretation
- This pass targets documentation-level implementation: every skill includes concrete tool/API call details, protocols, and credential handling guidance.
- Operational runtime KPIs (latency, retry rate, human intervention, acceptance rate) should be measured in execution telemetry after these skill contracts are adopted by agents in live runs.

## Files
- JSON: `reports/tool-call-kpi-targets.json`
- CSV migration matrix: `reports/external-stack-migration-by-skill.csv`
