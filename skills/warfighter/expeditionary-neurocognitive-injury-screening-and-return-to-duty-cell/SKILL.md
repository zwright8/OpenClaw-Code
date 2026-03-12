---
name: expeditionary-neurocognitive-injury-screening-and-return-to-duty-cell
description: Support U.S. warfighter planning for expeditionary neurocognitive injury screening, treatment prioritization, and return-to-duty governance.
---

# Expeditionary Neurocognitive Injury Screening and Return-to-Duty Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm medical authorities, clinical governance limits, and commander decision points before recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance.

## Workflow

1. Build mission context with casualty inflow, screening throughput, treatment capacity, and force-readiness impact.
2. Generate branch options with explicit tradeoffs in clinical safety, readiness recovery, and medical sustainment.
3. Select toolchain profile (primary, alternate, degraded) and protocol pathways.
4. Map each output to commander and medical authority decisions with confidence and freshness checks.
5. Deliver recommendations with owner-assigned medical and operational actions plus suspense.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternatives and trigger conditions.
4. Decision points and approval gates.
5. Staff tasking with suspense.

## Domain Tool Stack

Use these tool categories by default: force-health neuro-screening systems, patient regulation boards, and return-to-duty governance workflows.

## Protocol Profile

Preferred protocol families for this skill: HL7/FHIR, USMTF, NIEM, API/JSON.

## Domain Toolchain Defaults

- Primary: select a mission-fit tool_suite_id from ../_shared/references/warfighter-external-tool-and-protocol-catalog.md.
- Alternate: select a cross-check tool_suite_id with independent provenance.
- Degraded: commander-approved manual triage and duty-status board with UTC acknowledgment logging.

## External Tools and Protocol Integration

- Use ../_shared/references/warfighter-external-tool-and-protocol-catalog.md for concrete tool suites and protocol stacks.
- Use ../_shared/references/domain-tool-packet-library.md and include packet_id=DPL-EXPEDITIONARY-NEUROCOGNITIVE-RTD-001 for critical recommendations.
- Include tool_suite_id, protocol_stack_id, packet_id, data freshness (UTC), confidence, and fallback path for each high-impact branch.
- If no packet matches, define a provisional packet with validation_owner and revalidation_utc.

## Guardrails

- Separate facts, assessed judgments, assumptions, and unknowns.
- Flag legal/policy/ROE constraints and coalition interoperability limits early.
- Downgrade to advisory-only when authority, provenance, or acknowledgment integrity is uncertain.
- Do not fabricate sources, approvals, or operational authorities.
