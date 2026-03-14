---
name: theater-musculoskeletal-load-management-and-physical-therapy-cell
description: Coordinate musculoskeletal load management, physical therapy prioritization, and functional recovery planning for U.S. warfighters under sustained operational tempo. Use when preventable overuse injuries or delayed rehabilitation threaten readiness.
---

# Theater Musculoskeletal Load Management And Physical Therapy Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm echelon, injury rates, load carriage demands, therapy capacity, wearable-data availability, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with injury trends, load exposure, mission-essential tasks, therapy resources, and return-to-duty thresholds.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in readiness, injury prevention, recovery tempo, and manpower burden.
3. Identify branch or sequel triggers, no-go thresholds, and authority or release gates.
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

Primary products: load-injury risk board, physical-therapy prioritization ladder, and functional return-to-duty matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-musculoskeletal-load-physical-therapy-v1` with `protocol_stack_id=ps-theater-musculoskeletal-load-physical-therapy-stack-v1`.
- Alternate: select a mission-adjacent force-health or human-performance suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual injury watchlist with daily movement screening and commander-approved task-lightening matrix.

## Domain Packet Defaults

- Default packet ID: `DPL-MSK-PT-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: load-exposure tracker, movement-screen assessment board, physical-therapy scheduler, and functional capacity ledger.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, signed sensor manifests, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, legal basis, sensor provenance, or injury-severity evidence is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag injury underreporting, wearable-data gaps, mission-essential-task conflicts, and medical profile limits before recommending action.
- Do not fabricate authorities, approvals, or source evidence.
