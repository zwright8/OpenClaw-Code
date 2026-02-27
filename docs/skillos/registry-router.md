# SkillOS v1 Registry + Router

This module adds a deterministic skill registry and a query router for SkillOS v1.

## Outputs

- Registry file: `skills/state/skill-registry.json`
- Builder script: `scripts/build-skill-registry.ts`
- Router CLI: `scripts/route-skills.ts`
- Validation script: `scripts/validate-skill-registry.ts`

## Registry model

Each entry in `skill-registry.json` includes:

- shard-aware metadata (`shard`, `shardPath`)
- risk tier (`low | medium | high | critical`)
- routing tags (`routingTags`)
- normalized tags (`tags`)
- quality score placeholders:
  - `qualityScore.score`
  - `qualityScore.confidence`
  - `qualityScore.lastEvaluatedAt`

Optional/missing fields in shard `implementation.json` are handled with safe defaults.

## Build registry

```bash
npx tsx scripts/build-skill-registry.ts
```

Example output:

```text
[build-skill-registry] wrote 1000 skills to .../skills/state/skill-registry.json (risk: low=0, medium=0, high=1000, critical=0)
```

## Validate registry

```bash
npx tsx scripts/validate-skill-registry.ts
```

Validation checks:

- schema sanity
- unique skill IDs
- deterministic sort order
- deterministic rebuild (disk registry must match regenerated registry)

## Route skills from a query

```bash
npx tsx scripts/route-skills.ts --query "need incident response comms strategy" --k 5
```

Output is JSON with ranked candidates and rationale, e.g.:

```json
{
  "query": "need incident response comms strategy",
  "requestedTopK": 5,
  "returned": 5,
  "results": [
    {
      "rank": 1,
      "score": 0.74,
      "skillId": 642,
      "skillName": "u0642-crisis-context-window-prioritizer",
      "title": "Crisis Context Window Prioritizer",
      "riskTier": "high",
      "routingTags": ["crisis-incident-response:real-time-decision-engine"],
      "rationale": "matched tokens: incident, response, strategy | routing tags: ... | risk tier: high | score: 0.740"
    }
  ]
}
```

## Notes

- Router reads `skills/state/skill-registry.json` if present.
- If registry is missing, router falls back to direct shard scan.
- Deterministic ranking tie-breakers:
  1. higher score
  2. lower skill ID
  3. lexicographic skill name
