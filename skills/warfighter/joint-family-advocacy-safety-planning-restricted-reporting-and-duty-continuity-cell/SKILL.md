---
name: joint-family-advocacy-safety-planning-restricted-reporting-and-duty-continuity-cell
description: Stabilize family-advocacy safety planning, restricted-reporting choices, shelter routing, and duty continuity when domestic abuse, neglect risk, or household violence begins to jeopardize an American warfighter or dependent. Use when safety and readiness can both deteriorate if the response remains ad hoc.
---

# Joint Family Advocacy Safety Planning Restricted Reporting And Duty Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter household safety, family-advocacy case coordination, and duty-continuity decisions.
- Confirm immediate threat posture, victim preferences, child-safety concerns, current shelter or lodging options, command-notification status, and time-sensitive court or protective-order deadlines before recommending action.
- Keep outputs unclassified by default and minimize PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using immediate safety risk, reporting posture, housing stability, child-care impact, and duty-status implications.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in victim safety, privacy, legal durability, and command burden.
3. Identify branch triggers for imminent harm, child endangerment, shelter denial, report conversion, weapon-access risk, and protective-order lapse.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and household-safety risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: immediate safety plan, restricted-to-unrestricted reporting branch map, and duty-continuity protection packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-FAMSAFE-320`, `tool_suite_id=ts-family-readiness-casework-v1`, and `protocol_stack_id=ps-family-advocacy-safety-duty-continuity-stack-v1`.
- Alternate: select a mission-adjacent family-readiness, legal-support, or lodging-support suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual safety-action ledger with advisory-only guidance until imminent-threat facts, victim preferences, and legal authorities are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-FAMILY-SAFETY-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: family-advocacy case board, protective-order or hearing deadline tracker, shelter or safe-lodging queue, child-safety escalation ledger, and command safety task board.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed safety-plan notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Use the `Personnel and Family Readiness Casework` playbook when coordinating safety planning, housing shifts, child-protection tasks, and command actions.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If immediate danger, victim preferences, or child-safety evidence is uncertain, downgrade to advisory-only and request human review while prioritizing emergency safety.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Protect victim autonomy, child safety, privacy, and legal integrity before recommending action.
- Do not fabricate protective orders, shelter availability, law-enforcement action, or victim consent.
