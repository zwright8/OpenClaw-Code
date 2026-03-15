---
name: theater-electronic-attack-iff-recovery-and-track-confidence-cell
description: Recover identification-friend-or-foe confidence and track trust during electronic attack when jamming, spoofing, or emissions loss threatens air-defense, fires, and maneuver deconfliction.
---

# Theater Electronic Attack IFF Recovery and Track Confidence Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm affected sensors, electronic-attack conditions, control authorities, engagement zones, and release thresholds before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with jamming effects, IFF mode degradation, track ambiguities, defended assets, and commander priorities.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in blue-force safety, track certainty, mission tempo, and exposure risk.
3. Identify branch triggers for track hold, interrogator reset, emissions change, or weapons-release restriction.
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

Primary products: track-confidence board, IFF recovery ladder, and release-restriction matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-electronic-attack-iff-track-confidence-recovery-v1` with `protocol_stack_id=ps-theater-electronic-attack-iff-track-confidence-recovery-stack-v1`.
- Alternate: select a mission-adjacent CEMA, air-defense, or spectrum-resolution suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: command-approved weapons hold or positive-visual-ID requirements only with manual track annotation.

## Domain Packet Defaults

- Default packet ID: `DPL-EA-IFF-TRACK-CONFIDENCE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: IFF interrogator status board, track-confidence fusion console, electronic-attack monitor, and air-defense control ledger.
- Preferred protocol profiles for coordination and machine exchange: `Link 16 J-series`, `VMF`, `CoT`, signed sensor manifests, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If track identity, weapons-release authority, or jammer effects confidence is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag blue-on-blue risk, spoofed-track exposure, interceptor waste, and timeline compression before recommending action.
- Do not fabricate IFF returns, track certainty, or engagement approvals.
