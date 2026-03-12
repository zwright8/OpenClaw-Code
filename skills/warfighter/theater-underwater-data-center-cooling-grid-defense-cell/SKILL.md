---
name: theater-underwater-data-center-cooling-grid-defense-cell
description: Support U.S. warfighter planning for underwater data-center cooling grid defense, resilience, and mission-network continuity under cyber-physical attack.
---

# Theater Underwater Data-Center Cooling Grid Defense Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm protected mission threads, civil-military dependencies, legal authorities, and commander decision points before recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance.

## Workflow

1. Build a mission snapshot with cooling-grid posture, cyber and physical threat telemetry, and mission dependency impact.
2. Generate branch options with explicit tradeoffs in uptime, survivability, sustainment burden, and escalation risk.
3. Select toolchain profile (primary, alternate, degraded) and bind protocol/message paths.
4. Map each external output to command decisions with confidence scoring and freshness checks.
5. Produce commander-facing recommendations plus staff actions with owners and suspense.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternatives and trigger conditions.
4. Decision points and approval gates.
5. Staff tasking with suspense.

## Domain Tool Stack

Use these tool categories by default: critical-infrastructure telemetry fusion, cooling-loop anomaly detection, and cyber-physical incident command boards.

## Protocol Profile

Preferred protocol families for this skill: USMTF, STIX/TAXII, NIMS/ICS, NIEM, API/JSON.

## Domain Toolchain Defaults

- Primary: select a mission-fit tool_suite_id from ../_shared/references/warfighter-external-tool-and-protocol-catalog.md.
- Alternate: select a cross-check tool_suite_id with independent provenance.
- Degraded: commander-approved manual critical-load shedding board with UTC acknowledgment logging.

## External Tools and Protocol Integration

- Use ../_shared/references/warfighter-external-tool-and-protocol-catalog.md for concrete tool suites and protocol stacks.
- Use ../_shared/references/domain-tool-packet-library.md and include packet_id=DPL-UNDERWATER-DATACENTER-COOLING-DEFENSE-001 for critical recommendations.
- Include tool_suite_id, protocol_stack_id, packet_id, data freshness (UTC), confidence, and fallback path for each high-impact branch.
- If no packet matches, define a provisional packet with validation_owner and revalidation_utc.

## Guardrails

- Separate facts, assessed judgments, assumptions, and unknowns.
- Flag legal/policy/ROE constraints and coalition interoperability limits early.
- Downgrade to advisory-only when authority, provenance, or acknowledgment integrity is uncertain.
- Do not fabricate sources, approvals, or operational authorities.
