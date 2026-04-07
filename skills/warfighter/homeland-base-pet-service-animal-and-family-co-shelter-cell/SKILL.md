---
name: homeland-base-pet-service-animal-and-family-co-shelter-cell
description: Coordinate family co-shelter options for pets and service animals during domestic crises affecting military communities. Use when evacuation compliance, service-animal continuity, or shelter safety depends on auditable animal-support decisions.
---

# Homeland Base Pet Service Animal And Family Co Shelter Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter pet, service-animal, and family co-shelter decisions during domestic emergencies.
- Confirm affected families, service-animal status, shelter constraints, veterinary support, transport availability, and public-health restrictions before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using evacuation demand, shelter rules, pet and service-animal population, veterinary support availability, and reunification requirements.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in life safety, family compliance, animal welfare, and shelter burden.
3. Identify branch triggers for co-shelter overflow, service-animal verification conflict, veterinary triage, and reunification failure.
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

Primary products: co-shelter support matrix, animal-transport ladder, and veterinary-support packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-COSHELTER-285`, `tool_suite_id=ts-homeland-base-pet-service-animal-family-co-shelter-v1`, and `protocol_stack_id=ps-homeland-base-pet-service-animal-family-co-shelter-stack-v1`.
- Alternate: select a mission-adjacent mass-care, veterinary, or family-readiness suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual pet and service-animal roster with no unsupported co-shelter promise until shelter and veterinary status are confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-PET-SERVICE-ANIMAL-COSHELTER-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: shelter pet-capacity board, service-animal verification tracker, veterinary support ledger, and family reunification queue.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed custody manifests, `API/JSON`, `CAP`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If shelter rules, service-animal legitimacy, or veterinary capacity is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag zoonotic risk, unsafe co-shelter density, unsupported reunification claims, and service-animal verification gaps before recommending action.
- Do not fabricate veterinary status, shelter acceptance, service-animal legitimacy, or transport availability.
