---
name: strategic-electronics-salvage-and-component-reclamation-cell
description: Reclaim mission-capable electronic components from damaged systems, e-waste, and battlefield returns to support U.S. warfighters. Use when commanders or industrial staffs face semiconductor shortages, repair backlogs, or urgent need to recover trusted components for defense production and field sustainment.
---

# Strategic Electronics Salvage And Component Reclamation Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm shortage driver, target component families, available test capacity, counterfeit risk, and priority weapon or platform impacts before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the reclamation problem with shortage severity, salvage sources, test throughput, and quality-release thresholds.
2. Build one recommended COA and at least two alternatives with tradeoffs in recovered yield, trustworthiness, labor burden, and time to field.
3. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
4. Identify decision points for salvage triage, destructive teardown, component release, and restricted-use or quarantine branches.
5. Publish commander-facing recommendations plus a staff tracker with owner, suspense, confidence, and branch triggers.

## Required Output Format

1. Situation snapshot and shortage posture.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and approval gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: salvage triage board, component release ladder, counterfeit-risk matrix, and recovered-yield forecast.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-strategic-electronics-salvage-critical-component-reclamation-v1` with `protocol_stack_id=ps-strategic-electronics-salvage-critical-component-reclamation-stack-v1`.
- Alternate: independent quality-assurance witness with manual teardown worksheet and component pedigree cross-check.
- Degraded: commander-approved reclamation branch limited to non-flight-critical or training use with UTC acknowledgment logging.

## Domain Packet Defaults

- Default packet ID: `DPL-ELECTRONICS-SALVAGE-RECLAMATION-001`.
- Preferred `toolchain_id=TC-ELECTRONICS-131` and `toolchain_profile_id=electronics-salvage-component-reclamation-v1`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: teardown triage ledger, component test bench scheduler, counterfeit screening board, and reclaimed inventory allocator.
- Preferred protocol profiles for coordination and machine exchange: signed component manifests, `OPC UA`, `API/JSON`, `NIEM`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md` for high-consequence recommendations.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for recommendations that can alter component release, airworthiness assumptions, or strategic industrial allocation.
- If authority, test pedigree, or counterfeit screening confidence is uncertain, downgrade to advisory-only and require human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, component pedigree assumptions, and release-authority acknowledgment integrity.
- If checks fail, provide a degraded reclamation branch with explicit quality and mission-availability risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag counterfeit indicators, export-control limits, safety-of-flight restrictions, and test-capacity bottlenecks early.
- Require explicit human release for recommendations that put reclaimed components into mission-critical systems.
- Do not fabricate sources, approvals, or quality evidence.
