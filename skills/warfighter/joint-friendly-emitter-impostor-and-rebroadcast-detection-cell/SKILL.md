---
name: joint-friendly-emitter-impostor-and-rebroadcast-detection-cell
description: Detect spoofed, replayed, or impostor friendly emitters that could mislead blue-force decisions. Use when operators must distinguish authentic friendly transmissions from deception, rebroadcast, or sensor-confuser activity.
---

# Joint Friendly Emitter Impostor And Rebroadcast Detection Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter electromagnetic, air-defense, and sensor-fusion decisions.
- Confirm release authorities, friendly emitter baselines, RF collection posture, and fratricide constraints before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem with suspicious emitters, friendly waveform inventory, geolocation evidence, and mission effects at risk.
2. Build one recommended COA and at least two alternatives with tradeoffs in detection confidence, fratricide risk, sensor coverage, and mission tempo.
3. Identify branch triggers for emission hold, alternate IFF challenge, sensor retask, route change, or manual confirmation.
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

Primary products: emitter confidence ladder, spoof-or-rebroadcast map, and release-hold recommendation matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-friendly-emitter-impostor-rebroadcast-detection-v1` with `protocol_stack_id=ps-joint-friendly-emitter-impostor-rebroadcast-detection-stack-v1`.
- Alternate: select a mission-adjacent spectrum, air-defense, or intelligence suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: authenticated challenge-and-response only with manual blue-force confirmation and narrowed engagement authorities.

## Domain Packet Defaults

- Default packet ID: `DPL-EMITTER-IMPOSTOR-REBROADCAST-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: emitter fingerprint fusion service, RF geolocation board, and blue-force emission library.
- Preferred protocol profiles for coordination and machine exchange: `Link 16 J-series`, `VMF`, `CoT`, `API/JSON`, SIGINT metadata manifests, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing air-defense, EW, or route-control actions.
- If emitter identity confidence, acknowledgment integrity, or fratricide controls are uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified signatures, assessed spoof probability, assumptions, and unknowns.
- Do not recommend kinetic or EW action solely on a single ambiguous RF indicator.
- Flag blue-force fratricide risk, timing skew, and miscorrelation before recommending action.
- Do not fabricate emitter fingerprints, collection coverage, or authorities.
