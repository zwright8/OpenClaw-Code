---
name: strategic-aviation-spares-airworthiness-trust-cell
description: Govern cannibalization recovery, parts pedigree, and airworthiness release when fleets rely on redistributed or reclaimed aviation spares. Use when U.S. forces must trade readiness speed against maintenance trust and configuration control.
---

# Strategic Aviation Spares Airworthiness Trust Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter aviation-spares pedigree, cannibalization recovery, and airworthiness-trust decisions.
- Confirm affected fleets, serialized or lot-controlled parts, configuration baselines, certifying authority, and readiness deadlines before recommending action.
- Keep outputs unclassified by default unless airworthiness findings, counterfeit indicators, or fleet-vulnerability details require protected handling.

## Workflow

1. Frame the mission problem with grounded systems, donor assets, part pedigree evidence, release authority, and operational demand.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in readiness return, safety, traceability, and long-term maintenance debt.
3. Identify branch triggers for quarantine, limited release, depot recall, or accelerated recertification.
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

Primary products: spares pedigree board, cannibalization recovery matrix, and airworthiness release ladder.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-strategic-aviation-spares-airworthiness-trust-v1` with `protocol_stack_id=ps-strategic-aviation-spares-airworthiness-trust-stack-v1`.
- Alternate: select a mission-adjacent maintenance-readiness, depot-quality, or industrial-readiness suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: hold nonessential release, use a manual pedigree ledger, and require certifying-authority review for every returned part.

## Domain Packet Defaults

- Default packet ID: `DPL-AVIATION-SPARES-AIRWORTHINESS-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: serialized parts ledger, configuration-control board, airworthiness release queue, and counterfeit or anomaly watchlist.
- Preferred protocol profiles for coordination and machine exchange: signed maintenance manifests, `X.509`, `NIEM`, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If part pedigree, certifying authority, or release evidence is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Do not recommend airworthiness release, cannibalization, or interchangeability claims without authorized configuration control and maintenance review.
- Flag counterfeit, undocumented repair, and serial-traceability gaps before recommending installation.
