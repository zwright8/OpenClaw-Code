# Skills Utility & Redundancy Audit

- **Generated (UTC):** 2026-02-28T03:49:32.944749+00:00
- **Scope:** `skills/generated/shards`
- **Skills audited:** 10000
- **Excluded paths:** 2

## 1) Utility / Execution-Structure Findings

| Requirement | Pass Count | Pass Rate |
|---|---:|---:|
| Trigger clarity | 9500 | 95.00% |
| Deterministic workflow | 10000 | 100.00% |
| Validation gates | 10000 | 100.00% |
| Handoff contract | 10000 | 100.00% |
| Artifacts | 10000 | 100.00% |

- **Full pass (all 5 requirements):** 9500/10000 (95.00%)
- **Trigger-clarity defects (blank workflow target):** 500

### Dominant structural templates

- `570533f569da`: 7901 skills
- `33dbedb4934a`: 1099 skills
- `2ee2745ecb58`: 444 skills
- `7673b36bba3b`: 184 skills
- `a6688b49cdee`: 166 skills

## 2) Redundancy Cluster Findings

- **Total redundancy clusters:** 1885
- **Exact-slug duplicate clusters:** 1800 (members: 9000)
- **Exact-slug clusters fully identical after normalization:** 1571
- **Operation-family near-duplicate clusters:** 45
- **Suffix-matrix near-duplicate clusters:** 40

### Classification rollup

| Classification | Cluster Count |
|---|---:|
| remove duplicate | 1800 |
| merge into canonical skill | 75 |
| keep as distinct | 10 |

## 3) Top Findings

1. **Structure compliance is high but not complete.** 95% pass all required checks; 500 skills fail trigger clarity due blank `for workflows` description placeholders.
2. **Duplicate load is extreme.** 1,800 exact-slug clusters exist (mostly 5 copies each), indicating large removable redundancy independent of capability semantics.
3. **Behavioral templates are heavily recycled.** Only 8 section-level structural fingerprints cover all 10,000 skills; a small template set drives the corpus.
4. **Two matrix patterns dominate near-duplicates.** 45 operation families (`*-for-*`) and 40 suffix families (`<prefix>-<suffix>`) contain broad semantic overlap and similar run behavior.

## 4) Safe Remediation Plan (No Mass Deletion Yet)

### Batch 0 — Snapshot & Guardrails (mandatory)
- Create `pre-dedupe` git tag and branch checkpoint.
- Generate deletion manifest JSON before each destructive batch.
- Archive candidate removals to `skills/archive/<batch-id>.tar.gz`.
- Rollback: `git revert <batch-commit>` or restore archive and recommit.

### Batch 1 — Low-risk exact duplicate pilot (recommended first)
- Target: **200** exact-slug clusters from the **1571** normalization-identical clusters.
- Action: keep 1 canonical member per cluster, remove the other 4.
- Expected change size: ~800 skill directories removed (pilot), fully reversible in one commit.
- Validation gates: run metadata lint + sample invocation smoke tests + git diff review.

### Batch 2 — Remaining exact-slug clusters
- Target: remaining **229** exact-slug clusters with textual drift.
- Action: pick canonical by structure score + trigger clarity + newest hardening metadata; remove the rest.

### Batch 3 — Operation-family consolidation
- Target: **45** operation-family clusters.
- Action: merge into parameterized canonical skills where classified as merge; retain “keep as distinct” clusters.

### Batch 4 — Suffix-matrix consolidation
- Target: **40** suffix-matrix clusters.
- Action: merge or retain based on cluster classification and structural variance.

### Batch 5 — Utility hardening
- Fix all **500** blank workflow descriptions and enforce trigger contract checks in generation pipeline.

## 5) First Remediation Batch Recommendation

Proceed with **Batch 1 pilot**: dedupe 200 normalization-identical exact-slug clusters (remove 800 duplicates), then run validation. This yields immediate footprint reduction with minimal semantic risk and clean rollback mechanics.

## 6) Output Artifacts

- `skills/state/skills-utility-audit.json`
- `skills/state/skills-redundancy-clusters.json`
- `reports/skills-utility-audit.md`
