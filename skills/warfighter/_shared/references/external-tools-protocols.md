# External Tools and Protocols (Warfighter Skill Set)

Use this reference when a warfighter skill needs system integration guidance. Keep all integrations within authorized networks, accreditation boundaries, and handling caveats.

## Core Integration Protocol (apply every time)

1. Verify authority, mission scope, and data classification before querying or publishing data.
2. Run account and transport readiness checks in `us-warfighter-tool-auth-and-access-drill.md` for critical dependencies.
3. Pull source data from an approved system-of-record or approved relay service; avoid manual copy-paste when an interface exists.
4. Normalize timestamps (UTC ISO-8601), geospatial reference (WGS84 + MGRS when relevant), and unit identifiers before fusion.
5. Cross-check high-consequence data against at least two independent sources or one authoritative validated source.
6. Publish outputs in the requesting format and transport (for example USMTF, CoT, VMF, Link 16 J-series, STIX/TAXII, OGC).
7. Log provenance: source system, pull time, processing assumptions, and confidence level.
8. Select and justify primary/alternate/degraded toolchain profiles from `domain-toolchain-profiles.md`.
9. Run the mission assurance checks in `mission-assurance-checklist.md` before release.
10. Bind critical dependencies to adapter contracts in `us-joint-tool-adapter-contracts.md`.

## Tool Invocation Packet (required in skill outputs)

For each external tool recommendation, include:

- Objective: what decision or action the tool output enables
- Inputs: identifiers, timeframe, AOI, unit/echelon, and query bounds
- Query/Action template: exact operator action or API payload skeleton
- Expected schema: critical fields expected from the tool response
- Protocol/transport: format and delivery path (for example USMTF over message bus)
- Fallback: manual workaround and confidence/timeline impact if the tool is unavailable

## Minimum Data Feed Contract (required in skill outputs)

For each mission recommendation, include:

- Primary feed: authoritative source, expected refresh rate, and stale-data threshold
- Cross-check feed: independent corroboration source and reconciliation logic
- Degraded/manual feed: fallback data collection path, latency expectation, and confidence penalty
- Handling caveats: release restrictions and sanitization requirements for each feed

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

## Domain-to-Tool and Protocol Matrix

- Land maneuver/protection: CPOF/JBC-P + route clearance/force protection systems; protocols: VMF, CoT, USMTF
- Air and fires integration: TBMCS/TAIS/AFATDS/JADOCS; protocols: Link 16 J-series, VMF, USMTF
- Maritime and littoral: afloat C2 + AIS + mine/ASW mission systems; protocols: Link 16 J-series, AIS/NMEA, USMTF
- Space and SATCOM: SDA catalogs + SATCOM planners + spectrum tools; protocols: API/JSON, USMTF, Link 16 where applicable
- Cyber and information: SIEM/SOAR + threat intel exchanges; protocols: STIX/TAXII, API/JSON
- Logistics and mobility: GCSS + movement/transport planners + sustainment dashboards; protocols: USMTF, XML/JSON, API
- Medical and casualty operations: patient regulation + med logistics + evacuation coordination; protocols: USMTF medical reporting, API/JSON, HL7/FHIR where available
- Coalition/interagency support: coalition COP tools + liaison data fabrics; protocols: NATO APP-11/ADatP-3 aligned formats, OGC, USMTF

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
- Expeditionary advanced base operations: naval C2 + littoral ISR + sustainment COP + Link 16/CoT/USMTF
- Strategic aerial refueling allocation: tanker planning systems + ATO tools + fuel dashboards + Link 16/USMTF/API
- Personnel recovery coordination: PR C2 tools + authentication workflows + airspace planners + VMF/USMTF/Link 16
- Contested biometrics identity ops: ABIS/identity tools + access-control logs + CI feeds + API/JSON/USMTF
- Airbase passive defense and restoration: base defense COP + runway repair systems + sortie generators + CoT/USMTF/API
- Long-range fires deconfliction: fires C2 + airspace control systems + no-strike validation tools + VMF/USMTF/Link 16
- Expeditionary network transport: SATCOM/LOS planners + tactical network management + cyber telemetry + API/JSON/STIX
- Contested aviation maintenance recovery: maintenance MIS + supply status + sortie scheduling + API/JSON/USMTF
- Under-ice submarine support: undersea mission tools + ice and ocean forecasts + acoustic tracking + Link 16/USMTF/AIS
- Human-machine teaming robotics: UxS mission managers + command COP + safety telemetry + CoT/API/USMTF
- Denied-terrain CASEVAC integration: med regulation systems + UxS control + route-risk tools + USMTF/API/HL7
- Foreign disclosure and releasability: disclosure workflow systems + coalition release ledgers + NATO APP-11/USMTF
- Electronic protection frequency management: spectrum planning tools + EW consoles + signal intelligence feeds + Link 16/API/USMTF
- Launch range defense coordination: SDA warning + range security systems + cyber defense telemetry + API/JSON/USMTF
- Strategic aeromedical flow: patient movement systems + bed management + airlift scheduling + USMTF/HL7/API
- Maritime convoy and sea-lane defense: fleet C2 + AIS + ASW feeds + Link 16/AIS/USMTF
- Counter-space electronic attack response: SATCOM monitoring + EW indicators + network defense tools + API/JSON/USMTF/STIX
- Strategic launch responsiveness and range survivability: launch/range C2 + SDA warning + cyber telemetry + USMTF/API/Link 16
- Electronic attack deconfliction and emission control: EMS planners + EW execution consoles + SIGINT libraries + Link 16/VMF/API
- HUMINT network validation and risk: HUMINT support systems + CI watchlists + travel/access logs + API/JSON/USMTF
- Autonomous undersea cable repair: subsea infrastructure telemetry + ROV/UUV tasking + maritime COP + AIS/NMEA/API
- Targeting ethics and authority checks: targeting tools + ROE/LOAC policy stores + legal workflow systems + USMTF/API
- Expeditionary DNA forensics and family assistance: forensics case systems + mortuary affairs trackers + coordination workflows + API/JSON
- Homeland blackstart fusion: utility telemetry + emergency management COP + cyber alerts + OGC/API/USMTF
- Coalition cyber mutual defense: SIEM/SOAR + coalition intel exchanges + incident workflow + STIX/TAXII/API
- Robotic CBRN reconnaissance: CBRN sensors + robotic control stations + hazard modeling + CoT/VMF/API
- SATCOM anti-jam waveform management: SATCOM planners + spectrum monitoring + EW indicators + API/USMTF/Link 16
- Precision fuel demand/distribution: fuel logistics systems + sortie plans + route risk tools + USMTF/API/CSV
- Maritime gray-zone fishing analytics: AIS feeds + EO/SAR imagery + pattern-analysis tooling + AIS/NMEA/OGC/API
- Arctic sensor picket orchestration: ice/weather feeds + autonomous sensor C2 + maritime COP + AIS/OGC/USMTF
- Digital deception and OPSEC assurance: OPSEC assessment tools + cyber telemetry + influence monitoring + STIX/API/USMTF
- Rapid airbase damage assessment autonomy: runway damage analytics + drone imagery + sortie schedulers + CoT/OGC/USMTF
- Additive manufacturing powder assurance: manufacturing QA systems + lab telemetry + sustainment MIS + API/JSON/USMTF
- SOF compartment integration: mission planning systems + compartmented access logs + releasability workflows + API/USMTF
- Coalition cross-border fires clearance: fires C2 + airspace deconfliction + legal/authority workflows + VMF/USMTF/Link 16
- Cyber reserve mobilization: force management systems + cyber readiness telemetry + assignment workflows + API/JSON/STIX
- Expeditionary microreactor siting and risk: engineering models + force protection overlays + logistics planners + OGC/API/USMTF
- Priority intelligence requirement triage: PIR trackers + ISR tasking tools + campaign assessment dashboards + VMF/USMTF/API
- Civilian harm incident remediation: CHMR systems + geospatial evidence tools + compensation workflow + OGC/API/USMTF
- Orbital reconstitution manifesting: launch manifest tools + SDA catalogs + logistics scheduling + API/JSON/USMTF
- Denied-airspace MEDEVAC synchronization: med regulation systems + unmanned/crewed route planners + threat overlays + USMTF/VMF/API

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

## Output Requirements for Any Skill Using External Tools

Include these fields in outputs when tool integration is used:

- Source systems queried
- Protocol/message format selected and why
- Last refresh timestamp (UTC)
- Confidence and known gaps
- Classification/handling caveat placeholder (unclassified by default unless user specifies)
- Tool Invocation Packet fields for each critical tool dependency
- Adapter contract status (`adapter_id`, protocol, auth mode, last-success UTC) for each critical dependency
- Cross-domain escalation hooks: trigger, owning cell, report format, and comms fallback
- Minimum Data Feed Contract fields: primary, cross-check, degraded/manual, and handling caveats
