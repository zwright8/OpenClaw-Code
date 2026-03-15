---
name: strategic-semiconductor-test-burn-in-and-mission-priority-cell
description: Coordinate burn-in, screening, and release of scarce semiconductors for strategic missions. Use when chamber capacity, pedigree control, or screening backlog becomes the pacing constraint for weapons, space, or command systems.
---

# Strategic Semiconductor Test Burn In And Mission Priority Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm release authority, pedigree requirements, screening standards, and mission deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with lot pedigree, chamber capacity, screening results, and mission demand.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in readiness, counterfeit risk, screening confidence, and allocation fairness.
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

Primary products: semiconductor release ladder, burn-in capacity board, and mission-priority lot queue.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-strategic-semiconductor-test-burn-in-mission-priority-v1` with `protocol_stack_id=ps-strategic-semiconductor-test-burn-in-mission-priority-stack-v1`.
- Alternate: select a mission-adjacent strategic industrial, component-security, or supply-shock suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: mission-essential lots only with manual pedigree confirmation and narrowed environmental screening.

## Domain Packet Defaults

- Default packet ID: `DPL-SEMICONDUCTOR-BURNIN-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: burn-in chamber scheduler, radiation and thermal screening queue, and component pedigree ledger.
- Preferred protocol profiles for coordination and machine exchange: signed lot manifests, `API/JSON`, `USMTF`, and `OPC UA`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, legal basis, pedigree verification, screening completion, or release approval is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag counterfeit, chamber-scheduling, pedigree, and strategic-allocation risks before recommending action.
- Do not fabricate classified sources, authorities, or approvals.
