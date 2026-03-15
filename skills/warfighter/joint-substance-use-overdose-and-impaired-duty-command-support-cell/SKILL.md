---
name: joint-substance-use-overdose-and-impaired-duty-command-support-cell
description: Support overdose response, impaired-duty risk control, and protected care referral for U.S. warfighters. Use when substance misuse, medication impairment, or overdose incidents affect unit safety, accountability, or readiness.
---

# Joint Substance Use, Overdose, And Impaired Duty Command Support Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter overdose response, impaired-duty risk adjudication, and protected referral decisions.
- Confirm incident facts, symptom severity, duty position, privacy constraints, referral options, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with incident timeline, impairment indicators, unit risk, protected-care options, and commander decision points.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in life safety, mission continuity, privacy, and command burden.
3. Identify branch triggers for overdose response escalation, weapon or vehicle restriction, protected referral, return-to-duty review, and notification requirements.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: impaired-duty risk matrix, overdose response ladder, and protected referral or return-to-duty board.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-substance-use-overdose-impaired-duty-v1` with `protocol_stack_id=ps-joint-substance-use-overdose-impaired-duty-stack-v1`.
- Alternate: select a mission-adjacent psychological-health, Role 3 medical, or safety-investigation suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: protected voice handoff, paper incident ledger, and dual-review duty restriction board.

## Domain Packet Defaults

- Default packet ID: `DPL-SUBSTANCE-USE-OVERDOSE-IMPAIRED-DUTY-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: overdose incident tracker, impairment-risk board, protected referral workflow, and unit safety watchlist.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `NIEM`, signed case manifests, `S/MIME`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for actions that change duty status, access, or referral posture.
- If patient safety, impairment confirmation, or privacy authority is uncertain, downgrade to advisory-only and require human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and protected-routing acknowledgment integrity.
- If checks fail, provide a degraded safety branch with explicit health, privacy, and mission risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag overdose severity, medication interactions, duty-position sensitivity, retaliation risk, and confidentiality breaches early.
- Do not fabricate toxicology results, consent posture, or command or medical approvals.
