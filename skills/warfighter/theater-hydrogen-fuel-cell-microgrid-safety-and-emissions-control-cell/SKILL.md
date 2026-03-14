---
name: theater-hydrogen-fuel-cell-microgrid-safety-and-emissions-control-cell
description: Support expeditionary hydrogen fuel-cell microgrid safety, leak containment, and emissions-aware power continuity for U.S. warfighter operations. Use when expeditionary power nodes face attack, fault, or environmental stress.
---

# Theater Hydrogen Fuel-Cell Microgrid Safety And Emissions Control Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm authority, releasability, affected power nodes, and commander decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with hydrogen telemetry, leak indicators, weather, load priorities, and site-defense constraints.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in survivability, safety, emissions, and mission continuity.
3. Identify branch/sequel triggers, degraded-power thresholds, and command approval gates.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff task tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: hydrogen safety matrix, containment ladder, and emissions-aware continuity brief.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-hydrogen-fuel-cell-microgrid-safety-and-emissions-control-cell-v1` with `protocol_stack_id=ps-theater-hydrogen-fuel-cell-microgrid-safety-and-emissions-control-cell-stack-v1`.
- Alternate: `tool_suite_id=ts-civil-support-v1` with `protocol_stack_id=ps-cop-event-sharing-stack-v1`.
- Degraded: authenticated manual dispatch board with hourly leak checks, dual-witness release logging, and UTC acknowledgment tracking.

## Domain Packet Defaults

- Default packet ID: `DPL-HYDROGEN-MICROGRID-SAFETY-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: fuel-cell telemetry fusion boards, leak plume estimators, and microgrid dispatch planners.
- Preferred protocol profiles for coordination and machine exchange: `USMTF`, `OGC`, `NIMS/ICS`, and `API/JSON`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query/action template, expected output schema, protocol/transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, safety evidence, or provenance is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag legal, policy, safety, and environmental constraints before recommending action.
- Do not fabricate classified sources, authorities, or approvals.
