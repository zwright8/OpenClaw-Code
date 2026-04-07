---
name: joint-base-pharmacy-refill-tricare-override-and-cold-chain-continuity-cell
description: Preserve base-pharmacy refills, TRICARE override workflows, and temperature-sensitive medication continuity during evacuation, outage, or pharmacy disruption. Use when medication access can directly degrade U.S. warfighter family readiness, recovery, or deployability.
---

# Joint Base Pharmacy Refill TRICARE Override And Cold Chain Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter base-pharmacy refill, insurance-override, and medication-continuity decisions.
- Confirm affected beneficiaries, refill deadlines, controlled-substance constraints, cold-chain status, pharmacy outage duration, and decision timelines before recommending action.
- Keep outputs unclassified by default and minimize protected health information unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using pharmacy status, refill urgency, insurance or authorization barriers, cold-chain risk, and family or casualty impact.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in medication safety, legal sufficiency, privacy exposure, and continuity speed.
3. Identify branch triggers for override approval, cold-chain breach, controlled-substance fallback, transfer to civilian pharmacy, and chronic-care escalation.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and medication-continuity trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: refill continuity matrix, TRICARE override ladder, and temperature-sensitive medication tracker.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-base-pharmacy-refill-tricare-coldchain-v1` with `protocol_stack_id=ps-joint-base-pharmacy-refill-tricare-coldchain-stack-v1`.
- Alternate: select a mission-adjacent medical-logistics, rehabilitation, or family-readiness suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual refill priority board with no unsupported prescription transfer or override claim beyond confirmed human review.

## Domain Packet Defaults

- Default packet ID: `DPL-BASE-PHARMACY-TRICARE-COLDCHAIN-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: pharmacy queue board, override approval tracker, cold-chain monitor, and patient-notification ledger.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `NCPDP`, signed prescription notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If prescription authority, cold-chain integrity, or override approval is uncertain, downgrade to advisory-only and request human clinical review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and acknowledgment integrity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag medication-safety risk, lapse in chronic-care treatment, cold-chain breach, and privacy exposure before recommending action.
- Do not fabricate prescription validity, insurance override approval, or temperature-assurance evidence.
