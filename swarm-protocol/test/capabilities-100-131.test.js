import test from 'node:test';
import assert from 'node:assert/strict';
import * as swarm from '../index.js';

const capabilities = [
    {
        "number": 100,
        "capabilityId": "infrastructure_capacity_forecaster",
        "evaluate": "forecastInfrastructureCapacity",
        "toTasks": "infrastructureCapacityToTasks",
        "className": "InfrastructureCapacityForecaster",
        "collectionField": "systems",
        "idField": "systemId"
    },
    {
        "number": 101,
        "capabilityId": "energy_efficiency_optimizer",
        "evaluate": "optimizeEnergyEfficiency",
        "toTasks": "energyEfficiencyToTasks",
        "className": "EnergyEfficiencyOptimizer",
        "collectionField": "facilities",
        "idField": "facilityId"
    },
    {
        "number": 102,
        "capabilityId": "carbon_sustainability_guard",
        "evaluate": "enforceCarbonSustainabilityGuard",
        "toTasks": "carbonSustainabilityToTasks",
        "className": "CarbonSustainabilityGuard",
        "collectionField": "initiatives",
        "idField": "initiativeId"
    },
    {
        "number": 103,
        "capabilityId": "local_language_community_adapter",
        "evaluate": "adaptLocalLanguageCommunity",
        "toTasks": "localLanguageAdapterToTasks",
        "className": "LocalLanguageCommunityAdapter",
        "collectionField": "communities",
        "idField": "communityId"
    },
    {
        "number": 104,
        "capabilityId": "cultural_context_translator",
        "evaluate": "translateCulturalContext",
        "toTasks": "culturalContextToTasks",
        "className": "CulturalContextTranslator",
        "collectionField": "exchanges",
        "idField": "exchangeId"
    },
    {
        "number": 105,
        "capabilityId": "accessibility_personalization_engine",
        "evaluate": "personalizeAccessibilitySupport",
        "toTasks": "accessibilityPersonalizationToTasks",
        "className": "AccessibilityPersonalizationEngine",
        "collectionField": "profiles",
        "idField": "profileId"
    },
    {
        "number": 106,
        "capabilityId": "mental_health_safety_companion",
        "evaluate": "evaluateMentalHealthSafety",
        "toTasks": "mentalHealthSafetyToTasks",
        "className": "MentalHealthSafetyCompanion",
        "collectionField": "interactions",
        "idField": "interactionId"
    },
    {
        "number": 107,
        "capabilityId": "emotional_harm_detection_guard",
        "evaluate": "detectEmotionalHarmRisk",
        "toTasks": "emotionalHarmGuardToTasks",
        "className": "EmotionalHarmDetectionGuard",
        "collectionField": "conversations",
        "idField": "conversationId"
    },
    {
        "number": 108,
        "capabilityId": "child_safety_protection_layer",
        "evaluate": "enforceChildSafetyProtection",
        "toTasks": "childSafetyProtectionToTasks",
        "className": "ChildSafetyProtectionLayer",
        "collectionField": "sessions",
        "idField": "sessionId"
    },
    {
        "number": 109,
        "capabilityId": "fraud_scam_prevention_shield",
        "evaluate": "preventFraudAndScams",
        "toTasks": "fraudScamPreventionToTasks",
        "className": "FraudScamPreventionShield",
        "collectionField": "transactions",
        "idField": "transactionId"
    },
    {
        "number": 110,
        "capabilityId": "digital_rights_compliance_monitor",
        "evaluate": "monitorDigitalRightsCompliance",
        "toTasks": "digitalRightsComplianceToTasks",
        "className": "DigitalRightsComplianceMonitor",
        "collectionField": "cases",
        "idField": "caseId"
    },
    {
        "number": 111,
        "capabilityId": "public_transparency_portal_generator",
        "evaluate": "generatePublicTransparencyPortal",
        "toTasks": "publicTransparencyPortalToTasks",
        "className": "PublicTransparencyPortalGenerator",
        "collectionField": "records",
        "idField": "recordId"
    },
    {
        "number": 112,
        "capabilityId": "trustworthy_reporting_publisher",
        "evaluate": "publishTrustworthyReporting",
        "toTasks": "trustworthyReportingToTasks",
        "className": "TrustworthyReportingPublisher",
        "collectionField": "reports",
        "idField": "reportId"
    },
    {
        "number": 113,
        "capabilityId": "learning_curriculum_generator",
        "evaluate": "generateLearningCurriculum",
        "toTasks": "learningCurriculumToTasks",
        "className": "LearningCurriculumGenerator",
        "collectionField": "learners",
        "idField": "learnerId"
    },
    {
        "number": 114,
        "capabilityId": "skill_gap_diagnostic_engine",
        "evaluate": "diagnoseSkillGaps",
        "toTasks": "skillGapDiagnosticToTasks",
        "className": "SkillGapDiagnosticEngine",
        "collectionField": "participants",
        "idField": "participantId"
    },
    {
        "number": 115,
        "capabilityId": "human_ai_pair_programming_coach",
        "evaluate": "coachHumanAiPairProgramming",
        "toTasks": "pairProgrammingCoachToTasks",
        "className": "HumanAiPairProgrammingCoach",
        "collectionField": "pairings",
        "idField": "pairingId"
    },
    {
        "number": 116,
        "capabilityId": "scientific_literature_synthesizer",
        "evaluate": "synthesizeScientificLiterature",
        "toTasks": "scientificLiteratureToTasks",
        "className": "ScientificLiteratureSynthesizer",
        "collectionField": "papers",
        "idField": "paperId"
    },
    {
        "number": 117,
        "capabilityId": "knowledge_gap_explorer",
        "evaluate": "exploreKnowledgeGaps",
        "toTasks": "knowledgeGapExplorerToTasks",
        "className": "KnowledgeGapExplorer",
        "collectionField": "domains",
        "idField": "domainId"
    },
    {
        "number": 118,
        "capabilityId": "autonomous_research_program_manager",
        "evaluate": "manageAutonomousResearchPrograms",
        "toTasks": "autonomousResearchProgramToTasks",
        "className": "AutonomousResearchProgramManager",
        "collectionField": "programs",
        "idField": "programId"
    },
    {
        "number": 119,
        "capabilityId": "hypothesis_prioritization_exchange",
        "evaluate": "prioritizeHypotheses",
        "toTasks": "hypothesisPrioritizationToTasks",
        "className": "HypothesisPrioritizationExchange",
        "collectionField": "hypotheses",
        "idField": "hypothesisId"
    },
    {
        "number": 120,
        "capabilityId": "breakthrough_opportunity_radar",
        "evaluate": "detectBreakthroughOpportunities",
        "toTasks": "breakthroughOpportunityToTasks",
        "className": "BreakthroughOpportunityRadar",
        "collectionField": "opportunities",
        "idField": "opportunityId"
    },
    {
        "number": 121,
        "capabilityId": "strategic_scenario_war_gamer",
        "evaluate": "wargameStrategicScenarios",
        "toTasks": "strategicScenarioToTasks",
        "className": "StrategicScenarioWarGamer",
        "collectionField": "scenarios",
        "idField": "scenarioId"
    },
    {
        "number": 122,
        "capabilityId": "policy_intervention_optimizer",
        "evaluate": "optimizePolicyInterventions",
        "toTasks": "policyInterventionToTasks",
        "className": "PolicyInterventionOptimizer",
        "collectionField": "policyBundles",
        "idField": "bundleId"
    },
    {
        "number": 123,
        "capabilityId": "global_risk_observatory",
        "evaluate": "observeGlobalRisks",
        "toTasks": "globalRiskObservatoryToTasks",
        "className": "GlobalRiskObservatory",
        "collectionField": "riskSignals",
        "idField": "signalId"
    },
    {
        "number": 124,
        "capabilityId": "humanitarian_logistics_coordinator",
        "evaluate": "coordinateHumanitarianLogistics",
        "toTasks": "humanitarianLogisticsToTasks",
        "className": "HumanitarianLogisticsCoordinator",
        "collectionField": "corridors",
        "idField": "corridorId"
    },
    {
        "number": 125,
        "capabilityId": "emergency_resource_dispatcher",
        "evaluate": "dispatchEmergencyResources",
        "toTasks": "emergencyResourceDispatcherToTasks",
        "className": "EmergencyResourceDispatcher",
        "collectionField": "incidents",
        "idField": "incidentId"
    },
    {
        "number": 126,
        "capabilityId": "community_impact_measurement_studio",
        "evaluate": "measureCommunityImpact",
        "toTasks": "communityImpactMeasurementToTasks",
        "className": "CommunityImpactMeasurementStudio",
        "collectionField": "projects",
        "idField": "projectId"
    },
    {
        "number": 127,
        "capabilityId": "social_benefit_kpi_dashboard",
        "evaluate": "buildSocialBenefitKpiDashboard",
        "toTasks": "socialBenefitKpiDashboardToTasks",
        "className": "SocialBenefitKpiDashboard",
        "collectionField": "kpis",
        "idField": "kpiId"
    },
    {
        "number": 128,
        "capabilityId": "philanthropic_program_optimizer",
        "evaluate": "optimizePhilanthropicPrograms",
        "toTasks": "philanthropicProgramToTasks",
        "className": "PhilanthropicProgramOptimizer",
        "collectionField": "portfolios",
        "idField": "portfolioId"
    },
    {
        "number": 129,
        "capabilityId": "inclusive_governance_co_designer",
        "evaluate": "designInclusiveGovernance",
        "toTasks": "inclusiveGovernanceToTasks",
        "className": "InclusiveGovernanceCoDesigner",
        "collectionField": "councils",
        "idField": "councilId"
    },
    {
        "number": 130,
        "capabilityId": "collective_intelligence_commons",
        "evaluate": "operateCollectiveIntelligenceCommons",
        "toTasks": "collectiveIntelligenceCommonsToTasks",
        "className": "CollectiveIntelligenceCommons",
        "collectionField": "artifacts",
        "idField": "artifactId"
    },
    {
        "number": 131,
        "capabilityId": "humanity_mission_operating_system",
        "evaluate": "runHumanityMissionOperatingSystem",
        "toTasks": "humanityMissionOperatingSystemToTasks",
        "className": "HumanityMissionOperatingSystem",
        "collectionField": "missions",
        "idField": "missionId"
    }
];

function buildEntity(idField, id, overrides = {}) {
    return {
        [idField]: id,
        name: 'Entity ' + id,
        demand: 78,
        capacity: 40,
        risk: 72,
        impact: 86,
        readiness: 44,
        resilience: 38,
        equity: 57,
        efficiency: 51,
        quality: 58,
        trust: 52,
        opportunity: 76,
        criticality: 88,
        ...overrides
    };
}

for (const [index, capability] of capabilities.entries()) {
    test(capability.number + ' ' + capability.capabilityId + ' generates capability report', () => {
        const evaluate = swarm[capability.evaluate];
        assert.equal(typeof evaluate, 'function');

        const payload = {
            [capability.collectionField]: [
                buildEntity(capability.idField, capability.number + '-a'),
                buildEntity(capability.idField, capability.number + '-b', {
                    demand: 42,
                    capacity: 84,
                    risk: 28,
                    readiness: 78,
                    resilience: 82,
                    trust: 80,
                    quality: 76,
                    efficiency: 74,
                    criticality: 54
                })
            ],
            capacity: {
                executionSlots: 1,
                analysisHours: 16,
                reviewHours: 6
            }
        };

        const report = evaluate(payload, {
            now: () => 1700000 + index
        });

        assert.equal(typeof report.at, 'number');
        assert.equal(report.summary.entityCount, 2);
        assert.equal(report.assessments.length, 2);
        assert.equal(
            report.summary.laneCounts.now + report.summary.laneCounts.next + report.summary.laneCounts.hold,
            2
        );
        assert.equal(Array.isArray(report.alerts), true);
        assert.equal(Array.isArray(report.recommendations), true);
        assert.equal(report.recommendations.length > 0, true);
    });

    test(capability.number + ' ' + capability.capabilityId + ' tasks and manager wrappers emit task requests', () => {
        const evaluate = swarm[capability.evaluate];
        const toTasks = swarm[capability.toTasks];
        const ManagerClass = swarm[capability.className];

        assert.equal(typeof toTasks, 'function');
        assert.equal(typeof ManagerClass, 'function');

        const payload = {
            [capability.collectionField]: [
                buildEntity(capability.idField, capability.number + '-x'),
                buildEntity(capability.idField, capability.number + '-y', {
                    demand: 46,
                    capacity: 86,
                    risk: 24,
                    readiness: 82,
                    resilience: 85,
                    trust: 84,
                    quality: 80,
                    efficiency: 78,
                    criticality: 48
                })
            ],
            capacity: {
                executionSlots: 2,
                analysisHours: 40,
                reviewHours: 18
            }
        };

        const report = evaluate(payload, {
            now: () => 1710000 + index
        });
        const tasks = toTasks(report, {
            fromAgentId: 'agent:test-runner'
        });

        assert.equal(tasks.length > 0, true);
        assert.equal(tasks[0].kind, 'task_request');
        assert.equal(tasks[0].from, 'agent:test-runner');

        const manager = new ManagerClass({
            localAgentId: 'agent:manager-local',
            now: () => 1720000 + index
        });
        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
