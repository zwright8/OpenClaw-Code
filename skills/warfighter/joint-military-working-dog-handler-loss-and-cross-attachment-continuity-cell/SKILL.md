---
name: joint-military-working-dog-handler-loss-and-cross-attachment-continuity-cell
description: Sustain military working dog mission output when handler casualties, reassignment, quarantine, or displacement force rapid cross-attachment and custody changes.
---

# Joint Military Working Dog Handler Loss And Cross Attachment Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter military-working-dog team continuity, custody, and reassignment decisions.
- Confirm dog mission set, handler availability, veterinary posture, kennel capacity, and mission-priority demands before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using dog and handler readiness, mission demand, qualification overlap, quarantine constraints, and transport posture.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in detection reliability, team trust, animal welfare, and response speed.
3. Identify branch triggers for emergency cross-attachment, kennel isolation, mission downgrade, or veterinary hold.
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

Primary products: MWD team continuity board, cross-attachment qualification matrix, and kennel-custody handoff ledger.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-mwd-handler-loss-cross-attachment-continuity-v1` with `protocol_stack_id=ps-joint-mwd-handler-loss-cross-attachment-continuity-stack-v1`.
- Alternate: select a mission-adjacent veterinary, force-protection, or personnel-recovery suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual team roster with dual-witness custody transfer and command-approved mission narrowing only.

## Domain Packet Defaults

- Default packet ID: `DPL-MWD-HANDLER-CROSS-ATTACHMENT-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: MWD team readiness board, kennel and vaccination ledger, handler qualification matrix, and mission reassignment tracker.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, signed animal custody manifests, `NIEM`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If dog welfare, handler qualification, or custody provenance is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag welfare concerns, scent-detection degradation, mission-mismatch risk, and handler-overload before recommending action.
- Do not fabricate handler qualifications, custody status, or veterinary release evidence.
