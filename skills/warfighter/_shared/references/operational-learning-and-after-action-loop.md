# Operational Learning and After-Action Loop

Use this reference to ensure each warfighter skill output drives measurable adaptation across operations, sustainment, and force development.

## Mandatory Learning Loop

1. Define mission intent, success criteria, and decision thresholds before execution.
2. Capture observed outcomes with timestamped evidence tied to recommendations.
3. Compare expected vs observed effects for commander decisions, risk posture, and tempo.
4. Identify one immediate correction, one 24-72h correction, and one structural correction.
5. Assign owner and suspense for each correction and define verification method.
6. Feed validated lessons into doctrine, SOPs, data contracts, and tool packet updates.

## After-Action Output Schema

Use this schema in post-action sections:

```text
aar_id:
mission_segment:
observation_window_utc:
expected_effect:
observed_effect:
effect_delta:
root_cause_hypotheses:
recommended_corrections:
owner_and_suspense:
validation_method:
confidence:
```

## Performance and Readiness Metrics

Track at least one metric from each class:

- Decision quality: decision latency, reversal rate, and confidence drift
- Mission execution: objective attainment, tempo adherence, and branch trigger timing
- Interoperability: protocol success rate, translation loss count, and stale-data rate
- Sustainment resilience: supply interruption frequency, recovery time, and degraded-mode duration
- Force protection: near-miss trend, fratricide risk indicators, and hazard closure time

## Update Triggers

Trigger an immediate AAR update when any of the following occur:

- Major mission branch trigger activated earlier or later than planned
- Confidence in critical data source drops below mission threshold
- Tool/protocol failure forces degraded-mode operations for longer than planned
- Coalition or legal constraint invalidates previously recommended course of action
- Casualty, collateral, or strategic escalation risk deviates from expected band

## Integration Requirements

- Cross-reference `external-tools-protocols.md` for tool packet provenance and transport checks.
- Cross-reference `joint-mission-data-contracts.md` to ensure AAR fields map to contract profiles.
- Cross-reference `mission-assurance-checklist.md` before publishing lessons that affect operations.

## Governance Guardrails

- Keep lessons non-attributable to individuals unless accountability is required by policy.
- Distinguish observed facts from assessed causes and confidence level.
- Do not publish sensitive vulnerabilities beyond need-to-know channels.
- Escalate unresolved high-consequence findings to command and legal review paths.
