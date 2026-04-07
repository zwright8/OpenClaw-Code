---
name: strategic-small-craft-outboard-and-riverine-mobility-surge-cell
description: Coordinate small-craft, outboard, and riverine mobility surge capacity for military operations. Use when littoral, riverine, or disaster-response missions depend on rapidly sourcing boats, engines, spares, and repair throughput.
---

# Strategic Small Craft Outboard And Riverine Mobility Surge Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter sustainment, riverine, littoral, and homeland mobility requirements.
- Confirm mission demand, procurement or drawdown authorities, maintenance capacity, and transportation timelines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem with craft demand, engine mix, spare-part availability, repair bottlenecks, and competing theaters.
2. Build one recommended COA and at least two alternatives with tradeoffs in mobility yield, industrial strain, sustainment burden, and diversion risk.
3. Identify branch triggers for stock release, repair line conversion, substitution, theater reallocation, or contracted surge.
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

Primary products: riverine mobility surge board, outboard allocation ladder, and repair turnaround plan.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-strategic-small-craft-outboard-riverine-mobility-surge-v1` with `protocol_stack_id=ps-strategic-small-craft-outboard-riverine-mobility-surge-stack-v1`.
- Alternate: select a mission-adjacent logistics, maritime, or industrial suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: mission-essential craft allocation only with manual serial tracking, restricted issue, and local repair triage.

## Domain Packet Defaults

- Default packet ID: `DPL-SMALL-CRAFT-RIVERINE-SURGE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: small-craft inventory ledger, boatyard capacity tracker, and outboard spare-parts board.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed serial manifests, `API/JSON`, `USMTF`, and `AIS/NMEA`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for stock-release, reallocation, or contracting recommendations.
- If serial accountability, maintenance safety, or theater priority validation is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified stock status, assessed demand, assumptions, and unknowns.
- Do not recommend craft release outside safe-load, maintenance, and operator qualification constraints.
- Flag diversion risk, fuel or lubricant compatibility, and depot bottlenecks before recommending action.
- Do not fabricate serial data, contract capacity, or readiness certifications.
