---
name: joint-rear-detachment-family-readiness-group-and-ombudsman-continuity-cell
description: Preserve rear-detachment, family-readiness-group, and ombudsman continuity when deployment, casualty risk, or domestic crisis leaves military households without trusted command-linked support. Use when sponsor absence starts to create readiness drag through unresolved family issues.
---

# Joint Rear Detachment Family Readiness Group And Ombudsman Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter household-support decisions where rear-detachment action, family-readiness-group routing, or ombudsman escalation affects force availability and family safety.
- Confirm affected unit or household set, sponsor status, current deployment or casualty context, support-node availability, and command decision deadlines before recommending action.
- Keep outputs unclassified by default and minimize PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using sponsor absence, household distress indicators, rear-detachment capacity, ombudsman or FRG responsiveness, and mission-impact timing.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in family support speed, privacy, fraud risk, and command burden.
3. Identify branch triggers for casualty-notification crossover, emergency leave routing, child or elder care breakdown, and household utility or shelter failure.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and household-support risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: rear-detachment action board, household escalation ladder, and command-family continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-REARDET-337`, `tool_suite_id=ts-joint-rear-detachment-family-readiness-group-ombudsman-continuity-v1`, and `protocol_stack_id=ps-joint-rear-detachment-family-readiness-group-ombudsman-continuity-stack-v1`.
- Alternate: select a mission-adjacent family-readiness, emergency-leave, or casualty-assistance suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual household-priority roster with advisory-only routing until sponsor status, family consent, and support-node legitimacy are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-REAR-DETACHMENT-FRG-OMBUDSMAN-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: rear-detachment action board, family-readiness case queue, ombudsman issue tracker, and sponsor-status or leave-impact ledger.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed family-support notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If sponsor status, family consent, or command-support legitimacy is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag privacy exposure, unsupported reassurance, uneven family support access, and fraudulent emergency claims before recommending action.
- Do not fabricate ombudsman contact, FRG availability, command approval, or household-service restoration.
