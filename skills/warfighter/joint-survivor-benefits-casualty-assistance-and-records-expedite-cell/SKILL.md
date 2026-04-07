---
name: joint-survivor-benefits-casualty-assistance-and-records-expedite-cell
description: Protect survivor support by accelerating casualty assistance, beneficiary verification, and records-dependent benefits initiation during outages or staffing shocks. Use when notification and entitlement delays are creating risk for bereaved families and unit trust.
---

# Joint Survivor Benefits Casualty Assistance And Records Expedite Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter casualty-support decisions where survivor benefits, beneficiary records, and casualty-assistance workflows determine family stability and institutional legitimacy.
- Confirm casualty category, notification posture, beneficiary-record integrity, document backlog, and senior-leader decision deadlines before recommending action.
- Keep outputs unclassified by default and minimize personally identifiable information unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using casualty-assistance backlog, beneficiary verification posture, DD93 or SGLI record integrity, records-system availability, and family-support demand.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in family support, fraud risk, privacy, and processing speed.
3. Identify branch triggers for conflicting beneficiary data, delayed next-of-kin notification, records-system outage, and appeals or legal-hold conditions.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and survivor-support risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: survivor-benefits action board, beneficiary-verification ladder, and records-expedite packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-SURVIVOR-297`, `tool_suite_id=ts-joint-survivor-benefits-casualty-assistance-records-expedite-v1`, and `protocol_stack_id=ps-joint-survivor-benefits-casualty-assistance-records-expedite-stack-v1`.
- Alternate: select a mission-adjacent casualty-assistance, personnel-record, or family-readiness suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual case-priority board with no unsupported entitlement decision until casualty identity, beneficiary data, and authority are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-SURVIVOR-BENEFITS-CASUALTY-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: casualty-assistance case board, beneficiary-verification queue, DD93 or SGLI review ledger, and benefits-initiation tracker.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed casualty-notice manifests, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If casualty identity, beneficiary evidence, or release authority is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Protect next-of-kin privacy, fraud controls, casualty-notification timing, and documented beneficiary intent before recommending action.
- Do not fabricate casualty identity, beneficiary designation, entitlement decisions, or family-contact completion.
