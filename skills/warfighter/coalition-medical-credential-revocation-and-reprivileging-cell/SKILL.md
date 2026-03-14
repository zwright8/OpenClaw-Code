---
name: coalition-medical-credential-revocation-and-reprivileging-cell
description: Restore coalition care capacity after cyber or trust failures disrupt medical credentials and privileging.
---

# Coalition Medical Credential Revocation And Reprivileging Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter coalition medical governance, care continuity, and clinical workforce assurance operations in this domain.
- Confirm authority, classification and releasability, patient-safety rules, and commander decision points before producing recommendations.
- Keep outputs advisory unless explicit command approval is documented.

## Workflow

1. Build the mission picture with revocation events, clinician roles, privileging status, bed demand, and coalition caveats.
2. Compare primary, alternate, and degraded branches with explicit trigger thresholds, patient-safety risks, and care-capacity tradeoffs.
3. Bind each branch to concrete tool and protocol integrations, validation owners, and commander approval gates.
4. Publish commander decision points, staff tasking, and revalidation windows for emergency privileging, revocation containment, and cross-border care actions.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternate and degraded branches with trigger thresholds.
4. Decision authorities, timing gates, and escalation criteria.
5. Staff actions with owner, suspense, and verification method.

## Domain Products

Primary products: credential trust board, emergency privileging ladder, care continuity packet.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Prioritize these tool families: clinician credential registries, revocation ledgers, emergency privileging workflows, and bed-load balancing boards.
- Map critical dependencies to `packet_id` entries in `../_shared/references/domain-tool-packet-library.md`; if missing, define provisional packets with validation owners.
- Bind each recommendation to concrete suite and stack entries in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Select or derive a matching toolchain profile from `../_shared/references/joint-operations-external-toolchain-profiles.md` when credential trust, coalition caveats, and patient-load branches interact.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-coalition-medical-credential-revocation-reprivileging-v1` with `protocol_stack_id=ps-coalition-medical-credential-revocation-reprivileging-stack-v1`.
- Alternate: manual credential witness board with emergency privileging committee and theater-by-theater license reconciliation.
- Degraded: life-, limb-, or eyesight-saving care only with commander-approved emergency privileges and explicit risk acknowledgment.

## Guardrails

- Separate observed facts, assessed confidence, and unknowns.
- Keep outputs at credential-governance, patient-safety, and care-continuity level; do not provide identity fraud, access abuse, or privacy-bypass instructions.
- If credential trust, legal basis, or clinical-load evidence is stale or incomplete, mark outputs `provisional` and provide a constrained branch.
- Escalate high-consequence recommendations using `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.

## Domain Packet Defaults

- Default packet ID: `DPL-COALITION-MEDICAL-CREDENTIAL-REPRIVILEGING-001`.
- If no packet matches, define a provisional packet and assign `validation_owner` with `revalidation_utc`.

## Operational Execution Hardening

- Require `ack_chain_status=verified` for mission-critical exchanges.
- Require `trust_score >= 0.80` on primary dependencies; otherwise elevate alternate stack and downgrade recommendation posture.
- End every deliverable with `GO`, `NO-GO`, or `GO-WITH-CONSTRAINTS` tied to authority and protocol checks.
