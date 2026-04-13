# Support Readiness Exercise and AAR Protocol

Use this reference when a warfighter support skill is designing a rehearsal, evaluating a drill, or publishing an after-action review for lawful readiness, resilience, continuity, maintenance, medical-support, communications, cyber-defense, or disaster-response operations.

Anchor outputs to operator-improvement workflows that are consistent with HSEEP-style exercise design and AAR/IP packaging, CISA exercise support practices, and local command or installation reporting requirements.

## Allowed Use Boundaries

- Use this protocol for training, rehearsal, simulation, tabletop, drill, and incident-review work that improves readiness, safety, continuity, maintenance, medical support, logistics, cyber defense, or disaster response.
- Use it to improve coordination, evidence quality, corrective-action tracking, knowledge capture, and operator handoffs.
- Do not use it to design strike packages, targeting workflows, weapons-employment rehearsals, lethal action sequencing, or intelligence-led harm.
- If a request depends on offensive action planning, target selection, evasion, or bypassing safety, legal, or privacy controls, stop and escalate.

## Required Inputs

Confirm these inputs before generating a rehearsal package or AAR/IP:

- event scope: exercise, drill, rehearsal, simulation, or real-world incident name; start and stop time in UTC; authority; classification or releasability
- objectives and standards: capability targets, task conditions, evaluation criteria, pass or watch thresholds, and governing SOP or doctrine references
- evidence sources: simulator telemetry, LMS or range output, observer notes, ticket history, maintenance logs, communications logs, or continuity artifacts
- participant map: lead cell, evaluator roles, supporting teams, external agencies, approval chain, and privacy or handling constraints
- operational constraints: site availability, safety controls, staffing limits, tool availability, network posture, and fallback communication methods
- corrective-action context: existing issue backlog, open waivers, unresolved lessons learned, and validation owner for each new action

## Readiness Exercise Design Packet

Use this schema when producing a rehearsal or exercise design packet:

```text
exercise_id:
scope_type:
objective_id:
capability_target:
audience:
conditions:
evaluation_criteria:
inject_id:
inject_trigger:
inject_delivery_channel:
safety_control:
observer_or_evaluator:
evidence_source:
after_action_capture_method:
approval_owner:
confidence:
```

## AAR/IP Packet

Use this schema when publishing an AAR or improvement plan:

```text
aar_id:
event_window_utc:
objective_id:
observation_id:
observed_fact:
impact_on_readiness_or_resilience:
root_cause_hypothesis:
corrective_action:
owner:
due_date_utc:
validation_method:
status:
confidence:
```

## Tool Protocol Sequence

Use this exact sequence unless the operator states a justified override:

1. Exercise or event source-of-truth
   objective: confirm the official exercise scope, schedule, objectives, and participant list
   required inputs: exercise ID, event window in UTC, lead organization, objective set, and approval owner
   query or action template: `get_event_scope(exercise_id, event_window_utc, objective_set, approval_owner)`
   expected output schema: `{exercise_id, scope_type, objectives[], participants[], approvals[], last_refresh_utc}`
   transport protocol: authenticated `API/JSON`, signed planner export, or controlled spreadsheet extract
   fallback path: manual event worksheet with two-person review and UTC timestamp
2. Evidence capture source
   objective: collect objective-linked observations from telemetry, observer notes, tickets, or logs without altering the source record
   required inputs: objective IDs, observation window in UTC, participant or system scope, and evidence source list
   query or action template: `collect_observations(objective_ids, observation_window_utc, source_scope, evidence_sources)`
   expected output schema: `{observation_id, objective_id, source_system, timestamp_utc, observed_fact, supporting_artifacts[]}`
   transport protocol: authenticated `API/JSON`, `CSV`, `xAPI`, signed file transfer, or controlled note export
   fallback path: manual observation log with artifact links and reviewer initials
3. Improvement-plan tracker
   objective: turn validated findings into owned corrective actions with suspense dates and verification method
   required inputs: observation set, corrective-action candidates, owner roster, due-date rules, and escalation threshold
   query or action template: `create_corrective_actions(observations, owner_roster, due_date_rules, escalation_threshold)`
   expected output schema: `{action_id, observation_id, owner, due_date_utc, validation_method, status, blocker_notes[]}`
   transport protocol: authenticated `API/JSON`, ticket export, or signed tasking message
   fallback path: manual action tracker with explicit owner acknowledgment and next review date
4. Knowledge-publication channel
   objective: publish approved lessons, SOP deltas, and readiness updates to the right audience without leaking protected details
   required inputs: approved findings, releasability, audience, publication deadline, and document owner
   query or action template: `publish_lessons(approved_findings, releasability, audience, publication_deadline_utc, document_owner)`
   expected output schema: `{publication_id, audience, artifacts[], approval_status, publish_time_utc}`
   transport protocol: controlled document repository, knowledge base `API/JSON`, signed email, or authenticated message bus
   fallback path: commander-approved briefing slide or memo with manual distribution log

## Validation Steps

- Trace every finding and corrective action to at least one named objective or capability target.
- Confirm every observation includes source provenance, UTC timestamp, confidence, and whether it is fact, assessment, or unresolved question.
- Require an owner, due date, and validation method for every corrective action before the action is published as committed work.
- Check releasability, privacy, and handling rules before publishing patient, personnel, cyber, or maintenance data.
- Confirm the final packet distinguishes immediate fixes, short-horizon actions, and structural changes.

## Failure Handling

- If the event scope, objectives, or approval owner are unclear, stop and request clarification before drafting injects or corrective actions.
- If source evidence is incomplete, publish provisional findings only, mark confidence explicitly, and schedule a revalidation time in UTC.
- If tools are unavailable, switch to the manual worksheet path, log the degraded method, and document the confidence and timeliness impact.
- If observers or systems disagree, preserve both versions, identify the conflict as unresolved, and route it to the validation owner rather than forcing consensus.
- If a corrective action has no accountable owner or validation method, hold it in a watch-item list instead of presenting it as an approved improvement task.
