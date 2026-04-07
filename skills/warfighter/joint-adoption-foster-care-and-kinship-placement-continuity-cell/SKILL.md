---
name: joint-adoption-foster-care-and-kinship-placement-continuity-cell
description: Preserve adoption, foster-care, and kinship-placement continuity when mobilization, PCS, or recovery stress threatens lawful dependent placement or household custody stability for military families. Use when family placement timelines can start degrading warfighter readiness.
---

# Joint Adoption Foster Care And Kinship Placement Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter family-placement, custody-continuity, and dependent-support decisions.
- Confirm affected household, current placement posture, court or hearing timeline, guardian options, and command deadlines before recommending action.
- Keep outputs unclassified by default and minimize PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using adoption or foster timeline, kinship-placement options, home-study or ICPC status, hearing deadlines, and dependent school or medical support needs.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in child stability, legal certainty, privacy, and command burden.
3. Identify branch triggers for hearing delay, guardian withdrawal, interstate-placement friction, and school or medical consent breakdown.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and placement-stability risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: placement continuity board, custody and hearing ladder, and family-placement stability packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-PLACEMENT-341`, `tool_suite_id=ts-joint-adoption-foster-care-kinship-placement-continuity-v1`, and `protocol_stack_id=ps-joint-adoption-foster-care-kinship-placement-continuity-stack-v1`.
- Alternate: select a mission-adjacent family-care, family-law, or family-readiness suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual placement-priority roster with advisory-only sequencing until placement status, consent posture, and legal-routing evidence are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-ADOPTION-FOSTER-KINSHIP-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: placement hearing calendar, home-study and ICPC tracker, guardian-contact board, and school or medical consent ledger.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed custody notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If placement status, guardian consent, or legal authority is uncertain, downgrade to advisory-only and request human legal or child-welfare review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported custody assumptions, unsafe placement shortcuts, privacy misuse, and unverified court deadlines before recommending action.
- Do not fabricate home studies, hearings, placements, or guardian acceptance.
