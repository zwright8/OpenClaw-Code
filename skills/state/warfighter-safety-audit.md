# Warfighter Safety Audit

- generatedAt: 2026-04-12T22:13:39.713Z
- corpusRoot: skills/warfighter
- scannedSkillCount: 2264
- supportSkillCount: 1836
- prohibitedSkillCount: 284
- structuralGapSkillCount: 743
- prohibitedFindingCount: 321
- structuralFindingCount: 1401

## Findings By Rule

- missing-required-inputs: 728
- missing-validation: 329
- missing-guardrails: 156
- missing-failure-handling: 145
- prohibited-missile-or-munitions: 88
- prohibited-targeting: 63
- prohibited-isr-or-ew: 60
- prohibited-fires-or-strike: 56
- missing-output-format: 28
- prohibited-air-defense-or-counter-uas: 25
- prohibited-roe-or-fire-control: 18
- missing-tool-protocol: 15
- prohibited-combat-force-employment: 7
- prohibited-intel-led-harm-or-evasion: 4

## Prohibited Skills

- skills/warfighter/adversary-kill-web-vulnerability-mapping-cell/SKILL.md: prohibited-fires-or-strike match=kill-web
- skills/warfighter/ai-red-team-operational-model-threat-cell/SKILL.md: prohibited-targeting match=targeting
- skills/warfighter/air-defense-artillery-fire-control-cell/SKILL.md: prohibited-air-defense-or-counter-uas match=Air Defense
- skills/warfighter/air-missile-defense-early-warning-network-resilience-cell/SKILL.md: prohibited-missile-or-munitions match=missile
- skills/warfighter/air-tasking-cycle-support/SKILL.md: prohibited-targeting match=target nomination
- skills/warfighter/all-source-collection-management-board/SKILL.md: prohibited-isr-or-ew match=ISR
- skills/warfighter/allied-munitions-safety-stock-interoperability-cell/SKILL.md: prohibited-missile-or-munitions match=munitions
- skills/warfighter/amphibious-assault-coordinator/SKILL.md: prohibited-combat-force-employment match=Amphibious Assault
- skills/warfighter/anti-ship-missile-defense-coordinator/SKILL.md: prohibited-missile-or-munitions match=missile
- skills/warfighter/anti-submarine-warfare-support/SKILL.md: prohibited-combat-force-employment match=Anti-Submarine Warfare
- skills/warfighter/arctic-long-range-uas-icing-and-link-resilience-cell/SKILL.md: prohibited-isr-or-ew match=ISR
- skills/warfighter/autonomous-multi-domain-decoy-synchronization-cell/SKILL.md: prohibited-targeting match=targeting
- skills/warfighter/autonomous-target-recognition-human-override-assurance-cell/SKILL.md: prohibited-targeting match=Target Recognition
- skills/warfighter/ballistic-missile-defense-battle-management/SKILL.md: prohibited-missile-or-munitions match=missile
- skills/warfighter/battle-damage-assessment-fusion-cell/SKILL.md: prohibited-fires-or-strike match=Battle Damage Assessment
- skills/warfighter/battlefield-forensics-site-exploitation-cell/SKILL.md: prohibited-targeting match=targeting
- skills/warfighter/close-air-support-digital-integration-cell/SKILL.md: prohibited-combat-force-employment match=Close Air Support
- skills/warfighter/coalition-ai-targeting-policy-explainability-and-audit-cell/SKILL.md: prohibited-targeting match=targeting
- skills/warfighter/coalition-air-missile-defense-early-warning-fusion-cell/SKILL.md: prohibited-missile-or-munitions match=missile
- skills/warfighter/coalition-autonomous-convoy-ethical-governance-cell/SKILL.md: prohibited-roe-or-fire-control match=ROE
- skills/warfighter/coalition-autonomous-maritime-rules-of-engagement-cell/SKILL.md: prohibited-roe-or-fire-control match=Rules of Engagement
- skills/warfighter/coalition-ballistic-missile-civil-warning-and-shelter-synchronization-cell/SKILL.md: prohibited-missile-or-munitions match=missile
- skills/warfighter/coalition-cognitive-ew-disinformation-countertargeting-cell/SKILL.md: prohibited-targeting match=targeting
- skills/warfighter/coalition-deepfake-c2-authenticity-and-order-fragment-validation-cell/SKILL.md: prohibited-roe-or-fire-control match=ROE
- skills/warfighter/coalition-deepfake-voice-command-spoofing-detection-cell/SKILL.md: prohibited-targeting match=targeting

## Support Skill Structural Gaps

- skills/warfighter/arctic-denied-comms-polar-orbit-handover-cell/SKILL.md: missing-required-inputs
- skills/warfighter/arctic-multi-domain-sustainment-weather-routing-cell/SKILL.md: missing-output-format
- skills/warfighter/arctic-over-ice-ground-line-of-communication-resilience-cell/SKILL.md: missing-required-inputs
- skills/warfighter/autonomous-littoral-port-reopening-under-mining-and-drone-threat-cell/SKILL.md: missing-required-inputs
- skills/warfighter/autonomous-maritime-mine-countermeasure-swarm-control-cell/SKILL.md: missing-required-inputs
- skills/warfighter/autonomous-maritime-visit-board-search-and-seizure-support-cell/SKILL.md: missing-required-inputs
- skills/warfighter/battlefield-additive-manufacturing-forward-repair-validation-cell/SKILL.md: missing-required-inputs
- skills/warfighter/battlefield-identity-credential-recovery-cell/SKILL.md: missing-required-inputs
- skills/warfighter/battlefield-neuromorphic-sensor-anomaly-triage-cell/SKILL.md: missing-required-inputs
- skills/warfighter/battlefield-weather-nowcast-and-effects-window-cell/SKILL.md: missing-required-inputs
- skills/warfighter/coalition-allied-depot-sabotage-wargame-and-branch-planning-cell/SKILL.md: missing-required-inputs
- skills/warfighter/coalition-arctic-convoy-ice-drone-threat-deconfliction-cell/SKILL.md: missing-required-inputs
- skills/warfighter/coalition-arctic-icebreaker-convoy-and-port-denial-recovery-cell/SKILL.md: missing-required-inputs
- skills/warfighter/coalition-arctic-under-ice-logistics-casualty-corridor-cell/SKILL.md: missing-required-inputs
- skills/warfighter/coalition-austere-airfield-fod-and-drone-incursion-safety-cell/SKILL.md: missing-required-inputs
- skills/warfighter/coalition-austere-runway-fod-and-drone-debris-clearance-cell/SKILL.md: missing-required-inputs
- skills/warfighter/coalition-autonomous-ambulance-drone-corridor-cell/SKILL.md: missing-required-inputs
- skills/warfighter/coalition-autonomous-humanitarian-airlift-airspace-liability-cell/SKILL.md: missing-required-inputs
- skills/warfighter/coalition-autonomous-port-inspection-and-hazmat-screening-cell/SKILL.md: missing-required-inputs
- skills/warfighter/coalition-aviation-cyber-airworthiness-assurance-cell/SKILL.md: missing-required-inputs
- skills/warfighter/coalition-battlefield-evidence-translation-and-tribunal-handoff-cell/SKILL.md: missing-required-inputs
- skills/warfighter/coalition-battlefield-forensics-evidence-preservation-cell/SKILL.md: missing-required-inputs
- skills/warfighter/coalition-battlefield-spectrum-legal-attribution-cell/SKILL.md: missing-required-inputs
- skills/warfighter/coalition-border-biometric-watchlist-disruption-recovery-cell/SKILL.md: missing-required-inputs
- skills/warfighter/coalition-border-refugee-biometric-deconfliction-and-insider-risk-screening-cell/SKILL.md: missing-required-inputs
