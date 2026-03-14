---
name: theater-austere-blood-plasma-donor-screening-and-cold-chain-cell
description: Support austere blood and plasma donor-screening confidence, cold-chain survivability, and transfusion support. Use when casualty surge outpaces trusted blood availability.
---

# Theater Austere Blood Plasma Donor Screening And Cold-Chain Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm authority, clinical release criteria, casualty timeline, and commander decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with donor-screening results, cold-chain telemetry, casualty demand, contamination indicators, and transport constraints.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in survivability, screening confidence, cold-chain risk, and operational tempo.
3. Identify branch/sequel triggers, degraded-transfusion thresholds, and command approval gates.
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

Primary products: donor confidence ladder, cold-chain matrix, and austere transfusion support brief.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-austere-blood-plasma-donor-screening-and-cold-chain-cell-v1` with `protocol_stack_id=ps-theater-austere-blood-plasma-donor-screening-and-cold-chain-cell-stack-v1`.
- Alternate: `tool_suite_id=ts-medical-force-health-v1` with `protocol_stack_id=ps-cop-event-sharing-stack-v1`.
- Degraded: urgent-transfusion-only posture with dual clinical approval, manual cold-chain logging, and UTC acknowledgment tracking.

## Domain Packet Defaults

- Default packet ID: `DPL-AUSTERE-BLOOD-PLASMA-SCREENING-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: donor-screening adjudicators, plasma telemetry fusion boards, and medical distribution planners.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `USMTF`, `NIEM`, and `API/JSON`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query/action template, expected output schema, protocol/transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, screening evidence, or provenance is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag clinical, biosecurity, and cold-chain constraints before recommending action.
- Do not fabricate classified sources, authorities, or approvals.
