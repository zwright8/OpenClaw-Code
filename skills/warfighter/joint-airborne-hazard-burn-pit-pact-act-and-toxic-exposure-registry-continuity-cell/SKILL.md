---
name: joint-airborne-hazard-burn-pit-pact-act-and-toxic-exposure-registry-continuity-cell
description: Preserve burn-pit, airborne-hazard, PACT Act, and toxic-exposure registry continuity when incomplete records or delayed follow-up start to create readiness, recovery, or benefits risk for U.S. warfighters. Use when exposure evidence must survive past the deployment window.
---

# Joint Airborne Hazard Burn Pit PACT Act And Toxic Exposure Registry Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter exposure-surveillance, registry-routing, and toxic-evidence continuity decisions.
- Confirm affected cohort, exposure window, current symptoms or surveillance posture, specialty-follow-up demand, and command or clinical deadlines before recommending action.
- Keep outputs unclassified by default and minimize PHI or PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using exposure-event evidence, burn-pit or airborne-hazard context, current symptom signals, registry posture, and specialty-referral backlog.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in medical continuity, benefits evidence quality, privacy, and staff burden.
3. Identify branch triggers for missing deployment records, incomplete exposure narratives, delayed pulmonary or toxicology follow-up, and benefits-handoff risk.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and exposure-continuity risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: exposure continuity board, registry enrollment ladder, and toxic-exposure evidence packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-BURNPIT-338`, `tool_suite_id=ts-joint-airborne-hazard-burn-pit-pact-act-toxic-exposure-registry-continuity-v1`, and `protocol_stack_id=ps-joint-airborne-hazard-burn-pit-pact-act-toxic-exposure-registry-continuity-stack-v1`.
- Alternate: select a mission-adjacent preventive-medicine, occupational-toxicology, or medical-board suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual exposure-priority roster with advisory-only evidence sequencing until source records, follow-up routing, and registry posture are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-BURN-PIT-PACT-ACT-EXPOSURE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: exposure-event ledger, registry-enrollment queue, occupational-health note tracker, and specialty-referral board.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `NIEM`, signed exposure notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If exposure evidence, medical routing, or registry authority is uncertain, downgrade to advisory-only and request human clinical or occupational-health review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported causation claims, missing deployment evidence, duplicate registry assumptions, and privacy misuse before recommending action.
- Do not fabricate diagnoses, ratings, registry enrollment, or specialty appointment availability.
