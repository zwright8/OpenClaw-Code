---
name: strategic-military-housing-utility-safety-and-restoration-cell
description: Coordinate military-housing habitability, utility isolation, and family relocation sequencing during homeland attack, disaster, or infrastructure collapse.
---

# Strategic Military Housing Utility Safety And Restoration Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter housing-safety, habitability, and family-protection decisions.
- Confirm installation authority, housing inventory, utility hazards, relocation capacity, and commander decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using housing damage, utility status, family density, safehaven capacity, and reoccupation thresholds.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in life safety, restoration speed, force readiness, and family disruption.
3. Identify branch triggers for utility isolation, housing condemnation, relocation, school-transport impacts, and reentry approval.
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

Primary products: housing habitability ledger, utility isolation and restoration sequence, family relocation priority board, and reoccupation decision log.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-HOUSING-240`, `tool_suite_id=ts-strategic-military-housing-utility-safety-and-restoration-v1`, and `protocol_stack_id=ps-strategic-military-housing-utility-safety-and-restoration-stack-v1`.
- Alternate: select a mission-adjacent installation-support, civil-defense, or energy-restoration suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual habitability ledger with command-approved relocation priorities and no reoccupation until engineer safety review completes.

## Domain Packet Defaults

- Default packet IDs: `DPL-MIL-HOUSING-UTILITY-001` and `DPL-MIL-HOUSING-RELOCATION-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: facility-inspection queue, utility-status dashboard, lodging allocation board, and family-notification tracker.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `OPC UA`, `CAP`, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If housing status, engineer safety, or family-accountability data is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported habitability claims, relocation shortfalls, utility restart hazards, and family-protection risk before recommending action.
- Do not fabricate housing status, engineer certifications, utility restoration commitments, or approval.
