---
name: strategic-va-dod-trauma-bed-and-rehabilitation-bridge-cell
description: Bridge DOD-to-VA trauma, burn, amputee, and rehabilitation capacity during major casualty surges so warfighters keep continuity of care, rehabilitation access, and return-to-duty decision support.
---

# Strategic VA DOD Trauma Bed And Rehabilitation Bridge Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter trauma-bed bridging, rehabilitation transfer, and long-tail care continuity decisions across DOD and VA systems.
- Confirm casualty mix, acuity, specialty demand, bed status, transfer authorities, and rehabilitation timelines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using bed occupancy, specialty-care demand, evacuation flows, rehabilitation capacity, and patient-priority classes.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in continuity of care, transfer speed, family burden, and return-to-duty impact.
3. Identify branch triggers for interfacility transfer, deferred rehabilitation, civilian augmentation, or benefits-status handoff.
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

Primary products: trauma bed bridge board, rehabilitation transfer ladder, and long-tail care capacity tracker.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-strategic-va-dod-trauma-bed-rehabilitation-bridge-v1` with `protocol_stack_id=ps-strategic-va-dod-trauma-bed-rehabilitation-bridge-stack-v1`.
- Alternate: select a mission-adjacent surgical, casualty-rehabilitation, or hospital-overflow suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual bed-status board with command-approved transfer packet routing and no unsourced rehabilitation commitments.

## Domain Packet Defaults

- Default packet ID: `DPL-VA-DOD-TRAUMA-REHAB-BRIDGE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: trauma bed status board, rehabilitation capacity ledger, transfer packet queue, and benefits-status handoff tracker.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `NIEM`, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If patient-priority authority, bed-status freshness, or transfer consent path is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag specialty-care bottlenecks, family relocation burden, administrative handoff gaps, and disability or return-to-duty ambiguity before recommending action.
- Do not fabricate bed availability, rehabilitation acceptance, or patient-transfer approvals.
