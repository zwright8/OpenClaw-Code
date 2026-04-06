---
name: joint-military-financial-liability-and-compensation-continuity-cell
description: Sustain financial-liability review, compensation routing, and emergency claims continuity for military operations that affect personnel, contractors, or civilians. Use when commanders need restitution and liability decisions tied to explicit tool and protocol bindings.
---

# Joint Military Financial Liability And Compensation Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter compensation, liability, and claims-continuity decisions.
- Confirm governing authorities, payment thresholds, evidentiary posture, claimant classes, and adjudication timelines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using incident facts, liability exposure, claimant status, fiscal controls, and pending commander decisions.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in legitimacy, speed, fraud risk, and fiscal accountability.
3. Identify branch triggers for emergency payment, claims freeze, elevated legal review, and interim relief measures.
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

Primary products: liability review board, compensation decision ladder, and claims-continuity reconciliation tracker.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-military-financial-liability-compensation-continuity-v1` with `protocol_stack_id=ps-joint-military-financial-liability-compensation-continuity-stack-v1`.
- Alternate: select a mission-adjacent finance, claims, or civil-affairs suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual claims ledger with command-approved interim relief decisions and no automated disbursement until fiscal controls are revalidated.

## Domain Packet Defaults

- Default packet ID: `DPL-FIN-LIABILITY-COMPENSATION-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: claims adjudication board, emergency-relief disbursement tracker, evidence ledger, and fraud-anomaly monitor.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed claims manifests, `API/JSON`, `S/MIME`, `STIX/TAXII`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If liability basis, claimant identity, or payment authority is uncertain, downgrade to advisory-only and request legal and fiscal review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag fraud exposure, duplicate-payment risk, protected-claimant concerns, and legitimacy costs before recommending action.
- Do not fabricate claimant status, fiscal authority, or adjudication outcomes.
