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

### `ts-blood-chain-cold-storage-assurance-v1`
- Use for: theater blood logistics, cold-chain survivability, and casualty transfusion continuity under attack.
- Primary tools: blood inventory telemetry, thermal assurance monitors, patient regulation systems.
- Cross-check tools: independent cold-chain probe ledger and med-log exception board.
- Typical products: blood redistribution matrix, transfusion risk packet, continuity branch plan.

### `ts-runway-camouflage-decoy-v1`
- Use for: runway camouflage/deception, decoy employment timing, and sortie survivability.
- Primary tools: airfield status dashboards, decoy effectiveness simulators, ISR signature comparison tools.
- Cross-check tools: independent imagery-change detector and alternate engineering readiness board.
- Typical products: deception emplacement timeline, survivability scorecard, sortie branch triggers.

### `ts-orbit-rescue-deorbit-governance-v1`
- Use for: coalition satellite rescue, collision-avoidance governance, and controlled deorbit assurance.
- Primary tools: SDA catalog services, conjunction analyzers, orbit maneuver planning services.
- Cross-check tools: coalition ephemeris mirror and independent reentry risk monitor.
- Typical products: rescue option matrix, deorbit corridor packet, coalition authority log.

### `ts-autonomous-bridge-load-rating-v1`
- Use for: autonomous bridge inspection, load-classification updates, and mobility release decisions.
- Primary tools: robotic inspection systems, structural digital twins, engineer route authorization boards.
- Cross-check tools: independent load-test worksheet and alternate route feasibility board.
- Typical products: bridge load status board, movement authorization order, repair priority queue.

### `ts-undersea-chokepoint-autonomy-traffic-v1`
- Use for: undersea chokepoint autonomous patrol control and traffic deconfliction.
- Primary tools: undersea sensor grid manager, autonomy mission controller, maritime traffic analytics.
- Cross-check tools: independent acoustic contact validator and alternate convoy timing board.
- Typical products: chokepoint traffic order, autonomy patrol matrix, diversion risk chart.

### `ts-grid-blackstart-exercise-v1`
- Use for: cyber-physical blackstart exercises, restoration governance, and mission-energy continuity.
- Primary tools: SCADA/ICS telemetry systems, cyber incident orchestration tools, restoration planners.
- Cross-check tools: independent grid-state verifier and mission dependency replay board.
- Typical products: blackstart exercise sequence, restoration priority matrix, mission continuity plan.

### `ts-denied-metadata-file-triage-v1`
- Use for: captured-file triage, denied metadata reconstruction, and exploitability ranking.
- Primary tools: digital forensics suites, evidence custody ledgers, malware triage sandboxes.
- Cross-check tools: independent hash/provenance verifier and alternate exploitation queue.
- Typical products: triage priority board, metadata confidence report, exploitation task packet.

### `ts-waterborne-disease-containment-v1`
- Use for: expeditionary waterborne outbreak containment and force-health protection.
- Primary tools: field epidemiology dashboards, water-quality telemetry systems, med-log planning tools.
- Cross-check tools: independent sample-chain lab board and alternate outbreak tracker.
- Typical products: containment action matrix, water-point risk map, force-health advisory.

### `ts-digital-twin-basing-hardening-v1`
- Use for: digital-twin basing dispersion and hardening investment prioritization.
- Primary tools: theater digital twin models, basing telemetry services, mission dependency graphs.
- Cross-check tools: independent simulation harness and alternate infrastructure readiness monitor.
- Typical products: dispersion option scorecard, hardening sequence plan, continuity branch map.

### `ts-coalition-fires-bda-legal-assurance-v1`
- Use for: coalition precision-fires BDA with legal and ROE traceability.
- Primary tools: fires coordination systems, ISR exploitation workflows, legal evidence decision logs.
- Cross-check tools: coalition caveat adjudication mirror and independent collateral review board.
- Typical products: legal assurance packet, restrike decision matrix, coalition release note.

### `ts-adrift-mine-drift-warning-v1`
- Use for: adrift-mine forecast, maritime warnings, and route protection decisions.
- Primary tools: ocean current forecast models, mine detection reports, maritime COP tools.
- Cross-check tools: independent drift model and alternate route risk tracker.
- Typical products: drift forecast overlay, warning message schedule, route closure matrix.

### `ts-rare-earth-refining-recovery-v1`
- Use for: rare-earth refinery sabotage recovery and defense supply continuity.
- Primary tools: industrial telemetry services, supply-chain risk analytics, production planning systems.
- Cross-check tools: independent lot availability mirror and alternate strategic stock monitor.
- Typical products: recovery sequencing board, shortfall risk register, substitution branch plan.

### `ts-hypersonic-posture-deception-survivability-v1`
- Use for: hypersonic-force passive defense, deception planning, and survivability posture management.
- Primary tools: missile warning fusion boards, posture management systems, decoy planning tools.
- Cross-check tools: independent threat timeline monitor and alternate asset survivability board.
- Typical products: survivability posture matrix, deception branch plan, passive defense trigger ladder.

### `ts-disaster-relief-airbridge-federation-v1`
- Use for: coalition disaster-relief airbridge load federation and humanitarian throughput governance.
- Primary tools: air mobility planning systems, humanitarian demand mapping, airfield throughput dashboards.
- Cross-check tools: independent aid-delivery verification board and alternate cargo-priority monitor.
- Typical products: airbridge load matrix, sortie priority ladder, host-nation coordination packet.

### `ts-denied-nav-inland-waterway-pilotage-v1`
- Use for: denied-PNT inland waterway pilotage and convoy movement safety.
- Primary tools: riverine navigation planners, bathymetry services, alternate timing reference systems.
- Cross-check tools: independent pilotage confidence board and alternate convoy risk tracker.
- Typical products: pilotage route package, denied-PNT transit risk matrix, convoy timing order.

### `ts-battle-network-time-sync-assurance-v1`
- Use for: battle-network time synchronization integrity and holdover continuity.
- Primary tools: precision timing monitors, network sync analyzers, GNSS/PNT fallback orchestration tools.
- Cross-check tools: independent time-transfer validator and alternate holdover confidence board.
- Typical products: time-sync integrity brief, holdover failover sequence, resync trigger checklist.

### `ps-blood-chain-assurance-stack-v1`
- Protocols: `HL7/FHIR`, `USMTF`, `API/JSON`.
- Use for: blood chain data exchange, casualty synchronization, and medical sustainment continuity.

### `ps-runway-deception-stack-v1`
- Protocols: `USMTF`, `Link 16 J-series`, `OGC`.
- Use for: runway deception plans, decoy control updates, and rapid airfield survivability reporting.

### `ps-orbit-rescue-deorbit-stack-v1`
- Protocols: `CCSDS`, `API/JSON`, `USMTF`.
- Use for: coalition orbital rescue/deorbit coordination and maneuver authority message exchange.

### `ps-autonomous-bridge-load-stack-v1`
- Protocols: `USMTF`, `OGC`, `API/JSON`.
- Use for: engineer bridge-load decisions and mobility release packets from autonomous inspections.

### `ps-undersea-chokepoint-autonomy-stack-v1`
- Protocols: `AIS/NMEA`, `Link 16 J-series`, `USMTF`.
- Use for: undersea chokepoint autonomy patrol coordination and traffic control dissemination.

### `ps-grid-blackstart-exercise-stack-v1`
- Protocols: `NIMS/ICS`, `STIX/TAXII`, `API/JSON`.
- Use for: cyber-physical blackstart exercise packets and restoration control workflows.

### `ps-denied-metadata-triage-stack-v1`
- Protocols: `STIX/TAXII`, `API/JSON`, `USMTF`.
- Use for: captured-file triage metadata flows and exploitation queue synchronization.

### `ps-waterborne-outbreak-containment-stack-v1`
- Protocols: `HL7/FHIR`, `NIMS/ICS`, `USMTF`.
- Use for: outbreak containment messaging, water-risk reporting, and force-health advisories.

### `ps-digital-twin-basing-hardening-stack-v1`
- Protocols: `API/JSON`, `OGC`, `USMTF`.
- Use for: basing digital-twin scenario exchange and hardening option publication.

### `ps-coalition-fires-bda-legal-stack-v1`
- Protocols: `VMF`, `Link 16 J-series`, `NATO APP-11/ADatP-3`.
- Use for: coalition BDA/ROE legal packets, restrike governance, and caveat-aware release messaging.

### `ps-adrift-mine-warning-stack-v1`
- Protocols: `AIS/NMEA`, `USMTF`, `OGC`.
- Use for: mine drift warning broadcasts, maritime route control, and closure/reopen updates.

### `ps-rare-earth-recovery-stack-v1`
- Protocols: `API/JSON`, `USMTF`, `XML`.
- Use for: strategic industrial recovery status exchange and defense-production continuity packets.

### `ps-hypersonic-survivability-stack-v1`
- Protocols: `USMTF`, `Link 16 J-series`, `API/JSON`.
- Use for: hypersonic posture, passive-defense triggers, and deception-branch synchronization.

### `ps-disaster-relief-airbridge-federation-stack-v1`
- Protocols: `NATO APP-11/ADatP-3`, `USMTF`, `API/JSON`.
- Use for: coalition airbridge cargo-priority federation and humanitarian air movement control.

### `ps-denied-inland-pilotage-stack-v1`
- Protocols: `AIS/NMEA`, `USMTF`, `API/JSON`.
- Use for: denied-navigation inland pilotage control messages and convoy movement safety packets.

### `ps-battle-network-time-sync-stack-v1`
- Protocols: `PTP/NTP`, `USMTF`, `API/JSON`.
- Use for: timing integrity status, holdover synchronization branches, and resync directives.
- Use for: autonomous bridge damage inspection, military load class estimation, and crossing sequence governance.
- Primary tools: robotic inspection feed fusion, structural confidence model, crossing demand allocator.
- Cross-check tools: independent engineer validation board and alternate manual load-rating worksheet.
- Typical products: bridge confidence map, crossing authorization ladder, repair-versus-bypass decision packet.

### `ts-advanced-packaging-semiconductor-assurance-v1`
- Use for: strategic advanced-packaging microelectronics continuity under sabotage, material shortage, and quality drift.
- Primary tools: packaging line telemetry dashboard, material dependency graph, secure QA drift monitor.
- Cross-check tools: independent supplier attestation ledger and alternate yield-adjudication board.
- Typical products: packaging continuity forecast, feedstock allocation matrix, mission-priority release plan.

### `ts-precision-navigation-spoofing-adjudication-v1`
- Use for: joint PNT spoofing adjudication, confidence recovery, and fallback navigation synchronization.
- Primary tools: timing-integrity anomaly engine, multi-sensor nav confidence fusion, fallback route orchestrator.
- Cross-check tools: independent inertial/terrain corroboration board and alternate geolocation trust ledger.
- Typical products: spoofing confidence ladder, fallback navigation decision tree, commander release prompt set.

### `ts-military-rail-yard-sabotage-recovery-v1`
- Use for: operational military rail yard sabotage recovery, hazardous cargo isolation, and throughput restoration.
- Primary tools: rail-yard damage telemetry board, switch/signal restoration planner, hazardous cargo risk tracker.
- Cross-check tools: independent rail safety certification log and alternate movement control mirror.
- Typical products: sabotage isolation sequence, re-marshaling timeline, movement-priority throughput plan.

### `ts-disaster-relief-airdrop-corridor-assurance-v1`
- Use for: coalition disaster-relief airdrop corridor deconfliction, drop-zone assurance, and humanitarian throughput continuity.
- Primary tools: air corridor conflict monitor, drop-zone integrity board, coalition relief flow tracker.
- Cross-check tools: independent weather/hazard feed and alternate partner acknowledgment ledger.
- Typical products: corridor assurance matrix, drop-zone confidence ranking, relief throughput branch plan.

### `ts-foundry-water-power-continuity-v1`
- Use for: homeland defense microelectronics foundry utility continuity under water and power disruption.
- Primary tools: foundry utility telemetry fusion, ultrapure water resiliency planner, production priority scheduler.
- Cross-check tools: independent grid-state estimator and alternate water purity audit chain.
- Typical products: foundry continuity matrix, load and water allocation sequence, production risk forecast.

### `ts-expeditionary-cold-chain-biologics-integrity-v1`
- Use for: expeditionary biologics cold-chain integrity, excursion response, and medical sustainment continuity.
- Primary tools: cold-chain telemetry monitor, biologics custody ledger, med-log demand prioritizer.
- Cross-check tools: independent temperature evidence validator and alternate medical authority review board.
- Typical products: excursion triage board, reroute and stabilization sequence, restricted-use release recommendation.

## Protocol Stack Catalog (2026-03-09 Domain Expansion - Reentry, Desal Defense, Fiber Restoration, Bridge Load Rating)

### `ps-orbital-reentry-consequence-stack-v1`
- Messaging: CCSDS + USMTF + API/JSON risk advisories.
- Transport: space-domain operations links + mission warning bus + delayed-sync resilience channel.
- Security: signed track custody chain + timing integrity checks + acknowledgment ledger.

### `ps-littoral-desal-cyber-physical-defense-stack-v1`
- Messaging: API/JSON + NIMS/ICS + USMTF sustainment updates.
- Transport: OT telemetry gateway + coalition utility exchange + fallback voice/readback path.
- Security: zero-trust OT segmentation + sample-custody signatures + dual-approval command gates.

### `ps-underground-fiber-restoration-stack-v1`
- Messaging: USMTF + CoT + API/JSON outage and repair packets.
- Transport: tactical network control bus + engineer mission-data fabric + courier fallback workflow.
- Security: route-custody hashes + repair-order authorization chain + immutable restoration log.

### `ps-autonomous-bridge-load-rating-stack-v1`
- Messaging: VMF + API/JSON + OGC structural overlays.
- Transport: edge robotics mesh + engineer coordination network + degraded manual report path.
- Security: sensor-trust attestation + structural confidence signing + commander approval chain.

### `ps-advanced-packaging-semiconductor-assurance-stack-v1`
- Messaging: API/JSON + XML quality payloads + USMTF readiness summaries.
- Transport: industrial telemetry gateways + secure supplier exchange + offline reconciliation channel.
- Security: signed supplier attestations + lot genealogy integrity checks + approval-role traceability.

### `ps-precision-navigation-spoofing-adjudication-stack-v1`
- Messaging: Link 16 J-series + CoT + API/JSON confidence advisories.
- Transport: tactical data links + mission edge fusion nodes + degraded low-bandwidth sync path.
- Security: anti-spoof confidence attestation + timing trust checks + command acknowledgment chain.

### `ps-military-rail-yard-sabotage-recovery-stack-v1`
- Messaging: USMTF + NATO APP-11/ADatP-3 + API/JSON movement updates.
- Transport: military rail ops network + movement-control data fabric + manual dispatch fallback.
- Security: hazardous-cargo custody signatures + rail safety dual-auth + tamper-evident movement log.

### `ps-disaster-relief-airdrop-corridor-assurance-stack-v1`
- Messaging: ATO/ACO extracts + USMTF + API/JSON corridor packets.
- Transport: coalition airspace coordination bus + mission weather feeds + delayed partner-sync fallback.
- Security: federation trust assertions + releasability tagging + partner acknowledgment ledger.

### `ps-foundry-water-power-continuity-stack-v1`
- Messaging: API/JSON + ICS utility records + USMTF strategic readiness advisories.
- Transport: utility telemetry fabric + strategic industrial coordination network + offline continuity scripts.
- Security: utility command dual-control + water quality evidence signing + audit immutability.

### `ps-expeditionary-cold-chain-biologics-integrity-stack-v1`
- Messaging: HL7/FHIR + USMTF + API/JSON medical logistics packets.
- Transport: med-log exchange network + cold-chain sensor gateways + constrained-bandwidth sync fallback.
- Security: custody-chain integrity checks + role-scoped medical authority gates + immutable excursion ledger.

## Tool and Protocol Catalog (2026-03-09 Domain Expansion - Subsea Repeater, Ceramic Armor, Dam Breach, ICS Recovery)

### `ts-subsea-repeater-tamper-restoration-v1`
- Use for: rapid detection, attribution, and restoration of tampered subsea telecom repeaters supporting joint military traffic.
- Primary tools: optical repeater telemetry monitor, undersea fault localization engine, repair convoy scheduler.
- Cross-check tools: independent landing-station traffic integrity board and alternate cable health mirror.
- Typical products: tamper confidence ladder, reroute execution matrix, repair synchronization timeline.

### `ts-additive-ceramic-armor-surge-v1`
- Use for: coalition surge production and controlled release of additively manufactured ceramic armor kits.
- Primary tools: additive MES quality tracker, ballistic test evidence board, coalition allocation planner.
- Cross-check tools: independent lot-certification validator and alternate defect-trend adjudication board.
- Typical products: lot release board, mission-priority armor allocation plan, reconstitution timeline.

### `ts-dam-breach-force-protection-evacuation-v1`
- Use for: emergency force-protection and evacuation sequencing during impending or active dam-breach hazards.
- Primary tools: hydrology breach forecast engine, evacuation route throughput model, shelter capacity dashboard.
- Cross-check tools: independent flood-map corroboration feed and alternate civil alert acknowledgment board.
- Typical products: inundation risk timeline, phased evacuation matrix, continuity branch packet.

### `ts-portable-nuclear-detection-attribution-v1`
- Use for: tactical radiological/nuclear signal validation, sample custody assurance, and attribution decision support.
- Primary tools: portable detector fusion board, isotope signature analyzer, plume confidence mapper.
- Cross-check tools: independent lab adjudication chain and alternate CBRN confidence review board.
- Typical products: radiological confidence ladder, maneuver restriction recommendations, attribution escalation packet.

### `ts-maritime-chokepoint-contraband-interdiction-v1`
- Use for: AI-enabled detection and interdiction of military-relevant contraband in strategic chokepoints.
- Primary tools: vessel behavior anomaly engine, cargo risk scoring platform, interdiction mission planner.
- Cross-check tools: independent customs-ledger verifier and alternate legal custody evidence board.
- Typical products: interdiction priority list, board-hold-release matrix, legal handoff package.

### `ts-gps-mcode-keyfill-denial-recovery-v1`
- Use for: strategic recovery from M-code keyfill denial and associated timing trust degradation.
- Primary tools: key-distribution status monitor, crypto trust integrity checker, mission PNT dependency graph.
- Cross-check tools: independent key provenance ledger and alternate timing trust monitor.
- Typical products: keyfill recovery ladder, fallback PNT matrix, mission risk-to-time synchronization brief.

### `ts-ics-ransomware-rapid-recovery-v1`
- Use for: defense-industrial OT ransomware containment, safe restart sequencing, and mission-output restoration.
- Primary tools: OT SIEM/SOAR response board, PLC integrity attestation service, industrial incident command tracker.
- Cross-check tools: independent safety interlock verifier and alternate forensic evidence custody monitor.
- Typical products: containment action sequence, safe restart gates, production restoration decision matrix.

### `ts-austere-plasma-reconstitution-v1`
- Use for: expeditionary freeze-dried plasma reconstitution quality and casualty-priority distribution under austere conditions.
- Primary tools: blood-product quality telemetry board, plasma reconstitution checklist engine, med-log demand allocator.
- Cross-check tools: independent excursion evidence validator and alternate senior medical review board.
- Typical products: plasma issue priority ladder, quality exception log, casualty-support continuity timeline.

### `ts-geomagnetic-storm-grid-satcom-posture-v1`
- Use for: cross-domain mission posture management during geomagnetic storm impacts on power grids and SATCOM.
- Primary tools: space weather alert fusion service, grid disturbance status board, SATCOM failover orchestrator.
- Cross-check tools: independent timing-integrity monitor and alternate infrastructure resilience status mirror.
- Typical products: joint posture transition matrix, failover trigger ladder, commander risk prompt set.

### `ts-prisoner-biometric-identity-fraud-v1`
- Use for: coalition prisoner identity-fraud adjudication across biometric, custody, and legal workflows.
- Primary tools: biometric mismatch adjudication service, detainee transfer integrity ledger, legal evidence chain manager.
- Cross-check tools: independent identity confidence review board and alternate custody audit trail verifier.
- Typical products: identity fraud confidence matrix, custody correction order set, tribunal-ready evidence packet.

## Protocol Stack Catalog (2026-03-09 Domain Expansion - Subsea Repeater, Ceramic Armor, Dam Breach, ICS Recovery)

### `ps-subsea-repeater-tamper-restoration-stack-v1`
- Messaging: API/JSON + USMTF + OGC cable route overlays.
- Transport: undersea telemetry gateways + maritime operations data bus + delayed courier fallback.
- Security: route-custody signatures + dual-approval repair release + immutable restoration log.

### `ps-additive-ceramic-armor-surge-stack-v1`
- Messaging: API/JSON + XML lot certification payloads + USMTF sustainment updates.
- Transport: additive factory data buses + coalition sustainment exchange + offline reconciliation path.
- Security: signed lot genealogy + dual-source ballistic validation + role-scoped release authority.

### `ps-dam-breach-force-protection-evacuation-stack-v1`
- Messaging: NIMS/ICS forms + API/JSON + USMTF force protection advisories.
- Transport: emergency operations platforms + mission command networks + voice/readback fallback.
- Security: signed warning chain + evacuation order acknowledgment ledger + authority-tier gating.

### `ps-portable-nuclear-detection-attribution-stack-v1`
- Messaging: API/JSON + USMTF + CBRN evidence XML records.
- Transport: tactical sensor mesh + CBRN operations network + low-bandwidth fallback sync.
- Security: sample-custody cryptographic hashes + attribution confidence attestation + approval chain logging.

### `ps-maritime-chokepoint-contraband-interdiction-stack-v1`
- Messaging: AIS/NMEA + API/JSON + USMTF interdiction status packets.
- Transport: maritime COP data fabric + coalition interdiction coordination links + deferred-sync fallback.
- Security: vessel identity assertions + evidence-chain immutability + legal authority acknowledgment record.

### `ps-gps-mcode-keyfill-denial-recovery-stack-v1`
- Messaging: API/JSON + USMTF + key distribution status records.
- Transport: secure key management networks + mission enclave distribution paths + procedural courier fallback.
- Security: key provenance signatures + crypto trust attestation + dual-control key release gate.

### `ps-ics-ransomware-rapid-recovery-stack-v1`
- Messaging: API/JSON + ICS incident records + USMTF strategic readiness updates.
- Transport: OT incident response network + isolated recovery enclaves + manual safety log fallback.
- Security: zero-trust OT segmentation + signed restart approvals + tamper-evident forensic ledger.

### `ps-austere-plasma-reconstitution-stack-v1`
- Messaging: HL7/FHIR + USMTF + API/JSON med-log updates.
- Transport: expeditionary medical data links + cold-chain sensor gateways + constrained-bandwidth sync fallback.
- Security: custody-chain signatures + medical role authorization + immutable excursion audit records.

### `ps-geomagnetic-storm-grid-satcom-posture-stack-v1`
- Messaging: CCSDS + API/JSON + USMTF posture advisories.
- Transport: space-weather feed bus + utility resilience exchanges + SATCOM and HF fallback paths.
- Security: timing trust attestation + cross-domain acknowledgment checks + command approval ledger.

### `ps-prisoner-biometric-identity-fraud-stack-v1`
- Messaging: API/JSON + NATO APP-11/ADatP-3 custody records + USMTF legal-status updates.
- Transport: coalition detainee systems + federated biometric exchange + delayed-sync evidence channel.
- Security: identity confidence signing + releasability tagging + immutable custody audit chain.

## Tool and Protocol Catalog (2026-03-09 Domain Expansion - Solar Storm, Beacon Deception, Counterfeit Microelectronics)

### `ts-space-weather-solar-storm-mission-assurance-v1`
- Use for: joint mission assurance during severe solar weather with cross-domain impacts to SATCOM, timing, and grid stability.
- Primary tools: space weather fusion service, SATCOM outage predictor, mission dependency impact engine.
- Cross-check tools: independent timing-integrity monitor and alternate power continuity board.
- Typical products: mission impact timeline, comms failover order, command risk posture prompt.

### `ts-personnel-recovery-beacon-deception-counter-v1`
- Use for: joint personnel recovery under beacon spoofing, replay, and deliberate authentication deception.
- Primary tools: beacon authenticity analyzer, ISR corroboration board, recovery mission router.
- Cross-check tools: independent PR confidence review board and alternate survival-signal adjudicator.
- Typical products: authenticated survivor confidence ladder, recovery branch matrix, false-signal suppression order.

### `ts-expeditionary-blood-cold-chain-denial-recovery-v1`
- Use for: expeditionary blood and biologics cold-chain restoration when contested logistics causes repeated excursion risk.
- Primary tools: cold-chain telemetry fusion, med-log demand allocator, excursion remediation planner.
- Cross-check tools: independent temperature chain auditor and alternate senior medical review board.
- Typical products: excursion triage queue, reroute and stabilization sequence, release restriction matrix.

### `ts-urban-spectrum-hidden-emitter-hunt-v1`
- Use for: tactical hunt of hidden, low-power, and burst transmitters in dense urban electromagnetic clutter.
- Primary tools: RF geolocation mesh, emitter behavior classifier, urban maneuver deconfliction board.
- Cross-check tools: independent spectrum forensics board and alternate visual ISR corroboration channel.
- Typical products: emitter confidence map, suppression or capture priority list, fratricide-safe maneuver triggers.

### `ts-port-crane-ransomware-manual-throughput-v1`
- Use for: operational port throughput continuity when crane automation is disrupted by ransomware.
- Primary tools: port OT incident board, manual throughput scheduler, cargo priority reconciliation service.
- Cross-check tools: independent safety interlock verifier and alternate movement-control mirror.
- Typical products: manual throughput battle rhythm, cyber containment gates, cargo release priority matrix.

### `ts-strategic-rare-gas-sensor-supply-resilience-v1`
- Use for: strategic continuity of rare-gas dependent sensor and semiconductor manufacturing during supply shocks.
- Primary tools: rare-gas inventory and demand dashboard, supplier disruption model, mission-priority allocation board.
- Cross-check tools: independent supplier attestation ledger and alternate industrial yield monitor.
- Typical products: scarce-gas allocation ladder, sensor production continuity forecast, mitigation branch options.

### `ts-denied-pnt-celestial-tercom-requalification-v1`
- Use for: requalification of navigation and timing posture using celestial, TERCOM, and inertial fallback under denied PNT.
- Primary tools: multi-source navigation confidence engine, terrain-correlation validator, timing drift monitor.
- Cross-check tools: independent inertial integrity board and alternate mission route safety checker.
- Typical products: fallback navigation confidence ladder, platform requalification matrix, commander go/no-go prompts.

### `ts-maritime-drone-mothership-attribution-v1`
- Use for: coalition attribution and interdiction planning for maritime motherships enabling one-way and loitering drone attacks.
- Primary tools: maritime behavior anomaly engine, launch-signature correlation board, coalition interdiction planner.
- Cross-check tools: independent AIS anomaly verifier and alternate legal-evidence custody board.
- Typical products: mothership confidence index, interdiction sequence plan, legal handoff packet.

### `ts-homeland-microelectronics-counterfeit-quarantine-v1`
- Use for: homeland quarantine and triage of counterfeit microelectronics entering military supply and depot pipelines.
- Primary tools: part authenticity scanner, lot genealogy reconciler, depot quarantine task board.
- Cross-check tools: independent lab adjudication chain and alternate supplier provenance tracker.
- Typical products: counterfeit risk ladder, quarantine-and-release matrix, mission impact advisory.

### `ts-expeditionary-runway-fod-autonomy-v1`
- Use for: expeditionary runway foreign-object-debris detection and clearance with human-autonomy teaming.
- Primary tools: autonomous FOD patrol planner, runway hazard confidence board, sortie regeneration scheduler.
- Cross-check tools: independent tower or vehicle sweep verification and alternate airfield safety board.
- Typical products: FOD clearance timeline, sortie risk gates, autonomy-to-human handoff triggers.

## Protocol Stack Catalog (2026-03-09 Domain Expansion - Solar Storm, Beacon Deception, Counterfeit Microelectronics)

### `ps-space-weather-solar-storm-mission-assurance-stack-v1`
- Messaging: CCSDS + USMTF + API/JSON mission-impact advisories.
- Transport: space-weather feed bus + SATCOM operations network + delayed-sync fallback path.
- Security: signed event provenance + timing trust attestations + acknowledgment integrity ledger.

### `ps-personnel-recovery-beacon-deception-counter-stack-v1`
- Messaging: VMF + CoT + USMTF personnel recovery updates.
- Transport: recovery C2 network + ISR fusion bus + constrained-bandwidth contingency path.
- Security: beacon authenticity signatures + dual-source survivor confidence checks + command approval trace.

### `ps-expeditionary-blood-cold-chain-denial-recovery-stack-v1`
- Messaging: HL7/FHIR + USMTF + API/JSON med-log synchronization.
- Transport: medical logistics exchange + sensor gateway network + low-bandwidth fallback sync.
- Security: custody-chain integrity hashes + medical authority role gates + immutable excursion logs.

### `ps-urban-spectrum-hidden-emitter-hunt-stack-v1`
- Messaging: Link 16 J-series + CoT + API/JSON emitter confidence reports.
- Transport: tactical RF sensor mesh + mission edge fusion network + manual report fallback.
- Security: signed geolocation confidence records + anti-spoof verification + commander acknowledgment chain.

### `ps-port-crane-ransomware-manual-throughput-stack-v1`
- Messaging: API/JSON + ICS incident records + USMTF throughput status updates.
- Transport: OT incident response enclave + port ops data fabric + manual dispatch fallback.
- Security: signed safety restart gates + dual-approval cargo release + tamper-evident forensic ledger.

### `ps-strategic-rare-gas-sensor-supply-resilience-stack-v1`
- Messaging: API/JSON + XML supply evidence payloads + USMTF readiness advisories.
- Transport: industrial telemetry network + strategic supplier exchanges + offline reconciliation path.
- Security: supplier provenance signatures + lot integrity checks + strategic approval workflow logging.

### `ps-denied-pnt-celestial-tercom-requalification-stack-v1`
- Messaging: API/JSON + Link 16 J-series + USMTF timing updates.
- Transport: edge navigation fusion nodes + mission data links + reduced-bandwidth fallback channel.
- Security: timing integrity attestation + cross-source navigation confidence signing + command release gate.

### `ps-maritime-drone-mothership-attribution-stack-v1`
- Messaging: AIS/NMEA + API/JSON + USMTF maritime threat advisories.
- Transport: maritime COP bus + coalition interdiction network + deferred-sync fallback.
- Security: vessel identity assertions + evidence custody signatures + legal authority acknowledgment chain.

### `ps-homeland-microelectronics-counterfeit-quarantine-stack-v1`
- Messaging: API/JSON + XML part-auth evidence + USMTF sustainment risk updates.
- Transport: depot quality network + supplier verification exchange + offline quarantine reconciliation path.
- Security: part provenance signatures + role-scoped release approvals + immutable audit ledger.

### `ps-expeditionary-runway-fod-autonomy-stack-v1`
- Messaging: AIXM/FIXM + API/JSON + USMTF airfield status reports.
- Transport: airfield autonomy mesh + tower operations network + manual radio/readback fallback.
- Security: signed hazard confidence chain + autonomous action authority gates + air boss approval log.

## Tool and Protocol Catalog (2026-03-09 Domain Expansion - Waterway Defense, NC3 Fiber, Aeromedical Brokerage)

### `ts-orbital-debris-satcom-restoration-v1`
- Use for: contested orbital debris evasion with synchronized SATCOM restoration and command continuity.
- Primary tools: conjunction-risk predictor, SATCOM path restorer, mission dependency graph.
- Cross-check tools: independent conjunction feed mirror and alternate comm path integrity board.
- Typical products: maneuver and comms branch matrix, timing risk ladder, restoration decision packet.

### `ts-dam-lock-defense-v1`
- Use for: defense and rapid restoration sequencing for dams, locks, and military-critical waterways.
- Primary tools: hydrology stress model, lock control telemetry board, engineer mobility scheduler.
- Cross-check tools: independent floodplain estimator and alternate civil-waterway status mirror.
- Typical products: breach-risk timeline, lock control defense plan, maneuver sustainment impact matrix.

### `ts-detainee-icrc-assurance-v1`
- Use for: coalition detainee accountability with neutral-access and legal notification assurance.
- Primary tools: detainee accountability ledger, legal notification workflow engine, transfer audit manager.
- Cross-check tools: independent custody-chain verifier and alternate coalition caveat review board.
- Typical products: detainee notification matrix, access coordination tracker, custody exception log.

### `ts-hardened-fiber-nc3-failover-v1`
- Use for: hardened fiber path failover and integrity assurance for NC3-adjacent command continuity.
- Primary tools: protected route monitor, emergency message integrity validator, failover orchestration board.
- Cross-check tools: independent acknowledgment-chain mirror and alternate path-latency verifier.
- Typical products: failover sequence card, integrity exception report, command continuity confidence score.

### `ts-critical-mineral-recycling-v1`
- Use for: expeditionary recovery and recycling of critical minerals from damaged equipment and waste streams.
- Primary tools: material recovery planner, assay and purity workflow, sustainment allocation dashboard.
- Cross-check tools: independent assay verification queue and alternate mission-priority allocation board.
- Typical products: recoverable-material ledger, purity confidence matrix, reallocation plan.

### `ts-disconnected-ai-model-assurance-v1`
- Use for: disconnected AI model governance, signed rollback, and mission-safe baseline enforcement.
- Primary tools: model registry mirror, drift and anomaly monitor, rollback authority workflow board.
- Cross-check tools: independent benchmark replay harness and alternate policy exception ledger.
- Typical products: rollback decision ladder, drift incident packet, approved-baseline manifest.

### `ts-urban-vtol-lz-auth-v1`
- Use for: urban vertical-lift landing-zone authentication under spoofing, decoy, and congestion pressure.
- Primary tools: LZ geofence verifier, rooftop hazard scorer, civil-traffic deconfliction dashboard.
- Cross-check tools: independent ISR corroboration feed and alternate pilot confirmation board.
- Typical products: authenticated LZ shortlist, threat and congestion timeline, go/no-go cue set.

### `ts-autonomous-maritime-picket-v1`
- Use for: autonomous maritime picket operations aligned with compliant board and search workflows.
- Primary tools: autonomous surface picket controller, vessel behavior anomaly analytics, boarding mission scheduler.
- Cross-check tools: independent maritime COP mirror and alternate legal authority adjudication board.
- Typical products: picket disposition map, board-priority queue, legal compliance packet.

### `ts-spaceport-gnss-emergency-v1`
- Use for: homeland spaceport continuity during GNSS interference, spoofing, and timing instability incidents.
- Primary tools: range timing integrity monitor, launch safety constraint engine, GNSS interference mapper.
- Cross-check tools: independent oscillator holdover board and alternate space-weather interference monitor.
- Typical products: launch hold/release matrix, timing confidence ledger, emergency continuity branch plan.

### `ts-multitheater-aeromed-priority-v1`
- Use for: multi-theater aeromedical evacuation prioritization when lift, beds, and blood are jointly constrained.
- Primary tools: patient regulation broker, theater lift allocation optimizer, blood inventory stress dashboard.
- Cross-check tools: independent casualty severity review cell and alternate bed-status federation mirror.
- Typical products: cross-theater evacuation queue, lift assignment plan, treatment continuity risk register.

## Protocol Stack Catalog (2026-03-09 Domain Expansion - Waterway Defense, NC3 Fiber, Aeromedical Brokerage)

### `ps-orbital-debris-satcom-restoration-stack-v1`
- Messaging: CCSDS + API/JSON + USMTF mission continuity advisories.
- Transport: orbital conjunction data feeds + SATCOM operations bus + delayed-sync fallback path.
- Security: signed conjunction provenance + route-failover approval chain + acknowledgment ledger.

### `ps-dam-lock-defense-stack-v1`
- Messaging: NIMS/ICS + API/JSON + USMTF maneuver-impact updates.
- Transport: civil waterway telemetry exchange + mission command data bus + voice/readback fallback.
- Security: signed control actions + authority-tier gating + immutable event audit log.

### `ps-detainee-icrc-assurance-stack-v1`
- Messaging: NATO APP-11/ADatP-3 custody records + API/JSON + USMTF legal notifications.
- Transport: coalition detainee systems + legal workflow exchange + delayed-sync evidence path.
- Security: immutable custody chain + releasability tags + dual-approval transfer gate.

### `ps-hardened-fiber-nc3-failover-stack-v1`
- Messaging: USMTF + signed continuity event packets + API/JSON health updates.
- Transport: protected fiber management network + strategic command bus + authenticated fallback channel.
- Security: cryptographic message attestation + dual-control failover release + acknowledgment-chain integrity checks.

### `ps-critical-mineral-recycling-stack-v1`
- Messaging: API/JSON + XML assay records + USMTF sustainment advisories.
- Transport: expeditionary recovery workflow bus + quality lab exchange + offline reconciliation path.
- Security: signed assay evidence + lot provenance hashes + role-scoped material release authority.

### `ps-disconnected-ai-model-assurance-stack-v1`
- Messaging: API/JSON + signed model card manifests + USMTF governance summaries.
- Transport: disconnected model registry replication + mission enclave sync + manual approval fallback.
- Security: signed rollback package + policy gate enforcement + immutable deployment audit chain.

### `ps-urban-vtol-lz-auth-stack-v1`
- Messaging: CoT + AIXM/FIXM + USMTF tactical air updates.
- Transport: edge ISR fusion mesh + urban air mobility coordination bus + pilot readback fallback.
- Security: signed LZ authentication tokens + anti-spoof confidence scoring + commander release gate.

### `ps-autonomous-maritime-picket-stack-v1`
- Messaging: AIS/NMEA + API/JSON + USMTF interdiction support updates.
- Transport: maritime autonomy control bus + coalition COP links + deferred-sync patrol fallback.
- Security: signed autonomy handoff events + legal authority acknowledgment + immutable custody event logs.

### `ps-spaceport-gnss-emergency-stack-v1`
- Messaging: CCSDS timing updates + API/JSON + USMTF launch safety advisories.
- Transport: range ops data fabric + resilient timing network + constrained-bandwidth fallback channel.
- Security: timing trust attestations + launch authority dual-check + signed incident chronology.

### `ps-multitheater-aeromed-priority-stack-v1`
- Messaging: HL7/FHIR + USMTF + API/JSON patient movement coordination updates.
- Transport: medevac command exchange + theater lift planner bus + low-bandwidth contingency path.
- Security: medical role authorization + patient data minimization + immutable transfer acknowledgment chain.

## Tool Suite Catalog (2026-03-09 Domain Expansion - Combat Endurance and Denied-Mode Control)

### `ts-cjadc2-fabric-resilience-v1`
- Use for: CJADC2 data-fabric degradation triage, cross-domain routing continuity, and decision-loop stabilization.
- Primary tools: JADC2 data broker health board, cross-domain guard telemetry, edge cache orchestration.
- Cross-check tools: independent message-latency mirror and alternate COP replication ledger.
- Typical products: data-path degradation map, failover sequence, decision-authority escalation matrix.

### `ts-theater-rearm-salvo-v1`
- Use for: interceptor reload/rearm prioritization during sustained missile salvo defense.
- Primary tools: launcher status board, munitions compatibility/lot tracker, convoy movement planner.
- Cross-check tools: independent inventory reconciliation service and alternate defended-asset risk board.
- Typical products: reload priority matrix, defended-asset coverage forecast, rearm timeline packet.

### `ts-asw-helo-sonobuoy-v1`
- Use for: helo sonobuoy pattern planning, acoustic confidence management, and ASW prosecution retask.
- Primary tools: sonobuoy mission planner, ocean acoustic forecast model, maritime patrol C2 board.
- Cross-check tools: independent acoustic propagation calculator and alternate contact confidence ledger.
- Typical products: sonobuoy layout package, prosecution window matrix, confidence-ranked retask order.

### `ts-airbase-shelter-hardening-v1`
- Use for: coalition airbase shelter hardening sequencing and missile/drone survivability upgrades.
- Primary tools: airbase engineering planner, threat salvo model, shelter and runway imagery exploitation.
- Cross-check tools: independent survivability estimator and alternate logistics sufficiency board.
- Typical products: hardening priority board, sortie survivability delta, engineering branch triggers.

### `ts-cbrn-robotic-hotzone-v1`
- Use for: robotic CBRN reconnaissance, hazard boundary confirmation, and controlled entry operations.
- Primary tools: CBRN sensor fusion service, robotic mission controller, contamination sampling ledger.
- Cross-check tools: independent hazard model and alternate decon capacity dashboard.
- Typical products: contamination boundary map, robotic task package, hotzone access-control matrix.

### `ts-denied-lob-triangulation-v1`
- Use for: denied-communications emitter localization from line-of-bearing reports and EW sensing.
- Primary tools: direction-finding aggregator, triangulation solver, EW contact confidence board.
- Cross-check tools: independent geolocation replay and alternate SIGINT corroboration board.
- Typical products: emitter confidence map, geolocation uncertainty ladder, recommended action packet.

### `ts-expeditionary-water-assurance-v1`
- Use for: expeditionary water purification, contamination response, and distributed water logistics continuity.
- Primary tools: water quality telemetry, purification plant controller, distribution route optimizer.
- Cross-check tools: independent water sampling chain and alternate force-health risk monitor.
- Typical products: production and distribution plan, contamination branch timeline, health-risk scorecard.

### `ts-inland-waterway-logistics-v1`
- Use for: inland river logistics control under kinetic threat, chokepoint disruption, and bridge attrition.
- Primary tools: riverine traffic COP, bridge integrity monitor, convoy movement scheduler.
- Cross-check tools: independent throughput estimator and alternate crossing feasibility board.
- Typical products: chokepoint risk matrix, movement deconfliction package, throughput restoration timeline.

### `ts-ew-reprogram-fratricide-v1`
- Use for: rapid EW mission-data reprogramming plus electromagnetic fratricide risk control.
- Primary tools: EW mission-data manager, emitter identity service, spectrum conflict analytics.
- Cross-check tools: independent interoperability test harness and alternate EMCON governance board.
- Typical products: reprogram release packet, fratricide risk ledger, emissions deconfliction order.

### `ts-killchain-time-coherence-v1`
- Use for: kill-chain clock synchronization and timing integrity under degraded or denied PNT.
- Primary tools: timing integrity monitor, event correlation engine, data-link latency analyzer.
- Cross-check tools: independent oscillator holdover board and alternate timing transfer verifier.
- Typical products: timing confidence report, sync recovery sequence, latency risk decision packet.

## Protocol Stack Catalog (2026-03-09 Domain Expansion - Combat Endurance and Denied-Mode Control)

### `ps-cjadc2-fabric-resilience-stack-v1`
- Messaging: USMTF + STIX/TAXII + API/JSON replication status events.
- Transport: federated tactical cloud links + cross-domain transport gateways + degraded asynchronous relay.
- Security: signed data-path attestations + dual-source freshness checks + immutable failover event chain.

### `ps-theater-rearm-salvo-stack-v1`
- Messaging: Link 16 J-series + USMTF + VMF launcher and inventory updates.
- Transport: IAMD battle-network exchange + logistics route mesh + delayed-sync fallback.
- Security: role-scoped munitions release authorization + signed inventory deltas + acknowledgment ledger.

### `ps-asw-helo-sonobuoy-stack-v1`
- Messaging: Link 16 J-series + AIS/NMEA + USMTF prosecution updates.
- Transport: maritime patrol mission bus + acoustic forecast exchange + low-bandwidth patrol fallback.
- Security: signed contact confidence updates + tactical authority confirmation + immutable prosecution timeline.

### `ps-airbase-shelter-hardening-stack-v1`
- Messaging: USMTF + NATO APP-11/ADatP-3 + API/JSON engineering updates.
- Transport: coalition engineering data exchange + base defense command bus + manual readback fallback.
- Security: coalition releasability tagging + engineering approval gates + signed survivability calculations.

### `ps-cbrn-robotic-hotzone-stack-v1`
- Messaging: USMTF + OGC geospatial overlays + API/JSON hazard telemetry.
- Transport: CBRN sensing mesh + robotic control network + delayed-sync contamination reporting.
- Security: signed hazard sample chain + contamination confidence threshold gating + dual-control entry authority.

### `ps-denied-lob-triangulation-stack-v1`
- Messaging: CoT + Link 16 J-series + USMTF emitter reports.
- Transport: EW sensor mesh + edge fusion nodes + HF/manual fallback reports.
- Security: signed geolocation confidence metadata + source reliability scoring + command approval checkpoint.

### `ps-expeditionary-water-assurance-stack-v1`
- Messaging: USMTF + HL7/FHIR force-health updates + API/JSON plant telemetry.
- Transport: water infrastructure telemetry bus + logistics C2 exchange + low-bandwidth contingency sync.
- Security: sample provenance chain + health authority release gate + immutable contamination incident log.

### `ps-inland-waterway-logistics-stack-v1`
- Messaging: AIS/NMEA + USMTF + VMF movement-control advisories.
- Transport: riverine traffic exchange + movement command network + voice/readback fallback.
- Security: signed chokepoint status updates + convoy release authority gating + acknowledgment-chain tracking.

### `ps-ew-reprogram-fratricide-stack-v1`
- Messaging: Link 16 J-series + STIX/TAXII + USMTF EW control events.
- Transport: EW mission-data distribution bus + spectrum governance exchange + disconnected package courier fallback.
- Security: signed mission-data loads + interoperability preflight checks + dual-approval emission release.

### `ps-killchain-time-coherence-stack-v1`
- Messaging: USMTF timing advisories + Link 16 J-series + API/JSON timing integrity events.
- Transport: resilient timing distribution mesh + mission network replication + holdover fallback mode.
- Security: cryptographic time-source attestations + timing anomaly audit chain + authority-tier release checks.

## Tool Suite Catalog (2026-03-09 Domain Expansion - Deep Sustainment, AI Integrity, and Optical Contested Comms)

### `ts-littoral-hydrogen-sustainment-v1`
- Use for: contested littoral hydrogen generation, storage safety, and fuel-cell sustainment planning.
- Primary tools: hydrogen plant telemetry, cryogenic storage monitor, maritime sustainment planner.
- Cross-check tools: independent purity assay workflow and alternate harbor throughput risk board.
- Typical products: hydrogen sustainment posture, contamination trigger matrix, refuel branch plan.

### `ts-directed-energy-power-management-v1`
- Use for: power and thermal orchestration for directed-energy air defense nodes in sustained raids.
- Primary tools: directed-energy duty-cycle manager, microgrid dispatch board, thermal envelope analytics.
- Cross-check tools: independent generator stress monitor and alternate raid-load forecast board.
- Typical products: shot budget matrix, thermal exceedance ladder, power reallocation order.

### `ts-quantum-submarine-countermeasure-v1`
- Use for: quantum and classical sensing fusion for submarine tracking and deception adjudication.
- Primary tools: undersea sensor fusion graph, acoustic propagation model, ASW prosecution planner.
- Cross-check tools: independent sonar confidence replay and alternate oceanographic anomaly board.
- Typical products: contact confidence ledger, decoy adjudication packet, prosecution cue timeline.

### `ts-denied-medevac-blood-substitute-v1`
- Use for: denied-environment casualty regulation with scarce blood and oxygen-carrier substitutes.
- Primary tools: patient regulation broker, blood substitute inventory board, medevac route survivability planner.
- Cross-check tools: independent triage severity review and alternate bed-capacity federation mirror.
- Typical products: casualty priority board, blood-substitute allocation ladder, medevac branch triggers.

### `ts-radhard-microelectronics-policy-v1`
- Use for: strategic sparing policy for radiation-tolerant microelectronics supporting NC3 and weapons sustainment.
- Primary tools: rad-hard component provenance ledger, lifecycle test evidence manager, depot sparing optimizer.
- Cross-check tools: independent parts authenticity verifier and alternate mission-impact substitution board.
- Typical products: sparing policy memo, substitution authority matrix, risk-ranked shortage forecast.

### `ts-cyber-em-deception-targeting-v1`
- Use for: coordinated cyber and electromagnetic deception shaping adversary kill-chain sensing.
- Primary tools: EW deception planner, cyber effects orchestration board, adversary sensor model.
- Cross-check tools: independent indicator validation cell and alternate deception effectiveness ledger.
- Typical products: deception sequence card, timing synchronization order, adversary miscue confidence map.

### `ts-expeditionary-droneport-dispersal-v1`
- Use for: droneport dispersal, relocation, and survivable launch-recovery sequencing under strike risk.
- Primary tools: UAS launch slot scheduler, expeditionary airfield condition tracker, relocation route planner.
- Cross-check tools: independent runway/FARP survivability monitor and alternate weather-go/no-go service.
- Typical products: dispersion layout, launch conflict deconfliction board, relocation trigger matrix.

### `ts-laser-comms-weather-gating-v1`
- Use for: optical space-ground communications windowing with weather and obscurant gating.
- Primary tools: optical link planner, cloud/visibility nowcast service, gateway health telemetry.
- Cross-check tools: independent orbital geometry replay and alternate RF fallback readiness board.
- Typical products: optical window schedule, fallback trigger card, throughput confidence report.

### `ts-coalition-fires-voice-fallback-v1`
- Use for: coalition fires coordination assurance during digital-link degradation via voice fallback drills.
- Primary tools: fires voice-readback logger, brevity-code validation board, language assurance workflow.
- Cross-check tools: independent call-sign compliance monitor and alternate digital clearance reconciliation board.
- Typical products: voice fallback playbook, brevity drift report, authorization call-card set.

### `ts-additive-propellant-quality-surveillance-v1`
- Use for: quality and safety surveillance for additive propellant and explosive production lines.
- Primary tools: propellant line instrumentation, spectroscopy quality analyzer, lot release workflow manager.
- Cross-check tools: independent explosive stability board and alternate ammo-lot anomaly monitor.
- Typical products: lot release confidence packet, stop-production trigger ladder, safety exception register.

### `ts-rare-earth-magnet-recycling-surge-v1`
- Use for: surge planning for recycled rare-earth magnet feedstock in defense production lines.
- Primary tools: feedstock assay pipeline, industrial recycling throughput dashboard, supplier risk engine.
- Cross-check tools: independent purity verification workflow and alternate production impact estimator.
- Typical products: recycling allocation plan, feedstock confidence map, continuity branch options.

### `ts-farp-water-fuel-hazard-v1`
- Use for: forward arming/rearming hazard management for water, fuel, and fire-risk control.
- Primary tools: fuel contamination analyzer, water treatment monitor, FARP hazard control board.
- Cross-check tools: independent sample-chain audit and alternate CBRN contamination corroboration feed.
- Typical products: FARP hazard posture card, contamination response matrix, fueling go/no-go ladder.

### `ts-mission-model-poisoning-recovery-v1`
- Use for: mission AI model poisoning detection, rollback governance, and trusted recovery paths.
- Primary tools: model lineage and drift monitor, attested model registry, rollback authority workflow.
- Cross-check tools: independent benchmark replay harness and alternate policy exception ledger.
- Typical products: poisoning incident packet, rollback decision tree, retraining provenance summary.

### `ts-mission-ledger-disconnected-audit-v1`
- Use for: zero-trust mission ledger integrity and disconnected audit reconciliation across partitions.
- Primary tools: signed action ledger, identity governance audit service, delayed-sync reconciliation queue.
- Cross-check tools: independent privilege drift detector and alternate endpoint trust-state mirror.
- Typical products: disconnected audit report, privilege exception board, reconciliation suspense list.

### `ts-subsea-geothermal-power-denial-v1`
- Use for: subsea sensor power continuity under cable denial using geothermal and hybrid alternatives.
- Primary tools: subsea power telemetry, geothermal node management console, UUV inspection planner.
- Cross-check tools: independent cable fault localization service and alternate sensor duty-cycle optimizer.
- Typical products: power continuity map, reroute-versus-repair decision matrix, sensor degradation ladder.

### `ts-medical-oxygen-plant-resilience-v1`
- Use for: deployed oxygen generation resilience and distribution continuity under kinetic/cyber disruption.
- Primary tools: oxygen plant health telemetry, biomedical maintenance scheduler, hospital demand forecaster.
- Cross-check tools: independent cylinder chain verifier and alternate transport route risk board.
- Typical products: oxygen resilience plan, redistribution priority matrix, outage response branch triggers.

## Protocol Stack Catalog (2026-03-09 Domain Expansion - Deep Sustainment, AI Integrity, and Optical Contested Comms)

### `ps-littoral-hydrogen-sustainment-stack-v1`
- Messaging: USMTF + API/JSON plant telemetry + OGC maritime overlays.
- Transport: littoral sustainment data bus + harbor logistics exchange + delayed-sync fallback.
- Security: signed purity reports + hazard release dual-check + immutable resupply event chain.

### `ps-directed-energy-power-management-stack-v1`
- Messaging: Link 16 J-series + API/JSON power telemetry + USMTF defense posture updates.
- Transport: IAMD battle-network + base microgrid control exchange + low-bandwidth fallback path.
- Security: role-scoped shot authorization + signed thermal thresholds + acknowledgment-chain logging.

### `ps-quantum-submarine-countermeasure-stack-v1`
- Messaging: Link 16 J-series + NMEA + API/JSON undersea confidence events.
- Transport: maritime ASW mission network + acoustic model exchange + disconnected patrol fallback.
- Security: signed contact confidence metadata + dual-source corroboration gates + immutable prosecution timeline.

### `ps-denied-medevac-blood-substitute-stack-v1`
- Messaging: HL7/FHIR + USMTF + API/JSON medevac status updates.
- Transport: theater medical exchange + patient movement bus + low-bandwidth contingency sync.
- Security: medical role authorization + patient minimization rules + signed transfer acknowledgments.

### `ps-radhard-microelectronics-policy-stack-v1`
- Messaging: STIX/TAXII + CycloneDX SBOM + API/JSON sustainment advisories.
- Transport: industrial-base assurance bus + depot readiness exchange + offline reconciliation path.
- Security: signed provenance attestations + release authority gates + immutable lot decision log.

### `ps-cyber-em-deception-targeting-stack-v1`
- Messaging: STIX/TAXII + VMF + Link 16 J-series deception updates.
- Transport: cyber mission fabric + EW planning network + delayed-sync courier fallback.
- Security: dual-approval deception release + signed effect packets + audit-linked acknowledgment ledger.

### `ps-expeditionary-droneport-dispersal-stack-v1`
- Messaging: STANAG 4586 + CoT + API/JSON launch and relocation events.
- Transport: UAS traffic management mesh + expeditionary airfield C2 + voice/readback fallback.
- Security: signed launch authorization + geofence integrity checks + immutable sortie event log.

### `ps-laser-comms-weather-gating-stack-v1`
- Messaging: CCSDS + API/JSON weather gating events + USMTF comms advisories.
- Transport: optical gateway exchange + SATCOM fallback network + constrained-bandwidth backup channel.
- Security: signed link-state attestations + weather confidence scoring + dual-approval failover release.

### `ps-coalition-fires-voice-fallback-stack-v1`
- Messaging: NATO APP-11 + VMF + ACP 125 voice fallback records.
- Transport: coalition fires coordination bus + tactical voice nets + delayed digital reconciliation path.
- Security: coalition releasability tagging + call-sign authentication + immutable readback audit trail.

### `ps-additive-propellant-quality-surveillance-stack-v1`
- Messaging: ISA-95 B2MML + API/JSON lot telemetry + USMTF safety advisories.
- Transport: additive manufacturing network + explosive safety exchange + disconnected QA fallback.
- Security: signed lot evidence packets + stop-line authority gates + immutable release audit chain.

### `ps-rare-earth-magnet-recycling-surge-stack-v1`
- Messaging: EDIFACT + API/JSON assay updates + NIEM sustainment exchanges.
- Transport: industrial recovery coordination bus + logistics data exchange + batch fallback ingest.
- Security: signed assay provenance + supplier trust-score gating + acknowledgment-tracked allocation releases.

### `ps-farp-water-fuel-hazard-stack-v1`
- Messaging: USMTF + CoT + HL7/FHIR force-health risk updates.
- Transport: FARP ops network + fuel/water telemetry exchange + manual readback fallback.
- Security: signed sample-chain records + commander release gate + immutable hazard incident log.

### `ps-mission-model-poisoning-recovery-stack-v1`
- Messaging: in-toto/Sigstore attestations + STIX/TAXII + API/JSON rollback events.
- Transport: MLOps mission enclave + model registry replication + disconnected signed-package fallback.
- Security: cryptographic model lineage proofs + dual-approval rollback authority + immutable audit ledger.

### `ps-mission-ledger-disconnected-audit-stack-v1`
- Messaging: CBOR/COSE signed ledger events + OpenID Connect claims + SCIM identity deltas.
- Transport: zero-trust mission mesh + gateway sync queues + store-and-forward contingency path.
- Security: signed action records + privilege drift threshold gating + acknowledgment integrity checks.

### `ps-subsea-geothermal-power-denial-stack-v1`
- Messaging: NMEA 2000 + DDS + API/JSON power telemetry.
- Transport: subsea sensor mesh + maritime energy exchange + delayed UUV sync fallback.
- Security: signed power-state attestations + tamper-evident fault chronology + repair authority checkpoints.

### `ps-medical-oxygen-plant-resilience-stack-v1`
- Messaging: HL7/FHIR + DICOM + API/JSON plant status advisories.
- Transport: medical logistics exchange + hospital demand bus + low-bandwidth contingency channel.
- Security: biomedical role-based access + signed maintenance events + immutable transfer acknowledgment chain.
