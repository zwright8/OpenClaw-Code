---
name: joint-amphibious-surf-zone-breach-trafficability-cell
description: Coordinate surf-zone obstacle reduction, beach trafficability, and landing-wave timing. Use when littoral entry depends on hydrography, obstacle breach progress, and shore logistics access.
---

# Joint Amphibious Surf Zone Breach Trafficability Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter littoral-entry, beach-trafficability, and amphibious breach decisions.
- Confirm hydrographic confidence, obstacle status, landing craft mix, beach support area capacity, and approval authorities before recommending action.
- Keep outputs unclassified by default unless beach intelligence, mine threat, or deception plans require protected handling.

## Workflow

1. Frame the mission problem using surf conditions, beach gradients, obstacle belts, landing-wave demand, and follow-on sustainment timing.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in landing speed, survivability, trafficability, and sustainment access.
3. Identify branch triggers for alternate beaches, breach resequencing, hovercraft or connector substitution, and traffic-control shifts.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and beachmaster decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: surf-zone breach matrix, beach trafficability board, and landing-wave timing ladder.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-amphibious-surf-zone-breach-trafficability-v1` with `protocol_stack_id=ps-joint-amphibious-surf-zone-breach-trafficability-stack-v1`.
- Alternate: select a mission-adjacent amphibious, engineer-mobility, or maritime suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: beach-by-beach manual release board with conservative surf windows and reduced throughput assumptions.

## Domain Packet Defaults

- Default packet ID: `DPL-SURF-ZONE-BREACH-TRAFFICABILITY-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: hydrographic and surf model, obstacle breach board, beach trafficability assessor, and shore party flow tracker.
- Preferred protocol profiles for coordination and machine exchange: `OGC`, `AIS/NMEA`, `VMF`, `CoT`, signed hydrographic manifests, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If surf data, obstacle clearance, or beach-control authority is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag surf-model divergence, uncleared obstacle belts, beach congestion, and connector shortfalls before recommending action.
- Do not fabricate hydrographic confidence, breach completion, or release authority.
