---
name: strategic-carbon-carbon-nozzle-and-reentry-material-priority-cell
description: Prioritize scarce carbon-carbon, ablatives, and high-temperature reentry materials across strategic demand. Use when deterrence, missile, or space readiness is constrained by nozzle or thermal-protection material bottlenecks.
---

# Strategic Carbon Carbon Nozzle And Reentry Material Priority Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm release authority, industrial safety constraints, certification thresholds, and strategic demand deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with pedigree status, furnace or autoclave capacity, demand priority, and certification state.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in strategic readiness, production risk, safety margin, and allocation equity.
3. Identify branch or sequel triggers, lot hold points, and release-approval gates.
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

Primary products: material allocation board, nozzle throughput ledger, and strategic readiness risk ladder.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-strategic-carbon-carbon-nozzle-reentry-material-priority-v1` with `protocol_stack_id=ps-strategic-carbon-carbon-nozzle-reentry-material-priority-stack-v1`.
- Alternate: select a mission-adjacent strategic industrial, missile-production, or materials-governance suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: mission-essential lots only with conservative release thresholds.

## Domain Packet Defaults

- Default packet ID: `DPL-CARBON-CARBON-NOZZLE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: refractory-material pedigree ledger, nozzle layup and autoclave scheduler, and reentry demand board.
- Preferred protocol profiles for coordination and machine exchange: signed material-cert manifests, `API/JSON`, `USMTF`, and `OPC UA`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, legal basis, pedigree verification, thermal certification, or release approval is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag industrial safety, counterfeit risk, strategic readiness, and cross-program allocation risks before recommending action.
- Do not fabricate classified sources, authorities, or approvals.
