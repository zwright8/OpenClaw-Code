---
name: expeditionary-wastewater-graywater-and-vector-control-cell
description: Control wastewater, graywater, latrine overflow, and vector hazards at expeditionary sites before sanitation failures erode combat power. Use when U.S. bases, humanitarian sites, or staging areas face sewage backlog, insects, rodents, or contaminated drainage.
---

# Expeditionary Wastewater Graywater And Vector Control Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter sanitation, wastewater containment, and vector-suppression decisions at austere sites.
- Confirm camp footprint, wastewater storage or treatment status, potable-water separation, medical surveillance indicators, and engineering support before recommending action.
- Keep outputs unclassified by default unless site vulnerabilities, medical data, or host-nation infrastructure details require protected handling.

## Workflow

1. Frame the mission problem with wastewater generation, storage overflow risk, treatment capacity, vector indicators, and force-health effects.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in force health, engineering burden, mobility, and civil impact.
3. Identify branch triggers for waste isolation, drainage reroute, vector spraying or trapping, and site-mission curtailment.
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

Primary products: sanitation risk board, wastewater containment matrix, and vector suppression task card.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-expeditionary-wastewater-graywater-vector-control-v1` with `protocol_stack_id=ps-expeditionary-wastewater-graywater-vector-control-stack-v1`.
- Alternate: select a mission-adjacent preventive-medicine, engineer-support, or humanitarian-camp sanitation suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: restrict site density, hold nonessential growth, and use manual wastewater logs with command-approved vector-control windows.

## Domain Packet Defaults

- Default packet ID: `DPL-WASTEWATER-VECTOR-CONTROL-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: wastewater telemetry board, lift-station or lagoon status tracker, vector surveillance log, and force-health symptom watchlist.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `OGC`, `OPC UA`, `NIEM`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If sampling confidence, waste-routing authority, or vector-control legality is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Do not fabricate contamination sampling, potable-water separation, or disease-trend evidence.
- Flag sewage overflow into food, water, sleeping, or casualty-treatment areas before recommending sustained occupancy.
