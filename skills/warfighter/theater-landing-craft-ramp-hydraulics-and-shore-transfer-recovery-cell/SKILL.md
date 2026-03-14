---
name: theater-landing-craft-ramp-hydraulics-and-shore-transfer-recovery-cell
description: Coordinate landing-craft ramp hydraulics, causeway transfer recovery, and shore-movement continuity for theater logistics. Use when littoral force flow is constrained by damaged craft ramps, hydraulic failures, or transfer-point bottlenecks.
---

# Theater Landing Craft Ramp Hydraulics And Shore Transfer Recovery Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm maritime authority, beach or port control boundaries, maintenance release criteria, and throughput deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with craft status, ramp hydraulics health, transfer-point congestion, and shore-route availability.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in throughput, repair risk, beach exposure, and offload tempo.
3. Identify branch or sequel triggers, ramp hold points, and approval gates.
4. Bind each critical recommendation to concrete external tools, protocols, and staff handoffs.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: ramp recovery matrix, shore-transfer ladder, and littoral throughput risk board.

## External Tool Stack and Protocols

- Primary toolsets: landing-craft readiness board, hydraulic maintenance tracker, and shore-transfer sequencing board.
- Alternate toolsets: manual beachmaster worksheet, causeway load board, and craft-repair prioritization log.
- Degraded mode: mission-essential offload only with reduced vehicle classes and timed beach-release windows.
- Preferred protocol profiles: `AIS/NMEA`, `VMF`, `OGC`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/external-tools-protocols.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md` as the baseline for building a provisional packet for this domain.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, legal basis, ramp-release confidence, or beachmaster coordination is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag crush injury, hydraulic-failure, beach-exposure, and throughput-cascade risks before recommending action.
- Do not fabricate classified sources, authorities, or approvals.
