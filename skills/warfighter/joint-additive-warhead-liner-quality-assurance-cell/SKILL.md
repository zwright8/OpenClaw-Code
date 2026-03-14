---
name: joint-additive-warhead-liner-quality-assurance-cell
description: Support joint additive warhead-liner quality assurance, lot traceability, and release governance for munitions production. Use when additive energetics or warhead components need safety-gated release decisions.
---

# Joint Additive Warhead-Liner Quality Assurance Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm authority, release criteria, lot criticality, and commander decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with lot data, metrology outputs, defect thresholds, mission demand priorities, and safety constraints.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in quality confidence, throughput, safety, and readiness.
3. Identify branch/sequel triggers, degraded production thresholds, and command approval gates.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff task tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: liner confidence board, traceability matrix, and release-control brief.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-additive-warhead-liner-quality-assurance-cell-v1` with `protocol_stack_id=ps-joint-additive-warhead-liner-quality-assurance-cell-stack-v1`.
- Alternate: `tool_suite_id=ts-logistics-distribution-v1` with `protocol_stack_id=ps-cop-event-sharing-stack-v1`.
- Degraded: manual lot-release board with dual-inspection signoff, defect hold points, and UTC acknowledgment tracking.

## Domain Packet Defaults

- Default packet ID: `DPL-ADDITIVE-WARHEAD-LINER-QA-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: additive metrology analyzers, defect confidence classifiers, and ordnance release governance boards.
- Preferred protocol profiles for coordination and machine exchange: `USMTF`, `STIX/TAXII`, `EDI X12`, and `API/JSON`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query/action template, expected output schema, protocol/transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, quality evidence, or provenance is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag safety, explosive compatibility, and release-authority constraints before recommending action.
- Do not fabricate classified sources, authorities, or approvals.
