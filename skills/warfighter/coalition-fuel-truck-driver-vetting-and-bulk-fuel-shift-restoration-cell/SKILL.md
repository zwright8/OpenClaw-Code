---
name: coalition-fuel-truck-driver-vetting-and-bulk-fuel-shift-restoration-cell
description: Coordinate coalition bulk-fuel driver vetting, shift restoration, and dispatch continuity. Use when insider risk, fatigue, credential loss, or labor disruption threatens fuel distribution tempo across allied bases and ports.
---

# Coalition Fuel Truck Driver Vetting And Bulk Fuel Shift Restoration Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm host-nation labor constraints, coalition disclosure limits, dispatch authority, and fueling deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with driver availability, credential status, insider-risk indicators, and dispatch shortfalls.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in fuel tempo, vetting confidence, coalition friction, and fatigue exposure.
3. Identify branch or sequel triggers, dispatch hold points, and approval gates.
4. Bind each critical recommendation to concrete external tools, protocols, and staff handoffs.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: driver-vetting matrix, dispatch recovery ladder, and insider-risk exception board.

## External Tool Stack and Protocols

- Primary toolsets: driver credential ledger, fuel dispatch board, and fatigue or vetting review queue.
- Alternate toolsets: manual convoy dispatch roster, host-nation badge worksheet, and protected fuel-node watchbill.
- Degraded mode: military-escorted mission-essential fuel dispatch only with dual-verification driver release.
- Preferred protocol profiles: `NIEM`, `API/JSON`, `USMTF`, NATO APP-11/ADatP-3 aligned exchange, and signed dispatch manifests.
- Use `../_shared/references/external-tools-protocols.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md` as the baseline for building a provisional packet for this domain.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, legal basis, driver credential trust, or insider-risk adjudication is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag insider-risk, fatigue, coalition-labor, and fuel-node safety risks before recommending action.
- Do not fabricate classified sources, authorities, or approvals.
