---
name: strategic-turbine-blade-superalloy-and-thermal-barrier-coating-priority-cell
description: Prioritize turbine blade superalloy, single-crystal casting, and thermal-barrier coating capacity across aviation and power systems. Use when hot-section materials constrain combat readiness.
---

# Strategic Turbine Blade Superalloy And Thermal Barrier Coating Priority Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm affected engines and power systems, foundry constraints, repair demand, and allocation authority before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the hot-section bottleneck, affected fleets, repair queues, and commander readiness priorities.
2. Build allocate, defer, substitute, cannibalize, and surge-invest branches with explicit readiness and safety tradeoffs.
3. Bind each recommendation to metallurgy, foundry, and depot-readiness tools plus protocolized outputs.
4. Publish degraded-mode branches when pedigree, yield, or coating-certification confidence falls below threshold.

## Required Output Format

1. Situation snapshot.
2. Recommended material-allocation branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.
6. Turbine-material packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: hot-section allocation board, superalloy pedigree ledger, and coating-capacity risk ladder.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-strategic-turbine-superalloy-tbc-priority-v1` with `protocol_stack_id=ps-strategic-turbine-superalloy-tbc-priority-stack-v1`.
- Alternate: depot engine board plus industrial-metallurgy witness cell.
- Degraded: mission-essential engine lots only with conservative release thresholds.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-TURBINE-SUPERALLOY-TBC-001` for critical recommendations.
- Prioritize these protocol families for this domain: signed material-cert manifests, `API/JSON`, `USMTF`, and `OPC UA`.
- Include source system, refresh UTC, confidence, yield data, and unresolved certification gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run readiness and assurance checks from `../_shared/references/readiness-certification-evidence-pack.md` and `../_shared/references/mission-assurance-checklist.md`.
- If pedigree, coating certification, or release authority is uncertain, downgrade to advisory-only and require human command review.

## Guardrails

- Do not fabricate metallurgical pedigree, repair capacity, or safe-life certification.
- Separate confirmed lot defects from projected industrial risk.
- Flag nuclear-support, carrier-air-wing, and missile-defense propulsion dependencies early.
