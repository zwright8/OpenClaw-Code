---
name: joint-signals-intelligence-and-emitter-geolocation-fusion-cell
description: Support U.S. warfighter planning and decision support for signals intelligence fusion, emitter geolocation confidence management, and cross-cueing across cyber, EMSO, fires, and maneuver. Use when missions require advisory products that depend on emitter confidence, uncertainty bands, collection tradeoffs, and protocol-aware outputs.
---

# Joint Signals Intelligence And Emitter Geolocation Fusion Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter SIGINT cueing, emitter geolocation, and cross-domain situational awareness.
- Confirm collection authorities, minimization constraints, supported echelon, time horizon, and release gates before producing recommendations.
- Keep outputs unclassified by default and avoid unnecessary source or method detail unless the user provides explicit handling guidance.

## Workflow

1. Frame the collection problem using area of interest, emitter set, supported decision, confidence requirements, and time bounds.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in latency, confidence, exposure risk, and downstream mission utility.
3. Identify branch triggers for emitter drift, conflicting geolocation, collection loss, adversary deception, and stale cross-cue data.
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

Primary products: emitter-confidence ledger, geolocation uncertainty map, and cross-cue branch matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-signals-intelligence-emitter-geolocation-fusion-v1` with `protocol_stack_id=ps-joint-signals-intelligence-emitter-geolocation-fusion-stack-v1`.
- Alternate: select a mission-adjacent EMSO, collection-management, or C2 suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: confidence-banded emitter watchlist only with no release beyond advisory use and explicit uncertainty disclosure.

## Domain Packet Defaults

- Default packet ID: `DPL-SIGINT-EMITTER-GEOLOCATION-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: SIGINT report queue, emitter geolocation board, and EW order-of-battle overlay.
- Preferred protocol profiles for coordination and machine exchange: signed emitter manifests, `CoT`, `Link 16 J-series`, `USMTF`, `STIX/TAXII`, and `API/JSON`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If collection authority, minimization posture, or cross-cue confidence is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Protect sensitive sources, methods, and minimization boundaries.
- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag geolocation uncertainty, adversary deception risk, and blue-force fratricide hazards before recommending action.
- Do not fabricate collection access, authorities, or approvals.
- Do not generate lethal targeting packets, weapon-employment instructions, or strike-release direction.
