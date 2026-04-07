---
name: theater-occupational-toxicology-solvent-fuel-and-heavy-metal-cell
description: Assess solvent, fuel, propellant, and heavy-metal exposure risk across the theater. Use when spills, maintenance, munitions handling, or debris threaten force health and mission continuity.
---

# Theater Occupational Toxicology Solvent, Fuel, And Heavy Metal Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter toxic-exposure assessment, sampling, and notification decisions across theater operations.
- Confirm suspected agents, exposed populations, symptom trends, lab capacity, isolation controls, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with contaminant sources, exposure timelines, symptom reports, sampling posture, and commander decision points.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in force protection, throughput, sampling burden, and medical follow-up.
3. Identify branch triggers for isolation, stop-work, medical surveillance expansion, waste-control escalation, and public-health notification.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and exposure trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: toxic exposure watchlist, sampling and isolation plan, and exposure notification ladder.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-occupational-toxicology-solvent-fuel-heavy-metal-v1` with `protocol_stack_id=ps-theater-occupational-toxicology-solvent-fuel-heavy-metal-stack-v1`.
- Alternate: select a mission-adjacent industrial-hygiene, hazardous-waste, or medical-force-health suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: paper symptom log, manual chain-of-custody board, and authenticated voice isolation or restart ledger.

## Domain Packet Defaults

- Default packet ID: `DPL-OCCUPATIONAL-TOXICOLOGY-EXPOSURE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: toxicology sample ledger, exposure symptom board, industrial contaminant map, and medical surveillance tracker.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, signed lab manifests, `OPC UA`, `OGC`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for actions that change work posture, medical-routing posture, or contamination reporting.
- If contaminant identity, lab confidence, or exposure scope is uncertain, downgrade to advisory-only and require human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and chain-of-custody integrity.
- If checks fail, provide a degraded protective branch with explicit health and mission risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag delayed-onset symptoms, mixed-agent uncertainty, cross-contamination, and unreviewed medical assumptions early.
- Do not fabricate toxicology results, exposure limits, or medical or legal approvals.
