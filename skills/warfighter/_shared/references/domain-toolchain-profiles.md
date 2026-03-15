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
