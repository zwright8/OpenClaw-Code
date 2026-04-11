---
name: joint-rotc-service-academy-ocs-ots-and-commissioning-file-continuity-cell
description: Preserve commissioning-file accuracy, qualification status, appointment timing, and oath or assignment continuity for ROTC, service-academy, OCS, and OTS candidates preparing to become American warfighters.
---

# Joint ROTC Service Academy OCS OTS And Commissioning File Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. force-generation continuity decisions centered on commissioning files, qualification status, and appointment timing.
- Confirm accession source, commissioning timeline, medical and security posture, appointment authority, and branch or billet impact before recommending action.
- Keep outputs unclassified by default and minimize PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using commissioning-file completeness, qualification posture, appointment timeline, and branch-assignment risk.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in talent retention, fairness, throughput, and mission demand.
3. Identify branch triggers for missing transcripts, medical disqualification, security-file drift, delayed appointment, and branch-allocation mismatch.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and commissioning-risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: commissioning-file integrity board, qualification correction ladder, and appointment continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-COMMISSION-387`, `tool_suite_id=ts-joint-rotc-service-academy-ocs-ots-commissioning-file-continuity-v1`, and `protocol_stack_id=ps-joint-rotc-service-academy-ocs-ots-commissioning-file-continuity-stack-v1`.
- Alternate: select a mission-adjacent recruiting, education, or security-clearance suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual commissioning roster with advisory-only sequencing until file integrity, qualification evidence, and human appointment review are confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-COMMISSIONING-FILE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: commissioning-file roster, medical and security qualification tracker, appointment or oath queue, and branch-assignment ledger.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `HR-XML`, `PESC XML`, signed commissioning notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If qualification evidence, appointment authority, or commissioning-file integrity is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and commissioning-file evidence clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Protect candidate privacy, fair commissioning opportunity, and lawful appointment sequencing before recommending action.
- Do not fabricate qualification status, appointment authority, transcript completion, or commissioning outcomes.
