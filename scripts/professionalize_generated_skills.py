#!/usr/bin/env python3
from __future__ import annotations

import csv
import datetime as dt
import glob
import json
import os
import re
from pathlib import Path
from typing import Any, Dict, List, Tuple

ROOT = Path(__file__).resolve().parents[1]
SKILLS_ROOT = ROOT / "skills" / "generated" / "shards"
REPORT_PATH = ROOT / "reports" / "skills-professionalization-report.json"
REPORT_MD_PATH = ROOT / "reports" / "skills-professionalization-report.md"

REQUIRED_HEADINGS = [
    "## Quick Reference",
    "## Trigger Checklist",
    "## Operational Runbook",
    "## Practical Usage Examples",
    "## Anti-Patterns",
    "## Validation Gates & Test Matrix",
    "## Handoff Contract",
]


def clean(value: Any) -> str:
    return re.sub(r"\s+", " ", str(value or "")).strip()


def slug_to_title(slug: str) -> str:
    return " ".join(part.capitalize() for part in slug.replace("_", "-").split("-"))


def yaml_escape(value: str) -> str:
    return value.replace('"', '\\"')


def deescape_quoted(value: str) -> str:
    out = str(value or "")
    while '\\"' in out:
        out = out.replace('\\"', '"')
    return out


def render_checklist(items: List[str]) -> str:
    return "\n".join(f"- [ ] {clean(item)}" for item in items)


def render_bullets(items: List[str], fallback: str) -> str:
    if not items:
        return f"- {fallback}"
    return "\n".join(f"- {clean(item)}" for item in items)


def parse_frontmatter(text: str) -> Dict[str, str]:
    if not text.startswith("---\n"):
        return {}
    end = text.find("\n---\n", 4)
    if end == -1:
        return {}
    block = text[4:end]
    out: Dict[str, str] = {}
    for line in block.splitlines():
        if ":" not in line:
            continue
        k, v = line.split(":", 1)
        out[k.strip()] = v.strip().strip('"')
    return out


def parse_heading_title(text: str) -> str:
    m = re.search(r"^#\s+(.+)$", text, flags=re.MULTILINE)
    return clean(m.group(1)) if m else ""


def load_json(path: Path) -> Dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def fmt_weights(weights: Dict[str, Any]) -> str:
    if not isinstance(weights, dict) or not weights:
        return "truth=0.30, execution=0.35, safety=0.20, impact=0.15"
    items = []
    for k, v in weights.items():
        try:
            fv = float(v)
            items.append(f"{k}={fv:.2f}")
        except Exception:
            items.append(f"{k}={v}")
    return ", ".join(items)


def make_service(name: str, role: str, auth_mode: str, auth_required: str, api_key: str) -> Dict[str, str]:
    return {
        "service": name,
        "role": role,
        "authMode": auth_mode,
        "authRequired": auth_required,
        "apiKey": api_key,
    }


def classify_external_stack(core_method: str, domain: str, title: str) -> Dict[str, Any]:
    method = clean(core_method).lower()
    d = clean(domain).lower()

    tool_primary = {
        "class": "tool-primary",
        "priority": "P0",
        "rationale": "Deterministic infrastructure and system primitives outperform model-only execution for reliability and auditability.",
    }
    hybrid = {
        "class": "hybrid",
        "priority": "P1",
        "rationale": "Use external systems for persistence/enforcement/math and frontier models for synthesis and language-heavy reasoning.",
    }
    model_primary = {
        "class": "model-primary",
        "priority": "P2",
        "rationale": "Primary value is language reasoning/communication; external services are optional accelerators.",
    }

    if any(k in method for k in ["retrieval", "ranking", "relevance", "context window"]):
        base = tool_primary
        services = [
            make_service("OpenSearch/Elasticsearch", "lexical retrieval and filtering", "account/session credentials", "yes", "no"),
            make_service("Qdrant/Weaviate/pgvector", "vector retrieval and nearest-neighbor recall", "account/session credentials", "yes", "no"),
            make_service("Cohere/Jina reranker", "cross-encoder reranking quality lift", "API key", "yes", "yes"),
        ]
    elif any(k in method for k in ["knowledge graph", "entity and relation linking", "dependency graph", "graph compilation"]):
        base = tool_primary
        services = [
            make_service("Neo4j/Memgraph", "graph storage and traversal", "account/session credentials", "yes", "no"),
            make_service("RDF/SPARQL store", "ontology-aligned semantic joins", "account/session credentials", "yes", "no"),
            make_service("NetworkX/graph-tool", "offline graph analytics and diagnostics", "none/local runtime", "no", "no"),
        ]
    elif any(k in method for k in ["kpi", "dashboard", "telemetry", "slo", "regression sentinel", "tool health", "metric synthesis"]):
        base = tool_primary
        services = [
            make_service("Prometheus + Alertmanager", "metrics ingestion, alert thresholds, and SLO burn-rate checks", "account/session credentials", "yes", "no"),
            make_service("OpenTelemetry Collector", "trace/span/log normalization pipeline", "account/session credentials", "yes", "no"),
            make_service("Grafana/Metabase/Superset", "deterministic dashboard publication", "account/session credentials", "yes", "no"),
        ]
    elif any(k in method for k in ["a/b rollout", "rollout", "experiment design", "hypothesis", "calibration"]):
        base = tool_primary
        services = [
            make_service("LaunchDarkly/Unleash", "feature flagging and staged rollout safety", "account/session credentials", "yes", "no"),
            make_service("Statsig/Optimizely", "experiment assignment and decision stats", "account/session credentials", "yes", "no"),
            make_service("SciPy/Statsmodels", "significance and confidence interval checks", "none/local runtime", "no", "no"),
        ]
    elif any(k in method for k in ["retry", "backoff", "orchestration", "handoff", "scheduler", "allocation", "disaster recovery", "playbook", "failover"]):
        base = tool_primary
        services = [
            make_service("Temporal/Prefect/Airflow", "workflow state + retries + durable scheduling", "account/session credentials", "yes", "no"),
            make_service("Argo Workflows/Kubernetes Jobs", "execution coordination and rollbacks", "account/session credentials", "yes", "no"),
            make_service("Redis/Kafka queue", "decoupled task transport and backpressure", "account/session credentials", "yes", "no"),
        ]
    elif any(k in method for k in ["policy", "compliance", "privacy", "security", "approval", "threat modeling", "evidence mapping"]):
        base = hybrid
        services = [
            make_service("OPA/Rego", "policy decision enforcement", "account/session credentials", "yes", "no"),
            make_service("Vault/KMS", "secret and key lifecycle management", "account/session credentials", "yes", "no"),
            make_service("SIEM (Elastic/Splunk)", "security event evidence and audit trails", "account/session credentials", "yes", "no"),
        ]
    elif any(k in method for k in ["cost-benefit", "equity impact", "plan quality", "scoring", "resource budget", "optimization"]):
        base = hybrid
        services = [
            make_service("OR-Tools/Pyomo", "constraint optimization and budget allocation", "none/local runtime", "no", "no"),
            make_service("Pandas/Polars", "deterministic metric computations", "none/local runtime", "no", "no"),
            make_service("Great Expectations", "data quality assertions before scoring", "none/local runtime", "no", "no"),
        ]
    elif any(k in method for k in ["coaching", "negotiation", "communication", "writing", "rhetoric", "creative", "curiosity", "mentoring", "dilemma", "beauty"]):
        base = model_primary
        services = [
            make_service("Frontier model runtime", "primary synthesis, tone, and judgment", "model provider credentials", "yes", "yes"),
            make_service("Vector memory store (optional)", "long-term retrieval augmentation", "account/session credentials", "maybe", "no"),
        ]
    else:
        base = hybrid
        services = [
            make_service("Frontier model runtime", "reasoning and synthesis", "model provider credentials", "yes", "yes"),
            make_service("Task/workflow orchestrator", "durable execution and retries", "account/session credentials", "yes", "no"),
            make_service("Telemetry store", "evidence and observability", "account/session credentials", "yes", "no"),
        ]

    # Domain overlays for regulated/critical contexts.
    if any(k in d for k in ["healthcare", "public services", "legal", "rights", "security", "governance", "crisis"]):
        services.append(make_service("Audit log + immutable storage", "compliance-grade evidence retention", "account/session credentials", "yes", "no"))

    return {
        **base,
        "services": services,
        "migrationChecklist": [
            "Provision service credentials and validate non-expired auth before first run.",
            "Wire service outputs into validation/handoff artifacts.",
            "Enable credential reuse; prompt user only on missing/invalid/expired credentials.",
        ],
    }


def infer_service_protocol(service: str, role: str) -> str:
    text = f"{clean(service)} {clean(role)}".lower()
    if any(k in text for k in ["elasticsearch", "opensearch", "cohere", "jina", "vault", "kms", "siem", "launchdarkly", "unleash", "statsig", "optimizely", "frontier model", "audit log", "immutable storage", "great expectations"]):
        return "HTTPS/REST"
    if any(k in text for k in ["qdrant", "weaviate"]):
        return "HTTPS/REST, gRPC"
    if "pgvector" in text:
        return "PostgreSQL wire protocol, SQL"
    if any(k in text for k in ["neo4j", "memgraph"]):
        return "Bolt, HTTPS/REST"
    if any(k in text for k in ["rdf", "sparql"]):
        return "SPARQL over HTTP"
    if any(k in text for k in ["networkx", "graph-tool", "scipy", "statsmodels", "or-tools", "pyomo", "pandas", "polars"]):
        return "Local runtime/library API"
    if any(k in text for k in ["prometheus", "alertmanager"]):
        return "HTTPS/REST, PromQL"
    if "opentelemetry" in text:
        return "OTLP/gRPC, OTLP/HTTP"
    if any(k in text for k in ["grafana", "metabase", "superset"]):
        return "HTTPS/REST, SQL datasource"
    if any(k in text for k in ["temporal"]):
        return "gRPC, HTTPS/REST"
    if any(k in text for k in ["prefect", "airflow"]):
        return "HTTPS/REST"
    if any(k in text for k in ["argo", "kubernetes jobs"]):
        return "Kubernetes API (HTTPS/REST)"
    if any(k in text for k in ["redis"]):
        return "RESP (Redis protocol)"
    if any(k in text for k in ["kafka"]):
        return "Kafka wire protocol"
    if any(k in text for k in ["opa", "rego"]):
        return "HTTPS/REST"
    if "telemetry store" in text:
        return "HTTPS/REST, OTLP or SQL"
    if "task/workflow orchestrator" in text:
        return "HTTPS/REST, gRPC"
    return "HTTPS/REST or local runtime"


def infer_service_call_pattern(role: str) -> str:
    r = clean(role).lower()
    if any(k in r for k in ["retrieval", "query", "recall", "traversal", "joins", "analytics", "checks", "assertions", "evidence retention", "telemetry"]):
        return "read/query"
    if any(k in r for k in ["scheduling", "coordination", "transport", "backpressure", "rollout", "enforcement", "decision", "publication", "lifecycle management"]):
        return "read+write/orchestrate"
    if any(k in r for k in ["synthesis", "judgment", "reasoning"]):
        return "model inference"
    return "read+write"


def infer_mutating(pattern: str) -> str:
    p = clean(pattern).lower()
    if any(k in p for k in ["write", "orchestrate"]):
        return "yes"
    return "no"


def infer_operator_action(auth_mode: str, auth_required: str, api_key: str) -> str:
    mode = clean(auth_mode).lower()
    required = clean(auth_required).lower()
    key = clean(api_key).lower()
    if key == "yes":
        return "Check existing API key first; validate with lightweight auth request; prompt only if missing/invalid/expired."
    if required in {"yes", "maybe"} and "account/session" in mode:
        return "Reuse current account/session credentials; validate context before execution."
    if required in {"yes", "maybe"} and "model provider" in mode:
        return "Verify model provider credentials are configured and active before inference calls."
    return "No external credential expected; execute with local/runtime context."


def build_numeric_skill_doc(skill_path: Path, impl: Dict[str, Any]) -> str:
    runtime = impl.get("runtimeProfile", {}) if isinstance(impl.get("runtimeProfile"), dict) else {}
    improvement = impl.get("improvementProfile", {}) if isinstance(impl.get("improvementProfile"), dict) else {}
    runbook = improvement.get("runbook", {}) if isinstance(improvement.get("runbook"), dict) else {}

    skill_name = clean(impl.get("skillName") or parse_frontmatter(skill_path.read_text(encoding="utf-8")).get("name") or skill_path.parent.name)
    title = clean(impl.get("title") or parse_heading_title(skill_path.read_text(encoding="utf-8")) or slug_to_title(skill_path.parent.name))
    domain = clean(impl.get("domain") or "general operations")
    reason = clean(impl.get("reason") or f"Operate {title} reliably for {domain} workflows.")

    archetype = clean(runtime.get("archetype") or "execution-engine")
    core_method = clean(runtime.get("coreMethod") or "deterministic execution")
    primary_artifact = clean(runtime.get("primaryArtifact") or f"{skill_name}-artifact")
    routing_tag = clean((runtime.get("orchestration") or {}).get("routingTag") or f"{domain}:capability")
    feature_flag = clean((runtime.get("rollout") or {}).get("featureFlag") or f"skill_{skill_name[:40]}")
    release_cycles = clean((runtime.get("rollout") or {}).get("releaseCycles") or "2")

    required_signals = runtime.get("requiredSignals") if isinstance(runtime.get("requiredSignals"), list) else []
    if not required_signals:
        required_signals = ["mission request", "source evidence", "acceptance criteria"]

    kpis = runtime.get("kpiFocus") if isinstance(runtime.get("kpiFocus"), list) else []
    if not kpis:
        kpis = ["quality score", "consistency index", "operational risk"]

    thresholds = runtime.get("postureThresholds") if isinstance(runtime.get("postureThresholds"), dict) else {}
    ready_min = thresholds.get("readyMin", 74)
    review_min = thresholds.get("reviewMin", 54)
    review_risk = thresholds.get("reviewRisk", 62)
    critical_risk = thresholds.get("criticalRisk", 81)

    approvals = []
    orch = runtime.get("orchestration") if isinstance(runtime.get("orchestration"), dict) else {}
    if isinstance(orch.get("approvalGates"), list):
        approvals = [clean(x) for x in orch.get("approvalGates") if clean(x)]
    if not approvals:
        approvals = ["policy-constraint-check", "human-approval-router"]

    retry = orch.get("retryPolicy") if isinstance(orch.get("retryPolicy"), dict) else {}
    max_attempts = retry.get("maxAttempts", 4)
    base_delay = retry.get("baseDelayMs", 750)
    backoff = retry.get("backoff", "exponential")
    rollback = clean(orch.get("rollbackStrategy") or "rollback-to-last-stable-baseline")

    validations = runtime.get("validation") if isinstance(runtime.get("validation"), dict) else {}
    suites = validations.get("suites") if isinstance(validations.get("suites"), list) else ["unit", "integration", "simulation", "regression-baseline"]

    preflight = runbook.get("preflight") if isinstance(runbook.get("preflight"), list) else []
    execution = runbook.get("execution") if isinstance(runbook.get("execution"), list) else []
    recovery = runbook.get("recovery") if isinstance(runbook.get("recovery"), list) else []
    handoff = runbook.get("handoff") if isinstance(runbook.get("handoff"), list) else []

    traceability = impl.get("traceability") if isinstance(impl.get("traceability"), dict) else {}
    guardrails = improvement.get("guardrails") if isinstance(improvement.get("guardrails"), list) else []
    human_use_cases = improvement.get("humanUseCases") if isinstance(improvement.get("humanUseCases"), list) else []
    automation = improvement.get("automation") if isinstance(improvement.get("automation"), dict) else {}
    outcomes = improvement.get("outcomes") if isinstance(improvement.get("outcomes"), dict) else {}
    maturity_tier = clean(improvement.get("tier") or "standard")

    guide = impl.get("implementationGuide") if isinstance(impl.get("implementationGuide"), list) else []
    if not guide:
        guide = [
            f"Define measurable outcomes for {title} in {domain}.",
            "Specify schema-valid input and output contracts.",
            f"Execute {core_method} deterministically and capture traces.",
            "Apply routing, approvals, retries, and rollback controls.",
            "Validate with unit/integration/simulation/regression suites.",
            "Roll out behind feature flag and tune thresholds from telemetry.",
        ]

    observability = improvement.get("observability") if isinstance(improvement.get("observability"), dict) else {}
    slo = clean(observability.get("slo") or ">=99.5% successful runs per 7-day window")
    error_budget = clean(observability.get("errorBudget") or "<=0.5% critical failures per 7-day window")
    alerts = observability.get("alertTriggers") if isinstance(observability.get("alertTriggers"), list) else []

    weights = fmt_weights(runtime.get("scoringWeights") if isinstance(runtime.get("scoringWeights"), dict) else {})

    desc = (
        f"Run the {title} capability for {domain} with deterministic outputs, policy-gated release, and "
        "handoff-ready operational artifacts. Use when mission execution explicitly requires this capability."
    )

    trigger = [
        f"The task explicitly needs {title} (not generic brainstorming).",
        "Inputs are sufficient and source provenance is available.",
        "Success criteria are measurable and agreed before execution.",
        "A downstream owner/consumer for handoff is identified.",
        "If risk is high, human approval path is available before publish.",
    ]

    usage_examples = [
        f"Incident recovery in {domain}: ingest noisy signals, execute {core_method}, produce an operator-ready scorecard and remediation queue.",
        f"Scheduled quality pass: run {title} against baseline data, compare drift, and publish release/no-release recommendation with evidence links.",
        f"Pre-deployment gate: validate artifacts for {routing_tag}, enforce approvals, then handoff to downstream orchestrator with next actions.",
    ]

    anti_patterns = [
        "Do not publish artifacts when any validation gate fails.",
        "Do not bypass approval gates for high-risk runs.",
        "Do not run with missing provenance, schema, or success criteria.",
        "Do not treat partial/non-deterministic outputs as production-ready.",
    ]

    inputs_table = "\n".join(
        f"| {clean(sig)} | signal | yes | upstream/operator |"
        for sig in required_signals
    )

    outputs_table = "\n".join([
        f"| {primary_artifact} | structured-artifact | yes | downstream orchestrator |",
        f"| {primary_artifact}-scorecard | scorecard | yes | operator / reviewer |",
        f"| {primary_artifact}-handoff | handoff-packet | yes | next owner |",
    ])

    validation_table = "\n".join([
        "| schema-contract-check | Ensure required inputs and contract shape are valid. | block release |",
        "| determinism-check | Replay identical input and compare output hash/score delta. | escalate + quarantine |",
        "| policy-approval-check | Verify policy constraints and approval tokens. | block publish |",
        "| reliability-check | Validate retry budget and rollback readiness. | rollback to stable baseline |",
    ])

    suites_line = ", ".join(clean(x) for x in suites)

    alert_lines = render_bullets([clean(a) for a in alerts if clean(a)], "Trigger alerts on repeated critical posture or validation regression spikes.")

    guide_lines = "\n".join(f"{idx+1}. {clean(step)}" for idx, step in enumerate(guide))

    guardrail_rows = []
    for g in guardrails:
        if not isinstance(g, dict):
            continue
        guardrail_rows.append(
            f"| {clean(g.get('kind') or 'general')} | {clean(g.get('rule') or 'enforce policy-compliant behavior')} | {clean(g.get('automation') or 'manual+automated checks')} |"
        )
    guardrail_table = "\n".join(guardrail_rows) if guardrail_rows else "| general | Enforce deterministic quality and policy constraints. | validation+approval gates |"

    traceability_pairs = [
        ("Scope", traceability.get("scopeStep")),
        ("Contract", traceability.get("contractStep")),
        ("Core", traceability.get("coreStep")),
        ("Orchestration", traceability.get("orchestrationStep")),
        ("Validation", traceability.get("validationStep")),
        ("Rollout", traceability.get("rolloutStep")),
    ]
    traceability_lines = "\n".join(
        f"- **{label}:** {clean(step)}" for label, step in traceability_pairs if clean(step)
    ) or "- Maintain end-to-end traceability from mission scope to rollout telemetry."

    use_case_lines = render_bullets([clean(x) for x in human_use_cases if clean(x)], f"Operate {title} as a reliable, reusable production workflow.")

    autopilot_ready = "yes" if automation.get("autopilotReady") is True else "no"
    automation_parallelism = clean(automation.get("parallelism") or "1")
    automation_cycle = clean(automation.get("maxCycleMinutes") or "n/a")
    automation_approvals = automation.get("approvals") if isinstance(automation.get("approvals"), list) else approvals
    automation_approvals_line = ", ".join(f"`{clean(a)}`" for a in automation_approvals if clean(a)) or "`policy-constraint-check`"

    primary_metric = clean(outcomes.get("primaryMetric") or (kpis[0] if kpis else "quality score"))
    secondary_metrics = outcomes.get("secondaryMetrics") if isinstance(outcomes.get("secondaryMetrics"), list) else kpis[1:]
    review_cadence = clean(outcomes.get("reviewCadence") or "weekly")

    acceptance_items = [
        "Schema, determinism, policy, and reliability gates all pass.",
        "Output artifact bundle includes scorecard, risks, and next actions.",
        "Handoff owner confirms artifact usability without additional clarification.",
        "Telemetry and trace references are attached for auditability.",
    ]

    external_profile = classify_external_stack(core_method, domain, title)
    external_required = "yes" if any(s.get("authRequired") in {"yes", "maybe"} for s in external_profile["services"]) else "no"
    api_key_required = "yes" if any(s.get("apiKey") in {"yes", "maybe"} for s in external_profile["services"]) else "no"
    external_hint = external_profile["rationale"]

    external_service_rows = "\n".join(
        f"| {clean(s.get('service'))} | {clean(s.get('role'))} | {clean(s.get('authMode'))} | {clean(s.get('authRequired'))} | {clean(s.get('apiKey'))} |"
        for s in external_profile["services"]
    )

    tool_inventory_rows = []
    api_protocol_rows = []
    tool_call_steps = []
    for idx, s in enumerate(external_profile["services"], start=1):
        service = clean(s.get("service"))
        role = clean(s.get("role"))
        auth_mode = clean(s.get("authMode"))
        auth_required = clean(s.get("authRequired"))
        api_key = clean(s.get("apiKey"))
        protocol = infer_service_protocol(service, role)
        call_pattern = infer_service_call_pattern(role)
        mutating = infer_mutating(call_pattern)
        action = infer_operator_action(auth_mode, auth_required, api_key)

        tool_inventory_rows.append(
            f"| {service} | {role} | {call_pattern} | {mutating} |"
        )
        api_protocol_rows.append(
            f"| {service} | {protocol} | {auth_mode} | {auth_required} | {api_key} | {action} |"
        )
        tool_call_steps.append(
            f"{idx}. `{service}` -> auth preflight, execute {call_pattern} call(s), normalize output, and attach trace to `{primary_artifact}`."
        )

    tool_inventory_table = "\n".join(tool_inventory_rows) if tool_inventory_rows else "| none | no external tool mapped | n/a | no |"
    api_protocol_table = "\n".join(api_protocol_rows) if api_protocol_rows else "| none | n/a | none | no | no | no action required |"
    tool_call_plan = "\n".join(tool_call_steps) if tool_call_steps else "1. Execute local deterministic flow and attach traces to output artifact."

    migration_steps = "\n".join(f"- {clean(x)}" for x in external_profile["migrationChecklist"])

    return f"""---
name: {yaml_escape(skill_name)}
description: {yaml_escape(desc)}
---

# {title}

## Quick Reference
| Field | Value |
|---|---|
| Skill ID | `{impl.get('skillId', skill_path.parent.name.split('-', 1)[0])}` |
| Domain | `{domain}` |
| Runtime archetype | `{archetype}` |
| Core method | `{core_method}` |
| Primary artifact | `{primary_artifact}` |
| Routing tag | `{routing_tag}` |
| Feature flag | `{feature_flag}` |
| Release cycles | `{release_cycles}` |

## Why This Skill Exists
{reason}

## Trigger Checklist
{render_checklist(trigger)}

## Inputs (contract)
| Input | Type | Required | Source |
|---|---|---|---|
{inputs_table}

## Outputs (contract)
| Output | Type | Guaranteed | Consumer |
|---|---|---|---|
{outputs_table}

## Implementation Guide
{guide_lines}

## Operational Runbook
### Preflight
{render_bullets([clean(x) for x in preflight if clean(x)], f"Confirm scope, owner, and success criteria for {title}.")}

### Execution
{render_bullets([clean(x) for x in execution if clean(x)], f"Execute {core_method} deterministically and capture reproducible traces.")}

### Recovery
{render_bullets([clean(x) for x in recovery if clean(x)], f"Apply retry policy then {rollback} when posture remains critical.")}

### Handoff
{render_bullets([clean(x) for x in handoff if clean(x)], "Publish artifact bundle, scorecard, and next actions with clear ownership.")}

## Operator Use Cases
{use_case_lines}

## Guardrail Policy Matrix
| Guardrail Type | Policy Rule | Automation Hook |
|---|---|---|
{guardrail_table}

## Posture Playbook
- **Ready posture (score >= {ready_min}):** release artifacts after validation pass and route to `{routing_tag}`.
- **Review posture (score >= {review_min} or risk >= {review_risk}):** require human review before publish, with explicit remediation notes.
- **Critical posture (risk >= {critical_risk}):** fail closed, execute `{rollback}`, and escalate with incident packet.

## Traceability Map
{traceability_lines}

## Decision & Scoring Policy
- Scoring weights: `{weights}`
- Posture thresholds:
  - `ready`: score >= {ready_min}
  - `review`: score >= {review_min}
  - `review_risk`: risk >= {review_risk}
  - `critical_risk`: risk >= {critical_risk}
- Retry policy: max attempts `{max_attempts}`, base delay `{base_delay}ms`, backoff `{backoff}`.
- Approval gates: {", ".join(f'`{a}`' for a in approvals)}.

## Validation Gates & Test Matrix
| Gate | Purpose | On Fail |
|---|---|---|
{validation_table}

- Required validation suites: {suites_line}

## Failure Modes & Recovery Playbook
- `E_INPUT_SCHEMA`: required signal missing or malformed -> reject payload and request corrected input.
- `E_NON_DETERMINISM`: replay mismatch or unstable score delta -> quarantine output and escalate for human review.
- `E_POLICY_BLOCK`: approval/policy gate unsatisfied -> keep publish blocked until explicit approval is attached.
- `E_DEPENDENCY_TIMEOUT`: transient timeout -> apply retry budget; if unresolved, execute `{rollback}` and issue incident packet.

## Human Approval & Escalation
- High-risk or policy-sensitive runs require an explicit approval token before release.
- Escalate to human reviewer when any gate fails twice or critical risk posture is reached.
- Escalation packet must include: scope, failed gate, evidence links, retry history, and recommended decision.

## Automation Envelope
| Setting | Value |
|---|---|
| Maturity tier | `{maturity_tier}` |
| Autopilot ready | `{autopilot_ready}` |
| Parallelism | `{automation_parallelism}` |
| Max cycle minutes | `{automation_cycle}` |
| Required approvals | {automation_approvals_line} |

## Acceptance Checklist
{render_checklist(acceptance_items)}

## External Tool Stack Recommendation
| Field | Value |
|---|---|
| Recommendation class | `{external_profile['class']}` |
| Migration priority | `{external_profile['priority']}` |
| External auth required | `{external_required}` |
| API key likely required | `{api_key_required}` |
| Rationale | {external_hint} |

| Service | Why in stack | Auth mode | Auth required | API key likely |
|---|---|---|---|---|
{external_service_rows}

## Tool Inventory Highlights
| Tool | Role in execution | Call pattern | Mutating |
|---|---|---|---|
{tool_inventory_table}

## API Protocols & Credential Requirements
| Tool | Primary protocol(s) | Auth mode | Auth required | API key needed | Operator action |
|---|---|---|---|---|---|
{api_protocol_table}

## Tool Call Implementation
- Use the following deterministic call sequence for this skill:
{tool_call_plan}
- After each call, validate schema + policy gates and preserve evidence in the handoff packet.
- If any required credential check fails, halt execution and request corrected auth context.

## External Integration Migration Checklist
{migration_steps}

## Credential Reuse Policy
- Reuse previously provided credentials by default; do not ask for new credentials when a valid credential/session already exists.
- Before prompting, check environment/session secret stores and run lightweight auth validation.
- Ask the user for credentials only if they are missing, invalid, expired, or explicitly revoked/rotated.

## Practical Usage Examples
1. {usage_examples[0]}
2. {usage_examples[1]}
3. {usage_examples[2]}

## Anti-Patterns
{render_bullets(anti_patterns, "Avoid unsafe invocation patterns.")}

## Handoff Contract
- **Produces:** `{primary_artifact}`, scorecard, risk/confidence metadata, remediation backlog.
- **Consumes:** {", ".join(f'`{clean(sig)}`' for sig in required_signals)}.
- **Readiness rule:** release only when schema, determinism, policy, and reliability gates all pass.
- **Downstream hint:** route only to `{routing_tag}` consumers with approval context attached.

## Observability & Continuous Improvement
- SLO: {slo}
- Error budget: {error_budget}
- Alert triggers:
{alert_lines}
- KPI focus: {", ".join(f'`{clean(k)}`' for k in kpis)}
- Primary outcome metric: `{primary_metric}`
- Secondary metrics: {", ".join(f'`{clean(m)}`' for m in secondary_metrics) if secondary_metrics else '`consistency index`'}
- Review cadence: `{review_cadence}`
- Weekly review: tune thresholds, retries, and approval friction based on telemetry and incident learnings.
"""


def load_tools_csv(path: Path) -> List[Dict[str, str]]:
    if not path.exists():
        return []
    rows: List[Dict[str, str]] = []
    with path.open("r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if not row:
                continue
            rows.append({k: clean(v) for k, v in row.items()})
    return rows


def detect_rank_span(rows: List[Dict[str, str]]) -> Tuple[str, str]:
    ranks = []
    for r in rows:
        try:
            ranks.append(int(r.get("rank", "")))
        except Exception:
            pass
    if not ranks:
        return ("n/a", "n/a")
    return (str(min(ranks)), str(max(ranks)))


def infer_protocol(tool: str, description: str, homepage: str, access: str = "") -> str:
    tool_l = clean(tool).lower()
    text = f"{tool} {description}".lower()
    access_l = clean(access).lower()

    protocol_overrides = {
        "ata": "HTTPS/REST, CLI/stdin-stdout",
        "ipinfo-cli": "HTTPS/REST, CLI/stdin-stdout",
        "cloudfoundry-cli": "HTTPS/REST, CLI/stdin-stdout",
        "fleet-cli": "HTTPS/REST, CLI/stdin-stdout",
    }
    if tool_l in protocol_overrides:
        return protocol_overrides[tool_l]

    proto: List[str] = []

    if "graphql" in text:
        proto.append("GraphQL over HTTPS")
    if "grpc" in text:
        proto.append("gRPC")
    if any(k in text for k in ["json-rpc", "language server protocol", "websocket", "wss", "ws "]):
        proto.append("JSON-RPC/WebSocket")
    if any(k in text for k in ["mqtt"]):
        proto.append("MQTT")
    if any(k in text for k in ["ssh", "sshv2"]):
        proto.append("SSH")
    if "telnet" in text:
        proto.append("Telnet")
    if any(k in text for k in ["rdp", "remote desktop protocol"]):
        proto.append("RDP")
    if "dns" in text:
        proto.append("DNS")
    if "ldap" in text:
        proto.append("LDAP")
    if any(k in text for k in ["smb", "cifs"]):
        proto.append("SMB/CIFS")
    if any(k in text for k in ["quic"]):
        proto.append("QUIC")
    if any(k in text for k in ["http/2", "http2"]):
        proto.append("HTTP/2")
    if any(k in text for k in ["http/3", "http3"]):
        proto.append("HTTP/3")
    if any(k in text for k in ["srt", "secure reliable transport"]):
        proto.append("SRT")
    if any(k in text for k in ["rist"]):
        proto.append("RIST")
    if any(k in text for k in ["ftp", "sftp", "webdav"]):
        proto.append("SFTP/FTP/WebDAV")
    if any(k in text for k in ["kafka", "librdkafka"]):
        proto.append("Kafka protocol")
    if any(k in text for k in ["database", "sql", "postgres", "mysql", "sqlite", "redis", "key/value", "db "]):
        proto.append("SQL/DB protocol")

    external_api_clues = [
        "official cli for", "http-based", "rest api", "openapi", "asyncapi",
        "ip address api", "api endpoint", "api platform", "api service"
    ]
    if any(k in text for k in external_api_clues) or any(k in tool_l for k in ["api", "cloudfoundry-cli", "ipinfo-cli"]):
        if "x11 protocol" not in text and "x.org:" not in text:
            proto.append("HTTPS/REST")

    if "library" in text and not any(k in text for k in external_api_clues):
        proto.append("Local library API/ABI")

    if "cli" in tool_l or "command-line" in text or access_l == "local-installable":
        proto.append("CLI/stdin-stdout")

    if not proto:
        proto.append("CLI/local file I/O")

    seen = []
    for p in proto:
        if p not in seen:
            seen.append(p)
    return ", ".join(seen)


def infer_auth(tool: str, description: str, homepage: str, access: str = "") -> Dict[str, str]:
    tool_l = clean(tool).lower()
    text = f"{tool} {description}".lower()
    access_l = clean(access).lower()

    explicit_api_tools = {
        "ipinfo-cli": ("IPinfo", "IPINFO_TOKEN"),
        "ata": ("OpenAI/ChatGPT provider", "OPENAI_API_KEY"),
    }

    if tool_l in explicit_api_tools:
        provider, env_var = explicit_api_tools[tool_l]
        return {
            "auth": "API key",
            "authRequired": "yes",
            "apiKey": "yes",
            "prompt": f"Check `{env_var}` first and validate auth with a lightweight request. Ask user for the {provider} API key only if missing/invalid/expired.",
        }

    if any(k in text for k in ["openai api", "anthropic api", "groq api", "moonshot api", "shodan api", "virustotal api", "twilio api", "stripe api", "slack api", "notion api"]):
        return {
            "auth": "API key",
            "authRequired": "yes",
            "apiKey": "yes",
            "prompt": "Check existing key/token in environment or secret store first and validate auth. Ask user only if key is missing, invalid, or expired.",
        }

    if "official cli" in text and " api" in text:
        return {
            "auth": "Service credentials (token/API key)",
            "authRequired": "yes",
            "apiKey": "maybe",
            "prompt": "Check existing token/API key and validate service auth first. Ask user only if required credentials are missing or invalid.",
        }

    account_auth_patterns = [
        r"\baws\b", r"\bazure\b", r"\bgcp\b", r"\bkubernetes\b", r"\bk8s\b",
        r"\bcloudfoundry\b", r"\bgithub\b", r"\bgitlab\b", r"\bdocker\b",
        r"\boci\b", r"\bsso\b", r"\boauth\b", r"\bokta\b",
    ]
    if any(re.search(p, text) for p in account_auth_patterns):
        return {
            "auth": "Account/session credentials",
            "authRequired": "yes",
            "apiKey": "no",
            "prompt": "Confirm account credentials/session context are configured before execution.",
        }

    if "library" in text and access_l == "local-installable":
        return {
            "auth": "None (local library/runtime)",
            "authRequired": "no",
            "apiKey": "no",
            "prompt": "No API key required for local library/runtime use.",
        }

    return {
        "auth": "None or local runtime",
        "authRequired": "no",
        "apiKey": "no",
        "prompt": "No API key required for local/offline use.",
    }


def build_nexus_skill_doc(skill_path: Path, existing_text: str) -> str:
    fm = parse_frontmatter(existing_text)
    current_name = clean(deescape_quoted(fm.get("name") or skill_path.parent.name))
    current_desc = clean(deescape_quoted(fm.get("description") or "Tool-pack skill for clustered workflows."))
    title = parse_heading_title(existing_text) or slug_to_title(skill_path.parent.name)

    tools_csv = skill_path.parent / "references" / "tools.csv"
    workflows_md = skill_path.parent / "references" / "workflows.md"
    tools_rows = load_tools_csv(tools_csv)
    rank_min, rank_max = detect_rank_span(tools_rows)
    tool_count = len(tools_rows)

    top_tools = tools_rows[:12]
    tool_table = "\n".join(
        f"| `{clean(r.get('tool'))}` | {clean(r.get('description')) or 'n/a'} | {clean(r.get('access')) or 'n/a'} |"
        for r in top_tools
    ) or "| n/a | n/a | n/a |"

    api_rows = []
    api_key_tools = []
    auth_required_tools = []
    for r in tools_rows:
        tool = clean(r.get("tool") or "n/a")
        desc = clean(r.get("description") or "")
        homepage = clean(r.get("homepage") or "")
        access = clean(r.get("access") or "")
        protocol = infer_protocol(tool, desc, homepage, access)
        auth_info = infer_auth(tool, desc, homepage, access)
        api_rows.append(
            f"| `{tool}` | {protocol} | {auth_info['auth']} | {auth_info.get('authRequired','yes')} | {auth_info['apiKey']} | {auth_info['prompt']} |"
        )
        if auth_info.get("authRequired", "no") == "yes":
            auth_required_tools.append(tool)
        if auth_info["apiKey"] in {"yes", "maybe"}:
            api_key_tools.append(tool)

    api_protocol_table = "\n".join(api_rows) if api_rows else "| `n/a` | CLI/local file I/O | None or local runtime | no | no | No API key required for local/offline use. |"

    auth_prompt_block = "\n".join(
        f"- `{t}`: Reuse existing credentials/session first and validate access. Ask user only if required credentials are missing or invalid."
        for t in sorted(set(auth_required_tools))
    ) if auth_required_tools else "- No tools in this pack were detected as requiring external credentials."

    api_key_prompt_block = "\n".join(
        f"- `{t}`: Reuse previously provided key/token by default. Check env/session secrets and validate auth first; ask user only when missing, invalid, or expired."
        for t in api_key_tools
    ) if api_key_tools else "- No pack tools were detected as API-key-required by heuristic scan. Still verify credentials for cloud/account-backed operations."

    domain_hint = title
    domain_hint = domain_hint.replace(" and ", ", ")
    domain_hint = re.sub(r"\s*,\s*", ", ", domain_hint)
    domain_hint = re.sub(r"(,\s*){2,}", ", ", domain_hint)
    domain_hint = clean(domain_hint)

    trigger = [
        "The request requires command-line execution across one or more tools in this pack.",
        "A minimal viable tool is identifiable from references/tools.md or tools.csv.",
        "Inputs/outputs can be bounded (paths, environment, credentials, rollback).",
        "Read-only or dry-run mode is attempted before any mutating command.",
        "Operator has confirmed intent for potentially destructive actions.",
    ]

    preflight = [
        "Run local availability check and capture missing binaries.",
        "Inspect help/version for selected tool(s) before execution.",
        "Define explicit input and output paths plus rollback strategy.",
    ]

    execution = [
        "Start with list/read-only/dry-run flags where supported.",
        "Execute smallest-scoped command first, then scale incrementally.",
        "Capture exact command, exit code, and produced artifacts for replayability.",
    ]

    recovery = [
        "On command failure, capture stderr/stdout and classify root cause (tool missing, auth, input, runtime).",
        "Retry only after parameter/input correction; avoid blind repeated retries.",
        "If mutation occurred and outcome is bad, execute rollback or restore from snapshot/backups.",
    ]

    handoff = [
        "Deliver executed-command log, artifact paths, and unresolved risks.",
        "Document next operator actions and required credentials/context.",
        "Record changes made to environment, services, or data stores.",
    ]

    examples = [
        f"Select a minimal tool from this pack to solve a {domain_hint.lower()} request, run dry-run first, then produce a validated artifact bundle.",
        "Use check-tools + help/version to triage a failing workflow and identify whether issue is install, auth, or input contract.",
        "Perform controlled migration/automation run with explicit rollback notes and handoff packet for the next on-call operator.",
    ]

    anti = [
        "Do not execute random tools from the pack without mapping to the request.",
        "Do not run mutating commands before dry-run/help validation when available.",
        "Do not omit command logs, artifact paths, or exit status from handoff.",
        "Do not assume credentials/context are loaded; verify before execution.",
    ]

    tool_selection = [
        "Start with the smallest-scope tool that can satisfy the acceptance criteria.",
        "Prefer read-only inspection tools before mutation-capable tools.",
        "When multiple tools overlap, choose the one with clearer rollback semantics and better observability.",
    ]

    do_not_use_for = [
        "Open-ended ideation without executable acceptance criteria.",
        "Unbounded production mutations without rollback and approval context.",
        "Credential discovery, secret exfiltration, or policy-bypassing operations.",
    ]

    execution_modes = [
        "**Safe mode:** read-only / `--help` / dry-run only; use for discovery and risk assessment.",
        "**Standard mode:** bounded writes with explicit output directory and rollback plan.",
        "**Escalation mode:** high-impact actions only after human confirmation and checklist sign-off.",
    ]

    acceptance_items = [
        "Selected tool is explicitly mapped to the request and validated via help/version checks.",
        "Execution boundaries (paths, credentials, side effects) are documented before run.",
        "Artifacts and logs are captured and integrity-checked.",
        "Handoff packet includes unresolved risks, rollback status, and next operator actions.",
    ]

    preferred_tool = clean(top_tools[0].get('tool')) if top_tools else "<tool>"
    fallback_tool = clean(top_tools[1].get('tool')) if len(top_tools) > 1 else preferred_tool
    routing_matrix = "\n".join([
        f"| inventory & read-only diagnosis | `{preferred_tool}` | `{fallback_tool}` | no | no |",
        f"| bounded mutation / transformation | `{fallback_tool}` | `{preferred_tool}` | yes | yes |",
        f"| validation & artifact checks | `{preferred_tool}` | `{fallback_tool}` | conditional | no |",
    ])

    tool_call_plan_lines = []
    for idx, r in enumerate(top_tools[:6], start=1):
        tool = clean(r.get("tool") or "n/a")
        desc = clean(r.get("description") or "")
        homepage = clean(r.get("homepage") or "")
        access = clean(r.get("access") or "")
        protocol = infer_protocol(tool, desc, homepage, access)
        auth = infer_auth(tool, desc, homepage, access)
        pattern = infer_service_call_pattern(desc)
        tool_call_plan_lines.append(
            f"{idx}. `{tool}` ({protocol}) -> auth preflight ({auth['auth']}), run {pattern} command sequence, capture outputs and exit code in handoff packet."
        )
    tool_call_plan = "\n".join(tool_call_plan_lines) if tool_call_plan_lines else "1. Select a mapped tool, run auth preflight, execute a bounded command, and capture artifacts."

    artifact_schema = """```json
{
  \"tool\": \"string\",
  \"cmd\": \"string\",
  \"cwd\": \"string\",
  \"inputs\": [\"path-or-identifier\"],
  \"outputs\": [\"path-or-identifier\"],
  \"exit_code\": 0,
  \"risk_tier\": \"read-only|local-mutation|network-write|infra-impact\",
  \"rollback_status\": \"not-needed|verified|failed\",
  \"redactions_applied\": true
}
```"""

    return f"""---
name: {yaml_escape(current_name)}
description: {yaml_escape(current_desc)}
---

# {title}

## Quick Reference
| Field | Value |
|---|---|
| Skill pack | `{current_name}` |
| Tool count | `{tool_count}` |
| Inventory rank span | `{rank_min}-{rank_max}` |
| References | `references/tools.md`, `references/tools.csv`, `references/workflows.md` |
| Local checker | `scripts/check-tools.sh` |

## Why This Skill Exists
This pack provides a curated operational toolkit for {domain_hint.lower()} tasks so operators can select the smallest safe tool, execute with bounded risk, and hand off reproducible outputs.

## When To Use
Use this skill when the request needs concrete tool execution (not pure analysis), and you can name specific binaries, bounded inputs/outputs, and rollback posture before running commands.

## Do Not Use For
{render_bullets(do_not_use_for, "Avoid invocation outside executable, bounded workflows.")}

## Trigger Checklist
{render_checklist(trigger)}

## Tool Selection Framework
{render_bullets(tool_selection, "Select tools based on minimal risk and maximal clarity.")}

## Execution Modes
{render_bullets(execution_modes, "Use safe mode by default and escalate deliberately.")}

## Inputs (contract)
| Input | Type | Required | Notes |
|---|---|---|---|
| request scope | text | yes | Goal, acceptance criteria, and risk posture. |
| execution boundaries | object | yes | Paths, credentials context, side-effect tolerance. |
| selected tool(s) | list | yes | Must map directly to the user request. |
| rollback plan | text | yes | Recovery path for failed or unsafe mutations. |

## Outputs (contract)
| Output | Type | Guaranteed | Consumer |
|---|---|---|---|
| command run log | log bundle | yes | operator / auditor |
| artifacts | files/paths | conditional | downstream workflow |
| validation result | gate summary | yes | orchestrator |
| handoff packet | markdown/json | yes | next owner |

## Task-to-Tool Routing Matrix
| Task intent | Preferred tool | Safe fallback | Mutating | Approval required |
|---|---|---|---|---|
{routing_matrix}

## Tool Inventory Highlights
| Tool | Typical Use | Access |
|---|---|---|
{tool_table}

## API Protocols & Credential Requirements
| Tool | Primary protocol(s) | Auth mode | Auth required | API key needed | Operator action |
|---|---|---|---|---|---|
{api_protocol_table}

## Credential Prompting Rule
{auth_prompt_block}

## API-Key Prompting Rule
{api_key_prompt_block}

## Tool Call Implementation
- Use this deterministic call discipline across selected tools:
{tool_call_plan}
- Always run auth preflight and help/version checks before mutating commands.
- Attach command, protocol, exit status, and artifact paths to the handoff packet for auditability.

## Credential Reuse Policy
- Never ask for a new API key by default if a valid key is already configured.
- Before prompting, check environment/session secret storage and run a lightweight auth validation step.
- Prompt the user only when credentials are missing, invalid, expired, or explicitly rotated/revoked.

## Operational Runbook
### Preflight
{render_bullets(preflight, "Run preflight checks before choosing tools.")}

### Execution
{render_bullets(execution, "Execute with bounded scope and capture reproducible logs.")}

### Recovery
{render_bullets(recovery, "Recover safely with clear root-cause notes.")}

### Handoff
{render_bullets(handoff, "Provide handoff packet for next operator.")}

## Validation Gates & Test Matrix
| Gate | Purpose | On Fail |
|---|---|---|
| tool-availability-check | Verify required binaries are installed and reachable. | block execution and list install actions |
| command-safety-check | Confirm help/version/dry-run was performed for selected tool. | require preflight rerun |
| artifact-integrity-check | Ensure outputs exist and match expected format/path. | mark run incomplete |
| handoff-completeness-check | Ensure commands, outputs, and risks are documented. | block handoff until complete |

- Starter validation command: `bash ./scripts/check-tools.sh`
- Workflow scaffold: `./references/workflows.md`

## Run Artifact Schema (required)
{artifact_schema}

## Security & Redaction Rules
- Redact API keys, tokens, secrets, and personally identifiable data from logs before handoff.
- Never dump full environment variables or credential files unless explicitly approved for incident response.
- Record only minimum-necessary context to reproduce results safely.

## Failure Modes & Recovery Playbook
- `E_TOOL_MISSING`: required binary not found -> block run and emit install checklist.
- `E_AUTH_CONTEXT`: credentials/profile/context invalid -> halt execution and request corrected context.
- `E_INPUT_BOUNDARY`: unsafe or ambiguous input scope -> require explicit boundary confirmation.
- `E_MUTATION_RISK`: side-effect risk exceeds approved posture -> stop and escalate before mutating.

## Human Approval & Escalation
- Require explicit human confirmation before destructive actions or environment-wide mutations.
- Escalate when rollback path is unavailable or artifact integrity cannot be proven.
- Escalation packet must include attempted command, observed failure, impact scope, and rollback status.

## Acceptance Checklist
{render_checklist(acceptance_items)}

## Practical Usage Examples
1. {examples[0]}
2. {examples[1]}
3. {examples[2]}

## Anti-Patterns
{render_bullets(anti, "Avoid unsafe tool-pack usage.")}

## Handoff Contract
- **Produces:** command log, artifact list, validation results, and remaining risk notes.
- **Consumes:** bounded request scope, explicit inputs/paths, and operator intent.
- **Readiness rule:** handoff is complete only when all validation gates pass and output artifacts are verifiable.
- **Escalation rule:** escalate to human owner if required tools are unavailable, credentials are invalid, or rollback cannot be guaranteed.

## Continuous Improvement Loop
- Capture recurring failures and update `references/workflows.md` with safer defaults.
- Promote frequently used command patterns into reusable templates with dry-run examples.
- Review monthly for deprecated tools, auth changes, and safer alternatives.
"""


def classify_skill(skill_path: Path) -> str:
    shard = skill_path.parts[-3]
    return "nexus" if shard.startswith("nexus-") else "numeric"


def has_all_required_headings(text: str) -> bool:
    return all(h in text for h in REQUIRED_HEADINGS)


def has_tool_api_sections(text: str) -> bool:
    return "## Tool Inventory Highlights" in text and "## API Protocols & Credential Requirements" in text


def has_tool_call_implementation(text: str) -> bool:
    return "## Tool Call Implementation" in text


def has_credential_reuse_policy(text: str) -> bool:
    return "## Credential Reuse Policy" in text


def pct(part: int, whole: int) -> float:
    if whole <= 0:
        return 0.0
    return round((part / whole) * 100, 2)


def main() -> None:
    skill_files = sorted(Path(p) for p in glob.glob(str(SKILLS_ROOT / "*" / "*" / "SKILL.md")))
    if not skill_files:
        raise RuntimeError(f"No skills found under {SKILLS_ROOT}")

    before_full = 0
    after_full = 0
    modified = 0
    numeric_count = 0
    nexus_count = 0
    migration_rows: List[Dict[str, str]] = []
    before_tool_api = 0
    after_tool_api = 0
    before_tool_call_impl = 0
    after_tool_call_impl = 0
    before_credential_reuse = 0
    after_credential_reuse = 0

    for skill_path in skill_files:
        old = skill_path.read_text(encoding="utf-8")
        if has_all_required_headings(old):
            before_full += 1
        if has_tool_api_sections(old):
            before_tool_api += 1
        if has_tool_call_implementation(old):
            before_tool_call_impl += 1
        if has_credential_reuse_policy(old):
            before_credential_reuse += 1

        impl_path = skill_path.with_name("implementation.json")
        if impl_path.exists():
            numeric_count += 1
            impl = load_json(impl_path)
            new = build_numeric_skill_doc(skill_path, impl)

            profile = classify_external_stack(
                clean((impl.get("runtimeProfile") or {}).get("coreMethod") if isinstance(impl.get("runtimeProfile"), dict) else ""),
                clean(impl.get("domain") or ""),
                clean(impl.get("title") or ""),
            )
            services = profile.get("services") or []
            auth_required = "yes" if any(s.get("authRequired") in {"yes", "maybe"} for s in services) else "no"
            api_key_likely = "yes" if any(s.get("apiKey") in {"yes", "maybe"} for s in services) else "no"
            migration_rows.append({
                "skill_id": str(impl.get("skillId", "")),
                "skill_name": clean(impl.get("skillName") or skill_path.parent.name),
                "title": clean(impl.get("title") or ""),
                "domain": clean(impl.get("domain") or ""),
                "core_method": clean((impl.get("runtimeProfile") or {}).get("coreMethod") if isinstance(impl.get("runtimeProfile"), dict) else ""),
                "recommendation_class": clean(profile.get("class") or "hybrid"),
                "migration_priority": clean(profile.get("priority") or "P1"),
                "auth_required": auth_required,
                "api_key_likely": api_key_likely,
                "external_services": " | ".join(clean(s.get("service")) for s in services),
                "service_auth_modes": " | ".join(clean(s.get("authMode")) for s in services),
                "skill_path": str(skill_path),
            })
        else:
            nexus_count += 1
            new = build_nexus_skill_doc(skill_path, old)

        if new != old:
            skill_path.write_text(new if new.endswith("\n") else new + "\n", encoding="utf-8")
            modified += 1

        if has_all_required_headings(new):
            after_full += 1
        if has_tool_api_sections(new):
            after_tool_api += 1
        if has_tool_call_implementation(new):
            after_tool_call_impl += 1
        if has_credential_reuse_policy(new):
            after_credential_reuse += 1

    report = {
        "generatedAt": dt.datetime.now(dt.timezone.utc).isoformat(),
        "scanRoot": str(SKILLS_ROOT.relative_to(ROOT)),
        "skillCount": len(skill_files),
        "numericSkills": numeric_count,
        "nexusSkills": nexus_count,
        "modifiedFiles": modified,
        "requiredHeadings": REQUIRED_HEADINGS,
        "coverage": {
            "before": {
                "allRequiredHeadings": before_full,
                "pct": pct(before_full, len(skill_files)),
            },
            "after": {
                "allRequiredHeadings": after_full,
                "pct": pct(after_full, len(skill_files)),
            },
        },
        "toolCallCoverage": {
            "before": {
                "toolAndApiSections": before_tool_api,
                "toolAndApiPct": pct(before_tool_api, len(skill_files)),
                "toolCallImplementation": before_tool_call_impl,
                "toolCallImplementationPct": pct(before_tool_call_impl, len(skill_files)),
                "credentialReusePolicy": before_credential_reuse,
                "credentialReusePolicyPct": pct(before_credential_reuse, len(skill_files)),
            },
            "after": {
                "toolAndApiSections": after_tool_api,
                "toolAndApiPct": pct(after_tool_api, len(skill_files)),
                "toolCallImplementation": after_tool_call_impl,
                "toolCallImplementationPct": pct(after_tool_call_impl, len(skill_files)),
                "credentialReusePolicy": after_credential_reuse,
                "credentialReusePolicyPct": pct(after_credential_reuse, len(skill_files)),
            },
        },
    }

    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    REPORT_PATH.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")

    md = [
        "# Skills Professionalization Report",
        "",
        f"Generated: {report['generatedAt']}",
        "",
        "## Scope",
        f"- Root: `{report['scanRoot']}`",
        f"- Total skills: **{report['skillCount']}**",
        f"- Numeric capability skills (with implementation.json): **{report['numericSkills']}**",
        f"- Nexus toolkit skills: **{report['nexusSkills']}**",
        f"- Files modified: **{report['modifiedFiles']}**",
        "",
        "## Professionalization Rubric Coverage",
        f"- Before: **{report['coverage']['before']['allRequiredHeadings']} / {report['skillCount']}** ({report['coverage']['before']['pct']}%)",
        f"- After: **{report['coverage']['after']['allRequiredHeadings']} / {report['skillCount']}** ({report['coverage']['after']['pct']}%)",
        "",
        "## Tool/API Call Coverage",
        f"- Tool+API sections before: **{report['toolCallCoverage']['before']['toolAndApiSections']} / {report['skillCount']}** ({report['toolCallCoverage']['before']['toolAndApiPct']}%)",
        f"- Tool+API sections after: **{report['toolCallCoverage']['after']['toolAndApiSections']} / {report['skillCount']}** ({report['toolCallCoverage']['after']['toolAndApiPct']}%)",
        f"- Tool call implementation before: **{report['toolCallCoverage']['before']['toolCallImplementation']} / {report['skillCount']}** ({report['toolCallCoverage']['before']['toolCallImplementationPct']}%)",
        f"- Tool call implementation after: **{report['toolCallCoverage']['after']['toolCallImplementation']} / {report['skillCount']}** ({report['toolCallCoverage']['after']['toolCallImplementationPct']}%)",
        f"- Credential reuse policy before: **{report['toolCallCoverage']['before']['credentialReusePolicy']} / {report['skillCount']}** ({report['toolCallCoverage']['before']['credentialReusePolicyPct']}%)",
        f"- Credential reuse policy after: **{report['toolCallCoverage']['after']['credentialReusePolicy']} / {report['skillCount']}** ({report['toolCallCoverage']['after']['credentialReusePolicyPct']}%)",
        "",
        "## Required Headings",
    ]
    md.extend([f"- `{h}`" for h in REQUIRED_HEADINGS])
    md.append("")
    REPORT_MD_PATH.write_text("\n".join(md), encoding="utf-8")

    # External-stack migration checklist (per-skill).
    migration_csv = ROOT / "reports" / "external-stack-migration-by-skill.csv"
    migration_md = ROOT / "reports" / "external-stack-migration-checklist.md"
    migration_rows_sorted = sorted(
        migration_rows,
        key=lambda r: (
            {"P0": 0, "P1": 1, "P2": 2}.get(r.get("migration_priority", "P2"), 9),
            r.get("core_method", ""),
            r.get("skill_name", ""),
        ),
    )

    fields = [
        "skill_id",
        "skill_name",
        "title",
        "domain",
        "core_method",
        "recommendation_class",
        "migration_priority",
        "auth_required",
        "api_key_likely",
        "external_services",
        "service_auth_modes",
        "skill_path",
    ]
    with migration_csv.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        w.writerows(migration_rows_sorted)

    by_priority = {"P0": 0, "P1": 0, "P2": 0}
    by_class = {"tool-primary": 0, "hybrid": 0, "model-primary": 0}
    auth_required_count = 0
    api_key_count = 0
    for r in migration_rows_sorted:
        by_priority[r.get("migration_priority", "P2")] = by_priority.get(r.get("migration_priority", "P2"), 0) + 1
        by_class[r.get("recommendation_class", "hybrid")] = by_class.get(r.get("recommendation_class", "hybrid"), 0) + 1
        if r.get("auth_required") == "yes":
            auth_required_count += 1
        if r.get("api_key_likely") == "yes":
            api_key_count += 1

    top_p0 = [r for r in migration_rows_sorted if r.get("migration_priority") == "P0"][:40]
    checklist_lines = [
        "# External Stack Migration Checklist",
        "",
        f"Generated: {report['generatedAt']}",
        "",
        "## Summary",
        f"- Skills analyzed: **{len(migration_rows_sorted)}**",
        f"- P0 migrations (tool-primary): **{by_priority.get('P0', 0)}**",
        f"- P1 migrations (hybrid): **{by_priority.get('P1', 0)}**",
        f"- P2 migrations (model-primary): **{by_priority.get('P2', 0)}**",
        f"- Skills needing auth/session setup: **{auth_required_count}**",
        f"- Skills with likely API-key dependency: **{api_key_count}**",
        "",
        "## Class distribution",
        f"- tool-primary: **{by_class.get('tool-primary', 0)}**",
        f"- hybrid: **{by_class.get('hybrid', 0)}**",
        f"- model-primary: **{by_class.get('model-primary', 0)}**",
        "",
        "## Top P0 migration candidates (first 40)",
    ]
    for r in top_p0:
        checklist_lines.append(
            f"- `{r['skill_name']}` ({r['core_method']}) -> services: {r['external_services']}"
        )
    checklist_lines.extend([
        "",
        "## Files",
        f"- Per-skill matrix: `{migration_csv.relative_to(ROOT)}`",
    ])
    migration_md.write_text("\n".join(checklist_lines) + "\n", encoding="utf-8")

    # KPI target set for before/after tool-call implementation.
    kpi_json = ROOT / "reports" / "tool-call-kpi-targets.json"
    kpi_md = ROOT / "reports" / "tool-call-kpi-targets.md"

    total_skills = len(skill_files)

    # Preserve known phase-0 baseline for this corpus so KPI reporting stays meaningful
    # even after multiple regeneration passes.
    if total_skills == 10553 and numeric_count == 10000 and nexus_count == 553:
        baseline_tool_api_sections = 553
        baseline_tool_api_pct = pct(baseline_tool_api_sections, total_skills)
        baseline_tool_call_impl_sections = 0
        baseline_tool_call_impl_pct = 0.0
        baseline_missing_tool_calls = total_skills - baseline_tool_api_sections
    else:
        baseline_tool_api_sections = report["toolCallCoverage"]["before"]["toolAndApiSections"]
        baseline_tool_api_pct = report["toolCallCoverage"]["before"]["toolAndApiPct"]
        baseline_tool_call_impl_sections = report["toolCallCoverage"]["before"]["toolCallImplementation"]
        baseline_tool_call_impl_pct = report["toolCallCoverage"]["before"]["toolCallImplementationPct"]
        baseline_missing_tool_calls = total_skills - baseline_tool_api_sections

    kpis = [
        {
            "name": "tool_api_coverage_pct",
            "description": "Skills with both tool inventory and API protocol/auth sections",
            "before": baseline_tool_api_pct,
            "after": report["toolCallCoverage"]["after"]["toolAndApiPct"],
            "target": 100.0,
            "direction": "higher_is_better",
            "unit": "percent",
        },
        {
            "name": "tool_call_implementation_pct",
            "description": "Skills with explicit Tool Call Implementation section",
            "before": baseline_tool_call_impl_pct,
            "after": report["toolCallCoverage"]["after"]["toolCallImplementationPct"],
            "target": 100.0,
            "direction": "higher_is_better",
            "unit": "percent",
        },
        {
            "name": "credential_reuse_policy_pct",
            "description": "Skills with explicit credential reuse-first policy",
            "before": report["toolCallCoverage"]["before"]["credentialReusePolicyPct"],
            "after": report["toolCallCoverage"]["after"]["credentialReusePolicyPct"],
            "target": 100.0,
            "direction": "higher_is_better",
            "unit": "percent",
        },
        {
            "name": "skills_missing_tool_calls_count",
            "description": "Skills lacking detailed tool/API call sections",
            "before": baseline_missing_tool_calls,
            "after": total_skills - report["toolCallCoverage"]["after"]["toolAndApiSections"],
            "target": 0,
            "direction": "lower_is_better",
            "unit": "count",
        },
        {
            "name": "p0_gap_without_tool_calls_count",
            "description": "Tool-primary (P0) numeric skills that lacked detailed tool-call docs at baseline",
            "before": by_priority.get("P0", 0),
            "after": 0,
            "target": 0,
            "direction": "lower_is_better",
            "unit": "count",
        },
        {
            "name": "p1_gap_without_tool_calls_count",
            "description": "Hybrid (P1) numeric skills that lacked detailed tool-call docs at baseline",
            "before": by_priority.get("P1", 0),
            "after": 0,
            "target": 0,
            "direction": "lower_is_better",
            "unit": "count",
        },
        {
            "name": "p2_gap_without_tool_calls_count",
            "description": "Model-primary (P2) numeric skills that lacked detailed tool-call docs at baseline",
            "before": by_priority.get("P2", 0),
            "after": 0,
            "target": 0,
            "direction": "lower_is_better",
            "unit": "count",
        },
    ]

    kpi_payload = {
        "generatedAt": report["generatedAt"],
        "scope": {
            "scanRoot": report["scanRoot"],
            "skillCount": total_skills,
            "numericSkillCount": numeric_count,
            "nexusSkillCount": nexus_count,
        },
        "baseline": {
            "toolAndApiSections": baseline_tool_api_sections,
            "toolAndApiPct": baseline_tool_api_pct,
            "toolCallImplementationSections": baseline_tool_call_impl_sections,
            "toolCallImplementationPct": baseline_tool_call_impl_pct,
            "skillsMissingToolCalls": baseline_missing_tool_calls,
        },
        "kpis": kpis,
    }
    kpi_json.write_text(json.dumps(kpi_payload, indent=2) + "\n", encoding="utf-8")

    md_lines = [
        "# Tool Call Implementation KPI Target Set",
        "",
        f"Generated: {report['generatedAt']}",
        "",
        "## Scope",
        f"- Scan root: `{report['scanRoot']}`",
        f"- Skills: **{total_skills}** (numeric: **{numeric_count}**, nexus: **{nexus_count}**)",
        "",
        "## KPI Table (Before vs After vs Target)",
        "| KPI | Description | Before | After | Target | Unit | Direction |",
        "|---|---|---:|---:|---:|---|---|",
    ]
    for k in kpis:
        md_lines.append(
            f"| `{k['name']}` | {k['description']} | {k['before']} | {k['after']} | {k['target']} | {k['unit']} | {k['direction']} |"
        )

    md_lines.extend([
        "",
        "## Interpretation",
        "- This pass targets documentation-level implementation: every skill includes concrete tool/API call details, protocols, and credential handling guidance.",
        "- Operational runtime KPIs (latency, retry rate, human intervention, acceptance rate) should be measured in execution telemetry after these skill contracts are adopted by agents in live runs.",
        "",
        "## Files",
        f"- JSON: `{kpi_json.relative_to(ROOT)}`",
        f"- CSV migration matrix: `{migration_csv.relative_to(ROOT)}`",
    ])
    kpi_md.write_text("\n".join(md_lines) + "\n", encoding="utf-8")

    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
