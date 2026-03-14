---
name: joint-port-opening-and-jlots-synchronization-cell
description: Synchronize port opening and JLOTS operations for throughput, survivability, and cross-service logistics convergence. Use when commanders or staffs need mission-ready options with explicit tool/protocol bindings, authority gates, and degraded-mode branches.
---

# joint port opening and jlots synchronization cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in its domain.
- Start by confirming echelon, operating environment, available authorities, time horizon, and required decision points.
- Keep products unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the mission problem using the latest operational context and critical dependencies.
2. Identify assumptions, decision thresholds, and indicators that invalidate the current plan.
3. Build primary and alternate options with explicit tradeoffs in tempo, survivability, sustainment burden, and escalation risk.
4. Integrate dependencies across command and control, movement/maneuver, fires/effects, intelligence, protection, sustainment, and information.
5. Produce commander-facing outputs plus a staff-action version with owners, suspense dates, and branch triggers.

## Required Output Format

Deliver results in this order:

1. Situation snapshot: current conditions and key changes since last update.
2. Recommended option: one clearly stated recommendation and rationale.
3. Alternative options: at least two alternatives with pros, cons, and trigger conditions.
4. Decision points: what must be decided now, later, or pre-delegated.
5. Staff tasking: who does what by when.

## Domain Products

Primary products for this skill: port opening plan, JLOTS sequence board, throughput and risk timeline.

## External Tools and Protocol Integration

- Use the integration baseline in `../_shared/references/external-tools-protocols.md`.
- Prioritize these tools for this domain: port operations COP, JLOTS mission schedulers, cargo tracking systems, hydrographic and tide decision tools.
- Prioritize these protocol families for this domain: AIS/NMEA, OGC WMS/WFS/WMTS, USMTF.
- Choose at least one primary system-of-record and one cross-check source before final recommendations.
- Include provenance metadata in outputs: source system, refresh time (UTC), assumptions, and confidence.

## Interoperability Validation Checklist

- Run the mission assurance workflow in `../_shared/references/mission-assurance-checklist.md` before final release.
- Validate each product includes source provenance, protocol/message format, UTC refresh time, confidence, and known gaps.
- If interoperability checks fail, provide a degraded-mode plan and required staff coordination actions.

## Authority and Human Approval Gates

- Apply escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md` for high-consequence recommendations.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for recommendations that can alter mission posture.
- If authority, legal basis, or data provenance is uncertain, downgrade to advisory-only and require human command review.

## Mission Tool and Protocol Catalog Binding

- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` to select concrete tool suites and protocol stacks for this domain.
- Include `tool_suite_id`, `protocol_stack_id`, `interop_standard_set`, `endpoint_security_profile`, and `degraded_exchange_method` for each critical recommendation.
- If no suite fits, define a provisional suite and assign `validation_owner` and `revalidation_utc` before release.

## Guardrails

- Flag gaps where assumptions exceed evidence.
- Separate facts, assessed judgments, and unknowns.
- Do not fabricate authorities, approvals, or source evidence.

## Domain Toolchain Override (2026-03-14, Expansion Wave XLVIII Addendum)

- Add `tool_suite_id=ts-coalition-fuel-energy-water-nexus-anomaly-adjudication-v1` + `protocol_stack_id=ps-coalition-fuel-energy-water-nexus-anomaly-adjudication-stack-v1` when port opening or JLOTS timing depends on power, fuel, or water anomalies across piers, pumps, causeways, and shore support nodes.
- Add `tool_suite_id=ts-joint-urban-rubble-route-clearance-structural-collapse-rescue-v1` + `protocol_stack_id=ps-joint-urban-rubble-route-clearance-structural-collapse-rescue-stack-v1` when onward movement from port, causeway, or beachhead depends on rapidly clearing rubble-choked urban access routes.
- Add `tool_suite_id=ts-strategic-undersea-chokepoint-autonomous-barrier-orchestration-v1` + `protocol_stack_id=ps-strategic-undersea-chokepoint-autonomous-barrier-orchestration-stack-v1` when sea approaches, repair zones, or logistics lanes need autonomous undersea barrier coverage before port or JLOTS release.
- Add `packet_id=DPL-FEW-NEXUS-ANOMALY-001`, `packet_id=DPL-URBAN-RUBBLE-RESCUE-001`, and `packet_id=DPL-UNDERSEA-BARRIER-ORCH-001` for recommendations that materially alter port opening, causeway release, or sea-approach confidence.

## Domain Toolchain Override (2026-03-14, Expansion Wave L Addendum)

- Add `tool_suite_id=ts-theater-fuel-pier-hose-farm-bulk-transfer-bypass-restoration-v1` + `protocol_stack_id=ps-theater-fuel-pier-hose-farm-bulk-transfer-bypass-restoration-stack-v1` when port-opening branches depend on fuel-pier restoration, hose-farm bypass routing, or contamination-safe bulk transfer sequencing.
- Add `packet_id=DPL-FUEL-PIER-BYPASS-001` for branches that materially alter JLOTS fuel throughput, berth activation timing, or commander acceptance of degraded transfer architecture.

## Domain Toolchain Override (2026-03-14, Expansion Wave LI Addendum)

- Add `tool_suite_id=ts-coalition-port-wreck-clearance-heavy-lift-berth-reopening-v1` + `protocol_stack_id=ps-coalition-port-wreck-clearance-heavy-lift-berth-reopening-stack-v1` when port-opening or JLOTS timing depends on wreck clearance, heavy-lift salvage assignment, or berth certification after attack or sabotage.
- Add `packet_id=DPL-PORT-WRECK-BERTH-REOPENING-001` for branches that materially alter berth release, sealift sequencing, or causeway activation confidence.
