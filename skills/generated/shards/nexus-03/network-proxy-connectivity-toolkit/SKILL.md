---
name: network-proxy-connectivity-toolkit
description: Diagnose and operate network, proxy, and connectivity layers. Use when tracing DNS/routes, benchmarking links, configuring reverse proxies, or debugging socket/service reachability issues.
---

# Network Proxy Connectivity Toolkit

Use this skill to isolate network failures quickly across DNS, transport, proxy, and service layers.

## Workflow Router

- Need packet/DNS diagnostics -> tcpdump/doggo/ldns path.
- Need proxy or edge routing changes -> envoy/haproxy/squid path.
- Need tunnel or remote access checks -> autossh/frpc path.

## Playbook 1: Run layered connectivity triage

1. Resolve DNS and validate IP math/routes.
1. Capture packets around failing transactions.
1. List listening/open file descriptors for suspect process.

Command starters:
```bash
doggo <domain>
ipcalc <cidr>
tcpdump -i any host <ip>
lsof -i -P | grep <port>
```

## Playbook 2: Configure and test proxy/edge path

1. Apply candidate proxy config in staging.
1. Run health and throughput probes through proxy.
1. Promote only after latency/error budget checks pass.

Command starters:
```bash
haproxy -c -f haproxy.cfg
envoy --mode validate -c envoy.yaml
curl -x http://<proxy>:<port> https://example.com
```

## Playbook 3: Maintain resilient tunnels

1. Start monitored SSH/reverse tunnels.
1. Confirm remote endpoint exposure and ACL behavior.
1. Record fallback path for incident runbooks.

Command starters:
```bash
autossh -M 0 -N -L 127.0.0.1:9000:svc:9000 user@bastion
frpc -c frpc.toml
```

## Tool Inventory Reference

- Read `references/tool-map.csv` for the full rank-mapped tool list for this workflow cluster.
- Read `references/tool-notes.md` for quick top-tool guidance.
- Prefer tools already installed locally before suggesting new installs.

## Completion Checklist

- Confirm objective, scope, and target environment before running commands.
- Execute smallest safe test first, then expand to full workflow.
- Capture outputs (logs, reports, artifacts) and summarize follow-up actions.
