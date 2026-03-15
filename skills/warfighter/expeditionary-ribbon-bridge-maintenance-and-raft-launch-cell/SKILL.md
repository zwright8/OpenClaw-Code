---
name: expeditionary-ribbon-bridge-maintenance-and-raft-launch-cell
description: Coordinate ribbon-bridge upkeep, raft launch sequencing, and launch-bay recovery decisions for U.S. warfighters. Use when wet-gap crossing tempo depends on bridge-bay serviceability, anchorage posture, or current conditions.
---

# Expeditionary Ribbon Bridge Maintenance And Raft Launch Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter ribbon-bridge maintenance, raft-launch sequencing, and crossing sustainment decisions.
- Confirm supported crossing force, river state, engineer authority, bay availability, and throughput objectives before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with bridge-bay status, anchorage posture, current and bank conditions, repair capacity, and crossing timelines.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in throughput, survivability, maintenance burden, and launch safety.
3. Identify branch triggers for bay replacement, raft-only operations, anchorage reset, and crossing-hold thresholds.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and engineer decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: ribbon-bridge serviceability board, raft-launch sequence, and crossing maintenance ladder.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-expeditionary-ribbon-bridge-maintenance-raft-launch-v1` with `protocol_stack_id=ps-expeditionary-ribbon-bridge-maintenance-raft-launch-stack-v1`.
- Alternate: a mission-adjacent engineer or mobility suite from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Degraded: reduced-throughput crossing with manual bay accounting and timed launch windows only.

## Domain Packet Defaults

- Default packet ID: `DPL-RIBBON-BRIDGE-RAFT-LAUNCH-001`.
- Preferred `toolchain_id=TC-RIB-150` and `toolchain_profile_id=ribbon-bridge-maintenance-raft-launch-v1`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: bridge-bay serviceability board, anchorage planner, current and load monitor, and raft-launch sequence tracker.
- Preferred protocol profiles for coordination and machine exchange: `VMF`, `CoT`, `OGC`, signed maintenance manifests, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If bay status, anchorage integrity, or crossing authority is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag overstressed bays, unverified anchor points, and unsafe launch cadence before recommending action.
- Do not fabricate bridge certifications, launch approvals, or safe-load classifications.
