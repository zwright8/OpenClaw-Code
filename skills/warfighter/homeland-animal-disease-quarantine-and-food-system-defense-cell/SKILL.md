---
name: homeland-animal-disease-quarantine-and-food-system-defense-cell
description: Coordinate animal-disease quarantine, carcass-disposal, and food-system defense decisions during domestic emergencies. Use when U.S. warfighters need lawful support options that protect public health, agricultural continuity, and critical food supply.
---

# Homeland Animal Disease Quarantine And Food System Defense Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter animal-disease, quarantine, and food-system defense decisions during domestic operations.
- Confirm disease indicators, quarantine boundaries, disposal capacity, food-distribution impact, and interagency authorities before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using disease spread, herd or flock impact, quarantine controls, carcass-disposal constraints, and food-system dependencies.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in outbreak containment, food continuity, public trust, and military support burden.
3. Identify branch triggers for cross-county spread, disposal backlog, supply-chain shock, and zoonotic force-health risk.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and civil-authority decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: quarantine and movement-control ladder, carcass-disposal support matrix, and food-system defense packet.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-homeland-animal-disease-quarantine-food-system-defense-v1` with `protocol_stack_id=ps-homeland-animal-disease-quarantine-food-system-defense-stack-v1`.
- Alternate: select a mission-adjacent public-health, veterinary, or food-distribution suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: quarantine-support advisory only with no movement-control or disposal release beyond confirmed civil-authority direction.

## Domain Packet Defaults

- Default packet ID: `DPL-ANIMAL-DISEASE-FOOD-DEFENSE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: veterinary incident tracker, quarantine-boundary map, carcass-disposal capacity board, and food-supply continuity dashboard.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `HL7/FHIR`, `OGC`, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If quarantine authority, disease confirmation, or disposal approval is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported outbreak claims, quarantine gaps, food-distribution blind spots, and unsafe disposal assumptions before recommending action.
- Do not fabricate disease confirmation, movement restrictions, or disposal-site approval.
