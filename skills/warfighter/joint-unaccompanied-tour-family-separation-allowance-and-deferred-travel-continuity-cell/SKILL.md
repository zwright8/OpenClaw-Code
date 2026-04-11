---
name: joint-unaccompanied-tour-family-separation-allowance-and-deferred-travel-continuity-cell
description: Preserve unaccompanied-tour, family-separation-allowance, and deferred-dependent-travel continuity when hardship tours, remote assignments, or movement delays destabilize U.S. warfighter households and readiness.
---

# Joint Unaccompanied Tour Family Separation Allowance And Deferred Travel Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter unaccompanied-tour and separated-family continuity decisions.
- Confirm tour type, orders posture, family-separation-allowance eligibility, deferred-travel status, sponsor communication requirements, and emergency family constraints before recommending action.
- Keep outputs unclassified by default and minimize personally identifiable information unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using orders status, family location, dependent-travel restrictions, allowance posture, and readiness or retention impact.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in family stability, lawful entitlements, travel speed, and administrative burden.
3. Identify branch triggers for order amendments, FSA denial, deferred-travel delay, passport or visa friction, and emergency reunification pressure.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and separated-family risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: family-separation-allowance decision board, deferred-travel action ladder, and sponsor-contact continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-UATOUR-362`, `tool_suite_id=ts-joint-unaccompanied-tour-family-separation-allowance-deferred-travel-continuity-v1`, and `protocol_stack_id=ps-joint-unaccompanied-tour-family-separation-allowance-deferred-travel-continuity-stack-v1`.
- Alternate: select a mission-adjacent command-sponsorship, family-readiness, or passport-support suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual separated-family roster with advisory-only sequencing until orders status, entitlement evidence, and travel-document posture are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-UNACCOMP-FSA-DEFER-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: unaccompanied-tour orders board, family-separation-allowance tracker, deferred-dependent-travel queue, and sponsor-contact ledger.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `ICAO Doc 9303`, signed orders notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If orders legitimacy, entitlement evidence, or travel-document authority is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and travel-eligibility clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported allowance promises, speculative travel dates, sponsor-communication gaps, and family reunification risk before recommending action.
- Do not fabricate orders status, FSA eligibility, travel approval, or passport or visa outcomes.
