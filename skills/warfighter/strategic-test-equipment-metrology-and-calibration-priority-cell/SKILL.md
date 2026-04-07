---
name: strategic-test-equipment-metrology-and-calibration-priority-cell
description: Prioritize metrology labs, calibration assets, and automated test-equipment recovery when U.S. warfighter production or maintenance depends on trustworthy measurements. Use when out-of-tolerance gear, expiring certifications, or constrained labs threaten readiness.
---

# Strategic Test Equipment Metrology And Calibration Priority Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm calibration authority, measurement standards, affected weapon-system portfolios, and readiness deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with out-of-tolerance events, lab capacity, expiring certificates, test-bench demand, and production or repair priorities.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in throughput, measurement confidence, rework burden, and readiness risk.
3. Identify branch or sequel triggers for emergency calibration, bench cross-leveling, certificate extension, or halt-of-use decisions.
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

Primary products: calibration priority ladder, test-equipment recovery matrix, and out-of-tolerance risk ledger.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-strategic-test-equipment-metrology-calibration-priority-v1` with `protocol_stack_id=ps-strategic-test-equipment-metrology-calibration-priority-stack-v1`.
- Alternate: select a mission-adjacent industrial-readiness, maintenance-quality, or depot-support suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual certificate ledger with command-approved bench rationing and conservative release thresholds.

## Domain Packet Defaults

- Default packet ID: `DPL-METROLOGY-CALIBRATION-PRIORITY-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: calibration lab scheduler, metrology asset ledger, acceptance-test bench utilization board, and out-of-tolerance incident tracker.
- Preferred protocol profiles for coordination and machine exchange: signed calibration certificates, `OPC UA`, `NIEM`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If certificate validity, standard traceability, or bench release authority is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag calibration drift, false-pass risk, counterfeit standards, and release-certification gaps before recommending action.
- Do not fabricate test-equipment status, certificate pedigree, or calibration approvals.
