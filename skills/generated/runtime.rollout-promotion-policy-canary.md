# Skill Runtime Promotion Policy Canary

Generated: 2026-02-26T05:47:46.859Z
Decision: adopt
Confidence: 0.75
Drift level: stable
Sample size: 4
Scenario count: 5
Score delta: -3.956

## Weighted Deltas
- Failure delta: -0.0058
- Approval pending delta: 0.0082
- Success delta: 0.0125
- Candidate win-rate delta: 0.0048

## Decision Reasons
- candidate policy improves canary score with no meaningful guardrail regressions
- weighted deltas failure=-0.0058, pending=0.0082, success=0.0125
- weighted score delta=-3.956 across 5 canary scenarios

## Scenario Matrix
| Scenario | Weight | Score Delta | Breaches | Baseline Failure | Candidate Failure | Baseline Pending | Candidate Pending |
| --- | --- | --- | --- | --- | --- | --- | --- |
| nominal | 0.32 | -4.319 | none | 0.0476 | 0.0418 | 0.1071 | 0.1153 |
| traffic_spike | 0.22 | -3.884 | none | 0.0596 | 0.0538 | 0.1221 | 0.1303 |
| approval_burst | 0.2 | -3.344 | none | 0.0548 | 0.049 | 0.1761 | 0.1843 |
| incident_backpressure | 0.18 | -3.764 | none | 0.0632 | 0.0574 | 0.1266 | 0.1348 |
| recovery_window | 0.08 | -4.664 | none | 0.038 | 0.0322 | 0.0951 | 0.1033 |
