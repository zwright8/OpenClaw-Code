---
name: battlefield-additive-manufacturing-forward-repair-validation-cell
description: Validate forward additive-manufactured repair parts for air, land, and maritime mission assurance under contested sustainment.
---

# Battlefield Additive Manufacturing Forward Repair Validation Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter sustainment and mission-assurance operations.
- Confirm authority, platform criticality, data classification, timeline, and release constraints before recommending any repair path.
- Keep outputs unclassified unless handling guidance is provided.

## Workflow

1. Establish the mission objective, damaged component, repair options, and commander decision horizon.
2. Build a recommended release path and at least two alternates with explicit tradeoffs in readiness, part confidence, throughput, and downstream maintenance debt.
3. Bind each recommendation to a concrete tool suite, protocol stack, packet, and fallback method with UTC freshness and trust posture.
4. Map every tool output to release or no-release decisions, safety gates, and responsible maintenance authorities.
5. Publish commander-facing recommendations plus a staff execution matrix with owners, suspense, and revalidation triggers.

## Required Output Format

1. Situation snapshot.
2. Recommended primary action path.
3. Alternate and degraded paths.
4. Decision points and authorities.
5. Staff tasking and suspense.
6. Tool and protocol execution matrix.

## Domain Products

Primary products for this skill: repair validation packet, release or reject decision log, substitute-part confidence matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-battlefield-additive-repair-validation-v1` with `protocol_stack_id=ps-battlefield-additive-repair-validation-stack-v1`.
- Alternate: `tool_suite_id=ts-disconnected-maintenance-knowledge-fabric-v1` with `protocol_stack_id=ps-disconnected-maintenance-knowledge-fabric-stack-v1`.
- Degraded: human-inspected priority components only with authenticated voice or text readback and UTC acknowledgment chain.

## External Tool Stack and Protocols

- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and `../_shared/references/domain-tool-packet-library.md`.
- Preferred tools: material signature analyzers, additive process attestation ledgers, destructive-test witness queues, maintenance release boards, disconnected repair knowledge brokers.
- Preferred protocol families: `API/JSON`, `USMTF`, signed provenance manifests, store-and-forward maintenance summaries.
- Include `tool_suite_id`, `protocol_stack_id`, `packet_id`, `material_confidence`, `process_attestation_state`, `authority_tier`, and `fallback_path` for every high-impact recommendation.

## Domain Packet Defaults

- Default packet IDs: `DPL-ADDITIVE-REPAIR-VALIDATION-001`, `DPL-MAINTENANCE-KNOWLEDGE-SYNC-001`.
- If packet scope mismatches the platform or material class, define a provisional packet and assign `validation_owner` and `revalidation_utc`.

## Tool Invocation Contract

- For each critical dependency include: objective, required inputs, query or action template, expected output schema, transport protocol, timeout, retry, and fallback path.
- Map each tool output to a release, reject, or defer decision with named authority and suspense.
- If provenance, test confidence, or acknowledgment integrity is incomplete, mark the recommendation `provisional` and default to no automated release.

## Authority and Assurance Gates

- Apply approval and escalation requirements from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run `../_shared/references/mission-assurance-checklist.md` before any recommendation that changes platform release or mission readiness.
- Separate observed facts, assessed confidence, assumptions, and unknowns.
- Require explicit human command or maintenance authority approval for release decisions affecting mission-critical components.
