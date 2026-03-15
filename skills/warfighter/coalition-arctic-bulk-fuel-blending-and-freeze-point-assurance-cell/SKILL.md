---
name: coalition-arctic-fuel-freeze-point-assurance-cell
description: Coordinate Arctic bulk-fuel blending, additive use, and freeze-point assurance across coalition sustainment nodes. Use when cold-weather fuel handling, sealift, or aviation operations depend on verified blend integrity and low-temperature performance.
---

# Coalition Arctic Bulk Fuel Blending And Freeze Point Assurance Cell

## Mission Scope

- Treat this skill as planning and decision support for coalition warfighter Arctic fuel-quality, blending-governance, and freeze-point assurance decisions.
- Confirm fuel types, storage posture, host-nation rules, laboratory access, and downstream aviation or ground demand before recommending action.
- Keep outputs unclassified by default unless fuel vulnerabilities, storage locations, or partner constraints require protected handling.

## Workflow

1. Frame the mission problem using ambient conditions, blend state, additive inventory, transport timelines, and mission demand.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in cold-start reliability, throughput, contamination risk, and coalition sustainment burden.
3. Identify branch triggers for freeze-point failure, additive incompatibility, water contamination, and sealift or convoy delay.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and coalition-sustainment decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: freeze-point assurance matrix, blend-release ladder, and Arctic fuel movement board.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-coalition-arctic-bulk-fuel-blending-freeze-point-assurance-v1` with `protocol_stack_id=ps-coalition-arctic-bulk-fuel-blending-freeze-point-assurance-stack-v1`.
- Alternate: select a mission-adjacent Arctic logistics, operational-energy, or aviation-fuel suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual blend verification with restricted release, daily temperature checks, and coalition fuel-officer approval.

## Domain Packet Defaults

- Default packet ID: `DPL-ARCTIC-FUEL-FREEZE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: fuel assay analyzer, blend calculator, tank telemetry board, and convoy or sealift status tracker.
- Preferred protocol profiles for coordination and machine exchange: `AIS/NMEA`, `OPC UA`, signed fuel manifests, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If blend pedigree, freeze-point confidence, or coalition release authority is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag water contamination, additive incompatibility, temperature stratification, and host-nation environmental constraints before recommending action.
- Do not fabricate fuel purity, freeze-point certification, or release approval.
