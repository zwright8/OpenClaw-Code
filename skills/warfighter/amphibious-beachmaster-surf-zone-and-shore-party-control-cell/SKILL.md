---
name: amphibious-beachmaster-surf-zone-and-shore-party-control-cell
description: Coordinate beachmaster control, surf-zone lane release, and shore-party sequencing for U.S. warfighters. Use when amphibious or JLOTS-style operations depend on safe beach throughput, causeway timing, and precise handoff from sea to shore.
---

# Amphibious Beachmaster Surf Zone And Shore Party Control Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter amphibious beach control, surf-zone safety, and shore-party throughput decisions.
- Confirm beach geometry, hydrographic status, sea state, obstacle picture, lighterage or causeway availability, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with surf and tide data, lane status, obstacle reduction progress, shore-party capacity, and follow-on sustainment demand.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in beach throughput, casualty exposure, lane safety, and tempo.
3. Identify branch triggers for lane closure, surf-limit exceedance, lighterage reroute, and cross-beach traffic reprioritization.
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

Primary products: surf-zone control board, shore-party throughput ladder, and beach-lane release matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-amphibious-beachmaster-surf-zone-shore-party-control-v1` with `protocol_stack_id=ps-amphibious-beachmaster-surf-zone-shore-party-control-stack-v1`.
- Alternate: `tool_suite_id=ts-joint-littoral-underwater-obstacle-reduction-beach-recon-v1` with a mission-adjacent stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Degraded: manual beachmaster board with timed recon updates, voice lane-release calls, and conservative surf thresholds only.

## Domain Packet Defaults

- Default packet ID: `DPL-BEACHMASTER-SURF-ZONE-SHORE-PARTY-001`.
- Preferred `toolchain_id=TC-BEACH-139` and `toolchain_profile_id=beachmaster-surf-zone-shore-party-control-v1`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: surf and tide board, beach lane-control workflow, causeway or lighterage scheduler, and shore-party movement tracker.
- Preferred protocol profiles for coordination and machine exchange: `OGC`, `CoT`, `VMF`, `AIS/NMEA`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If hydrographic confidence, beachmaster authority, or lane-state acknowledgment is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unstable surf windows, lane-conflict risk, obstacle-identity uncertainty, and cross-beach congestion before recommending action.
- Do not fabricate beach-release authority, mine-clearance confidence, or throughput capacity.
