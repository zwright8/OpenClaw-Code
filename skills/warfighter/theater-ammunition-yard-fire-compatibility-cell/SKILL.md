---
name: theater-ammunition-yard-fire-compatibility-cell
description: Coordinate ammunition-yard fire isolation, explosive compatibility, and relocation sequencing. Use when drone attack, wildfire, or handling failure threatens containerized munitions storage and force protection.
---

# Theater Ammunition Yard Fire Compatibility Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter ammunition-storage, explosive-safety, and fire-containment decisions.
- Confirm net explosive weight, compatibility groups, fire spread, access routes, and approval authorities before recommending action.
- Keep outputs unclassified by default unless stockage layout, security posture, or munition sensitivity requires protected handling.

## Workflow

1. Frame the mission problem using storage geometry, compatibility groups, fire status, adjacent exposures, and available relocation assets.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in blast risk, throughput loss, firefighting exposure, and issue continuity.
3. Identify branch triggers for emergency separation, lot quarantine, yard closure, and alternate issue-point activation.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and explosive-safety decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: explosive compatibility separation board, yard fire isolation sequence, and munitions relocation matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-ammunition-yard-fire-compatibility-v1` with `protocol_stack_id=ps-theater-ammunition-yard-fire-compatibility-stack-v1`.
- Alternate: select a mission-adjacent munitions-safety, logistics, or force-protection suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: yard closure with manual blast-arc board, restricted firefighting exposure, and command-approved emergency issue routing.

## Domain Packet Defaults

- Default packet ID: `DPL-AMMUNITION-YARD-FIRE-COMPATIBILITY-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: quantity-distance calculator, storage-site planner, fire spread board, and lot-serviceability ledger.
- Preferred protocol profiles for coordination and machine exchange: `OGC`, signed storage manifests, `NIEM`, `API/JSON`, `USMTF`, and `CoT` for rapid hazard overlays.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If compatibility data, NEW calculations, or firefighting access authority is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag uncertain compatibility grouping, sympathetic-detonation risk, blocked egress, and surveillance-lot defects before recommending action.
- Do not fabricate explosive-safety waivers, storage geometry, or fire-containment status.
