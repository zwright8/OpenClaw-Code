import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const MIN_YEAR = 2024;
const MAX_YEAR = 2100;
const MAX_FRESHNESS_DRIFT_MS = 6 * 60 * 60 * 1000;

const artifactConfig = {
  scorecard: {
    path: path.join(repoRoot, 'cognition-core/reports/productivity-scorecard.latest.json')
  },
  benchmark: {
    path: path.join(repoRoot, 'swarm-protocol/state/simulation-benchmark.json')
  },
  cognitionDaily: {
    path: path.join(repoRoot, 'cognition-core/reports/cognition-daily.json')
  },
  failedOutcomeAudit: {
    path: path.join(repoRoot, 'cognition-core/reports/failed-outcome-audit.latest.json')
  }
};

const errors = [];
const details = [];

function readJsonOrFail(label, filePath) {
  if (!fs.existsSync(filePath)) {
    errors.push(`${label}: missing file at ${path.relative(repoRoot, filePath)}`);
    return null;
  }

  try {
    const source = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(source);
  } catch (error) {
    errors.push(`${label}: invalid JSON at ${path.relative(repoRoot, filePath)} (${error.message})`);
    return null;
  }
}

function parseGeneratedAt(label, value, { sanity = false } = {}) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    errors.push(`${label}: missing generatedAt`);
    return null;
  }

  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) {
    errors.push(`${label}: generatedAt is not a valid ISO timestamp (${value})`);
    return null;
  }

  const date = new Date(timestamp);
  if (date.toISOString() !== value) {
    errors.push(`${label}: generatedAt must be canonical ISO-8601 UTC (expected ${date.toISOString()}, got ${value})`);
  }

  if (sanity) {
    const year = date.getUTCFullYear();
    if (year < MIN_YEAR || year > MAX_YEAR) {
      errors.push(`${label}: generatedAt year out of sanity bounds (${year}; expected ${MIN_YEAR}-${MAX_YEAR})`);
    }
  }

  return timestamp;
}

function ensureObjectField(label, object, fieldName) {
  const value = object?.[fieldName];
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    errors.push(`${label}: missing ${fieldName} object`);
    return null;
  }
  return value;
}

const scorecard = readJsonOrFail('scorecard', artifactConfig.scorecard.path);
const benchmark = readJsonOrFail('benchmark', artifactConfig.benchmark.path);
const cognitionDaily = readJsonOrFail('cognition-daily', artifactConfig.cognitionDaily.path);
const failedOutcomeAudit = readJsonOrFail('failed-outcome-audit', artifactConfig.failedOutcomeAudit.path);

let scorecardGeneratedAtMs = null;
let benchmarkGeneratedAtMs = null;

if (scorecard) {
  scorecardGeneratedAtMs = parseGeneratedAt('scorecard', scorecard.generatedAt, { sanity: true });
  const thresholdChecks = ensureObjectField('scorecard', scorecard, 'thresholdChecks');
  if (thresholdChecks && Object.keys(thresholdChecks).length === 0) {
    errors.push('scorecard: thresholdChecks must not be empty');
  }
  details.push(`scorecard: ${path.relative(repoRoot, artifactConfig.scorecard.path)}`);
}

if (benchmark) {
  benchmarkGeneratedAtMs = parseGeneratedAt('benchmark', benchmark.generatedAt);
  const thresholdCheck = ensureObjectField('benchmark', benchmark, 'thresholdCheck');
  if (thresholdCheck) {
    if (Object.prototype.hasOwnProperty.call(thresholdCheck, 'requested') && typeof thresholdCheck.requested !== 'boolean') {
      errors.push('benchmark: thresholdCheck.requested must be boolean when present');
    }
    if (Object.prototype.hasOwnProperty.call(thresholdCheck, 'ok') && typeof thresholdCheck.ok !== 'boolean') {
      errors.push('benchmark: thresholdCheck.ok must be boolean when present');
    }
  }
  details.push(`benchmark: ${path.relative(repoRoot, artifactConfig.benchmark.path)}`);
}

if (cognitionDaily) {
  parseGeneratedAt('cognition-daily', cognitionDaily.generatedAt);
  details.push(`cognition-daily: ${path.relative(repoRoot, artifactConfig.cognitionDaily.path)}`);
}

if (failedOutcomeAudit) {
  parseGeneratedAt('failed-outcome-audit', failedOutcomeAudit.generatedAt);
  details.push(`failed-outcome-audit: ${path.relative(repoRoot, artifactConfig.failedOutcomeAudit.path)}`);
}

if (Number.isFinite(scorecardGeneratedAtMs) && Number.isFinite(benchmarkGeneratedAtMs)) {
  const driftMs = Math.abs(scorecardGeneratedAtMs - benchmarkGeneratedAtMs);
  if (driftMs > MAX_FRESHNESS_DRIFT_MS) {
    errors.push(
      `freshness-drift: scorecard/benchmark generatedAt drift ${driftMs}ms exceeds ${MAX_FRESHNESS_DRIFT_MS}ms (6h)`
    );
  }
}

console.log('Artifact contract targets:');
for (const line of details) {
  console.log(`- ${line}`);
}

if (errors.length > 0) {
  console.error('\nArtifact contract validation FAILED:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log('\nArtifact contract validation PASSED.');
