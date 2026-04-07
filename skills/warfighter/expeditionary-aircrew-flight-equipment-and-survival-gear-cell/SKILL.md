---
name: expeditionary-aircrew-flight-equipment-and-survival-gear-cell
description: Coordinate aircrew flight equipment inspection, survival-gear readiness, and release recommendations for U.S. warfighters. Use when life-support gear, beacons, rafts, helmets, or protective ensembles could constrain sortie generation or personnel recovery.
---

# Expeditionary Aircrew Flight Equipment And Survival Gear Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter aviation life-support, survival equipment, and crew protection decisions.
- Confirm platform set, equipment inventory, inspection status, environmental threat, survival-beacon posture, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with equipment discrepancies, inspection intervals, survival gear compatibility, environmental threats, and sortie demand.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in aircrew safety, sortie availability, recovery confidence, and maintenance burden.
3. Identify branch triggers for no-fly restrictions, gear substitution, expedited inspection, and mission-environment tailoring.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and life-support decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: aircrew equipment readiness board, survival-gear restriction matrix, and sortie release advisory ladder.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-expeditionary-aircrew-flight-equipment-survival-gear-v1` with `protocol_stack_id=ps-expeditionary-aircrew-flight-equipment-survival-gear-stack-v1`.
- Alternate: `tool_suite_id=ts-joint-aviation-physiology-hypoxia-life-support-v1` with a mission-adjacent stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Degraded: paper inspection ledger with protected voice discrepancy release and commander-approved mission-environment minimums only.

## Domain Packet Defaults

- Default packet ID: `DPL-AIRCREW-FLIGHT-EQUIPMENT-SURVIVAL-GEAR-001`.
- Preferred `toolchain_id=TC-AIRCREW-140` and `toolchain_profile_id=aircrew-flight-equipment-survival-gear-v1`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: life-support equipment ledger, survival radio and beacon status board, flight-equipment inspection scheduler, and exposure-recovery kit tracker.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, signed life-support manifests, `AIXM/FIXM`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If inspection status, survival-beacon integrity, or release authority is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag expired inspection intervals, incompatible gear configurations, beacon reliability gaps, and environmental underprotection before recommending action.
- Do not fabricate gear certification, inspection completion, or sortie-release authority.
