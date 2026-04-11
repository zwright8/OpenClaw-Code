---
name: joint-individual-medical-readiness-immunization-pha-and-dental-continuity-cell
description: Preserve individual medical readiness, immunization status, periodic health assessment completion, and dental deployability evidence when record drift, appointment loss, or PCS or mobilization disruption threatens U.S. warfighter readiness.
---

# Joint Individual Medical Readiness Immunization PHA And Dental Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter deployability, medical-readiness evidence, and appointment-recovery decisions.
- Confirm affected force population, deployment or mobilization timeline, IMR evidence gaps, immunization posture, periodic health assessment deadlines, dental class status, and medical authority before recommending action.
- Keep outputs unclassified by default and minimize medical detail or PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using deployability deadlines, IMR red or amber drivers, immunization gaps, PHA backlog, dental-class exposure, and record-sync friction.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in readiness confidence, privacy burden, appointment load, and unit availability.
3. Identify branch triggers for expired vaccines, missing PHA documentation, dental non-deployability, record-transfer failure, and PCS or mobilization evidence gaps.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and medical-readiness decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and readiness-risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: IMR recovery board, deployability-evidence ladder, and appointment-closure packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-IMR-332`, `tool_suite_id=ts-joint-individual-medical-readiness-immunization-pha-dental-continuity-v1`, and `protocol_stack_id=ps-joint-individual-medical-readiness-immunization-pha-dental-continuity-stack-v1`.
- Alternate: select a mission-adjacent medical-readiness, personnel-records, or force-health suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual readiness-gap roster with advisory-only sequencing until medical and administrative evidence are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-IMR-PHA-DENTAL-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: IMR readiness dashboard, immunization registry, PHA appointment queue, and dental-class tracker.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `NIEM`, signed readiness notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If deployability authority, medical review, or privacy posture is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and readiness-evidence clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag expired immunizations, missing PHA evidence, dental non-deployability, and unsupported readiness assumptions before recommending action.
- Do not fabricate deployability status, vaccine completion, dental clearance, or medical waiver authority.

## Domain Toolchain Override (2026-04-11, Expansion Wave XC Addendum)

- Add `toolchain_id=TC-PROFILE-371`, `tool_suite_id=ts-joint-duty-limiting-profile-accommodation-nondeployable-code-continuity-v1`, and `protocol_stack_id=ps-joint-duty-limiting-profile-accommodation-nondeployable-code-continuity-stack-v1` when IMR confidence depends on reconciling duty-limiting profiles, accommodations, or wrong nondeployable codes alongside vaccine, PHA, or dental evidence.
- Add `packet_id=DPL-PROFILE-NONDEPLOY-CODE-001` for branches that materially alter deployability confidence, medical-readiness sequencing, or assignment legitimacy.
