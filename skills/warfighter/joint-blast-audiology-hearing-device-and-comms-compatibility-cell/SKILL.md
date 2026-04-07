---
name: joint-blast-audiology-hearing-device-and-comms-compatibility-cell
description: Preserve hearing protection, communications intelligibility, and return-to-duty decisions after blast or sustained-noise exposure when ear protection and comms devices must remain interoperable.
---

# Joint Blast Audiology Hearing Device And Comms Compatibility Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter blast-audiology, hearing-device, and communications-compatibility decisions.
- Confirm exposure events, audiology capacity, hearing-device inventory, mission-communications requirements, and return-to-duty timelines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using blast or noise exposure history, audiogram status, comms tasks, protective-equipment fit, and symptom progression.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in safety, comms clarity, sortie or patrol availability, and medical burden.
3. Identify branch triggers for temporary duty limits, device substitution, retesting, protected rest, or specialist referral.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: blast-audiology triage board, earpro and comms compatibility matrix, and duty-limitation branch card.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-blast-audiology-hearing-device-comms-compatibility-v1` with `protocol_stack_id=ps-joint-blast-audiology-hearing-device-comms-compatibility-stack-v1`.
- Alternate: select a mission-adjacent hearing-conservation, aviation-physiology, or mission-network suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual exposure ledger with commander-approved duty-limitation board and human fit-check verification only.

## Domain Packet Defaults

- Default packet ID: `DPL-BLAST-AUDIOLOGY-COMMS-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: blast exposure ledger, audiology scheduling board, earpro and headset fit tracker, and comms-device compatibility matrix.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, audiogram exchange, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If exposure provenance, clinical review, or duty-release authority is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag tinnitus, delayed symptom escalation, misfit ear protection, and comms-fratricide risk before recommending action.
- Do not fabricate audiograms, duty releases, or hearing-device compatibility evidence.
