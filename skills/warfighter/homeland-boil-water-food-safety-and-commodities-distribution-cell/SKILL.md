---
name: homeland-boil-water-food-safety-and-commodities-distribution-cell
description: Coordinate boil-water advisories, emergency food safety, and commodity-point distribution for domestic response. Use when U.S. warfighters need life-safety recommendations that connect public-health controls to logistics and shelter operations.
---

# Homeland Boil Water Food Safety And Commodities Distribution Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter boil-water, food-safety, and commodities-distribution decisions.
- Confirm advisory areas, POD posture, public-health authorities, supply status, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using water-test status, food-safety findings, POD capacity, route conditions, and population demand.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in life safety, distribution tempo, public trust, and sustainment burden.
3. Identify branch triggers for water-quality failure, POD overload, food-borne-risk growth, and commodity shortfall.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and public-health decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: boil-water and commodities board, POD prioritization ladder, and food-safety control packet.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-homeland-boil-water-food-safety-commodities-distribution-v1` with `protocol_stack_id=ps-homeland-boil-water-food-safety-commodities-distribution-stack-v1`.
- Alternate: select a mission-adjacent public-health, shelter, or DSCA sustainment suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: essential distribution only with manual water validation and command-approved commodity rationing.

## Domain Packet Defaults

- Default packet ID: `DPL-BOIL-WATER-COMMODITIES-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: water-quality dashboard, commodities distribution tracker, food-safety inspection board, and POD site status ledger.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `CAP`, food-safety lab result exchange, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If advisory legitimacy, water-test confidence, or POD authority is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unverified water release, food-contamination exposure, inaccessible PODs, and unsupported commodity promises before recommending action.
- Do not fabricate advisory authority, test results, POD capacity, or public-health approval.
