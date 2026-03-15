---
name: expeditionary-aircraft-crash-fire-rescue-and-foam-transition-cell
description: Coordinate expeditionary aircraft crash-fire rescue, foam inventory transition, and runway emergency response. Use when damaged aircraft, hot brakes, munitions, or fuel fires threaten sortie recovery and airbase survival.
---

# Expeditionary Aircraft Crash Fire Rescue And Foam Transition Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter airbase emergency response, crash rescue, and sortie-regeneration decisions.
- Confirm airfield authority, ARFF posture, aircraft type, fuel or munitions exposure, foam inventory, and mutual-aid options before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem using aircraft status, fire behavior, crew rescue needs, foam stocks, runway availability, and sortie timelines.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in crew survival, fire containment, environmental impact, and runway regeneration speed.
3. Identify branch triggers for evacuation, foam-agent substitution, explosive-safety cordons, and alternate-field diversion.
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

Primary products: ARFF dispatch matrix, foam transition ledger, and runway emergency recovery board.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-expeditionary-aircraft-crash-fire-rescue-foam-transition-v1` with `protocol_stack_id=ps-expeditionary-aircraft-crash-fire-rescue-foam-transition-stack-v1`.
- Alternate: select a mission-adjacent airfield-recovery, base-defense, or hazardous-material suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: crew-rescue and exposure-control only with single-runway emergency hold and manual foam accounting.

## Domain Packet Defaults

- Default packet ID: `DPL-AIRCRAFT-CRASH-FIRE-RESCUE-FOAM-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: ARFF dispatch board, foam compatibility ledger, and runway damage or hazard tracker.
- Preferred protocol profiles for coordination and machine exchange: `NIMS/ICS`, `AIXM/FIXM`, `OGC`, `API/JSON`, `USMTF`, and signed maintenance manifests.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If aircraft rescue status, explosive-hazard distance, or foam compatibility assumptions are uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag trapped-crew risk, munitions cookoff, runway closure duration, and foam-environment tradeoffs before recommending action.
- Do not fabricate emergency response status, rescue completion, or approvals.
