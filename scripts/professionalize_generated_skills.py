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

    external_text = " ".join([
        title,
        domain,
        core_method,
        primary_artifact,
        routing_tag,
        " ".join(required_signals),
        " ".join(str(x) for x in guide),
        " ".join(str(x) for x in preflight),
        " ".join(str(x) for x in execution),
    ]).lower()
    external_patterns = [
        r"\bapi\b", r"\bwebhook\b", r"\bhttp\b", r"\bhttps\b", r"\bendpoint\b",
        r"\boauth\b", r"\btoken\b", r"\bcredential\b", r"\bexternal service\b",
        r"\bapi integration\b", r"\bconnector\b", r"\bthird[- ]party\b", r"\bcloud service\b",
    ]
    external_clues = []
    for p in external_patterns:
        if re.search(p, external_text):
            external_clues.append(p.replace("\\b", ""))
    # Ignore false-positive "token" hits that are clearly context-window budget references.
    if "token" in external_clues and "token budget" in external_text:
        external_clues = [x for x in external_clues if x != "token"]

    external_required = "yes" if external_clues else "no"
    external_hint = (
        "Potential external/API dependency signals detected in this skill profile; validate service auth before execution."
        if external_clues else
        "No mandatory external API dependency inferred from current profile data; still verify environment/session credentials for connected runtimes."
    )

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

## External/API Dependency & Credential Reuse Policy
| Field | Value |
|---|---|
| External/API required by profile | `{external_required}` |
| Detection hint | {external_hint} |
| Clues found | {", ".join(f'`{clean(c)}`' for c in external_clues) if external_clues else "`none-detected`"} |

- Reuse previously provided credentials by default; do not ask for a new API key/token when a valid one already exists.
- Before prompting, check configured environment/session secret stores and run a lightweight auth validation.
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


def main() -> None:
    skill_files = sorted(Path(p) for p in glob.glob(str(SKILLS_ROOT / "*" / "*" / "SKILL.md")))
    if not skill_files:
        raise RuntimeError(f"No skills found under {SKILLS_ROOT}")

    before_full = 0
    after_full = 0
    modified = 0
    numeric_count = 0
    nexus_count = 0

    for skill_path in skill_files:
        old = skill_path.read_text(encoding="utf-8")
        if has_all_required_headings(old):
            before_full += 1

        impl_path = skill_path.with_name("implementation.json")
        if impl_path.exists():
            numeric_count += 1
            impl = load_json(impl_path)
            new = build_numeric_skill_doc(skill_path, impl)
        else:
            nexus_count += 1
            new = build_nexus_skill_doc(skill_path, old)

        if new != old:
            skill_path.write_text(new if new.endswith("\n") else new + "\n", encoding="utf-8")
            modified += 1

        if has_all_required_headings(new):
            after_full += 1

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
                "pct": round((before_full / len(skill_files)) * 100, 2),
            },
            "after": {
                "allRequiredHeadings": after_full,
                "pct": round((after_full / len(skill_files)) * 100, 2),
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
        "## Required Headings",
    ]
    md.extend([f"- `{h}`" for h in REQUIRED_HEADINGS])
    md.append("")
    REPORT_MD_PATH.write_text("\n".join(md), encoding="utf-8")

    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
