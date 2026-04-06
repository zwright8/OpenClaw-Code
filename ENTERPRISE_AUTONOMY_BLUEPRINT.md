# Enterprise Autonomy Blueprint

## 1. Mission

Turn OpenClaw into the operating system for a fully autonomous, API-native enterprise.

Reference deployment procedure:

- [ENTERPRISE_LAUNCH_RUNBOOK.md](./ENTERPRISE_LAUNCH_RUNBOOK.md)
- [AUTONOMOUS_BUSINESS_OPERATING_MODEL.md](./AUTONOMOUS_BUSINESS_OPERATING_MODEL.md)

This enterprise should be:

- digital-first
- SaaS or data-product oriented
- built around repeatable business loops
- safe enough to run unattended because governance is encoded into the runtime

The enterprise is not a generic chatbot company. It is an autonomous software business with a digital twin, deterministic workflows, policy gates, and measurable P&L accountability.

## 2. What The Enterprise Is

### 2.1 Business Type

Target a company that sells:

- subscriptions
- usage-based software
- APIs
- digital services with structured delivery

Avoid business models that depend on warehouses, trucks, retail staffing, or field operations in phase one.

### 2.2 Core Business Loops

The company should automate these loops first:

1. `lead_to_cash`
2. `issue_to_resolution`
3. `idea_to_launch`
4. `invoice_to_collection`
5. `hire_to_productivity`
6. `incident_to_recovery`

If these six loops work, the company can actually operate end-to-end.

## 3. Architecture Planes

### 3.1 Strategy Plane

Purpose:

- set goals
- allocate budget
- choose which missions run now vs next vs hold
- approve irreversible decisions

Primary agents:

- `agent:executive`

Primary OpenClaw primitives:

- mission planner
- mission readiness gate
- mission portfolio manager
- mission forecast lab
- autonomous approval engine

### 3.2 World Model Plane

Purpose:

- maintain a live enterprise graph
- model customers, contracts, support pressure, churn risk, competitors, and market conditions
- simulate strategic decisions before execution

Primary agents:

- `agent:world-sim`

Primary systems:

- graph memory
- warehouse
- simulation engine

Reference implementation path:

- [MIROFISH_INTEGRATION_PLAN.md](./MIROFISH_INTEGRATION_PLAN.md)

### 3.3 Execution Plane

Purpose:

- run repeatable workflows with deterministic state transitions
- checkpoint all side effects
- support retry, resume, rollback, and audit

Primary substrate:

- `swarm-protocol` task contracts
- workflow DAG engine
- durable task store
- audit log

### 3.4 Functional Swarm Plane

Purpose:

- operate each business department as a bounded specialist swarm

Primary departments:

- revenue
- finance
- legal
- customer success
- product
- engineering
- security
- people ops

### 3.5 Control Plane

Purpose:

- stop the enterprise from doing dangerous things quickly and at scale

Controls:

- approval routing
- treasury controls
- contract authority rules
- policy checks
- security gates
- signed audit logs
- kill switches

### 3.6 Learning Plane

Purpose:

- observe outcomes
- identify drift
- generate improvements
- retire weak workflows
- promote better workflows

Primary subsystem:

- `cognition-core`

## 4. Tools And Services Needed

These are the core service categories required for full autonomy.

### 4.1 System Of Record Layer

- CRM
  - Suggested services: `HubSpot`, `Salesforce`
- Billing and subscriptions
  - Suggested services: `Stripe Billing`
- Support
  - Suggested services: `Zendesk`, `Intercom`
- Contracts and signatures
  - Suggested services: `DocuSign`, `Ironclad`
- Finance and treasury
  - Suggested services: `Ramp`, `Mercury`, `NetSuite`
- HRIS and payroll
  - Suggested services: `Gusto`, `Rippling`, `Workday`

### 4.2 Data + Memory Layer

- transactional store
  - Suggested services: `Postgres`, `Supabase`
- analytics warehouse
  - Suggested services: `BigQuery`, `Snowflake`
- graph + retrieval
  - Suggested services: `Neo4j`, `Zep`
- enterprise knowledge base
  - Suggested services: `Notion`

### 4.3 Runtime + Automation Layer

- agent runtime
  - Suggested services: `OpenAI Responses API`
- workflow orchestration
  - Suggested services: `Temporal`
- eventing and queues
  - Suggested services: `Cloudflare Queues`, `Amazon EventBridge`
- integration plane
  - Suggested services: `Nango`, `Airbyte`, `Workato`

### 4.4 Engineering + Reliability Layer

- source control and CI/CD
  - Suggested services: `GitHub`
- observability and incidents
  - Suggested services: `OpenTelemetry`, `Sentry`
- identity and access
  - Suggested services: `WorkOS`, `Okta`
- secrets
  - Suggested services: `Vault`

### 4.5 Communications Layer

- internal coordination
  - Suggested services: `Slack`
- external notifications
  - Suggested services: `SendGrid`, `Twilio`

### 4.6 Compliance Layer

- evidence automation
  - Suggested services: `Drata`, `Vanta`

## 5. Service Boundaries

### 5.1 `cognition-core`

Owns:

- learning loops
- drift detection
- mission generation
- remediation planning

Must not:

- talk directly to SaaS providers
- bypass runtime task contracts

### 5.2 `swarm-protocol/runtime`

Owns:

- task contracts
- workflow contracts
- approvals
- audit
- routing
- memory contracts

Must not:

- hardcode provider-specific enterprise logic

### 5.3 `agent:world-sim`

Owns:

- enterprise digital twin
- scenario simulation
- market and stakeholder rehearsal

Must not:

- directly mutate finance or contract systems
- act as executive decision-maker

### 5.4 Department Agents

Each department agent owns exactly its bounded systems and contracts.

- `agent:revenue-ops`
  - CRM, quoting, commercial workflow
- `agent:contracts`
  - contract review, signature routing
- `agent:finance`
  - billing, treasury, collections
- `agent:customer-success`
  - onboarding, support, retention
- `agent:product`
  - roadmap and experiments
- `agent:engineering`
  - build, deploy, observe
- `agent:security`
  - identity, policy, containment
- `agent:people-ops`
  - recruiting, onboarding, workforce ops

## 6. Agent Roster

The starter operating model is implemented in:

- [enterprise-autonomy.ts](./swarm-protocol/src/enterprise-autonomy.ts)

That module defines:

- enterprise domains
- system categories
- approval tiers
- loop ids
- recommended systems
- core agent roles

## 7. Task Contract Strategy

We need two contract classes:

### 7.1 Mission Contracts

Used by the executive and planning layers.

Examples:

- `mission_brief`
- `budget_allocation`
- `portfolio_plan`
- `world_sim_task`

### 7.2 Business Loop Launch Contracts

Used to start a deterministic workflow in a department swarm.

The first one implemented here is:

- `enterprise_loop_launch`
- loop id: `lead_to_cash`

This contract is wrapped in a normal `task_request` and contains:

- the loop input
- the generated workflow definition
- who requested it
- when it was requested

## 8. First Workflow: Lead To Cash

The first end-to-end workflow is:

- research account
- qualify opportunity
- generate quote
- review security posture if required
- review contract
- collect signature
- provision billing
- launch onboarding
- confirm activation

The starter workflow builder is implemented in:

- [enterprise-autonomy.ts](./swarm-protocol/src/enterprise-autonomy.ts)

Functions:

- `buildLeadToCashWorkflowDefinition(...)`
- `buildLeadToCashLaunchTaskRequest(...)`

## 9. Operating Sequence

For a major commercial workflow, the enterprise should behave like this:

1. Revenue signal arrives in CRM.
2. `agent:world-sim` models account context, buying pressure, and risk.
3. Strategy plane decides whether the opportunity fits current portfolio priorities.
4. Revenue workflow is launched through a deterministic `lead_to_cash` contract.
5. Legal, security, finance, and customer success complete bounded steps.
6. Outcomes are written back into CRM, billing, knowledge base, and analytics.
7. `cognition-core` learns from conversion, cycle time, churn risk, and support load.

## 10. Definition Of Done

The enterprise architecture is minimally credible when:

- business loops are modeled as workflow definitions, not prompts alone
- every mutating action goes through a task contract
- every critical system has a bounded owner agent
- simulation precedes major strategy changes
- approvals and treasury controls are enforced automatically
- business outcomes feed back into learning and replanning

## 11. Immediate Next Build Steps

1. Add a `customer_issue_to_resolution` workflow contract.
2. Add a `product_idea_to_launch` workflow contract.
3. Implement a thin `agent:revenue-ops` worker that can execute `lead_to_cash` launch tasks against real provider adapters.
4. Implement the `agent:world-sim` adapter described in [MIROFISH_INTEGRATION_PLAN.md](./MIROFISH_INTEGRATION_PLAN.md).
5. Add finance policy gates for invoice, refund, and spend actions before full unattended execution.
