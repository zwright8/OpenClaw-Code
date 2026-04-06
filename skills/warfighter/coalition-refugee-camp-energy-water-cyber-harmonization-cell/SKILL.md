---
name: coalition-refugee-camp-energy-water-cyber-harmonization-cell
description: Coordinate coalition refugee-camp energy, water, and cyber resilience. Use when joint or allied forces must stabilize displaced-person sites under infrastructure stress, hostile interference, or humanitarian overload.
---

# Coalition Refugee Camp Energy Water Cyber Harmonization Cell

## Mission Scope

- Treat this skill as planning and decision support for coalition warfighter refugee-site stability, lifeline restoration, and cyber-resilience decisions.
- Confirm camp population, host-nation authorities, utility ownership, cyber incident scope, and humanitarian-partner boundaries before recommending action.
- Keep outputs unclassified by default unless displaced-person data, partner caveats, or site-defense vulnerabilities require protected handling.

## Workflow

1. Frame the mission problem using camp utility status, population pressure, public-health signals, and cyber or insider-threat indicators.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in life safety, restoration tempo, partner burden, and escalation risk.
3. Identify branch triggers for water loss, generator failure, cyber compromise, and camp-overflow or disorder thresholds.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and coalition-lead decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: camp lifeline synchronization board, cyber-restoration priority ladder, and humanitarian risk matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-coalition-refugee-camp-energy-water-cyber-harmonization-v1` with `protocol_stack_id=ps-coalition-refugee-camp-energy-water-cyber-harmonization-stack-v1`.
- Alternate: select a mission-adjacent civil-support, coalition medical, or infrastructure-defense suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: life-safety-first utility rationing with manual site status reporting, daily cyber hygiene drill, and human approval for camp-wide restrictions.

## Domain Packet Defaults

- Default packet ID: `DPL-REFUGEE-CAMP-EW-CYBER-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: camp utility telemetry, shelter population board, cyber incident desk, and public health status board.
- Preferred protocol profiles for coordination and machine exchange: `NIMS/ICS`, `NIEM`, `HL7/FHIR`, `OPC UA`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If host-nation authority, humanitarian-data handling, or cyber-containment confidence is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag life-safety overload, water or power dependency gaps, humanitarian-boundary conflicts, and cyber persistence before recommending action.
- Do not fabricate camp population, public-health clearance, or restoration success claims.
