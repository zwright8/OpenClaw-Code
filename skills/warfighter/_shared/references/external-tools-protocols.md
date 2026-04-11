# External Tools and Protocols (Warfighter Skill Set)

Use this reference when a warfighter skill needs system integration guidance. Keep all integrations within authorized networks, accreditation boundaries, and handling caveats.

## Core Integration Protocol (apply every time)

1. Verify authority, mission scope, and data classification before querying or publishing data.
2. Pull source data from an approved system-of-record or approved relay service; avoid manual copy-paste when an interface exists.
3. Normalize timestamps (UTC ISO-8601), geospatial reference (WGS84 + MGRS when relevant), and unit identifiers before fusion.
4. Cross-check high-consequence data against at least two independent sources or one authoritative validated source.
5. Publish outputs in the requesting format and transport (for example USMTF, CoT, VMF, Link 16 J-series, STIX/TAXII, OGC).
6. Log provenance: source system, pull time, processing assumptions, and confidence level.
7. Run the mission assurance checks in `mission-assurance-checklist.md` before release.
8. Define endpoint adapter contracts for each critical integration using `external-tool-endpoints-and-adapters.md`.

## Tool Invocation Packet (required in skill outputs)

For each external tool recommendation, include:

- Objective: what decision or action the tool output enables
- Inputs: identifiers, timeframe, AOI, unit/echelon, and query bounds
- Query/Action template: exact operator action or API payload skeleton
- Expected schema: critical fields expected from the tool response
- Protocol/transport: format and delivery path (for example USMTF over message bus)
- Fallback: manual workaround and confidence/timeline impact if the tool is unavailable

Also map each critical dependency to a domain packet in `domain-tool-packet-library.md` by `packet_id` and `protocol_profile`.

## Tool Invocation Packet Template

Use this compact packet format when recommending or invoking external tools:

```text
Tool Invocation Packet
- Tool/System:
- Objective:
- Inputs:
  - AOI:
  - Time Window (UTC):
  - Unit/Echelon:
  - Data Class/Handling:
- Query or Action Template:
- Expected Output Schema:
- Protocol/Transport:
- Primary/Alternate/Degraded Profile Mapping:
- Fallback Procedure:
- Confidence Impact if Degraded:
```

## Tool Families and Typical Use

- C2/COP tools: GCCS-J, CPOF, JADOCS, ATAK/WinTAK, JBC-P
- Air operations tools: TBMCS, PRISM, TAIS, airspace and ATO planning systems
- Fires/effects tools: AFATDS and joint fires coordination systems
- Intelligence tools: DCGS variants, GEOINT exploitation tools, ISR collection managers
- Logistics/readiness tools: GCSS variants, sustainment and maintenance systems
- Cyber tools: SIEM/SOAR platforms, endpoint telemetry stacks, network defense consoles
- Space/SATCOM tools: SDA catalogs, SATCOM planning/monitoring dashboards
- Maritime tools: C2 afloat systems, track management, mine/ASW mission tools, AIS feeds
- Medical tools: patient regulation systems, medical logistics inventories, blood program trackers
- Training/simulation tools: JCATS/JTLS-style simulation, mission rehearsal systems, digital ranges
- Software factory tools: CI/CD pipelines, SBOM scanners, artifact repositories, security test suites
- Air and missile defense tools: IBCS, FAAD C2, C2BMC, Aegis C2
- Personnel recovery tools: PRCC/PRMS workflows, isolated personnel reporting systems
- Identity and biometrics tools: ABIS-style biometric stores, encounter management systems
- Civil support and crisis tools: NIMS/ICS workflows, emergency operations dashboards
- ISR and mission planning middleware: FIXM/AIXM-conformant exchange gateways, tasking brokers, and theater data fabrics
- Weather and geophysical tools: AFWA/NOAA-style feeds, oceanographic models, and route weather decision support
- Mission assurance tools: SBOM/vulnerability scanners, software supply chain attestations, and release approval dashboards

## Domain-to-Tool and Protocol Matrix

- Land maneuver/protection: CPOF/JBC-P + route clearance/force protection systems; protocols: VMF, CoT, USMTF
- Air and fires integration: TBMCS/TAIS/AFATDS/JADOCS; protocols: Link 16 J-series, VMF, USMTF
- Maritime and littoral: afloat C2 + AIS + mine/ASW mission systems; protocols: Link 16 J-series, AIS/NMEA, USMTF
- Space and SATCOM: SDA catalogs + SATCOM planners + spectrum tools; protocols: API/JSON, USMTF, Link 16 where applicable
- Cyber and information: SIEM/SOAR + threat intel exchanges; protocols: STIX/TAXII, API/JSON
- Logistics and mobility: GCSS + movement/transport planners + sustainment dashboards; protocols: USMTF, XML/JSON, API
- Medical and casualty operations: patient regulation + med logistics + evacuation coordination; protocols: USMTF medical reporting, API/JSON, HL7/FHIR where available
- Coalition/interagency support: coalition COP tools + liaison data fabrics; protocols: NATO APP-11/ADatP-3 aligned formats, OGC, USMTF
- Air defense battle management: IBCS/FAAD/C2BMC + sensor fusion nodes; protocols: Link 16 J-series, USMTF
- CSAR and personnel recovery: PRCC systems + ISR cueing + mission planning tools; protocols: USMTF, CoT, VMF
- Strategic deterrence readiness: strategic C2 readiness systems + force status reporting; protocols: USMTF, secure reporting formats
- Domestic civil-support response: DSCA mission assignment systems + ICS workflows; protocols: USMTF, API/JSON
- Harbor clearance and salvage: maritime C2 + hydrographic/salvage planning tools; protocols: AIS/NMEA, OGC, USMTF
- Information integrity and attribution: media-forensics tools + narrative tracking dashboards + public affairs workflows; protocols: API/JSON, STIX/TAXII, USMTF
- Personnel recovery integration: PRCC tools + ISR cueing + mission planners; protocols: USMTF, VMF, CoT
- Energy and infrastructure resilience: operational energy systems + utility telemetry + engineering ops boards; protocols: API/JSON, OGC, USMTF

## Domain Toolchain Profiles (required selection)

Every recommendation must pick and justify one profile:

- Primary profile: preferred systems and transport path under normal mission conditions
- Alternate profile: survivable backup when primary data sources or links degrade
- Degraded profile: minimum viable manual/semi-manual workflow with expected delay and confidence loss

Use profile selections that fit the mission domain:

- JOC and battle rhythm: GCCS-J/COP + secure chat/workflow boards + USMTF/CoT update paths
- Collection management and ISR retasking: ISR managers + DCGS variants + VMF/USMTF collection requests
- Tactical UAS traffic management: TAIS/airspace planners + UAS C2 + Link 16/VMF/USMTF
- Autonomous convoy and sustainment routing: logistics C2 + route risk tools + CoT/USMTF/API
- Space reconstitution and SATCOM restoration: SDA catalogs + SATCOM planners + API/JSON + USMTF
- Hypersonic defense integration: missile warning feeds + IAMD C2 + Link 16 J-series + USMTF
- Expeditionary fabrication and battle damage repair: maintenance systems + additive manufacturing queues + API/JSON
- Gap crossing and engineer mobility: engineer planning tools + maneuver COP + VMF/USMTF/CoT
- Undersea cable protection/restoration: maritime COP + infrastructure telemetry + AIS/NMEA + USMTF
- Tactical MISO and influence effects: audience analysis tools + assessment dashboards + API/JSON + USMTF
- Special reconnaissance and sensitive site mapping: GEOINT stacks + site exploitation trackers + OGC/CoT/USMTF
- Hunt-forward cyber defense: SIEM/SOAR + endpoint/network telemetry + STIX/TAXII + API/JSON
- Electronic order of battle management: EW mission tools + emitter libraries + Link 16/USMTF/API
- Security assistance integration: partner readiness systems + logistics trackers + NATO APP-11/ADatP-3 + USMTF
- Mega-city sustainment: urban logistics overlays + civil infrastructure feeds + OGC/CoT/API
- Arctic corridor deconfliction: weather/ice data + maritime/air COP + AIS/NMEA + Link 16 + USMTF

## Integration Interfaces and Transports

- APIs: REST/GraphQL/gRPC gateways behind approved service boundaries
- Streaming/data bus: Kafka-compatible, AMQP, or mission data fabrics where authorized
- Tactical links/waveforms: Link 16, VMF, CoT transports, SATCOM relay paths
- Geospatial services: OGC WMS/WFS/WMTS, tiled map services, feature services
- File/data exchange: XML/JSON/CSV with schema validation and checksum verification

## Common Data and Message Protocols

- `USMTF`: formal military message traffic for standardized operational reporting
- `VMF`: tactical digital message exchange for ground maneuver and fires coordination
- `Link 16 J-series` (MIL-STD-6016): tactical data link messaging for air/maritime/ground tracks
- `Cursor on Target (CoT)`: lightweight situational event sharing (frequently ATAK/WinTAK)
- `STIX/TAXII`: machine-readable cyber threat intel sharing and ingestion
- `OGC WMS/WFS/WMTS`: geospatial map and feature service interoperability
- `NATO APP-11/ADatP-3 aligned formats`: coalition reporting and message interoperability context
- `AIS/NMEA`: maritime vessel track reporting for port/harbor and maritime domain awareness
- `NIMS/ICS`: domestic emergency management command structure and coordination framework
- `HL7/FHIR`: medical interoperability standards used by patient and care data systems
- `ICAO Doc 9303`: machine-readable travel-document standards for passport and no-fee passport continuity
- `AAMVA DL/ID`: interoperable driver-license and vehicle-registration exchange for lawful mobility decisions
- `PESC XML`: education-record and enrollment exchange for FAFSA, student-loan, and academic reentry continuity
- `AIXM/FIXM/iwxxm`: aviation information exchange models for airspace/flight/weather interoperability
- `MISP`: cyber threat sharing format commonly bridged with STIX/TAXII workflows
- `DDS/MQTT` (authorized enclaves): lightweight pub/sub patterns for edge telemetry dissemination

## Protocol Selection Rules (required)

Apply these rules before finalizing any recommendation:

1. Match protocol to receiving unit system first, then optimize for speed and resilience.
2. If a tactical link is intermittent, pair it with a robust message fallback (for example Link 16 + USMTF).
3. For cross-domain products, include one machine-ingestible format and one commander-readable summary.
4. For coalition delivery, include schema assumptions and any translation loss risk.
5. For edge/disconnected teams, define synchronization cadence and conflict-resolution priority when links restore.
6. For mission-critical recommendations, include a machine-readable packet and a human-readable command summary.

## Degraded Operations Playbook

- Loss of primary C2 transport: switch to alternate profile and publish minimum viable decision packet within 15 minutes.
- Loss of authoritative data feed: downgrade confidence, cross-check with secondary sources, and define revalidation trigger.
- Loss of geospatial service: continue with last known common operating map and annotate stale layers/time.
- Loss of automation tooling: execute manual checklist and emit a delayed but auditable recommendation.
- Loss of coalition data exchange path: switch to releasable subset schema and annotate omitted fields with operational impact.
- Loss of data-link interoperability: execute gateway bypass/reroute checklist and provide timing/risk effect to commander.

## Output Requirements for Any Skill Using External Tools

Include these fields in outputs when tool integration is used:

- Source systems queried
- Protocol/message format selected and why
- Last refresh timestamp (UTC)
- Confidence and known gaps
- Classification/handling caveat placeholder (unclassified by default unless user specifies)
- Tool Invocation Packet fields for each critical tool dependency
- Domain packet mapping (`packet_id` and `protocol_profile`) for each critical tool dependency
- Adapter contract ID and endpoint class for each critical tool dependency

## Operational Safety and Governance Addendum

- Confirm recommendation is advisory support only; execution requires authorized human command decision.
- Do not provide weapon-employment procedures, target engagement mechanics, or bypasses to safeguards.
- Require explicit human validation for lethal, strategic, or high-consequence actions.
- If authority, legality, or data provenance is uncertain, stop and return a no-go recommendation with escalation path.

## Data Contract Requirement

- Use `joint-mission-data-contracts.md` to choose a domain profile and validate required fields before releasing any recommendation.
- Include the selected `contract_id` and gate status (schema/freshness/provenance/consistency/releasability) in outputs that drive operational decisions.

## Human-Agent Escalation Binding (2026-03-07)

- Apply `human-agent-command-escalation-matrix.md` for every high-consequence recommendation that uses external tools.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` alongside protocol/output fields.
- If authority scope, acknowledgment integrity, or legal basis is uncertain, downgrade to advisory-only and publish explicit commander decision prompts.

## Cross-Domain Integration Binding (2026-03-07)

- Use `cross-domain-integration-playbook.md` whenever recommendations span two or more mission domains.
- Include `integration_id`, `domains`, `protocol_binding`, `refresh_sla_minutes`, and `staleness_trigger` in each critical tool packet.
- If cross-domain translation or releasability introduces ambiguity, publish a constrained recommendation and escalate for human command approval.

## Domain Toolchain Profiles (2026-03-06 Expansion)

- Electromagnetic protection and waveform agility: EW mission data tools + spectrum analytics + Link 16/USMTF/API
- Autonomous wingman governance: autonomy control stations + authority policy engines + API/JSON + USMTF
- GPS-denied precision landing: TRN/pseudolite planners + weather minima tools + USMTF + AIXM/FIXM
- Humanitarian corridor deconfliction: coalition movement boards + civil access trackers + NATO APP-11 + OGC + USMTF
- Polar subsea cable sabotage detection: undersea telemetry + maritime anomaly engines + AIS/NMEA + USMTF
- Biomanufacturing countermeasure surge: MES/QA systems + med logistics C2 + API/JSON + HL7/FHIR + USMTF
- Data-diode cross-domain sync: CDS guards + transfer orchestrators + schema validators + XML/JSON + USMTF
- Civil defense mass evacuation: ICS dashboards + transport routing + shelter management + NIMS/ICS + CAP + EDXL-DE
- Electromagnetic environmental effects hardening: E3 models + platform vulnerability DB + mission assurance dashboards + API/JSON
- Campaign red-cell wargaming: simulation engines + adversary behavior models + API/JSON + USMTF summaries
- Maritime autonomous traffic control: uncrewed vessel managers + maritime COP + collision analytics + AIS/NMEA + COLREGS-aligned outputs
- Allied munitions interoperability: munitions ERP + safety compliance tools + NATO logistics formats + USMTF
- Tactical quantum sensing fusion: quantum feed brokers + ISR fusion stacks + OGC/API + USMTF
- Directed-energy thermal and power budgeting: platform power managers + thermal models + API/JSON + USMTF
- Contested legal attribution: forensic evidence chains + legal decision workflows + STIX/TAXII + API/JSON + USMTF
- Space-weather PNT/comms degradation: space weather feeds + timing integrity monitors + API/JSON + USMTF + Link 16
- Counter-swarm logistics protection: C-UAS C2 + convoy route risk engines + Link 16/VMF/CoT
- Waterway denial and bridge control: riverine C2 + engineer planning + VMF/CoT + USMTF
- Battlefield digital twin infrastructure: digital twin simulators + telemetry buses + OGC/API + USMTF
- Tactical climate adaptation: climate hazard models + weather effects decision tools + API/JSON + USMTF

## Additional Interoperability Standards

- `EDXL-DE/CAP`: emergency data exchange and public warning message packaging for civil defense workflows
- `COLREGS-aligned machine rules`: maritime collision-avoidance interoperability constraints for uncrewed traffic control
- `AIXM/FIXM procedure subsets`: precision approach/landing data exchange for contested-airfield and degraded nav operations

## Domain Toolchain Profiles (2026-03-07 Expansion)

- Homeland critical infrastructure defense: ICS/EOC coordination systems + utility telemetry + transportation status boards + NIMS/ICS + OGC + USMTF
- Tactical battery repair and recertification: BMS telemetry tools + maintenance quality systems + safety incident reporting + API/JSON + USMTF
- Expeditionary veterinary and zoonotic risk: veterinary case management + force health surveillance + food-chain inspection logs + HL7/FHIR + USMTF
- Joint PIR governance: ISR requirement trackers + collection management boards + commander decision logs + USMTF + VMF + API/JSON
- Maritime quarantine and biosecurity control: vessel movement boards + port health dashboards + contamination screening workflows + AIS/NMEA + HL7/FHIR + USMTF
- Coalition sanctions evasion tracking: financial anomaly tooling + sanctions-list fusion + logistics procurement traces + STIX/TAXII + API/JSON + coalition formats
- Joint evacuation throughput control: movement control systems + patient regulation + NEO coordination boards + USMTF + VMF + CoT
- Rare-gas and cryogenic assurance: industrial production trackers + strategic inventory systems + transport integrity telemetry + API/JSON + USMTF
- Denied geodesy and map production: offline geospatial toolkits + terrain update brokers + PNT confidence monitors + OGC + CoT + USMTF
- Autonomous CBRN cueing and isolation: hazard sensor networks + contamination model services + protective posture tracking + USMTF CBRN + API/JSON + CoT
- Joint force posture political risk forecasting: alliance sentiment models + strategic messaging boards + policy risk telemetry + USMTF + API/JSON
- Contested orbital ground station security: perimeter monitoring + facility access telemetry + orbital service continuity boards + API/JSON + OGC + USMTF

## Additional Interoperability Standards (2026-03-07 Expansion)

- `NIST CSF 2.0 profile mappings`: infrastructure and cyber readiness language for cross-agency mission assurance
- `ISO 22320 / emergency management process frames`: command-and-control process alignment for civil support coordination
- `ISO 31000 risk vocabulary`: common risk terminology for coalition and interagency decision products
- `GeoPackage (OGC)`: disconnected geospatial package format for denied-environment map sharing

## Domain Toolchain Profiles (2026-03-07 Expansion)

- Urban CBRN decontamination corridors: CBRN sensing grids + civil health systems + NIMS/ICS + USMTF
- Command voice anti-spoofing: secure voice gateways + media forensics + identity telemetry + STIX/TAXII + API/JSON
- Autonomous combat engineer breach: engineer robotics control + mobility C2 + VMF/CoT + USMTF
- Airbase camouflage and decoy: signature simulation tools + GEOINT change detection + Link 16/USMTF
- Coalition SOFA/legal interoperability: coalition legal repositories + caveat trackers + NATO APP-11/ADatP-3 + USMTF
- Distributed maritime buoy orchestration: undersea sensor managers + maritime COP + AIS/NMEA + Link 16
- Civil telecom restoration: telecom OSS/BSS + infrastructure telemetry + NIMS/ICS + EDXL-DE/CAP
- Solar radiation hardening response: space-weather feeds + SATCOM health monitors + API/JSON + USMTF
- Stratospheric balloon countermeasure: air domain sensors + ISR fusion + Link 16 J-series + VMF
- Fuel refinery disruption impact: energy telemetry + logistics C2 + API/JSON + USMTF
- Amphibious littoral crossing: hydrographic planning + maneuver COP + VMF + CoT + USMTF
- Counter-disinformation measurement: MISO analytics + narrative telemetry + STIX/TAXII + API/JSON
- Drinking water contamination response: water quality telemetry + med surveillance + HL7/FHIR + USMTF
- Reserve mobilization readiness: personnel readiness systems + training registries + USMTF readiness reporting
- Contested QKD SATCOM: key management platforms + SATCOM controllers + API/JSON + secure message buses
- Electromagnetic fratricide prevention: spectrum deconfliction systems + EW planners + Link 16 + VMF
- Allied maintenance data rights/tech transfer: maintenance ERPs + export-control tooling + coalition data exchanges
- Battlefield forensics fusion: forensic evidence systems + chain-of-custody registries + STIX/TAXII + USMTF
- Expeditionary aquaculture and nutrition resilience: sustainment dashboards + environmental sensors + logistics APIs
- Launch window threat/weather: launch range C2 + weather/space-weather intelligence + AIXM/FIXM + USMTF

## Domain Toolchain Profiles (2026-03-07 Execution-Governance Expansion)

- Maritime chokepoint mining and clearance governance: mine warfare C2 + maritime COP + AIS/NMEA + Link 16 + USMTF
- Strategic cognitive warfare detection/response: media forensics + narrative analytics + STIX/TAXII + USMTF
- Expeditionary toxic-site restoration: CBRN survey systems + environmental telemetry + NIMS/ICS + USMTF
- Low-slow air threat suppression: low-RCS sensor fusion + air defense C2 + Link 16 J-series + USMTF
- Coalition procurement integrity: vendor-risk analytics + contract compliance tools + NATO APP-11/ADatP-3 + API/JSON
- Tactical power-grid islanding/black-start: microgrid controllers + SCADA telemetry + API/JSON + USMTF
- Cloud-denied data fusion: edge brokers + store-and-forward relays + schema validators + API/JSON + USMTF
- River-crossing and hydrology intelligence: hydro models + engineer planning tools + VMF + CoT + USMTF
- Autonomous robot lane clearance: robotics mission controllers + route clearance systems + CoT + VMF
- Denied-environment HUMINT validation: HUMINT management + source reliability analytics + API/JSON + USMTF
- Pharmaceutical supply integrity: lot traceability + med logistics systems + HL7/FHIR + USMTF
- Electromagnetic battlefield illumination: spectrum analytics + EW mission planners + Link 16 + VMF
- Rapid cold-start maintenance: predictive diagnostics + maintenance ERP + API/JSON + USMTF
- Drone-port reconstitution: UAS traffic management + sortie generation + AIXM/FIXM + USMTF
- Coalition shipyard repair surge: shipyard ERP + fleet readiness dashboards + NATO data exchanges + USMTF
- Wargame telemetry and outcomes: simulation telemetry buses + campaign analytics + API/JSON + USMTF
- Tactical vector control and force health: surveillance systems + vector models + HL7/FHIR + API/JSON
- Undersea critical-node repair window optimization: subsea telemetry + repair vessel scheduling + AIS/NMEA + USMTF
- Precision navigation signal-of-opportunity fusion: PNT integrity monitors + SoOP fusion + Link 16 + USMTF
- Contract security and vetting: vetting services + access control systems + threat-intel exchanges + STIX/TAXII

## Protocol Execution Controls (required)

- Define an ordered invocation chain for all critical dependencies (`invoke_order` 1..n).
- Attach `adapter_contract_id` and `endpoint_class` to each invocation before execution.
- Set explicit timeout and retry policy for every invocation and log the result status.
- If any critical invocation fails, publish degraded-mode branch actions within the same output.
- Require human command validation before any recommendation that alters force posture or escalation risk.

## Canonical Toolchain Profile Registry (2026-03-07)

- Use `domain-toolchain-profiles.md` as the canonical registry for `toolchain_id` assignment.
- Require each skill recommendation to include explicit `primary_system`, `cross_check_system`, `protocol_binding`, `credential_scope`, and `fallback_path` fields.
- Treat recommendations as `provisional` when credential scope or authority basis is incomplete.
- Require cross-check freshness and authority validation before publishing commander-facing recommendations.

## Tool Health and Trust Monitoring (2026-03-07)

- Apply `tool-health-and-trust-monitoring.md` for pre-mission probes, trust scoring, and failover evidence before release.
- Require each critical dependency to include `tool_health_id`, `trust_score`, `last_probe_utc`, `degradation_mode`, and `failover_executed`.
- If trust score is below mission threshold, downgrade output to `provisional` or `no-go` and provide explicit commander decision prompts.
- Record `switch_time_ms`, `data_loss_window`, and `commander_impact` when failover is triggered.
- Do not publish high-consequence recommendations unless at least one independent cross-check source is healthy and fresh.

## Protocol Assurance Drill Requirement (2026-03-07)

- Before finalizing recommendations with external dependencies, run the drill in `./us-joint-protocol-assurance-drill.md`.
- Include these required fields in commander/staff products: `assurance_drill_id`, `interop_score`, `crypto_posture`, `ack_chain_status`, `release_status`.
- Do not mark recommendations as mission-ready when `release_status` is `hold` or `ack_chain_status` is not `complete`.
- If protocol assurance fails, switch to documented degraded-mode paths and identify remediation owner/suspense.

## External Tool Families for Current U.S. Warfighter Integration

- C2 and fires: GCCS-J/JADOCS, AFATDS, TBMCS, AOC WS, Link 16/JREAP gateways.
- ISR and geospatial: DCGS-A/DCGS-N, TAK ecosystem, Palantir variants, OGC WMS/WFS services.
- Cyber/defensive operations: SIEM/SOAR stacks, EDR telemetry brokers, STIX/TAXII exchanges.
- Sustainment and mobility: GCSS-Army/GCSS-MC, LOGCOP feeds, movement control and depot systems.
- Medical and personnel: TMIP-J, theater patient movement trackers, blood/logistics management systems.
- Space and spectrum: SDA feeds, SATCOM network managers, EMSO planning/deconfliction tools.

## Protocol Mapping Guidance (Quick Bind)

- Air and missile warning dissemination: `Link 16` + `USMTF` narrative fallback.
- Tactical ground maneuver synchronization: `VMF`/`CoT` with map tile overlays.
- Coalition cyber threat sharing: `STIX/TAXII` with releasability tags.
- Sensor/track geospatial overlays: `OGC` interfaces with signed metadata provenance.
- Long-haul message continuity under disruption: message queuing with deterministic retry/ack timers.

## Domain Toolchain Profiles (2026-03-07 Polar Access and Infrastructure Continuity Expansion)

- Polar icebreaker convoy and port access: ice reconnaissance feeds + maritime COP + convoy routing planners + AIS/NMEA + USMTF
- Tactical emitter deconfliction: spectrum management tools + EW planning systems + Link 16/VMF + USMTF fallback
- Host-nation grid cyber restoration: utility ICS telemetry + cyber incident response platforms + API/JSON + NIMS/ICS + USMTF
- Autonomous fuel-farm integrity monitoring: fuel telemetry sensors + contamination analytics + sustainment C2 + API/JSON + USMTF
- Microchip counterfeit forensics: hardware provenance registries + firmware attestation tooling + STIX/TAXII + API/JSON
- Dynamic humanitarian no-fly windows: airspace control systems + civil movement trackers + AIXM/FIXM + USMTF
- Contested biometric edge sync: biometric repositories + disconnected sync brokers + secure API/JSON + CoT/USMTF
- Cislunar PNT relay contingency: deep-space timing sources + relay planners + SATCOM management + API/JSON + USMTF
- Waste-to-energy fuel recovery: expeditionary utilities telemetry + sustainment ERP + API/JSON + USMTF readiness reporting
- Dam and hydroelectric stabilization: hydro telemetry + engineer mission planning + civil emergency dashboards + NIMS/ICS + USMTF
- Rail sabotage detection and reroute: rail telemetry and schedule systems + movement-control C2 + API/JSON + USMTF
- Undersea cable landing defense: subsea sensing networks + maritime domain awareness tools + AIS/NMEA + Link 16 + USMTF

## Warfighter Tool Authority Gates (2026-03-07 Expansion)

- Apply `warfighter-tool-authority-gates.md` for every recommendation that can materially affect mission posture, escalation risk, or force protection.
- Include `authority_tier`, `decision_impact_level`, `requires_human_approval`, `approval_role`, and `audit_record_id` in final products.
- If authority or legal basis is uncertain, issue an advisory-only recommendation and escalate for human command decision.

## Domain Toolchain Profiles (2026-03-07 Strategic Governance Expansion)

- Strategic deterrence escalation management: strategic warning boards + secure strategic messaging + policy/legal review + USMTF/API
- NC3 continuity resilience: NC3 status monitors + ACK integrity validators + authenticated message buses + USMTF
- Detainee operations law-of-war compliance: detainee tracking + legal workflow engines + transfer coordination + USMTF/NATO APP-11
- Expeditionary mortuary affairs and DNA identification: mortuary tracking + forensic lab workflow + chain-of-custody systems + USMTF/API
- Tactical disconnected financial rails integrity: disconnected ledgers + anti-fraud analytics + reconciliation engines + API/USMTF
- Quantum-resistant mission crypto migration: crypto inventory/PKI managers + interoperability test rigs + governance dashboards + API/USMTF
- Contested public-health force protection: surveillance networks + force-health analytics + clinical reporting + HL7/FHIR/USMTF/NIMS
- Denied-environment additive bioprinting support: fabrication control + quality management + med-log orchestration + HL7/FHIR/API
- Submarine cable legal attribution/response: subsea telemetry + maritime anomaly analytics + evidence chain tooling + AIS/STIX/USMTF/OGC
- Orbital spectrum conflict and traffic priority: SATCOM allocators + interference monitors + mission priority engines + API/USMTF/Link 16

## Additional Protocol Mapping Guidance (2026-03-07)

- Strategic signaling and continuity messaging: pair authenticated message channels with `USMTF` command narrative and ACK integrity fields.
- Detainee, custody, and remains workflows: require auditable chain-of-custody fields, legal review identifiers, and transfer/notification checkpoints.
- Disconnected finance continuity: use signed ledger exports plus delayed reconciliation protocols, with manual dual-control fallback.
- PQC migration governance: include transitional crypto mode tags, interoperability gate status, and rollback plan references.
- Public-health and medical fabrication operations: include clinical authority tags, quality release gates, and force-readiness impact deltas.
- Subsea/orbital incident response: include legal-attribution confidence ladders, coalition acknowledgment status, and degraded options when evidence is incomplete.

## Domain Toolchain Profiles (2026-03-08 Expansion)

- Joint biosecurity and lab incident response: biosurveillance fusion + lab incident reporting + force-health dashboards + HL7/FHIR + USMTF + NIMS/ICS
- Deployed digital identity wallet revocation: identity lifecycle orchestration + revocation status brokers + access policy engines + API/JSON + signed ledgers + USMTF
- Quantum-resistant crypto transition: crypto asset inventory + PKI lifecycle managers + interoperability test harnesses + API/JSON + PKI protocols + USMTF
- Undersea cable sabotage attribution and repair prioritization: cable telemetry analytics + maritime anomaly fusion + legal evidence chain workflows + AIS/NMEA + OGC + STIX/TAXII + USMTF
- Orbital spectrum priority and SATCOM continuity: SATCOM arbitration tools + interference monitors + mission-priority routing + API/JSON + USMTF + Link 16 where interoperable
- Coalition electromagnetic compatibility certification: spectrum assignment and emitter databases + RF monitoring meshes + conflict adjudication boards + USMTF + coalition formats + API/JSON
- Autonomous systems safety incident governance: autonomy telemetry replay + safety case management + corrective action workflows + API/JSON + signed audit records + USMTF
- Contested AI model governance: model registry/deployment controls + trust evaluation harnesses + red-team benchmarks + API/JSON + signed model attestations + USMTF
- Military deception effects measurement: influence telemetry analytics + adversary behavior indicators + assessment dashboards + API/JSON + STIX/TAXII + USMTF
- Cyber-physical water treatment protection: ICS/SCADA monitoring + water quality telemetry + incident response boards + API/JSON + OGC + NIMS/ICS + USMTF
- Host-nation port health and biosecurity: port operations systems + vessel screening workflows + quarantine control boards + AIS/NMEA + HL7/FHIR + USMTF
- Expeditionary OSINT verification: source aggregation + media authenticity forensics + geolocation chronolocation + API/JSON + STIX/TAXII + USMTF
- Munitions transport/storage fragmentation safety: explosive compatibility tools + route risk planners + storage hazard models + USMTF + API/JSON + NATO logistics formats
- High-altitude platform persistence management: stratospheric platform C2 + payload handover schedulers + atmospheric route effects analytics + API/JSON + OGC + USMTF
- Mission-data provenance and releasability auditing: provenance graph services + coalition releasability policy engines + schema validators + API/JSON + coalition exchange formats + USMTF
- Rapid runway crater repair deconfliction: engineering repair schedulers + runway condition analytics + sortie regeneration boards + USMTF + Link 16 + AIXM/FIXM
- EMP cascade consequence management: mission dependency graphing + infrastructure restoration orchestration + comm-path resilience monitors + USMTF + API/JSON + NIMS/ICS
- Commander-priority information synthesis: fused COP analytics + priority alerting + command decision boards + USMTF + CoT + API/JSON
- Disconnected time synchronization and PNT holdover: timing distribution systems + oscillator health analytics + alternate navigation confidence fusion + API/JSON + time-transfer standards + USMTF
- Additive feedstock counterfeit detection: material fingerprinting + provenance ledgers + quality release systems + API/JSON + signed provenance artifacts + USMTF

## Domain Toolchain Profiles (2026-03-11 Mobilization Assurance and Cross-Domain Recovery Expansion)

- CBRN drone sample custody and lab routing: sample custody platforms + contamination scoring + lab queue systems + CBRN USMTF + HL7/FHIR + signed manifests
- Fuel-water-railhead sabotage correlation: sustainment telemetry fusion + incident graph analytics + rail movement systems + STIX/TAXII + API/JSON + USMTF
- Coalition civil maritime autonomy jamming response: maritime autonomy controllers + jamming analytics + convoy reroute planners + AIS/NMEA + Link 16 + USMTF
- Strategic launch industrial robotics cyber resilience: industrial robotics SOC tools + launch continuity boards + containment orchestrators + IEC 62443 + API/JSON + USMTF
- Denied-cloud mission software patch attestation: attestation ledgers + deployment ring managers + rollback governance tools + signed SBOM manifests + API/JSON + USMTF
- Cross-border river flood bridging and evacuation: flood geospatial systems + engineer crossing planners + evacuation routing boards + OGC + NIMS/ICS + USMTF
- Expeditionary field data-center relocation: dependency maps + relocation cutover schedulers + key custody trackers + API/JSON + signed custody manifests + USMTF
- Space-ground emission window and RF fratricide prevention: emission planning tools + spectrum fratricide analytics + timing monitors + Link 16 + VMF + USMTF
- Coalition multilingual target warning authentication: translation assurance services + authenticity engines + coalition release trackers + NATO APP-11/ADatP-3 + signed manifests + USMTF
- Wearable biosurveillance anomaly triage: wearable telemetry fusion + clinical threshold engines + readiness dashboards + HL7/FHIR + API/JSON + USMTF
- Homeland airport mass-casualty runway defense/recovery: airport incident systems + runway restoration planners + casualty routing tools + AIXM/FIXM + NIMS/ICS + USMTF
- Orbital debris reentry force protection: orbital event feeds + risk projection tools + warning dissemination boards + CCSDS event exchange + API/JSON + USMTF

## Protocol Mapping Guidance (2026-03-11 Mobilization Assurance and Cross-Domain Recovery)

- CBRN sample custody workflows: require signed custody manifests, contamination confidence tags, and lab release acknowledgments.
- Rail/fuel/water sabotage triage: require dual-source threat corroboration before major throughput reroutes.
- Maritime autonomy under jamming: pair autonomous corridor instructions with manual convoy fallback and coalition acknowledgment check-ins.
- Strategic industrial robotics protection: separate cyber containment decisions from production release decisions with explicit authority gates.
- Disconnected patch deployment: enforce attestation-before-deployment with immediate rollback branch and command sign-off fields.
- Flood bridging/evacuation operations: include life-safety priority tiers and cross-border authority reconciliation checkpoints.
- Data-center relocation cutovers: include mission-service dependency order, key-custody continuity fields, and post-cutover validation windows.
- RF emission-window governance: include fratricide-risk thresholds and mission timing confidence tags for each release window.
- Multilingual coalition warnings: include authenticity score, translation confidence score, and acknowledgment completion status.
- Wearable force-health triage: include privacy-handling tag, medical authority reviewer, and readiness effect estimate.
- Airport mass-casualty runway recovery: include runway viability confidence, casualty throughput threshold, and airlift release status.
- Orbital reentry protection messaging: include projected footprint uncertainty, alert-zone priority, and force-protection acknowledgment chain.

## Domain Toolchain Profiles (2026-03-11 Cross-Theater Continuity and Authentication Expansion)

- Multi-orbit SATCOM denial reconstitution: SATCOM orchestration suites + link-health telemetry + mission-priority comm routing + API/JSON + USMTF + Link 16 fallback narratives
- Seabed energy-pipeline protection and repair: undersea infrastructure telemetry + ROV mission planners + maritime risk fusion + AIS/NMEA + OGC + USMTF
- Denied additive feedstock provenance/substitution: material fingerprinting services + quality release systems + provenance ledgers + API/JSON + signed manifest attestations + USMTF
- Mass-casualty biometric identity reconciliation: biometric repositories + forensic lab workflow systems + casualty accountability boards + API/JSON + HL7/FHIR + USMTF
- Synthetic-media watermark evidence assurance: watermark verification engines + media-forensics analytics + legal evidence workflows + STIX/TAXII + API/JSON + signed evidence manifests
- LVC spectrum rehearsal safety and deconfliction: spectrum planning boards + rehearsal telemetry replay + emissions conflict analytics + Link 16 + VMF + USMTF
- Coalition civil telecom priority restoration: telecom OSS/BSS + outage adjudication boards + civil emergency dashboards + NIMS/ICS + EDXL-DE/CAP + USMTF
- Tactical radiation evacuation route optimization: radiological sensor fusion + evacuation route optimizers + casualty flow command boards + CBRN USMTF + OGC + HL7/FHIR
- Uncrewed under-ice resupply corridors: under-ice navigation telemetry + autonomous logistics controllers + ice-threat models + API/JSON + AIS/NMEA derivatives + USMTF
- Sanctioned supply substitution and denial: sanctions intelligence analytics + supply-chain substitution planners + trade-route risk monitors + STIX/TAXII + API/JSON + USMTF

## Protocol Mapping Guidance (2026-03-11 Cross-Theater Continuity and Authentication)

- Multi-orbit SATCOM continuity: require per-path acknowledgment status, comm-priority queue tags, and fallback trigger thresholds.
- Seabed pipeline repair sequencing: include repair window confidence, maritime hazard gate checks, and mission energy impact deltas.
- Additive feedstock substitutions: include provenance score, substitution authority signature, and quality-release evidence bundle.
- Biometric reconciliation in mass-casualty events: include confidence ladder, duplicate-identity resolution status, and legal/notification reviewer fields.
- Watermark evidence assurance: include cryptographic verification method, custody ledger ID, and releasability constraint tags.
- LVC spectrum rehearsal controls: include fratricide-risk score, emit/hold gates, and post-rehearsal incident replay references.
- Civil telecom restoration priorities: include life-safety tier, mission-priority service class, and civil-military coordination acknowledgment.
- Radiation evacuation routing: include projected dose envelope, reroute invalidation trigger, and medic/regulation coordination checkpoints.
- Under-ice uncrewed logistics: include vehicle trust posture, ice-route uncertainty bounds, and recovery/beacon contingency branch.
- Sanctioned supply denial campaigns: include enforcement authority, substitution lead time, and adversary adaptation indicators.

## Domain Toolchain Profiles (2026-03-15 Gap-Closure Expansion)

- Signals intelligence and emitter geolocation fusion: SIGINT report queues + emitter geolocation boards + EW order-of-battle overlays + `Link 16 J-series` + `CoT` + `USMTF` + signed emitter manifests
- Expeditionary advanced base operations and signature management: littoral COP tools + expeditionary engineering boards + emissions-control schedulers + `CoT` + `VMF` + `Link 16 J-series` + `OGC` + `USMTF`
- Operational law and judge advocate battlefield advisory: operational-law issue trackers + claims and detainee status boards + fiscal authority ledgers + `NIEM` + `CJIS` + `USMTF` + `S/MIME`
- Orbital warfare effects deconfliction and continuity: space-effects planners + SDA conjunction boards + SATCOM continuity monitors + `CCSDS` + `STIX/TAXII` + `USMTF` + `API/JSON`
- Air mobility diplomatic clearance and staging continuity: air-mobility mission schedulers + diplomatic clearance trackers + staging and ramp-flow boards + `AIXM/FIXM` + `NIEM` + `USMTF` + `API/JSON`

## Protocol Mapping Guidance (2026-03-15 Gap-Closure Expansion)

- SIGINT cross-cue workflows: include emitter-confidence score, geolocation uncertainty ellipse, cross-cue source count, and human release gate before recommendations affect fires or maneuver.
- Expeditionary advanced base recommendations: include displacement trigger, signature budget, sustainment burn-rate, and host-nation or maritime corridor acknowledgment state.
- Judge advocate advisory products: include authority basis, legal review ID, fiscal or detention constraint tags, and explicit no-action branch when facts or approvals are incomplete.
- Orbital warfare continuity packets: include conjunction-risk band, civil or commercial service impact note, escalation-control reviewer, and revalidation deadline for every posture-changing recommendation.
- Air-mobility staging packets: include diplomatic-clearance status, staging-node capacity, patient or cargo priority, and airfield-slot confirmation before recommending reroutes or surge actions.

## Domain Toolchain Profiles (2026-03-15 Operator Readiness, Ship Survivability, and Lift Continuity Expansion)

- Flight surgeon and aeromedical waiver: aeromedical qualification ledgers + life-support discrepancy boards + `HL7/FHIR` + `AIXM/FIXM` + `USMTF`
- Naval damage control and battle stability: damage-control plots + stability calculators + `AIS/NMEA` + `OGC` + `USMTF`
- EOD render-safe and site exploitation: render-safe planners + evidence ledgers + `NIEM` + `STIX/TAXII` + `USMTF`
- Prime-power generator maintenance and load balance: generator telemetry + load-balance boards + `OPC UA` + `OGC` + `USMTF`
- Sling-load and external-lift certification: lift-certification boards + aircraft configuration validators + `AIXM/FIXM` + `VMF` + `USMTF`
- Beachmaster surf-zone and shore-party control: tide or surf boards + lane-control workflows + `OGC` + `CoT` + `VMF` + `AIS/NMEA` + `USMTF`
- Aircrew flight equipment and survival gear: life-support ledgers + inspection schedulers + `HL7/FHIR` + `AIXM/FIXM` + `USMTF`
- Small-craft riverine maintenance and spares: watercraft diagnostics + spares ledgers + `AIS/NMEA` + `VMF` + `USMTF`
- Flightline weapons loading and armament safety: armament validators + explosive-safety planners + `AIXM/FIXM` + `CoT` + `USMTF`
- Cold-weather clothing and frostbite discipline: issue ledgers + exposure tracking + `HL7/FHIR` + `OGC` + `USMTF`

## Protocol Mapping Guidance (2026-03-15 Operator Readiness, Ship Survivability, and Lift Continuity Expansion)

- Aeromedical waiver workflows: include waiver authority, privacy handling tag, sortie restriction timer, and medical-revalidation deadline before launch.
- Ship survivability packets: include compartment-boundary status, stability margin, casualty-power restoration threshold, and command release criterion for each branch.
- EOD exploitation workflows: include blast-standoff confidence, evidence-custody ledger ID, render-safe authority, and exploitation contamination risk.
- Prime-power packets: include priority circuit list, overload trigger, fuel-burn projection, and maintenance-release authority before recommending load shifts.
- External-lift certification packets: include hook-up certification state, weight or center-of-gravity confidence, weather-go thresholds, and aircraft-release acknowledgment.
- Beachmaster control packets: include surf-limit band, lane identity, shore-party capacity, and beach-release acknowledgment for each movement phase.
- Aircrew-gear packets: include inspection expiration, beacon status, environment-specific gear requirement, and no-fly trigger before release.
- Riverine-maintenance packets: include craft readiness class, parts pedigree note, patrol-coverage delta, and controlled-exchange approval when applicable.
- Flightline armament packets: include load-crew certification state, explosive-safety radius, aircraft compatibility check, and hot-ramp hold trigger.
- Cold-weather discipline packets: include wet-gear churn estimate, warming-window schedule, clothing availability, and medical no-go threshold before exposing forces.

## Domain Toolchain Profiles (2026-03-15 Specialist Readiness and Sustainment Expansion)

- Ballistic meteorology and fire-support calibration: upper-air observation boards + fire-solution recalculation services + `VMF` + `USMTF` + `iwxxm`
- Airfield weather observation and sensor maintenance: airfield observing boards + sensor health trackers + `AIXM/FIXM/iwxxm` + `OGC` + `USMTF`
- Aerial-delivery rigging and parachute inspection: rigging ledgers + parachute inspection trackers + `AIXM/FIXM` + `VMF` + `USMTF`
- Heavy-drop platform rigging and retrograde recovery: platform planners + DZ recovery boards + `AIXM/FIXM` + `VMF` + `CoT` + `USMTF`
- Ammunition surveillance and lot serviceability: surveillance ledgers + defect trackers + signed manifests + `NIEM` + `USMTF`
- Net explosive weight and munitions compatibility: quantity-distance calculators + standoff planners + `OGC` + `NIEM` + `USMTF`
- Ribbon bridge maintenance and raft launch: bridge-bay serviceability boards + current or load monitors + `VMF` + `CoT` + `OGC` + `USMTF`
- Bridge-erection-boat gap-crossing recovery: boat diagnostics + tow planners + `AIS/NMEA` + `VMF` + `OGC` + `USMTF`
- Flightline GSE readiness: AGE dispatch boards + cart availability ledgers + `AIXM/FIXM` + `OGC` + `USMTF`
- Aircraft hydraulic contamination and servicing: sample ledgers + maintenance release boards + `AIXM/FIXM` + `OPC UA` + `USMTF`

## Protocol Mapping Guidance (2026-03-15 Specialist Readiness and Sustainment Expansion)

- Ballistic-met packets: include met-message age, correction confidence, survey alignment state, and fires-hold threshold before release.
- Airfield weather packets: include observer certification, sensor drift status, launch or recovery minima, and divert trigger.
- Rigging packets: include pack-date expiration, rigger certification state, load-geometry confidence, and release authority.
- Heavy-drop packets: include extraction-system state, platform rigging status, DZ recovery capacity, and no-drop trigger.
- Ammunition-surveillance packets: include lot pedigree, defect trend confidence, quarantine threshold, and issue-control authority.
- Net-explosive-weight packets: include NEW total, exposed-site distance, compatibility exception, and evacuation trigger.
- Ribbon-bridge packets: include bay serviceability state, anchor integrity, current band, and raft-launch window.
- Bridge-erection-boat packets: include propulsion status, tow or rescue branch, spare-part availability, and crossing-hold trigger.
- GSE packets: include cart availability by line, dispatch ETA, sortie priority, and manual servicing fallback.
- Hydraulic packets: include sample-result confidence, affected-system list, component-isolation boundary, and no-fly or restricted-flight trigger.

## American Warfighter Support Systems Addendum (2026-04-07)

- Personnel identity and eligibility continuity: DEERS or eligibility reconciliation boards, ID-card issuance queues, sponsor-dependent record sync ledgers, and entitlement exception trackers; protocols: `NIEM`, signed eligibility notices, `API/JSON`, `S/MIME`, `OIDC/SAML`, `USMTF`.
- Medical-board and disability-transition continuity: MEB or PEB case trackers, duty-limitation evidence ledgers, IDES handoff boards, and VA or DOD transition-benefit queues; protocols: `HL7/FHIR`, `NIEM`, signed board notices, `API/JSON`, `S/MIME`, `USMTF`.
- Reserve pay and debt continuity: drill-attendance certification queues, pay discrepancy boards, debt-remission trackers, and travel-claim reconciliation ledgers; protocols: `NIEM`, signed pay notices, `API/JSON`, `S/MIME`, `USMTF`.
- Family and dependent support continuity: family-care-plan boards, special-education or school-liaison trackers, EFMP or guardian-support queues, and court-order or allotment ledgers; protocols: `NIEM`, signed care-plan notices, `API/JSON`, `S/MIME`, `HL7/FHIR`, `USMTF`.
- Clearance and credential continuity: personnel-security case boards, foreign-contact update queues, professional-license or cyber-certification trackers, and CEU status ledgers; protocols: `NIEM`, signed security or credential notices, `API/JSON`, `S/MIME`, `PESC XML`, `USMTF`.
- Retirement and long-tail transition continuity: retirement-packet boards, SBP election trackers, TSP counseling queues, DD214 validation boards, and transition-checklist ledgers; protocols: `NIEM`, signed retirement notices, `API/JSON`, `S/MIME`, `USMTF`.
- Household mobility and movement legitimacy: command-sponsorship boards, overseas-screening trackers, no-fee passport queues, POV shipment boards, driver-license reciprocity ledgers, and registration status trackers; protocols: `NIEM`, `ICAO Doc 9303`, `AAMVA DL/ID`, signed movement notices, `API/JSON`, `S/MIME`, `USMTF`.
- Education-finance and college reentry continuity: student-loan servicer boards, FAFSA or enrollment trackers, military deferment queues, and academic reentry ledgers; protocols: `NIEM`, `PESC XML`, signed education-finance notices, `API/JSON`, `S/MIME`, `USMTF`.

## Support-Case Protocol Selection Rules (2026-04-07)

1. Cross-check at least one authoritative personnel, medical, or finance source with one family-support, legal-support, or case-management source before recommending action.
2. Use `NIEM` for case and entitlement exchange by default, then add `HL7/FHIR`, `PESC XML`, or `OIDC/SAML` only when the receiving system actually needs health, education, or identity assertions.
3. Treat signed notices and acknowledgment chains as mandatory for benefit, pay, legal, or custody-affecting actions; if signature or acknowledgment integrity is missing, downgrade to advisory-only.
4. For family or dependent cases, include a privacy-minimizing branch that limits exposed household data to only what the receiving office requires.
5. For mobilization or recovery decisions, map every support-system recommendation back to a readiness effect such as deployability, retention, availability, or lawful force flow.

## American Warfighter Transition and Career Protection Addendum (2026-04-07)

- DD93, SGLI, TSGLI, and estate-readiness continuity: beneficiary-trust boards, DD93 verification queues, casualty-support rehearsal ledgers, and estate-document trackers; protocols: `NIEM`, signed beneficiary notices, `API/JSON`, `S/MIME`, `USMTF`.
- SkillBridge, apprenticeship, and employer-fellowship continuity: transition-program boards, employer-approval queues, internship or fellowship trackers, and credential handoff ledgers; protocols: `NIEM`, signed transition notices, `API/JSON`, `S/MIME`, `HR-XML`, `PESC XML`, `USMTF`.
- VA home-loan and housing-stability continuity: loan-servicer case boards, foreclosure-avoidance queues, appraisal or closing trackers, and military housing-counselor ledgers; protocols: `NIEM`, signed lender notices, `API/JSON`, `S/MIME`, `MISMO`, `USMTF`.
- Promotion-board, evaluation-report, and record-brief continuity: board-file audit queues, evaluation-correction trackers, record-brief sync ledgers, and assignment-risk review boards; protocols: `NIEM`, signed personnel notices, `API/JSON`, `S/MIME`, `USMTF`.

## Support-Case Protocol Selection Rules (2026-04-07, Transition and Career Protection)

1. Cross-check at least one authoritative personnel or finance source with one transition, legal, housing, or talent-management source before recommending action that affects separation, promotion, or beneficiary trust.
2. Use `MISMO` only when a lender, servicer, or housing counselor exchange actually requires mortgage-specific data; otherwise keep the case exchange in `NIEM` plus signed notices.
3. Treat DD93, SGLI, TSGLI, evaluation-report, and board-file recommendations as advisory-only until source-record freshness, acknowledgment integrity, and human approval are verified.
4. For transition-program recommendations, show the readiness effect on deployability, retention, recovery, or lawful separation alongside the household or career impact.
5. For promotion, housing, or beneficiary cases, include a manual fallback path that preserves appeal or correction rights when tool trust, document signature, or data freshness fails.

## American Warfighter Personnel Lifecycle And Protected-Service Addendum (2026-04-07)

- Parental leave, pregnancy, and postpartum duty-modification continuity: parental-leave case boards, maternity or postpartum profile ledgers, appointment trackers, and assignment-impact queues; protocols: `HL7/FHIR`, `NIEM`, signed medical or personnel notices, `API/JSON`, `S/MIME`, `USMTF`.
- Newborn registration and travel-document continuity: birth-record trackers, DEERS enrollment queues, newborn-coverage boards, and passport or consular ledgers; protocols: `HL7/FHIR`, `NIEM`, `ICAO Doc 9303`, signed civil-status notices, `API/JSON`, `S/MIME`, `USMTF`.
- Protected complaint and reprisal safeguarding: complaint intake boards, EO or IG case trackers, protected-communication ledgers, and command-climate protection queues; protocols: `NIEM`, signed complaint notices, `API/JSON`, `S/MIME`, `USMTF`.
- Line-of-duty and incapacitation-pay continuity: LOD investigation trackers, incapacitation-pay queues, duty-status ledgers, and orders-validation boards; protocols: `HL7/FHIR`, `NIEM`, signed LOD or pay notices, `API/JSON`, `S/MIME`, `USMTF`.
- Awards and decorations record protection: awards recommendation boards, citation-evidence ledgers, approval-chain trackers, and board-file sync queues; protocols: `NIEM`, signed personnel citations, `API/JSON`, `S/MIME`, `USMTF`.
- Final out-processing and separation-clearance continuity: separation-checklist boards, CIF or OCIE ledgers, medical or dental clearance queues, and DD214 or final-pay dependency trackers; protocols: `NIEM`, signed separation checklists, `API/JSON`, `S/MIME`, `USMTF`.

## Support-Case Protocol Selection Rules (2026-04-07, Personnel Lifecycle and Protected Service)

1. Cross-check at least one authoritative personnel or medical source with one finance, legal, or family-support source before recommending action that changes duty status, recognition, or separation legitimacy.
2. Treat pregnancy, postpartum, newborn, complaint, and LOD packets as privacy-minimizing by default and expose only the minimum fields the receiving office requires.
3. Use `ICAO Doc 9303` only when newborn or dependent travel requires passport or travel-document routing; otherwise keep the exchange in `NIEM` plus signed notices.
4. Treat complaint routing, LOD or incapacitation-pay posture, award recommendations, and separation clearances as advisory-only until signed notices, acknowledgment chains, and human approval are confirmed.
5. For every personnel-lifecycle recommendation, state the readiness effect on deployability, retention, lawful availability, family stability, or transition legitimacy.

## American Warfighter Mobility, Tax, and School Continuity Addendum (2026-04-11)

- Unaccompanied-tour and deferred-family-travel continuity: unaccompanied-tour order boards, family-separation-allowance trackers, deferred-dependent-travel queues, and sponsor-contact ledgers; protocols: `NIEM`, `ICAO Doc 9303`, signed orders notices, `API/JSON`, `S/MIME`, `USMTF`.
- State-tax domicile and withholding continuity: domicile-election boards, state-tax notice trackers, withholding-correction queues, and residency-evidence ledgers; protocols: `NIEM`, `AAMVA DL/ID`, signed tax notices, `API/JSON`, `S/MIME`, `USMTF`.
- Military-child school-transfer and graduation continuity: school-transfer case boards, transcript-request queues, graduation-credit trackers, and counselor or youth-sponsor liaison ledgers; protocols: `PESC XML`, `NIEM`, signed school notices, `API/JSON`, `S/MIME`, `USMTF`.
- Consumer auto-finance and transportation continuity: auto-loan case boards, repossession or delinquency trackers, insurance-compliance queues, and emergency-transport ledgers; protocols: `NIEM`, `AAMVA DL/ID`, signed lender notices, `API/JSON`, `S/MIME`, `USMTF`.

## Support-Case Protocol Selection Rules (2026-04-11, Mobility, Tax, and School Continuity)

1. Cross-check at least one authoritative order, personnel, pay, or school-record source with one family-support, lender, or tax-support source before recommending action that changes travel, withholding, or dependent-schooling posture.
2. Use `ICAO Doc 9303` or `AAMVA DL/ID` only when a passport, visa, driver-license, or residency-proof artifact is actually needed; keep the broader case exchange in `NIEM` plus signed notices.
3. Treat family-separation allowance, domicile, transcript, and repossession outcomes as advisory-only until source-record freshness, notice authenticity, and human review are confirmed.
4. For school or youth cases, include a privacy-minimizing branch that limits release to transcript, graduation, or counselor data strictly required for continuity.
5. Map every mobility, tax, school, or auto-finance recommendation back to a readiness effect such as deployability, reporting reliability, retention, or lawful force flow.

## American Warfighter Pay Access, Retention, Housing Exceptions, and Kitting Addendum (2026-04-11)

- Payroll self-service and LES legitimacy continuity: MyPay access boards, LES discrepancy trackers, direct-deposit and allotment ledgers, and pay-cycle exception queues; protocols: `NIEM`, signed pay notices, `API/JSON`, `S/MIME`, `OIDC/SAML`, `USMTF`.
- Reenlistment and career-field continuity: reenlistment eligibility boards, bonus or SRB trackers, reclassification or retraining queues, and service-obligation ledgers; protocols: `NIEM`, signed personnel notices, `API/JSON`, `S/MIME`, `USMTF`.
- Barracks or dorm exception and emergency relocation continuity: room-status boards, work-order escalation queues, BAH-exception ledgers, and emergency-lodging trackers; protocols: `NIEM`, signed housing notices, `API/JSON`, `S/MIME`, `USMTF`, `NIMS/ICS`.
- Initial issue and mobilization-kitting continuity: initial-issue boards, CIF or OCIE clothing-record ledgers, size or fit crosswalks, and shortage-exception queues; protocols: `NIEM`, signed issue notices, `API/JSON`, `S/MIME`, `USMTF`.
- Leave-balance, special-leave-accrual, and sell-back continuity: leave-balance trackers, SLA or carryover boards, sell-back eligibility queues, and deployment-tempo reconciliation ledgers; protocols: `NIEM`, signed personnel notices, `API/JSON`, `S/MIME`, `USMTF`.
- Duty-limiting profile and accommodation continuity: profile-status boards, accommodation queues, nondeployable-code ledgers, and assignment-impact trackers; protocols: `HL7/FHIR`, `NIEM`, signed medical or personnel notices, `API/JSON`, `S/MIME`, `USMTF`.

## Support-Case Protocol Selection Rules (2026-04-11, Pay Access, Retention, Housing Exceptions, and Kitting)

1. Cross-check at least one authoritative personnel, pay, housing, or medical source with one family-support, finance, or command-support source before recommending action that changes payroll access, reenlistment posture, living quarters, issue status, or deployability codes.
2. Use `OIDC/SAML` only when account ownership or payroll self-service authentication must be verified; keep the broader case exchange in `NIEM` plus signed notices.
3. Treat payroll restoration, reenlistment approval, BAH exceptions, initial-issue completion, leave-balance correction, and deployability-code changes as advisory-only until source-record freshness, notice authenticity, and human approval are confirmed.
4. For medical-profile or accommodation cases, keep protected health detail to the minimum required by the receiving office and explicitly separate readiness effect from clinical detail.
5. Map every pay-access, retention, housing, kitting, leave, or profile recommendation back to a readiness effect such as deployability, reporting reliability, lawful availability, household stability, or retention confidence.
