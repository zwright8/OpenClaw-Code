# AGENTS.md

## Purpose
This file captures grounded, repeatable workflows and commands used in this repository.

## Skill Marketplace Workflows
- Full marketplace ship pipeline: `npm run skills:marketplace:ship`
- Build v2 skill packages: `npm run skills:marketplace:v2:build`
- Validate v2 skill packages: `npm run skills:marketplace:v2:validate`
- Run v2 package demo: `npm run skills:marketplace:v2:demo`
- Generate marketplace analytics: `npm run skills:marketplace:analytics`
- Package marketplace release: `npm run skills:marketplace:release`
- Validate marketplace release: `npm run skills:marketplace:release:validate`

## Skill Hardening And Validation
- Build hardening profile inputs: `npm run skills:harden:profile`
- Apply hardening pass: `npm run skills:harden`
- Validate skill outputs: `npm run skills:validate`

## Basic Quality Check
- Run type checks across workspace packages: `npm run typecheck`

## TODO
- Merge these entries into the canonical AGENTS baseline if one exists outside this worktree.
