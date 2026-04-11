---
name: joint-meps-medical-waiver-moral-screening-and-ship-date-continuity-cell
description: Preserve MEPS medical-waiver timing, moral or suitability review, contract integrity, and ship-date continuity when administrative drift threatens the accession of future American warfighters.
---

# Joint MEPS Medical Waiver Moral Screening And Ship Date Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. force-accession continuity decisions centered on MEPS processing, waivers, eligibility review, and ship-date protection.
- Confirm applicant status, contract posture, waiver category, ship-date window, recruiter chain, and force-generation priority before recommending action.
- Keep outputs unclassified by default and minimize PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using MEPS case status, waiver evidence, moral or suitability review posture, contract integrity, and ship-date risk.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in accession quality, fairness, throughput, and mission demand.
3. Identify branch triggers for missing medical records, waiver denial, moral-review delay, contract mismatch, and ship-date slip.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and accession-risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: accession case board, waiver-routing ladder, and ship-date continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-MEPS-386`, `tool_suite_id=ts-joint-meps-medical-waiver-moral-screening-ship-date-continuity-v1`, and `protocol_stack_id=ps-joint-meps-medical-waiver-moral-screening-ship-date-continuity-stack-v1`.
- Alternate: select a mission-adjacent recruiting, training-pipeline, or human-readiness suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual accession roster with advisory-only sequencing until MEPS evidence, waiver posture, and human accession review are confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-MEPS-WAIVER-SHIP-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: MEPS case board, medical-waiver tracker, moral or suitability review queue, and ship-date ledger.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed accession notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If waiver evidence, applicant eligibility, or contract posture is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and contract or ship-date evidence clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Protect applicant privacy, accession fairness, and evidence integrity before recommending action.
- Do not fabricate waiver approval, moral-screening outcome, enlistment contract, or ship-date confirmation.
