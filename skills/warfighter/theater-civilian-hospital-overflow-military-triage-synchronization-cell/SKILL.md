---
name: theater-civilian-hospital-overflow-military-triage-synchronization-cell
description: Synchronize military medical-support, patient movement, and overflow coordination when civilian hospitals exceed surge capacity during disaster or domestic-support incidents.
---

# Theater Civilian Hospital Overflow Military Triage Synchronization Cell

## Problem Statement

When civilian hospitals exceed surge capacity, mission-support staffs need a shared picture of bed status, patient movement demand, already-assigned acuity categories, transport availability, and destination acceptance. This skill exists to support lawful overflow coordination, preserve continuity of care, and speed patient movement decisions without inventing capacity, changing medical triage determinations, or pushing patients into unsafe transfers.

## Allowed Use Boundaries

- Use this skill for lawful medical-surge coordination, civilian hospital decompression, patient movement planning, and staff synchronization.
- Use it to support noncombat disaster response, domestic-support missions, humanitarian relief, and continuity-of-care operations where military teams are helping civilian medical systems remain functional.
- Do not use it to prioritize patients by mission utility, support combat casualty routing for offensive action, bypass hospital acceptance or privacy rules, or provide bedside treatment instructions.
- If the requested outcome depends on overriding medical authority, fabricating receiving capacity, or moving patients without verified acceptance and transport suitability, stop and escalate for human decision.

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter mission-support teams coordinating civilian hospital overflow, patient movement, and public-health medical surge relief.
- Confirm civil-support authority, classification or releasability, privacy constraints, hospital acceptance rules, and required commander or medical-oversight decisions.
- Keep outputs advisory unless explicit command approval is documented.

## Required Inputs

Confirm these inputs before recommending a patient-movement branch:

- sending-facility status: staffed beds, surge beds, specialty-service availability, diversion posture, oxygen or power constraints, and latest UTC refresh time
- patient-movement demand: patient counts by medically assigned acuity category, destination-care requirement, isolation status, mobility limits, escort needs, and device dependencies
- receiving-facility acceptance: confirmed accepting sites, staffed bed types, specialty capabilities, transfer limits, and handoff contact information
- transport status: ground or air assets, lift constraints, route status, fuel posture, turnaround time, and contamination or infection-control limitations
- coordination context: healthcare coalition, medical operations coordination center, NDMS or federal patient movement status, task-force authorities, and current approval chain
- evidence freshness: last reconciliation time in UTC, conflicting reports, missing source systems, and known gaps in patient tracking or capacity boards

## Workflow

1. Build the mission picture using sending and receiving capacity, patient-movement demand, transport availability, staffing, and time-critical care constraints.
2. Compare primary, alternate, and degraded patient-movement branches with explicit trigger thresholds for destination acceptance, transport loss, specialty mismatch, and care-continuity risk.
3. Bind each branch to concrete tools, protocol paths, validation owners, privacy safeguards, and approval gates.
4. Publish commander and medical-coordination decision points, staff tasking, and revalidation windows that keep care continuity visible.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternate/degraded branches with trigger thresholds.
4. Decision authorities, timing gates, and escalation criteria.
5. Staff actions (owner, suspense, and verification method).

## Domain Products

Primary products: hospital overflow synchronization board, triage routing matrix, joint med-reg packet.

## External Tools and Protocol Integration

- Apply the Core Integration Protocol in `../_shared/references/external-tools-protocols.md` as the required sequence.
- Use scenario packet guidance in `../_shared/references/domain-tool-packet-library.md` and include packet mappings in every recommendation.
- Use `../_shared/references/tool-protocol-playbooks.md` for transport, handoff, and degraded-mode execution patterns.
- Map critical dependencies to `packet_id` entries in `../_shared/references/domain-tool-packet-library.md`; if missing, define provisional packets with validation owners.
- Bind each recommendation to concrete suite/stack entries in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Prefer these tool families for this domain: hospital bed and specialty-capability board, healthcare-coalition or MOCC coordination ledger, patient movement tracker, transport dispatch board, and staffing or resource status board.
- Prefer these protocol families for this domain: `HL7/FHIR`, `NIEM`, authenticated `API/JSON`, `S/MIME`, `NEMSIS`, and `USMTF` for structured staff coordination packets.
- Include provenance metadata for every tool-driven claim: source system, UTC refresh time, confidence, known gaps, and whether acceptance was machine-verified or verbally confirmed.

## Tool Invocation Contract

For each critical dependency include:

- objective
- required inputs
- query or action template
- expected output schema
- transport protocol
- fallback path and confidence impact

Use this exact tool sequence unless the operator states a justified override:

1. Hospital bed and specialty-capability board
   objective: confirm sending and receiving facility capacity, specialty services, and diversion posture
   required inputs: facility IDs, requested bed type, specialty need, transfer window, and latest UTC refresh
   query or action template: `query_capacity(facility_scope, bed_type, specialty_need, transfer_window_utc)`
   expected output schema: `{facility_id, bed_type, staffed_capacity, available_capacity, specialty_services[], diversion_status, last_refresh_utc}`
   transport protocol: `HL7/FHIR` or authenticated `API/JSON`
   fallback path: direct facility confirmation log with dual-source witness and confidence downgrade
2. Healthcare coalition or MOCC coordination ledger
   objective: align transfer demand, approvals, and regional surge constraints across civilian and military coordinators
   required inputs: incident ID, patient counts by acuity, requested support, approval role, and regional coordination channel
   query or action template: `publish_transfer_demand(incident_id, patient_summary, requested_support, approval_role, audit_record_id)`
   expected output schema: `{incident_id, request_id, support_status, coordinator, last_update_utc, blocking_issues[]}`
   transport protocol: `NIEM`, `USMTF`, or signed `API/JSON`
   fallback path: authenticated voice or text coordination log with UTC acknowledgment chain
3. Patient movement tracker
   objective: build a patient-hand-off manifest that preserves continuity-of-care requirements without changing medical triage decisions
   required inputs: patient movement roster, medically assigned acuity category, device dependencies, isolation status, escort requirement, and destination acceptance ID
   query or action template: `build_handoff_manifest(roster_id, acuity_profile, device_dependencies, destination_acceptance_id)`
   expected output schema: `{roster_id, patient_count, acuity_bands[], equipment_dependencies[], destination_acceptance_id, handoff_owner, last_refresh_utc}`
   transport protocol: `HL7/FHIR`, `NEMSIS`, or authenticated `API/JSON`
   fallback path: paper or spreadsheet manifest with manual two-person reconciliation before movement
4. Transport dispatch board
   objective: confirm transport mode, route viability, loading limits, and departure timing for the recommended branch
   required inputs: origin, destination, patient count, lift requirements, route status, and departure window
   query or action template: `allocate_transport_window(origin_id, destination_id, patient_profile, lift_requirements, departure_window_utc)`
   expected output schema: `{dispatch_id, transport_mode, capacity, route_status, departure_window_utc, loading_constraints[], last_refresh_utc}`
   transport protocol: authenticated `API/JSON`, signed dispatch message, or `S/MIME`
   fallback path: manual dispatch worksheet with callback verification and explicit confidence reduction

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-civilian-hospital-overflow-military-triage-synchronization-v1` with `protocol_stack_id=ps-theater-civilian-hospital-overflow-military-triage-synchronization-stack-v1`.
- Alternate: `tool_suite_id=ts-joint-c2-fusion-v1` with `protocol_stack_id=ps-cop-event-sharing-stack-v1`.
- Degraded: authenticated voice/text branch with UTC event logs, cross-check witness, and delayed machine reconciliation.

## Validation and Assurance

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Confirm sending and receiving facilities agree on patient counts, acuity bands, specialty-care requirements, device dependencies, and departure windows.
- Cross-check primary bed-status and transport data with a second source or direct facility confirmation before recommending movement that changes care location.
- Validate that every product includes `tool_suite_id`, `protocol_stack_id`, `packet_id`, UTC freshness, acceptance owner, privacy or releasability constraints, and known gaps.
- If interoperability, destination acceptance, privacy handling, or data freshness checks fail, mark the recommendation `advisory_only: true` and publish a degraded branch with explicit operator actions.

## Failure Handling and Degraded Operations

- If sending or receiving bed boards are stale or conflicting, freeze routing changes, request direct facility confirmation, and publish a time-bounded revalidation trigger.
- If no receiving facility or transport asset is confirmed, return `NO-GO` or `GO-WITH-CONSTRAINTS` for movement and escalate to the healthcare coalition, MOCC, or NDMS support channel instead of inventing capacity.
- If patient identifiers, device dependencies, infection-control constraints, or escort requirements are incomplete, block the movement recommendation until the handoff manifest is corrected.
- If machine-to-machine exchange fails, shift to the degraded authenticated voice or text branch with UTC logs, dual-witness reconciliation, and delayed digital reconciliation.
- If legal authority, privacy basis, or civil-support approval is uncertain, stop at decision support and request human review rather than improvising a transfer path.

## Guardrails

- Separate observed facts, assessed confidence, and unknowns.
- Do not change medical triage categories, receiving-facility acceptance status, or transport suitability without verified clinical or dispatch authority.
- Keep outputs at patient movement, bed-capacity, and interagency coordination level; do not provide bedside treatment instructions or prioritize patients based on combat utility.
- If tool trust, authority, or data freshness is below threshold, mark outputs `provisional` and provide a constrained branch.
- Do not fabricate bed availability, transport windows, hospital acceptance, or patient movement provenance.
- Escalate high-consequence recommendations using `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.

## Domain Packet Defaults

- Default packet IDs: `DPL-THEATER-CIVILIAN-HOSPITAL-OVERFLOW-MILITARY-TRIAGE-SYNCHRONIZATION-001`.
- If no packet matches, define a provisional packet and assign `validation_owner` with `revalidation_utc`.

## Operational Execution Hardening

- Require `ack_chain_status=verified` for mission-critical exchanges.
- Require `trust_score >= 0.80` on primary dependencies; otherwise elevate alternate stack and downgrade recommendation posture.
- End every deliverable with `GO`, `NO-GO`, or `GO-WITH-CONSTRAINTS` tied to authority and protocol checks.
