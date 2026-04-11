---
name: joint-military-onesource-nonmedical-counseling-and-peer-support-continuity-cell
description: Preserve non-medical counseling access, peer-support routing, and privacy-safe resource escalation when burnout, relocation, or family stress threatens U.S. warfighter resilience and household stability.
---

# Joint Military OneSource Nonmedical Counseling And Peer Support Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter non-medical counseling access, peer-support continuity, and resilience-routing decisions.
- Confirm affected population, stressor profile, privacy requirements, referral authority, and acute-risk thresholds before recommending action.
- Keep outputs unclassified by default and minimize sensitive personal detail unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using stress indicators, counseling-access friction, peer-support availability, relocation or deployment disruption, and household-impact signals.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in privacy, access speed, volunteer burden, and resilience impact.
3. Identify branch triggers for wait-time spikes, referral dead ends, acute-risk escalation, confidentiality breakdown, and caregiver-support overload.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and family-support decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and resilience-risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: counseling-access board, peer-support routing ladder, and privacy-safe resilience packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-ONESOURCE-336`, `tool_suite_id=ts-joint-military-onesource-nonmedical-counseling-peer-support-v1`, and `protocol_stack_id=ps-joint-military-onesource-nonmedical-counseling-peer-support-stack-v1`.
- Alternate: select a mission-adjacent telebehavioral-health, religious-affairs, or family-readiness suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual referral roster with advisory-only routing until privacy posture, support availability, and acute-risk boundaries are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-ONESOURCE-PEER-SUPPORT-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: counseling referral board, access or wait-time tracker, peer-support resource ledger, and privacy-safe escalation queue.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed referral notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If privacy, referral authority, or acute-risk posture is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and escalation-boundary clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported counseling promises, confidentiality gaps, peer-support overload, and acute-risk ambiguity before recommending action.
- Do not fabricate appointment access, counselor availability, peer-support capacity, or clinical disposition.
