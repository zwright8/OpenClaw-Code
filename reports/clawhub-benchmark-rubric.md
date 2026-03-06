# ClawHub Benchmark Utility Rubric (Top Non-Suspicious Skills)

Generated: 2026-02-28T04:50:42.638642+00:00

## Data Source & Safety
- Source endpoint: `https://wry-manatee-359.convex.site/api/v1/skills?sort=downloads&dir=desc&nonSuspiciousOnly=true&limit=50`
- Records returned by API: 45
- Safety posture: **No skill installs were performed**; benchmark used only catalog metadata and summaries.

## Top Downloaded Skills Snapshot
| Skill | Slug | Downloads | Summary Signal |
|---|---|---:|---|
| Ontology | `ontology` | 84173 | Typed knowledge graph for structured agent memory and composable skills. Use when creating/querying entities (Person,... |
| self-improving-agent | `self-improving-agent` | 75931 | Captures learnings, errors, and corrections to enable continuous improvement. Use when: (1) A command or operation fa... |
| Gog | `gog` | 73325 | Google Workspace CLI for Gmail, Calendar, Drive, Contacts, Sheets, and Docs. |
| Tavily Web Search | `tavily-search` | 67378 | AI-optimized web search via Tavily API. Returns concise, relevant results for AI agents. |
| Find Skills | `find-skills` | 61156 | Helps users discover and install agent skills when they ask questions like "how do I do X", "find a skill for X", "is... |
| Summarize | `summarize` | 59001 | Summarize URLs or files with the summarize CLI (web, PDFs, images, audio, YouTube). |
| Agent Browser | `agent-browser` | 56153 | A fast Rust-based headless browser automation CLI with Node.js fallback that enables AI agents to navigate, click, ty... |
| Github | `github` | 55717 | Interact with GitHub using the `gh` CLI. Use `gh issue`, `gh pr`, `gh run`, and `gh api` for issues, PRs, CI runs, an... |
| Weather | `weather` | 46973 | Get current weather and forecasts (no API key required). |
| Polymarket | `polymarketodds` | 44657 | Query Polymarket prediction markets - check odds, trending markets, search events, track prices and momentum. Include... |
| Proactive Agent | `proactive-agent` | 44365 | Transform AI agents from task-followers into proactive partners that anticipate needs and continuously improve. Now w... |
| Sonoscli | `sonoscli` | 42724 | Control Sonos speakers (discover/status/play/volume/group). |
| Notion | `notion` | 31865 | Notion API for creating and managing pages, databases, and blocks. |
| Nano Pdf | `nano-pdf` | 30201 | Edit PDFs with natural-language instructions using the nano-pdf CLI. |
| Nano Banana Pro | `nano-banana-pro` | 29605 | Generate/edit images with Nano Banana Pro (Gemini 3 Pro Image). Use for image create/modify requests incl. edits. Sup... |

## Utility Characteristics Observed in Top Skills
1. **Immediate intent clarity**: successful listings quickly communicate what the skill does.
2. **Trigger-oriented phrasing**: stronger entries include “use when/trigger on” language that shortens operator decision time.
3. **Operational verbs**: high-performing skills communicate executable actions (query, create, monitor, validate, edit).
4. **Workflow composability**: descriptions imply clear handoff points and reusable outputs for downstream automation.
5. **Boundary signaling**: top utilities reduce misuse by scoping the correct problem surface.

## Rubric Used for Generated Skill Audit
| Criterion | Definition | Baseline Coverage | Post-Edit Coverage | Delta |
|---|---|---:|---:|---:|
| `clarity` | Has clear purpose context (`Why This Skill Exists`) and a concrete use scope (`When To Use`). | 88.5% | 100.0% | +11.5pp |
| `trigger_precision` | Has practical, operator-friendly trigger checklist to decide invocation quickly. | 84.0% | 100.0% | +16.0pp |
| `operational_cadence` | Includes day/week/month operating cadence guidance. | 0.0% | 100.0% | +100.0pp |
| `practical_examples` | Includes concrete examples with input, expected output, and handoff intent. | 0.0% | 100.0% | +100.0pp |
| `anti_patterns` | Includes explicit anti-patterns / non-goals to prevent misuse. | 0.0% | 100.0% | +100.0pp |
| `deterministic_outputs` | Defines output contract and deterministic constraints. | 8.5% | 100.0% | +91.5pp |
| `validation_and_handoff` | Defines validation gates and handoff contract for downstream routing. | 89.0% | 100.0% | +11.0pp |

## Catalog-Wide Impact
- Skills audited in `skills/generated/shards`: **10000**
- Composite utility score (baseline → final): **38.58% → 100.00%**
- Improvement passes:
  - Pass 1 (bulk utility enrichment): **96.72%**
  - Pass 2 (missing clarity/trigger fill): **100.00%**
- Total section additions (both passes):
  - Trigger checklist: 10000
  - Day/Week/Month cadence: 10000
  - Practical examples: 10000
  - Anti-patterns: 10000
  - Output contract (backfill): 9150
  - Validation gates (backfill): 1099
  - Handoff contract (backfill): 1099

## Redundancy Findings (Duplicate Slugs)
- Duplicate-slug clusters: **1800**
- Exact duplicate clusters: **1570**
- Divergent-content clusters: **230**

### Redundancy Handling Rule Applied
- Exact duplicates marked as **merge/remove candidates** (archive-first; no mass deletion in this pass).
- Divergent duplicate clusters marked **differentiate profiles or merge later**, with deterministic profile labels attached per member in the resolution plan.
