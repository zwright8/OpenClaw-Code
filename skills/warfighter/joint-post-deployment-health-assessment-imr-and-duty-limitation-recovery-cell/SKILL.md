---
name: joint-post-deployment-health-assessment-imr-and-duty-limitation-recovery-cell
description: Restore PDHA or PDHRA, IMR, and duty-limitation follow-through when post-deployment medical actions drift and start degrading deployability, recovery, or retention for U.S. warfighters. Use when readiness debt is building after redeployment.
---

# Joint Post Deployment Health Assessment IMR And Duty Limitation Recovery Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter post-deployment health, readiness-remediation, and profile-recovery decisions.
- Confirm affected unit or cohort, assessment backlog, IMR discrepancy set, active duty limitations, and command deadlines before recommending action.
- Keep outputs unclassified by default and minimize PHI or PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using PDHA or PDHRA completion status, IMR deltas, follow-up appointment demand, active profiles, and deployability deadlines.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in readiness speed, clinical safety, privacy, and staff burden.
3. Identify branch triggers for missed screenings, unresolved lab or specialty follow-up, stale profiles, and commander pressure to return personnel before medical closure.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and readiness-recovery trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: post-deployment recovery board, IMR closure ladder, and duty-limitation continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-PDHAIMR-339`, `tool_suite_id=ts-joint-post-deployment-health-assessment-imr-duty-limitation-recovery-v1`, and `protocol_stack_id=ps-joint-post-deployment-health-assessment-imr-duty-limitation-recovery-stack-v1`.
- Alternate: select a mission-adjacent preventive-medicine, medhold, or medical-board suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual readiness-priority roster with advisory-only sequencing until assessment status, profile authority, and follow-up routing are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-POST-DEPLOYMENT-HEALTH-IMR-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: post-deployment assessment board, IMR discrepancy queue, profile and duty-limitation ledger, and follow-up appointment tracker.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `NIEM`, signed readiness notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If assessment status, profile legitimacy, or deployability authority is uncertain, downgrade to advisory-only and request human clinical or readiness review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag stale profiles, unsupported deployability claims, overlooked mental-health follow-up, and privacy misuse before recommending action.
- Do not fabricate assessment completion, waiver approval, clinical clearance, or readiness restoration.
