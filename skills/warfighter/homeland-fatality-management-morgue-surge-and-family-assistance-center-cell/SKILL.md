---
name: homeland-fatality-management-morgue-surge-and-family-assistance-center-cell
description: Coordinate decedent accountability, morgue surge, and family-assistance-center support during domestic mass-casualty response. Use when U.S. warfighters need dignified, auditable fatality-management options that remain aligned with civil authorities.
---

# Homeland Fatality Management Morgue Surge And Family Assistance Center Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter fatality-management, morgue-surge, and family-assistance-center coordination.
- Confirm casualty estimates, medical-examiner authorities, decedent-tracking posture, FAC demand, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using fatality counts, morgue capacity, identification status, family-support demand, and dignified-transfer constraints.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in dignity, accountability, throughput, and family-support credibility.
3. Identify branch triggers for morgue overflow, refrigeration gaps, notification backlog, and FAC staffing shortfalls.
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

Primary products: fatality-management board, morgue-surge ladder, and family-assistance-center packet.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-homeland-fatality-management-morgue-family-assistance-v1` with `protocol_stack_id=ps-homeland-fatality-management-morgue-family-assistance-stack-v1`.
- Alternate: select a mission-adjacent mortuary, medical, or public-affairs suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: paper decedent accountability only with command-approved family-assistance prioritization and no unsupported release estimates.

## Domain Packet Defaults

- Default packet ID: `DPL-FATALITY-MORGUE-FAC-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: morgue-capacity board, decedent-tracking ledger, FAC operations dashboard, and notification-status tracker.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `HL7/FHIR`, signed custody notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If decedent accountability, family-notification status, or morgue-authority legitimacy is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag dignity risks, privacy breaches, unsupported identification claims, and family-assistance overload before recommending action.
- Do not fabricate morgue capacity, identification status, notification completion, or civil authority approvals.
