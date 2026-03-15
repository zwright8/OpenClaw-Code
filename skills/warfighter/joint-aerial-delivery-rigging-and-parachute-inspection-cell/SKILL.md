---
name: joint-aerial-delivery-rigging-and-parachute-inspection-cell
description: Coordinate aerial-delivery rigging, parachute inspection, and release-status decisions for U.S. warfighters. Use when CDS, personnel, or heavy-drop loads depend on certified rigging, pack serviceability, and disciplined release authority.
---

# Joint Aerial Delivery Rigging And Parachute Inspection Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter aerial-delivery rigging, parachute serviceability, and release-control decisions.
- Confirm supported mission type, load plan, aircraft set, rigger certification posture, and release timeline before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with load characteristics, parachute inspection status, rigger capacity, weather limits, and recovery timeline.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in delivery accuracy, load survivability, rigging tempo, and crew safety.
3. Identify branch triggers for repack or repair, rigging disqualification, weather hold, and alternate delivery method selection.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and air-movement decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: rigging certification ledger, parachute inspection matrix, and release-to-load board.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-aerial-delivery-rigging-parachute-inspection-v1` with `protocol_stack_id=ps-joint-aerial-delivery-rigging-parachute-inspection-stack-v1`.
- Alternate: a mission-adjacent airlift or delivery suite from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Degraded: manual rigging worksheet, inspector readback, and reduced-load certification only.

## Domain Packet Defaults

- Default packet ID: `DPL-AERIAL-DELIVERY-RIGGING-001`.
- Preferred `toolchain_id=TC-RIG-146` and `toolchain_profile_id=aerial-delivery-rigging-parachute-inspection-v1`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: rigging inspection ledger, parachute serviceability board, load derivation worksheet, and air-item certification tracker.
- Preferred protocol profiles for coordination and machine exchange: `AIXM/FIXM`, `VMF`, signed rigging manifests, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If rigger certification, parachute serviceability, or release authority is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag expired inspections, pack-discipline violations, and unsafe release assumptions before recommending action.
- Do not fabricate rigger certifications, parachute inspections, or release approvals.
