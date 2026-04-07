---
name: homeland-protective-order-domestic-violence-and-safe-housing-continuity-cell
description: Coordinate protective-order continuity, family-advocacy risk, and safe-housing options during domestic crises affecting military communities. Use when commanders need auditable recommendations that protect victims without breaking legal or privacy controls.
---

# Homeland Protective Order Domestic Violence And Safe Housing Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter protective-order continuity, domestic-violence risk management, and safe-housing decisions during domestic emergencies.
- Confirm protective-order status, victim-safety constraints, housing availability, reporting posture, command authorities, and timing pressures before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using current threat indicators, protective-order status, family-advocacy case load, housing availability, and movement or communication constraints.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in victim safety, legal sufficiency, privacy, and readiness impact.
3. Identify branch triggers for safe-housing diversion, restraining-order verification failure, child-custody conflict, and law-enforcement or victim-advocate escalation.
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

Primary products: protective-order continuity board, safe-housing allocation ladder, and victim-protection escalation packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-PROTECT-283`, `tool_suite_id=ts-homeland-protective-order-domestic-violence-safe-housing-continuity-v1`, and `protocol_stack_id=ps-homeland-protective-order-domestic-violence-safe-housing-continuity-stack-v1`.
- Alternate: select a mission-adjacent legal-assistance, shelter, or family-readiness suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual victim-safety roster with advisory-only housing options until protective-order validity, safe-housing status, and advocate coordination are confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-PROTECTIVE-ORDER-SAFE-HOUSING-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: protective-order registry, family-advocacy case board, safe-housing capacity tracker, and command-risk notification queue.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed court notices, `CAP`, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If protective-order validity, victim consent, or safe-housing authority is uncertain, downgrade to advisory-only and request legal or victim-advocate review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag privacy exposure, retaliation risk, unsupported housing commitments, and child-custody conflicts before recommending action.
- Do not fabricate victim statements, protective orders, safe-housing availability, custody rulings, or approvals.

## Domain Toolchain Override (2026-04-07, Expansion Wave LXXXII Addendum)

- Add `toolchain_id=TC-DOXX-330`, `tool_suite_id=ts-joint-family-online-harassment-doxxing-protective-escalation-v1`, and `protocol_stack_id=ps-joint-family-online-harassment-doxxing-protective-escalation-stack-v1` when victim protection depends on countering doxxing, swatting, stalking, or online intimidation that can bypass normal safe-housing assumptions.
- Add `toolchain_id=TC-HOMELESS-328`, `tool_suite_id=ts-joint-military-homelessness-prevention-transitional-housing-bridge-v1`, and `protocol_stack_id=ps-joint-military-homelessness-prevention-transitional-housing-bridge-stack-v1` when safe-housing options must bridge into longer-term transitional lodging or homelessness-prevention actions.
- Add `packet_id=DPL-FAMILY-ONLINE-HARASSMENT-DOXXING-001` and `packet_id=DPL-HOMELESSNESS-TRANSITIONAL-HOUSING-001` for branches that materially alter victim-protection posture, safe-housing confidence, or follow-on family-stability planning.
