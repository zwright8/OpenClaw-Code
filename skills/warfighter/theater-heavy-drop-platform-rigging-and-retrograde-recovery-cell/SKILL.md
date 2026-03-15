---
name: theater-heavy-drop-platform-rigging-and-retrograde-recovery-cell
description: Coordinate heavy-drop platform rigging, extraction-system release, and post-drop recovery or retrograde decisions for U.S. warfighters. Use when heavy equipment airdrop or contested recovery determines sustainment tempo and equipment survival.
---

# Theater Heavy Drop Platform Rigging And Retrograde Recovery Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter heavy-drop rigging, extraction-system release, and retrograde recovery decisions.
- Confirm supported platform set, aircraft and drop-zone constraints, recovery force posture, and commander timing before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with platform configuration, extraction-system status, drop-zone conditions, recovery assets, and retrograde timelines.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in equipment survivability, delivery tempo, rigging complexity, and recovery risk.
3. Identify branch triggers for platform re-rig, extraction-system hold, recovery-route shift, and abandon-or-retrograde thresholds.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and sustainment decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: heavy-drop release matrix, extraction-system health board, and retrograde recovery timeline.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-heavy-drop-platform-rigging-retrograde-recovery-v1` with `protocol_stack_id=ps-theater-heavy-drop-platform-rigging-retrograde-recovery-stack-v1`.
- Alternate: a mission-adjacent airdrop or logistics suite from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Degraded: reduced-platform drop or hold-in-place posture with manual rigging confirmation and recovery readback only.

## Domain Packet Defaults

- Default packet ID: `DPL-HEAVY-DROP-PLATFORM-RIGGING-001`.
- Preferred `toolchain_id=TC-HDROP-147` and `toolchain_profile_id=heavy-drop-platform-rigging-retrograde-v1`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: heavy-drop platform planner, extraction-system ledger, retrograde recovery tracker, and drop-zone recovery board.
- Preferred protocol profiles for coordination and machine exchange: `AIXM/FIXM`, `VMF`, `CoT`, signed load manifests, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If extraction-system data, DZ recovery status, or retrograde authority is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag rigging defects, extraction-system uncertainty, and contested recovery exposure before recommending action.
- Do not fabricate heavy-drop certifications, load-release authority, or recovered equipment status.
