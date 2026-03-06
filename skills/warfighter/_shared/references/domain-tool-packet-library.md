# Domain Tool Packet Library

Use this reference to select domain-specific external tool packets with explicit protocol mappings. Pair with `external-tools-protocols.md` and `tool-protocol-playbooks.md`.

## Packet Schema

Use this schema in outputs:

```text
packet_id:
domain:
objective:
primary_tools:
alternate_tools:
degraded_mode:
input_requirements:
output_schema:
protocol_profile:
validation_gates:
```

## Domain Packets

### packet_id: DPL-ICELOG-001
- domain: contested logistics and ice-corridor sustainment
- objective: protect and reroute arctic sustainment under weather and threat disruption
- primary_tools: polar logistics COP, ice/ocean weather feeds, strategic sealift dashboards
- alternate_tools: manual convoy route board plus delayed meteorological products
- degraded_mode: SATCOM text-only sustainment update every 4 hours
- input_requirements: AOI, choke points, convoy schedule, weather severity index, threat level
- output_schema: route option list, risk score, fuel/day estimate, commander decision trigger
- protocol_profile: USMTF + AIS/NMEA + OGC
- validation_gates: freshness <= 2h, dual-source route confirmation, releasability tags

### packet_id: DPL-CUAS-URBAN-001
- domain: counter-drone urban airspace defense
- objective: detect, classify, and deconflict hostile UAS in dense urban airspace
- primary_tools: FAAD C2, urban airspace manager, RF detection network
- alternate_tools: visual observer net plus ATAK track board
- degraded_mode: sector manual reporting via voice + CoT snapshots
- input_requirements: no-fly overlays, critical sites, known friendlies, UAS signatures
- output_schema: threat track table, engagement recommendation class, deconfliction map
- protocol_profile: Link 16 J-series + VMF + CoT
- validation_gates: friend-or-foe cross-check, collateral risk flag, human release authority

### packet_id: DPL-RAILPORT-001
- domain: expeditionary rail and port repair
- objective: sequence high-payoff restoration of rail-port throughput for theater sustainment
- primary_tools: engineer project tracker, port movement dashboard, rail telemetry
- alternate_tools: manual repair board and logistics estimate workbook
- degraded_mode: daily USMTF movement summary with static priority list
- input_requirements: damage registry, repair teams, parts inventory, throughput target
- output_schema: prioritized repair queue, ETA bands, dependency graph
- protocol_profile: USMTF + API/JSON + OGC
- validation_gates: engineering feasibility check, logistics confirmation, timeline confidence score

### packet_id: DPL-CEMA-BDA-001
- domain: cyber electromagnetic battle damage assessment
- objective: assess mission impact of cyber and EW actions against adversary systems
- primary_tools: SIEM/SOAR, EW effects analytics, mission impact dashboard
- alternate_tools: incident bridge worksheet plus EW logs
- degraded_mode: 6-hour impact rollup with confidence bands
- input_requirements: target systems, observed effects, timeline, mission dependency map
- output_schema: effect-to-mission impact table, persistence estimate, recommended follow-on
- protocol_profile: STIX/TAXII + API/JSON + USMTF
- validation_gates: source provenance, effect attribution confidence, legal review checkpoint

### packet_id: DPL-LASERCOM-001
- domain: tactical lasercom and line-of-sight network management
- objective: preserve high-throughput resilient links under spectrum contestation
- primary_tools: lasercom planner, LOS path engine, SATCOM fallback manager
- alternate_tools: RF relay planner with fixed bandwidth allocation
- degraded_mode: critical traffic only via low-bandwidth relay
- input_requirements: terrain profile, node locations, weather obscuration, priority traffic classes
- output_schema: link plan, fallback tree, expected throughput and latency
- protocol_profile: API/JSON + USMTF + Link 16 J-series
- validation_gates: line-of-sight confidence, weather margin, key-node survivability

### packet_id: DPL-DECEPTION-IW-001
- domain: deception indicator and warning
- objective: identify adversary deception narratives and operational masking patterns
- primary_tools: all-source fusion board, narrative tracker, EW anomaly detector
- alternate_tools: analyst fusion notebook and daily deception checklist
- degraded_mode: manual red-flag bulletin every 12 hours
- input_requirements: collection reports, media corpus, EW baseline, adversary doctrine map
- output_schema: deception hypothesis set, confidence ladder, collection retask requests
- protocol_profile: USMTF + STIX/TAXII + CoT
- validation_gates: multi-int corroboration, red-team challenge, uncertainty statement

### packet_id: DPL-HR-ISR-001
- domain: hostage recovery intelligence fusion
- objective: synchronize ISR, pattern analysis, and recovery decision support
- primary_tools: personnel recovery management systems, ISR tasking broker, watchlist service
- alternate_tools: PRCC manual board and ISR collection matrix
- degraded_mode: releasable daily recovery estimate with delayed ISR refresh
- input_requirements: case file, likely locations, time-sensitive indicators, partner constraints
- output_schema: location probability map, timeline windows, recovery branch options
- protocol_profile: USMTF + VMF + CoT
- validation_gates: source vetting, partner releasability, legal/authority confirmation

### packet_id: DPL-ARCTIC-PREPO-001
- domain: arctic basing and prepositioning
- objective: optimize basing posture and stock placement for arctic operations
- primary_tools: arctic route planner, fuel and prepositioning tracker, weather/ice intelligence
- alternate_tools: seasonal planning workbook with manual route constraints
- degraded_mode: monthly prepositioning delta report with conservative assumptions
- input_requirements: force package, facility readiness, storage limits, climate forecast
- output_schema: basing options, stock placement matrix, risk-to-readiness assessment
- protocol_profile: USMTF + AIS/NMEA + OGC
- validation_gates: sustainment sufficiency check, environmental hazard threshold, host-nation constraints

### packet_id: DPL-MUNI-QA-001
- domain: munitions production resilience and quality surveillance
- objective: identify production bottlenecks and quality risks before operational impact
- primary_tools: industrial MES/SCADA, quality surveillance DB, lot traceability registry
- alternate_tools: plant report ingest and audit spreadsheet
- degraded_mode: weekly lot-risk briefing with reduced granularity
- input_requirements: line throughput, defect rates, supplier status, lot genealogy
- output_schema: bottleneck map, lot quality risk score, remediation queue
- protocol_profile: API/JSON + USMTF + XML
- validation_gates: QA evidence completeness, supplier verification, release authority tag

### packet_id: DPL-COAL-FIRES-001
- domain: coalition fires clearance and digital ROE
- objective: accelerate coalition fires approval with ROE-compliant digital evidence trail
- primary_tools: fires coordination systems, ROE decision support, coalition clearance tracker
- alternate_tools: liaison matrix and manual clearance log
- degraded_mode: voice coordination + delayed digital reconciliation
- input_requirements: target nomination, ROE profile, coalition caveats, collateral estimate
- output_schema: clearance status board, ROE rationale record, pending decision list
- protocol_profile: VMF + Link 16 J-series + NATO APP-11/ADatP-3
- validation_gates: ROE rule pass, coalition caveat check, command approval record

### packet_id: DPL-UNDERSEA-BARRIER-001
- domain: undersea chokepoint sensor barrier operations
- objective: sustain persistent sensing and cueing in chokepoint waters
- primary_tools: undersea sensor grid manager, maritime COP, ASW planner
- alternate_tools: patrol schedule board with manual correlation
- degraded_mode: periodic contact summary with reduced confidence
- input_requirements: chokepoint geometry, sensor health, acoustic environment, patrol schedule
- output_schema: contact track confidence table, barrier coverage gaps, retask plan
- protocol_profile: AIS/NMEA + Link 16 J-series + USMTF
- validation_gates: sensor calibration state, false-positive threshold, operator confirmation

### packet_id: DPL-MEGACITY-STAB-001
- domain: megacity essential services stabilization
- objective: sequence restoration of power, water, comms, and mobility under conflict
- primary_tools: infrastructure telemetry, civil support dashboard, movement/sustainment C2
- alternate_tools: utility liaison board and manual critical-node tracker
- degraded_mode: 24-hour stabilization status report with prioritization rubric
- input_requirements: critical services map, outage ledger, repair crews, population risk map
- output_schema: restoration priority queue, service impact estimate, branch triggers
- protocol_profile: NIMS/ICS + API/JSON + OGC
- validation_gates: life-safety priority check, dependency verification, humanitarian impact review

### packet_id: DPL-CASEVAC-AUTO-001
- domain: autonomous casualty evacuation routing
- objective: route casualties safely while balancing urgency, threat, and care capacity
- primary_tools: patient regulation systems, route-risk engine, autonomous transport controller
- alternate_tools: manual medevac board and route risk card
- degraded_mode: priority-only casualty movement recommendations
- input_requirements: patient triage category, pickup points, care facilities, route threats
- output_schema: recommended routes, transfer windows, care-level matching
- protocol_profile: HL7/FHIR + USMTF + API/JSON
- validation_gates: medical authority confirmation, route threat threshold, consent/handling tags

### packet_id: DPL-EMSIG-LIFECYCLE-001
- domain: electromagnetic signature lifecycle management
- objective: reduce detectability while preserving mission-essential emissions
- primary_tools: signature library, EW planning suite, mission data tool
- alternate_tools: platform emission worksheet and mission-specific controls
- degraded_mode: emission control posture with fixed windows
- input_requirements: platform set, mission phase, expected threat sensors, environmental mask
- output_schema: emission profile plan, risk-to-detection score, mitigation recommendations
- protocol_profile: Link 16 J-series + USMTF + API/JSON
- validation_gates: signature baseline check, mission impact delta, commander approval point

### packet_id: DPL-ORBIT-PNT-001
- domain: contested-orbit PNT augmentation
- objective: maintain timing and navigation integrity under GNSS denial or spoofing
- primary_tools: SDA catalogs, pseudolite planner, timing integrity monitor
- alternate_tools: terrain-referenced nav and trusted time transfer fallback
- degraded_mode: limited-area timing assurance cells with manual sync
- input_requirements: theater geometry, threat emitters, user platforms, timing tolerance
- output_schema: augmentation layout, integrity confidence map, failover sequence
- protocol_profile: API/JSON + USMTF + Link 16 J-series
- validation_gates: integrity threshold pass, spoofing confidence score, cross-source timing check

### packet_id: DPL-KILLWEB-MAP-001
- domain: adversary kill-web vulnerability mapping
- objective: expose fragile links in adversary sensor-to-shooter chains
- primary_tools: target-system analytics, kill-web graph engine, campaign assessment dashboard
- alternate_tools: manual chain map and effects scoring matrix
- degraded_mode: high-level vulnerability map by mission area
- input_requirements: adversary architecture, ISR feed quality, weapon timelines, protection posture
- output_schema: kill-web graph, vulnerability ranks, recommended disruption options
- protocol_profile: USMTF + API/JSON + STIX/TAXII
- validation_gates: source confidence floor, legal-policy review, escalation risk assessment
