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

### Personnel Recovery and Aeromedical Flow

- Primary systems: PR coordination tools, patient movement systems, bed and lift planners
- Action pattern: authenticate isolated personnel/casualties, prioritize movement windows, synchronize recovery and treatment flow
- Protocol baseline: `USMTF`, `VMF`, `HL7/FHIR` where available

### Airbase and Expeditionary Basing Resilience

- Primary systems: base defense COP, runway restoration trackers, logistics and engineering readiness tools
- Action pattern: posture passive defenses, sequence restoration actions, trigger displacement and sustainment branches
- Protocol baseline: `USMTF`, `CoT`, `API/JSON`

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

### Public Health, Biosurveillance, and Veterinary Support

- Primary systems: biosurveillance feeds, lab confirmation systems, preventive medicine tools, veterinary health records
- Action pattern: detect abnormal clusters, validate clinical/lab confidence, issue containment and force health mitigation tasks
- Protocol baseline: `HL7/FHIR`, `USMTF`, `API/JSON`

### Legal Governance, Detainee Transfer, and Lawfare

- Primary systems: legal workflow systems, evidence repositories, detainee accountability systems
- Action pattern: verify authority and custody chain, flag legal risk, publish auditable transfer and compliance actions
- Protocol baseline: `USMTF`, `NATO APP-11/ADatP-3`, `API/JSON`

### Critical Infrastructure and Mega-Port Security

- Primary systems: OT/IT SOC telemetry, physical security C2, logistics throughput dashboards
- Action pattern: correlate cyber-physical incidents, prioritize critical node defense, publish throughput protection directives
- Protocol baseline: `STIX/TAXII`, `USMTF`, `API/JSON`, `CoT`

### Industrial Surge and Subsistence Resilience

- Primary systems: depot enterprise tools, ration/cold-chain systems, transport planners, readiness dashboards
- Action pattern: identify bottlenecks and spoilage risk, reallocate repair/subsistence flow, publish branch plan updates
- Protocol baseline: `USMTF`, `API/JSON`, `XML/JSON`, `NATO APP-11/ADatP-3`

## Degraded Operations Patterns

- Comms degradation: switch from streaming feeds to scheduled pull-push bundles with checksum validation
- Data-source outage: preserve stale-data marker, increase cross-check count, and shorten review cycle
- Tool outage: execute manual worksheet fallback, annotate confidence penalty, and set recovery trigger
