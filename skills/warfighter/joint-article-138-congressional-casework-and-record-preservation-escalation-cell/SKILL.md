---
name: joint-article-138-congressional-casework-and-record-preservation-escalation-cell
description: Preserve lawful redress, congressional casework continuity, privacy-release control, and evidence preservation when Article 138 or protected escalation pathways become critical to U.S. warfighter trust, safety, or career continuity.
---

# Joint Article 138 Congressional Casework And Record Preservation Escalation Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter redress, congressional-casework, and record-preservation escalation decisions.
- Confirm grievance category, affected personnel, privacy-release posture, evidence status, safety concerns, and decision authority before recommending action.
- Keep outputs unclassified by default and minimize PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using grievance posture, Article 138 timeline, congressional casework demand, record-preservation risk, and command-climate impact.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in protected escalation, speed, confidentiality, and command burden.
3. Identify branch triggers for evidence loss, privacy-release gaps, retaliatory actions, safety risk, and stalled command remedies.
4. Bind each critical recommendation to concrete external tools, protocol stacks, packet templates, and authority gates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and redress-escalation risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: redress escalation board, record-preservation ladder, and protected casework packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-A138-354`, `tool_suite_id=ts-joint-article-138-congressional-casework-record-preservation-escalation-v1`, and `protocol_stack_id=ps-joint-article-138-congressional-casework-record-preservation-escalation-stack-v1`.
- Alternate: select a mission-adjacent IG or EO, legal-support, or family-protection suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual redress roster with advisory-only sequencing until grievance authority, privacy posture, and evidence-preservation actions are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-ARTICLE-138-CONGRESSIONAL-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: redress case board, congressional casework tracker, privacy-act release ledger, and record-preservation hold queue.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed casework notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Use the `Administrative Justice and Redress` playbook when grievance deadlines, congressional routing, or evidence-preservation posture determine trust and safety risk.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If grievance authority, privacy-release legitimacy, or preservation-hold evidence is uncertain, downgrade to advisory-only and request human legal or inspector review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and protected-routing clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag privacy-release gaps, retaliatory routing, missing preservation holds, and unsupported remedy claims before recommending action.
- Do not fabricate congressional action, legal advice, command remedies, or investigative outcomes.
