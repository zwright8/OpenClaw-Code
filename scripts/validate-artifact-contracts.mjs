import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const artifactRoot = process.env.ARTIFACT_CONTRACT_ROOT
  ? path.resolve(process.env.ARTIFACT_CONTRACT_ROOT)
  : repoRoot;

const MIN_YEAR = 2024;
const MAX_YEAR = 2100;
const MAX_TIMESTAMP_SKEW_MS = 6 * 60 * 60 * 1000; // 6h
const MAX_SWARM_SUCCESS_DRIFT_PCT = 0.5; // 0.5 percentage points

const artifacts = {
  scorecard: path.join(artifactRoot, 'cognition-core/reports/productivity-scorecard.latest.json'),
  benchmark: path.join(artifactRoot, 'swarm-protocol/state/simulation-benchmark.json'),
  cognitionDaily: path.join(artifactRoot, 'cognition-core/reports/cognition-daily.json'),
  failedOutcomeAudit: path.join(artifactRoot, 'cognition-core/reports/failed-outcome-audit.latest.json')
};

const failures = [];
const checks = [];

function formatMsAsDuration(ms) {
  const abs = Math.abs(ms);
  const hours = Math.floor(abs / (60 * 60 * 1000));
  const minutes = Math.floor((abs % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((abs % (60 * 1000)) / 1000);
  return `${hours}h ${minutes}m ${seconds}s`;
}

function pushFailure(code, summary, action) {
  failures.push({ code, summary, action });
}

function readJson(label, filePath) {
  if (!fs.existsSync(filePath)) {
    pushFailure(
      'MISSING_ARTIFACT',
      `${label} artifact is missing at ${path.relative(artifactRoot, filePath)}.`,
      `Generate ${label} before running this gate.`
    );
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    pushFailure(
      'INVALID_JSON',
      `${label} is not valid JSON (${path.relative(artifactRoot, filePath)}): ${error.message}`,
      `Regenerate ${label} and ensure the writer emits valid JSON.`
    );
    return null;
  }
}

function parseGeneratedAt(label, value, { enforceYearRange = false } = {}) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    pushFailure(
      'MISSING_GENERATED_AT',
      `${label} is missing generatedAt.`,
      `Populate ${label}.generatedAt as canonical ISO-8601 UTC (e.g., 2026-03-07T02:16:21.389Z).`
    );
    return null;
  }

  const parsedMs = Date.parse(value);
  if (!Number.isFinite(parsedMs)) {
    pushFailure(
      'INVALID_GENERATED_AT',
      `${label}.generatedAt is not parseable as a timestamp: ${value}`,
      `Emit ${label}.generatedAt using new Date().toISOString() in UTC.`
    );
    return null;
  }

  const canonical = new Date(parsedMs).toISOString();
  if (canonical !== value) {
    pushFailure(
      'NON_CANONICAL_TIMESTAMP',
      `${label}.generatedAt is not canonical UTC ISO-8601 (expected ${canonical}, got ${value}).`,
      `Normalize ${label}.generatedAt to Date#toISOString() output before writing the artifact.`
    );
  }

  if (enforceYearRange) {
    const year = new Date(parsedMs).getUTCFullYear();
    if (year < MIN_YEAR || year > MAX_YEAR) {
      pushFailure(
        'TIMESTAMP_YEAR_OUT_OF_RANGE',
        `${label}.generatedAt year ${year} is outside sanity bounds ${MIN_YEAR}-${MAX_YEAR}.`,
        'Check clock skew in scorecard generation and ensure scorecard timestamps come from current UTC time.'
      );
    }
  }

  return parsedMs;
}

function ensureObject(label, object, key, action) {
  const candidate = object?.[key];
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
    const availableKeys = object && typeof object === 'object' ? Object.keys(object).join(', ') || '(none)' : '(not-an-object)';
    pushFailure(
      'MISSING_OBJECT_FIELD',
      `${label} is missing required object field '${key}' (available top-level keys: ${availableKeys}).`,
      action
    );
    return null;
  }
  return candidate;
}

function ensureNumber(label, value, action) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    pushFailure('INVALID_NUMERIC_FIELD', `${label} must be a finite number (received ${String(value)}).`, action);
    return null;
  }
  return value;
}

const scorecard = readJson('scorecard', artifacts.scorecard);
const benchmark = readJson('benchmark', artifacts.benchmark);
const cognitionDaily = readJson('cognition-daily', artifacts.cognitionDaily);
const failedOutcomeAudit = readJson('failed-outcome-audit', artifacts.failedOutcomeAudit);

let scorecardGeneratedAtMs = null;
let benchmarkGeneratedAtMs = null;

if (scorecard) {
  scorecardGeneratedAtMs = parseGeneratedAt('scorecard', scorecard.generatedAt, { enforceYearRange: true });
  const thresholdChecks = ensureObject(
    'scorecard',
    scorecard,
    'thresholdChecks',
    "Ensure productivity scorecard generation emits a non-empty 'thresholdChecks' object."
  );
  if (thresholdChecks && Object.keys(thresholdChecks).length === 0) {
    pushFailure(
      'EMPTY_THRESHOLD_CHECKS',
      'scorecard.thresholdChecks is empty.',
      "Populate scorecard.thresholdChecks with per-metric gate evaluations before publishing the scorecard."
    );
  }
  checks.push(`scorecard -> ${path.relative(artifactRoot, artifacts.scorecard)}`);
}

if (benchmark) {
  benchmarkGeneratedAtMs = parseGeneratedAt('benchmark', benchmark.generatedAt);
  const thresholdCheck = ensureObject(
    'benchmark',
    benchmark,
    'thresholdCheck',
    "Run benchmark generation that writes 'thresholdCheck' (singular) with requested/ok/breaches summary."
  );

  if (thresholdCheck) {
    if (Object.prototype.hasOwnProperty.call(thresholdCheck, 'requested') && typeof thresholdCheck.requested !== 'boolean') {
      pushFailure(
        'INVALID_THRESHOLDCHECK_REQUESTED',
        `benchmark.thresholdCheck.requested must be boolean when present (received ${typeof thresholdCheck.requested}).`,
        'Write boolean requested flag in benchmark thresholdCheck output.'
      );
    }
    if (Object.prototype.hasOwnProperty.call(thresholdCheck, 'ok') && typeof thresholdCheck.ok !== 'boolean') {
      pushFailure(
        'INVALID_THRESHOLDCHECK_OK',
        `benchmark.thresholdCheck.ok must be boolean when present (received ${typeof thresholdCheck.ok}).`,
        'Write boolean ok flag in benchmark thresholdCheck output.'
      );
    }
  }

  checks.push(`benchmark -> ${path.relative(artifactRoot, artifacts.benchmark)}`);
}

if (cognitionDaily) {
  parseGeneratedAt('cognition-daily', cognitionDaily.generatedAt);
  checks.push(`cognition-daily -> ${path.relative(artifactRoot, artifacts.cognitionDaily)}`);
}

if (failedOutcomeAudit) {
  parseGeneratedAt('failed-outcome-audit', failedOutcomeAudit.generatedAt);
  checks.push(`failed-outcome-audit -> ${path.relative(artifactRoot, artifacts.failedOutcomeAudit)}`);
}

if (Number.isFinite(scorecardGeneratedAtMs) && Number.isFinite(benchmarkGeneratedAtMs)) {
  const skewMs = Math.abs(scorecardGeneratedAtMs - benchmarkGeneratedAtMs);
  if (skewMs > MAX_TIMESTAMP_SKEW_MS) {
    pushFailure(
      'TIMESTAMP_SKEW',
      [
        `scorecard.generatedAt and benchmark.generatedAt differ by ${skewMs}ms (${formatMsAsDuration(skewMs)}),`,
        `which exceeds the allowed skew of ${MAX_TIMESTAMP_SKEW_MS}ms (6h).`,
        `scorecard=${new Date(scorecardGeneratedAtMs).toISOString()}, benchmark=${new Date(benchmarkGeneratedAtMs).toISOString()}`
      ].join(' '),
      'Regenerate scorecard and benchmark in the same run window (recommended order: benchmark -> scorecard) to keep artifacts time-aligned.'
    );
  }
}

if (scorecard && benchmark) {
  const scorecardSwarmSuccessPct = ensureNumber(
    'scorecard.metrics.swarmSimSuccessRate',
    scorecard?.metrics?.swarmSimSuccessRate,
    'Populate scorecard.metrics.swarmSimSuccessRate from the benchmark aggregate success rate.'
  );
  const benchmarkSuccessAvg = ensureNumber(
    'benchmark.aggregate.successRateAvg',
    benchmark?.aggregate?.successRateAvg,
    'Populate benchmark.aggregate.successRateAvg (0..1) from simulation results.'
  );

  if (Number.isFinite(scorecardSwarmSuccessPct) && Number.isFinite(benchmarkSuccessAvg)) {
    const benchmarkSuccessPct = benchmarkSuccessAvg * 100;
    const driftPct = Math.abs(scorecardSwarmSuccessPct - benchmarkSuccessPct);

    if (driftPct > MAX_SWARM_SUCCESS_DRIFT_PCT) {
      pushFailure(
        'BENCHMARK_SCORECARD_DRIFT',
        [
          `scorecard.metrics.swarmSimSuccessRate (${scorecardSwarmSuccessPct.toFixed(2)}%) drifts from`,
          `benchmark.aggregate.successRateAvg (${benchmarkSuccessPct.toFixed(2)}%) by ${driftPct.toFixed(2)}pp,`,
          `which exceeds the allowed drift of ${MAX_SWARM_SUCCESS_DRIFT_PCT.toFixed(2)}pp.`
        ].join(' '),
        'Regenerate scorecard from the latest benchmark artifact (or regenerate benchmark + scorecard together) so swarm success metrics stay consistent.'
      );
    }
  }
}

console.log('Artifact contract targets:');
console.log(`- artifact-root -> ${artifactRoot}`);
for (const check of checks) {
  console.log(`- ${check}`);
}

if (failures.length > 0) {
  console.error(`\nArtifact contract validation FAILED (${failures.length} issue${failures.length === 1 ? '' : 's'}):`);
  failures.forEach((failure, index) => {
    console.error(`${index + 1}. [${failure.code}] ${failure.summary}`);
    console.error(`   Action: ${failure.action}`);
  });
  process.exit(1);
}

console.log('\nArtifact contract validation PASSED.');
