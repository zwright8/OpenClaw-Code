# Skill Runtime Rollout Optimization

Generated: 2026-02-26T05:23:56.100Z

## Recommendation
- Strategy: stabilize
- Current config: now=32, next=48, maxDomain=3
- Recommended config: now=26, next=38, maxDomain=2
- Selected config: now=32, next=40, maxDomain=3
- Effective config: now=32, next=48, maxDomain=3
- Promotion status: rejected
- Reasons: critical waves and/or elevated failure rate indicate excessive rollout blast radius

## Baseline vs Candidate
| Metric | Baseline | Candidate | Delta |
| --- | --- | --- | --- |
| Wave count | 13 | 14 | 1 |
| Total tasks | 1013 | 1014 | 1 |
| Failed tasks | 91 | 107 | 16 |
| Approval pending | 407 | 391 | -16 |
| Critical waves | 6 | 4 | -2 |
| Overall posture | critical | critical | - |
| Optimization score | 4557.36 | 4515.78 | -41.58 |

## Promotion Robustness
| Metric | Value | Policy |
| --- | --- | --- |
| Candidate win rate | 0.4211 | >= 0.55 |
| Weighted score delta | 78.2196 | <= 0.5 |
| Worst score delta | 892.72 | <= 45 |
| Avg failure-rate delta | -0.0019 | <= 0.01 |
| Avg critical-wave delta | 0.0125 | <= 0.15 |

### Robustness Scenarios
| Scenario | Trials | Weight | Avg Score Delta | Worst Score Delta | Win/Baseline/Tie | Avg Failure Delta | Avg Pending Delta | Avg Critical Delta |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| nominal | 4 | 0.3 | 419.645 | 892.72 | 0/4/0 | 0.01 | -0.011 | 1.25 |
| failure_spike | 4 | 0.25 | 92.97 | 271.22 | 1/3/0 | -0.0164 | 0.0129 | 1 |
| approval_backlog | 4 | 0.2 | -124.78 | 836.82 | 3/1/0 | -0.0046 | 0.0005 | -1.25 |
| mixed_pressure | 4 | 0.15 | 141.895 | 495.02 | 1/3/0 | 0.005 | -0.0076 | 0.25 |
| recovery_bias | 3 | 0.1 | -672.4467 | -545.78 | 3/0/0 | -0.0063 | -0.0129 | -4 |

## Promotion Violations
- candidate win-rate 0.4211 below required 0.55
- weighted score delta 78.2196 exceeds max 0.5
- worst-case score delta 892.72 exceeds max 45

## Delta Notes
- Stable wave delta: -1
- Degraded wave delta: 4
- Skipped task delta: -2
- Candidate configs evaluated: 17

## Top Candidate Scores
| Rank | Config (now/next/maxDomain) | Score | Overall Posture | Failed | Pending | Critical Waves |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 32/40/3 | 4515.78 | critical | 107 | 391 | 4 |
| 2 | 26/38/2 | 4552.42 | critical | 92 | 405 | 5 |
| 3 | 28/48/3 | 4683.18 | critical | 93 | 393 | 6 |
| 4 | 34/48/3 | 4884.96 | critical | 115 | 387 | 6 |
| 5 | 24/38/2 | 4960.54 | critical | 105 | 398 | 6 |
| 6 | 32/52/3 | 4983.86 | critical | 110 | 384 | 7 |
| 7 | 32/48/2 | 4985.4 | critical | 114 | 399 | 6 |
| 8 | 26/40/2 | 5039.72 | critical | 124 | 382 | 6 |
| 9 | 26/36/2 | 5104.74 | critical | 102 | 408 | 7 |
| 10 | 32/48/4 | 5198.86 | critical | 106 | 394 | 9 |
| 11 | 26/40/3 | 5208.2 | critical | 113 | 375 | 8 |
| 12 | 28/38/2 | 5279.02 | critical | 122 | 399 | 7 |

## Reason Digest
- critical waves and/or elevated failure rate indicate excessive rollout blast radius
