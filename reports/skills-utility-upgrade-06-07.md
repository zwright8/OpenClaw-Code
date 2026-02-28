# Skills Utility Upgrade Report — Shards 06 & 07

## Scope
- Updated only:
  - `skills/generated/shards/06/**/SKILL.md`
  - `skills/generated/shards/07/**/SKILL.md`
- Added report artifacts:
  - `reports/skills-utility-upgrade-06-07.md`
  - `reports/skills-utility-upgrade-06-07.json`

## Objective
Standardize every SKILL.md in lanes 06 and 07 for practical operator usability and machine-friendly execution contracts.

## Standardized Sections Added/Normalized
Each SKILL.md now includes:
1. `Metadata`
2. `Allowed Tools`
3. `Inputs (formatted)`
4. `Outputs (formatted)`
5. `Guidelines`
6. `Musts`
7. `Targets (day/week/month operating cadence)`
8. `Common Actions`
9. `External Tool Calls Needed`
10. `Validation & Handoff`

## Implementation Notes
- Preserved existing frontmatter (`name`, `description`) for each skill.
- Regenerated body content with a consistent, deterministic template focused on:
  - day-to-day execution clarity
  - weekly quality tuning
  - monthly re-baselining
  - explicit validation and handoff contract
- Domain/capability labels were inferred from existing title/description fields.

## Upgrade Counts
- Lane 06 SKILL.md upgraded: **1000**
- Lane 07 SKILL.md upgraded: **1000**
- Total SKILL.md upgraded: **2000**

## Compliance Checks
- Required sections present in all target files: **pass**
- Out-of-scope file edits intentionally made by this task: **none** (except this report pair)

## Required Repo Validations
Run after changes:
- `npm run -s skills:validate`
- `npx tsx scripts/validate-10000-skill-improvements.ts`

(Validation command outcomes captured in git commit workflow.)
