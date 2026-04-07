---
name: joint-bankruptcy-consumer-protection-and-security-clearance-financial-distress-cell
description: Preserve financial-distress triage, bankruptcy coordination, and security-clearance readiness for U.S. warfighters when debt crises threaten assignment stability, mission focus, or lawful availability.
---

# Joint Bankruptcy Consumer Protection And Security Clearance Financial Distress Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter financial-distress decisions where bankruptcy, garnishment, creditor pressure, or debt instability can erode readiness or clearance confidence.
- Confirm affected personnel, debt posture, filing or creditor timeline, command authorities, and security-clearance implications before recommending action.
- Keep outputs unclassified by default and minimize sensitive legal or financial detail unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using debt severity, creditor action, bankruptcy or counseling posture, clearance-risk indicators, and household readiness impact.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in legal protection, financial recovery speed, privacy, and mission continuity.
3. Identify branch triggers for wage garnishment, filing delay, creditor misconduct, clearance self-reporting gaps, and command-travel or reassignment impact.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and financial-distress risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: debt-distress triage board, bankruptcy or consumer-protection ladder, and clearance-impact continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-BANKR-329`, `tool_suite_id=ts-joint-bankruptcy-consumer-protection-clearance-financial-distress-v1`, and `protocol_stack_id=ps-joint-bankruptcy-consumer-protection-clearance-financial-distress-stack-v1`.
- Alternate: select a mission-adjacent credit-recovery, SCRA, or family-readiness suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual debt-priority roster with advisory-only sequencing until legal posture, creditor status, and clearance implications are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-BANKRUPTCY-CLEARANCE-DISTRESS-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: debt-distress case board, consumer-protection or legal-assistance queue, clearance-impact review ledger, and filing or creditor-action tracker.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed legal notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If filing posture, creditor evidence, or clearance-reporting requirements are uncertain, downgrade to advisory-only and request human legal or security review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and legal-routing clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported legal conclusions, fake debt-relief promises, privacy exposure, and clearance-reporting shortcuts before recommending action.
- Do not fabricate filing status, creditor action, counseling results, or adjudicative outcomes.
