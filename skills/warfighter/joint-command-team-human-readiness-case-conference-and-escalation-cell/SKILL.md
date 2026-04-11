---
name: joint-command-team-human-readiness-case-conference-and-escalation-cell
description: Synchronize command-team human-readiness case conferences across medical, legal, chaplain, EFMP, family-readiness, housing, and finance lanes before fragmented case management turns household strain into readiness loss.
---

# Joint Command Team Human Readiness Case Conference And Escalation Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter command teams managing multi-factor human-readiness cases.
- Confirm affected personnel or households, active support lanes, privacy-release posture, command authority, and decision deadlines before recommending action.
- Keep outputs unclassified by default and minimize protected medical, legal, or financial detail unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using readiness impact, active support lanes, unresolved blockers, risk of fragmentation, and command decision timeline.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in privacy, speed, staff burden, and readiness protection.
3. Identify branch triggers for stalled case ownership, conflicting authorities, missing consent, high-risk escalation, and household breakdown.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a cross-functional staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and human-readiness risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: human-readiness case board, cross-functional escalation ladder, and command-case conference packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-HUMREAD-361`, `tool_suite_id=ts-joint-command-team-human-readiness-case-conference-escalation-v1`, and `protocol_stack_id=ps-joint-command-team-human-readiness-case-conference-escalation-stack-v1`.
- Alternate: select a mission-adjacent family-readiness, medical-board, or command-support suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual command-case roster with advisory-only sequencing until consent posture, cross-functional inputs, and human authority are confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-HUMAN-READINESS-CASE-CONFERENCE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: command case board, cross-functional referral tracker, action-and-suspense matrix, and privacy-release ledger.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `NIEM`, signed command-support notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If consent posture, privacy basis, or command authority is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and cross-functional-ownership clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Protect medical privacy, legal privilege, victim-safety routing, and command-role boundaries before recommending action.
- Do not fabricate consent, case status, support availability, or command decisions.
