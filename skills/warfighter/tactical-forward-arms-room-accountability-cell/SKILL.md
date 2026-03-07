---
name: tactical-forward-arms-room-accountability-cell
description: Provide U.S. warfighter decision support in this mission domain with integrated external-tool protocols, cross-domain coordination, and authority-aware recommendations. Use when mission teams need rapid options, risk tradeoffs, and interoperable staff products under contested conditions.
---

# Tactical Forward Arms Room Accountability Cell

## Mission Scope

- Treat this skill as planning and decision-support support for U.S. warfighter operations in this domain.
- Confirm command echelon, battlespace constraints, authorities, timeline, and required decision windows before analysis.
- Keep outputs unclassified by default unless handling caveats are explicitly provided.

## Workflow

1. Frame the mission problem, desired end state, and decision timeline.
2. Identify assumptions, key uncertainties, and what evidence would invalidate the current plan.
3. Build one recommended COA and at least two alternatives with clear risk and sustainment tradeoffs.
4. Map cross-domain dependencies (C2, ISR, fires/effects, protection, sustainment, information, legal/policy, coalition).
5. Produce staff-ready outputs with owners, suspense dates, branch triggers, and protocol-ready exchange fields.

## Required Output Format

Deliver outputs in this order:

1. Situation snapshot and material changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points (now/next/pre-delegate).
5. Staff tasking with owner and suspense.

## Domain Products

Primary products for this skill: domain risk board, mission-option decision matrix, cross-domain dependency tracker

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and document selected primary/alternate/degraded toolchain profiles.
- Use at least one authoritative system-of-record and one cross-check data source for high-consequence recommendations.
- Specify outbound reporting format and transport path (for example `USMTF`, `VMF`, `Link 16 J-series`, `CoT`, `STIX/TAXII`, `OGC`).
- Include provenance metadata: source system, refresh time (UTC), assumptions, confidence, and known gaps.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` before final release.
- If required interoperability checks fail, provide a degraded-mode plan with delay and confidence impacts.

## Tool Invocation Contract

- For each external tool recommendation, include objective, required inputs, query/action template, expected schema, protocol/transport, and fallback.
- Map each tool output to a specific commander or staff decision point.

## Guardrails

- Separate facts, assessments, and unknowns.
- Flag legal/policy/ROE/coalition constraints early.
- Do not fabricate sources, authorities, or approvals.
- Keep recommendations advisory-only until an authorized commander approves execution.

## Mission Authority Requirements

- Apply authority controls from `../_shared/references/warfighter-tool-authority-gates.md` where recommendations can alter mission posture.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for high-impact options.
- If authority or data provenance is uncertain, downgrade to advisory-only and issue explicit commander decision prompts.

## Cross-Domain Effects Ledger

- Build and maintain a second-order effects ledger using `../_shared/references/cross-domain-effects-ledger.md`.
- For each recommended COA, map likely downstream effects across at least two additional domains and assign an owning staff cell.
- Include effect triggers, report format, fallback communications path, and mitigation actions in the staff tasking output.
