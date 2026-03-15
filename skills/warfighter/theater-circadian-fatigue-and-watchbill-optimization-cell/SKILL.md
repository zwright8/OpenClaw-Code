---
name: theater-circadian-fatigue-and-watchbill-optimization-cell
description: Optimize fatigue risk, shift rotations, and watchbill resilience. Use when sustained operations, night fighting, or degraded staffing threaten judgment, safety, and decision tempo.
---

# Theater Circadian Fatigue And Watchbill Optimization Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter fatigue-risk, watchbill, and sustained-operations decisions.
- Confirm mission tempo, staffing limits, sleep opportunity, stimulant-policy constraints, and command thresholds before recommending action.
- Keep outputs unclassified by default and avoid personally sensitive health details unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem using current watch rotations, duty-cycle debt, mission-critical billets, and predicted sleep disruption.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in vigilance, staffing resilience, fairness, and operational tempo.
3. Identify branch triggers for mandatory rest, crew augmentation, stimulant-governance changes, and risk-acceptance elevation.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: fatigue risk board, watchbill redesign matrix, and fatigue-countermeasure approval ladder.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-circadian-fatigue-watchbill-v1` with `protocol_stack_id=ps-theater-circadian-fatigue-watchbill-stack-v1`.
- Alternate: select a mission-adjacent human-performance, force-health, or readiness suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual watchbill board with conservative crew-rest windows and command-approved risk acceptance.

## Domain Packet Defaults

- Default packet ID: `DPL-CIRCADIAN-WATCHBILL-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: fatigue analytics board, watchbill scheduler, wearable or observer sleep-debt tracker, and incident-risk monitor.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, signed sensor manifests, `API/JSON`, `USMTF`, and `NIEM` when cross-organizational duty rosters must synchronize.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If sleep data, crew availability, or fatigue-countermeasure policy is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag stimulant misuse risk, crew-rest inequities, watchbill fragility, and safety incidents before recommending action.
- Do not fabricate biometrics, medical authorizations, or commander risk acceptance.
