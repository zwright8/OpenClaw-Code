---
name: homeland-corrections-facility-evacuation-and-guard-force-relief-cell
description: Coordinate corrections-facility evacuation, custody continuity, and guard-force relief during domestic crises. Use when U.S. warfighters need lawful, auditable support options for threatened local, state, or federal detention infrastructure.
---

# Homeland Corrections Facility Evacuation And Guard Force Relief Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter corrections evacuation, custody continuity, and guard-force relief decisions in domestic operations.
- Confirm facility status, custody categories, receiving capacity, public-safety constraints, and legal authorities before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using facility threats, inmate movement demand, escort capacity, receiving-site readiness, and legal restrictions.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in life safety, custody integrity, public legitimacy, and manpower burden.
3. Identify branch triggers for facility breach risk, transport shortfall, receiving-site refusal, and guard-force exhaustion.
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

Primary products: custody-evacuation ladder, guard-force relief matrix, and receiving-facility transfer packet.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-homeland-corrections-facility-evacuation-guard-force-relief-v1` with `protocol_stack_id=ps-homeland-corrections-facility-evacuation-guard-force-relief-stack-v1`.
- Alternate: select a mission-adjacent law-enforcement, mobility, or public-safety suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: advisory-only custody matrix with command-approved movement holds and no unsupported transfer commitments.

## Domain Packet Defaults

- Default packet ID: `DPL-CORRECTIONS-EVAC-GUARDFORCE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: facility-status tracker, custody movement board, escort roster manager, and receiving-capacity ledger.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed custody manifests, `NIMS/ICS`, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If custody authority, receiving-site acceptance, or force-protection status is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported custody transfers, excessive use-of-force risk, escort shortfalls, and receiving-facility legitimacy gaps before recommending action.
- Do not fabricate custody status, judicial authority, or accepting-facility approval.
