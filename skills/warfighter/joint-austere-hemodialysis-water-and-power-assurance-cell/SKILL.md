---
name: joint-austere-hemodialysis-water-and-power-assurance-cell
description: Coordinate austere renal-support continuity across dialysis machines, water purity, and generator load. Use when casualty survival depends on sustaining or triaging hemodialysis under contested conditions.
---

# Joint Austere Hemodialysis Water And Power Assurance Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter austere medical and renal-support continuity decisions.
- Confirm renal demand, machine readiness, water-quality status, generator posture, and transfer authority before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem using patient demand, machine status, water purity, power load, evacuation routes, and clinical thresholds.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in survival probability, water or power risk, staff burden, and transfer delay.
3. Identify branch triggers for emergency dialysis, machine consolidation, casualty transfer, and water or generator isolation.
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

Primary products: dialysis continuity matrix, water or power risk ledger, and renal-transfer priority plan.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-austere-hemodialysis-water-power-assurance-v1` with `protocol_stack_id=ps-joint-austere-hemodialysis-water-power-assurance-stack-v1`.
- Alternate: select a mission-adjacent Role 3, force-health, or medical-logistics suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Preferred `toolchain_id=TC-HEMO-114` and `toolchain_profile_id=austere-hemodialysis-water-power-v1`.
- Degraded: emergency dialysis only with medical-command review and shortened reassessment cycle.

## Domain Packet Defaults

- Default packet ID: `DPL-AUSTERE-HEMODIALYSIS-WATER-POWER-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: dialysis machine readiness board, water-purity monitor, and renal-triage and transfer queue.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, signed water-quality manifests, `OPC UA`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, `../_shared/references/domain-toolchain-profiles.md`, `../_shared/references/joint-operations-external-toolchain-profiles.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If water purity, machine status, or medical transfer authority is uncertain, downgrade to advisory-only and request human medical-command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag patient deterioration risk, water-quality ambiguity, generator overload, and staff exhaustion before recommending action.
- Do not fabricate clinical status, water assays, or medical authorities.
