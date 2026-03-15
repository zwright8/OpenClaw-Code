---
name: joint-aerial-port-battery-hazmat-and-pallet-integrity-cell
description: Coordinate aerial-port battery, hazmat, and pallet-integrity governance for joint deployments. Use when cargo safety rules, pallet-build risk, or battery loads threaten sortie release or ramp throughput.
---

# Joint Aerial Port Battery Hazmat And Pallet Integrity Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm aerial-port authority, loadmaster release criteria, aircraft assignments, and throughput deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with cargo manifest, battery classes, hazmat declarations, pallet geometry, and aircraft assignment.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in sortie throughput, ramp safety, hazmat compliance, and cargo loss risk.
3. Identify branch or sequel triggers, load hold points, and release-approval gates.
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

Primary products: cargo release matrix, hazmat exception ladder, and pallet integrity risk board.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-aerial-port-battery-hazmat-pallet-integrity-v1` with `protocol_stack_id=ps-joint-aerial-port-battery-hazmat-pallet-integrity-stack-v1`.
- Alternate: select a mission-adjacent airlift, logistics, or airfield-operations suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: mission-essential cargo only with heightened fire-watch and single-sortie load approval.

## Domain Packet Defaults

- Default packet ID: `DPL-AERIAL-PORT-HAZMAT-PALLET-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: aerial-port cargo planner, hazmat compliance ledger, and pallet integrity board.
- Preferred protocol profiles for coordination and machine exchange: signed cargo manifests, `AIXM/FIXM`, `API/JSON`, `USMTF`, and NATO APP-11/ADatP-3 aligned exchange.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, legal basis, hazmat pass, pallet inspection, or loadmaster approval is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag thermal-runaway, aircraft-compatibility, ramp-fire, and manifest-integrity risks before recommending action.
- Do not fabricate classified sources, authorities, or approvals.
