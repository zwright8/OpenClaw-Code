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

## Run Update (2026-03-13Txx:xxZ)

- Added Expansion Wave XXVIII with 12 additional warfighter skills covering joint munition-energy coupled targeting deconfliction, contested megacity autonomous evacuation governance, coalition deepfake C2 authenticity validation, expeditionary bioreactor fuel/ration sustainment, undersea cable tap attribution with rapid reroute, denied-space launch window reallocation, homeland port radiological screening surge coordination, SOF low-signature mesh trust assurance, IAMD decoy discrimination and interceptor priority, coalition rare-earth supply shock allocation, battlefield neuromorphic sensor anomaly triage, and Arctic long-range UAS icing/link resilience.
- Extended the external tool/protocol catalog with Tool Suite Addendum XXVIII and Protocol Stack Addendum XXVIII to map each new domain to concrete external tools and protocol stacks.
- Extended the domain packet library and joint-operations toolchain profiles with Wave XXVIII packet IDs and profile bindings to support authority-gated, degraded-mode mission recommendations.
- Improved existing high-usage skills (`offensive-counter-air-mission-planner`, `naval-surface-warfare-coordinator`, `coalition-interoperability-coordinator`, and `cema-integration-cell`) with Expansion Wave XXVIII override bindings and packet references.

## Run Update (2026-03-13T16:xx:xxZ)

- Added Expansion Wave XXIX with 3 fast-follow warfighter skills covering autonomous battlefield mesh key-ceremony governance, solar-flare SATCOM fallback priority control, and coalition portable desalination cyber-biological assurance.
- Extended shared references with Tool Suite Addendum XXIX, Protocol Stack Addendum XXIX, and Packet Addendum XVII to bind fast-follow skills to concrete external tools, protocol families, and packet IDs.
- Improved `cema-integration-cell` with Expansion Wave XXIX override bindings for mesh trust-restoration and anti-jam continuity branches.
- Added Expansion Wave XXVIII with 12 new warfighter skills covering arctic subsea cable ice-keel strike prediction and repair, deepfake command-auth handshake defense, coalition oxygen/anesthetic surge synchronization, strategic rare-earth magnet fabrication cyber-sabotage rollback, disconnected biometric-ROE audit, rail bridge drone-swarm defense/repair, additive propellant thermal-aging assurance, SATNAV civil timing blackout continuity, contested-weather coalition DUSTOFF routing, space-weather cyber-cascade mission risk control, strategic military cloud break-glass sovereignty continuity, and undersea autonomous glider acoustic deception resilience.
- Extended the external tool/protocol catalog with Tool Suite Addendum XXVIII and Protocol Stack Addendum XXVIII to bind each new mission domain to concrete external tools and interoperable protocol stacks.
- Extended the domain packet library and joint-operations toolchain profiles with Wave XXVIII packet IDs and profile bindings for authority-gated, degraded-mode mission recommendations.
- Improved existing high-usage skills (`naval-surface-warfare-coordinator`, `coalition-interoperability-coordinator`, and `tactical-zero-trust-network-hardening`) with Expansion Wave XXVIII override bindings and packet references.

## Run Update (2026-03-13T18:xx:xxZ)

- Added Expansion Wave XXX with 12 additional warfighter skills covering Arctic over-ice corridor assurance, underground fiber-cut command reroute, islanded base-cluster load shedding, coalition autonomous maritime MCM deconfliction, tactical EMCON signature discipline, rapid CCD allocation, battlefield forensics/war-crimes evidence preservation, contested prisoner transfer accountability, strategic food-water denial distribution, homeland critical PSAP/911 continuity support, rail-bridge sabotage force-flow restoration, and coalition denied-space custody arbitration.
- Extended shared references with Tool Suite Addendum XXX, Protocol Stack Addendum XXX, and Packet Addendum XVIII to bind each new domain to concrete external tools and protocol families.
- Improved existing high-usage skill `mission-risk-decision-support` with Expansion Wave XXX override bindings and packet IDs for faster authority-gated commander risk decisions.

## Run Update (2026-03-13T14:11:46Z)

- Added Expansion Wave XXXI with 12 additional warfighter skills covering civil-internet blackout mesh bridging, UAS battery/charging denial recovery, strategic pharmaceutical contamination countermeasures, denied LEO SATCOM traffic recovery, homeland chemical rail derailment evacuation support, coalition AI targeting explainability audits, expeditionary runway GPS spoofing continuity, fuel-farm foam-fire cascade containment, prison-break high-value detainee recapture coordination, contested data-center cooling load shedding, reserve callup transport synchronization, and coalition maritime fiber landing station defense.
- Extended shared references with Tool Suite Addendum XXXI, Protocol Stack Addendum XXXI, and Packet Addendum XIX to bind each domain to concrete external tools and protocol families.
- Improved existing high-usage skills `mission-risk-decision-support`, `coalition-interoperability-coordinator`, and `cema-integration-cell` with Expansion Wave XXXI override bindings and packet references.

## Run Update (2026-03-13T15:05:38Z)

- Added Expansion Wave XXXII with 12 additional warfighter skills covering Arctic denied-PNT heavy-airlift drop-zone certification, theater hardened fiber-SATCOM hybrid command-backbone planning, coalition autonomous maritime convoy fuel-denial mitigation, homeland rail-grid evacuation priority synchronization, strategic microelectronics fab water-power continuity, expeditionary blood cold-chain drone relay, undersea acoustic decoy adjudication, coalition biometric watchlist disruption recovery, civilian-hospital overflow military triage synchronization, spaceport propellant safety launch-window restoration, loitering-munition swarm priority defense, and strategic food-port hoarding distribution stabilization.
- Extended shared references with Tool Suite Addendum XXXII, Protocol Stack Addendum XXXII, and Packet Addendum XX to bind each mission domain to concrete external tools and protocol families.
- Extended joint-operations external toolchain profiles with Wave XXXII profile bindings for command survivability, medical surge synchronization, strategic sustainment continuity, and tactical swarm defense.
- Improved existing high-usage skills `mission-risk-decision-support`, `coalition-interoperability-coordinator`, and `cema-integration-cell` with Expansion Wave XXXII override bindings and packet references.

## Run Update (2026-03-13T16:xx:xxZ)

- Added Expansion Wave XXXIII with 12 new warfighter skills covering undersea cable repeater salvage restoration, cislunar conjunction rescue/asset priority, homeland grid blackstart fuel-water-rail synchronization, coalition legal mission-data release evidence assurance, urban tunnel hostage recovery under spectrum denial, forward additive munitions quality release, coalition Arctic icebreaker convoy port-denial recovery, AI-enabled nuclear-incident warning integrity, expeditionary river-crossing autonomy EW deconfliction, hypersonic defense sensor-fusion civil continuity, homeland port ransomware manifest/customs recovery, and coalition prisoner-exchange biometric legal-chain synchronization.
- Extended shared references with Tool Suite Addendum XXXIII, Protocol Stack Addendum XXXIII, and Packet Addendum XXI to bind each mission domain to concrete external tools and protocol families.
- Extended joint-operations external toolchain profiles with Wave XXXIII profile bindings for undersea restoration, strategic warning integrity, homeland infrastructure resilience, coalition legal release control, and hypersonic civil-continuity synchronization.
- Improved existing high-usage skills `mission-risk-decision-support`, `coalition-interoperability-coordinator`, and `cema-integration-cell` with Expansion Wave XXXIII override bindings and packet references.

## Run Update (2026-03-13T17:07:30Z)

- Added Expansion Wave XXXIV with 12 new warfighter skills covering deep-undersea repair-rights adjudication, cislunar sustainment legal cargo governance, homeland water-power-comms mutual-aid continuity, coalition autonomous humanitarian airlift liability control, theater microreactor blackstart security, quantum-PNT submarine-strike deconfliction, Arctic permafrost pipeline breach recovery, mass-casualty biosurveillance isolation/evacuation, coalition legal autonomous-weapons incident investigation, tactical drone-swarm EMP recovery, strategic seabed critical-mineral denial mitigation, and civil nuclear grid-islanding population protection.
- Extended shared references with Tool Suite Addendum XXXIV, Protocol Stack Addendum XXXIV, Packet Addendum XXII, and Profile Set Wave XXXIV to bind every new skill to concrete external tools, protocols, and packet schemas.
- Improved `mission-risk-decision-support`, `coalition-interoperability-coordinator`, and `cema-integration-cell` with Expansion Wave XXXIV override bindings for high-consequence legal-custody governance, critical-infrastructure continuity, and electromagnetic mission-recovery control.
