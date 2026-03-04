---
name: appsec-recon-audit-toolkit
description: Run application and infrastructure security reconnaissance and audit sweeps. Use when discovering attack surface, testing TLS exposure, finding leaked secrets, or running cloud/devsec compliance checks.
---

# AppSec Recon Audit Toolkit

Use this skill to execute scoped, authorized security assessments with reproducible evidence.

## Workflow Router

- Need internet-facing reconnaissance -> amass/subfinder/nikto/ffuf path.
- Need cryptography/TLS posture checks -> sslscan/testssl path.
- Need source and cloud security guardrails -> ggshield/detect-secrets/prowler path.

## Playbook 1: Map external attack surface

1. Enumerate subdomains and candidate hosts.
1. Probe web services for known misconfigurations.
1. Fuzz high-risk endpoints carefully within scope.

Command starters:
```bash
subfinder -d <domain> -o subdomains.txt
amass enum -d <domain>
nikto -h https://<target>
ffuf -u https://<target>/FUZZ -w wordlist.txt
```

## Playbook 2: Audit TLS and crypto posture

1. Scan certificate chains and enabled protocols.
1. Report weak ciphers and downgrade vectors.
1. Attach remediation guidance by environment.

Command starters:
```bash
sslscan <host>:443
testssl --fast <host>
```

## Playbook 3: Detect secrets and compliance gaps

1. Scan repo and commit history for secrets.
1. Run cloud control checks and prioritize critical findings.
1. Produce evidence pack with false-positive notes.

Command starters:
```bash
ggshield secret scan repo .
detect-secrets scan > .secrets.baseline
prowler aws --output-formats json
```

## Tool Inventory Reference

- Read `references/tool-map.csv` for the full rank-mapped tool list for this workflow cluster.
- Read `references/tool-notes.md` for quick top-tool guidance.
- Prefer tools already installed locally before suggesting new installs.

## Completion Checklist

- Confirm objective, scope, and target environment before running commands.
- Execute smallest safe test first, then expand to full workflow.
- Capture outputs (logs, reports, artifacts) and summarize follow-up actions.
