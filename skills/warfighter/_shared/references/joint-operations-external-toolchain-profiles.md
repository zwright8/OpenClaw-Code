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

## Profile Set (2026-03-09 Domain Expansion - Black-Sky Command Continuity, Arctic Mobility, and Coalition Recovery Evidence)

### `black-sky-c2-bridge-v1`
- Use for black-sky command continuity by bridging HF fallback and SATCOM restoration.
- Primary tools: HF status monitor, SATCOM path restoration board, command message priority broker.
- Cross-check tools: independent command acknowledgment board and alternate oscillator holdover monitor.
- Protocols: `USMTF`, `API/JSON`, HF readback logs.
- Degraded fallback: command-essential message classes only with explicit acknowledgment gates.

### `arctic-ice-route-assurance-v1`
- Use for arctic convoy movement over variable ice-load corridors under contested conditions.
- Primary tools: ice-route load-class model, convoy telemetry board, route threat timeline service.
- Cross-check tools: independent weather/ice confidence monitor and alternate engineer reconnaissance board.
- Protocols: `USMTF`, `API/JSON`, `OGC`.
- Degraded fallback: single-route critical convoy posture with conservative load and spacing controls.

### `harbor-chemical-decon-reopen-v1`
- Use for coalition harbor chemical release response with phased decon and safe throughput reopening.
- Primary tools: contamination plume model, decon scheduler, berth recovery tracker.
- Cross-check tools: independent sampling confidence board and alternate port safety compliance queue.
- Protocols: `USMTF`, `API/JSON`, `NIEM`, `NIMS/ICS`.
- Degraded fallback: life-safety and command-essential berths only with strict hazard boundaries.

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

## Profile Set (2026-03-10 Expansion - Warfighter Domain Coverage Surge)

### `autonomous-swarm-corridor-priority-v1`
- Use for autonomous swarm corridor deconfliction and release authority sequencing across multi-domain traffic.
- Primary tools: autonomous traffic orchestration + mission priority scheduler + dynamic geofence manager.
- Cross-check tools: independent corridor conflict monitor and fratricide-risk board.
- Protocols: `CoT`, `Link 16 J-series`, `USMTF`, `API/JSON`.
- Degraded fallback: mission-essential corridor windows only with manual deconfliction matrix.

### `theater-food-water-fuel-denial-v1`
- Use for sustainment continuity when food, water, and fuel networks are disrupted or contaminated.
- Primary tools: sustainment demand forecast + contamination telemetry + movement-control allocator.
- Cross-check tools: independent commodity status ledger and alternate route viability monitor.
- Protocols: `USMTF`, `NIMS/ICS`, `API/JSON`, `HL7/FHIR`.
- Degraded fallback: life-support priority-only distribution with 6-hour confidence refresh.

### `additive-airworthiness-certification-v1`
- Use for additive aviation part release with traceability, certification, and sortie-risk governance.
- Primary tools: additive QA pipeline + digital provenance ledger + airworthiness release workflow.
- Cross-check tools: independent material integrity verifier and maintenance risk board.
- Protocols: `USMTF`, `AIXM/FIXM/IWXXM`, `API/JSON`.
- Degraded fallback: approved catalog substitutions only with commander risk acceptance note.

### `urban-subsurface-raid-safety-v1`
- Use for urban tunnel/subsurface raid planning with utility protection and civilian-harm mitigation.
- Primary tools: subsurface map fusion + utility telemetry overlays + raid risk simulation board.
- Cross-check tools: independent tunnel hazard validation and utility conflict monitor.
- Protocols: `OGC`, `VMF`, `USMTF`, `API/JSON`.
- Degraded fallback: restricted maneuver advice with no-strike defaults and manual utility coordination.

### `sanctions-evasion-maritime-disruption-v1`
- Use for coalition disruption of maritime sanctions-evasion networks with legal evidence continuity.
- Primary tools: vessel network analytics + sanctions fusion + interdiction evidence workflow.
- Cross-check tools: independent legal confidence review and cargo anomaly monitor.
- Protocols: `AIS/NMEA`, `STIX/TAXII`, `NATO APP-11/ADatP-3`, `USMTF`, `API/JSON`.
- Degraded fallback: confidence-bounded disruption recommendations with legal hold points.

### `satellite-ground-station-defense-v1`
- Use for cyber-physical defense and restoration sequencing of strategic satellite ground stations.
- Primary tools: ground station SOC telemetry + perimeter anomaly detection + SATCOM continuity planners.
- Cross-check tools: independent site assurance monitor and link-health mirror.
- Protocols: `USMTF`, `STIX/TAXII`, `OGC`, `API/JSON`.
- Degraded fallback: critical-service-only continuity posture with scheduled sync windows.

### `civil-alert-authentication-rumor-control-v1`
- Use for emergency alert legitimacy checks and rumor control under contested information conditions.
- Primary tools: alert authenticity validators + media forensics + civic trust telemetry.
- Cross-check tools: independent source credibility ledger and alternate narrative anomaly monitor.
- Protocols: `EDXL-DE/CAP`, `NIMS/ICS`, `USMTF`, `API/JSON`.
- Degraded fallback: high-confidence-source-only alerts with explicit uncertainty annotations.

### `battlefield-identity-credential-recovery-v1`
- Use for credential compromise response, revocation, reissue, and trust restoration in combat operations.
- Primary tools: credential lifecycle manager + revocation broker + access anomaly analytics.
- Cross-check tools: independent identity audit ledger and replay-detection monitor.
- Protocols: `USMTF`, `API/JSON`, `STIX/TAXII`.
- Degraded fallback: mission-essential allowlist operations with manual dual-control identity checks.

### `theater-fiber-backbone-traffic-triage-v1`
- Use for mission-priority traffic triage and restoration sequencing during theater fiber disruption.
- Primary tools: backbone telemetry + traffic orchestration + restoration planning board.
- Cross-check tools: independent network health mirror and critical flow validator.
- Protocols: `USMTF`, `STIX/TAXII`, `API/JSON`.
- Degraded fallback: command/medical traffic-only routing with fixed synchronization intervals.

### `reserve-mobilization-training-surge-v1`
- Use for reserve force mobilization and training pipeline surge under compressed readiness timelines.
- Primary tools: mobilization readiness systems + training throughput scheduler + instructor capacity planners.
- Cross-check tools: independent readiness confidence board and alternate throughput verification tracker.
- Protocols: `USMTF`, `API/JSON`, `NATO APP-11/ADatP-3 aligned`.
- Degraded fallback: priority-unit surge mode with conservative readiness assumptions.

## Profile Set (2026-03-12 Expansion Wave XXVII - Cislunar Custody, Quantum-PNT Fallback, Infrastructure Blackstart, and Cognitive-EM Deception)

### `theater-cislunar-custody-conjunction-assurance-v1`
- Use for cislunar logistics custody and conjunction-safe maneuver authority synchronization.
- Primary tools: cislunar conjunction board + custody ledger + maneuver release workflow.
- Cross-check tools: independent conjunction witness and alternate custody audit board.
- Protocols: `CCSDS`, `USMTF`, `NIEM`, `API/JSON`.
- Degraded fallback: mission-essential custody updates only with conservative maneuver thresholds.

### `joint-quantum-pnt-fallback-assurance-v1`
- Use for assured navigation and timing branches under GNSS denial or deception.
- Primary tools: pnt integrity monitor + inertial/celestial fusion board + timing drift tracker.
- Cross-check tools: independent trusted-time witness and alternate drift monitor.
- Protocols: `USMTF`, `VMF`, `CoT`, `Link 16 J-series`, `API/JSON`.
- Degraded fallback: mission-essential routes only with fixed confidence refresh cadence.

### `homeland-base-grid-blackstart-synchronization-v1`
- Use for military base islanded-grid blackstart coordination with civil utility restoration.
- Primary tools: grid telemetry board + microgrid orchestrator + utility synchronization workflow.
- Cross-check tools: independent power quality monitor and alternate restoration status mirror.
- Protocols: `USMTF`, `NIMS/ICS`, `NIEM`, `STIX/TAXII`, `API/JSON`.
- Degraded fallback: life-safety and c2 loads only with strict command check-ins.

### `joint-biosurveillance-field-lab-custody-v1`
- Use for field sample custody assurance and lab-throughput governance in contested operations.
- Primary tools: biosurveillance fusion board + lims workflow + sample logistics tracker.
- Cross-check tools: independent custody audit queue and alternate outbreak confidence board.
- Protocols: `HL7/FHIR`, `NIEM`, `USMTF`, `STIX/TAXII`, `API/JSON`.
- Degraded fallback: high-priority sample classes only with elevated uncertainty labels.

### `coalition-sanctions-maritime-insurance-evasion-disruption-v1`
- Use for coalition disruption of maritime insurance/ownership evasion networks with legal evidence continuity.
- Primary tools: vessel network analytics + sanctions adjudication board + evidence-custody workflow.
- Cross-check tools: independent legal confidence reviewer and alternate ownership-anomaly monitor.
- Protocols: `AIS/NMEA`, `STIX/TAXII`, `NATO APP-11/ADatP-3 aligned`, `USMTF`, `API/JSON`.
- Degraded fallback: high-confidence disruption candidates only with coalition legal hold points.

### `strategic-cognitive-em-deception-exposure-v1`
- Use for attribution and response planning against blended information and electromagnetic deception campaigns.
- Primary tools: narrative telemetry fusion + rf anomaly analytics + policy-governed response workflow.
- Cross-check tools: independent source-credibility ledger and alternate campaign impact monitor.
- Protocols: `STIX/TAXII`, `NIEM`, `USMTF`, `NATO APP-11/ADatP-3 aligned`, `API/JSON`.
- Degraded fallback: attribution advisories only with no autonomous response release.

## Profile Set (2026-03-13 Expansion Wave XXVIII - Deepfake C2 Integrity, Munition-Energy Deconfliction, Undersea Cable Reroute, and Arctic UAS Resilience)

### `joint-munition-energy-coupled-targeting-deconfliction-v1`
- Use for cross-theater deconfliction of kinetic and directed-energy effects under constrained inventory.
- Primary tools: effects allocation planner + energy readiness board + munitions governance workflow.
- Cross-check tools: independent strike-effects arbiter and alternate theater inventory monitor.
- Protocols: `USMTF`, `Link 16 J-series`, `VMF`, `API/JSON`.
- Degraded fallback: highest-priority effects only with commander escalation gate.

### `contested-megacity-autonomous-evacuation-governance-v1`
- Use for contested megacity evacuation corridor governance across military and civil actors.
- Primary tools: urban mobility twin + corridor control scheduler + autonomy liability board.
- Cross-check tools: independent route hazard witness and alternate shelter throughput monitor.
- Protocols: `NIMS/ICS`, `EDXL-DE/CAP`, `OGC WMS/WFS/WMTS`, `API/JSON`.
- Degraded fallback: life-safety corridors only with reduced autonomous release rules.

### `coalition-deepfake-c2-authenticity-validation-v1`
- Use for coalition command message authenticity validation against deepfake/spoofing threats.
- Primary tools: signature verifier + media forensics engine + coalition trust adjudication board.
- Cross-check tools: independent authenticity witness and alternate order-fragment integrity queue.
- Protocols: `USMTF`, signed manifests, `STIX/TAXII`, `NATO APP-11/ADatP-3 aligned`, `API/JSON`.
- Degraded fallback: authenticated-high-confidence orders only with dual human approval.

### `expeditionary-bioreactor-fuel-ration-sustainment-v1`
- Use for expeditionary local fuel/ration sustainment under contested logistics and contamination risk.
- Primary tools: bioprocess telemetry stack + contamination analytics board + sustainment allocator.
- Cross-check tools: independent assay witness and alternate continuity monitor.
- Protocols: `USMTF`, `HL7/FHIR`, `NIMS/ICS`, `API/JSON`.
- Degraded fallback: life-support commodity classes only with elevated safety controls.

### `undersea-cable-tap-attribution-and-rapid-reroute-v1`
- Use for probable undersea cable compromise attribution and rapid command continuity reroute.
- Primary tools: subsea anomaly fusion + maritime telemetry correlator + reroute orchestrator.
- Cross-check tools: independent subsea event witness and alternate SATCOM continuity monitor.
- Protocols: `AIS/NMEA`, `STIX/TAXII`, `USMTF`, `CCSDS`, `API/JSON`.
- Degraded fallback: mission-essential flows only with fixed synchronization intervals.

### `joint-denied-space-launch-window-reallocation-v1`
- Use for military launch window reprioritization when range or conjunction limits deny planned timelines.
- Primary tools: launch schedule optimizer + conjunction monitor + readiness adjudication board.
- Cross-check tools: independent orbital safety witness and alternate launch continuity tracker.
- Protocols: `CCSDS`, `USMTF`, `NIEM`, `API/JSON`.
- Degraded fallback: highest-priority launches only with conservative safety constraints.

### `homeland-port-radiological-screening-surge-v1`
- Use for homeland radiological port screening surge coordination with continuity-of-commerce safeguards.
- Primary tools: port inspection board + radiation fusion analytics + continuity workflow.
- Cross-check tools: independent hazard adjudication queue and alternate screening throughput monitor.
- Protocols: `NIMS/ICS`, `EDXL-DE/CAP`, `AIS/NMEA`, `USMTF`, `API/JSON`.
- Degraded fallback: high-risk cargo classes only with explicit command review.

### `special-operations-low-signature-mesh-trust-v1`
- Use for low-signature SOF mesh trust assurance in disconnected and denied environments.
- Primary tools: mesh trust monitor + edge key lifecycle broker + disconnected sync manager.
- Cross-check tools: independent identity attestation witness and alternate replay-risk monitor.
- Protocols: `CoT`, `VMF`, signed attestation exchanges, `USMTF`, `API/JSON`.
- Degraded fallback: essential command flows only with strict dual-control identity checks.

### `iamd-decoy-discrimination-and-interceptor-priority-v1`
- Use for integrated air and missile defense decoy discrimination and interceptor allocation governance.
- Primary tools: decoy classifier + interceptor allocator + track confidence board.
- Cross-check tools: independent track-truth witness and alternate inventory stress monitor.
- Protocols: `Link 16 J-series`, `USMTF`, `CoT`, `API/JSON`.
- Degraded fallback: highest-value defended assets only with conservative release thresholds.

### `coalition-rare-earth-supply-shock-priority-allocation-v1`
- Use for coalition critical-component allocation under rare-earth and strategic material shocks.
- Primary tools: industrial criticality board + readiness impact analyzer + coalition distribution workflow.
- Cross-check tools: independent scarcity witness and alternate mission-risk monitor.
- Protocols: `NATO APP-11/ADatP-3 aligned`, `USMTF`, `NIEM`, `STIX/TAXII`, `API/JSON`.
- Degraded fallback: mission-essential platforms only with rolling coalition concurrence gates.

### `battlefield-neuromorphic-sensor-anomaly-triage-v1`
- Use for triage and confidence governance of neuromorphic edge sensor anomaly streams.
- Primary tools: anomaly triage workflow + model drift monitor + confidence adjudication board.
- Cross-check tools: independent false-positive witness and alternate cueing-risk monitor.
- Protocols: `CoT`, `OGC WMS/WFS/WMTS`, `STIX/TAXII`, `USMTF`, `API/JSON`.
- Degraded fallback: high-confidence cueing classes only with mandatory human verification.

### `arctic-long-range-uas-icing-link-resilience-v1`
- Use for Arctic UAS icing hazard and comm-link resilience governance for persistent ISR lanes.
- Primary tools: icing nowcast analytics + UAS fleet health monitor + SATCOM/HF resilience orchestrator.
- Cross-check tools: independent weather witness and alternate link degradation tracker.
- Protocols: `Link 16 J-series`, `USMTF`, `METAR/TAF`, HF data exchanges, `API/JSON`.
- Degraded fallback: essential ISR routes only with tighter icing/link confidence thresholds.
## Profile Set (2026-03-13 Expansion Wave XXVIII - Arctic Cable Continuity, Deepfake Command Defense, Medical Surge, Strategic Fabrication Recovery, and Space-Weather/Cyber Cascades)

### `arctic-subsea-cable-ice-keel-repair-v1`
- Use for arctic cable strike-risk forecasting and repair-window governance under maritime contest.
- Primary tools: under-ice hazard model + cable telemetry board + repair dispatch workflow.
- Cross-check tools: independent cryosphere witness and alternate continuity monitor.
- Protocols: `AIS/NMEA`, `USMTF`, `OGC`, `NIEM`, `API/JSON`.
- Degraded fallback: mission-essential cable trunks only with strict traffic classes.

### `deepfake-command-auth-assurance-v1`
- Use for command-net deepfake/spoof detection and authenticated release continuity.
- Primary tools: command-auth forensics + order-signature integrity ledger + release governance workflow.
- Cross-check tools: independent acknowledgment witness and alternate intent-divergence monitor.
- Protocols: `USMTF`, signed auth events, `STIX/TAXII`, `NIEM`, `API/JSON`.
- Degraded fallback: high-consequence command classes only with dual-control release.

### `coalition-medical-oxygen-anesthetic-surge-v1`
- Use for coalition oxygen/anesthetic surge management during casualty and logistics stress.
- Primary tools: oxygen stress board + anesthetic allocator + coalition med-reg workflow.
- Cross-check tools: independent pharmacy custody witness and alternate surgical demand monitor.
- Protocols: `HL7/FHIR`, `USMTF`, `NATO APP-11/ADatP-3 aligned`, `NIEM`, `API/JSON`.
- Degraded fallback: life-saving surgery classes only with strict usage controls.

### `rare-earth-magnet-cyber-sabotage-rollback-v1`
- Use for strategic magnet fabrication rollback and trusted output restoration after cyber sabotage.
- Primary tools: process integrity monitor + rollback orchestrator + output priority board.
- Cross-check tools: independent assay witness and alternate quality drift monitor.
- Protocols: `USMTF`, `STIX/TAXII`, `NIEM`, signed manifests, `API/JSON`.
- Degraded fallback: mission-critical component lines only with quality-release holds.

### `disconnected-biometric-roe-audit-v1`
- Use for edge biometric and ROE confidence auditing in disconnected tactical operations.
- Primary tools: identity confidence board + watchlist delta reconciler + ROE exception workflow.
- Cross-check tools: independent adjudication queue and alternate legal compliance monitor.
- Protocols: `USMTF`, `VMF`, `CoT`, `NIEM`, `API/JSON`.
- Degraded fallback: restricted identity action set with commander approval for exceptions.

### `rail-bridge-drone-swarm-defense-repair-v1`
- Use for defending and repairing military-critical rail bridge chokepoints under drone swarm attacks.
- Primary tools: bridge telemetry board + counter-uas scheduler + mobility reroute optimizer.
- Cross-check tools: independent structural integrity witness and alternate force-flow monitor.
- Protocols: `USMTF`, `CoT`, `NIMS/ICS`, `OGC`, `API/JSON`.
- Degraded fallback: mission-essential bridge nodes only with fixed convoy windows.

### `additive-propellant-thermal-aging-assurance-v1`
- Use for thermal-aging confidence and safe release governance of additive-manufactured propellant lots.
- Primary tools: thermal-aging analytics + lot release workflow + field safety stress model.
- Cross-check tools: independent energetic assay witness and alternate munition reliability monitor.
- Protocols: `USMTF`, `NIEM`, signed assay manifests, `STIX/TAXII`, `API/JSON`.
- Degraded fallback: highest-confidence lots only with constrained employment envelopes.

### `satnav-civil-timing-blackout-response-v1`
- Use for military-civil timing continuity when SATNAV timing services are degraded or denied.
- Primary tools: timing integrity monitor + holdover confidence board + restoration coordinator.
- Cross-check tools: independent oscillator witness and alternate timing anomaly monitor.
- Protocols: `USMTF`, `NIMS/ICS`, `NIEM`, `STIX/TAXII`, `API/JSON`.
- Degraded fallback: command and life-safety timing domains only with strict drift thresholds.

### `coalition-rotary-wing-dustoff-weather-routing-v1`
- Use for contested-weather coalition DUSTOFF route governance and casualty timing confidence.
- Primary tools: weather-threat corridor engine + medevac route optimizer + coalition casualty workflow.
- Cross-check tools: independent weather confidence witness and alternate casualty priority monitor.
- Protocols: `USMTF`, `AIXM/FIXM`, `NATO APP-11/ADatP-3 aligned`, `CoT`, `API/JSON`.
- Degraded fallback: highest-acuity casualty corridors only with conservative weather minima.

### `space-weather-cyber-cascade-risk-v1`
- Use for cascading mission-risk adjudication when space-weather events drive cyber/network disruption.
- Primary tools: geomagnetic risk board + cascade correlation engine + service continuity planner.
- Cross-check tools: independent space-weather witness and alternate network resilience monitor.
- Protocols: `CCSDS`, `USMTF`, `STIX/TAXII`, `NIEM`, `API/JSON`.
- Degraded fallback: mission-critical services only with explicit outage risk labels.

### `strategic-military-cloud-break-glass-continuity-v1`
- Use for sovereignty-preserving break-glass continuity across strategic military cloud workloads.
- Primary tools: sovereignty policy board + workload evacuation orchestrator + custody continuity ledger.
- Cross-check tools: independent legal caveat witness and alternate provider resilience monitor.
- Protocols: `USMTF`, `NIEM`, signed sovereignty events, `STIX/TAXII`, `API/JSON`.
- Degraded fallback: sovereign mission-essential workload classes only with strict data egress controls.

### `undersea-autonomous-glider-acoustic-resilience-v1`
- Use for acoustic deception resilience in autonomous undersea glider cueing and mission release.
- Primary tools: acoustic anomaly fusion + glider trust monitor + cue validation workflow.
- Cross-check tools: independent acoustic corroboration witness and alternate cue reliability monitor.
- Protocols: `AIS/NMEA`, `USMTF`, `CoT`, `OGC`, `API/JSON`.
- Degraded fallback: high-confidence cue classes only with conservative maneuver release.

## Profile Set (2026-03-13 Expansion Wave XXX - Arctic Logistics, Fiber Continuity, Islanded Microgrids, MCM Autonomy, EMCON, Forensics, Detainee Transfer, Resource Denial, PSAP Continuity, Mobility Restoration, and Denied-Space Custody)

### `joint-arctic-over-ice-logistics-corridor-assurance-v1`
- Use for sustained over-ice logistics when Arctic weather and adversary disruption threaten throughput.
- Primary tools: ice-route risk engine + convoy viability board + sustainment branch planner.
- Cross-check tools: independent cryosphere witness and alternate convoy telemetry board.
- Protocols: `USMTF`, `AIS/NMEA`, `OGC WMS/WFS/WMTS`, `NATO APP-11/ADatP-3 aligned`, `API/JSON`.
- Degraded fallback: mission-essential convoy classes only with conservative route confidence thresholds.

### `theater-underground-fiber-cut-comms-reroute-v1`
- Use for command continuity when buried fiber and terrestrial backhaul are degraded or sabotaged.
- Primary tools: fiber fault fusion board + reroute orchestrator + c2 path integrity monitor.
- Cross-check tools: independent transport witness and alternate satcom continuity monitor.
- Protocols: `USMTF`, `STIX/TAXII`, `NIEM`, `CoT`, `API/JSON`.
- Degraded fallback: highest-priority command traffic only with fixed acknowledgment cycles.

### `joint-microgrid-islanded-base-load-shedding-v1`
- Use for islanded military base-cluster load shedding and continuity governance.
- Primary tools: base microgrid telemetry + critical-load arbitrator + fuel endurance scheduler.
- Cross-check tools: independent power-quality witness and alternate contingency load board.
- Protocols: `USMTF`, `NIMS/ICS`, `NIEM`, `EDXL-DE/CAP`, `API/JSON`.
- Degraded fallback: life-safety and c2 loads only with strict command check-ins.

### `coalition-autonomous-maritime-mcm-deconfliction-v1`
- Use for coalition autonomous mine-countermeasure deconfliction and lane safety release.
- Primary tools: autonomous MCM task board + mine-risk fusion engine + chokepoint lane scheduler.
- Cross-check tools: independent sonar confidence witness and alternate maritime safety board.
- Protocols: `AIS/NMEA`, `Link 16 J-series`, `USMTF`, `NATO APP-11/ADatP-3 aligned`, `API/JSON`.
- Degraded fallback: highest-confidence lane clearances only with dual coalition release.

### `tactical-electromagnetic-signature-discipline-emcon-v1`
- Use for tactical emissions discipline and EMCON transition control in contested sensing environments.
- Primary tools: emission control planner + signature exposure monitor + waveform governance board.
- Cross-check tools: independent RF witness and alternate signature drift tracker.
- Protocols: `USMTF`, `Link 16 J-series`, `VMF`, `CoT`, `API/JSON`.
- Degraded fallback: mission-essential windows only with tighter emission constraints.

### `joint-rapid-camouflage-concealment-deception-allocation-v1`
- Use for rapid CCD asset allocation to preserve survivability of critical formations and nodes.
- Primary tools: decoy planner + concealment allocation board + survivability branch scheduler.
- Cross-check tools: independent observation witness and alternate deception-effect monitor.
- Protocols: `USMTF`, `CoT`, `OGC WMS/WFS/WMTS`, `NIEM`, `API/JSON`.
- Degraded fallback: highest-value assets only with periodic reconnaissance validation.

### `theater-battlefield-forensics-war-crimes-preservation-v1`
- Use for battlefield forensics preservation, custody integrity, and law-of-war evidence handoff.
- Primary tools: forensic custody ledger + geotagged evidence workflow + legal transfer tracker.
- Cross-check tools: independent evidence integrity witness and alternate legal sufficiency board.
- Protocols: `NIEM`, signed evidence manifests, `USMTF`, `NATO APP-11/ADatP-3 aligned`, `API/JSON`.
- Degraded fallback: high-severity incidents only with mandatory legal review gates.

### `joint-contested-prisoner-transfer-detainee-accountability-v1`
- Use for contested prisoner transfer with identity confidence and custody continuity controls.
- Primary tools: transfer scheduler + biometric confidence board + compliance exception workflow.
- Cross-check tools: independent transfer witness and alternate custody audit board.
- Protocols: `NIEM`, `USMTF`, `VMF`, `NATO APP-11/ADatP-3 aligned`, `API/JSON`.
- Degraded fallback: urgent transfer classes only with explicit command approval.

### `strategic-food-water-denial-distribution-v1`
- Use for strategic food-water denial risk mitigation and priority distribution governance.
- Primary tools: denial trigger predictor + distribution optimizer + instability monitor.
- Cross-check tools: independent humanitarian risk witness and alternate supply continuity board.
- Protocols: `USMTF`, `NIMS/ICS`, `NIEM`, `STIX/TAXII`, `API/JSON`.
- Degraded fallback: life-safety and mission-critical populations only with conservative assumptions.

### `homeland-defense-critical-911-psap-support-v1`
- Use for military support to PSAP/911 continuity under homeland disruption.
- Primary tools: PSAP continuity board + incident surge allocator + telecom restoration workflow.
- Cross-check tools: independent emergency-services witness and alternate call-routing monitor.
- Protocols: `NIMS/ICS`, `EDXL-DE/CAP`, `NIEM`, `USMTF`, `API/JSON`.
- Degraded fallback: life-safety call classes only with fixed interagency sync windows.

### `joint-rail-bridge-sabotage-restoration-force-flow-v1`
- Use for rail-bridge sabotage restoration and force-flow reroute under contested mobility conditions.
- Primary tools: bridge integrity monitor + repair sequencing board + mobility reroute planner.
- Cross-check tools: independent structural witness and alternate throughput confidence board.
- Protocols: `USMTF`, `NIMS/ICS`, `OGC WMS/WFS/WMTS`, `CoT`, `API/JSON`.
- Degraded fallback: strategic load classes only with conservative route release criteria.

### `coalition-denied-space-maneuver-custody-arbitration-v1`
- Use for coalition denied-space custody arbitration with conjunction-safe maneuver release controls.
- Primary tools: custody conflict board + conjunction risk monitor + coalition release workflow.
- Cross-check tools: independent orbital safety witness and alternate coalition caveat monitor.
- Protocols: `CCSDS`, `USMTF`, `NATO APP-11/ADatP-3 aligned`, `NIEM`, `API/JSON`.
- Degraded fallback: mission-critical maneuvers only with dual coalition authority signatures.

## Profile Set (2026-03-13 Expansion Wave XXXI - Internet Blackout Bridging, UAS Energy Recovery, Pharma Assurance, LEO SATCOM Denial Recovery, Homeland Hazmat Support, AI Targeting Audit, and Mission Compute Continuity)

### `joint-civil-internet-blackout-military-mesh-bridging-v1`
- Use for civil-military command continuity when internet backbone and exchange points fail.
- Primary tools: blackout impact correlator + mesh bridge orchestrator + authority continuity board.
- Cross-check tools: independent telecom outage witness and alternate emergency-routing integrity monitor.
- Protocols: `USMTF`, `NIMS/ICS`, `NIEM`, `CoT`, `API/JSON`.
- Degraded fallback: life-safety and command traffic classes only with fixed acknowledgment windows.

### `theater-uas-battery-charging-network-denial-recovery-v1`
- Use for preserving UAS sortie generation during battery logistics and charging-node disruption.
- Primary tools: battery telemetry board + charging reroute optimizer + sortie endurance planner.
- Cross-check tools: independent energy logistics witness and alternate UAS readiness monitor.
- Protocols: `USMTF`, `VMF`, `CoT`, `NATO APP-11/ADatP-3 aligned`, `API/JSON`.
- Degraded fallback: mission-essential UAS routes only with conservative endurance assumptions.

### `strategic-pharmaceutical-supply-chain-contamination-countermeasure-v1`
- Use for strategic pharmaceutical contamination detection, quarantine governance, and release confidence.
- Primary tools: pharma provenance ledger + contamination analytics board + quarantine release workflow.
- Cross-check tools: independent assay witness and alternate clinical demand continuity monitor.
- Protocols: `HL7/FHIR`, `USMTF`, `NIEM`, `STIX/TAXII`, `API/JSON`.
- Degraded fallback: life-saving and mission-critical formulary classes only with explicit medical command concurrence.

### `joint-low-earth-orbit-satcom-traffic-priority-denial-recovery-v1`
- Use for traffic arbitration and denied-link recovery across contested LEO SATCOM constellations.
- Primary tools: satcom priority arbiter + denial correlation board + mission reroute scheduler.
- Cross-check tools: independent link-status witness and alternate timing continuity monitor.
- Protocols: `CCSDS`, `USMTF`, `Link 16 J-series`, `NIEM`, `API/JSON`.
- Degraded fallback: command and time-sensitive traffic only with fixed sync intervals.

### `homeland-chemical-rail-derailment-support-evacuation-v1`
- Use for military support to chemical derailment evacuation and decon corridor synchronization.
- Primary tools: plume risk board + evacuation corridor scheduler + decon task orchestrator.
- Cross-check tools: independent hazmat witness and alternate civil mobility continuity monitor.
- Protocols: `NIMS/ICS`, `EDXL-DE/CAP`, `NIEM`, `USMTF`, `API/JSON`.
- Degraded fallback: life-safety evacuation classes only with staged decon operations.

### `coalition-ai-targeting-policy-explainability-audit-v1`
- Use for coalition AI targeting explainability review and policy-caveat audit before release.
- Primary tools: explainability board + policy exception adjudicator + coalition audit ledger.
- Cross-check tools: independent legal sufficiency witness and alternate data provenance monitor.
- Protocols: `USMTF`, `Link 16 J-series`, `NATO APP-11/ADatP-3 aligned`, `STIX/TAXII`, `API/JSON`.
- Degraded fallback: high-confidence low-collateral targets only with dual coalition approval.

### `expeditionary-runway-gps-spoofing-approach-continuity-v1`
- Use for expeditionary runway approach continuity under GNSS spoofing and nav-aid degradation.
- Primary tools: approach integrity monitor + spoofing fusion board + runway branch scheduler.
- Cross-check tools: independent nav integrity witness and alternate airspace safety monitor.
- Protocols: `AIXM/FIXM`, `USMTF`, `Link 16 J-series`, `CoT`, `API/JSON`.
- Degraded fallback: essential flights only with conservative approach minima.

### `joint-fuel-farm-foam-fire-cascade-containment-v1`
- Use for containing fuel-farm and foam-system fire cascades while preserving mission fuel continuity.
- Primary tools: fire spread predictor + suppression optimizer + fuel continuity board.
- Cross-check tools: independent safety witness and alternate fuel throughput assurance monitor.
- Protocols: `NIMS/ICS`, `USMTF`, `NIEM`, `CoT`, `API/JSON`.
- Degraded fallback: mission-essential fuel nodes only with strict safety controls.

### `theater-prison-break-hvd-recapture-coordination-v1`
- Use for contested recapture coordination when high-value detainees escape or transfer chains fail.
- Primary tools: recapture priority board + movement corridor threat fusion + detention integrity workflow.
- Cross-check tools: independent custody witness and alternate legal compliance monitor.
- Protocols: `NIEM`, `USMTF`, `VMF`, `CoT`, `API/JSON`.
- Degraded fallback: highest-risk detainees only with explicit command authorization.

### `contested-data-center-water-cooling-failure-load-shedding-v1`
- Use for mission compute preservation during cooling outages and contested facility disruptions.
- Primary tools: thermal dependency graph + mission load arbiter + compute failover orchestrator.
- Cross-check tools: independent facility reliability witness and alternate service confidence monitor.
- Protocols: `USMTF`, `STIX/TAXII`, `NIEM`, `NIMS/ICS`, `API/JSON`.
- Degraded fallback: mission-critical workloads only with staged failover windows.

### `strategic-reserve-component-callup-transport-synchronization-v1`
- Use for strategic reserve callup timing synchronized to mobilization and transport throughput.
- Primary tools: callup throughput dashboard + mobilization scheduler + transport deconflictor.
- Cross-check tools: independent personnel readiness witness and alternate mobility corridor monitor.
- Protocols: `USMTF`, `NIEM`, `NIMS/ICS`, `NATO APP-11/ADatP-3 aligned`, `API/JSON`.
- Degraded fallback: mission-essential reserve specialties only with prioritized transport lanes.

### `coalition-maritime-fiber-landing-station-kinetic-cyber-defense-v1`
- Use for coalition fiber landing-station defense against kinetic strikes and cyber compromise.
- Primary tools: landing station defense board + cable resilience analyzer + coalition response orchestrator.
- Cross-check tools: independent cable telemetry witness and alternate cyber attribution monitor.
- Protocols: `AIS/NMEA`, `USMTF`, `STIX/TAXII`, `NATO APP-11/ADatP-3 aligned`, `API/JSON`.
- Degraded fallback: mission-critical cable routes only with fixed security patrol and release windows.

## Profile Set (2026-03-13 Expansion Wave XXXII - Arctic Airdrop Certification, Hybrid Backbone Survivability, Microelectronics Continuity, Medical Surge Synchronization, and Swarm Defense)

### `joint-arctic-gps-denied-heavy-airlift-dropzone-certification-v1`
- Use for denied-PNT heavy-airlift drop-zone confidence adjudication in Arctic and severe-weather conditions.
- Primary tools: drop-zone certification engine + denied-PNT approach planner + heavy-airlift release board.
- Cross-check tools: independent navigation confidence witness + alternate weather/ice integrity monitor.
- Protocols: `USMTF`, `AIXM/FIXM`, `CoT`, `NATO APP-11/ADatP-3 aligned`, `API/JSON`.
- Degraded fallback: mission-essential drops only with commander-validated release minima.

### `theater-hardened-fiber-satcom-hybrid-command-backbone-v1`
- Use for command-backbone continuity when theater fiber and SATCOM paths are contested simultaneously.
- Primary tools: hybrid path orchestrator + command-priority arbiter + transport survivability board.
- Cross-check tools: independent telecom outage witness + alternate command-path integrity monitor.
- Protocols: `USMTF`, `STIX/TAXII`, `NIEM`, `CoT`, `API/JSON`.
- Degraded fallback: command/life-safety traffic only with fixed acknowledgment windows.

### `coalition-maritime-autonomous-convoy-fuel-denial-mitigation-v1`
- Use for coalition autonomous convoy fuel-denial mitigation in contested maritime corridors.
- Primary tools: convoy fuel-risk board + autonomous lane scheduler + coalition release workflow.
- Cross-check tools: independent vessel endurance witness + alternate coalition caveat monitor.
- Protocols: `AIS/NMEA`, `USMTF`, `NATO APP-11/ADatP-3 aligned`, `Link 16 J-series`, `API/JSON`.
- Degraded fallback: mission-critical convoy classes only with conservative endurance assumptions.

### `homeland-rail-grid-cyber-physical-evacuation-priority-v1`
- Use for synchronized rail-grid restoration and evacuation corridor governance during homeland emergencies.
- Primary tools: rail-grid dependency graph + evacuation priority arbiter + restoration sequencing board.
- Cross-check tools: independent utility witness + alternate transport continuity monitor.
- Protocols: `NIMS/ICS`, `EDXL-DE/CAP`, `USMTF`, `NIEM`, `API/JSON`.
- Degraded fallback: life-safety corridors only with staged restoration windows.

### `strategic-microelectronics-fab-water-power-continuity-v1`
- Use for preserving strategic microelectronics production through water/power disruption and sabotage events.
- Primary tools: fab utility dependency monitor + process continuity planner + strategic output board.
- Cross-check tools: independent quality-assurance witness + alternate utility integrity monitor.
- Protocols: `USMTF`, `STIX/TAXII`, `NIEM`, signed quality manifests, `API/JSON`.
- Degraded fallback: mission-essential component lines only with quality-release holds.

### `expeditionary-forward-blood-cold-chain-drone-relay-v1`
- Use for expeditionary blood cold-chain continuity and drone relay governance under contested logistics.
- Primary tools: blood cold-chain telemetry + drone relay scheduler + med-reg synchronization workflow.
- Cross-check tools: independent cold-chain witness + alternate casualty-demand monitor.
- Protocols: `HL7/FHIR`, `USMTF`, `VMF`, `CoT`, `API/JSON`.
- Degraded fallback: highest-acuity blood classes only with constrained relay windows.

### `joint-undersea-chokepoint-acoustic-decoy-adjudication-v1`
- Use for undersea decoy-vs-threat adjudication to preserve cue trust in maritime chokepoints.
- Primary tools: acoustic anomaly fusion board + decoy discrimination engine + cue governance workflow.
- Cross-check tools: independent sonar witness + alternate contact-confidence monitor.
- Protocols: `AIS/NMEA`, `USMTF`, `OGC WMS/WFS/WMTS`, `Link 16 J-series`, `API/JSON`.
- Degraded fallback: high-confidence cue classes only with conservative release controls.

### `coalition-border-biometric-watchlist-disruption-recovery-v1`
- Use for coalition biometric watchlist recovery under disruption with legal and identity-confidence safeguards.
- Primary tools: watchlist restoration board + biometric confidence adjudicator + coalition legal workflow.
- Cross-check tools: independent identity-evidence witness + alternate compliance monitor.
- Protocols: `NIEM`, `USMTF`, `NATO APP-11/ADatP-3 aligned`, `STIX/TAXII`, `API/JSON`.
- Degraded fallback: high-confidence watchlist classes only with dual coalition approval.

### `theater-civilian-hospital-overflow-military-triage-synchronization-v1`
- Use for military triage and patient-movement synchronization during civilian hospital overflow events.
- Primary tools: hospital surge telemetry + triage routing engine + joint med-reg workflow.
- Cross-check tools: independent bed-status witness + alternate casualty-flow monitor.
- Protocols: `HL7/FHIR`, `USMTF`, `NIMS/ICS`, `EDXL-DE/CAP`, `API/JSON`.
- Degraded fallback: life-saving triage classes only with conservative movement assumptions.

### `joint-spaceport-propellant-safety-launch-window-restoration-v1`
- Use for launch-window restoration with propellant safety and custody assurance controls.
- Primary tools: propellant safety telemetry + launch recovery scheduler + custody assurance workflow.
- Cross-check tools: independent hazard witness + alternate launch-readiness monitor.
- Protocols: `CCSDS`, `USMTF`, `NIEM`, signed custody manifests, `API/JSON`.
- Degraded fallback: strategic mission-essential launches only with expanded safety margins.

### `tactical-loitering-munition-swarm-priority-defense-v1`
- Use for defended-asset prioritization and interceptor release governance against loitering-munition swarms.
- Primary tools: swarm threat fusion board + interceptor allocation optimizer + tactical defense workflow.
- Cross-check tools: independent track-confidence witness + alternate asset-survivability monitor.
- Protocols: `Link 16 J-series`, `USMTF`, `VMF`, `CoT`, `API/JSON`.
- Degraded fallback: critical defended nodes only with bounded engagement windows.

### `strategic-food-port-hoarding-distribution-stability-v1`
- Use for anti-hoarding stabilization and strategic food-port distribution continuity.
- Primary tools: port throughput hoarding detector + distribution optimizer + stability governance board.
- Cross-check tools: independent demand witness + alternate supply continuity monitor.
- Protocols: `USMTF`, `NIMS/ICS`, `NIEM`, `STIX/TAXII`, `API/JSON`.
- Degraded fallback: life-safety and mission-critical food classes only with staged release windows.

## Profile Set (2026-03-13 Expansion Wave XXXIII - Undersea Repeater Restoration, Cislunar Rescue, Homeland Blackstart Synchronization, Coalition Legal Release, and Hypersonic Civil Continuity)

### `joint-undersea-cable-repeater-salvage-rapid-restoration-v1`
- Use for: undersea repeater salvage prioritization and rapid command-backbone restoration under contested maritime conditions.
- Primary tools: repeater damage classifier + salvage asset scheduler + restoration governance board.
- Cross-check tools: independent hydrographic witness + alternate cable telemetry integrity monitor.
- Protocols: `AIS/NMEA`, `USMTF`, `OGC WMS/WFS/WMTS`, `STIX/TAXII`, `API/JSON`.
- Degraded fallback: mission-critical backbone segments only with fixed acknowledgment windows.

### `space-domain-cislunar-conjunction-rescue-asset-priority-v1`
- Use for: contested cislunar conjunction rescue, maneuver custody arbitration, and strategic asset continuity decisions.
- Primary tools: conjunction risk fusion board + rescue-window scheduler + orbital custody assurance workflow.
- Cross-check tools: independent ephemeris witness + alternate coalition caveat monitor.
- Protocols: `CCSDS`, `USMTF`, `NATO APP-11/ADatP-3 aligned`, `NIEM`, `API/JSON`.
- Degraded fallback: mission-essential rescue classes only with dual authority release.

### `homeland-grid-blackstart-fuel-water-rail-coordination-v1`
- Use for: synchronized homeland blackstart operations tied to fuel, water, and rail throughput restoration.
- Primary tools: blackstart dependency graph + infrastructure priority arbiter + DSCA sequencing board.
- Cross-check tools: independent utility witness + alternate transportation continuity monitor.
- Protocols: `NIMS/ICS`, `EDXL-DE/CAP`, `NIEM`, `USMTF`, `API/JSON`.
- Degraded fallback: life-safety and mission-critical corridors only with staged restoration controls.

### `coalition-legal-mission-data-release-evidence-assurance-v1`
- Use for: coalition mission-data releasability decisions requiring legal caveat checks and evidence-chain integrity.
- Primary tools: releasability adjudication board + evidence sufficiency ledger + legal exception workflow.
- Cross-check tools: independent legal sufficiency witness + alternate policy caveat monitor.
- Protocols: `NIEM`, `USMTF`, `NATO APP-11/ADatP-3 aligned`, signed evidence manifests, `API/JSON`.
- Degraded fallback: high-confidence low-sensitivity data classes only with dual legal approval.

### `joint-urban-tunnel-spectrum-navigation-hostage-recovery-v1`
- Use for: hostage-recovery planning in dense urban tunnel terrain under denied-navigation and contested-spectrum pressure.
- Primary tools: subterranean spectrum mapper + route confidence engine + hostage recovery synchronization board.
- Cross-check tools: independent ISR witness + alternate blue-force position confidence monitor.
- Protocols: `USMTF`, `VMF`, `CoT`, `OGC WMS/WFS/WMTS`, `API/JSON`.
- Degraded fallback: life-threatening hostage scenarios only with conservative movement windows.

### `theater-forward-additive-munitions-quality-release-v1`
- Use for: additive munitions lot-quality governance and release authority synchronization in contested sustainment environments.
- Primary tools: additive lot telemetry board + ballistic confidence adjudicator + release authority workflow.
- Cross-check tools: independent metrology witness + alternate contamination monitor.
- Protocols: `USMTF`, `STIX/TAXII`, `NIEM`, signed quality manifests, `API/JSON`.
- Degraded fallback: mission-essential lot classes only with tightened release constraints.

### `coalition-arctic-icebreaker-convoy-port-denial-recovery-v1`
- Use for: coalition Arctic convoy routing and denied-port recovery with caveat-aware sustainment controls.
- Primary tools: icebreaker corridor planner + denied-port recovery scheduler + coalition sustainment governance board.
- Cross-check tools: independent ice-condition witness + alternate maritime caveat monitor.
- Protocols: `AIS/NMEA`, `USMTF`, `NATO APP-11/ADatP-3 aligned`, `NIMS/ICS`, `API/JSON`.
- Degraded fallback: mission-critical convoy classes only with conservative ice and threat assumptions.

### `strategic-ai-enabled-nuclear-incident-warning-integrity-v1`
- Use for: strategic nuclear-incident warning authenticity assurance against AI-enabled spoofing and escalation manipulation.
- Primary tools: warning-authenticity analyzer + escalation communication verifier + public-warning release governance board.
- Cross-check tools: independent cryptographic trust witness + alternate civil-alert integrity monitor.
- Protocols: `USMTF`, `EDXL-DE/CAP`, `NIEM`, `STIX/TAXII`, `API/JSON`.
- Degraded fallback: emergency warning classes only with strategic command concurrence.

### `expeditionary-river-crossing-autonomy-ew-deconfliction-v1`
- Use for: expeditionary autonomous river-crossing operations synchronized with EW/cyber deconfliction and maneuver timing.
- Primary tools: autonomy crossing coordinator + EW fratricide prevention board + corridor release workflow.
- Cross-check tools: independent hydrology witness + alternate emissions-discipline monitor.
- Protocols: `USMTF`, `VMF`, `CoT`, `Link 16 J-series`, `API/JSON`.
- Degraded fallback: mission-essential crossing packages only with constrained EMCON windows.

### `joint-hypersonic-defense-sensor-fusion-civil-continuity-v1`
- Use for: military hypersonic cue fusion linked to civil warning and shelter continuity decisions.
- Primary tools: hypersonic cue fusion board + intercept-priority arbiter + civil continuity synchronization workflow.
- Cross-check tools: independent track-quality witness + alternate civil-alert readiness monitor.
- Protocols: `Link 16 J-series`, `USMTF`, `EDXL-DE/CAP`, `NIEM`, `API/JSON`.
- Degraded fallback: highest-confidence cue classes only with pre-authorized warning timelines.

### `homeland-port-ransomware-manifest-recovery-customs-triage-v1`
- Use for: restoring homeland port mission flow after ransomware compromise of manifest and customs systems.
- Primary tools: manifest recovery engine + customs triage arbiter + port cyber-recovery workflow.
- Cross-check tools: independent cargo custody witness + alternate logistics continuity monitor.
- Protocols: `NIMS/ICS`, `NIEM`, `STIX/TAXII`, `USMTF`, `API/JSON`.
- Degraded fallback: mission-essential cargo classes only with strict custody verification.

### `coalition-prisoner-exchange-biometric-legal-chain-sync-v1`
- Use for: coalition prisoner exchange synchronization with biometric confidence and legal chain-of-custody assurance.
- Primary tools: prisoner exchange scheduler + biometric confidence adjudicator + legal chain workflow.
- Cross-check tools: independent detainee identity witness + alternate legal compliance monitor.
- Protocols: `NIEM`, `USMTF`, `VMF`, `NATO APP-11/ADatP-3 aligned`, `API/JSON`.
- Degraded fallback: humanitarian-priority exchanges only with explicit coalition legal sign-off.

## Profile Set (2026-03-13 Expansion Wave XXXIV - Deep Undersea Rights Adjudication, Cislunar Sustainment Governance, Homeland Mutual Aid Continuity, and High-Consequence Recovery Control)

### `joint-deep-undersea-repair-rights-adjudication-restoration-v1`
- Use for: adjudicating deep-undersea repair rights and restoration sequencing for command-backbone continuity.
- Primary tools: repair-rights adjudicator + salvage legal workflow + restoration branch scheduler.
- Cross-check tools: independent treaty/commercial-rights witness + alternate hydrographic integrity monitor.
- Protocols: `AIS/NMEA`, `USMTF`, `NIEM`, `NATO APP-11/ADatP-3 aligned`, `API/JSON`.
- Degraded fallback: mission-critical segments only with dual legal-command approval.

### `space-domain-cislunar-sustainment-legal-governance-cargo-priority-v1`
- Use for: cislunar sustainment cargo-priority arbitration with legal caveat and custody governance.
- Primary tools: cargo-priority board + orbital legal adjudicator + maneuver custody workflow.
- Cross-check tools: independent ephemeris witness + alternate coalition caveat monitor.
- Protocols: `CCSDS`, `USMTF`, `NIEM`, `NATO APP-11/ADatP-3 aligned`, `API/JSON`.
- Degraded fallback: mission-essential cargo classes only with staged authority release.

### `homeland-critical-infrastructure-water-power-comms-mutual-aid-continuity-v1`
- Use for: cross-state mutual-aid synchronization restoring water, power, and communications continuity.
- Primary tools: infrastructure dependency fusion board + mutual-aid allocator + restoration orchestrator.
- Cross-check tools: independent utility-status witness + alternate emergency comms integrity monitor.
- Protocols: `NIMS/ICS`, `EDXL-DE/CAP`, `NIEM`, `USMTF`, `API/JSON`.
- Degraded fallback: life-safety and mission-critical corridors only with staged restoration controls.

### `coalition-autonomous-humanitarian-airlift-airspace-liability-v1`
- Use for: coalition autonomous humanitarian airlift corridor governance and airspace liability control.
- Primary tools: corridor scheduler + liability adjudication board + humanitarian throughput optimizer.
- Cross-check tools: independent airspace safety witness + alternate legal caveat monitor.
- Protocols: `AIXM/FIXM`, `USMTF`, `NATO APP-11/ADatP-3 aligned`, `NIEM`, `API/JSON`.
- Degraded fallback: highest-priority corridors only with explicit coalition approval.

### `theater-forward-microreactor-fuel-security-blackstart-v1`
- Use for: theater microreactor fuel security and blackstart-driven energy restoration.
- Primary tools: fuel-custody monitor + sabotage anomaly detector + blackstart sequencing board.
- Cross-check tools: independent reactor safety witness + alternate load-priority integrity monitor.
- Protocols: `USMTF`, `NIMS/ICS`, `STIX/TAXII`, `NIEM`, `API/JSON`.
- Degraded fallback: mission-critical loads only with conservative reactor release margins.

### `joint-quantum-pnt-fallback-submarine-strike-deconfliction-v1`
- Use for: quantum PNT fallback and submarine strike deconfliction in denied navigation conditions.
- Primary tools: quantum timing confidence board + submarine corridor deconflictor + fires release workflow.
- Cross-check tools: independent nav-integrity witness + alternate undersea track-confidence monitor.
- Protocols: `USMTF`, `Link 16 J-series`, `VMF`, `CoT`, `API/JSON`.
- Degraded fallback: high-confidence strike packages only with dual command release.

### `expeditionary-arctic-permafrost-fuel-pipeline-breach-recovery-v1`
- Use for: Arctic pipeline breach containment and permafrost-safe expeditionary sustainment recovery.
- Primary tools: breach detector + permafrost impact board + expeditionary fuel reroute scheduler.
- Cross-check tools: independent environmental integrity witness + alternate convoy sustainment monitor.
- Protocols: `USMTF`, `NIMS/ICS`, `OGC WMS/WFS/WMTS`, `NIEM`, `API/JSON`.
- Degraded fallback: mission-essential fuel routes only with strict environmental safeguards.

### `joint-mass-casualty-biosurveillance-isolation-evacuation-v1`
- Use for: biosurveillance-led isolation corridors and evacuation synchronization during mass-casualty events.
- Primary tools: biosurveillance fusion board + isolation corridor planner + evacuation workflow.
- Cross-check tools: independent clinical surveillance witness + alternate casualty-flow integrity monitor.
- Protocols: `HL7/FHIR`, `USMTF`, `NIMS/ICS`, `EDXL-DE/CAP`, `API/JSON`.
- Degraded fallback: life-threatening cohorts only with conservative movement controls.

### `coalition-legal-autonomous-weapons-incident-investigation-v1`
- Use for: coalition legal forensics and evidence custody after autonomous-weapon incidents.
- Primary tools: legal triage board + autonomous telemetry forensic engine + custody workflow.
- Cross-check tools: independent legal sufficiency witness + alternate digital evidence integrity monitor.
- Protocols: `NIEM`, `USMTF`, `STIX/TAXII`, `NATO APP-11/ADatP-3 aligned`, `API/JSON`.
- Degraded fallback: high-confidence incidents only with staged coalition legal release.

### `tactical-drone-swarm-emp-hardening-mission-recovery-v1`
- Use for: EMP hardening assurance and tactical mission recovery after drone-swarm electromagnetic attacks.
- Primary tools: EMP vulnerability assessor + impact recovery orchestrator + tactical comms reconstitution planner.
- Cross-check tools: independent electronic survivability witness + alternate mission-thread continuity monitor.
- Protocols: `Link 16 J-series`, `USMTF`, `CoT`, `STIX/TAXII`, `API/JSON`.
- Degraded fallback: mission-critical threads only with constrained emissions windows.

### `strategic-seabed-critical-mineral-supply-denial-mitigation-v1`
- Use for: strategic mitigation of seabed critical-mineral supply denial affecting readiness and industrial output.
- Primary tools: seabed disruption board + mineral allocation adjudicator + industrial continuity workflow.
- Cross-check tools: independent maritime supply witness + alternate demand-stress monitor.
- Protocols: `USMTF`, `NIEM`, `STIX/TAXII`, `AIS/NMEA`, `API/JSON`.
- Degraded fallback: strategic deterrence and mission-essential production lines only.

### `joint-civil-nuclear-plant-grid-islanding-population-protection-v1`
- Use for: civil nuclear grid-islanding, emergency cooling continuity, and population-protection synchronization.
- Primary tools: islanding decision board + emergency cooling monitor + warning governance engine.
- Cross-check tools: independent reactor safety witness + alternate civil-alert readiness monitor.
- Protocols: `NIMS/ICS`, `EDXL-DE/CAP`, `USMTF`, `NIEM`, `API/JSON`.
- Degraded fallback: reactor-cooling and life-safety actions only with dual authority confirmation.
