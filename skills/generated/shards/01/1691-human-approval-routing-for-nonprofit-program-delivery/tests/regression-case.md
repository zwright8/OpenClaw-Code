# Regression Case — u01691-human-approval-routing-for-nonprofit-program-delivery

## Objective
Verify deterministic tolerance, fail-closed gates, and high-risk human sign-off requirements.

## Steps
1. Run baseline execution with `fixtures/minimal-valid.json`; confirm all gates pass.
2. Replay identical input; assert absolute score delta <= 0.005 and artifact hash drift == 0.
3. Inject schema violation (remove `inputs.signals`) and verify schema-gate blocks output.
4. Force determinism breach (>0.005) and verify determinism-gate quarantines run.
5. Set `risk_tier=high` without sign-off token and verify approval-gate-high-risk fails closed.
6. Provide explicit sign-off token and verify routing unlocks with complete handoff envelope.
