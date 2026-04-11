---
name: joint-duty-limiting-profile-accommodation-and-nondeployable-code-continuity-cell
description: Preserve duty-limiting-profile legitimacy, accommodation routing, and nondeployable-code reconciliation when medical restrictions, profile drift, or assignment mismatch start to sideline U.S. warfighters without clear evidence or lawful support.
---

# Joint Duty Limiting Profile Accommodation And Nondeployable Code Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter profile, accommodation, and deployability-code continuity decisions.
- Confirm affected force population, profile status, accommodation posture, nondeployable-code evidence, assignment timeline, and medical or command authority before recommending action.
- Keep outputs unclassified by default and minimize medical detail or PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using current profile, medical restriction or duty-limitation evidence, accommodation backlog, code mismatch, and unit-impact timeline.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in medical safety, lawful availability, privacy burden, and manpower flexibility.
3. Identify branch triggers for expired profiles, unimplemented accommodations, wrong nondeployable codes, waiver requirements, and assignment or schooling conflicts.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and profile-risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: profile-reconciliation board, accommodation decision ladder, and deployability-code continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-PROFILE-371`, `tool_suite_id=ts-joint-duty-limiting-profile-accommodation-nondeployable-code-continuity-v1`, and `protocol_stack_id=ps-joint-duty-limiting-profile-accommodation-nondeployable-code-continuity-stack-v1`.
- Alternate: select a mission-adjacent medical-readiness, human-readiness, or convalescent-leave suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual profile-risk roster with advisory-only sequencing until medical evidence, accommodation posture, and human review are confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-PROFILE-NONDEPLOY-CODE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: profile-status board, accommodation request queue, nondeployable-code ledger, and assignment-impact tracker.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `NIEM`, signed medical or personnel notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If profile authority, accommodation basis, or nondeployable-code evidence is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and profile-to-assignment clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsafe-duty exposure, privacy leakage, unsupported accommodation promises, and stale nondeployable-code assumptions before recommending action.
- Do not fabricate profile status, accommodation approval, waiver authority, or deployability restoration.
