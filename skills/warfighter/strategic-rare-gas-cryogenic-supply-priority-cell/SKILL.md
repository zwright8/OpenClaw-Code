---
name: strategic-rare-gas-cryogenic-supply-priority-cell
description: Coordinate rare-gas and cryogenic supply prioritization for strategic industry, sensing, and missile or space support. Use when helium, neon, argon, xenon, nitrogen, or oxygen shortages threaten warfighter readiness or industrial continuity.
---

# Strategic Rare Gas Cryogenic Supply Priority Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter industrial continuity, cryogenic logistics, and strategic supply-priority decisions.
- Confirm demand drivers, storage constraints, boil-off risk, supplier pedigree, and authority to reprioritize before recommending action.
- Keep outputs unclassified by default unless industrial fragility, strategic program details, or transportation vulnerabilities require protected handling.

## Workflow

1. Frame the mission problem using current inventories, industrial demand, transport bottlenecks, and expected mission impacts.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in readiness preservation, industrial disruption, safety, and replenishment speed.
3. Identify branch triggers for boil-off loss, supplier failure, contamination, and emergency allocation shifts.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and industrial-base decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: gas allocation ladder, boil-off risk board, and industrial reprioritization matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-strategic-rare-gas-cryogenic-supply-priority-v1` with `protocol_stack_id=ps-strategic-rare-gas-cryogenic-supply-priority-stack-v1`.
- Alternate: select a mission-adjacent industrial, sustainment, or strategic mobility suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: minimum-safe allocation plan with manual inventory reporting, boil-off estimates, and senior sustainment approval.

## Domain Packet Defaults

- Default packet ID: `DPL-RAREGAS-CRYO-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: industrial gas production tracker, cryogenic tank telemetry board, supplier provenance ledger, and mission demand allocation board.
- Preferred protocol profiles for coordination and machine exchange: `OPC UA`, signed sustainment manifests, `API/JSON`, `USMTF`, and `NIEM`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If supplier pedigree, contamination state, or strategic allocation authority is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag boil-off exposure, counterfeit or diverted supply, contamination, and transportation fragility before recommending action.
- Do not fabricate inventory, purity, or supplier reliability claims.
