---
name: strategic-vaccine-adjuvant-lipid-nanoparticle-surge-cell
description: Coordinate strategic allocation of vaccine adjuvants, lipid nanoparticles, and sterile fill-finish capacity for U.S. warfighter countermeasure readiness. Use when biologics production depends on constrained specialty inputs, cold-chain pedigree, or emergency release priorities.
---

# Strategic Vaccine Adjuvant Lipid Nanoparticle Surge Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm authority, releasability, affected medical mission threads, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with countermeasure demand, specialty-input bottlenecks, fill-finish constraints, and distribution priorities.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in readiness, safety, throughput, and strategic risk.
3. Identify branch/sequel triggers, degraded production thresholds, and command approval gates.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff task tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: specialty-input allocation board, fill-finish surge ladder, and countermeasure release risk brief.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-strategic-vaccine-adjuvant-lipid-nanoparticle-surge-v1` with `protocol_stack_id=ps-strategic-vaccine-adjuvant-lipid-nanoparticle-surge-stack-v1`.
- Alternate: select a mission-adjacent bioindustrial or medical suite/stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: authenticated manual allocation board with dual-control release logging and UTC acknowledgment tracking.

## Domain Packet Defaults

- Default packet ID: `DPL-VACCINE-ADJUVANT-LNP-SURGE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: material pedigree ledgers, sterile fill-finish schedulers, and medical-demand prioritization boards.
- Preferred protocol profiles for coordination and machine exchange: signed material-cert manifests, `HL7/FHIR`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query/action template, expected output schema, protocol/transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, legal basis, sterility evidence, or provenance is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag legal, policy, biosecurity, and coalition-caveat constraints before recommending action.
- Do not fabricate classified sources, authorities, or approvals.
