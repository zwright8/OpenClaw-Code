---
name: joint-civilian-harm-condolence-payment-and-claims-cell
description: Support civilian-harm triage, condolence-payment governance, and claims adjudication for joint operations. Use when units must coordinate incident review, evidence, acknowledgment, and restorative actions under operational pressure.
---

# Joint Civilian Harm Condolence Payment And Claims Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter civilian-harm response, restorative-action, and legal-accountability decisions.
- Confirm incident authority, evidentiary posture, partner equities, payment thresholds, and civil-affairs or legal review timelines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the incident using reported harm, evidence quality, unit actions, local context, and pending commander decisions.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in timeliness, legitimacy, legal risk, and force-protection impact.
3. Identify branch triggers for urgent acknowledgment, condolence payment, formal claim routing, and public-release posture.
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

Primary products: civilian-harm case board, condolence-payment ladder, and claims adjudication tracker.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-civilian-harm-condolence-claims-v1` with `protocol_stack_id=ps-joint-civilian-harm-condolence-claims-stack-v1`.
- Alternate: select a mission-adjacent civil-affairs, legal, or public-affairs suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: preserve evidence and issue advisory-only recommendations until harm verification and legal thresholds are reviewed.

## Domain Packet Defaults

- Default packet ID: `DPL-CIVILIAN-HARM-CONDOLENCE-CLAIMS-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: incident evidence ledger, condolence-payment tracker, and claims adjudication board.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed claims manifests, `API/JSON`, `USMTF`, `S/MIME`, and `OGC`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If incident attribution, harm verification, or payment authority is uncertain, downgrade to advisory-only and request human legal review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag evidence gaps, payment-authority limits, witness-protection concerns, and legitimacy-risk before recommending action.
- Do not fabricate harm reports, legal findings, or approvals.
