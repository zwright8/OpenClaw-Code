---
name: underwater-cable-cut-attribution-and-repair-prioritization-cell
description: Assess subsea cable disruptions, attribution confidence, and repair prioritization for military and national resilience impacts. Use when cable faults affect command-and-control, logistics, or allied connectivity.
---

# Underwater Cable Cut Attribution and Repair Prioritization Cell

## Mission Scope

- Provide decision support for subsea cable disruption incidents.
- Confirm mission-critical traffic dependencies, repair assets, legal authorities, and coalition coordination lanes.
- Distinguish confirmed physical damage from telemetry or routing anomalies.

## Workflow

1. Correlate fault detection, AIS/vessel tracks, and environmental events.
2. Estimate mission impact by theater command, logistics, and partner connectivity.
3. Recommend one repair-priority sequence with two alternates.
4. Define attribution confidence and evidence gaps.
5. Publish repair, security, and reroute tasking.

## Required Output Format

1. Disruption snapshot.
2. Recommended repair priority.
3. Alternative priorities.
4. Attribution confidence and decision gates.
5. Staff tasking.
6. Tool/protocol execution matrix.

## External Tools and Protocol Integration

- Suggested tools: OTDR fault systems, AIS tracks, bathymetry/weather feeds, undersea cable NOC dashboards, internet-routing telemetry.
- Protocol/message bindings: AIS/NMEA, ITU-T fault reporting, BGP telemetry, STIX/TAXII incident sharing, JSON/REST.
- Include objective, required inputs, schema, timeout/retry, and degraded fallback.

## Guardrails

- Do not output autonomous retaliation recommendations.
- Require human command/legal review for attribution-based escalation options.
- If attribution evidence is weak or conflicting, publish advisory-only hypotheses.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-undersea-cable-incident-fusion-v1` with `protocol_stack_id=ps-maritime-infrastructure-response-stack-v1`.
- Alternate: `tool_suite_id=ts-undersea-infrastructure-restoration-v1` with `protocol_stack_id=ps-cable-noc-bgp-stack-v1`.
- Degraded: manual incident timeline with multi-source confirmation.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` for profile binding.
- Apply `../_shared/references/warfighter-tool-authority-gates.md` to escalation-sensitive outputs.
