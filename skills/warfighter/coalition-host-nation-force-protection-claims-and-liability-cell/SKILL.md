---
name: coalition-host-nation-force-protection-claims-and-liability-cell
description: Coordinate host-nation force-protection incidents, damage claims, and liability decisions across coalition relationships. Use when training accidents, base-defense actions, or movement restrictions create legal, financial, and legitimacy consequences with partners.
---

# Coalition Host Nation Force Protection Claims And Liability Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter force-protection, host-nation relations, and coalition legal coordination.
- Confirm SOFA or access arrangements, force-protection posture, incident facts, claims channels, and command authorities before recommending action.
- Keep outputs unclassified by default and protect personally identifiable or legal-sensitive data unless explicit handling guidance is provided.

## Workflow

1. Frame the problem with incident summary, affected parties, property damage, host-nation concerns, and liability timelines.
2. Build one recommended COA and at least two alternatives with tradeoffs in force protection, legal exposure, partner trust, and operational freedom.
3. Identify branch triggers for claim admission, ex gratia action, access restriction, additional force-protection controls, or formal dispute routing.
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

Primary products: liability decision matrix, claims routing board, and force-protection exception log.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-coalition-host-nation-force-protection-claims-liability-v1` with `protocol_stack_id=ps-coalition-host-nation-force-protection-claims-liability-stack-v1`.
- Alternate: select a mission-adjacent coalition, civil-support, or legal-governance suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: advisory-only claims framing with manual incident ledger, protected legal review, and no concession language without command approval.

## Domain Packet Defaults

- Default packet ID: `DPL-HOST-NATION-FP-CLAIMS-LIABILITY-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: force-protection incident ledger, host-nation claims tracker, and status-of-forces legal board.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, NATO APP-11/ADatP-3 aligned exchange, signed claims manifests, `API/JSON`, `USMTF`, and `S/MIME`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for claims posture, access restriction, or liability recommendations.
- If incident verification, governing legal instrument, or partner acknowledgment is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified incident facts, assessed liability, assumptions, and unknowns.
- Do not admit liability, promise payment, or recommend punitive measures without explicit authority.
- Flag partner-trust consequences, access denial risk, and force-protection gaps before recommending action.
- Do not fabricate claims records, treaty language, or approvals.
