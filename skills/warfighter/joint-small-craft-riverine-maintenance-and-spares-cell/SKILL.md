---
name: joint-small-craft-riverine-maintenance-and-spares-cell
description: Coordinate small-craft maintenance, riverine spares allocation, and readiness recommendations for U.S. warfighters. Use when patrol craft, combat rubber raiding craft, or inland-waterway platforms face readiness losses from engine faults, hull damage, or scarce repair parts.
---

# Joint Small Craft Riverine Maintenance And Spares Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter riverine maintenance, watercraft readiness, and spare-parts decisions.
- Confirm craft inventory, mission demand, engine or hull discrepancies, spare-parts posture, fuel or lubricant status, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with craft mission profiles, readiness degraders, spare-parts shortages, maintenance queue state, and waterway threat exposure.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in patrol coverage, repair tempo, risk acceptance, and logistics burden.
3. Identify branch triggers for controlled exchange, depot fallback, reduced-speed patrols, and mission-priority reassignment.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and maintainer decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: craft readiness board, spares allocation ladder, and maintenance recovery timeline.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-small-craft-riverine-maintenance-spares-v1` with `protocol_stack_id=ps-joint-small-craft-riverine-maintenance-spares-stack-v1`.
- Alternate: select a mission-adjacent riverine, maritime, or maintenance suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual readiness board with paper parts ledger, voice-confirmed launch restrictions, and commander-approved mission prioritization only.

## Domain Packet Defaults

- Default packet ID: `DPL-SMALL-CRAFT-RIVERINE-MAINT-SPARES-001`.
- Preferred `toolchain_id=TC-RIVER-141` and `toolchain_profile_id=small-craft-riverine-maintenance-spares-v1`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: small-craft readiness board, spares or cannibalization ledger, engine diagnostic tracker, and watercraft maintenance queue.
- Preferred protocol profiles for coordination and machine exchange: `AIS/NMEA`, `VMF`, signed maintenance manifests, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If maintenance release, parts pedigree, or patrol-priority authority is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag hull-integrity uncertainty, engine overtemp risk, untrusted spares, and waterway recovery limits before recommending action.
- Do not fabricate readiness rates, maintenance clearance, or parts pedigree.
