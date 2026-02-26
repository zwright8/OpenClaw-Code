# Skill Runtime Rollout Control Run

Generated: 2026-02-26T05:23:55.345Z
Source wave plan: 2026-02-26T05:23:54.740Z

## Summary
- Total tasks: 1013
- Success: 503
- Failed: 91
- Approval pending: 407
- Skipped: 12
- Overall posture: critical
- Follow-up tasks generated: 401

## Wave Health
| Wave | Lane | Tasks | Success | Failed | Pending | Failure Rate | Avg Latency (ms) | Posture |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| next-01 | next | 49 | 41 | 4 | 4 | 0.0816 | 18386 | degraded |
| next-02 | next | 49 | 39 | 3 | 6 | 0.0612 | 17380 | degraded |
| next-03 | next | 49 | 30 | 8 | 11 | 0.1633 | 18822 | critical |
| next-04 | next | 49 | 36 | 5 | 7 | 0.102 | 15729 | critical |
| next-05 | next | 49 | 34 | 5 | 9 | 0.102 | 16286 | critical |
| next-06 | next | 49 | 36 | 7 | 5 | 0.1429 | 18930 | critical |
| next-07 | next | 49 | 35 | 6 | 7 | 0.1224 | 15715 | critical |
| next-08 | next | 9 | 6 | 0 | 3 | 0 | 19429 | degraded |
| now-01 | now | 33 | 30 | 0 | 3 | 0 | 15526 | stable |
| now-02 | now | 33 | 26 | 3 | 4 | 0.0909 | 15784 | degraded |
| now-03 | now | 33 | 22 | 7 | 4 | 0.2121 | 18957 | critical |
| now-04 | now | 22 | 20 | 1 | 1 | 0.0455 | 16131 | stable |
| now-05 | now | 5 | 5 | 0 | 0 | 0 | 17689 | stable |

## Top Failing Tasks
| Task ID | Category | Skill ID | Wave | Reason |
| --- | --- | --- | --- | --- |
| `wave-now-02-0861` | skill | 861 | now-02 | deployment workflow failed runtime checks |
| `wave-now-02-0932` | skill | 932 | now-02 | deployment workflow failed runtime checks |
| `wave-now-02-0057` | skill | 57 | now-02 | deployment workflow failed runtime checks |
| `wave-now-03-0032` | skill | 32 | now-03 | deployment workflow failed runtime checks |
| `wave-now-03-0340` | skill | 340 | now-03 | deployment workflow failed runtime checks |
| `wave-now-03-0380` | skill | 380 | now-03 | deployment workflow failed runtime checks |
| `wave-now-03-0486` | skill | 486 | now-03 | deployment workflow failed runtime checks |
| `wave-now-03-0643` | skill | 643 | now-03 | deployment workflow failed runtime checks |
| `wave-now-03-0682` | skill | 682 | now-03 | deployment workflow failed runtime checks |
| `wave-now-03-0705` | skill | 705 | now-03 | deployment workflow failed runtime checks |
| `wave-now-04-0769` | skill | 769 | now-04 | deployment workflow failed runtime checks |
| `wave-next-01-0103` | skill | 103 | next-01 | deployment workflow failed runtime checks |
| `wave-next-01-0157` | skill | 157 | next-01 | deployment workflow failed runtime checks |
| `wave-next-01-0324` | skill | 324 | next-01 | deployment workflow failed runtime checks |
| `wave-next-01-0625` | skill | 625 | next-01 | deployment workflow failed runtime checks |
| `wave-next-02-0738` | skill | 738 | next-02 | deployment workflow failed runtime checks |
| `wave-next-02-0853` | skill | 853 | next-02 | deployment workflow failed runtime checks |
| `wave-next-02-0252` | skill | 252 | next-02 | deployment workflow failed runtime checks |
| `wave-next-03-0151` | skill | 151 | next-03 | deployment workflow failed runtime checks |
| `wave-next-03-0579` | skill | 579 | next-03 | deployment workflow failed runtime checks |
| `wave-next-03-0239` | skill | 239 | next-03 | deployment workflow failed runtime checks |
| `wave-next-03-0561` | skill | 561 | next-03 | deployment workflow failed runtime checks |
| `wave-next-03-0116` | skill | 116 | next-03 | deployment workflow failed runtime checks |
| `wave-next-03-0207` | skill | 207 | next-03 | deployment workflow failed runtime checks |
| `wave-next-03-0638` | skill | 638 | next-03 | deployment workflow failed runtime checks |
| `wave-next-03-0047` | skill | 47 | next-03 | deployment workflow failed runtime checks |
| `wave-next-04-0108` | skill | 108 | next-04 | deployment workflow failed runtime checks |
| `wave-next-04-0193` | skill | 193 | next-04 | deployment workflow failed runtime checks |
| `wave-next-04-0218` | skill | 218 | next-04 | deployment workflow failed runtime checks |
| `wave-next-04-0368` | skill | 368 | next-04 | deployment workflow failed runtime checks |
| `wave-next-04-0544` | skill | 544 | next-04 | deployment workflow failed runtime checks |
| `wave-next-05-0069` | skill | 69 | next-05 | deployment workflow failed runtime checks |
| `wave-next-05-0320` | skill | 320 | next-05 | deployment workflow failed runtime checks |
| `wave-next-05-0875` | skill | 875 | next-05 | deployment workflow failed runtime checks |
| `wave-next-05-0254` | skill | 254 | next-05 | deployment workflow failed runtime checks |
| `wave-next-05-0566` | skill | 566 | next-05 | deployment workflow failed runtime checks |
| `wave-next-06-0384` | skill | 384 | next-06 | deployment workflow failed runtime checks |
| `wave-next-06-0904` | skill | 904 | next-06 | deployment workflow failed runtime checks |
| `wave-next-06-0943` | skill | 943 | next-06 | deployment workflow failed runtime checks |
| `wave-next-06-0982` | skill | 982 | next-06 | deployment workflow failed runtime checks |
| `wave-next-06-0141` | skill | 141 | next-06 | deployment workflow failed runtime checks |
| `wave-next-06-0206` | skill | 206 | next-06 | deployment workflow failed runtime checks |
| `wave-next-06-0310` | skill | 310 | next-06 | deployment workflow failed runtime checks |
| `wave-next-07-0706` | skill | 706 | next-07 | deployment workflow failed runtime checks |
| `wave-next-07-0992` | skill | 992 | next-07 | deployment workflow failed runtime checks |
| `wave-next-07-0436` | skill | 436 | next-07 | deployment workflow failed runtime checks |
| `wave-next-07-0273` | skill | 273 | next-07 | deployment workflow failed runtime checks |
| `wave-next-07-0403` | skill | 403 | next-07 | deployment workflow failed runtime checks |
| `wave-next-07-0455` | skill | 455 | next-07 | deployment workflow failed runtime checks |
| `oversight-0085` | oversight | 85 | - | oversight escalation processing failed |
| `oversight-0995` | oversight | 995 | - | oversight escalation processing failed |
| `oversight-0228` | oversight | 228 | - | oversight escalation processing failed |
| `oversight-0046` | oversight | 46 | - | oversight escalation processing failed |
| `oversight-0348` | oversight | 348 | - | oversight escalation processing failed |
| `oversight-0463` | oversight | 463 | - | oversight escalation processing failed |
| `oversight-0621` | oversight | 621 | - | oversight escalation processing failed |
| `oversight-0866` | oversight | 866 | - | oversight escalation processing failed |
| `oversight-0307` | oversight | 307 | - | oversight escalation processing failed |
| `oversight-0439` | oversight | 439 | - | oversight escalation processing failed |
| `oversight-0528` | oversight | 528 | - | oversight escalation processing failed |
| `oversight-0829` | oversight | 829 | - | oversight escalation processing failed |
| `oversight-0836` | oversight | 836 | - | oversight escalation processing failed |
| `oversight-0504` | oversight | 504 | - | oversight escalation processing failed |
| `oversight-0417` | oversight | 417 | - | oversight escalation processing failed |
| `oversight-0521` | oversight | 521 | - | oversight escalation processing failed |
| `oversight-0716` | oversight | 716 | - | oversight escalation processing failed |
| `oversight-0183` | oversight | 183 | - | oversight escalation processing failed |
| `oversight-0415` | oversight | 415 | - | oversight escalation processing failed |
| `oversight-0824` | oversight | 824 | - | oversight escalation processing failed |
| `oversight-0978` | oversight | 978 | - | oversight escalation processing failed |
| `oversight-0044` | oversight | 44 | - | oversight escalation processing failed |
| `oversight-0106` | oversight | 106 | - | oversight escalation processing failed |
| `oversight-0197` | oversight | 197 | - | oversight escalation processing failed |
| `oversight-0214` | oversight | 214 | - | oversight escalation processing failed |
| `oversight-0275` | oversight | 275 | - | oversight escalation processing failed |
| `oversight-0301` | oversight | 301 | - | oversight escalation processing failed |
| `oversight-0331` | oversight | 331 | - | oversight escalation processing failed |
| `oversight-0473` | oversight | 473 | - | oversight escalation processing failed |
| `oversight-0627` | oversight | 627 | - | oversight escalation processing failed |
| `oversight-0630` | oversight | 630 | - | oversight escalation processing failed |
| `oversight-0724` | oversight | 724 | - | oversight escalation processing failed |
| `oversight-0841` | oversight | 841 | - | oversight escalation processing failed |
| `oversight-0941` | oversight | 941 | - | oversight escalation processing failed |
| `oversight-0981` | oversight | 981 | - | oversight escalation processing failed |
| `oversight-0353` | oversight | 353 | - | oversight escalation processing failed |
| `oversight-0542` | oversight | 542 | - | oversight escalation processing failed |
| `oversight-0860` | oversight | 860 | - | oversight escalation processing failed |
| `oversight-0964` | oversight | 964 | - | oversight escalation processing failed |
| `oversight-0208` | oversight | 208 | - | oversight escalation processing failed |
| `oversight-0741` | oversight | 741 | - | oversight escalation processing failed |
| `oversight-0832` | oversight | 832 | - | oversight escalation processing failed |
