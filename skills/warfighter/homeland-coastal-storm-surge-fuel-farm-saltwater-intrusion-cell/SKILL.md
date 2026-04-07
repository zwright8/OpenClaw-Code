---
name: homeland-coastal-storm-surge-fuel-farm-saltwater-intrusion-cell
description: Protect coastal fuel farms from storm surge, saltwater intrusion, and contamination that can break military sustainment or civil support. Use when hurricanes, cyclones, flooding, or seawater ingress threaten bulk fuel storage or distribution.
---

# Homeland Coastal Storm Surge Fuel Farm Saltwater Intrusion Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter coastal fuel continuity, contamination control, and restoration decisions under severe-weather threat.
- Confirm tank farm status, seawall or drainage condition, fuel quality evidence, blackstart dependencies, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless critical-infrastructure vulnerabilities, utility dependencies, or contamination findings require protected handling.

## Workflow

1. Frame the mission problem with storm-surge forecast, tank exposure, intrusion indicators, pumping capacity, and dependent military demand.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in fuel assurance, restoration speed, distribution reach, and civil-support impact.
3. Identify branch triggers for tank isolation, recertification sampling, alternate fuel sourcing, or protected shutdown.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: fuel intrusion risk ladder, tank isolation and recertification matrix, and continuity resupply packet.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-homeland-coastal-storm-surge-fuel-farm-saltwater-intrusion-v1` with `protocol_stack_id=ps-homeland-coastal-storm-surge-fuel-farm-saltwater-intrusion-stack-v1`.
- Alternate: select a mission-adjacent operational-energy, port-defense, or critical-infrastructure restoration suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: halt nonessential fuel release, use manual tank gauging and contamination logs, and require command-approved issue only from verified clean stock.

## Domain Packet Defaults

- Default packet ID: `DPL-FUEL-FARM-SALTWATER-INTRUSION-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: tank telemetry board, fuel assay and lab queue, flood or surge monitor, and distribution-priority ledger.
- Preferred protocol profiles for coordination and machine exchange: `OPC UA`, `AIS/NMEA`, signed fuel manifests, `API/JSON`, `CAP`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If fuel quality, environmental release risk, or infrastructure-restoration authority is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Do not recommend fuel release, aircraft refuel, or generator blackstart from unverified or saline-contaminated stock.
- Flag cascading power, potable-water, fire-suppression, and environmental-reporting risks before recommending continued operations.
