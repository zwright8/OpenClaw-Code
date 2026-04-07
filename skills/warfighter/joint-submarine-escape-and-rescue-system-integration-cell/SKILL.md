---
name: joint-submarine-escape-and-rescue-system-integration-cell
description: Coordinate submarine escape, rescue-system compatibility, decompression capacity, and survivor transfer decisions for U.S. warfighters. Use when commanders or maritime staffs must recover trapped submariners, stage rescue vessels, or synchronize chamber, medical, and coalition rescue support under contested or austere conditions.
---

# Joint Submarine Escape And Rescue System Integration Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm submarine class, probable survivor count, rescue-depth estimate, weather and sea-state windows, decompression capacity, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the rescue problem with last-known position confidence, platform damage assumptions, onboard life-support endurance, and available rescue assets.
2. Build one recommended COA and at least two alternatives with tradeoffs in time to first survivor recovery, rescue compatibility, medical risk, and exposure to adversary interference.
3. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
4. Identify commander decision points for rescue-vessel commitment, chamber allocation, coalition support, and degraded communications.
5. Publish commander-facing recommendations plus a staff tracker with owner, suspense, confidence, and branch triggers.

## Required Output Format

1. Situation snapshot and custody confidence.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and approval gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: rescue compatibility matrix, decompression chamber allocation board, survivor transfer timeline, and rescue-window risk brief.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-submarine-escape-rescue-system-integration-v1` with `protocol_stack_id=ps-joint-submarine-escape-rescue-system-integration-stack-v1`.
- Alternate: independent undersea rescue coordination board with manual mating-interface verification and medical cross-check.
- Degraded: commander-approved rescue branch using voice readbacks, paper chamber ledger, and UTC acknowledgment logging.

## Domain Packet Defaults

- Default packet ID: `DPL-SUBMARINE-ESCAPE-RESCUE-001`.
- Preferred `toolchain_id=TC-SUBRESCUE-126` and `toolchain_profile_id=submarine-escape-rescue-integration-v1`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: rescue-vessel readiness board, mating-interface compatibility matrix, decompression chamber status tracker, and survivor medical transfer board.
- Preferred protocol profiles for coordination and machine exchange: `USMTF`, signed rescue manifests, `AIS/NMEA`, `HL7/FHIR`, and `API/JSON`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md` for high-consequence recommendations.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for recommendations that can alter rescue posture or survivor transfer priorities.
- If authority, custody evidence, or medical handoff trust is uncertain, downgrade to advisory-only and require human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, rescue-asset compatibility, and chamber-allocation assumptions.
- If checks fail, provide a degraded-mode rescue branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag rescue-depth uncertainty, sea-state limits, diver safety, coalition access constraints, and decompression bottlenecks early.
- Protect survivor medical privacy and do not imply rescue authority the operator does not hold.
- Do not fabricate sources, approvals, or equipment compatibility.
