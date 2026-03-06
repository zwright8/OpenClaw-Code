# External Tools and Protocols (Warfighter Skill Set)

Use this reference when a warfighter skill needs system integration guidance. Keep all integrations within authorized networks, accreditation boundaries, and handling caveats.

## Core Integration Protocol (apply every time)

1. Verify authority, mission scope, and data classification before querying or publishing data.
2. Pull source data from an approved system-of-record or approved relay service; avoid manual copy-paste when an interface exists.
3. Normalize timestamps (UTC ISO-8601), geospatial reference (WGS84 + MGRS when relevant), and unit identifiers before fusion.
4. Cross-check high-consequence data against at least two independent sources or one authoritative validated source.
5. Publish outputs in the requesting format and transport (for example USMTF, CoT, VMF, J-series, STIX/TAXII, OGC).
6. Log provenance: source system, pull time, processing assumptions, and confidence level.
7. Run the mission assurance checks in `mission-assurance-checklist.md` before release.

## Tool Families and Typical Use

- C2/COP tools: GCCS-J, CPOF, JADOCS, ATAK/WinTAK, JBC-P
- Air operations tools: TBMCS, PRISM, airspace deconfliction and ATO planning systems
- Fires/effects tools: AFATDS and joint fires coordination systems
- Intelligence tools: DCGS variants, GEOINT exploitation tools, ISR collection managers
- Logistics/readiness tools: GCSS variants, sustainment and maintenance systems
- Cyber tools: SIEM/SOAR platforms, endpoint telemetry stacks, network defense consoles
- Space/SATCOM tools: SDA catalogs, SATCOM planning/monitoring dashboards
- Maritime tools: C2 afloat systems, track management, mine/ASW mission tools
- Medical tools: patient regulation systems, medical logistics inventories, blood program trackers
- Training/simulation tools: JCATS/JTLS-style simulation, mission rehearsal systems, digital ranges

## Integration Interfaces and Transports

- APIs: REST/GraphQL/GRPC gateways behind approved service boundaries
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

## Output Requirements for Any Skill Using External Tools

Include these fields in outputs when tool integration is used:

- Source systems queried
- Protocol/message format selected and why
- Last refresh timestamp (UTC)
- Confidence and known gaps
- Classification/handling caveat placeholder (unclassified by default unless user specifies)
