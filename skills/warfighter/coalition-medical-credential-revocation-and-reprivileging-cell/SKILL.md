---
name: coalition-medical-credential-revocation-and-reprivileging-cell
description: Coordinate coalition clinician trust recovery, revocation response, and emergency reprivileging for U.S. warfighter supported care networks. Use when credential compromise, insider risk, or emergency staffing gaps threaten coalition treatment continuity.
---

# Coalition Medical Credential Revocation And Reprivileging Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm coalition medical authorities, host-nation licensing constraints, patient-safety thresholds, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with clinician roster status, revocation notices, patient-load pressure, and credential trust gaps.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in care continuity, legal exposure, coalition trust, and clinical risk.
3. Identify branch/sequel triggers, emergency privileging thresholds, and command approval gates.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: clinician trust board, emergency privileging ladder, and care continuity packet.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-coalition-medical-credential-revocation-reprivileging-v1` with `protocol_stack_id=ps-coalition-medical-credential-revocation-reprivileging-stack-v1`.
- Alternate: select a mission-adjacent coalition medical, aeromedical, or hospital-network suite/stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual credential witness board with emergency privileging committee worksheet and dual-signature treatment exception log.

## Domain Packet Defaults

- Default packet ID: `DPL-COALITION-MEDICAL-CREDENTIAL-REPRIVILEGING-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: clinician credential registry, revocation ledger, emergency privileging workflow, and bed-load balancing board.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `NIEM`, `NATO APP-11/ADatP-3 aligned`, signed credential manifests, and `API/JSON`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query/action template, expected output schema, protocol/transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, legal basis, credential trust, or patient-safety evidence is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag host-nation licensure, privacy, patient-safety, and coalition caveat constraints before recommending action.
- Do not fabricate classified sources, authorities, or approvals.
