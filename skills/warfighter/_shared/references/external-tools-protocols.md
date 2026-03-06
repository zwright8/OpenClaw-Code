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
