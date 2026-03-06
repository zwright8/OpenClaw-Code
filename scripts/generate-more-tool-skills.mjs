#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const EXTRA_COUNT = 12000;
const START_ID = 1001;

const domains = [
  'Government Records', 'Court Dockets', 'Patent Filings', 'Compliance Registries', 'Procurement Portals',
  'Healthcare EHR', 'Clinical Trial Systems', 'Lab Information Systems', 'Pharmacy Ops', 'Insurance Claims',
  'Education LMS', 'Admissions Systems', 'Student Success Platforms', 'Research Repositories', 'Library Networks',
  'Logistics Dispatch', 'Fleet Telematics', 'Warehouse Robotics', 'Customs Processing', 'Freight Brokerage',
  'Manufacturing MES', 'SCADA Monitoring', 'Digital Twins', 'Supply Chain Control Tower', 'Quality Management',
  'Energy Grid Ops', 'Utility Billing', 'Carbon Accounting', 'ESG Reporting', 'Environmental Sensors',
  'Real Estate MLS', 'Property Management', 'Construction PM', 'BIM Coordination', 'Facility Maintenance',
  'Hospitality PMS', 'Airline Operations', 'Rail Scheduling', 'Maritime Routing', 'Travel Compliance',
  'Bank Core Systems', 'Treasury Management', 'Risk Engines', 'AML Monitoring', 'Fraud Operations',
  'Accounting Ledgers', 'Tax Workflows', 'Payroll Systems', 'Expense Management', 'Procure to Pay',
  'CRM Intelligence', 'CPQ Platforms', 'RevOps Systems', 'Partner Portals', 'Customer Data Platforms',
  'Marketing Attribution', 'Ad Platforms', 'SEO Tooling', 'Social Listening', 'Campaign Automation',
  'Support Ticketing', 'Call Center Ops', 'Knowledge Bases', 'Incident Queues', 'Customer QA',
  'Identity Providers', 'Access Governance', 'Secrets Vaults', 'Certificate Management', 'Endpoint Security',
  'SIEM Pipelines', 'SOAR Platforms', 'Threat Intel Feeds', 'Vulnerability Managers', 'Policy Engines',
  'Observability Stacks', 'APM Pipelines', 'Error Tracking', 'Uptime Monitors', 'Synthetic Testing',
  'Kubernetes Platforms', 'Serverless Runtimes', 'Infrastructure as Code', 'Cloud Cost Platforms', 'Release Orchestration',
  'API Gateways', 'Service Mesh', 'Event Streams', 'Message Brokers', 'ETL Orchestrators',
  'Data Catalogs', 'Metadata Stores', 'Data Quality Hubs', 'Feature Stores', 'Model Registries',
  'Prompt Repositories', 'Agent Registries', 'Workflow Engines', 'RPA Platforms', 'Task Queues',
  'Document OCR', 'Contract Repositories', 'eSignature Systems', 'Records Retention', 'Archive Systems',
  'Media Asset Management', 'Video Processing', 'Audio Pipelines', 'Image Annotation', '3D Asset Pipelines',
  'Ecommerce Catalogs', 'Order Management', 'Inventory Planning', 'Returns Processing', 'Marketplace Operations',
  'Subscription Platforms', 'Billing Recovery', 'Dunning Workflows', 'Revenue Recognition', 'Forecasting Models',
  'Open Source Intelligence', 'News Monitoring', 'Competitive Intelligence', 'Regulatory Feeds', 'Market Data APIs',
  'Crowdsourcing Platforms', 'Survey Systems', 'Experiment Platforms', 'A/B Testing', 'Behavior Analytics',
  'Mobile Release Ops', 'App Store Management', 'Device Labs', 'Push Notification Systems', 'In-App Messaging',
  'Desktop Fleet Mgmt', 'VDI Platforms', 'Remote Access', 'Patch Orchestration', 'Asset Discovery',
  'Bioinformatics Pipelines', 'Genomics Tooling', 'Chemical Informatics', 'Lab Robotics', 'Scientific Publishing',
  'Nonprofit Program Ops', 'Grant Management', 'Donor Platforms', 'Volunteer Coordination', 'Impact Measurement',
  'Civic Engagement', 'Emergency Response', 'Public Health Dashboards', 'Urban Planning Data', 'Mobility Platforms',
  'Legal Matter Mgmt', 'Discovery Pipelines', 'Case Collaboration', 'Policy Drafting', 'Legislative Tracking',
  'Translation Pipelines', 'Localization QA', 'Terminology Mgmt', 'Accessibility Auditing', 'Content Governance',
  'IoT Device Clouds', 'Edge Compute', 'Sensor Fusion', 'Predictive Maintenance', 'Industrial Alerts',
  'Trading Platforms', 'Portfolio Analytics', 'Derivatives Risk', 'Alternative Data', 'Execution Monitoring',
  'Community Forums', 'Creator Platforms', 'Streaming Operations', 'Live Event Ops', 'Audience Analytics',
  'Payment Gateways', 'POS Systems', 'Merchant Risk', 'Chargeback Ops', 'Settlement Reconciliation',
  'Identity Verification', 'KYC Pipelines', 'Onboarding Journeys', 'Document Verification', 'Biometric Systems',
  'MLOps Pipelines', 'Evaluation Harnesses', 'Safety Guardrails', 'Model Serving', 'Vector Datastores',
  'Knowledge Graphs', 'Semantic Retrieval', 'Ontology Management', 'Taxonomy Services', 'Inference Caches',
  'Partner Integrations', 'EDI Pipelines', 'B2B Portals', 'Catalog Syndication', 'Channel Operations',
  'Renewal Management', 'Churn Prevention', 'Customer Success Plans', 'QBR Automation', 'Reference Programs',
  'Field Service Ops', 'Scheduling Dispatch', 'Work Order Systems', 'Spare Parts Planning', 'Service Quality',
  'Lab Notebook Systems', 'Protocol Management', 'Data Provenance', 'Reproducibility Tracking', 'Peer Review Ops',
  'Ethics Review Boards', 'Consent Management', 'Sensitive Data Governance', 'Audit Trails', 'Policy Compliance',
  'AI Evaluation Markets', 'Benchmark Repositories', 'Synthetic Data Platforms', 'Simulation Environments', 'Autonomy Control'
];

const capabilities = [
  'Access Auditor', 'Auth Broker', 'Permission Mapper', 'Schema Introspector', 'Spec Drift Detector',
  'API Contract Validator', 'Operation Planner', 'Task Decomposer', 'Dependency Resolver', 'Workflow Compiler',
  'Execution Runner', 'Job Scheduler', 'Retry Governor', 'Rate Limit Optimizer', 'Queue Balancer',
  'State Reconciler', 'Delta Calculator', 'Conflict Resolver', 'Rollback Coordinator', 'Migration Planner',
  'Snapshot Manager', 'Version Tracker', 'Artifact Publisher', 'Evidence Collector', 'Provenance Tracker',
  'Anomaly Detector', 'Threshold Alerting', 'Forecast Engine', 'Capacity Planner', 'Budget Guardrail',
  'Cost Attribution', 'Latency Analyzer', 'Reliability Scorer', 'SLA Enforcer', 'Policy Evaluator',
  'Risk Scorer', 'Compliance Mapper', 'PII Redactor', 'Secret Scanner', 'Vulnerability Correlator',
  'Incident Triage', 'Root Cause Miner', 'Remediation Planner', 'Postmortem Drafting', 'Runbook Composer',
  'Approval Orchestrator', 'Human Handoff Router', 'Feedback Harvester', 'Quality Gatekeeper', 'Outcome Synthesizer'
];

function ensureDomainCoverage(targetCount, capabilitiesPerDomain) {
  const requiredDomains = Math.ceil(targetCount / capabilitiesPerDomain);
  const output = [...domains];
  let i = 1;
  while (output.length < requiredDomains) {
    output.push(`Universal Toolchain ${String(i).padStart(2, '0')}`);
    i += 1;
  }
  return output;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

const listPath = path.join(process.cwd(), 'TOOL_SKILLS_12000_MORE.md');
const jsonPath = path.join(process.cwd(), 'skills', 'state', 'tool-skills-12000-more.json');
fs.mkdirSync(path.dirname(jsonPath), { recursive: true });

const expandedDomains = ensureDomainCoverage(EXTRA_COUNT, capabilities.length);

const lines = [];
lines.push('# Additional Tool Skills (12000)');
lines.push('');
lines.push('An expanded, high-coverage skill backlog intended to extend Codex + OpenClaw extension capabilities.');
lines.push('');

const entries = [];
let id = START_ID;
for (const domain of expandedDomains) {
  for (const capability of capabilities) {
    if (id >= START_ID + EXTRA_COUNT) break;
    const title = `${domain} ${capability}`;
    const purpose = `Design and run ${domain.toLowerCase()} workflows with ${capability.toLowerCase()} controls.`;
    lines.push(`${id}. \`${title}\` - ${purpose}`);
    entries.push({
      id,
      title,
      domain,
      capability,
      purpose,
      slug: `${String(id).padStart(5, '0')}-${slugify(title)}`
    });
    id += 1;
  }
  if (id >= START_ID + EXTRA_COUNT) break;
}

fs.writeFileSync(listPath, `${lines.join('\n')}\n`, 'utf8');
fs.writeFileSync(jsonPath, `${JSON.stringify({
  generatedAt: new Date().toISOString(),
  startId: START_ID,
  count: entries.length,
  entries
}, null, 2)}\n`, 'utf8');

console.log(`Wrote ${listPath} (${entries.length} items)`);
console.log(`Wrote ${jsonPath}`);
