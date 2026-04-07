---
name: joint-military-homelessness-prevention-and-transitional-housing-bridge-cell
description: Preserve housing stability, homelessness prevention, and transitional-housing continuity for U.S. warfighters and families when mobilization, PCS, recovery, or separation disrupts safe shelter.
---

# Joint Military Homelessness Prevention And Transitional Housing Bridge Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter housing-stability decisions where homelessness risk, unsafe shelter, or displacement threatens force availability and family survivability.
- Confirm affected households, immediate shelter posture, eviction or displacement timeline, command authorities, and support-network availability before recommending action.
- Keep outputs unclassified by default and minimize personally identifying housing details unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using housing status, displacement triggers, household vulnerabilities, temporary-lodging options, and mission or recovery impact.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in safety, administrative burden, cost, and readiness preservation.
3. Identify branch triggers for shelter refusal, voucher delay, unsafe lodging, family separation, and command-directed temporary relocation.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and housing-stability risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: housing-stability board, transitional-lodging ladder, and homelessness-prevention continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-HOMELESS-328`, `tool_suite_id=ts-joint-military-homelessness-prevention-transitional-housing-bridge-v1`, and `protocol_stack_id=ps-joint-military-homelessness-prevention-transitional-housing-bridge-stack-v1`.
- Alternate: select a mission-adjacent housing, SCRA, VA-home-loan, or family-readiness suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual shelter-priority roster with advisory-only sequencing until safe housing, voucher posture, and household eligibility are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-HOMELESSNESS-TRANSITIONAL-HOUSING-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: housing-stability case board, transitional-housing inventory, emergency-voucher queue, and household-risk escalation ledger.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed housing notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If safe-housing evidence, household consent, or housing authority is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and shelter-eligibility clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported housing promises, unsafe shelter assumptions, family-separation risk, and privacy exposure before recommending action.
- Do not fabricate lease status, voucher approval, shelter capacity, or permanent-housing outcomes.
