---
name: arctic-denied-comms-polar-orbit-handover-cell
description: Support Arctic denied-communications planning for polar-orbit handovers when high-latitude mission traffic must shift across orbital paths with minimal timing loss.
---

# Arctic Denied Comms Polar Orbit Handover Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in Arctic and high-latitude denied-comms environments.
- Confirm echelon, orbital or SATCOM dependencies, timing authorities, available fallback paths, and decision timeline before generating recommendations.
- Keep products unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the mission problem with comms outages, orbital geometry, timing trust, weather or terrain effects, and branch triggers.
2. Build a recommended path and at least two alternates with explicit tradeoffs in latency, survivability, attribution confidence, and command continuity.
3. Bind each branch to concrete external tools, protocol families, and degraded-mode routes with freshness and acknowledgment requirements.
4. Map tool outputs to commander decisions, communications-release gates, and staff tasks with suspense times.
5. Publish a commander summary plus a machine-ingestible execution matrix for handover sequencing and fallback triggers.

## Required Output Format

1. Situation snapshot.
2. Recommended handover branch.
3. Alternate branches and trigger conditions.
4. Decision points now, next, and pre-delegated.
5. Staff tasking and suspense.
6. Tool and protocol execution matrix.

## Domain Products

Primary products for this skill: polar handover timeline, denied-comms fallback matrix, timing-integrity confidence board.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-polar-orbit-handover-v1` with `protocol_stack_id=ps-polar-orbit-handover-stack-v1`.
- Alternate: `tool_suite_id=ts-joint-c2-fusion-v1` with `protocol_stack_id=ps-joint-tactical-link-stack-v1`.
- Degraded: authenticated voice or text readback, UTC acknowledgment ledger, and manual relay board.

## External Tool Stack and Protocols

- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and `../_shared/references/joint-operations-external-toolchain-profiles.md`.
- Prefer `toolchain_profile_id=space-satcom-resilience-v1` when SATCOM continuity is the primary mission thread.
- Preferred tools: SATCOM path managers, orbital pass predictors, timing-integrity monitors, Arctic relay dashboards, cross-check audit ledgers.
- Preferred protocol families: `CCSDS`, `USMTF`, `API/JSON`, `Link 16 J-series`.
- Include provenance fields in every critical branch: `source_system`, `refresh_utc`, `confidence`, `ack_chain_status`, and `fallback_path`.

## Domain Packet Defaults

- Default packet IDs: `DPL-POLAR-HANDOVER-001`, `DPL-ORBIT-PNT-001`.
- If no packet fully matches the mission geometry or pathing constraints, define a provisional packet using the shared schema and assign a validation owner.

## Tool Invocation Contract

- For each dependency include: objective, required inputs, query or action template, expected output schema, transport, timeout, retry, and fallback path.
- Explicitly link each tool output to a handover decision, timing release gate, and a comms lead or watchstander owner.
- If timing confidence or path assurance falls below threshold, mark recommendations `provisional` and issue a degraded-mode branch immediately.

## Authority and Assurance Gates

- Apply approval and escalation requirements from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before publishing high-impact recommendations.
- Separate facts, assessed judgments, assumptions, and unknowns.
- If authority, legal basis, or acknowledgment integrity is uncertain, downgrade to advisory-only with explicit commander prompts.
