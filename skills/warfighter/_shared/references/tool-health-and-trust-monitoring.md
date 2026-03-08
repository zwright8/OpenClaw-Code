# Tool Health and Trust Monitoring

Use this reference to standardize external tool reliability checks before releasing warfighter recommendations.

## Required Fields Per Critical Dependency

Include these fields in every tool invocation packet and mission recommendation:

- `tool_health_id`: unique dependency check identifier
- `trust_score`: 0.00-1.00 confidence in current tool trust posture
- `last_probe_utc`: latest heartbeat/probe timestamp in UTC ISO-8601
- `degradation_mode`: `normal`, `degraded`, or `failed`
- `failover_executed`: `true`/`false`
- `failover_path`: profile and transport selected after degradation
- `revalidation_suspense_utc`: next mandatory health recheck time

## Pre-Mission Tool Health Sequence

1. Validate identity and credential scope for each primary and cross-check system.
2. Probe each endpoint adapter and confirm protocol-level acknowledgments.
3. Compare latency/error budget against mission SLA.
4. Validate schema and required field completeness on a live sample response.
5. Execute one dry-run failover to alternate profile for mission-critical dependencies.
6. Record trust scores and publish degraded triggers before commander decision brief.

## Trust Score Heuristic

Compute a normalized score using weighted criteria:

- Freshness (30%): age of source data and probe heartbeat
- Availability (25%): endpoint uptime and response success rate
- Integrity (20%): schema validity and checksum/signature results
- Consistency (15%): agreement with independent cross-check source
- Releasability (10%): authority and handling compliance status

If `trust_score < 0.70`, recommendation must be marked `provisional`.
If `trust_score < 0.50`, issue `no-go` or strict degraded-mode recommendation until recovery.

## Failover Evidence Packet

For every failover event include:

- `failover_trigger`: error condition or SLA violation
- `switch_time_ms`: elapsed time from detection to alternate profile activation
- `data_loss_window`: estimated decision-impacting data gap
- `commander_impact`: concise risk/timing statement
- `recovery_owner`: action officer accountable for service restoration

## Output Gating Rules

Do not release high-consequence recommendations unless all are present:

- Tool health fields complete for each critical dependency
- At least one successful cross-check from an independent source
- Documented fallback path with expected confidence delta
- Human command validation checkpoint for lethal, strategic, or escalation-sensitive outcomes
