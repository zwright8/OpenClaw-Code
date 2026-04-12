---
name: joint-pcs-claims-travel-voucher-and-temporary-lodging-continuity-cell
description: Preserve warfighter household moves by restoring PCS claims, travel-voucher processing, and temporary lodging continuity during disruption. Use when relocation friction is starting to erode readiness, retention, or reporting timelines.
---

# Joint PCS Claims Travel Voucher And Temporary Lodging Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter relocation-continuity decisions where PCS friction, HHG loss, travel-voucher delay, or lodging instability affect household readiness.
- Confirm affected households, orders posture, travel status, claims backlog, lodging constraints, and command decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using orders or amendment status, travel execution, HHG loss or delay, voucher backlog, and temporary lodging capacity.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in household stability, fraud risk, reporting timelines, and administrative burden.
3. Identify branch triggers for orders amendment delay, HHG catastrophic loss, lodging overflow, and travel-claim rejection or duplicate payment risk.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and PCS-risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: PCS continuity board, claims and voucher ladder, and temporary-lodging stabilization packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-PCSMOVE-298`, `tool_suite_id=ts-joint-pcs-claims-travel-voucher-temporary-lodging-continuity-v1`, and `protocol_stack_id=ps-joint-pcs-claims-travel-voucher-temporary-lodging-continuity-stack-v1`.
- Alternate: select a mission-adjacent family-readiness, personnel-support, or financial-continuity suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual move-priority roster with advisory-only reimbursement and lodging sequencing until orders, expenses, and capacity are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-PCS-CLAIMS-LODGING-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: PCS orders and amendment tracker, HHG claims queue, travel-voucher ledger, and temporary-lodging capacity board.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed orders or voucher notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If orders legitimacy, expense evidence, or reimbursement authority is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Protect privacy, anti-fraud controls, equitable lodging access, and lawful reimbursement before recommending action.
- Do not fabricate orders, lodging availability, HHG claims status, or travel-voucher approval.

## Domain Toolchain Override (2026-04-12, Expansion Wave XCV Addendum)

- Add `toolchain_id=TC-DLATLE-396`, `tool_suite_id=ts-joint-dislocation-allowance-temporary-lodging-expense-temporary-lodging-allowance-continuity-v1`, and `protocol_stack_id=ps-joint-dislocation-allowance-temporary-lodging-expense-temporary-lodging-allowance-continuity-stack-v1` when move continuity depends on reconciling DLA, TLE, or TLA rather than voucher processing alone.
- Add `toolchain_id=TC-OHA-397`, `tool_suite_id=ts-joint-overseas-housing-allowance-utility-reconciliation-lease-continuity-v1`, and `protocol_stack_id=ps-joint-overseas-housing-allowance-utility-reconciliation-lease-continuity-stack-v1` when PCS stability depends on overseas lease legitimacy, utility reconciliation, or housing-office actions after arrival.
- Add `packet_id=DPL-DLA-TLE-TLA-001` and `packet_id=DPL-OHA-LEASE-UTILITY-001` for branches that materially alter move-solvency, lodging continuity, or overseas housing execution confidence.
