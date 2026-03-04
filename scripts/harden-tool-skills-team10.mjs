#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const REPO_ROOT = process.cwd();
const OUT_ROOT = path.join(REPO_ROOT, 'skills', 'generated', 'tool-skills-team10');
const TEAM_MANIFEST_PATH = path.join(OUT_ROOT, 'team.build.manifest.json');
const QUALITY_JSON_PATH = path.join(OUT_ROOT, 'quality-report.json');
const QUALITY_MD_PATH = path.join(OUT_ROOT, 'QUALITY_REPORT.md');
const RESOURCES_ROOT = path.join(OUT_ROOT, 'resources');
const DOMAIN_RESOURCES_ROOT = path.join(RESOURCES_ROOT, 'domains');
const CAPABILITY_RESOURCES_ROOT = path.join(RESOURCES_ROOT, 'capabilities');
const BASELINE_RESOURCE_PATH = path.join(RESOURCES_ROOT, 'TOOL_SKILL_BASELINE.md');

const CAPABILITIES = [
  'Connector', 'Sync Orchestrator', 'Data Exporter', 'Data Importer', 'Webhook Listener', 'Report Builder',
  'Alert Monitor', 'Workflow Automator', 'Approval Router', 'Migration Assistant',
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
].sort((a, b) => b.length - a.length);

function slugify(input) {
  return input
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function skillNameFromTitle(title) {
  return slugify(title).slice(0, 63) || 'tool-skill';
}

function parseDomainAndCapability(title) {
  for (const capability of CAPABILITIES) {
    if (title === capability) return { domain: 'General', capability };
    if (title.endsWith(` ${capability}`)) {
      const domain = title.slice(0, -1 * (capability.length + 1)).trim();
      return { domain: domain || 'General', capability };
    }
  }

  const tokens = title.split(' ').filter(Boolean);
  if (tokens.length >= 2) {
    return {
      domain: tokens.slice(0, -2).join(' ') || tokens[0],
      capability: tokens.slice(-2).join(' ')
    };
  }

  return { domain: title, capability: 'Connector' };
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeFile(filePath, contents) {
  const withNewline = contents.endsWith('\n') ? contents : `${contents}\n`;
  fs.writeFileSync(filePath, withNewline, 'utf8');
}

function relativeFromSkill(skillPath, targetPath) {
  const skillDir = path.dirname(skillPath);
  return path.relative(skillDir, targetPath).split(path.sep).join('/');
}

function baselineResourceMarkdown() {
  return `# Tool Skill Baseline

## Intent
This baseline defines execution quality for all generated tool skills.

## Required Execution Pattern
1. Clarify objective, constraints, and expected outputs.
2. Verify authentication and authorization scope before any write operation.
3. Start with read-only inspection or dry-run where available.
4. Execute minimally scoped write operations with explicit change boundaries.
5. Validate side effects using objective checks.
6. Emit structured result artifacts and follow-up actions.

## Validation Checklist
- Inputs validated
- Permissions confirmed
- Dry-run or preflight recorded
- Post-change verification completed
- Sensitive data redacted in logs
- Rollback or recovery path documented

## Safety Guardrails
- Extension layer only: do not duplicate OpenClaw core utilities.
- Use least privilege and temporary credentials where possible.
- Capture evidence for auditability and reproducibility.
`;
}

function domainResourceMarkdown(domain) {
  return `# ${domain} Domain Resource

## Domain Context
Use this reference when implementing workflows touching ${domain.toLowerCase()} systems.

## Domain Workflow Focus
- Identify source-of-truth systems and critical entities.
- Map data contracts, IDs, and reconciliation rules.
- Prioritize safe, reversible changes.

## Access + Controls
- Confirm role and scope boundaries for ${domain.toLowerCase()} APIs/tools.
- Enforce redaction for credentials, tokens, and personal data.
- Use auditable execution logs and immutable evidence when feasible.

## Validation Signals
- Data completeness and schema conformance
- Error budgets and retry limits
- Post-change verification against expected outcomes
`;
}

function capabilityResourceMarkdown(capability) {
  return `# ${capability} Capability Resource

## Capability Objective
Deliver high-confidence ${capability.toLowerCase()} outcomes with measurable validation.

## Recommended Procedure
1. Gather required context and prerequisites.
2. Run preflight checks (auth, connectivity, limits).
3. Execute capability-specific actions with deterministic inputs.
4. Validate output correctness and side effects.
5. Record artifacts, metrics, and remediation actions.

## Quality Checks
- Deterministic inputs and reproducible steps
- Explicit success/failure criteria
- Rollback plan for mutating operations
- Structured result contract for downstream automation
`;
}

function buildSkillMarkdown({ item, domain, capability, baselineRel, domainRel, capabilityRel }) {
  const skillName = skillNameFromTitle(item.title);
  const description = `Use when tasks require ${item.title.toLowerCase()} with production-grade validation, rollback safety, and OpenClaw extension controls.`;
  const purpose = typeof item.purpose === 'string' && item.purpose.trim().length > 0
    ? item.purpose.trim()
    : `Design and execute ${domain.toLowerCase()} workflows using ${capability.toLowerCase()} controls with validated outcomes.`;

  const scoreLine = Number.isFinite(item.score) ? String(item.score) : 'n/a';
  const rankLine = Number.isFinite(item.rank) ? String(item.rank) : 'n/a';
  const bandLine = item.priorityBand || 'n/a';

  const workflowStep = capability.toLowerCase();

  return `---
name: ${skillName}
description: ${description}
---

# ${item.title}

## Purpose
${purpose}

## Precision Profile
- Domain: ${domain}
- Capability: ${capability}
- Score: ${scoreLine}
- Rank: ${rankLine}
- Priority band: ${bandLine}

## Required Inputs
- Objective and scope boundaries
- Source systems, target systems, and identity keys
- Auth method and permission scope
- Success criteria and rollback constraints

## Workflow
1. Confirm objective, scope, and non-goals.
2. Validate access and permission boundaries before execution.
3. Run read-only preflight checks and capture baseline state.
4. Execute ${workflowStep} actions with minimal blast radius.
5. Validate outputs against schema, business rules, and side effects.
6. If validation fails, execute rollback/recovery path and re-verify.
7. Capture artifacts, logs, and decision evidence.
8. Return structured status with follow-up actions.

## Validation Checklist
- Input contract validated
- Auth scope confirmed
- Preflight recorded
- Post-execution checks passed
- Sensitive values redacted
- Recovery path tested or documented

## Resources
- Baseline: [TOOL_SKILL_BASELINE.md](${baselineRel})
- Domain: [${domain}](${domainRel})
- Capability: [${capability}](${capabilityRel})

## Output Contract
- summary: concise result and status
- artifacts: files, IDs, links, logs, or evidence references
- follow_up: next actions, blockers, and remediation tasks

## Guardrails
- Do not duplicate OpenClaw core utilities; remain an extension layer.
- Prefer deterministic execution and auditable outputs.
- Escalate when required permissions or prerequisites are unavailable.
`;
}

function updateAdapter(adapterPath, item, domain, capability, resourcesRel) {
  const adapter = JSON.parse(fs.readFileSync(adapterPath, 'utf8'));
  const titleLower = item.title.toLowerCase();

  adapter.description = `OpenClaw extension adapter for ${item.title.toLowerCase()} with validated execution workflow.`;
  adapter.domain = domain;
  adapter.capability = capability;
  adapter.scoring = {
    rank: item.rank,
    score: item.score,
    priorityBand: item.priorityBand
  };
  adapter.quality = {
    version: 'v2',
    testedAt: new Date().toISOString(),
    checks: [
      'frontmatter-valid',
      'workflow-sections-present',
      'resource-links-resolve',
      'adapter-shape-valid'
    ]
  };
  adapter.resources = {
    baseline: resourcesRel.baseline,
    domain: resourcesRel.domain,
    capability: resourcesRel.capability
  };
  adapter.triggers = Array.from(new Set([
    ...(Array.isArray(adapter.triggers) ? adapter.triggers : []),
    titleLower,
    `${domain.toLowerCase()} ${capability.toLowerCase()}`,
    `${titleLower} workflow`,
    `${titleLower} automation`
  ]));

  writeFile(adapterPath, JSON.stringify(adapter, null, 2));
}

function validateSkill(skillPath, adapterPath, baselinePath, domainPath, capabilityPath) {
  const failures = [];

  if (!fs.existsSync(skillPath)) failures.push('missing-skill-file');
  if (!fs.existsSync(adapterPath)) failures.push('missing-adapter-file');
  if (!fs.existsSync(baselinePath)) failures.push('missing-baseline-resource');
  if (!fs.existsSync(domainPath)) failures.push('missing-domain-resource');
  if (!fs.existsSync(capabilityPath)) failures.push('missing-capability-resource');

  if (failures.length > 0) return failures;

  const skill = fs.readFileSync(skillPath, 'utf8');
  const requiredSkillSections = [
    '## Purpose',
    '## Precision Profile',
    '## Required Inputs',
    '## Workflow',
    '## Validation Checklist',
    '## Resources',
    '## Output Contract',
    '## Guardrails'
  ];

  for (const section of requiredSkillSections) {
    if (!skill.includes(section)) failures.push(`missing-section:${section}`);
  }

  if (!skill.startsWith('---\nname:')) failures.push('invalid-frontmatter');

  let adapter;
  try {
    adapter = JSON.parse(fs.readFileSync(adapterPath, 'utf8'));
  } catch {
    failures.push('adapter-json-invalid');
    return failures;
  }

  const requiredAdapterKeys = ['id', 'title', 'description', 'domain', 'capability', 'quality', 'resources'];
  for (const key of requiredAdapterKeys) {
    if (!(key in adapter)) failures.push(`adapter-missing:${key}`);
  }

  return failures;
}

function main() {
  if (!fs.existsSync(TEAM_MANIFEST_PATH)) {
    throw new Error(`Missing team manifest: ${TEAM_MANIFEST_PATH}`);
  }

  const teamManifest = JSON.parse(fs.readFileSync(TEAM_MANIFEST_PATH, 'utf8'));
  const items = Array.isArray(teamManifest.items) ? teamManifest.items : [];
  if (items.length === 0) {
    throw new Error('team.build.manifest.json contains no items');
  }

  ensureDir(RESOURCES_ROOT);
  ensureDir(DOMAIN_RESOURCES_ROOT);
  ensureDir(CAPABILITY_RESOURCES_ROOT);
  writeFile(BASELINE_RESOURCE_PATH, baselineResourceMarkdown());

  const domainSet = new Set();
  const capabilitySet = new Set();

  const parsed = items.map((item) => {
    const extracted = parseDomainAndCapability(item.title);
    domainSet.add(extracted.domain);
    capabilitySet.add(extracted.capability);
    return {
      item,
      ...extracted
    };
  });

  for (const domain of domainSet) {
    const domainPath = path.join(DOMAIN_RESOURCES_ROOT, `${slugify(domain)}.md`);
    writeFile(domainPath, domainResourceMarkdown(domain));
  }

  for (const capability of capabilitySet) {
    const capabilityPath = path.join(CAPABILITY_RESOURCES_ROOT, `${slugify(capability)}.md`);
    writeFile(capabilityPath, capabilityResourceMarkdown(capability));
  }

  const validationFailures = [];
  const updatedItems = [];

  for (const row of parsed) {
    const { item, domain, capability } = row;
    const skillPathAbs = path.join(OUT_ROOT, item.skillPath);
    const adapterPathAbs = path.join(OUT_ROOT, item.adapterPath);

    const baselineRel = relativeFromSkill(skillPathAbs, BASELINE_RESOURCE_PATH);
    const domainPathAbs = path.join(DOMAIN_RESOURCES_ROOT, `${slugify(domain)}.md`);
    const capabilityPathAbs = path.join(CAPABILITY_RESOURCES_ROOT, `${slugify(capability)}.md`);
    const domainRel = relativeFromSkill(skillPathAbs, domainPathAbs);
    const capabilityRel = relativeFromSkill(skillPathAbs, capabilityPathAbs);

    writeFile(skillPathAbs, buildSkillMarkdown({
      item,
      domain,
      capability,
      baselineRel,
      domainRel,
      capabilityRel
    }));

    updateAdapter(adapterPathAbs, item, domain, capability, {
      baseline: baselineRel,
      domain: domainRel,
      capability: capabilityRel
    });

    const failures = validateSkill(
      skillPathAbs,
      adapterPathAbs,
      BASELINE_RESOURCE_PATH,
      domainPathAbs,
      capabilityPathAbs
    );

    if (failures.length > 0) {
      validationFailures.push({ id: item.id, title: item.title, failures });
    }

    updatedItems.push({
      id: item.id,
      title: item.title,
      domain,
      capability,
      skillPath: item.skillPath,
      adapterPath: item.adapterPath,
      score: item.score,
      rank: item.rank,
      priorityBand: item.priorityBand
    });
  }

  const passed = updatedItems.length - validationFailures.length;
  const quality = {
    generatedAt: new Date().toISOString(),
    totalSkills: updatedItems.length,
    passed,
    failed: validationFailures.length,
    uniqueDomains: Array.from(domainSet).sort(),
    uniqueCapabilities: Array.from(capabilitySet).sort(),
    failures: validationFailures
  };

  writeFile(QUALITY_JSON_PATH, JSON.stringify(quality, null, 2));

  const md = [];
  md.push('# Tool Skills Quality Report');
  md.push('');
  md.push(`- Generated: ${quality.generatedAt}`);
  md.push(`- Total skills tested: ${quality.totalSkills}`);
  md.push(`- Passed: ${quality.passed}`);
  md.push(`- Failed: ${quality.failed}`);
  md.push(`- Unique domains: ${quality.uniqueDomains.length}`);
  md.push(`- Unique capabilities: ${quality.uniqueCapabilities.length}`);
  md.push('');
  md.push('## Resource Packs');
  md.push(`- Baseline: \`skills/generated/tool-skills-team10/resources/TOOL_SKILL_BASELINE.md\``);
  md.push(`- Domain resources: \`skills/generated/tool-skills-team10/resources/domains/*.md\``);
  md.push(`- Capability resources: \`skills/generated/tool-skills-team10/resources/capabilities/*.md\``);
  md.push('');

  if (validationFailures.length > 0) {
    md.push('## Failures (first 200)');
    for (const failure of validationFailures.slice(0, 200)) {
      md.push(`- ${failure.id} ${failure.title}: ${failure.failures.join(', ')}`);
    }
  } else {
    md.push('## Failures');
    md.push('- None');
  }

  writeFile(QUALITY_MD_PATH, md.join('\n'));

  console.log(`Updated and tested ${updatedItems.length} skills.`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${validationFailures.length}`);
  console.log(`Domains: ${quality.uniqueDomains.length}`);
  console.log(`Capabilities: ${quality.uniqueCapabilities.length}`);
  console.log(`Report: ${path.relative(REPO_ROOT, QUALITY_MD_PATH)}`);
}

main();
