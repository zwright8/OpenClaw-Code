# Skill Runtime Rollout Optimization

Generated: 2026-02-26T05:13:14.514Z

## Recommendation
- Strategy: stabilize
- Current config: now=32, next=48, maxDomain=3
- Recommended config: now=26, next=38, maxDomain=2
- Selected config: now=32, next=40, maxDomain=3
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

## Observed Metrics
| Metric | Value | Target |
| --- | --- | --- |
| Failure rate | 0.0898 | 0.0698 |
| Approval pending rate | 0.4018 | 0.3218 |
| Avg wave fill rate | 0.842 | 0.812 |
| Critical waves | 6 | n/a |
| Degraded waves | 4 | n/a |

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
