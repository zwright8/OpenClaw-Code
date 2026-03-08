# Warfighter External Tool and Protocol Catalog

Use this reference to bind recommendations to concrete tool suites and message/transport protocol stacks by mission domain.

## Required Fields

Include these fields whenever a recommendation depends on external systems:

- `tool_suite_id`
- `protocol_stack_id`
- `interop_standard_set`
- `endpoint_security_profile`
- `primary_exchange_path`
- `degraded_exchange_method`
- `latency_budget_seconds`
- `ack_timeout_seconds`
- `validation_owner`

## Tool Suite Catalog

### `ts-joint-c2-fusion-v1`
- Use for: joint C2 convergence, watchfloor synchronization, cross-component decision cycles.
- Primary tools: GCCS-J, CPOF, JADOCS, ATAK/WinTAK.
- Cross-check tools: alternate COP mirror, timeline replay service.
- Typical products: decision matrix, commander update packets, branch triggers.

### `ts-intel-fusion-v1`
- Use for: all-source intelligence fusion, PIR refinement, indicator tracking.
- Primary tools: DCGS variants, GEOINT exploitation stacks, collection managers.
- Cross-check tools: independent all-source board, trusted OSINT watchlist feeds.
- Typical products: threat estimate, collection retask guidance, confidence-ranked hypotheses.

### `ts-fires-airspace-v1`
- Use for: fires synchronization, dynamic targeting, airspace deconfliction.
- Primary tools: AFATDS, TAIS, TBMCS, JADOCS.
- Cross-check tools: sensor timeline and targeting cross-check board.
- Typical products: fire support matrix, no-strike validation, timing windows.

### `ts-maritime-undersea-v1`
- Use for: maritime domain awareness, port control, undersea node protection.
- Primary tools: maritime COP, AIS analytics, undersea telemetry dashboards.
- Cross-check tools: hydrographic overlays, independent traffic anomaly services.
- Typical products: transit risk windows, harbor throughput plans, anomaly alerts.

### `ts-space-satcom-v1`
- Use for: SDA fusion, SATCOM continuity, orbital risk assessment.
- Primary tools: SDA catalog services, SATCOM planners, link health monitors.
- Cross-check tools: orbital event mirror and timing-integrity monitor.
- Typical products: comms resilience plans, orbital conflict windows, reconstitution branches.

### `ts-cyber-defense-v1`
- Use for: mission network defense, hunt-forward support, cyber mission assurance.
- Primary tools: SIEM/SOAR, endpoint telemetry, threat intel brokers.
- Cross-check tools: independent packet analytics and incident command board.
- Typical products: prioritized mitigations, containment branches, adversary TTP mapping.

### `ts-logistics-distribution-v1`
- Use for: movement control, sustainment routing, stockpile reallocation.
- Primary tools: GCSS variants, movement control boards, depot readiness dashboards.
- Cross-check tools: convoy status telemetry and theater movement mirrors.
- Typical products: distribution priorities, constrained-route plans, sustainment risks.

### `ts-medical-force-health-v1`
- Use for: casualty regulation, force-health surveillance, blood and med-log continuity.
- Primary tools: patient regulation systems, med-log platforms, epidemiology dashboards.
- Cross-check tools: bed-status mirrors and blood supply verification tools.
- Typical products: evacuation priorities, treatment capacity outlook, outbreak risk notes.

### `ts-civil-support-v1`
- Use for: DSCA, critical infrastructure restoration, evacuation and shelter operations.
- Primary tools: ICS dashboards, utility telemetry, emergency operations systems.
- Cross-check tools: transportation status and shelter occupancy mirrors.
- Typical products: restoration sequencing, evacuation throughput plans, civic risk posture.

### `ts-strategic-deterrence-v1`
- Use for: deterrence signaling options, escalation control, strategic risk communication.
- Primary tools: strategic indications boards, policy-legal advisory workflow tools.
- Cross-check tools: independent warning timeline and alternate strategic reporting path.
- Typical products: bounded response options, escalation trigger map, policy risk notes.

### `ts-nc3-resilience-v1`
- Use for: NC3 continuity, emergency-action message integrity, comm-path survivability.
- Primary tools: NC3 status monitors, message-integrity validators, path orchestration tools.
- Cross-check tools: acknowledgment-chain ledger and independent path monitor.
- Typical products: continuity posture snapshots, route failover actions, integrity exceptions.

### `ts-airfield-recovery-v1`
- Use for: airfield damage assessment, runway repair sequencing, sortie regeneration planning.
- Primary tools: runway status dashboards, engineering task schedulers, airfield imagery exploitation tools.
- Cross-check tools: independent pavement status survey and alternate repair timeline board.
- Typical products: runway recovery plan, sortie regeneration timeline, repair resource matrix.

### `ts-cbrn-consequence-v1`
- Use for: CBRN hazard tracking, consequence management, decontamination and restoration prioritization.
- Primary tools: CBRN sensor fusion services, plume/hazard modeling tools, restoration coordination boards.
- Cross-check tools: independent hazard sampling and civil support status mirrors.
- Typical products: hazard control overlays, restoration decision matrix, contamination risk updates.

### `ts-maritime-interdiction-v1`
- Use for: maritime boarding operations, vessel search coordination, interdiction evidence tracking.
- Primary tools: maritime COP, vessel behavior analytics, boarding mission planning tools.
- Cross-check tools: independent vessel identity validation and evidence custody verification service.
- Typical products: boarding sequence plan, vessel disposition board, evidence chain log.

### `ts-detainee-accountability-v1`
- Use for: detainee tracking, custody transfer assurance, evidence provenance for military police operations.
- Primary tools: detainee management platforms, biometric verification systems, case/evidence management tools.
- Cross-check tools: facility roster reconciliation and independent custody audit board.
- Typical products: custody transfer ledger, evidence packet index, accountability exception report.

### `ts-finance-pay-continuity-v1`
- Use for: deployed pay continuity, disconnected disbursement workflows, anti-fraud reconciliation in contested theaters.
- Primary tools: pay and entitlements systems, disbursement reconciliation services, fraud analytics boards.
- Cross-check tools: treasury disbursement mirror and disconnected transaction integrity tracker.
- Typical products: pay continuity branches, reconciliation task board, disbursement risk map.

### `ts-spectrum-governance-v1`
- Use for: spectrum allocation governance, emissions control, and interference adjudication across joint force elements.
- Primary tools: spectrum assignment and EMS COP tools, emitter management services, conflict adjudication boards.
- Cross-check tools: independent RF monitoring mesh and alternate spectrum conflict log.
- Typical products: emissions control matrix, spectrum governance order, interference resolution timeline.

### `ts-pow-mia-fusion-v1`
- Use for: POW/MIA and missing-person recovery fusion, case confidence management, and interagency coordination.
- Primary tools: personnel accountability systems, recovery case management tools, geospatial clue fusion services.
- Cross-check tools: independent case ledger and forensic confidence review board.
- Typical products: missing-person fusion brief, recovery prioritization board, case confidence ledger.

### `ts-truce-monitoring-v1`
- Use for: prisoner exchange coordination, ceasefire/truce incident monitoring, and neutral-observer verification workflows.
- Primary tools: detainee/personnel accountability ledgers, incident geo-reporting platforms, secure exchange coordination portals.
- Cross-check tools: independent observer verification log and compliance adjudication board.
- Typical products: truce compliance tracker, exchange synchronization matrix, incident adjudication packet.

### `ts-disinformation-counter-v1`
- Use for: open-source narrative monitoring, influence attribution, and coordinated counter-propaganda response.
- Primary tools: OSINT aggregation suites, social graph analytics, media authenticity forensics platforms.
- Cross-check tools: independent source credibility ledger and alternate influence telemetry board.
- Typical products: influence attribution brief, narrative risk map, counter-message release plan.

### `ts-radiological-urban-response-v1`
- Use for: radiological dispersal response in dense urban terrain with hazard control and restoration sequencing.
- Primary tools: radiation sensor fusion services, plume/fallout modeling tools, urban restoration command boards.
- Cross-check tools: independent sampling chain and public safety status mirror.
- Typical products: hazard control overlay, decontamination prioritization matrix, restoration branch plan.

### `ts-strategic-supply-shock-v1`
- Use for: food/water instability forecasting, critical mineral disruption response, and theater resource shock mitigation.
- Primary tools: hydrology/agriculture intelligence systems, commodity flow analytics, supply-chain risk dashboards.
- Cross-check tools: independent market disruption monitor and alternate logistics status board.
- Typical products: instability trigger ledger, supply shock forecast, mitigation branch map.

### `ts-maritime-quarantine-control-v1`
- Use for: chokepoint inspection prioritization, quarantine control, and maritime throughput continuity.
- Primary tools: maritime COP, vessel identity analytics, port health surveillance platforms.
- Cross-check tools: independent quarantine compliance ledger and harbor traffic anomaly service.
- Typical products: quarantine timeline, inspection priority board, throughput continuity plan.

### `ts-emp-consequence-restoration-v1`
- Use for: high-altitude EMP consequence assessment, mission dependency triage, and phased restoration planning.
- Primary tools: mission dependency graphing tools, grid/telecom resilience dashboards, restoration orchestration systems.
- Cross-check tools: independent continuity posture monitor and infrastructure fault-trace board.
- Typical products: EMP consequence map, restoration priority matrix, continuity branch plan.

### `ts-rail-bridge-recovery-v1`
- Use for: tactical rail bridge damage triage, repair sequencing, and military throughput restoration.
- Primary tools: engineering damage assessment systems, rail movement control tools, route capacity analytics.
- Cross-check tools: independent civil rail status mirror and alternate route feasibility board.
- Typical products: repair sequence plan, throughput recovery timeline, resource demand matrix.

### `ts-polar-routing-v1`
- Use for: icebreaker task-force routing, polar escort assignments, and Arctic access assurance.
- Primary tools: ice condition intelligence services, polar route optimization software, maritime traffic analytics.
- Cross-check tools: alternate ice forecast model and independent route risk board.
- Typical products: polar risk overlay, escort assignment matrix, branch trigger chart.

### `ts-climate-digital-twin-v1`
- Use for: climate stress digital-twin modeling, basing adaptation planning, and long-horizon mission resilience.
- Primary tools: theater digital twin simulation environments, climate hazard analytics, posture planning dashboards.
- Cross-check tools: independent model validation harness and alternate climate signal monitor.
- Typical products: mission-impact climate model, adaptation option scorecard, posture adjustment roadmap.

### `ts-counter-wmd-neutralization-v1`
- Use for: WMD site isolation/neutralization planning with contamination control and legal-evidence integrity.
- Primary tools: WMD intelligence fusion platforms, CBRN hazard models, sensitive-site exploitation trackers.
- Cross-check tools: independent contamination confidence board and legal-policy adjudication tracker.
- Typical products: neutralization concept packet, contamination control matrix, escalation/legal decision log.

### `ts-submarine-rescue-v1`
- Use for: distressed submarine rescue planning, deep-submergence coordination, and rescue timeline assurance.
- Primary tools: DISSUB reporting services, submarine life-support estimators, rescue vehicle readiness planners.
- Cross-check tools: independent underwater tracking mirror and rescue asset status verifier.
- Typical products: rescue synchronization board, depth-pressure feasibility matrix, branch timeline packet.

### `ts-munitions-port-safety-v1`
- Use for: munitions port blast zoning, explosive compatibility controls, and high-tempo loading safety.
- Primary tools: explosive safety arc modeling tools, port loading schedulers, munitions compatibility ledgers.
- Cross-check tools: independent pier safety verification board and alternate throughput risk monitor.
- Typical products: explosive arc zoning brief, loading sequence control order, pier risk register.

### `ts-physical-message-assurance-v1`
- Use for: denied-network courier operations, physical message custody chains, and delayed acknowledgment mitigation.
- Primary tools: courier route planning services, custody ledger systems, mission message prioritization boards.
- Cross-check tools: independent courier status mirror and alternate message acknowledgment tracker.
- Typical products: courier route matrix, physical custody SOP packet, delayed-ack branch plan.

### `ts-aviation-fuel-integrity-v1`
- Use for: aviation fuel contamination detection, sortie fuel assurance, and recertification sequencing.
- Primary tools: fuel quality telemetry analyzers, contamination forensics workflows, sortie fuel allocation boards.
- Cross-check tools: independent sample-chain audit service and alternate fuel-point validation board.
- Typical products: contamination investigation brief, sortie fuel risk posture, remediation timeline.

### `ts-explosive-demil-safety-v1`
- Use for: unstable munition demilitarization sequencing, disposal-site safety controls, and compliance traceability.
- Primary tools: EOD disposal planning services, explosive hazard modeling tools, environmental compliance trackers.
- Cross-check tools: independent safety perimeter calculator and alternate disposal audit board.
- Typical products: demil sequence order, disposal risk matrix, safety compliance packet.

### `ts-coastal-hazard-protection-v1`
- Use for: coastal tsunami/seismic force-protection planning, evacuation trigger governance, and base continuity.
- Primary tools: coastal hazard warning systems, evacuation routing planners, base exposure modeling services.
- Cross-check tools: independent hazard feed monitor and alternate relocation readiness dashboard.
- Typical products: force-protection trigger matrix, phased relocation timeline, continuity branch chart.

### `ts-telemetry-denied-missile-characterization-v1`
- Use for: launch characterization under telemetry denial with attribution confidence and warning support.
- Primary tools: missile-warning fusion boards, trajectory inference models, adversary missile baseline libraries.
- Cross-check tools: independent sensor-track validator and alternate warning confidence monitor.
- Typical products: launch characterization report, attribution confidence ledger, warning option matrix.

### `ts-undersea-geohazard-v1`
- Use for: undersea volcanic/seismic impact assessment on cables, ports, and maritime mission routes.
- Primary tools: bathymetric/seismic analytics, undersea infrastructure maps, maritime reroute planners.
- Cross-check tools: independent geohazard model service and alternate cable status board.
- Typical products: geohazard impact brief, cable restoration priority board, route diversion package.

### `ts-coalition-border-clearance-v1`
- Use for: coalition customs and border-clearance synchronization under contested throughput constraints.
- Primary tools: movement manifest systems, legal waiver tracking tools, coalition border queue managers.
- Cross-check tools: independent clearance status mirror and alternate compliance adjudication board.
- Typical products: border clearance synchronization matrix, waiver decision packet, transit risk timeline.

### `ts-field-sanitation-decon-v1`
- Use for: expeditionary laundry and textile decontamination planning for force-health continuity.
- Primary tools: sanitation throughput planners, decon chemistry trackers, hygiene risk dashboards.
- Cross-check tools: independent contamination sampling board and alternate textile throughput monitor.
- Typical products: textile decon operations order, sanitation capacity forecast, contamination control checklist.

### `ts-ocean-acoustic-asw-v1`
- Use for: ocean-forecast-informed ASW acoustic advantage planning and sensor employment timing.
- Primary tools: oceanographic forecast models, sonar performance predictors, ASW sensor orchestration tools.
- Cross-check tools: independent acoustic propagation model and alternate contact confidence board.
- Typical products: acoustic advantage brief, sensor placement matrix, prosecution timing windows.

### `ts-humanitarian-airdrop-corridor-v1`
- Use for: coalition humanitarian airdrop corridor governance and drop-zone risk prioritization.
- Primary tools: humanitarian demand mapping platforms, airspace corridor planners, drop-zone integrity monitors.
- Cross-check tools: independent aid delivery verification board and alternate civilian risk tracker.
- Typical products: airdrop governance order, corridor deconfliction matrix, drop-zone risk map.

### `ts-lunar-cislunar-relay-v1`
- Use for: lunar relay communications continuity, cislunar transport messaging, and deep-space timing resilience.
- Primary tools: SDA catalog services, relay schedule planners, optical crosslink managers, timing-integrity monitors.
- Cross-check tools: independent ephemeris validator and acknowledgment-chain mirror.
- Typical products: relay continuity matrix, timing confidence brief, alternate comm-path branch plan.

### `ts-quantum-sensor-assurance-v1`
- Use for: quantum-enabled sensor calibration governance, drift detection, and mission-confidence adjudication.
- Primary tools: quantum sensor health telemetry, calibration orchestration service, all-source fusion board.
- Cross-check tools: independent geodesy and timing baseline validator.
- Typical products: calibration schedule, drift-confidence heatmap, sensor trust decision log.

### `ts-autonomy-governance-v1`
- Use for: autonomous convoy authority management, behavior assurance, and incident review under coalition constraints.
- Primary tools: autonomy mission managers, route-risk engines, policy and caveat enforcement gateways.
- Cross-check tools: independent authority-state ledger and legal-policy adjudication board.
- Typical products: authority-state matrix, autonomy constraint order, exception escalation packet.

### `ts-directed-energy-power-v1`
- Use for: directed-energy engagement power budgeting, thermal envelope control, and recharge-cycle prioritization.
- Primary tools: DE fire control telemetry, thermal model services, microgrid power allocators.
- Cross-check tools: independent power draw validator and alternate thermal safety monitor.
- Typical products: engagement power budget, cooldown timeline, constraint-based engagement ladder.

### `ts-climate-migration-forecast-v1`
- Use for: climate-linked migration pressure forecasting, instability trigger tracking, and civil-support prioritization.
- Primary tools: climate hazard models, population movement analytics, critical-infrastructure stress dashboards.
- Cross-check tools: independent humanitarian demand telemetry and alternate social-risk monitor.
- Typical products: migration pressure forecast, instability trigger ledger, support branch matrix.

### `ts-aviation-cyber-airworthiness-v1`
- Use for: cyber-informed aviation airworthiness assurance, firmware trust validation, and recertification sequencing.
- Primary tools: fleet maintenance systems, firmware attestation services, SIEM/SOAR airworthiness incident board.
- Cross-check tools: independent flight safety review ledger and alternate software provenance verifier.
- Typical products: grounding risk matrix, recertification plan, cyber airworthiness release packet.

### `ts-bridge-nde-recovery-v1`
- Use for: rapid bridge integrity inspection with digital non-destructive evaluation for mobility restoration.
- Primary tools: structural NDE sensor suites, bridge digital inspection workflows, route release planners.
- Cross-check tools: independent structural confidence review board and alternate bypass feasibility model.
- Typical products: bridge confidence report, route release recommendation, repair-versus-bypass matrix.

### `ts-energy-physical-cyber-convergence-v1`
- Use for: blended physical-cyber defense and recovery of energy infrastructure in contested operations.
- Primary tools: OT security monitoring platforms, grid telemetry analytics, physical security incident fusion boards.
- Cross-check tools: independent infrastructure fault-trace board and alternate cyber impact monitor.
- Typical products: converged threat impact brief, defense synchronization order, restoration branch matrix.

### `ts-pnt-timing-protection-v1`
- Use for: military-civil timing dependency protection during satellite navigation warfare and PNT disruption.
- Primary tools: timing integrity monitors, holdover oscillator status boards, dependency mapping services.
- Cross-check tools: independent timing reference validator and alternate critical-system drift tracker.
- Typical products: timing dependency risk map, holdover plan, navwar mitigation decision matrix.

### `ts-force-mental-health-postvention-v1`
- Use for: command postvention planning after suicide events with readiness stabilization and care coordination.
- Primary tools: command climate analytics, behavioral health coordination systems, chaplain support workflows.
- Cross-check tools: independent care-follow-up audit board and alternate readiness stress monitor.
- Typical products: postvention action plan, stabilization timeline, care escalation tracker.

### `ts-space-reentry-warning-v1`
- Use for: launch debris and reentry hazard warning coordination across military-civil stakeholders.
- Primary tools: reentry trajectory models, debris hazard estimation tools, civil warning coordination dashboards.
- Cross-check tools: independent trajectory verification service and alternate impact-risk monitor.
- Typical products: reentry warning packet, notification timeline, protective action matrix.

### `ts-urban-utility-restoration-v1`
- Use for: utility restoration sequencing in contested urban siege or post-strike disruption scenarios.
- Primary tools: utility outage management systems, repair crew scheduling tools, urban service demand models.
- Cross-check tools: independent service restoration verifier and alternate civilian impact monitor.
- Typical products: utility restoration sequence matrix, security-constrained repair plan, civilian-impact brief.

### `ts-additive-ip-compliance-v1`
- Use for: additive spare-part manufacturing with intellectual-property, export-control, and quality compliance gates.
- Primary tools: digital part-file governance platforms, licensing/compliance checkers, additive quality certification tools.
- Cross-check tools: independent provenance audit service and alternate legal-compliance review board.
- Typical products: fabrication compliance decision matrix, approved part-file release order, traceability audit packet.

### `ts-diver-salvage-life-support-v1`
- Use for: diver life-support management, decompression safety governance, and maritime salvage sequencing.
- Primary tools: dive profile planners, decompression chamber status systems, salvage task orchestration boards.
- Cross-check tools: independent dive medical risk monitor and alternate decompression confidence ledger.
- Typical products: diver life-support timeline, decompression risk controls, salvage sequence order.

### `ts-nav-chart-denial-recovery-v1`
- Use for: degraded maritime navigation when electronic charts are denied, spoofed, or stale.
- Primary tools: electronic chart distribution services, hydrographic update systems, route assurance planners.
- Cross-check tools: independent paper-chart validation board and alternate celestial/inertial route check.
- Typical products: chart integrity recovery plan, degraded-route matrix, navigation confidence ledger.

### `ts-aircraft-battle-damage-triage-v1`
- Use for: aircraft damage forensics, repairability triage, and sortie return prioritization.
- Primary tools: battle-damage imaging suites, maintenance diagnostics systems, sortie generation boards.
- Cross-check tools: independent depot-level engineering review and alternate fault-isolation dashboard.
- Typical products: aircraft forensic triage board, repair or cannibalization matrix, sortie return timeline.

### `ts-space-maneuver-intent-v1`
- Use for: intent inference and risk assessment for adversary or unknown orbital maneuvers.
- Primary tools: SDA maneuver detection services, conjunction analysis systems, orbital behavior baselines.
- Cross-check tools: independent orbital catalog mirror and alternate maneuver confidence board.
- Typical products: maneuver intent assessment brief, escalation trigger map, response options ledger.

### `ts-critical-mineral-interdiction-v1`
- Use for: coalition disruption of illicit critical-mineral flows that support adversary war production.
- Primary tools: trade-manifest anomaly analytics, maritime cargo risk systems, sanctions network trackers.
- Cross-check tools: independent customs intelligence mirror and alternate financial-flow adjudication board.
- Typical products: interdiction synchronization plan, network priority board, legal-action matrix.

### `ts-geospatial-datum-integrity-v1`
- Use for: geospatial datum verification and coordinate integrity protection for targeting and maneuver.
- Primary tools: geodesy transformation validators, map service integrity monitors, fires coordinate checkers.
- Cross-check tools: independent survey control dataset and alternate coordinate error-trace service.
- Typical products: datum risk matrix, coordinate correction order, precision confidence ledger.

### `ts-drone-forensics-attribution-v1`
- Use for: exploitation and attribution of recovered drones to update defenses and legal evidence packets.
- Primary tools: drone hardware/software exploitation labs, RF signature analyzers, provenance case managers.
- Cross-check tools: independent component provenance verifier and alternate attribution confidence board.
- Typical products: drone attribution packet, exploit-to-countermeasure update board, evidence ledger.

### `ts-rail-sabotage-continuity-v1`
- Use for: rail-sabotage detection, rapid damage triage, and throughput continuity restoration.
- Primary tools: rail sensor telemetry systems, structural inspection tools, movement throughput planners.
- Cross-check tools: independent civil rail status mirror and alternate reroute feasibility model.
- Typical products: sabotage response plan, reroute or repair matrix, throughput continuity timeline.

### `ts-expeditionary-food-safety-v1`
- Use for: deployed food contamination control and ration continuity in contested sustainment conditions.
- Primary tools: food chain traceability systems, cold-chain telemetry monitors, preventive medicine dashboards.
- Cross-check tools: independent contamination sampling board and alternate spoilage risk predictor.
- Typical products: food safety containment order, lot disposition matrix, ration continuity plan.

### `ts-smoke-obscurant-effects-v1`
- Use for: tactical obscurant planning that balances survivability gains with fratricide and sensor risk.
- Primary tools: obscurant dispersion models, weather effects engines, fires and maneuver synchronization boards.
- Cross-check tools: independent visibility impact estimator and alternate blue-force sensor integrity monitor.
- Typical products: obscurant synchronization matrix, visibility risk board, trigger timeline.

### `ts-sensitive-target-legal-review-v1`
- Use for: accelerated legal-policy review of sensitive target nominations under strict audit requirements.
- Primary tools: target dossier management systems, CDE/legal review workflows, authority-trace services.
- Cross-check tools: independent law-of-war adjudication board and alternate collateral-confidence monitor.
- Typical products: legal review packet, approval risk matrix, decision audit trail.

### `ts-refugee-biometrics-deconfliction-v1`
- Use for: humanitarian screening and biometric deconfliction at scale during displacement events.
- Primary tools: population movement trackers, biometric enrollment systems, identity adjudication portals.
- Cross-check tools: independent watchlist reconciliation board and alternate humanitarian exception ledger.
- Typical products: screening operations plan, deconfliction exception log, protection balance matrix.

### `ts-harbor-siltation-dredging-v1`
- Use for: harbor depth degradation response and dredging prioritization for military sealift continuity.
- Primary tools: bathymetric survey systems, dredging fleet schedulers, sealift throughput analyzers.
- Cross-check tools: independent hydrographic confidence board and alternate channel risk monitor.
- Typical products: dredging contingency plan, throughput risk matrix, dredge-priority schedule.

### `ts-polar-ionospheric-comms-v1`
- Use for: communications continuity under polar ionospheric disturbance and adversary interference.
- Primary tools: ionospheric forecast services, HF and SATCOM health monitors, path-switching orchestrators.
- Cross-check tools: independent propagation model and alternate mission comms confidence board.
- Typical products: polar comms continuity plan, switching matrix, degraded comms branch chart.

### `ts-dam-failure-flood-ops-v1`
- Use for: dam-failure warning, floodplain response, and downstream infrastructure protection operations.
- Primary tools: dam health monitoring systems, flood inundation models, evacuation coordination dashboards.
- Cross-check tools: independent hydrologic forecast mirror and alternate infrastructure exposure validator.
- Typical products: dam-failure contingency order, floodplain protection priorities, rescue timeline.

### `ts-battlefield-hearing-conservation-v1`
- Use for: hearing-injury prevention and readiness preservation in sustained high-noise combat environments.
- Primary tools: exposure monitoring systems, hearing PPE distribution trackers, audiology readiness dashboards.
- Cross-check tools: independent medical trend analyzer and alternate communication-impact board.
- Typical products: hearing mitigation plan, PPE allocation matrix, hearing readiness status report.

### `ts-farp-dispersion-under-uas-v1`
- Use for: FARP dispersion and reconfiguration under persistent UAS ISR and strike risk.
- Primary tools: FARP signature assessment systems, UAS threat overlays, rearm/refuel throughput planners.
- Cross-check tools: independent survivability board and alternate logistics demand reconciler.
- Typical products: FARP dispersion plan, survivability-throughput tradeoff matrix, rapid service timeline.

### `ts-geomagnetic-grid-hardening-v1`
- Use for: protective hardening and restoration planning for mission grids during geomagnetic storms.
- Primary tools: space-weather warning systems, transformer vulnerability maps, critical-load orchestration tools.
- Cross-check tools: independent grid resilience monitor and alternate backup-power readiness board.
- Typical products: hardening plan, critical-load preservation matrix, restoration branch timeline.

### `ts-cold-chain-cargo-assurance-v1`
- Use for: cold-chain assurance for rations, blood, vaccines, and medical cargo in contested routes.
- Primary tools: cargo temperature telemetry systems, transfer-point integrity trackers, spoilage risk analytics.
- Cross-check tools: independent chain-of-custody audit board and alternate refrigeration failure predictor.
- Typical products: cold-chain assurance plan, cargo risk-diversion matrix, spoilage prevention task board.

### `ts-autonomous-perimeter-alert-governance-v1`
- Use for: suppression of perimeter false alarms while preserving true intrusion detection performance.
- Primary tools: autonomous sensor fusion platforms, alert triage engines, guard-force readiness dashboards.
- Cross-check tools: independent intrusion adjudication board and alternate spoofing-pattern analyzer.
- Typical products: alert tuning order, false-alarm suppression matrix, response confidence ledger.

### `ts-coalition-aviation-phraseology-v1`
- Use for: coalition aviation phraseology standardization and readback assurance in mixed-language operations.
- Primary tools: coalition comms quality monitoring tools, phraseology compliance checkers, training loop dashboards.
- Cross-check tools: independent incident debrief board and alternate miscommunication trend monitor.
- Typical products: phraseology control plan, misunderstanding risk matrix, mandatory readback checklist.

### `ts-nuclear-accident-consequence-v1`
- Use for: nuclear weapon accident consequence management, contamination control, and restoration sequencing.
- Primary tools: radiological sensor fusion services, hazard-plume models, restoration coordination boards.
- Cross-check tools: independent dosimetry sampling chain and alternate consequence confidence board.
- Typical products: consequence packet, contamination control matrix, phased restoration timeline.

### `ts-satcom-anti-jam-reconstitution-v1`
- Use for: anti-jam tactical SATCOM terminal reconstitution and mission-priority connectivity restoration.
- Primary tools: SATCOM link health monitors, anti-jam waveform managers, terminal provisioning orchestrators.
- Cross-check tools: independent signal integrity analyzer and alternate path assurance board.
- Typical products: reconstitution plan, terminal priority board, comms continuity branch.

### `ts-commercial-shipping-protection-v1`
- Use for: coalition commercial shipping protection, convoy threat routing, and chokepoint assurance.
- Primary tools: maritime COP, vessel threat-intel fusion tools, escort assignment planners.
- Cross-check tools: independent shipping risk monitor and alternate route feasibility board.
- Typical products: shipping protection plan, convoy risk board, reroute decision matrix.

### `ts-ammo-lot-reliability-v1`
- Use for: long-range fires ammunition lot reliability screening and risk-informed release controls.
- Primary tools: ammunition telemetry repositories, lot quality analytics, fires sustainment planners.
- Cross-check tools: independent ballistic confidence board and alternate lot-sampling validator.
- Typical products: lot reliability assessment, hold/release matrix, expenditure risk plan.

### `ts-biomass-fuel-expeditionary-v1`
- Use for: expeditionary biomass fuel conversion planning and local energy generation continuity.
- Primary tools: feedstock characterization tools, conversion-output analyzers, fuel quality governance boards.
- Cross-check tools: independent chemistry validation service and alternate logistics demand model.
- Typical products: conversion feasibility brief, feedstock matrix, output quality risk ledger.

### `ts-arctic-over-snow-logistics-v1`
- Use for: over-snow corridor planning, mobility assurance, and Arctic sustainment pacing.
- Primary tools: snow/ice route intelligence tools, over-snow vehicle readiness dashboards, throughput planners.
- Cross-check tools: independent weather-ice risk board and alternate route survivability model.
- Typical products: corridor plan, mobility-risk overlay, sustainment throughput timeline.

### `ts-megacity-underground-infrastructure-v1`
- Use for: megacity underground utility mapping for maneuver safety, targeting protection, and restoration.
- Primary tools: subsurface mapping fusion systems, utility geodata registries, conflict-avoidance planners.
- Cross-check tools: independent engineering survey mirror and alternate infrastructure confidence board.
- Typical products: utility risk map, no-strike utility register, restoration sequencing options.

### `ts-civil-airlift-requisition-v1`
- Use for: civilian airlift requisition, aircraft allocation governance, and throughput prioritization.
- Primary tools: civil reserve air fleet coordination systems, air movement prioritization boards, slot managers.
- Cross-check tools: independent carrier availability monitor and alternate flow optimization board.
- Typical products: airlift requisition packet, allocation matrix, movement timeline.

### `ts-prison-overrun-contingency-v1`
- Use for: prison overrun contingency planning with detainee accountability and force protection.
- Primary tools: detainee accountability ledgers, facility security telemetry, crisis response tasking boards.
- Cross-check tools: independent custody reconciliation monitor and alternate incident adjudication board.
- Typical products: overrun contingency plan, detainee accountability branch, stabilization task board.

### `ts-autonomous-convoy-liability-v1`
- Use for: autonomous convoy legal-liability governance, incident traceability, and command approval routing.
- Primary tools: autonomous route controllers, safety evidence ledgers, legal review workflow tools.
- Cross-check tools: independent incident reconstruction service and alternate liability scoring board.
- Typical products: governance packet, liability matrix, authority escalation chain.

### `ts-waterborne-outbreak-response-v1`
- Use for: expeditionary waterborne disease outbreak detection, containment, and treatment coordination.
- Primary tools: force-health surveillance systems, water quality telemetry, treatment capacity dashboards.
- Cross-check tools: independent lab confirmation chain and alternate epidemiology monitor.
- Typical products: outbreak response plan, source risk board, treatment timeline.

### `ts-cross-border-fire-hotline-v1`
- Use for: coalition cross-border fires hotline operations, deconfliction governance, and escalation prevention.
- Primary tools: fires coordination networks, hotline logging systems, escalation decision boards.
- Cross-check tools: independent strike-event reconciler and alternate diplomatic coordination tracker.
- Typical products: hotline matrix, deconfliction window board, escalation trigger map.

### `ts-ew-fratricide-mitigation-v1`
- Use for: EW fratricide mitigation through emitter protection, effects timing controls, and spectrum governance.
- Primary tools: EW tasking boards, emitter identity ledgers, effect simulation tools.
- Cross-check tools: independent blue-force emissions monitor and alternate conflict adjudication board.
- Typical products: EW fratricide matrix, protected emitter list, deconfliction timeline.

### `ts-rare-earth-refining-protection-v1`
- Use for: sabotage response and continuity planning for strategic rare-earth refining capacity.
- Primary tools: industrial telemetry analytics, strategic materials dashboards, restoration schedulers.
- Cross-check tools: independent production capacity verifier and alternate market-shock monitor.
- Typical products: sabotage impact brief, restoration priority board, continuity plan.

### `ts-fiber-backbone-restoration-v1`
- Use for: theater fiber backbone restoration, reroute orchestration, and mission-network prioritization.
- Primary tools: telecom fault localization systems, route engineering planners, mission traffic prioritizers.
- Cross-check tools: independent link integrity monitor and alternate route assurance board.
- Typical products: restoration plan, reroute matrix, resilience timeline.

### `ts-cislunar-logistics-window-v1`
- Use for: cislunar logistics window planning and reentry support timing assurance.
- Primary tools: orbital ephemeris planners, mission timing coordinators, reentry support dashboards.
- Cross-check tools: independent orbital risk monitor and alternate timing confidence board.
- Typical products: logistics window plan, reentry support matrix, timing risk ledger.

### `ts-multispectral-camouflage-assurance-v1`
- Use for: multispectral camouflage effectiveness testing and signature suppression optimization.
- Primary tools: spectral signature analyzers, ISR threat modelers, camouflage design evaluators.
- Cross-check tools: independent red-team ISR assessment and alternate detectability trend monitor.
- Typical products: camouflage assessment, signature reduction options, survivability board.

### `ts-amphibious-shore-entry-control-v1`
- Use for: amphibious humanitarian shore-entry control, beach throughput, and aid security governance.
- Primary tools: littoral traffic managers, beach logistics dashboards, aid handoff tracking tools.
- Cross-check tools: independent shoreline risk assessor and alternate humanitarian flow board.
- Typical products: shore-entry control plan, throughput matrix, aid governance packet.

### `ts-civil-engagement-language-support-v1`
- Use for: tactical civil engagement planning with interpreter scheduling and language-risk controls.
- Primary tools: language service dispatch systems, civil engagement trackers, message assurance tools.
- Cross-check tools: independent cultural-risk review board and alternate miscommunication monitor.
- Typical products: engagement packet, interpreter tasking plan, message risk matrix.

### `ts-weapons-software-supply-chain-v1`
- Use for: weapon-system software supply-chain assurance, provenance checks, and release governance.
- Primary tools: SBOM repositories, signed artifact verifiers, mission risk gate workflows.
- Cross-check tools: independent vulnerability intelligence service and alternate release-integrity board.
- Typical products: supply assurance report, hold/release matrix, risk acceptance packet.

## Protocol Stack Catalog

### `ps-joint-tactical-link-stack-v1`
- Protocols: `Link 16 J-series`, `VMF`, `USMTF`.
- Use for: time-sensitive multi-domain tactical coordination.

### `ps-cop-event-sharing-stack-v1`
- Protocols: `CoT`, `USMTF`, `API/JSON`.
- Use for: COP updates, shared event distribution, mission watchfloor operations.

### `ps-geo-maritime-stack-v1`
- Protocols: `AIS/NMEA`, `OGC WMS/WFS/WMTS`, `USMTF`.
- Use for: maritime track management and undersea infrastructure operations.

### `ps-cyber-threat-stack-v1`
- Protocols: `STIX/TAXII`, `MISP`, `API/JSON`.
- Use for: cyber intelligence sharing, indicator exchange, defensive coordination.

### `ps-medical-readiness-stack-v1`
- Protocols: `HL7/FHIR`, `USMTF`, `API/JSON`.
- Use for: medical movement, force health surveillance, med-log interoperability.

### `ps-civil-emergency-stack-v1`
- Protocols: `NIMS/ICS`, `EDXL-DE/CAP`, `USMTF`.
- Use for: domestic response coordination and public warning alignment.

### `ps-aviation-weather-stack-v1`
- Protocols: `AIXM/FIXM/IWXXM`, `USMTF`, `API/JSON`.
- Use for: aviation mission planning under degraded navigation/weather constraints.

### `ps-nato-coalition-stack-v1`
- Protocols: `NATO APP-11/ADatP-3 aligned`, `USMTF`, `OGC`.
- Use for: coalition mission coordination and releasable message exchange.

### `ps-cbrn-emergency-stack-v1`
- Protocols: `EDXL-DE/CAP`, `USMTF`, `API/JSON`.
- Use for: CBRN consequence management and military-civil emergency restoration coordination.

### `ps-detainee-accountability-stack-v1`
- Protocols: `USMTF`, `NATO APP-11/ADatP-3 aligned`, `API/JSON`.
- Use for: detainee status transfer, custody accountability, and coalition legal traceability.

### `ps-finance-disconnected-pay-stack-v1`
- Protocols: `API/JSON`, `USMTF`, `STIX/TAXII`.
- Use for: contested-theater pay continuity, fraud monitoring, and reconciliation handoffs.

### `ps-truce-observer-stack-v1`
- Protocols: `USMTF`, `NATO APP-11/ADatP-3 aligned`, `CoT`, `API/JSON`.
- Use for: prisoner exchange/truce monitoring workflows, compliance incident reporting, and coalition observer synchronization.

### `ps-osint-info-ops-stack-v1`
- Protocols: `STIX/TAXII`, `MISP`, `API/JSON`, `CoT`.
- Use for: influence campaign attribution, disinformation detection, and coordinated information operation response.

### `ps-radiological-urban-response-stack-v1`
- Protocols: `EDXL-DE/CAP`, `USMTF`, `NIMS/ICS`, `API/JSON`.
- Use for: radiological urban emergency coordination, consequence management, and restoration tasking.

### `ps-maritime-quarantine-stack-v1`
- Protocols: `AIS/NMEA`, `USMTF`, `EDXL-DE/CAP`, `API/JSON`.
- Use for: maritime inspection/quarantine control at chokepoints with public health and force-flow synchronization.

### `ps-critical-infrastructure-triage-stack-v1`
- Protocols: `USMTF`, `NIMS/ICS`, `OGC WMS/WFS/WMTS`, `API/JSON`.
- Use for: post-strike critical infrastructure triage and cross-domain restoration prioritization.

### `ps-wmd-neutralization-stack-v1`
- Protocols: `USMTF`, `EDXL-DE/CAP`, `STIX/TAXII`, `NATO APP-11/ADatP-3 aligned`.
- Use for: joint counter-WMD site neutralization planning, contamination controls, and coalition/interagency legal traceability.

### `ps-undersea-rescue-stack-v1`
- Protocols: `USMTF`, `OGC WMS/WFS/WMTS`, `API/JSON`.
- Use for: distressed submarine rescue synchronization, underwater asset routing, and rescue milestone acknowledgments.

### `ps-harbor-safety-logistics-stack-v1`
- Protocols: `USMTF`, `OGC WMS/WFS/WMTS`, `API/JSON`.
- Use for: explosive safety zoning, port munitions loading control, and pier risk coordination.

### `ps-courier-assurance-stack-v1`
- Protocols: `USMTF`, `NATO APP-11/ADatP-3 aligned`, `API/JSON`.
- Use for: denied-network physical message custody and courier acknowledgment workflows.

### `ps-fuel-quality-forensics-stack-v1`
- Protocols: `USMTF`, `API/JSON`, `STIX/TAXII`.
- Use for: aviation fuel contamination reporting, forensic handoffs, and sortie fuel risk coordination.

### `ps-demil-safety-stack-v1`
- Protocols: `USMTF`, `NIMS/ICS`, `API/JSON`.
- Use for: ammunition demilitarization safety controls, disposal coordination, and compliance documentation.

### `ps-hazard-warning-stack-v1`
- Protocols: `EDXL-DE/CAP`, `NIMS/ICS`, `USMTF`, `API/JSON`.
- Use for: coastal tsunami/seismic warning integration and phased force-protection trigger execution.

### `ps-border-clearance-stack-v1`
- Protocols: `NATO APP-11/ADatP-3 aligned`, `USMTF`, `API/JSON`.
- Use for: coalition customs and border-clearance synchronization with legal/inspection traceability.

### `ps-humanitarian-airdrop-stack-v1`
- Protocols: `USMTF`, `NATO APP-11/ADatP-3 aligned`, `CoT`, `API/JSON`.
- Use for: coalition humanitarian airdrop corridor governance, drop-zone deconfliction, and delivery verification.

### `ps-engineer-nde-stack-v1`
- Protocols: `USMTF`, `OGC WMS/WFS/WMTS`, `API/JSON`.
- Use for: bridge structural non-destructive evaluation reporting, route release decisions, and repair tasking.

### `ps-pnt-timing-resilience-stack-v1`
- Protocols: `USMTF`, `AIXM/FIXM/IWXXM`, `API/JSON`.
- Use for: timing dependency protection and holdover synchronization during navwar and PNT degradation.

### `ps-force-health-postvention-stack-v1`
- Protocols: `HL7/FHIR`, `USMTF`, `API/JSON`.
- Use for: command postvention support, care coordination, and readiness stabilization tracking after suicide events.

### `ps-space-reentry-warning-stack-v1`
- Protocols: `USMTF`, `EDXL-DE/CAP`, `API/JSON`, `OGC WMS/WFS/WMTS`.
- Use for: launch debris and reentry hazard warnings with military-civil protective action coordination.

### `ps-additive-compliance-stack-v1`
- Protocols: `API/JSON`, `NATO APP-11/ADatP-3 aligned`, `USMTF`.
- Use for: additive part-file licensing, export-control compliance, and quality-traceability handoffs.

### `ps-maritime-navigation-integrity-stack-v1`
- Protocols: `AIS/NMEA`, `OGC WMS/WFS/WMTS`, `USMTF`, `API/JSON`.
- Use for: maritime chart integrity assurance, degraded navigation routing, and hydrographic update coordination.

### `ps-aviation-maintenance-forensics-stack-v1`
- Protocols: `USMTF`, `AIXM/FIXM/IWXXM`, `API/JSON`.
- Use for: aircraft battle-damage forensics, repairability decisions, and sortie return synchronization.

### `ps-space-intent-warning-stack-v1`
- Protocols: `USMTF`, `OGC WMS/WFS/WMTS`, `API/JSON`.
- Use for: orbital maneuver intent assessment, conjunction warning, and response-option coordination.

### `ps-coalition-interdiction-ledger-stack-v1`
- Protocols: `NATO APP-11/ADatP-3 aligned`, `USMTF`, `STIX/TAXII`, `API/JSON`.
- Use for: coalition interdiction case exchange, sanctions-evasion traceability, and legal-action synchronization.

### `ps-geodesy-coordinate-assurance-stack-v1`
- Protocols: `OGC WMS/WFS/WMTS`, `USMTF`, `API/JSON`.
- Use for: datum verification, coordinate transformation assurance, and targeting precision governance.

### `ps-drone-exploitation-evidence-stack-v1`
- Protocols: `STIX/TAXII`, `MISP`, `USMTF`, `API/JSON`.
- Use for: recovered-drone exploitation, attribution evidence sharing, and countermeasure update distribution.

### `ps-rail-continuity-command-stack-v1`
- Protocols: `USMTF`, `NIMS/ICS`, `API/JSON`.
- Use for: rail sabotage response coordination, reroute control, and throughput continuity tracking.

### `ps-force-health-logistics-safety-stack-v1`
- Protocols: `HL7/FHIR`, `USMTF`, `API/JSON`.
- Use for: expeditionary food-safety event coordination, contamination control, and sustainment health risk management.

### `ps-fires-obscurant-control-stack-v1`
- Protocols: `VMF`, `USMTF`, `Link 16 J-series`, `API/JSON`.
- Use for: obscurant employment synchronization with maneuver, fires, and fratricide risk controls.

### `ps-legal-targeting-assurance-stack-v1`
- Protocols: `USMTF`, `NATO APP-11/ADatP-3 aligned`, `API/JSON`.
- Use for: sensitive target legal review, authority traceability, and approval audit continuity.

### `ps-humanitarian-screening-biometrics-stack-v1`
- Protocols: `HL7/FHIR`, `NIMS/ICS`, `USMTF`, `API/JSON`.
- Use for: refugee screening, biometric deconfliction, and humanitarian-force protection coordination.

### `ps-maritime-harbor-restoration-stack-v1`
- Protocols: `AIS/NMEA`, `OGC WMS/WFS/WMTS`, `USMTF`, `API/JSON`.
- Use for: harbor siltation response, dredging synchronization, and sealift channel restoration tracking.

### `ps-polar-comms-resilience-stack-v1`
- Protocols: `USMTF`, `AIXM/FIXM/IWXXM`, `API/JSON`.
- Use for: polar comms path switching under ionospheric degradation and interference conditions.

### `ps-civil-flood-response-stack-v1`
- Protocols: `EDXL-DE/CAP`, `NIMS/ICS`, `USMTF`, `API/JSON`.
- Use for: dam-failure warning, floodplain evacuation, and downstream infrastructure protection operations.

### `ps-force-health-hearing-protection-stack-v1`
- Protocols: `HL7/FHIR`, `USMTF`, `API/JSON`.
- Use for: noise-exposure governance, hearing protection readiness, and combat-hearing risk tracking.

### `ps-farp-survivability-stack-v1`
- Protocols: `VMF`, `Link 16 J-series`, `USMTF`, `API/JSON`.
- Use for: FARP dispersion control, UAS threat adaptation, and rapid rearm/refuel continuity.

### `ps-space-weather-grid-protection-stack-v1`
- Protocols: `AIXM/FIXM/IWXXM`, `USMTF`, `NIMS/ICS`, `API/JSON`.
- Use for: geomagnetic storm hardening execution and mission grid restoration coordination.

### `ps-cold-chain-assurance-stack-v1`
- Protocols: `HL7/FHIR`, `USMTF`, `API/JSON`.
- Use for: temperature-controlled cargo assurance and spoilage-risk mitigation in contested logistics.

### `ps-base-defense-sensor-assurance-stack-v1`
- Protocols: `CoT`, `USMTF`, `API/JSON`.
- Use for: autonomous perimeter sensor tuning, false-alarm suppression, and intrusion response governance.

### `ps-coalition-aviation-phraseology-stack-v1`
- Protocols: `NATO APP-11/ADatP-3 aligned`, `AIXM/FIXM/IWXXM`, `USMTF`, `API/JSON`.
- Use for: coalition aviation phraseology standardization, readback assurance, and comms risk reduction.

### `ps-nuclear-accident-consequence-stack-v1`
- Protocols: `EDXL-DE/CAP`, `NIMS/ICS`, `USMTF`, `API/JSON`.
- Use for: nuclear weapon accident consequence coordination and restoration control.

### `ps-satcom-antijam-reconstitution-stack-v1`
- Protocols: `USMTF`, `Link 16 J-series`, `API/JSON`.
- Use for: anti-jam SATCOM reconstitution and mission-priority terminal synchronization.

### `ps-commercial-shipping-protection-stack-v1`
- Protocols: `AIS/NMEA`, `USMTF`, `NATO APP-11/ADatP-3 aligned`, `API/JSON`.
- Use for: coalition shipping protection and contested chokepoint convoy control.

### `ps-ammunition-reliability-governance-stack-v1`
- Protocols: `USMTF`, `VMF`, `API/JSON`.
- Use for: ammunition lot reliability governance and fires release/hold controls.

### `ps-expeditionary-energy-conversion-stack-v1`
- Protocols: `USMTF`, `NIMS/ICS`, `API/JSON`.
- Use for: expeditionary biomass fuel conversion coordination and fuel quality governance.

### `ps-arctic-logistics-corridor-stack-v1`
- Protocols: `USMTF`, `OGC WMS/WFS/WMTS`, `API/JSON`.
- Use for: Arctic over-snow logistics corridor control and route survivability updates.

### `ps-underground-utility-mapping-stack-v1`
- Protocols: `OGC WMS/WFS/WMTS`, `USMTF`, `API/JSON`.
- Use for: contested megacity underground utility mapping and no-strike infrastructure coordination.

### `ps-civil-airlift-requisition-stack-v1`
- Protocols: `AIXM/FIXM/IWXXM`, `USMTF`, `API/JSON`.
- Use for: civilian airlift requisition workflows and priority movement assignment.

### `ps-prison-overrun-contingency-stack-v1`
- Protocols: `USMTF`, `NATO APP-11/ADatP-3 aligned`, `API/JSON`.
- Use for: prison overrun contingency response and detainee accountability transitions.

### `ps-autonomous-convoy-liability-stack-v1`
- Protocols: `USMTF`, `STIX/TAXII`, `API/JSON`.
- Use for: autonomous convoy incident evidence, liability routing, and safety-governance escalation.

### `ps-waterborne-outbreak-response-stack-v1`
- Protocols: `HL7/FHIR`, `EDXL-DE/CAP`, `USMTF`, `API/JSON`.
- Use for: waterborne disease outbreak response in expeditionary and host-nation interfaces.

### `ps-cross-border-fire-deconfliction-stack-v1`
- Protocols: `USMTF`, `VMF`, `NATO APP-11/ADatP-3 aligned`, `API/JSON`.
- Use for: cross-border fire hotline deconfliction and escalation prevention.

### `ps-ew-fratricide-mitigation-stack-v1`
- Protocols: `Link 16 J-series`, `VMF`, `USMTF`, `API/JSON`.
- Use for: electronic warfare fratricide-risk mitigation and protected-emitter coordination.

### `ps-rare-earth-refining-response-stack-v1`
- Protocols: `USMTF`, `NIMS/ICS`, `STIX/TAXII`, `API/JSON`.
- Use for: strategic rare-earth refining sabotage response and continuity governance.

### `ps-fiber-backbone-restoration-stack-v1`
- Protocols: `STIX/TAXII`, `USMTF`, `API/JSON`.
- Use for: theater fiber restoration and reroute command synchronization.

### `ps-cislunar-logistics-support-stack-v1`
- Protocols: `USMTF`, `OGC WMS/WFS/WMTS`, `API/JSON`.
- Use for: cislunar logistics window planning and reentry support coordination.

### `ps-multispectral-camouflage-assurance-stack-v1`
- Protocols: `USMTF`, `OGC WMS/WFS/WMTS`, `API/JSON`.
- Use for: multispectral camouflage validation and ISR detectability reduction workflows.

### `ps-amphibious-shore-entry-control-stack-v1`
- Protocols: `USMTF`, `NIMS/ICS`, `CoT`, `API/JSON`.
- Use for: amphibious humanitarian shore-entry and beach throughput control.

### `ps-civil-engagement-language-stack-v1`
- Protocols: `NIMS/ICS`, `USMTF`, `API/JSON`.
- Use for: tactical language-enabled civil engagement and interpreter-driven risk reduction.

### `ps-weapons-software-supply-chain-stack-v1`
- Protocols: `STIX/TAXII`, `USMTF`, `API/JSON`.
- Use for: weapon-system software provenance assurance and release-governance risk gates.

## Endpoint Security Profiles

- `esp-mission-secret-api-gateway-v1`: authenticated enclave API gateway with signed payload and schema checks.
- `esp-cross-domain-guarded-transfer-v1`: mediated transfer via approved CDS/guard with releasability gates.
- `esp-tactical-mesh-forward-v1`: intermittent edge transport with queued retries and hash-based integrity checks.
- `esp-coalition-releasable-bridge-v1`: coalition bridge enforcing caveat tags, field-level redaction, and translation audit.

## Selection Rules

1. Select one `tool_suite_id` and one `protocol_stack_id` before producing options.
2. Use a cross-check source unless a single validated authoritative source is mandated.
3. Bind each critical recommendation to an endpoint security profile.
4. If transport degrades, publish a degraded exchange method with timeline impact.
5. Include one machine-ingestible payload plus one commander-readable summary.
6. If no listed suite fits, create a provisional entry and assign a validation owner and suspense.

## Output Snippet Template

```text
external_binding:
  tool_suite_id:
  protocol_stack_id:
  interop_standard_set:
  endpoint_security_profile:
  primary_exchange_path:
  degraded_exchange_method:
  latency_budget_seconds:
  ack_timeout_seconds:
  validation_owner:
```

### `ts-high-altitude-object-response-v1`
- Use for: high-altitude object detection triage, engagement recommendation support, and debris recovery synchronization.
- Primary tools: integrated air warning COP, sensor fusion alerting, debris field prediction services.
- Cross-check tools: independent radar track validator and alternate visual/EO corroboration board.
- Typical products: track confidence ledger, engagement options packet, debris recovery order.

### `ts-quantum-navigation-transition-v1`
- Use for: quantum navigation pilot operations, PNT degradation fallback, and transition assurance.
- Primary tools: quantum-inertial fusion prototypes, timing integrity monitors, route assurance planners.
- Cross-check tools: independent inertial baseline monitor and alternate PNT anomaly tracker.
- Typical products: transition matrix, pilot validation report, assurance risk ledger.

### `ts-portable-nuclear-reactor-safety-v1`
- Use for: expeditionary portable reactor safety planning, exclusion zoning, and emergency consequence control.
- Primary tools: reactor diagnostics dashboards, radiation hazard modelers, emergency command boards.
- Cross-check tools: independent health physics monitor and alternate plume consequence model.
- Typical products: reactor safety case, exclusion-zone map, emergency branch plan.

### `ts-working-animal-evacuation-v1`
- Use for: military working animal triage, transport scheduling, and zoonotic-control integration.
- Primary tools: veterinary case systems, evacuation schedulers, biosurveillance trackers.
- Cross-check tools: independent case-status roster and alternate transport capacity board.
- Typical products: evacuation priority board, treatment timeline, zoonotic mitigation packet.

### `ts-coalition-rail-gauge-interoperability-v1`
- Use for: coalition rail gauge transition, transload throughput balancing, and waiver coordination.
- Primary tools: rail corridor schedulers, manifest conversion tools, customs waiver trackers.
- Cross-check tools: independent rail bottleneck monitor and alternate coalition queue board.
- Typical products: gauge transition plan, throughput forecast, waiver decision packet.

### `ts-under-ice-submarine-risk-v1`
- Use for: under-ice submarine route risk analysis, surfacing contingency planning, and comms-loss governance.
- Primary tools: sea-ice drift models, under-ice route planners, submarine navigation analyzers.
- Cross-check tools: independent ice-density model and alternate acoustic cue board.
- Typical products: transit risk matrix, surfacing contingency ladder, comms-loss branch triggers.

### `ts-civilian-hospital-overflow-integration-v1`
- Use for: civil-military hospital overflow integration, casualty diversion, and ICU constraint balancing.
- Primary tools: bed management exchanges, casualty regulation systems, emergency transport dispatch boards.
- Cross-check tools: independent bed availability mirror and alternate hospital network status board.
- Typical products: overflow integration matrix, diversion plan, critical-care trigger board.

### `ts-geothermal-expeditionary-power-v1`
- Use for: geothermal site feasibility in contested theaters and expeditionary power integration.
- Primary tools: geothermal survey tools, base load analytics, geohazard screening dashboards.
- Cross-check tools: independent subsurface model and alternate engineering viability board.
- Typical products: site feasibility brief, force-protection siting matrix, integration plan.

### `ts-cognitive-radio-governance-v1`
- Use for: adaptive cognitive-radio policy governance, spectrum conflict arbitration, and EM risk control.
- Primary tools: cognitive policy engines, spectrum assignment managers, RF conflict analytics.
- Cross-check tools: independent emitter telemetry mesh and alternate conflict adjudication board.
- Typical products: policy envelope, conflict ledger, EM risk recommendation packet.

### `ts-autonomous-maritime-roe-v1`
- Use for: coalition autonomous maritime rules-of-engagement governance and incident escalation.
- Primary tools: autonomous mission control, vessel behavior classifiers, coalition legal workflow boards.
- Cross-check tools: independent ROE interpretation ledger and alternate maritime incident mirror.
- Typical products: ROE decision tree, legal interoperability packet, escalation flow matrix.

### `ts-counterfeit-spare-parts-v1`
- Use for: counterfeit spare-part identification, quarantine governance, and mission-system release controls.
- Primary tools: part provenance ledgers, forensic analysis tools, maintenance release boards.
- Cross-check tools: independent supplier integrity service and alternate failure-pattern analyzer.
- Typical products: counterfeit watchlist, quarantine workflow, release/hold board.

### `ts-electronic-order-of-life-v1`
- Use for: electronic order-of-life baseline modeling and adversary pattern-shift anomaly detection.
- Primary tools: EW telemetry repositories, behavioral analytics pipelines, signature intelligence libraries.
- Cross-check tools: independent anomaly detector and alternate deception-cue board.
- Typical products: baseline model update, anomaly escalation matrix, deception indicator report.

### `ts-droneport-airworthiness-v1`
- Use for: expeditionary droneport certification, airworthiness controls, and UAS traffic safety.
- Primary tools: UAS traffic managers, maintenance compliance services, geofence integrity checks.
- Cross-check tools: independent flight-safety monitor and alternate maintenance readiness board.
- Typical products: droneport certification checklist, traffic flow matrix, mishap prevention branch plan.

### `ts-rocket-dud-risk-v1`
- Use for: rocket/artillery munition dud-risk governance and UXO hazard-informed fires adjustment.
- Primary tools: reliability trend analyzers, impact telemetry, EOD hazard planners.
- Cross-check tools: independent UXO density model and alternate munition lot confidence board.
- Typical products: dud risk heatmap, UXO hazard advisory, fires adjustment matrix.

### `ts-imagery-denial-fallback-v1`
- Use for: space imagery denial fallback planning and non-space ISR retask orchestration.
- Primary tools: ISR collection managers, airborne sensing planners, commercial imagery brokers.
- Cross-check tools: independent collection confidence board and alternate tasking timeline monitor.
- Typical products: fallback collection ladder, retask plan, confidence-gap ledger.

### `ts-detention-rights-oversight-v1`
- Use for: detention human-rights oversight, allegation triage, and coalition remediation tracking.
- Primary tools: detainee accountability platforms, oversight case systems, coalition compliance portals.
- Cross-check tools: independent inspection log and alternate legal adjudication board.
- Typical products: oversight tracker, allegation triage flow, remediation suspense board.

### `ts-stratospheric-sensor-reconstitution-v1`
- Use for: strategic stratospheric sensor-layer recovery and ISR gap management.
- Primary tools: high-altitude platform schedulers, sensor health dashboards, gap analytics services.
- Cross-check tools: independent ISR gap monitor and alternate sortie allocation board.
- Typical products: reconstitution sequence, launch/recovery prioritization plan, gap-risk warning brief.

### `ts-weather-modification-governance-v1`
- Use for: cloud-seeding mission governance, atmospheric effects assessment, and legal-risk control.
- Primary tools: weather forecast models, atmospheric chemistry analytics, legal compliance boards.
- Cross-check tools: independent meteorological validation feed and alternate policy exception ledger.
- Typical products: governance memo, risk-benefit matrix, legal-escalation decision packet.

### `ts-rare-blood-donor-network-v1`
- Use for: rare blood donor matching, contingency mobilization, and transfusion continuity assurance.
- Primary tools: donor registry exchanges, blood inventory systems, casualty demand forecasters.
- Cross-check tools: independent donor verification roster and alternate blood-routing board.
- Typical products: donor availability board, mobilization plan, substitution matrix.

### `ts-civil-grid-load-shedding-coordination-v1`
- Use for: civil grid load-shedding coordination tied to military mission-priority continuity.
- Primary tools: utility control dashboards, mission dependency maps, emergency operations boards.
- Cross-check tools: independent grid telemetry mirror and alternate critical-service outage tracker.
- Typical products: load-shedding priority map, restoration sequence board, critical-service protection matrix.

### `ps-high-altitude-object-response-stack-v1`
- Protocols: `Link 16 J-series`, `USMTF`, `AIXM/FIXM/IWXXM`, `API/JSON`.
- Use for: high-altitude object warning, engagement coordination, and debris response synchronization.

### `ps-quantum-navigation-transition-stack-v1`
- Protocols: `USMTF`, `AIXM/FIXM/IWXXM`, `API/JSON`.
- Use for: quantum-navigation transition control and degraded PNT timing assurance.

### `ps-portable-reactor-safety-stack-v1`
- Protocols: `EDXL-DE/CAP`, `NIMS/ICS`, `USMTF`, `API/JSON`.
- Use for: portable reactor safety alerts, consequence messaging, and emergency branch coordination.

### `ps-working-animal-evacuation-stack-v1`
- Protocols: `HL7/FHIR`, `USMTF`, `API/JSON`.
- Use for: veterinary evacuation coordination and zoonotic-control reporting.

### `ps-rail-gauge-interoperability-stack-v1`
- Protocols: `NATO APP-11/ADatP-3 aligned`, `USMTF`, `API/JSON`.
- Use for: coalition rail gauge transition, transload synchronization, and waiver traceability.

### `ps-under-ice-submarine-risk-stack-v1`
- Protocols: `USMTF`, `OGC WMS/WFS/WMTS`, `API/JSON`.
- Use for: under-ice submarine risk reporting and contingency route synchronization.

### `ps-hospital-overflow-integration-stack-v1`
- Protocols: `HL7/FHIR`, `NIMS/ICS`, `USMTF`, `API/JSON`.
- Use for: civil-military hospital overflow integration and casualty diversion execution.

### `ps-geothermal-site-assessment-stack-v1`
- Protocols: `USMTF`, `OGC WMS/WFS/WMTS`, `API/JSON`.
- Use for: geothermal site assessment exchange and expeditionary power integration updates.

### `ps-cognitive-radio-governance-stack-v1`
- Protocols: `Link 16 J-series`, `VMF`, `USMTF`, `API/JSON`.
- Use for: cognitive-radio adaptation governance and dynamic spectrum conflict adjudication.

### `ps-autonomous-maritime-roe-stack-v1`
- Protocols: `NATO APP-11/ADatP-3 aligned`, `AIS/NMEA`, `USMTF`, `API/JSON`.
- Use for: coalition autonomous maritime ROE coordination and incident escalation traceability.

### `ps-counterfeit-parts-assurance-stack-v1`
- Protocols: `STIX/TAXII`, `USMTF`, `API/JSON`.
- Use for: counterfeit spare-part evidence sharing, quarantine governance, and release/hold controls.

### `ps-electronic-order-of-life-stack-v1`
- Protocols: `STIX/TAXII`, `MISP`, `USMTF`, `API/JSON`.
- Use for: electronic baseline pattern exchange and anomaly escalation workflows.

### `ps-droneport-airworthiness-stack-v1`
- Protocols: `AIXM/FIXM/IWXXM`, `USMTF`, `API/JSON`.
- Use for: expeditionary droneport certification, UAS traffic governance, and mishap prevention coordination.

### `ps-rocket-dud-risk-stack-v1`
- Protocols: `VMF`, `USMTF`, `API/JSON`.
- Use for: dud-risk reporting, UXO hazard warning, and fires adjustment synchronization.

### `ps-imagery-denial-fallback-stack-v1`
- Protocols: `USMTF`, `OGC WMS/WFS/WMTS`, `API/JSON`.
- Use for: imagery-denial fallback collection coordination and ISR confidence-gap reporting.

### `ps-detention-rights-oversight-stack-v1`
- Protocols: `NATO APP-11/ADatP-3 aligned`, `USMTF`, `API/JSON`.
- Use for: detention rights oversight reporting, allegation triage, and coalition remediation governance.

### `ps-stratospheric-sensor-reconstitution-stack-v1`
- Protocols: `USMTF`, `OGC WMS/WFS/WMTS`, `API/JSON`.
- Use for: strategic stratospheric sensor-layer reconstitution and ISR gap-risk dissemination.

### `ps-weather-modification-governance-stack-v1`
- Protocols: `AIXM/FIXM/IWXXM`, `USMTF`, `API/JSON`.
- Use for: weather-modification governance communications and legal-risk decision support.

### `ps-rare-blood-donor-network-stack-v1`
- Protocols: `HL7/FHIR`, `USMTF`, `API/JSON`.
- Use for: rare blood donor coordination, emergency mobilization, and transfusion continuity tracking.

### `ps-civil-grid-load-shedding-stack-v1`
- Protocols: `NIMS/ICS`, `USMTF`, `API/JSON`.
- Use for: civil grid load-shedding coordination and critical-service restoration synchronization.

## Expansion Wave Additions (2026-03-08)

### `ts-maritime-legal-attribution-v1`
- Use for: contested maritime legal attribution, boarding/seizure governance, and prize-court evidence continuity.
- Primary tools: maritime COP track services, vessel identity resolution, sanctions/intelligence ledgers, legal case workflow systems.
- Cross-check tools: independent vessel ownership/provenance verifier and alternate coalition legal adjudication board.
- Typical products: legal attribution packet, seizure authority matrix, prize-court evidence chain.

### `ts-open-ran-network-reconstitution-v1`
- Use for: Open RAN and private 5G mission-network restoration after EW/cyber/kinetic disruption.
- Primary tools: RAN orchestration controllers, transport fault isolation systems, mission traffic prioritizers, security telemetry brokers.
- Cross-check tools: independent link-health mirror and alternate service-slice integrity board.
- Typical products: reconstitution plan, mission-slice priority matrix, comms continuity timeline.

### `ts-gene-edited-biothreat-response-v1`
- Use for: suspected gene-edited biothreat attribution and integrated containment governance.
- Primary tools: biosurveillance fusion platforms, genomic analysis pipelines, laboratory chain-of-custody systems, emergency operations boards.
- Cross-check tools: independent genomic confidence review and alternate epidemiological anomaly board.
- Typical products: attribution dossier, containment-control matrix, civil-military risk communication packet.

### `ts-refugee-camp-spectrum-comms-v1`
- Use for: coalition communications and spectrum governance in displaced-person/refugee concentrations.
- Primary tools: spectrum assignment services, emergency communications dispatch systems, camp service telemetry boards, liaison coordination portals.
- Cross-check tools: independent RF interference monitor and alternate humanitarian comms continuity board.
- Typical products: camp communications architecture, interference adjudication matrix, priority-services map.

### `ts-commercial-space-launch-surge-v1`
- Use for: commercial launch surge integration for national-security space reconstitution.
- Primary tools: launch manifest orchestrators, range safety coordination systems, orbital timing planners, payload prioritization dashboards.
- Cross-check tools: independent range status monitor and alternate orbital deconfliction board.
- Typical products: launch surge plan, payload priority board, reconstitution timeline.

### `ts-undersea-datacenter-cable-defense-v1`
- Use for: defense of undersea cable landings and maritime data-center nodes against sabotage and cyber-physical attack.
- Primary tools: undersea telemetry networks, maritime surveillance COP, cable route integrity monitors, restoration orchestration services.
- Cross-check tools: independent seabed anomaly detector and alternate cable continuity verification board.
- Typical products: defense plan, threat matrix, restoration branch map.

### `ts-autonomy-fratricide-simulation-v1`
- Use for: simulation-based fratricide risk assessment for autonomous and semi-autonomous systems.
- Primary tools: digital twin mission simulators, behavior replay engines, blue-force position feeds, autonomy governance dashboards.
- Cross-check tools: independent safety model checker and alternate command-override latency monitor.
- Typical products: fratricide risk simulation packet, override ladder, release-governance recommendation set.

### `ts-disconnected-identity-continuity-v1`
- Use for: disconnected identity and credential continuity under denied/degraded network conditions.
- Primary tools: offline credential wallet platforms, identity federation controllers, revocation ledgers, coalition access governance tools.
- Cross-check tools: independent trust-anchor verifier and alternate credential conflict reconciliation board.
- Typical products: credential continuity plan, rekey/revocation matrix, trust recovery timeline.

### `ts-additive-medical-device-regulatory-v1`
- Use for: battlefield additive medical device governance with quality, safety, and legal traceability controls.
- Primary tools: additive manufacturing QA systems, med-log part traceability ledgers, biomedical validation services, clinical governance workflows.
- Cross-check tools: independent biocompatibility review board and alternate defect-trend surveillance service.
- Typical products: device release board packet, quality-traceability evidence pack, regulatory exception matrix.

### `ts-voice-deepfake-countermeasure-v1`
- Use for: hostile synthetic-voice detection and command-channel trust restoration.
- Primary tools: voice authenticity forensics pipelines, secure radio authentication services, command-net incident ledgers, influence monitoring platforms.
- Cross-check tools: independent speaker-signature verifier and alternate command-authentication confidence board.
- Typical products: spoof attribution packet, command-channel trust restoration plan, authentication risk board.

### `ps-maritime-legal-attribution-stack-v1`
- Protocols: `AIS/NMEA`, `USMTF`, `NATO APP-11/ADatP-3 aligned`, `API/JSON`.
- Use for: maritime legal attribution, seizure authority handoff, and prize-court evidence synchronization.

### `ps-open-ran-network-reconstitution-stack-v1`
- Protocols: `STIX/TAXII`, `USMTF`, `API/JSON`.
- Use for: Open RAN/private-5G restoration sequencing, cyber status exchange, and service-priority governance.

### `ps-gene-edited-biothreat-response-stack-v1`
- Protocols: `HL7/FHIR`, `EDXL-DE/CAP`, `USMTF`, `API/JSON`.
- Use for: biothreat case exchange, containment coordination, and military-civil public-health synchronization.

### `ps-refugee-camp-spectrum-comms-stack-v1`
- Protocols: `NIMS/ICS`, `EDXL-DE/CAP`, `USMTF`, `API/JSON`.
- Use for: spectrum adjudication, emergency communications continuity, and camp-service coordination.

### `ps-commercial-space-launch-surge-stack-v1`
- Protocols: `USMTF`, `OGC WMS/WFS/WMTS`, `API/JSON`.
- Use for: launch-window synchronization, range safety coordination, and surge reconstitution planning.

### `ps-undersea-datacenter-cable-defense-stack-v1`
- Protocols: `AIS/NMEA`, `OGC WMS/WFS/WMTS`, `USMTF`, `API/JSON`.
- Use for: subsea infrastructure defense, anomaly alerting, and restoration command handoffs.

### `ps-autonomy-fratricide-simulation-stack-v1`
- Protocols: `VMF`, `Link 16 J-series`, `USMTF`, `API/JSON`.
- Use for: autonomy fratricide simulation exchange, command override governance, and safety release controls.

### `ps-disconnected-identity-continuity-stack-v1`
- Protocols: `USMTF`, `NATO APP-11/ADatP-3 aligned`, `API/JSON`.
- Use for: credential continuity, revocation/rekey workflows, and coalition identity assurance under disconnection.

### `ps-additive-medical-device-regulatory-stack-v1`
- Protocols: `HL7/FHIR`, `USMTF`, `API/JSON`.
- Use for: additive medical-device quality evidence exchange and field-use release governance.

### `ps-voice-deepfake-countermeasure-stack-v1`
- Protocols: `STIX/TAXII`, `VMF`, `USMTF`, `API/JSON`.
- Use for: synthetic-voice incident reporting, command-authentication escalation, and countermeasure synchronization.

### `ts-critical-infrastructure-cyber-kinetic-v1`
- Use for: synchronizing cyber defense, kinetic protection, and civilian infrastructure restoration under attack.
- Primary tools: ICS/SCADA security telemetry, civil utility outage dashboards, mission dependency graphing tools.
- Cross-check tools: independent civil emergency management mirror and alternate cyber incident board.
- Typical products: priority-of-life restoration board, cyber-kinetic risk matrix, phased restoration timeline.

### `ts-rare-earth-industrial-assurance-v1`
- Use for: strategic rare-earth, alloy, and magnet supply assurance for defense industrial readiness.
- Primary tools: mining/refining throughput monitors, MES quality systems, defense demand forecasting tools.
- Cross-check tools: independent market/supplier verification service and alternate production confidence board.
- Typical products: industrial choke-point brief, surge allocation plan, program-impact risk ledger.

### `ts-ccir-ai-briefing-v1`
- Use for: commander CCIR briefing acceleration and confidence-weighted decision updates.
- Primary tools: watchfloor event fusion platform, CCIR tagging engine, briefing automation workspace.
- Cross-check tools: independent analyst review queue and alternate source-provenance ledger.
- Typical products: CCIR delta brief, decision trigger timeline, confidence-labeled recommendation packet.

### `ts-spectrum-targeting-latency-v1`
- Use for: measuring and reducing latency from spectrum detection to targeting recommendation.
- Primary tools: EW/sensor timeline collectors, kill-chain latency analytics, fires workflow trackers.
- Cross-check tools: independent timing integrity monitor and alternate mission-thread replay service.
- Typical products: latency bottleneck map, remediation branch matrix, timing-readiness scorecard.

### `ts-expeditionary-waterborne-health-v1`
- Use for: forecasting and controlling waterborne disease risks affecting force health in austere environments.
- Primary tools: water quality sensing systems, epidemiological forecast models, field sanitation tracking boards.
- Cross-check tools: independent lab sampling ledger and alternate public health surveillance mirror.
- Typical products: outbreak risk forecast, force-health protection actions, water treatment priority board.

### `ts-maritime-evacuation-sea-bridge-v1`
- Use for: protected civilian maritime evacuation routing with port and sea-control constraints.
- Primary tools: maritime COP, port processing dashboards, passenger manifest and vessel readiness systems.
- Cross-check tools: independent harbor traffic monitor and alternate evacuation registry verifier.
- Typical products: sea-bridge corridor order, embarkation/debarkation schedule, route-risk trigger map.

### `ts-coalition-data-diode-xdomain-v1`
- Use for: coalition cross-domain exchange through data diodes and guard-enforced one-way transfer paths.
- Primary tools: cross-domain guard policy manager, data diode transfer controller, releasability workflow service.
- Cross-check tools: independent audit-log verifier and alternate transfer integrity monitor.
- Typical products: releasability-compliant exchange matrix, assurance evidence packet, transfer exception board.

### `ts-nc3-eam-assurance-v1`
- Use for: NC3 continuity posture checks, emergency action message assurance, and acknowledgment-chain integrity.
- Primary tools: NC3 continuity monitors, EAM integrity validators, comm-path resilience orchestration services.
- Cross-check tools: independent acknowledgment ledger and alternate comm-path health mirror.
- Typical products: NC3 continuity dashboard, EAM assurance exception list, path failover decision matrix.

### `ts-port-rail-chokepoint-v1`
- Use for: strategic deployment stress tests across ports, rail corridors, and transload chokepoints.
- Primary tools: port throughput dashboards, rail movement control systems, transload queue analytics.
- Cross-check tools: independent route capacity board and alternate movement feasibility mirror.
- Typical products: chokepoint stress map, throughput risk timeline, branch-and-sequel mobility matrix.

### `ts-coalition-emitter-identity-v1`
- Use for: coalition electronic order of battle fusion and emitter identity confidence management.
- Primary tools: RF signature libraries, coalition data-sharing gateways, all-source emitter correlation boards.
- Cross-check tools: independent emitter baseline validator and alternate coalition metadata verifier.
- Typical products: emitter identity ledger, EOB confidence map, retask recommendation matrix.

### `ts-swarm-logistics-defense-v1`
- Use for: sustainment corridor protection against uncrewed swarm threats in contested environments.
- Primary tools: counter-UxS C2 suites, convoy telemetry services, route defense analytics systems.
- Cross-check tools: independent threat-track mirror and alternate convoy status reconciliation board.
- Typical products: swarm route threat overlay, convoy defense posture board, logistics continuity branches.

### `ts-river-crossing-risk-v1`
- Use for: contested river crossing risk analysis and military watercraft synchronization.
- Primary tools: hydrographic intelligence feeds, combat engineer planning tools, inland watercraft movement dashboards.
- Cross-check tools: independent current-depth monitor and alternate crossing feasibility board.
- Typical products: crossing-window risk map, synchronized crossing matrix, branch trigger list.

### `ts-hypersonic-warning-passive-defense-v1`
- Use for: hypersonic warning fusion and passive defense trigger governance.
- Primary tools: missile warning fusion systems, track confidence analytics, passive defense planners.
- Cross-check tools: independent sensor-track validator and alternate warning confidence monitor.
- Typical products: warning confidence ladder, passive defense trigger matrix, protected-asset relocation plan.

### `ts-additive-quality-attestation-v1`
- Use for: deployed additive manufacturing quality attestation and traceable fielding decisions.
- Primary tools: manufacturing execution systems, digital thread registries, NDI and lot traceability services.
- Cross-check tools: independent quality evidence auditor and alternate lot genealogy verification board.
- Typical products: part attestation packet, lot risk register, release or quarantine decision board.

### `ts-multidomain-deception-rehearsal-v1`
- Use for: rehearsal and synchronization of tactical deception effects across multiple domains.
- Primary tools: red-cell simulation environments, signature management suites, deception indicator trackers.
- Cross-check tools: independent adversary-observation model and alternate deception fidelity board.
- Typical products: deception rehearsal storyboard, execution trigger ladder, branch protection matrix.

### `ts-grid-cyber-physical-deterrence-v1`
- Use for: cyber-physical deterrence planning for strategic energy grid dependencies and restoration resilience.
- Primary tools: ICS/OT telemetry defense platforms, grid dependency graph engines, restoration orchestration systems.
- Cross-check tools: independent outage propagation simulator and alternate critical-load priority board.
- Typical products: deterrence dependency map, disruption impact table, restoration deterrence branch plan.

### `ts-denied-pnt-time-transfer-v1`
- Use for: assured timing transfer and navigation integrity under PNT denial or spoofing pressure.
- Primary tools: timing integrity monitors, pseudolite planners, terrestrial and network time transfer services.
- Cross-check tools: independent time-source confidence monitor and alternate synchronization audit board.
- Typical products: timing mesh plan, denied-PNT confidence board, fallback synchronization sequence.

### `ts-counterspace-anomaly-attribution-v1`
- Use for: attribution of satellite anomalies across kinetic, cyber, EW, and environmental causes.
- Primary tools: space object telemetry analytics, anomaly forensics engines, adversary TTP correlation services.
- Cross-check tools: independent ephemeris validator and alternate telemetry integrity monitor.
- Typical products: attribution confidence table, escalation recommendation matrix, collection retask plan.

### `ts-orbital-servicing-assurance-v1`
- Use for: mission assurance of orbital refueling and servicing under adversary interference.
- Primary tools: rendezvous safety planners, servicing timeline orchestrators, fuel state and delta-v analyzers.
- Cross-check tools: independent collision-risk board and alternate servicing sequence validator.
- Typical products: servicing window board, mission assurance checklist, abort and retry branch map.

### `ts-deepfake-media-auth-v1`
- Use for: authenticating contested battlefield media and reducing decision risk from synthetic content.
- Primary tools: multimodal forensic classifiers, provenance watermark verifiers, narrative influence monitors.
- Cross-check tools: independent authenticity review queue and alternate source provenance ledger.
- Typical products: media authenticity scorecard, influence risk board, commander communications release packet.

### `ts-additive-munitions-microfactory-v1`
- Use for: high-tempo additive munitions production control with quality and traceability constraints.
- Primary tools: additive MES controllers, in-line inspection and NDI analytics, lot genealogy services.
- Cross-check tools: independent QA evidence auditor and alternate defect trend monitor.
- Typical products: microfactory production queue, lot release decision board, quality drift alerts.

### `ts-underwater-sensor-mesh-reconstitution-v1`
- Use for: restoring degraded autonomous undersea sensor meshes and custody-aware track quality.
- Primary tools: undersea autonomy mission managers, acoustic path planners, sensor health telemetry services.
- Cross-check tools: independent sensor calibration board and alternate contact confidence monitor.
- Typical products: mesh reconstitution sequence, contact confidence recovery board, retask branch matrix.

### `ts-denied-casualty-data-sync-v1`
- Use for: coalition casualty data synchronization and reconciliation under intermittent/disconnected links.
- Primary tools: patient regulation systems, disconnected replication engines, coalition releaseability workflows.
- Cross-check tools: independent casualty ledger reconciler and alternate liaison verification board.
- Typical products: casualty sync ledger, delayed-consistency reconciliation board, releaseability exception list.

### `ts-ew-spectrum-priority-leasing-v1`
- Use for: joint EW spectrum-priority adjudication and mission-time leasing decisions.
- Primary tools: EMS assignment managers, EW mission-data services, RF conflict adjudication dashboards.
- Cross-check tools: independent RF monitor mesh and alternate spectrum conflict ledger.
- Typical products: leasing priority matrix, emission timeline, conflict resolution branch packet.

### `ts-homeland-port-cyber-physical-surge-v1`
- Use for: homeland port surge defense against combined cyber and physical disruption.
- Primary tools: port ICS/OT telemetry, maritime throughput boards, cyber incident orchestration tools.
- Cross-check tools: independent emergency operations mirror and alternate vessel flow analyzer.
- Typical products: surge protection matrix, dependency restoration queue, throughput continuity branches.

### `ts-air-defense-ammo-economy-v1`
- Use for: optimizing air-defense ammunition expenditure against dense drone-swarm raids.
- Primary tools: counter-UAS battle managers, interceptor inventory analytics, engagement simulation engines.
- Cross-check tools: independent shot doctrine validator and alternate depletion-risk estimator.
- Typical products: ammunition economy board, engagement conservation plan, rearm trigger map.

### `ts-zero-trust-key-continuity-v1`
- Use for: sustaining key material continuity and trust-anchor rotation for battle networks.
- Primary tools: KMI orchestration systems, tactical keying device telemetry, zero-trust policy engines.
- Cross-check tools: independent key-status ledger and alternate revocation propagation monitor.
- Typical products: key continuity branch plan, trust-anchor rotation timeline, crypto distribution packet.

### `ts-space-weather-gnss-fusion-v1`
- Use for: fusing space-weather effects with GNSS outage analysis and navigation continuity planning.
- Primary tools: space-weather sensors, GNSS integrity analyzers, alternative navigation confidence services.
- Cross-check tools: independent ionospheric model monitor and alternate timing-integrity board.
- Typical products: outage forecast board, navigation fallback matrix, timing assurance branches.

### `ts-hostage-crisis-multitheater-v1`
- Use for: synchronizing multi-theater hostage crisis options with ISR, legal, and policy constraints.
- Primary tools: personnel recovery management systems, ISR tasking brokers, policy-legal adjudication workflows.
- Cross-check tools: independent case confidence board and alternate partner coordination tracker.
- Typical products: decision matrix, synchronized recovery branches, escalation and messaging packet.

### `ps-counterspace-anomaly-attribution-stack-v1`
- Protocols: `CCSDS`, `USMTF`, `API/JSON`.
- Use for: satellite anomaly attribution, confidence exchange, and commander escalation packets.

### `ps-orbital-servicing-assurance-stack-v1`
- Protocols: `CCSDS`, `API/JSON`, `USMTF`.
- Use for: orbital refueling and servicing timeline control with safety and assurance synchronization.

### `ps-deepfake-media-auth-stack-v1`
- Protocols: `STIX/TAXII`, `API/JSON`, `USMTF`.
- Use for: synthetic media incident exchange and authenticity-confidence reporting.

### `ps-additive-munitions-microfactory-stack-v1`
- Protocols: `API/JSON`, `XML`, `USMTF`.
- Use for: additive munitions production telemetry, lot genealogy, and QA release workflows.

### `ps-underwater-sensor-mesh-stack-v1`
- Protocols: `AIS/NMEA`, `API/JSON`, `USMTF`.
- Use for: undersea sensor mesh reconstitution and contact confidence dissemination.

### `ps-denied-casualty-data-sync-stack-v1`
- Protocols: `HL7/FHIR`, `USMTF`, `NATO APP-11/ADatP-3 aligned`.
- Use for: coalition casualty ledger replication and delayed-consistency reconciliation.

### `ps-ew-spectrum-priority-stack-v1`
- Protocols: `Link 16 J-series`, `USMTF`, `API/JSON`.
- Use for: EW spectrum leasing adjudication and mission-priority emissions control.

### `ps-homeland-port-cyber-physical-surge-stack-v1`
- Protocols: `NIMS/ICS`, `API/JSON`, `USMTF`.
- Use for: cyber-physical surge protection coordination for strategic homeland ports.

### `ps-air-defense-ammo-economy-stack-v1`
- Protocols: `Link 16 J-series`, `VMF`, `USMTF`.
- Use for: ammunition economy recommendations and drone-swarm engagement sequencing.

### `ps-zero-trust-key-continuity-stack-v1`
- Protocols: `X.509/PKI`, `API/JSON`, `USMTF`.
- Use for: key material continuity, trust-anchor rotation, and revocation assurance.

### `ps-space-weather-gnss-fusion-stack-v1`
- Protocols: `CCSDS`, `API/JSON`, `USMTF`.
- Use for: space-weather GNSS outage fusion and navigation fallback message exchange.

### `ps-hostage-crisis-multitheater-stack-v1`
- Protocols: `USMTF`, `VMF`, `STIX/TAXII`.
- Use for: multi-theater hostage decision synchronization and partner coordination packets.

### `ts-biosecurity-lab-incident-v1`
- Use for: biosurveillance anomaly triage, lab incident containment, and military public-health coordination.
- Primary tools: disease surveillance boards, lab incident reporting systems, force-health readiness dashboards.
- Cross-check tools: independent epidemiology review queue and laboratory confirmation mirror.
- Typical products: containment branch plan, incident confidence scorecard, force-protection health advisory.

### `ts-identity-wallet-revocation-v1`
- Use for: deployed digital identity wallet trust, credential revocation, and disconnected access continuity.
- Primary tools: PKI/identity lifecycle managers, credential-status APIs, access policy orchestration boards.
- Cross-check tools: revocation ledger mirror and independent access anomaly monitor.
- Typical products: revocation priority list, access continuity branch plan, trust posture update.

### `ts-quantum-crypto-transition-v1`
- Use for: mission-safe migration to quantum-resistant cryptography in mixed-fleet environments.
- Primary tools: crypto asset inventory services, key lifecycle orchestrators, interoperability validation harnesses.
- Cross-check tools: cryptographic conformance scanner and mission assurance exception board.
- Typical products: migration tranche matrix, interoperability exception ledger, risk-accepted transition timeline.

### `ts-undersea-cable-sabotage-v1`
- Use for: undersea cable sabotage attribution, legal evidence stitching, and repair prioritization.
- Primary tools: cable telemetry services, maritime anomaly analytics, legal evidence chain workflow systems.
- Cross-check tools: coalition maritime COP and forensic confidence adjudication board.
- Typical products: attribution confidence report, repair priority matrix, continuity reroute packet.

### `ts-orbital-spectrum-continuity-v1`
- Use for: orbital spectrum arbitration and SATCOM continuity under interference or congestion.
- Primary tools: SATCOM allocation planners, interference monitors, mission-priority traffic controllers.
- Cross-check tools: independent link-quality probe network and coalition bandwidth mirror.
- Typical products: spectrum priority order, continuity reroute plan, congestion mitigation timeline.

### `ts-autonomy-safety-assurance-v1`
- Use for: autonomous-system incident review, safety control updates, and fleet risk containment.
- Primary tools: autonomy telemetry review stacks, safety case management systems, corrective action boards.
- Cross-check tools: independent incident replay harness and certification evidence monitor.
- Typical products: incident causal matrix, corrective action queue, operational risk containment order.

### `ts-ai-model-governance-v1`
- Use for: contested AI model governance, rollback authority, and mission assurance for model-driven decisions.
- Primary tools: model registry and deployment controls, evaluation dashboards, policy exception workflows.
- Cross-check tools: independent red-team benchmark harness and model drift monitor.
- Typical products: model trust posture brief, rollback trigger matrix, mission AI governance packet.

### `ts-water-infrastructure-protection-v1`
- Use for: cyber-physical protection of water treatment and distribution supporting force sustainment.
- Primary tools: ICS/SCADA monitoring stacks, water quality telemetry systems, infrastructure incident response boards.
- Cross-check tools: independent laboratory sample chain and alternate utility status mirror.
- Typical products: hardening priority matrix, contamination risk alert, continuity operations packet.

### `ts-port-health-biosecurity-v1`
- Use for: military-port biosecurity control, vessel screening, and throughput-risk balancing.
- Primary tools: port operations dashboards, vessel health screening systems, quarantine coordination platforms.
- Cross-check tools: host-nation compliance mirror and independent berth-risk monitor.
- Typical products: screening priority list, quarantine decision matrix, throughput continuity plan.

### `ts-osint-verification-v1`
- Use for: expeditionary verification of open-source battlefield claims and media artifacts.
- Primary tools: OSINT aggregation suites, media authenticity forensics, geolocation and chronolocation services.
- Cross-check tools: independent credibility ledger and alternate source corroboration board.
- Typical products: verification confidence packet, commander use/no-use note, misinformation risk map.

### `ts-munitions-fragmentation-safety-v1`
- Use for: distributed munitions transport/storage safety and catastrophic-loss risk reduction.
- Primary tools: explosive compatibility ledgers, route risk planning systems, storage hazard modeling tools.
- Cross-check tools: independent safety compliance board and alternate incident trend monitor.
- Typical products: dispersion safety matrix, transport sequence plan, compatibility exception register.

### `ts-runway-crater-repair-v1`
- Use for: rapid runway crater repair synchronization with sortie recovery and force protection.
- Primary tools: airfield engineering schedulers, runway status analytics, sortie regeneration planners.
- Cross-check tools: independent pavement damage assessment and alternate engineering timeline board.
- Typical products: repair deconfliction matrix, sortie risk timeline, engineering branch plan.

### `ts-emp-cascade-consequence-v1`
- Use for: EMP cascade consequence assessment and theater-level restoration sequencing.
- Primary tools: mission dependency graph tools, infrastructure restoration boards, comm-path resilience dashboards.
- Cross-check tools: independent continuity monitor and alternate critical-node status tracker.
- Typical products: consequence cascade map, phased restoration matrix, degraded C2 continuity packet.

### `ts-commander-priority-synthesis-v1`
- Use for: commander-priority information synthesis from contested multi-domain data feeds.
- Primary tools: COP fusion boards, alert prioritization engines, commander update automation workflows.
- Cross-check tools: independent watchfloor timeline and alternate confidence adjudication board.
- Typical products: commander priority brief, confidence-ranked indicator board, decision trigger timeline.

### `ts-disconnected-time-pnt-holdover-v1`
- Use for: disconnected time synchronization and PNT holdover under GNSS denial.
- Primary tools: precision timing distribution systems, oscillator health monitors, PNT confidence fusion services.
- Cross-check tools: independent time-transfer validator and alternate inertial/celestial fusion monitor.
- Typical products: holdover posture report, synchronization branch triggers, resync execution checklist.

### `ts-additive-feedstock-authenticity-v1`
- Use for: counterfeit feedstock detection and additive manufacturing supply integrity assurance.
- Primary tools: material fingerprinting analyzers, lot provenance tracking, fabrication quality release systems.
- Cross-check tools: independent sample-chain audit and alternate part-failure anomaly monitor.
- Typical products: authenticity confidence report, quarantine decision board, fabrication continuity fallback plan.

### `ts-ew-mission-data-rapid-reprogramming-v1`
- Use for: rapid electronic-protection mission-data updates and deployment control under active jamming pressure.
- Primary tools: EW mission-data managers, platform data-load orchestration, RF performance verification dashboards.
- Cross-check tools: independent waveform validation harness and alternate emitter conflict board.
- Typical products: reprogramming priority list, release authorization packet, interoperability risk ledger.

### `ts-reservist-mobilization-readiness-v1`
- Use for: reserve component mobilization bottleneck detection and readiness recovery sequencing.
- Primary tools: personnel readiness systems, mobilization workflow boards, transportation staging trackers.
- Cross-check tools: independent training currency ledger and alternate force-flow adjudication board.
- Typical products: bottleneck map, readiness recovery branch plan, mobilization timeline matrix.

### `ts-fuel-pipeline-attribution-v1`
- Use for: bulk fuel pipeline leak attribution and sustainment continuity under sabotage risk.
- Primary tools: pipeline telemetry monitors, fuel quality forensic systems, sustainment reroute planners.
- Cross-check tools: independent leak-validation chain and alternate inventory-loss confidence board.
- Typical products: leak attribution packet, continuity reroute matrix, repair prioritization queue.

### `ts-command-post-displacement-survivability-v1`
- Use for: hardened mobile command-post displacement decisions under precision fires and EW threat.
- Primary tools: COP movement planners, comm-path assurance services, counter-targeting analytics.
- Cross-check tools: independent survivability simulator and alternate route-risk monitor.
- Typical products: displacement trigger matrix, command continuity branch plan, survivability confidence brief.

### `ps-ew-mission-data-reprogramming-stack-v1`
- Protocols: `Link 16 J-series`, `USMTF`, `API/JSON`.
- Use for: mission-data reprogramming dissemination, platform loading acknowledgments, and interoperability verification.

### `ps-reservist-mobilization-readiness-stack-v1`
- Protocols: `USMTF`, `API/JSON`, `NATO APP-11/ADatP-3 aligned`.
- Use for: reserve mobilization status synchronization and readiness bottleneck escalation reporting.

### `ps-fuel-pipeline-attribution-stack-v1`
- Protocols: `API/JSON`, `USMTF`, `STIX/TAXII`.
- Use for: contested fuel pipeline incident attribution, forensic confidence exchange, and sustainment reroute control.

### `ps-command-post-displacement-stack-v1`
- Protocols: `USMTF`, `CoT`, `Link 16 J-series`.
- Use for: mobile command-post displacement sequencing, acknowledgment chains, and continuity posture reporting.

### `ts-c2-node-displacement-v1`
- Use for: denied-environment command-node displacement and continuity trigger governance.
- Primary tools: command mobility planners, comm-path assurance monitors, COP synchronization services.
- Cross-check tools: independent survivability simulation board and alternate movement-risk monitor.
- Typical products: displacement trigger ladder, continuity branch matrix, acknowledgment integrity status.

### `ts-jadc2-schema-assurance-v1`
- Use for: coalition JADC2 schema translation, validation gates, and releasability-safe data exchange.
- Primary tools: schema registry services, translation gateways, coalition data validation harnesses.
- Cross-check tools: independent schema conformance validator and releaseability audit ledger.
- Typical products: schema delta matrix, translation confidence log, releasability validation packet.

### `ts-airlift-lz-viability-v1`
- Use for: contested-airlift landing-zone viability scoring and sortie-divert prioritization.
- Primary tools: LZ condition monitors, weather/threat overlays, airlift scheduling planners.
- Cross-check tools: independent geospatial hazard validation and alternate sortie-risk board.
- Typical products: LZ viability scorecard, divert trigger matrix, sortie recovery timeline.

### `ts-em-signature-camouflage-v1`
- Use for: expeditionary electromagnetic camouflage planning and detectability reduction assessment.
- Primary tools: RF signature libraries, emitter management services, detection-risk analytics.
- Cross-check tools: independent RF collection monitor and alternate interoperability check board.
- Typical products: camouflage effectiveness heatmap, EMCON timeline, blue-force interference risk log.

### `ts-groundstation-failover-v1`
- Use for: space-cyber groundstation failover drills and resilience certification.
- Primary tools: groundstation health telemetry, failover orchestration engines, path integrity validators.
- Cross-check tools: independent acknowledgment chain monitor and alternate route readiness board.
- Typical products: failover drill packet, route transition sequence, resilience confidence score.

### `ts-munitions-quality-escape-v1`
- Use for: munitions surge quality-escape forecasting and release-risk mitigation.
- Primary tools: production quality telemetry, lot genealogy services, release-control workflows.
- Cross-check tools: independent quality evidence board and alternate defect trend adjudication.
- Typical products: quality-escape forecast, lot release matrix, mitigation branch queue.

### `ts-autonomous-medevac-governance-v1`
- Use for: autonomous casualty-evacuation authority controls, ethics governance, and clinical risk escalation.
- Primary tools: autonomous medevac planners, policy enforcement engines, casualty-priority dashboards.
- Cross-check tools: independent medical ethics review board and alternate safety incident ledger.
- Typical products: authority matrix, ethics exception packet, autonomous medevac risk posture.

### `ts-spectrum-fratricide-prevention-v1`
- Use for: coalition spectrum fratricide prevention under contested EW conditions.
- Primary tools: coalition emitter management services, EMS conflict analytics, deconfliction workflow tools.
- Cross-check tools: independent RF monitoring mesh and alternate coalition conflict log.
- Typical products: emitter conflict board, spectrum deconfliction order, fratricide risk ladder.

### `ts-port-damage-sortie-reflow-v1`
- Use for: rapid port damage triage and sortie/sustainment reflow planning.
- Primary tools: port damage assessment services, throughput schedulers, vessel priority orchestrators.
- Cross-check tools: independent berth status monitor and alternate cargo flow confidence board.
- Typical products: damage severity matrix, throughput reflow plan, repair/sortie synchronization timeline.

### `ts-fires-data-lineage-v1`
- Use for: precision-fires data provenance assurance and retargeting governance.
- Primary tools: target-data lineage graph engines, sensor timeline correlation boards, fires authorization workflows.
- Cross-check tools: independent provenance validator and alternate collateral-estimate audit board.
- Typical products: lineage graph, retargeting decision matrix, strike confidence note.

### `ts-polar-orbit-handover-v1`
- Use for: polar-orbit communications handover governance in denied Arctic conditions.
- Primary tools: orbit handover schedulers, timing-integrity monitors, high-latitude comm planners.
- Cross-check tools: independent ephemeris validator and alternate latency confidence monitor.
- Typical products: handover timeline, denied-comms fallback matrix, timing confidence status.

### `ts-engineering-repair-prioritization-v1`
- Use for: battle-damage engineering repair prioritization across constrained resources.
- Primary tools: engineering damage trackers, mission dependency graph tools, repair sequencing planners.
- Cross-check tools: independent feasibility validator and alternate mission-impact restoration board.
- Typical products: repair priority queue, restoration map, resource-constrained branch plan.

### `ps-c2-node-displacement-stack-v1`
- Protocols: `USMTF`, `CoT`, `Link 16 J-series`.
- Use for: command-node displacement sequencing, acknowledgment chains, and command continuity reporting.

### `ps-jadc2-schema-assurance-stack-v1`
- Protocols: `API/JSON`, `USMTF`, `NATO APP-11/ADatP-3`.
- Use for: coalition schema translation packets, validation exceptions, and releaseability-safe exchange.

### `ps-airlift-lz-viability-stack-v1`
- Protocols: `USMTF`, `VMF`, `OGC`.
- Use for: landing-zone viability updates, sortie-divert triggers, and airlift deconfliction actions.

### `ps-em-camouflage-control-stack-v1`
- Protocols: `Link 16 J-series`, `USMTF`, `API/JSON`.
- Use for: EM camouflage plans, signature control updates, and deconfliction acknowledgments.

### `ps-space-ground-failover-stack-v1`
- Protocols: `CCSDS`, `USMTF`, `API/JSON`.
- Use for: groundstation failover route exchanges, timing-integrity checks, and resilience reporting.

### `ps-munitions-quality-escape-stack-v1`
- Protocols: `API/JSON`, `XML`, `USMTF`.
- Use for: lot quality exception exchange, release controls, and surge risk reporting.

### `ps-autonomous-medevac-governance-stack-v1`
- Protocols: `HL7/FHIR`, `USMTF`, `API/JSON`.
- Use for: autonomous medevac authority packets, ethics review records, and clinical-risk escalation.

### `ps-spectrum-fratricide-prevention-stack-v1`
- Protocols: `Link 16 J-series`, `VMF`, `USMTF`.
- Use for: coalition emitter conflict resolution, spectrum risk reporting, and fratricide prevention orders.

### `ps-port-damage-reflow-stack-v1`
- Protocols: `AIS/NMEA`, `USMTF`, `NIMS/ICS`.
- Use for: port damage updates, throughput reflow coordination, and recovery branch synchronization.

### `ps-fires-lineage-retargeting-stack-v1`
- Protocols: `VMF`, `Link 16 J-series`, `USMTF`.
- Use for: precision-fires lineage exchange, retarget approval packets, and re-attack confidence reports.

### `ps-polar-orbit-handover-stack-v1`
- Protocols: `CCSDS`, `USMTF`, `API/JSON`.
- Use for: polar orbit handover timing packets, denied-comms fallback coordination, and latency reporting.

### `ps-engineering-repair-prioritization-stack-v1`
- Protocols: `USMTF`, `OGC`, `API/JSON`.
- Use for: engineering damage triage packets, repair sequence updates, and restoration decision synchronization.

### `ts-maritime-chokepoint-closure-v1`
- Use for: maritime chokepoint closure and controlled reopening under adversary pressure.
- Primary tools: maritime traffic COP, chokepoint risk planners, coalition shipping deconfliction services.
- Cross-check tools: independent AIS anomaly monitor and alternate convoy-routing board.
- Typical products: closure trigger ladder, reopening branch matrix, coalition traffic risk report.

### `ts-gridload-blackstart-fuel-v1`
- Use for: theater civil gridload restoration and blackstart fuel-priority sequencing.
- Primary tools: power-grid dependency graph engines, blackstart scheduling dashboards, fuel allocation boards.
- Cross-check tools: independent utility telemetry mirror and alternate critical-load adjudication board.
- Typical products: critical-load restoration map, fuel-priority matrix, blackstart branch timeline.

### `ts-denied-weather-sortie-risk-v1`
- Use for: denied-weather reconnaissance fusion and sortie risk governance.
- Primary tools: weather-recon fusion boards, sensor confidence models, sortie risk planners.
- Cross-check tools: independent meteorology cell and alternate threat-weather correlation board.
- Typical products: sortie weather-risk scorecard, denied-sensor confidence ladder, divert/scrub triggers.

### `ts-nav-spoofing-attribution-v1`
- Use for: precision-navigation spoofing attribution and trust posture decisions.
- Primary tools: PNT anomaly analytics, spoofing signature classifiers, route risk planners.
- Cross-check tools: independent inertial/celestial confidence monitor and alternate timing assurance ledger.
- Typical products: spoofing confidence matrix, navigation trust ladder, mitigation branch plan.

### `ts-radhard-microelectronics-assurance-v1`
- Use for: radiation-hardened microelectronics supply assurance for strategic mission systems.
- Primary tools: part provenance graph services, rad-hard qualification repositories, mission dependency scorers.
- Cross-check tools: independent counterfeit-risk monitor and alternate component qualification ledger.
- Typical products: component risk board, substitute-part approval matrix, mission-impact sequence.

### `ts-bridge-load-class-verification-v1`
- Use for: expeditionary bridge load-class verification and heavy-maneuver route assurance.
- Primary tools: engineering survey tools, bridge load analyzers, route throughput schedulers.
- Cross-check tools: independent structural validation board and alternate route feasibility monitor.
- Typical products: load-class confidence map, route go/no-go matrix, engineer verification queue.

### `ts-cbrn-urban-plume-evac-v1`
- Use for: CBRN urban plume evacuation branch planning and force-protection controls.
- Primary tools: plume dispersion models, population movement planners, contamination-control dashboards.
- Cross-check tools: independent hazard sampling board and alternate evacuation corridor validator.
- Typical products: plume hazard corridor map, phased evacuation matrix, protection control package.

### `ts-satcom-terminal-key-rotation-v1`
- Use for: coalition SATCOM terminal key rotation and continuity under compromise risk.
- Primary tools: key lifecycle managers, SATCOM terminal status services, coalition releasability controls.
- Cross-check tools: independent key-audit ledger and alternate traffic integrity monitor.
- Typical products: key-rotation priority ledger, terminal continuity branch matrix, releasability gate report.

### `ts-intermodal-rail-airfield-sustainment-v1`
- Use for: rail-airfield intermodal sustainment scheduling under disruption and surge.
- Primary tools: rail flow schedulers, airfield throughput boards, ground distribution planners.
- Cross-check tools: independent bottleneck monitor and alternate force-flow adjudication board.
- Typical products: intermodal throughput schedule, chokepoint reroute matrix, sustainment risk timeline.

### `ts-watercraft-autonomy-collision-avoidance-v1`
- Use for: forward watercraft autonomy collision-avoidance and waterway deconfliction.
- Primary tools: autonomous navigation monitors, maritime traffic fusion services, collision-risk predictors.
- Cross-check tools: independent riverine COP board and alternate manual traffic control ledger.
- Typical products: transit conflict board, collision trigger ladder, comms fallback plan.

### `ts-power-signature-management-v1`
- Use for: battlefield power-generation posture and thermal/acoustic/electromagnetic signature management.
- Primary tools: power-node telemetry, signature analytics, generator dispatch planners.
- Cross-check tools: independent emissions monitor and alternate sustainment exposure board.
- Typical products: power-node signature map, concealment matrix, sustainment exposure report.

### `ts-coalition-training-readiness-fusion-v1`
- Use for: coalition partner-force digital training readiness fusion and interoperability closure.
- Primary tools: training evidence repositories, readiness dashboards, interoperability gap trackers.
- Cross-check tools: independent certification evidence monitor and alternate coalition readiness ledger.
- Typical products: partner readiness board, gap closure queue, certification confidence summary.

### `ps-maritime-chokepoint-closure-stack-v1`
- Protocols: `AIS/NMEA`, `USMTF`, `NATO APP-11/ADatP-3`.
- Use for: chokepoint closure/reopening orders, coalition ship-routing updates, and acknowledgment tracking.

### `ps-gridload-blackstart-fuel-stack-v1`
- Protocols: `NIMS/ICS`, `USMTF`, `API/JSON`.
- Use for: critical-load restoration sequencing, fuel-priority exchange, and civil-military blackstart coordination.

### `ps-denied-weather-sortie-risk-stack-v1`
- Protocols: `USMTF`, `VMF`, `OGC`.
- Use for: weather-risk updates, sortie scrub/divert triggers, and denied-sensor confidence packets.

### `ps-nav-spoofing-attribution-stack-v1`
- Protocols: `API/JSON`, `USMTF`, `CCSDS`.
- Use for: navigation anomaly attribution, timing-confidence exchange, and spoofing mitigation triggers.

### `ps-radhard-microelectronics-assurance-stack-v1`
- Protocols: `API/JSON`, `XML`, `USMTF`.
- Use for: component provenance exchange, qualification exceptions, and mission-impact risk reporting.

### `ps-bridge-load-class-verification-stack-v1`
- Protocols: `USMTF`, `OGC`, `API/JSON`.
- Use for: engineering survey packets, load-class verification decisions, and route authority updates.

### `ps-cbrn-urban-plume-evac-stack-v1`
- Protocols: `NIMS/ICS`, `USMTF`, `CAP`.
- Use for: plume hazard corridor updates, evacuation branch decisions, and force-protection advisories.

### `ps-satcom-terminal-key-rotation-stack-v1`
- Protocols: `CCSDS`, `USMTF`, `API/JSON`.
- Use for: key-rotation schedules, terminal continuity status, and coalition releasability acknowledgment.

### `ps-intermodal-rail-airfield-stack-v1`
- Protocols: `USMTF`, `API/JSON`, `NATO APP-11/ADatP-3`.
- Use for: intermodal throughput scheduling, rail-airfield handoff updates, and bottleneck escalation packets.

### `ps-watercraft-autonomy-collision-stack-v1`
- Protocols: `AIS/NMEA`, `USMTF`, `CoT`.
- Use for: autonomous watercraft conflict alerts, deconfliction orders, and route handoff acknowledgments.

### `ps-power-signature-management-stack-v1`
- Protocols: `USMTF`, `API/JSON`, `Link 16 J-series`.
- Use for: generator signature posture updates, concealment actions, and sustainment risk reporting.

### `ps-coalition-training-readiness-fusion-stack-v1`
- Protocols: `NATO APP-11/ADatP-3`, `USMTF`, `API/JSON`.
- Use for: coalition readiness evidence exchange, interoperability gap closure packets, and certification confidence updates.

### `ts-cislunar-logistics-relay-v1`
- Use for: contested cislunar relay continuity, lunar-node sustainment routing, and timing-integrity branching.
- Primary tools: SDA catalog services, relay path planners, cislunar logistics schedulers.
- Cross-check tools: independent orbit-state mirror and timing-integrity watchdog.
- Typical products: relay continuity matrix, sustainment branch table, timing exception ledger.

### `ts-iamd-shot-doctrine-v1`
- Use for: integrated air and missile defense shot doctrine tuning and defended-asset prioritization.
- Primary tools: IAMD fire-control planners, raid-density analyzers, interceptor inventory dashboards.
- Cross-check tools: independent engagement replay board and magazine-depth validator.
- Typical products: shot doctrine matrix, raid response branch map, interceptor expenditure forecast.

### `ts-undersea-repair-convoy-v1`
- Use for: undersea infrastructure repair convoy scheduling, escort planning, and restoration deconfliction.
- Primary tools: undersea telemetry dashboards, maritime convoy planners, seabed repair schedulers.
- Cross-check tools: independent vessel identity validator and subsea anomaly monitor.
- Typical products: convoy protection plan, repair sequence board, restoration risk ladder.

### `ts-special-operations-biometric-exfil-v1`
- Use for: denied biometric extraction/exfiltration planning with custody and identity assurance.
- Primary tools: SOF mission planning suites, biometric exploitation systems, custody-chain ledgers.
- Cross-check tools: independent identity confidence board and alternate custody audit log.
- Typical products: exfiltration branch packet, custody confidence table, exploitation task matrix.

### `ts-industrial-cyber-sabotage-containment-v1`
- Use for: defense-industrial OT sabotage containment, production recovery, and surge continuity.
- Primary tools: OT incident response platforms, manufacturing telemetry boards, industrial dependency maps.
- Cross-check tools: independent incident timeline ledger and alternate production integrity monitor.
- Typical products: containment sequence order, production recovery ladder, OT isolation matrix.

### `ts-jadc2-fabric-triage-v1`
- Use for: JADC2 data-fabric degradation triage, translation integrity checks, and latency mitigation.
- Primary tools: schema translation validators, fusion-bus health monitors, latency analytics dashboards.
- Cross-check tools: independent message-conformance checker and alternate COP consistency board.
- Typical products: degradation triage matrix, schema exception log, latency compensation plan.

### `ts-arctic-farp-dispersal-v1`
- Use for: arctic forward refuel/rearm dispersal planning under weather and threat stress.
- Primary tools: polar route/weather intelligence, fuel/munitions trackers, FARP survivability planners.
- Cross-check tools: independent weather-model mirror and alternate sustainment sufficiency calculator.
- Typical products: dispersal matrix, sustainment timeline, FARP survivability branch plan.

### `ts-ew-order-of-battle-refresh-v1`
- Use for: rapid EW order-of-battle refresh with contested sensor confidence management.
- Primary tools: emitter identity services, EW mission-data managers, spectrum anomaly analytics.
- Cross-check tools: independent RF monitoring mesh and alternate emitter signature ledger.
- Typical products: EOB refresh queue, confidence ladder, retask trigger board.

### `ts-precision-fires-latency-comp-v1`
- Use for: precision-fires C2 latency compensation and sensor-to-shooter timing control.
- Primary tools: fires C2 sequence analytics, timing integrity monitors, target validity trackers.
- Cross-check tools: independent message-delay ledger and alternate targeting timeline replay.
- Typical products: latency compensation table, timing risk map, delayed-effects branch matrix.

### `ts-burn-care-austere-network-v1`
- Use for: mass-casualty burn-care routing and austere treatment network synchronization.
- Primary tools: patient regulation systems, burn-bed availability boards, med-log depletion monitors.
- Cross-check tools: independent transfer-status mirror and alternate care-capacity validator.
- Typical products: burn-care triage network map, transfer ladder, consumables continuity plan.

### `ts-coalition-grid-blackstart-v1`
- Use for: coalition host-nation grid protection, blackstart sequencing, and critical-load prioritization.
- Primary tools: grid resilience dashboards, ICS restoration planners, coalition utility coordination boards.
- Cross-check tools: independent load-restoration verifier and alternate cyber-physical fault board.
- Typical products: blackstart branch matrix, critical-load board, restoration synchronization timeline.

### `ts-autonomous-convoy-counter-ambush-v1`
- Use for: autonomous convoy counter-ambush planning with route-risk adaptation and authority gates.
- Primary tools: convoy autonomy managers, route threat analytics, engagement-governance dashboards.
- Cross-check tools: independent route-denial monitor and alternate autonomy confidence board.
- Typical products: convoy counter-ambush posture board, route contingency map, authority escalation matrix.

### `ts-telecom-priority-routing-v1`
- Use for: military-priority routing over contested civilian telecom infrastructure.
- Primary tools: telecom routing controllers, carrier outage monitors, priority-service arbitration boards.
- Cross-check tools: independent carrier status mirrors and alternate comms continuity ledgers.
- Typical products: priority-routing matrix, outage mitigation branches, telecom authority escalation log.

### `ts-decoy-heat-signature-v1`
- Use for: distributed thermal-decoy orchestration to reduce adversary targeting confidence.
- Primary tools: thermal signature planners, decoy placement optimizers, sustainment burn-rate trackers.
- Cross-check tools: independent infrared-observation board and alternate decoy effectiveness ledger.
- Typical products: thermal decoy layout board, adversary confusion estimate, sustainment branch timeline.

### `ts-under-ice-resupply-v1`
- Use for: coalition under-ice autonomous resupply corridor planning and control.
- Primary tools: under-ice route planners, autonomy health monitors, Arctic threat/corridor dashboards.
- Cross-check tools: independent ice-condition service and alternate convoy timing validation board.
- Typical products: under-ice viability map, convoy timing matrix, rescue/recovery trigger ladder.

### `ts-shipyard-nuclear-workforce-v1`
- Use for: shipyard nuclear-maintenance workforce surge planning and certification throughput control.
- Primary tools: workforce scheduling engines, certification pipeline dashboards, critical-skill inventory boards.
- Cross-check tools: independent qualification ledgers and alternate throughput stress simulators.
- Typical products: workforce surge matrix, certification forecast, skill-gap closure queue.

### `ts-air-defense-emitter-relocation-v1`
- Use for: rapid air-defense emitter relocation while maintaining coverage continuity.
- Primary tools: emitter mobility planners, coverage overlap analyzers, emission-control governance boards.
- Cross-check tools: independent coverage validation monitor and alternate handoff timeline board.
- Typical products: relocation sequence matrix, coverage gap/handoff board, emissions discipline risk log.

### `ts-financial-rail-payroll-v1`
- Use for: contested theater payroll and disbursement continuity under disrupted payment rails.
- Primary tools: financial rail health dashboards, payroll continuity engines, disbursement priority planners.
- Cross-check tools: independent ledger reconciliation service and alternate cash-distribution tracker.
- Typical products: disbursement continuity board, payroll risk matrix, alternate rail decision log.

### `ts-spectrum-licensing-clearance-v1`
- Use for: coalition expeditionary spectrum licensing and host-nation clearance management.
- Primary tools: spectrum assignment planners, legal clearance trackers, coalition deconfliction dashboards.
- Cross-check tools: independent frequency-conflict validator and alternate approval status monitor.
- Typical products: licensing status board, host-nation clearance queue, coalition conflict matrix.

### `ts-wastewater-biosurveillance-v1`
- Use for: wastewater biosurveillance early-warning fusion for force-health protection.
- Primary tools: biosurveillance trend analytics, sampling logistics planners, force-health trigger dashboards.
- Cross-check tools: independent lab validation board and alternate anomaly confidence ladder.
- Typical products: sentinel map, pathogen trend confidence matrix, intervention trigger timeline.

### `ts-autonomy-map-poisoning-detect-v1`
- Use for: denied-terrain autonomy map-poisoning detection and source quarantine.
- Primary tools: map provenance analyzers, autonomy route-confidence services, tamper-detection pipelines.
- Cross-check tools: independent terrain-source validator and alternate route sanity-check board.
- Typical products: map trust anomaly board, route-confidence ladder, source quarantine/remediation plan.

### `ts-space-launch-propellant-allocation-v1`
- Use for: strategic launch fuel/oxidizer allocation across contested logistics conditions.
- Primary tools: propellant inventory planners, launch campaign schedulers, industrial throughput boards.
- Cross-check tools: independent tank-farm status monitor and alternate allocation risk ledger.
- Typical products: propellant allocation board, launch slip-risk matrix, substitute sourcing branch timeline.

### `ts-forward-rare-blood-matching-v1`
- Use for: distributed rare-blood typing and donor matching in austere casualty networks.
- Primary tools: blood inventory services, donor compatibility engines, transfer prioritization dashboards.
- Cross-check tools: independent lab confirmation ledger and alternate transfusion-risk board.
- Typical products: rare-blood availability map, donor matching matrix, urgent transfer queue.

### `ts-maritime-insurance-reconstitution-v1`
- Use for: maritime insurance disruption analysis and sealift continuity reconstitution planning.
- Primary tools: insurance exposure dashboards, charter-market trackers, strategic sealift planners.
- Cross-check tools: independent market stress monitors and alternate convoy finance ledgers.
- Typical products: insurance exposure matrix, reconstitution options board, sealift continuity risk ladder.

### `ps-telecom-priority-routing-stack-v1`
- Protocols: `USMTF`, `API/JSON`, `CAP`.
- Use for: telecom priority-route orders, outage escalation packets, and civil-military comms acknowledgments.

### `ps-decoy-heat-signature-stack-v1`
- Protocols: `USMTF`, `Link 16 J-series`, `API/JSON`.
- Use for: thermal decoy posture updates, signature-control coordination, and deception branch reporting.

### `ps-under-ice-resupply-stack-v1`
- Protocols: `USMTF`, `CoT`, `API/JSON`.
- Use for: under-ice convoy route exchanges, autonomy health status, and rescue/recovery triggers.

### `ps-shipyard-nuclear-workforce-stack-v1`
- Protocols: `API/JSON`, `USMTF`, `XML`.
- Use for: workforce surge requests, certification throughput packets, and critical-skill shortage alerts.

### `ps-air-defense-emitter-relocation-stack-v1`
- Protocols: `Link 16 J-series`, `USMTF`, `VMF`.
- Use for: emitter relocation control orders, coverage handoff messages, and emissions discipline acknowledgments.

### `ps-financial-rail-payroll-stack-v1`
- Protocols: `API/JSON`, `ISO 20022`, `USMTF`.
- Use for: payroll continuity transactions, disbursement exception reports, and alternate rail approvals.

### `ps-spectrum-licensing-clearance-stack-v1`
- Protocols: `NATO APP-11/ADatP-3`, `USMTF`, `API/JSON`.
- Use for: expeditionary licensing requests, host-nation clearance packets, and frequency deconfliction records.

### `ps-wastewater-biosurveillance-stack-v1`
- Protocols: `HL7/FHIR`, `USMTF`, `API/JSON`.
- Use for: biosurveillance sample events, trend alerts, and force-health intervention coordination.

### `ps-autonomy-map-poisoning-stack-v1`
- Protocols: `API/JSON`, `OGC`, `USMTF`.
- Use for: map provenance anomalies, source quarantine actions, and autonomy route trust updates.

### `ps-space-launch-propellant-stack-v1`
- Protocols: `API/JSON`, `USMTF`, `CCSDS`.
- Use for: launch propellant allocation decisions, supply exception packets, and campaign re-sequencing notices.

### `ps-forward-rare-blood-stack-v1`
- Protocols: `HL7/FHIR`, `USMTF`, `API/JSON`.
- Use for: blood typing confirmations, donor compatibility packets, and casualty transfer priorities.

### `ps-maritime-insurance-reconstitution-stack-v1`
- Protocols: `AIS/NMEA`, `USMTF`, `API/JSON`.
- Use for: insurance risk status exchange, charter continuity actions, and coalition sealift reconstitution reporting.

### `ts-ai-camouflage-discipline-audit-v1`
- Use for: AI-enabled camouflage discipline audits, signature drift detection, and corrective control sequencing.
- Primary tools: multispectral signature analytics, decoy posture planners, deception effectiveness dashboards.
- Cross-check tools: independent ISR review board and alternate thermal/visual signature verifier.
- Typical products: camouflage compliance ledger, drift remediation queue, deception confidence map.

### `ts-additive-propellant-safety-v1`
- Use for: additive propellant production safety governance, hazard threshold monitoring, and release authority checks.
- Primary tools: additive energetics QA pipeline, lot genealogy services, hazard modeling workbench.
- Cross-check tools: independent blast-safety calculator and alternate lot-integrity audit board.
- Typical products: lot safety matrix, hazard branch triggers, release authority packet.

### `ts-expeditionary-radiation-dosimetry-v1`
- Use for: expeditionary dosimetry management, coalition exposure tracking, and mission continuation thresholds.
- Primary tools: portable dosimeter telemetry collectors, exposure analytics dashboards, shelter threshold planners.
- Cross-check tools: independent sample-chain verifier and alternate medical exposure reconciliation board.
- Typical products: exposure posture map, dosimeter allocation matrix, continuation decision table.

### `ts-vertical-datum-reconciliation-v1`
- Use for: vertical datum mismatch reconciliation across denied-environment terrain sources and fires systems.
- Primary tools: geodesy normalization services, terrain model differencing engines, precision-effects error analyzers.
- Cross-check tools: independent survey-control board and alternate elevation confidence monitor.
- Typical products: datum discrepancy ledger, correction priority queue, precision risk advisory.

### `ts-orbital-debris-hostile-screening-v1`
- Use for: orbital debris coincidence screening to distinguish natural conjunctions from hostile shaping patterns.
- Primary tools: conjunction assessment systems, maneuver-history analytics, threat-pattern classifiers.
- Cross-check tools: independent orbital event mirror and alternate hostile-indicator review board.
- Typical products: coincidence confidence ladder, maneuver recommendation queue, hostile-pattern alert set.

### `ts-maritime-desal-water-continuity-v1`
- Use for: maritime desalination continuity and water distribution resilience under contamination or platform disruption.
- Primary tools: desal throughput monitors, onboard water quality analyzers, distribution demand schedulers.
- Cross-check tools: independent lab verification service and alternate afloat storage integrity dashboard.
- Typical products: water continuity map, contamination branch plan, distribution priority matrix.

### `ts-convoy-fuel-fraud-detection-v1`
- Use for: convoy fuel-fraud detection, diversion attribution, and endurance-risk mitigation.
- Primary tools: fuel transaction anomaly engines, tanker telemetry boards, convoy endurance models.
- Cross-check tools: independent reconciliation ledger and alternate refuel event audit service.
- Typical products: anomaly confidence board, fraud branch matrix, endurance risk forecast.

### `ts-coalition-medical-credentialing-v1`
- Use for: coalition cross-border medical credentialing, privileging verification, and legal authority synchronization.
- Primary tools: credential verification services, privileging workflow engines, coalition legal-adjudication trackers.
- Cross-check tools: independent license-status mirror and alternate treatment-authority validation board.
- Typical products: credentialing status board, privileging exception queue, authority release log.

### `ts-electronics-reverse-logistics-v1`
- Use for: expeditionary electronic component reverse logistics and repair-vs-replace prioritization.
- Primary tools: component traceability ledgers, reverse-logistics routing planners, depot repair backlog dashboards.
- Cross-check tools: independent provenance checker and alternate disposition audit board.
- Typical products: recovery priority queue, reverse-flow route matrix, disposition decision board.

### `ts-cloudburst-flood-route-survivability-v1`
- Use for: cloudburst flood-route survivability assessment for movement, sustainment, and evacuation lanes.
- Primary tools: flood nowcast fusion services, route capacity analyzers, mobility interruption simulators.
- Cross-check tools: independent hydrology monitor and alternate route viability verifier.
- Typical products: survivability overlay, reroute trigger chart, movement branch matrix.

### `ts-rail-signaling-cyber-failover-v1`
- Use for: railway signaling cyber-physical failover planning and throughput continuity under attack or outage.
- Primary tools: signaling health telemetry, OT incident orchestration boards, rail throughput schedulers.
- Cross-check tools: independent interlocking status monitor and alternate route-control ledger.
- Typical products: failover sequence board, throughput continuity forecast, reconnect authority checklist.

### `ts-energetics-precursor-counterfeit-v1`
- Use for: counterfeit energetics precursor detection, source attribution, and lot quarantine governance.
- Primary tools: chemical provenance analytics, supplier risk intelligence dashboards, lot-test reconciliation services.
- Cross-check tools: independent lab assay board and alternate supplier integrity monitor.
- Typical products: counterfeit risk ledger, quarantine recommendation matrix, source disruption options.

### `ps-ai-camouflage-discipline-stack-v1`
- Protocols: `USMTF`, `Link 16 J-series`, `API/JSON`.
- Use for: signature drift alerts, camouflage compliance packets, and deception remediation orders.

### `ps-additive-propellant-safety-stack-v1`
- Protocols: `API/JSON`, `USMTF`, `XML`.
- Use for: additive lot safety validation, hazard release gating, and energetics exception reporting.

### `ps-expeditionary-radiation-dosimetry-stack-v1`
- Protocols: `HL7/FHIR`, `USMTF`, `NIMS/ICS`.
- Use for: dosimetry exposure exchange, coalition medical risk updates, and shelter trigger coordination.

### `ps-vertical-datum-reconciliation-stack-v1`
- Protocols: `OGC`, `USMTF`, `API/JSON`.
- Use for: elevation correction packets, datum reconciliation decisions, and precision-fires integrity notices.

### `ps-orbital-debris-hostile-screening-stack-v1`
- Protocols: `CCSDS`, `USMTF`, `API/JSON`.
- Use for: conjunction screening reports, maneuver advisories, and hostile-coincidence confidence updates.

### `ps-maritime-desal-water-stack-v1`
- Protocols: `AIS/NMEA`, `USMTF`, `API/JSON`.
- Use for: desalination status exchange, contamination alerts, and distribution continuity actions.

### `ps-convoy-fuel-fraud-stack-v1`
- Protocols: `API/JSON`, `USMTF`, `ISO 20022`.
- Use for: fuel anomaly records, fraud investigation actions, and disbursement/control reconciliation.

### `ps-coalition-medical-credentialing-stack-v1`
- Protocols: `HL7/FHIR`, `NATO APP-11/ADatP-3`, `USMTF`.
- Use for: coalition credential verification, privileging approvals, and treatment-authority exchange.

### `ps-electronics-reverse-logistics-stack-v1`
- Protocols: `API/JSON`, `USMTF`, `NATO APP-11/ADatP-3`.
- Use for: component recovery manifests, reverse-logistics routing orders, and depot disposition updates.

### `ps-cloudburst-flood-route-stack-v1`
- Protocols: `OGC`, `USMTF`, `CAP`.
- Use for: flood-route status updates, movement reroute triggers, and emergency mobility advisories.

### `ps-rail-signaling-cyber-failover-stack-v1`
- Protocols: `USMTF`, `API/JSON`, `STIX/TAXII`.
- Use for: signaling outage incident exchange, failover sequence orders, and OT threat indicators.

### `ps-energetics-precursor-counterfeit-stack-v1`
- Protocols: `API/JSON`, `STIX/TAXII`, `USMTF`.
- Use for: counterfeit precursor intelligence packets, lot quarantine orders, and supplier risk alerts.

### `ts-anti-jam-gps-epoch-recovery-v1`
- Use for: denied PNT epoch coherence recovery under anti-jam and spoofing pressure.
- Primary tools: epoch-offset estimators, holdover clock health dashboards, multi-source timing reconcilers.
- Cross-check tools: independent timing reference monitor and manual epoch-drift worksheet.
- Typical products: epoch recovery board, timing confidence ladder, PNT branch trigger matrix.

### `ts-portable-microreactor-employment-v1`
- Use for: portable microreactor emplacement and critical-load power assignment in contested theaters.
- Primary tools: microreactor placement planners, load-priority allocators, radiological safety dashboards.
- Cross-check tools: independent reactor-status mirror and alternate load-shedding planner.
- Typical products: emplacement decision matrix, load-allocation schedule, safety control branch table.

### `ts-disaster-relief-airbridge-integrity-v1`
- Use for: coalition disaster relief air bridge slot integrity, cargo assurance, and delivery continuity.
- Primary tools: airlift slot coordinators, cargo custody trackers, distribution throughput dashboards.
- Cross-check tools: independent manifest reconciliation board and alternate sortie reliability monitor.
- Typical products: air bridge integrity board, slot deconfliction matrix, aid leakage risk ledger.

### `ts-undersea-acoustic-deception-v1`
- Use for: undersea chokepoint acoustic deception planning and adversary cueing disruption.
- Primary tools: undersea acoustic modelers, emitter posture planners, cueing disruption analytics.
- Cross-check tools: independent hydroacoustic monitor and alternate choke-lane deception board.
- Typical products: acoustic deception lane plan, cueing disruption matrix, maritime risk ladder.

### `ts-cyber-reserve-mobilization-assurance-v1`
- Use for: cyber reserve mobilization assurance, credential validation, and mission assignment readiness.
- Primary tools: reserve activation dashboards, credential trust services, assignment readiness trackers.
- Cross-check tools: independent identity-status verifier and alternate mobilization ledger.
- Typical products: mobilization readiness map, credential risk board, assignment execution timeline.

### `ts-multi-domain-decoy-inventory-v1`
- Use for: multi-domain decoy inventory allocation to maximize adversary targeting uncertainty.
- Primary tools: decoy inventory allocators, domain-level effects analyzers, replenishment schedulers.
- Cross-check tools: independent stock accountability board and alternate effects estimator.
- Typical products: decoy allocation matrix, depletion forecast, replenishment branch chart.

### `ts-contested-cas-evac-c2-fallback-v1`
- Use for: contested casualty evacuation C2 failover and medical movement continuity.
- Primary tools: medevac C2 orchestration boards, triage transport planners, handoff integrity monitors.
- Cross-check tools: independent patient movement ledger and alternate CASEVAC routing board.
- Typical products: C2 fallback sequence, triage transport matrix, handoff confidence ladder.

### `ts-runway-ice-fod-clearance-v1`
- Use for: runway ice/FOD clearance prioritization for coalition sortie continuity in severe weather.
- Primary tools: runway condition sensors, clearance asset schedulers, sortie interruption predictors.
- Cross-check tools: independent airfield surface verifier and alternate clearance sequencing board.
- Typical products: runway recovery schedule, sortie interruption matrix, equipment tasking queue.

### `ts-long-range-fires-lot-reliability-v1`
- Use for: long-range fires ammunition lot reliability and defect-impact risk assessment.
- Primary tools: lot genealogy analyzers, reliability trend models, defect quarantine dashboards.
- Cross-check tools: independent ballistic test review board and alternate lot confidence ledger.
- Typical products: lot reliability heatmap, quarantine decision table, fires constraint matrix.

### `ts-denied-fuel-bladder-integrity-v1`
- Use for: denied theater fuel bladder leak/sabotage detection and contamination-risk management.
- Primary tools: fuel bladder pressure telemetry, contamination assay trackers, sustainment risk planners.
- Cross-check tools: independent fuel-quality verification board and alternate leak attribution worksheet.
- Typical products: integrity monitor board, contamination branch matrix, resupply protection queue.

### `ts-mobile-satcom-emission-discipline-v1`
- Use for: mobile SATCOM emission discipline and movement-linked EMCON governance.
- Primary tools: SATCOM emission schedulers, platform movement planners, detection-risk analytics.
- Cross-check tools: independent RF exposure monitor and alternate EMCON compliance board.
- Typical products: emission timing board, movement/emit sync matrix, detection-risk reduction plan.

### `ts-critical-mineral-shipping-protection-v1`
- Use for: strategic critical-mineral shipping protection and route continuity under interdiction pressure.
- Primary tools: shipping risk intelligence dashboards, convoy routing planners, port continuity boards.
- Cross-check tools: independent maritime exposure monitor and alternate cargo protection ledger.
- Typical products: shipment risk map, route protection matrix, interdiction response queue.

### `ps-anti-jam-gps-epoch-stack-v1`
- Protocols: `USMTF`, `API/JSON`, `OGC`.
- Use for: epoch-recovery updates, timing integrity alerts, and degraded PNT branch coordination.

### `ps-portable-microreactor-employment-stack-v1`
- Protocols: `USMTF`, `API/JSON`, `NIMS/ICS`.
- Use for: microreactor emplacement orders, power-priority updates, and radiological safety actions.

### `ps-disaster-relief-airbridge-stack-v1`
- Protocols: `USMTF`, `NATO APP-11/ADatP-3`, `API/JSON`.
- Use for: coalition air bridge slot updates, cargo custody exchange, and aid continuity directives.

### `ps-undersea-acoustic-deception-stack-v1`
- Protocols: `USMTF`, `AIS/NMEA`, `API/JSON`.
- Use for: undersea deception posture updates, chokepoint cueing controls, and maritime branch signaling.

### `ps-cyber-reserve-mobilization-stack-v1`
- Protocols: `STIX/TAXII`, `USMTF`, `API/JSON`.
- Use for: reserve mobilization events, credential assurance status, and mission assignment dispatch.

### `ps-multi-domain-decoy-inventory-stack-v1`
- Protocols: `USMTF`, `Link 16 J-series`, `API/JSON`.
- Use for: decoy allocation orders, domain effects updates, and replenishment trigger reports.

### `ps-contested-cas-evac-c2-stack-v1`
- Protocols: `HL7/FHIR`, `USMTF`, `NATO APP-11/ADatP-3`.
- Use for: CASEVAC C2 failover packets, patient movement handoffs, and medical branch decisions.

### `ps-runway-ice-fod-clearance-stack-v1`
- Protocols: `USMTF`, `API/JSON`, `CAP`.
- Use for: runway status reports, clearance tasking, and sortie resumption notifications.

### `ps-long-range-fires-lot-reliability-stack-v1`
- Protocols: `USMTF`, `API/JSON`, `XML`.
- Use for: lot reliability updates, quarantine decisions, and fires employment constraints.

### `ps-denied-fuel-bladder-integrity-stack-v1`
- Protocols: `USMTF`, `API/JSON`, `ISO 20022`.
- Use for: fuel integrity alerts, contamination reports, and sustainment branch controls.

### `ps-mobile-satcom-emission-stack-v1`
- Protocols: `USMTF`, `Link 16 J-series`, `API/JSON`.
- Use for: SATCOM emission-control updates, movement-linked emission windows, and detection-risk notices.

### `ps-critical-mineral-shipping-protection-stack-v1`
- Protocols: `AIS/NMEA`, `USMTF`, `API/JSON`.
- Use for: critical-mineral shipping risk exchange, convoy protection orders, and port continuity updates.
