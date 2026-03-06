# External Stack Migration Checklist

Generated: 2026-03-05T07:20:46.995178+00:00

## Summary
- Skills analyzed: **10000**
- P0 migrations (tool-primary): **2900**
- P1 migrations (hybrid): **5275**
- P2 migrations (model-primary): **1825**
- Skills needing auth/session setup: **9015**
- Skills with likely API-key dependency: **5400**

## Class distribution
- tool-primary: **2900**
- hybrid: **5275**
- model-primary: **1825**

## Top P0 migration candidates (first 40)
- `u04601-a-b-rollout-governance-for-personal-health-routines` (a/b rollout governance) -> services: LaunchDarkly/Unleash | Statsig/Optimizely | SciPy/Statsmodels
- `u04602-a-b-rollout-governance-for-personal-health-routines` (a/b rollout governance) -> services: LaunchDarkly/Unleash | Statsig/Optimizely | SciPy/Statsmodels
- `u04603-a-b-rollout-governance-for-personal-health-routines` (a/b rollout governance) -> services: LaunchDarkly/Unleash | Statsig/Optimizely | SciPy/Statsmodels
- `u04604-a-b-rollout-governance-for-personal-health-routines` (a/b rollout governance) -> services: LaunchDarkly/Unleash | Statsig/Optimizely | SciPy/Statsmodels
- `u04605-a-b-rollout-governance-for-personal-health-routines` (a/b rollout governance) -> services: LaunchDarkly/Unleash | Statsig/Optimizely | SciPy/Statsmodels
- `u04606-a-b-rollout-governance-for-family-caregiving-systems` (a/b rollout governance) -> services: LaunchDarkly/Unleash | Statsig/Optimizely | SciPy/Statsmodels
- `u04607-a-b-rollout-governance-for-family-caregiving-systems` (a/b rollout governance) -> services: LaunchDarkly/Unleash | Statsig/Optimizely | SciPy/Statsmodels
- `u04608-a-b-rollout-governance-for-family-caregiving-systems` (a/b rollout governance) -> services: LaunchDarkly/Unleash | Statsig/Optimizely | SciPy/Statsmodels
- `u04609-a-b-rollout-governance-for-family-caregiving-systems` (a/b rollout governance) -> services: LaunchDarkly/Unleash | Statsig/Optimizely | SciPy/Statsmodels
- `u04610-a-b-rollout-governance-for-family-caregiving-systems` (a/b rollout governance) -> services: LaunchDarkly/Unleash | Statsig/Optimizely | SciPy/Statsmodels
- `u04611-a-b-rollout-governance-for-household-logistics` (a/b rollout governance) -> services: LaunchDarkly/Unleash | Statsig/Optimizely | SciPy/Statsmodels
- `u04612-a-b-rollout-governance-for-household-logistics` (a/b rollout governance) -> services: LaunchDarkly/Unleash | Statsig/Optimizely | SciPy/Statsmodels
- `u04613-a-b-rollout-governance-for-household-logistics` (a/b rollout governance) -> services: LaunchDarkly/Unleash | Statsig/Optimizely | SciPy/Statsmodels
- `u04614-a-b-rollout-governance-for-household-logistics` (a/b rollout governance) -> services: LaunchDarkly/Unleash | Statsig/Optimizely | SciPy/Statsmodels
- `u04615-a-b-rollout-governance-for-household-logistics` (a/b rollout governance) -> services: LaunchDarkly/Unleash | Statsig/Optimizely | SciPy/Statsmodels
- `u04616-a-b-rollout-governance-for-personal-finance-management` (a/b rollout governance) -> services: LaunchDarkly/Unleash | Statsig/Optimizely | SciPy/Statsmodels
- `u04617-a-b-rollout-governance-for-personal-finance-management` (a/b rollout governance) -> services: LaunchDarkly/Unleash | Statsig/Optimizely | SciPy/Statsmodels
- `u04618-a-b-rollout-governance-for-personal-finance-management` (a/b rollout governance) -> services: LaunchDarkly/Unleash | Statsig/Optimizely | SciPy/Statsmodels
- `u04619-a-b-rollout-governance-for-personal-finance-management` (a/b rollout governance) -> services: LaunchDarkly/Unleash | Statsig/Optimizely | SciPy/Statsmodels
- `u04620-a-b-rollout-governance-for-personal-finance-management` (a/b rollout governance) -> services: LaunchDarkly/Unleash | Statsig/Optimizely | SciPy/Statsmodels
- `u04621-a-b-rollout-governance-for-nutrition-and-meal-planning` (a/b rollout governance) -> services: LaunchDarkly/Unleash | Statsig/Optimizely | SciPy/Statsmodels
- `u04622-a-b-rollout-governance-for-nutrition-and-meal-planning` (a/b rollout governance) -> services: LaunchDarkly/Unleash | Statsig/Optimizely | SciPy/Statsmodels
- `u04623-a-b-rollout-governance-for-nutrition-and-meal-planning` (a/b rollout governance) -> services: LaunchDarkly/Unleash | Statsig/Optimizely | SciPy/Statsmodels
- `u04624-a-b-rollout-governance-for-nutrition-and-meal-planning` (a/b rollout governance) -> services: LaunchDarkly/Unleash | Statsig/Optimizely | SciPy/Statsmodels
- `u04625-a-b-rollout-governance-for-nutrition-and-meal-planning` (a/b rollout governance) -> services: LaunchDarkly/Unleash | Statsig/Optimizely | SciPy/Statsmodels
- `u04626-a-b-rollout-governance-for-fitness-and-recovery-training` (a/b rollout governance) -> services: LaunchDarkly/Unleash | Statsig/Optimizely | SciPy/Statsmodels
- `u04627-a-b-rollout-governance-for-fitness-and-recovery-training` (a/b rollout governance) -> services: LaunchDarkly/Unleash | Statsig/Optimizely | SciPy/Statsmodels
- `u04628-a-b-rollout-governance-for-fitness-and-recovery-training` (a/b rollout governance) -> services: LaunchDarkly/Unleash | Statsig/Optimizely | SciPy/Statsmodels
- `u04629-a-b-rollout-governance-for-fitness-and-recovery-training` (a/b rollout governance) -> services: LaunchDarkly/Unleash | Statsig/Optimizely | SciPy/Statsmodels
- `u04630-a-b-rollout-governance-for-fitness-and-recovery-training` (a/b rollout governance) -> services: LaunchDarkly/Unleash | Statsig/Optimizely | SciPy/Statsmodels
- `u04631-a-b-rollout-governance-for-mental-well-being-practices` (a/b rollout governance) -> services: LaunchDarkly/Unleash | Statsig/Optimizely | SciPy/Statsmodels
- `u04632-a-b-rollout-governance-for-mental-well-being-practices` (a/b rollout governance) -> services: LaunchDarkly/Unleash | Statsig/Optimizely | SciPy/Statsmodels
- `u04633-a-b-rollout-governance-for-mental-well-being-practices` (a/b rollout governance) -> services: LaunchDarkly/Unleash | Statsig/Optimizely | SciPy/Statsmodels
- `u04634-a-b-rollout-governance-for-mental-well-being-practices` (a/b rollout governance) -> services: LaunchDarkly/Unleash | Statsig/Optimizely | SciPy/Statsmodels
- `u04635-a-b-rollout-governance-for-mental-well-being-practices` (a/b rollout governance) -> services: LaunchDarkly/Unleash | Statsig/Optimizely | SciPy/Statsmodels
- `u04636-a-b-rollout-governance-for-lifelong-learning-plans` (a/b rollout governance) -> services: LaunchDarkly/Unleash | Statsig/Optimizely | SciPy/Statsmodels
- `u04637-a-b-rollout-governance-for-lifelong-learning-plans` (a/b rollout governance) -> services: LaunchDarkly/Unleash | Statsig/Optimizely | SciPy/Statsmodels
- `u04638-a-b-rollout-governance-for-lifelong-learning-plans` (a/b rollout governance) -> services: LaunchDarkly/Unleash | Statsig/Optimizely | SciPy/Statsmodels
- `u04639-a-b-rollout-governance-for-lifelong-learning-plans` (a/b rollout governance) -> services: LaunchDarkly/Unleash | Statsig/Optimizely | SciPy/Statsmodels
- `u04640-a-b-rollout-governance-for-lifelong-learning-plans` (a/b rollout governance) -> services: LaunchDarkly/Unleash | Statsig/Optimizely | SciPy/Statsmodels

## Files
- Per-skill matrix: `reports/external-stack-migration-by-skill.csv`
