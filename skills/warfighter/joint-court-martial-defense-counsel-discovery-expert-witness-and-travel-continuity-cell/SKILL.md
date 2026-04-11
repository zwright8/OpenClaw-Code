---
name: joint-court-martial-defense-counsel-discovery-expert-witness-and-travel-continuity-cell
description: Preserve defense-support logistics, discovery timing, expert-witness access, and travel continuity when court-martial processes threaten U.S. warfighter due process, family stability, or lawful availability.
---

# Joint Court Martial Defense Counsel Discovery Expert Witness And Travel Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter court-martial defense-support and discovery-continuity decisions.
- Confirm forum posture, trial timeline, affected personnel, discovery status, witness needs, travel or funding constraints, and decision authority before recommending action.
- Keep outputs unclassified by default and minimize privileged legal detail unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using charge posture, discovery backlog, witness location, expert-support demand, and readiness or family impact.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in due-process support, trial continuity, cost, and command burden.
3. Identify branch triggers for late discovery, witness unavailability, funding denial, confinement or PCS friction, and privacy or safety concerns.
4. Bind each critical recommendation to concrete external tools, protocol stacks, packet templates, and authority gates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and defense-support risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: defense-support board, discovery suspense ladder, and witness-support continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-CMART-350`, `tool_suite_id=ts-joint-court-martial-defense-counsel-discovery-expert-witness-travel-continuity-v1`, and `protocol_stack_id=ps-joint-court-martial-defense-counsel-discovery-expert-witness-travel-continuity-stack-v1`.
- Alternate: select a mission-adjacent legal-support, travel-continuity, or personnel-records suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual defense-support roster with advisory-only sequencing until discovery posture, witness routing, and legal review are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-COURT-MARTIAL-DEFENSE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: defense case board, discovery-production ledger, expert-witness request queue, and witness-travel or funding tracker.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed legal notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Use the `Administrative Justice and Redress` playbook when discovery deadlines, witness movement, expert support, or family-travel constraints determine due-process risk.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If discovery status, witness legitimacy, or defense authority is uncertain, downgrade to advisory-only and request human legal review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and trial-support clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported discovery claims, witness coercion, privileged-data leakage, and unfunded travel assumptions before recommending action.
- Do not fabricate legal advice, trial outcomes, witness availability, or discovery sufficiency.
