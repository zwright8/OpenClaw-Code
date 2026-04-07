---
name: joint-personnel-records-dd214-and-benefits-continuity-cell
description: Preserve personnel-record integrity, DD214 issuance, and benefits handoff continuity during outages, mobilization surges, casualty shocks, or separation backlogs. Use when record failures threaten readiness, transition, or family support.
---

# Joint Personnel Records DD214 And Benefits Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter personnel-record and transition-continuity decisions.
- Confirm affected population, record-system availability, separation or casualty timelines, identity-proofing posture, and benefits handoff dependencies before recommending action.
- Keep outputs unclassified by default and minimize personally identifiable information unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using outage scope, affected servicemembers, timeline pressure, veteran or family impact, and command decision deadlines.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in record integrity, transition speed, privacy protection, and staff burden.
3. Identify branch triggers for partial-record reconstruction, DD214 prioritization, benefits escalation, casualty-document hold, and identity-proof failure.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and records-risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: personnel-record recovery board, DD214 issuance ladder, and benefits continuity tracker.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-personnel-records-dd214-benefits-continuity-v1` with `protocol_stack_id=ps-joint-personnel-records-dd214-benefits-continuity-stack-v1`.
- Alternate: select a mission-adjacent reserve-readiness, casualty-assistance, or pay-continuity suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manually certified priority case list with no final discharge-document recommendation beyond verified human record review.

## Domain Packet Defaults

- Default packet ID: `DPL-PERSONNEL-RECORDS-DD214-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: personnel record synchronization board, DD214 production queue, identity-proofing review cell, and benefits handoff ledger.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed personnel manifests, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If identity proof, source-record integrity, or release authority is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and acknowledgment integrity across record handoffs.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag record loss, duplicate identity, delayed discharge documentation, unverified benefits assumptions, and privacy leakage before recommending action.
- Do not fabricate personnel status, discharge documents, entitlement decisions, or veteran handoff completion.

## Domain Toolchain Override (2026-04-07, Expansion Wave LXXV Addendum)

- Add `toolchain_id=TC-SURVIVOR-297`, `tool_suite_id=ts-joint-survivor-benefits-casualty-assistance-records-expedite-v1`, and `protocol_stack_id=ps-joint-survivor-benefits-casualty-assistance-records-expedite-stack-v1` when records continuity depends on beneficiary evidence integrity, DD93 or SGLI validation, or casualty-support timing for bereaved families.
- Add `toolchain_id=TC-PCSMOVE-298`, `tool_suite_id=ts-joint-pcs-claims-travel-voucher-temporary-lodging-continuity-v1`, and `protocol_stack_id=ps-joint-pcs-claims-travel-voucher-temporary-lodging-continuity-stack-v1` when transition or benefits handoff confidence depends on interrupted orders, move status, or voucher-backed separation support.
- Add `packet_id=DPL-SURVIVOR-BENEFITS-CASUALTY-001` and `packet_id=DPL-PCS-CLAIMS-LODGING-001` for branches that materially alter entitlement legitimacy, transition confidence, or family-support timing.

## Domain Toolchain Override (2026-04-07, Expansion Wave LXXVI Addendum)

- Add `toolchain_id=TC-SCRA-303`, `tool_suite_id=ts-joint-servicemember-civil-relief-estate-poa-v1`, and `protocol_stack_id=ps-joint-servicemember-civil-relief-estate-poa-stack-v1` when records or benefits handoff confidence depends on civil-relief filings, estate-document validity, or emergency power-of-attorney continuity.
- Add `toolchain_id=TC-HHGKIT-304`, `tool_suite_id=ts-joint-household-goods-loss-claims-essential-kit-v1`, and `protocol_stack_id=ps-joint-household-goods-loss-claims-essential-kit-stack-v1` when transition stability or reporting confidence depends on household-goods recovery, essential-item bridging, or claims continuity.
- Add `packet_id=DPL-SCRA-ESTATE-POA-001` and `packet_id=DPL-HOUSEHOLD-GOODS-ESSENTIAL-KIT-001` for branches that materially alter record-trust confidence, family-support continuity, or legal-readiness legitimacy.
