---
name: joint-service-animal-and-family-pet-evacuation-shelter-continuity-cell
description: Preserve service-animal access and family-pet evacuation or shelter continuity during installation disruption, evacuation, or mass-care operations. Use when unresolved animal support can increase refusal-to-evacuate risk, caregiver burden, or U.S. warfighter family instability.
---

# Joint Service Animal And Family Pet Evacuation Shelter Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter service-animal and family-pet evacuation, shelter, and reunification decisions.
- Confirm evacuation posture, shelter constraints, service-animal obligations, veterinary support, documentation status, and decision timelines before recommending action.
- Keep outputs unclassified by default and minimize personally identifiable information unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using evacuation orders, family animal posture, shelter rules, veterinary support, and refusal-to-evacuate risk.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in life safety, compliance, logistics burden, and family stability.
3. Identify branch triggers for co-located sheltering, vaccination or documentation gap, service-animal accommodation failure, reunification lag, and humane transport shortfall.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and animal-support continuity trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: animal-shelter continuity matrix, refusal-to-evacuate risk board, and veterinary support tracker.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-service-animal-family-pet-evacuation-shelter-v1` with `protocol_stack_id=ps-joint-service-animal-family-pet-evacuation-shelter-stack-v1`.
- Alternate: select a mission-adjacent shelter-support, family-readiness, or veterinary-support suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual animal-support roster with no unsupported co-located shelter guarantee and command-approved transport priorities only.

## Domain Packet Defaults

- Default packet ID: `DPL-SERVICE-ANIMAL-PET-EVAC-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: shelter capacity board, animal documentation tracker, reunification ledger, and veterinary support queue.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `CAP`, signed veterinary notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If shelter policy, service-animal accommodation, or veterinary documentation is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and acknowledgment integrity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsafe shelter assumptions, service-animal access failures, animal documentation gaps, and evacuation noncompliance risk before recommending action.
- Do not fabricate shelter acceptance, veterinary clearance, or service-animal legal status.
