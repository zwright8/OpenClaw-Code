---
name: performance-observability-toolkit
description: Measure performance and operational health across services, hosts, and networks. Use when load testing APIs, benchmarking IO/CPU, collecting metrics/logs, or triaging regressions from telemetry.
---

# Performance Observability Toolkit

Use this skill to run benchmark-to-observability loops and convert findings into measurable SLO actions.

## Workflow Router

- Need HTTP/service load tests -> wrk/hey/oha/locust path.
- Need host-level bottleneck checks -> fio/nvtop/gdu path.
- Need ongoing telemetry pipelines -> telegraf/fluent-bit/node_exporter path.

## Playbook 1: Run repeatable API load tests

1. Set baseline latency and throughput.
1. Run controlled ramp with representative payloads.
1. Capture p50/p95/error rates for comparison.

Command starters:
```bash
hey -z 60s -c 50 https://<api>/health
wrk -t4 -c100 -d60s https://<api>/endpoint
oha -z 30s --latency-correction https://<api>/endpoint
```

## Playbook 2: Benchmark host and storage performance

1. Measure disk IO under expected access patterns.
1. Monitor CPU/GPU/process pressure during tests.
1. Document hardware limits and safe envelopes.

Command starters:
```bash
fio --name=randrw --rw=randrw --size=1G --runtime=60
nvtop
gnu-time -v <command>
```

## Playbook 3: Establish observability pipeline

1. Export node metrics.
1. Ship logs/metrics with parsers and tags.
1. Validate dashboards and alerts post-deploy.

Command starters:
```bash
node_exporter
telegraf --config telegraf.conf
fluent-bit -c fluent-bit.conf
```

## Tool Inventory Reference

- Read `references/tool-map.csv` for the full rank-mapped tool list for this workflow cluster.
- Read `references/tool-notes.md` for quick top-tool guidance.
- Prefer tools already installed locally before suggesting new installs.

## Completion Checklist

- Confirm objective, scope, and target environment before running commands.
- Execute smallest safe test first, then expand to full workflow.
- Capture outputs (logs, reports, artifacts) and summarize follow-up actions.
