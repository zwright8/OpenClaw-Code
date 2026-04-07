---
name: homeland-energy-emergency-fuel-waiver-and-priority-restoration-cell
description: Govern fuel waivers, emergency energy support, and priority restoration during domestic outages. Use when U.S. warfighters need domestic-support recommendations that align generator demand, fuel access, and restoration priorities without breaking authority or public-trust constraints.
---

# Homeland Energy Emergency Fuel Waiver And Priority Restoration Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter energy-emergency, fuel-waiver, and priority-restoration decisions.
- Confirm outage scope, fuel constraints, generator demand, restoration authorities, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using outage impact, priority facilities, fuel stocks, waiver requests, and restoration estimates.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in life safety, restoration speed, fuel burn, and authority risk.
3. Identify branch triggers for fuel depletion, waiver denial, generator failure, and restoration-priority conflicts.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and civil-authority decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: fuel-waiver matrix, priority-restoration ladder, and emergency energy support packet.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-homeland-energy-emergency-fuel-waiver-priority-restoration-v1` with `protocol_stack_id=ps-homeland-energy-emergency-fuel-waiver-priority-restoration-stack-v1`.
- Alternate: select a mission-adjacent operational-energy, grid-restoration, or DSCA sustainment suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: life-safety fuel support only with manual waiver review and command-approved restoration priorities.

## Domain Packet Defaults

- Default packet ID: `DPL-ENERGY-FUEL-WAIVER-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: fuel-waiver tracker, generator-priority board, restoration-status dashboard, and emergency fuel-allocation ledger.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `OPC UA`, signed fuel-waiver notices, `API/JSON`, `CAP`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If waiver legitimacy, fuel availability, or restoration authority is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported fuel promises, waiver gaps, generator overload, and inequitable restoration sequencing before recommending action.
- Do not fabricate waiver approval, restoration commitments, or available fuel stocks.
