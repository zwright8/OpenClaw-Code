---
name: joint-telebehavioral-health-burnout-and-suicide-risk-continuity-cell
description: Preserve telebehavioral-health access, burnout intervention, and suicide-risk escalation continuity for U.S. warfighters and families when clinic disruption, isolation, or high operational tempo threatens readiness.
---

# Joint Telebehavioral Health Burnout And Suicide Risk Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter behavioral-health continuity decisions where remote care access, burnout, or suicide-risk escalation affects force readiness and family stability.
- Confirm affected personnel or households, immediate-risk posture, provider availability, telehealth connectivity, privacy constraints, and decision authority before recommending action.
- Keep outputs unclassified by default and minimize protected health information unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using unit tempo, burnout indicators, care backlog, telehealth access, acute-risk triggers, and mission impact.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in care speed, privacy, provider burden, and operational continuity.
3. Identify branch triggers for provider no-show, bandwidth loss, escalating suicide risk, privacy breach, and command-duty impairment concerns.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and behavioral-health risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: telebehavioral triage board, burnout intervention ladder, and suicide-risk continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-TBHEALTH-327`, `tool_suite_id=ts-joint-telebehavioral-health-burnout-suicide-risk-continuity-v1`, and `protocol_stack_id=ps-joint-telebehavioral-health-burnout-suicide-risk-continuity-stack-v1`.
- Alternate: select a mission-adjacent force-health, postvention, or family-readiness suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual behavioral-health priority roster with advisory-only triage until provider availability, connectivity, and immediate-risk posture are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-TELEBEHAVIORAL-BURNOUT-SUICIDE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: telebehavioral intake queue, secure virtual-visit scheduler, command-risk escalation ledger, and crisis handoff tracker.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, signed care notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If acute-risk evidence, provider legitimacy, or privacy protection is uncertain, downgrade to advisory-only and request human clinical or command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and escalation-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported care promises, false privacy assumptions, burnout normalization, and suicide-risk minimization before recommending action.
- Do not fabricate diagnosis, provider availability, hospitalization authority, or emergency-response outcomes.
