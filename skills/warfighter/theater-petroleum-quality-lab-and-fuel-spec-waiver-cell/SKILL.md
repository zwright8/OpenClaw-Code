---
name: theater-petroleum-quality-lab-and-fuel-spec-waiver-cell
description: Coordinate petroleum-lab testing, fuel-spec waiver decisions, and release governance. Use when contamination, mixing, cold-weather drift, or degraded storage threatens sorties, convoy mobility, or generator continuity in theater.
---

# Theater Petroleum Quality Lab And Fuel Spec Waiver Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm release authority, fuel-spec baseline, supported fleet mix, and commander decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with sample results, storage conditions, fleet tolerance, additive status, and operational demand.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in safety, mission tempo, maintenance burden, and resupply risk.
3. Identify branch or sequel triggers, waiver thresholds, quarantine criteria, and command approval gates.
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

Primary products: fuel release ladder, spec-waiver decision matrix, and contamination containment brief.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-petroleum-quality-lab-fuel-spec-waiver-v1` with `protocol_stack_id=ps-theater-petroleum-quality-lab-fuel-spec-waiver-stack-v1`.
- Alternate: `tool_suite_id=ts-logistics-distribution-v1` with `protocol_stack_id=ps-cop-event-sharing-stack-v1`.
- Degraded: manual fuel issue control with paper sample ledger, shift-based contamination checks, and commander-approved mission-essential waivers only.

## Domain Packet Defaults

- Default packet ID: `DPL-PETROLEUM-LAB-SPEC-WAIVER-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: petroleum assay board, additive and blending ledger, and fleet fuel-risk planner.
- Preferred protocol profiles for coordination and machine exchange: signed sample manifests, `API/JSON`, `USMTF`, `OPC UA`, and `NIEM`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, assay evidence, or lot provenance is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag engine-safety, flash-point, maintenance, and mission-priority constraints before recommending action.
- Do not fabricate classified sources, authorities, or approvals.
