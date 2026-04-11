---
name: joint-barracks-dorm-work-order-bah-exception-and-emergency-relocation-continuity-cell
description: Preserve barracks or dorm habitability routing, work-order escalation, BAH-exception legitimacy, and emergency-relocation continuity when unsafe rooms or administrative delay threaten U.S. warfighter readiness.
---

# Joint Barracks Dorm Work Order BAH Exception And Emergency Relocation Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter barracks, dormitory, and emergency-relocation continuity decisions.
- Confirm affected facilities, occupancy posture, work-order backlog, BAH-exception authority, relocation capacity, and decision timeline before recommending action.
- Keep outputs unclassified by default and minimize PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using room habitability, work-order status, relocation demand, BAH-exception posture, and readiness or family impact.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in safety, housing legitimacy, speed, and administrative burden.
3. Identify branch triggers for condemned rooms, delayed repairs, temporary lodging overflow, BAH-exception denial, and emergency relocation pressure.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and housing-risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: room-status board, BAH-exception decision ladder, and emergency-relocation continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-BARRDORM-368`, `tool_suite_id=ts-joint-barracks-dorm-work-order-bah-exception-emergency-relocation-continuity-v1`, and `protocol_stack_id=ps-joint-barracks-dorm-work-order-bah-exception-emergency-relocation-continuity-stack-v1`.
- Alternate: select a mission-adjacent housing, family-readiness, or environmental-remediation suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual room-risk roster with advisory-only relocation sequencing until habitability evidence, lodging capacity, and human housing review are confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-BARRACKS-DORM-BAH-RELOCATE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: room habitability tracker, work-order escalation board, BAH-exception ledger, and emergency-relocation queue.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed housing notices, `API/JSON`, `S/MIME`, `USMTF`, and `NIMS/ICS` when emergency lodging is involved.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If habitability evidence, housing authority, or relocation capacity is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and relocation-branch clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsafe occupancy, unsupported BAH promises, lodging oversubscription, and retaliatory room-assignment risk before recommending action.
- Do not fabricate repair completion, housing approval, BAH exceptions, or room reassignments.
