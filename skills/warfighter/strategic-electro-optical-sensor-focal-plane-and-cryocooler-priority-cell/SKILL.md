---
name: strategic-electro-optical-sensor-focal-plane-and-cryocooler-priority-cell
description: Coordinate strategic allocation of electro-optical detector arrays and cryocoolers. Use when ISR, missile warning, or targeting sensor recovery is constrained by focal-plane or cooling bottlenecks.
---

# Strategic Electro Optical Sensor Focal Plane And Cryocooler Priority Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter strategic industrial and ISR sensor-allocation decisions.
- Confirm detector pedigree, cryocooler throughput, repair backlog, mission demand, and release authority before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem using detector inventory, cryocooler capacity, repair queues, mission demand, and scarcity drivers.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in sensor readiness, strategic coverage, industrial throughput, and counterfeit or pedigree risk.
3. Identify branch triggers for lot hold, cryocooler reallocation, sensor-line prioritization, and degraded-mission acceptance.
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

Primary products: sensor-allocation ladder, cryocooler bottleneck board, and release-priority queue.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-strategic-eo-sensor-focal-plane-cryocooler-priority-v1` with `protocol_stack_id=ps-strategic-eo-sensor-focal-plane-cryocooler-priority-stack-v1`.
- Alternate: select a mission-adjacent industrial, photonics, or ISR sustainment suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Preferred `toolchain_id=TC-EO-CRYO-115` and `toolchain_profile_id=eo-sensor-focal-plane-cryocooler-priority-v1`.
- Degraded: mission-essential sensor lines only with manual pedigree confirmation and narrowed release authority.

## Domain Packet Defaults

- Default packet ID: `DPL-EO-SENSOR-FOCAL-PLANE-CRYOCOOLER-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: focal-plane inventory ledger, cryocooler test scheduler, and sensor mission-allocation board.
- Preferred protocol profiles for coordination and machine exchange: signed lot manifests, `CCSDS`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, `../_shared/references/domain-toolchain-profiles.md`, `../_shared/references/joint-operations-external-toolchain-profiles.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If detector pedigree, cryocooler throughput, or release authority is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag counterfeit risk, lot-pedigree ambiguity, cryocooler bottlenecks, and strategic-coverage tradeoffs before recommending action.
- Do not fabricate detector yields, industrial capacity, or release approvals.
