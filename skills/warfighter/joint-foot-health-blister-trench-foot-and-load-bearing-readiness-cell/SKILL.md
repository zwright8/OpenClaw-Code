---
name: joint-foot-health-blister-trench-foot-and-load-bearing-readiness-cell
description: Coordinate foot-health prevention, blister or trench-foot response, and load-bearing readiness for U.S. warfighters. Use when marches, wet-cold exposure, or footwear shortages threaten maneuver endurance and casualty rates.
---

# Joint Foot Health, Blister, Trench Foot, And Load-Bearing Readiness Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter foot-health preservation, march endurance, and immersion-injury mitigation.
- Confirm terrain, movement distances, footwear posture, sock and drying capacity, casualty load, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with march plans, wet-cold exposure, blister and immersion-injury reports, footwear inventory, and commander decision points.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in endurance, tempo, medical burden, and sustainment demand.
3. Identify branch triggers for sock redistribution, boot refit, march pacing adjustment, dry-point activation, and casualty evacuation.
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

Primary products: foot-readiness dashboard, blister and immersion-foot risk matrix, and boot or sock resupply plan.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-foot-health-trench-foot-load-bearing-readiness-v1` with `protocol_stack_id=ps-joint-foot-health-trench-foot-load-bearing-readiness-stack-v1`.
- Alternate: select a mission-adjacent musculoskeletal, preventive-medicine, or logistics suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual foot-injury roster, paper pacing board, and daily dry-sock accountability check.

## Domain Packet Defaults

- Default packet ID: `DPL-FOOT-HEALTH-TRENCH-FOOT-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: march-load tracker, footwear fit ledger, blister and immersion-foot treatment workflow, and sock-resupply board.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, signed footwear manifests, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If injury severity, boot-fit confidence, or sustainment availability is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag immersion-foot progression, march overtasking, footwear-counterfeit risk, and avoidable casualty concealment before recommending action.
- Do not fabricate injury counts, supply status, or return-to-duty clearance.
