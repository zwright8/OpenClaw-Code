---
name: joint-toxic-industrial-chemical-exposure-and-decon-triage-cell
description: Coordinate toxic industrial chemical exposure assessment, decontamination routing, and triage for joint forces. Use when industrial releases, sabotage, or disaster damage create mixed force-health and operational hazards.
---

# Joint Toxic Industrial Chemical Exposure And Decon Triage Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter force health, CBRN response, and contaminated movement decisions.
- Confirm medical authority, hazard confidence, decon capacity, evacuation options, and civil-support boundaries before recommending action.
- Keep outputs unclassified by default and protect patient privacy unless explicit handling guidance is provided.

## Workflow

1. Frame the problem with likely agent or industrial source, exposure population, contamination pathway, decon throughput, and operational tasks at risk.
2. Build one recommended COA and at least two alternatives with tradeoffs in casualty survival, decon throughput, return-to-duty speed, and contamination spread.
3. Identify branch triggers for shelter-in-place, decon expansion, casualty diversion, antidote or PPE changes, and no-go recommendations.
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

Primary products: exposure triage matrix, decon routing board, and return-to-duty threshold table.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-toxic-industrial-chemical-exposure-decon-triage-v1` with `protocol_stack_id=ps-joint-toxic-industrial-chemical-exposure-decon-triage-stack-v1`.
- Alternate: select a mission-adjacent medical, CBRN, or civil-support suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: life-safety-first triage only with manual contamination zoning, delayed return-to-duty decisions, and conservative PPE posture.

## Domain Packet Defaults

- Default packet ID: `DPL-TIC-EXPOSURE-DECON-TRIAGE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: toxicology triage board, plume model, and decon throughput tracker.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `OGC`, `CAP`, `NIEM`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for movement, sheltering, or medical-priority recommendations.
- If agent identification, dose estimate, or decon completion status is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified medical facts, assessed exposure likelihood, assumptions, and unknowns.
- Do not replace physician or preventive-medicine judgment with unverified automated routing.
- Flag pediatric, pregnant, heat-stressed, or respiratory-compromised populations before recommending action.
- Do not fabricate diagnoses, dose readings, antidote guidance, or approvals.
