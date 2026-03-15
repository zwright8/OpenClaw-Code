---
name: theater-depot-acceptance-test-and-quality-escape-containment-cell
description: Contain depot quality escapes, quarantine suspect lots, and sequence acceptance retest when U.S. warfighter readiness depends on stopping defective materiel from spreading. Use when failed acceptance tests, serial defects, or suspect repairs threaten field reliability.
---

# Theater Depot Acceptance Test And Quality Escape Containment Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm quality authority, affected fleets or programs, fielding deadlines, and safety or recall thresholds before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with failure reports, acceptance-test backlog, serial traceability, quarantine scope, and readiness exposure.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in safety, throughput, rework burden, and fielded-risk acceptance.
3. Identify branch or sequel triggers for lot quarantine, recall, retest surge, or fleet-use restriction.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff task tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: quality escape containment board, quarantine or recall ladder, and retest priority matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-depot-acceptance-test-quality-escape-containment-v1` with `protocol_stack_id=ps-theater-depot-acceptance-test-quality-escape-containment-stack-v1`.
- Alternate: select a mission-adjacent maintenance-quality, munitions-safety, or industrial-readiness suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual quarantine ledger with command-approved release holds and conservative fleet-use restrictions.

## Domain Packet Defaults

- Default packet ID: `DPL-DEPOT-QUALITY-ESCAPE-CONTAINMENT-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: acceptance-test queue, failure-analysis board, serial traceability ledger, and quarantine or recall tracker.
- Preferred protocol profiles for coordination and machine exchange: signed quality manifests, `OPC UA`, `NIEM`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If failure evidence, traceability, or quarantine authority is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Do not suppress safety defects, invent pass or fail results, or recommend release without traceability and authority checks.
- Flag serial-cluster risk, recall burden, false-pass exposure, and mission-availability consequences before recommending action.
