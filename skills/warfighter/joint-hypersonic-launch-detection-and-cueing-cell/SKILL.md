---
name: joint-hypersonic-launch-detection-and-cueing-cell
description: Fuse multi-sensor hypersonic launch indications into commander-ready cueing recommendations. Use when warning timelines are compressed and cross-domain cue dissemination must stay synchronized and auditable.
---

# Joint Hypersonic Launch Detection and Cueing Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter operations.
- Confirm authority, data classification, response timeline, and engagement constraints.
- Keep outputs unclassified unless handling guidance is provided.

## Workflow

1. Build a launch-confidence timeline from independent sensor sources.
2. Compare cueing options by latency, confidence, and engagement utility.
3. Produce primary and degraded cue paths with acknowledgment checkpoints.
4. Bind each recommendation to explicit authorities and human approval gates.

## Required Output Format

1. Situation snapshot.
2. Recommended cueing path.
3. Alternate/degraded cueing path.
4. Decision points and authorities.
5. Staff tasking and suspense.

## Domain Products

Primary products: launch confidence ledger, cue dissemination matrix, interception timing options.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Use packet template `DPL-HYP-CUE-001` from `../_shared/references/domain-tool-packet-library.md`.
- Bind tool and protocol choices to `ts-hypersonic-cueing-v1` from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Include transport/profile mapping (for example `Link 16 J-series`, `USMTF`, `API/JSON`) and UTC freshness.

## Guardrails

- Separate observed facts, assessed confidence, and unknowns.
- Flag launch assessments that lack dual-source corroboration.
- Do not recommend kinetic response without explicit human command approval.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-hypersonic-cueing-v1` with `protocol_stack_id=ps-joint-tactical-link-stack-v1`.
- Alternate: `tool_suite_id=ts-space-satcom-v1` with `protocol_stack_id=ps-cop-event-sharing-stack-v1`.
- Degraded: manual warning net with authenticated UTC acknowledgment chain.

## Domain Packet Defaults

- Default packet ID: `DPL-HYP-CUE-001`.
- If packet scope mismatches mission constraints, define a provisional packet and assign validation owner/suspense.
