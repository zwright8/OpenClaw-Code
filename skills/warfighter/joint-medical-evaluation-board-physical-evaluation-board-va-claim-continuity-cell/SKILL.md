---
name: joint-medical-evaluation-board-physical-evaluation-board-va-claim-continuity-cell
description: Preserve MEB, PEB, IDES, and VA-claim continuity when wounded or ill warfighters risk losing medical-board evidence, duty-disposition clarity, or transition benefits. Use when board-process friction begins to degrade recovery, retention, or lawful transition timing.
---

# Joint Medical Evaluation Board Physical Evaluation Board VA Claim Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter medical-board, disability-disposition, and transition-benefit continuity decisions.
- Confirm affected servicemember population, clinical evidence posture, board timeline, duty-status constraints, and family or transition dependencies before recommending action.
- Keep outputs unclassified by default and minimize PHI or PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using board backlog, duty-limitation evidence, specialty evaluation status, family-transition pressure, and command decision deadlines.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in recovery quality, due process, transition speed, and staff burden.
3. Identify branch triggers for missing medical evidence, NARSUM or profile delay, board rescheduling, VA-claim handoff failure, and return-to-duty ambiguity.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and medical-board risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: medical-board case board, duty-disposition decision ladder, and VA or DOD claim handoff packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-MEBPEB-308`, `tool_suite_id=ts-joint-medical-evaluation-board-physical-evaluation-board-va-claim-continuity-v1`, and `protocol_stack_id=ps-joint-medical-evaluation-board-physical-evaluation-board-va-claim-continuity-stack-v1`.
- Alternate: select a mission-adjacent rehabilitation, casualty-regulation, or personnel-record suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual board-priority roster with advisory-only sequencing until medical evidence, board authority, and claim handoff are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-MEB-PEB-VA-CLAIM-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: medical-board case tracker, duty-limitation evidence ledger, IDES handoff board, and transition-benefits queue.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `NIEM`, signed board notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If board authority, clinical evidence, or VA or DOD handoff legitimacy is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported duty-status assumptions, rushed board timelines, missing specialty evidence, and unfounded VA-rating expectations before recommending action.
- Do not fabricate medical evidence, board outcomes, duty dispositions, or benefits decisions.
