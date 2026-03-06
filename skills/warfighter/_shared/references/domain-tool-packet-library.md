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

### packet_id: DPL-EW-WAVE-001
- domain: joint electromagnetic protection and waveform agility
- objective: preserve link survivability by adapting waveforms under active jamming and sensing pressure
- primary_tools: EW protection planners, waveform mission-data managers, spectrum analytics
- alternate_tools: static emission plan with manual retune cycle
- degraded_mode: mission-essential comm windows with restrictive EMCON schedule
- input_requirements: threat emitters, mission phases, friendly waveform inventory, ROE constraints
- output_schema: waveform agility matrix, emcon timeline, risk-to-detection score
- protocol_profile: Link 16 J-series + USMTF + API/JSON
- validation_gates: interoperability pass, fratricide-spectrum check, commander approval

### packet_id: DPL-AUTON-WING-001
- domain: autonomous wingman engagement governance
- objective: enforce authority boundaries and human-control points for autonomous teammates
- primary_tools: autonomy mission manager, authority policy engine, engagement status dashboard
- alternate_tools: manual mission authority board with periodic validation calls
- degraded_mode: autonomy restricted to observe/assist behaviors only
- input_requirements: mission intent, authority matrix, ROE profile, communication latency bands
- output_schema: authority state table, engagement veto points, confidence ladder
- protocol_profile: API/JSON + USMTF
- validation_gates: legal-policy gate, human confirmation gate, autonomy confidence floor

### packet_id: DPL-GPS-APL-001
- domain: GPS-denied precision approach and landing
- objective: recover safe precision approaches with alternative navigation references
- primary_tools: terrain-referenced navigation planner, pseudolite manager, weather minima engine
- alternate_tools: TACAN/INS fallback plan with manual approach sequencing
- degraded_mode: non-precision approach with tightened risk thresholds
- input_requirements: runway status, nav aid availability, weather state, aircraft profile
- output_schema: approach option set, integrity confidence, go/no-go trigger list
- protocol_profile: USMTF + AIXM/FIXM + API/JSON
- validation_gates: nav integrity check, weather threshold check, aircrew concurrence

### packet_id: DPL-HUM-COR-001
- domain: coalition humanitarian corridor deconfliction
- objective: keep humanitarian corridors open while deconflicting military movement and fires
- primary_tools: coalition movement board, civil access tracker, corridor risk dashboard
- alternate_tools: liaison clearance log and scheduled convoy windows
- degraded_mode: manual corridor bulletin with 6-hour refresh
- input_requirements: protected routes, convoy manifests, conflict overlays, partner caveats
- output_schema: corridor status board, clearance queue, civilian risk annotation
- protocol_profile: NATO APP-11/ADatP-3 + OGC + USMTF
- validation_gates: humanitarian law check, coalition caveat check, route conflict pass

### packet_id: DPL-POLAR-CABLE-001
- domain: polar subsea cable sabotage detection
- objective: detect and prioritize response to probable cable sabotage events in polar waters
- primary_tools: subsea telemetry manager, maritime anomaly detector, ice-route intelligence feed
- alternate_tools: manual watch bill with periodic sensor sanity checks
- degraded_mode: patrol-centric anomaly reporting and conservative outage estimation
- input_requirements: cable segment map, sensor health, vessel activity, environmental baseline
- output_schema: anomaly shortlist, confidence rank, restoration patrol priorities
- protocol_profile: AIS/NMEA + USMTF + API/JSON
- validation_gates: sensor quality check, dual-source anomaly corroboration, legal review

### packet_id: DPL-BIOMFG-001
- domain: strategic biomanufacturing countermeasure surge
- objective: synchronize countermeasure production, quality release, and distribution under crisis timelines
- primary_tools: biomanufacturing MES, QA release registry, med logistics orchestrator
- alternate_tools: lot-level spreadsheet control with manual QA sign-off
- degraded_mode: priority-only production and distribution cycle
- input_requirements: line capacity, lot quality, demand forecast, cold chain constraints
- output_schema: surge schedule, lot release risk map, delivery timeline bands
- protocol_profile: API/JSON + HL7/FHIR + USMTF
- validation_gates: QA evidence check, cold-chain feasibility gate, medical authority validation

### packet_id: DPL-DIODE-CDS-001
- domain: expeditionary data-diode cross-domain synchronization
- objective: transfer mission-essential data across domain boundaries with releasability controls
- primary_tools: data-diode controller, cross-domain guard, schema transform validator
- alternate_tools: staged batch transfer with manual schema checks
- degraded_mode: text-only critical summary exchange on fixed cadence
- input_requirements: source schema, release policy tags, transfer window, destination schema
- output_schema: transfer manifest, transformed payload summary, validation status
- protocol_profile: XML/JSON + USMTF + API/JSON
- validation_gates: releasability gate, schema validation gate, provenance completeness gate

### packet_id: DPL-CIV-EVAC-001
- domain: civil defense mass evacuation and shelter coordination
- objective: prioritize evacuation flows and shelter assignment under life-safety constraints
- primary_tools: emergency ops dashboard, transport routing engine, shelter capacity system
- alternate_tools: paper evacuation sectors with manual shelter tally
- degraded_mode: neighborhood-level triage with limited transport allocation
- input_requirements: hazard map, population density, transport assets, shelter state
- output_schema: evacuation phase plan, shelter load distribution, life-safety risk list
- protocol_profile: NIMS/ICS + EDXL-DE + CAP
- validation_gates: life-safety gate, accessibility check, public-warning integrity check

### packet_id: DPL-EME-HARDEN-001
- domain: electromagnetic environmental effects hardening
- objective: reduce mission failure risk from EMI/EMP/HPM effects across key systems
- primary_tools: E3 modeling suite, platform vulnerability registry, mission assurance tracker
- alternate_tools: static hardening checklist with engineering review board
- degraded_mode: mission-priority hardening only with acceptance of residual risk
- input_requirements: platform inventory, threat profile, shielding state, mission priorities
- output_schema: hardening priority queue, residual risk estimate, retrofit schedule
- protocol_profile: API/JSON + USMTF
- validation_gates: engineering feasibility pass, mission impact delta review, authority approval

### packet_id: DPL-REDCELL-CAMP-001
- domain: joint campaign red-cell simulation and wargaming
- objective: stress-test campaign plans against adaptive adversary behavior and cascading failures
- primary_tools: campaign simulator, adversary model library, decision-gaming dashboard
- alternate_tools: manual red-team matrix and tabletop wargame
- degraded_mode: rapid branch challenge using constrained scenario set
- input_requirements: campaign phasing, force posture, assumptions, adversary objectives
- output_schema: branch vulnerability map, adaptation hypotheses, decision-point stress results
- protocol_profile: API/JSON + USMTF summary
- validation_gates: assumption traceability check, adversary realism review, commander decision relevance

### packet_id: DPL-MAR-AUTO-001
- domain: maritime autonomous vessel traffic control
- objective: deconflict crewed and uncrewed maritime traffic while preserving mission tempo
- primary_tools: autonomous vessel traffic manager, maritime COP, collision predictor
- alternate_tools: manual route sectors with watchstander arbitration
- degraded_mode: slow-speed controlled corridors and conservative separation minima
- input_requirements: track set, mission routes, sea state, rules-of-the-road constraints
- output_schema: traffic separation plan, collision-risk table, route change advisories
- protocol_profile: AIS/NMEA + API/JSON + USMTF
- validation_gates: COLREGS compliance check, collision-risk threshold, operator confirmation

### packet_id: DPL-ALLY-MUNI-001
- domain: allied munitions safety-stock interoperability
- objective: align allied munitions compatibility, storage safety, and cross-transfer priorities
- primary_tools: munitions inventory systems, interoperability catalogs, explosive safety tools
- alternate_tools: liaison safety workbook and manual compatibility matrix
- degraded_mode: approved munition subset transfers only
- input_requirements: lot data, storage conditions, compatibility rules, demand signal
- output_schema: transfer eligibility matrix, safety-stock deltas, risk flags
- protocol_profile: NATO logistics formats + USMTF + API/JSON
- validation_gates: explosive safety gate, compatibility pass, command approval record

### packet_id: DPL-QUANT-SENSE-001
- domain: tactical quantum sensing anomaly fusion
- objective: fuse quantum sensor anomalies with conventional ISR for decision-quality gains
- primary_tools: quantum feed broker, ISR fusion engine, calibration analytics
- alternate_tools: analyst-led anomaly board with periodic calibration checks
- degraded_mode: anomaly watchlist with delayed validation cycles
- input_requirements: sensor streams, calibration status, AOI, baseline signatures
- output_schema: anomaly table, corroboration status, retask recommendations
- protocol_profile: API/JSON + OGC + USMTF
- validation_gates: calibration confidence gate, multi-source corroboration, false-alarm threshold

### packet_id: DPL-DE-POWER-001
- domain: directed-energy thermal and power budgeting
- objective: optimize directed-energy usage within thermal and power limits during sustained operations
- primary_tools: DE fire-control planner, platform power manager, thermal model analytics
- alternate_tools: manual duty-cycle board and cooling schedule
- degraded_mode: burst-only DE employment with strict cooldown intervals
- input_requirements: power availability, thermal envelope, target set, duty cycle requirements
- output_schema: duty cycle schedule, thermal margin map, power allocation plan
- protocol_profile: API/JSON + USMTF
- validation_gates: thermal safety check, power sufficiency gate, mission priority confirmation

### packet_id: DPL-LEGAL-ATTRIB-001
- domain: contested legal attribution and state responsibility
- objective: build defensible attribution assessments for command and policy decision support
- primary_tools: digital forensics chain manager, attribution analytics, legal workflow tracker
- alternate_tools: manual evidentiary matrix and legal review panel
- degraded_mode: preliminary attribution posture with explicit uncertainty bounds
- input_requirements: incident evidence, chain-of-custody state, actor hypotheses, legal criteria
- output_schema: attribution confidence ladder, evidentiary gap list, escalation options
- protocol_profile: STIX/TAXII + API/JSON + USMTF
- validation_gates: chain-of-custody integrity, legal sufficiency check, policy authority review

### packet_id: DPL-SWX-PNT-001
- domain: space-weather pnt/comms degradation
- objective: preserve mission timing and communications through space-weather disturbance windows
- primary_tools: space-weather feed, timing integrity monitor, SATCOM resilience dashboard
- alternate_tools: forecast bulletin + manual comm priority matrix
- degraded_mode: mission-essential traffic only with timing tolerance expansion
- input_requirements: forecast severity, user priorities, service dependencies, timing tolerances
- output_schema: degradation forecast, fallback communications plan, timing risk bands
- protocol_profile: API/JSON + USMTF + Link 16 J-series
- validation_gates: forecast confidence floor, comms priority approval, timing integrity pass

### packet_id: DPL-CSWARM-LOG-001
- domain: counter-swarm logistics denial protection
- objective: protect logistics nodes and convoys from autonomous swarm disruption
- primary_tools: counter-swarm C2 suite, route risk engine, convoy defense dashboard
- alternate_tools: manual convoy timing offsets and local defense overlays
- degraded_mode: hardened resupply windows with reduced throughput
- input_requirements: convoy routes, swarm threat library, node criticality, available defenses
- output_schema: protected route plan, threat-response matrix, throughput impact estimate
- protocol_profile: Link 16 J-series + VMF + CoT
- validation_gates: route survivability check, defense coverage pass, command approval

### packet_id: DPL-WATERWAY-CTRL-001
- domain: expeditionary waterway denial and bridge control
- objective: control key waterways and bridge access to shape maneuver and sustainment
- primary_tools: riverine operations C2, bridge engineering planner, movement deconfliction board
- alternate_tools: manual crossing schedule and denial trigger card
- degraded_mode: local control sectors with reduced synchronization
- input_requirements: bridge inventory, traffic priorities, threat axes, engineer assets
- output_schema: bridge control matrix, denial trigger list, mobility impact estimate
- protocol_profile: VMF + CoT + USMTF
- validation_gates: engineer feasibility, fratricide mobility check, legal-policy check

### packet_id: DPL-DIGTWIN-INFRA-001
- domain: joint digital twin battlefield infrastructure
- objective: forecast infrastructure cascade failures and prioritize repair/resource actions
- primary_tools: digital twin simulation platform, telemetry ingestion bus, engineering dashboard
- alternate_tools: static network model and manual dependency map
- degraded_mode: high-value node simulation only on periodic cadence
- input_requirements: infrastructure graph, telemetry state, threat stressors, repair resources
- output_schema: failure cascade forecast, priority repair queue, mission impact estimate
- protocol_profile: OGC + API/JSON + USMTF
- validation_gates: model fidelity check, telemetry freshness gate, engineering review

### packet_id: DPL-CLIMATE-ADAPT-001
- domain: tactical climate hazard mission adaptation
- objective: adapt force posture and mission timing to acute climate and environmental hazards
- primary_tools: climate hazard model, weather effects planner, force health risk monitor
- alternate_tools: weather watch brief plus manual mission timing board
- degraded_mode: hazard avoidance windows with conservative maneuver constraints
- input_requirements: hazard forecasts, mission tasks, platform limits, force health constraints
- output_schema: adaptation recommendations, risk bands, trigger-based posture changes
- protocol_profile: API/JSON + OGC + USMTF
- validation_gates: forecast confidence check, force health threshold check, commander acceptance
