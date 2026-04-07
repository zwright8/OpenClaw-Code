---
name: expeditionary-medical-waste-sterilization-and-biohazard-routing-cell
description: Coordinate expeditionary medical waste sterilization, red-bag throughput, and biohazard routing. Use when forward hospitals or casualty collection nodes risk infection spread, incinerator overload, or contaminated backhaul.
---

# Expeditionary Medical Waste Sterilization and Biohazard Routing Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm waste categories, sterilizer status, treatment capacity, route security, and host-nation disposal constraints before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with waste generation rate, sterilizer uptime, holding capacity, contamination risk, and commander priorities.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in infection control, labor burden, transport risk, and environmental compliance.
3. Identify branch triggers for autoclave outage, incinerator saturation, route denial, or high-risk waste accumulation.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and senior-medical decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: biohazard throughput board, sterilization release ladder, and contaminated route matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-expeditionary-medical-waste-sterilization-biohazard-routing-v1` with `protocol_stack_id=ps-expeditionary-medical-waste-sterilization-biohazard-routing-stack-v1`.
- Alternate: select a mission-adjacent preventive-medicine, field-hospital, or hazardous-material suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: life-safety-first segregation with manual manifests, restricted movement windows, and command-approved temporary holding limits.

## Domain Packet Defaults

- Default packet ID: `DPL-MED-WASTE-STERILIZATION-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: sterilizer telemetry board, red-bag manifest ledger, incineration capacity tracker, and contaminated route status board.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `NIEM`, `OPC UA`, signed waste manifests, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If waste categorization, sterilization proof, or disposal authority is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag sharps overflow, sterilizer-biologic test failure, route contamination, and holding-time exceedance before recommending action.
- Do not fabricate sterilization success, disposal compliance, or biohazard clearance.
