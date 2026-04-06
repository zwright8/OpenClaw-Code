---
name: joint-nuclear-command-warning-delegation-safeguards-cell
description: Coordinate nuclear-warning credibility, delegated-response safeguards, and acknowledgment integrity. Use when strategic forces need decision support for warning authentication, degraded command continuity, or release-safeguard checks.
---

# Joint Nuclear Command Warning Delegation Safeguards Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter strategic warning, delegated-response safeguard, and acknowledgment-chain integrity decisions.
- Confirm warning source mix, command relationships, delegated authorities, acknowledgment pathways, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless warning-source, authentication, or continuity details require protected handling.

## Workflow

1. Frame the mission problem using warning data, force posture, continuity assumptions, and available authentication paths.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in warning fidelity, response speed, survivability, and escalation risk.
3. Identify branch triggers for corroboration failure, acknowledgment loss, delegated-authority challenge, and communications degradation.
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

Primary products: warning credibility ladder, delegation safeguard matrix, and acknowledgment exception board.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-nuclear-command-warning-delegation-safeguards-v1` with `protocol_stack_id=ps-joint-nuclear-command-warning-delegation-safeguards-stack-v1`.
- Alternate: select a mission-adjacent NC3, strategic-warning, or continuity suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: advisory-only warning review with dual-source corroboration, voice acknowledgment, and manual UTC logging.

## Domain Packet Defaults

- Default packet ID: `DPL-NUCLEAR-WARN-DELEGATION-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: strategic warning board, message-integrity validator, delegated authority ledger, and acknowledgment-chain monitor.
- Preferred protocol profiles for coordination and machine exchange: `USMTF`, signed warning manifests, `X.509`, `API/JSON`, and `STIX/TAXII`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If warning provenance, delegated authority, or acknowledgment integrity is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag single-source warning, timing drift, delegation ambiguity, and spoofing indicators before recommending action.
- Do not fabricate warning authenticity, release authority, or acknowledgment success.
