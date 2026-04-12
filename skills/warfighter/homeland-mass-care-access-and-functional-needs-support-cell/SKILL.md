---
name: homeland-mass-care-access-and-functional-needs-support-cell
description: Integrate access and functional needs support into shelters, evacuation transport, and caregiver continuity. Use when U.S. warfighters need domestic-support recommendations that keep mass care accessible and medically credible under crisis conditions.
---

# Homeland Mass Care Access And Functional Needs Support Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter mass-care recommendations involving access and functional needs.
- Confirm affected populations, shelter posture, transport assets, DME or oxygen availability, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using shelter demand, AFN populations, caregiver dependencies, accessible-transport availability, and medical-support gaps.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in life safety, accessibility, throughput, and support burden.
3. Identify branch triggers for shelter overload, caregiver separation risk, DME or oxygen shortfalls, and transport denial.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and civil-authority decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Inputs

- Shelter status by site, including occupancy, accessibility features, backup power, and latest UTC refresh time.
- Population demand estimates, including AFN counts, caregiver dependencies, language-access needs, and medically fragile cohorts.
- Transport and route status, including wheelchair-capable lift assets, oxygen-support movement limits, fuel posture, and road accessibility constraints.
- Medical-support availability, including DME, oxygen, refrigeration, pharmacy continuity, and clinical escalation contacts.
- Authority and coordination context, including shelter lead, civil-support authorities, host-jurisdiction approvals, and releasability constraints.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: AFN support matrix, accessible-transport ladder, and mass-care support packet.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-homeland-mass-care-access-functional-needs-support-v1` with `protocol_stack_id=ps-homeland-mass-care-access-functional-needs-support-stack-v1`.
- Alternate: select a mission-adjacent shelter, evacuation, or medical-support suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: essential shelter support only with manual AFN tracking and command-approved transport prioritization.

## Domain Packet Defaults

- Default packet ID: `DPL-MASS-CARE-AFN-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: shelter-needs registry, accessible-transport board, DME or oxygen support tracker, and caregiver continuity ledger.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `CAP`, `HL7/FHIR`, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If shelter authority, medical-support availability, or transport legitimacy is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Failure Handling

- If shelter, transport, or medical-support feeds are stale or conflicting, downgrade outputs to advisory-only, identify the validation owner, and publish a time-bounded revalidation trigger.
- If protocol validation or tool-packet delivery fails, switch to the degraded manual AFN tracker and accessible-transport ladder while preserving UTC timestamps, assumptions, and confidence impacts.
- If no medically credible placement or accessible route remains, return a no-go status with life-safety escalation prompts instead of forcing a routing recommendation.
- If caregiver continuity, DME support, or oxygen sustainment cannot be verified, surface the gap as a blocking decision point and require human approval before any movement recommendation.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag caregiver-separation risk, inaccessible routes, DME or oxygen shortfalls, and disability-equity gaps before recommending action.
- Do not fabricate accessible-transport availability, shelter capabilities, or medical-support commitments.
