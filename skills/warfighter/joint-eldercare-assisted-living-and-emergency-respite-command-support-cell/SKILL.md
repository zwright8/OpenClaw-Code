---
name: joint-eldercare-assisted-living-and-emergency-respite-command-support-cell
description: Stabilize eldercare, assisted-living transitions, emergency respite, and medication or transport continuity so warfighters are not unexpectedly pulled out of mission or recovery windows by parent-care collapse. Use when eldercare strain is starting to create a real readiness, retention, or recovery problem.
---

# Joint Eldercare Assisted Living And Emergency Respite Command Support Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter eldercare continuity decisions spanning caregiver availability, assisted-living placement, emergency respite, medications, appointments, and safety risks.
- Confirm elder support needs, caregiver posture, legal-document status, medical urgency, travel constraints, and command decision timelines before recommending action.
- Keep outputs unclassified by default and minimize PII or protected health information unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using caregiver collapse risk, medical or cognitive support needs, housing safety, medication continuity, and warfighter availability impact.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in elder safety, privacy, cost, and mission disruption.
3. Identify branch triggers for hospitalization, dementia wandering or safety risk, oxygen or power dependence, respite denial, travel failure, and legal-document gaps.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and eldercare-risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: eldercare risk board, respite and transport action ladder, and caregiver continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-ELDERCARE-323`, `tool_suite_id=ts-dependent-care-transition-v1`, and `protocol_stack_id=ps-eldercare-respite-command-support-stack-v1`.
- Alternate: select a mission-adjacent family-readiness, medical-access, or hardship-support suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual elder-risk triage board with advisory-only guidance until caregiver availability, medical urgency, and legal authorities are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-ELDERCARE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: caregiver availability ledger, assisted-living or respite capacity board, medication and appointment tracker, travel or grant queue, and power or oxygen continuity checklist.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `HL7/FHIR`, signed care or transport notices, `API/JSON`, and `S/MIME`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Use the `Personnel and Family Readiness Casework` playbook when command support, respite, transport, and household stabilization must be synchronized.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If elder identity, medical urgency, or caregiver consent and availability are uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Protect elder safety, privacy, medication integrity, and realistic caregiver workload before recommending action.
- Do not fabricate respite availability, facility acceptance, legal authority, or medical clearance.
