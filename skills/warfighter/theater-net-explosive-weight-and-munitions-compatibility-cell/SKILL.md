---
name: theater-net-explosive-weight-and-munitions-compatibility-cell
description: Coordinate net explosive weight, compatibility group, and storage- or transit-siting decisions for U.S. warfighters. Use when munitions density, dispersion, or mixed storage changes blast risk and throughput.
---

# Theater Net Explosive Weight And Munitions Compatibility Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter explosive quantity-distance, compatibility, and munitions siting decisions.
- Confirm supported sites, storage and movement authority, force-protection constraints, and required throughput before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with munition mix, net explosive weight, site geometry, movement timelines, and exposure population.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in blast safety, throughput, dispersion, and handling complexity.
3. Identify branch triggers for site evacuation, stack separation, mixed-load rejection, and emergency transit routing.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and ammunition decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: explosive quantity-distance board, compatibility storage matrix, and site or transit standoff plan.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-net-explosive-weight-munitions-compatibility-v1` with `protocol_stack_id=ps-theater-net-explosive-weight-munitions-compatibility-stack-v1`.
- Alternate: a mission-adjacent munitions or force-protection suite from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Degraded: essential-movement-only posture with manual quantity-distance calculations and command readback.

## Domain Packet Defaults

- Default packet ID: `DPL-NET-EXPLOSIVE-WEIGHT-COMPATIBILITY-001`.
- Preferred `toolchain_id=TC-QD-149` and `toolchain_profile_id=net-explosive-weight-munitions-compatibility-v1`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: quantity-distance calculator, compatibility group board, storage-site planner, and transload standoff matrix.
- Preferred protocol profiles for coordination and machine exchange: `OGC`, signed storage manifests, `NIEM`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If compatibility data, blast arc assumptions, or siting authority is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsafe stacking, blast overmatch, and mixed-load exposure before recommending action.
- Do not fabricate quantity-distance approvals, compatibility waivers, or safe-storage certifications.
