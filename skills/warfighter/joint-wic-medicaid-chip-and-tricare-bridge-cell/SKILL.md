---
name: joint-wic-medicaid-chip-and-tricare-bridge-cell
description: Preserve DEERS, TRICARE, WIC, Medicaid, and CHIP continuity across birth, PCS, mobilization, demobilization, evacuation, or foster placement so administrative gaps do not grow into clinical or nutritional risk for warfighter families. Use when benefit overlap or eligibility confusion is degrading readiness.
---

# Joint WIC Medicaid CHIP And Tricare Bridge Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter household benefit and healthcare-eligibility continuity decisions.
- Confirm sponsor status, dependent roster, current benefit posture, state of residence, life-event timeline, and urgent medical or nutritional needs before recommending action.
- Keep outputs unclassified by default and minimize PII or protected health information unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using sponsor duty status, dependent eligibility, benefit recertification posture, care urgency, and state-to-state transition friction.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in coverage continuity, privacy, administrative burden, and household resilience.
3. Identify branch triggers for newborn or foster enrollment gaps, activation or demobilization status change, state move, urgent pharmacy or specialist need, and benefits recertification failure.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and benefits-risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: benefits eligibility matrix, coverage-lapse action ladder, and dependent enrollment bridge packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-BENEFITS-321`, `tool_suite_id=ts-benefits-eligibility-bridge-v1`, and `protocol_stack_id=ps-benefits-eligibility-bridge-stack-v1`.
- Alternate: select a mission-adjacent family-readiness, pharmacy, or hardship-support suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual benefits-risk ladder with advisory-only guidance until beneficiary identity, eligibility documents, and urgent-care posture are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-BENEFITS-BRIDGE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: DEERS or beneficiary status queue, state Medicaid or CHIP tracker, WIC appointment and document board, referral or pharmacy authorization board, and household document-verification ledger.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `HL7/FHIR`, signed eligibility notices, `API/JSON`, and `S/MIME`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Use the `Benefits and Eligibility Bridge` playbook whenever DEERS, TRICARE, WIC, Medicaid, and CHIP posture must be reconciled in one output.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If identity, eligibility, or urgent-care impact is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Protect privacy, equitable access, and continuity of urgent care or nutrition support before recommending action.
- Do not fabricate eligibility, recertification outcomes, appointment availability, or benefit approval.
