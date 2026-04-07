---
name: homeland-defense-coordinating-officer-and-fema-region-synchronization-cell
description: Synchronize Defense Coordinating Officer actions with FEMA regional support, tasking flow, and mission-assignment timing. Use when U.S. warfighters need domestic-support recommendations that stay aligned with FEMA regional operations and federal approval paths.
---

# Homeland Defense Coordinating Officer And FEMA Region Synchronization Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter DCO, FEMA-region, and federal-support synchronization decisions.
- Confirm supported jurisdictions, DCO or DCE roles, RRCC or NRCC posture, mission-assignment status, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using incident scale, federal-support requests, current DCO tasks, FEMA regional posture, and unmet capability gaps.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in responsiveness, authority clarity, coordination burden, and support credibility.
3. Identify branch triggers for RRCC escalation, mission-assignment approval or denial, DCO reprioritization, and liaison overload.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and interagency decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: DCO-FEMA synchronization matrix, federal-support escalation ladder, and regional support packet.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-homeland-dco-fema-region-synchronization-v1` with `protocol_stack_id=ps-homeland-dco-fema-region-synchronization-stack-v1`.
- Alternate: select a mission-adjacent DSCA, emergency-management, or mission-assignment suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual regional support board with advisory-only recommendations until tasking and mission-assignment status are confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-DCO-FEMA-SYNC-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: FEMA task-assignment board, DCO support tracker, RRCC status dashboard, and mission-assignment routing ledger.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `NIMS/ICS`, signed task-assignment notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If tasking legitimacy, mission-assignment status, or federal-support authority is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported federal commitments, duplicate tasking, liaison overload, and approval-lag risk before recommending action.
- Do not fabricate mission assignments, FEMA approvals, DCO authorities, or federal tasking commitments.
