---
name: theater-forward-water-quality-lab-and-potability-release-cell
description: Coordinate field water-quality lab workflows, potability release decisions, and distribution holds. Use when contamination, purification drift, or suspected sabotage threatens forward water trust, force health, or sustainment tempo.
---

# Theater Forward Water Quality Lab And Potability Release Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm preventive-medicine authority, release thresholds, supported population, and commander decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with sample-chain status, contamination indicators, purification output, distribution demand, and release criteria.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in force health, water continuity, logistics burden, and confidence.
3. Identify branch or sequel triggers, hold or flush thresholds, and command approval gates.
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

Primary products: water-release ladder, contamination hold or flush matrix, and distribution confidence brief.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-forward-water-quality-lab-potability-release-v1` with `protocol_stack_id=ps-theater-forward-water-quality-lab-potability-release-stack-v1`.
- Alternate: `tool_suite_id=ts-civil-support-v1` with `protocol_stack_id=ps-cop-event-sharing-stack-v1`.
- Degraded: manual test-strip release workflow with paper sample-custody ledger, UTC readbacks, and commander-approved water rationing.

## Domain Packet Defaults

- Default packet ID: `DPL-WATER-LAB-POTABILITY-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: field water lab chain, purification telemetry board, and preventive-medicine release tracker.
- Preferred protocol profiles for coordination and machine exchange: signed sample manifests, `EDXL-DE/CAP`, `API/JSON`, `USMTF`, and `HL7/FHIR`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, sample custody, or test evidence is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag preventive-medicine, environmental, and supported-population constraints before recommending action.
- Do not fabricate classified sources, authorities, or approvals.
