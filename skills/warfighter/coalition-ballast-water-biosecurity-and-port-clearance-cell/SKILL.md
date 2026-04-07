---
name: coalition-ballast-water-biosecurity-and-port-clearance-cell
description: Coordinate coalition ballast-water screening, port biosecurity adjudication, and berth or quarantine release when military sealift and partner shipping must preserve throughput without importing biological or environmental risk.
---

# Coalition Ballast Water Biosecurity And Port Clearance Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. and coalition warfighter missions in this domain.
- Confirm harbor authority, biosecurity thresholds, coalition caveats, and berth-release priorities before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with vessel arrivals, ballast declarations, treatment telemetry, berth demand, and commander priorities.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in throughput, quarantine burden, environmental risk, and coalition friction.
3. Identify branch triggers for anchor, test, treat, quarantine, or berth-release decisions.
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

Primary products: ballast risk board, quarantine-or-clearance ladder, and berth sequencing matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-coalition-ballast-water-biosecurity-port-clearance-v1` with `protocol_stack_id=ps-coalition-ballast-water-biosecurity-port-clearance-stack-v1`.
- Alternate: select a mission-adjacent maritime biosecurity, port-operations, or coalition sustainment suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: controlled anchorage only with manual sampling and delayed berth release until review completes.

## Domain Packet Defaults

- Default packet ID: `DPL-BALLAST-WATER-PORT-CLEARANCE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: ballast treatment sensor board, port-state control dashboard, and maritime biosurveillance lab queue.
- Preferred protocol profiles for coordination and machine exchange: `AIS/NMEA`, `OGC`, `HL7/FHIR`, signed environmental manifests, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If declaration integrity, lab evidence, or harbor authority is uncertain, downgrade to advisory-only and request human decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag invasive-species risk, biosurveillance uncertainty, coalition caveats, and berth-delay consequences before recommending action.
- Do not fabricate ballast declarations, lab results, or port-clearance authority.
