---
name: joint-initial-entry-training-holdover-recycle-and-family-separation-continuity-cell
description: Stabilize trainee status, holdover or recycle decisions, pay or family-separation continuity, and graduation or PCS sequencing when initial-entry training friction threatens lawful force generation for American warfighters.
---

# Joint Initial Entry Training Holdover Recycle And Family Separation Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter force-generation continuity decisions centered on basic training, boot camp, AIT, and other initial-entry pipelines.
- Confirm trainee status, holdover or recycle posture, pay and family-support risk, graduation timeline, and command authority before recommending action.
- Keep outputs unclassified by default and minimize PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using trainee status, recycle or holdover cause, family-separation or pay impact, and graduation or PCS risk.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in throughput, training quality, family stability, and administrative burden.
3. Identify branch triggers for injury or illness, disciplinary hold, training failure, pay break, family emergency, and follow-on orders slip.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and trainee-continuity risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: trainee-status board, holdover or recycle ladder, and family-support continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-IET-388`, `tool_suite_id=ts-joint-initial-entry-training-holdover-recycle-family-separation-continuity-v1`, and `protocol_stack_id=ps-joint-initial-entry-training-holdover-recycle-family-separation-continuity-stack-v1`.
- Alternate: select a mission-adjacent recruiting, pay, or family-readiness suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual trainee roster with advisory-only sequencing until status evidence, pay posture, and human training review are confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-IET-HOLDOVER-RECYCLE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: trainee-status board, holdover queue, pay or family-separation tracker, and graduation or PCS orders ledger.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `HR-XML`, signed training notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If trainee status, pay posture, or graduation authority is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and trainee-status evidence clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Protect trainee dignity, lawful processing, training quality, and family stability before recommending action.
- Do not fabricate recycle approval, graduation status, PCS orders, or pay restoration.
