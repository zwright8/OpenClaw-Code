---
name: joint-adaptive-sports-community-reintegration-and-peer-mentor-continuity-cell
description: Preserve adaptive-sports access, community reintegration, and peer-mentor continuity for wounded U.S. warfighters when nonclinical recovery momentum is breaking down. Use when isolation, mobility barriers, or admin friction threaten long-tail recovery.
---

# Joint Adaptive Sports Community Reintegration And Peer Mentor Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter reintegration, adaptive-sports, and peer-support continuity decisions.
- Confirm affected warfighters, recovery stage, functional limitations, current reintegration blockers, and command or clinical deadlines before recommending action.
- Keep outputs unclassified by default and minimize PHI or PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using rehabilitation stage, isolation indicators, adaptive-sport access gaps, peer-mentor availability, and transportation or equipment constraints.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in recovery momentum, autonomy, family burden, and staff effort.
3. Identify branch triggers for transportation breakdown, equipment delay, peer-support loss, and community-program waitlists that could stall long-tail recovery.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and reintegration risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: reintegration board, peer-mentor support ladder, and adaptive-sports continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-ADSPORT-342`, `tool_suite_id=ts-joint-adaptive-sports-community-reintegration-peer-mentor-continuity-v1`, and `protocol_stack_id=ps-joint-adaptive-sports-community-reintegration-peer-mentor-continuity-stack-v1`.
- Alternate: select a mission-adjacent rehabilitation, caregiver-support, or VR&E suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual reintegration-priority roster with advisory-only sequencing until program legitimacy, mentor availability, and equipment support posture are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-ADAPTIVE-SPORTS-REINTEGRATION-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: adaptive-sports participation board, peer-mentor assignment queue, reintegration milestone tracker, and transportation or equipment support ledger.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `NIEM`, signed rehabilitation plans, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If program legitimacy, rehabilitation safety, or peer-support integrity is uncertain, downgrade to advisory-only and request human clinical or rehabilitation review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsafe return-to-sport assumptions, unsupported resilience claims, transportation gaps, and mentor mismatch risk before recommending action.
- Do not fabricate program slots, transport support, peer matches, or rehabilitation clearance.
