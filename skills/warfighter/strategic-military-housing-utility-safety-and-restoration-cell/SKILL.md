---
name: strategic-military-housing-utility-safety-and-restoration-cell
description: Restore safe military housing and utility continuity for warfighters, dependents, and critical workers after attacks, disasters, or utility-system failures. Use when commanders need options that tie habitability, force generation, and civil-support legitimacy to concrete tool and protocol bindings.
---

# Strategic Military Housing Utility Safety And Restoration Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter housing-safety, utility-restoration, and family-readiness decisions.
- Confirm affected installations, housing classes, utility dependencies, protected populations, and restoration authorities before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using housing damage, utility status, habitability criteria, occupancy priorities, and commander decision timelines.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in safety, speed, relocation burden, morale, and force-generation impact.
3. Identify branch triggers for condemnation, utility isolation, temporary lodging, and phased reoccupation.
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

Primary products: housing habitability board, utility-restoration ladder, and temporary-relocation priority tracker.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-strategic-military-housing-utility-safety-restoration-v1` with `protocol_stack_id=ps-strategic-military-housing-utility-safety-restoration-stack-v1`.
- Alternate: select a mission-adjacent housing, shelter, engineer, or utility-restoration suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual habitability ledger with commander-approved relocation priorities and no reoccupation until safety review completes.

## Domain Packet Defaults

- Default packet ID: `DPL-HOUSING-UTILITY-SAFETY-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: facility-inspection queue, utility-status dashboard, lodging allocation board, and family-notification tracker.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `OPC UA`, `CAP`, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If safety certification, utility isolation authority, or occupancy accountability is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag structural-safety risk, vulnerable-population exposure, utility cross-contamination, and relocation shortfalls before recommending action.
- Do not fabricate inspection status, restoration progress, or housing authority approvals.

## Domain Toolchain Override (2026-04-06, Expansion Wave LXXIII Addendum)

- Add `toolchain_id=TC-HHGKIT-283`, `tool_suite_id=ts-joint-household-goods-loss-claims-essential-kit-v1`, and `protocol_stack_id=ps-joint-household-goods-loss-claims-essential-kit-stack-v1` when housing restoration plans depend on essential-item bridging, shipment disruption, or temporary-lodging sustainment for displaced warfighter families.
- Add `toolchain_id=TC-COMEX-284`, `tool_suite_id=ts-joint-commissary-exchange-subsistence-hygiene-restoration-v1`, and `protocol_stack_id=ps-joint-commissary-exchange-subsistence-hygiene-restoration-stack-v1` when safe reoccupation or prolonged displacement depends on local access to food, hygiene, and daily-use retail support.
- Add `toolchain_id=TC-REENTRY-285`, `tool_suite_id=ts-joint-installation-access-badge-curfew-reentry-v1`, and `protocol_stack_id=ps-joint-installation-access-badge-curfew-reentry-stack-v1` when habitability decisions depend on phased family reentry, gate restoration, or curfew-control legitimacy.
- Add `packet_id=DPL-HOUSEHOLD-GOODS-ESSENTIAL-KIT-001`, `packet_id=DPL-COMMISSARY-EXCHANGE-HYGIENE-001`, and `packet_id=DPL-ACCESS-BADGE-CURFEW-REENTRY-001` for branches that materially alter relocation timing, reoccupation confidence, or family-stability posture.
