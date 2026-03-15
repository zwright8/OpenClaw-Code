---
name: expeditionary-food-protection-inspection-and-sanitation-cell
description: Protect field feeding, sanitation, and food inspection at expeditionary sites. Use when rations, local procurement, refrigeration, or food handling conditions threaten readiness or outbreak prevention.
---

# Expeditionary Food Protection, Inspection, And Sanitation Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter field feeding protection, food inspection, and sanitation-control decisions.
- Confirm food sources, cold-chain status, inspection capacity, water quality, pest pressure, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with food-source pedigree, storage conditions, sanitation posture, illness trends, and commander decision points.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in feeding continuity, health protection, inspection burden, and sustainment risk.
3. Identify branch triggers for quarantine, source rejection, cold-chain transfer, field-kitchen shutdown, and emergency ration substitution.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and food-risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: food protection dashboard, inspection priority matrix, and food-source approval ladder.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-expeditionary-food-protection-inspection-sanitation-v1` with `protocol_stack_id=ps-expeditionary-food-protection-inspection-sanitation-stack-v1`.
- Alternate: select a mission-adjacent preventive-medicine, nutrition-resilience, or logistics suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual food-temperature log, source-approval board, and voice-confirmed quarantine ledger.

## Domain Packet Defaults

- Default packet ID: `DPL-FOOD-PROTECTION-INSPECTION-SANITATION-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: food inspection ledger, cold-chain monitor, field-sanitation checklist board, and food-handling violation tracker.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, signed inspection manifests, `NIEM`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If source pedigree, water quality, or inspection confidence is uncertain, downgrade to advisory-only and require human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and quarantine acknowledgment integrity.
- If checks fail, provide a degraded feeding branch with explicit health and mission risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag temperature abuse, unvetted local procurement, pest intrusion, sanitation gaps, and overconfident substitution plans early.
- Do not fabricate inspection results, laboratory clearance, or food-release approvals.
