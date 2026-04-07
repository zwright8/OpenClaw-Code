---
name: joint-vre-independent-living-and-adaptive-employment-continuity-cell
description: Preserve Veteran Readiness and Employment (VR&E), independent-living support, and adaptive-employment continuity for recovering or separating U.S. warfighters when disability or transition friction threatens long-term readiness, recovery, or financial stability.
---

# Joint VRE Independent Living And Adaptive Employment Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter vocational-rehabilitation, adaptive-employment, and independent-living continuity decisions.
- Confirm affected warfighters, recovery stage, functional limitations, education or employment goals, adaptive-equipment demand, and decision deadlines before recommending action.
- Keep outputs unclassified by default and minimize PHI or PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using VR&E status, independent-living needs, adaptive-technology demand, employment or training timeline, and household income pressure.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in recovery continuity, employment speed, independence, and administrative burden.
3. Identify branch triggers for counselor backlog, program denial, adaptive-equipment delay, employer friction, and education-plan mismatch.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and vocational-rehabilitation risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: VR&E case board, adaptive-employment ladder, and independent-living continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-VREIL-334`, `tool_suite_id=ts-joint-vre-independent-living-adaptive-employment-continuity-v1`, and `protocol_stack_id=ps-joint-vre-independent-living-adaptive-employment-continuity-stack-v1`.
- Alternate: select a mission-adjacent rehabilitation, retirement-transition, or SkillBridge suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual rehabilitation-priority roster with advisory-only sequencing until entitlement posture, counselor routing, and adaptive-support requirements are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-VRE-INDEPENDENT-LIVING-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: VR&E case board, employment or training-plan tracker, adaptive-equipment request ledger, and independent-living goal review board.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `PESC XML`, signed rehabilitation plans, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If entitlement evidence, training legitimacy, or adaptive-support posture is uncertain, downgrade to advisory-only and request human rehabilitation or transition review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported employment promises, inaccessible training assumptions, adaptive-equipment shortfalls, and family-income fragility before recommending action.
- Do not fabricate entitlement status, counselor decisions, job offers, or equipment approvals.
