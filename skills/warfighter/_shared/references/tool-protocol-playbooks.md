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

## Standard Escalation Packet

For each cross-domain escalation, provide:

- Trigger: measurable threshold or event condition
- Receiving cell: owning cell or staff function responsible for response
- Report format: message format (`USMTF`, `VMF`, `CoT`, `STIX/TAXII`, or approved local format)
- Delivery path: primary and alternate transport route
- No-fail fallback: voice/courier/manual relay with expected delay

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

### Space, Launch, and Counter-Space Response

- Primary systems: SDA catalogs, SATCOM monitors, launch range defense boards, EW interference telemetry
- Action pattern: detect attack/interference indicators, triage impacted services, issue restoration and protection tasks
- Protocol baseline: `API/JSON`, `USMTF`, `STIX/TAXII`, `Link 16 J-series` where applicable

### Cislunar and Deep-Space Domain Awareness

- Primary systems: deep-space object catalogs, cislunar conjunction risk engines, mission service dependency maps
- Action pattern: triage conjunction and interference events, rank service-impact risk, publish restoration and warning packets
- Protocol baseline: `API/JSON`, `USMTF`, `OGC`, `STIX/TAXII`

### Personnel Recovery and Aeromedical Flow

- Primary systems: PR coordination tools, patient movement systems, bed and lift planners
- Action pattern: authenticate isolated personnel/casualties, prioritize movement windows, synchronize recovery and treatment flow
- Protocol baseline: `USMTF`, `VMF`, `HL7/FHIR` where available

### Airbase and Expeditionary Basing Resilience

- Primary systems: base defense COP, runway restoration trackers, logistics and engineering readiness tools
- Action pattern: posture passive defenses, sequence restoration actions, trigger displacement and sustainment branches
- Protocol baseline: `USMTF`, `CoT`, `API/JSON`

### Expeditionary Seabasing and Offshore Staging

- Primary systems: maritime C2 suites, afloat logistics boards, weather-ocean forecast feeds
- Action pattern: evaluate staging posture, rebalance afloat sustainment loads, publish sea-base branch options
- Protocol baseline: `AIS/NMEA`, `USMTF`, `OGC`, `Link 16 J-series`

### Cyber, EMSO, and Information Operations

- Primary systems: SIEM/SOAR, endpoint telemetry, EW mission tools, audience assessment dashboards
- Action pattern: correlate events by mission thread, prioritize mitigations/effects, issue synchronized response tasks
- Protocol baseline: `STIX/TAXII`, `API/JSON`, `USMTF`

### Electromagnetic Signature and PNT Integrity Management

- Primary systems: spectrum monitoring systems, emission-control status tools, PNT integrity monitors, inertial cross-check services
- Action pattern: detect spoofing/signature anomalies, trigger emission-control branches, publish navigation fallback tasks
- Protocol baseline: `USMTF`, `Link 16 J-series`, `API/JSON`, `CoT`

### Data Fabric Schema Governance

- Primary systems: schema registries, data contract validators, cross-domain gateway policy engines
- Action pattern: detect schema drift, prioritize migration path, publish translation risk and cutover plan
- Protocol baseline: `API/JSON`, `OGC`, `USMTF`, `NATO APP-11/ADatP-3`

### Collaborative Combat Aircraft and Autonomous Swarm Integration

- Primary systems: air C2 mission managers, autonomy control consoles, data-link health monitors
- Action pattern: assign crewed-uncrewed tasking, monitor command integrity, trigger fallback control profile
- Protocol baseline: `Link 16 J-series`, `VMF`, `CoT`, `USMTF`, `API/JSON`

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
