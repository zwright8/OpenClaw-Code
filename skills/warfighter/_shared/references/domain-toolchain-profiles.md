# Domain Toolchain Profiles

Use this reference to bind each warfighter skill output to a concrete external-tool stack and protocol contract.

## Required Packet Fields

For every critical recommendation, include:

- `toolchain_id`: domain profile identifier from this file
- `primary_system`: system of record used for decision support
- `cross_check_system`: independent verification source
- `protocol_binding`: message/data protocol profile used for exchange
- `credential_scope`: required authority boundary and token role
- `fallback_path`: degraded-mode workflow when primary data source fails

## Toolchain Profiles

### `TC-MISSION-C2-001`

- Domain: mission command and joint C2 synchronization
- Primary systems: GCCS-J, JADOCS, AFATDS, CPOF
- Cross-check systems: DCGS federation node, coalition COP relay
- Protocol binding: USMTF + VMF + Link 16 J-series
- Fallback path: formatted voice report + CSV decision matrix over SIPR chat

### `TC-ISR-TGT-002`

- Domain: ISR fusion, targeting, and reattack logic
- Primary systems: DCGS, Palantir, MPE data fabric
- Cross-check systems: tactical UAS FMV archive, SIGINT report queue
- Protocol binding: STANAG 4609 + CoT + STIX/TAXII
- Fallback path: static target worksheet with manual mensuration checks

### `TC-AIR-MSL-003`

- Domain: air defense and missile warning/engagement support
- Primary systems: IBCS, C2BMC, Aegis C2 interface
- Cross-check systems: FAA/ADS-B feed gateway, allied track manager
- Protocol binding: Link 16 J-series + ICD-301 messages
- Fallback path: sectorized engagement matrix and voice-control net

### `TC-MAR-SUB-004`

- Domain: maritime surface, undersea, and chokepoint operations
- Primary systems: GCCS-M, Minotaur, distributed ASW mission manager
- Cross-check systems: SOSUS-like undersea feed, AIS intelligence broker
- Protocol binding: OTH-Gold + NMEA + NATO APP-11 tactical reports
- Fallback path: bearing-only contact boards and manual contact correlation

### `TC-LAND-MOB-005`

- Domain: land maneuver, mobility, and counter-obstacle operations
- Primary systems: TIGR/ATAK, AFATDS, engineer mission planner
- Cross-check systems: Blue Force Tracker, route reconnaissance packets
- Protocol binding: CoT + VMF + MIL-STD-2525 symbology exports
- Fallback path: paper strip maps with time-distance route cards

### `TC-SUST-MED-006`

- Domain: contested sustainment, medical regulation, and distribution
- Primary systems: GCSS-Army, GATES, TMDS
- Cross-check systems: convoy telematics, blood inventory ledger mirror
- Protocol binding: EDI X12 logistics packets + HL7/FHIR for patient flow
- Fallback path: prioritized load list and manual medevac board

### `TC-CYBER-EMSO-007`

- Domain: cyber operations, EW, and EMSO deconfliction
- Primary systems: SIEM/SOAR stack, EW mission management suite
- Cross-check systems: packet-capture sensor mesh, spectrum monitor grid
- Protocol binding: STIX/TAXII + syslog CEF + NATO EW reporting format
- Fallback path: playbook-driven manual containment and frequency blacklists

### `TC-SPACE-PNT-008`

- Domain: space support, PNT resilience, and launch/reconstitution planning
- Primary systems: SSA catalog broker, SATCOM network manager
- Cross-check systems: ground telescope feed, commercial ephemeris provider
- Protocol binding: CCSDS + TLE exchange + USMTF updates
- Fallback path: terrestrial timing beacon network and inertial nav uplift

### `TC-HUMAN-TERRAIN-009`

- Domain: civil affairs, information environment, and partner force advising
- Primary systems: MISO analysis platform, civil network mapper, partner CRM
- Cross-check systems: OSINT media verification queue, HUMINT summary board
- Protocol binding: CoT + STANAG 2022 human terrain reports
- Fallback path: commander update with confidence-banded influence map

### `TC-IND-STRAT-010`

- Domain: industrial mobilization, acquisition, and strategic competition
- Primary systems: ERP/PLM stack, contract lifecycle manager, supplier risk graph
- Cross-check systems: customs/shipping telemetry, financial sanctions monitor
- Protocol binding: NIEM + ISO 28000 event packets + STIX indicators
- Fallback path: manual supplier criticality matrix with weekly validation cycle

## Authority and Credential Protocol

1. Verify mission authority for each tool call before execution.
2. Match credential scope to need-to-know and releasability tags.
3. Log `operator_id`, `authz_basis`, and UTC timestamp for every external query.
4. Block automated action if tool output implies escalation outside commander intent.

## Interoperability Gate

- Do not publish recommendations until `toolchain_id`, `protocol_binding`, and `fallback_path` are present.
- Mark recommendation `provisional` if cross-check source is stale beyond mission SLA.

## Tool Health Binding Requirement

- Pair each selected `toolchain_id` with a tool health check sequence from `tool-health-and-trust-monitoring.md`.
- Include `tool_health_id`, `trust_score`, and `last_probe_utc` in the same packet that declares toolchain fields.
- If `trust_score < 0.70`, mark outputs `provisional`; if `trust_score < 0.50`, require degraded/no-go recommendation.

## New Toolchain Wave (2026-03-08, Signature Integrity and Contested Data)

### `TC-SIG-SURV-011`

- Domain: electronic signature survivability and thermal exposure reduction
- Primary systems: EW signature analytics, thermal exposure model, EMCON policy manager
- Cross-check systems: independent emitter monitor mesh, route-level adversary sensor baseline
- Protocol binding: Link 16 J-series + USMTF + API/JSON
- Fallback path: commander-approved signature control matrix with manual acknowledgment ledger

### `TC-BIO-SYNC-012`

- Domain: denied biometrics and watchlist synchronization
- Primary systems: biometric matcher cluster, watchlist synchronization broker, custody audit ledger
- Cross-check systems: local enclave watchlist mirror, independent false-match adjudication board
- Protocol binding: API/JSON + XML + USMTF metadata wrapper
- Fallback path: one-way hash digest sync plus delayed full-template reconciliation

### `TC-CISLUNAR-SDA-013`

- Domain: contested cislunar awareness and relay continuity
- Primary systems: cislunar track fusion, relay health manager, maneuver-risk inference service
- Cross-check systems: independent ephemeris provider, alternate conjunction risk monitor
- Protocol binding: CCSDS + API/JSON + USMTF warning summary
- Fallback path: confidence-banded warning timeline with constrained maneuver recommendations

### `TC-COAL-FIRES-LAT-014`

- Domain: coalition digital fires clearance latency reduction
- Primary systems: coalition fires workflow board, ROE rule engine, digital caveat adjudicator
- Cross-check systems: liaison officer clearance mirror, independent delay telemetry board
- Protocol binding: VMF + NATO APP-11/ADatP-3 + USMTF
- Fallback path: pre-approved target class playbook with voice-confirmed clearance ledger

### `TC-IND-SEMICON-015`

- Domain: strategic semiconductor fabrication disruption contingency
- Primary systems: fab telemetry hub, supplier criticality graph, mission-priority allocation planner
- Cross-check systems: independent supply-chain disruption monitor, part authenticity service
- Protocol binding: API/JSON + NIEM + USMTF strategic summary
- Fallback path: manual rationing board with defense-priority adjudication cycle

### `TC-MULTICLOUD-INTEG-016`

- Domain: contested multi-cloud mission data integrity and failover
- Primary systems: cross-cloud consistency auditor, cryptographic attestation service, mission-data failover orchestrator
- Cross-check systems: offline hash-chain ledger, independent divergence verifier
- Protocol binding: API/JSON + mTLS + USMTF command summary
- Fallback path: read-only trusted snapshot mode with delayed write reconciliation

## New Toolchain Wave (2026-03-09, Waterway Defense and Continuity Brokerage)

### `TC-WATERWAY-LOCK-017`

- Domain: dam and lock critical-waterway defense plus restoration sequencing
- Primary systems: hydrology risk engine, lock control telemetry, engineer mission planner
- Cross-check systems: independent floodplain model and civil waterway status mirror
- Protocol binding: NIMS/ICS + API/JSON + USMTF
- Fallback path: manual waterway status board with two-hour command synchronization

### `TC-NC3-FIBER-018`

- Domain: hardened fiber continuity and NC3-adjacent failover assurance
- Primary systems: protected route monitor, emergency message integrity validator, continuity orchestrator
- Cross-check systems: independent acknowledgment-chain ledger and alternate latency verifier
- Protocol binding: USMTF + signed continuity event stream + API/JSON
- Fallback path: minimum-essential continuity message loop with strict acknowledgment polling

### `TC-AEROMED-BROKER-019`

- Domain: multi-theater aeromedical evacuation priority brokerage
- Primary systems: patient regulation broker, theater lift optimizer, blood-inventory stress dashboard
- Cross-check systems: casualty severity adjudication cell and federated bed-status mirror
- Protocol binding: HL7/FHIR + USMTF + API/JSON
- Fallback path: category-1 and category-2 evacuation prioritization only with risk acceptance log

## New Toolchain Wave (2026-03-14, Expansion Wave XLII)

### `TC-LEGAL-ATTRIB-020`

- Domain: tactical legal attribution and evidentiary fusion
- Primary systems: evidence fusion workspace, legal sufficiency engine, custody-chain ledger
- Cross-check systems: independent forensic review queue and alternate attribution confidence board
- Protocol binding: STIX/TAXII + USMTF + NIEM + API/JSON
- Fallback path: advisory-only attribution worksheet with manual legal review

### `TC-TRUSTED-C2-VOICE-021`

- Domain: trusted command-path authentication and synthetic media spoof defense
- Primary systems: command-path authentication broker, media forensics engine, countersign workflow manager
- Cross-check systems: independent trust witness and alternate acknowledgment integrity ledger
- Protocol binding: signed voice-auth manifests + USMTF + STIX/TAXII + API/JSON
- Fallback path: manual countersign and dual-channel human confirmation only

### `TC-SOVEREIGN-CLOUD-022`

- Domain: sovereign compute migration and edge continuity governance
- Primary systems: workload dependency mapper, cutover orchestrator, data-trust verifier
- Cross-check systems: trusted snapshot ledger and independent rollback witness
- Protocol binding: signed continuity manifests + API/JSON + mTLS + USMTF
- Fallback path: mission-essential edge services only with delayed reconciliation

### `TC-PEDS-SURGE-023`

- Domain: expeditionary pediatric casualty balancing and austere care redistribution
- Primary systems: pediatric regulation board, specialty-capability matcher, evacuation balancing planner
- Cross-check systems: independent bed-status witness and alternate blood-stress monitor
- Protocol binding: HL7/FHIR + USMTF + NATO APP-11/ADatP-3 aligned + API/JSON
- Fallback path: life-saving redistribution only with conservative transfer thresholds

### `TC-SPACE-TIMING-024`

- Domain: ephemeris integrity and timing-confidence preservation for space-enabled operations
- Primary systems: ephemeris integrity analyzer, timing confidence monitor, fallback synchronization planner
- Cross-check systems: independent orbital-data witness and alternate terrestrial timing board
- Protocol binding: CCSDS + signed timing manifests + API/JSON + USMTF
- Fallback path: mission-essential timing windows only with strict drift thresholds

### `TC-COERCION-LOG-025`

- Domain: strategic economic coercion early warning and logistics fragility analysis
- Primary systems: coercion indicator board, route fragility mapper, supplier pressure monitor
- Cross-check systems: independent market-shock witness and alternate carrier availability tracker
- Protocol binding: STIX/TAXII + USMTF + signed logistics manifests + API/JSON
- Fallback path: mission-essential route watchboard with daily commander update

## New Toolchain Wave (2026-03-14, Expansion Wave XLIII)

### `TC-MACHINETOOL-FORGING-026`

- Domain: strategic machine-tool and forging capacity prioritization
- Primary systems: machine-tool capacity board, die and forge readiness ledger, heat-treatment queue manager
- Cross-check systems: independent depot demand witness and alternate industrial outage tracker
- Protocol binding: signed production manifests + API/JSON + USMTF + OPC UA
- Fallback path: mission-essential workorders only with daily release review

### `TC-COMPOSITE-PREPREG-027`

- Domain: strategic composite prepreg and resin defense allocation
- Primary systems: material pedigree ledger, freezer inventory dashboard, autoclave capacity scheduler
- Cross-check systems: independent shelf-life witness and alternate cure-capacity board
- Protocol binding: signed material-cert manifests + API/JSON + USMTF + OPC UA
- Fallback path: mission-essential composite lots only with conservative release thresholds

### `TC-BEARING-GEARBOX-028`

- Domain: strategic bearing and gearbox surge assurance
- Primary systems: bearing pedigree ledger, drivetrain health board, depot repair queue manager
- Cross-check systems: independent lot-authenticity witness and alternate substitution tracker
- Protocol binding: signed supply manifests + API/JSON + USMTF + NIEM
- Fallback path: mission-essential platform components only with strict release gates

### `TC-INDUSTRIAL-GAS-029`

- Domain: theater bulk industrial gas and oxygen priority
- Primary systems: cryogenic tank telemetry board, refill scheduler, demand adjudication tracker
- Cross-check systems: independent purity witness and alternate transport-availability board
- Protocol binding: HL7/FHIR + signed logistics manifests + API/JSON + USMTF
- Fallback path: medical and mission-essential gas distribution only with command-approved rationing

### `TC-DATALOAD-CRYPTO-030`

- Domain: joint munition dataload and crypto-fill reconstitution
- Primary systems: secure dataload repository, KMI broker, mission-data validation harness
- Cross-check systems: independent checksum witness and alternate trust-anchor ledger
- Protocol binding: X.509/PKI + signed mission-data manifests + API/JSON + USMTF
- Fallback path: human-verified limited release only with commander-approved fallback loads

### `TC-NEO-ID-FRAUD-031`

- Domain: coalition noncombatant evacuation identity-fraud suppression
- Primary systems: document-authentication workbench, watchlist deconfliction service, family-link adjudication board
- Cross-check systems: independent liaison witness and alternate family-accountability tracker
- Protocol binding: NIEM + CJIS + API/JSON + USMTF + ICAO Doc 9303 aligned exchange
- Fallback path: life-safety-first screening with protected hold-and-review lanes

### `TC-HARBOR-TUG-032`

- Domain: strategic harbor tug and pilotage sealift priority
- Primary systems: harbor movement board, tug availability tracker, pilot roster ledger
- Cross-check systems: independent berth-status witness and alternate channel-access board
- Protocol binding: AIS/NMEA + OGC + signed port manifests + API/JSON + USMTF
- Fallback path: military-essential sailings only with fixed tug and pilot release windows

### `TC-LUBE-HYD-033`

- Domain: homeland defense specialty lubricant and hydraulic-fluid allocation
- Primary systems: fluid pedigree ledger, contamination test board, defense-load priority tracker
- Cross-check systems: independent compatibility witness and alternate refill board
- Protocol binding: signed material-cert manifests + API/JSON + USMTF + NIEM
- Fallback path: mission-essential systems only with conservative substitution and refill approval

## New Toolchain Wave (2026-03-14, Expansion Wave XLIV)

### `TC-AIRBASE-RECOV-034`

- Domain: joint airbase arresting gear and runway-end cable reconstitution
- Primary systems: runway arresting-system health monitor, expeditionary engineer scheduler, sortie regeneration board
- Cross-check systems: independent cable-set witness and alternate airworthiness release board
- Protocol binding: USMTF + AIXM/FIXM + API/JSON + signed maintenance manifests
- Fallback path: precleared aircraft profiles only with commander-approved runway limits

### `TC-MUNI-TRACE-035`

- Domain: coalition munitions end-use diversion and serial trace governance
- Primary systems: serial-trace ledger, transfer authorization board, end-use anomaly detector
- Cross-check systems: independent receipt witness and alternate coalition custody audit board
- Protocol binding: NIEM + USMTF + signed custody manifests + API/JSON + NATO APP-11/ADatP-3 aligned exchange
- Fallback path: highest-priority munitions only with dual-control receipt confirmation

### `TC-AUTON-CONVOY-036`

- Domain: spectrum-dependent autonomy convoy integrity under jamming or control-path degradation
- Primary systems: autonomy telemetry broker, spectrum monitor grid, convoy mission manager
- Cross-check systems: independent navigation-confidence witness and alternate route-risk board
- Protocol binding: CoT + VMF + signed autonomy attestations + API/JSON + USMTF
- Fallback path: human-led convoy operations with restricted autonomy assist functions only

### `TC-IMAGERY-RETASK-037`

- Domain: commercial satellite imagery denial and priority retask governance
- Primary systems: collection broker, commercial imagery tasking manager, priority adjudication board
- Cross-check systems: independent collection witness and alternate national or coalition ISR allocation board
- Protocol binding: STANAG 4559 + OGC + API/JSON + USMTF
- Fallback path: critical-named-area-only retask queue with explicit commander reprioritization

### `TC-PHOTONICS-038`

- Domain: strategic photonics, laser optics, and specialty electro-optical allocation
- Primary systems: optical-material pedigree ledger, coating-line scheduler, sensor-build priority tracker
- Cross-check systems: independent quality witness and alternate directed-energy demand board
- Protocol binding: signed material-cert manifests + API/JSON + USMTF + OPC UA
- Fallback path: mission-essential sensor and laser lots only with conservative release thresholds

### `TC-BURN-TRANSFER-039`

- Domain: expeditionary burn-bed transfer, escharotomy capacity, and blood rotation assurance
- Primary systems: burn-bed regulation board, transfusion stress tracker, aeromedical routing broker
- Cross-check systems: independent surgical-capability witness and alternate blood-inventory mirror
- Protocol binding: HL7/FHIR + USMTF + NATO APP-11/ADatP-3 aligned + API/JSON
- Fallback path: life-saving burn transfers only with conservative transfusion thresholds

### `TC-RAIL-HAZMAT-040`

- Domain: homeland rail hazmat and military-priority deconfliction
- Primary systems: rail movement board, hazmat compliance ledger, military force-flow scheduler
- Cross-check systems: independent civil rail-status witness and alternate emergency-management queue board
- Protocol binding: NIMS/ICS + EDI X12 + API/JSON + USMTF
- Fallback path: military-essential moves only with hazmat hold points and manual dispatch approval

### `TC-EDGE-DATA-041`

- Domain: tactical-edge dataset provenance, rollback, and trust restoration
- Primary systems: edge dataset registry, model rollback orchestrator, integrity attestation service
- Cross-check systems: independent checksum witness and alternate baseline snapshot ledger
- Protocol binding: signed dataset manifests + API/JSON + STIX/TAXII + USMTF
- Fallback path: approved-baseline snapshots only with human release for edge updates

## New Toolchain Wave (2026-03-14, Expansion Wave XLV)

### `TC-CRAF-AIRLIFT-042`

- Domain: reserve airlift activation and civil cargo prioritization
- Primary systems: airlift activation board, cargo visibility dashboard, civil-carrier commitment tracker
- Cross-check systems: independent carrier availability witness and alternate ramp-slot board
- Protocol binding: AIXM/FIXM + IATA Cargo-IMP + API/JSON + USMTF
- Fallback path: mission-essential lift only with daily commander review

### `TC-AIR-REFUEL-043`

- Domain: aerial refueling boom and drogue surge reconstitution
- Primary systems: tanker health monitor, maintenance scheduler, receiver-priority board
- Cross-check systems: independent airworthiness witness and alternate tanker-status mirror
- Protocol binding: USMTF + Link 16 J-series + AIXM/FIXM + signed maintenance manifests + API/JSON
- Fallback path: highest-priority receivers only with commander-approved fuel rationing

### `TC-MISSION-SBOM-044`

- Domain: emergency mission-software patch governance and SBOM trust
- Primary systems: SBOM registry, vulnerability prioritization board, deployment orchestrator
- Cross-check systems: independent artifact attestation service and alternate rollback witness
- Protocol binding: CycloneDX/SPDX + STIX/TAXII + signed deployment manifests + API/JSON + USMTF
- Fallback path: isolate-and-monitor only with rollback-ready baseline

### `TC-TURBINE-MATL-045`

- Domain: turbine superalloy, casting, and thermal-barrier-coating prioritization
- Primary systems: superalloy pedigree ledger, casting and coating scheduler, engine repair board
- Cross-check systems: independent metallurgical witness and alternate depot demand tracker
- Protocol binding: signed material-cert manifests + API/JSON + USMTF + OPC UA
- Fallback path: mission-essential engine lots only with conservative release thresholds

### `TC-ORDER-AUTH-046`

- Domain: digital-order watermark authenticity, recall, and reissue control
- Primary systems: order-routing gateway, signature verifier, acknowledgment ledger
- Cross-check systems: independent countersign witness and alternate distribution board
- Protocol binding: signed order manifests + USMTF + STIX/TAXII + API/JSON
- Fallback path: hold and reissue only with dual-channel human confirmation

### `TC-WATER-RESTART-047`

- Domain: potable-water restart, sampling, and health-protection control
- Primary systems: water-quality dashboard, facility isolation board, preventive-medicine tracker
- Cross-check systems: independent sampling-lab witness and alternate public-works status board
- Protocol binding: HL7/FHIR + NIMS/ICS + API/JSON + USMTF
- Fallback path: restricted-potable-use posture with mission-essential facility release only

### `TC-COAL-AIRLIFT-048`

- Domain: coalition host-nation civil-airlift clearance and ramp management
- Primary systems: coalition slot board, diplomatic-clearance tracker, ramp-ops dashboard
- Cross-check systems: liaison witness and alternate host-nation access board
- Protocol binding: AIXM/FIXM + NIEM + API/JSON + USMTF + ICAO diplomatic-clearance exchange
- Fallback path: protected or mission-essential sorties only with liaison-confirmed clearances

### `TC-SPACE-GROUND-049`

- Domain: strategic ground-station RF-chain surge and coverage preservation
- Primary systems: ground-node health monitor, RF spare ledger, mission-coverage board
- Cross-check systems: independent RF-component witness and alternate network-routing monitor
- Protocol binding: CCSDS + signed maintenance manifests + API/JSON + USMTF
- Fallback path: mission-essential nodes only with constrained coverage windows

### `TC-ARMORED-RUNGEAR-050`

- Domain: armored running-gear sustainment and readiness prioritization
- Primary systems: fleet readiness dashboard, running-gear failure ledger, depot spares queue
- Cross-check systems: independent maintenance witness and alternate convoy-delivery board
- Protocol binding: signed supply manifests + API/JSON + USMTF + NIEM
- Fallback path: mission-essential tracked fleets only with commander-approved training reductions

### `TC-UNREP-RIG-051`

- Domain: coalition underway replenishment hose, spanwire, and rig compatibility
- Primary systems: UNREP compatibility board, fleet logistics tracker, sea-state and seamanship risk monitor
- Cross-check systems: independent ship-class compatibility witness and alternate transfer-rate board
- Protocol binding: AIS/NMEA + NATO APP-11/ADatP-3 + signed logistics manifests + API/JSON + USMTF
- Fallback path: fuel and life-support stores only with manual compatibility verification

## New Toolchain Wave (2026-03-14, Expansion Wave XLVI)

### `TC-CLOUD-ADMISSION-052`

- Domain: theater battlefield cloud federation admission control
- Primary systems: workload trust admission controller, sovereign edge scheduler, mission dependency graph engine
- Cross-check systems: independent artifact attestation witness and alternate service-health board
- Protocol binding: signed workload manifests + API/JSON + STIX/TAXII + USMTF
- Fallback path: mission-essential workloads only with commander-approved manual admission

### `TC-AUTON-EVAC-053`

- Domain: homeland military and civil autonomous evacuation convoy arbitration
- Primary systems: autonomy convoy dispatcher, emergency traffic board, identity checkpoint ledger
- Cross-check systems: independent public-safety route witness and alternate manual convoy control cell
- Protocol binding: NIMS/ICS + CoT + NIEM + API/JSON + USMTF
- Fallback path: human-driven convoys only with checkpoint-based release

### `TC-AI-ORDER-054`

- Domain: joint AI-generated order integrity and commander-intent deviation
- Primary systems: order semantics comparator, signature verifier, acknowledgment exception ledger
- Cross-check systems: independent countersign witness and alternate distribution control board
- Protocol binding: signed order manifests + USMTF + STIX/TAXII + API/JSON
- Fallback path: dual-channel human countersign before any release

### `TC-FUEL-ADDITIVE-055`

- Domain: strategic reserve fuel additive adulteration interdiction
- Primary systems: additive pedigree ledger, contamination anomaly detector, fuel release board
- Cross-check systems: independent lab witness and alternate supplier custody board
- Protocol binding: signed material-cert manifests + API/JSON + USMTF + NIEM
- Fallback path: mission-essential fuel lots only with dual-sample confirmation

### `TC-HIGHLAT-BATT-056`

- Domain: expeditionary high-latitude battery thermal survivability
- Primary systems: battery health telemetry broker, cold-weather forecast fusion board, charging-window scheduler
- Cross-check systems: independent thermal witness and alternate manual battery rotation ledger
- Protocol binding: signed battery-health manifests + CoT + API/JSON + USMTF
- Fallback path: mission-essential battery loads only with manual thermal checks

### `TC-RENAL-SURGE-057`

- Domain: joint austere renal support and dialysis surge
- Primary systems: renal triage board, dialysis consumable tracker, patient movement broker
- Cross-check systems: independent lab witness and alternate clinical capacity mirror
- Protocol binding: HL7/FHIR + USMTF + API/JSON + NATO APP-11/ADatP-3 aligned exchange
- Fallback path: life-saving renal support only with commander-approved triage thresholds

### `TC-MOBILE-APPROACH-058`

- Domain: joint dispersed airbase mobile precision approach and lighting
- Primary systems: mobile approach set tracker, runway lighting controller, recovery certification board
- Cross-check systems: independent airfield survey witness and alternate flight-safety board
- Protocol binding: AIXM/FIXM + USMTF + Link 16 J-series + signed maintenance manifests + API/JSON
- Fallback path: day-VMC or restricted-minima operations only

### `TC-SURF-BREACH-059`

- Domain: joint littoral surf-zone obstacle breaching and beach gradient verification
- Primary systems: hydrographic survey fusion board, obstacle classification engine, lane release controller
- Cross-check systems: independent diver or UAS witness and alternate amphibious engineer board
- Protocol binding: OGC + VMF + USMTF + API/JSON + CoT
- Fallback path: daylight or limited-craft lane release only

### `TC-ORBIT-POWER-060`

- Domain: strategic on-orbit solar-array shadowing and battery load shed
- Primary systems: spacecraft power-health monitor, eclipse prediction engine, mission-coverage priority board
- Cross-check systems: independent telemetry witness and alternate maneuver approval board
- Protocol binding: CCSDS + signed telemetry manifests + API/JSON + USMTF
- Fallback path: mission-essential payloads only with conservative battery margins

### `TC-EMDECOY-061`

- Domain: joint emissions window and decoy synchronization
- Primary systems: emissions scheduler, decoy status board, adversary collection-risk model
- Cross-check systems: independent spectrum monitor and alternate manual EMCON cell
- Protocol binding: Link 16 J-series + VMF + CoT + USMTF + API/JSON
- Fallback path: brief commander-approved emissions bursts only with manual decoy confirmation

### `TC-SAR-BEACON-062`

- Domain: coalition denied-environment search-and-rescue beacon authentication
- Primary systems: beacon integrity broker, coalition identity challenge board, recovery routing manager
- Cross-check systems: independent geolocation witness and alternate personnel-recovery auth cell
- Protocol binding: Cospas-Sarsat + USMTF + NIEM + CoT + API/JSON
- Fallback path: life-saving recovery only with dual-source location confirmation

### `TC-BREACH-SOIL-063`

- Domain: autonomous breach microterrain soil-bearing and route classification
- Primary systems: terrain sensing fusion board, soil classification engine, route release controller
- Cross-check systems: independent ground-truth witness and alternate engineer risk board
- Protocol binding: OGC + CoT + VMF + API/JSON + USMTF
- Fallback path: limited-weight route release only with human reconnaissance

## New Toolchain Wave (2026-03-14, Expansion Wave XLVII)

### `TC-LASER-FRAT-064`

- Domain: joint laser designator code and sensor fratricide prevention
- Primary systems: laser-code registry, JTAC fires coordination board, sensor cueing conflict engine
- Cross-check systems: independent designation witness and alternate target-validation board
- Protocol binding: VMF + Link 16 J-series + USMTF + API/JSON
- Fallback path: single-designator control with voice readback and UTC acknowledgment log

### `TC-CLOUD-BURN-065`

- Domain: theater cloud credential burn and access reconstitution
- Primary systems: identity emergency control plane, token revocation orchestrator, workload access recovery board
- Cross-check systems: independent audit ledger and alternate privileged-access control cell
- Protocol binding: SCIM + OIDC/SAML + STIX/TAXII + API/JSON + USMTF
- Fallback path: commander-approved break-glass access only with dual-control logging

### `TC-AIRCRAFT-RECOV-066`

- Domain: expeditionary battle-damaged aircraft recovery and controlled cannibalization
- Primary systems: aircraft damage assessment board, maintenance release tracker, cannibalization control ledger
- Cross-check systems: independent structural witness and alternate airworthiness board
- Protocol binding: AIXM/FIXM + signed maintenance manifests + API/JSON + USMTF
- Fallback path: ground-safe recovery only with no-flight release until full inspection

### `TC-HYDRANT-FIRE-067`

- Domain: homeland base fuel hydrant and fire-suppression recovery
- Primary systems: hydrant pressure telemetry board, foam concentrate inventory tracker, emergency isolation controller
- Cross-check systems: independent fire-protection witness and alternate fuel-truck allocation board
- Protocol binding: NIMS/ICS + OPC UA + API/JSON + USMTF
- Fallback path: truck fueling only with manual isolation and continuous fire watch

### `TC-SHOREPOWER-068`

- Domain: coalition shore power frequency conversion and berthing
- Primary systems: berth power availability board, frequency-converter status tracker, ship compatibility ledger
- Cross-check systems: independent pier-load witness and alternate harbor-master board
- Protocol binding: AIS/NMEA + signed power-cert manifests + API/JSON + USMTF + NATO APP-11/ADatP-3 aligned exchange
- Fallback path: generator support only with prioritized military-essential berths

### `TC-ROBOT-TELEOP-069`

- Domain: joint ground robotics teleoperation spectrum safety
- Primary systems: robotic mission controller, teleop link monitor, spectrum conflict adjudication board
- Cross-check systems: independent EW monitor and alternate human control cell
- Protocol binding: CoT + VMF + DDS/ROS 2 + API/JSON + USMTF
- Fallback path: line-of-sight teleoperation only with human spotter chain

### `TC-CARBONCARB-070`

- Domain: strategic carbon-carbon nozzle and reentry material priority
- Primary systems: refractory-material pedigree ledger, nozzle layup and autoclave scheduler, reentry demand board
- Cross-check systems: independent metallurgy witness and alternate strategic release board
- Protocol binding: signed material-cert manifests + API/JSON + USMTF + OPC UA
- Fallback path: mission-essential lots only with conservative release thresholds

### `TC-RESP-FILTER-071`

- Domain: austere respiratory protective equipment fit and filter rotation
- Primary systems: fit-test registry, filter burn tracker, exposure review board
- Cross-check systems: independent medical witness and alternate supply rotation ledger
- Protocol binding: HL7/FHIR + CBRN USMTF + API/JSON + signed inventory manifests
- Fallback path: mission-essential issue only with commander-approved conservation measures

### `TC-LZ-DUST-072`

- Domain: joint assault landing-zone dust signature and sensor obscuration control
- Primary systems: landing-zone environment monitor, rotorwash dust forecast engine, sensor obscuration board
- Cross-check systems: independent aviation safety witness and alternate ground-force marking cell
- Protocol binding: OGC + AIXM/FIXM + VMF + API/JSON + USMTF
- Fallback path: daylight or marked landing-zone operations only with manual dust observation

### `TC-SEEKER-IMU-073`

- Domain: strategic guidance seeker, IMU, and accelerometer priority
- Primary systems: seeker pedigree ledger, IMU allocation board, environmental screening queue
- Cross-check systems: independent lot-authenticity witness and alternate weapon release board
- Protocol binding: signed component manifests + API/JSON + USMTF + OPC UA
- Fallback path: mission-essential lots only with manual pedigree verification

## New Toolchain Wave (2026-03-14, Expansion Wave XLVIII)

### `TC-KILLWEB-074`

- Domain: joint adversary kill-web disruption assessment
- Primary systems: kill-web graph engine, sensor-to-shooter timeline board, campaign disruption planner
- Cross-check systems: independent target system analyst cell and alternate effects synchronization board
- Protocol binding: USMTF + Link 16 J-series + STIX/TAXII + API/JSON
- Fallback path: advisory-only disruption ladder with commander approval at every release point

### `TC-DECOY-075`

- Domain: theater autonomous decoy economy and inventory governance
- Primary systems: decoy inventory ledger, emissions synchronization board, deception fabrication scheduler
- Cross-check systems: independent EW monitor and alternate deception-effects review cell
- Protocol binding: signed inventory manifests + CoT + Link 16 J-series + API/JSON + USMTF
- Fallback path: commander-approved decoy use only for mission-essential phases

### `TC-RELEASE-076`

- Domain: coalition mission-data releasability waiver adjudication
- Primary systems: releasability rule engine, mission-data caveat ledger, waiver workflow board
- Cross-check systems: independent foreign disclosure review cell and alternate classification adjudication board
- Protocol binding: signed releasability manifests + NATO APP-11/ADatP-3 aligned exchange + API/JSON + USMTF + NIEM
- Fallback path: mission-essential summary only with explicit coalition caveat annotations

### `TC-UNDERSEA-077`

- Domain: strategic undersea chokepoint autonomous barrier orchestration
- Primary systems: undersea barrier mission manager, autonomous patrol controller, acoustic contact fusion board
- Cross-check systems: independent ASW watchfloor and hydrographic telemetry mirror
- Protocol binding: AIS/NMEA + Link 16 J-series + USMTF + OGC + API/JSON
- Fallback path: periodic barrier updates only with conservative coverage assumptions

### `TC-MBRIEF-078`

- Domain: joint distributed mission brief multilingual assurance
- Primary systems: mission-brief source binder, multilingual terminology memory, order version-control board
- Cross-check systems: independent linguist review queue and alternate order-authenticity cell
- Protocol binding: signed document manifests + USMTF + NATO APP-11/ADatP-3 aligned exchange + API/JSON
- Fallback path: one authoritative language plus human readback confirmation for partner translations

### `TC-FEW-079`

- Domain: coalition fuel-energy-water nexus anomaly adjudication
- Primary systems: utility telemetry fusion board, fuel movement tracker, water-quality anomaly engine
- Cross-check systems: independent civil utility witness and alternate sustainment coordination board
- Protocol binding: NIMS/ICS + OGC + API/JSON + USMTF + NIEM
- Fallback path: life-safety utilities only with manual status confirmation every 4 hours

### `TC-AERIAL-080`

- Domain: joint aerial port battery hazmat and pallet integrity
- Primary systems: aerial-port cargo planner, hazmat compliance ledger, pallet integrity board
- Cross-check systems: independent loadmaster validation queue and alternate airfield fire-response cell
- Protocol binding: signed cargo manifests + AIXM/FIXM + API/JSON + USMTF + NATO APP-11/ADatP-3 aligned exchange
- Fallback path: mission-essential cargo only with heightened fire-watch and single-sortie load approval

### `TC-OXYGEN-081`

- Domain: joint austere oxygen generation and ventilator load shed
- Primary systems: oxygen plant controller, ventilator fleet tracker, clinical load-shed board
- Cross-check systems: independent biomedical maintenance cell and alternate medical command review board
- Protocol binding: HL7/FHIR + USMTF + API/JSON + signed biomedical maintenance manifests
- Fallback path: lifesaving-only ventilation with commander-approved clinical triage thresholds

### `TC-XDOMAIN-082`

- Domain: theater cross-domain guard schema drift and message loss
- Primary systems: cross-domain guard telemetry board, schema diff validator, message replay ledger
- Cross-check systems: independent data-fabric monitor and alternate guard administrator cell
- Protocol binding: signed schema manifests + XML/JSON + STIX/TAXII + API/JSON + USMTF
- Fallback path: critical-message manual relay only with UTC checksum logging

### `TC-ORBITAL-083`

- Domain: joint orbital mission data downlink window and ground priority
- Primary systems: downlink scheduler, ground-station availability board, mission-priority queue manager
- Cross-check systems: independent link-health monitor and alternate space operations review cell
- Protocol binding: CCSDS + signed telemetry manifests + API/JSON + USMTF
- Fallback path: one mission-essential product class per pass with deferred bulk downloads

### `TC-RUBBLE-084`

- Domain: joint urban rubble route clearance and structural collapse rescue
- Primary systems: collapse mapping board, engineer route-clearance planner, rescue triage queue
- Cross-check systems: independent structural engineer witness and alternate civil rescue coordination cell
- Protocol binding: NIMS/ICS + OGC + CoT + USMTF + API/JSON
- Fallback path: lifesaving rescue corridors only with engineer and rescue dual approval

### `TC-SEMICON-085`

- Domain: strategic semiconductor test burn-in and mission priority
- Primary systems: burn-in chamber scheduler, radiation and thermal screening queue, component pedigree ledger
- Cross-check systems: independent test witness and alternate mission allocation board
- Protocol binding: signed lot manifests + API/JSON + USMTF + OPC UA
- Fallback path: mission-essential lots only with manual pedigree confirmation and narrowed environmental screening

## New Toolchain Wave (2026-03-14, Expansion Wave XLIX)

### `TC-BIO-ADJUVANT-086`

- Domain: strategic vaccine adjuvant and lipid nanoparticle surge
- Primary systems: adjuvant pedigree ledger, lipid-nanoparticle cold-chain tracker, fill-finish scheduler
- Cross-check systems: independent sterility witness and alternate medical-demand priority board
- Protocol binding: signed material-cert manifests + HL7/FHIR + API/JSON + USMTF
- Fallback path: mission-essential countermeasure lots only with dual-control release review

### `TC-STERILITY-087`

- Domain: theater forward sterility release and bioprocess assurance
- Primary systems: batch-record ledger, sterility assay dashboard, field release-authority board
- Cross-check systems: independent assay witness and alternate quarantine tracker
- Protocol binding: signed batch manifests + HL7/FHIR + API/JSON + USMTF
- Fallback path: hold-and-test posture with commander-approved emergency release only

### `TC-DETAINEE-APPEAL-088`

- Domain: coalition detainee appeals translation and custody transparency
- Primary systems: appeal timeline board, translation QA workbench, custody ledger
- Cross-check systems: independent legal-liaison witness and alternate ICRC-notification tracker
- Protocol binding: NIEM + CJIS + signed custody manifests + API/JSON + USMTF + NATO APP-11/ADatP-3 aligned exchange
- Fallback path: time-bound manual appeals review with dual-review translation and protected custody updates

### `TC-PR-FAMILY-089`

- Domain: joint personnel recovery family authentication and deception denial
- Primary systems: PR authentication board, secure notification ledger, media-authenticity verifier
- Cross-check systems: independent survival-report witness and alternate casualty-assistance coordination board
- Protocol binding: signed notification manifests + USMTF + STIX/TAXII + API/JSON + CoT
- Fallback path: dual-channel human verification only with notification freeze on unresolved identity conflict

### `TC-WATER-OT-090`

- Domain: homeland municipal water cyber chemical attack triage
- Primary systems: water SCADA safety board, sample-chain ledger, emergency-operations support board
- Cross-check systems: independent lab witness and alternate public-works status mirror
- Protocol binding: NIMS/ICS + EDXL-DE/CAP + OPC UA + API/JSON + USMTF
- Fallback path: life-safety-first water isolation with hourly command and civil-lead review

### `TC-CABLE-SHIP-091`

- Domain: strategic undersea cable repair ship escort and priority
- Primary systems: cable fault board, repair-ship readiness tracker, escort assignment planner
- Cross-check systems: independent landing-station status witness and alternate reroute board
- Protocol binding: AIS/NMEA + OGC + signed repair manifests + API/JSON + USMTF
- Fallback path: mission-essential repair routes only with fixed escort windows and manual acknowledgment

### `TC-OFFSHORE-BLACKSTART-092`

- Domain: theater offshore energy platform blackstart and defense
- Primary systems: platform OT health board, restart sequencer, maritime defense COP
- Cross-check systems: independent export-flow witness and alternate coastal-grid status board
- Protocol binding: AIS/NMEA + OGC + OPC UA + signed maintenance manifests + USMTF
- Fallback path: minimum-safe export posture only with platform-by-platform release approval

### `TC-BREACH-CERT-093`

- Domain: joint robotic breach lane certification and human override
- Primary systems: engineer lane-certification board, autonomy telemetry validator, blue-force hazard overlay
- Cross-check systems: independent explosive-hazard witness and alternate override drill log
- Protocol binding: CoT + VMF + signed autonomy attestations + API/JSON + USMTF
- Fallback path: manual breach certification only with explicit commander acceptance of reduced tempo

## New Toolchain Wave (2026-03-14, Expansion Wave L)

### `TC-RELIGIOUS-094`

- Domain: joint religious affairs and moral injury support
- Primary systems: chaplain coverage scheduler, confidential referral ledger, command climate stress monitor
- Cross-check systems: independent behavioral health liaison and alternate unit ministry team watchboard
- Protocol binding: HL7/FHIR + signed care-referral manifests + API/JSON + USMTF
- Fallback path: minimum coverage with paper referral controls and UTC acknowledgment log

### `TC-PSYCH-095`

- Domain: joint psychological health suicide postvention command support
- Primary systems: command climate analytics, behavioral health coordination system, chaplain support workflow
- Cross-check systems: independent care-follow-up audit board and alternate readiness stress monitor
- Protocol binding: HL7/FHIR + USMTF + API/JSON
- Fallback path: commander-approved manual postvention board with dual-review care handoffs

### `TC-VETDOG-096`

- Domain: joint force veterinary and working dog support
- Primary systems: veterinary medical record system, kennel readiness tracker, vaccination and animal movement ledger
- Cross-check systems: independent biosurveillance board and alternate handler-readiness review cell
- Protocol binding: HL7/FHIR + signed veterinary transfer manifests + API/JSON + USMTF
- Fallback path: life-saving treatment and mission-essential movement only with paper custody log

### `TC-NUTRITION-097`

- Domain: expeditionary aquaculture and field nutrition resilience
- Primary systems: ration quality ledger, hydration biomonitoring board, aquaculture yield planner
- Cross-check systems: independent preventive-medicine lab board and alternate sustainment allocation tracker
- Protocol binding: HL7/FHIR + OPC UA + signed sustainment manifests + API/JSON + USMTF
- Fallback path: mission-essential feeding only with daily water and cold-chain checks

### `TC-DENTAL-098`

- Domain: expeditionary dental and maxillofacial readiness
- Primary systems: dental readiness registry, oral-trauma imaging board, maxillofacial procedure scheduler
- Cross-check systems: independent airway-risk review cell and alternate patient-movement board
- Protocol binding: HL7/FHIR + DICOM + signed dental-device manifests + API/JSON + USMTF
- Fallback path: emergency-only dental treatment with commander-approved evacuation ladder

### `TC-MSK-099`

- Domain: theater musculoskeletal load management and physical therapy
- Primary systems: load-exposure tracker, movement-screen assessment engine, physical-therapy scheduler
- Cross-check systems: independent athletic-trainer review board and alternate readiness-risk monitor
- Protocol binding: HL7/FHIR + signed sensor manifests + API/JSON + USMTF
- Fallback path: mission-essential task-lightening only with daily manual screening

### `TC-REHAB-100`

- Domain: joint casualty rehabilitation prosthetics and return to duty
- Primary systems: rehabilitation progress tracker, prosthetic fitting board, functional-assessment ledger
- Cross-check systems: independent occupational-therapy review cell and alternate transition-care coordinator board
- Protocol binding: HL7/FHIR + DICOM + signed device manifests + API/JSON + USMTF
- Fallback path: basic mobility milestone tracking only with command-approved reassessment intervals

### `TC-POSTAL-101`

- Domain: joint deployed postal ballot and family contact continuity
- Primary systems: postal flow board, ballot custody tracker, secure family-contact relay ledger
- Cross-check systems: independent custody-chain witness and alternate deception-risk notification monitor
- Protocol binding: NIEM + signed custody manifests + S/MIME + API/JSON + USMTF
- Fallback path: courier-only custody ledger with dual-control ballot witness checks

## New Toolchain Wave (2026-03-15, Expansion Wave LI)

### `TC-SAPR-102`

- Domain: joint sexual-assault response restricted reporting and unit safety
- Primary systems: restricted case-management ledger, survivor care-routing board, retaliation-risk monitor
- Cross-check systems: independent victim-advocate watchboard and alternate command-climate response cell
- Protocol binding: HL7/FHIR + NIEM + signed case manifests + S/MIME + API/JSON + USMTF
- Fallback path: survivor-safety-first manual routing only with dual-review confidentiality checks

### `TC-CULTURAL-103`

- Domain: theater cultural property protection and no-strike governance
- Primary systems: heritage-site registry, no-strike geofence board, collateral-effects review workbench
- Cross-check systems: independent legal review cell and alternate civil-affairs coordination board
- Protocol binding: OGC + NIEM + USMTF + API/JSON + signed geofence manifests
- Fallback path: no-strike-by-default with manual geofence confirmation and legal review for any exception

### `TC-CIVHARM-104`

- Domain: joint civilian harm condolence payment and claims
- Primary systems: incident evidence ledger, condolence payment tracker, claims adjudication board
- Cross-check systems: independent witness review cell and alternate civil-affairs restitution board
- Protocol binding: NIEM + signed claims manifests + API/JSON + USMTF + S/MIME
- Fallback path: evidence-preservation and advisory-only recommendations until harm verification and legal review complete

### `TC-ARFF-105`

- Domain: expeditionary aircraft crash fire rescue and foam transition
- Primary systems: ARFF dispatch board, foam compatibility ledger, runway hazard tracker
- Cross-check systems: independent explosive-safety desk and alternate airfield recovery board
- Protocol binding: NIMS/ICS + AIXM/FIXM + OGC + API/JSON + USMTF
- Fallback path: crew-rescue and exposure-control only with single-runway emergency hold and manual foam accounting

### `TC-CAMERA-106`

- Domain: joint combat camera public affairs release authenticity
- Primary systems: media provenance verifier, release authority board, redaction and watermark workflow
- Cross-check systems: independent OPSEC review cell and alternate authenticity forensics board
- Protocol binding: signed media manifests + STANAG 4609 aligned exchange + S/MIME + API/JSON + USMTF + STIX/TAXII
- Fallback path: commander-readable summary only with delayed media release until provenance and OPSEC checks pass

### `TC-PROPBOOK-107`

- Domain: theater property book loss accountability and sensitive item recapture
- Primary systems: property-book ledger, serial custody tracker, sensitive-item alert board
- Cross-check systems: independent accountability audit cell and alternate MP recovery tracker
- Protocol binding: signed serial manifests + NIEM + API/JSON + USMTF + S/MIME
- Fallback path: dual-control manual accountability only with immediate compromise notification and restricted reissue

### `TC-RANGE-108`

- Domain: joint live fire range safety and autonomous target control
- Primary systems: range control board, autonomous target telemetry monitor, ceasefire or destruct controller
- Cross-check systems: independent safety observer board and alternate airspace deconfliction cell
- Protocol binding: AIXM/FIXM + VMF + CoT + API/JSON + USMTF + signed target-control manifests
- Fallback path: static targets only with manual positive control and no autonomous motion

### `TC-FUNERAL-109`

- Domain: joint dignified transfer funeral honors and family escort
- Primary systems: casualty-support workflow, dignified-transfer custody ledger, honors scheduling board
- Cross-check systems: independent casualty assistance officer queue and alternate mortuary affairs coordination cell
- Protocol binding: HL7/FHIR + NIEM + signed custody manifests + S/MIME + API/JSON + USMTF
- Fallback path: essential custody and family-contact continuity only with manual honors coordination and protected identity handling

## New Toolchain Wave (2026-03-15, Expansion Wave LVI)

### `TC-SIGINT-134`

- Domain: joint signals intelligence and emitter geolocation fusion
- Primary systems: SIGINT report queue, emitter geolocation board, EW order-of-battle overlay
- Cross-check systems: independent geolocation replay and alternate collection management cell
- Protocol binding: signed emitter manifests + CoT + Link 16 J-series + USMTF + STIX/TAXII + API/JSON
- Fallback path: confidence-banded emitter watchlist only with no release beyond advisory use

### `TC-EABO-135`

- Domain: joint expeditionary advanced base operations and signature management
- Primary systems: littoral COP, expeditionary engineering board, signature-budget scheduler
- Cross-check systems: independent deception-effectiveness review and alternate sustainment timing board
- Protocol binding: signed emissions-control manifests + CoT + VMF + Link 16 J-series + OGC + USMTF + API/JSON
- Fallback path: hold-position or displace-only advisory with manual signature checks and reduced update cadence

### `TC-JAG-136`

- Domain: joint operational law and judge advocate battlefield advisory
- Primary systems: operational-law issue tracker, authority and claims ledger, coalition caveat board
- Cross-check systems: alternate judge advocate audit log and independent command-policy review cell
- Protocol binding: NIEM + CJIS + USMTF + NATO APP-11/ADatP-3 aligned exchange + S/MIME + API/JSON
- Fallback path: advisory-only legal note with no recommended action until authority and facts are confirmed

### `TC-ORBWAR-137`

- Domain: joint orbital warfare effects deconfliction and continuity
- Primary systems: space-effects planner, SDA conjunction board, SATCOM continuity monitor
- Cross-check systems: independent orbital risk replay and alternate strategic warning review cell
- Protocol binding: CCSDS + signed ephemeris manifests + USMTF + STIX/TAXII + API/JSON
- Fallback path: continuity-only recommendation with no effects shift beyond protected-service preservation

### `TC-AIRMOB-138`

- Domain: joint air mobility diplomatic clearance and staging continuity
- Primary systems: air mobility mission scheduler, diplomatic clearance tracker, staging and ramp-flow board
- Cross-check systems: independent slot-allocation witness and alternate movement control review cell
- Protocol binding: AIXM/FIXM + NIEM + signed air-movement manifests + USMTF + EDXL-DE/CAP + API/JSON
- Fallback path: mission-essential lift only with manual clearance confirmation and fixed staging windows

## New Toolchain Wave (2026-03-15, Expansion Wave LII)

### `TC-DE-SAFE-110`

- Domain: joint directed-energy engagement airspace and reflection safety
- Primary systems: beam-control safety board, reflection-hazard modeler, airspace deconfliction workbench
- Cross-check systems: independent blue-force exposure board and alternate atmospheric attenuation monitor
- Protocol binding: AIXM/FIXM + Link 16 J-series + VMF + CoT + API/JSON + USMTF
- Fallback path: observe-only or no-fire posture until beam path and exposure checks are manually confirmed

### `TC-REFUEL-CONTAM-111`

- Domain: joint aerial refueling fuel contamination isolation and reconstitution
- Primary systems: fuel-quality ledger, tanker boom or drogue maintenance tracker, receiver-priority refuel scheduler
- Cross-check systems: independent sample-chain witness and alternate tanker configuration board
- Protocol binding: signed fuel manifests + AIXM/FIXM + API/JSON + USMTF
- Fallback path: mission-essential refuel only with dual-source fuel confirmation and narrowed receiver release

### `TC-TSUNAMI-PORT-112`

- Domain: homeland tsunami port closure and sealift regeneration
- Primary systems: port-surge digital twin, berth-damage and channel survey board, sealift regeneration scheduler
- Cross-check systems: independent tide or hydrographic witness and alternate inland transload board
- Protocol binding: AIS/NMEA + OGC + EDXL-DE/CAP + API/JSON + USMTF
- Fallback path: one protected berth or cargo flow at a time with manual harbor-master and command approval

### `TC-RAIL-BLOCK-113`

- Domain: coalition host-nation rail signaling manual-block reversion
- Primary systems: signaling integrity board, dispatch reversion planner, coalition force-flow priority ledger
- Cross-check systems: independent block-station readback log and alternate wayside inspection board
- Protocol binding: EDI + NIEM + OPC UA + API/JSON + USMTF + NATO APP-11/ADatP-3 aligned exchange
- Fallback path: low-tempo manual dispatch only with dual readback and coalition command concurrence

### `TC-HEMO-114`

- Domain: joint austere hemodialysis water and power assurance
- Primary systems: dialysis machine readiness board, water-purity monitor, renal-triage and transfer queue
- Cross-check systems: independent sample-chain lab witness and alternate generator-load board
- Protocol binding: HL7/FHIR + signed water-quality manifests + OPC UA + API/JSON + USMTF
- Fallback path: emergency dialysis only with medical-command review and shortened reassessment cycle

### `TC-EO-CRYO-115`

- Domain: strategic electro-optical sensor focal-plane and cryocooler priority
- Primary systems: focal-plane inventory ledger, cryocooler test scheduler, sensor mission-allocation board
- Cross-check systems: independent detector-yield witness and alternate ISR repair queue
- Protocol binding: signed lot manifests + CCSDS + API/JSON + USMTF
- Fallback path: mission-essential sensor lines only with manual pedigree confirmation and narrowed release authority

### `TC-SHELTER-RAD-116`

- Domain: homeland civilian shelter radiation dosimetry and resupply
- Primary systems: shelter occupancy board, dosimetry ledger, resupply priority queue
- Cross-check systems: independent public-health witness and alternate route-clearance board
- Protocol binding: NIMS/ICS + EDXL-DE/CAP + NIEM + API/JSON + USMTF
- Fallback path: life-safety-first sheltering with manual dose logs and convoy-by-convoy resupply approval

### `TC-SDR-117`

- Domain: theater software-defined radio waveform key and hopset emergency reconstitution
- Primary systems: waveform-key custody board, hopset generation and distribution service, spectrum trust monitor
- Cross-check systems: independent crypto-fill audit log and alternate network-control station board
- Protocol binding: signed key manifests + Link 16 J-series + VMF + STIX/TAXII + API/JSON + USMTF
- Fallback path: narrowband authenticated voice only with manual COMSEC accounting and shortened rekey cycle

## New Toolchain Wave (2026-03-15, Expansion Wave LIII)

### `TC-OCULAR-118`

- Domain: joint operational vision, ocular trauma, and optical readiness
- Primary systems: ophthalmic exam workflow, optical-device readiness ledger, ocular evacuation board
- Cross-check systems: independent laser-safety witness and alternate medical regulation cell
- Protocol binding: HL7/FHIR + DICOM + signed optical-device manifests + API/JSON + USMTF
- Fallback path: protective-eyewear discipline and paper triage with manual evacuation approval

### `TC-VECTOR-119`

- Domain: expeditionary vector control and field epidemiology
- Primary systems: vector surveillance board, trap and assay ledger, geospatial habitat modeler
- Cross-check systems: independent preventive-medicine witness and alternate outbreak case tracker
- Protocol binding: HL7/FHIR + OGC + signed trap or sample manifests + API/JSON + USMTF
- Fallback path: targeted habitat denial only with daily command review and manual pesticide accountability

### `TC-COLD-120`

- Domain: joint cold injury, frostbite, and rewarming operations
- Primary systems: cold-exposure tracker, warming shelter board, frostbite triage workflow
- Cross-check systems: independent medic witness and alternate casualty transfer queue
- Protocol binding: HL7/FHIR + signed cold-exposure manifests + API/JSON + USMTF
- Fallback path: essential warming and evacuation only with voice-confirmed casualty handoff

### `TC-WOMENS-121`

- Domain: joint women's health and contested obstetric support
- Primary systems: maternal-fetal risk board, gynecologic care-routing workflow, blood and ultrasound readiness ledger
- Cross-check systems: independent obstetric witness and alternate surgical transfer board
- Protocol binding: HL7/FHIR + DICOM + signed maternal-transfer manifests + API/JSON + USMTF
- Fallback path: life-saving obstetric routing only with protected voice handoff and manual consent tracking

### `TC-REPRO-122`

- Domain: theater reproductive health, contraception, and STI readiness
- Primary systems: protected pharmacy ledger, STI screening workflow, contraception supply tracker
- Cross-check systems: independent privacy-compliance witness and alternate protected referral queue
- Protocol binding: HL7/FHIR + signed pharmacy manifests + API/JSON + USMTF
- Fallback path: essential medication continuation only with dual-review privacy controls

### `TC-BLAST-123`

- Domain: joint blast overpressure and breacher readiness
- Primary systems: blast-gauge telemetry board, breacher readiness ledger, neurocognitive follow-up queue
- Cross-check systems: independent range-safety witness and alternate hearing-conservation board
- Protocol binding: signed sensor manifests + HL7/FHIR + VMF + API/JSON + USMTF
- Fallback path: no-growth training posture with manual exposure logging and medical review

### `TC-IAQ-124`

- Domain: expeditionary barracks HVAC, mold, and indoor air quality
- Primary systems: HVAC telemetry board, mold remediation ledger, industrial-hygiene sampler
- Cross-check systems: independent facility engineer witness and alternate occupancy restriction planner
- Protocol binding: OPC UA + OGC + NIMS/ICS + API/JSON + USMTF
- Fallback path: occupancy cap and room-by-room quarantine with command readback only

### `TC-FOOT-125`

- Domain: joint foot health, blister, trench foot, and load-bearing readiness
- Primary systems: march-load tracker, footwear fit ledger, blister and immersion-foot treatment workflow
- Cross-check systems: independent preventive-medicine witness and alternate sock-resupply board
- Protocol binding: HL7/FHIR + signed footwear manifests + API/JSON + USMTF
- Fallback path: shortened movement windows with manual sock and boot accountability

## New Toolchain Wave (2026-03-15, Expansion Wave LIV)

### `TC-INDHYG-126`

- Domain: expeditionary industrial hygiene and occupational exposure control
- Primary systems: industrial hygiene sampling ledger, respirator fit-status board, exposure-limit tracker, confined-space permit workflow
- Cross-check systems: independent preventive-medicine witness and alternate facility engineer hazard board
- Protocol binding: HL7/FHIR + signed sample manifests + OPC UA + OGC + API/JSON + USMTF
- Fallback path: short-duration work only with manual sampling log, respirator checks, and daily command review

### `TC-AVPHYS-127`

- Domain: joint aviation physiology hypoxia acceleration and life support
- Primary systems: physiological incident tracker, life-support equipment status board, altitude-chamber and training ledger, aircraft oxygen-system health monitor
- Cross-check systems: independent flight-surgeon witness and alternate maintenance discrepancy board
- Protocol binding: HL7/FHIR + AIXM/FIXM + signed life-support manifests + API/JSON + USMTF
- Fallback path: minimum-risk sortie posture with manual discrepancy tracking and protected voice release approval

### `TC-DIVE-128`

- Domain: joint dive medicine hyperbaric and undersea casualty routing
- Primary systems: dive-profile ledger, hyperbaric chamber status board, diver medical triage queue, undersea casualty-routing planner
- Cross-check systems: independent dive medical officer witness and alternate chamber maintenance board
- Protocol binding: HL7/FHIR + DICOM + signed dive-profile manifests + OGC + API/JSON + USMTF
- Fallback path: life-saving routing only with voice-confirmed casualty handoff and manual chamber allocation

### `TC-TOX-129`

- Domain: theater occupational toxicology solvent fuel and heavy metal
- Primary systems: toxicology sample ledger, exposure symptom board, industrial contaminant map, medical surveillance tracker
- Cross-check systems: independent lab witness and alternate hazard-communication board
- Protocol binding: HL7/FHIR + signed lab manifests + OPC UA + OGC + API/JSON + USMTF
- Fallback path: isolate affected work areas and track symptoms manually until verified samples and reviews complete

### `TC-FOOD-130`

- Domain: expeditionary food protection inspection and sanitation
- Primary systems: food inspection ledger, cold-chain monitor, field-sanitation checklist board, food-handling violation tracker
- Cross-check systems: independent preventive-medicine or veterinary witness and alternate ration-quality board
- Protocol binding: HL7/FHIR + signed inspection manifests + NIEM + API/JSON + USMTF
- Fallback path: sealed-ration-only posture with manual source approval and daily sanitation review

### `TC-WASTE-131`

- Domain: theater hazardous waste burn pit and ash exposure
- Primary systems: hazardous-waste manifest ledger, emissions and plume monitor, ash sampling board, disposal routing planner
- Cross-check systems: independent environmental-compliance witness and alternate base-camp health monitor
- Protocol binding: signed waste manifests + OPC UA + OGC + NIMS/ICS + API/JSON + USMTF
- Fallback path: essential disposal only with manual manifests, visual plume controls, and command readback

### `TC-SUD-132`

- Domain: joint substance use overdose and impaired duty command support
- Primary systems: overdose incident tracker, impairment-risk board, protected referral workflow, unit safety watchlist
- Cross-check systems: independent behavioral-health witness and alternate law-enforcement or safety office board
- Protocol binding: HL7/FHIR + NIEM + signed case manifests + S/MIME + API/JSON + USMTF
- Fallback path: life-safety-first response with manual duty restrictions and protected voice care handoff only

### `TC-SLEEP-133`

- Domain: theater sleep recovery shift work and fatigue restoration
- Primary systems: sleep-opportunity tracker, shift stability board, fatigue biomarker or survey ledger, relief and recovery scheduler
- Cross-check systems: independent surgeon or performance-team witness and alternate commander readiness board
- Protocol binding: HL7/FHIR + signed schedule manifests + API/JSON + USMTF + NATO APP-11/ADatP-3 aligned exchange
- Fallback path: short-duration protected-rest windows only with paper rosters and voice-confirmed staffing handoffs

## New Toolchain Wave (2026-03-15, Expansion Wave LVII)

### `TC-FSURG-134`

- Domain: joint flight surgeon and aeromedical waiver
- Primary systems: flight-surgeon waiver board, aircrew medical qualification ledger, life-support discrepancy tracker, sortie risk board
- Cross-check systems: independent aviation physiology witness and alternate maintenance discrepancy board
- Protocol binding: HL7/FHIR + AIXM/FIXM + signed waiver manifests + API/JSON + USMTF
- Fallback path: manual waiver and restriction tracking only with surgeon voice approval and UTC readback

### `TC-DC-135`

- Domain: naval damage control and battle stability
- Primary systems: ship damage-control board, flooding and fire boundary tracker, stability calculator, casualty-power restoration board
- Cross-check systems: independent engineering watch witness and alternate combat-systems casualty board
- Protocol binding: AIS/NMEA + OGC + signed damage-control manifests + API/JSON + USMTF
- Fallback path: fight-for-survival posture only with manual plot updates and conservative stability assumptions

### `TC-EOD-136`

- Domain: joint EOD render safe and site exploitation
- Primary systems: render-safe planner, ordnance fingerprint ledger, blast standoff board, site exploitation evidence workbench
- Cross-check systems: independent tech-intel witness and alternate force-protection cordon cell
- Protocol binding: USMTF + NIEM + STIX/TAXII + signed evidence manifests + API/JSON + OGC
- Fallback path: cordon-and-hold posture only with no exploitation handoff until authority is verified

### `TC-POWER-137`

- Domain: expeditionary prime power generator maintenance and load balance
- Primary systems: generator dispatch board, load-balance monitor, fuel burn tracker, maintenance parts queue
- Cross-check systems: independent power-quality witness and alternate facility engineer hazard board
- Protocol binding: OPC UA + signed maintenance manifests + OGC + API/JSON + USMTF
- Fallback path: mission-essential circuits only with manual meter checks and fixed load caps

### `TC-SLING-138`

- Domain: joint sling load and external lift certification
- Primary systems: load certification board, hookup inspection ledger, lift-window planner, aircraft configuration validator
- Cross-check systems: independent air-movement witness and alternate aircraft weight-and-balance board
- Protocol binding: AIXM/FIXM + VMF + signed load manifests + API/JSON + USMTF
- Fallback path: reduced-load or no-lift posture with manual voice confirmation only

### `TC-BEACH-139`

- Domain: amphibious beachmaster surf zone and shore party control
- Primary systems: surf and tide board, beach lane-control workflow, causeway or lighterage scheduler, shore-party movement tracker
- Cross-check systems: independent hydrographic recon witness and alternate littoral fires deconfliction cell
- Protocol binding: OGC + CoT + VMF + AIS/NMEA + USMTF
- Fallback path: single-lane or lifesaving release only with conservative surf thresholds and voice lane-control readback

### `TC-AIRCREW-140`

- Domain: expeditionary aircrew flight equipment and survival gear
- Primary systems: life-support equipment ledger, survival radio and beacon status board, flight-equipment inspection scheduler, exposure-recovery kit tracker
- Cross-check systems: independent aviation physiology witness and alternate maintenance discrepancy board
- Protocol binding: HL7/FHIR + signed life-support manifests + AIXM/FIXM + API/JSON + USMTF
- Fallback path: mission-essential sorties only with manual inspection attestation and protected voice release

### `TC-RIVER-141`

- Domain: joint small craft riverine maintenance and spares
- Primary systems: small-craft readiness board, spares or cannibalization ledger, engine diagnostic tracker, watercraft maintenance queue
- Cross-check systems: independent boat-master witness and alternate river-control board
- Protocol binding: AIS/NMEA + VMF + signed maintenance manifests + API/JSON + USMTF
- Fallback path: mission-priority craft only with manual launch restrictions and daily readiness review

### `TC-ARM-142`

- Domain: joint flightline weapons loading and armament safety
- Primary systems: armament configuration validator, weapons-load checklist board, explosive safety arc planner, sortie release board
- Cross-check systems: independent load-crew certifier and alternate munitions control desk
- Protocol binding: AIXM/FIXM + signed load manifests + API/JSON + USMTF + CoT
- Fallback path: reduced-load posture only with manual certification and restricted ramp operations

### `TC-COLD-143`

- Domain: joint cold weather clothing layering and frostbite discipline
- Primary systems: cold-weather issue ledger, exposure-risk board, wet-gear rotation tracker, casualty risk watchlist
- Cross-check systems: independent preventive-medicine witness and alternate supply accountability board
- Protocol binding: HL7/FHIR + signed clothing manifests + OGC + API/JSON + USMTF
- Fallback path: short-duration exposure only with manual gear checks and timed warming intervals

## New Toolchain Wave (2026-03-15, Expansion Wave LVIII)

### `TC-BMET-144`

- Domain: joint ballistic meteorology and fire support calibration
- Primary systems: upper-air observation board, ballistic-met message tracker, fire-solution recalculation board, survey alignment ledger
- Cross-check systems: independent fire-support weather witness and alternate sensor-quality monitor
- Protocol binding: VMF + USMTF + iwxxm + OGC + API/JSON
- Fallback path: conservative fire-support posture only with manual corrections and command readback

### `TC-WXOBS-145`

- Domain: expeditionary airfield weather observation and sensor maintenance
- Primary systems: airfield observing board, sensor health tracker, manual observation log, terminal weather release board
- Cross-check systems: independent weather-observer witness and alternate diversion-field weather board
- Protocol binding: AIXM/FIXM/iwxxm + signed observation manifests + API/JSON + OGC + USMTF
- Fallback path: manual observation and conservative weather minima only with scheduled readback

### `TC-RIG-146`

- Domain: joint aerial delivery rigging and parachute inspection
- Primary systems: rigging inspection ledger, parachute serviceability board, load derivation worksheet, air-item certification tracker
- Cross-check systems: independent rigger standards witness and alternate air-movement release board
- Protocol binding: AIXM/FIXM + VMF + signed rigging manifests + API/JSON + USMTF
- Fallback path: reduced-load or hold posture with manual certification and voice confirmation only

### `TC-HDROP-147`

- Domain: theater heavy-drop platform rigging and retrograde recovery
- Primary systems: heavy-drop platform planner, extraction-system ledger, retrograde recovery tracker, DZ recovery board
- Cross-check systems: independent DZ safety witness and alternate sustainment recovery cell
- Protocol binding: AIXM/FIXM + VMF + CoT + signed load manifests + API/JSON + USMTF
- Fallback path: reduced platform set or no-drop posture with manual release readback only

### `TC-AMMO-148`

- Domain: joint ammunition surveillance and lot serviceability
- Primary systems: lot surveillance ledger, condition-code board, malfunction and defect tracker, storage-drift planner
- Cross-check systems: independent quality-assurance witness and alternate ammunition issue-control desk
- Protocol binding: signed surveillance manifests + NIEM + OGC + API/JSON + USMTF
- Fallback path: restricted issue only with daily surveillance review and dual-control release

### `TC-QD-149`

- Domain: theater net explosive weight and munitions compatibility
- Primary systems: quantity-distance calculator, compatibility group board, storage-site planner, transload standoff matrix
- Cross-check systems: independent explosive-safety witness and alternate force-protection standoff board
- Protocol binding: OGC + signed storage manifests + NIEM + API/JSON + USMTF
- Fallback path: emergency separation only with manual blast arcs and commander readback

### `TC-RIB-150`

- Domain: expeditionary ribbon bridge maintenance and raft launch
- Primary systems: bridge-bay serviceability board, anchorage planner, current and load monitor, raft-launch sequence tracker
- Cross-check systems: independent engineer-mobility witness and alternate gap-crossing control cell
- Protocol binding: VMF + CoT + OGC + signed maintenance manifests + USMTF
- Fallback path: reduced-throughput crossing only with manual bay counts and timed launch windows

### `TC-BEB-151`

- Domain: joint bridge erection boat powertrain and gap crossing recovery
- Primary systems: bridge-erection-boat readiness board, powertrain diagnostic tracker, spare prop or shaft ledger, recovery and tow planner
- Cross-check systems: independent boat-master witness and alternate engineer rescue board
- Protocol binding: AIS/NMEA + VMF + OGC + signed maintenance manifests + API/JSON + USMTF
- Fallback path: essential-span emplacement only with tow escort and manual readiness board

### `TC-GSE-152`

- Domain: expeditionary flightline ground support equipment readiness
- Primary systems: AGE dispatch board, power and air cart availability ledger, tow asset tracker, sortie support scheduler
- Cross-check systems: independent production-superintendent witness and alternate maintenance discrepancy board
- Protocol binding: AIXM/FIXM + signed maintenance manifests + API/JSON + OGC + USMTF
- Fallback path: mission-essential sorties only with fixed cart windows and manual sign-out

### `TC-HYD-153`

- Domain: joint aircraft hydraulic contamination and servicing
- Primary systems: hydraulic fluid sampling board, contamination-control ledger, component isolation tracker, servicing release board
- Cross-check systems: independent quality-assurance witness and alternate flight-control maintenance board
- Protocol binding: signed maintenance manifests + AIXM/FIXM + OPC UA + API/JSON + USMTF
- Fallback path: no-fly or reduced-maneuver posture only with manual sampling and component isolation

## New Toolchain Wave (2026-03-15, Expansion Wave LIX)

### `TC-ADVISOR-154`

- Domain: coalition partner force insider threat and advisor protection
- Primary systems: partner vetting ledger, advisor movement protection board, behavioral indicator monitor
- Cross-check systems: independent counterintelligence review cell and alternate liaison watchboard
- Protocol binding: NIEM + USMTF + STIX/TAXII + S/MIME + API/JSON + CoT
- Fallback path: essential engagements only with dual-review screening and hardened escort posture

### `TC-RUMOR-155`

- Domain: joint civilian sensor report veracity and rumor control
- Primary systems: crowdsourced incident fusion board, media authenticity verifier, civil warning rumor tracker
- Cross-check systems: independent public-affairs review cell and alternate civil affairs reporting board
- Protocol binding: CAP + NIEM + OGC + STIX/TAXII + API/JSON + S/MIME
- Fallback path: command-approved warnings only after manual corroboration and delayed release

### `TC-DEICING-156`

- Domain: expeditionary cold weather aircraft deicing and sortie recovery
- Primary systems: deicing fluid inventory ledger, holdover-time calculator, sortie recovery board
- Cross-check systems: independent weather shop and alternate maintenance control desk
- Protocol binding: METAR/TAF + AIXM/FIXM + signed maintenance manifests + API/JSON + USMTF
- Fallback path: mission-essential sorties only with manual holdover tracking and widened safety margins

### `TC-HARBOR-157`

- Domain: coalition harbor mine countermeasure and merchant reroute
- Primary systems: harbor MCM board, merchant traffic planner, port status ledger
- Cross-check systems: independent hydrographic survey cell and alternate pilotage risk board
- Protocol binding: AIS/NMEA + OGC + API/JSON + USMTF + NATO APP-11/ADatP-3
- Fallback path: channel closed by default with mission-essential movement only and manual survey correlation

### `TC-LAUNCH-158`

- Domain: joint space launch abort recovery and range evacuation
- Primary systems: range safety board, debris footprint predictor, search-and-rescue dispatch planner
- Cross-check systems: independent telemetry integrity monitor and alternate civil warning desk
- Protocol binding: CCSDS + AIXM/FIXM + CAP + OGC + API/JSON + USMTF
- Fallback path: life-safety-first evacuation and recovery only with conservative danger footprints

### `TC-SIGNKEY-159`

- Domain: theater software signing key loss and emergency reconstitution
- Primary systems: HSM or PKI status ledger, revocation propagation tracker, trusted build release board
- Cross-check systems: independent cyber response cell and alternate mission-software rollback board
- Protocol binding: X.509 + OCSP/CRL + signed artifact manifests + API/JSON + STIX/TAXII + USMTF
- Fallback path: freeze non-essential releases and allow only preapproved binaries under dual control

### `TC-EMITTER-160`

- Domain: joint friendly emitter impostor and rebroadcast detection
- Primary systems: emitter fingerprint fusion service, RF geolocation board, blue-force emission library
- Cross-check systems: independent SIGINT review cell and alternate air-defense correlation board
- Protocol binding: Link 16 J-series + VMF + CoT + API/JSON + SIGINT metadata manifests + USMTF
- Fallback path: authenticated challenge-and-response only with human confirmation before posture changes

### `TC-RIVERINE-161`

- Domain: strategic small craft outboard and riverine mobility surge
- Primary systems: small-craft inventory ledger, boatyard capacity tracker, outboard spare-parts board
- Cross-check systems: independent transportation command readiness desk and alternate depot audit board
- Protocol binding: NIEM + signed serial manifests + API/JSON + USMTF + AIS/NMEA
- Fallback path: mission-essential craft allocation only with manual serial tracking and repair triage

### `TC-TIC-162`

- Domain: joint toxic industrial chemical exposure and decon triage
- Primary systems: toxicology triage board, plume model, decon throughput tracker
- Cross-check systems: independent preventive-medicine cell and alternate CBRN hazard board
- Protocol binding: HL7/FHIR + OGC + CAP + NIEM + API/JSON + USMTF
- Fallback path: life-safety-first triage only with manual zoning and delayed return-to-duty decisions

### `TC-LIABILITY-163`

- Domain: coalition host nation force protection claims and liability
- Primary systems: force-protection incident ledger, host-nation claims tracker, status-of-forces legal board
- Cross-check systems: independent judge-advocate review cell and alternate civil-affairs restitution board
- Protocol binding: NIEM + NATO APP-11/ADatP-3 + signed claims manifests + API/JSON + USMTF + S/MIME
- Fallback path: advisory-only legal framing with no concession language and manual senior review

## New Toolchain Wave (2026-03-15, Expansion Wave LX)

### `TC-RENAL-164`

- Domain: expeditionary renal replacement and crush injury surge
- Primary systems: critical-care flowsheet, chemistry and urine-output board, dialysis-device status ledger, med-log consumables tracker
- Cross-check systems: independent nephrology reachback cell and alternate evacuation regulation board
- Protocol binding: HL7/FHIR + signed device manifests + API/JSON + USMTF + NIEM
- Fallback path: lifesaving triage and manual electrolyte-control board only with command-approved transfer prioritization

### `TC-CIRCADIAN-165`

- Domain: theater circadian fatigue and watchbill optimization
- Primary systems: fatigue analytics board, watchbill scheduler, sleep-debt tracker, incident-risk monitor
- Cross-check systems: independent flight-medicine or force-health review cell and alternate unit readiness board
- Protocol binding: HL7/FHIR + signed sensor manifests + API/JSON + USMTF + NIEM
- Fallback path: manual watchbill board with conservative crew-rest windows and command-approved risk acceptance

### `TC-WILDFIRE-166`

- Domain: homeland wildland fire airspace and retardant priority
- Primary systems: incident-command dashboard, air tanker dispatch board, smoke and plume model, retardant stock ledger
- Cross-check systems: independent airspace control board and alternate state emergency operations cell
- Protocol binding: NIMS/ICS + AIXM/FIXM + CAP + OGC + API/JSON + USMTF
- Fallback path: life-safety-first airspace board with manual retardant accounting and command-approved sortie holds

### `TC-LICENSE-167`

- Domain: theater mission software license and offline activation continuity
- Primary systems: license-server health board, entitlement vault, offline activation ledger, trusted build release board
- Cross-check systems: independent cyber response cell and alternate mission-software rollback board
- Protocol binding: signed entitlement manifests + X.509 + API/JSON + STIX/TAXII + USMTF
- Fallback path: mission-essential services only with manual entitlement ledger and preapproved binary allowlist

### `TC-SURF-168`

- Domain: joint amphibious surf-zone breach and beach trafficability
- Primary systems: hydrographic surf model, obstacle breach board, beach trafficability assessor, shore-party flow tracker
- Cross-check systems: independent beachmaster cell and alternate engineer mobility board
- Protocol binding: OGC + AIS/NMEA + VMF + CoT + signed hydrographic manifests + USMTF
- Fallback path: beach-by-beach manual release board with conservative surf windows and reduced throughput assumptions

### `TC-SPACECHARGE-169`

- Domain: space electrostatic charging and satellite safe-mode recovery
- Primary systems: spacecraft health board, charging-environment predictor, ground-station scheduler, service-priority ledger
- Cross-check systems: independent spacecraft bus engineering desk and alternate SDA timing monitor
- Protocol binding: CCSDS + signed telemetry manifests + API/JSON + OGC + USMTF
- Fallback path: conservative safe-mode hold with manually prioritized service restoration and longer contact spacing

### `TC-AMMOFIRE-170`

- Domain: theater ammunition yard fire and compatibility
- Primary systems: quantity-distance calculator, storage-site planner, fire spread board, lot-serviceability ledger
- Cross-check systems: independent explosive-safety witness and alternate force-protection standoff board
- Protocol binding: OGC + signed storage manifests + NIEM + API/JSON + USMTF + CoT
- Fallback path: yard closure with manual blast-arc board, restricted firefighting exposure, and command-approved emergency issue routing

### `TC-MEDIA-171`

- Domain: joint captured media exploitation and viral escalation
- Primary systems: media provenance verifier, translation and transcription board, adversary narrative monitor, evidence-custody ledger
- Cross-check systems: independent legal review cell and alternate public-affairs authenticity board
- Protocol binding: signed media manifests + STANAG 4609 aligned exchange + S/MIME + API/JSON + STIX/TAXII + USMTF
- Fallback path: hold media by default with manual provenance review and commander-approved text-only summaries
