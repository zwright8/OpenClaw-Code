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

## Profile Set (2026-03-13 Expansion Wave XXXV - Strategic Attribution, Urban Continuity, Coalition Critical Infrastructure, and Civil Protection Integrity)

### `joint-strategic-hypersonic-launch-attribution-escalation-control-v1`
- Use for: rapid launch attribution and escalation-safe branch control under strategic hypersonic pressure.
- Primary tools: launch attribution fusion board + consequence modeler + escalation branch governance engine.
- Cross-check tools: independent warning-authenticity witness + alternate strategic continuity risk monitor.
- Protocols: `USMTF`, `Link 16 J-series`, `STIX/TAXII`, `NIEM`, `API/JSON`.
- Degraded fallback: high-confidence launch classes only with dual-command release.

### `theater-autonomous-rail-yard-hazmat-force-flow-recovery-v1`
- Use for: autonomous rail-yard incident containment and force-flow restoration after hazmat collisions.
- Primary tools: rail-yard digital twin + hazmat containment planner + force-flow scheduler.
- Cross-check tools: independent rail-safety witness + alternate logistics continuity monitor.
- Protocols: `NIMS/ICS`, `EDXL-DE/CAP`, `USMTF`, `NIEM`, `API/JSON`.
- Degraded fallback: mission-essential rail corridors only with conservative hazard constraints.

### `coalition-cross-border-undersea-power-cable-sabotage-response-v1`
- Use for: coalition cross-border response to undersea power-cable sabotage with legal and restoration synchronization.
- Primary tools: cable telemetry fusion board + legal authority ledger + grid restoration dependency engine.
- Cross-check tools: independent utility witness + alternate treaty-caveat monitor.
- Protocols: `AIS/NMEA`, `USMTF`, `NIMS/ICS`, `NATO APP-11/ADatP-3 aligned`, `API/JSON`.
- Degraded fallback: critical military-civil loads only with staged coalition approvals.

### `homeland-911-cell-broadcast-auth-mass-notification-continuity-v1`
- Use for: trusted 911 continuity and warning authenticity during telecom disruption and spoof campaigns.
- Primary tools: alert authenticity analyzer + PSAP continuity dashboard + warning release workflow.
- Cross-check tools: independent telecom integrity witness + alternate misinformation exposure monitor.
- Protocols: `EDXL-DE/CAP`, `NIMS/ICS`, `NIEM`, `USMTF`, `API/JSON`.
- Degraded fallback: life-safety alerts only with confidence labels and fixed approval gates.

### `expeditionary-water-purification-membrane-contamination-recovery-v1`
- Use for: expeditionary potable-water recovery after membrane contamination and sustainment disruption.
- Primary tools: water telemetry board + contamination adjudicator + purification recovery scheduler.
- Cross-check tools: independent lab witness + alternate casualty-health demand monitor.
- Protocols: `USMTF`, `NIMS/ICS`, `HL7/FHIR`, `OGC WMS/WFS/WMTS`, `API/JSON`.
- Degraded fallback: life-sustaining water classes only with strict distribution controls.

### `joint-space-constellation-safe-mode-recovery-priority-v1`
- Use for: contested constellation safe-mode recovery and mission-priority service restoration.
- Primary tools: constellation health monitor + safe-mode planner + mission-priority arbiter.
- Cross-check tools: independent ephemeris witness + alternate mission-service continuity monitor.
- Protocols: `CCSDS`, `USMTF`, `NIEM`, `STIX/TAXII`, `API/JSON`.
- Degraded fallback: strategic mission-essential constellation services only.

### `tactical-urban-substation-microgrid-hostage-continuity-v1`
- Use for: tactical response where urban substation outage, microgrid islanding, and hostage safety interact.
- Primary tools: power topology board + microgrid islanding controller + hostage corridor planner.
- Cross-check tools: independent utility witness + alternate ISR confidence monitor.
- Protocols: `NIMS/ICS`, `USMTF`, `CoT`, `NIEM`, `API/JSON`.
- Degraded fallback: life-safety loads and hostage-critical corridors only.

### `joint-maritime-drone-carrier-air-defense-magazine-arbitration-v1`
- Use for: maritime defense against drone-carrier raid saturation with interceptor-magazine prioritization.
- Primary tools: maritime track fusion board + interceptor expenditure forecaster + defended-node arbiter.
- Cross-check tools: independent track-quality witness + alternate magazine survivability monitor.
- Protocols: `AIS/NMEA`, `Link 16 J-series`, `USMTF`, `VMF`, `API/JSON`.
- Degraded fallback: critical defended assets only with bounded engagement windows.

### `coalition-medical-biobank-cold-chain-genomics-assurance-v1`
- Use for: coalition biobank and battlefield-genomics continuity with custody-safe medical release decisions.
- Primary tools: sample custody ledger + cold-chain telemetry board + coalition clinical release workflow.
- Cross-check tools: independent clinical QA witness + alternate cold-chain integrity monitor.
- Protocols: `HL7/FHIR`, `NIEM`, `USMTF`, `NATO APP-11/ADatP-3 aligned`, `API/JSON`.
- Degraded fallback: urgent clinical sample classes only with dual coalition approval.

### `theater-electromagnetic-decoy-corridor-civil-aviation-protection-v1`
- Use for: decoy corridor execution with explicit civil aviation protection under contested electromagnetic conditions.
- Primary tools: spectrum corridor planner + decoy-emission controller + civil-air deconfliction board.
- Cross-check tools: independent aviation safety witness + alternate EM fratricide monitor.
- Protocols: `Link 16 J-series`, `AIXM/FIXM`, `USMTF`, `STIX/TAXII`, `API/JSON`.
- Degraded fallback: mission-essential decoy windows only with strict civil air restrictions.

### `strategic-quantum-network-ops-center-cyber-resilience-v1`
- Use for: strategic quantum network trust recovery after cyber compromise and key-custody disruption.
- Primary tools: quantum key-custody ledger + anomaly correlation board + strategic cyber recovery orchestrator.
- Cross-check tools: independent cryptographic witness + alternate continuity monitor.
- Protocols: `USMTF`, `STIX/TAXII`, `NIEM`, signed key-status exports, `API/JSON`.
- Degraded fallback: strategic command channels only with conservative key-rotation windows.

### `joint-civilian-evacuation-biometric-family-reunification-integrity-v1`
- Use for: identity-assured family reunification during mass civilian evacuation and displacement operations.
- Primary tools: evacuation identity reconciliation board + biometric adjudicator + reunification workflow tracker.
- Cross-check tools: independent legal-compliance witness + alternate humanitarian throughput monitor.
- Protocols: `NIMS/ICS`, `NIEM`, `USMTF`, `EDXL-DE/CAP`, `API/JSON`.
- Degraded fallback: high-confidence reunification cases only with staged authority review.

## Profile Set (2026-03-13 Expansion Wave XXXVI - Radiological Continuity, AI Defense Integrity, Coalition Infrastructure Recovery, and Cyber-Physical Civil Protection)

### `joint-strategic-portable-reactor-radiological-containment-force-continuity-v1`
- Use for: strategic portable-reactor incident containment where radiological safety and force continuity must both hold.
- Primary tools: reactor telemetry fusion board + plume consequence sequencer + continuity dependency engine.
- Cross-check tools: independent health-physics witness + alternate sustainment continuity monitor.
- Protocols: `NIMS/ICS`, `EDXL-DE/CAP`, `USMTF`, `NIEM`, `API/JSON`.
- Degraded fallback: life-safety and mission-essential continuity actions only with dual command release.

### `theater-ai-air-defense-iff-spoofing-recovery-v1`
- Use for: AI-enabled air-defense branches where IFF spoofing pressure degrades track trust and release confidence.
- Primary tools: multi-sensor track fusion board + IFF confidence adjudicator + defended-asset release engine.
- Cross-check tools: independent radar-quality witness + alternate track-authenticity monitor.
- Protocols: `Link 16 J-series`, `VMF`, `USMTF`, `STIX/TAXII`, `API/JSON`.
- Degraded fallback: high-confidence tracks only with constrained engagement windows.

### `coalition-under-ice-subsea-fiber-repair-sovereign-data-routing-v1`
- Use for: coalition under-ice cable restoration where sovereign data-routing and treaty caveats shape release decisions.
- Primary tools: under-ice cable telemetry board + sovereign-routing policy ledger + repair-rights adjudicator.
- Cross-check tools: independent cable-integrity witness + alternate treaty-caveat monitor.
- Protocols: `AIS/NMEA`, `USMTF`, `NIEM`, `NATO APP-11/ADatP-3 aligned`, `API/JSON`.
- Degraded fallback: mission-essential routing only with staged coalition approvals.

### `homeland-energy-market-cyber-disruption-defense-industrial-load-priority-v1`
- Use for: homeland cyber-disrupted energy market conditions where defense-industrial load priority must be preserved.
- Primary tools: market anomaly board + defense-load arbitrator + regional restoration scheduler.
- Cross-check tools: independent grid-stability witness + alternate demand-stress monitor.
- Protocols: `NIMS/ICS`, `EDXL-DE/CAP`, `STIX/TAXII`, `NIEM`, `API/JSON`.
- Degraded fallback: defense-critical loads only with strict civil-impact safeguards.

### `expeditionary-battlefield-additive-bioprinting-medical-quality-assurance-v1`
- Use for: expeditionary care branches using additive bioprinting with clinical quality and release-gate assurance.
- Primary tools: field bioprint QA board + biocompatibility risk scorer + casualty-care release workflow.
- Cross-check tools: independent clinical QA witness + alternate biomaterial custody monitor.
- Protocols: `HL7/FHIR`, `USMTF`, `NIMS/ICS`, `NIEM`, `API/JSON`.
- Degraded fallback: life-saving print classes only with dual clinical approval.

### `joint-orbital-spectrum-interference-attribution-mission-deconfliction-v1`
- Use for: contested orbital RF conditions where interference attribution and cross-mission deconfliction are coupled.
- Primary tools: orbital RF interference board + mission deconfliction engine + service continuity planner.
- Cross-check tools: independent ephemeris witness + alternate RF integrity monitor.
- Protocols: `CCSDS`, `USMTF`, `STIX/TAXII`, `NIEM`, `API/JSON`.
- Degraded fallback: mission-essential services only with staged release gates.

### `tactical-autonomous-breacher-swarm-human-override-safety-v1`
- Use for: tactical breacher-swarm operations where deterministic human override and fratricide safeguards are mandatory.
- Primary tools: breacher control board + override timing governor + maneuver-safety monitor.
- Cross-check tools: independent safety witness + alternate engagement-envelope monitor.
- Protocols: `CoT`, `VMF`, `USMTF`, `STIX/TAXII`, `API/JSON`.
- Degraded fallback: mission-essential breaching only with strict human release controls.

### `coalition-humanitarian-seaport-biosecurity-screening-military-throughput-v1`
- Use for: coalition seaport conditions where humanitarian biosecurity screening and military throughput must be balanced.
- Primary tools: biosecurity screening board + cargo-priority arbitrator + berth-throughput scheduler.
- Cross-check tools: independent public-health witness + alternate congestion monitor.
- Protocols: `NIMS/ICS`, `HL7/FHIR`, `USMTF`, `NATO APP-11/ADatP-3 aligned`, `API/JSON`.
- Degraded fallback: life-safety cargo and mission-essential throughput only with staged coalition approvals.

### `strategic-rare-isotope-supply-denial-medical-deterrence-continuity-v1`
- Use for: strategic isotope denial scenarios where medical and deterrence continuity must be preserved together.
- Primary tools: isotope inventory confidence board + strategic allocation adjudicator + continuity planner.
- Cross-check tools: independent custody witness + alternate supply-shock monitor.
- Protocols: `USMTF`, `NIEM`, `STIX/TAXII`, signed custody exports, `API/JSON`.
- Degraded fallback: deterrence-critical and life-saving medical uses only with dual authority release.

### `theater-electronic-warfare-civil-gps-fallback-precision-fire-safeguard-v1`
- Use for: EW-contested theaters where civil GPS fallback and precision-fire safety interlocks must be synchronized.
- Primary tools: EW effects board + fallback navigation planner + precision-fire safety interlock engine.
- Cross-check tools: independent navigation integrity witness + alternate fires timing monitor.
- Protocols: `Link 16 J-series`, `VMF`, `CoT`, `AIXM/FIXM`, `API/JSON`.
- Degraded fallback: high-confidence fires only with conservative buffers.

### `joint-cyber-physical-dam-spillway-sabotage-downstream-evacuation-sync-v1`
- Use for: dam spillway sabotage cases where cyber-physical control, downstream warning, and evacuation timing must align.
- Primary tools: dam telemetry integrity board + spillway consequence modeler + evacuation synchronization workflow.
- Cross-check tools: independent hydrology witness + alternate warning timeliness monitor.
- Protocols: `NIMS/ICS`, `EDXL-DE/CAP`, `USMTF`, `NIEM`, `API/JSON`.
- Degraded fallback: life-safety evacuation corridors only with dual civil-military approval.

### `coalition-cross-border-battlefield-cloud-reconstitution-data-integrity-v1`
- Use for: coalition cloud compromise recovery where cross-border caveats and data-integrity attestations govern release.
- Primary tools: cloud dependency topology board + integrity attestation engine + service restoration scheduler.
- Cross-check tools: independent cyber forensics witness + alternate replication-integrity monitor.
- Protocols: `STIX/TAXII`, `USMTF`, `NIEM`, `NATO APP-11/ADatP-3 aligned`, `API/JSON`.
- Degraded fallback: mission-essential services only with staged coalition authority gates.

## Profile Set (2026-03-13 Expansion Wave XXXVII - Arctic Undersea Assurance, Quantum-Resilient Datalinks, Coalition Sortie Continuity, and Homeland Critical-Cascade Response)

### `joint-arctic-subsea-sensor-grid-reseed-ice-threat-forecast-v1`
- Use for: Arctic undersea sensing continuity where sensor reseed timing and ice-threat confidence drive lane release decisions.
- Primary tools: Arctic subsea telemetry fusion board + ice-keel threat predictor + reseed scheduler.
- Cross-check tools: independent hydrographic witness + alternate subsea integrity monitor.
- Protocols: `AIS/NMEA`, `USMTF`, `OGC WMS/WFS/WMTS`, `NATO APP-11/ADatP-3 aligned`, `API/JSON`.
- Degraded fallback: mission-essential sensor lanes only with dual coalition-command release.

### `theater-quantum-resistant-datalink-key-rollover-emission-discipline-v1`
- Use for: theater datalink trust restoration under contested spectrum with quantum-resistant key rollover and EMCON control.
- Primary tools: key-ceremony ledger + datalink trust-health board + EMCON branch planner.
- Cross-check tools: independent cryptographic witness + alternate spectrum trust monitor.
- Protocols: `Link 16 J-series`, `VMF`, `USMTF`, `STIX/TAXII`, `API/JSON`.
- Degraded fallback: mission-essential links only with constrained transmission windows.

### `coalition-forward-airfield-counter-drone-rearming-sortie-resilience-v1`
- Use for: coalition airfield defense where counter-drone suppression, rearming, and sortie generation must remain synchronized.
- Primary tools: counter-UAS fusion board + rearming throughput optimizer + sortie resilience scheduler.
- Cross-check tools: independent runway-safety witness + alternate munitions flow monitor.
- Protocols: `AIXM/FIXM`, `Link 16 J-series`, `USMTF`, `NATO APP-11/ADatP-3 aligned`, `API/JSON`.
- Degraded fallback: mission-priority sortie lines only with staged coalition release.

### `homeland-space-weather-grid-financial-clearing-military-support-v1`
- Use for: civil-military continuity when geomagnetic disturbance threatens grid operations and financial-clearing stability.
- Primary tools: geomagnetic impact board + grid restoration synchronizer + clearing continuity monitor.
- Cross-check tools: independent timing-integrity witness + alternate emergency load monitor.
- Protocols: `NIMS/ICS`, `EDXL-DE/CAP`, `NIEM`, `USMTF`, `API/JSON`.
- Degraded fallback: life-safety and defense-critical services only with strict restoration controls.

### `expeditionary-antimicrobial-resistance-outbreak-isolation-force-health-continuity-v1`
- Use for: expeditionary AMR outbreak response where isolation control and mission health readiness are jointly constrained.
- Primary tools: microbiology surveillance board + isolation corridor planner + force-health continuity allocator.
- Cross-check tools: independent clinical QA witness + alternate treatment-availability monitor.
- Protocols: `HL7/FHIR`, `USMTF`, `NIMS/ICS`, `NIEM`, `API/JSON`.
- Degraded fallback: critical-care cohorts only with conservative movement controls.

### `joint-cislunar-propellant-depot-custody-emergency-rendezvous-v1`
- Use for: cislunar depot custody assurance and emergency rendezvous deconfliction under contested orbital trust.
- Primary tools: depot telemetry board + custody ledger + rendezvous planner.
- Cross-check tools: independent ephemeris witness + alternate custody anomaly monitor.
- Protocols: `CCSDS`, `USMTF`, `NIEM`, `STIX/TAXII`, `API/JSON`.
- Degraded fallback: mission-essential rendezvous only with staged command release.

### `tactical-denied-pnt-precision-fires-human-override-safety-v1`
- Use for: tactical precision fires where denied-PNT confidence and deterministic human override govern release timing.
- Primary tools: denied-PNT confidence engine + fires safety interlock board + human-override controller.
- Cross-check tools: independent navigation-integrity witness + alternate fires timing monitor.
- Protocols: `VMF`, `CoT`, `Link 16 J-series`, `USMTF`, `API/JSON`.
- Degraded fallback: high-confidence fire missions only with strict safety buffers.

### `strategic-defense-industrial-additive-feedstock-counterfeit-eradication-v1`
- Use for: strategic industrial additive production where counterfeit feedstock eradication is required for mission assurance.
- Primary tools: feedstock provenance ledger + counterfeit anomaly scanner + industrial release workflow.
- Cross-check tools: independent materials-authenticity witness + alternate supply-shock monitor.
- Protocols: `USMTF`, `STIX/TAXII`, `NIEM`, signed custody exports, `API/JSON`.
- Degraded fallback: deterrence-critical lines only with dual quality-command authorization.

### `coalition-border-refugee-biometric-deconfliction-insider-risk-screening-v1`
- Use for: coalition border identity reconciliation where refugee throughput and insider-risk controls must remain legally synchronized.
- Primary tools: identity reconciliation board + biometric trust scorer + insider-risk triage workflow.
- Cross-check tools: independent legal compliance witness + alternate humanitarian throughput monitor.
- Protocols: `NIEM`, `USMTF`, `NATO APP-11/ADatP-3 aligned`, `EDXL-DE/CAP`, `API/JSON`.
- Degraded fallback: high-confidence identity classes only with staged coalition legal approval.

### `theater-undersea-autonomous-decoy-discrimination-submarine-lane-assurance-v1`
- Use for: undersea lane assurance where autonomous decoy discrimination confidence affects submarine-route release.
- Primary tools: acoustic classification board + decoy discrimination engine + lane assurance planner.
- Cross-check tools: independent ASW witness + alternate lane-threat monitor.
- Protocols: `AIS/NMEA`, `USMTF`, `Link 16 J-series`, `STIX/TAXII`, `API/JSON`.
- Degraded fallback: mission-essential lanes only with conservative confidence thresholds.

### `joint-urban-critical-hospital-oxygen-power-cascade-response-v1`
- Use for: urban hospital life-safety response where oxygen and power cascades threaten care continuity.
- Primary tools: oxygen telemetry board + power-cascade modeler + emergency care load balancer.
- Cross-check tools: independent hospital operations witness + alternate civil-grid monitor.
- Protocols: `HL7/FHIR`, `NIMS/ICS`, `EDXL-DE/CAP`, `NIEM`, `API/JSON`.
- Degraded fallback: life-saving care loads only with dual civil-military approval.

### `homeland-port-radiological-screening-surge-military-sealift-continuity-v1`
- Use for: homeland port surge events where radiological screening and military sealift continuity must co-exist.
- Primary tools: radiological screening orchestrator + sealift prioritization board + customs throughput synchronizer.
- Cross-check tools: independent radiation safety witness + alternate congestion monitor.
- Protocols: `NIMS/ICS`, `USMTF`, `NIEM`, `AIS/NMEA`, `API/JSON`.
- Degraded fallback: mission-essential sealift and life-safety cargo only with staged authority release.

## Profile Set (2026-03-13 Expansion Wave XXXVIII - Civil Lift Surge, Airborne Entry Integrity, Surf-Zone Recovery, Littoral Breach Recon, and Coastal Approach Fusion)

### `strategic-civil-reserve-air-fleet-aeromedical-surge-v1`
- Use for: contested strategic lift decisions where Civil Reserve Air Fleet activation, patient movement priority, and diplomatic-clearance timing must remain synchronized.
- Primary tools: strategic airlift allocation board + patient movement requirement tracker + civil carrier status service.
- Cross-check tools: independent manifest reconciliation cell + alternate carrier-availability monitor.
- Protocols: `USMTF`, `HL7/FHIR`, `AIXM/FIXM`, `NIEM`, `API/JSON`.
- Degraded fallback: mission-essential airbridge only with manual clearance board and UTC readback log.

### `joint-airborne-drop-zone-integrity-parachute-recovery-v1`
- Use for: airborne-entry decisions where drop-zone certification, jump timing, and recovery continuity drive release confidence.
- Primary tools: drop-zone survey manager + airborne weather feed + jump-manifest tracker.
- Cross-check tools: independent ground-observer witness + alternate obstacle or terrain-risk monitor.
- Protocols: `USMTF`, `VMF`, `AIXM/FIXM/IWXXM`, `CoT`, `API/JSON`.
- Degraded fallback: high-confidence jump windows only with manual DZ board and staged recovery release.

### `joint-maritime-rescue-swimmer-surf-zone-recovery-v1`
- Use for: coastal and surf-zone personnel-recovery decisions where swimmer or hoist method, survivor authentication, and casualty handoff timing must stay aligned.
- Primary tools: maritime COP and drift estimator + rescue-swimmer or hoist readiness board + patient-regulation workflow.
- Cross-check tools: independent survivor-authentication witness + alternate coastal weather monitor.
- Protocols: `USMTF`, `AIS/NMEA`, `HL7/FHIR`, `CoT`, `API/JSON`.
- Degraded fallback: high-confidence rescue windows only with voice SAR board and manual drift plot.

### `joint-littoral-underwater-obstacle-reduction-beach-recon-v1`
- Use for: amphibious and littoral decisions where beach hydrography, underwater obstacles, and recon coverage determine lane-release authority.
- Primary tools: hydrographic survey service + UUV mission planner + obstacle cue board.
- Cross-check tools: independent shoreline recon witness + alternate obstacle-identity monitor.
- Protocols: `AIS/NMEA`, `OGC WMS/WFS/WMTS`, `USMTF`, `CoT`, `API/JSON`.
- Degraded fallback: mission-essential lanes only with beachmaster manual board and conservative clearance thresholds.

### `theater-coastal-radar-harbor-approach-fusion-v1`
- Use for: port and coastal-defense decisions where low-slow track confidence, harbor-approach screening, and port-authority synchronization determine alert posture.
- Primary tools: coastal radar service + AIS analytics board + shoreline EO or IR fusion workflow.
- Cross-check tools: independent harbor watch witness + alternate track-provenance monitor.
- Protocols: `AIS/NMEA`, `OGC WMS/WFS/WMTS`, `CoT`, `USMTF`, `API/JSON`.
- Degraded fallback: mission-essential port movements only with harbor watch bill and fixed approach-risk windows.

## Profile Set (2026-03-13 Expansion Wave XXXIX - Missile-Raid Protection, Fuel Recovery, Coalition Backhaul, Telecom Priority Activation, Industrial Surge, Arctic Sustainment, SOF Resupply, IAMD Redistribution, River-Crossing Safety, Reentry Warning, Grid Theft Mitigation, and Repatriation Health)

### `joint-ballistic-missile-raid-shelter-population-protection-v1`
- Use for: missile-raid response where warning confidence, shelter allocation, and population protection timing must remain synchronized.
- Primary tools: missile warning fusion board + shelter occupancy tracker + protected movement planner.
- Cross-check tools: independent warning-timeline witness + alternate shelter-accountability monitor.
- Protocols: `Link 16 J-series`, `USMTF`, `EDXL-DE/CAP`, `NIEM`, `API/JSON`.
- Degraded fallback: shelter-in-place and life-safety actions only with fixed protective-action rules.

### `theater-forward-fuel-bladder-contamination-airbase-sortie-recovery-v1`
- Use for: airbase recovery branches where fuel contamination isolation and sortie regeneration are tightly coupled.
- Primary tools: fuel quality telemetry board + contamination isolation workflow + sortie generation scheduler.
- Cross-check tools: independent laboratory witness + alternate burn-rate monitor.
- Protocols: `AIXM/FIXM`, `USMTF`, `CoT`, `NIEM`, `API/JSON`.
- Degraded fallback: mission-essential sorties only with conservative fuel-release controls.

### `coalition-host-nation-5g-backhaul-restoration-v1`
- Use for: coalition telecom continuity when host-nation 5G outages and tactical backhaul reroutes affect mission-network trust.
- Primary tools: cellular outage map + tactical backhaul planner + coalition caveat ledger.
- Cross-check tools: independent spectrum witness + alternate route-availability monitor.
- Protocols: `3GPP/O-RAN`, `USMTF`, `NATO APP-11/ADatP-3 aligned`, `STIX/TAXII`, `API/JSON`.
- Degraded fallback: mission-essential links only with constrained coalition release controls.

### `homeland-civil-telecom-priority-cyber-reserve-activation-v1`
- Use for: homeland emergency conditions where telecom priority-service activation and cyber reserve call-up must remain aligned.
- Primary tools: telecom priority-service board + cyber reserve roster tracker + outage-impact dashboard.
- Cross-check tools: independent provider-status witness + alternate reserve-readiness monitor.
- Protocols: `NIMS/ICS`, `NIEM`, `STIX/TAXII`, `EDXL-DE/CAP`, `API/JSON`.
- Degraded fallback: life-safety circuits only with manual call trees and strict routing controls.

### `strategic-solid-rocket-motor-supply-surge-safety-assurance-v1`
- Use for: strategic industrial surge where rocket-motor lot integrity, safety release, and transport timing must remain coupled.
- Primary tools: industrial readiness ledger + motor lot confidence board + hazardous transport tracker.
- Cross-check tools: independent quality witness + alternate facility-safety monitor.
- Protocols: `USMTF`, `NIEM`, `STIX/TAXII`, signed custody exports, `API/JSON`.
- Degraded fallback: deterrence-critical allocations only with dual quality approval.

### `expeditionary-ice-runway-bearing-heavy-lift-sustainment-v1`
- Use for: Arctic sustainment decisions where ice-runway bearing confidence and heavy-lift slot timing determine mission viability.
- Primary tools: ice-thickness modeler + runway stress board + heavy-lift slot scheduler.
- Cross-check tools: independent ice-sounding witness + alternate runway-deformation monitor.
- Protocols: `AIXM/FIXM/IWXXM`, `OGC WMS/WFS/WMTS`, `USMTF`, `CoT`, `API/JSON`.
- Degraded fallback: mission-essential airlift only with conservative bearing classes.

### `joint-sof-clandestine-maritime-resupply-signature-control-v1`
- Use for: SOF littoral sustainment where signature control, route exposure, and custody-assured handoff govern resupply timing.
- Primary tools: low-signature maritime route board + coastal surveillance risk engine + cargo custody ledger.
- Cross-check tools: independent coastal-watch witness + alternate handoff-integrity monitor.
- Protocols: `USMTF`, `AIS/NMEA`, `CoT`, `VMF`, `API/JSON`.
- Degraded fallback: mission-essential resupply only with fixed exposure windows and paper custody chain.

### `theater-iamd-magazine-redistribution-v1`
- Use for: theater air-defense sustainment where magazine depletion, defended-asset priority, and reload routing must stay synchronized.
- Primary tools: magazine depth board + defended-asset priority engine + reload scheduler.
- Cross-check tools: independent depletion witness + alternate transport-timing monitor.
- Protocols: `Link 16 J-series`, `USMTF`, `VMF`, `AIXM/FIXM`, `API/JSON`.
- Degraded fallback: highest-priority defended assets only with fixed holdback rules.

### `coalition-portable-bridge-raft-refugee-crossing-safety-v1`
- Use for: coalition river-crossing response where engineer safety, humanitarian throughput, and legal handoffs must remain synchronized.
- Primary tools: river current board + bridge or raft capacity calculator + humanitarian flow tracker.
- Cross-check tools: independent engineer-safety witness + alternate population-pressure monitor.
- Protocols: `NATO APP-11/ADatP-3 aligned`, `NIEM`, `USMTF`, `OGC WMS/WFS/WMTS`, `API/JSON`.
- Degraded fallback: life-safety crossings only with fixed site limits and visual hydrology checks.

### `joint-unmanned-orbit-reentry-debris-civil-airspace-warning-v1`
- Use for: reentry-warning decisions where orbital confidence, debris-footprint risk, and civil-airspace notification must stay aligned.
- Primary tools: orbital event tracker + debris footprint modeler + civil-airspace warning workflow.
- Cross-check tools: independent ephemeris witness + alternate warning-timeliness monitor.
- Protocols: `CCSDS`, `AIXM/FIXM`, `USMTF`, `EDXL-DE/CAP`, `API/JSON`.
- Degraded fallback: life-safety warnings only with fixed airspace restrictions and manual notice release.

### `homeland-defense-industrial-copper-transformer-theft-grid-priority-v1`
- Use for: homeland restoration branches where theft-driven grid losses threaten defense-industrial continuity and priority-service restoration.
- Primary tools: grid restoration board + industrial load-priority dashboard + utility asset ledger.
- Cross-check tools: independent utility-status witness + alternate replacement-availability monitor.
- Protocols: `NIMS/ICS`, `NIEM`, `STIX/TAXII`, `USMTF`, `API/JSON`.
- Degraded fallback: defense-critical loads only with staged restoration gates.

### `strategic-pow-camp-disease-screening-repatriation-v1`
- Use for: camp health and repatriation decisions where custody integrity, screening throughput, and transport release must remain synchronized.
- Primary tools: camp screening dashboard + custody roster ledger + transport-priority planner.
- Cross-check tools: independent medical QA witness + alternate roster-integrity monitor.
- Protocols: `HL7/FHIR`, `NIEM`, `USMTF`, signed custody exports, `API/JSON`.
- Degraded fallback: high-confidence health-status classes only with staged transport release.

## Profile Set (2026-03-13 Expansion Wave XL - Weather-Radar Spectrum Control, Sealift Crew Vetting, Brownout Safety, Civil Nuclear Grid-Loss Support, Bridge UAS Release, LNG Fleet Fuel Allocation, Public-Address Authentication, Launch-Range Spectrum Control, Underground Hospital Continuity, Disconnected AI Update Attestation, Reserve Mobilization Assurance, and Port Crane Firmware Rollback)

### `joint-weather-radar-spectrum-deconfliction-v1`
- Use for: joint air-land decisions where weather-radar integrity and electromagnetic release windows must stay synchronized.
- Primary tools: spectrum assignment board + weather-radar operations picture + mission-weather workflow.
- Cross-check tools: independent radar health witness + alternate spectrum-conflict monitor.
- Protocols: `OGC WMS/WFS/WMTS`, `AIXM/FIXM/IWXXM`, `USMTF`, `Link 16 J-series`, `API/JSON`.
- Degraded fallback: mission-essential weather products only with fixed radar windows and conservative emissions control.

### `coalition-merchant-marine-crew-vetting-sealift-assurance-v1`
- Use for: coalition sealift decisions where crew trust, port release, and sanctions or watchlist synchronization determine voyage viability.
- Primary tools: crew-vetting ledger + sealift manning board + port-access workflow.
- Cross-check tools: independent crew-identity witness + alternate voyage-readiness monitor.
- Protocols: `AIS/NMEA`, `NIEM`, `NATO APP-11/ADatP-3 aligned`, `USMTF`, `API/JSON`.
- Degraded fallback: mission-essential voyages only with liaison screening and dual-approval release.

### `expeditionary-helicopter-brownout-drone-deconfliction-v1`
- Use for: austere rotary-wing branches where brownout, drone conflict, and LZ release timing govern flight safety.
- Primary tools: dust and visibility hazard model + landing-zone surveillance board + UAS separation workflow.
- Cross-check tools: independent brownout witness + alternate low-altitude airspace monitor.
- Protocols: `AIXM/FIXM/IWXXM`, `CoT`, `Link 16 J-series`, `USMTF`, `API/JSON`.
- Degraded fallback: casualty or mission-essential movements only with fixed drone exclusion windows and conservative visibility minimums.

### `homeland-civil-nuclear-plant-grid-loss-military-support-v1`
- Use for: homeland DSCA branches where plant grid loss, emergency cooling support, and public-protection timing determine military support release.
- Primary tools: plant status dashboard + emergency cooling support board + protected-route planner.
- Cross-check tools: independent reactor-status witness + alternate public-protection monitor.
- Protocols: `NIMS/ICS`, `NIEM`, `EDXL-DE/CAP`, `USMTF`, `API/JSON`.
- Degraded fallback: cooling and life-safety support only with staged public-protection actions.

### `theater-rapid-temporary-bridge-uas-inspection-release-v1`
- Use for: engineer mobility branches where UAS inspection confidence controls temporary-bridge release and force-flow timing.
- Primary tools: UAS inspection planner + structural defect triage board + bridge load-class workflow.
- Cross-check tools: independent engineer witness + alternate route-capacity monitor.
- Protocols: `OGC WMS/WFS/WMTS`, `CoT`, `VMF`, `USMTF`, `API/JSON`.
- Degraded fallback: life-safety or mission-essential crossings only with conservative load restrictions and manual engineer release.

### `strategic-contested-lng-bunker-fleet-fuel-allocation-v1`
- Use for: fleet sustainment decisions where LNG inventory, bunker access, and port-risk indicators determine maritime readiness.
- Primary tools: LNG inventory ledger + bunker scheduling board + fleet demand-priority planner.
- Cross-check tools: independent cargo-quality witness + alternate berth-availability monitor.
- Protocols: `AIS/NMEA`, `NIEM`, `USMTF`, `STIX/TAXII`, `API/JSON`.
- Degraded fallback: deterrence-critical fleet movements only with reduced berth tempo and strict fuel-release control.

### `tactical-civil-evacuation-public-address-auth-v1`
- Use for: tactical civil-protection branches where broadcast authenticity, translation fidelity, and movement control shape civilian trust.
- Primary tools: message-authentication workflow + translation assurance board + civil-alert dissemination planner.
- Cross-check tools: independent linguistic witness + alternate broadcast-integrity monitor.
- Protocols: `EDXL-DE/CAP`, `CoT`, `NIEM`, `USMTF`, `API/JSON`.
- Degraded fallback: life-safety messages only with authenticated fixed phrases and local readback witness.

### `joint-space-launch-range-spectrum-deconfliction-v1`
- Use for: launch-range decisions where telemetry integrity, spectrum assignments, and window release timing compete under pressure.
- Primary tools: range-spectrum scheduler + telemetry health board + launch-window adjudicator.
- Cross-check tools: independent range-safety witness + alternate telemetry-integrity monitor.
- Protocols: `CCSDS`, `AIXM/FIXM`, `USMTF`, `Link 16 J-series`, `API/JSON`.
- Degraded fallback: highest-priority launches only with reduced telemetry paths and extra release gates.

### `theater-underground-hospital-oxygen-power-continuity-v1`
- Use for: protected-hospital branches where oxygen, electrical continuity, and casualty-load balancing determine survival outcomes.
- Primary tools: hospital utility dashboard + oxygen generation board + critical-load planner.
- Cross-check tools: independent biomedical systems witness + alternate bed-capacity monitor.
- Protocols: `HL7/FHIR`, `NIMS/ICS`, `USMTF`, `NIEM`, `API/JSON`.
- Degraded fallback: life-saving wards only with strict load shedding and oxygen rationing triggers.

### `joint-disconnected-mission-ai-model-update-attestation-v1`
- Use for: disconnected mission-AI updates where provenance, compatibility, and rollback readiness determine release authority.
- Primary tools: model attestation ledger + artifact-signature verifier + mission-thread compatibility board.
- Cross-check tools: independent provenance witness + alternate model-drift monitor.
- Protocols: `USMTF`, `STIX/TAXII`, signed artifact manifests, `NIEM`, `API/JSON`.
- Degraded fallback: no new model release unless safety-critical patch with dual approval and rollback ready.

### `homeland-reservist-employer-protection-mobilization-assurance-v1`
- Use for: reserve mobilization decisions where employer protections, authority status, and transport synchronization shape call-up continuity.
- Primary tools: reservist readiness board + employer-impact tracker + mobilization authority workflow.
- Cross-check tools: independent personnel-readiness witness + alternate employer-response monitor.
- Protocols: `NIEM`, `NIMS/ICS`, `USMTF`, signed readiness exports, `API/JSON`.
- Degraded fallback: highest-priority reserve billets only with manual employer reconciliation and delayed transport alignment.

### `strategic-commercial-port-crane-firmware-rollback-sealift-recovery-v1`
- Use for: strategic port recovery branches where crane OT rollback safety and military sealift throughput must remain coupled.
- Primary tools: crane OT telemetry board + firmware rollback workflow + pier throughput planner.
- Cross-check tools: independent OT integrity witness + alternate cargo-flow monitor.
- Protocols: `STIX/TAXII`, `AIS/NMEA`, `NIMS/ICS`, `USMTF`, `API/JSON`.
- Degraded fallback: defense-critical cargo only with crane-by-crane manual release and reduced pier tempo.

## Profile Set (2026-03-14 Expansion Wave XLI - Cislunar Timing Collision Mitigation, Domestic Transport Reroute, Coalition Medical Reprivileging, Autonomous Sustainment Routing Drift, Maritime Interdiction Evidence, Terrain Spoof Route Approval, Arresting Gear Restoration, Volcanic Ash Airbridge Recovery, Shipyard Drydock Restoration, River Port Sustainment, Cellular Timing Holdover, and Command Post Flood/Smoke Control)

### `joint-cislunar-timing-trust-collision-mitigation-v1`
- Use for: cislunar maneuver branches where degraded timing trust and conjunction risk determine custody-safe release.
- Primary tools: cislunar ephemeris ledger + timing-integrity board + conjunction assessment workflow.
- Cross-check tools: independent orbital-timing witness + alternate custody-confidence monitor.
- Protocols: `CCSDS`, signed ephemeris manifests, `USMTF`, `STIX/TAXII`, `API/JSON`.
- Degraded fallback: essential custody maneuvers only with expanded separation and dual approval.

### `strategic-domestic-transport-chokepoint-reroute-v1`
- Use for: domestic force-flow branches where modal chokepoints threaten deployment or sustainment continuity.
- Primary tools: national freight-flow board + military shipment priority tracker + bridge and port status dashboard.
- Cross-check tools: independent movement-control witness + alternate modal-capacity monitor.
- Protocols: `NIEM`, `OGC WMS/WFS/WMTS`, `NIMS/ICS`, `USMTF`, `API/JSON`.
- Degraded fallback: defense-critical movements only with modal rationing and commander-approved delays.

### `coalition-medical-credential-revocation-reprivileging-v1`
- Use for: coalition care branches where clinician trust, revocation events, and emergency privileging determine treatment continuity.
- Primary tools: clinician credential registry + revocation ledger + emergency privileging workflow.
- Cross-check tools: independent credential witness + alternate care-capacity monitor.
- Protocols: `HL7/FHIR`, `NIEM`, `NATO APP-11/ADatP-3 aligned`, signed credential manifests, `API/JSON`.
- Degraded fallback: life-, limb-, or eyesight-saving care only with emergency privileges and explicit risk acceptance.

### `expeditionary-autonomous-sustainment-routing-drift-governance-v1`
- Use for: expeditionary sustainment branches where route-model drift and threat changes undermine autonomy confidence.
- Primary tools: route-optimization model board + drift monitor + convoy telemetry tracker.
- Cross-check tools: independent route-trust witness + alternate waypoint-validation monitor.
- Protocols: `CoT`, `VMF`, `STIX/TAXII`, `USMTF`, `API/JSON`.
- Degraded fallback: manned convoy planning only on pre-cleared routes with reduced tempo.

### `multi-theater-maritime-interdiction-evidence-sanctions-v1`
- Use for: multi-theater interdiction branches where sanctions sufficiency and evidence harmonization determine release authority.
- Primary tools: vessel-custody ledger + sanctions case board + evidence schema translator.
- Cross-check tools: independent legal sufficiency witness + alternate vessel-history monitor.
- Protocols: `AIS/NMEA`, `NIEM`, `STIX/TAXII`, `NATO APP-11/ADatP-3 aligned`, `USMTF`, `API/JSON`.
- Degraded fallback: advisory-only interdiction recommendations until legal sufficiency is verified.

### `theater-digital-terrain-fabric-spoof-route-approval-v1`
- Use for: maneuver branches where terrain-data tampering or provenance gaps threaten route release confidence.
- Primary tools: terrain provenance ledger + geospatial anomaly detector + route-clearance workflow.
- Cross-check tools: independent survey witness + alternate route-risk monitor.
- Protocols: `OGC WMS/WFS/WMTS`, `CoT`, `VMF`, `USMTF`, `API/JSON`.
- Degraded fallback: mission-essential movement only with visual navigation cross-checks and route-by-route engineer approval.

### `expeditionary-aircraft-arresting-gear-crash-barrier-restoration-v1`
- Use for: airbase recovery branches where arresting-gear damage and barrier repairs govern aircraft release.
- Primary tools: arresting-gear status dashboard + barrier repair workflow + runway inspection board.
- Cross-check tools: independent airfield safety witness + alternate runway-availability monitor.
- Protocols: `AIXM/FIXM/IWXXM`, `CoT`, `USMTF`, `NIEM`, `API/JSON`.
- Degraded fallback: emergency recoveries only with aircraft-type restrictions and explicit commander risk acceptance.

### `joint-volcanic-ash-airbridge-engine-sortie-recovery-v1`
- Use for: airbridge branches where volcanic ash, engine inspections, and diversion windows govern sortie recovery.
- Primary tools: ash-cloud forecast board + engine-health tracker + inspection scheduling workflow.
- Cross-check tools: independent ash-hazard witness + alternate engine-readiness monitor.
- Protocols: `IWXXM`, `AIXM/FIXM`, `OGC WMS/WFS/WMTS`, `USMTF`, `API/JSON`.
- Degraded fallback: life-saving or strategic airlift only with conservative ash avoidance and universal post-flight inspections.

### `strategic-shipyard-drydock-power-water-cyber-restoration-v1`
- Use for: shipyard branches where utility outages and OT compromise threaten fleet repair throughput.
- Primary tools: shipyard utility dashboard + drydock availability board + OT incident workflow.
- Cross-check tools: independent utility-integrity witness + alternate dock-safety monitor.
- Protocols: `NIMS/ICS`, `STIX/TAXII`, `NIEM`, `USMTF`, `API/JSON`.
- Degraded fallback: combat-critical repairs only with dock-by-dock manual release and reduced tempo.

### `theater-river-port-dredge-barge-roro-sustainment-v1`
- Use for: inland-waterway branches where dredging, barge flow, and roll-on roll-off release determine throughput.
- Primary tools: hydrographic survey board + dredge scheduling workflow + barge queue tracker.
- Cross-check tools: independent channel-depth witness + alternate cargo-flow monitor.
- Protocols: `AIS/NMEA`, `OGC WMS/WFS/WMTS`, `NIEM`, `USMTF`, `API/JSON`.
- Degraded fallback: mission-essential cargo only with draft limits, reduced transload tempo, and daylight-only windows.

### `joint-contested-cellular-timing-holdover-first-responder-priority-v1`
- Use for: homeland telecom branches where timing holdover and priority-service governance determine public-safety continuity.
- Primary tools: cellular timing status board + backhaul failover workflow + priority-service registry.
- Cross-check tools: independent timing witness + alternate priority-service monitor.
- Protocols: `NIEM`, `NIMS/ICS`, `EDXL-DE/CAP`, signed timing exports, `USMTF`, `API/JSON`.
- Degraded fallback: first-responder and military life-safety traffic only with reduced subscriber access.

### `theater-austere-command-post-flooding-hvac-smoke-control-v1`
- Use for: command-post branches where flooding, smoke, or HVAC failure threaten mission-node continuity.
- Primary tools: facility sensor dashboard + water-ingress workflow + HVAC isolation board.
- Cross-check tools: independent facility-safety witness + alternate mission-node status monitor.
- Protocols: `BACnet/IP`, `NIMS/ICS`, `CoT`, `USMTF`, `API/JSON`.
- Degraded fallback: essential C2 nodes only with partial relocation and manual environmental watches.

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

## Profile Addendum Q (2026-03-14, Cloud Admission, AI Order Integrity, and Mobility Survivability)

### `battlefield-cloud-admission-control-v1`
- Use for battlefield cloud and edge federations when contested transport, workload trust, or enclave isolation determines mission continuity.
- Primary tools: `ts-theater-battlefield-cloud-federation-admission-control-v1`.
- Cross-check tools: `ts-joint-sovereign-edge-cloud-migration-v1`.
- Protocols: signed workload manifests, `API/JSON`, `STIX/TAXII`, `USMTF`.
- Degraded fallback: mission-essential workloads only with commander-approved manual admission.

### `autonomous-evacuation-convoy-arbitration-v1`
- Use for homeland military-civil evacuation when autonomous convoys, civil life-safety traffic, and checkpoint identity control compete for the same roads.
- Primary tools: `ts-homeland-autonomous-evacuation-convoy-arbitration-v1`.
- Cross-check tools: `ts-civil-support-v1`.
- Protocols: `NIMS/ICS`, `CoT`, `NIEM`, `API/JSON`, `USMTF`.
- Degraded fallback: human-driven convoys only with checkpoint-based release.

### `ai-order-intent-integrity-v1`
- Use for order release when AI-generated products need semantic drift checks against authenticated commander intent.
- Primary tools: `ts-joint-ai-order-intent-integrity-v1`.
- Cross-check tools: `ts-joint-digital-order-watermark-recall-v1`.
- Protocols: signed order manifests, `USMTF`, `STIX/TAXII`, `API/JSON`.
- Degraded fallback: dual-channel human countersign before any release.

### `fuel-additive-adulteration-interdiction-v1`
- Use for strategic or expeditionary fuel decisions when additive pedigree or contamination indicators threaten safe release.
- Primary tools: `ts-strategic-fuel-additive-adulteration-interdiction-v1`.
- Cross-check tools: `ts-defense-industrial-base-sabotage-risk-v1`.
- Protocols: signed material-cert manifests, `API/JSON`, `USMTF`, `NIEM`.
- Degraded fallback: mission-essential fuel lots only with dual-sample confirmation.

### `high-latitude-battery-thermal-survivability-v1`
- Use for arctic and alpine operations when batteries, charging windows, or cold-soak risk constrain autonomous or expeditionary power.
- Primary tools: `ts-expeditionary-high-latitude-battery-thermal-survivability-v1`.
- Cross-check tools: `ts-logistics-distribution-v1`.
- Protocols: signed battery-health manifests, `CoT`, `API/JSON`, `USMTF`.
- Degraded fallback: mission-essential battery loads only with manual thermal checks.

### `austere-renal-support-dialysis-surge-v1`
- Use for austere clinical operations when dialysis capacity, water purity, or renal consumables determine survival and diversion timing.
- Primary tools: `ts-joint-austere-renal-support-dialysis-surge-v1`.
- Cross-check tools: `ts-medical-force-health-v1`.
- Protocols: `HL7/FHIR`, `USMTF`, `API/JSON`, NATO APP-11/ADatP-3 aligned exchange.
- Degraded fallback: life-saving renal support only with commander-approved triage thresholds.

### `mobile-precision-approach-lighting-v1`
- Use for dispersed or damaged airbases when mobile approach aids and lighting are the pacing constraint on recovery operations.
- Primary tools: `ts-joint-dispersed-airbase-mobile-precision-approach-lighting-v1`.
- Cross-check tools: `ts-airfield-recovery-v1`.
- Protocols: `AIXM/FIXM`, `USMTF`, `Link 16 J-series`, signed maintenance manifests, `API/JSON`.
- Degraded fallback: day-VMC or restricted-minima operations only.

### `surf-zone-breach-gradient-verification-v1`
- Use for amphibious or logistics shore entry when breach-lane release depends on trusted gradients, surf conditions, and obstacle reduction.
- Primary tools: `ts-joint-littoral-surf-zone-breach-gradient-verification-v1`.
- Cross-check tools: `ts-maritime-undersea-v1`.
- Protocols: `OGC`, `VMF`, `USMTF`, `API/JSON`, `CoT`.
- Degraded fallback: daylight or limited-craft lane release only.

### `on-orbit-solar-battery-load-shed-v1`
- Use for strategic space assets when power margins, eclipse geometry, or mission-coverage priorities require controlled load shedding.
- Primary tools: `ts-strategic-on-orbit-solar-array-battery-load-shed-v1`.
- Cross-check tools: `ts-space-satcom-v1`.
- Protocols: `CCSDS`, signed telemetry manifests, `API/JSON`, `USMTF`.
- Degraded fallback: mission-essential payloads only with conservative battery margins.

### `emissions-window-decoy-synchronization-v1`
- Use for joint EMCON and deception execution when brief emissions windows must align with decoys and effects timing.
- Primary tools: `ts-joint-emissions-window-decoy-synchronization-v1`.
- Cross-check tools: `ts-spectrum-governance-v1`.
- Protocols: `Link 16 J-series`, `VMF`, `CoT`, `USMTF`, `API/JSON`.
- Degraded fallback: brief commander-approved emissions bursts only with manual decoy confirmation.

### `coalition-sar-beacon-authentication-v1`
- Use for coalition personnel recovery when distress beacons, survivor identity, and spoofing pressure complicate release decisions.
- Primary tools: `ts-coalition-denied-sar-beacon-authentication-v1`.
- Cross-check tools: `ts-contested-personnel-recovery-v1`.
- Protocols: `Cospas-Sarsat`, `USMTF`, `NIEM`, `CoT`, `API/JSON`.
- Degraded fallback: life-saving recovery only with dual-source location confirmation.

### `autonomous-breach-soil-bearing-route-v1`
- Use for engineer or heavy-vehicle route release when soil-bearing uncertainty and autonomous sensing drive breach timing.
- Primary tools: `ts-autonomous-breach-soil-bearing-route-classification-v1`.
- Cross-check tools: `ts-denied-terrain-drone-resupply-nav-v1`.
- Protocols: `OGC`, `CoT`, `VMF`, `API/JSON`, `USMTF`.
- Degraded fallback: limited-weight route release only with human reconnaissance.

## Profile Addendum R (2026-03-14, Fires Integrity, Cloud Access Recovery, and Strategic Component Scarcity)

### `laser-designator-sensor-fratricide-v1`
- Use for joint targeting when laser-code collisions or mis-cued sensors threaten fratricide or invalid release.
- Primary tools: `ts-joint-laser-designator-sensor-fratricide-prevention-v1`.
- Cross-check tools: `ts-fires-airspace-v1`.
- Protocols: `VMF`, `Link 16 J-series`, `USMTF`, `API/JSON`.
- Degraded fallback: single-designator control with voice readback and UTC acknowledgment log.

### `cloud-credential-burn-access-reconstitution-v1`
- Use for battlefield cloud recovery when compromised credentials or workload identity threaten mission software continuity.
- Primary tools: `ts-theater-cloud-credential-burn-access-reconstitution-v1`.
- Cross-check tools: `ts-cyber-defense-v1`.
- Protocols: `SCIM`, `OIDC/SAML`, `STIX/TAXII`, `API/JSON`, `USMTF`.
- Degraded fallback: commander-approved break-glass access only with dual-control logging.

### `battle-damaged-aircraft-recovery-cannibalization-v1`
- Use for expeditionary aviation recovery when damaged airframes, scarce parts, and sortie demand compete for the same maintenance capacity.
- Primary tools: `ts-expeditionary-battle-damaged-aircraft-recovery-cannibalization-v1`.
- Cross-check tools: `ts-airfield-recovery-v1`.
- Protocols: `AIXM/FIXM`, signed maintenance manifests, `API/JSON`, `USMTF`.
- Degraded fallback: ground-safe recovery only with no-flight release until full inspection.

### `base-fuel-hydrant-fire-suppression-recovery-v1`
- Use for base continuity when hydrant loops, foam systems, and sortie fueling capacity are damaged or cyber-physically disrupted.
- Primary tools: `ts-homeland-base-fuel-hydrant-fire-suppression-recovery-v1`.
- Cross-check tools: `ts-civil-support-v1`.
- Protocols: `NIMS/ICS`, `OPC UA`, `API/JSON`, `USMTF`.
- Degraded fallback: truck fueling only with manual isolation and continuous fire watch.

### `coalition-shore-power-frequency-conversion-berthing-v1`
- Use for coalition maritime sustainment when berth power, voltage and frequency compatibility, or converter scarcity drive port-release timing.
- Primary tools: `ts-coalition-shore-power-frequency-conversion-berthing-v1`.
- Cross-check tools: `ts-maritime-undersea-v1`.
- Protocols: `AIS/NMEA`, signed power-cert manifests, `API/JSON`, `USMTF`, NATO APP-11/ADatP-3 aligned exchange.
- Degraded fallback: generator support only with prioritized military-essential berths.

### `ground-robotics-teleoperation-spectrum-safety-v1`
- Use for engineer, EOD, or recovery robots when contested spectrum and latency growth threaten safe teleoperation.
- Primary tools: `ts-joint-ground-robotics-teleoperation-spectrum-safety-v1`.
- Cross-check tools: `ts-spectrum-governance-v1`.
- Protocols: `CoT`, `VMF`, `DDS/ROS 2`, `API/JSON`, `USMTF`.
- Degraded fallback: line-of-sight teleoperation only with human spotter chain.

### `carbon-carbon-nozzle-reentry-material-priority-v1`
- Use for strategic production decisions when carbon-carbon, ablatives, or nozzle materials become the pacing constraint for deterrence or space readiness.
- Primary tools: `ts-strategic-carbon-carbon-nozzle-reentry-material-priority-v1`.
- Cross-check tools: `ts-strategic-supply-shock-v1`.
- Protocols: signed material-cert manifests, `API/JSON`, `USMTF`, `OPC UA`.
- Degraded fallback: mission-essential lots only with conservative release thresholds.

### `respiratory-protection-fit-filter-rotation-v1`
- Use for force-health decisions when respirator fit, filter burn rate, or toxic airborne exposure determines unit endurance.
- Primary tools: `ts-austere-respiratory-protection-fit-filter-rotation-v1`.
- Cross-check tools: `ts-medical-force-health-v1`.
- Protocols: `HL7/FHIR`, CBRN `USMTF`, `API/JSON`, signed inventory manifests.
- Degraded fallback: mission-essential issue only with commander-approved conservation measures.

### `assault-lz-dust-obscuration-control-v1`
- Use for assault or resupply aviation when dust, brownout, or sensor obscuration determines landing-zone release confidence.
- Primary tools: `ts-joint-assault-landing-zone-dust-obscuration-control-v1`.
- Cross-check tools: `ts-airfield-recovery-v1`.
- Protocols: `OGC`, `AIXM/FIXM`, `VMF`, `API/JSON`, `USMTF`.
- Degraded fallback: daylight or marked landing-zone operations only with manual dust observation.

### `guidance-seeker-imu-accelerometer-priority-v1`
- Use for strategic munitions and weapons-production prioritization when seeker, IMU, or accelerometer scarcity constrains release confidence.
- Primary tools: `ts-strategic-guidance-seeker-imu-accelerometer-priority-v1`.
- Cross-check tools: `ts-strategic-supply-shock-v1`.
- Protocols: signed component manifests, `API/JSON`, `USMTF`, `OPC UA`.
- Degraded fallback: mission-essential lots only with manual pedigree verification.

## Profile Addendum S (2026-03-14, Kill-Web Disruption, Coalition Release, FEW Adjudication, and Space-to-Street Continuity)

### `kill-web-disruption-assessment-v1`
- Use for campaign and fires decisions when adversary sensor-to-shooter chains must be broken at the highest-payoff seam.
- Primary tools: `ts-joint-adversary-kill-web-disruption-assessment-v1`.
- Cross-check tools: `ts-fires-airspace-v1`.
- Protocols: `USMTF`, `Link 16 J-series`, `STIX/TAXII`, `API/JSON`.
- Degraded fallback: advisory-only disruption ladder with commander approval at every release point.

### `autonomous-decoy-economy-governance-v1`
- Use for theater deception when decoy expenditure, regeneration, and emissions timing determine campaign endurance.
- Primary tools: `ts-theater-autonomous-decoy-economy-inventory-governance-v1`.
- Cross-check tools: `ts-spectrum-governance-v1`.
- Protocols: signed inventory manifests, `CoT`, `Link 16 J-series`, `API/JSON`, `USMTF`.
- Degraded fallback: commander-approved decoy use only for mission-essential phases.

### `mission-data-releasability-waiver-v1`
- Use for coalition operations when mission data must be released with caveats, waivers, or schema reduction under tight timelines.
- Primary tools: `ts-coalition-mission-data-releasability-waiver-adjudication-v1`.
- Cross-check tools: `ts-coalition-data-fabric-interoperability-v1`.
- Protocols: signed releasability manifests, `NATO APP-11/ADatP-3` aligned exchange, `API/JSON`, `USMTF`, `NIEM`.
- Degraded fallback: mission-essential summary only with explicit coalition caveat annotations.

### `undersea-chokepoint-barrier-orchestration-v1`
- Use for maritime and subsea defense when autonomous chokepoint barriers drive detection, deterrence, and release timing.
- Primary tools: `ts-strategic-undersea-chokepoint-autonomous-barrier-orchestration-v1`.
- Cross-check tools: `ts-maritime-undersea-v1`.
- Protocols: `AIS/NMEA`, `Link 16 J-series`, `USMTF`, `OGC`, `API/JSON`.
- Degraded fallback: periodic barrier updates only with conservative coverage assumptions.

### `multilingual-mission-brief-assurance-v1`
- Use for joint and coalition command when mission briefs must retain commander intent across multiple languages and disconnected paths.
- Primary tools: `ts-joint-distributed-mission-brief-multilingual-assurance-v1`.
- Cross-check tools: `ts-joint-digital-order-watermark-recall-v1`.
- Protocols: signed document manifests, `USMTF`, `NATO APP-11/ADatP-3` aligned exchange, `API/JSON`.
- Degraded fallback: one authoritative language plus human readback confirmation for partner translations.

### `fuel-energy-water-nexus-adjudication-v1`
- Use for coalition sustainment and civil-support decisions when fuel, power, and water anomalies may cascade across critical nodes.
- Primary tools: `ts-coalition-fuel-energy-water-nexus-anomaly-adjudication-v1`.
- Cross-check tools: `ts-civil-support-v1`.
- Protocols: `NIMS/ICS`, `OGC`, `API/JSON`, `USMTF`, `NIEM`.
- Degraded fallback: life-safety utilities only with manual status confirmation every 4 hours.

### `aerial-port-hazmat-pallet-integrity-v1`
- Use for aerial-port and deployment decisions when battery cargo, hazmat rules, or pallet-build risk constrain sortie release.
- Primary tools: `ts-joint-aerial-port-battery-hazmat-pallet-integrity-v1`.
- Cross-check tools: `ts-logistics-distribution-v1`.
- Protocols: signed cargo manifests, `AIXM/FIXM`, `API/JSON`, `USMTF`, `NATO APP-11/ADatP-3` aligned exchange.
- Degraded fallback: mission-essential cargo only with heightened fire-watch and single-sortie load approval.

### `austere-oxygen-ventilator-loadshed-v1`
- Use for medical operations when oxygen generation and ventilator demand cannot both be sustained at current casualty load.
- Primary tools: `ts-joint-austere-oxygen-generation-ventilator-load-shed-v1`.
- Cross-check tools: `ts-medical-force-health-v1`.
- Protocols: `HL7/FHIR`, `USMTF`, `API/JSON`, signed biomedical maintenance manifests.
- Degraded fallback: lifesaving-only ventilation with commander-approved clinical triage thresholds.

### `cross-domain-guard-schema-drift-v1`
- Use for cyber and mission-data recovery when cross-domain guards distort, delay, or silently drop mission messages.
- Primary tools: `ts-theater-cross-domain-guard-schema-drift-message-loss-v1`.
- Cross-check tools: `ts-cyber-defense-v1`.
- Protocols: signed schema manifests, `XML/JSON`, `STIX/TAXII`, `API/JSON`, `USMTF`.
- Degraded fallback: critical-message manual relay only with UTC checksum logging.

### `orbital-downlink-ground-priority-v1`
- Use for space operations when scarce downlink windows and ground-station time require mission-priority arbitration.
- Primary tools: `ts-joint-orbital-mission-data-downlink-window-ground-priority-v1`.
- Cross-check tools: `ts-space-satcom-v1`.
- Protocols: `CCSDS`, signed telemetry manifests, `API/JSON`, `USMTF`.
- Degraded fallback: one mission-essential product class per pass with deferred bulk downloads.

### `urban-rubble-rescue-clearance-v1`
- Use for urban maneuver and civil-support response when rubble, collapse risk, and trapped personnel compete for engineer capacity.
- Primary tools: `ts-joint-urban-rubble-route-clearance-structural-collapse-rescue-v1`.
- Cross-check tools: `ts-civil-support-v1`.
- Protocols: `NIMS/ICS`, `OGC`, `CoT`, `USMTF`, `API/JSON`.
- Degraded fallback: lifesaving rescue corridors only with engineer and rescue dual approval.

### `semiconductor-burnin-priority-v1`
- Use for strategic industrial decisions when semiconductor burn-in, screening, and pedigree control become the pacing constraint.
- Primary tools: `ts-strategic-semiconductor-test-burn-in-mission-priority-v1`.
- Cross-check tools: `ts-strategic-supply-shock-v1`.
- Protocols: signed lot manifests, `API/JSON`, `USMTF`, `OPC UA`.
- Degraded fallback: mission-essential lots only with manual pedigree confirmation and narrowed environmental screening.

## Profile Addendum T (2026-03-14, Bio-Surge Integrity, Custody Transparency, Water Attack Triage, and Robotic Breach Assurance)

### `bio-adjuvant-lnp-surge-v1`
- Use for strategic vaccine adjuvant, lipid nanoparticle, and fill-finish prioritization when specialty biologics inputs become the pacing constraint.
- Primary tools: `ts-strategic-vaccine-adjuvant-lipid-nanoparticle-surge-v1`.
- Cross-check tools: `ts-medical-force-health-v1`.
- Protocols: signed material-cert manifests, `HL7/FHIR`, `API/JSON`, `USMTF`.
- Degraded fallback: mission-essential countermeasure lots only with dual-control release review.

### `forward-sterility-bioprocess-release-v1`
- Use for forward sterility release and field bioprocess governance when biologics or diagnostics need trusted emergency release decisions.
- Primary tools: `ts-theater-forward-sterility-release-bioprocess-assurance-v1`.
- Cross-check tools: `ts-medical-force-health-v1`.
- Protocols: signed batch manifests, `HL7/FHIR`, `API/JSON`, `USMTF`.
- Degraded fallback: hold-and-test posture with commander-approved emergency release only.

### `coalition-detainee-appeals-transparency-v1`
- Use for coalition detainee appeal timelines, multilingual translation QA, and custody-transparency exchange under legal scrutiny.
- Primary tools: `ts-coalition-detainee-appeals-custody-transparency-v1`.
- Cross-check tools: `ts-detainee-accountability-v1`.
- Protocols: `NIEM`, `CJIS`, signed custody manifests, `API/JSON`, `USMTF`.
- Degraded fallback: manual appeals review with dual-review translation and protected custody updates.

### `pr-family-auth-deception-denial-v1`
- Use for trusted PR updates and family notification when isolated-personnel reporting or command messages may be spoofed.
- Primary tools: `ts-joint-personnel-recovery-family-auth-deception-denial-v1`.
- Cross-check tools: `ts-disinformation-counter-v1`.
- Protocols: signed notification manifests, `USMTF`, `STIX/TAXII`, `API/JSON`, `CoT`.
- Degraded fallback: dual-channel human verification only with notification freeze on unresolved identity conflict.

### `municipal-water-cyber-chemical-triage-v1`
- Use for municipal water OT compromise and contamination triage when DSCA support may be needed to preserve public safety and mission continuity.
- Primary tools: `ts-homeland-municipal-water-cyber-chemical-triage-v1`.
- Cross-check tools: `ts-civil-support-v1`.
- Protocols: `NIMS/ICS`, `EDXL-DE/CAP`, `OPC UA`, `API/JSON`, `USMTF`.
- Degraded fallback: life-safety-first water isolation with hourly command and civil-lead review.

### `cable-repair-ship-escort-priority-v1`
- Use for strategic undersea cable repair-ship prioritization when escort scarcity and maritime threat windows drive restoration order.
- Primary tools: `ts-strategic-undersea-cable-repair-ship-escort-priority-v1`.
- Cross-check tools: `ts-maritime-undersea-v1`.
- Protocols: `AIS/NMEA`, `OGC`, signed repair manifests, `API/JSON`, `USMTF`.
- Degraded fallback: mission-essential repair routes only with fixed escort windows and manual acknowledgment.

### `offshore-energy-blackstart-defense-v1`
- Use for offshore energy platform blackstart and defense when military fuel, power, or communications continuity depend on surviving platform outages or sabotage.
- Primary tools: `ts-theater-offshore-energy-platform-blackstart-defense-v1`.
- Cross-check tools: `ts-civil-support-v1`.
- Protocols: `AIS/NMEA`, `OGC`, `OPC UA`, signed maintenance manifests, `USMTF`.
- Degraded fallback: minimum-safe export posture only with platform-by-platform release approval.

### `robotic-breach-lane-certification-v1`
- Use for robotic breach-lane certification and human-override governance before maneuver forces commit through cleared routes.
- Primary tools: `ts-joint-robotic-breach-lane-certification-human-override-v1`.
- Cross-check tools: `ts-joint-c2-fusion-v1`.
- Protocols: `CoT`, `VMF`, signed autonomy attestations, `API/JSON`, `USMTF`.
- Degraded fallback: manual breach certification only with explicit commander acceptance of reduced tempo.

## Profile Addendum U (2026-03-14, Human Sustainment, Recovery, and Family Continuity)

### `religious-affairs-moral-injury-support-v1`
- Use for command and chaplain decisions when protected spiritual care access, unit moral injury indicators, or accommodation friction threaten readiness.
- Primary tools: `ts-joint-religious-affairs-moral-injury-support-v1`.
- Cross-check tools: `ts-force-mental-health-postvention-v1`.
- Protocols: `HL7/FHIR`, signed care-referral manifests, `API/JSON`, `USMTF`.
- Degraded fallback: minimum coverage with paper referral controls and UTC acknowledgment log.

### `psychological-health-postvention-v1`
- Use for command postvention after suicide events when readiness stabilization, contagion-risk reduction, and trusted care coordination are time critical.
- Primary tools: `ts-force-mental-health-postvention-v1`.
- Cross-check tools: `ts-medical-force-health-v1`.
- Protocols: `HL7/FHIR`, `USMTF`, `API/JSON`.
- Degraded fallback: commander-approved manual postvention board with dual-review care handoffs.

### `veterinary-working-dog-support-v1`
- Use for working-dog and veterinary decisions when kennel capacity, zoonotic risk, or handler-team readiness drive deployment timing.
- Primary tools: `ts-joint-force-veterinary-working-dog-support-v1`.
- Cross-check tools: `ts-medical-force-health-v1`.
- Protocols: `HL7/FHIR`, signed veterinary transfer manifests, `API/JSON`, `USMTF`.
- Degraded fallback: life-saving treatment and mission-essential movement only with paper custody log.

### `field-nutrition-resilience-v1`
- Use for sustainment and force-health decisions when ration quality, hydration, or local protein supply determine endurance.
- Primary tools: `ts-expeditionary-field-nutrition-resilience-v1`.
- Cross-check tools: `ts-logistics-distribution-v1`.
- Protocols: `HL7/FHIR`, `OPC UA`, signed sustainment manifests, `API/JSON`, `USMTF`.
- Degraded fallback: mission-essential feeding only with daily water and cold-chain checks.

### `dental-maxillofacial-readiness-v1`
- Use for expeditionary medical planning when dental backlog, oral infection, or facial trauma threaten force availability and airway safety.
- Primary tools: `ts-expeditionary-dental-maxillofacial-readiness-v1`.
- Cross-check tools: `ts-medical-force-health-v1`.
- Protocols: `HL7/FHIR`, `DICOM`, signed dental-device manifests, `API/JSON`, `USMTF`.
- Degraded fallback: emergency-only dental treatment with commander-approved evacuation ladder.

### `musculoskeletal-load-physical-therapy-v1`
- Use for readiness decisions when load exposure and overuse injuries drive therapy demand faster than treatment capacity.
- Primary tools: `ts-theater-musculoskeletal-load-physical-therapy-v1`.
- Cross-check tools: `ts-medical-force-health-v1`.
- Protocols: `HL7/FHIR`, signed sensor manifests, `API/JSON`, `USMTF`.
- Degraded fallback: mission-essential task-lightening only with daily manual screening.

### `rehabilitation-prosthetics-return-to-duty-v1`
- Use for long-horizon recovery planning when rehabilitation milestones, prosthetic supply, and functional standards determine return-to-duty timing.
- Primary tools: `ts-joint-casualty-rehabilitation-prosthetics-return-to-duty-v1`.
- Cross-check tools: `ts-medical-force-health-v1`.
- Protocols: `HL7/FHIR`, `DICOM`, signed device manifests, `API/JSON`, `USMTF`.
- Degraded fallback: basic mobility milestone tracking only with command-approved reassessment intervals.

### `postal-ballot-family-contact-continuity-v1`
- Use for personnel-support continuity when postal flow, absentee ballots, or trusted family communication are disrupted by theater conditions.
- Primary tools: `ts-joint-deployed-postal-ballot-family-contact-continuity-v1`.
- Cross-check tools: `ts-physical-message-assurance-v1`.
- Protocols: `NIEM`, signed custody manifests, `S/MIME`, `API/JSON`, `USMTF`.
- Degraded fallback: courier-only custody ledger with dual-control ballot witness checks.

## Profile Addendum V (2026-03-15, Legitimacy, Safety, and Accountability)

### `sapr-restricted-reporting-unit-safety-v1`
- Use for: survivor-support and command-safety decisions when restricted-reporting boundaries, retaliation risk, and immediate care routing all matter.
- Primary tools: `ts-joint-sexual-assault-restricted-reporting-unit-safety-v1`.
- Cross-check tools: `ts-force-mental-health-postvention-v1`.
- Protocols: `HL7/FHIR`, `NIEM`, signed case manifests, `S/MIME`, `API/JSON`, `USMTF`.
- Degraded fallback: survivor-safety-first manual routing only with dual-review confidentiality checks.

### `cultural-property-no-strike-governance-v1`
- Use for: theater targeting and civil-legitimacy decisions when protected-site boundaries or cultural-property risk may constrain maneuver or fires.
- Primary tools: `ts-theater-cultural-property-no-strike-governance-v1`.
- Cross-check tools: `ts-joint-targeting-standards-cde-assurance-v1`.
- Protocols: `OGC`, `NIEM`, `USMTF`, `API/JSON`, signed geofence manifests.
- Degraded fallback: no-strike-by-default with manual geofence confirmation and legal review for any exception.

### `civilian-harm-condolence-claims-v1`
- Use for: restorative-action and legitimacy decisions when reported civilian harm may require acknowledgment, condolence payment, or formal claims review.
- Primary tools: `ts-joint-civilian-harm-condolence-claims-v1`.
- Cross-check tools: `ts-civil-support-v1`.
- Protocols: `NIEM`, signed claims manifests, `API/JSON`, `USMTF`, `S/MIME`.
- Degraded fallback: evidence-preservation and advisory-only recommendations until harm verification and legal review complete.

### `aircraft-crash-fire-rescue-foam-transition-v1`
- Use for: airbase emergency response when aircraft fires, foam-agent compatibility, and runway regeneration compete for commander attention.
- Primary tools: `ts-expeditionary-aircraft-crash-fire-rescue-foam-transition-v1`.
- Cross-check tools: `ts-airfield-recovery-v1`.
- Protocols: `NIMS/ICS`, `AIXM/FIXM`, `OGC`, `API/JSON`, `USMTF`.
- Degraded fallback: crew-rescue and exposure-control only with single-runway emergency hold and manual foam accounting.

### `combat-camera-pa-release-authenticity-v1`
- Use for: public-release and information-integrity decisions when source media may be manipulated, miscaptioned, or operationally sensitive.
- Primary tools: `ts-joint-combat-camera-public-affairs-release-authenticity-v1`.
- Cross-check tools: `ts-synthetic-media-watermark-assurance-v1`.
- Protocols: signed media manifests, `STANAG 4609` aligned exchange, `S/MIME`, `API/JSON`, `USMTF`, `STIX/TAXII`.
- Degraded fallback: commander-readable summary only with delayed media release until provenance and OPSEC checks pass.

### `property-book-sensitive-item-recapture-v1`
- Use for: logistics and force-protection decisions when missing weapons, crypto, optics, or other sensitive materiel may require rapid recovery or denial.
- Primary tools: `ts-theater-property-book-sensitive-item-recapture-v1`.
- Cross-check tools: `ts-logistics-distribution-v1`.
- Protocols: signed serial manifests, `NIEM`, `API/JSON`, `USMTF`, `S/MIME`, `STIX/TAXII`.
- Degraded fallback: dual-control manual accountability only with immediate compromise notification and restricted reissue.

### `live-fire-range-safety-autonomous-target-control-v1`
- Use for: live-fire training and test decisions when autonomous target motion or reduced-manning range controls could erode positive control.
- Primary tools: `ts-joint-live-fire-range-safety-autonomous-target-control-v1`.
- Cross-check tools: `ts-joint-c2-fusion-v1`.
- Protocols: `AIXM/FIXM`, `VMF`, `CoT`, `API/JSON`, `USMTF`, signed target-control manifests.
- Degraded fallback: static targets only with manual positive control and no autonomous motion.

### `dignified-transfer-funeral-honors-family-escort-v1`
- Use for: casualty-honor and family-support decisions when transfer timing, escort availability, and honors resources must remain synchronized.
- Primary tools: `ts-joint-dignified-transfer-funeral-honors-family-escort-v1`.
- Cross-check tools: `ts-joint-multi-theater-casualty-family-notification-integrity-v1`.
- Protocols: `HL7/FHIR`, `NIEM`, signed custody manifests, `S/MIME`, `API/JSON`, `USMTF`.
- Degraded fallback: essential custody and family-contact continuity only with manual honors coordination and protected identity handling.

## Profile Addendum W (2026-03-15, Directed Energy, Refueling Integrity, Mobility Reversion, Renal Continuity, EO Sensor Allocation, Shelter Survival, and Waveform Recovery)

### `directed-energy-airspace-reflection-safety-v1`
- Use for: engagement decisions when directed-energy beam geometry, reflective surfaces, or aviation deconfliction can invalidate release confidence.
- Primary tools: `ts-joint-directed-energy-airspace-reflection-safety-v1`.
- Cross-check tools: `ts-joint-c2-fusion-v1`.
- Protocols: `AIXM/FIXM`, `Link 16 J-series`, `VMF`, `CoT`, `API/JSON`, `USMTF`.
- Degraded fallback: no-fire or observe-only posture until beam path, exposure, and airspace conflicts are manually cleared.

### `aerial-refueling-fuel-contamination-reconstitution-v1`
- Use for: tanker recovery and receiver-priority decisions when contaminated fuel, filter uncertainty, or hose or boom outages threaten refuel continuity.
- Primary tools: `ts-joint-aerial-refueling-fuel-contamination-reconstitution-v1`.
- Cross-check tools: `ts-logistics-distribution-v1`.
- Protocols: signed fuel manifests, `AIXM/FIXM`, `API/JSON`, `USMTF`.
- Degraded fallback: mission-essential refuel only with manual fuel-chain verification and narrowed receiver release.

### `tsunami-port-sealift-regeneration-v1`
- Use for: homeland sealift and DSCA decisions when tsunami warning, berth damage, or channel closure require rapid port shutdown and regeneration sequencing.
- Primary tools: `ts-homeland-tsunami-port-closure-sealift-regeneration-v1`.
- Cross-check tools: `ts-civil-support-v1`.
- Protocols: `AIS/NMEA`, `OGC`, `EDXL-DE/CAP`, `API/JSON`, `USMTF`.
- Degraded fallback: one protected berth or cargo flow at a time with manual harbor-master and command approval.

### `coalition-rail-signaling-manual-block-reversion-v1`
- Use for: coalition force-flow decisions when automated signaling is degraded and host-nation rail movement must revert to manual-block control under military priority.
- Primary tools: `ts-coalition-host-nation-rail-signaling-manual-block-reversion-v1`.
- Cross-check tools: `ts-logistics-distribution-v1`.
- Protocols: `EDI`, `NIEM`, `OPC UA`, `API/JSON`, `USMTF`, NATO APP-11/ADatP-3 aligned exchange.
- Degraded fallback: low-tempo manual dispatch only with block-station readback and coalition command concurrence.

### `austere-hemodialysis-water-power-v1`
- Use for: medical continuity decisions when renal-support demand, water purity, and generator load all compete under austere conditions.
- Primary tools: `ts-joint-austere-hemodialysis-water-power-assurance-v1`.
- Cross-check tools: `ts-medical-force-health-v1`.
- Protocols: `HL7/FHIR`, signed water-quality manifests, `OPC UA`, `API/JSON`, `USMTF`.
- Degraded fallback: emergency dialysis only with medical-command review and shortened reassessment cycle.

### `eo-sensor-focal-plane-cryocooler-priority-v1`
- Use for: strategic allocation decisions when electro-optical sensor recovery is paced by focal-plane arrays, detector yield, or cryocooler availability.
- Primary tools: `ts-strategic-eo-sensor-focal-plane-cryocooler-priority-v1`.
- Cross-check tools: `ts-strategic-supply-shock-v1`.
- Protocols: signed lot manifests, `CCSDS`, `API/JSON`, `USMTF`.
- Degraded fallback: mission-essential sensor lines only with manual pedigree confirmation and narrowed release authority.

### `civilian-shelter-radiation-dosimetry-resupply-v1`
- Use for: homeland protection decisions when shelter occupancy, accumulated dose, and life-support resupply determine population survival and military-support timing.
- Primary tools: `ts-homeland-civilian-shelter-radiation-dosimetry-resupply-v1`.
- Cross-check tools: `ts-civil-support-v1`.
- Protocols: `NIMS/ICS`, `EDXL-DE/CAP`, `NIEM`, `API/JSON`, `USMTF`.
- Degraded fallback: life-safety-first sheltering with manual dose logs and convoy-by-convoy resupply approval.

### `sdr-waveform-key-hopset-reconstitution-v1`
- Use for: C2 and tactical-network recovery when lost keys, invalid hopsets, or compromise indicators threaten resilient radio operations.
- Primary tools: `ts-theater-sdr-waveform-key-hopset-emergency-reconstitution-v1`.
- Cross-check tools: `ts-cyber-defense-v1`.
- Protocols: signed key manifests, `Link 16 J-series`, `VMF`, `STIX/TAXII`, `API/JSON`, `USMTF`.
- Degraded fallback: narrowband authenticated voice only with manual COMSEC accounting and shortened rekey cycle.

## Profile Addendum X (2026-03-15, Ocular Readiness, Vector Control, Cold Injury, Women's Health, Reproductive Readiness, Blast Exposure, Barracks Air Quality, and Foot Health)

### `operational-vision-ocular-trauma-optical-readiness-v1`
- Use for: mission decisions when eye injury, degraded optics, or laser exposure can collapse sortie, patrol, or targeting effectiveness.
- Primary tools: `ts-joint-operational-vision-ocular-trauma-optical-readiness-v1`.
- Cross-check tools: `ts-medical-force-health-v1`.
- Protocols: `HL7/FHIR`, `DICOM`, signed optical-device manifests, `API/JSON`, `USMTF`.
- Degraded fallback: protective-eyewear discipline and paper triage with manual evacuation approval.

### `vector-control-field-epidemiology-v1`
- Use for: force-health decisions when vector density, habitat growth, or suspected arthropod-borne outbreaks require rapid preventive action.
- Primary tools: `ts-expeditionary-vector-control-field-epidemiology-v1`.
- Cross-check tools: `ts-medical-force-health-v1`.
- Protocols: `HL7/FHIR`, `OGC`, signed trap or sample manifests, `API/JSON`, `USMTF`.
- Degraded fallback: targeted habitat denial only with daily command review and manual pesticide accountability.

### `cold-injury-frostbite-rewarming-v1`
- Use for: Arctic and wet-cold decisions when warming capacity, casualty routing, and exposure control determine survival and unit tempo.
- Primary tools: `ts-joint-cold-injury-frostbite-rewarming-v1`.
- Cross-check tools: `ts-medical-force-health-v1`.
- Protocols: `HL7/FHIR`, signed cold-exposure manifests, `API/JSON`, `USMTF`.
- Degraded fallback: essential warming and evacuation only with voice-confirmed casualty handoff.

### `womens-health-contested-obstetric-support-v1`
- Use for: women's health and obstetric routing decisions when maternal-fetal safety, privacy, and specialty transport all compete under contested conditions.
- Primary tools: `ts-joint-womens-health-contested-obstetric-support-v1`.
- Cross-check tools: `ts-role3-medical-aeromedical-network-v1`.
- Protocols: `HL7/FHIR`, `DICOM`, signed maternal-transfer manifests, `API/JSON`, `USMTF`.
- Degraded fallback: life-saving obstetric routing only with protected voice handoff and manual consent tracking.

### `reproductive-health-contraception-sti-readiness-v1`
- Use for: readiness decisions when protected reproductive-health access, pharmacy continuity, or STI diagnostic throughput affect force availability.
- Primary tools: `ts-theater-reproductive-health-contraception-sti-readiness-v1`.
- Cross-check tools: `ts-medical-force-health-v1`.
- Protocols: `HL7/FHIR`, signed pharmacy manifests, `API/JSON`, `USMTF`.
- Degraded fallback: essential medication continuation only with dual-review privacy controls.

### `blast-overpressure-breacher-readiness-v1`
- Use for: training and mission decisions when cumulative concussive exposure, breacher qualifications, or symptom follow-up affect safe employment.
- Primary tools: `ts-joint-blast-overpressure-breacher-readiness-v1`.
- Cross-check tools: `ts-battlefield-hearing-conservation-v1`.
- Protocols: signed sensor manifests, `HL7/FHIR`, `VMF`, `API/JSON`, `USMTF`.
- Degraded fallback: no-growth training posture with manual exposure logging and medical review.

### `barracks-hvac-mold-indoor-air-quality-v1`
- Use for: life-support decisions when HVAC failure, mold spread, or indoor-air contamination threatens unit housing and respiratory readiness.
- Primary tools: `ts-expeditionary-barracks-hvac-mold-indoor-air-quality-v1`.
- Cross-check tools: `ts-civil-support-v1`.
- Protocols: `OPC UA`, `OGC`, `NIMS/ICS`, `API/JSON`, `USMTF`.
- Degraded fallback: occupancy cap and room-by-room quarantine with command readback only.

### `foot-health-trench-foot-load-bearing-readiness-v1`
- Use for: maneuver and sustainment decisions when boot fit, sock rotation, and immersion-injury risk determine march endurance.
- Primary tools: `ts-joint-foot-health-trench-foot-load-bearing-readiness-v1`.
- Cross-check tools: `ts-medical-force-health-v1`.
- Protocols: `HL7/FHIR`, signed footwear manifests, `API/JSON`, `USMTF`.
- Degraded fallback: shortened movement windows with manual sock and boot accountability.

## Profile Addendum Y (2026-03-15, Industrial Hygiene, Aviation Physiology, Dive Medicine, Toxicology, Food Protection, Hazardous Waste, Substance-Use Risk, and Sleep Recovery)

### `industrial-hygiene-occupational-exposure-v1`
- Use for: expeditionary site decisions when sampling, exposure limits, PPE posture, and permit-to-work controls determine safe continuation.
- Primary tools: `ts-expeditionary-industrial-hygiene-occupational-exposure-v1`.
- Cross-check tools: `ts-medical-force-health-v1`.
- Protocols: `HL7/FHIR`, signed sample manifests, `OPC UA`, `OGC`, `API/JSON`, `USMTF`.
- Degraded fallback: short-duration work only with manual sampling log, respirator check, and daily command review.

### `aviation-physiology-hypoxia-life-support-v1`
- Use for: flight-safety decisions when hypoxia, acceleration stress, decompression concerns, or life-support discrepancies threaten crew release.
- Primary tools: `ts-joint-aviation-physiology-hypoxia-life-support-v1`.
- Cross-check tools: `ts-theater-aircrew-fatigue-circadian-countermeasure-v1`.
- Protocols: `HL7/FHIR`, `AIXM/FIXM`, signed life-support manifests, `API/JSON`, `USMTF`.
- Degraded fallback: minimum-risk sortie posture with manual discrepancy tracking and protected voice release approval.

### `dive-medicine-hyperbaric-routing-v1`
- Use for: maritime and undersea decisions when pressure injury, chamber capacity, or rescue routing determines diver survivability and mission continuity.
- Primary tools: `ts-joint-dive-medicine-hyperbaric-routing-v1`.
- Cross-check tools: `ts-submarine-rescue-v1`.
- Protocols: `HL7/FHIR`, `DICOM`, signed dive-profile manifests, `OGC`, `API/JSON`, `USMTF`.
- Degraded fallback: life-saving routing only with voice-confirmed casualty handoff and manual chamber allocation.

### `occupational-toxicology-solvent-fuel-heavy-metal-v1`
- Use for: theater force-health decisions when toxic industrial or maintenance exposures must be sampled, isolated, and medically trended.
- Primary tools: `ts-theater-occupational-toxicology-solvent-fuel-heavy-metal-v1`.
- Cross-check tools: `ts-expeditionary-industrial-hygiene-occupational-exposure-v1`.
- Protocols: `HL7/FHIR`, signed lab manifests, `OPC UA`, `OGC`, `API/JSON`, `USMTF`.
- Degraded fallback: isolate affected work areas and track symptoms manually until verified samples and reviews complete.

### `food-protection-inspection-sanitation-v1`
- Use for: field-feeding decisions when source pedigree, cold-chain status, or sanitation controls determine outbreak risk and ration continuity.
- Primary tools: `ts-expeditionary-food-protection-inspection-sanitation-v1`.
- Cross-check tools: `ts-expeditionary-field-nutrition-resilience-v1`.
- Protocols: `HL7/FHIR`, signed inspection manifests, `NIEM`, `API/JSON`, `USMTF`.
- Degraded fallback: sealed-ration-only posture with manual source approval and daily sanitation review.

### `hazardous-waste-burn-pit-ash-exposure-v1`
- Use for: base-support and compliance decisions when waste backlog, emissions, or ash exposure can invalidate continued operations.
- Primary tools: `ts-theater-hazardous-waste-burn-pit-ash-exposure-v1`.
- Cross-check tools: `ts-expeditionary-industrial-hygiene-occupational-exposure-v1`.
- Protocols: signed waste manifests, `OPC UA`, `OGC`, `NIMS/ICS`, `API/JSON`, `USMTF`.
- Degraded fallback: essential disposal only with manual manifests, visual plume controls, and command readback.

### `substance-use-overdose-impaired-duty-v1`
- Use for: command-safety decisions when overdose or impairment may require immediate care, restricted duty, or protected referral.
- Primary tools: `ts-joint-substance-use-overdose-impaired-duty-v1`.
- Cross-check tools: `ts-joint-psychological-health-postvention-command-support-v1`.
- Protocols: `HL7/FHIR`, `NIEM`, signed case manifests, `S/MIME`, `API/JSON`, `USMTF`.
- Degraded fallback: life-safety-first response with manual duty restrictions and protected voice care handoff only.

### `sleep-recovery-shift-work-fatigue-restoration-v1`
- Use for: theater staffing decisions when chronic sleep loss or unstable shifts threaten mission quality outside specialized watchfloor or aircrew cells.
- Primary tools: `ts-theater-sleep-recovery-shift-work-fatigue-restoration-v1`.
- Cross-check tools: `ts-theater-aircrew-fatigue-circadian-countermeasure-v1`.
- Protocols: `HL7/FHIR`, signed schedule manifests, `API/JSON`, `USMTF`, NATO APP-11/ADatP-3 aligned exchange.
- Degraded fallback: short-duration protected-rest windows only with paper rosters and voice-confirmed staffing handoffs.

## Profile Addendum Z (2026-03-15, Escalation Control, Regulatory Continuity, Sealift Crewing Risk, Hydrogen Safety, Finance Continuity, Launch Warning Integration, Coalition Digital Twins, Pediatric Reunification, Battle-Damage Contracting, and Robotic Casualty Extraction)

### `ceasefire-hotline-escalation-control-v1`
- Use for: joint deconfliction decisions when hotline identity, incident acknowledgment, and escalation restraint determine whether tactical friction widens into strategic confrontation.
- Primary tools: `ts-joint-contested-ceasefire-hotline-escalation-control-v1`.
- Cross-check tools: `ts-joint-c2-fusion-v1`.
- Protocols: `USMTF`, `S/MIME`, `NIEM`, `API/JSON`, NATO APP-11/ADatP-3 aligned exchange.
- Degraded fallback: advisory-only incident relay until dual acknowledgment and authority checks are complete.

### `spectrum-license-regulatory-emissions-continuity-v1`
- Use for: EMSO and network decisions when host-nation regulation, waiver timing, or emergency emissions control determine legal and interoperable employment.
- Primary tools: `ts-theater-spectrum-license-host-nation-regulatory-emissions-continuity-v1`.
- Cross-check tools: `ts-spectrum-governance-v1`.
- Protocols: `NIEM`, `S/MIME`, `API/JSON`, `USMTF`, NATO APP-11/ADatP-3 aligned exchange.
- Degraded fallback: mission-essential emissions only with hourly legal and spectrum-manager review.

### `merchant-mariner-flag-sanctions-risk-v1`
- Use for: strategic mobility decisions when crew scarcity, registry friction, or sanctions exposure can strand chartered lift before embarkation.
- Primary tools: `ts-strategic-merchant-mariner-crewing-flag-sanctions-risk-v1`.
- Cross-check tools: `ts-logistics-distribution-v1`.
- Protocols: `AIS/NMEA`, `EDI`, signed crewing manifests, `API/JSON`, `USMTF`.
- Degraded fallback: mission-essential hulls only with manual registry review and daily crew readiness confirmation.

### `battlefield-hydrogen-blast-safety-v1`
- Use for: expeditionary energy decisions when hydrogen generation, storage density, or ignition hazards determine whether fuel-cell power is worth the risk.
- Primary tools: `ts-expeditionary-hydrogen-production-storage-blast-safety-v1`.
- Cross-check tools: `ts-energy-physical-cyber-convergence-v1`.
- Protocols: `OPC UA`, signed safety manifests, `NIMS/ICS`, `API/JSON`, `USMTF`.
- Degraded fallback: minimum-safe production only with dual safety officer review and reduced storage density.

### `deployed-finance-disbursing-continuity-v1`
- Use for: theater support decisions when payroll, disbursing, and local cash access affect force endurance, trust, and discipline.
- Primary tools: `ts-joint-deployed-finance-cash-payroll-disbursing-continuity-v1`.
- Cross-check tools: `ts-logistics-distribution-v1`.
- Protocols: `ISO 20022`, signed disbursing manifests, `NIEM`, `API/JSON`, `S/MIME`, `USMTF`.
- Degraded fallback: mission-essential pay and cash advances only with daily dual-control reconciliation.

### `space-launch-hazard-civil-warning-integration-v1`
- Use for: launch and reentry decisions when hazard footprints, civil alerts, and marine or air corridor closures must stay synchronized.
- Primary tools: `ts-joint-space-launch-hazard-area-civil-warning-integration-v1`.
- Cross-check tools: `ts-space-satcom-v1`.
- Protocols: `AIXM/FIXM`, `AIS/NMEA`, `CCSDS`, `EDXL-DE/CAP`, `API/JSON`, `USMTF`.
- Degraded fallback: launch hold or restricted corridor release only with manual maritime, aviation, and civil readback.

### `coalition-digital-twin-baseline-reconciliation-v1`
- Use for: coalition planning and systems decisions when model drift or configuration mismatch threatens a common release-safe technical picture.
- Primary tools: `ts-coalition-mission-digital-twin-baseline-reconciliation-v1`.
- Cross-check tools: `ts-cyber-defense-v1`.
- Protocols: signed configuration manifests, `API/JSON`, `OGC`, `NIEM`, `USMTF`, NATO APP-11/ADatP-3 aligned exchange.
- Degraded fallback: frozen release with advisory-only delta reporting until authoritative baseline confirmation.

### `pediatric-behavioral-health-guardian-reunification-v1`
- Use for: medical and civil-support decisions when child safety depends on rapid behavioral stabilization, verified custody, and protected evacuation.
- Primary tools: `ts-joint-austere-pediatric-behavioral-health-guardian-reunification-v1`.
- Cross-check tools: `ts-medical-force-health-v1`.
- Protocols: `HL7/FHIR`, `NIEM`, signed guardian manifests, `API/JSON`, `S/MIME`, `USMTF`.
- Degraded fallback: life-safety and child-protection routing only with manual identity checks and protected voice handoff.

### `battle-damage-contracting-vendor-vetting-v1`
- Use for: recovery decisions when emergency local contracting is required but vendor trust, corruption risk, and payment integrity are unresolved.
- Primary tools: `ts-theater-battle-damage-contracting-vendor-vetting-payment-v1`.
- Cross-check tools: `ts-logistics-distribution-v1`.
- Protocols: signed vendor manifests, `STIX/TAXII`, `NIEM`, `API/JSON`, `USMTF`, `S/MIME`.
- Degraded fallback: mission-essential awards only with dual-control payment release and daily fraud review.

### `robotic-casualty-extraction-human-override-v1`
- Use for: casualty movement decisions when robotic extraction can reduce exposure only if human override, route safety, and medic handoff remain trustworthy.
- Primary tools: `ts-joint-robotic-casualty-extraction-human-override-safety-v1`.
- Cross-check tools: `ts-medical-force-health-v1`.
- Protocols: `CoT`, `VMF`, `HL7/FHIR`, signed autonomy manifests, `API/JSON`, `USMTF`.
- Degraded fallback: human-only extraction or hold-in-place stabilization until override and route risks are cleared.

## Profile Addendum AA (2026-03-15, Flight Medicine, Ship Survivability, EOD Exploitation, Prime Power, External Lift, Beachmaster Control, Aircrew Gear, Riverine Maintenance, Flightline Armament, and Cold-Weather Discipline)

### `flight-surgeon-aeromedical-waiver-v1`
- Use for: aviation decisions when crew medical status, medications, or unresolved life-support discrepancies could change sortie-release posture.
- Primary tools: `ts-joint-flight-surgeon-aeromedical-waiver-v1`.
- Cross-check tools: `ts-joint-aviation-physiology-hypoxia-life-support-v1`.
- Protocols: `HL7/FHIR`, `AIXM/FIXM`, signed waiver manifests, `API/JSON`, `USMTF`.
- Degraded fallback: manual waiver and restriction tracking only with surgeon voice approval and UTC readback.

### `naval-damage-control-battle-stability-v1`
- Use for: naval combat decisions when flooding, fire, or power casualties make survivability and battle-stability the pacing constraint.
- Primary tools: `ts-naval-damage-control-battle-stability-v1`.
- Cross-check tools: `ts-maritime-undersea-v1`.
- Protocols: `AIS/NMEA`, `OGC`, signed damage-control manifests, `API/JSON`, `USMTF`.
- Degraded fallback: fight-for-survival posture only with manual plot updates and conservative stability assumptions.

### `eod-render-safe-site-exploitation-v1`
- Use for: EOD and force-protection decisions when render-safe actions must preserve exploitation value and evidence integrity.
- Primary tools: `ts-joint-eod-render-safe-site-exploitation-v1`.
- Cross-check tools: `ts-detainee-accountability-v1`.
- Protocols: `USMTF`, `NIEM`, `STIX/TAXII`, signed evidence manifests, `API/JSON`, `OGC`.
- Degraded fallback: cordon-and-hold posture only with no exploitation handoff until authority is verified.

### `prime-power-generator-load-balance-v1`
- Use for: expeditionary infrastructure decisions when generator failures or load spikes threaten mission-essential electrical continuity.
- Primary tools: `ts-expeditionary-prime-power-generator-load-balance-v1`.
- Cross-check tools: `ts-civil-support-v1`.
- Protocols: `OPC UA`, signed maintenance manifests, `OGC`, `API/JSON`, `USMTF`.
- Degraded fallback: mission-essential circuits only with manual meter checks and fixed load caps.

### `sling-load-external-lift-certification-v1`
- Use for: assault-support and resupply decisions when sling-load data, hook-up quality, or lift-window conditions could invalidate external lift.
- Primary tools: `ts-joint-sling-load-external-lift-certification-v1`.
- Cross-check tools: `ts-joint-c2-fusion-v1`.
- Protocols: `AIXM/FIXM`, `VMF`, signed load manifests, `API/JSON`, `USMTF`.
- Degraded fallback: reduced-load or no-lift posture with manual voice confirmation only.

### `beachmaster-surf-zone-shore-party-control-v1`
- Use for: amphibious or sea-to-shore decisions when surf limits, lane control, and shore-party timing determine usable throughput.
- Primary tools: `ts-amphibious-beachmaster-surf-zone-shore-party-control-v1`.
- Cross-check tools: `ts-joint-littoral-underwater-obstacle-reduction-beach-recon-v1`.
- Protocols: `OGC`, `CoT`, `VMF`, `AIS/NMEA`, `USMTF`.
- Degraded fallback: single-lane or lifesaving release only with conservative surf thresholds and voice lane-control readback.

### `aircrew-flight-equipment-survival-gear-v1`
- Use for: aviation-safety decisions when life-support equipment, survival beacons, or protective ensembles may constrain sortie execution or recovery confidence.
- Primary tools: `ts-expeditionary-aircrew-flight-equipment-survival-gear-v1`.
- Cross-check tools: `ts-joint-aviation-physiology-hypoxia-life-support-v1`.
- Protocols: `HL7/FHIR`, signed life-support manifests, `AIXM/FIXM`, `API/JSON`, `USMTF`.
- Degraded fallback: mission-essential sorties only with manual inspection attestation and protected voice release.

### `small-craft-riverine-maintenance-spares-v1`
- Use for: riverine operations decisions when craft readiness, engine faults, or scarce repair parts drive patrol coverage risk.
- Primary tools: `ts-joint-small-craft-riverine-maintenance-spares-v1`.
- Cross-check tools: `ts-logistics-distribution-v1`.
- Protocols: `AIS/NMEA`, `VMF`, signed maintenance manifests, `API/JSON`, `USMTF`.
- Degraded fallback: mission-priority craft only with manual launch restrictions and daily readiness review.

### `flightline-weapons-loading-armament-safety-v1`
- Use for: sortie-generation decisions when armed-aircraft loading must stay synchronized with crew certification and explosive-safety control.
- Primary tools: `ts-joint-flightline-weapons-loading-armament-safety-v1`.
- Cross-check tools: `ts-fires-airspace-v1`.
- Protocols: `AIXM/FIXM`, signed load manifests, `API/JSON`, `USMTF`, `CoT`.
- Degraded fallback: reduced-load posture only with manual certification and restricted ramp operations.

### `cold-weather-clothing-frostbite-discipline-v1`
- Use for: arctic and cold-weather readiness decisions when issue posture, wet-gear churn, and warming discipline determine exposure risk.
- Primary tools: `ts-joint-cold-weather-clothing-frostbite-discipline-v1`.
- Cross-check tools: `ts-joint-cold-injury-frostbite-rewarming-v1`.
- Protocols: `HL7/FHIR`, signed clothing manifests, `OGC`, `API/JSON`, `USMTF`.
- Degraded fallback: short-duration exposure only with manual gear checks and timed warming intervals.

## Profile Addendum AB (2026-03-15, Fires Meteorology, Airfield Observation, Aerial Delivery Rigging, Munitions Safety, Wet-Gap Bridging, and Flightline Support)

### `ballistic-meteorology-fire-support-calibration-v1`
- Use for: fires decisions when ballistic-met freshness, correction quality, or survey alignment could shift accuracy enough to alter commander risk.
- Primary tools: `ts-joint-ballistic-meteorology-fire-support-calibration-v1`.
- Cross-check tools: `ts-fires-airspace-v1`.
- Protocols: `VMF`, `USMTF`, `iwxxm`, `OGC`, `API/JSON`.
- Degraded fallback: conservative fire-support posture only with manual corrections and command readback.

### `airfield-weather-observation-sensor-maintenance-v1`
- Use for: airfield operations decisions when weather-sensor outages or drift can invalidate launch or recovery minima.
- Primary tools: `ts-expeditionary-airfield-weather-observation-sensor-maintenance-v1`.
- Cross-check tools: `ts-joint-c2-fusion-v1`.
- Protocols: `AIXM/FIXM/iwxxm`, signed observation manifests, `API/JSON`, `OGC`, `USMTF`.
- Degraded fallback: manual observation and conservative weather minima only with scheduled readback.

### `aerial-delivery-rigging-parachute-inspection-v1`
- Use for: air-delivery decisions when parachute serviceability, rigging certification, or load derivation could invalidate safe release.
- Primary tools: `ts-joint-aerial-delivery-rigging-parachute-inspection-v1`.
- Cross-check tools: `ts-logistics-distribution-v1`.
- Protocols: `AIXM/FIXM`, `VMF`, signed rigging manifests, `API/JSON`, `USMTF`.
- Degraded fallback: reduced-load or hold posture with manual certification and voice confirmation only.

### `heavy-drop-platform-rigging-retrograde-v1`
- Use for: heavy-equipment airdrop decisions when platform rigging, extraction-system confidence, or retrograde recovery will determine usable delivery throughput.
- Primary tools: `ts-theater-heavy-drop-platform-rigging-retrograde-recovery-v1`.
- Cross-check tools: `ts-logistics-distribution-v1`.
- Protocols: `AIXM/FIXM`, `VMF`, `CoT`, signed load manifests, `API/JSON`, `USMTF`.
- Degraded fallback: reduced platform set or no-drop posture with manual release readback only.

### `ammunition-surveillance-lot-serviceability-v1`
- Use for: sustainment and fires-support decisions when ammunition lot drift, defects, or malfunction evidence could change safe issue posture.
- Primary tools: `ts-joint-ammunition-surveillance-lot-serviceability-v1`.
- Cross-check tools: `ts-logistics-distribution-v1`.
- Protocols: signed surveillance manifests, `NIEM`, `OGC`, `API/JSON`, `USMTF`.
- Degraded fallback: restricted issue only with daily surveillance review and dual-control release.

### `net-explosive-weight-munitions-compatibility-v1`
- Use for: storage and movement decisions when mixed munitions density, exposed-site distance, or compatibility rules drive blast risk.
- Primary tools: `ts-theater-net-explosive-weight-munitions-compatibility-v1`.
- Cross-check tools: `ts-fires-airspace-v1`.
- Protocols: `OGC`, signed storage manifests, `NIEM`, `API/JSON`, `USMTF`.
- Degraded fallback: emergency separation only with manual blast arcs and commander readback.

### `ribbon-bridge-maintenance-raft-launch-v1`
- Use for: wet-gap crossing decisions when ribbon-bridge bay health, launch cadence, or anchorage confidence controls throughput.
- Primary tools: `ts-expeditionary-ribbon-bridge-maintenance-raft-launch-v1`.
- Cross-check tools: `ts-logistics-distribution-v1`.
- Protocols: `VMF`, `CoT`, `OGC`, signed maintenance manifests, `USMTF`.
- Degraded fallback: reduced-throughput crossing only with manual bay counts and timed launch windows.

### `bridge-erection-boat-gap-crossing-recovery-v1`
- Use for: engineer mobility decisions when boat propulsion losses, rescue posture, or tow capacity threaten bridge emplacement and crossing safety.
- Primary tools: `ts-joint-bridge-erection-boat-gap-crossing-recovery-v1`.
- Cross-check tools: `ts-logistics-distribution-v1`.
- Protocols: `AIS/NMEA`, `VMF`, `OGC`, signed maintenance manifests, `API/JSON`, `USMTF`.
- Degraded fallback: essential-span emplacement only with tow escort and manual readiness board.

### `flightline-ground-support-equipment-readiness-v1`
- Use for: sortie-generation decisions when AGE dispatch, cart scarcity, or line cross-servicing becomes the pacing constraint.
- Primary tools: `ts-expeditionary-flightline-ground-support-equipment-readiness-v1`.
- Cross-check tools: `ts-logistics-distribution-v1`.
- Protocols: `AIXM/FIXM`, signed maintenance manifests, `API/JSON`, `OGC`, `USMTF`.
- Degraded fallback: mission-essential sorties only with fixed cart windows and manual sign-out.

### `aircraft-hydraulic-contamination-servicing-v1`
- Use for: aviation-maintenance decisions when hydraulic contamination, servicing release, or component isolation could change safe-to-fly posture.
- Primary tools: `ts-joint-aircraft-hydraulic-contamination-servicing-v1`.
- Cross-check tools: `ts-logistics-distribution-v1`.
- Protocols: signed maintenance manifests, `AIXM/FIXM`, `OPC UA`, `API/JSON`, `USMTF`.
- Degraded fallback: no-fly or reduced-maneuver posture only with manual sampling and component isolation.

## Profile Addendum AC (2026-03-15, Advisor Protection, Rumor Control, Cold-Weather Sortie Recovery, Harbor Reopening, Launch Abort Recovery, Signing-Key Reconstitution, Emitter Trust, Riverine Mobility, TIC Triage, and Host-Nation Liability)

### `coalition-partner-force-insider-advisor-protection-v1`
- Use for: advisor-mission decisions when partner-force access depends on insider-risk screening, movement security, and counterpart trust.
- Primary tools: `ts-coalition-partner-force-insider-threat-advisor-protection-v1`.
- Cross-check tools: `ts-intel-fusion-v1`.
- Protocols: `NIEM`, `USMTF`, `STIX/TAXII`, `S/MIME`, `API/JSON`, `CoT`.
- Degraded fallback: essential engagements only with dual-review screening and hardened escort posture.

### `civilian-sensor-rumor-control-v1`
- Use for: civil-protection and legitimacy decisions when crowdsourced reports, public warnings, or rumor spikes could distort operations.
- Primary tools: `ts-joint-civilian-sensor-report-veracity-rumor-control-v1`.
- Cross-check tools: `ts-disinformation-counter-v1`.
- Protocols: `CAP`, `NIEM`, `OGC`, `STIX/TAXII`, `API/JSON`, `S/MIME`.
- Degraded fallback: command-approved warnings only after manual corroboration and delayed release.

### `cold-weather-deicing-sortie-recovery-v1`
- Use for: airbase launch and recovery decisions when freezing weather, fluid scarcity, or holdover limits threaten sortie generation.
- Primary tools: `ts-expeditionary-cold-weather-aircraft-deicing-sortie-recovery-v1`.
- Cross-check tools: `ts-airfield-recovery-v1`.
- Protocols: `METAR/TAF`, `AIXM/FIXM`, signed maintenance manifests, `API/JSON`, `USMTF`.
- Degraded fallback: mission-essential sorties only with manual holdover tracking and widened safety margins.

### `harbor-mcm-merchant-reroute-v1`
- Use for: maritime access decisions when ports face mine threat, uncertain channels, or urgent merchant rerouting.
- Primary tools: `ts-coalition-harbor-mcm-merchant-reroute-v1`.
- Cross-check tools: `ts-maritime-undersea-v1`.
- Protocols: `AIS/NMEA`, `OGC`, `API/JSON`, `USMTF`, NATO APP-11/ADatP-3 aligned exchange.
- Degraded fallback: channel closed by default with mission-essential movement only and manual survey correlation.

### `launch-abort-range-evacuation-v1`
- Use for: launch and range-safety decisions when abort modes, debris hazards, or rescue timelines could shift life-safety posture.
- Primary tools: `ts-joint-space-launch-abort-recovery-range-evacuation-v1`.
- Cross-check tools: `ts-space-satcom-v1`.
- Protocols: `CCSDS`, `AIXM/FIXM`, `CAP`, `OGC`, `API/JSON`, `USMTF`.
- Degraded fallback: life-safety-first evacuation and recovery only with conservative danger footprints.

### `signing-key-loss-emergency-reconstitution-v1`
- Use for: mission-software continuity decisions when signing-key compromise or loss threatens trusted updates and rollback-safe recovery.
- Primary tools: `ts-theater-software-signing-key-loss-emergency-reconstitution-v1`.
- Cross-check tools: `ts-cyber-defense-v1`.
- Protocols: `X.509`, `OCSP/CRL`, signed artifact manifests, `API/JSON`, `STIX/TAXII`, `USMTF`.
- Degraded fallback: freeze non-essential releases and allow only preapproved binaries under dual control.

### `emitter-impostor-rebroadcast-detection-v1`
- Use for: air-defense and EW decisions when spoofed or replayed friendly emitters could trigger fratricide or route-control errors.
- Primary tools: `ts-joint-friendly-emitter-impostor-rebroadcast-detection-v1`.
- Cross-check tools: `ts-spectrum-governance-v1`.
- Protocols: `Link 16 J-series`, `VMF`, `CoT`, `API/JSON`, SIGINT metadata manifests, `USMTF`.
- Degraded fallback: authenticated challenge-and-response only with human confirmation before posture changes.

### `small-craft-riverine-mobility-surge-v1`
- Use for: sustainment and riverine-mobility decisions when boats, outboards, and repair flow become strategic bottlenecks.
- Primary tools: `ts-strategic-small-craft-outboard-riverine-mobility-surge-v1`.
- Cross-check tools: `ts-logistics-distribution-v1`.
- Protocols: `NIEM`, signed serial manifests, `API/JSON`, `USMTF`, `AIS/NMEA`.
- Degraded fallback: mission-essential craft allocation only with manual serial tracking and repair triage.

### `toxic-industrial-chemical-decon-triage-v1`
- Use for: force-health and movement decisions when toxic industrial releases create combined medical, decon, and operational hazards.
- Primary tools: `ts-joint-toxic-industrial-chemical-exposure-decon-triage-v1`.
- Cross-check tools: `ts-medical-force-health-v1`.
- Protocols: `HL7/FHIR`, `OGC`, `CAP`, `NIEM`, `API/JSON`, `USMTF`.
- Degraded fallback: life-safety-first triage only with manual zoning and delayed return-to-duty decisions.

### `host-nation-force-protection-claims-liability-v1`
- Use for: coalition access and legitimacy decisions when incidents drive claims, liability, or force-protection renegotiation with host nations.
- Primary tools: `ts-coalition-host-nation-force-protection-claims-liability-v1`.
- Cross-check tools: `ts-civil-support-v1`.
- Protocols: `NIEM`, NATO APP-11/ADatP-3 aligned exchange, signed claims manifests, `API/JSON`, `USMTF`, `S/MIME`.
- Degraded fallback: advisory-only legal framing with no concession language and manual senior review.

## Profile Addendum AD (2026-03-15, Renal Continuity, Fatigue Governance, Wildland Airspace, Mission Licensing, Littoral Trafficability, Space Safe-Mode Recovery, Ammunition Yard Fire, and Captured Media Escalation)

### `renal-replacement-crush-surge-v1`
- Use for: medical and prolonged-field-care decisions when crush injuries, renal failure, or dialysis consumables determine survivability and evacuation order.
- Primary tools: `ts-expeditionary-renal-replacement-crush-surge-v1`.
- Cross-check tools: `ts-medical-force-health-v1`.
- Protocols: `HL7/FHIR`, signed device manifests, `API/JSON`, `USMTF`, `NIEM`.
- Degraded fallback: lifesaving triage and manual electrolyte-control board only with command-approved transfer prioritization.

### `circadian-fatigue-watchbill-v1`
- Use for: command and readiness decisions when fatigue debt, crew-rest erosion, or watchbill fragility threaten safe mission tempo.
- Primary tools: `ts-theater-circadian-fatigue-watchbill-v1`.
- Cross-check tools: `ts-medical-force-health-v1`.
- Protocols: `HL7/FHIR`, signed sensor manifests, `API/JSON`, `USMTF`, `NIEM`.
- Degraded fallback: manual watchbill board with conservative crew-rest windows and command-approved risk acceptance.

### `wildland-fire-airspace-retardant-v1`
- Use for: DSCA aviation and base-protection decisions when wildland fire, smoke, and retardant scarcity compete with military airspace priorities.
- Primary tools: `ts-homeland-wildland-fire-airspace-retardant-priority-v1`.
- Cross-check tools: `ts-civil-support-v1`.
- Protocols: `NIMS/ICS`, `AIXM/FIXM`, `CAP`, `OGC`, `API/JSON`, `USMTF`.
- Degraded fallback: life-safety-first airspace board with manual retardant accounting and command-approved sortie holds.

### `mission-license-offline-activation-v1`
- Use for: mission-system continuity decisions when license failure, disconnected operation, or vendor dependence threatens operational uptime.
- Primary tools: `ts-theater-mission-license-offline-activation-v1`.
- Cross-check tools: `ts-cyber-defense-v1`.
- Protocols: signed entitlement manifests, `X.509`, `API/JSON`, `STIX/TAXII`, `USMTF`.
- Degraded fallback: mission-essential services only with manual entitlement ledger and preapproved binary allowlist.

### `surf-zone-breach-trafficability-v1`
- Use for: littoral-entry decisions when hydrography, obstacle reduction, and beach trafficability determine landing-wave release timing.
- Primary tools: `ts-joint-amphibious-surf-zone-breach-trafficability-v1`.
- Cross-check tools: `ts-maritime-undersea-v1`.
- Protocols: `OGC`, `AIS/NMEA`, `VMF`, `CoT`, signed hydrographic manifests, `USMTF`.
- Degraded fallback: beach-by-beach manual release board with conservative surf windows and reduced throughput assumptions.

### `space-charging-safe-mode-recovery-v1`
- Use for: space-operations decisions when electrostatic charging, safe-mode entry, or limited contact windows threaten service restoration tempo.
- Primary tools: `ts-space-electrostatic-charging-safe-mode-recovery-v1`.
- Cross-check tools: `ts-space-satcom-v1`.
- Protocols: `CCSDS`, signed telemetry manifests, `API/JSON`, `OGC`, `USMTF`.
- Degraded fallback: conservative safe-mode hold with manually prioritized service restoration and longer contact spacing.

### `ammunition-yard-fire-compatibility-v1`
- Use for: sustainment and force-protection decisions when burning or threatened munitions demand compatibility separation and emergency relocation.
- Primary tools: `ts-theater-ammunition-yard-fire-compatibility-v1`.
- Cross-check tools: `ts-logistics-distribution-v1`.
- Protocols: `OGC`, signed storage manifests, `NIEM`, `API/JSON`, `USMTF`, `CoT`.
- Degraded fallback: yard closure with manual blast-arc board, restricted firefighting exposure, and command-approved emergency issue routing.

### `captured-media-viral-escalation-v1`
- Use for: information, legal, and release-governance decisions when seized or battlefield media could trigger viral escalation or compromise operations.
- Primary tools: `ts-joint-captured-media-exploitation-viral-escalation-v1`.
- Cross-check tools: `ts-disinformation-counter-v1`.
- Protocols: signed media manifests, `STANAG 4609` aligned exchange, `S/MIME`, `API/JSON`, `STIX/TAXII`, `USMTF`.
- Degraded fallback: hold media by default with manual provenance review and commander-approved text-only summaries.

## Toolchain Wave LXXV (2026-04-07, Emergency Leave, EFMP Continuity, Survivor Benefits, PCS Recovery, TRICARE Bridging, and Relief-Society Hardship Support)

### `emergency-leave-arc-message-v1`
- Use for: readiness and family-support decisions when emergency leave depends on trusted American Red Cross messages, verified family emergencies, and time-sensitive command approval.
- Primary tools: `ts-joint-emergency-leave-american-red-cross-message-command-approval-v1`.
- Cross-check tools: `ts-military-family-readiness-crisis-sustainment-v1`.
- Protocols: `NIEM`, signed leave notices, `API/JSON`, `S/MIME`, `USMTF`.
- Degraded fallback: command-approved leave triage only after manual message validation and conservative backfill assumptions.

### `efmp-respite-medical-device-power-v1`
- Use for: family-readiness and mass-care decisions when EFMP households depend on respite continuity, special-needs transport, or power-dependent medical equipment.
- Primary tools: `ts-joint-efmp-respite-medical-device-power-continuity-v1`.
- Cross-check tools: `ts-homeland-mass-care-access-functional-needs-support-v1`.
- Protocols: `HL7/FHIR`, `NIEM`, signed DME manifests, `API/JSON`, `S/MIME`, `USMTF`.
- Degraded fallback: life-safety-only household support with manual device checks and prioritized generator allocation.

### `survivor-benefits-casualty-expedite-v1`
- Use for: casualty-support and legitimacy decisions when survivor benefits, beneficiary evidence, and records integrity determine bereaved-family trust.
- Primary tools: `ts-joint-survivor-benefits-casualty-assistance-records-expedite-v1`.
- Cross-check tools: `ts-joint-personnel-records-dd214-benefits-continuity-v1`.
- Protocols: `NIEM`, signed casualty notices, `API/JSON`, `S/MIME`, `USMTF`.
- Degraded fallback: advisory-only survivor-support board with no entitlement execution until identity and authority are manually confirmed.

### `pcs-claims-voucher-lodging-v1`
- Use for: relocation and readiness decisions when PCS claims, voucher processing, HHG disruption, or temporary lodging shortages threaten reporting timelines and retention.
- Primary tools: `ts-joint-pcs-claims-travel-voucher-temporary-lodging-continuity-v1`.
- Cross-check tools: `ts-strategic-military-spouse-licensure-employment-pcs-continuity-v1`.
- Protocols: `NIEM`, signed orders or voucher notices, `API/JSON`, `S/MIME`, `USMTF`.
- Degraded fallback: manual move-priority board with essential lodging only and human-verified expense review.

### `tricare-referral-specialty-pharmacy-v1`
- Use for: medical and family-support decisions when referral outages, specialty-network loss, or pharmacy authorization delays threaten care continuity.
- Primary tools: `ts-joint-tricare-referral-specialty-care-pharmacy-authorization-bridge-v1`.
- Cross-check tools: `ts-joint-base-pharmacy-refill-tricare-coldchain-v1`.
- Protocols: `HL7/FHIR`, `NIEM`, signed referral notices, `API/JSON`, `S/MIME`, `USMTF`.
- Degraded fallback: clinically prioritized routing only with manual authorization review and conservative patient-travel assumptions.

### `relief-society-hardship-bridge-v1`
- Use for: family-readiness and mobilization decisions when hardship grants or loans determine whether warfighters can absorb pay shocks, PCS friction, or emergency travel costs.
- Primary tools: `ts-joint-relief-society-hardship-grant-zero-interest-loan-bridge-v1`.
- Cross-check tools: `ts-joint-military-financial-liability-and-compensation-continuity-v1`.
- Protocols: `NIEM`, signed command endorsements, `API/JSON`, `S/MIME`, `USMTF`.
- Degraded fallback: advisory-only hardship sequencing with no unsupported financial commitment and elevated command review.

## Toolchain Wave LXXVI (2026-04-07, Education Benefits, SCRA Protection, Immigration Continuity, Tax Relief, Overseas Voting, and Credit Recovery)

### `education-benefits-testing-continuity-v1`
- Use for: readiness and transition decisions when GI Bill, tuition assistance, school certification, or testing continuity is at risk.
- Primary tools: `ts-joint-education-benefits-gi-bill-tuition-assistance-testing-continuity-v1`.
- Cross-check tools: `ts-joint-personnel-records-dd214-benefits-continuity-v1`.
- Protocols: `NIEM`, signed education notices, `API/JSON`, `S/MIME`, `PESC XML`, `USMTF`.
- Degraded fallback: essential certification and testing actions only with manual eligibility review and command visibility.

### `scra-housing-credit-protection-v1`
- Use for: legal-readiness decisions when SCRA protections against foreclosure, eviction, lease friction, or rate-cap violations affect warfighter availability.
- Primary tools: `ts-joint-servicemembers-civil-relief-act-foreclosure-lease-eviction-rate-cap-enforcement-v1`.
- Cross-check tools: `ts-joint-servicemember-civil-relief-estate-poa-v1`.
- Protocols: `NIEM`, signed court or lender notices, `API/JSON`, `S/MIME`, `USMTF`.
- Degraded fallback: advisory-only legal triage with manual attorney review and no unsupported enforcement claim.

### `naturalization-immigration-continuity-v1`
- Use for: family-stability and legal-continuity decisions when naturalization, citizenship, or immigration-document disruption affects warfighter households.
- Primary tools: `ts-joint-naturalization-citizenship-immigration-benefits-continuity-v1`.
- Cross-check tools: `ts-theater-passport-visa-consular-safehaven-document-bridge-v1`.
- Protocols: `NIEM`, signed immigration notices, `API/JSON`, `S/MIME`, `ICAO Doc 9303`, `USMTF`.
- Degraded fallback: life-stability-first case prioritization only with manual status review and legal concurrence.

### `tax-relief-identity-protection-v1`
- Use for: fiscal-readiness decisions when combat-zone tax relief, document continuity, or IRS identity-fraud response affects household stability.
- Primary tools: `ts-joint-military-tax-relief-combat-zone-entitlement-irs-identity-protection-v1`.
- Cross-check tools: `ts-joint-military-financial-liability-and-compensation-continuity-v1`.
- Protocols: `NIEM`, signed tax notices, `API/JSON`, `S/MIME`, `USMTF`.
- Degraded fallback: advisory-only tax sequencing with no unsupported entitlement or fraud-resolution claim.

### `overseas-ballot-election-continuity-v1`
- Use for: civic-readiness decisions when absentee-ballot, election-mail, or voting-assistance continuity is threatened by deployment or disrupted movement.
- Primary tools: `ts-joint-fvap-overseas-ballot-election-material-continuity-v1`.
- Cross-check tools: `ts-military-family-readiness-crisis-sustainment-v1`.
- Protocols: `NIEM`, signed election notices, `API/JSON`, `S/MIME`, `USMTF`.
- Degraded fallback: deadline-driven manual assistance only with human review of lawful submission options.

### `credit-identity-recovery-readiness-v1`
- Use for: household-stability and mobilization decisions when identity theft, bureau disputes, or fraud-driven lockouts degrade financial readiness.
- Primary tools: `ts-joint-credit-identity-theft-financial-readiness-recovery-v1`.
- Cross-check tools: `ts-joint-relief-society-hardship-grant-zero-interest-loan-bridge-v1`.
- Protocols: `NIEM`, signed dispute notices, `API/JSON`, `S/MIME`, `USMTF`.
- Degraded fallback: emergency-liquidity-only posture with manual fraud review and no unsupported recovery promise.

## Toolchain Wave LXXVII (2026-04-07, Eligibility, Medical Board, Mobilization Pay, Special Education, Clearance Integrity, Retirement, Credential Readiness, and Family Care Continuity)

### `deers-id-eligibility-reconciliation-v1`
- Use for: family-readiness and benefits-continuity decisions when eligibility or ID-card drift blocks healthcare, access, pay, or casualty support.
- Primary tools: `ts-joint-deers-id-card-eligibility-reconciliation-v1`.
- Cross-check tools: `ts-joint-personnel-records-dd214-benefits-continuity-v1`.
- Protocols: `NIEM`, signed eligibility notices, `API/JSON`, `S/MIME`, `OIDC/SAML`, `USMTF`.
- Degraded fallback: essential-benefit priority board with human-verified sponsor and dependent status only.

### `meb-peb-va-claim-continuity-v1`
- Use for: recovery and transition decisions when medical-board delay, evidence gaps, or VA or DOD handoff friction could change duty disposition or lawful benefits.
- Primary tools: `ts-joint-medical-evaluation-board-physical-evaluation-board-va-claim-continuity-v1`.
- Cross-check tools: `ts-joint-casualty-rehabilitation-prosthetics-return-to-duty-v1`.
- Protocols: `HL7/FHIR`, `NIEM`, signed board notices, `API/JSON`, `S/MIME`, `USMTF`.
- Degraded fallback: human-reviewed board-priority roster with conservative duty-status assumptions only.

### `reserve-drill-pay-debt-resolution-v1`
- Use for: mobilization and financial-readiness decisions when Reserve or Guard pay errors, debt notices, or unpaid travel claims undermine force availability.
- Primary tools: `ts-reserve-component-drill-pay-travel-voucher-debt-resolution-v1`.
- Cross-check tools: `ts-joint-military-financial-liability-and-compensation-continuity-v1`.
- Protocols: `NIEM`, signed pay notices, `API/JSON`, `S/MIME`, `USMTF`.
- Degraded fallback: hardship-driven manual pay board with certified attendance and no unsupported remission promises.

### `special-education-iep-504-early-intervention-v1`
- Use for: dependent-support and retention decisions when IEP, 504, or early-intervention disruption threatens household stability and warfighter focus.
- Primary tools: `ts-joint-special-education-iep-504-early-intervention-continuity-v1`.
- Cross-check tools: `ts-military-family-readiness-crisis-sustainment-v1`.
- Protocols: `HL7/FHIR`, `NIEM`, signed school or therapy notices, `API/JSON`, `S/MIME`, `USMTF`.
- Degraded fallback: high-needs child support roster only with guardian consent and manual school-service confirmation.

### `security-clearance-record-correction-v1`
- Use for: assignment and mobilization decisions when clearance status, foreign-contact updates, or record correction speed determine who can lawfully deploy or access systems.
- Primary tools: `ts-joint-security-clearance-foreign-contact-record-correction-continuity-v1`.
- Cross-check tools: `ts-joint-personnel-records-dd214-benefits-continuity-v1`.
- Protocols: `NIEM`, signed security notices, `API/JSON`, `S/MIME`, `USMTF`.
- Degraded fallback: mission-essential access posture only with adjudicator review and conservative restrictions.

### `retirement-sbp-tsp-transition-continuity-v1`
- Use for: force-management and family-stability decisions when retirement packets, SBP elections, or TSP counseling failures could create legal or financial harm.
- Primary tools: `ts-joint-retirement-sbp-tsp-transition-counseling-continuity-v1`.
- Cross-check tools: `ts-joint-military-financial-liability-and-compensation-continuity-v1`.
- Protocols: `NIEM`, signed retirement notices, `API/JSON`, `S/MIME`, `USMTF`.
- Degraded fallback: separation-critical manual review only with human-confirmed eligibility and election status.

### `credential-cyber-cert-ceu-readiness-v1`
- Use for: deployability and safe-return decisions when expired licenses, certifications, or CEU backlogs would remove otherwise available technical personnel from mission roles.
- Primary tools: `ts-joint-professional-license-cyber-certification-ceu-readiness-continuity-v1`.
- Cross-check tools: `ts-joint-personnel-records-dd214-benefits-continuity-v1`.
- Protocols: `NIEM`, signed credential notices, `API/JSON`, `S/MIME`, `PESC XML`, `USMTF`.
- Degraded fallback: duty-critical credential triage only with human-confirmed evidence and explicit command visibility.

### `family-care-allotment-court-order-continuity-v1`
- Use for: mobilization and family-stability decisions when care-plan gaps, child-support or allotment failure, or missed court orders threaten lawful availability.
- Primary tools: `ts-joint-family-care-plan-child-support-allotment-court-order-continuity-v1`.
- Cross-check tools: `ts-military-family-readiness-crisis-sustainment-v1`.
- Protocols: `NIEM`, signed care-plan notices, `API/JSON`, `S/MIME`, `USMTF`.
- Degraded fallback: mobilization-critical family cases only with human-confirmed guardianship, legal deadlines, and support status.

## Toolchain Wave LXXXI (2026-04-07, Household Mobility, Childcare Stability, and Education-Finance Continuity)

### `command-sponsorship-overseas-screening-passport-v1`
- Use for: assignment, PCS, and dependent-movement decisions when command sponsorship, overseas screening, or no-fee passport continuity determines whether a family can lawfully move or remain supported.
- Primary tools: `ts-joint-command-sponsorship-overseas-screening-no-fee-passport-continuity-v1`.
- Cross-check tools: `ts-theater-passport-visa-consular-safehaven-document-bridge-v1`.
- Protocols: `NIEM`, `ICAO Doc 9303`, signed sponsor notices, `API/JSON`, `S/MIME`, `USMTF`.
- Degraded fallback: advisory-only movement triage with no unsupported sponsorship, screening, or travel-document outcome until human reviewers validate the packet.

### `pov-shipment-driver-license-registration-v1`
- Use for: PCS, mobilization, and household-transport decisions when POV shipment delay, driver-license friction, or registration failure threatens availability and lawful movement.
- Primary tools: `ts-joint-pov-shipment-driver-license-registration-continuity-v1`.
- Cross-check tools: `ts-joint-pcs-claims-travel-voucher-temporary-lodging-continuity-v1`.
- Protocols: `NIEM`, `AAMVA DL/ID`, signed shipment notices, `API/JSON`, `S/MIME`, `USMTF`.
- Degraded fallback: advisory-only transport triage with manual shipment and registration review until lawful driving posture is human-confirmed.

### `cdc-fee-assistance-duty-shift-v1`
- Use for: force-availability and family-stability decisions when CDC placement, fee assistance, or duty-shift care coverage determines whether personnel can lawfully report and sustain operations.
- Primary tools: `ts-joint-child-development-center-fee-assistance-duty-shift-continuity-v1`.
- Cross-check tools: `ts-reserve-component-single-parent-childcare-eldercare-mobilization-bridge-v1`.
- Protocols: `NIEM`, signed childcare notices, `API/JSON`, `S/MIME`, `USMTF`.
- Degraded fallback: advisory-only childcare triage with manual guardian review until placement, subsidy, and coverage evidence are human-confirmed.

### `student-loan-fafsa-college-reentry-v1`
- Use for: retention, transition, and household-finance decisions when federal student-loan protections, FAFSA continuity, or academic reentry determines whether disruption will create durable readiness drag.
- Primary tools: `ts-joint-federal-student-loan-deferment-fafsa-college-reentry-continuity-v1`.
- Cross-check tools: `ts-joint-education-benefits-gi-bill-tuition-assistance-testing-continuity-v1`.
- Protocols: `NIEM`, `PESC XML`, signed education-finance notices, `API/JSON`, `S/MIME`, `USMTF`.
- Degraded fallback: advisory-only education-finance triage with manual servicer and school review until deferment, enrollment, and deadline evidence are human-confirmed.

## Toolchain Wave LXXVIII (2026-04-07, Beneficiary Readiness, SkillBridge Transition, VA Home-Loan Stability, and Promotion-Board Continuity)

### `beneficiary-estate-readiness-v1`
- Use for: casualty-readiness and family-protection decisions when DD93 alignment, SGLI or TSGLI evidence, beneficiary trust, or estate readiness determines whether disruption will create avoidable harm.
- Primary tools: `ts-joint-dd93-sgli-tsgli-beneficiary-estate-readiness-continuity-v1`.
- Cross-check tools: `ts-joint-survivor-benefits-casualty-assistance-records-expedite-v1`.
- Protocols: `NIEM`, signed beneficiary notices, `API/JSON`, `S/MIME`, `USMTF`.
- Degraded fallback: manual beneficiary review only with human-confirmed DD93 evidence and no unsupported insurance or estate outcome.

### `skillbridge-transition-continuity-v1`
- Use for: transition and recovery decisions when SkillBridge, apprenticeship, or employer-fellowship continuity affects retention, lawful separation, or return-to-duty branch planning.
- Primary tools: `ts-joint-skillbridge-career-skills-apprenticeship-employer-fellowship-continuity-v1`.
- Cross-check tools: `ts-joint-retirement-sbp-tsp-transition-counseling-continuity-v1`.
- Protocols: `NIEM`, signed transition notices, `API/JSON`, `S/MIME`, `HR-XML`, `PESC XML`, `USMTF`.
- Degraded fallback: manual transition-priority board with human-confirmed eligibility and no unsupported placement commitment.

### `va-home-loan-housing-stability-v1`
- Use for: mobilization, PCS, and transition decisions when VA home-loan distress, failed closings, or housing instability threatens lawful availability or family readiness.
- Primary tools: `ts-joint-va-home-loan-guaranty-foreclosure-avoidance-housing-stability-v1`.
- Cross-check tools: `ts-joint-servicemembers-civil-relief-act-foreclosure-lease-eviction-rate-cap-enforcement-v1`.
- Protocols: `NIEM`, signed lender notices, `API/JSON`, `S/MIME`, `MISMO`, `USMTF`.
- Degraded fallback: advisory-only housing triage with manual counselor review and no unsupported foreclosure or modification outcome.

### `promotion-board-record-brief-continuity-v1`
- Use for: assignment and talent-management decisions when board-file integrity, evaluation timing, or record-brief accuracy determines whether a warfighter remains promotable or properly assigned.
- Primary tools: `ts-joint-promotion-board-evaluation-report-record-brief-continuity-v1`.
- Cross-check tools: `ts-joint-personnel-records-dd214-benefits-continuity-v1`.
- Protocols: `NIEM`, signed personnel notices, `API/JSON`, `S/MIME`, `USMTF`.
- Degraded fallback: manual board-risk review with no unsupported correction or promotion claim until human personnel managers validate the file.

## Toolchain Wave LXXXII (2026-04-07, Human Readiness Continuity and Protective Escalation)

### `telebehavioral-burnout-suicide-risk-v1`
- Use for: readiness and family-stability decisions when remote behavioral-health continuity, burnout intervention, or suicide-risk escalation determines whether key personnel can safely remain in the fight.
- Primary tools: `ts-joint-telebehavioral-health-burnout-suicide-risk-continuity-v1`.
- Cross-check tools: `ts-force-mental-health-postvention-v1`.
- Protocols: `HL7/FHIR`, signed care notices, `API/JSON`, `S/MIME`, `USMTF`.
- Degraded fallback: advisory-only triage with manual provider confirmation and no unsupported care, hospitalization, or acute-risk disposition.

### `homelessness-transitional-housing-bridge-v1`
- Use for: mobilization, recovery, and family-survivability decisions when homelessness risk, unsafe shelter, or displacement threatens lawful availability and retention.
- Primary tools: `ts-joint-military-homelessness-prevention-transitional-housing-bridge-v1`.
- Cross-check tools: `ts-joint-va-home-loan-guaranty-foreclosure-avoidance-housing-stability-v1`.
- Protocols: `NIEM`, signed housing notices, `API/JSON`, `S/MIME`, `USMTF`.
- Degraded fallback: advisory-only housing triage with manual shelter and eligibility review until safe lodging is human-confirmed.

### `bankruptcy-clearance-financial-distress-v1`
- Use for: readiness and assignment decisions when debt distress, bankruptcy exposure, or creditor pressure creates clearance, travel, or command-availability risk.
- Primary tools: `ts-joint-bankruptcy-consumer-protection-clearance-financial-distress-v1`.
- Cross-check tools: `ts-joint-credit-identity-theft-financial-readiness-recovery-v1`.
- Protocols: `NIEM`, signed legal notices, `API/JSON`, `S/MIME`, `USMTF`.
- Degraded fallback: advisory-only financial-distress triage with manual legal and security review until debt evidence and reporting obligations are human-confirmed.

### `family-online-harassment-doxxing-v1`
- Use for: force-protection and family-safety decisions when doxxing, swatting, or persistent online harassment creates an immediate readiness drag or physical-world threat.
- Primary tools: `ts-joint-family-online-harassment-doxxing-protective-escalation-v1`.
- Cross-check tools: `ts-homeland-protective-order-domestic-violence-safe-housing-continuity-v1`.
- Protocols: `STIX/TAXII`, `NIEM`, signed incident notices, `API/JSON`, `S/MIME`, `USMTF`.
- Degraded fallback: advisory-only protective triage with manual evidence review and no unsupported attribution, takedown, or protective-coverage claim.

### `compassionate-reassignment-hardship-transfer-v1`
- Use for: personnel-management and retention decisions when family emergency or caregiving burden may justify compassionate reassignment, humanitarian transfer, or hardship discharge.
- Primary tools: `ts-joint-compassionate-reassignment-hardship-discharge-humanitarian-transfer-v1`.
- Cross-check tools: `ts-joint-emergency-leave-american-red-cross-message-command-approval-v1`.
- Protocols: `NIEM`, signed personnel notices, `API/JSON`, `S/MIME`, `USMTF`.
- Degraded fallback: advisory-only personnel routing with manual hardship review and no unsupported reassignment, transfer, or discharge claim.

## Toolchain Wave LXXXIII (2026-04-07, Wounded Warrior Transition and Recovery Continuity)

### `transitional-healthcare-tamp-chcbp-v1`
- Use for: recovery and family-stability decisions when TAMP or CHCBP coverage windows, pharmacy bridge actions, or specialty-care access determine whether a separating or demobilizing warfighter keeps treatment continuity.
- Primary tools: `ts-joint-transitional-healthcare-tamp-chcbp-pharmacy-bridge-v1`.
- Cross-check tools: `ts-joint-tricare-referral-specialty-care-pharmacy-authorization-bridge-v1`.
- Protocols: `HL7/FHIR`, `NIEM`, signed coverage notices, `API/JSON`, `S/MIME`, `USMTF`.
- Degraded fallback: advisory-only healthcare triage with manual eligibility and refill review until coverage and pharmacy posture are human-confirmed.

### `va-caregiver-stipend-respite-v1`
- Use for: wounded-warrior recovery and household-stability decisions when caregiver stipend continuity, training completion, or respite availability determines whether home care remains safe and sustainable.
- Primary tools: `ts-joint-va-caregiver-support-program-stipend-training-respite-continuity-v1`.
- Cross-check tools: `ts-joint-wounded-warrior-home-modification-caregiver-ramp-v1`.
- Protocols: `HL7/FHIR`, `NIEM`, signed caregiver determinations, `API/JSON`, `S/MIME`, `USMTF`.
- Degraded fallback: advisory-only caregiver triage with manual stipend, training, and respite review until support continuity is human-confirmed.

### `vre-independent-living-adaptive-employment-v1`
- Use for: recovery and transition decisions when VR&E entitlement, adaptive-employment routing, or independent-living supports determine whether a wounded warfighter can stabilize after separation or medical retirement.
- Primary tools: `ts-joint-vre-independent-living-adaptive-employment-continuity-v1`.
- Cross-check tools: `ts-joint-retirement-sbp-tsp-transition-counseling-continuity-v1`.
- Protocols: `NIEM`, `PESC XML`, signed rehabilitation plans, `API/JSON`, `S/MIME`, `USMTF`.
- Degraded fallback: advisory-only rehabilitation triage with manual counselor and entitlement review until transition viability is human-confirmed.

### `adapted-housing-automobile-access-v1`
- Use for: discharge and mobility decisions when adaptive-housing grants, automobile allowance actions, or home-accessibility evidence determine whether a catastrophically injured warfighter can safely leave institutional care.
- Primary tools: `ts-joint-specially-adapted-housing-automobile-allowance-home-accessibility-benefit-bridge-v1`.
- Cross-check tools: `ts-joint-va-home-loan-guaranty-foreclosure-avoidance-housing-stability-v1`.
- Protocols: `NIEM`, signed benefit determinations, `API/JSON`, `S/MIME`, `USMTF`.
- Degraded fallback: advisory-only accessibility triage with manual eligibility and inspection review until adaptive-benefit posture is human-confirmed.

### `convalescent-leave-medhold-v1`
- Use for: lawful recovery and availability decisions when convalescent leave, limited-duty profiles, or medical-hold orders determine whether a warfighter can recover safely without pay or order disruption.
- Primary tools: `ts-joint-convalescent-leave-limited-duty-medical-hold-continuity-v1`.
- Cross-check tools: `ts-joint-medical-evaluation-board-physical-evaluation-board-va-claim-continuity-v1`.
- Protocols: `HL7/FHIR`, `NIEM`, signed medical orders, `API/JSON`, `S/MIME`, `USMTF`.
- Degraded fallback: advisory-only recovery-order triage with manual order and pay-impact review until medhold legitimacy is human-confirmed.

## Toolchain Wave LXXXIV (2026-04-07, Household Command Support, Exposure Continuity, Readiness Recovery, Benefit Bridging, Placement Stability, and Reintegration)

### `rear-detachment-frg-ombudsman-v1`
- Use for: deployment, casualty-adjacent, and household-stability decisions when rear-detachment visibility, ombudsman routing, or FRG coordination determines whether a family problem becomes a readiness loss.
- Primary tools: `ts-joint-rear-detachment-family-readiness-group-ombudsman-continuity-v1`.
- Cross-check tools: `ts-joint-emergency-leave-american-red-cross-message-command-approval-v1`.
- Protocols: `NIEM`, signed family-support notices, `API/JSON`, `S/MIME`, `USMTF`.
- Degraded fallback: advisory-only household triage with manual sponsor review and no unsupported command-support outcome.

### `toxic-exposure-registry-continuity-v1`
- Use for: force-health and benefits-preservation decisions when burn-pit, airborne-hazard, or toxic-exposure evidence must survive long enough to drive follow-up care, registry enrollment, and lawful documentation.
- Primary tools: `ts-joint-airborne-hazard-burn-pit-pact-act-toxic-exposure-registry-continuity-v1`.
- Cross-check tools: `ts-theater-occupational-toxicology-solvent-fuel-heavy-metal-v1`.
- Protocols: `HL7/FHIR`, `NIEM`, signed exposure notices, `API/JSON`, `S/MIME`, `USMTF`.
- Degraded fallback: advisory-only exposure triage with manual medical and industrial-hygiene review until source evidence is human-confirmed.

### `post-deployment-health-imr-v1`
- Use for: deployability and safe-recovery decisions when PDHA or PDHRA gaps, IMR drift, or stale duty limitations create hidden readiness debt after a deployment cycle.
- Primary tools: `ts-joint-post-deployment-health-assessment-imr-duty-limitation-recovery-v1`.
- Cross-check tools: `ts-joint-convalescent-leave-limited-duty-medical-hold-continuity-v1`.
- Protocols: `HL7/FHIR`, `NIEM`, signed readiness notices, `API/JSON`, `S/MIME`, `USMTF`.
- Degraded fallback: advisory-only readiness triage with manual clinical review and no unsupported deployability or waiver claim.

### `dental-vision-fedvip-bridge-v1`
- Use for: family-stability and specialty-care decisions when dental, vision, or orthodontic benefit breaks threaten treatment continuity during PCS, mobilization, or recovery.
- Primary tools: `ts-joint-tricare-dental-fedvip-vision-orthodontic-benefit-bridge-v1`.
- Cross-check tools: `ts-joint-tricare-referral-specialty-care-pharmacy-authorization-bridge-v1`.
- Protocols: `HL7/FHIR`, `NIEM`, signed benefit notices, `API/JSON`, `S/MIME`, `USMTF`.
- Degraded fallback: advisory-only benefit triage with manual eligibility review and no unsupported coverage or appointment outcome.

### `adoption-foster-kinship-placement-v1`
- Use for: deployment, PCS, and recovery decisions when adoption, foster-care, or kinship-placement timing determines whether dependents remain lawfully placed and supported.
- Primary tools: `ts-joint-adoption-foster-care-kinship-placement-continuity-v1`.
- Cross-check tools: `ts-joint-family-care-guardianship-dependent-support-v1`.
- Protocols: `NIEM`, signed custody notices, `API/JSON`, `S/MIME`, `USMTF`.
- Degraded fallback: advisory-only placement triage with manual legal and guardian review until court and consent posture are human-confirmed.

### `adaptive-sports-reintegration-peer-mentor-v1`
- Use for: wounded-warrior recovery and identity-restoration decisions when adaptive sports, peer mentorship, and community reintegration determine whether rehabilitation momentum survives outside the clinic.
- Primary tools: `ts-joint-adaptive-sports-community-reintegration-peer-mentor-continuity-v1`.
- Cross-check tools: `ts-joint-vre-independent-living-adaptive-employment-continuity-v1`.
- Protocols: `HL7/FHIR`, `NIEM`, signed rehabilitation plans, `API/JSON`, `S/MIME`, `USMTF`.
- Degraded fallback: advisory-only reintegration triage with manual rehab review and no unsupported program placement or peer-support outcome.

## Toolchain Wave LXXXV (2026-04-07, Parental Readiness, Newborn Legitimacy, Protected Complaints, Duty-Status Legitimacy, Recognition Integrity, and Separation Clearance)

### `parental-leave-postpartum-duty-mod-v1`
- Use for: deployability and safe-availability decisions when parental leave, pregnancy or postpartum profiles, and duty-modification requirements create competing family-support and mission-coverage pressures.
- Primary tools: `ts-joint-parental-leave-pregnancy-postpartum-profile-duty-modification-continuity-v1`.
- Cross-check tools: `ts-homeland-postpartum-lactation-infant-formula-diaper-continuity-v1`.
- Protocols: `HL7/FHIR`, `NIEM`, signed medical or personnel notices, `API/JSON`, `S/MIME`, `USMTF`.
- Degraded fallback: advisory-only parental triage with manual medical and personnel review until leave authority and profile legitimacy are human-confirmed.

### `newborn-deers-tricare-docs-v1`
- Use for: family-movement and care-access decisions when newborn documentation, DEERS or TRICARE enrollment, and travel-document routing determine whether a military household remains lawfully recognized and medically supported.
- Primary tools: `ts-joint-newborn-birth-certificate-deers-tricare-travel-document-bridge-v1`.
- Cross-check tools: `ts-joint-deers-id-card-eligibility-reconciliation-v1`.
- Protocols: `HL7/FHIR`, `NIEM`, `ICAO Doc 9303`, signed civil-status notices, `API/JSON`, `S/MIME`, `USMTF`.
- Degraded fallback: advisory-only newborn triage with manual birth-evidence and sponsor-status review until identity and care posture are human-confirmed.

### `ig-eo-reprisal-safeguard-v1`
- Use for: command-trust and personnel-protection decisions when EO or IG complaint integrity, reprisal exposure, or protected reporting posture can change acceptable risk for a unit or household.
- Primary tools: `ts-joint-inspector-general-equal-opportunity-reprisal-complaint-safeguard-v1`.
- Cross-check tools: `ts-joint-family-online-harassment-doxxing-protective-escalation-v1`.
- Protocols: `NIEM`, signed complaint notices, `API/JSON`, `S/MIME`, `USMTF`.
- Degraded fallback: advisory-only complaint triage with manual legal or inspector review and no unsupported finding or corrective-action promise.

### `lod-incap-pay-duty-status-v1`
- Use for: lawful-availability and compensation decisions when line-of-duty evidence, incapacitation pay, or duty-status continuity determines whether an injured warfighter can recover without pay or treatment disruption.
- Primary tools: `ts-joint-line-of-duty-incapacitation-pay-duty-status-continuity-v1`.
- Cross-check tools: `ts-joint-convalescent-leave-limited-duty-medical-hold-continuity-v1`.
- Protocols: `HL7/FHIR`, `NIEM`, signed LOD or pay notices, `API/JSON`, `S/MIME`, `USMTF`.
- Degraded fallback: advisory-only duty-status triage with manual incident and finance review until LOD legitimacy and pay posture are human-confirmed.

### `awards-decorations-record-protection-v1`
- Use for: promotion-trust and historical-accountability decisions when awards evidence, valor-device routing, or board-record integrity determines whether a warfighter receives lawful recognition.
- Primary tools: `ts-joint-awards-decorations-valor-board-record-protection-v1`.
- Cross-check tools: `ts-joint-promotion-board-evaluation-report-record-brief-continuity-v1`.
- Protocols: `NIEM`, signed personnel citations, `API/JSON`, `S/MIME`, `USMTF`.
- Degraded fallback: advisory-only recognition triage with manual evidence and board review until citation legitimacy is human-confirmed.

### `final-out-processing-clearance-v1`
- Use for: separation-legitimacy and DD214-timing decisions when CIF or OCIE accountability, medical or dental clearance, and final-out checklist drift determines whether a warfighter can lawfully leave service or demobilize.
- Primary tools: `ts-joint-final-out-processing-cif-ocie-medical-dental-separation-clearance-v1`.
- Cross-check tools: `ts-joint-personnel-records-dd214-benefits-continuity-v1`.
- Protocols: `NIEM`, signed separation checklists, `API/JSON`, `S/MIME`, `USMTF`.
- Degraded fallback: advisory-only separation triage with manual accountability and personnel review until clearance authority and DD214 dependencies are human-confirmed.

## Toolchain Wave LXXXVI (2026-04-11, Administrative Justice and Redress)

### `administrative-justice-redress-v1`
- Use for: readiness, access, and family-stability decisions when adverse action, court-martial support, clearance suspension, discharge redress, or Article 138 escalation can sideline a U.S. warfighter.
- Primary tools: `ts-joint-nonjudicial-punishment-letter-of-reprimand-administrative-separation-continuity-v1`, `ts-joint-court-martial-defense-counsel-discovery-expert-witness-travel-continuity-v1`, and `ts-joint-security-clearance-suspension-revocation-statement-of-reasons-response-v1`.
- Cross-check tools: `ts-joint-unfavorable-information-file-gomor-board-record-rebuttal-continuity-v1`, `ts-joint-discharge-review-board-bcmr-character-of-service-va-eligibility-bridge-v1`, and `ts-joint-article-138-congressional-casework-record-preservation-escalation-v1`.
- Protocols: `NIEM`, `HL7/FHIR`, signed legal or records notices, `API/JSON`, `S/MIME`, `USMTF`.
- Degraded fallback: advisory-only rights-impacting triage with human legal, security, or inspector review before any outcome claim.

## Toolchain Wave LXXXVII (2026-04-11, Support-Readiness and Transition Continuity)

### `support-readiness-transition-v1`
- Use for: deployability, mobilization, household-stability, and transition-value decisions when IMR, LOD or medhold, TAP, family-network trust, OneSource support, or COOL or USMAP progress determine whether a warfighter can stay ready.
- Primary tools: `ts-joint-individual-medical-readiness-immunization-pha-dental-continuity-v1`, `ts-reserve-component-line-of-duty-incapacitation-pay-medical-hold-continuity-v1`, and `ts-joint-transition-assistance-vre-dol-federal-hiring-bridge-v1`.
- Cross-check tools: `ts-joint-family-readiness-group-ombudsman-key-spouse-communication-v1`, `ts-joint-military-onesource-nonmedical-counseling-peer-support-v1`, and `ts-joint-cool-usmap-credentialing-pathway-continuity-v1`.
- Protocols: `HL7/FHIR`, `NIEM`, `HR-XML`, `CAP`, signed readiness or transition notices, `API/JSON`, `S/MIME`, `USMTF`.
- Degraded fallback: advisory-only support triage with human medical, personnel, family-readiness, or transition-services confirmation before any status claim.

## Toolchain Wave LXXXVIII (2026-04-11, Reserve Lifecycle, Family Portability, and Human-Readiness Continuity)

### `reserve-family-portability-human-readiness-v1`
- Use for: readiness, retention, and household-stability decisions when reserve retirement credit, reserve healthcare, EFMP assignment continuity, dependent education portability, spouse training restart, housing disputes, or cross-functional case fragmentation determine whether a warfighter can remain available.
- Primary tools: `ts-reserve-component-retirement-points-sanctuary-nonregular-retirement-continuity-v1`, `ts-reserve-component-tricare-reserve-select-retired-reserve-dental-eligibility-bridge-v1`, and `ts-joint-command-team-human-readiness-case-conference-escalation-v1`.
- Cross-check tools: `ts-joint-efmp-enrollment-assignment-coordination-school-liaison-continuity-v1`, `ts-joint-post-9-11-gi-bill-transferability-dependent-education-yellow-ribbon-continuity-v1`, `ts-strategic-military-spouse-mycaa-portable-training-career-reentry-v1`, and `ts-joint-privatized-military-housing-tenant-rights-bah-recertification-claims-v1`.
- Protocols: `HL7/FHIR`, `NIEM`, `PESC XML`, `HR-XML`, signed family-support or personnel notices, `API/JSON`, `S/MIME`, `USMTF`.
- Degraded fallback: advisory-only reserve and family-portability triage with human medical, personnel, benefits, housing, and command review before any status or entitlement claim.
