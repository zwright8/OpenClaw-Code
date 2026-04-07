---
name: joint-military-financial-liability-and-compensation-continuity-cell
description: Maintain claims, compensation, and fiscal legitimacy when military operations trigger damage, liability, or emergency-relief decisions.
---

# Joint Military Financial Liability And Compensation Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter liability, compensation, and emergency-relief continuity decisions.
- Confirm fiscal authorities, claims posture, adjudication timelines, evidence integrity, and commander decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using damage claims, emergency-relief demand, fraud risk, evidence status, and fiscal authority constraints.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in legitimacy, speed, fraud exposure, and mission impact.
3. Identify branch triggers for interim relief, claims hold, fraud escalation, legal review, and compensation reprioritization.
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

Primary products: claims continuity board, interim-relief decision log, compensation legitimacy matrix, and fraud-escalation tracker.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-COMPENSATION-243`, `tool_suite_id=ts-joint-military-financial-liability-and-compensation-continuity-v1`, and `protocol_stack_id=ps-joint-military-financial-liability-and-compensation-continuity-stack-v1`.
- Alternate: select a mission-adjacent finance, claims, or civil-affairs suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual claims ledger with command-approved interim relief decisions and no automated disbursement until fiscal controls are revalidated.

## Domain Packet Defaults

- Default packet IDs: `DPL-COMPENSATION-CONTINUITY-001` and `DPL-INTERIM-RELIEF-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: claims adjudication board, emergency-relief disbursement tracker, evidence ledger, and fraud-anomaly monitor.
- Preferred protocol profiles for coordination and machine exchange: signed claims manifests, `NIEM`, `API/JSON`, `S/MIME`, `STIX/TAXII`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If fiscal authority, claims evidence, or fraud posture is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported compensation promises, fraud-control gaps, fiscal-legitimacy risk, and evidence shortfalls before recommending action.
- Do not fabricate claims status, payout authority, evidence holdings, or approvals.
