---
name: joint-civil-works-emergency-permitting-and-right-of-entry-cell
description: Accelerate emergency permits and right-of-entry actions for repair, clearance, route opening, and protective works without losing legal traceability. Use when mission success depends on faster access to land, facilities, or damaged infrastructure.
---

# Joint Civil Works Emergency Permitting And Right Of Entry Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter emergency-permitting, access, and right-of-entry decisions.
- Confirm land ownership, affected infrastructure, engineer tasks, emergency authorities, and access deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using blocked worksites, required repairs, ownership status, permit dependencies, and route-opening timelines.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in legality, speed, force protection, and public legitimacy.
3. Identify branch triggers for emergency access orders, environmental waivers, condemnation, and engineer work stoppage.
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

Primary products: permit and entry decision ladder, site-access tracker, and engineer-work authorization board.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-civil-works-emergency-permitting-right-of-entry-v1` with `protocol_stack_id=ps-joint-civil-works-emergency-permitting-right-of-entry-stack-v1`.
- Alternate: select a mission-adjacent engineer, route-opening, or civil-authority suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual right-of-entry worksheet with no engineer work beyond life-safety exceptions until command and legal review are complete.

## Domain Packet Defaults

- Default packet ID: `DPL-EMERGENCY-PERMIT-ENTRY-001`.
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
- If access rights, environmental waiver status, or emergency-entry authority is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag ownership ambiguity, environmental exposure, unexploded hazards, and public-trust damage before recommending action.
- Do not fabricate access rights, permit status, or condemnation authority.
