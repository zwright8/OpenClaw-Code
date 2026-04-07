import { randomUUID } from 'crypto';
import { z } from 'zod';
import { AgentId, TaskPriority, TaskRequest, Timestamp } from './schemas.js';
import { buildTaskRequest } from './task-orchestrator.js';
import { validateWorkflowDefinition } from './workflow-engine.js';

export const EnterpriseDomain = z.enum([
    'executive',
    'world_model',
    'revenue',
    'product',
    'engineering',
    'customer_success',
    'finance',
    'legal',
    'people',
    'security',
    'operations'
]);

export const EnterpriseSystemCategory = z.enum([
    'crm',
    'billing',
    'support',
    'contracts',
    'finance',
    'hris',
    'identity',
    'analytics',
    'knowledge',
    'source_control',
    'observability',
    'communications',
    'simulation'
]);

export const EnterpriseCriticality = z.enum([
    'standard',
    'important',
    'critical'
]);

export const EnterpriseApprovalTier = z.enum([
    'self_execute',
    'policy_gated',
    'dual_control'
]);

export const EnterpriseLoopId = z.enum([
    'lead_to_cash',
    'issue_to_resolution',
    'idea_to_launch',
    'invoice_to_collection',
    'hire_to_productivity',
    'incident_to_recovery'
]);

export const EnterpriseSystemSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    category: EnterpriseSystemCategory,
    ownerDomain: EnterpriseDomain,
    purpose: z.string().min(1),
    sourceOfTruth: z.boolean().default(false),
    criticality: EnterpriseCriticality.default('important'),
    recommendedServices: z.array(z.string().min(1)).min(1)
});

export const EnterpriseAgentRoleSchema = z.object({
    agentId: AgentId,
    domain: EnterpriseDomain,
    objective: z.string().min(1),
    ownedSystems: z.array(z.string().min(1)).default([]),
    inboundContracts: z.array(z.string().min(1)).default([]),
    outboundContracts: z.array(z.string().min(1)).default([]),
    approvalTier: EnterpriseApprovalTier.default('policy_gated')
});

export const AutonomousEnterpriseOperatingModelSchema = z.object({
    companyName: z.string().min(1),
    productName: z.string().min(1),
    marketCategory: z.string().min(1),
    systems: z.array(EnterpriseSystemSchema).min(1),
    agents: z.array(EnterpriseAgentRoleSchema).min(1),
    loops: z.array(EnterpriseLoopId).min(1)
});

export function buildAutonomousEnterpriseOperatingModel({
    companyName,
    productName,
    marketCategory = 'api-native b2b software'
}) {
    return AutonomousEnterpriseOperatingModelSchema.parse({
        companyName,
        productName,
        marketCategory,
        systems: [
            {
                id: 'system:crm',
                name: 'CRM',
                category: 'crm',
                ownerDomain: 'revenue',
                purpose: 'System of record for accounts, contacts, pipeline, and renewal posture.',
                sourceOfTruth: true,
                criticality: 'critical',
                recommendedServices: ['HubSpot', 'Salesforce']
            },
            {
                id: 'system:billing',
                name: 'Billing',
                category: 'billing',
                ownerDomain: 'finance',
                purpose: 'Subscription billing, invoicing, collections, and usage metering.',
                sourceOfTruth: true,
                criticality: 'critical',
                recommendedServices: ['Stripe Billing']
            },
            {
                id: 'system:support',
                name: 'Support',
                category: 'support',
                ownerDomain: 'customer_success',
                purpose: 'Customer support queue, SLAs, issue triage, and retention signals.',
                sourceOfTruth: true,
                criticality: 'important',
                recommendedServices: ['Zendesk', 'Intercom']
            },
            {
                id: 'system:contracts',
                name: 'Contracts',
                category: 'contracts',
                ownerDomain: 'legal',
                purpose: 'Quote, MSA, order form, approval trail, and signature flow.',
                sourceOfTruth: true,
                criticality: 'critical',
                recommendedServices: ['DocuSign', 'Ironclad']
            },
            {
                id: 'system:finance',
                name: 'Finance',
                category: 'finance',
                ownerDomain: 'finance',
                purpose: 'Cash, spend controls, vendor payments, close, and forecasting.',
                sourceOfTruth: true,
                criticality: 'critical',
                recommendedServices: ['Ramp', 'Mercury', 'NetSuite']
            },
            {
                id: 'system:analytics',
                name: 'Analytics',
                category: 'analytics',
                ownerDomain: 'operations',
                purpose: 'Warehouse for business metrics, telemetry, and enterprise reporting.',
                sourceOfTruth: true,
                criticality: 'critical',
                recommendedServices: ['BigQuery', 'Snowflake', 'dbt']
            },
            {
                id: 'system:knowledge',
                name: 'Knowledge Base',
                category: 'knowledge',
                ownerDomain: 'operations',
                purpose: 'Operating handbook, SOPs, policies, and decision memory.',
                sourceOfTruth: true,
                criticality: 'important',
                recommendedServices: ['Notion']
            },
            {
                id: 'system:source-control',
                name: 'Source Control',
                category: 'source_control',
                ownerDomain: 'engineering',
                purpose: 'Code, CI/CD, release automation, and deployment evidence.',
                sourceOfTruth: true,
                criticality: 'critical',
                recommendedServices: ['GitHub']
            },
            {
                id: 'system:observability',
                name: 'Observability',
                category: 'observability',
                ownerDomain: 'engineering',
                purpose: 'Application incidents, traces, logs, and uptime alerts.',
                sourceOfTruth: true,
                criticality: 'critical',
                recommendedServices: ['OpenTelemetry', 'Sentry']
            },
            {
                id: 'system:identity',
                name: 'Identity',
                category: 'identity',
                ownerDomain: 'security',
                purpose: 'Identity lifecycle, SSO, directory sync, and access governance.',
                sourceOfTruth: true,
                criticality: 'critical',
                recommendedServices: ['WorkOS', 'Okta']
            },
            {
                id: 'system:communications',
                name: 'Communications',
                category: 'communications',
                ownerDomain: 'operations',
                purpose: 'Internal coordination, customer notifications, and workflow events.',
                sourceOfTruth: false,
                criticality: 'important',
                recommendedServices: ['Slack', 'SendGrid']
            },
            {
                id: 'system:simulation',
                name: 'Simulation Lab',
                category: 'simulation',
                ownerDomain: 'world_model',
                purpose: 'Digital twin, scenario rehearsal, and stakeholder reaction modeling.',
                sourceOfTruth: false,
                criticality: 'important',
                recommendedServices: ['MiroFish', 'Zep', 'Neo4j']
            }
        ],
        agents: [
            {
                agentId: 'agent:executive',
                domain: 'executive',
                objective: 'Set goals, allocate capital, approve mission priorities, and rebalance the portfolio.',
                ownedSystems: ['system:analytics', 'system:knowledge'],
                inboundContracts: ['enterprise_scorecard', 'world_sim_report', 'portfolio_plan'],
                outboundContracts: ['mission_brief', 'budget_allocation'],
                approvalTier: 'dual_control'
            },
            {
                agentId: 'agent:world-sim',
                domain: 'world_model',
                objective: 'Build the enterprise digital twin and simulate major strategic decisions before execution.',
                ownedSystems: ['system:simulation', 'system:analytics'],
                inboundContracts: ['world_sim_task'],
                outboundContracts: ['world_sim_report', 'scenario_recommendation'],
                approvalTier: 'policy_gated'
            },
            {
                agentId: 'agent:revenue-ops',
                domain: 'revenue',
                objective: 'Run pipeline, pricing workflows, quoting, renewals, and sales process automation.',
                ownedSystems: ['system:crm', 'system:communications'],
                inboundContracts: ['mission_brief', 'lead_to_cash_launch'],
                outboundContracts: ['quote_packet', 'deal_status_update'],
                approvalTier: 'policy_gated'
            },
            {
                agentId: 'agent:contracts',
                domain: 'legal',
                objective: 'Review contract posture, route clauses, and manage signature workflows.',
                ownedSystems: ['system:contracts', 'system:knowledge'],
                inboundContracts: ['quote_packet'],
                outboundContracts: ['contract_review_packet', 'signature_ready_notice'],
                approvalTier: 'dual_control'
            },
            {
                agentId: 'agent:finance',
                domain: 'finance',
                objective: 'Control billing, collections, spend, treasury, and revenue recognition workflows.',
                ownedSystems: ['system:billing', 'system:finance', 'system:analytics'],
                inboundContracts: ['budget_allocation', 'signature_ready_notice'],
                outboundContracts: ['invoice_packet', 'cash_status_update'],
                approvalTier: 'dual_control'
            },
            {
                agentId: 'agent:customer-success',
                domain: 'customer_success',
                objective: 'Run onboarding, support, health scoring, and retention interventions.',
                ownedSystems: ['system:support', 'system:crm', 'system:communications'],
                inboundContracts: ['invoice_packet', 'deal_status_update'],
                outboundContracts: ['activation_notice', 'customer_health_update'],
                approvalTier: 'policy_gated'
            },
            {
                agentId: 'agent:product',
                domain: 'product',
                objective: 'Translate market and customer signals into roadmap, packaging, and experiment decisions.',
                ownedSystems: ['system:analytics', 'system:knowledge'],
                inboundContracts: ['world_sim_report', 'customer_health_update'],
                outboundContracts: ['product_brief', 'experiment_plan'],
                approvalTier: 'policy_gated'
            },
            {
                agentId: 'agent:engineering',
                domain: 'engineering',
                objective: 'Build, test, ship, observe, and remediate product changes.',
                ownedSystems: ['system:source-control', 'system:observability'],
                inboundContracts: ['product_brief', 'incident_recovery_plan'],
                outboundContracts: ['release_report', 'incident_status_update'],
                approvalTier: 'policy_gated'
            },
            {
                agentId: 'agent:security',
                domain: 'security',
                objective: 'Enforce access controls, secrets handling, audit posture, and incident containment.',
                ownedSystems: ['system:identity', 'system:observability', 'system:knowledge'],
                inboundContracts: ['contract_review_packet', 'incident_status_update'],
                outboundContracts: ['security_clearance', 'containment_order'],
                approvalTier: 'dual_control'
            },
            {
                agentId: 'agent:people-ops',
                domain: 'people',
                objective: 'Automate recruiting, onboarding, payroll coordination, and workforce operations.',
                ownedSystems: ['system:identity', 'system:knowledge'],
                inboundContracts: ['budget_allocation'],
                outboundContracts: ['headcount_plan', 'onboarding_packet'],
                approvalTier: 'dual_control'
            }
        ],
        loops: [
            'lead_to_cash',
            'issue_to_resolution',
            'idea_to_launch',
            'invoice_to_collection',
            'hire_to_productivity',
            'incident_to_recovery'
        ]
    });
}

export const LeadToCashWorkflowInputSchema = z.object({
    accountId: z.string().min(1),
    accountName: z.string().min(1),
    opportunityId: z.string().min(1),
    productSku: z.string().min(1),
    offerSummary: z.string().min(1),
    primaryContactEmail: z.string().email(),
    priceUsd: z.number().positive(),
    termMonths: z.number().int().positive().default(12),
    billingInterval: z.enum(['monthly', 'quarterly', 'annual']).default('annual'),
    requiresSecurityReview: z.boolean().default(true),
    requestedBy: AgentId.default('agent:executive')
});

export const LeadToCashLaunchTaskContextSchema = z.object({
    contract: z.literal('enterprise_loop_launch'),
    contractVersion: z.literal(1),
    loopId: z.literal('lead_to_cash'),
    requestedBy: AgentId,
    requestedAt: Timestamp,
    workflowId: z.string().min(1),
    input: LeadToCashWorkflowInputSchema,
    workflow: z.record(z.any())
});

export const LeadToCashLaunchTaskSpecSchema = z.object({
    from: AgentId,
    target: AgentId.default('agent:revenue-ops'),
    priority: TaskPriority.default('high'),
    task: z.string().min(1).optional(),
    constraints: z.array(z.string().min(1)).default([]),
    input: LeadToCashWorkflowInputSchema,
    id: z.string().uuid().optional(),
    createdAt: Timestamp.optional()
});

function buildWorkflowId(prefix) {
    return `${prefix}-${randomUUID().slice(0, 8)}`;
}

export function buildLeadToCashWorkflowDefinition(inputPayload) {
    const input = LeadToCashWorkflowInputSchema.parse(inputPayload);
    const workflowId = buildWorkflowId('lead-to-cash');
    const nodes = [
        {
            id: 'research_account',
            task: `Research account ${input.accountName} and confirm buying signals`,
            target: 'agent:world-sim',
            priority: 'normal',
            context: {
                accountId: input.accountId,
                opportunityId: input.opportunityId,
                accountName: input.accountName,
                objective: 'Assess account context, stakeholder pressure, and competitive dynamics.'
            },
            requiredCapabilities: ['enterprise_research', 'world_simulation']
        },
        {
            id: 'qualify_opportunity',
            task: `Qualify opportunity ${input.opportunityId} for ${input.accountName}`,
            target: 'agent:revenue-ops',
            priority: 'high',
            dependencies: ['research_account'],
            context: {
                accountId: input.accountId,
                opportunityId: input.opportunityId,
                offerSummary: input.offerSummary,
                priceUsd: input.priceUsd,
                termMonths: input.termMonths
            },
            requiredCapabilities: ['crm_operation', 'pricing_workflow']
        },
        {
            id: 'generate_quote',
            task: `Generate quote and order form for ${input.accountName}`,
            target: 'agent:revenue-ops',
            priority: 'high',
            dependencies: ['qualify_opportunity'],
            context: {
                accountId: input.accountId,
                opportunityId: input.opportunityId,
                productSku: input.productSku,
                priceUsd: input.priceUsd,
                billingInterval: input.billingInterval,
                termMonths: input.termMonths
            },
            requiredCapabilities: ['quote_generation', 'crm_operation']
        }
    ];

    if (input.requiresSecurityReview) {
        nodes.push({
            id: 'security_review',
            task: `Review security posture for ${input.accountName}`,
            target: 'agent:security',
            priority: 'high',
            dependencies: ['generate_quote'],
            context: {
                accountId: input.accountId,
                opportunityId: input.opportunityId,
                productSku: input.productSku
            },
            requiredCapabilities: ['security_review', 'compliance_routing']
        });
    }

    nodes.push(
        {
            id: 'review_contract',
            task: `Review contract package for ${input.accountName}`,
            target: 'agent:contracts',
            priority: 'high',
            dependencies: input.requiresSecurityReview ? ['generate_quote', 'security_review'] : ['generate_quote'],
            context: {
                accountId: input.accountId,
                opportunityId: input.opportunityId,
                primaryContactEmail: input.primaryContactEmail,
                offerSummary: input.offerSummary
            },
            requiredCapabilities: ['contract_review', 'signature_routing']
        },
        {
            id: 'collect_signature',
            task: `Collect signed agreement from ${input.primaryContactEmail}`,
            target: 'agent:contracts',
            priority: 'high',
            dependencies: ['review_contract'],
            context: {
                accountId: input.accountId,
                primaryContactEmail: input.primaryContactEmail
            },
            requiredCapabilities: ['signature_collection']
        },
        {
            id: 'provision_billing',
            task: `Provision billing and invoice setup for ${input.accountName}`,
            target: 'agent:finance',
            priority: 'high',
            dependencies: ['collect_signature'],
            context: {
                accountId: input.accountId,
                productSku: input.productSku,
                priceUsd: input.priceUsd,
                billingInterval: input.billingInterval
            },
            requiredCapabilities: ['billing_provisioning', 'invoice_generation']
        },
        {
            id: 'launch_onboarding',
            task: `Launch onboarding for ${input.accountName}`,
            target: 'agent:customer-success',
            priority: 'normal',
            dependencies: ['collect_signature', 'provision_billing'],
            context: {
                accountId: input.accountId,
                accountName: input.accountName,
                productSku: input.productSku,
                primaryContactEmail: input.primaryContactEmail
            },
            requiredCapabilities: ['customer_onboarding', 'customer_health_setup']
        },
        {
            id: 'confirm_activation',
            task: `Confirm activation and executive handoff for ${input.accountName}`,
            target: 'agent:executive',
            priority: 'normal',
            dependencies: ['launch_onboarding'],
            context: {
                accountId: input.accountId,
                opportunityId: input.opportunityId,
                accountName: input.accountName
            },
            requiredCapabilities: ['portfolio_reporting']
        }
    );

    return validateWorkflowDefinition({
        id: workflowId,
        nodes
    });
}

export function buildLeadToCashLaunchTaskRequest(taskSpec) {
    const parsed = LeadToCashLaunchTaskSpecSchema.parse(taskSpec);
    const createdAt = parsed.createdAt ?? Date.now();
    const workflow = buildLeadToCashWorkflowDefinition(parsed.input);
    const task = parsed.task
        ?? `Launch lead-to-cash workflow for ${parsed.input.accountName}`;

    return buildTaskRequest({
        id: parsed.id ?? randomUUID(),
        from: parsed.from,
        target: parsed.target,
        priority: parsed.priority,
        task,
        constraints: parsed.constraints,
        createdAt,
        context: LeadToCashLaunchTaskContextSchema.parse({
            contract: 'enterprise_loop_launch',
            contractVersion: 1,
            loopId: 'lead_to_cash',
            requestedBy: parsed.input.requestedBy,
            requestedAt: createdAt,
            workflowId: workflow.id,
            input: parsed.input,
            workflow
        })
    });
}

export function parseLeadToCashLaunchTaskRequest(taskRequestPayload) {
    const taskRequest = TaskRequest.parse(taskRequestPayload);
    return {
        ...taskRequest,
        context: LeadToCashLaunchTaskContextSchema.parse(taskRequest.context)
    };
}
