---
name: homeland-tribal-sovereignty-and-defense-support-coordination-cell
description: Coordinate domestic military support with tribal nations while respecting sovereignty, consent, and jurisdictional boundaries. Use when commanders need options that balance life safety, legitimacy, and lawful support to tribal communities and lands.
---

# Homeland Tribal Sovereignty And Defense Support Coordination Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter support to tribal nations, sovereign coordination, and domestic civil-authority decisions.
- Confirm affected tribal nations, jurisdictional boundaries, consent channels, sacred or protected sites, and requested support effects before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using requested support, jurisdiction map, sovereignty constraints, protected-site concerns, and life-safety timelines.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in legitimacy, responsiveness, legal sufficiency, and community trust.
3. Identify branch triggers for consent receipt, mutual-aid crossover, protected-area access, and public-warning divergence.
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

Primary products: sovereignty coordination matrix, consent and liaison tracker, and protected-site support ladder.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-homeland-tribal-sovereignty-defense-support-coordination-v1` with `protocol_stack_id=ps-homeland-tribal-sovereignty-defense-support-coordination-stack-v1`.
- Alternate: select a mission-adjacent DSCA, civil-affairs, or public-warning suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: liaison-only support board with no site-entry or posture-change recommendation until consent and authority are confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-TRIBAL-DSCA-SOVEREIGNTY-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: liaison tracker, jurisdiction map service, protected-site registry, and community-warning coordination board.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `NIMS/ICS`, signed coordination notices, `API/JSON`, `CAP`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If consent status, sovereign boundary interpretation, or protected-site access authority is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag sovereignty violations, sacred-site risk, unsupported consent assumptions, and public-trust damage before recommending action.
- Do not fabricate tribal consent, jurisdictional approval, or liaison agreement.
