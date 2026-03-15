---
name: joint-casualty-rehabilitation-prosthetics-and-return-to-duty-cell
description: Coordinate casualty rehabilitation, prosthetic fitting, and return-to-duty or transition planning for U.S. warfighters after combat injury. Use when commanders or medical staffs need readiness-aware recovery options beyond acute care.
---

# Joint Casualty Rehabilitation Prosthetics And Return To Duty Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm echelon, casualty profile, rehabilitation capacity, prosthetic-device availability, family-support needs, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with injury pattern, rehabilitation milestones, prosthetic demand, occupational task requirements, and transition constraints.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in recovery quality, return-to-duty speed, long-term function, and family or transition burden.
3. Identify branch or sequel triggers, device-release thresholds, and authority or release gates.
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

Primary products: rehabilitation milestones board, prosthetic fitting matrix, and return-to-duty or transition decision ledger.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-casualty-rehabilitation-prosthetics-return-to-duty-v1` with `protocol_stack_id=ps-joint-casualty-rehabilitation-prosthetics-return-to-duty-stack-v1`.
- Alternate: select a mission-adjacent force-health or casualty-management suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual rehab milestone board with prosthetic-custody log and command-approved functional assessment checkpoints.

## Domain Packet Defaults

- Default packet ID: `DPL-REHAB-PROSTHETICS-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: rehabilitation progress tracker, prosthetic fitting board, gait or function assessment monitor, and return-to-duty review ledger.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `DICOM`, signed device manifests, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, legal basis, device pedigree, or functional-assessment evidence is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag prosthetic-device safety, long-term overuse risk, chronic-pain concerns, family-transition needs, and classification or privacy constraints before recommending action.
- Do not fabricate authorities, approvals, or source evidence.
