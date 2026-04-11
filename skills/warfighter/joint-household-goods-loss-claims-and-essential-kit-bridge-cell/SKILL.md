---
name: joint-household-goods-loss-claims-and-essential-kit-bridge-cell
description: Bridge household-goods loss, delayed delivery, and emergency essential-item gaps during PCS, mobilization, evacuation, or housing disruption. Use when missing household essentials can degrade U.S. warfighter family stability, deployment timing, or recovery tempo.
---

# Joint Household Goods Loss Claims And Essential Kit Bridge Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter household-goods recovery, emergency kit bridging, and claims-continuity decisions.
- Confirm shipment status, displacement duration, family size, essential-item shortages, claims deadlines, and installation support posture before recommending action.
- Keep outputs unclassified by default and minimize personally identifiable information unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using shipment delay or loss, lodging or shelter status, essential household gaps, claims pathways, and readiness or retention impact.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in speed, fiscal legitimacy, family burden, and inventory efficiency.
3. Identify branch triggers for total-loss determination, emergency kit depletion, hardship escalation, temporary lodging extension, and claims denial.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and household-goods disruption trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: household-goods recovery board, essential kit gap matrix, and claims or bridge-support tracker.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-household-goods-loss-claims-essential-kit-v1` with `protocol_stack_id=ps-joint-household-goods-loss-claims-essential-kit-stack-v1`.
- Alternate: select a mission-adjacent family-readiness, logistics, or housing-support suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual essential-needs ledger with command-approved bridge support and no unsupported reimbursement promises.

## Domain Packet Defaults

- Default packet ID: `DPL-HOUSEHOLD-GOODS-ESSENTIAL-KIT-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: shipment status tracker, claims queue, emergency issue board, and lodging or family support ledger.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed claims manifests, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If claims authority, inventory accountability, or reimbursement legitimacy is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and acknowledgment integrity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported reimbursement assumptions, essential-item inequity, duplicate issue risk, and family hardship escalation before recommending action.
- Do not fabricate shipment status, property valuation, or fiscal relief approvals.

## Domain Toolchain Override (2026-04-11, Expansion Wave LXXXIX Addendum)

- Add `toolchain_id=TC-SCHTRN-364`, `tool_suite_id=ts-joint-military-child-school-transfer-transcript-graduation-continuity-v1`, and `protocol_stack_id=ps-joint-military-child-school-transfer-transcript-graduation-continuity-stack-v1` when shipment delay or household displacement starts to threaten dependent school transfer, transcript continuity, or graduation timing.
- Add `packet_id=DPL-SCHOOL-TRANSFER-GRAD-001` for branches that materially alter household-goods recovery priority, dependent school continuity, or move-legitimacy confidence.
