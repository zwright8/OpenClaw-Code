---
name: joint-religious-affairs-and-moral-injury-support-cell
description: Coordinate religious support, protected spiritual care access, and moral injury risk mitigation for U.S. warfighters during combat, recovery, and prolonged operations. Use when commanders need options that preserve readiness without violating confidentiality, religious accommodation, or care-referral safeguards.
---

# Joint Religious Affairs And Moral Injury Support Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm echelon, operational tempo, chaplain coverage, confidential-care boundaries, coalition or host-nation religious constraints, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with unit stress indicators, chaplain coverage, casualty tempo, protected-faith requirements, and referral capacity.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in readiness, confidentiality, moral injury risk, and command burden.
3. Identify branch or sequel triggers, escalation gates, and releasability or privileged-communication constraints.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot: current conditions and key changes since last update.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: religious support posture brief, confidential care-routing matrix, and moral-injury risk watchlist.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-religious-affairs-moral-injury-support-v1` with `protocol_stack_id=ps-joint-religious-affairs-moral-injury-support-stack-v1`.
- Alternate: `tool_suite_id=ts-force-mental-health-postvention-v1` with `protocol_stack_id=ps-force-health-postvention-stack-v1`.
- Degraded: manual chaplain coverage roster with dual-review confidential referral log and UTC acknowledgment checks.

## Domain Packet Defaults

- Default packet ID: `DPL-RELIGIOUS-MORAL-INJURY-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: chaplain coverage scheduler, confidential referral ledger, command climate stress monitor, and protected-faith accommodation tracker.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, signed care-referral manifests, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md` for high-consequence recommendations.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for recommendations that can alter mission posture.
- If authority, legal basis, privileged-communication protection, or data provenance is uncertain, downgrade to advisory-only and require human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Protect privileged or confidential spiritual-care information and never require disclosure beyond mission necessity.
- Flag religious accommodation limits, suicide or self-harm referral thresholds, coalition caveats, and command-climate concerns before recommending action.
- Do not fabricate authorities, approvals, or source evidence.

## Domain Toolchain Override (2026-04-06, Expansion Wave LXXI Addendum)

- Add `toolchain_id=TC-DIETARY-270`, `tool_suite_id=ts-joint-religious-dietary-mass-feeding-v1`, and `protocol_stack_id=ps-joint-religious-dietary-mass-feeding-stack-v1` when spiritual-support credibility depends on faith-based dietary accommodation, fasting-window planning, or protected meal alternatives.
- Add `toolchain_id=TC-FAMILYCARE-273`, `tool_suite_id=ts-joint-family-care-guardianship-dependent-support-v1`, and `protocol_stack_id=ps-joint-family-care-guardianship-dependent-support-stack-v1` when recommendations depend on family-care-plan strain, guardian breakdown, or dependent support burdens that intensify moral injury risk.
- Add `packet_id=DPL-RELIGIOUS-DIETARY-MASS-FEEDING-001` and `packet_id=DPL-FAMILY-CARE-GUARDIANSHIP-001` for branches that materially alter accommodation confidence, family-support routing, or command support measures.
