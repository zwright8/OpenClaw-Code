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
