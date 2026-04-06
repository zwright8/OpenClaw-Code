---
name: joint-military-family-care-plan-guardianship-and-dependent-support-cell
description: Preserve family care plans, guardianship readiness, and dependent support during mobilization, deployment, casualty risk, or extended domestic response. Use when family-care gaps can degrade readiness or create emergency welfare risk.
---

# Joint Military Family Care Plan Guardianship And Dependent Support Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter family-care, guardianship, and dependent-support continuity decisions.
- Confirm activation or deployment timelines, sole or dual-military parent status, guardian viability, dependent medical or school needs, and command decision deadlines before recommending action.
- Keep outputs unclassified by default and minimize personally identifiable information unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using family-care-plan status, deployment timeline, special-needs dependencies, guardian availability, and staff decision points.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in readiness protection, dependent safety, privacy exposure, and coordination burden.
3. Identify branch triggers for guardian cancellation, school or medical consent failure, transport disruption, special-needs escalation, and casualty-notification branch activation.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and family-care risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: family-care-plan risk board, guardianship decision matrix, and dependent support continuity tracker.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-family-care-guardianship-dependent-support-v1` with `protocol_stack_id=ps-joint-family-care-guardianship-dependent-support-stack-v1`.
- Alternate: select a mission-adjacent reserve-readiness, family-support, or casualty-assistance suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual family-care-plan validation with no deployment-readiness certification beyond confirmed human review.

## Domain Packet Defaults

- Default packet ID: `DPL-FAMILY-CARE-GUARDIANSHIP-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: family-care-plan ledger, guardian contact board, dependent medical or school consent tracker, and support-gap escalation queue.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed family-care notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If guardianship authority, consent integrity, or family-support availability is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and dependent-support acknowledgment integrity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported guardian assumptions, expired consent forms, special-needs support gaps, and privacy exposure before recommending action.
- Do not fabricate custody authority, guardian acceptance, dependent status, or readiness certification.
