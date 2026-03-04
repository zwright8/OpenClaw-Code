---
name: api-test-automation-toolkit
description: Test APIs and app interfaces with automation-first workflows. Use when validating HTTP contracts, running browser/mobile automation, linting API-facing code, or generating CI-ready test gates.
---

# API Test Automation Toolkit

Use this skill to move from endpoint checks to full regression suites across API, web, and mobile surfaces.

## Workflow Router

- Need plain-text HTTP regression tests -> hurl/httpx path.
- Need browser or mobile automation -> selenium/appium/geckodriver path.
- Need static analysis gates in CI -> flake8/isort/phpstan/staticcheck path.

## Playbook 1: Create API contract regression suite

1. Write reproducible request/response checks.
1. Run local and CI smoke/full profiles.
1. Fail fast on schema/status/body drift.

Command starters:
```bash
hurl --test api-smoke.hurl
httpx -u https://<host> -status-code -title
runme run tests/api.md
```

## Playbook 2: Automate UI and mobile flows

1. Start drivers and target environment.
1. Execute login/core-path journeys.
1. Collect screenshots/log artifacts for failures.

Command starters:
```bash
selenium-server standalone
geckodriver --port 4444
appium --port 4723
```

## Playbook 3: Enforce code quality gates

1. Run language-specific analyzers before merge.
1. Require clean lint/type/static outputs.
1. Promote only green builds to release branches.

Command starters:
```bash
flake8 src/
isort --check-only src/
staticcheck ./...
phpstan analyse
```

## Tool Inventory Reference

- Read `references/tool-map.csv` for the full rank-mapped tool list for this workflow cluster.
- Read `references/tool-notes.md` for quick top-tool guidance.
- Prefer tools already installed locally before suggesting new installs.

## Completion Checklist

- Confirm objective, scope, and target environment before running commands.
- Execute smallest safe test first, then expand to full workflow.
- Capture outputs (logs, reports, artifacts) and summarize follow-up actions.
