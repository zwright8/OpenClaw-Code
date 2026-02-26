# Capability Deployability Audit (32-131)

Generated: 2026-02-26T02:44:57.182Z

## Criteria
- Module implementation exists in `swarm-protocol/src` and is exported via `swarm-protocol/index.js` mapping.
- Capability exports evaluator + `ToTasks` adapter + manager class.
- Evaluator, task conversion, and manager wrapper pass a smoke execution check.
- Capability section exists in `CAPABILITY_BLUEPRINT.md`.
- Capability has test evidence in `swarm-protocol/test`.

## Summary
- Total audited: 100
- Deployable: 100
- Not deployable: 0
- Missing blueprint sections: 0
- Missing test evidence: 0
- Smoke-check failures: 0

## Matrix
| # | Capability | Module | Blueprint | Tests | Exports | Smoke | Tasks | Manager | Deployable | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 32 | Intervention Portfolio Optimizer | `intervention-portfolio` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 33 | Long-Horizon Externality Forecaster | `long-horizon-externality` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 34 | Equity Impact Analyzer | `equity-impact` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 35 | Community Feedback Harvester | `community-feedback` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 36 | Public Benefit Opportunity Miner | `public-benefit-opportunity` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 37 | Harm Escalation Early-Warning | `harm-escalation` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 38 | Misuse Behavior Detector | `misuse-detector` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 39 | Adversarial Robustness Fuzzer | `adversarial-fuzzer` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 40 | Explainability Narrative Generator | `explainability-narrative` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 41 | Evidence Provenance Graph | `evidence-provenance` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 42 | Counterfactual Policy Lab | `counterfactual-policy-lab` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 43 | Policy Diff Simulator | `policy-diff-simulator` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 44 | Value Conflict Resolver | `value-conflict-resolver` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 45 | Multi-Stakeholder Preference Modeler | `stakeholder-preference` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 46 | Consent and Agency Mapper | `consent-agency` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 47 | Vulnerable Population Safeguard | `vulnerable-safeguard` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 48 | Accessibility Quality Auditor | `accessibility-auditor` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 49 | Environmental Impact Estimator | `environmental-impact` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 50 | Resource Fairness Allocator | `resource-fairness` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 51 | Ethical Budget Optimizer | `ethical-budget` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 52 | Human Oversight Workbench | `human-oversight-workbench` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 53 | Operator Decision Replay Studio | `operator-decision-replay` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 54 | Governance Rule Compiler | `governance-rule-compiler` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 55 | Compliance Standard Mapper | `compliance-standard-mapper` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 56 | Jurisdictional Policy Router | `jurisdictional-policy-router` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 57 | Incident Communication Synthesizer | `incident-communication-synthesizer` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 58 | Crisis Coordination Mesh | `crisis-coordination-mesh` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 59 | Reliability Chaos Gym | `reliability-chaos-gym` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 60 | Recovery Playbook Synthesizer | `recovery-playbook-synthesizer` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 61 | Disaster Response Mission Packager | `disaster-response-packager` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 62 | Healthcare Safety Protocol Adapter | `healthcare-safety-adapter` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 63 | Education Support Planner | `education-support-planner` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 64 | Civic Service Automation Planner | `civic-service-automation-planner` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 65 | Nonprofit Ops Copilot Bridge | `nonprofit-ops-copilot-bridge` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 66 | Workforce Upskilling Orchestrator | `workforce-upskilling-orchestrator` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 67 | Collaboration Trust Score Engine | `collaboration-trust-score` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 68 | Reputation and Accountability Ledger | `reputation-accountability-ledger` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 69 | Open Knowledge Curator | `open-knowledge-curator` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 70 | Scientific Hypothesis Marketplace | `scientific-hypothesis-marketplace` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 71 | Experiment Reproducibility Verifier | `experiment-reproducibility-verifier` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 72 | Data Quality Sentinel | `data-quality-sentinel` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 73 | Bias Detection and Mitigation Loop | `bias-mitigation-loop` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 74 | Red Team Auto-Challenge Engine | `red-team-auto-challenge-engine` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 75 | Value Alignment Stress Tester | `value-alignment-stress-tester` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 76 | Social Simulation Sandbox | `social-simulation-sandbox` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 77 | Consensus Formation Facilitator | `consensus-formation-facilitator` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 78 | Debate Mediator and Fact Checker | `debate-mediator-fact-checker` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 79 | Uncertainty Communication Composer | `uncertainty-communication-composer` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 80 | Explainable Recommendation Layer | `explainable-recommendation-layer` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 81 | Goal Decomposition Superplanner | `goal-decomposition-superplanner` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 82 | Execution Autonomy Dial | `execution-autonomy-dial` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 83 | Self-Reflection Error Taxonomy | `self-reflection-error-taxonomy` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 84 | Cognitive Drift Corrector | `cognitive-drift-corrector` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 85 | Long-Term Memory Consolidator | `long-term-memory-consolidator` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 86 | Skill Discovery Auto-Installer | `skill-discovery-auto-installer` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 87 | Tool Reliability Autopatcher | `tool-reliability-autopatcher` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 88 | API Compatibility Adapter | `api-compatibility-adapter` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 89 | Workflow Template Synthesizer | `workflow-template-synthesizer` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 90 | Agent Team Topology Optimizer | `agent-team-topology-optimizer` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 91 | Multi-Agent Negotiation Protocol | `multi-agent-negotiation-protocol` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 92 | Cross-Org Federation Coordinator | `cross-org-federation-coordinator` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 93 | Privacy-Preserving Collaboration Layer | `privacy-preserving-collaboration-layer` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 94 | Secure Data Clean Room Broker | `secure-data-clean-room-broker` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 95 | Cryptographic Attestation Mesh | `cryptographic-attestation-mesh` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 96 | Zero-Trust Action Gatekeeper | `zero-trust-action-gatekeeper` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 97 | Economic Cost-Benefit Simulator | `economic-cost-benefit-simulator` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 98 | Funding Allocation Advisor | `funding-allocation-advisor` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 99 | Supply Chain Resilience Planner | `supply-chain-resilience-planner` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 100 | Infrastructure Capacity Forecaster | `infrastructure-capacity-forecaster` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 101 | Energy Efficiency Optimizer | `energy-efficiency-optimizer` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 102 | Carbon and Sustainability Guard | `carbon-sustainability-guard` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 103 | Local Language Community Adapter | `local-language-community-adapter` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 104 | Cultural Context Translator | `cultural-context-translator` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 105 | Accessibility Personalization Engine | `accessibility-personalization-engine` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 106 | Mental Health Safety Companion | `mental-health-safety-companion` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 107 | Emotional Harm Detection Guard | `emotional-harm-detection-guard` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 108 | Child Safety Protection Layer | `child-safety-protection-layer` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 109 | Fraud and Scam Prevention Shield | `fraud-scam-prevention-shield` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 110 | Digital Rights Compliance Monitor | `digital-rights-compliance-monitor` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 111 | Public Transparency Portal Generator | `public-transparency-portal-generator` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 112 | Trustworthy Reporting Publisher | `trustworthy-reporting-publisher` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 113 | Learning Curriculum Generator | `learning-curriculum-generator` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 114 | Skill Gap Diagnostic Engine | `skill-gap-diagnostic-engine` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 115 | Human-AI Pair Programming Coach | `human-ai-pair-programming-coach` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 116 | Scientific Literature Synthesizer | `scientific-literature-synthesizer` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 117 | Knowledge Gap Explorer | `knowledge-gap-explorer` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 118 | Autonomous Research Program Manager | `autonomous-research-program-manager` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 119 | Hypothesis Prioritization Exchange | `hypothesis-prioritization-exchange` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 120 | Breakthrough Opportunity Radar | `breakthrough-opportunity-radar` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 121 | Strategic Scenario War-Gamer | `strategic-scenario-war-gamer` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 122 | Policy Intervention Optimizer | `policy-intervention-optimizer` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 123 | Global Risk Observatory | `global-risk-observatory` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 124 | Humanitarian Logistics Coordinator | `humanitarian-logistics-coordinator` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 125 | Emergency Resource Dispatcher | `emergency-resource-dispatcher` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 126 | Community Impact Measurement Studio | `community-impact-measurement-studio` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 127 | Social Benefit KPI Dashboard | `social-benefit-kpi-dashboard` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 128 | Philanthropic Program Optimizer | `philanthropic-program-optimizer` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 129 | Inclusive Governance Co-Designer | `inclusive-governance-co-designer` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 130 | Collective Intelligence Commons | `collective-intelligence-commons` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |
| 131 | Humanity Mission Operating System | `humanity-mission-operating-system` | YES | YES | PASS | PASS | PASS | PASS | YES | OK |

