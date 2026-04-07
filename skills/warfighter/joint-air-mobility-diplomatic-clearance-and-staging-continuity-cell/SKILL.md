---
name: joint-air-mobility-diplomatic-clearance-and-staging-continuity-cell
description: Support U.S. warfighter planning and decision support for air mobility flow control, diplomatic-clearance synchronization, and staging-node continuity. Use when missions require advisory products for cargo, passenger, or aeromedical movement under contested throughput, clearance delays, weather, or threat pressure.
---

# Joint Air Mobility Diplomatic Clearance And Staging Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter strategic and theater air mobility, diplomatic clearance management, and staging continuity.
- Confirm lift priorities, clearance status, staging-node capacity, threat and weather constraints, and required decision deadlines before recommending action.
- Keep outputs unclassified by default and avoid presenting tentative diplomatic approvals as confirmed unless the user provides authoritative handling guidance.

## Workflow

1. Frame the mobility problem using demand, lift availability, clearance status, node capacity, threat, weather, and protected mission priorities.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in throughput, survivability, clinical or cargo timeliness, and clearance risk.
3. Identify branch triggers for clearance denial, node saturation, runway loss, weather change, aeromedical priority shifts, and partner caveat changes.
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

Primary products: air mobility staging matrix, clearance-risk board, and reroute branch plan.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-air-mobility-diplomatic-clearance-staging-v1` with `protocol_stack_id=ps-joint-air-mobility-diplomatic-clearance-staging-stack-v1`.
- Alternate: select a mission-adjacent deployment, patient-movement, or C2 suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: mission-essential lift only with manual clearance confirmation and fixed staging windows.

## Domain Packet Defaults

- Default packet ID: `DPL-AIR-MOBILITY-DIPCLEAR-STAGING-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: air mobility mission scheduler, diplomatic clearance tracker, and staging and ramp-flow board.
- Preferred protocol profiles for coordination and machine exchange: `AIXM/FIXM`, `NIEM`, signed air-movement manifests, `USMTF`, `EDXL-DE/CAP`, and `API/JSON`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If diplomatic-clearance status, staging capacity, or movement authority is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag clearance uncertainty, node saturation, patient-movement risk, and cargo or passenger delay before recommending action.
- Do not fabricate diplomatic approvals, airfield access, or carrier commitments.
- Do not generate aircraft-specific evasion tactics or execution-level flight directives.
