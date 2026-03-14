# Joint Operations External Toolchain Profiles

Use this reference to bind mission recommendations to concrete external tools, protocols, and degraded-operation transitions across warfighting domains.

## Required Output Fields

For each critical recommendation, include:

- `toolchain_profile_id`
- `primary_tool`
- `cross_check_tool`
- `transport_protocol`
- `message_format`
- `refresh_sla_minutes`
- `degraded_trigger`
- `degraded_fallback`
- `validation_owner`

## Profile Set

### `joc-c2-watchfloor-v1`
- Use for joint operations center synchronization and command reporting.
- Primary tools: GCCS-J / CPOF / JADOCS aligned COP and workflow services.
- Cross-check tools: alternate COP mirror, secure collaboration timeline.
- Protocols: `USMTF`, `CoT`, `API/JSON`.
- Degraded fallback: manual battle rhythm board + USMTF message queue.

### `fires-airspace-deconfliction-v1`
- Use for fires, airspace, and dynamic targeting synchronization.
- Primary tools: AFATDS, TAIS, TBMCS-aligned planning services.
- Cross-check tools: sensor fusion timeline + air tasking mirror.
- Protocols: `Link 16 J-series`, `VMF`, `USMTF`.
- Degraded fallback: time-boxed manual deconfliction matrix with commander risk note.

### `maritime-undersea-control-v1`
- Use for sea-control, undersea infrastructure, and port throughput operations.
- Primary tools: maritime COP, AIS track managers, salvage planning systems.
- Cross-check tools: hydrographic and harbor telemetry overlays.
- Protocols: `AIS/NMEA`, `OGC`, `USMTF`.
- Degraded fallback: prioritized track whiteboard with harbor movement windows.

### `space-satcom-resilience-v1`
- Use for SATCOM integrity, SDA fusion, and reconstitution workflows.
- Primary tools: SDA catalog services, SATCOM planners, link health monitors.
- Cross-check tools: orbital event feed mirrors.
- Protocols: `API/JSON`, `USMTF`, `Link 16 J-series`.
- Degraded fallback: low-bandwidth status packet plus scheduled sync windows.

### `cyber-defensive-ops-v1`
- Use for hunt-forward, mission network defense, and cyber mission assurance.
- Primary tools: SIEM/SOAR, endpoint telemetry, threat-intel platforms.
- Cross-check tools: packet analytics mirror and incident command board.
- Protocols: `STIX/TAXII`, `API/JSON`, `USMTF`.
- Degraded fallback: indicator-based manual triage and watchfloor escalation matrix.

### `medical-casualty-regulation-v1`
- Use for casualty movement, blood logistics, and contested care continuity.
- Primary tools: patient regulation systems, med logistics dashboards, evacuation routing tools.
- Cross-check tools: bed-status and blood-inventory mirrors.
- Protocols: `HL7/FHIR`, `USMTF`, `API/JSON`.
- Degraded fallback: manual medevac priority board with recurring status pulse.

### `civil-support-consequence-management-v1`
- Use for DSCA, critical infrastructure restoration, and evacuation support.
- Primary tools: ICS dashboards, utility telemetry, emergency operations platforms.
- Cross-check tools: transportation status and shelter occupancy feeds.
- Protocols: `NIMS/ICS`, `EDXL-DE/CAP`, `USMTF`.
- Degraded fallback: ICS paper battle book with hourly command sync.

### `strategic-deterrence-escalation-governance-v1`
- Use for strategic deterrence signaling and escalation-control option governance.
- Primary tools: strategic indications boards, secure strategic messaging workflows, campaign risk dashboards.
- Cross-check tools: independent strategic warning timeline and policy-legal advisory board.
- Protocols: `USMTF`, `API/JSON`, secure strategic reporting formats.
- Degraded fallback: commander-approved escalation matrix with bounded update windows.

### `nc3-continuity-resilience-v1`
- Use for nuclear command, control, and communications continuity planning and stress tests.
- Primary tools: NC3 status monitors, message integrity validators, resilient transport orchestration.
- Cross-check tools: independent comm-path assurance monitor and acknowledgment-chain ledger.
- Protocols: `USMTF`, authenticated message buses, signed acknowledgment chains.
- Degraded fallback: minimum-essential continuity message set with strict acknowledgment polling.

### `detainee-operations-compliance-v1`
- Use for detainee handling, transfer coordination, and law-of-war compliance controls.
- Primary tools: detainee tracking systems, legal compliance workflow engines, transfer coordination services.
- Cross-check tools: legal review records and coalition caveat registries.
- Protocols: `USMTF`, `NATO APP-11/ADatP-3`, `API/JSON`.
- Degraded fallback: manual transfer board with legal hold gates and auditable chain-of-custody.

### `mortuary-affairs-identification-v1`
- Use for contested mortuary affairs, remains recovery tracking, and identity assurance.
- Primary tools: mortuary operations trackers, forensic chain-of-custody systems, identity lab workflows.
- Cross-check tools: casualty accountability ledgers and independent forensic verification queue.
- Protocols: `USMTF`, `API/JSON`, forensic chain-of-custody standards.
- Degraded fallback: manual remains accountability ledger with delayed digital reconciliation.

### `disconnected-finance-integrity-v1`
- Use for tactical financial continuity and disconnected payments integrity.
- Primary tools: disconnected transaction ledgers, anti-fraud analytics, payroll disbursement orchestration.
- Cross-check tools: independent reconciliation queue and anomaly review board.
- Protocols: `API/JSON`, signed ledger exports, `USMTF` financial summaries.
- Degraded fallback: mission-essential disbursement-only mode with manual dual-control reconciliation.

### `pqc-mission-migration-v1`
- Use for phased migration to quantum-resistant cryptography across mission systems.
- Primary tools: crypto asset inventory services, PKI lifecycle managers, interoperability test harnesses.
- Cross-check tools: cryptographic conformance validators and mission assurance dashboards.
- Protocols: `API/JSON`, PKI management protocols, `USMTF` governance summaries.
- Degraded fallback: hybrid-crypto transitional mode with commander-approved risk exceptions.

### `contested-public-health-force-protection-v1`
- Use for force-health and public-health surveillance in contested theaters.
- Primary tools: disease surveillance systems, force health readiness analytics, medical operations dashboards.
- Cross-check tools: laboratory reporting mirrors and independent epidemiology review cells.
- Protocols: `HL7/FHIR`, `USMTF`, `NIMS/ICS`.
- Degraded fallback: sentinel-site surveillance with conservative readiness assumptions.

### `austere-additive-biomedical-support-v1`
- Use for austere additive and bioprinting-enabled medical support governance.
- Primary tools: additive manufacturing control stacks, quality release systems, med logistics orchestrators.
- Cross-check tools: clinical-risk review board and biosecurity compliance ledger.
- Protocols: `HL7/FHIR`, `API/JSON`, `USMTF`.
- Degraded fallback: approved catalog-only fabrication with tightened quality and release gates.

### `subsea-cable-attribution-response-v1`
- Use for technical-legal attribution and response planning for submarine cable incidents.
- Primary tools: subsea telemetry feeds, maritime anomaly analytics, legal evidence chain systems.
- Cross-check tools: coalition maritime COP and independent forensic review pipeline.
- Protocols: `AIS/NMEA`, `STIX/TAXII`, `USMTF`, `OGC`.
- Degraded fallback: limited attribution posture with conservative legal confidence bands.

### `orbital-spectrum-traffic-priority-v1`
- Use for orbital spectrum conflict resolution and mission-priority SATCOM traffic management.
- Primary tools: SATCOM allocation managers, orbital interference monitors, spectrum deconfliction planners.
- Cross-check tools: independent link health monitor and coalition bandwidth arbitration board.
- Protocols: `API/JSON`, `USMTF`, `Link 16 J-series` when interoperable.
- Degraded fallback: critical-traffic-only routing with fixed priority windows.

## Selection Rules

1. Choose one profile before generating options.
2. Bind every external tool recommendation to a selected profile ID.
3. Include one machine-ingestible output and one commander-readable summary.
4. If no profile fits, create a provisional profile with explicit validation owner and suspense.
5. If any tool misses SLA, switch to degraded mode and report impact on confidence and timeline.

### `biosecurity-lab-incident-response-v1`
- Use for joint biosecurity and military-public-health incident response.
- Primary tools: biosurveillance fusion, lab incident reporting, force health dashboards.
- Cross-check tools: epidemiology review mirror and lab confirmation queue.
- Protocols: `HL7/FHIR`, `USMTF`, `NIMS/ICS`.
- Degraded fallback: sentinel-site reporting with conservative containment assumptions.

### `identity-wallet-revocation-v1`
- Use for deployed digital identity wallet trust and rapid credential revocation.
- Primary tools: identity lifecycle services, revocation status brokers, access policy orchestration.
- Cross-check tools: independent revocation ledger and access anomaly monitor.
- Protocols: `API/JSON`, signed status exports, `USMTF` governance summaries.
- Degraded fallback: mission-essential allowlist with dual-control revocation checks.

### `quantum-crypto-transition-v1`
- Use for phased quantum-resistant migration without mission interoperability breakage.
- Primary tools: crypto inventory services, key lifecycle orchestration, interoperability test harness.
- Cross-check tools: cryptographic conformance validator and mission assurance dashboard.
- Protocols: PKI management protocols, `API/JSON`, `USMTF` transition summaries.
- Degraded fallback: hybrid-crypto mode with bounded risk exceptions.

### `undersea-cable-sabotage-attribution-v1`
- Use for undersea cable sabotage attribution and continuity repair prioritization.
- Primary tools: cable telemetry analytics, maritime anomaly detection, legal evidence chain systems.
- Cross-check tools: coalition maritime COP and forensic confidence review board.
- Protocols: `AIS/NMEA`, `OGC`, `STIX/TAXII`, `USMTF`.
- Degraded fallback: provisional attribution posture with conservative confidence bands.

### `orbital-spectrum-continuity-v1`
- Use for orbital spectrum conflict resolution and SATCOM mission continuity.
- Primary tools: SATCOM arbitration managers, interference monitors, mission-priority routing boards.
- Cross-check tools: independent link health monitor and coalition bandwidth mirror.
- Protocols: `API/JSON`, `USMTF`, `Link 16 J-series` where interoperable.
- Degraded fallback: critical-traffic-only windows and fixed-priority scheduling.

### `autonomy-safety-incident-governance-v1`
- Use for autonomous platform safety incident review and corrective action governance.
- Primary tools: autonomy telemetry replay services, safety case trackers, corrective action systems.
- Cross-check tools: independent incident reconstruction harness and certification board.
- Protocols: `API/JSON`, signed audit logs, `USMTF` safety summaries.
- Degraded fallback: restricted autonomy employment with commander-approved controls.

### `ai-model-governance-assurance-v1`
- Use for contested AI model governance and rollback authority in operations.
- Primary tools: model registry and deployment controls, trust evaluation dashboards, policy exception workflows.
- Cross-check tools: independent red-team benchmark service and drift detection monitor.
- Protocols: `API/JSON`, signed model attestations, `USMTF` governance packets.
- Degraded fallback: approved-baseline-only model operation with manual review gates.

### `water-treatment-cyber-physical-protection-v1`
- Use for cyber-physical protection of water treatment and distribution systems.
- Primary tools: ICS/SCADA monitoring, water quality telemetry, infrastructure incident boards.
- Cross-check tools: independent sampling chain and alternate utility status monitor.
- Protocols: `API/JSON`, `OGC`, `USMTF`, `NIMS/ICS`.
- Degraded fallback: manual testing cadence and emergency purification branch actions.

### `port-health-biosecurity-control-v1`
- Use for host-nation port health controls while sustaining military throughput.
- Primary tools: port ops dashboards, vessel screening workflows, quarantine coordination tools.
- Cross-check tools: independent compliance ledger and berth-risk monitor.
- Protocols: `AIS/NMEA`, `HL7/FHIR`, `USMTF`, coalition formats.
- Degraded fallback: prioritized screening lane with reduced throughput assumptions.

### `osint-verification-expeditionary-v1`
- Use for verification of open-source battlefield reporting before command action.
- Primary tools: OSINT aggregation, media forensics, geolocation verification tools.
- Cross-check tools: independent source credibility ledger and alternate corroboration board.
- Protocols: `API/JSON`, `STIX/TAXII`, `USMTF` command summaries.
- Degraded fallback: high-confidence-source-only posture with explicit uncertainty notes.

### `munitions-fragmentation-safety-v1`
- Use for distributed munitions transport/storage safety planning under strike threat.
- Primary tools: explosive compatibility ledgers, route risk tools, storage hazard models.
- Cross-check tools: independent safety verification board and alternate incident trend monitor.
- Protocols: `USMTF`, `API/JSON`, NATO logistics formats where relevant.
- Degraded fallback: safety-maximized distribution with reduced throughput and explicit risk acceptance.

### `runway-crater-repair-deconfliction-v1`
- Use for rapid runway crater repair coordination and sortie regeneration.
- Primary tools: airfield engineering schedulers, damage assessment tools, sortie recovery dashboards.
- Cross-check tools: independent pavement survey and alternate repair timeline board.
- Protocols: `USMTF`, `Link 16 J-series`, `AIXM/FIXM` where applicable.
- Degraded fallback: manual repair window board and conservative sortie allocation.

### `emp-cascade-consequence-v1`
- Use for EMP cascade consequence triage and phased restoration sequencing.
- Primary tools: mission dependency graphers, infrastructure restoration tools, comm-path resilience monitors.
- Cross-check tools: independent continuity status mirror and alternate critical-node tracker.
- Protocols: `USMTF`, `API/JSON`, `NIMS/ICS`.
- Degraded fallback: minimum-essential command loop with fixed restoration priorities.

### `commander-priority-synthesis-v1`
- Use for commander-priority information synthesis from noisy multi-domain feeds.
- Primary tools: fused COP analytics, alert prioritization engines, decision support dashboards.
- Cross-check tools: independent watchfloor timeline and confidence adjudication board.
- Protocols: `USMTF`, `CoT`, `API/JSON`.
- Degraded fallback: manual commander update cycle with strict priority triage.

### `disconnected-time-pnt-holdover-v1`
- Use for disconnected time sync and PNT holdover management during denial.
- Primary tools: time-transfer services, oscillator monitors, PNT confidence fusion tools.
- Cross-check tools: independent timing validator and inertial/celestial navigation monitor.
- Protocols: `USMTF`, `API/JSON`, timing transfer standards.
- Degraded fallback: local holdover-only mode with compressed re-sync checkpoints.

### `additive-feedstock-counterfeit-detection-v1`
- Use for theater additive feedstock counterfeit detection and quality risk containment.
- Primary tools: material fingerprint analyzers, provenance ledgers, fabrication quality release tools.
- Cross-check tools: independent sample-chain audit and alternate failure anomaly review.
- Protocols: `API/JSON`, signed provenance exports, `USMTF` sustainment summaries.
- Degraded fallback: approved-lot-only fabrication with part quarantine and increased inspections.

### `c2-node-displacement-assurance-v1`
- Use for denied-environment command-node displacement and continuity governance.
- Primary tools: command mobility planners, comm-path assurance monitors, survivability risk models.
- Cross-check tools: independent displacement rehearsal board and alternate movement-risk validator.
- Protocols: `USMTF`, `CoT`, `Link 16 J-series`.
- Degraded fallback: preapproved displacement matrix with bounded update windows.

### `coalition-jadc2-schema-assurance-v1`
- Use for coalition JADC2 schema translation, validation, and releasability-safe exchange.
- Primary tools: schema registry services, translation gateways, coalition validation harnesses.
- Cross-check tools: independent conformance validator and releaseability audit ledger.
- Protocols: `API/JSON`, `USMTF`, `NATO APP-11/ADatP-3`.
- Degraded fallback: minimum-field exchange profile with delayed reconciliation.

### `contested-airlift-lz-viability-v1`
- Use for contested-airlift landing-zone viability updates and divert decisions.
- Primary tools: LZ condition monitors, threat overlays, airlift scheduling planners.
- Cross-check tools: independent geospatial hazard validator and alternate sortie-risk board.
- Protocols: `USMTF`, `VMF`, `OGC`.
- Degraded fallback: mission-essential LZ set with conservative viability thresholds.

### `space-cyber-groundstation-failover-v1`
- Use for space-cyber groundstation failover drills and timing-integrity assurance.
- Primary tools: groundstation telemetry boards, failover orchestrators, route integrity validators.
- Cross-check tools: independent acknowledgment-chain monitor and alternate route-readiness board.
- Protocols: `CCSDS`, `USMTF`, `API/JSON`.
- Degraded fallback: scheduled failover windows with critical-traffic-only routing.

### `precision-fires-lineage-retargeting-v1`
- Use for precision-fires data provenance assurance and retarget governance.
- Primary tools: target lineage graph engines, sensor timeline correlators, fires authorization workflows.
- Cross-check tools: independent provenance validator and alternate collateral audit board.
- Protocols: `VMF`, `Link 16 J-series`, `USMTF`.
- Degraded fallback: prevalidated target sets only with conservative re-attack thresholds.

## Profile Set (2026-03-09 Domain Expansion - Waterway Defense, NC3 Fiber, Aeromedical Brokerage)

### `orbital-debris-satcom-restoration-v1`
- Use for contested orbital debris evasion with synchronized SATCOM restoration and timing-sensitive command continuity.
- Primary tools: conjunction-risk prediction, SATCOM path orchestration, mission dependency board.
- Cross-check tools: independent conjunction feed monitor and alternate comm path integrity validator.
- Protocols: `CCSDS`, `API/JSON`, `USMTF`.
- Degraded fallback: fixed maneuver guard-bands and low-bandwidth comm heartbeat schedule.

### `dam-lock-critical-waterway-defense-v1`
- Use for defense and restoration sequencing of military-critical dams and lock-controlled waterways.
- Primary tools: hydrology stress analytics, lock telemetry manager, engineer mobility planner.
- Cross-check tools: independent floodplain forecast and alternate civil-waterway status board.
- Protocols: `NIMS/ICS`, `API/JSON`, `USMTF`.
- Degraded fallback: manual waterway status board with 2-hour command updates.

### `detainee-icrc-notification-assurance-v1`
- Use for coalition detainee custody assurance and neutral-access or legal-notification timeline management.
- Primary tools: detainee accountability ledger, legal notification workflow engine, transfer audit monitor.
- Cross-check tools: independent custody-chain verifier and alternate coalition legal review board.
- Protocols: `NATO APP-11/ADatP-3`, `API/JSON`, `USMTF`.
- Degraded fallback: manual custody roster and acknowledgment-tracked legal message queue.

### `hardened-fiber-nc3-failover-v1`
- Use for hardened fiber failover decisions supporting NC3-adjacent continuity and emergency message integrity.
- Primary tools: protected route health monitor, emergency message integrity validator, failover orchestrator.
- Cross-check tools: independent acknowledgment-chain ledger and alternate route latency verifier.
- Protocols: `USMTF`, signed continuity events, `API/JSON`.
- Degraded fallback: minimum-essential message set with strict acknowledgment polling.

### `critical-mineral-recovery-recycling-v1`
- Use for expeditionary recovery, assay, and redistribution of critical minerals under supply denial.
- Primary tools: recovery planner, assay workflow, mission-priority allocation board.
- Cross-check tools: independent assay verification queue and alternate sustainment prioritization mirror.
- Protocols: `API/JSON`, `XML`, `USMTF` sustainment summaries.
- Degraded fallback: high-confidence recoverable material set only with conservative purity assumptions.

### `disconnected-ai-model-rollback-assurance-v1`
- Use for disconnected AI model rollback governance, drift triage, and baseline-safe operations.
- Primary tools: model registry mirror, drift anomaly monitor, rollback authority workflow board.
- Cross-check tools: independent benchmark replay harness and alternate policy exception ledger.
- Protocols: signed model manifests, `API/JSON`, `USMTF` governance updates.
- Degraded fallback: approved-baseline-only mode with human approval for any model change.

### `urban-vertical-lift-lz-authentication-v1`
- Use for urban vertical-lift landing-zone authentication under spoofing and congestion threats.
- Primary tools: LZ geofence verifier, hazard confidence scorer, civil-traffic deconfliction dashboard.
- Cross-check tools: independent ISR corroboration and alternate pilot confirmation board.
- Protocols: `CoT`, `AIXM/FIXM`, `USMTF`.
- Degraded fallback: high-confidence LZ shortlist with conservative go/no-go triggers.

### `autonomous-maritime-picket-board-search-v1`
- Use for autonomous maritime picket operations coupled to compliant board and search tasking.
- Primary tools: picket autonomy controller, vessel behavior analytics, boarding mission scheduler.
- Cross-check tools: independent maritime COP mirror and alternate legal authority adjudication board.
- Protocols: `AIS/NMEA`, `API/JSON`, `USMTF`.
- Degraded fallback: manual watch bill and board-only on high-confidence anomaly tracks.

### `spaceport-gnss-interference-emergency-v1`
- Use for homeland spaceport emergency operations under GNSS interference and timing instability.
- Primary tools: timing integrity monitor, launch safety constraint engine, interference geolocation board.
- Cross-check tools: independent oscillator holdover monitor and alternate range-safety review cell.
- Protocols: `CCSDS`, `API/JSON`, `USMTF`.
- Degraded fallback: launch-hold posture with bounded revalidation intervals.

### `multitheater-aeromedical-priority-broker-v1`
- Use for cross-theater aeromedical evacuation prioritization under constrained lift, beds, and blood.
- Primary tools: patient regulation broker, theater lift optimizer, blood stress dashboard.
- Cross-check tools: independent casualty severity adjudication cell and alternate bed-status federation mirror.
- Protocols: `HL7/FHIR`, `USMTF`, `API/JSON`.
- Degraded fallback: movement of highest-acuity categories only with explicit risk acceptance.

### `aerial-refuel-gps-denied-assurance-v1`
- Use for GPS-denied aerial refueling rendezvous assurance and timing-confidence governance.
- Primary tools: tanker/receiver rendezvous planner, anti-spoof navigation verifier.
- Cross-check tools: independent inertial/celestial confidence monitor.
- Protocols: `Link 16 J-series`, `VMF`, `USMTF`, `API/JSON`.
- Degraded fallback: pre-briefed rendezvous windows with voice confirmation and conservative abort triggers.

### `ew-mission-data-reprogramming-v1`
- Use for coalition EW mission-data rapid reprogramming, release, and rollback control.
- Primary tools: EW mission-data compiler and release governance workflow.
- Cross-check tools: independent EOB validator and waveform regression harness.
- Protocols: `USMTF`, `STIX/TAXII`, `NATO APP-11/ADatP-3`, `API/JSON`.
- Degraded fallback: approved baseline-only operation with restricted emitter sets until revalidation.

### `urban-substation-islanding-defense-v1`
- Use for urban substation islanding defense where mission-critical power loads must be preserved.
- Primary tools: ICS/SCADA protection monitor and load-priority orchestrator.
- Cross-check tools: independent utility telemetry mirror and alternate relay-state checker.
- Protocols: `NIMS/ICS`, `USMTF`, `OGC`, `API/JSON`.
- Degraded fallback: manual load-shed and physical switchyard control with hourly command sync.

### `microelectronics-trusted-fab-surge-v1`
- Use for strategic trusted-fab surge and anti-tamper lot release governance.
- Primary tools: fab execution and secure lot provenance services.
- Cross-check tools: independent counterfeit-risk adjudication board.
- Protocols: `API/JSON`, signed ledger exports, `USMTF`.
- Degraded fallback: defense-priority lot release only with manual dual-control validation.

### `long-range-fires-stockpile-assurance-v1`
- Use for long-range fires stockpile prepositioning and contested reload continuity.
- Primary tools: munitions positioning planner and launcher readiness board.
- Cross-check tools: depot throughput mirror and route survivability monitor.
- Protocols: `USMTF`, `VMF`, `Link 16 J-series`, `API/JSON`.
- Degraded fallback: fixed-priority resupply schedule with reduced tempo assumptions.

### `seabed-node-tamper-repair-v1`
- Use for coalition seabed critical-node tamper detection, evidence hold, and repair convoy sequencing.
- Primary tools: undersea telemetry fusion and repair task orchestration service.
- Cross-check tools: independent acoustic anomaly board and forensic custody ledger.
- Protocols: `AIS/NMEA`, `OGC`, `USMTF`, `API/JSON`.
- Degraded fallback: critical-node-only patrol and delayed repair windows with elevated risk posture.

### `disinformation-kinetic-escalation-warning-v1`
- Use for early warning when narrative operations indicate likely kinetic escalation.
- Primary tools: narrative telemetry analytics and escalation indicator fusion board.
- Cross-check tools: independent source credibility and corroboration cell.
- Protocols: `STIX/TAXII`, `MISP`, `USMTF`, `API/JSON`.
- Degraded fallback: high-confidence-source-only warning posture with shorter review cadence.

### `dual-use-port-cyber-unified-command-v1`
- Use for unified command during cyber incidents at dual-use ports affecting force flow.
- Primary tools: port OT/IT incident command dashboard and berth continuity planner.
- Cross-check tools: independent logistics mirror and cyber forensic triage queue.
- Protocols: `NIMS/ICS`, `USMTF`, `STIX/TAXII`, `AIS/NMEA`, `API/JSON`.
- Degraded fallback: ICS manual command board with protected military movement lane prioritization.

## Profile Set (2026-03-09 Domain Expansion - Polar Sustainment, Deception Assurance, and Infrastructure Integrity)

### `stratospheric-balloon-isr-reconstitution-v1`
- Use for stratospheric ISR balloon persistence recovery after attrition, weather displacement, or adversary disruption.
- Primary tools: balloon fleet telemetry dashboard, payload retasking planner, relay continuity orchestrator.
- Cross-check tools: independent weather-drift model and alternate ISR coverage validator.
- Protocols: `USMTF`, `CoT`, `OGC`, `API/JSON`.
- Degraded fallback: critical ISR coverage bands only with pre-approved relaunch priorities.

### `antarctic-logistics-treaty-compliance-v1`
- Use for coalition Antarctic sustainment planning with treaty-safe routing and severe-weather branch control.
- Primary tools: polar sustainment scheduler, treaty compliance policy engine, weather-window operations board.
- Cross-check tools: independent protected-area boundary verifier and coalition legal review queue.
- Protocols: `USMTF`, `NIMS/ICS`, `OGC`, `API/JSON`.
- Degraded fallback: life-safety and mission-essential sustainment with strict legal gate checks.

### `fuel-adulteration-vehicle-protection-v1`
- Use for contamination detection, lot quarantine, and platform operating-limit controls in contested fuel networks.
- Primary tools: fuel assay anomaly analytics, lot provenance graph, fleet degradation monitor.
- Cross-check tools: independent lab-chain validator and alternate maintenance trend monitor.
- Protocols: `USMTF`, `API/JSON`, `XML`, `NATO APP-11/ADatP-3`.
- Degraded fallback: approved-source fuel only and restricted platform employment.

### `electro-optical-decoy-audit-v1`
- Use for EO and IR decoy effectiveness review and deception retuning against evolving sensor threats.
- Primary tools: decoy effectiveness scorer, sensor exposure fusion dashboard, deception optimizer.
- Cross-check tools: independent red-cell replay service and alternate camouflage confidence board.
- Protocols: `USMTF`, `Link 16 J-series`, `VMF`, `API/JSON`.
- Degraded fallback: high-value-target decoy packages only with conservative release authority.

### `veteran-medical-surge-transition-v1`
- Use for synchronized DoD-to-veteran medical transitions during casualty surge conditions.
- Primary tools: patient transition broker, specialty bed matcher, continuity-of-care tracker.
- Cross-check tools: independent record reconciliation queue and family-notification audit board.
- Protocols: `HL7/FHIR`, `USMTF`, `API/JSON`, `NIEM`.
- Degraded fallback: highest-acuity transfer classes only with intensified handoff verification.

### `geothermal-power-node-security-v1`
- Use for geothermal generation-node protection and mission-load restoration in cyber/kinetic contested conditions.
- Primary tools: geothermal ICS telemetry fusion, anomaly triage engine, restoration planner.
- Cross-check tools: independent plant-state verifier and utility dispatch integrity board.
- Protocols: `NIMS/ICS`, `USMTF`, `OGC`, `API/JSON`.
- Degraded fallback: mission-critical load restoration only with manual plant controls.

### `denied-terrain-avalanche-route-rescue-v1`
- Use for avalanche-threat route assurance and rescue sequencing in mountain terrain with degraded communications.
- Primary tools: avalanche hazard fusion board, route viability engine, rescue launch scheduler.
- Cross-check tools: independent snowpack stress validator and alternate weather-risk board.
- Protocols: `USMTF`, `VMF`, `CoT`, `OGC`, `API/JSON`.
- Degraded fallback: preauthorized critical routes only and bounded rescue launch windows.

### `autonomous-maritime-traffic-liability-v1`
- Use for coalition crewed-uncrewed maritime separation and evidentiary-quality liability management.
- Primary tools: autonomous lane manager, collision predictor, maritime legal evidence ledger.
- Cross-check tools: independent AIS anomaly adjudication and coalition legal review board.
- Protocols: `AIS/NMEA`, `USMTF`, `STIX/TAXII`, `API/JSON`, `NATO APP-11/ADatP-3`.
- Degraded fallback: mission-priority lanes only with restricted autonomous behavior profiles.

### `cislunar-sda-logistics-denial-v1`
- Use for cislunar traffic awareness, logistics-route denial analysis, and resilient orbital mission routing.
- Primary tools: cislunar SSA catalogs, orbital trajectory planners, route-risk analytics.
- Cross-check tools: independent ephemeris mirror and alternate conflict timeline review.
- Protocols: `API/JSON`, `USMTF`, `CCSDS OMM/OEM`.
- Degraded fallback: static lane-priority board with conservative route conflict assumptions.

### `cognitive-ew-deception-detection-v1`
- Use for integrated deception detection across narrative and electromagnetic domains.
- Primary tools: influence telemetry analytics, EW anomaly fusion services, media authenticity forensics.
- Cross-check tools: independent credibility ledger and alternate RF baseline validator.
- Protocols: `STIX/TAXII`, `CoT`, `USMTF`.
- Degraded fallback: high-confidence-source-only posture with manual anomaly triage.

### `hypersonic-bda-restrike-v1`
- Use for rapid post-strike battle damage verification and restrike governance.
- Primary tools: multi-INT BDA fusion stacks, target-damage models, dynamic targeting decision boards.
- Cross-check tools: independent ISR confidence monitor and alternate damage-estimate service.
- Protocols: `VMF`, `Link 16 J-series`, `USMTF`.
- Degraded fallback: restrike recommendation delay with conservative confidence thresholds.

### `autonomous-maritime-salvage-legal-v1`
- Use for autonomous maritime salvage planning with legal-rights and custody assurance.
- Primary tools: salvage planning systems, autonomous vessel control services, evidence chain managers.
- Cross-check tools: independent legal-rights adjudication board and alternate custody ledger.
- Protocols: `AIS/NMEA`, `OGC`, `NATO APP-11/ADatP-3`.
- Degraded fallback: manual salvage queue with legal hold points.

### `bioprinted-trauma-stabilization-v1`
- Use for austere bioprinted trauma support and forward surgical stabilization coordination.
- Primary tools: bioprint process control systems, med-log orchestration, casualty regulation dashboards.
- Cross-check tools: independent sterility QA verifier and alternate clinical risk board.
- Protocols: `HL7/FHIR`, `USMTF`, `API/JSON`.
- Degraded fallback: approved-catalog interventions only with manual quality gates.

### `underground-gas-grid-explosion-prevention-v1`
- Use for denied urban underground gas-grid explosion prevention and service restoration.
- Primary tools: SCADA monitoring, underground utility maps, emergency operations platforms.
- Cross-check tools: independent pressure/contamination sampling and alternate utility status monitor.
- Protocols: `NIMS/ICS`, `EDXL-DE/CAP`, `OGC`.
- Degraded fallback: manual isolation planning with frequent life-safety updates.

### `cloud-model-supply-chain-sabotage-v1`
- Use for strategic cloud model/data supply-chain sabotage detection and mitigation.
- Primary tools: SBOM/attestation systems, cloud telemetry, model governance controls.
- Cross-check tools: independent provenance validator and alternate dependency anomaly board.
- Protocols: `STIX/TAXII`, `API/JSON`, `USMTF`.
- Degraded fallback: approved-baseline-only model operations with manual release review.

### `grid-blackstart-fuel-convoy-fusion-v1`
- Use for homeland grid blackstart sequencing tied to secure fuel convoy operations.
- Primary tools: restoration orchestration boards, convoy tracking services, infrastructure incident systems.
- Cross-check tools: independent utility restoration mirror and alternate convoy-threat monitor.
- Protocols: `NIMS/ICS`, `USMTF`, `API/JSON`.
- Degraded fallback: manual blackstart priority board with convoy waypoint callouts.

### `subsea-data-center-grid-defense-v1`
- Use for subsea compute-node defense, cable landing continuity, and shore-grid coupling restoration.
- Primary tools: subsea telemetry fusion, landing-station diagnostics, grid dependency mapping.
- Cross-check tools: independent seabed anomaly verifier and alternate utility-state mirror.
- Protocols: `OGC`, `STIX/TAXII`, `USMTF`, `API/JSON`.
- Degraded fallback: mission-essential node defense only with manual restoration board.

### `stratospheric-balloon-spectrum-recovery-v1`
- Use for balloon relay denial response and coalition spectrum restoration.
- Primary tools: high-altitude track analytics, EW/spectrum orchestration, coalition comms planning services.
- Cross-check tools: independent relay-attribution board and alternate RF integrity monitor.
- Protocols: `Link 16 J-series`, `CoT`, `USMTF`, `API/JSON`.
- Degraded fallback: critical-traffic-only spectrum windows with fixed reporting cadence.

### `rare-isotope-medical-supply-assurance-v1`
- Use for theater rare-isotope medical continuity, radiological assurance, and treatment sequencing.
- Primary tools: isotope inventory/traceability systems, dosimetry monitors, med-log orchestration tools.
- Cross-check tools: independent radiation safety audit board and alternate treatment-priority validator.
- Protocols: `HL7/FHIR`, `USMTF`, `API/JSON`.
- Degraded fallback: life-saving indications only with manual custody and release checks.

### `disconnected-mesh-key-compromise-recovery-v1`
- Use for containment and recovery after cryptographic compromise in disconnected tactical mesh networks.
- Primary tools: key lifecycle/orchestration services, mesh network controllers, trust attestation systems.
- Cross-check tools: independent revocation ledger and alternate compromise impact board.
- Protocols: signed key-status exports, `USMTF`, `API/JSON`.
- Degraded fallback: preapproved key ring operation with strict mission-priority restrictions.

### `commercial-satcom-priority-restoration-v1`
- Use for coalition commercial SATCOM priority preemption and bandwidth restoration.
- Primary tools: SATCOM traffic arbitration, mission-priority policy engines, coalition bandwidth dashboards.
- Cross-check tools: independent link quality mirror and alternate allocation conflict board.
- Protocols: `USMTF`, `API/JSON`, mission-policy envelopes, `Link 16 J-series`.
- Degraded fallback: essential command-and-safety traffic only with scheduled bandwidth windows.

### `arctic-permafrost-runway-bypass-v1`
- Use for arctic runway permafrost failure prediction and diversion/bypass decision support.
- Primary tools: runway geotechnical telemetry, permafrost stress analytics, diversion planners.
- Cross-check tools: independent runway integrity survey and alternate sortie continuity board.
- Protocols: `AIXM/FIXM`, `USMTF`, `OGC`, `API/JSON`.
- Degraded fallback: conservative runway closure thresholds and manual sortie reflow matrix.

### `bioforensics-field-lab-custody-v1`
- Use for rapid bioforensics attribution with evidentiary-quality chain of custody.
- Primary tools: field LIMS services, sequencing analytics, evidence workflow managers.
- Cross-check tools: independent custody auditor and alternate attribution confidence board.
- Protocols: `HL7/FHIR`, `STIX/TAXII`, `USMTF`.
- Degraded fallback: sample triage-only posture with delayed full attribution release.

### `dam-cascade-attack-response-v1`
- Use for hostile dam-cascade consequence analysis and evacuation synchronization.
- Primary tools: hydrologic flood-wave models, emergency operations dashboards, civil evacuation route engines.
- Cross-check tools: independent inundation verifier and alternate downstream impact board.
- Protocols: `NIMS/ICS`, `EDXL-DE/CAP`, `USMTF`, `OGC`.
- Degraded fallback: life-safety-first evacuation triggers with hourly manual revalidation.

## Profile Addendum K (2026-03-10, Strategic Continuity and Countertargeting Expansion)

### `nc3-resilience-order-integrity-v1`
- Use for strategic command continuity under cyber, kinetic, and electromagnetic disruption.
- Primary tools: `ts-nc3-resilience-and-order-integrity-v1`.
- Cross-check tools: `ts-denied-pnt-timing-holdover-v1`.
- Protocols: `USMTF`, signed order manifests, hardened voice/readback.
- Degraded fallback: constrained decision windows with mandatory two-person authority confirmation.

### `strategic-deterrence-signaling-fusion-v1`
- Use for synchronized deterrence signaling with escalation controls across domains.
- Primary tools: `ts-strategic-deterrence-signaling-fusion-v1`.
- Cross-check tools: `ts-gray-zone-influence-countercampaign-v1`.
- Protocols: `USMTF`, `NATO APP-11/ADatP-3`, signed coalition release manifests.
- Degraded fallback: limited, preapproved signaling patterns with coalition confirmation gates.

### `undersea-battle-network-self-healing-v1`
- Use for theater undersea communications continuity via autonomous reroute and repair sequencing.
- Primary tools: `ts-undersea-battle-network-self-healing-v1`.
- Cross-check tools: `ts-undersea-critical-node-defense-and-repair-v1`.
- Protocols: `OGC`, maritime telemetry exchange, `USMTF`.
- Degraded fallback: mission-essential communications routes only with fixed timing windows.

### `coalition-cognitive-ew-disinfo-countertargeting-v1`
- Use for coalition countertargeting against synchronized cognitive and EW deception campaigns.
- Primary tools: `ts-coalition-cognitive-ew-disinfo-countertargeting-v1`.
- Cross-check tools: `ts-cognitive-ew-deception-detection-v1`.
- Protocols: `STIX/TAXII`, `CoT`, `NATO APP-11/ADatP-3`.
- Degraded fallback: high-confidence-source-only operations with manual coalition synchronization.

### `denied-pnt-timing-holdover-v1`
- Use for distributed timing holdover and synchronization during GNSS denial/spoofing.
- Primary tools: `ts-denied-pnt-timing-holdover-v1`.
- Cross-check tools: `ts-anti-jam-gps-epoch-recovery-v1`.
- Protocols: signed timing manifests, `USMTF`, `API/JSON`.
- Degraded fallback: critical kill-chain timing windows only with conservative drift thresholds.

### `rapid-materiel-authentication-counterfeit-shield-v1`
- Use for tactical counterfeit detection and mission-safe parts release decisions.
- Primary tools: `ts-rapid-materiel-authentication-counterfeit-shield-v1`.
- Cross-check tools: `ts-homeland-microelectronics-counterfeit-quarantine-v1`.
- Protocols: signed supply manifests, `API/JSON`, `USMTF` sustainment messaging.
- Degraded fallback: approved-vendor-only intake with mandatory manual release review.

### `multi-domain-battle-rhythm-fragment-recovery-v1`
- Use for restoring synchronized battle rhythm and dependency coherence after comms fragmentation.
- Primary tools: `ts-multi-domain-battle-rhythm-fragment-recovery-v1`.
- Cross-check tools: `ts-disconnected-command-intent-reconciliation-v1`.
- Protocols: `USMTF`, `CoT`, signed command delta manifests.
- Degraded fallback: fixed-cycle battle rhythm with predelegated branch decisions only.

### `autonomous-decoy-campaign-effectiveness-v1`
- Use for planning and measuring autonomous decoy campaigns while enforcing fratricide safeguards.
- Primary tools: `ts-autonomous-decoy-campaign-effectiveness-v1`.
- Cross-check tools: `ts-multi-domain-decoy-orchestration-v1`.
- Protocols: `CoT`, `USMTF`, `Link 16 J-series`.
- Degraded fallback: restricted decoy windows with command confirmation before retask.

### `precision-effects-weaponeering-ai-assurance-v1`
- Use for assurance of AI-assisted precision effects recommendations before execution.
- Primary tools: `ts-precision-effects-weaponeering-ai-assurance-v1`.
- Cross-check tools: `ts-human-machine-target-validation-v1`.
- Protocols: `VMF`, `USMTF`, `Link 16 J-series`, signed assurance manifests.
- Degraded fallback: advisory-only AI output and mandatory human release decisions.

### `gray-zone-influence-countercampaign-v1`
- Use for countering persistent gray-zone influence campaigns impacting operational access.
- Primary tools: `ts-gray-zone-influence-countercampaign-v1`.
- Cross-check tools: `ts-strategic-competition-gray-zone-response-v1`.
- Protocols: `STIX/TAXII`, `NATO APP-11/ADatP-3`, `USMTF`.
- Degraded fallback: essential audience protection tasks with daily coalition synchronization.

### `expeditionary-data-fabric-zero-touch-hardening-v1`
- Use for resilient zero-touch data-fabric deployment with policy and trust controls.
- Primary tools: `ts-expeditionary-data-fabric-zero-touch-hardening-v1`.
- Cross-check tools: `ts-coalition-data-fabric-interoperability-v1`.
- Protocols: `API/JSON`, `STIX/TAXII`, `CoT`, signed policy manifests.
- Degraded fallback: mission-essential data lanes only with manual schema and trust review.

### `hyperscale-cloud-failover-command-continuity-v1`
- Use for strategic command continuity during hyperscale cloud outages or contested degradations.
- Primary tools: `ts-hyperscale-cloud-failover-command-continuity-v1`.
- Cross-check tools: `ts-multi-cloud-mission-data-integrity-v1`.
- Protocols: signed continuity manifests, `USMTF`, `API/JSON`.
- Degraded fallback: critical command applications only with strict authority gates and staged recovery.

## Profile Addendum L (2026-03-11, Homeland Resilience, Cognitive Staff Load, and Legal-Evidence Fusion)

### `homeland-grid-blackstart-defense-support-v1`
- Use for homeland grid blackstart synchronization under contested cyber/physical outage conditions.
- Primary tools: `ts-homeland-grid-blackstart-defense-support-v1`.
- Cross-check tools: `ts-civil-support-v1`.
- Protocols: `IEC 61850`, `NIMS/ICS`, `USMTF`.
- Degraded fallback: life-safety and mission-essential loads only with hourly authority confirmation.

### `battle-staff-cognitive-load-balancing-v1`
- Use for balancing watchfloor and battle-staff cognitive load during high-tempo operations.
- Primary tools: `ts-battle-staff-cognitive-load-balancing-v1`.
- Cross-check tools: `ts-joint-c2-fusion-v1`.
- Protocols: `USMTF`, `API/JSON`, signed decision-latency manifests.
- Degraded fallback: decision-critical queue only with manual staffing controls.

### `contested-spectrum-civil-aviation-protection-v1`
- Use for civil and military flight-safety protection during contested electromagnetic operations.
- Primary tools: `ts-contested-spectrum-civil-aviation-protection-v1`.
- Cross-check tools: `ts-spectrum-governance-v1`.
- Protocols: `AIXM/FIXM`, `Link 16 J-series`, `USMTF`.
- Degraded fallback: protected air corridors only with strict comm windows and authority release.

### `defense-industrial-base-sabotage-risk-v1`
- Use for strategic defense-industrial sabotage risk triage and continuity planning.
- Primary tools: `ts-defense-industrial-base-sabotage-risk-v1`.
- Cross-check tools: `ts-strategic-supply-shock-v1`.
- Protocols: `API/JSON`, `STIX/TAXII`, signed production manifests.
- Degraded fallback: highest-priority production lines only with manual release gates.

### `arctic-space-weather-aviation-diversion-v1`
- Use for sortie continuity planning in arctic operations during space-weather degradation.
- Primary tools: `ts-arctic-space-weather-aviation-diversion-v1`.
- Cross-check tools: `ts-polar-routing-v1`.
- Protocols: `AIXM/FIXM`, `API/JSON`, `USMTF`.
- Degraded fallback: essential sorties only with conservative weather/nav thresholds.

### `coalition-information-ops-civil-trust-stabilization-v1`
- Use for coalition trust stabilization and influence-response synchronization.
- Primary tools: `ts-coalition-information-ops-civil-trust-stabilization-v1`.
- Cross-check tools: `ts-disinformation-counter-v1`.
- Protocols: `STIX/TAXII`, `NATO APP-11/ADatP-3`, signed coalition release manifests.
- Degraded fallback: high-confidence releases only with explicit uncertainty and coalition reconfirmation.

### `military-family-readiness-crisis-sustainment-v1`
- Use for force-readiness support through military family sustainment during extended crises.
- Primary tools: `ts-military-family-readiness-crisis-sustainment-v1`.
- Cross-check tools: `ts-civil-support-v1`.
- Protocols: `NIEM`, `API/JSON`, `USMTF` readiness summaries.
- Degraded fallback: high-risk cohorts only with manual support assignment cadence.

### `contested-cyber-legal-evidence-fusion-v1`
- Use for cyber incident evidence fusion and legal escalation in contested operations.
- Primary tools: `ts-contested-cyber-legal-evidence-fusion-v1`.
- Cross-check tools: `ts-cyber-defense-v1`.
- Protocols: `STIX/TAXII`, signed custody manifests, `USMTF` legal escalation summaries.
- Degraded fallback: provisional attribution posture with conservative legal confidence bands.

## Profile Addendum M (2026-03-14, Legal Attribution, Trusted Command, Protected Boundaries, and Strategic Logistics Warning)

### `tactical-legal-attribution-synthesis-v1`
- Use for rapid legal attribution support when cyber, EW, information, and physical evidence must be fused before commander action.
- Primary tools: `ts-joint-tactical-legal-attribution-synthesis-v1`.
- Cross-check tools: `ts-cyber-defense-v1`.
- Protocols: `STIX/TAXII`, `USMTF`, `NIEM`, `API/JSON`.
- Degraded fallback: advisory-only attribution posture with manual legal review.

### `allied-depot-sabotage-recovery-v1`
- Use for coalition depot sabotage wargaming, stock reallocation, and protected recovery planning.
- Primary tools: `ts-coalition-allied-depot-sabotage-wargame-v1`.
- Cross-check tools: `ts-logistics-distribution-v1`.
- Protocols: `USMTF`, `NATO APP-11/ADatP-3`, signed logistics manifests.
- Degraded fallback: highest-priority stocks only with manual branch control.

### `mission-ai-confidence-governance-v1`
- Use for early warning and governance when mission AI trust is degrading across high-impact workflows.
- Primary tools: `ts-theater-mission-ai-confidence-early-warning-v1`.
- Cross-check tools: `ts-adversarial-ai-model-poisoning-detection-v1`.
- Protocols: signed model attestations, `API/JSON`, `STIX/TAXII`, `USMTF`.
- Degraded fallback: approved-baseline-only model operations with human release authority.

### `sovereign-edge-cloud-migration-v1`
- Use for governed cloud-to-edge cutovers when sovereignty, survivability, or latency requires mission workload migration.
- Primary tools: `ts-joint-sovereign-edge-cloud-migration-v1`.
- Cross-check tools: `ts-hyperscale-cloud-failover-command-continuity-v1`.
- Protocols: signed continuity manifests, `API/JSON`, mTLS, `USMTF`.
- Degraded fallback: trusted snapshot mode plus staged mission-essential edge services only.

### `launch-counterfeit-microelectronics-v1`
- Use for strategic launch electronics pedigree assurance and counterfeit interdiction before release or launch.
- Primary tools: `ts-strategic-launch-counterfeit-microelectronics-v1`.
- Cross-check tools: `ts-rapid-materiel-authentication-counterfeit-shield-v1`.
- Protocols: signed supply manifests, `NIEM`, `API/JSON`, `USMTF`.
- Degraded fallback: quarantine-first release posture with dual-control review.

### `maritime-minefield-humanitarian-corridor-v1`
- Use for humanitarian sea-corridor integrity when mine threats, escort constraints, and coalition caveats interact.
- Primary tools: `ts-coalition-minefield-humanitarian-corridor-integrity-v1`.
- Cross-check tools: `ts-maritime-undersea-v1`.
- Protocols: `AIS/NMEA`, `OGC`, `USMTF`, `NATO APP-11/ADatP-3`.
- Degraded fallback: high-confidence convoys only with fixed escort windows.

### `homeland-dam-levee-engineer-surge-v1`
- Use for DSCA engineer-force prioritization across failing dams, levees, and flood-control nodes.
- Primary tools: `ts-homeland-dam-levee-engineer-surge-v1`.
- Cross-check tools: `ts-civil-support-v1`.
- Protocols: `NIMS/ICS`, `USMTF`, `OGC`, `API/JSON`.
- Degraded fallback: life-safety-first engineer allocation with hourly authority confirmation.

### `command-voice-spoof-defense-v1`
- Use for restoring trusted command-path authentication after suspected synthetic voice or media spoofing.
- Primary tools: `ts-joint-command-voice-spoof-defense-v1`.
- Cross-check tools: `ts-deepfake-media-auth-v1`.
- Protocols: signed voice-auth manifests, `USMTF`, `STIX/TAXII`, `API/JSON`.
- Degraded fallback: manual countersign and dual-channel human verification only.

### `no-strike-geofence-integrity-v1`
- Use for dynamic no-strike and restricted-target boundary integrity assurance across targeting and fires systems.
- Primary tools: `ts-theater-no-strike-geofence-integrity-v1`.
- Cross-check tools: `ts-fires-airspace-v1`.
- Protocols: `VMF`, `USMTF`, `OGC`, `API/JSON`.
- Degraded fallback: hold-fire posture pending manual protected-boundary confirmation.

### `expeditionary-pediatric-casualty-surge-v1`
- Use for balancing pediatric casualties across austere medical networks and contested transport lanes.
- Primary tools: `ts-expeditionary-pediatric-casualty-surge-v1`.
- Cross-check tools: `ts-medical-force-health-v1`.
- Protocols: `HL7/FHIR`, `USMTF`, `NATO APP-11/ADatP-3`, `API/JSON`.
- Degraded fallback: life-saving redistribution only with conservative transfer rules.

### `ephemeris-spoof-timing-confidence-v1`
- Use for preserving trusted orbital and timing data when ephemeris or time-transfer inputs may be spoofed.
- Primary tools: `ts-satellite-ephemeris-spoof-timing-confidence-v1`.
- Cross-check tools: `ts-space-weather-gnss-fusion-v1`.
- Protocols: `CCSDS`, signed timing manifests, `API/JSON`, `USMTF`.
- Degraded fallback: mission-essential timing windows only with strict drift limits.

### `economic-coercion-logistics-warning-v1`
- Use for early warning on adversary economic coercion against routes, suppliers, insurers, ports, and carriers.
- Primary tools: `ts-strategic-economic-coercion-logistics-warning-v1`.
- Cross-check tools: `ts-strategic-supply-shock-v1`.
- Protocols: `STIX/TAXII`, `USMTF`, signed logistics manifests, `API/JSON`.
- Degraded fallback: mission-essential route monitoring with daily commander updates only.

## Profile Addendum N (2026-03-14, Industrial Bottlenecks, Trust Reconstitution, and Sealift Support)

### `machine-tool-forging-priority-v1`
- Use for strategic machine-tool, forging, and heat-treatment prioritization when heavy-manufacturing capacity constrains warfighter output.
- Primary tools: `ts-strategic-machine-tool-forging-capacity-priority-v1`.
- Cross-check tools: `ts-defense-industrial-base-sabotage-risk-v1`.
- Protocols: signed production manifests, `API/JSON`, `USMTF`, `OPC UA`.
- Degraded fallback: mission-essential workorders only with daily release review.

### `composite-prepreg-resin-allocation-v1`
- Use for defense allocation of prepreg, resin, freezer inventory, and autoclave slots when composite materials become the bottleneck.
- Primary tools: `ts-strategic-composite-prepreg-resin-defense-allocation-v1`.
- Cross-check tools: `ts-defense-industrial-base-sabotage-risk-v1`.
- Protocols: signed material-cert manifests, `API/JSON`, `USMTF`, `OPC UA`.
- Degraded fallback: mission-essential composite lots only with conservative release thresholds.

### `bearing-gearbox-surge-assurance-v1`
- Use for trusted bearing and gearbox availability when rotating-component shortages threaten aviation, maritime, or ground readiness.
- Primary tools: `ts-strategic-bearing-gearbox-surge-assurance-v1`.
- Cross-check tools: `ts-rapid-materiel-authentication-counterfeit-shield-v1`.
- Protocols: signed supply manifests, `API/JSON`, `USMTF`, `NIEM`.
- Degraded fallback: mission-essential platform components only with strict release gates.

### `industrial-gas-oxygen-priority-v1`
- Use for theater oxygen and specialty-gas prioritization when refill capacity and transport limits threaten medical care and sustainment.
- Primary tools: `ts-theater-bulk-industrial-gas-oxygen-priority-v1`.
- Cross-check tools: `ts-forward-medical-oxygen-assurance-v1`.
- Protocols: `HL7/FHIR`, signed logistics manifests, `API/JSON`, `USMTF`.
- Degraded fallback: medical and mission-essential gas distribution only with command-approved rationing.

### `munition-dataload-crypto-reconstitution-v1`
- Use for reconstituting trusted munition dataloads and crypto fills after compromise or relocation.
- Primary tools: `ts-joint-munition-dataload-crypto-fill-reconstitution-v1`.
- Cross-check tools: `ts-zero-trust-key-continuity-v1`.
- Protocols: `X.509/PKI`, signed mission-data manifests, `API/JSON`, `USMTF`.
- Degraded fallback: human-verified limited release only with commander-approved fallback loads.

### `neo-identity-fraud-suppression-v1`
- Use for coalition noncombatant evacuation screening when document fraud, synthetic identities, or family-link disputes threaten movement integrity.
- Primary tools: `ts-coalition-neo-identity-fraud-suppression-v1`.
- Cross-check tools: `ts-coalition-border-refugee-biometric-deconfliction-insider-risk-screening-v1`.
- Protocols: `NIEM`, `CJIS`, `API/JSON`, `USMTF`, ICAO Doc 9303 aligned exchange.
- Degraded fallback: life-safety-first screening with protected hold-and-review lanes.

### `harbor-tug-pilotage-sealift-priority-v1`
- Use for military sealift flow when tug crews, pilots, or berth-movement windows become the decisive port bottleneck.
- Primary tools: `ts-strategic-harbor-tug-pilotage-sealift-priority-v1`.
- Cross-check tools: `ts-strategic-sealift-port-survivability-v1`.
- Protocols: `AIS/NMEA`, `OGC`, signed port manifests, `API/JSON`, `USMTF`.
- Degraded fallback: military-essential sailings only with fixed tug and pilot release windows.

### `lubricant-hydraulic-allocation-v1`
- Use for specialty lubricant and hydraulic-fluid allocation when shortages or contamination threaten homeland defense mission-capable rates.
- Primary tools: `ts-homeland-defense-specialty-lubricant-hydraulic-fluid-allocation-v1`.
- Cross-check tools: `ts-defense-industrial-base-sabotage-risk-v1`.
- Protocols: signed material-cert manifests, `API/JSON`, `USMTF`, `NIEM`.
- Degraded fallback: mission-essential systems only with conservative substitution and refill approval.

## Profile Addendum O (2026-03-14, Airbase Recovery, Convoy Autonomy, and Tactical Data Trust)

### `airbase-arresting-gear-reconstitution-v1`
- Use for recovering arresting gear and runway-end cable capacity when expeditionary airbases need safe sortie regeneration.
- Primary tools: `ts-joint-airbase-arresting-gear-runway-cable-reconstitution-v1`.
- Cross-check tools: `ts-airfield-recovery-v1`.
- Protocols: `USMTF`, `AIXM/FIXM`, signed maintenance manifests, `API/JSON`.
- Degraded fallback: precleared aircraft profiles only with commander-approved runway limits.

### `munitions-end-use-serial-trace-v1`
- Use for coalition transfer assurance when munitions serial integrity, diversion risk, or end-use accountability becomes decisive.
- Primary tools: `ts-coalition-munitions-end-use-serial-trace-v1`.
- Cross-check tools: `ts-detainee-accountability-v1`.
- Protocols: `NIEM`, `USMTF`, signed custody manifests, `API/JSON`, NATO APP-11/ADatP-3 aligned exchange.
- Degraded fallback: highest-priority munitions only with dual-control receipt confirmation.

### `autonomy-convoy-spectrum-integrity-v1`
- Use for convoy continuity when jamming, spoofing, or degraded control links threaten spectrum-dependent autonomy.
- Primary tools: `ts-theater-spectrum-autonomy-convoy-integrity-v1`.
- Cross-check tools: `ts-spectrum-governance-v1`.
- Protocols: `CoT`, `VMF`, signed autonomy attestations, `API/JSON`, `USMTF`.
- Degraded fallback: human-led convoy operations with restricted autonomy assist functions only.

### `commercial-sat-imagery-retask-v1`
- Use for priority retask governance when commercial imagery access is denied, degraded, or politically constrained.
- Primary tools: `ts-joint-commercial-sat-imagery-retask-governance-v1`.
- Cross-check tools: `ts-space-satcom-v1`.
- Protocols: `STANAG 4559`, `OGC`, `API/JSON`, `USMTF`.
- Degraded fallback: critical-named-area-only retask queue with explicit commander reprioritization.

### `photonics-laser-optics-allocation-v1`
- Use for strategic allocation of photonics, laser optics, and specialty electro-optical materials across defense demand.
- Primary tools: `ts-strategic-photonics-laser-optics-allocation-v1`.
- Cross-check tools: `ts-defense-industrial-base-sabotage-risk-v1`.
- Protocols: signed material-cert manifests, `API/JSON`, `USMTF`, `OPC UA`.
- Degraded fallback: mission-essential sensor and laser lots only with conservative release thresholds.

### `expeditionary-burn-transfer-blood-rotation-v1`
- Use for austere burn-care redistribution when burn-bed capacity, escharotomy capability, and blood rotation determine survival.
- Primary tools: `ts-expeditionary-burn-bed-transfer-blood-rotation-v1`.
- Cross-check tools: `ts-medical-force-health-v1`.
- Protocols: `HL7/FHIR`, `USMTF`, `NATO APP-11/ADatP-3`, `API/JSON`.
- Degraded fallback: life-saving burn transfers only with conservative transfusion thresholds.

### `rail-hazmat-military-priority-v1`
- Use for homeland rail deconfliction when hazardous-material movements and military force flow compete for constrained dispatch windows.
- Primary tools: `ts-homeland-rail-hazmat-military-priority-deconfliction-v1`.
- Cross-check tools: `ts-civil-support-v1`.
- Protocols: `NIMS/ICS`, `EDI X12`, `API/JSON`, `USMTF`.
- Degraded fallback: military-essential moves only with hazmat hold points and manual dispatch approval.

### `tactical-edge-dataset-rollback-v1`
- Use for edge dataset provenance and rollback when corrupted or stale models threaten tactical decisions.
- Primary tools: `ts-joint-tactical-edge-dataset-provenance-rollback-v1`.
- Cross-check tools: `ts-ai-model-governance-assurance-v1`.
- Protocols: signed dataset manifests, `API/JSON`, `STIX/TAXII`, `USMTF`.
- Degraded fallback: approved-baseline snapshots only with human release for edge updates.

## Profile Addendum P (2026-03-14, Reserve Airlift, Hot-Section Materials, Order Trust, and Coalition Access)

### `civil-reserve-air-fleet-activation-v1`
- Use for reserve and commercial airlift activation when military lift is insufficient or cargo backlogs exceed organic capacity.
- Primary tools: `ts-joint-civil-reserve-air-fleet-activation-v1`.
- Cross-check tools: `ts-logistics-distribution-v1`.
- Protocols: `AIXM/FIXM`, `IATA Cargo-IMP`, `API/JSON`, `USMTF`.
- Degraded fallback: mission-essential lift only with daily commander review.

### `aerial-refueling-boom-drogue-reconstitution-v1`
- Use for tanker boom, drogue, and hose-drum recovery when refueling hardware constrains air campaign tempo.
- Primary tools: `ts-joint-aerial-refueling-boom-drogue-reconstitution-v1`.
- Cross-check tools: `ts-airfield-recovery-v1`.
- Protocols: `USMTF`, `Link 16 J-series`, `AIXM/FIXM`, signed maintenance manifests.
- Degraded fallback: highest-priority receivers only with commander-approved fuel rationing.

### `mission-sbom-emergency-patch-v1`
- Use for emergency mission-software patch governance when exploit urgency and mission assurance must be balanced.
- Primary tools: `ts-theater-mission-sbom-emergency-patch-v1`.
- Cross-check tools: `ts-cyber-defense-v1`.
- Protocols: `CycloneDX/SPDX`, `STIX/TAXII`, signed deployment manifests, `API/JSON`.
- Degraded fallback: isolate-and-monitor only with rollback-ready baseline.

### `turbine-superalloy-tbc-priority-v1`
- Use for turbine hot-section allocation when superalloy pedigree, casting slots, or coating throughput constrain readiness.
- Primary tools: `ts-strategic-turbine-superalloy-tbc-priority-v1`.
- Cross-check tools: `ts-strategic-machine-tool-forging-capacity-priority-v1`.
- Protocols: signed material-cert manifests, `API/JSON`, `USMTF`, `OPC UA`.
- Degraded fallback: mission-essential engine lots only with conservative release thresholds.

### `digital-order-watermark-recall-v1`
- Use for digital order recall and reissue when signing, watermark, or distribution integrity is suspect.
- Primary tools: `ts-joint-digital-order-watermark-recall-v1`.
- Cross-check tools: `ts-joint-command-voice-spoof-defense-v1`.
- Protocols: signed order manifests, `USMTF`, `STIX/TAXII`, `API/JSON`.
- Degraded fallback: hold and reissue only with dual-channel human confirmation.

### `potable-water-restart-biofilm-control-v1`
- Use for base potable-water restart and health protection after outages, contamination, or long stagnation periods.
- Primary tools: `ts-homeland-base-water-restart-biofilm-control-v1`.
- Cross-check tools: `ts-civil-support-v1`.
- Protocols: `HL7/FHIR`, `NIMS/ICS`, `API/JSON`, `USMTF`.
- Degraded fallback: restricted-potable-use posture with mission-essential facility release only.

### `coalition-civil-airlift-clearance-v1`
- Use for coalition civil-airlift movements when host-nation diplomatic clearances and ramp throughput are the pacing constraint.
- Primary tools: `ts-coalition-host-nation-civil-airlift-clearance-v1`.
- Cross-check tools: `ts-joint-civil-reserve-air-fleet-activation-v1`.
- Protocols: `AIXM/FIXM`, `NIEM`, `API/JSON`, `USMTF`, ICAO diplomatic-clearance exchange.
- Degraded fallback: protected or mission-essential sorties only with liaison-confirmed clearances.

### `space-ground-station-rf-surge-v1`
- Use for strategic ground-station continuity when traveling-wave tubes, cryogenic receivers, or RF spares become scarce.
- Primary tools: `ts-space-ground-station-twt-cryogenic-surge-v1`.
- Cross-check tools: `ts-space-satcom-v1`.
- Protocols: `CCSDS`, signed maintenance manifests, `API/JSON`, `USMTF`.
- Degraded fallback: mission-essential nodes only with constrained coverage windows.

### `armored-running-gear-priority-v1`
- Use for armored readiness prioritization when track pads, roadwheels, or final drives become the limiting repair item.
- Primary tools: `ts-joint-armored-vehicle-running-gear-priority-v1`.
- Cross-check tools: `ts-logistics-distribution-v1`.
- Protocols: signed supply manifests, `API/JSON`, `USMTF`, `NIEM`.
- Degraded fallback: mission-essential tracked fleets only with commander-approved training reductions.

### `underway-replenishment-rig-compatibility-v1`
- Use for coalition underway replenishment when hose, spanwire, or rig incompatibility threatens fuel and stores transfer at sea.
- Primary tools: `ts-coalition-underway-replenishment-rig-compatibility-v1`.
- Cross-check tools: `ts-maritime-undersea-v1`.
- Protocols: `AIS/NMEA`, `NATO APP-11/ADatP-3`, signed logistics manifests, `API/JSON`, `USMTF`.
- Degraded fallback: fuel and life-support stores only with manual compatibility verification.
