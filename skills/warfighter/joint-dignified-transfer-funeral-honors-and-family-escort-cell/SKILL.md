---
name: joint-dignified-transfer-funeral-honors-and-family-escort-cell
description: Coordinate dignified transfer, funeral honors, and family escort continuity for fallen service members. Use when casualty accountability, ceremonial timelines, and family-support coordination must stay precise under operational strain.
---

# Joint Dignified Transfer Funeral Honors And Family Escort Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter casualty-honor, family-support, and ceremonial-accountability decisions.
- Confirm casualty-status authority, escort availability, mortuary posture, family-support requirements, and ceremonial timelines before recommending action.
- Keep outputs unclassified by default and minimize personally identifiable information unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem using casualty accountability, transfer timeline, escort assignments, family needs, and honors-resource availability.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in dignity, timeliness, family-support quality, and ceremonial resource strain.
3. Identify branch triggers for escort substitution, transfer reroute, honors-package adjustment, and family communication holds.
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

Primary products: dignified-transfer timeline, family escort support matrix, and funeral honors execution board.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-dignified-transfer-funeral-honors-family-escort-v1` with `protocol_stack_id=ps-joint-dignified-transfer-funeral-honors-family-escort-stack-v1`.
- Alternate: select a mission-adjacent mortuary, personnel-accountability, or family-support suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: essential custody and family-contact continuity only with manual honors coordination and protected identity handling.

## Domain Packet Defaults

- Default packet ID: `DPL-DIGNIFIED-TRANSFER-FUNERAL-HONORS-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: casualty-support workflow, dignified-transfer custody ledger, and honors scheduling board.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `NIEM`, signed custody manifests, `S/MIME`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If casualty status, next-of-kin coordination, or custody continuity is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Use respectful language and protect the dignity of fallen personnel and families.
- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag custody breaks, escort shortfalls, ceremonial conflicts, and family-contact uncertainty before recommending action.
- Do not fabricate casualty status, family decisions, or approvals.
