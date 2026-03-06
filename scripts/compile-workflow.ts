import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

type Json = Record<string, unknown>;

type SkillManifestEntry = {
  id: number;
  name: string;
  title: string;
  domain: string;
  implementationPath: string;
};

type SkillImplementation = {
  skillId: number;
  skillName: string;
  title: string;
  domain: string;
  runtimeProfile?: {
    orchestration?: {
      approvalGates?: string[];
      routingTag?: string;
    };
    handoffContract?: {
      produces?: string[];
      consumes?: string[];
      downstreamHint?: string;
    };
    riskMetadata?: {
      level?: string;
      score?: number;
      rationale?: string;
    };
  };
};

type WorkflowNode = {
  id: string;
  skillId: number;
  skillName: string;
  title: string;
  domain: string;
  routingTag: string | null;
  approvalGates: string[];
  handoff: {
    produces: string[];
    consumes: string[];
    downstreamHint: string | null;
  };
  risk: {
    level: string | null;
    score: number | null;
    rationale: string | null;
  };
};

type WorkflowEdge = {
  id: string;
  from: string;
  to: string;
  artifacts: string[];
  reason: 'handoff-artifact-match';
};

type WorkflowContract = {
  edgeId: string;
  from: string;
  to: string;
  artifacts: string[];
  producerContract: string[];
  consumerContract: string[];
};

type WorkflowOutput = {
  version: 1;
  generatedAt: string;
  selectedSkills: string[];
  nodeCount: number;
  edgeCount: number;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  handoffContracts: WorkflowContract[];
};

const REPO_ROOT = process.cwd();
const MANIFEST_PATH = path.join(REPO_ROOT, 'skills', 'generated', 'skills.manifest.json');
const DEFAULT_OUTPUT_PATH = path.join(REPO_ROOT, 'skills', 'state', 'workflow.compiled.json');
const DEFAULT_REPORT_PATH = path.join(REPO_ROOT, 'reports', 'workflow.compile.report.json');

function parseArgs(argv: string[]) {
  const args = new Map<string, string>();
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) {
      continue;
    }
    const key = token.slice(2);
    const value = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : 'true';
    args.set(key, value);
  }
  return args;
}

function normalizeArtifact(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function sha256OfFile(filePath: string): string {
  const hash = crypto.createHash('sha256');
  hash.update(fs.readFileSync(filePath));
  return hash.digest('hex');
}

function ensureDir(filePath: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function readJsonFile<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function loadSelectedSkills(selectionRaw: string): string[] {
  const selected = selectionRaw
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  if (selected.length === 0) {
    throw new Error('No skills selected. Provide --skills "skill-a,skill-b"');
  }
  return selected;
}

function main() {
  const args = parseArgs(process.argv);
  const skillsArg = args.get('skills');
  if (!skillsArg) {
    throw new Error('Missing required argument --skills');
  }

  const outputPath = path.resolve(args.get('out') ?? DEFAULT_OUTPUT_PATH);
  const reportPath = path.resolve(args.get('report') ?? DEFAULT_REPORT_PATH);

  const selectedSkills = loadSelectedSkills(skillsArg);
  const manifest = readJsonFile<SkillManifestEntry[]>(MANIFEST_PATH);
  const manifestByName = new Map(manifest.map((entry) => [entry.name, entry]));

  const nodes: WorkflowNode[] = selectedSkills.map((skillName) => {
    const manifestEntry = manifestByName.get(skillName);
    if (!manifestEntry) {
      throw new Error(`Skill not found in manifest: ${skillName}`);
    }

    const implementationPath = path.join(REPO_ROOT, manifestEntry.implementationPath);
    const implementation = readJsonFile<SkillImplementation>(implementationPath);
    const runtimeProfile = implementation.runtimeProfile ?? {};
    const handoff = runtimeProfile.handoffContract ?? {};
    const risk = runtimeProfile.riskMetadata ?? {};

    return {
      id: skillName,
      skillId: manifestEntry.id,
      skillName: implementation.skillName,
      title: implementation.title,
      domain: implementation.domain,
      routingTag: runtimeProfile.orchestration?.routingTag ?? null,
      approvalGates: runtimeProfile.orchestration?.approvalGates ?? [],
      handoff: {
        produces: handoff.produces ?? [],
        consumes: handoff.consumes ?? [],
        downstreamHint: handoff.downstreamHint ?? null
      },
      risk: {
        level: risk.level ?? null,
        score: risk.score ?? null,
        rationale: risk.rationale ?? null
      }
    };
  });

  const edges: WorkflowEdge[] = [];
  const contracts: WorkflowContract[] = [];

  for (let fromIndex = 0; fromIndex < nodes.length; fromIndex += 1) {
    for (let toIndex = 0; toIndex < nodes.length; toIndex += 1) {
      if (fromIndex === toIndex) {
        continue;
      }
      const fromNode = nodes[fromIndex];
      const toNode = nodes[toIndex];
      const fromArtifacts = new Map(fromNode.handoff.produces.map((value) => [normalizeArtifact(value), value]));
      const toNeeds = new Set(toNode.handoff.consumes.map((value) => normalizeArtifact(value)));
      const matched = [...fromArtifacts.entries()]
        .filter(([normalized]) => toNeeds.has(normalized))
        .map(([, original]) => original);

      if (matched.length === 0) {
        continue;
      }

      const edgeId = `${fromNode.id}->${toNode.id}`;
      edges.push({
        id: edgeId,
        from: fromNode.id,
        to: toNode.id,
        artifacts: matched,
        reason: 'handoff-artifact-match'
      });
      contracts.push({
        edgeId,
        from: fromNode.id,
        to: toNode.id,
        artifacts: matched,
        producerContract: fromNode.handoff.produces,
        consumerContract: toNode.handoff.consumes
      });
    }
  }

  const output: WorkflowOutput = {
    version: 1,
    generatedAt: new Date().toISOString(),
    selectedSkills,
    nodeCount: nodes.length,
    edgeCount: edges.length,
    nodes,
    edges,
    handoffContracts: contracts
  };

  ensureDir(outputPath);
  fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);

  const report: Json = {
    version: 1,
    generatedAt: output.generatedAt,
    command: 'compile-workflow',
    inputs: {
      manifestPath: MANIFEST_PATH,
      selectedSkills
    },
    outputs: {
      workflowPath: outputPath,
      workflowSha256: sha256OfFile(outputPath)
    },
    counts: {
      nodes: output.nodeCount,
      edges: output.edgeCount,
      handoffContracts: output.handoffContracts.length
    }
  };

  ensureDir(reportPath);
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`[compile-workflow] nodes=${output.nodeCount} edges=${output.edgeCount} output=${outputPath}`);
}

main();
