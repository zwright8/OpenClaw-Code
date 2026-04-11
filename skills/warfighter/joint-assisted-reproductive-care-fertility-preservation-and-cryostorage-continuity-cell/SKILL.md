---
name: joint-assisted-reproductive-care-fertility-preservation-and-cryostorage-continuity-cell
description: Preserve assisted-reproductive-care access, fertility-preservation timing, cryostorage integrity, and duty or deployment accommodations when American warfighters face IVF/ART friction, gamete or embryo storage risk, or specialty-care authorization delays.
---

# Joint Assisted Reproductive Care Fertility Preservation And Cryostorage Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter assisted-reproductive-care, fertility-preservation, and cryostorage continuity decisions.
- Confirm treatment timeline, consent posture, specimen-storage location, authorization status, duty or deployment constraints, and approval authority before recommending action.
- Keep outputs unclassified by default and minimize PII or protected health information unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using treatment milestones, cryostorage integrity, referral or authorization posture, and duty-impact timeline.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in reproductive autonomy, medical timing, mission impact, and administrative burden.
3. Identify branch triggers for authorization denial, missed procedure window, storage-payment lapse, tank-transfer risk, and deployment or PCS conflict.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and ART-continuity risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: fertility-preservation board, cryostorage risk ladder, and ART continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-ARTCARE-384`, `tool_suite_id=ts-joint-assisted-reproductive-care-fertility-preservation-cryostorage-continuity-v1`, and `protocol_stack_id=ps-joint-assisted-reproductive-care-fertility-preservation-cryostorage-continuity-stack-v1`.
- Alternate: select a mission-adjacent family-readiness, TRICARE, or medical-access suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual fertility-case roster with advisory-only sequencing until consent posture, storage integrity, and human specialty-care review are confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-ART-CRYOSTORAGE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: fertility-clinic referral board, cryostorage inventory ledger, specialty-care authorization queue, and duty-accommodation tracker.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `NIEM`, signed medical notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If consent posture, specialty-care authorization, or cryostorage integrity is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and custody-chain clarity for stored reproductive material.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Protect reproductive autonomy, medical privacy, consent boundaries, and time-sensitive treatment windows before recommending action.
- Do not fabricate authorizations, procedure dates, storage-chain status, or clinical outcomes.
