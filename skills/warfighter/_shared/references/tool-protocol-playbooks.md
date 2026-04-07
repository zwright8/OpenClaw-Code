# Tool Protocol Playbooks (Warfighter)

Use these concise playbooks to turn tool recommendations into machine-ingestible and commander-readable packets.

## How to Use This File

1. Pick the playbook that matches your mission domain.
2. Fill the packet fields with mission-specific values and UTC timestamps.
3. Publish one machine-ingestible message and one commander summary.
4. Include primary, alternate, and degraded transport selections.
5. Attach adapter IDs and endpoint classes from `external-tool-endpoints-and-adapters.md`.

## Playbook: C2 and Battle Rhythm Updates

```text
Tool Invocation Packet
- Tool/System: GCCS-J/COP + workflow board
- Objective: Keep command decision cycle synchronized
- Inputs: unit, AOI, update interval, pending decisions
- Query or Action Template: pull latest COP deltas + task tracker changes
- Expected Output Schema: event_id, unit, location, status, suspense, owner, confidence
- Protocol/Transport: USMTF + CoT/API mirror
- Primary/Alternate/Degraded: COP bus / secure chat task sync / voice + manual log
- Fallback Procedure: publish decision tracker via USMTF text report every 30 min
- Confidence Impact if Degraded: medium
```

## Playbook: ISR and GEOINT Fusion

```text
Tool Invocation Packet
- Tool/System: DCGS/GEOINT exploitation + collection manager
- Objective: Build validated target/area understanding
- Inputs: AOI, named areas of interest, time window, priority intelligence requirements
- Query or Action Template: retrieve latest imagery/SIGINT summaries and retask for gaps
- Expected Output Schema: source_id, collection_time_utc, georef, finding, confidence, gap
- Protocol/Transport: OGC services + USMTF collection request
- Primary/Alternate/Degraded: DCGS pipeline / partner relay / manual analyst pull
- Fallback Procedure: issue manual RFI and annotate stale collection age
- Confidence Impact if Degraded: high
```

## Playbook: Airspace/Fires Deconfliction

```text
Tool Invocation Packet
- Tool/System: TBMCS/TAIS/AFATDS/JADOCS
- Objective: Prevent fratricide and timing conflicts during effects delivery
- Inputs: fire support coordination measures, ATO/ACO cycle, restricted operating zones
- Query or Action Template: cross-check planned effects against airspace control measures
- Expected Output Schema: mission_id, airspace_block, conflict_flag, resolution_action, owner
- Protocol/Transport: Link 16 J-series + VMF + USMTF
- Primary/Alternate/Degraded: automated deconfliction / manual cell review / voice-control net
- Fallback Procedure: enforce restrictive FSCMs and revalidate before execution
- Confidence Impact if Degraded: high
```

## Playbook: Sustainment and Mobility

```text
Tool Invocation Packet
- Tool/System: GCSS + movement control planner
- Objective: Sustain combat power under contested logistics
- Inputs: stock levels, movement requests, route threats, fuel demand
- Query or Action Template: reconcile supply deltas and route risk for next 24/72 hours
- Expected Output Schema: commodity, quantity_on_hand, burn_rate, convoy_plan, risk_score
- Protocol/Transport: USMTF + API/JSON + CoT route overlays
- Primary/Alternate/Degraded: automated logistics bus / nightly batch / manual spreadsheet rollup
- Fallback Procedure: publish minimum viable sustainment estimate with uncertainty bands
- Confidence Impact if Degraded: medium-high
```

## Playbook: Personnel and Family Readiness Casework

```text
Tool Invocation Packet
- Tool/System: family-readiness case portal + command task board
- Objective: stabilize a warfighter household problem before it degrades deployability, recovery, or retention
- Inputs: case type, duty timeline, household members, suspense dates, current support providers
- Query or Action Template: pull open cases, unresolved deadlines, and available support actions for the next 72 hours
- Expected Output Schema: case_id, household_risk, suspense, owner, support_option, confidence
- Protocol/Transport: NIEM + API/JSON + signed case note
- Primary/Alternate/Degraded: integrated case portal / staff workbook / voice + manual ledger
- Fallback Procedure: publish advisory-only task board with human confirmation required for any benefits or safety action
- Confidence Impact if Degraded: medium-high
```

## Playbook: Benefits and Eligibility Bridge

```text
Tool Invocation Packet
- Tool/System: DEERS or beneficiary system + TRICARE or state-benefit status board
- Objective: prevent coverage lapses and documentation drift during life-event or duty-status changes
- Inputs: sponsor status, dependent roster, state of residence, eligibility documents, recertification dates
- Query or Action Template: reconcile beneficiary state across systems and surface document or recertification blockers
- Expected Output Schema: dependent_id, benefit_program, current_status, blocker, next_action, confidence
- Protocol/Transport: NIEM + HL7/FHIR + API/JSON
- Primary/Alternate/Degraded: integrated eligibility sync / caseworker callback / manual checklist
- Fallback Procedure: issue coverage-risk ladder and escalate any urgent care or pharmacy risk for human action
- Confidence Impact if Degraded: high
```

## Playbook: Clearance Adjudication and Record Repair

```text
Tool Invocation Packet
- Tool/System: adjudication case tracker + personnel record board + debt or tax remediation queue
- Objective: preserve clearance eligibility by reconciling records and resolving financial or identity-driven risk
- Inputs: clearance posture, issue category, source documents, assignment timeline, current access status
- Query or Action Template: correlate adjudication blockers with record defects, debt or tax actions, and pending access decisions
- Expected Output Schema: person_id, issue_type, access_risk, remediation_step, suspense, confidence
- Protocol/Transport: NIEM + API/JSON + signed security notice
- Primary/Alternate/Degraded: integrated case manager / legal-assistance bridge / manual risk ledger
- Fallback Procedure: provide advisory-only remediation ladder and request human security review before any status claim
- Confidence Impact if Degraded: high
```

## Playbook: Workforce License Portability and Employment Continuity

```text
Tool Invocation Packet
- Tool/System: reciprocity matrix + employer continuity board + CEU tracker
- Objective: preserve spouse or transition-linked employment continuity across PCS, activation, or disruption
- Inputs: profession, destination jurisdiction, employer status, credential expiration, childcare or scheduling constraints
- Query or Action Template: reconcile portability path, employer options, and deadline risk for the next 30/60/90 days
- Expected Output Schema: person_id, license_path, employer_status, deadline, household_income_risk, confidence
- Protocol/Transport: NIEM + API/JSON + signed verification letter
- Primary/Alternate/Degraded: integrated portability board / manual reciprocity workbook / phone-confirmed deadline log
- Fallback Procedure: issue advisory-only portability tree and route hardship issues to relief or benefits support
- Confidence Impact if Degraded: medium-high
```

## Playbook: Cyber and Information Defense

```text
Tool Invocation Packet
- Tool/System: SIEM/SOAR + threat intel exchange
- Objective: Detect and contain cyber/information attacks impacting mission systems
- Inputs: event window, mission systems list, IOC feeds, current defensive posture
- Query or Action Template: correlate alerts with mission dependencies and trigger containment options
- Expected Output Schema: incident_id, system, severity, mission_effect, recommended_action, confidence
- Protocol/Transport: STIX/TAXII + API/JSON + USMTF summary
- Primary/Alternate/Degraded: automated playbooks / analyst triage / watchfloor manual reporting
- Fallback Procedure: isolate affected segment and issue commander impact statement
- Confidence Impact if Degraded: medium
```

## Playbook: Maritime and Undersea Security

```text
Tool Invocation Packet
- Tool/System: maritime COP + AIS/NMEA + subsea telemetry
- Objective: Protect sea lanes and critical undersea infrastructure
- Inputs: chokepoints, shipping patterns, sensor status, threat reports
- Query or Action Template: detect anomalous tracks/sensor outages and assign response priorities
- Expected Output Schema: track_id, zone, anomaly_type, time_utc, response_owner, confidence
- Protocol/Transport: AIS/NMEA + Link 16 + USMTF
- Primary/Alternate/Degraded: fused maritime COP / regional feed handoff / manual watch bill reporting
- Fallback Procedure: raise patrol density and publish uncertainty in lane risk estimate
- Confidence Impact if Degraded: medium-high
```

## Playbook: Medical Evacuation and Patient Movement

```text
Tool Invocation Packet
- Tool/System: patient regulation + med logistics + evacuation coordination
- Objective: Move casualties to definitive care within timeline thresholds
- Inputs: casualty category, bed status, transport availability, blood/oxygen state
- Query or Action Template: match casualty load to treatment/transport capacity
- Expected Output Schema: patient_category, pickup_site, destination, eta, resource_gap, confidence
- Protocol/Transport: USMTF medical + HL7/FHIR + API/JSON
- Primary/Alternate/Degraded: integrated med C2 / regional med cell / manual paper medevac board
- Fallback Procedure: prioritize by survivability window and annotate unmet demand
- Confidence Impact if Degraded: high
```

## Playbook: Space and SATCOM Resilience

```text
Tool Invocation Packet
- Tool/System: SDA catalog + SATCOM planner + spectrum monitor
- Objective: Maintain PNT/comms despite counterspace effects
- Inputs: satellite/service status, interference reports, user priority list
- Query or Action Template: assess service degradation and propose reroute/reconstitution sequence
- Expected Output Schema: service_id, degraded_function, alternate_path, restore_eta, confidence
- Protocol/Transport: API/JSON + USMTF + Link 16 where applicable
- Primary/Alternate/Degraded: automated network management / planned alternates / HF/LOS fallback
- Fallback Procedure: enforce comms priority matrix and issue timing delta by unit
- Confidence Impact if Degraded: medium-high
```

## Playbook: Autonomous Teaming Governance

```text
Tool Invocation Packet
- Tool/System: autonomy mission manager + authority policy engine
- Objective: enforce human command authority boundaries for autonomous teammates
- Inputs: mission phase, authority profile, ROE constraints, comms latency
- Query or Action Template: evaluate requested autonomous actions against authority matrix and veto points
- Expected Output Schema: action_id, authority_state, required_human_gate, confidence, override_path
- Protocol/Transport: API/JSON + USMTF command summary
- Primary/Alternate/Degraded: policy engine / manual authority board / autonomous observe-only mode
- Fallback Procedure: freeze autonomy to assist-only behaviors and notify command cell
- Confidence Impact if Degraded: medium-high
```

## Playbook: Civil Defense Evacuation and Shelter Operations

```text
Tool Invocation Packet
- Tool/System: emergency operations dashboard + evacuation routing + shelter manager
- Objective: move at-risk populations and prevent shelter overload
- Inputs: hazard map, population sectors, transport assets, shelter occupancy
- Query or Action Template: generate phased evacuation route and shelter assignment recommendations
- Expected Output Schema: sector_id, departure_window, route_id, shelter_id, occupancy_projection, risk
- Protocol/Transport: NIMS/ICS + EDXL-DE + CAP
- Primary/Alternate/Degraded: integrated dashboard / liaison board / local triage bulletin
- Fallback Procedure: prioritize life-safety sectors and issue manual zone bulletins every 2 hours
- Confidence Impact if Degraded: high
```

## Playbook: Cross-Domain Data Diode Synchronization

```text
Tool Invocation Packet
- Tool/System: data-diode controller + cross-domain guard + schema validator
- Objective: transfer mission-critical data between security domains with releasability controls
- Inputs: source payload, release tags, destination schema, sync window
- Query or Action Template: validate release policy, transform schema, publish one-way transfer manifest
- Expected Output Schema: transfer_id, source_hash, destination_hash, releasability_status, validation_state
- Protocol/Transport: XML/JSON + USMTF metadata wrapper
- Primary/Alternate/Degraded: automated diode sync / staged batch transfer / text-only critical summary
- Fallback Procedure: issue minimal critical report and schedule full sync at next approved window
- Confidence Impact if Degraded: medium
```

## Playbook: Nuclear Surety Incident Command

```text
Tool Invocation Packet
- Tool/System: radiological consequence board + surety incident command tracker
- Objective: coordinate protective actions and command decisions during nuclear surety incidents
- Inputs: incident location, contamination confidence, wind model, force/civil exposure map
- Query or Action Template: generate consequence branch options and rank by life-safety + mission continuity
- Expected Output Schema: incident_id, consequence_zone, protective_action, authority_gate, confidence
- Protocol/Transport: USMTF + NIMS/ICS + signed protective-action manifests
- Primary/Alternate/Degraded: integrated incident stack / manual consequence board / hourly conservative bulletins
- Fallback Procedure: publish protective-action minimum set and explicit revalidation timeline
- Confidence Impact if Degraded: high
```

## Playbook: Contested PNT and Time Transfer Assurance

```text
Tool Invocation Packet
- Tool/System: resilient timing fusion board + spoofing anomaly detector + holdover monitor
- Objective: preserve mission timing coherence and PNT confidence during denial/spoofing events
- Inputs: platform timing tolerances, anomaly alerts, oscillator confidence, mission criticality map
- Query or Action Template: issue time-transfer order, detect drift risk, and assign degraded navigation branches
- Expected Output Schema: unit_id, timing_state, drift_risk, transfer_action, authority_gate, confidence
- Protocol/Transport: USMTF + signed mission-time transfer manifests + API/JSON integrity events
- Primary/Alternate/Degraded: automated timing stack / manual witness ledger / mission-time cell reports
- Fallback Procedure: force conservative timing windows and downgrade precision-dependent effects
- Confidence Impact if Degraded: high
```
