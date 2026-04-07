---
name: joint-civil-works-emergency-permitting-and-right-of-entry-cell
description: Accelerate emergency permits, site access, and right-of-entry decisions so engineer and recovery forces can act lawfully under crisis timelines.
---

# Joint Civil Works Emergency Permitting And Right Of Entry Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter emergency-permitting, access, and engineer work-release decisions.
- Confirm work scope, site-control status, legal authorities, environmental constraints, and commander decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using mission effect, permit blockers, parcel or easement status, environmental constraints, and engineer timelines.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in legality, speed, force protection, and mission restoration.
3. Identify branch triggers for emergency exceptions, right-of-entry denial, waiver approval, and work-release sequencing.
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

Primary products: permit acceleration board, right-of-entry decision ladder, engineer work-release matrix, and waiver status log.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-PERMIT-246`, `tool_suite_id=ts-joint-civil-works-emergency-permitting-and-right-of-entry-v1`, and `protocol_stack_id=ps-joint-civil-works-emergency-permitting-and-right-of-entry-stack-v1`.
- Alternate: select a mission-adjacent civil-works, legal, or engineer-governance suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual right-of-entry worksheet with no engineer work beyond life-safety exceptions until command and legal review are complete.

## Domain Packet Defaults

- Default packet IDs: `DPL-RIGHT-OF-ENTRY-001` and `DPL-EMERGENCY-PERMIT-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: permit queue board, parcel or easement ledger, engineer work-order tracker, and environmental-waiver matrix.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `OGC`, signed access notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If permit authority, site-access legitimacy, or environmental exception status is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported access claims, permit shortcuts, environmental noncompliance risk, and work-release ambiguity before recommending action.
- Do not fabricate permits, rights of entry, site consent, or engineer release authority.
