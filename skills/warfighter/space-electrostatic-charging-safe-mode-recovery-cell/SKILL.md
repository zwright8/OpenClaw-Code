---
name: space-electrostatic-charging-safe-mode-recovery-cell
description: Coordinate electrostatic-charging risk, satellite safe-mode recovery, and prioritized service restoration. Use when solar activity, eclipse transitions, or contamination events threaten space-system availability.
---

# Space Electrostatic Charging Safe Mode Recovery Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter space-asset recovery, charging-risk, and service-restoration decisions.
- Confirm affected payloads, safe-mode triggers, charging indicators, ground contact windows, and command authorities before recommending action.
- Keep outputs unclassified by default unless payload vulnerabilities, launch support, or counterspace posture require protected handling.

## Workflow

1. Frame the mission problem using charging environment, spacecraft health telemetry, mission-service priorities, and available ground paths.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in recovery speed, bus safety, service outage, and downstream mission risk.
3. Identify branch triggers for load shedding, heater cycling, ground-contact replan, and service-priority rerouting.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and mission-director decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: charging risk board, safe-mode recovery timeline, and service restoration priority matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-space-electrostatic-charging-safe-mode-recovery-v1` with `protocol_stack_id=ps-space-electrostatic-charging-safe-mode-recovery-stack-v1`.
- Alternate: select a mission-adjacent SDA, SATCOM, or launch-support suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: conservative safe-mode hold with manually prioritized service restoration and longer contact spacing.

## Domain Packet Defaults

- Default packet ID: `DPL-SPACE-CHARGING-SAFE-MODE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: spacecraft health board, charging-environment predictor, ground-station scheduler, and service-priority ledger.
- Preferred protocol profiles for coordination and machine exchange: `CCSDS`, signed telemetry manifests, `API/JSON`, `USMTF`, and `OGC` for downstream ground overlays.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If telemetry integrity, service-priority authority, or safe-mode root cause is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag telemetry ambiguity, charging-model drift, limited contact windows, and secondary payload impacts before recommending action.
- Do not fabricate spacecraft health, ground-station authority, or recovery success claims.
