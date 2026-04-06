---
name: joint-field-sanitation-latrine-handwashing-and-vector-discipline-cell
description: Preserve force health through field sanitation, latrine service, handwashing discipline, and vector suppression. Use when camp density, weather, or degraded utilities make hygiene failure a mission risk.
---

# Joint Field Sanitation Latrine Handwashing And Vector Discipline Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter field sanitation and outbreak-prevention decisions.
- Confirm camp density, water burn rate, latrine status, handwashing capacity, vector indicators, and inspection authority before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using unit density, sanitation shortfalls, illness indicators, weather effects, and commander decision deadlines.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in force-health protection, water usage, labor burden, and mission tempo.
3. Identify branch triggers for latrine overflow, chlorine or soap depletion, vector surge, quarantine thresholds, and handwashing-point relocation.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and sanitation-risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: sanitation discipline board, latrine service ladder, and vector-risk suppression matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-field-sanitation-latrine-vector-discipline-v1` with `protocol_stack_id=ps-joint-field-sanitation-latrine-vector-discipline-stack-v1`.
- Alternate: select a mission-adjacent preventive-medicine, food-protection, or wastewater-resilience suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual sanitation roster with command-enforced minimum hygiene intervals and daily medical review.

## Domain Packet Defaults

- Default packet ID: `DPL-FIELD-SANITATION-LATRINE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: sanitation inspection ledger, latrine service tracker, chlorine and handwash resupply board, and vector-surveillance queue.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `NIEM`, signed sanitation manifests, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If preventive-medicine authority, sample integrity, or inspection confidence is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and sanitation acknowledgment integrity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag overflow, inadequate handwashing throughput, contaminated greywater, vector breeding, and unsupported water-rationing assumptions before recommending action.
- Do not fabricate inspection passes, laboratory clearance, or outbreak containment.
