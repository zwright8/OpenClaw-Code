# SkillOS v1 Workflow Compiler + Policy Gate

This document describes the SkillOS v1 workflow compiler and execution policy gate.

## Artifacts

- `scripts/compile-workflow.ts` → builds a machine-readable workflow DAG JSON.
- `skills/state/execution-policy.json` → execution policy schema + default policy tiers.
- `scripts/apply-execution-policy.ts` → evaluates workflow nodes against policy and marks human approval requirements.

## 1) Compile a workflow DAG

```bash
tsx scripts/compile-workflow.ts \
  --skills "u0001-epistemic-signal-ingestion-normalizer,u0003-epistemic-evidence-provenance-tracker,u0008-epistemic-dependency-dag-planner"
```

Optional flags:

- `--out <path>`: output DAG JSON (default: `skills/state/workflow.compiled.json`)
- `--report <path>`: report with output hash (default: `reports/workflow.compile.report.json`)

### Output shape (`workflow.compiled.json`)

```json
{
  "version": 1,
  "generatedAt": "2026-02-27T01:00:00.000Z",
  "selectedSkills": ["..."],
  "nodeCount": 3,
  "edgeCount": 2,
  "nodes": [
    {
      "id": "u0008-epistemic-dependency-dag-planner",
      "handoff": {
        "produces": ["..."],
        "consumes": ["..."]
      },
      "risk": {
        "level": null,
        "score": null,
        "rationale": null
      }
    }
  ],
  "edges": [
    {
      "id": "from->to",
      "from": "from",
      "to": "to",
      "artifacts": ["shared artifact"],
      "reason": "handoff-artifact-match"
    }
  ],
  "handoffContracts": [
    {
      "edgeId": "from->to",
      "producerContract": ["..."],
      "consumerContract": ["..."]
    }
  ]
}
```

## 2) Execution policy tiers

`skills/state/execution-policy.json` includes:

- JSON schema fields for policy validation
- default fail-closed setting (`defaultFailClosed: true`)
- required risk metadata fields (`level`, `score`)
- tier definitions:
  - **low (0-39)**: no approval required
  - **medium (40-69)**: human approval required
  - **high (70-100)**: human + security approval required

## 3) Apply execution policy

```bash
tsx scripts/apply-execution-policy.ts
```

Optional flags:

- `--workflow <path>`: compiled DAG input
- `--policy <path>`: policy input
- `--out <path>`: policy-evaluated workflow output (default: `skills/state/workflow.policy-evaluated.json`)
- `--report <path>`: report with file hashes (default: `reports/workflow.policy.report.json`)

### Fail-closed behavior

If required risk metadata is missing, node policy is marked as requiring human approval by default:

```json
{
  "nodeId": "u0008-epistemic-dependency-dag-planner",
  "tier": "unknown",
  "requiresHumanApproval": true,
  "reasons": ["MISSING_RISK_METADATA:level,score"]
}
```

This ensures policy enforcement remains conservative when metadata is incomplete.

## 4) Reports + hashes

Each script writes a report with SHA-256 hashes for reproducibility:

- `reports/workflow.compile.report.json`
- `reports/workflow.policy.report.json`

These reports can be used in CI/CD gates or audit pipelines.
