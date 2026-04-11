---
name: strategic-military-spouse-mycaa-portable-training-and-career-reentry-cell
description: Preserve MyCAA funding, portable training progress, credential restart, and career reentry continuity when PCS, deployment, caregiving, or household shock threatens spouse employment resilience.
---

# Strategic Military Spouse MyCAA Portable Training And Career Reentry Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter spouse-training and career-reentry decisions that materially affect readiness and retention.
- Confirm affected households, MyCAA or training posture, credential or course status, caregiving constraints, and decision authority before recommending action.
- Keep outputs unclassified by default and minimize PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using training status, MyCAA funding posture, credential restart needs, employment timeline, and household stability impact.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in career continuity, speed, affordability, and readiness value.
3. Identify branch triggers for funding lapse, school pause, credential expiration, caregiving overload, and PCS-driven training interruption.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and family-support decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and spouse-training risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: spouse-training continuity board, funding-and-restart ladder, and career-reentry packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-MYCAA-359`, `tool_suite_id=ts-strategic-military-spouse-mycaa-portable-training-career-reentry-v1`, and `protocol_stack_id=ps-strategic-military-spouse-mycaa-portable-training-career-reentry-stack-v1`.
- Alternate: select a mission-adjacent spouse-employment, credentialing, or family-readiness suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual spouse-support roster with advisory-only sequencing until funding status, credential posture, and training availability are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-MYCAA-TRAINING-CAREER-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: spouse training case board, MyCAA funding tracker, portable credential planner, and career-reentry ledger.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `HR-XML`, signed training notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If funding posture, credential status, or program authority is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and training-continuity clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported funding claims, school commitments, credential assumptions, and career-placement promises before recommending action.
- Do not fabricate MyCAA approval, school status, credential reactivation, or job outcomes.
