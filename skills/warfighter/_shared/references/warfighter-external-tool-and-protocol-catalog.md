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
