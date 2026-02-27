import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

type WorkflowNode = {
  id: string;
  risk: {
    level: string | null;
    score: number | null;
    rationale: string | null;
  };
};

type Workflow = {
  version: number;
  generatedAt: string;
  selectedSkills: string[];
  nodeCount: number;
  edgeCount: number;
  nodes: WorkflowNode[];
  edges: unknown[];
  handoffContracts: unknown[];
};

type TierPolicy = {
  minScore: number;
  maxScore: number;
  requireHumanApproval: boolean;
  requiredApprovers: string[];
  allowedAutoActions: string[];
};

type ExecutionPolicyFile = {
  policy: {
    schemaVersion: number;
    defaultFailClosed: boolean;
    riskMetadata: {
      requiredFields: string[];
    };
    tiers: Record<'low' | 'medium' | 'high', TierPolicy>;
  };
};

type NodePolicy = {
  nodeId: string;
  tier: 'low' | 'medium' | 'high' | 'unknown';
  requiresHumanApproval: boolean;
  requiredApprovers: string[];
  allowedAutoActions: string[];
  reasons: string[];
};

type PolicyEvaluation = {
  version: 1;
  generatedAt: string;
  workflowPath: string;
  policyPath: string;
  failClosed: boolean;
  nodePolicies: NodePolicy[];
  summary: {
    totalNodes: number;
    approvalRequiredCount: number;
    failClosedCount: number;
  };
};

const REPO_ROOT = process.cwd();
const DEFAULT_WORKFLOW_PATH = path.join(REPO_ROOT, 'skills', 'state', 'workflow.compiled.json');
const DEFAULT_POLICY_PATH = path.join(REPO_ROOT, 'skills', 'state', 'execution-policy.json');
const DEFAULT_OUTPUT_PATH = path.join(REPO_ROOT, 'skills', 'state', 'workflow.policy-evaluated.json');
const DEFAULT_REPORT_PATH = path.join(REPO_ROOT, 'reports', 'workflow.policy.report.json');

function parseArgs(argv: string[]) {
  const args = new Map<string, string>();
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const value = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : 'true';
    args.set(key, value);
  }
  return args;
}

function readJsonFile<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function sha256OfFile(filePath: string): string {
  const hash = crypto.createHash('sha256');
  hash.update(fs.readFileSync(filePath));
  return hash.digest('hex');
}

function ensureDir(filePath: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function tierFromRisk(policy: ExecutionPolicyFile['policy'], score: number): 'low' | 'medium' | 'high' | 'unknown' {
  for (const [tierName, tier] of Object.entries(policy.tiers) as Array<['low' | 'medium' | 'high', TierPolicy]>) {
    if (score >= tier.minScore && score <= tier.maxScore) {
      return tierName;
    }
  }
  return 'unknown';
}

function hasRequiredRiskMetadata(node: WorkflowNode, requiredFields: string[]): { ok: boolean; missing: string[] } {
  const missing: string[] = [];
  for (const field of requiredFields) {
    const value = (node.risk as Record<string, unknown>)[field];
    if (value === null || value === undefined || value === '') {
      missing.push(field);
    }
  }
  return { ok: missing.length === 0, missing };
}

function main() {
  const args = parseArgs(process.argv);
  const workflowPath = path.resolve(args.get('workflow') ?? DEFAULT_WORKFLOW_PATH);
  const policyPath = path.resolve(args.get('policy') ?? DEFAULT_POLICY_PATH);
  const outputPath = path.resolve(args.get('out') ?? DEFAULT_OUTPUT_PATH);
  const reportPath = path.resolve(args.get('report') ?? DEFAULT_REPORT_PATH);

  const workflow = readJsonFile<Workflow>(workflowPath);
  const policyFile = readJsonFile<ExecutionPolicyFile>(policyPath);
  const policy = policyFile.policy;

  const nodePolicies: NodePolicy[] = workflow.nodes.map((node) => {
    const reasons: string[] = [];
    let tier: 'low' | 'medium' | 'high' | 'unknown' = 'unknown';
    let requiresHumanApproval = true;
    let requiredApprovers = ['workflow-operator'];
    let allowedAutoActions: string[] = ['dry-run'];

    const riskCheck = hasRequiredRiskMetadata(node, policy.riskMetadata.requiredFields);
    if (!riskCheck.ok) {
      reasons.push(`MISSING_RISK_METADATA:${riskCheck.missing.join(',')}`);
      if (!policy.defaultFailClosed) {
        reasons.push('POLICY_DEFAULT_FAIL_OPEN_OVERRIDE');
        requiresHumanApproval = false;
      }
      return {
        nodeId: node.id,
        tier,
        requiresHumanApproval,
        requiredApprovers,
        allowedAutoActions,
        reasons
      };
    }

    const score = node.risk.score as number;
    tier = tierFromRisk(policy, score);

    if (tier === 'unknown') {
      reasons.push('UNKNOWN_RISK_TIER');
      if (!policy.defaultFailClosed) {
        requiresHumanApproval = false;
      }
      return {
        nodeId: node.id,
        tier,
        requiresHumanApproval,
        requiredApprovers,
        allowedAutoActions,
        reasons
      };
    }

    const tierPolicy = policy.tiers[tier];
    requiresHumanApproval = tierPolicy.requireHumanApproval;
    requiredApprovers = tierPolicy.requiredApprovers;
    allowedAutoActions = tierPolicy.allowedAutoActions;
    reasons.push(`RISK_TIER:${tier}`);

    if (tier !== node.risk.level) {
      reasons.push(`RISK_LEVEL_MISMATCH:node=${node.risk.level ?? 'null'} policy=${tier}`);
    }

    return {
      nodeId: node.id,
      tier,
      requiresHumanApproval,
      requiredApprovers,
      allowedAutoActions,
      reasons
    };
  });

  const output: PolicyEvaluation = {
    version: 1,
    generatedAt: new Date().toISOString(),
    workflowPath,
    policyPath,
    failClosed: policy.defaultFailClosed,
    nodePolicies,
    summary: {
      totalNodes: nodePolicies.length,
      approvalRequiredCount: nodePolicies.filter((node) => node.requiresHumanApproval).length,
      failClosedCount: nodePolicies.filter((node) => node.reasons.some((reason) => reason.startsWith('MISSING_RISK_METADATA') || reason === 'UNKNOWN_RISK_TIER')).length
    }
  };

  ensureDir(outputPath);
  fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);

  const report = {
    version: 1,
    generatedAt: output.generatedAt,
    command: 'apply-execution-policy',
    inputs: {
      workflowPath,
      policyPath,
      workflowSha256: sha256OfFile(workflowPath),
      policySha256: sha256OfFile(policyPath)
    },
    outputs: {
      evaluatedWorkflowPath: outputPath,
      evaluatedWorkflowSha256: sha256OfFile(outputPath)
    },
    summary: output.summary
  };

  ensureDir(reportPath);
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`[apply-execution-policy] nodes=${output.summary.totalNodes} approvals=${output.summary.approvalRequiredCount} failClosed=${output.summary.failClosedCount}`);
}

main();
