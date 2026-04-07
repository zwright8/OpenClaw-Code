---
name: theater-software-signing-key-loss-and-emergency-reconstitution-cell
description: Coordinate mission-software signing key loss, revocation, and emergency release reconstitution across a theater. Use when compromised or unavailable keys threaten trusted updates, rollback safety, or battlefield software continuity.
---

# Theater Software Signing Key Loss And Emergency Reconstitution Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter software trust, cryptographic continuity, and emergency release governance.
- Confirm key-custody status, mission impact, disconnected nodes, rollback options, and command authority before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem with affected key material, impacted platforms, trusted build paths, revocation reach, and mission dependencies.
2. Build one recommended COA and at least two alternatives with tradeoffs in software trust, recovery speed, mission disruption, and adversary opportunity.
3. Identify branch triggers for revocation, emergency resigning, allowlist fallback, mission rollback, or disconnected exception handling.
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

Primary products: key-compromise containment matrix, signing reconstitution sequence, and fallback software allowlist.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-software-signing-key-loss-emergency-reconstitution-v1` with `protocol_stack_id=ps-theater-software-signing-key-loss-emergency-reconstitution-stack-v1`.
- Alternate: select a mission-adjacent cyber-defense, mission-software, or zero-trust suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: freeze non-essential releases, use preapproved allowlists only, and require dual-approval for any emergency binary movement.

## Domain Packet Defaults

- Default packet ID: `DPL-SIGNING-KEY-LOSS-RECONSTITUTION-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: HSM or PKI status ledger, revocation propagation tracker, and trusted build release board.
- Preferred protocol profiles for coordination and machine exchange: `X.509`, `OCSP/CRL`, signed artifact manifests, `API/JSON`, `STIX/TAXII`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for revocation, emergency resigning, or release recommendations.
- If key provenance, compromise scope, or rollback safety is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified compromise facts, assessed blast radius, assumptions, and unknowns.
- Do not recommend unsigned or untraceable software distribution as a normal-state solution.
- Flag revocation lag, disconnected-node trust debt, and rollback hazards before recommending action.
- Do not fabricate certificates, release authorities, or compromise indicators.
