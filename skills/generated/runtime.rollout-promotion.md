# Skill Runtime Rollout Promotion Decision

Generated: 2026-02-26T05:41:05.084Z
Status: rejected
Strategy: stabilize
Selected config: 32/40/3
Effective config: 32/48/3

## Policy
- minCandidateWinRate: 0.55
- maxWeightedScoreDelta: 0.5
- maxWorstScoreDelta: 45
- maxAvgFailureRateDelta: 0.01
- maxAvgCriticalWaveDelta: 0.15

## Robustness Aggregate
- Trials: 19
- Candidate win rate: 0.4211
- Weighted score delta: 78.2196
- Worst score delta: 892.72
- Avg failure-rate delta: -0.0019
- Avg approval-pending delta: -0.0024
- Avg critical-wave delta: 0.0125

## Violations
- candidate win-rate 0.4211 below required 0.55
- weighted score delta 78.2196 exceeds max 0.5
- worst-case score delta 892.72 exceeds max 45

## Rationale
- strategy=stabilize
- robustness trials=19 across 5 scenarios
- weightedScoreDelta=78.2196, winRate=0.4211
- candidate rejected by promotion policy; baseline config retained
