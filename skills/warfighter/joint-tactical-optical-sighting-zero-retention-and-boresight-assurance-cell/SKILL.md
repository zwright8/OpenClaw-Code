---
name: joint-tactical-optical-sighting-zero-retention-and-boresight-assurance-cell
description: Validate tactical optic zero retention, boresight alignment, and post-shock firing confidence when transport, maintenance, or battle damage may invalidate U.S. warfighter aim-point trust.
---

# Joint Tactical Optical Sighting Zero Retention and Boresight Assurance Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm affected weapon systems, maintenance actions, transport or blast events, firing timelines, and release authorities before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with impacted optics, mount history, shock or maintenance events, firing tasks, and commander priorities.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in fires confidence, fratricide risk, tempo, and ammunition expenditure.
3. Identify branch triggers for re-zero, boresight-only release, reduced-confidence employment, or hold-fire decisions.
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

Primary products: optic confidence board, zero-retention ladder, and boresight release matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-tactical-optical-boresight-zero-retention-v1` with `protocol_stack_id=ps-joint-tactical-optical-boresight-zero-retention-stack-v1`.
- Alternate: select a mission-adjacent fires, maintenance, or targeting suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual collimator checks and commander-approved reduced-confidence fires only.

## Domain Packet Defaults

- Default packet ID: `DPL-TACTICAL-BORESIGHT-ZERO-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: weapon boresight ledger, collimator alignment board, laser boresight tracker, and ballistic confidence worksheet.
- Preferred protocol profiles for coordination and machine exchange: signed range manifests, `API/JSON`, `CoT`, `VMF`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If zero status, mount integrity, or release authority is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag fratricide risk, optic damage uncertainty, ammunition waste, and misidentification risk before recommending action.
- Do not fabricate shot-group evidence, alignment confidence, or release approvals.
