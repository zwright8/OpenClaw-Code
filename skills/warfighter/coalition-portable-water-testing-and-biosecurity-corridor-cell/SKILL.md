---
name: coalition-portable-water-testing-and-biosecurity-corridor-cell
description: Coordinate portable water testing, field biosecurity screening, and coalition movement-corridor safety. Use when forces or civilians need safe water assurance across austere borders, staging sites, or humanitarian routes.
---

# Coalition Portable Water Testing And Biosecurity Corridor Cell

## Mission Scope

- Treat this skill as planning and decision support for coalition warfighter water safety, biosecurity screening, and movement-corridor assurance decisions.
- Confirm sampling authorities, corridor endpoints, hazard types, coalition caveats, and movement timelines before recommending action.
- Keep outputs unclassified by default unless disease surveillance, partner restrictions, or site vulnerabilities require protected handling.

## Workflow

1. Frame the mission problem using water sources, field sanitation posture, movement demand, and outbreak or contamination indicators.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in speed, sampling confidence, population impact, and cross-border coordination burden.
3. Identify branch triggers for contamination confirmation, resampling, quarantine expansion, and corridor closure or reopening.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and coalition-lead decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: water safety corridor map, biosecurity screening ladder, and resample or release decision board.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-coalition-portable-water-testing-biosecurity-corridor-v1` with `protocol_stack_id=ps-coalition-portable-water-testing-biosecurity-corridor-stack-v1`.
- Alternate: select a mission-adjacent medical, civil-support, or coalition sustainment suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual sample-chain tracking with coalition health-officer review and time-bounded corridor restrictions.

## Domain Packet Defaults

- Default packet ID: `DPL-WATER-BIOSEC-CORRIDOR-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: field water assay telemetry, biosecurity screening ledger, corridor movement board, and preventive-medicine status tracker.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, signed sample manifests, `NIEM`, `EDXL-DE/CAP`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If sample custody, contamination confidence, or coalition release authority is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag chain-of-custody gaps, false-negative risk, coalition caveat conflicts, and sanitation shortfalls before recommending action.
- Do not fabricate test results, biosecurity clearance, or water potability certification.
