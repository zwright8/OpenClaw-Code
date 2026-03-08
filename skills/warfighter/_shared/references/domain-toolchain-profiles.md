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
