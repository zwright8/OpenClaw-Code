# Cross-Domain Integration Playbook (Warfighter)

Use this playbook to synchronize decisions that cross service, coalition, and mission-domain boundaries.

## Purpose

- Provide a consistent pattern for linking operations across land, maritime, air, space, cyber, electromagnetic, and civil-support domains.
- Ensure recommendations include practical tool/protocol paths for primary, alternate, and degraded operations.
- Reduce latency between commander intent, staff coordination, and mission-system execution.

## Cross-Domain Planning Sequence

1. Define operational objective, command relationship, and releasability constraints.
2. Select mission-critical dependencies by domain (C2, ISR, fires/effects, sustainment, protection, legal, coalition).
3. Build a synchronized toolchain packet per dependency: primary tool, cross-check tool, protocol, refresh SLA, and degraded fallback.
4. Validate authority and approval gates for each high-consequence decision.
5. Publish a commander-readable decision summary and machine-ingestible packet set.
6. Trigger branch conditions when dependencies exceed time/confidence thresholds.

## Domain Bridge Patterns

- Land-air bridge: maneuver COP + airspace deconfliction + CAS/fires message path (`VMF` + `USMTF` + `Link 16 J-series`).
- Maritime-space bridge: maritime track services + SDA catalogs + SATCOM restoration workflows (`AIS/NMEA` + `API/JSON` + `USMTF`).
- Cyber-EMSO bridge: SIEM/SOAR telemetry + EW spectrum management + C2 risk updates (`STIX/TAXII` + `API/JSON` + `USMTF`).
- Sustainment-protection bridge: logistics throughput + route force-protection + medical movement triggers (`CoT` + `USMTF` + `API/JSON`).
- Civil-military bridge: ICS/EOC workflows + military mission assignment + coalition notification (`NIMS/ICS` + `EDXL-DE/CAP` + `USMTF`).

## External Tool Protocol Packet (Required)

For each critical cross-domain dependency, publish:

- `integration_id`: stable ID for this dependency package
- `domains`: domain tuple (for example `air|space|cyber`)
- `primary_tool` and `cross_check_tool`
- `protocol_binding`: selected message/transport standards
- `refresh_sla_minutes` and `staleness_trigger`
- `authority_tier` and `approval_role`
- `degraded_fallback` and expected confidence penalty
- `ack_chain_status` and `audit_record_id`

## Decision Escalation Triggers

Escalate to human command approval when any condition is met:

- Predicted effects exceed declared risk tolerance.
- Data freshness or provenance gates fail for a critical dependency.
- Cross-domain protocol translation introduces material ambiguity.
- Coalition releasability conflict is unresolved.
- Legal/ROE basis is incomplete or contradictory.

## Output Contract for Skill Responses

Every output that crosses domains should include:

- synchronized dependency matrix (who/what/when/protocol)
- decision windows and branch points
- tool invocation packets for critical dependencies
- authority and escalation fields
- confidence, known gaps, and revalidation timeline

## Governance Notes

- Keep recommendations advisory unless explicit command authority is present.
- Never provide direct weapon employment instructions.
- Prefer bounded, auditable, and reversible coordination actions.
