---
name: joint-battle-network-zero-trust-key-material-continuity-cell
description: Support U.S. warfighter planning and decision support for Joint Battle Network Zero Trust Key Material Continuity Cell. Use when missions require protocol-aware, authority-gated planning products in this domain.
---

# Joint Battle Network Zero Trust Key Material Continuity Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm command echelon, decision horizon, authority constraints, and commander decision points before producing recommendations.
- Default to releasable and unclassified outputs unless the user provides explicit handling and classification constraints.

## Core Workflow

1. Build a mission frame with intent, threat picture, constraints, assumptions, and required outcomes.
2. Develop a recommended option and at least two alternatives with explicit risk and timing tradeoffs.
3. Bind options to execution owners, suspense times, and branch and sequel triggers.
4. Cross-check critical assumptions against at least one independent source or tool path.
5. Publish a commander-ready brief plus machine-ingestible tool invocation packets.

## Required Output Structure

1. Situation snapshot and key changes.
2. Recommended option and rationale.
3. Alternatives with conditions and tradeoffs.
4. Decision points now, next, and pre-delegated.
5. Staff tasking matrix with owners and suspense.

## Domain Products

Primary products for this skill: key continuity branch plan, trust-anchor rotation timeline, denied-network crypto distribution packet.

## Domain Tool Stack

Use these tool categories as the default stack for this skill: PKI and KMI orchestration tools, tactical keying device telemetry, zero-trust policy engines.

## Protocol Profile

Preferred protocol families for this skill: X.509/PKI, API/JSON, USMTF.

## External Tool and Protocol Integration

- Execute the core integration workflow in ../_shared/references/external-tools-protocols.md.
- Use packet templates in ../_shared/references/tool-protocol-playbooks.md and ../_shared/references/domain-tool-packet-library.md.
- Bind each recommendation to mission-fit suites and protocol stacks from ../_shared/references/warfighter-external-tool-and-protocol-catalog.md.
- Include source provenance, protocol mapping, UTC refresh time, confidence, and fallback path for every critical dependency.

## Command and Authority Controls

- Apply authority gating from ../_shared/references/warfighter-tool-authority-gates.md.
- Use escalation rules from ../_shared/references/human-agent-command-escalation-matrix.md.
- If authority, legal basis, or data integrity is uncertain, downgrade to advisory-only and require human command review.

## Quality and Readiness Controls

- Run the mission assurance checklist in ../_shared/references/mission-assurance-checklist.md.
- Include tool health and trust fields from ../_shared/references/tool-health-and-trust-monitoring.md.
- Use after-action and readiness artifacts from ../_shared/references/operational-learning-and-after-action-loop.md and ../_shared/references/readiness-certification-evidence-pack.md.

## Guardrails

- Separate facts, assessed judgments, and unknowns.
- Flag assumptions that exceed available evidence.
- Identify legal, policy, ROE, coalition, and safety constraints early.
- Do not fabricate sources, authorities, approvals, or system access.

## Domain Toolchain Override (2026-03-12, Warfighter Expansion Wave XXIV)

- Add `tool_suite_id=ts-joint-mission-command-assurance-and-branch-synchronization-v1` + `protocol_stack_id=ps-joint-mission-command-assurance-and-branch-synchronization-stack-v1` when rapid branch synchronization and command-approval integrity are mission-limiting.
- Add `tool_suite_id=ts-joint-cross-domain-resilient-targeting-cde-governance-v1` + `protocol_stack_id=ps-joint-cross-domain-resilient-targeting-cde-governance-stack-v1` when targeting, CDE governance, or no-strike fidelity must be revalidated under degraded sensing.
- Add `tool_suite_id=ts-maritime-homeland-critical-infrastructure-cyber-physical-guard-v1` + `protocol_stack_id=ps-maritime-homeland-critical-infrastructure-cyber-physical-guard-stack-v1` when infrastructure protection and maritime-homeland continuity dependencies become critical.
- Add `packet_id=DPL-JOINT-MISSION-COMMAND-ASSURANCE-BRANCH-SYNCHRONIZATION-001`, `packet_id=DPL-JOINT-CROSS-DOMAIN-RESILIENT-TARGETING-CDE-GOVERNANCE-001`, and `packet_id=DPL-MARITIME-HOMELAND-CRITICAL-INFRASTRUCTURE-CYBER-PHYSICAL-GUARD-001` for high-consequence branches.

## Domain Toolchain Override (2026-03-14, Expansion Wave XLIII Addendum)

- Add `tool_suite_id=ts-joint-munition-dataload-crypto-fill-reconstitution-v1` + `protocol_stack_id=ps-joint-munition-dataload-crypto-fill-reconstitution-stack-v1` when trust continuity depends on verified mission-data reconstitution, checksum integrity, or release-authority preservation for weapon and EW systems.
- Add `packet_id=DPL-MUNITION-DATALOAD-CRYPTO-001` for recommendations that materially alter key continuity, dataload release timing, or commander trust posture.

## Domain Toolchain Override (2026-03-14, Expansion Wave XLIV Addendum)

- Add `tool_suite_id=ts-joint-tactical-edge-dataset-provenance-rollback-v1` + `protocol_stack_id=ps-joint-tactical-edge-dataset-provenance-rollback-stack-v1` when zero-trust continuity depends on validating edge dataset provenance, attestation integrity, or rollback authority after corruption indicators.
- Add `packet_id=DPL-TACTICAL-EDGE-DATASET-ROLLBACK-001` for recommendations that materially alter trust-anchor confidence, edge release posture, or rollback sequencing.
