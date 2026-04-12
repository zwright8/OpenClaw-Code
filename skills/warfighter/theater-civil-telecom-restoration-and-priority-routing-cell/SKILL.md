---
name: theater-civil-telecom-restoration-and-priority-routing-cell
description: Restore mission-critical civil telecom and priority services when outages or congestion threaten command, medical, logistics, or emergency-response traffic. Use when operators must restore or reroute voice/data circuits without assuming unavailable priority entitlements.
---

# Theater Civil Telecom Restoration and Priority Routing Cell

## Mission Scope

- Treat this skill as planning and decision support for lawful telecom restoration, priority-service use, and fallback routing.
- Confirm command echelon, outage geography, supported national security or emergency preparedness functions, available authorities, and required decision timeline before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance and controlled data are provided.

## Problem Statement

- Civil telecom outages often create three simultaneous failures: operators lose the current circuit picture, they overestimate what carriers can restore, and they assume `GETS`, `WPS`, or `TSP` access exists when it does not.
- This skill converts outage data, carrier status, and verified priority-service posture into restoration and reroute branches that protect command, medical, logistics, and emergency-response traffic.

## Required Inputs

1. Outage footprint by site, circuit, service, and UTC last-update time, including carrier ticket or incident IDs.
2. Supported mission-essential functions ranked by priority, such as command posts, hospital links, logistics hubs, emergency operations centers, or public-safety coordination nodes.
3. Circuit inventory with provider, service address, service type, alternate path, and current Telecommunications Service Priority (`TSP`) status.
4. Government Emergency Telecommunications Service (`GETS`) and Wireless Priority Service (`WPS`) coverage by role, device, and watch position.
5. Current Points of Contact for carrier NOCs, organizational Priority Telecommunications Services administrators, local telecom shops, and NIMS/ICS coordination cells.
6. Available fallback paths such as alternate carriers, satellite, HF/VHF/UHF, secure mobile, land mobile radio, or couriered message traffic.
7. Authority boundaries, host-nation or civil-regulator constraints, and any protected-public-safety or medical traffic caveats.

## Workflow

1. Build the current telecom picture from outage alarms, carrier tickets, and the verified circuit inventory.
2. Verify which circuits already have `TSP`, which personnel or duty positions actually hold `GETS` or `WPS`, and where no priority entitlement exists.
3. Compare one recommended branch plus at least two alternatives with explicit tradeoffs in restoration speed, circuit confidence, traffic capacity, and coordination burden.
4. Bind each branch to exact tools, carrier or civil-authority touchpoints, priority-service procedures, and degraded fallbacks.
5. Publish commander-facing and staff-facing outputs with owners, suspense, validation steps, and revalidation triggers.

## Required Output Format

1. Situation snapshot with outage footprint, key changes, and confidence.
2. Recommended restoration or reroute branch and rationale.
3. Alternate and degraded branches with trigger conditions.
4. Decision points and authority requirements.
5. Staff tasks by owner and suspense.
6. Tool and protocol packet summary with circuit IDs, carrier touchpoints, and priority-service status.

## Domain Products

Primary products: critical-circuit restoration queue, telecom survivability map, priority-services status ledger, fallback-communications ladder.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-civil-telecom-priority-services-restoration-v1` with `protocol_stack_id=ps-theater-civil-telecom-priority-services-restoration-stack-v1`.
- Alternate: `tool_suite_id=ts-theater-satcom-hf-fallback-routing-v1` with `protocol_stack_id=ps-theater-satcom-hf-fallback-routing-stack-v1`.
- Degraded: authenticated voice or radio readback, printed circuit roster, manual UTC acknowledgment log, and command-approved courier fallback.

## Domain Packet Defaults

- Default packet IDs: `DPL-CIVIL-TELECOM-RESTORE-001`, `DPL-PRIORITY-SERVICES-STATUS-001`, `DPL-FALLBACK-COMS-LADDER-001`.
- If no packet fully matches, define a provisional packet using the shared schema and assign a validation owner.

## External Tools and Protocol Integration

- Use telecom OSS/BSS systems, carrier trouble-ticket portals, infrastructure telemetry APIs, NIMS/ICS coordination channels, and verified CISA Priority Telecommunications Services (`GETS`, `WPS`, `TSP`) records.
- Prefer `API/JSON`, signed carrier ticket export, `S/MIME`, NIMS/ICS message formats, and `USMTF` when the output must enter military battle rhythm products.
- Use `../_shared/references/external-tools-protocols.md`, `../_shared/references/tool-protocol-playbooks.md`, `../_shared/references/external-tool-endpoints-and-adapters.md`, and `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Include provenance metadata for every critical dependency: `primary_system`, `cross_check_system`, `refresh_utc`, `confidence`, `ticket_id`, and known gaps.

## Priority Telecommunications Services Playbook

1. `TSP` protocol:
   Confirm circuit ID, provider, service address, mission-essential function, current outage or provisioning ticket, and whether a valid `TSP` record already exists.
   If `TSP` already exists, include the carrier escalation path, restoration target, and current ticket reference in the packet.
   If `TSP` does not already exist, state `no verified TSP entitlement`, do not assume restoration priority, and publish a non-`TSP` fallback branch plus a post-incident enrollment action.
2. `GETS` protocol:
   Confirm the operator has current `GETS` credentials or approved stored-access method and validate the destination number.
   Use `GETS` for congested wireline or VoIP long-distance voice calling, or as the downstream leg after `WPS` when mobile origination is congested.
   Record the attempt UTC, originating device or location, outcome, and fallback path.
3. `WPS` protocol:
   Confirm the mobile number is enrolled for `WPS` and that the serving carrier supports it.
   From the enrolled device, dial `*272` immediately before the destination number.
   If the call does not complete, retry only within local SOP limits, then move to `GETS` or another approved transport and record that `WPS` provides queue priority but not call preemption.
4. `WPS + GETS` protocol:
   Use when the originating mobile leg is congested and the called network segment may also be stressed.
   Start with `WPS` on the enrolled device, then complete the call using the approved `GETS` sequence from the current organization job aid or approved dialer workflow.
   If the approved job aid or app is unavailable, downgrade to the manual branch and document the confidence loss.
5. Approved dialer and records protocol:
   Use an approved Priority Telecommunications Services dialer or current organizational job aid when available to reduce dialing errors.
   Validate Points of Contact, roster coverage, and pre-enrolled `TSP` circuits before the incident decision brief whenever time permits.

## Tool Invocation Contract

For each critical recommendation include:

- Objective and linked decision point.
- Required inputs, including circuit IDs, mission function, outage ticket, `TSP` status, `GETS/WPS` coverage, and authority check.
- Query or action template.
- Expected output schema with `refresh_sla_minutes`.
- Transport or protocol path.
- Fallback path, confidence impact, and revalidation trigger.
- `authority_tier`, `approval_role`, and `audit_record_id` when the branch changes restoration priority or civil-provider escalation posture.

## Interoperability and Validation Checklist

- Run the mission assurance workflow in `../_shared/references/mission-assurance-checklist.md` before final release.
- Validate that each product includes source provenance, protocol or message format, UTC refresh time, confidence, carrier ticket reference, and whether `GETS`, `WPS`, or `TSP` posture was verified rather than assumed.
- Cross-check every high-priority circuit against at least one secondary source such as a carrier ticket, local telecom controller, or emergency operations center log.
- Run `../_shared/references/us-joint-protocol-assurance-drill.md`, `../_shared/references/human-agent-command-escalation-matrix.md`, and `../_shared/references/warfighter-tool-authority-gates.md` before recommending posture-changing action.
- If data freshness, authority, or acknowledgment integrity is uncertain, downgrade to advisory-only and require human command review.

## Failure Handling

- If no verified `TSP` coverage exists for a critical circuit, publish a branch that uses standard carrier escalation, alternate routing, or mission redistribution instead of misrepresenting restoration priority.
- If `GETS` or `WPS` coverage is missing, unavailable, or attached to the wrong positions, shift to approved alternate transports and create an explicit readiness gap task.
- If carrier estimated restoration times conflict across sources, retain the fallback branch, mark the restoration estimate `provisional`, and set a revalidation suspense.
- If civil authority, host-nation approval, or emergency-management coordination is unavailable, use a constrained branch with manual readback logging and minimal-change routing until legitimacy is restored.

## Guardrails

- Flag every place where assumptions exceed verified outage, carrier, or enrollment data.
- Identify legal, policy, safety, civil-authority, and coalition interoperability constraints early.
- Separate facts, assessed judgments, and unknowns.
- Do not fabricate `TSP`, `GETS`, or `WPS` enrollment, carrier commitments, approval status, or civil-authority coordination.
- Do not recommend deceptive, unauthorized, or non-mission-essential use of priority telecommunications services.
- Keep outputs at restoration, routing, and continuity level; do not pivot into targeting, offensive cyber action, or harmful operational guidance.
