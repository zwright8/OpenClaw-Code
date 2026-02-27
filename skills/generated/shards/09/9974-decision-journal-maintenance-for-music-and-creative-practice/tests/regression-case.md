# Regression Case: u09974-decision-journal-maintenance-for-music-and-creative-practice

- Input fixture: `../fixtures/minimal-valid.json`
- Expected gates: schema-gate, determinism-gate, policy-risk-gate pass.
- High-risk path: requires `approval-gate-high-risk` token; fail closed if absent.
- Determinism tolerance: score delta <= 0.005 and artifact hash drift = 0 on replay.
