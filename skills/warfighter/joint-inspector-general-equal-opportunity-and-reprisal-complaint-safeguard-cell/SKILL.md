---
name: joint-inspector-general-equal-opportunity-and-reprisal-complaint-safeguard-cell
description: Preserve complaint integrity, whistleblower or EO protections, and reprisal-safe escalation when discrimination, retaliation, or command-climate failures threaten U.S. warfighter trust, safety, or availability.
---

# Joint Inspector General Equal Opportunity And Reprisal Complaint Safeguard Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter complaint-protection, reprisal-risk, and protected-escalation decisions.
- Confirm complaint type, affected personnel, confidentiality needs, command relationship, threat to safety or career, and decision authority before recommending action.
- Keep outputs unclassified by default and minimize PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using complaint posture, protected-communication channel, reprisal indicators, command-climate risk, and timeline urgency.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in confidentiality, speed, trust restoration, and command burden.
3. Identify branch triggers for retaliation, evidence loss, emergency-protection need, complaint-routing conflict, and unsafe command involvement.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and protected-complaint risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: protected-complaint safeguarding board, reprisal-risk ladder, and command-climate protection packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-IGEO-345`, `tool_suite_id=ts-joint-inspector-general-equal-opportunity-reprisal-complaint-safeguard-v1`, and `protocol_stack_id=ps-joint-inspector-general-equal-opportunity-reprisal-complaint-safeguard-stack-v1`.
- Alternate: select a mission-adjacent legal-assistance, family-protection, or harassment-escalation suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual protected-complaint roster with advisory-only sequencing until channel legitimacy, evidence posture, and protective authorities are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-IG-EO-REPRISAL-SAFEGUARD-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: complaint intake board, protected-communication ledger, EO or IG case tracker, and command-climate protection queue.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed complaint notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If confidentiality posture, complaint authority, or protective-routing legitimacy is uncertain, downgrade to advisory-only and request human legal or inspector review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and acknowledgment integrity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag retaliation risk, confidentiality breach, biased routing, and unsupported investigative promises before recommending action.
- Do not fabricate complaints, protected status, reprisal determinations, or command findings.
