---
name: space-based-missile-warning-ground-truth-correlation-cell
description: Correlate space-based missile warning with ground truth and cross-domain confirmation. Use when commanders need higher confidence before alerting, dispersing, or changing force posture under ambiguous warning conditions.
---

# Space Based Missile Warning Ground Truth Correlation Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter missile-warning corroboration, false-track adjudication, and alert-release decisions.
- Confirm warning source mix, ground-sensor availability, alerting authorities, force posture implications, and time tolerances before recommending action.
- Keep outputs unclassified by default unless sensor vulnerabilities, alert thresholds, or strategic posture changes require protected handling.

## Workflow

1. Frame the mission problem using space-based detections, radar or ground truth, timing integrity, and expected posture consequences.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in warning speed, false-alarm exposure, survivability, and escalation risk.
3. Identify branch triggers for sensor disagreement, timing drift, track duplication, and alert dissemination failure.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and watchfloor decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: warning correlation ladder, false-track adjudication board, and alert-release recommendation matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-space-based-missile-warning-ground-truth-correlation-v1` with `protocol_stack_id=ps-space-based-missile-warning-ground-truth-correlation-stack-v1`.
- Alternate: select a mission-adjacent SDA, IAMD, or strategic warning suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: advisory-only alert assessment with dual-watchfloor review and no posture change until corroboration is restored.

## Domain Packet Defaults

- Default packet ID: `DPL-MISSILE-WARNING-GT-CORR-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: missile-warning fusion board, ground-sensor correlation cell, infrared event timeline, and alert adjudication ledger.
- Preferred protocol profiles for coordination and machine exchange: `CCSDS`, `USMTF`, `Link 16 J-series`, `API/JSON`, and `OGC`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If source correlation, alerting authority, or false-track adjudication is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag single-sensor reliance, stale ephemerides, timing drift, and deception indicators before recommending action.
- Do not fabricate warning confidence, launch confirmation, or alert dissemination success.
