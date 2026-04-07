---
name: strategic-space-cleanroom-contamination-and-component-quarantine-cell
description: Coordinate strategic space cleanroom contamination response and component quarantine. Use when launch, satellite integration, or high-reliability space hardware is threatened by particulate, outgassing, or pedigree-control failures.
---

# Strategic Space Cleanroom Contamination and Component Quarantine Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm cleanroom classification, component pedigree, contamination findings, launch schedule impact, and quarantine authority before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with contamination indicators, affected hardware, cleanroom environmental status, launch integration schedule, and commander priorities.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in mission assurance, hardware loss, schedule slip, and rework burden.
3. Identify branch triggers for contamination spread, pedigree break, cleanroom recertification failure, or launch-window miss.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and industrial-base decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: contamination control board, component quarantine matrix, and launch-integration recovery ladder.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-strategic-space-cleanroom-contamination-component-quarantine-v1` with `protocol_stack_id=ps-strategic-space-cleanroom-contamination-component-quarantine-stack-v1`.
- Alternate: select a mission-adjacent space-launch, industrial-quality, or high-reliability manufacturing suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: quarantine-first posture with manual particle monitoring, conservative reuse denial, and launch-slip acceptance pending recertification.

## Domain Packet Defaults

- Default packet ID: `DPL-CLEANROOM-QUARANTINE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: cleanroom environmental monitor, component genealogy ledger, contamination assay board, and launch-integration schedule tracker.
- Preferred protocol profiles for coordination and machine exchange: `CCSDS`, `OPC UA`, signed manufacturing manifests, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If contamination evidence, pedigree integrity, or quarantine authority is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag cleanroom recertification drift, foreign-object debris uncertainty, genealogy breaks, and schedule-pressure bias before recommending action.
- Do not fabricate contamination clearance, hardware pedigree, or launch-readiness approval.
