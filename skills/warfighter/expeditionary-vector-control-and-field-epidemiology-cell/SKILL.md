---
name: expeditionary-vector-control-and-field-epidemiology-cell
description: Coordinate vector surveillance, pesticide or larvicide actions, and field epidemiology for U.S. warfighters. Use when mosquito, tick, rodent, or sand fly threats can degrade force readiness or base survivability.
---

# Expeditionary Vector Control And Field Epidemiology Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter vector-borne disease prevention and expeditionary public-health control.
- Confirm operating area, vector species of concern, force disposition, pesticide authorities, host-nation constraints, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with trap data, case counts, habitat mapping, weather trends, pesticide inventory, and force-protection priorities.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in disease suppression, exposure risk, logistics demand, and civil-effects sensitivity.
3. Identify branch triggers for spray or larvicide release, habitat denial, bed-net or repellent redistribution, and outbreak-investigation escalation.
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

Primary products: vector threat map, spray and trap schedule, and force-health action matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-expeditionary-vector-control-field-epidemiology-v1` with `protocol_stack_id=ps-expeditionary-vector-control-field-epidemiology-stack-v1`.
- Alternate: select a mission-adjacent preventive-medicine, biosurveillance, or civil-support suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual trap log, hand-drawn habitat board, and daily command readback for pesticide release.

## Domain Packet Defaults

- Default packet ID: `DPL-VECTOR-CONTROL-FIELD-EPI-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: vector surveillance board, trap and assay ledger, geospatial habitat modeler, and outbreak case tracker.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `OGC`, signed trap or sample manifests, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If outbreak attribution, pesticide release authority, or habitat-confidence data is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag pesticide drift risk, pollinator or civilian exposure, sample-chain breaks, host-nation restrictions, and outbreak underreporting before recommending action.
- Do not fabricate disease incidence, assay results, or release authorities.
