---
name: theater-emissions-decoy-robotic-control-and-spectrum-safety-cell
description: Synchronize robotic decoys, unmanned emitters, and emission-control windows without causing friendly spectrum fratricide for U.S. warfighters. Use when staffs need to shape electromagnetic deception, protect blue-force sensors, and preserve control of semi-autonomous emitters in contested theaters.
---

# Theater Emissions Decoy Robotic Control And Spectrum Safety Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm mission objective, emission authorities, robotic-decoy inventory, blue-force sensor dependencies, and timing windows before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the spectrum-control problem with current emissions plan, friendly-sensor dependencies, adversary collection risk, and decoy-control resilience.
2. Build one recommended COA and at least two alternatives with tradeoffs in deception payoff, blue-force interference risk, survivability, and human override burden.
3. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
4. Identify decision points for decoy activation, emissions-window changes, kill-switch triggers, and fallback communications.
5. Publish commander-facing recommendations plus a staff tracker with owner, suspense, confidence, and branch triggers.

## Required Output Format

1. Situation snapshot and spectrum posture.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and approval gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: emissions-window matrix, robotic-decoy control ladder, blue-force interference risk board, and kill-switch decision brief.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-emissions-decoy-robotic-control-spectrum-safety-v1` with `protocol_stack_id=ps-theater-emissions-decoy-robotic-control-spectrum-safety-stack-v1`.
- Alternate: independent spectrum-manager review with manual decoy release worksheet and blue-force interference cross-check.
- Degraded: commander-approved voice-control fallback with UTC readbacks, preplanned kill-switch criteria, and reduced emissions windows.

## Domain Packet Defaults

- Default packet ID: `DPL-EMISSIONS-DECOY-ROBOTIC-001`.
- Preferred `toolchain_id=TC-EMDECOY-128` and `toolchain_profile_id=emissions-decoy-robotic-spectrum-safety-v1`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: spectrum-control board, robotic-decoy command console, blue-force sensor conflict checker, and emissions-window planner.
- Preferred protocol profiles for coordination and machine exchange: `CoT`, `VMF`, signed emitter-control manifests, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md` for high-consequence recommendations.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for recommendations that can alter emissions posture, decoy release, or blue-force sensor safety.
- If authority, emitter identity, or kill-switch assurance is uncertain, downgrade to advisory-only and require human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, blue-force conflict checks, and human-override readiness.
- If checks fail, provide a degraded deception branch with explicit fratricide and mission-exposure risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag spectrum fratricide hazards, autonomy-control loss, GPS or timing dependencies, and coalition caveats early.
- Require explicit human release for recommendations that can disrupt friendly C2, fires, or air safety.
- Do not fabricate sources, approvals, or control authorities.
