---
name: coalition-host-nation-water-rights-and-demand-cell
description: Balance coalition military water demand against host-nation water rights, civilian needs, and legal constraints for U.S. warfighters. Use when operations compete for scarce aquifer, reservoir, or treatment capacity and commanders need defensible allocation options without triggering legitimacy or stability failure.
---

# Coalition Host Nation Water Rights And Demand Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm current military demand, host-nation legal or customary water rights, civilian consumption pressure, and infrastructure status before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the allocation problem with water-source status, delivery constraints, seasonal demand, and civil-political sensitivities.
2. Build one recommended COA and at least two alternatives with tradeoffs in military endurance, civilian legitimacy, convoy burden, and alliance friction.
3. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
4. Identify decision points for rationing, host-nation negotiation, emergency abstraction, and civil-restoration support.
5. Publish commander-facing recommendations plus a staff tracker with owner, suspense, confidence, and branch triggers.

## Required Output Format

1. Situation snapshot and water posture.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and approval gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: water allocation ledger, host-nation rights conflict matrix, convoy and tanker demand ladder, and civil-legitimacy risk brief.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-coalition-host-nation-water-rights-military-demand-deconfliction-v1` with `protocol_stack_id=ps-coalition-host-nation-water-rights-military-demand-deconfliction-stack-v1`.
- Alternate: independent civil-engineering review with manual allocation worksheet and host-nation legal cross-check.
- Degraded: commander-approved emergency rationing branch with paper allocation board, dual-signature release, and UTC acknowledgment logging.

## Domain Packet Defaults

- Default packet ID: `DPL-WATER-RIGHTS-DECONFLICTION-001`.
- Preferred `toolchain_id=TC-WATERRIGHTS-134` and `toolchain_profile_id=host-nation-water-rights-military-demand-deconfliction-v1`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: water allocation ledger, aquifer and reservoir status board, legal rights tracker, and tanker or pipeline demand planner.
- Preferred protocol profiles for coordination and machine exchange: `OGC`, signed water-allocation manifests, `NIEM`, `API/JSON`, `USMTF`, and `EDXL-DE/CAP`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md` for high-consequence recommendations.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for recommendations that can alter emergency abstraction, civil allocation, or coalition demand posture.
- If authority, legal basis, or source telemetry is uncertain, downgrade to advisory-only and require human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, water-rights assumptions, and host-nation acknowledgment integrity.
- If checks fail, provide a degraded allocation branch with explicit endurance and legitimacy risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag civilian deprivation risk, irrigation impacts, groundwater drawdown, contamination concerns, and legal caveats early.
- Require explicit human release for recommendations that could seize, divert, or ration protected civilian water sources.
- Do not fabricate sources, approvals, or host-nation consent.
