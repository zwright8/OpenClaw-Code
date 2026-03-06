# Tool and Protocol Playbooks (Warfighter Skills)

Use this reference to convert recommendations into operator-ready tool actions and transport selections.

## Standard Tool Action Packet

For each external system action, provide:

- System: authoritative tool name and functional owner
- Action: query/update/export action in imperative form
- Input contract: required identifiers, AOI, timeframe, and confidence threshold
- Output contract: mandatory fields consumed by follow-on cells
- Transport: delivery format and path (`USMTF`, `VMF`, `Link 16 J-series`, `CoT`, `STIX/TAXII`, `OGC`, `API/JSON`)
- Failure mode: fallback procedure, expected delay, and confidence degradation

## Domain Playbooks

### Joint C2 and Battle Rhythm

- Primary systems: GCCS-J, CPOF, JADOCS, ATAK/WinTAK
- Action pattern: pull COP delta, validate key tracks/events, publish synchronized decision board update
- Protocol baseline: `USMTF` for formal reporting plus `CoT` for tactical event updates

### Intelligence, ISR, Targeting

- Primary systems: DCGS variants, GEOINT exploitation stacks, ISR collection managers
- Action pattern: ingest collection status, retask sensors, produce confidence-graded target package
- Protocol baseline: `USMTF`/`VMF` tasking plus `OGC` layers for geospatial dissemination

### Air, Fires, and Airspace Deconfliction

- Primary systems: TBMCS, TAIS, AFATDS, JADOCS
- Action pattern: reconcile ATO/ACO/fire support control measures, run fratricide checks, publish execution updates
- Protocol baseline: `Link 16 J-series`, `VMF`, `USMTF`

### Maritime, Littoral, Subsea

- Primary systems: afloat C2 suites, AIS feeds, mine/ASW mission systems
- Action pattern: fuse track picture, evaluate chokepoint risk, publish maritime control measures
- Protocol baseline: `AIS/NMEA`, `Link 16 J-series`, `USMTF`

### Cyber, EMSO, and Information Operations

- Primary systems: SIEM/SOAR, endpoint telemetry, EW mission tools, audience assessment dashboards
- Action pattern: correlate events by mission thread, prioritize mitigations/effects, issue synchronized response tasks
- Protocol baseline: `STIX/TAXII`, `API/JSON`, `USMTF`

### Sustainment, Mobility, and Industrial Base

- Primary systems: GCSS variants, movement planners, maintenance/readiness dashboards
- Action pattern: detect bottlenecks and at-risk nodes, reflow distribution plan, publish branch options
- Protocol baseline: `USMTF`, `XML/JSON`, `API`

### Medical and Personnel Support

- Primary systems: patient regulation, blood and med-log inventories, casualty movement trackers
- Action pattern: reconcile demand/supply and lift constraints, issue regulation priorities
- Protocol baseline: `USMTF medical reports`, `HL7/FHIR` where available, `API/JSON`

### Coalition and Interagency Coordination

- Primary systems: coalition COP tools, liaison data fabrics, host-nation coordination systems
- Action pattern: produce releasable common picture, mark caveats, synchronize handoff products
- Protocol baseline: `NATO APP-11/ADatP-3`, `OGC`, `USMTF`

## Degraded Operations Patterns

- Comms degradation: switch from streaming feeds to scheduled pull-push bundles with checksum validation
- Data-source outage: preserve stale-data marker, increase cross-check count, and shorten review cycle
- Tool outage: execute manual worksheet fallback, annotate confidence penalty, and set recovery trigger
