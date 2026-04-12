---
name: battlefield-additive-manufacturing-forward-repair-validation-cell
description: Validate forward additive-manufactured repair parts for air, land, and maritime mission assurance under contested sustainment.
---

# Battlefield Additive Manufacturing Forward Repair Validation Cell

## Mission Scope

- Problem statement: forward additive-manufactured repair parts can restore readiness quickly, but only if material pedigree, print parameters, inspection evidence, and release authority are validated before installation.
- Treat this skill as planning and decision support for non-weapon maintenance and repair support that restores mobility, survivability, power, sensing, or sustainment functions.
- Confirm authority, data classification, response timeline, maintenance release authority, and whether the candidate part is safety-critical or life-limited before recommending action.
- Keep outputs unclassified unless handling guidance is provided.

## Required Inputs

- Candidate part data, including part number, platform or subsystem, approved drawing or digital model source, and whether the part is safety-critical, flight-critical, or mission-essential.
- Material and process pedigree, including feedstock lot, printer model, calibration status, build orientation, post-processing steps, and operator qualification status.
- Inspection and test evidence, including dimensional inspection results, non-destructive evaluation status, proof-load or functional-test results, and latest UTC timestamps for each artifact.
- Maintenance context, including current equipment casualty status, approved technical manuals, available repair alternatives, supply ETA for original equipment parts, and commander decision deadline.
- Authority chain and constraints, including engineering support activity, quality assurance release authority, host-nation or OEM restrictions, and export-control or releasability limits.

## Workflow

1. Establish mission objective, constraints, and commander decision horizon.
2. Fuse tool outputs into confidence-ranked options with explicit assumptions.
3. Build primary, alternate, and degraded courses of action with trigger conditions.
4. Bind each recommendation to authority gates, acknowledgments, and staff ownership.

## Required Output Format

1. Situation snapshot.
2. Recommended primary action path.
3. Alternate/degraded path.
4. Decision points and authorities.
5. Staff tasking and suspense.

## Domain Products

Primary products: mission posture summary, risk-to-mission matrix, execution branch plan.

## External Tools and Protocol Integration

- Use ../_shared/references/external-tools-protocols.md and ../_shared/references/tool-protocol-playbooks.md.
- Use packet template DPL-ADDITIVE-REPAIR-VALIDATION-001 from ../_shared/references/domain-tool-packet-library.md.
- Bind tool and protocol choices to ts-battlefield-additive-repair-validation-v1 from ../_shared/references/warfighter-external-tool-and-protocol-catalog.md.
- Include transport/profile mapping and UTC freshness in all machine-to-machine exchanges.

## Tool Invocation Contract

- Digital thread or technical data repository:
  objective: confirm the approved part definition, revision, and allowable repair envelope.
  required inputs: part number, platform, configuration baseline, and approval authority.
  protocol: query the repository by approved part identifier and capture revision, source authority, and release date in the packet.
  expected output: authoritative drawing or model reference plus restrictions on build orientation, tolerances, and allowable substitutions.
- Printer and process monitoring stack:
  objective: verify machine readiness and build pedigree before recommending installation.
  required inputs: printer ID, build file checksum, feedstock lot, operator ID, and calibration timestamp.
  protocol: export the machine log, parameter set, and calibration evidence using the tool-suite transport defined in `ts-battlefield-additive-repair-validation-v1`.
  expected output: machine-health summary, parameter conformance record, and build-trace identifier.
- Inspection and NDE workflow:
  objective: validate dimensional and structural conformance.
  required inputs: inspection plan, tolerance table, NDE method, and serialized part ID.
  protocol: record each inspection artifact with UTC timestamp, inspector identity, measurement set, and pass/fail threshold.
  expected output: inspection disposition, defect list, and any mandatory rework or rejection condition.
- Maintenance and supply coordination system:
  objective: compare the additive repair path against conventional repair or replacement options.
  required inputs: casualty report, readiness impact, supply ETA, labor availability, and installation window.
  protocol: publish the candidate COA packet with risk, schedule, and release authority fields populated.
  expected output: install/no-install recommendation, fallback supply action, and owner/suspense for the next decision point.

## Interoperability Validation Checklist

- Confirm the approved drawing or model revision matches the platform configuration baseline and that all cited evidence is traceable to a named authority.
- Verify material pedigree, printer calibration, and operator qualification artifacts are present and within the allowed freshness window.
- Check that dimensional inspection, NDE, and functional-test evidence align to the same serialized part ID before recommending installation.
- Validate the packet against `DPL-ADDITIVE-REPAIR-VALIDATION-001`, including UTC timestamps, release authority, and transport/profile metadata.
- If the part is safety-critical, flight-critical, or life-limited, require explicit engineering release and quality assurance approval before returning the system to service.

## Failure Handling

- If the approved drawing, model revision, or release authority cannot be verified, return a no-go recommendation and route the case to conventional supply or depot repair.
- If material pedigree, printer calibration, or inspection evidence is incomplete or stale, downgrade to advisory-only and identify the validation owner plus revalidation suspense.
- If any NDE, proof-load, or functional test fails, reject the additive part, preserve the evidence package, and publish the alternate repair or replacement path.
- If the candidate part is revealed to be a weapon, munition, firing component, or otherwise outside noncombat maintenance scope, stop and escalate for human review instead of producing a recommendation.

## Guardrails

- Separate observed facts, assessed confidence, and unknowns.
- Flag single-source claims and require corroboration for high-impact recommendations.
- Do not recommend additive manufacturing of weapons, munitions, firing components, or other prohibited combat parts.
- Keep engineering and quality-release approval checkpoints explicit before any safety-critical part is installed.

## Domain Toolchain Defaults

- Primary: tool_suite_id=ts-battlefield-additive-repair-validation-v1 with protocol_stack_id=ps-battlefield-additive-repair-validation-stack-v1.
- Alternate: tool_suite_id=ts-joint-c2-fusion-v1 with protocol_stack_id=ps-cop-event-sharing-stack-v1.
- Degraded: authenticated text or voice reporting with UTC acknowledgment chain.

## Domain Packet Defaults

- Default packet ID: DPL-ADDITIVE-REPAIR-VALIDATION-001.
- If packet scope mismatches mission constraints, define a provisional packet and assign validation owner/suspense.
