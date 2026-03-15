---
name: joint-ammunition-surveillance-and-lot-serviceability-cell
description: Coordinate ammunition surveillance, lot serviceability, and defect-response decisions for U.S. warfighters. Use when storage drift, age, malfunction data, or handling anomalies could change munition safety and availability.
---

# Joint Ammunition Surveillance And Lot Serviceability Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter ammunition surveillance, lot-serviceability, and defect-response decisions.
- Confirm supported munition families, storage authority, malfunction reporting chain, and commander timelines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with lot history, storage conditions, surveillance findings, malfunction data, and demand timelines.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in safety, availability, transport burden, and operational tempo.
3. Identify branch triggers for quarantine, restricted issue, priority testing, and demilitarization or redistribution thresholds.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and ammunition decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: ammunition surveillance watchlist, lot-serviceability matrix, and malfunction-response branch card.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-ammunition-surveillance-lot-serviceability-v1` with `protocol_stack_id=ps-joint-ammunition-surveillance-lot-serviceability-stack-v1`.
- Alternate: a mission-adjacent munitions or logistics suite from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Degraded: restricted-issue posture with manual surveillance logs and daily authority review only.

## Domain Packet Defaults

- Default packet ID: `DPL-AMMUNITION-SURVEILLANCE-LOT-001`.
- Preferred `toolchain_id=TC-AMMO-148` and `toolchain_profile_id=ammunition-surveillance-lot-serviceability-v1`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: lot surveillance ledger, condition-code board, malfunction and defect tracker, and storage-drift planner.
- Preferred protocol profiles for coordination and machine exchange: signed surveillance manifests, `NIEM`, `OGC`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If lot pedigree, malfunction evidence, or quarantine authority is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag mixed-lot assumptions, unsafe storage drift, and defect-report incompleteness before recommending action.
- Do not fabricate serviceability releases, quarantine approvals, or safe-to-fire declarations.
