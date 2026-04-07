# Enterprise Launch Runbook

## Purpose

Launch the first production version of the OpenClaw-powered enterprise as a private control plane for an API-native software business.

This runbook is intentionally practical:

- it uses the code that exists in this repo today
- it avoids pretending the repo is already a public web app
- it keeps the first production topology simple and safe

## What You Are Actually Hosting

This repo is the enterprise control plane, not the customer-facing product.

In phase one, host the enterprise as four separate layers:

1. Customer-facing product
   - your SaaS app, API, or digital service
2. OpenClaw control plane
   - this repo
   - planning, queueing, approvals, routing, journaling, and learning
3. World-simulation sidecar
   - `MiroFish` behind the `agent:world-sim` boundary
4. Systems of record
   - billing, CRM, support, contracts, knowledge base, notifications

## First Production Topology

For the current repo, the safest first deployment is:

- one private Linux host for OpenClaw
- one separate public host for the customer-facing product
- one separate isolated host or container for `MiroFish` when you are ready
- managed SaaS systems for billing, CRM, support, contracts, and notifications

Why this is the right first move:

- the repo is currently CLI-driven and file-backed
- `cognition-core` and `swarm-protocol` already run well as scheduled jobs
- a single scheduled autonomous runner is safer than multiple concurrent writers against one JSONL task journal
- the control plane does not need public HTTP ingress yet

## Step-By-Step Launch Procedure

### 1. Lock the enterprise scope

Start with a digital business that is easy to automate:

- one product
- one ICP
- one revenue motion
- one support channel

For launch, automate only these loops:

1. `lead_to_cash`
2. `issue_to_resolution`
3. `idea_to_launch`

Hold treasury, contract-sign authority, and pricing changes behind approvals until the department agents exist.

### 2. Provision the first control-plane host

Create one Ubuntu LTS VM or equivalent Linux host.

Recommended posture:

- private host
- outbound internet access enabled
- inbound access limited to SSH
- persistent disk mounted for `/var/lib/openclaw`

The control-plane host should not be internet-facing. Public ingress belongs on the product app and any future adapter APIs.

### 3. Prepare the machine

Run this as `root` once:

```bash
useradd --create-home --shell /bin/bash openclaw
mkdir -p /opt/openclaw /var/lib/openclaw/state /var/lib/openclaw/reports /var/lib/openclaw/logs /etc/openclaw
touch /var/lib/openclaw/state/operator-audit.jsonl
chown -R openclaw:openclaw /opt/openclaw /var/lib/openclaw
```

Install the base runtime:

- `git`
- `node`
- `npm`

Node `20+` is the safest baseline for the current toolchain.

### 4. Clone the repo and install dependencies

Run this as the `openclaw` user:

```bash
cd /opt/openclaw
git clone <YOUR_OPENCLAW_REMOTE> OpenClaw-Code
cd OpenClaw-Code
npm install
npm --prefix cognition-core ci
npm --prefix swarm-protocol ci
```

### 5. Generate the control-plane artifacts

Still as `openclaw`, build the deployability artifacts the autonomous runner expects:

```bash
cd /opt/openclaw/OpenClaw-Code
npm run typecheck
npm run skills:harden:profile
npm run skills:harden
```

Then verify the enterprise-specific runtime surfaces:

```bash
cd /opt/openclaw/OpenClaw-Code
npx tsx --test swarm-protocol/test/world-sim-contracts.test.ts
npx tsx --test swarm-protocol/test/enterprise-autonomy.test.ts
```

Current repo note:

- `npm run build` is not the best first gate for hosting right now because `swarm-protocol` still has unrelated pre-existing unit-test failures outside the enterprise additions
- `npm run typecheck` plus the targeted enterprise tests above is the cleanest launch gate today

### 6. Create the production environment file

Copy the template that ships with this repo:

```bash
sudo cp /opt/openclaw/OpenClaw-Code/deploy/systemd/openclaw.env.example /etc/openclaw/openclaw.env
sudo chmod 600 /etc/openclaw/openclaw.env
```

Edit `/etc/openclaw/openclaw.env` and set at minimum:

```bash
SWARM_AUDIT_SECRET=<long-random-secret>
```

This secret is required for signed operator audit actions such as approval overrides, reroutes, and drain operations.

### 7. Install the scheduled autonomous runner

This repo is safest on a single-writer model at first.

That means:

- one scheduled `autonomous:run`
- no separate always-on `worker:loop` against the same task journal unless you first move to a concurrency-safe shared store

Install the provided systemd files:

```bash
sudo cp /opt/openclaw/OpenClaw-Code/deploy/systemd/openclaw-autonomous.service /etc/systemd/system/
sudo cp /opt/openclaw/OpenClaw-Code/deploy/systemd/openclaw-autonomous.timer /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now openclaw-autonomous.timer
```

The timer is the production scheduler. The service itself runs one autonomous wave and exits cleanly.

### 8. Force the first run and inspect it

Run one cycle immediately:

```bash
sudo systemctl start openclaw-autonomous.service
sudo journalctl -u openclaw-autonomous.service -n 200 --no-pager
```

Then inspect the queue and audit state from the repo:

```bash
cd /opt/openclaw/OpenClaw-Code
npm --prefix swarm-protocol run ops -- status --store /var/lib/openclaw/state/tasks.journal.jsonl --audit /var/lib/openclaw/state/operator-audit.jsonl
npm --prefix swarm-protocol run ops -- queue --limit 10 --store /var/lib/openclaw/state/tasks.journal.jsonl --audit /var/lib/openclaw/state/operator-audit.jsonl
npm --prefix swarm-protocol run ops -- queue --approvals --store /var/lib/openclaw/state/tasks.journal.jsonl --audit /var/lib/openclaw/state/operator-audit.jsonl
```

Expected production artifacts:

- `/var/lib/openclaw/state/tasks.journal.jsonl`
- `/var/lib/openclaw/state/outbox/`
- `/var/lib/openclaw/reports/autonomous-openclaw/report.json`
- `/var/lib/openclaw/reports/autonomous-openclaw/report.md`
- `/var/lib/openclaw/reports/autonomous-openclaw/state.json`

### 9. Host the customer-facing product separately

Do not collapse the product app into this repo.

Host the actual business product as a separate service with its own:

- API
- web frontend
- database
- authentication
- observability

Then let OpenClaw manage the business around that product:

- sales and pipeline orchestration
- support triage and escalation
- product and engineering planning
- governance and approvals
- simulation before major decisions

### 10. Add the systems of record

Next, connect the enterprise systems that the department swarms will eventually control:

- billing
- CRM
- support
- contracts
- knowledge base
- internal communications

At this stage, prefer read-heavy integrations first, then carefully add write permissions behind approval policy.

### 11. Add the world-simulation sidecar

When ready, deploy `MiroFish` as a separate service and keep the boundary described in [MIROFISH_INTEGRATION_PLAN.md](./MIROFISH_INTEGRATION_PLAN.md):

- OpenClaw decides what to simulate
- `agent:world-sim` translates task contracts into provider calls
- `MiroFish` builds the graph, prepares the world, runs simulations, and returns reports

For the first production rollout, only enable:

1. `build_world_graph`

Do not let simulation outputs directly trigger treasury, contract, or production actions.

### 12. Add operator safeguards before true autonomy

Before calling this an autonomous enterprise, confirm all of these:

- backups exist for `/var/lib/openclaw`
- the autonomous timer can be disabled quickly
- `SWARM_AUDIT_SECRET` is stored securely
- approvals are reviewed daily
- model/provider keys can be revoked quickly
- customer-facing write actions are policy-gated
- financial actions are approval-gated

Fast stop procedure:

```bash
sudo systemctl disable --now openclaw-autonomous.timer
sudo systemctl stop openclaw-autonomous.service
```

### 13. Day-2 operating procedure

For every deploy:

1. disable the timer
2. pull the new repo version
3. rerun `npm run typecheck`
4. rerun `npm run skills:harden:profile`
5. rerun `npm run skills:harden`
6. restart the service manually once
7. inspect reports and queue state
8. re-enable the timer

Example:

```bash
sudo systemctl disable --now openclaw-autonomous.timer
cd /opt/openclaw/OpenClaw-Code
git pull --ff-only
npm install
npm --prefix cognition-core ci
npm --prefix swarm-protocol ci
npm run typecheck
npm run skills:harden:profile
npm run skills:harden
sudo systemctl start openclaw-autonomous.service
sudo journalctl -u openclaw-autonomous.service -n 200 --no-pager
sudo systemctl enable --now openclaw-autonomous.timer
```

## What This Launch Gives You Today

This runbook gives you a hostable first version of:

- autonomous planning waves
- bounded queue execution
- signed operator controls
- persistent reports and state
- a stable path to bolt on department agents and `MiroFish`

## What Still Must Be Built Before The Enterprise Is Truly End-To-End

This repo does not yet contain production workers for:

- `agent:revenue-ops`
- `agent:customer-success`
- `agent:finance`
- `agent:contracts`
- `agent:world-sim` adapter implementation

That means the right way to describe this launch is:

- production-ready autonomous control plane bootstrap
- not yet a finished fully automated enterprise

## Related Docs

- [ENTERPRISE_AUTONOMY_BLUEPRINT.md](./ENTERPRISE_AUTONOMY_BLUEPRINT.md)
- [MIROFISH_INTEGRATION_PLAN.md](./MIROFISH_INTEGRATION_PLAN.md)
- [OPENCLAW_ARCHITECTURE_VNEXT.md](./OPENCLAW_ARCHITECTURE_VNEXT.md)
