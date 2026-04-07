---
name: joint-orbital-custody-loss-and-commercial-ssa-retask-cell
description: Restore orbital object custody by retasking commercial and military space-domain-awareness assets for U.S. warfighters. Use when commanders or space staffs lose track custody, see conjunction ambiguity, or must re-establish trusted orbital awareness before maneuver, warning, or defensive action.
---

# Joint Orbital Custody Loss And Commercial SSA Retask Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm affected object set, custody-loss trigger, conjunction timeline, available sensors, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the custody-loss problem with last trusted track, sensor divergence, adversary interference indicators, and downstream mission impact.
2. Build one recommended COA and at least two alternatives with tradeoffs in time to regained custody, collection cost, maneuver disruption, and escalation risk.
3. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
4. Identify decision points for commercial sensor retask, defensive maneuver hold or release, and warning dissemination.
5. Publish commander-facing recommendations plus a staff tracker with owner, suspense, confidence, and branch triggers.

## Required Output Format

1. Situation snapshot and custody confidence.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and approval gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: custody recovery timeline, commercial SSA retask matrix, conjunction confidence ladder, and maneuver-release decision brief.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-orbital-custody-loss-commercial-ssa-retask-v1` with `protocol_stack_id=ps-joint-orbital-custody-loss-commercial-ssa-retask-stack-v1`.
- Alternate: independent military SDA reconciliation board with manual sensor-retask and keep-out buffer worksheet.
- Degraded: commander-approved manual custody board with conservative maneuver holds and UTC acknowledgment logging.

## Domain Packet Defaults

- Default packet ID: `DPL-ORBITAL-CUSTODY-LOSS-SSA-RETASK-001`.
- Preferred `toolchain_id=TC-ORBITAL-129` and `toolchain_profile_id=orbital-custody-loss-commercial-ssa-retask-v1`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: commercial SSA broker feeds, military SDA catalog, observation retask planner, and custody anomaly board.
- Preferred protocol profiles for coordination and machine exchange: `CCSDS`, signed ephemeris manifests, `API/JSON`, `USMTF`, and `STIX/TAXII`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md` for high-consequence recommendations.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for recommendations that can alter defensive maneuver posture, public warning, or cross-domain mission timing.
- If authority, custody evidence, or acknowledgment integrity is uncertain, downgrade to advisory-only and require human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, sensor-divergence assumptions, and maneuver-release dependencies.
- If checks fail, provide a degraded custody branch with explicit collision and awareness risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag conjunction uncertainty, commercial licensing limits, adversary spoofing risk, and coalition caveats early.
- Require explicit human release for recommendations that could change maneuver posture or cross-domain warning decisions.
- Do not fabricate sources, approvals, or orbital custody confidence.
