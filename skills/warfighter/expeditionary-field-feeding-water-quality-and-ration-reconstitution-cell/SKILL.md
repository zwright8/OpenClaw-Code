---
name: expeditionary-field-feeding-water-quality-and-ration-reconstitution-cell
description: Keep expeditionary field feeding safe and sustainable by coupling ration availability, potable-water quality, and mass-feeding reconstitution under contested conditions.
---

# Expeditionary Field Feeding Water Quality And Ration Reconstitution Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter field-feeding, food-safety, and ration-reconstitution decisions.
- Confirm feeding demand, ration mix, potable-water status, food-service capacity, and outbreak indicators before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using ration inventory, feeding-site status, water-test results, sanitation posture, and supported population demand.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in throughput, safety, morale, fuel burden, and waste generation.
3. Identify branch triggers for boil-water orders, ration substitution, feeding-site relocation, reduced menu operations, or contract augmentation.
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

Primary products: feeding-site continuity board, safe-meal production ladder, and ration-water risk tracker.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-expeditionary-field-feeding-water-quality-ration-reconstitution-v1` with `protocol_stack_id=ps-expeditionary-field-feeding-water-quality-ration-reconstitution-stack-v1`.
- Alternate: select a mission-adjacent preventive-medicine, logistics, or civil-support suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: sanitized field-kitchen worksheet with commander-approved menu reduction and manual water test logging only.

## Domain Packet Defaults

- Default packet ID: `DPL-FIELD-FEEDING-RATION-RECONSTITUTION-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: feeding-site status board, ration inventory tracker, potable-water assay queue, and food-safety inspection ledger.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `HL7/FHIR`, food-safety lab result exchange, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If food-service authority, water-test validity, or sanitation evidence is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag contamination risk, allergen exposure, cultural-feeding constraints, sanitation shortfalls, and morale impacts before recommending action.
- Do not fabricate inspection results, potable-water status, or food-service release authority.
