---
name: joint-disconnected-mission-ai-model-update-attestation-cell
description: Verify and stage disconnected AI model updates with signed provenance, rollback safety, and mission-thread compatibility.
---

# Joint Disconnected Mission AI Model Update Attestation Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter mission-AI assurance, cyber defense, and disconnected software release operations in this domain.
- Confirm authority, classification and releasability, model-governance limits, and commander decision points before producing recommendations.
- Keep outputs advisory unless explicit command approval is documented.

## Workflow

1. Build the mission picture with update packages, signature chains, compatibility results, rollback readiness, and mission context.
2. Compare primary, alternate, and degraded branches with explicit trigger thresholds, provenance risks, and mission-assurance tradeoffs.
3. Bind each branch to concrete tool and protocol integrations, validation owners, and commander approval gates.
4. Publish commander decision points, staff tasking, and revalidation windows for model release, rollback preparation, and mission-thread compatibility actions.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternate and degraded branches with trigger thresholds.
4. Decision authorities, timing gates, and escalation criteria.
5. Staff actions with owner, suspense, and verification method.

## Domain Products

Primary products: model-release board, attestation ladder, rollback packet.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Prioritize these tool families: model attestation ledgers, artifact-signature verifiers, mission-thread compatibility boards, and rollback workflows.
- Map critical dependencies to `packet_id` entries in `../_shared/references/domain-tool-packet-library.md`; if missing, define provisional packets with validation owners.
- Bind each recommendation to concrete suite and stack entries in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Select or derive a matching toolchain profile from `../_shared/references/joint-operations-external-toolchain-profiles.md` when software provenance, cyber threat, and mission release branches interact.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-disconnected-mission-ai-model-update-attestation-v1` with `protocol_stack_id=ps-joint-disconnected-mission-ai-model-update-attestation-stack-v1`.
- Alternate: manual signature witness board with staged update holds and rollback checks.
- Degraded: no new model release unless safety-critical patch with dual approval and rollback-ready baseline.

## Guardrails

- Separate observed facts, assessed confidence, and unknowns.
- Keep outputs at update governance, rollback safety, and mission assurance level; do not provide model-exfiltration, exploit, or safeguard-bypass instructions.
- If provenance, compatibility, or rollback evidence is stale or incomplete, mark outputs `provisional` and provide a constrained branch.
- Escalate high-consequence recommendations using `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.

## Domain Packet Defaults

- Default packet ID: `DPL-JOINT-DISCONNECTED-AI-MODEL-UPDATE-ATTESTATION-001`.
- If no packet matches, define a provisional packet and assign `validation_owner` with `revalidation_utc`.

## Operational Execution Hardening

- Require `ack_chain_status=verified` for mission-critical exchanges.
- Require `trust_score >= 0.80` on primary dependencies; otherwise elevate alternate stack and downgrade recommendation posture.
- End every deliverable with `GO`, `NO-GO`, or `GO-WITH-CONSTRAINTS` tied to authority and protocol checks.
