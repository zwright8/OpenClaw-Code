# Warfighter All-Domain Skill Roadmap (2026-03-11)

This roadmap defines an all-domain skill architecture for U.S. warfighter support across tactical, operational, and strategic echelons, with required external tool families and protocol bindings.

## Domain Objective Matrix

- Command and control: accelerate commander decisions with auditable machine and staff products.
- Intelligence and target systems: fuse multi-source indicators and produce confidence-ranked options.
- Land operations: synchronize maneuver, sustainment, and protection in contested terrain.
- Air operations: maintain sortie generation, airspace safety, and fires integration under disruption.
- Maritime and undersea: preserve sea-lane access, subsea infrastructure, and contested chokepoint control.
- Space and cislunar: protect orbital/cislunar continuity, timing integrity, and launch/reconstitution options.
- Cyber and information: harden mission networks, attribute adversary action, and preserve trust in mission data.
- Electromagnetic operations: sustain emissions discipline, deconflict friendly systems, and degrade adversary sensing.
- Logistics and industrial base: preserve throughput, detect fraud/sabotage, and protect critical supply dependencies.
- Medical and personnel recovery: optimize casualty movement, care capacity, and credentialed staffing surge.
- Civil support and homeland defense: integrate military and civil restoration while controlling escalation risk.

## Required External Tool Families

- C2/COP and mission orchestration systems.
- ISR fusion, GEOINT exploitation, and collection management tooling.
- Fires, airspace, and deconfliction planning systems.
- Maritime traffic, undersea telemetry, and harbor operations systems.
- Space domain awareness, SATCOM, and timing-integrity systems.
- Cyber SIEM/SOAR, endpoint telemetry, and threat-intel exchanges.
- Logistics ERP, movement control, depot readiness, and quality provenance systems.
- Medical regulation, force-health surveillance, and credential/privileging systems.
- Civil infrastructure and emergency operations coordination systems.

## Protocol Baseline

- `USMTF` for mission reporting and commander-facing interoperability.
- `VMF` and `CoT` for tactical maneuver and event dissemination.
- `Link 16 J-series` for tactical track and air/maritime integration contexts.
- `STIX/TAXII` for machine-driven cyber/intel indicator exchange.
- `OGC WMS/WFS/WMTS` for geospatial map and feature interoperability.
- `AIS/NMEA` for maritime vessel and chokepoint traffic integration.
- `HL7/FHIR` for medical data exchange and care-continuity handoffs.
- `NIMS/ICS` and `EDXL-DE/CAP` for civil-support and warning operations.
- `CCSDS` for space/cislunar telemetry and safety coordination packets.

## Skill Design Rules

- Each skill must publish primary, alternate, and degraded operating profiles.
- Each high-consequence recommendation must include an authority tier and approval role.
- Each external dependency must include freshness, confidence, and failover behavior.
- Each recommendation must include one machine-ingestible packet and one commander summary.
- Each skill must map to at least one packet in `domain-tool-packet-library.md`.

## Runbook for New Skill Waves

1. Identify operational gap with explicit mission and decision timelines.
2. Bind tool suite and protocol stack from the shared catalogs.
3. Draft skill with required output schema and escalation gates.
4. Add packet entry for tool invocation and degraded-mode execution.
5. Validate through mission assurance checklist and protocol assurance drill.
6. Publish to `skills/warfighter` and update domain catalog pairings.

## Priority Gap Backlog (Next Waves)

- Cislunar logistics collision-risk mitigation under degraded timing trust.
- Strategic domestic transportation chokepoint compromise and rapid reroute policy.
- Coalition medical credential revocation and emergency re-privileging under cyber attack.
- Expeditionary AI model drift governance for autonomous sustainment routing.
- Multi-theater legal evidence harmonization for sanctions and maritime interdiction campaigns.

## Run Update (2026-03-12T01:xxZ)

- Added Expansion Wave XVIII with 12 cross-domain warfighter skills covering NC3 spectrum deception/restoration, hypersonic warning-response fusion, Arctic austere airdrop assurance, contested bridge denial/repair, expeditionary detainee processing evidence integrity, homeland rail mobility cyber guard, directed-energy blue-force exposure governance, coalition disaster-relief airfield digital twin recovery, strategic microelectronics allocation and sabotage monitoring, offshore prepositioning ship survivability/reload, autonomous wildland base defense, and space-weather mission assurance.
- Extended shared references with Tool Suite Addendum XVII, Protocol Stack Addendum XVII, and Packet Addendum IX to bind each new domain to concrete external tools and interoperable protocol profiles.
- Improved high-usage existing skills with Expansion Wave XVIII override bindings to accelerate authority-gated branch generation under NC3, hypersonic warning, rail mobility, and space-weather stressors.

## Run Update (2026-03-12T21:xxZ)

- Added Expansion Wave XXVII with 12 additional warfighter skills covering cislunar custody/conjunction assurance, joint quantum-PNT fallback, coalition maritime sanctions-insurance evasion disruption, homeland islanded-grid blackstart synchronization, expeditionary water-denial desalination optimization, biosurveillance field-lab chain-of-custody, hypersonic strike BDA corroboration, contested additive feedstock authenticity, coalition under-ice autonomous resupply corridors, strategic cognitive-electromagnetic deception exposure, spaceport sabotage recovery, and urban tunnel methane-blast risk control.
- Extended the external tool/protocol catalog with Tool Suite Addendum XXVII and Protocol Stack Addendum XXVII to map each new domain to concrete tool families and protocol bindings.
- Extended the domain packet library and joint-operations toolchain profiles with Wave XXVII packet IDs and profile bindings to support authority-gated, degraded-mode mission recommendations.
- Improved existing high-usage skills (`offensive-counter-air-mission-planner`, `naval-surface-warfare-coordinator`, and `coalition-interoperability-coordinator`) with Expansion Wave XXVII override bindings and packet references.
