---
name: joint-family-online-harassment-doxxing-and-protective-escalation-cell
description: Coordinate response when U.S. warfighters or their families face doxxing, stalking, swatting, or online harassment that threatens safety, retention, or mission focus.
---

# Joint Family Online Harassment Doxxing And Protective Escalation Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter family-protection decisions where targeted online harassment or doxxing can create real-world safety and readiness risk.
- Confirm affected personnel or household, threat posture, evidence quality, platform-reporting status, command authorities, and immediate safety concerns before recommending action.
- Keep outputs unclassified by default and minimize personally identifying or threat-amplifying detail unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using harassment indicators, doxxing or swatting evidence, household vulnerability, platform escalation posture, and mission impact.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in speed, privacy, evidence retention, and protective coverage.
3. Identify branch triggers for rapid threat escalation, copycat amplification, false reporting, address exposure, and law-enforcement or command intervention.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and protective-risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: harassment incident board, protective-escalation ladder, and doxxing response continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-DOXX-330`, `tool_suite_id=ts-joint-family-online-harassment-doxxing-protective-escalation-v1`, and `protocol_stack_id=ps-joint-family-online-harassment-doxxing-protective-escalation-stack-v1`.
- Alternate: select a mission-adjacent protective-order, information-integrity, or family-readiness suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual incident-evidence roster with advisory-only sequencing until threat evidence, consent posture, and protective-routing options are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-FAMILY-ONLINE-HARASSMENT-DOXXING-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: incident-evidence ledger, platform abuse-report queue, protective-intel threat tracker, and family-safety escalation board.
- Preferred protocol profiles for coordination and machine exchange: `STIX/TAXII`, `NIEM`, signed incident notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If threat attribution, evidence integrity, or victim-consent posture is uncertain, downgrade to advisory-only and request human legal, protective-services, or command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and evidence-retention clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag retaliation risk, evidence contamination, privacy exposure, and threat amplification before recommending action.
- Do not fabricate threats, platform responses, protective coverage, or law-enforcement outcomes.
