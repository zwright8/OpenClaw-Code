import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import type {
    SkillImplementation,
    SkillImprovementProfile,
    SkillIntegrationAuthKind,
    SkillIntegrationAuthMode,
    SkillIntegrationProfile,
    SkillRuntimeProfile
} from '../skills/runtime/types.js';

type OperationKey =
    | 'connector'
    | 'sync-orchestrator'
    | 'data-exporter'
    | 'data-importer'
    | 'webhook-listener'
    | 'report-builder'
    | 'alert-monitor'
    | 'workflow-automator'
    | 'approval-router'
    | 'migration-assistant';

type ToolIdeaItem = {
    id: number;
    tool: string;
    purpose: string;
    folder: string;
    skillPath: string;
    agent: string;
};

type ToolIdeaBuildManifest = {
    total: number;
    generatedAt: string;
    jobs: Array<{
        agent: string;
        start: number;
        end: number;
        count: number;
        items: Array<{
            id: number;
            tool: string;
            purpose: string;
            folder: string;
            skillPath: string;
        }>;
    }>;
};

type OperationProfile = {
    suffix: string;
    title: string;
    archetype: string;
    coreMethod: string;
    primaryArtifact: string;
    requiredSignals: string[];
    kpiFocus: string[];
    scoringWeights: SkillRuntimeProfile['scoringWeights'];
    postureThresholds: SkillRuntimeProfile['postureThresholds'];
    approvalGates: string[];
    retryPolicy: SkillRuntimeProfile['orchestration']['retryPolicy'];
    rollbackStrategy: string;
    orchestrationComponents: string[];
    validationSuites: string[];
    releaseCycles: number;
    mutating: boolean;
    humanUseCases: string[];
    preflight: string[];
    execution: string[];
    recovery: string[];
    handoff: string[];
    failureModes: Array<{
        code: string;
        trigger: string;
        action: string;
    }>;
    guardrails: Array<{
        kind: SkillImprovementProfile['guardrails'][number]['kind'];
        rule: string;
        automation: string;
    }>;
    regressionScenario: string;
    regressionMutation: string;
    implementationGuide(provider: string, title: string, purpose: string): string[];
};

type ProviderRule = {
    patterns: string[];
    category: string;
    protocols: string[];
    authKinds: SkillIntegrationAuthKind[];
    apiKeyLikelyRequired: boolean;
    highRisk: boolean;
    notes: string[];
};

type GeneratedToolShardEntry = {
    id: number;
    name: string;
    title: string;
    provider: string;
    operation: string;
    shard: string;
    tier: SkillImprovementProfile['tier'];
    apiKeyLikelyRequired: boolean;
    path: string;
    implementationPath: string;
    adapterPath: string;
};

type CliOptions = {
    repoRoot: string;
    outputRoot: string;
    sourceManifestRelativePath: string;
    removeSource: boolean;
};

const REPO_ROOT = process.cwd();
const DEFAULT_OUTPUT_ROOT = path.join(REPO_ROOT, 'skills', 'generated', 'shards');
const DEFAULT_SOURCE_MANIFEST_RELATIVE_PATH = path.join('skills', 'generated', 'tool-ideas-agents', 'build.manifest.json');
const ROOT_MANIFEST_NAME = 'tool-ideas.manifest.json';
const ROOT_REPORT_NAME = 'tool-ideas.report.md';
const SHARD_PREFIX = 'tools';

const OPERATION_PROFILES: Record<OperationKey, OperationProfile> = {
    connector: {
        suffix: 'Connector',
        title: 'Connector',
        archetype: 'integration-connector',
        coreMethod: 'auth-scoped api mediation',
        primaryArtifact: 'connection-trace-bundle',
        requiredSignals: ['auth context', 'resource scope', 'request contract'],
        kpiFocus: ['auth success rate', 'request validation pass rate', 'side-effect correctness'],
        scoringWeights: { truth: 0.22, execution: 0.36, safety: 0.28, impact: 0.14 },
        postureThresholds: { readyMin: 74, reviewMin: 54, reviewRisk: 60, criticalRisk: 80 },
        approvalGates: ['provider-auth-check', 'mutation-safety-review'],
        retryPolicy: { maxAttempts: 3, baseDelayMs: 600, backoff: 'exponential' },
        rollbackStrategy: 'revoke-write-session-and-replay-read-only',
        orchestrationComponents: ['auth preflight', 'read-only probe', 'scoped mutation', 'artifact capture'],
        validationSuites: ['unit', 'integration', 'regression-baseline'],
        releaseCycles: 2,
        mutating: true,
        humanUseCases: [
            'Establish a deterministic, auditable integration path before any write-capable automation is enabled.',
            'Normalize external API access so downstream workflows inherit the same auth and validation policy.'
        ],
        preflight: [
            'Verify credential reuse candidates before asking for new secrets.',
            'Start with the minimum read-only probe that proves identity, scope, and rate-limit posture.'
        ],
        execution: [
            'Execute the smallest valid API operation first, then widen scope only after validation passes.',
            'Capture endpoint, request shape, and response identifiers in the handoff bundle.'
        ],
        recovery: [
            'On auth or permission failure, stop writes, preserve diagnostics, and fall back to read-only verification.',
            'On mutating error, revoke the write session and reconcile resulting state before retry.'
        ],
        handoff: [
            'Return the validated connection state, scopes used, and any newly created IDs or URLs.',
            'Document whether the session is safe for downstream automation or requires human re-approval.'
        ],
        failureModes: [
            {
                code: 'E_AUTH_CONTEXT',
                trigger: 'Missing, invalid, or expired provider credentials.',
                action: 'Fail closed, capture auth diagnostics, and request corrected auth context.'
            },
            {
                code: 'E_SCOPE_MISMATCH',
                trigger: 'Credential exists but required scopes or permissions are absent.',
                action: 'Block mutating operations and route to human review with exact missing scopes.'
            },
            {
                code: 'E_PROVIDER_RATE_LIMIT',
                trigger: 'Provider rejects calls due to throttling or abuse detection.',
                action: 'Apply retry budget, reduce concurrency, and resume with read-only verification.'
            }
        ],
        guardrails: [
            {
                kind: 'quality',
                rule: 'Require an auth preflight and read-only probe before any write-capable call.',
                automation: 'auth-preflight+read-probe'
            },
            {
                kind: 'reliability',
                rule: 'Throttle retries and reconcile provider state after write failures.',
                automation: 'retry-budget+state-reconcile'
            },
            {
                kind: 'compliance',
                rule: 'Enforce least privilege and preserve the scopes used for the run.',
                automation: 'scope-audit'
            }
        ],
        regressionScenario: 'Connector run with stale credentials and a mutation attempt before the read-only probe succeeds.',
        regressionMutation: 'Set the auth context to expired and request a write operation without completing auth validation.',
        implementationGuide(provider, title, purpose) {
            return [
                `Define the objective, target resources, and permitted side effects for ${title}, then confirm the smallest read-only probe that proves access to ${provider}.`,
                `Resolve credential reuse first, validate identity and scopes, and only ask for new secrets if the existing auth context is missing, invalid, or expired.`,
                `Specify the request and response contract for ${purpose.toLowerCase()}, including idempotency rules and provider rate-limit posture.`,
                `Execute the read-only probe, widen to the minimum required write scope, and capture deterministic request/response traces for every call.`,
                `Run integration and regression checks that cover auth expiry, scope mismatch, and rate limiting before approving downstream automation reuse.`,
                `Publish a connection bundle with scopes, created artifacts, and next-action guidance for any workflow that depends on this provider session.`
            ];
        }
    },
    'sync-orchestrator': {
        suffix: 'Sync Orchestrator',
        title: 'Sync Orchestrator',
        archetype: 'sync-orchestration-engine',
        coreMethod: 'cursor-based reconciliation',
        primaryArtifact: 'reconciliation-bundle',
        requiredSignals: ['source cursor', 'destination state', 'conflict policy'],
        kpiFocus: ['sync lag', 'reconciliation completion rate', 'conflict resolution accuracy'],
        scoringWeights: { truth: 0.22, execution: 0.34, safety: 0.28, impact: 0.16 },
        postureThresholds: { readyMin: 76, reviewMin: 56, reviewRisk: 60, criticalRisk: 79 },
        approvalGates: ['provider-auth-check', 'conflict-policy-review'],
        retryPolicy: { maxAttempts: 4, baseDelayMs: 800, backoff: 'exponential' },
        rollbackStrategy: 'freeze-sync-window-and-reconcile-from-last-stable-cursor',
        orchestrationComponents: ['cursor validation', 'delta fetch', 'conflict resolution', 'state checkpoint'],
        validationSuites: ['unit', 'integration', 'simulation', 'regression-baseline'],
        releaseCycles: 2,
        mutating: true,
        humanUseCases: [
            'Run bidirectional or fan-out sync jobs without losing lineage or replay safety.',
            'Control high-volume synchronization with explicit conflict policy and checkpointing.'
        ],
        preflight: [
            'Verify both source and destination auth contexts and confirm the active cursor/checkpoint.',
            'Agree on the conflict policy before any mutation is emitted to the destination system.'
        ],
        execution: [
            'Fetch deltas deterministically, checkpoint every batch, and preserve replay inputs.',
            'Route unresolved conflicts into a human review queue instead of guessing.'
        ],
        recovery: [
            'Freeze the sync window when reconciliation diverges from the checkpointed baseline.',
            'Replay from the last stable cursor only after the conflict policy is corrected.'
        ],
        handoff: [
            'Return checkpoint state, drift summary, and unresolved conflicts with next owners.',
            'Document whether the destination is caught up, backfilled, or paused pending review.'
        ],
        failureModes: [
            {
                code: 'E_CURSOR_GAP',
                trigger: 'Missing or corrupted source/destination checkpoint.',
                action: 'Freeze sync and require a manually selected replay point.'
            },
            {
                code: 'E_CONFLICT_BURST',
                trigger: 'Delta batches exceed safe conflict thresholds.',
                action: 'Block writeback, emit a conflict packet, and route to review.'
            },
            {
                code: 'E_AUTH_CONTEXT',
                trigger: 'Either side of the sync lacks valid credentials.',
                action: 'Stop the sync window and revalidate both auth contexts before replay.'
            }
        ],
        guardrails: [
            {
                kind: 'quality',
                rule: 'Checkpoint every delta batch before applying destination writes.',
                automation: 'cursor-checkpoint'
            },
            {
                kind: 'reliability',
                rule: 'Reconcile from the last stable cursor after failures or drift.',
                automation: 'cursor-replay'
            },
            {
                kind: 'compliance',
                rule: 'Escalate unresolved conflicts instead of auto-merging beyond policy.',
                automation: 'conflict-review-queue'
            }
        ],
        regressionScenario: 'Sync replay with a stale destination cursor and an unresolved conflict burst.',
        regressionMutation: 'Provide mismatched checkpoints and a conflict policy that permits no automatic merge.',
        implementationGuide(provider, title, purpose) {
            return [
                `Define the systems, entities, and conflict policy for ${title}, then checkpoint the last known good cursor on both sides of ${provider}.`,
                `Validate credential reuse and rate-limit posture for every participating endpoint before the sync window opens.`,
                `Specify delta-fetch, reconciliation, and idempotency contracts for ${purpose.toLowerCase()}, including replay safety and backfill rules.`,
                `Process deltas in deterministic batches, checkpoint after every write phase, and quarantine records that exceed conflict thresholds.`,
                `Exercise simulation and regression suites that cover stale cursors, duplicate deliveries, and asymmetric provider failures.`,
                `Publish a reconciliation bundle with drift metrics, conflict counts, and the next checkpoint required for autonomous continuation.`
            ];
        }
    },
    'data-exporter': {
        suffix: 'Data Exporter',
        title: 'Data Exporter',
        archetype: 'typed-export-engine',
        coreMethod: 'typed extraction and delivery',
        primaryArtifact: 'export-package',
        requiredSignals: ['export specification', 'query filters', 'destination contract'],
        kpiFocus: ['export completeness', 'schema conformance', 'delivery latency'],
        scoringWeights: { truth: 0.28, execution: 0.34, safety: 0.2, impact: 0.18 },
        postureThresholds: { readyMin: 74, reviewMin: 54, reviewRisk: 62, criticalRisk: 82 },
        approvalGates: ['provider-auth-check', 'data-scope-review'],
        retryPolicy: { maxAttempts: 3, baseDelayMs: 700, backoff: 'exponential' },
        rollbackStrategy: 'stop-export-and-invalidate-partial-deliveries',
        orchestrationComponents: ['scope validation', 'query execution', 'schema normalization', 'delivery confirmation'],
        validationSuites: ['unit', 'integration', 'regression-baseline'],
        releaseCycles: 1,
        mutating: false,
        humanUseCases: [
            'Extract provider data into a clean, typed payload without expanding access scope.',
            'Create repeatable export jobs that downstream systems can trust without hand repair.'
        ],
        preflight: [
            'Validate export scope, filters, and destination expectations before running queries.',
            'Confirm credentials and verify that the export respects the agreed data minimization policy.'
        ],
        execution: [
            'Run deterministic queries, preserve pagination/cursor details, and normalize the output schema.',
            'Attach checksums and row counts to every export package.'
        ],
        recovery: [
            'Invalidate partial exports and rerun from the last clean page or cursor on failure.',
            'Stop delivery when the schema drifts outside the declared contract.'
        ],
        handoff: [
            'Return the export package location, checksums, and schema summary.',
            'Note any rows filtered, dropped, or quarantined before the package was finalized.'
        ],
        failureModes: [
            {
                code: 'E_SCOPE_MISMATCH',
                trigger: 'The requested export exceeds the approved entity or field scope.',
                action: 'Block the export and request an updated scope approval.'
            },
            {
                code: 'E_SCHEMA_DRIFT',
                trigger: 'Provider output no longer matches the declared export contract.',
                action: 'Quarantine the package and attach a schema diff for review.'
            },
            {
                code: 'E_PARTIAL_DELIVERY',
                trigger: 'The export completes locally but delivery confirmation fails.',
                action: 'Invalidate the artifact and rerun from the last stable cursor.'
            }
        ],
        guardrails: [
            {
                kind: 'quality',
                rule: 'Attach counts, checksums, and schema version to every export package.',
                automation: 'export-integrity-check'
            },
            {
                kind: 'compliance',
                rule: 'Reject exports that exceed the approved data scope.',
                automation: 'data-scope-review'
            },
            {
                kind: 'reliability',
                rule: 'Invalidate partial deliveries instead of handing off incomplete datasets.',
                automation: 'partial-delivery-block'
            }
        ],
        regressionScenario: 'Export request with unauthorized fields and a schema change mid-run.',
        regressionMutation: 'Expand the export spec beyond approved scope and mutate the fixture schema version.',
        implementationGuide(provider, title, purpose) {
            return [
                `Define the approved entities, fields, and destination contract for ${title}, then constrain the export scope for ${provider} before running queries.`,
                `Validate credential reuse, pagination strategy, and the exact schema version that downstream consumers expect.`,
                `Implement ${purpose.toLowerCase()} with deterministic extraction, normalization, and integrity metadata for every page or batch.`,
                `Attach counts, checksums, and schema fingerprints to the export package and block delivery when the contract drifts.`,
                `Run integration and regression suites that cover unauthorized field expansion, pagination gaps, and partial delivery failures.`,
                `Publish a delivery-ready export package with scope notes, integrity metadata, and any quarantined records called out explicitly.`
            ];
        }
    },
    'data-importer': {
        suffix: 'Data Importer',
        title: 'Data Importer',
        archetype: 'validated-import-engine',
        coreMethod: 'validated bulk mutation',
        primaryArtifact: 'import-ledger',
        requiredSignals: ['input dataset', 'mapping rules', 'dry-run diff'],
        kpiFocus: ['dry-run mismatch rate', 'import success rate', 'rollback readiness'],
        scoringWeights: { truth: 0.2, execution: 0.28, safety: 0.38, impact: 0.14 },
        postureThresholds: { readyMin: 78, reviewMin: 58, reviewRisk: 58, criticalRisk: 76 },
        approvalGates: ['provider-auth-check', 'import-impact-review'],
        retryPolicy: { maxAttempts: 2, baseDelayMs: 900, backoff: 'exponential' },
        rollbackStrategy: 'abort-import-and-replay-from-dry-run-ledger',
        orchestrationComponents: ['schema validation', 'dry-run diff', 'staged mutation', 'rollback ledger'],
        validationSuites: ['unit', 'integration', 'simulation', 'regression-baseline'],
        releaseCycles: 3,
        mutating: true,
        humanUseCases: [
            'Apply large or high-risk updates safely by forcing dry-run evidence before mutation.',
            'Preserve a rollback ledger that lets operators reverse partial imports without guesswork.'
        ],
        preflight: [
            'Require a dry-run diff and approved mapping rules before any provider write is attempted.',
            'Validate the input dataset, rollback ledger location, and blast-radius constraints.'
        ],
        execution: [
            'Apply imports in staged batches, persisting before/after state for every mutation.',
            'Stop on the first unapproved schema or impact deviation instead of partially continuing.'
        ],
        recovery: [
            'Replay the rollback ledger when batch-level validation or approval gates fail.',
            'Quarantine invalid rows and route the exact diff to human review.'
        ],
        handoff: [
            'Return the import ledger, dry-run diff, rollback status, and any quarantined records.',
            'State explicitly whether the provider is fully applied, partially rolled back, or paused pending review.'
        ],
        failureModes: [
            {
                code: 'E_DRY_RUN_REQUIRED',
                trigger: 'A write batch is requested without an approved dry-run diff.',
                action: 'Fail closed and block provider mutation until dry-run approval is attached.'
            },
            {
                code: 'E_MAPPING_DRIFT',
                trigger: 'Input data or field mappings diverge from the validated contract.',
                action: 'Quarantine the batch and emit a schema delta packet.'
            },
            {
                code: 'E_PARTIAL_WRITE',
                trigger: 'A provider write succeeds for only part of the batch.',
                action: 'Replay the rollback ledger and escalate with exact affected identifiers.'
            }
        ],
        guardrails: [
            {
                kind: 'safety',
                rule: 'Block every import batch that lacks an approved dry-run diff and rollback ledger.',
                automation: 'dry-run-gate+rollback-ledger'
            },
            {
                kind: 'compliance',
                rule: 'Escalate mapping drift or blast-radius expansion before retrying.',
                automation: 'import-impact-review'
            },
            {
                kind: 'reliability',
                rule: 'Persist before/after state for every mutation so rollback remains deterministic.',
                automation: 'write-ledger'
            }
        ],
        regressionScenario: 'Bulk import attempt without dry-run approval and with a mapping mismatch in the payload.',
        regressionMutation: 'Remove dry-run approval from the fixture and introduce a field that is not covered by the mapping rules.',
        implementationGuide(provider, title, purpose) {
            return [
                `Define the import blast radius, rollback ledger, and required dry-run evidence for ${title} before any ${provider} write is approved.`,
                `Validate credential reuse, schema mappings, and the exact dry-run diff that the operator approved for the batch.`,
                `Implement ${purpose.toLowerCase()} in staged batches that preserve before/after state and stop immediately on contract drift.`,
                `Attach rollback identifiers, affected object counts, and quarantined rows to the import ledger for every execution.`,
                `Run simulation and regression suites that cover missing dry-run approval, mapping drift, and partial provider writes.`,
                `Publish a handoff packet with the import ledger, rollback readiness, and explicit follow-up actions for every quarantined record.`
            ];
        }
    },
    'webhook-listener': {
        suffix: 'Webhook Listener',
        title: 'Webhook Listener',
        archetype: 'signed-event-ingestion-engine',
        coreMethod: 'signed event intake and routing',
        primaryArtifact: 'event-intake-log',
        requiredSignals: ['signed event payload', 'secret reference', 'routing rules'],
        kpiFocus: ['signature verification pass rate', 'event processing latency', 'duplicate suppression accuracy'],
        scoringWeights: { truth: 0.24, execution: 0.28, safety: 0.34, impact: 0.14 },
        postureThresholds: { readyMin: 78, reviewMin: 58, reviewRisk: 56, criticalRisk: 75 },
        approvalGates: ['signing-secret-check', 'handler-policy-review'],
        retryPolicy: { maxAttempts: 4, baseDelayMs: 500, backoff: 'exponential' },
        rollbackStrategy: 'pause-listener-and-replay-from-quarantine-queue',
        orchestrationComponents: ['signature verification', 'dedupe check', 'routing policy', 'quarantine queue'],
        validationSuites: ['unit', 'integration', 'simulation', 'regression-baseline'],
        releaseCycles: 3,
        mutating: true,
        humanUseCases: [
            'Receive external provider events without trusting unsigned, replayed, or schema-drifted payloads.',
            'Quarantine ambiguous events while preserving enough trace data to replay safely.'
        ],
        preflight: [
            'Validate the signing secret, replay window, and dedupe cache before accepting live events.',
            'Confirm the routing rules and downstream side effects that each event type may trigger.'
        ],
        execution: [
            'Verify signatures and timestamps before deserializing the payload.',
            'Route verified events through a dedupe check and quarantine anything that violates policy.'
        ],
        recovery: [
            'Pause live acceptance when signature verification or replay detection regresses.',
            'Replay only from the quarantine queue after the root cause is corrected.'
        ],
        handoff: [
            'Return accepted event IDs, quarantined deliveries, and downstream trigger references.',
            'Document the active replay window and any signature policy overrides used during recovery.'
        ],
        failureModes: [
            {
                code: 'E_SIGNATURE_INVALID',
                trigger: 'Incoming payload fails signature or timestamp verification.',
                action: 'Reject the event, quarantine the payload, and record the verification failure.'
            },
            {
                code: 'E_DUPLICATE_DELIVERY',
                trigger: 'The same event is observed outside the allowed replay policy.',
                action: 'Suppress the duplicate and keep the original trace as the authoritative record.'
            },
            {
                code: 'E_HANDLER_POLICY',
                trigger: 'Event shape or target route violates downstream policy.',
                action: 'Block dispatch and route the event to manual triage.'
            }
        ],
        guardrails: [
            {
                kind: 'safety',
                rule: 'Reject unsigned or replayed events before any downstream side effects are triggered.',
                automation: 'signature-check+replay-window'
            },
            {
                kind: 'reliability',
                rule: 'Persist a quarantine queue for every event that cannot be safely dispatched.',
                automation: 'quarantine-queue'
            },
            {
                kind: 'compliance',
                rule: 'Route policy-violating payloads to manual review instead of auto-retrying.',
                automation: 'handler-policy-review'
            }
        ],
        regressionScenario: 'Webhook delivery with an invalid signature and a duplicate event ID already present in the dedupe cache.',
        regressionMutation: 'Replace the signing secret with an incorrect value and reuse the same event identifier in the fixture.',
        implementationGuide(provider, title, purpose) {
            return [
                `Define the accepted event types, replay window, and downstream side effects for ${title}, then register the signing-secret policy for ${provider}.`,
                `Validate credential reuse for the listener and verify that signature, timestamp, and dedupe stores are all healthy before accepting events.`,
                `Implement ${purpose.toLowerCase()} so that every payload is verified, normalized, and either routed or quarantined deterministically.`,
                `Preserve accepted event IDs, quarantine references, and downstream trigger artifacts for every dispatch decision.`,
                `Run simulation and regression suites that cover invalid signatures, replay attacks, duplicate deliveries, and routing-policy violations.`,
                `Publish an event-intake log with accepted IDs, quarantined deliveries, and any replay guidance needed for downstream operators.`
            ];
        }
    },
    'report-builder': {
        suffix: 'Report Builder',
        title: 'Report Builder',
        archetype: 'reporting-engine',
        coreMethod: 'metric synthesis and rendering',
        primaryArtifact: 'report-bundle',
        requiredSignals: ['report scope', 'metric definitions', 'presentation template'],
        kpiFocus: ['report freshness', 'metric correctness', 'delivery timeliness'],
        scoringWeights: { truth: 0.3, execution: 0.32, safety: 0.16, impact: 0.22 },
        postureThresholds: { readyMin: 73, reviewMin: 53, reviewRisk: 63, criticalRisk: 82 },
        approvalGates: ['provider-auth-check', 'publication-review'],
        retryPolicy: { maxAttempts: 3, baseDelayMs: 650, backoff: 'exponential' },
        rollbackStrategy: 'hold-publication-and-rebuild-report',
        orchestrationComponents: ['metric query', 'rendering pipeline', 'publication gate', 'delivery confirmation'],
        validationSuites: ['unit', 'integration', 'regression-baseline'],
        releaseCycles: 1,
        mutating: false,
        humanUseCases: [
            'Generate operational reporting from provider data without publishing incorrect or stale metrics.',
            'Standardize reporting outputs so downstream reviews can compare runs consistently.'
        ],
        preflight: [
            'Validate the metric definitions, time window, and publication audience before building the report.',
            'Confirm the source data contract and output template version.'
        ],
        execution: [
            'Compute metrics deterministically and preserve intermediate query identifiers.',
            'Render the report only after freshness and completeness checks pass.'
        ],
        recovery: [
            'Hold publication when metrics are stale, incomplete, or fail reconciliation checks.',
            'Rebuild from the last known good query window after correcting the data issue.'
        ],
        handoff: [
            'Return the report bundle, metric lineage, and publication decision.',
            'Call out any missing windows, excluded entities, or operator notes needed to interpret the report.'
        ],
        failureModes: [
            {
                code: 'E_METRIC_DRIFT',
                trigger: 'Metric outputs diverge from the declared definitions or previous baseline.',
                action: 'Hold publication and attach a metric-delta summary.'
            },
            {
                code: 'E_STALE_DATA',
                trigger: 'Input data freshness falls below the agreed threshold.',
                action: 'Block delivery and rerun once the source window recovers.'
            },
            {
                code: 'E_TEMPLATE_MISMATCH',
                trigger: 'The requested report template no longer matches the computed fields.',
                action: 'Quarantine the render and request template alignment.'
            }
        ],
        guardrails: [
            {
                kind: 'quality',
                rule: 'Hold report publication when metrics drift from declared definitions or freshness thresholds.',
                automation: 'metric-reconcile+freshness-check'
            },
            {
                kind: 'reliability',
                rule: 'Preserve query lineage and output template versions for every report build.',
                automation: 'lineage-capture'
            },
            {
                kind: 'cost',
                rule: 'Reuse cached intermediate results when they remain inside freshness tolerance.',
                automation: 'query-cache-policy'
            }
        ],
        regressionScenario: 'Report generation with stale source data and a template expecting a removed metric.',
        regressionMutation: 'Age the source timestamps beyond freshness tolerance and request a missing metric in the template.',
        implementationGuide(provider, title, purpose) {
            return [
                `Define the report audience, metric definitions, and freshness threshold for ${title}, then confirm which ${provider} entities are in scope.`,
                `Validate credential reuse and ensure the query window matches the reporting cadence before any render starts.`,
                `Implement ${purpose.toLowerCase()} with deterministic metric synthesis, template versioning, and publication gating.`,
                `Capture metric lineage, freshness timestamps, and template identifiers in the report bundle so the output remains auditable.`,
                `Run regression checks that cover stale data, metric drift, and template mismatch before publishing the report.`,
                `Publish the report bundle only after freshness and correctness gates pass, along with any interpretive notes required for downstream readers.`
            ];
        }
    },
    'alert-monitor': {
        suffix: 'Alert Monitor',
        title: 'Alert Monitor',
        archetype: 'monitoring-engine',
        coreMethod: 'threshold evaluation and escalation',
        primaryArtifact: 'alert-state-bundle',
        requiredSignals: ['monitor targets', 'threshold policy', 'escalation channels'],
        kpiFocus: ['alert precision', 'mean time to acknowledge', 'noise rate'],
        scoringWeights: { truth: 0.26, execution: 0.3, safety: 0.28, impact: 0.16 },
        postureThresholds: { readyMin: 76, reviewMin: 56, reviewRisk: 59, criticalRisk: 78 },
        approvalGates: ['provider-auth-check', 'threshold-review'],
        retryPolicy: { maxAttempts: 4, baseDelayMs: 550, backoff: 'exponential' },
        rollbackStrategy: 'silence-alert-pipeline-and-reload-last-stable-thresholds',
        orchestrationComponents: ['signal poll', 'threshold evaluation', 'dedupe suppression', 'escalation routing'],
        validationSuites: ['unit', 'integration', 'simulation', 'regression-baseline'],
        releaseCycles: 2,
        mutating: true,
        humanUseCases: [
            'Monitor provider signals and raise only the alerts that meet the agreed escalation policy.',
            'Reduce alert fatigue by enforcing dedupe and threshold-review guardrails.'
        ],
        preflight: [
            'Validate the signal targets, thresholds, and escalation channels before polling begins.',
            'Confirm the dedupe window and acknowledge who owns follow-up for triggered alerts.'
        ],
        execution: [
            'Evaluate signals deterministically against the active threshold set.',
            'Suppress duplicates and attach enough evidence for the responder to act without re-querying first.'
        ],
        recovery: [
            'Silence the pipeline when threshold drift or duplicate storms exceed tolerance.',
            'Reload the last stable thresholds before resuming alert delivery.'
        ],
        handoff: [
            'Return triggered alerts, suppressed duplicates, and escalation destinations.',
            'Include threshold version, supporting evidence links, and acknowledgement expectations.'
        ],
        failureModes: [
            {
                code: 'E_THRESHOLD_DRIFT',
                trigger: 'Thresholds change without review or diverge from the approved baseline.',
                action: 'Pause alert delivery and require threshold review.'
            },
            {
                code: 'E_DUPLICATE_STORM',
                trigger: 'The monitor emits excessive duplicate alerts in the dedupe window.',
                action: 'Silence the pipeline temporarily and reload the last stable suppression policy.'
            },
            {
                code: 'E_SIGNAL_GAP',
                trigger: 'The provider signal becomes stale or unreachable.',
                action: 'Emit a degraded-monitoring alert and hold dependent escalations.'
            }
        ],
        guardrails: [
            {
                kind: 'quality',
                rule: 'Suppress duplicates and require evidence links on every alert.',
                automation: 'dedupe+evidence-attach'
            },
            {
                kind: 'reliability',
                rule: 'Reload last stable thresholds when alert noise exceeds tolerance.',
                automation: 'threshold-rollback'
            },
            {
                kind: 'compliance',
                rule: 'Do not change escalation channels or thresholds without recorded review.',
                automation: 'threshold-review'
            }
        ],
        regressionScenario: 'Alert monitor with stale signals and a duplicate storm caused by an unreviewed threshold change.',
        regressionMutation: 'Age the signals beyond the freshness window and lower thresholds below the approved baseline.',
        implementationGuide(provider, title, purpose) {
            return [
                `Define the monitored signals, freshness expectations, and escalation policy for ${title}, then lock the reviewed threshold set for ${provider}.`,
                `Validate credential reuse, dedupe windows, and acknowledgement ownership before the monitor starts polling.`,
                `Implement ${purpose.toLowerCase()} with deterministic threshold evaluation, duplicate suppression, and evidence attachment.`,
                `Persist alert state, suppressed duplicates, and escalation routing details so responders can audit every decision.`,
                `Run simulation and regression suites that cover stale signals, threshold drift, and duplicate alert storms.`,
                `Publish an alert-state bundle with threshold version, triggered alerts, and the next review action required for any degraded posture.`
            ];
        }
    },
    'workflow-automator': {
        suffix: 'Workflow Automator',
        title: 'Workflow Automator',
        archetype: 'workflow-orchestration-engine',
        coreMethod: 'stateful workflow execution',
        primaryArtifact: 'workflow-runbook',
        requiredSignals: ['workflow specification', 'trigger context', 'approval policy'],
        kpiFocus: ['workflow success rate', 'approval latency', 'retry recovery rate'],
        scoringWeights: { truth: 0.22, execution: 0.34, safety: 0.28, impact: 0.16 },
        postureThresholds: { readyMin: 77, reviewMin: 57, reviewRisk: 58, criticalRisk: 77 },
        approvalGates: ['provider-auth-check', 'workflow-approval-check'],
        retryPolicy: { maxAttempts: 4, baseDelayMs: 700, backoff: 'exponential' },
        rollbackStrategy: 'halt-workflow-and-replay-from-last-approved-step',
        orchestrationComponents: ['trigger validation', 'step sequencing', 'approval gates', 'step checkpointing'],
        validationSuites: ['unit', 'integration', 'simulation', 'regression-baseline'],
        releaseCycles: 2,
        mutating: true,
        humanUseCases: [
            'Execute multi-step provider workflows with deterministic checkpoints and explicit approvals.',
            'Keep side-effect-heavy automation auditable by treating every step as replayable state.'
        ],
        preflight: [
            'Validate the trigger context, approval policy, and downstream side effects for the workflow.',
            'Confirm which steps are replay-safe and where checkpoints must be stored.'
        ],
        execution: [
            'Run one step at a time with checkpointing and approval gates between mutating boundaries.',
            'Stop immediately when an unapproved branch or ambiguous side effect is encountered.'
        ],
        recovery: [
            'Replay only from the last approved checkpoint after correcting the failing step.',
            'Suspend the workflow when downstream state can no longer be reconciled deterministically.'
        ],
        handoff: [
            'Return the executed steps, pending approvals, and checkpoint references.',
            'Explain whether the workflow finished, paused, rolled back, or is awaiting human action.'
        ],
        failureModes: [
            {
                code: 'E_APPROVAL_MISSING',
                trigger: 'A mutating step is reached without the required approval context.',
                action: 'Pause the workflow and request the missing approval before replay.'
            },
            {
                code: 'E_CHECKPOINT_MISSING',
                trigger: 'The last approved checkpoint is absent or corrupted.',
                action: 'Suspend the workflow and rebuild the checkpoint state before retry.'
            },
            {
                code: 'E_STEP_DRIFT',
                trigger: 'A workflow step no longer matches the declared contract or side effects.',
                action: 'Block progression, quarantine the step, and route to review.'
            }
        ],
        guardrails: [
            {
                kind: 'quality',
                rule: 'Checkpoint every step boundary and attach side-effect evidence before proceeding.',
                automation: 'step-checkpoint+evidence-attach'
            },
            {
                kind: 'safety',
                rule: 'Pause the workflow when approval context is missing or stale.',
                automation: 'workflow-approval-check'
            },
            {
                kind: 'reliability',
                rule: 'Replay only from approved checkpoints after step failures.',
                automation: 'checkpoint-replay'
            }
        ],
        regressionScenario: 'Workflow run reaches a mutating step without approval and has no valid checkpoint to replay from.',
        regressionMutation: 'Strip the approval token and remove the checkpoint reference from the fixture.',
        implementationGuide(provider, title, purpose) {
            return [
                `Define the workflow graph, mutating boundaries, and approval requirements for ${title}, then checkpoint where ${provider} state can be replayed safely.`,
                `Validate credential reuse and trigger context before any step begins, with a focus on which branches require explicit human sign-off.`,
                `Implement ${purpose.toLowerCase()} as a deterministic sequence of step contracts, approvals, and checkpoint writes.`,
                `Capture step-level artifacts, side-effect evidence, and pending approvals in the workflow runbook so every branch remains auditable.`,
                `Run simulation and regression suites that cover missing approvals, missing checkpoints, and contract drift at each step boundary.`,
                `Publish the workflow runbook with completion state, pending approvals, and the exact checkpoint required for any safe replay.`
            ];
        }
    },
    'approval-router': {
        suffix: 'Approval Router',
        title: 'Approval Router',
        archetype: 'approval-routing-engine',
        coreMethod: 'policy-based approver selection',
        primaryArtifact: 'approval-decision-packet',
        requiredSignals: ['decision payload', 'routing policy', 'approver roster'],
        kpiFocus: ['routing accuracy', 'time to decision', 'escalation coverage'],
        scoringWeights: { truth: 0.24, execution: 0.24, safety: 0.38, impact: 0.14 },
        postureThresholds: { readyMin: 79, reviewMin: 59, reviewRisk: 57, criticalRisk: 75 },
        approvalGates: ['routing-policy-review', 'human-approval-router'],
        retryPolicy: { maxAttempts: 2, baseDelayMs: 800, backoff: 'exponential' },
        rollbackStrategy: 'pause-routing-and-revert-to-manual-review-queue',
        orchestrationComponents: ['policy resolution', 'reviewer lookup', 'escalation routing', 'decision audit trail'],
        validationSuites: ['unit', 'integration', 'simulation', 'regression-baseline'],
        releaseCycles: 3,
        mutating: true,
        humanUseCases: [
            'Route high-impact provider actions to the right human owner without silently dropping accountability.',
            'Keep approval flows transparent by preserving policy matches and escalation history.'
        ],
        preflight: [
            'Validate the policy set, approver roster, and escalation rules before routing any decision.',
            'Confirm the fallback manual review queue for unresolved or ambiguous cases.'
        ],
        execution: [
            'Resolve routing policy deterministically and preserve the policy clauses that drove the selection.',
            'Escalate ambiguous ownership instead of guessing an approver.'
        ],
        recovery: [
            'Pause automatic routing when the policy set or roster becomes inconsistent.',
            'Revert to the manual review queue until the policy mismatch is corrected.'
        ],
        handoff: [
            'Return the selected approver, matched policy clauses, and escalation path.',
            'Document whether the request is approved, pending, or forced into manual review.'
        ],
        failureModes: [
            {
                code: 'E_POLICY_GAP',
                trigger: 'No policy clause matches the decision payload.',
                action: 'Send the request to manual review and record the missing policy gap.'
            },
            {
                code: 'E_OWNER_AMBIGUITY',
                trigger: 'Multiple approvers match and policy cannot disambiguate safely.',
                action: 'Escalate to the fallback review queue instead of auto-selecting.'
            },
            {
                code: 'E_ROSTER_STALE',
                trigger: 'The selected approver is unavailable or no longer authorized.',
                action: 'Block automated routing and require roster refresh.'
            }
        ],
        guardrails: [
            {
                kind: 'safety',
                rule: 'Route ambiguous or unmatched requests to manual review instead of inferring an owner.',
                automation: 'manual-review-fallback'
            },
            {
                kind: 'compliance',
                rule: 'Preserve the exact policy clauses and roster version used for every routing decision.',
                automation: 'policy-audit-trail'
            },
            {
                kind: 'reliability',
                rule: 'Pause automatic routing when roster health or policy completeness degrades.',
                automation: 'roster-health-check'
            }
        ],
        regressionScenario: 'Approval routing with no matching policy and a stale approver roster.',
        regressionMutation: 'Remove all matching policy clauses from the fixture and mark the candidate approver unavailable.',
        implementationGuide(provider, title, purpose) {
            return [
                `Define the decision classes, approver roster, and escalation hierarchy for ${title}, then capture the manual fallback path for ${provider}.`,
                `Validate credential reuse and confirm that the routing policy and approver roster versions are both current before any decisions are routed.`,
                `Implement ${purpose.toLowerCase()} so the routing decision always includes policy clauses, approver evidence, and escalation context.`,
                `Persist the selected reviewer, fallback route, and audit trail so every approval request remains explainable.`,
                `Run simulation and regression suites that cover missing policy clauses, owner ambiguity, and stale roster entries.`,
                `Publish an approval-decision packet with the selected owner, escalation state, and policy gaps that require administrative follow-up.`
            ];
        }
    },
    'migration-assistant': {
        suffix: 'Migration Assistant',
        title: 'Migration Assistant',
        archetype: 'migration-engine',
        coreMethod: 'staged migration planning and cutover',
        primaryArtifact: 'migration-cutover-plan',
        requiredSignals: ['source inventory', 'target mapping', 'rollback plan'],
        kpiFocus: ['migration completeness', 'cutover risk', 'rollback success rate'],
        scoringWeights: { truth: 0.2, execution: 0.24, safety: 0.4, impact: 0.16 },
        postureThresholds: { readyMin: 80, reviewMin: 60, reviewRisk: 56, criticalRisk: 74 },
        approvalGates: ['migration-plan-review', 'rollback-readiness-check'],
        retryPolicy: { maxAttempts: 1, baseDelayMs: 1000, backoff: 'exponential' },
        rollbackStrategy: 'abort-cutover-and-revert-to-last-stable-platform-state',
        orchestrationComponents: ['inventory scan', 'mapping validation', 'cutover rehearsal', 'rollback checkpoint'],
        validationSuites: ['unit', 'integration', 'simulation', 'regression-baseline'],
        releaseCycles: 3,
        mutating: true,
        humanUseCases: [
            'Plan and execute provider migrations without guessing through cutover or rollback risk.',
            'Treat migrations as staged rehearsals backed by checkpoints and rollback evidence.'
        ],
        preflight: [
            'Validate the full source inventory, target mapping, cutover window, and rollback checkpoint before rehearsal begins.',
            'Require an explicit human approval path for every irreversible step in the migration.'
        ],
        execution: [
            'Rehearse the migration with deterministic checkpoints before the production cutover is allowed.',
            'Pause on any unapproved mapping gap or rollback weakness rather than proceeding optimistically.'
        ],
        recovery: [
            'Abort cutover immediately when checkpoints or rollback evidence fail validation.',
            'Revert to the last stable platform state and capture every partially migrated object for review.'
        ],
        handoff: [
            'Return the migration cutover plan, rehearsal results, and rollback status.',
            'State clearly whether the migration is ready, blocked, partially rolled back, or awaiting approval.'
        ],
        failureModes: [
            {
                code: 'E_INVENTORY_GAP',
                trigger: 'The source inventory is incomplete or inconsistent with the target mapping.',
                action: 'Block rehearsal and request a corrected inventory or mapping diff.'
            },
            {
                code: 'E_ROLLBACK_WEAKNESS',
                trigger: 'Rollback checkpoints are missing or cannot restore all affected entities.',
                action: 'Fail closed and prohibit cutover approval.'
            },
            {
                code: 'E_PARTIAL_CUTOVER',
                trigger: 'The cutover succeeds for only a subset of the planned assets.',
                action: 'Abort the migration and revert to the last stable platform state.'
            }
        ],
        guardrails: [
            {
                kind: 'safety',
                rule: 'Do not permit cutover without a rehearsed rollback checkpoint and explicit approval.',
                automation: 'rollback-readiness-check'
            },
            {
                kind: 'quality',
                rule: 'Require inventory-to-mapping reconciliation before rehearsal and again before cutover.',
                automation: 'inventory-reconcile'
            },
            {
                kind: 'reliability',
                rule: 'Abort immediately on partial cutover and revert to the last stable platform state.',
                automation: 'cutover-abort-and-revert'
            }
        ],
        regressionScenario: 'Migration rehearsal with an incomplete source inventory and no rollback checkpoint.',
        regressionMutation: 'Remove items from the source inventory and strip the rollback checkpoint reference from the fixture.',
        implementationGuide(provider, title, purpose) {
            return [
                `Define the source inventory, target mapping, cutover window, and rollback checkpoint for ${title} before any ${provider} rehearsal is approved.`,
                `Validate credential reuse, export baselines, and the human approval chain for every irreversible migration step.`,
                `Implement ${purpose.toLowerCase()} as staged rehearsal, checkpoint, and cutover workflows that preserve a deterministic revert path.`,
                `Capture migration inventories, mapping diffs, checkpoint identifiers, and partial-failure evidence in the cutover plan.`,
                `Run simulation and regression suites that cover missing inventory, rollback weakness, and partial cutover outcomes.`,
                `Publish a migration cutover plan with rehearsal status, rollback readiness, and the exact approval still required for production execution.`
            ];
        }
    }
};

const PROVIDER_RULES: ProviderRule[] = [
    {
        patterns: ['github', 'gitlab', 'bitbucket'],
        category: 'Developer platforms',
        protocols: ['HTTPS/REST', 'provider SDK'],
        authKinds: ['token'],
        apiKeyLikelyRequired: false,
        highRisk: false,
        notes: ['Reuse personal access tokens or app installation tokens when available.']
    },
    {
        patterns: ['jira', 'linear', 'notion', 'confluence', 'airtable', 'coda', 'asana', 'trello', 'monday'],
        category: 'Work management and knowledge platforms',
        protocols: ['HTTPS/REST', 'provider SDK'],
        authKinds: ['oauth2', 'token'],
        apiKeyLikelyRequired: false,
        highRisk: false,
        notes: ['Prefer workspace-scoped OAuth or integration tokens over long-lived personal credentials.']
    },
    {
        patterns: ['slack', 'discord', 'teams', 'twilio', 'sendgrid', 'mailgun'],
        category: 'Messaging and communications platforms',
        protocols: ['HTTPS/REST', 'webhook callbacks'],
        authKinds: ['oauth2', 'token'],
        apiKeyLikelyRequired: true,
        highRisk: false,
        notes: ['Validate bot/app scopes before enabling mutating or broadcast behavior.']
    },
    {
        patterns: ['gmail', 'outlook', 'calendar', 'drive', 'dropbox', 'onedrive', 'box'],
        category: 'Productivity and file platforms',
        protocols: ['HTTPS/REST', 'provider SDK'],
        authKinds: ['oauth2'],
        apiKeyLikelyRequired: false,
        highRisk: false,
        notes: ['Prefer existing user or service sessions and confirm tenant/workspace context before writes.']
    },
    {
        patterns: ['salesforce', 'hubspot', 'pipedrive', 'zendesk', 'intercom', 'servicenow', 'shopify', 'marketo'],
        category: 'Business systems and customer operations',
        protocols: ['HTTPS/REST', 'provider SDK'],
        authKinds: ['oauth2', 'token'],
        apiKeyLikelyRequired: false,
        highRisk: true,
        notes: ['Validate object-level permissions and sandbox-vs-production target before mutation.']
    },
    {
        patterns: ['stripe', 'paypal', 'square', 'plaid', 'adyen', 'braintree'],
        category: 'Payments and finance systems',
        protocols: ['HTTPS/REST', 'webhook callbacks'],
        authKinds: ['api_key', 'token'],
        apiKeyLikelyRequired: true,
        highRisk: true,
        notes: ['Treat live-mode keys and financial mutations as mission critical.']
    },
    {
        patterns: ['openai', 'anthropic', 'cohere', 'pinecone', 'weaviate'],
        category: 'AI and model platforms',
        protocols: ['HTTPS/REST'],
        authKinds: ['api_key'],
        apiKeyLikelyRequired: true,
        highRisk: false,
        notes: ['Prefer existing model provider keys and verify quota before batch execution.']
    },
    {
        patterns: ['snowflake', 'bigquery', 'redshift', 'postgres', 'mysql', 'mongodb', 'elastic', 'elasticsearch'],
        category: 'Data platforms',
        protocols: ['HTTPS/REST', 'SQL or driver/SDK'],
        authKinds: ['service_account', 'session'],
        apiKeyLikelyRequired: false,
        highRisk: true,
        notes: ['Validate destination environment and query scope to avoid uncontrolled data exposure.']
    },
    {
        patterns: ['datadog', 'new relic', 'sentry', 'pagerduty', 'splunk', 'grafana'],
        category: 'Observability and incident platforms',
        protocols: ['HTTPS/REST', 'webhook callbacks'],
        authKinds: ['api_key', 'token'],
        apiKeyLikelyRequired: true,
        highRisk: true,
        notes: ['Preserve incident IDs, monitors, and alert routes in every artifact bundle.']
    },
    {
        patterns: ['aws', 'azure', 'gcp', 'cloudflare', 'vercel', 'netlify', 'render', 'docker', 'kubernetes'],
        category: 'Cloud and infrastructure platforms',
        protocols: ['HTTPS/REST', 'CLI or SDK'],
        authKinds: ['service_account', 'token'],
        apiKeyLikelyRequired: false,
        highRisk: true,
        notes: ['Verify environment, region, and account context before mutating infrastructure state.']
    }
];

function parseArgs(argv: string[]): CliOptions {
    const options: CliOptions = {
        repoRoot: REPO_ROOT,
        outputRoot: DEFAULT_OUTPUT_ROOT,
        sourceManifestRelativePath: DEFAULT_SOURCE_MANIFEST_RELATIVE_PATH,
        removeSource: true
    };

    for (let i = 0; i < argv.length; i++) {
        const token = argv[i];
        if (token === '--out') {
            options.outputRoot = path.resolve(REPO_ROOT, argv[i + 1]);
            i += 1;
            continue;
        }
        if (token === '--source-manifest') {
            options.sourceManifestRelativePath = argv[i + 1];
            i += 1;
            continue;
        }
        if (token === '--keep-source') {
            options.removeSource = false;
            continue;
        }
    }

    return options;
}

function assert(condition: unknown, message: string): asserts condition {
    if (!condition) throw new Error(message);
}

function slugify(value: string): string {
    return String(value || '')
        .trim()
        .toLowerCase()
        .replace(/&/g, ' and ')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/-{2,}/g, '-');
}

function titleCase(value: string): string {
    return String(value || '')
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function toEnvKey(value: string): string {
    return slugify(value).replace(/-/g, '_').toUpperCase();
}

function ensureDir(dirPath: string) {
    fs.mkdirSync(dirPath, { recursive: true });
}

function readLocalOrRemote(repoRoot: string, relativePath: string): string {
    const absolutePath = path.join(repoRoot, relativePath);
    if (fs.existsSync(absolutePath)) {
        return fs.readFileSync(absolutePath, 'utf8');
    }

    return execFileSync('git', ['show', `origin/main:${relativePath}`], {
        cwd: repoRoot,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe']
    });
}

function loadToolIdeaManifest(options: CliOptions): ToolIdeaBuildManifest {
    const raw = readLocalOrRemote(options.repoRoot, options.sourceManifestRelativePath);
    const parsed = JSON.parse(raw) as ToolIdeaBuildManifest;
    assert(Array.isArray(parsed.jobs), `Invalid tool idea manifest: ${options.sourceManifestRelativePath}`);
    return parsed;
}

function flattenToolIdeaItems(manifest: ToolIdeaBuildManifest): ToolIdeaItem[] {
    return manifest.jobs
        .flatMap((job) =>
            job.items.map((item) => ({
                ...item,
                agent: job.agent
            }))
        )
        .sort((a, b) => a.id - b.id);
}

function splitToolTitle(title: string): { provider: string; operationKey: OperationKey; operationTitle: string; } {
    const match = (Object.entries(OPERATION_PROFILES) as Array<[OperationKey, OperationProfile]>)
        .sort((a, b) => b[1].suffix.length - a[1].suffix.length)
        .find(([, profile]) => title.endsWith(profile.suffix));

    assert(match, `Unknown tool title pattern: ${title}`);
    const [operationKey, profile] = match;
    const provider = title.slice(0, title.length - profile.suffix.length).trim();
    assert(provider.length > 0, `Could not infer provider from title: ${title}`);
    return {
        provider,
        operationKey,
        operationTitle: profile.title
    };
}

function getShardName(id: number): string {
    return `${SHARD_PREFIX}${String(Math.ceil(id / 100)).padStart(2, '0')}`;
}

function inferProviderRule(provider: string): ProviderRule {
    const normalized = slugify(provider);
    return PROVIDER_RULES.find((rule) => rule.patterns.some((pattern) => normalized.includes(slugify(pattern)))) || {
        patterns: [],
        category: 'External SaaS integrations',
        protocols: ['HTTPS/REST'],
        authKinds: ['oauth2', 'token'],
        apiKeyLikelyRequired: false,
        highRisk: false,
        notes: ['Reuse existing sessions or provider tokens before requesting new credentials.']
    };
}

function authModeLabel(kind: SkillIntegrationAuthKind): string {
    switch (kind) {
        case 'oauth2':
            return 'OAuth client or delegated session';
        case 'token':
            return 'Access token or personal access token';
        case 'api_key':
            return 'API key or account secret';
        case 'service_account':
            return 'Service account or machine credential';
        case 'session':
            return 'Existing session or local profile';
        case 'signing_secret':
            return 'Webhook signing secret';
        default:
            return titleCase(kind.replace(/_/g, ' '));
    }
}

function authModeEnvVars(provider: string, kind: SkillIntegrationAuthKind): string[] {
    const prefix = toEnvKey(provider);
    switch (kind) {
        case 'oauth2':
            return [`${prefix}_CLIENT_ID`, `${prefix}_CLIENT_SECRET`];
        case 'token':
            return [`${prefix}_TOKEN`, `${prefix}_ACCESS_TOKEN`];
        case 'api_key':
            return [`${prefix}_API_KEY`];
        case 'service_account':
            return [`${prefix}_SERVICE_ACCOUNT_JSON`, `${prefix}_CREDENTIALS_FILE`];
        case 'session':
            return [`${prefix}_SESSION`, `${prefix}_PROFILE`];
        case 'signing_secret':
            return [`${prefix}_WEBHOOK_SECRET`, `${prefix}_SIGNING_SECRET`];
        default:
            return [`${prefix}_SECRET`];
    }
}

function authModeValidation(kind: SkillIntegrationAuthKind): string {
    switch (kind) {
        case 'oauth2':
            return 'Reuse an active delegated session or validate the client credentials with a lightweight identity call.';
        case 'token':
            return 'Validate the token with the smallest read-only endpoint that proves scope and tenancy.';
        case 'api_key':
            return 'Validate the key with a lightweight authenticated request and confirm environment or mode (sandbox vs production).';
        case 'service_account':
            return 'Verify the machine credential or profile against the target environment before any mutating step.';
        case 'session':
            return 'Check the current session/profile and confirm it points at the intended tenant or workspace.';
        case 'signing_secret':
            return 'Verify signature generation against a known sample payload before accepting live webhook traffic.';
        default:
            return 'Validate the credential with a minimal authenticated request before execution.';
    }
}

function uniqueAuthKinds(kinds: SkillIntegrationAuthKind[]): SkillIntegrationAuthKind[] {
    return Array.from(new Set(kinds));
}

function buildIntegrationProfile(provider: string, operationKey: OperationKey, mutating: boolean): SkillIntegrationProfile {
    const providerRule = inferProviderRule(provider);
    const providerSlug = slugify(provider);
    const authKinds = uniqueAuthKinds([
        ...providerRule.authKinds,
        ...(operationKey === 'webhook-listener' ? ['signing_secret' as const] : []),
        ...(operationKey === 'webhook-listener' ? ['token' as const] : [])
    ]);

    const authModes: SkillIntegrationAuthMode[] = authKinds.map((kind) => ({
        kind,
        label: authModeLabel(kind),
        envVars: authModeEnvVars(provider, kind),
        required: true,
        validation: authModeValidation(kind)
    }));

    return {
        provider,
        providerSlug,
        category: providerRule.category,
        operation: OPERATION_PROFILES[operationKey].title,
        operationSlug: operationKey,
        protocols: providerRule.protocols,
        authModes,
        externalAuthRequired: true,
        apiKeyLikelyRequired: providerRule.apiKeyLikelyRequired || authKinds.includes('api_key'),
        mutating,
        webhookCapable: operationKey === 'webhook-listener',
        notes: providerRule.notes
    };
}

function buildReason(provider: string, title: string, purpose: string, operationKey: OperationKey): string {
    const riskLine =
        operationKey === 'data-importer' || operationKey === 'migration-assistant'
            ? 'state changes are hard to undo once they begin'
            : operationKey === 'webhook-listener'
                ? 'unverified events can trigger unsafe downstream actions'
                : 'auth, schema, and side-effect handling drift when integrations are run ad hoc';
    return `We need this skill because ${provider} workflows degrade when ${riskLine}. This specific skill turns ${title} into a deterministic, auth-checked workflow for ${purpose.toLowerCase()}.`;
}

function normalizePurpose(purpose: string): string {
    return String(purpose || '').trim().replace(/\s+/g, ' ');
}

function buildRuntimeProfile(
    item: ToolIdeaItem,
    operationKey: OperationKey,
    integrationProfile: SkillIntegrationProfile
): SkillRuntimeProfile {
    const operation = OPERATION_PROFILES[operationKey];
    const providerSlug = integrationProfile.providerSlug;
    return {
        archetype: operation.archetype,
        coreMethod: operation.coreMethod,
        primaryArtifact: `${providerSlug}-${operation.primaryArtifact}`.slice(0, 80),
        requiredSignals: operation.requiredSignals,
        kpiFocus: operation.kpiFocus,
        scoringWeights: operation.scoringWeights,
        postureThresholds: operation.postureThresholds,
        orchestration: {
            routingTag: `${providerSlug}:${operationKey}`.slice(0, 80),
            approvalGates: operation.approvalGates,
            retryPolicy: operation.retryPolicy,
            rollbackStrategy: operation.rollbackStrategy,
            components: operation.orchestrationComponents
        },
        validation: {
            suites: operation.validationSuites,
            baselineRequired: true
        },
        rollout: {
            featureFlag: `tool_skill_${String(item.id).padStart(4, '0')}_${providerSlug}`.slice(0, 44),
            releaseCycles: operation.releaseCycles,
            telemetryAlerts: true
        },
        scoringSeed: `tool-skill:${item.id}:${providerSlug}:${operationKey}`
    };
}

function classifyTier(operationKey: OperationKey, integrationProfile: SkillIntegrationProfile): SkillImprovementProfile['tier'] {
    if (
        integrationProfile.apiKeyLikelyRequired
        || integrationProfile.category.includes('finance')
        || integrationProfile.category.includes('Cloud')
        || integrationProfile.category.includes('Data')
        || operationKey === 'data-importer'
        || operationKey === 'migration-assistant'
        || operationKey === 'approval-router'
        || operationKey === 'webhook-listener'
    ) {
        return 'mission_critical';
    }
    if (
        operationKey === 'connector'
        || operationKey === 'sync-orchestrator'
        || operationKey === 'workflow-automator'
        || operationKey === 'alert-monitor'
    ) {
        return 'advanced';
    }
    return 'foundation';
}

function tierSlo(tier: SkillImprovementProfile['tier']): string {
    if (tier === 'mission_critical') return '>=99.9% successful runs per 7-day window';
    if (tier === 'advanced') return '>=99.7% successful runs per 7-day window';
    return '>=99.5% successful runs per 7-day window';
}

function tierErrorBudget(tier: SkillImprovementProfile['tier']): string {
    if (tier === 'mission_critical') return '<=0.1% critical failures per 7-day window';
    if (tier === 'advanced') return '<=0.3% critical failures per 7-day window';
    return '<=0.5% critical failures per 7-day window';
}

function buildImprovementProfile(
    title: string,
    operationKey: OperationKey,
    runtimeProfile: SkillRuntimeProfile,
    integrationProfile: SkillIntegrationProfile
): SkillImprovementProfile {
    const operation = OPERATION_PROFILES[operationKey];
    const tier = classifyTier(operationKey, integrationProfile);
    const approvals = runtimeProfile.orchestration.approvalGates;
    const autopilotReady = tier !== 'mission_critical';
    const additionalGuardrails = [...operation.guardrails];

    if (integrationProfile.apiKeyLikelyRequired) {
        additionalGuardrails.push({
            kind: 'compliance',
            rule: 'Validate provider key or secret mode (sandbox vs production) before any mutating execution.',
            automation: 'credential-mode-check'
        });
    }

    return {
        version: 1,
        tier,
        humanUseCases: operation.humanUseCases,
        runbook: {
            preflight: operation.preflight,
            execution: operation.execution,
            recovery: operation.recovery,
            handoff: operation.handoff
        },
        guardrails: additionalGuardrails,
        observability: {
            slo: tierSlo(tier),
            errorBudget: tierErrorBudget(tier),
            alertTriggers: [
                'credential validation failures exceed baseline',
                'schema or contract regressions persist for two consecutive runs',
                'critical posture or rollback events exceed tolerance'
            ]
        },
        automation: {
            autopilotReady,
            parallelism: tier === 'mission_critical' ? 1 : tier === 'advanced' ? 2 : 3,
            maxCycleMinutes: tier === 'mission_critical' ? 15 : tier === 'advanced' ? 20 : 25,
            approvals
        },
        outcomes: {
            primaryMetric: runtimeProfile.kpiFocus[0],
            secondaryMetrics: runtimeProfile.kpiFocus.slice(1),
            reviewCadence: tier === 'mission_critical' ? 'daily' : 'weekly'
        }
    };
}

function buildImplementation(item: ToolIdeaItem): SkillImplementation {
    const { provider, operationKey } = splitToolTitle(item.tool);
    const skillName = slugify(item.tool).slice(0, 64);
    const integrationProfile = buildIntegrationProfile(provider, operationKey, OPERATION_PROFILES[operationKey].mutating);
    const runtimeProfile = buildRuntimeProfile(item, operationKey, integrationProfile);
    const reason = buildReason(provider, item.tool, item.purpose, operationKey);
    const implementationGuide = OPERATION_PROFILES[operationKey].implementationGuide(provider, item.tool, normalizePurpose(item.purpose));
    const improvementProfile = buildImprovementProfile(item.tool, operationKey, runtimeProfile, integrationProfile);

    return {
        version: 1,
        sourceFile: 'skills/generated/tool-ideas-agents/build.manifest.json',
        skillId: item.id,
        skillName,
        title: item.tool,
        domain: integrationProfile.category,
        domainSlug: slugify(integrationProfile.category),
        reason,
        implementationGuide,
        runtimeProfile,
        improvementProfile,
        integrationProfile,
        traceability: {
            scopeStep: implementationGuide[0],
            contractStep: implementationGuide[1],
            coreStep: implementationGuide[2],
            orchestrationStep: implementationGuide[3],
            validationStep: implementationGuide[4],
            rolloutStep: implementationGuide[5]
        }
    };
}

function buildMinimalValidFixture(implementation: SkillImplementation): Record<string, unknown> {
    const integration = implementation.integrationProfile!;
    const operation = OPERATION_PROFILES[integration.operationSlug as OperationKey];
    return {
        skillId: implementation.skillId,
        skillName: implementation.skillName,
        title: implementation.title,
        provider: integration.provider,
        category: integration.category,
        operation: integration.operationSlug,
        authContext: {
            mode: integration.authModes[0]?.kind || 'token',
            envVars: integration.authModes[0]?.envVars || [],
            status: 'present-and-validated'
        },
        input: {
            requiredSignals: implementation.runtimeProfile.requiredSignals.reduce<Record<string, string>>((acc, signal) => {
                acc[slugify(signal).replace(/-/g, '_')] = `sample_${slugify(signal).replace(/-/g, '_')}`;
                return acc;
            }, {}),
            approvalGates: implementation.runtimeProfile.orchestration.approvalGates,
            rollbackStrategy: implementation.runtimeProfile.orchestration.rollbackStrategy
        },
        expected: {
            primaryArtifact: implementation.runtimeProfile.primaryArtifact,
            kpiFocus: implementation.runtimeProfile.kpiFocus,
            validationSuites: implementation.runtimeProfile.validation.suites,
            postureThresholds: implementation.runtimeProfile.postureThresholds
        },
        regressionHint: {
            scenario: operation.regressionScenario,
            mutation: operation.regressionMutation
        }
    };
}

function renderTable(rows: string[][]): string {
    const [header, ...body] = rows;
    const lines = [
        `| ${header.join(' | ')} |`,
        `| ${header.map(() => '---').join(' | ')} |`
    ];
    for (const row of body) {
        lines.push(`| ${row.join(' | ')} |`);
    }
    return lines.join('\n');
}

function buildSkillMarkdown(implementation: SkillImplementation): string {
    const integration = implementation.integrationProfile!;
    const runtime = implementation.runtimeProfile;
    const improvement = implementation.improvementProfile!;
    const operation = OPERATION_PROFILES[integration.operationSlug as OperationKey];
    const authRows = integration.authModes.map((mode) => [
        mode.label,
        `\`${mode.kind}\``,
        mode.envVars.map((env) => `\`${env}\``).join(', '),
        mode.validation
    ]);
    const failureRows = operation.failureModes.map((failure) => [
        `\`${failure.code}\``,
        failure.trigger,
        failure.action
    ]);

    return `---
name: ${implementation.skillName}
description: Use when tasks require ${implementation.title.toLowerCase()} with credential-aware preflight, deterministic execution, validation gates, and handoff-ready artifacts.
---

# ${implementation.title}

## Quick Reference
${renderTable([
    ['Field', 'Value'],
    ['Skill ID', `\`${implementation.skillId}\``],
    ['Provider', `\`${integration.provider}\``],
    ['Operation', `\`${integration.operation}\``],
    ['Domain', `\`${implementation.domain}\``],
    ['Runtime archetype', `\`${runtime.archetype}\``],
    ['Core method', `\`${runtime.coreMethod}\``],
    ['Primary artifact', `\`${runtime.primaryArtifact}\``],
    ['Routing tag', `\`${runtime.orchestration.routingTag}\``],
    ['Mutating', `\`${integration.mutating ? 'yes' : 'no'}\``],
    ['Release cycles', `\`${runtime.rollout.releaseCycles}\``]
])}

## Why This Skill Exists
${implementation.reason}

## Trigger Checklist
- [ ] The task explicitly requires \`${implementation.title}\` rather than generic brainstorming.
- [ ] The provider tenant, workspace, or environment is known before execution begins.
- [ ] Credential reuse has been checked before asking for new secrets.
- [ ] Success criteria, side effects, and handoff owner are clear.
- [ ] If the run mutates provider state, the relevant approval gates are available.

## Auth & Access Profile
${renderTable([
    ['Field', 'Value'],
    ['External auth required', `\`${integration.externalAuthRequired ? 'yes' : 'no'}\``],
    ['API key likely required', `\`${integration.apiKeyLikelyRequired ? 'yes' : 'no'}\``],
    ['Protocols', integration.protocols.map((value) => `\`${value}\``).join(', ')],
    ['Mutating', `\`${integration.mutating ? 'yes' : 'no'}\``],
    ['Webhook capable', `\`${integration.webhookCapable ? 'yes' : 'no'}\``]
])}

${renderTable([
    ['Auth Mode', 'Kind', 'Env Hints', 'Validation'],
    ...authRows
])}

## Inputs (contract)
${renderTable([
    ['Input', 'Type', 'Required', 'Source'],
    ...runtime.requiredSignals.map((signal) => [signal, 'signal', 'yes', 'operator or upstream tool'])
])}

## Outputs (contract)
${renderTable([
    ['Output', 'Type', 'Guaranteed', 'Consumer'],
    [runtime.primaryArtifact, 'structured-artifact', 'yes', 'next workflow or operator'],
    [`${runtime.primaryArtifact}-scorecard`, 'scorecard', 'yes', 'reviewer'],
    [`${runtime.primaryArtifact}-handoff`, 'handoff-packet', 'yes', 'downstream owner']
])}

## Step-by-Step Implementation Guide
1. ${implementation.implementationGuide[0]}
2. ${implementation.implementationGuide[1]}
3. ${implementation.implementationGuide[2]}
4. ${implementation.implementationGuide[3]}
5. ${implementation.implementationGuide[4]}
6. ${implementation.implementationGuide[5]}

## Operational Runbook
### Preflight
${improvement.runbook.preflight.map((line) => `- ${line}`).join('\n')}

### Execution
${improvement.runbook.execution.map((line) => `- ${line}`).join('\n')}

### Recovery
${improvement.runbook.recovery.map((line) => `- ${line}`).join('\n')}

### Handoff
${improvement.runbook.handoff.map((line) => `- ${line}`).join('\n')}

## Validation Gates & Test Matrix
${renderTable([
    ['Gate', 'Purpose', 'On Fail'],
    ['auth-preflight', 'Validate credential presence, scope, and environment before work begins.', 'block execution'],
    ['schema-contract-check', 'Ensure required signals and payload shapes remain valid.', 'quarantine and request correction'],
    ['policy-approval-check', 'Verify the declared approval gates before mutating or publishing state.', 'pause or route to human review'],
    ['reliability-check', 'Confirm retries, rollback, and checkpoint readiness.', 'rollback or fail closed']
])}

- Required validation suites: ${runtime.validation.suites.map((suite) => `\`${suite}\``).join(', ')}

## Failure Modes & Recovery Playbook
${renderTable([
    ['Code', 'Trigger', 'Action'],
    ...failureRows
])}

## Tool Call Implementation
- Reuse existing credentials first. Check environment variables, secure stores, and active sessions before prompting.
- Start with the smallest authenticated read or validation call that proves identity and scope.
- Preserve request, response, and approval traces in \`${runtime.primaryArtifact}\` so downstream owners do not need to rediscover context.
- If any auth, contract, or approval gate fails, halt execution and attach remediation guidance instead of guessing.

## Credential Reuse Policy
- Reuse valid provider credentials by default and prefer tenant-scoped sessions over newly created secrets.
- Prompt for credentials only when they are missing, invalid, expired, or point at the wrong environment.
- For webhook flows, validate the signing secret against a known sample before accepting live traffic.

## Guardrails
${improvement.guardrails.map((guardrail) => `- ${guardrail.kind}: ${guardrail.rule} (\`${guardrail.automation}\`)`).join('\n')}

## Acceptance Checklist
- [ ] Credential preflight and scope validation completed successfully.
- [ ] Required validation suites ran and all fail-closed gates passed.
- [ ] ${runtime.primaryArtifact}, scorecard, and handoff packet were produced.
- [ ] Any mutations, approvals, or rollbacks are reflected in the artifact bundle.

## Anti-Patterns
- Do not ask for new credentials before checking reusable auth context.
- Do not skip the read-only or dry-run validation step for mutating work.
- Do not proceed when approval gates, signing secrets, or rollback checkpoints are missing.
- Do not hand off partial or ambiguous provider state as complete.

## Handoff Contract
- **Produces:** \`${runtime.primaryArtifact}\`, execution scorecard, approval trace, and next actions.
- **Consumes:** ${runtime.requiredSignals.map((signal) => `\`${signal}\``).join(', ')}.
- **Readiness rule:** release only after auth, contract, approval, and reliability gates all pass.
- **Downstream hint:** route to \`${runtime.orchestration.routingTag}\` consumers with approval and credential context attached.

## Observability & Continuous Improvement
- SLO: ${improvement.observability.slo}
- Error budget: ${improvement.observability.errorBudget}
- Alert triggers:
${improvement.observability.alertTriggers.map((trigger) => `- ${trigger}`).join('\n')}
- Primary outcome metric: \`${improvement.outcomes.primaryMetric}\`
- Secondary metrics: ${improvement.outcomes.secondaryMetrics.map((metric) => `\`${metric}\``).join(', ')}
- Review cadence: \`${improvement.outcomes.reviewCadence}\`
`;
}

function buildRegressionCaseMarkdown(implementation: SkillImplementation): string {
    const integration = implementation.integrationProfile!;
    const operation = OPERATION_PROFILES[integration.operationSlug as OperationKey];
    return `# Regression Case

## Scenario
${operation.regressionScenario}

## Fixture
\`../fixtures/minimal-valid.json\` (mutated to violate auth, contract, or approval requirements).

## Mutation
${operation.regressionMutation}

## Expected Behavior (Fail-Closed)
- Credential or contract validation fails deterministically.
- No publish-level or mutating output is emitted without the required approval state.
- The run records a stable error classification and attaches rollback or review guidance.

## Determinism Check
Running the same mutated payload repeatedly must produce the same failure class, same blocked gate, and stable diagnostics within declared tolerance.
`;
}

function buildHardeningSummary(implementation: SkillImplementation): Record<string, unknown> {
    return {
        version: '1.0.0',
        hardened: true,
        requirements: {
            credential_preflight: true,
            api_key_or_token_awareness: true,
            deterministic_tolerances: true,
            fail_closed_validation_gates: true,
            explicit_handoff_contract: true,
            fixtures_minimal_valid: true,
            tests_regression_case: true
        },
        integration: {
            provider: implementation.integrationProfile?.provider,
            operation: implementation.integrationProfile?.operation,
            apiKeyLikelyRequired: implementation.integrationProfile?.apiKeyLikelyRequired ?? false,
            authModes: implementation.integrationProfile?.authModes.map((mode) => mode.kind) || []
        },
        artifacts: {
            skill: 'SKILL.md',
            implementation: 'implementation.json',
            fixture: 'fixtures/minimal-valid.json',
            regressionTest: 'tests/regression-case.md',
            adapter: 'openclaw/skill.adapter.json'
        }
    };
}

function buildAdapterPayload(item: ToolIdeaItem, implementation: SkillImplementation, skillRelativePath: string, agent: string) {
    const integration = implementation.integrationProfile!;
    return {
        schemaVersion: 'openclaw-tool-skill-adapter/v1',
        target: 'openclaw',
        mode: 'extension',
        id: item.id,
        name: implementation.skillName,
        title: implementation.title,
        description: normalizePurpose(item.purpose),
        agent,
        codex: {
            skillPath: skillRelativePath,
            entrypoint: skillRelativePath
        },
        openclaw: {
            adapterType: 'tool-skill',
            invocationModel: 'plan-execute-verify',
            outputs: ['summary', 'artifacts', 'follow_up']
        },
        triggers: [
            implementation.title.toLowerCase(),
            `${implementation.title.toLowerCase()} workflow`,
            `${implementation.title.toLowerCase()} automation`
        ],
        constraints: [
            'Reuse existing credentials before prompting for new secrets.',
            'Start with read-only or dry-run validation before mutating state.',
            'Validate side effects and preserve artifact traces before completion.'
        ],
        integration: {
            provider: integration.provider,
            operation: integration.operationSlug,
            authModes: integration.authModes.map((mode) => mode.kind),
            apiKeyLikelyRequired: integration.apiKeyLikelyRequired,
            mutating: integration.mutating
        },
        paths: {
            skillDir: path.dirname(skillRelativePath)
        }
    };
}

function writeJson(filePath: string, payload: unknown) {
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`);
}

function cleanShardDirectories(outputRoot: string) {
    for (let shardNumber = 1; shardNumber <= 10; shardNumber++) {
        const shard = `${SHARD_PREFIX}${String(shardNumber).padStart(2, '0')}`;
        const shardDir = path.join(outputRoot, shard);
        ensureDir(shardDir);
        for (const entry of fs.readdirSync(shardDir, { withFileTypes: true })) {
            if (entry.isDirectory() && /^\d{4}-/.test(entry.name)) {
                fs.rmSync(path.join(shardDir, entry.name), { recursive: true, force: true });
            }
        }
    }
}

function renderRootReport(entries: GeneratedToolShardEntry[]): string {
    const shardCounts = new Map<string, number>();
    let apiKeyLikely = 0;
    let missionCritical = 0;

    for (const entry of entries) {
        shardCounts.set(entry.shard, (shardCounts.get(entry.shard) || 0) + 1);
        if (entry.apiKeyLikelyRequired) apiKeyLikely += 1;
        if (entry.tier === 'mission_critical') missionCritical += 1;
    }

    const lines: string[] = [
        '# Tool Ideas Shard Report',
        '',
        '- source: `skills/generated/tool-ideas-agents/build.manifest.json`',
        '- output: `skills/generated/shards/tools01..tools10`',
        `- total skills: ${entries.length}`,
        `- api key likely required: ${apiKeyLikely}`,
        `- mission critical tier: ${missionCritical}`,
        '',
        '| Shard | Count |',
        '|---|---:|'
    ];

    for (const shard of Array.from(shardCounts.keys()).sort()) {
        lines.push(`| ${shard} | ${shardCounts.get(shard) || 0} |`);
    }

    lines.push('');
    lines.push('## Notes');
    lines.push('- Each skill is emitted as a hardened shard with `SKILL.md`, `implementation.json`, fixtures, regression tests, and an OpenClaw adapter.');
    lines.push('- Auth and API key handling are encoded directly into each skill via `integrationProfile` and credential-aware runbooks.');
    lines.push('- If `skills/generated/tool-ideas-agents` exists locally, the generator removes it by default after successful materialization.');
    return `${lines.join('\n')}\n`;
}

function maybeRemoveSource(options: CliOptions) {
    if (!options.removeSource) return;
    const sourceRoot = path.join(options.repoRoot, 'skills', 'generated', 'tool-ideas-agents');
    if (fs.existsSync(sourceRoot)) {
        fs.rmSync(sourceRoot, { recursive: true, force: true });
    }
}

function main() {
    const options = parseArgs(process.argv.slice(2));
    const manifest = loadToolIdeaManifest(options);
    const items = flattenToolIdeaItems(manifest);
    assert(items.length === 1000, `Expected 1000 tool idea items, found ${items.length}`);

    cleanShardDirectories(options.outputRoot);

    const generatedEntries: GeneratedToolShardEntry[] = [];
    const byShard = new Map<string, GeneratedToolShardEntry[]>();

    for (const item of items) {
        const shard = getShardName(item.id);
        const implementation = buildImplementation(item);
        const skillDir = path.join(options.outputRoot, shard, item.folder);
        const skillPath = path.join(skillDir, 'SKILL.md');
        const implementationPath = path.join(skillDir, 'implementation.json');
        const fixturePath = path.join(skillDir, 'fixtures', 'minimal-valid.json');
        const regressionPath = path.join(skillDir, 'tests', 'regression-case.md');
        const hardeningPath = path.join(skillDir, 'hardening-summary.json');
        const adapterPath = path.join(skillDir, 'openclaw', 'skill.adapter.json');
        const skillRelativePath = path.relative(options.repoRoot, skillPath);
        const adapterRelativePath = path.relative(options.repoRoot, adapterPath);

        ensureDir(path.dirname(skillPath));
        ensureDir(path.dirname(regressionPath));
        fs.writeFileSync(skillPath, buildSkillMarkdown(implementation));
        writeJson(implementationPath, implementation);
        writeJson(fixturePath, buildMinimalValidFixture(implementation));
        fs.writeFileSync(regressionPath, buildRegressionCaseMarkdown(implementation));
        writeJson(hardeningPath, buildHardeningSummary(implementation));
        writeJson(adapterPath, buildAdapterPayload(item, implementation, skillRelativePath, item.agent));

        const generatedEntry: GeneratedToolShardEntry = {
            id: item.id,
            name: implementation.skillName,
            title: implementation.title,
            provider: implementation.integrationProfile!.provider,
            operation: implementation.integrationProfile!.operationSlug,
            shard,
            tier: implementation.improvementProfile!.tier,
            apiKeyLikelyRequired: implementation.integrationProfile!.apiKeyLikelyRequired,
            path: skillRelativePath,
            implementationPath: path.relative(options.repoRoot, implementationPath),
            adapterPath: adapterRelativePath
        };

        generatedEntries.push(generatedEntry);
        const existing = byShard.get(shard) || [];
        existing.push(generatedEntry);
        byShard.set(shard, existing);
    }

    generatedEntries.sort((a, b) => a.id - b.id);
    writeJson(path.join(options.outputRoot, ROOT_MANIFEST_NAME), {
        version: 1,
        generatedAt: new Date().toISOString(),
        sourceManifest: options.sourceManifestRelativePath,
        count: generatedEntries.length,
        entries: generatedEntries
    });
    fs.writeFileSync(path.join(options.outputRoot, ROOT_REPORT_NAME), renderRootReport(generatedEntries));

    for (const [shard, entries] of byShard.entries()) {
        entries.sort((a, b) => a.id - b.id);
        writeJson(path.join(options.outputRoot, shard, ROOT_MANIFEST_NAME), {
            version: 1,
            shard,
            count: entries.length,
            entries
        });
    }

    maybeRemoveSource(options);

    console.log(`[build-tool-shard-skills] Generated ${generatedEntries.length} hardened tool skills.`);
    console.log(`[build-tool-shard-skills] Output root: ${options.outputRoot}`);
}

main();
