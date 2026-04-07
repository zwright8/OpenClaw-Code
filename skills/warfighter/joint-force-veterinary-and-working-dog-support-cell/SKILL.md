---
name: joint-force-veterinary-and-working-dog-support-cell
description: Coordinate veterinary care, kennel biosecurity, and military working dog readiness for U.S. warfighters across joint operations. Use when commanders need deployment-ready options that protect handler teams, animal health, and mission continuity.
---

# Joint Force Veterinary and Working Dog Support Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm echelon, deployment timeline, veterinary capacity, kennel or quarantine constraints, zoonotic-risk posture, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with working-dog mission load, veterinary treatment demand, kennel capacity, handler readiness, and biosurveillance indicators.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in readiness, survivability, biosecurity, and evacuation burden.
3. Identify branch or sequel triggers, quarantine thresholds, and authority or release gates.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot: current conditions and key changes since last update.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: working-dog readiness dashboard, veterinary sustainment and treatment plan, and kennel biosecurity risk matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-force-veterinary-working-dog-support-v1` with `protocol_stack_id=ps-joint-force-veterinary-working-dog-support-stack-v1`.
- Alternate: select a mission-adjacent medical or biosurveillance suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: paper treatment ledger with dual-review vaccination or quarantine checks and UTC movement acknowledgments.

## Domain Packet Defaults

- Default packet ID: `DPL-VET-WORKING-DOG-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: veterinary medical record system, kennel readiness tracker, animal movement and vaccination ledger, and zoonotic-risk surveillance board.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, signed veterinary transfer manifests, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md` for high-consequence recommendations.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for recommendations that can alter mission posture.
- If authority, legal basis, veterinary release authority, or data provenance is uncertain, downgrade to advisory-only and require human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag zoonotic-risk exposure, animal-welfare constraints, handler safety, quarantine requirements, and host-nation restrictions before recommending action.
- Do not fabricate authorities, approvals, or source evidence.

## Domain Toolchain Override (2026-04-06, Expansion Wave LXIX Addendum)

- Add `tool_suite_id=ts-joint-mwd-handler-loss-cross-attachment-continuity-v1` + `protocol_stack_id=ps-joint-mwd-handler-loss-cross-attachment-continuity-stack-v1` when working-dog readiness depends on rapid handler reassignment, cross-attachment qualification, or kennel-custody integrity after losses or displacement.
- Add `packet_id=DPL-MWD-HANDLER-CROSS-ATTACHMENT-001` for recommendations that materially change MWD mission availability, custody release, or handler-assignment posture.
