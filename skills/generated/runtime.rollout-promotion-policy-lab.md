# Skill Runtime Promotion Policy Lab

Generated: 2026-02-26T05:39:52.304Z
Drift level: stable
Sample size: 1
Baseline score: 174.614
Recommended score: 172.86
Score delta: -1.754

## Policy Decision
- Baseline policy: winRate>=0.55, maxWeighted=0.5, maxWorst=45
- Recommended policy: winRate>=0.575, maxWeighted=0.18, maxWorst=39

## Variants
| Rank | Variant | Score | Failure | Pending | Success | Win Rate | Rejection |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | tighten_medium | 172.86 | 0.0424 | 0.114 | 0.8376 | 0.4246 | 1 |
| 2 | quality_focus | 173.205 | 0.0434 | 0.1127 | 0.8375 | 0.4239 | 1 |
| 3 | relax_medium | 173.3 | 0.0566 | 0.0999 | 0.8352 | 0.4175 | 0.946 |
| 4 | throughput_focus | 173.7 | 0.0538 | 0.1021 | 0.8358 | 0.4186 | 0.9628 |
| 5 | tighten_small | 173.903 | 0.0455 | 0.1099 | 0.8373 | 0.4225 | 1 |
| 6 | relax_small | 173.993 | 0.0517 | 0.1038 | 0.8362 | 0.4195 | 0.9753 |
| 7 | baseline | 174.614 | 0.0476 | 0.1071 | 0.837 | 0.4211 | 1 |

## Assumptions
- projections are derived from recent promotion history averages and deterministic policy deltas
- drift level acts as a directional bias and not as a deterministic future guarantee
- lower lab score indicates a better tradeoff between reliability, governance load, and adoption risk

## Top Variant Rationale
- minCandidateWinRate +0.025
- maxWeightedScoreDelta -0.32
- maxWorstScoreDelta -6
- maxAvgFailureRateDelta -0.002
- maxAvgCriticalWaveDelta -0.016
- projected failure=0.0424, pending=0.114, success=0.8376
- projected candidateWinRate=0.4246, rejectionRate=1
