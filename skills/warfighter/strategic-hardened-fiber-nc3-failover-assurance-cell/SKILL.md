---
name: strategic-hardened-fiber-nc3-failover-assurance-cell
description: Harden NC3 continuity with authenticated fiber failover routes and emergency message integrity checks.
---

# Strategic Hardened Fiber NC3 Failover Assurance Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter operations.
- Confirm command authority, data handling limits, and decision timeline before recommendations.
- Keep outputs unclassified unless explicit handling guidance is provided.

## Workflow

1. Frame the operational problem, desired effect, constraints, and branch triggers.
2. Build primary and alternate options with confidence, dependencies, and timing.
3. Tie every critical recommendation to tool outputs and protocol exchange paths.
4. Publish commander decision prompts plus staff action tracker with owners and suspense.

## Required Output Format

1. Situation snapshot.
2. Recommended course of action.
3. Alternate/degraded branch.
4. Decision gates and authorities.
5. Staff tasks and suspense.

## Domain Products

Primary products: mission option matrix, protocol-bound tool invocation packet, risk and confidence register.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Use packet template `DPL-NC3-FIBER-001` from `../_shared/references/domain-tool-packet-library.md`.
- Bind tool and protocol choices to `ts-hardened-fiber-nc3-failover-v1` and `ps-hardened-fiber-nc3-failover-stack-v1` from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Align execution profile with `nc3-continuity-resilience-v1` from `../_shared/references/joint-operations-external-toolchain-profiles.md`.
- Include source freshness UTC, confidence, and degraded transition triggers.

## Guardrails

- Separate observed facts, assessed judgment, and unknowns.
- Flag any recommendation that lacks dual-source corroboration.
- Require explicit human approval before recommending actions that materially change force posture.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-hardened-fiber-nc3-failover-v1` with `protocol_stack_id=ps-hardened-fiber-nc3-failover-stack-v1`.
- Alternate: choose one profile-aligned suite from the shared catalog and document tradeoffs.
- Degraded: manual reporting and acknowledgment chain with explicit timing and confidence penalties.

## Domain Packet Defaults

- Default packet ID: `DPL-NC3-FIBER-001`.
- If scope mismatch exists, define a provisional packet and assign validation owner with suspense.

## Domain Toolchain Override (2026-03-12, Warfighter Expansion Wave XXIV)

- Add `tool_suite_id=ts-joint-mission-command-assurance-and-branch-synchronization-v1` + `protocol_stack_id=ps-joint-mission-command-assurance-and-branch-synchronization-stack-v1` when rapid branch synchronization and command-approval integrity are mission-limiting.
- Add `tool_suite_id=ts-joint-cross-domain-resilient-targeting-cde-governance-v1` + `protocol_stack_id=ps-joint-cross-domain-resilient-targeting-cde-governance-stack-v1` when targeting, CDE governance, or no-strike fidelity must be revalidated under degraded sensing.
- Add `tool_suite_id=ts-maritime-homeland-critical-infrastructure-cyber-physical-guard-v1` + `protocol_stack_id=ps-maritime-homeland-critical-infrastructure-cyber-physical-guard-stack-v1` when infrastructure protection and maritime-homeland continuity dependencies become critical.
- Add `packet_id=DPL-JOINT-MISSION-COMMAND-ASSURANCE-BRANCH-SYNCHRONIZATION-001`, `packet_id=DPL-JOINT-CROSS-DOMAIN-RESILIENT-TARGETING-CDE-GOVERNANCE-001`, and `packet_id=DPL-MARITIME-HOMELAND-CRITICAL-INFRASTRUCTURE-CYBER-PHYSICAL-GUARD-001` for high-consequence branches.

## Domain Toolchain Override (2026-03-14, Expansion Wave LI Addendum)

- Add `tool_suite_id=ts-theater-mobile-hardened-shelter-nc3-relay-antenna-reconstitution-v1` + `protocol_stack_id=ps-theater-mobile-hardened-shelter-nc3-relay-antenna-reconstitution-stack-v1` when failover assurance depends on mobile shelter survivability, relay restoration timing, or rapid antenna reconstitution after node displacement.
- Add `packet_id=DPL-MOBILE-NC3-RELAY-SHELTER-001` for branches that materially alter hardened failover timing, shelter allocation, or authenticated continuity posture.
