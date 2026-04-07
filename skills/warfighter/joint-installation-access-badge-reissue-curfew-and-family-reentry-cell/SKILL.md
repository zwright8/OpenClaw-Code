---
name: joint-installation-access-badge-reissue-curfew-and-family-reentry-cell
description: Restore installation access, badge reissue, curfew exceptions, and family reentry control after attack, evacuation, or security lockdown. Use when U.S. warfighters need trusted reentry sequencing that balances force protection, family stability, and public legitimacy.
---

# Joint Installation Access Badge Reissue Curfew And Family Reentry Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter installation-access, curfew-control, and family-reentry decisions.
- Confirm incident zone, access-control posture, badge or credential status, family reentry pressure, curfew rules, and decision timelines before recommending action.
- Keep outputs unclassified by default and minimize personally identifiable information unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using base access restrictions, credential loss, reentry demand, security conditions, and family or worker priority tiers.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in security, speed, accountability, and community trust.
3. Identify branch triggers for phased reentry, badge surge issuance, curfew exception, shelter hold, and law-enforcement handoff.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and reentry-control trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: access reissue board, family reentry ladder, and curfew exception matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-installation-access-badge-curfew-reentry-v1` with `protocol_stack_id=ps-joint-installation-access-badge-curfew-reentry-stack-v1`.
- Alternate: select a mission-adjacent force-protection, housing, or civil-support suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual access-control roster with commander-approved reentry windows and no unsupported credential restoration claims.

## Domain Packet Defaults

- Default packet ID: `DPL-ACCESS-BADGE-CURFEW-REENTRY-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: badge issuance tracker, gate status board, curfew exception ledger, and family reentry queue.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed credential notices, `API/JSON`, `S/MIME`, `CAP`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If access authority, identity verification, or curfew exception legitimacy is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and acknowledgment integrity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag identity-proof gaps, unsafe reentry timing, curfew inequity, and family exposure risk before recommending action.
- Do not fabricate badge status, gate access approval, or reentry authority.
