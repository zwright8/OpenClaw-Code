---
name: joint-casualty-rehabilitation-prosthetics-and-return-to-duty-cell
description: Coordinate casualty rehabilitation, prosthetic fitting, and return-to-duty or transition planning for U.S. warfighters after combat injury. Use when commanders or medical staffs need readiness-aware recovery options beyond acute care.
---

# Joint Casualty Rehabilitation Prosthetics And Return To Duty Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm echelon, casualty profile, rehabilitation capacity, prosthetic-device availability, family-support needs, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with injury pattern, rehabilitation milestones, prosthetic demand, occupational task requirements, and transition constraints.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in recovery quality, return-to-duty speed, long-term function, and family or transition burden.
3. Identify branch or sequel triggers, device-release thresholds, and authority or release gates.
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

Primary products: rehabilitation milestones board, prosthetic fitting matrix, and return-to-duty or transition decision ledger.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-casualty-rehabilitation-prosthetics-return-to-duty-v1` with `protocol_stack_id=ps-joint-casualty-rehabilitation-prosthetics-return-to-duty-stack-v1`.
- Alternate: select a mission-adjacent force-health or casualty-management suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual rehab milestone board with prosthetic-custody log and command-approved functional assessment checkpoints.

## Domain Packet Defaults

- Default packet ID: `DPL-REHAB-PROSTHETICS-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: rehabilitation progress tracker, prosthetic fitting board, gait or function assessment monitor, and return-to-duty review ledger.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `DICOM`, signed device manifests, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, legal basis, device pedigree, or functional-assessment evidence is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag prosthetic-device safety, long-term overuse risk, chronic-pain concerns, family-transition needs, and classification or privacy constraints before recommending action.
- Do not fabricate authorities, approvals, or source evidence.

## Domain Toolchain Override (2026-04-06, Expansion Wave LXIX Addendum)

- Add `tool_suite_id=ts-strategic-va-dod-trauma-bed-rehabilitation-bridge-v1` + `protocol_stack_id=ps-strategic-va-dod-trauma-bed-rehabilitation-bridge-stack-v1` when rehabilitation planning depends on VA or DOD bed availability, specialty rehab continuity, or long-tail transition timing after major casualty surges.
- Add `packet_id=DPL-VA-DOD-TRAUMA-REHAB-BRIDGE-001` for recommendations that materially change rehabilitation transfer posture, return-to-duty expectations, or family-transition sequencing.

## Domain Toolchain Override (2026-04-06, Expansion Wave LXXIII Addendum)

- Add `toolchain_id=TC-BPHARM-286`, `tool_suite_id=ts-joint-base-pharmacy-refill-tricare-coldchain-v1`, and `protocol_stack_id=ps-joint-base-pharmacy-refill-tricare-coldchain-stack-v1` when rehabilitation continuity depends on refill transfer, specialty medication protection, or TRICARE override confidence for wounded-warrior families.
- Add `toolchain_id=TC-HOMEMOD-289`, `tool_suite_id=ts-joint-wounded-warrior-home-modification-caregiver-ramp-v1`, and `protocol_stack_id=ps-joint-wounded-warrior-home-modification-caregiver-ramp-stack-v1` when return-to-duty or transition planning depends on home accessibility, caregiver readiness, or discharge-to-home sequencing.
- Add `packet_id=DPL-BASE-PHARMACY-TRICARE-COLDCHAIN-001` and `packet_id=DPL-WOUNDED-WARRIOR-HOME-CAREGIVER-001` for branches that materially alter rehabilitation posture, family-transition timing, or safe discharge assumptions.

## Domain Toolchain Override (2026-04-07, Expansion Wave LXXVII Addendum)

- Add `toolchain_id=TC-MEBPEB-308`, `tool_suite_id=ts-joint-medical-evaluation-board-physical-evaluation-board-va-claim-continuity-v1`, and `protocol_stack_id=ps-joint-medical-evaluation-board-physical-evaluation-board-va-claim-continuity-stack-v1` when rehabilitation or return-to-duty planning depends on board timing, disability disposition, or VA or DOD handoff continuity.
- Add `toolchain_id=TC-RETIRE-312`, `tool_suite_id=ts-joint-retirement-sbp-tsp-transition-counseling-continuity-v1`, and `protocol_stack_id=ps-joint-retirement-sbp-tsp-transition-counseling-continuity-stack-v1` when long-tail recovery branches depend on medical-retirement decisions, SBP elections, or transition counseling timing.
- Add `toolchain_id=TC-CRED-313`, `tool_suite_id=ts-joint-professional-license-cyber-certification-ceu-readiness-continuity-v1`, and `protocol_stack_id=ps-joint-professional-license-cyber-certification-ceu-readiness-continuity-stack-v1` when safe return-to-duty depends on restored licensure, certification, or CEU readiness after injury or extended treatment.
- Add `packet_id=DPL-MEB-PEB-VA-CLAIM-001`, `packet_id=DPL-RETIREMENT-SBP-TSP-001`, and `packet_id=DPL-PRO-LICENSE-CYBER-CEU-001` for branches that materially alter rehabilitation posture, medical-retirement timing, or safe return-to-duty confidence.

## Domain Toolchain Override (2026-04-07, Expansion Wave LXXIX Addendum)

- Add `toolchain_id=TC-PRIV-319`, `tool_suite_id=ts-joint-clinical-privileging-credentialing-deployment-readiness-v1`, and `protocol_stack_id=ps-joint-clinical-privileging-credentialing-deployment-readiness-stack-v1` when rehabilitation or return-to-duty planning depends on restored privileging, deployment-safe scope-of-practice, or provider staffing legitimacy after injury or treatment interruption.
- Add `packet_id=DPL-CLINICAL-PRIVILEGING-DEPLOYMENT-001` for branches that materially alter rehabilitation posture, safe-provider employment, or return-to-duty confidence.

## Domain Toolchain Override (2026-04-07, Expansion Wave LXXXIII Addendum)

- Add `toolchain_id=TC-TAMPHC-332`, `tool_suite_id=ts-joint-transitional-healthcare-tamp-chcbp-pharmacy-bridge-v1`, and `protocol_stack_id=ps-joint-transitional-healthcare-tamp-chcbp-pharmacy-bridge-stack-v1` when rehabilitation continuity crosses separation, demobilization, or medical transition and treatment access depends on uninterrupted coverage or pharmacy bridge actions.
- Add `toolchain_id=TC-VACARE-333`, `tool_suite_id=ts-joint-va-caregiver-support-program-stipend-training-respite-continuity-v1`, and `protocol_stack_id=ps-joint-va-caregiver-support-program-stipend-training-respite-continuity-stack-v1` when rehabilitation or safe return-to-duty depends on caregiver sustainment, training completion, or respite viability.
- Add `toolchain_id=TC-VREIL-334`, `tool_suite_id=ts-joint-vre-independent-living-adaptive-employment-continuity-v1`, and `protocol_stack_id=ps-joint-vre-independent-living-adaptive-employment-continuity-stack-v1` when long-tail recovery planning depends on adaptive employment, vocational rehabilitation, or independent-living support after injury.
- Add `toolchain_id=TC-SAHAA-335`, `tool_suite_id=ts-joint-specially-adapted-housing-automobile-allowance-home-accessibility-benefit-bridge-v1`, and `protocol_stack_id=ps-joint-specially-adapted-housing-automobile-allowance-home-accessibility-benefit-bridge-stack-v1` when discharge or transition planning depends on adaptive housing, automobile allowance, or home-accessibility benefit execution.
- Add `toolchain_id=TC-MEDHOLD-336`, `tool_suite_id=ts-joint-convalescent-leave-limited-duty-medical-hold-continuity-v1`, and `protocol_stack_id=ps-joint-convalescent-leave-limited-duty-medical-hold-continuity-stack-v1` when rehabilitation sequencing depends on lawful convalescent leave, medhold continuity, or limited-duty order legitimacy.
- Add `packet_id=DPL-TRANSITIONAL-HEALTHCARE-TAMP-CHCBP-001`, `packet_id=DPL-VA-CAREGIVER-STIPEND-RESPITE-001`, `packet_id=DPL-VRE-INDEPENDENT-LIVING-001`, `packet_id=DPL-SAH-AUTOMOBILE-HOME-ACCESS-001`, and `packet_id=DPL-CONVALESCENT-LEAVE-MEDHOLD-001` for branches that materially alter rehabilitation posture, discharge timing, or safe return-to-duty confidence.

## Domain Toolchain Override (2026-04-07, Expansion Wave LXXXIV Addendum)

- Add `toolchain_id=TC-ADSPORT-342`, `tool_suite_id=ts-joint-adaptive-sports-community-reintegration-peer-mentor-continuity-v1`, and `protocol_stack_id=ps-joint-adaptive-sports-community-reintegration-peer-mentor-continuity-stack-v1` when long-tail recovery, identity restoration, or safe return-to-duty confidence depends on adaptive-sports access, peer mentors, or reintegration momentum outside clinical settings.
- Add `packet_id=DPL-ADAPTIVE-SPORTS-REINTEGRATION-001` for branches that materially alter reintegration posture, family confidence in recovery trajectory, or nonclinical recovery support timing.
