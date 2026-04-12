---
name: joint-geographic-bachelor-housing-exception-and-separate-rations-continuity-cell
description: Preserve geographic-bachelor housing exception, split-household legitimacy, and separate-rations continuity when assignment mismatch or housing scarcity leaves U.S. warfighters in unstable dual-location living arrangements.
---

# Joint Geographic Bachelor Housing Exception And Separate Rations Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter split-household, housing-exception, and separate-rations continuity decisions.
- Confirm assignment posture, household location split, barracks or housing availability, separate-rations status, and command decision deadlines before recommending action.
- Keep outputs unclassified by default and minimize personally identifiable information unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using assignment mismatch, family location, housing scarcity, separate-rations posture, and household-stability risk.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in lawful support, readiness, cost, and family impact.
3. Identify branch triggers for barracks reassignments, housing-exception denial, separate-rations stop or restart, school-year or dependent constraints, and forced move timing.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and split-household risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: split-household stability board, housing-exception decision ladder, and separate-rations continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-GEOBACH-401`, `tool_suite_id=ts-joint-geographic-bachelor-housing-exception-separate-rations-continuity-v1`, and `protocol_stack_id=ps-joint-geographic-bachelor-housing-exception-separate-rations-continuity-stack-v1`.
- Alternate: select a mission-adjacent barracks, family-readiness, or compensation suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual split-household roster with advisory-only sequencing until assignment status, housing evidence, and command review are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-GEOBACH-SEPRATS-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: housing-exception board, separate-rations ledger, barracks or dorm occupancy tracker, and split-household support queue.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed housing notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If assignment legitimacy, housing availability, or separate-rations evidence is uncertain, downgrade to advisory-only and request human housing or personnel review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and split-household evidence clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported housing promises, command-discretion blind spots, family-separation pressure, and wrong-entitlement assumptions before recommending action.
- Do not fabricate housing-exception approval, room availability, separate-rations eligibility, or assignment change authority.
