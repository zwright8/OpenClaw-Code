---
name: joint-ice-obscuration-runway-visual-cue-certification-cell
description: Coordinate runway visual-cue certification under ice, snow, fog, or obscuration. Use when crews need safe landing or launch criteria despite degraded markings, lighting, or sensor references in cold or contaminated conditions.
---

# Joint Ice Obscuration Runway Visual Cue Certification Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter runway visual-cue certification, cold-weather recovery, and sortie release decisions.
- Confirm runway condition, lighting status, braking reports, crew qualifications, and sensor-reference availability before recommending action.
- Keep outputs unclassified by default unless airfield vulnerabilities, tactical dispersal posture, or sortie timing require protected handling.

## Workflow

1. Frame the mission problem using obscuration drivers, runway friction, approach minima, lighting status, and sortie demand.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in sortie generation, landing safety, visual confidence, and recovery delay.
3. Identify branch triggers for black-ice discovery, cue-light failure, visibility collapse, and certification timeout.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and airfield-lead decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: runway visual-cue certification board, launch and recovery window matrix, and lighting recovery checklist.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-ice-obscuration-runway-visual-cue-certification-v1` with `protocol_stack_id=ps-joint-ice-obscuration-runway-visual-cue-certification-stack-v1`.
- Alternate: select a mission-adjacent airfield-recovery, weather, or flight-safety suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: no-fail-essential sorties only with manual cue inspection, increased spacing, and commander-approved weather minima.

## Domain Packet Defaults

- Default packet ID: `DPL-ICE-OBSCURATION-RWY-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: runway friction board, visual-cue certification checklist, airfield weather sensor network, and lighting status board.
- Preferred protocol profiles for coordination and machine exchange: `AIXM/FIXM`, `OGC`, signed airfield manifests, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If runway condition, crew visual reference confidence, or airfield release authority is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag black ice, lighting misalignment, contrast loss, and degraded crew proficiency before recommending action.
- Do not fabricate braking action, certification status, or landing safety claims.
