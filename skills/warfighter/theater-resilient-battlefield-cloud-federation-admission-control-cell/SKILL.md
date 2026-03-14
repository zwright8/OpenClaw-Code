---
name: theater-resilient-battlefield-cloud-federation-admission-control-cell
description: Govern admission, isolation, and workload priority across federated battlefield clouds and edge clusters. Use when contested links, compromised workloads, or mission-priority shifts require controlled cloud and edge access decisions.
---

# Theater Resilient Battlefield Cloud Federation Admission Control Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm enclave boundaries, mission-service criticality, workload trust posture, and commander decision timelines before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the cloud and edge federation topology, mission dependencies, trust indicators, and transport constraints.
2. Build one recommended admission posture plus alternatives to isolate, degrade, reroute, or deny workloads.
3. Bind each recommendation to workload-admission, artifact-trust, and dependency-graph tools with explicit protocolized outputs.
4. Publish degraded-mode branches when workload signatures, key material, or cross-domain reachback fall below threshold.

## Required Output Format

1. Situation snapshot.
2. Recommended admission branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now, next, and pre-delegated.
5. Staff tasking by owner and suspense.
6. Cloud federation packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: workload admission ladder, mission-service dependency cut list, contested compute restoration board.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-battlefield-cloud-federation-admission-control-v1` with `protocol_stack_id=ps-theater-battlefield-cloud-federation-admission-control-stack-v1`.
- Alternate: sovereign edge orchestration board plus signed workload attestation ledger.
- Degraded: mission-essential workloads only with commander-approved manual admission and UTC acknowledgment logging.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-BATTLEFIELD-CLOUD-ADMISSION-001` for critical recommendations.
- Prioritize these protocol families for this domain: signed workload manifests, `API/JSON`, `STIX/TAXII`, and `USMTF`.
- Include source system, refresh UTC, confidence, affected mission threads, and unresolved trust gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run assurance checks from `../_shared/references/us-joint-protocol-assurance-drill.md` and `../_shared/references/mission-assurance-checklist.md`.
- If admission authority, artifact provenance, or cross-domain acknowledgment status is uncertain, downgrade to advisory-only and require human command review.

## Guardrails

- Do not fabricate workload signatures, enclave authorities, or service-health evidence.
- Separate confirmed outages from predicted workload saturation or compromise spread.
- Flag coalition releasability, data-diode, and cross-domain guard constraints early.
