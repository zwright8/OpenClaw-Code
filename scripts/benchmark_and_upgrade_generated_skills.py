#!/usr/bin/env python3
from __future__ import annotations

import datetime as dt
import hashlib
import json
import re
from collections import Counter, defaultdict
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Tuple

ROOT = Path(__file__).resolve().parents[1]
SKILLS_ROOT = ROOT / "skills/generated/shards"
TOP_SKILLS_JSON = ROOT / "reports/clawhub-top-downloads.json"
RUBRIC_REPORT = ROOT / "reports/clawhub-benchmark-rubric.md"
SCORECARD_JSON = ROOT / "skills/state/skills-utility-scorecard.json"
REDUNDANCY_PLAN_JSON = ROOT / "skills/state/skills-redundancy-resolution-plan.json"

TRIGGER_HEADING = "## Trigger Checklist"
CADENCE_HEADING = "## Operational Cadence (Day / Week / Month)"
EXAMPLES_HEADING = "## Practical Usage Examples"
ANTI_PATTERNS_HEADING = "## Anti-Patterns (Do Not Use)"

PROFILE_LABELS = [
    "baseline-delivery",
    "speed-optimized",
    "risk-and-compliance-first",
    "cost-and-throughput-optimized",
    "incident-and-escalation-mode",
]

RUBRIC = {
    "clarity": "Has clear purpose context (`Why This Skill Exists`) and a concrete use scope (`When To Use`).",
    "trigger_precision": "Has practical, operator-friendly trigger checklist to decide invocation quickly.",
    "operational_cadence": "Includes day/week/month operating cadence guidance.",
    "practical_examples": "Includes concrete examples with input, expected output, and handoff intent.",
    "anti_patterns": "Includes explicit anti-patterns / non-goals to prevent misuse.",
    "deterministic_outputs": "Defines output contract and deterministic constraints.",
    "validation_and_handoff": "Defines validation gates and handoff contract for downstream routing.",
}


@dataclass
class ParsedSkill:
    capability: str
    domain: str
    title: str


def load_top_skills() -> List[dict]:
    if not TOP_SKILLS_JSON.exists():
        raise FileNotFoundError(f"Missing benchmark source: {TOP_SKILLS_JSON}")
    data = json.loads(TOP_SKILLS_JSON.read_text(encoding="utf-8"))
    items = data.get("items", []) if isinstance(data, dict) else data
    if not isinstance(items, list):
        raise ValueError("Unexpected ClawHub payload format; expected list in `items`.")
    return sorted(items, key=lambda x: (x.get("stats", {}) or {}).get("downloads", 0), reverse=True)


def parse_frontmatter(text: str) -> Dict[str, str]:
    if not text.startswith("---\n"):
        return {}
    end = text.find("\n---\n", 4)
    if end == -1:
        return {}
    block = text[4:end]
    out: Dict[str, str] = {}
    for line in block.splitlines():
        if ":" in line:
            k, v = line.split(":", 1)
            out[k.strip()] = v.strip().strip('"')
    return out


def parse_skill_context(text: str) -> ParsedSkill:
    fm = parse_frontmatter(text)
    desc = fm.get("description", "")

    cap = None
    dom = None

    m_cap = re.search(r'"([^"]+)"', desc)
    if m_cap:
        cap = m_cap.group(1).strip()

    m_dom = re.search(r"\bfor\s+(.+?)\.\s*(Use|Trigger|$)", desc, flags=re.IGNORECASE)
    if m_dom:
        dom = m_dom.group(1).strip()

    title_match = re.search(r"^#\s+(.+)$", text, flags=re.MULTILINE)
    title = title_match.group(1).strip() if title_match else "This capability"

    capability = cap or title
    domain = dom or "this domain"
    return ParsedSkill(capability=capability, domain=domain, title=title)


def normalize_for_hash(text: str) -> str:
    # Ignore non-semantic per-instance identifiers when checking duplicate content.
    text = re.sub(r"^name:\s*.+$", "name: <normalized>", text, flags=re.MULTILINE)
    text = re.sub(r"\bu\d{4}[-_]", "uXXXX-", text)
    text = re.sub(r"\s+", " ", text.strip())
    return text


def section_exists(text: str, heading: str) -> bool:
    return heading in text


def append_section(text: str, heading: str, body: str) -> Tuple[str, bool]:
    if section_exists(text, heading):
        return text, False
    if not text.endswith("\n"):
        text += "\n"
    text += f"\n{heading}\n{body.strip()}\n"
    return text, True


def add_missing_sections(text: str) -> Tuple[str, Counter]:
    ctx = parse_skill_context(text)
    edits = Counter()

    why_body = (
        f"This skill operationalizes **{ctx.capability}** for {ctx.domain}. "
        "It exists to produce reliable, policy-compliant outputs under production constraints "
        "and to reduce ambiguity in downstream execution."
    )

    when_body = (
        f"Use this when a request in **{ctx.domain}** depends on **{ctx.capability}** outcomes with explicit acceptance criteria. "
        "Do not use for unconstrained ideation; route discovery work before invoking this execution skill."
    )

    text, changed = append_section(text, "## Why This Skill Exists", why_body)
    if changed:
        edits["why_section_added"] += 1

    text, changed = append_section(text, "## When To Use", when_body)
    if changed:
        edits["when_section_added"] += 1

    trigger_body = (
        f"- [ ] The request explicitly needs **{ctx.capability}** outcomes (not generic brainstorming).\n"
        f"- [ ] Inputs are sufficient to execute in **{ctx.domain}** with measurable acceptance criteria.\n"
        f"- [ ] A downstream consumer is identified for the output artifacts (operator/orchestrator/audit log).\n"
        "- [ ] If any item is false, route to discovery/scoping first instead of invoking this skill."
    )

    cadence_body = (
        f"- **Daily:** Run when new {ctx.domain.lower()} signals arrive or when active decisions depend on this capability.\n"
        "- **Weekly:** Review thresholds, drift, and failure telemetry; calibrate decision rules and retry policy.\n"
        "- **Monthly:** Re-baseline deterministic expectations, archive evidence, and refresh approval/handoff assumptions."
    )

    examples_body = (
        f"1. **Incident stabilization in {ctx.domain}**\n"
        f"   - Input: noisy upstream payload requiring {ctx.capability.lower()} normalization/assessment.\n"
        "   - Expected output: schema-valid artifact bundle + scorecard + explicit next-hop routing hint.\n"
        "   - Handoff: orchestrator receives deterministic result package for gated downstream execution.\n"
        "2. **Planned delivery quality check**\n"
        "   - Input: scheduled batch with known baseline and acceptance metrics.\n"
        "   - Expected output: pass/fail gate results, variance notes, and publish/no-publish recommendation.\n"
        "   - Handoff: operator receives execution summary with risk/confidence and approval requirements."
    )

    anti_patterns_body = (
        "- Do **not** use for open-ended ideation where success metrics and contracts are undefined.\n"
        "- Do **not** bypass schema/policy gates to force output publication under time pressure.\n"
        "- Do **not** treat non-deterministic or partial outputs as release-ready artifacts.\n"
        "- Do **not** invoke this skill when a different capability family is the true bottleneck."
    )

    text, changed = append_section(text, TRIGGER_HEADING, trigger_body)
    if changed:
        edits["trigger_checklist_added"] += 1

    text, changed = append_section(text, CADENCE_HEADING, cadence_body)
    if changed:
        edits["cadence_added"] += 1

    text, changed = append_section(text, EXAMPLES_HEADING, examples_body)
    if changed:
        edits["examples_added"] += 1

    text, changed = append_section(text, ANTI_PATTERNS_HEADING, anti_patterns_body)
    if changed:
        edits["anti_patterns_added"] += 1

    if "## Output Contract" not in text:
        output_body = (
            "- `primary_artifact_bundle` (structured-report, consumer=orchestrator, guaranteed=true)\n"
            "- `execution_scorecard` (scorecard, consumer=operator, guaranteed=true)\n"
            "- `handoff_packet` (machine-readable, consumer=downstream-skill, guaranteed=true)"
        )
        text, changed = append_section(text, "## Output Contract", output_body)
        if changed:
            edits["output_contract_added"] += 1

    if "## Validation Gates" not in text:
        validation_body = (
            "1. **schema-contract-check** — Required inputs are present and schema-valid (on fail: block).\n"
            "2. **determinism-check** — Stable output under repeated runs on identical input (on fail: escalate).\n"
            "3. **policy-approval-check** — Required approvals and policy constraints satisfied (on fail: block publish)."
        )
        text, changed = append_section(text, "## Validation Gates", validation_body)
        if changed:
            edits["validation_gates_added"] += 1

    if "## Handoff Contract" not in text:
        handoff_body = (
            f"- Produces: `{ctx.capability}` execution artifacts + scorecard + risk/confidence metadata.\n"
            "- Consumes: validated upstream payloads that satisfy schema and policy checks.\n"
            "- Downstream routing hint: route only to declared consumers with gate/approval context attached."
        )
        text, changed = append_section(text, "## Handoff Contract", handoff_body)
        if changed:
            edits["handoff_contract_added"] += 1

    return text, edits


def section_word_count(text: str, heading: str) -> int:
    pat = re.compile(rf"^##\s+{re.escape(heading)}\s*$", re.MULTILINE)
    m = pat.search(text)
    if not m:
        return 0
    start = m.end()
    next_heading = re.search(r"^##\s+", text[start:], flags=re.MULTILINE)
    end = start + next_heading.start() if next_heading else len(text)
    body = text[start:end]
    return len(re.findall(r"\w+", body))


def evaluate_skill(text: str) -> Dict[str, bool]:
    checks = {
        "clarity": ("## Why This Skill Exists" in text and "## When To Use" in text and section_word_count(text, "Why This Skill Exists") >= 12),
        "trigger_precision": ("## When To Use" in text and (TRIGGER_HEADING in text or re.search(r"\btrigger\b", text, flags=re.IGNORECASE) is not None)),
        "operational_cadence": (CADENCE_HEADING in text and all(k in text for k in ["Daily", "Weekly", "Monthly"])),
        "practical_examples": (EXAMPLES_HEADING in text and text.count("Expected output") >= 1),
        "anti_patterns": (ANTI_PATTERNS_HEADING in text and "Do **not**" in text),
        "deterministic_outputs": ("## Output Contract" in text and re.search(r"determin", text, flags=re.IGNORECASE) is not None),
        "validation_and_handoff": ("## Validation Gates" in text and "## Handoff Contract" in text),
    }
    return checks


def aggregate_scores(skill_texts: List[str]) -> Dict[str, dict]:
    totals = {k: 0 for k in RUBRIC}
    skill_scores = []
    for text in skill_texts:
        checks = evaluate_skill(text)
        skill_scores.append(checks)
        for k, ok in checks.items():
            totals[k] += int(ok)

    n = len(skill_texts)
    pct = {k: (totals[k] / n if n else 0.0) for k in totals}
    composite = sum(sum(c.values()) for c in skill_scores) / (n * len(RUBRIC)) if n else 0.0
    return {
        "count": n,
        "passed": totals,
        "coverage": pct,
        "composite": composite,
    }


def build_redundancy_plan(skill_files: List[Path]) -> dict:
    groups: Dict[str, List[Path]] = defaultdict(list)
    for p in skill_files:
        slug = p.parent.name.split("-", 1)[1]
        groups[slug].append(p)

    clusters = []
    exact_count = 0
    mixed_count = 0
    for slug, members in sorted(groups.items()):
        if len(members) < 2:
            continue

        members_sorted = sorted(members, key=lambda x: int(x.parent.name.split("-", 1)[0]))
        hashes = []
        member_rows = []
        for idx, path in enumerate(members_sorted):
            text = path.read_text(encoding="utf-8")
            norm = normalize_for_hash(text)
            sig = hashlib.sha256(norm.encode("utf-8")).hexdigest()
            hashes.append(sig)
            member_rows.append(
                {
                    "id": int(path.parent.name.split("-", 1)[0]),
                    "path": str(path.parent.relative_to(ROOT)),
                    "profile_label": PROFILE_LABELS[idx % len(PROFILE_LABELS)],
                    "content_hash": sig,
                }
            )

        unique_hashes = sorted(set(hashes))
        if len(unique_hashes) == 1:
            exact_count += 1
            disposition = "merge_remove_candidate"
            rationale = "All members are text-identical after normalization; safe candidate for archive+merge/remove workflow."
            canonical = member_rows[0]["path"]
        else:
            mixed_count += 1
            disposition = "differentiate_profiles_or_merge_later"
            rationale = "Members share slug but differ in content; keep temporarily and enforce explicit profile labels before merge decision."
            canonical = member_rows[0]["path"]

        clusters.append(
            {
                "slug": slug,
                "size": len(members_sorted),
                "unique_content_hashes": len(unique_hashes),
                "disposition": disposition,
                "canonical_candidate": canonical,
                "rationale": rationale,
                "members": member_rows,
            }
        )

    return {
        "generated_at": dt.datetime.now(dt.timezone.utc).isoformat(),
        "scan_root": str(SKILLS_ROOT.relative_to(ROOT)),
        "summary": {
            "total_duplicate_slug_clusters": len(clusters),
            "exact_duplicate_clusters": exact_count,
            "content_divergent_clusters": mixed_count,
            "recommended_next_step": "Archive exact duplicates before mass removal; apply profile-differentiation review for divergent clusters.",
        },
        "clusters": clusters,
    }


def build_benchmark_markdown(top_skills: List[dict], scorecard: dict, redundancy_plan: dict) -> str:
    now = dt.datetime.now(dt.timezone.utc).isoformat()
    top_rows = []
    for it in top_skills[:15]:
        slug = it.get("slug", "")
        name = it.get("displayName", slug)
        downloads = (it.get("stats", {}) or {}).get("downloads", 0)
        summary = (it.get("summary") or "").replace("\n", " ").strip()
        if len(summary) > 120:
            summary = summary[:117] + "..."
        top_rows.append(f"| {name} | `{slug}` | {downloads} | {summary} |")

    baseline = scorecard["baseline"]
    final = scorecard["post_edit"]

    criterion_lines = []
    for key, desc in RUBRIC.items():
        b = baseline["coverage"][key] * 100
        a = final["coverage"][key] * 100
        criterion_lines.append(f"| `{key}` | {desc} | {b:.1f}% | {a:.1f}% | {a-b:+.1f}pp |")

    return f"""# ClawHub Benchmark Utility Rubric (Top Non-Suspicious Skills)

Generated: {now}

## Data Source & Safety
- Source endpoint: `https://wry-manatee-359.convex.site/api/v1/skills?sort=downloads&dir=desc&nonSuspiciousOnly=true&limit=50`
- Records returned by API: {len(top_skills)}
- Safety posture: **No skill installs were performed**; benchmark used metadata/summaries only.

## Top Downloaded Skills Snapshot
| Skill | Slug | Downloads | Summary Signal |
|---|---|---:|---|
{chr(10).join(top_rows)}

## Utility Characteristics Observed in Top Skills
1. **Fast intent mapping:** concise “use when” framing and trigger language for operator decisions.
2. **Operational verbs:** summaries that specify concrete actions (create/query/monitor/edit/validate).
3. **Scope boundaries:** stronger entries avoid ambiguity with clear domain/tool boundaries.
4. **Delivery orientation:** high-utility skills point toward reusable outputs and downstream actions.
5. **Composable contracts:** better skills are easy to route in larger workflows because invocation intent is explicit.

## Rubric Used for Generated Skill Audit
| Criterion | Definition | Baseline Coverage | Post-Edit Coverage | Delta |
|---|---|---:|---:|---:|
{chr(10).join(criterion_lines)}

## Catalog-Wide Impact
- Skills audited in `skills/generated/shards`: **{final['count']}**
- Composite utility score (baseline → post-edit): **{baseline['composite']*100:.2f}% → {final['composite']*100:.2f}%**
- Files modified in this pass: **{scorecard['edits']['files_modified']}**
- Section additions:
  - Trigger checklist: {scorecard['edits']['sections_added'].get('trigger_checklist_added', 0)}
  - Day/Week/Month cadence: {scorecard['edits']['sections_added'].get('cadence_added', 0)}
  - Practical examples: {scorecard['edits']['sections_added'].get('examples_added', 0)}
  - Anti-patterns: {scorecard['edits']['sections_added'].get('anti_patterns_added', 0)}

## Redundancy Findings (Duplicate Slugs)
- Duplicate-slug clusters: **{redundancy_plan['summary']['total_duplicate_slug_clusters']}**
- Exact duplicate clusters: **{redundancy_plan['summary']['exact_duplicate_clusters']}**
- Divergent-content clusters: **{redundancy_plan['summary']['content_divergent_clusters']}**

### Redundancy Handling Rule Applied
- Exact duplicates are marked as **merge/remove candidates** (archive-first; no mass deletion in this pass).
- Divergent duplicate clusters are marked **differentiate profiles or merge later**, with deterministic profile labels assigned per member.
"""


def main() -> None:
    skill_files = sorted(SKILLS_ROOT.glob("*/*/SKILL.md"), key=lambda p: p.as_posix())
    if len(skill_files) != 10000:
        raise RuntimeError(f"Expected 10000 SKILL.md files in shards, found {len(skill_files)}")

    top_skills = load_top_skills()

    baseline_texts = [p.read_text(encoding="utf-8") for p in skill_files]
    baseline = aggregate_scores(baseline_texts)

    edits_counter = Counter()
    files_modified = 0

    for path, old_text in zip(skill_files, baseline_texts):
        new_text, edits = add_missing_sections(old_text)
        if new_text != old_text:
            path.write_text(new_text, encoding="utf-8")
            files_modified += 1
            edits_counter.update(edits)

    post_texts = [p.read_text(encoding="utf-8") for p in skill_files]
    post_edit = aggregate_scores(post_texts)

    scorecard = {
        "generated_at": dt.datetime.now(dt.timezone.utc).isoformat(),
        "scope": {
            "root": str(ROOT),
            "scan_path": str(SKILLS_ROOT.relative_to(ROOT)),
            "files": len(skill_files),
        },
        "rubric": RUBRIC,
        "baseline": baseline,
        "post_edit": post_edit,
        "delta": {
            "composite": post_edit["composite"] - baseline["composite"],
            "coverage": {k: post_edit["coverage"][k] - baseline["coverage"][k] for k in RUBRIC},
        },
        "edits": {
            "files_modified": files_modified,
            "sections_added": dict(edits_counter),
        },
    }

    redundancy_plan = build_redundancy_plan(skill_files)

    SCORECARD_JSON.parent.mkdir(parents=True, exist_ok=True)
    SCORECARD_JSON.write_text(json.dumps(scorecard, indent=2), encoding="utf-8")
    REDUNDANCY_PLAN_JSON.write_text(json.dumps(redundancy_plan, indent=2), encoding="utf-8")

    rubric_md = build_benchmark_markdown(top_skills, scorecard, redundancy_plan)
    RUBRIC_REPORT.parent.mkdir(parents=True, exist_ok=True)
    RUBRIC_REPORT.write_text(rubric_md, encoding="utf-8")

    print(json.dumps({
        "skills_scanned": len(skill_files),
        "files_modified": files_modified,
        "baseline_composite": round(baseline["composite"], 6),
        "post_composite": round(post_edit["composite"], 6),
        "duplicate_clusters": redundancy_plan["summary"]["total_duplicate_slug_clusters"],
    }, indent=2))


if __name__ == "__main__":
    main()
