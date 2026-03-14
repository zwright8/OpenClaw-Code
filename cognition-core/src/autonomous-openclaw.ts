import fs from 'fs';
import path from 'path';
import {
    buildTaskRequest,
    FileTaskStore
} from '../../swarm-protocol/runtime.js';
import { loadSkillManifest } from '../../skills/runtime/index.js';
import { enqueueTaskEntries } from './task-bundle-enqueuer.js';
import { runBotWorkerLoop } from './bot-worker-loop.js';
import { detectOpenClawRepoRoot } from './openclaw-bot.js';

const TERMINAL_STATUSES = new Set([
    'completed',
    'partial',
    'failed',
    'rejected',
    'timed_out',
    'transport_error'
]);

const SUCCESS_STATUSES = new Set([
    'completed',
    'partial'
]);
const STATUS_REWARD = Object.freeze({
    completed: 1,
    partial: 0.6,
    failed: 0,
    rejected: 0,
    timed_out: 0,
    transport_error: 0
});

const DEFAULT_FAILURE_COOLDOWN_WAVES = 2;
const MAX_FAILURE_COOLDOWN_WAVES = 20;
const FAILURE_COOLDOWN_MIN_STREAK = 2;
const FAILURE_COOLDOWN_BACKOFF_MULTIPLIER = 2;
const MAX_FAILURE_COOLDOWN_BACKOFF_STEPS = 4;
const MAX_EFFECTIVE_FAILURE_COOLDOWN_WAVES = 80;
const DEFAULT_RECENT_OUTCOME_WEIGHT = 0.2;
const MAX_RECENT_OUTCOME_WEIGHT = 0.6;
const DEFAULT_RECENT_OUTCOME_HALF_LIFE_WAVES = 3;
const MAX_RECENT_OUTCOME_HALF_LIFE_WAVES = 30;
const DEFAULT_STALE_WAVE_BOOST = 0.03;
const MAX_STALE_WAVE_BOOST = 0.2;
const DEFAULT_MAX_STALE_BOOST = 0.25;
const MAX_MAX_STALE_BOOST = 1;
const DEFAULT_SELECTION_POLICY_MODE = 'ucb';
const DEFAULT_LINUCB_ALPHA = 0.6;
const MAX_LINUCB_ALPHA = 5;
const DEFAULT_LINTS_ALPHA = 0.5;
const MAX_LINTS_ALPHA = 5;
const DEFAULT_THOMPSON_EXPLORATION = 0.2;
const DEFAULT_THOMPSON_PRIOR_ALPHA = 1;
const DEFAULT_THOMPSON_PRIOR_BETA = 1;
const MAX_THOMPSON_PRIOR = 100;
const DEFAULT_THOMPSON_META_PRIOR_STRENGTH = 0;
const MAX_THOMPSON_META_PRIOR_STRENGTH = 500;
const DEFAULT_THOMPSON_UNCERTAINTY_WEIGHT = 0.5;
const MAX_THOMPSON_UNCERTAINTY_WEIGHT = 2;
const DEFAULT_THOMPSON_HAZARD_RATE = 0.08;
const MAX_THOMPSON_HAZARD_RATE = 0.5;
const DEFAULT_THOMPSON_SURPRISE_SENSITIVITY = 1;
const MAX_THOMPSON_SURPRISE_SENSITIVITY = 5;
const DEFAULT_HYBRID_TS_AGGREGATION = 'mean';
const HYBRID_TS_AGGREGATION_MODES = new Set([
    'min',
    'mean',
    'max',
    'adaptive'
]);
const DEFAULT_MULTI_WINDOW_SIZES = Object.freeze([4, 8, 16, 32]);
const MAX_MULTI_WINDOW_CANDIDATES = 10;
const DEFAULT_BOB_GAMMA = 0.12;
const MAX_BOB_GAMMA = 0.8;
const DEFAULT_SLIDING_WINDOW_SIZE = 12;
const MAX_SLIDING_WINDOW_SIZE = 200;
const MAX_RECENT_OUTCOMES_TRACKED = 128;
const MAX_CONTEXTUAL_OBSERVATIONS_TRACKED = 512;
const DEFAULT_DISCOUNT_FACTOR = 0.97;
const MIN_DISCOUNT_FACTOR = 0.5;
const DEFAULT_KL_UCB_CONFIDENCE = 3;
const MAX_KL_UCB_CONFIDENCE = 20;
const DEFAULT_BAYES_UCB_QUANTILE = 0.9;
const MIN_BAYES_UCB_QUANTILE = 0.5;
const MAX_BAYES_UCB_QUANTILE = 0.999;
const DEFAULT_CD_MIN_SAMPLES = 8;
const MAX_CD_MIN_SAMPLES = 64;
const DEFAULT_CD_DRIFT_THRESHOLD = 1.5;
const MAX_CD_DRIFT_THRESHOLD = 10;
const DEFAULT_CD_MEAN_DELTA = 0.02;
const MAX_CD_MEAN_DELTA = 0.5;
const DEFAULT_ADWIN_DELTA = 0.002;
const MIN_ADWIN_DELTA = 1e-6;
const MAX_ADWIN_DELTA = 0.5;
const DEFAULT_CD_DIRECTION = 'both';
const CD_DIRECTION_MODES = new Set([
    'up',
    'down',
    'both'
]);
const DEFAULT_CUSUM_THRESHOLD = 1.2;
const MAX_CUSUM_THRESHOLD = 20;
const DEFAULT_CUSUM_BASELINE_WEIGHT = 0.15;
const MAX_CUSUM_BASELINE_WEIGHT = 1;
const DEFAULT_CORRAL_GAMMA = 0.12;
const MAX_CORRAL_GAMMA = 0.8;
const DEFAULT_CORRAL_ETA = 0.8;
const MAX_CORRAL_ETA = 5;
const DEFAULT_CORRAL_AUTO_GAMMA = false;
const DEFAULT_CORRAL_AUTO_ETA = false;
const DEFAULT_CORRAL_MIN_POLICY_ATTEMPTS = 0;
const MAX_CORRAL_MIN_POLICY_ATTEMPTS = 200;
const DEFAULT_CORRAL_FORCED_EXPLORATION = 0.25;
const MAX_CORRAL_FORCED_EXPLORATION = 1;
const DEFAULT_CORRAL_UNCERTAINTY_WEIGHT = 0.35;
const MAX_CORRAL_UNCERTAINTY_WEIGHT = 3;
const DEFAULT_EXP3_EXPLORATION_GAMMA = 0.07;
const DEFAULT_EXP3_IMPLICIT_GAMMA = null;
const DEFAULT_EXP3_IMPORTANCE_WEIGHT_CAP = 50;
const MAX_EXP3_IX_GAMMA = 0.5;
const DEFAULT_EXP3_IX_ETA = 1;
const MAX_EXP3_IX_ETA = 10;
const MAX_EXP3_IMPORTANCE_WEIGHT_CAP = 1_000;
const DEFAULT_EXP3_AUTO_GAMMA = false;
const DEFAULT_EXP3_SHARE_ALPHA = 0.08;
const MAX_EXP3_SHARE_ALPHA = 1;
const DEFAULT_EXP3_RESTART_INTERVAL = 12;
const MAX_EXP3_RESTART_INTERVAL = 200;
const DEFAULT_EXP3_AUTO_ETA = false;
const DEFAULT_TSALLIS_ETA_SCALE = 1;
const DEFAULT_TSALLIS_AUTO_ETA = false;
const MAX_TSALLIS_ETA_SCALE = 10;
const DEFAULT_MOSS_ALPHA = 1;
const MAX_MOSS_ALPHA = 10;
const DEFAULT_UCB_V_EXPLORATION = 1;
const MAX_UCB_V_EXPLORATION = 5;
const DEFAULT_RISK_VARIANCE_WEIGHT = 0.6;
const MAX_RISK_VARIANCE_WEIGHT = 5;
const DEFAULT_BOLTZMANN_GUMBEL_C = 0.5;
const MAX_BOLTZMANN_GUMBEL_C = 5;
const DEFAULT_PHE_PERTURBATION_SCALE = 2;
const MAX_PHE_PERTURBATION_SCALE = 10;
const DEFAULT_LATENCY_PENALTY_WEIGHT = 0;
const MAX_LATENCY_PENALTY_WEIGHT = 1;
const DEFAULT_LATENCY_TARGET_MS = 120_000;
const MAX_LATENCY_TARGET_MS = 3_600_000;
const DEFAULT_LATENCY_AUTO_TARGET = false;
const DEFAULT_LATENCY_AUTO_TARGET_PERCENTILE = 0.9;
const MIN_LATENCY_AUTO_TARGET_PERCENTILE = 0.5;
const MAX_LATENCY_AUTO_TARGET_PERCENTILE = 0.999;
const DEFAULT_LATENCY_AUTO_TARGET_MIN_SAMPLES = 8;
const MAX_LATENCY_AUTO_TARGET_MIN_SAMPLES = 128;
const DEFAULT_LATENCY_AUTO_TARGET_WINDOW_SIZE = 32;
const MAX_LATENCY_AUTO_TARGET_WINDOW_SIZE = 128;
const DEFAULT_LATENCY_AUTO_TARGET_BLEND = 1;
const MAX_LATENCY_AUTO_TARGET_BLEND = 1;
const DEFAULT_RELIABILITY_FLOOR = 0;
const MAX_RELIABILITY_FLOOR = 1;
const DEFAULT_RELIABILITY_FLOOR_MIN_ATTEMPTS = 8;
const MAX_RELIABILITY_FLOOR_MIN_ATTEMPTS = 256;
const DEFAULT_LATENCY_SLA_MS = 120_000;
const MAX_LATENCY_SLA_MS = 3_600_000;
const DEFAULT_LATENCY_SLA_FLOOR = 0;
const MAX_LATENCY_SLA_FLOOR = 1;
const DEFAULT_LATENCY_SLA_MIN_ATTEMPTS = 8;
const MAX_LATENCY_SLA_MIN_ATTEMPTS = 256;
const DEFAULT_LATENCY_TAIL_PENALTY_WEIGHT = 0;
const MAX_LATENCY_TAIL_PENALTY_WEIGHT = 1;
const DEFAULT_LATENCY_TAIL_PERCENTILE = 0.95;
const MIN_LATENCY_TAIL_PERCENTILE = 0.5;
const MAX_LATENCY_TAIL_PERCENTILE = 0.999;
const DEFAULT_LATENCY_TAIL_MIN_SAMPLES = 8;
const MAX_LATENCY_TAIL_MIN_SAMPLES = 256;
const DEFAULT_LATENCY_CVAR_PENALTY_WEIGHT = 0;
const MAX_LATENCY_CVAR_PENALTY_WEIGHT = 1;
const DEFAULT_LATENCY_CVAR_PERCENTILE = 0.95;
const MIN_LATENCY_CVAR_PERCENTILE = 0.5;
const MAX_LATENCY_CVAR_PERCENTILE = 0.999;
const DEFAULT_LATENCY_CVAR_MIN_SAMPLES = 8;
const MAX_LATENCY_CVAR_MIN_SAMPLES = 256;
const DEFAULT_FAILURE_BURST_PENALTY_WEIGHT = 0;
const MAX_FAILURE_BURST_PENALTY_WEIGHT = 1;
const DEFAULT_FAILURE_BURST_SHORT_WINDOW = 8;
const MAX_FAILURE_BURST_SHORT_WINDOW = 64;
const DEFAULT_FAILURE_BURST_LONG_WINDOW = 32;
const MAX_FAILURE_BURST_LONG_WINDOW = 256;
const DEFAULT_FAILURE_BURST_MIN_ATTEMPTS = 8;
const MAX_FAILURE_BURST_MIN_ATTEMPTS = 256;
const DEFAULT_FAILURE_BURST_THRESHOLD = 1.5;
const MAX_FAILURE_BURST_THRESHOLD = 5;
const DEFAULT_LATENCY_BURST_PENALTY_WEIGHT = 0;
const MAX_LATENCY_BURST_PENALTY_WEIGHT = 1;
const DEFAULT_LATENCY_BURST_SHORT_WINDOW = 8;
const MAX_LATENCY_BURST_SHORT_WINDOW = 64;
const DEFAULT_LATENCY_BURST_LONG_WINDOW = 32;
const MAX_LATENCY_BURST_LONG_WINDOW = 256;
const DEFAULT_LATENCY_BURST_MIN_ATTEMPTS = 8;
const MAX_LATENCY_BURST_MIN_ATTEMPTS = 256;
const DEFAULT_LATENCY_BURST_THRESHOLD = 1.5;
const MAX_LATENCY_BURST_THRESHOLD = 5;
const RELIABILITY_FLOOR_Z_SCORE = 1.96;
const LINUCB_FEATURE_NAMES = [
    'bias',
    'successRate',
    'failureRate',
    'failureStreak',
    'novelty',
    'staleness'
];
export const SUPPORTED_SELECTION_POLICY_MODES = Object.freeze([
    'ucb',
    'ucb_v',
    'mv_ucb',
    'ucb_tuned',
    'linucb',
    'sw_linucb',
    'd_linucb',
    'adwin_linucb',
    'lints',
    'sw_lints',
    'd_lints',
    'adwin_lints',
    'epsilon_ts',
    'bb_ts',
    'auto_epsilon_ts',
    'cp_epsilon_ts',
    'cd_epsilon_ts',
    'sw_cd_epsilon_ts',
    'cusum_epsilon_ts',
    'sw_cusum_epsilon_ts',
    'kl_ucb',
    'bayes_ucb',
    'sw_ucb',
    'sw_mv_ucb',
    'mw_ucb',
    'bob_sw_ucb',
    'sw_ucb_v',
    'sw_ucb_tuned',
    'sw_epsilon_ts',
    'sw_bb_ts',
    'sw_auto_epsilon_ts',
    'sw_cp_epsilon_ts',
    'fdsw_epsilon_ts',
    'fdsw_ucb',
    'sw_kl_ucb',
    'sw_bayes_ucb',
    'd_ucb',
    'd_mv_ucb',
    'd_ucb_v',
    'd_ucb_tuned',
    'd_epsilon_ts',
    'd_bb_ts',
    'd_auto_epsilon_ts',
    'd_kl_ucb',
    'glr_kl_ucb',
    'sw_glr_kl_ucb',
    'd_bayes_ucb',
    'adwin_bayes_ucb',
    'cd_ucb',
    'adwin_ucb',
    'sw_cd_ucb',
    'cusum_ucb',
    'adwin_epsilon_ts',
    'adwin_bb_ts',
    'sw_cusum_ucb',
    'corral_exp3',
    'sw_corral_exp3',
    'd_corral_exp3',
    'adwin_corral_exp3',
    'corral_exp3_plus',
    'sw_corral_exp3_plus',
    'd_corral_exp3_plus',
    'adwin_corral_exp3_plus',
    'exp3_ix',
    'exp3_s',
    'adwin_exp3_ix',
    'adwin_exp3_s',
    'rexp3_ix',
    'sw_exp3_ix',
    'sw_exp3_s',
    'd_exp3_ix',
    'd_exp3_s',
    'tsallis_inf',
    'sw_tsallis_inf',
    'adwin_tsallis_inf',
    'd_tsallis_inf',
    'bge',
    'sw_bge',
    'd_bge',
    'phe',
    'sw_phe',
    'd_phe',
    'moss_anytime',
    'sw_moss_anytime',
    'd_moss_anytime'
]);
const SUPPORTED_SELECTION_POLICY_MODE_SET = new Set(SUPPORTED_SELECTION_POLICY_MODES);
const THOMPSON_POLICY_MODES = new Set([
    'epsilon_ts',
    'auto_epsilon_ts',
    'adwin_epsilon_ts',
    'cp_epsilon_ts',
    'cd_epsilon_ts',
    'sw_cd_epsilon_ts',
    'cusum_epsilon_ts',
    'sw_cusum_epsilon_ts',
    'sw_epsilon_ts',
    'sw_auto_epsilon_ts',
    'sw_cp_epsilon_ts',
    'fdsw_epsilon_ts',
    'd_epsilon_ts',
    'd_auto_epsilon_ts'
]);
const BAYESIAN_BOOTSTRAP_POLICY_MODES = new Set([
    'bb_ts',
    'adwin_bb_ts',
    'sw_bb_ts',
    'd_bb_ts'
]);
const CHANGEPOINT_THOMPSON_POLICY_MODES = new Set([
    'cp_epsilon_ts',
    'sw_cp_epsilon_ts'
]);
const ADAPTIVE_THOMPSON_POLICY_MODES = new Set([
    'auto_epsilon_ts',
    'sw_auto_epsilon_ts',
    'd_auto_epsilon_ts'
]);
const KL_UCB_POLICY_MODES = new Set([
    'kl_ucb',
    'sw_kl_ucb',
    'd_kl_ucb',
    'glr_kl_ucb',
    'sw_glr_kl_ucb'
]);
const BAYES_UCB_POLICY_MODES = new Set([
    'bayes_ucb',
    'adwin_bayes_ucb',
    'sw_bayes_ucb',
    'd_bayes_ucb'
]);
const EXP3_POLICY_MODES = new Set([
    'exp3_ix',
    'exp3_s',
    'adwin_exp3_ix',
    'adwin_exp3_s',
    'rexp3_ix',
    'sw_exp3_ix',
    'sw_exp3_s',
    'd_exp3_ix',
    'd_exp3_s'
]);
const TSALLIS_POLICY_MODES = new Set([
    'tsallis_inf',
    'sw_tsallis_inf',
    'adwin_tsallis_inf',
    'd_tsallis_inf'
]);
const ADVERSARIAL_RECENCY_POLICY_MODES = new Set([
    ...EXP3_POLICY_MODES,
    ...TSALLIS_POLICY_MODES
]);
const DISCOUNTED_ADVERSARIAL_POLICY_MODES = new Set([
    'd_exp3_ix',
    'd_exp3_s',
    'd_tsallis_inf',
    'd_corral_exp3',
    'd_corral_exp3_plus'
]);
const EXP3_SHARE_POLICY_MODES = new Set([
    'exp3_s',
    'adwin_exp3_s',
    'sw_exp3_s',
    'd_exp3_s'
]);
const RESTARTED_EXP3_POLICY_MODES = new Set([
    'rexp3_ix'
]);
const PAGE_HINKLEY_POLICY_MODES = new Set([
    'cd_ucb',
    'sw_cd_ucb',
    'cd_epsilon_ts',
    'sw_cd_epsilon_ts'
]);
const ADWIN_POLICY_MODES = new Set([
    'adwin_ucb',
    'adwin_epsilon_ts',
    'adwin_bb_ts',
    'adwin_bayes_ucb',
    'adwin_tsallis_inf',
    'adwin_linucb',
    'adwin_lints'
]);
const CUSUM_POLICY_MODES = new Set([
    'cusum_ucb',
    'sw_cusum_ucb',
    'cusum_epsilon_ts',
    'sw_cusum_epsilon_ts'
]);
const WINDOWED_CHANGE_DETECTION_POLICY_MODES = new Set([
    'sw_cd_ucb',
    'sw_cusum_ucb',
    'sw_cd_epsilon_ts',
    'sw_cusum_epsilon_ts'
]);
const WINDOWED_GLR_KL_UCB_POLICY_MODES = new Set([
    'sw_glr_kl_ucb'
]);
const GLR_KL_UCB_POLICY_MODES = new Set([
    'glr_kl_ucb',
    'sw_glr_kl_ucb'
]);
const SLIDING_WINDOW_POLICY_MODES = new Set([
    'sw_ucb',
    'sw_mv_ucb',
    'sw_ucb_v',
    'sw_ucb_tuned',
    'sw_linucb',
    'sw_lints',
    'sw_epsilon_ts',
    'sw_bb_ts',
    'sw_auto_epsilon_ts',
    'sw_kl_ucb',
    'sw_bayes_ucb',
    'sw_exp3_ix',
    'sw_exp3_s',
    'sw_tsallis_inf',
    'sw_bge',
    'sw_phe',
    'sw_moss_anytime'
]);
const MULTI_WINDOW_UCB_POLICY_MODES = new Set([
    'mw_ucb'
]);
const BOB_WINDOW_UCB_POLICY_MODES = new Set([
    'bob_sw_ucb'
]);
const RISK_AWARE_UCB_POLICY_MODES = new Set([
    'mv_ucb',
    'sw_mv_ucb',
    'd_mv_ucb'
]);
const BOLTZMANN_GUMBEL_POLICY_MODES = new Set([
    'bge',
    'sw_bge',
    'd_bge'
]);
const PHE_POLICY_MODES = new Set([
    'phe',
    'sw_phe',
    'd_phe'
]);
const DISCOUNTED_POLICY_MODES = new Set([
    'd_ucb',
    'd_mv_ucb',
    'd_ucb_v',
    'd_ucb_tuned',
    'd_epsilon_ts',
    'd_bb_ts',
    'd_auto_epsilon_ts',
    'd_kl_ucb',
    'd_bayes_ucb',
    'd_exp3_ix',
    'd_exp3_s',
    'd_tsallis_inf',
    'd_bge',
    'd_phe',
    'd_linucb',
    'd_lints',
    'd_moss_anytime'
]);
const CONTEXTUAL_THOMPSON_POLICY_MODES = new Set([
    'lints',
    'sw_lints',
    'd_lints',
    'adwin_lints'
]);
const ADWIN_CONTEXTUAL_POLICY_MODES = new Set([
    'adwin_linucb',
    'adwin_lints'
]);
const HYBRID_THOMPSON_POLICY_MODES = new Set([
    'fdsw_epsilon_ts'
]);
const HYBRID_UCB_POLICY_MODES = new Set([
    'fdsw_ucb'
]);
const CORRAL_POLICY_MODES = new Set([
    'corral_exp3',
    'sw_corral_exp3',
    'd_corral_exp3',
    'adwin_corral_exp3',
    'corral_exp3_plus',
    'sw_corral_exp3_plus',
    'd_corral_exp3_plus',
    'adwin_corral_exp3_plus'
]);
const CORRAL_PLUS_POLICY_MODES = new Set([
    'corral_exp3_plus',
    'sw_corral_exp3_plus',
    'd_corral_exp3_plus',
    'adwin_corral_exp3_plus'
]);
const SLIDING_WINDOW_CORRAL_POLICY_MODES = new Set([
    'sw_corral_exp3',
    'sw_corral_exp3_plus'
]);
const DISCOUNTED_CORRAL_POLICY_MODES = new Set([
    'd_corral_exp3',
    'd_corral_exp3_plus'
]);
const ADWIN_CORRAL_POLICY_MODES = new Set([
    'adwin_corral_exp3',
    'adwin_corral_exp3_plus'
]);
const CORRAL_EXP3_BASE_POLICIES = [
    'ucb',
    'epsilon_ts',
    'kl_ucb',
    'cd_ucb'
];
const CORRAL_DRIFT_SPECIALIST_BASE_POLICIES = [
    'adwin_ucb',
    'adwin_epsilon_ts',
    'fdsw_ucb',
    'fdsw_epsilon_ts',
    'bge'
];
const CORRAL_EXP3_PLUS_BASE_POLICIES = [
    'ucb',
    'ucb_tuned',
    'ucb_v',
    'epsilon_ts',
    'kl_ucb',
    'bayes_ucb',
    'cd_ucb',
    'cusum_ucb',
    ...CORRAL_DRIFT_SPECIALIST_BASE_POLICIES
];
function safeNow(nowFactory = Date.now) {
    const value = Number(nowFactory());
    return Number.isFinite(value) ? value : Date.now();
}

function parsePositiveInt(raw, fallback = 1) {
    const value = Number(raw);
    if (!Number.isInteger(value) || value <= 0) return fallback;
    return value;
}

function parseNonNegativeInt(raw, fallback = 0) {
    const value = Number(raw);
    if (!Number.isInteger(value) || value < 0) return fallback;
    return value;
}

function parseNonNegativeNumber(raw, fallback = 0) {
    const value = Number(raw);
    if (!Number.isFinite(value) || value < 0) return fallback;
    return value;
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function normalizeFailureRate(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return 0;
    return clamp(numeric, 0, 1);
}

function normalizeCapabilityId(value) {
    if (typeof value !== 'string') return '';
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .replace(/_+/g, '_');
}

function normalizeSkillCode(value, skillId) {
    if (typeof value === 'string' && value.trim()) {
        return value.trim().toUpperCase();
    }
    const id = toSkillId(skillId);
    if (id === null) return 'SK-UNKNOWN';
    return `SK-${String(id).padStart(5, '0')}`;
}

function normalizeStatus(value) {
    if (typeof value !== 'string') return 'unknown';
    return value.trim().toLowerCase() || 'unknown';
}

function toSkillId(value) {
    const numeric = Number(value);
    if (!Number.isInteger(numeric) || numeric <= 0) return null;
    return numeric;
}

function makeDeterministicSeed(text) {
    let hash = 2_166_136_261;
    for (const ch of String(text)) {
        hash ^= ch.charCodeAt(0);
        hash = Math.imul(hash, 16_777_619);
    }
    return hash >>> 0;
}

function pseudoRatio(seed, offset) {
    let state = (seed + Math.imul(offset + 1, 1_013_904_223)) >>> 0;
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 4_294_967_295;
}

function pseudoInRange(seed, offset, min, max) {
    const ratio = pseudoRatio(seed, offset);
    return Math.round(min + ratio * (max - min));
}

function normalizeFailureCooldownWaves(raw, fallback = DEFAULT_FAILURE_COOLDOWN_WAVES) {
    return clamp(parseNonNegativeInt(raw, fallback), 0, MAX_FAILURE_COOLDOWN_WAVES);
}

function normalizeAdaptiveScoreConfig(rawConfig = null) {
    const value = rawConfig && typeof rawConfig === 'object' ? rawConfig : {};

    return {
        recentOutcomeWeight: clamp(
            Number.isFinite(Number(value.recentOutcomeWeight))
                ? Number(value.recentOutcomeWeight)
                : DEFAULT_RECENT_OUTCOME_WEIGHT,
            0,
            MAX_RECENT_OUTCOME_WEIGHT
        ),
        recentOutcomeHalfLifeWaves: clamp(
            Number.isFinite(Number(value.recentOutcomeHalfLifeWaves))
                ? Number(value.recentOutcomeHalfLifeWaves)
                : DEFAULT_RECENT_OUTCOME_HALF_LIFE_WAVES,
            1,
            MAX_RECENT_OUTCOME_HALF_LIFE_WAVES
        ),
        staleWaveBoost: clamp(
            Number.isFinite(Number(value.staleWaveBoost))
                ? Number(value.staleWaveBoost)
                : DEFAULT_STALE_WAVE_BOOST,
            0,
            MAX_STALE_WAVE_BOOST
        ),
        maxStaleBoost: clamp(
            Number.isFinite(Number(value.maxStaleBoost))
                ? Number(value.maxStaleBoost)
                : DEFAULT_MAX_STALE_BOOST,
            0,
            MAX_MAX_STALE_BOOST
        )
    };
}

function normalizeMultiWindowSizes(rawValue) {
    const values = Array.isArray(rawValue)
        ? rawValue
        : (typeof rawValue === 'string'
            ? rawValue.split(',')
            : DEFAULT_MULTI_WINDOW_SIZES);
    const normalized = [...new Set(values
        .map((value) => Number(value))
        .filter((value) => Number.isInteger(value) && value > 0)
        .map((value) => clamp(value, 2, MAX_SLIDING_WINDOW_SIZE))
        .filter((value) => Number.isInteger(value) && value >= 2)
    )]
        .sort((left, right) => left - right)
        .slice(0, MAX_MULTI_WINDOW_CANDIDATES);
    return normalized.length > 0
        ? normalized
        : DEFAULT_MULTI_WINDOW_SIZES.slice();
}

function normalizeSelectionPolicyConfig(rawConfig = null) {
    const value = rawConfig && typeof rawConfig === 'object' ? rawConfig : {};
    const mode = typeof value.mode === 'string'
        ? value.mode.trim().toLowerCase()
        : DEFAULT_SELECTION_POLICY_MODE;
    const normalizedMode = SUPPORTED_SELECTION_POLICY_MODE_SET.has(mode)
        ? mode
        : DEFAULT_SELECTION_POLICY_MODE;

    return {
        mode: normalizedMode,
        linucbAlpha: clamp(
            Number.isFinite(Number(value.linucbAlpha))
                ? Number(value.linucbAlpha)
                : DEFAULT_LINUCB_ALPHA,
            Number.EPSILON,
            MAX_LINUCB_ALPHA
        ),
        lintsAlpha: clamp(
            Number.isFinite(Number(value.lintsAlpha))
                ? Number(value.lintsAlpha)
                : DEFAULT_LINTS_ALPHA,
            Number.EPSILON,
            MAX_LINTS_ALPHA
        ),
        thompsonExploration: clamp(
            Number.isFinite(Number(value.thompsonExploration))
                ? Number(value.thompsonExploration)
                : DEFAULT_THOMPSON_EXPLORATION,
            0,
            1
        ),
        thompsonPriorAlpha: clamp(
            Number.isFinite(Number(value.thompsonPriorAlpha))
                ? Number(value.thompsonPriorAlpha)
                : DEFAULT_THOMPSON_PRIOR_ALPHA,
            Number.EPSILON,
            MAX_THOMPSON_PRIOR
        ),
        thompsonPriorBeta: clamp(
            Number.isFinite(Number(value.thompsonPriorBeta))
                ? Number(value.thompsonPriorBeta)
                : DEFAULT_THOMPSON_PRIOR_BETA,
            Number.EPSILON,
            MAX_THOMPSON_PRIOR
        ),
        thompsonMetaPriorStrength: clamp(
            Number.isFinite(Number(value.thompsonMetaPriorStrength))
                ? Number(value.thompsonMetaPriorStrength)
                : DEFAULT_THOMPSON_META_PRIOR_STRENGTH,
            0,
            MAX_THOMPSON_META_PRIOR_STRENGTH
        ),
        thompsonUncertaintyWeight: clamp(
            Number.isFinite(Number(value.thompsonUncertaintyWeight))
                ? Number(value.thompsonUncertaintyWeight)
                : DEFAULT_THOMPSON_UNCERTAINTY_WEIGHT,
            0,
            MAX_THOMPSON_UNCERTAINTY_WEIGHT
        ),
        thompsonHazardRate: clamp(
            Number.isFinite(Number(value.thompsonHazardRate))
                ? Number(value.thompsonHazardRate)
                : DEFAULT_THOMPSON_HAZARD_RATE,
            0,
            MAX_THOMPSON_HAZARD_RATE
        ),
        thompsonSurpriseSensitivity: clamp(
            Number.isFinite(Number(value.thompsonSurpriseSensitivity))
                ? Number(value.thompsonSurpriseSensitivity)
                : DEFAULT_THOMPSON_SURPRISE_SENSITIVITY,
            0,
            MAX_THOMPSON_SURPRISE_SENSITIVITY
        ),
        hybridTsAggregation: (() => {
            const candidate = typeof value.hybridTsAggregation === 'string'
                ? value.hybridTsAggregation.trim().toLowerCase()
                : DEFAULT_HYBRID_TS_AGGREGATION;
            return HYBRID_TS_AGGREGATION_MODES.has(candidate)
                ? candidate
                : DEFAULT_HYBRID_TS_AGGREGATION;
        })(),
        slidingWindowSize: clamp(
            Number.isFinite(Number(value.slidingWindowSize))
                ? Number(value.slidingWindowSize)
                : DEFAULT_SLIDING_WINDOW_SIZE,
            1,
            MAX_SLIDING_WINDOW_SIZE
        ),
        multiWindowSizes: normalizeMultiWindowSizes(value.multiWindowSizes),
        bobGamma: clamp(
            Number.isFinite(Number(value.bobGamma))
                ? Number(value.bobGamma)
                : DEFAULT_BOB_GAMMA,
            0,
            MAX_BOB_GAMMA
        ),
        discountFactor: clamp(
            Number.isFinite(Number(value.discountFactor))
                ? Number(value.discountFactor)
                : DEFAULT_DISCOUNT_FACTOR,
            MIN_DISCOUNT_FACTOR,
            1
        ),
        klUcbConfidence: clamp(
            Number.isFinite(Number(value.klUcbConfidence))
                ? Number(value.klUcbConfidence)
                : DEFAULT_KL_UCB_CONFIDENCE,
            0,
            MAX_KL_UCB_CONFIDENCE
        ),
        bayesUcbQuantile: clamp(
            Number.isFinite(Number(value.bayesUcbQuantile))
                ? Number(value.bayesUcbQuantile)
                : DEFAULT_BAYES_UCB_QUANTILE,
            MIN_BAYES_UCB_QUANTILE,
            MAX_BAYES_UCB_QUANTILE
        ),
        changeDetectionMinSamples: clamp(
            Number.isFinite(Number(value.changeDetectionMinSamples))
                ? parsePositiveInt(value.changeDetectionMinSamples, DEFAULT_CD_MIN_SAMPLES)
                : DEFAULT_CD_MIN_SAMPLES,
            2,
            MAX_CD_MIN_SAMPLES
        ),
        changeDetectionThreshold: clamp(
            Number.isFinite(Number(value.changeDetectionThreshold))
                ? Number(value.changeDetectionThreshold)
                : DEFAULT_CD_DRIFT_THRESHOLD,
            Number.EPSILON,
            MAX_CD_DRIFT_THRESHOLD
        ),
        changeDetectionDelta: clamp(
            Number.isFinite(Number(value.changeDetectionDelta))
                ? Number(value.changeDetectionDelta)
                : DEFAULT_CD_MEAN_DELTA,
            0,
            MAX_CD_MEAN_DELTA
        ),
        adwinDelta: clamp(
            Number.isFinite(Number(value.adwinDelta))
                ? Number(value.adwinDelta)
                : DEFAULT_ADWIN_DELTA,
            MIN_ADWIN_DELTA,
            MAX_ADWIN_DELTA
        ),
        changeDetectionDirection: (() => {
            const candidate = typeof value.changeDetectionDirection === 'string'
                ? value.changeDetectionDirection.trim().toLowerCase()
                : DEFAULT_CD_DIRECTION;
            return CD_DIRECTION_MODES.has(candidate)
                ? candidate
                : DEFAULT_CD_DIRECTION;
        })(),
        cusumThreshold: clamp(
            Number.isFinite(Number(value.cusumThreshold))
                ? Number(value.cusumThreshold)
                : DEFAULT_CUSUM_THRESHOLD,
            Number.EPSILON,
            MAX_CUSUM_THRESHOLD
        ),
        cusumBaselineWeight: clamp(
            Number.isFinite(Number(value.cusumBaselineWeight))
                ? Number(value.cusumBaselineWeight)
                : DEFAULT_CUSUM_BASELINE_WEIGHT,
            Number.EPSILON,
            MAX_CUSUM_BASELINE_WEIGHT
        ),
        corralGamma: clamp(
            Number.isFinite(Number(value.corralGamma))
                ? Number(value.corralGamma)
                : DEFAULT_CORRAL_GAMMA,
            0,
            MAX_CORRAL_GAMMA
        ),
        corralEta: clamp(
            Number.isFinite(Number(value.corralEta))
                ? Number(value.corralEta)
                : DEFAULT_CORRAL_ETA,
            Number.EPSILON,
            MAX_CORRAL_ETA
        ),
        corralAutoGamma: Boolean(value.corralAutoGamma ?? DEFAULT_CORRAL_AUTO_GAMMA),
        corralAutoEta: Boolean(value.corralAutoEta ?? DEFAULT_CORRAL_AUTO_ETA),
        corralMinPolicyAttempts: clamp(
            Number.isFinite(Number(value.corralMinPolicyAttempts))
                ? parseNonNegativeInt(value.corralMinPolicyAttempts, DEFAULT_CORRAL_MIN_POLICY_ATTEMPTS)
                : DEFAULT_CORRAL_MIN_POLICY_ATTEMPTS,
            0,
            MAX_CORRAL_MIN_POLICY_ATTEMPTS
        ),
        corralForcedExploration: clamp(
            Number.isFinite(Number(value.corralForcedExploration))
                ? Number(value.corralForcedExploration)
                : DEFAULT_CORRAL_FORCED_EXPLORATION,
            0,
            MAX_CORRAL_FORCED_EXPLORATION
        ),
        corralUncertaintyWeight: clamp(
            Number.isFinite(Number(value.corralUncertaintyWeight))
                ? Number(value.corralUncertaintyWeight)
                : DEFAULT_CORRAL_UNCERTAINTY_WEIGHT,
            0,
            MAX_CORRAL_UNCERTAINTY_WEIGHT
        ),
        exp3ExplorationGamma: clamp(
            Number.isFinite(Number(value.exp3ExplorationGamma))
                ? Number(value.exp3ExplorationGamma)
                : (
                    Number.isFinite(Number(value.exp3IxGamma))
                        ? Number(value.exp3IxGamma)
                        : DEFAULT_EXP3_EXPLORATION_GAMMA
                ),
            Number.EPSILON,
            MAX_EXP3_IX_GAMMA
        ),
        exp3ImplicitGamma: Number.isFinite(Number(value.exp3ImplicitGamma))
            ? clamp(Number(value.exp3ImplicitGamma), Number.EPSILON, MAX_EXP3_IX_GAMMA)
            : DEFAULT_EXP3_IMPLICIT_GAMMA,
        exp3ImportanceWeightCap: clamp(
            Number.isFinite(Number(value.exp3ImportanceWeightCap))
                ? Number(value.exp3ImportanceWeightCap)
                : DEFAULT_EXP3_IMPORTANCE_WEIGHT_CAP,
            1,
            MAX_EXP3_IMPORTANCE_WEIGHT_CAP
        ),
        exp3IxEta: clamp(
            Number.isFinite(Number(value.exp3IxEta))
                ? Number(value.exp3IxEta)
                : DEFAULT_EXP3_IX_ETA,
            Number.EPSILON,
            MAX_EXP3_IX_ETA
        ),
        exp3AutoGamma: Boolean(value.exp3AutoGamma ?? DEFAULT_EXP3_AUTO_GAMMA),
        exp3AutoEta: Boolean(value.exp3AutoEta ?? DEFAULT_EXP3_AUTO_ETA),
        exp3ShareAlpha: clamp(
            Number.isFinite(Number(value.exp3ShareAlpha))
                ? Number(value.exp3ShareAlpha)
                : DEFAULT_EXP3_SHARE_ALPHA,
            0,
            MAX_EXP3_SHARE_ALPHA
        ),
        exp3RestartInterval: clamp(
            Number.isFinite(Number(value.exp3RestartInterval))
                ? parsePositiveInt(value.exp3RestartInterval, DEFAULT_EXP3_RESTART_INTERVAL)
                : DEFAULT_EXP3_RESTART_INTERVAL,
            1,
            MAX_EXP3_RESTART_INTERVAL
        ),
        tsallisEtaScale: clamp(
            Number.isFinite(Number(value.tsallisEtaScale))
                ? Number(value.tsallisEtaScale)
                : DEFAULT_TSALLIS_ETA_SCALE,
            Number.EPSILON,
            MAX_TSALLIS_ETA_SCALE
        ),
        tsallisAutoEta: Boolean(value.tsallisAutoEta ?? DEFAULT_TSALLIS_AUTO_ETA),
        mossAlpha: clamp(
            Number.isFinite(Number(value.mossAlpha))
                ? Number(value.mossAlpha)
                : DEFAULT_MOSS_ALPHA,
            Number.EPSILON,
            MAX_MOSS_ALPHA
        ),
        ucbVExploration: clamp(
            Number.isFinite(Number(value.ucbVExploration))
                ? Number(value.ucbVExploration)
                : DEFAULT_UCB_V_EXPLORATION,
            Number.EPSILON,
            MAX_UCB_V_EXPLORATION
        ),
        riskVarianceWeight: clamp(
            Number.isFinite(Number(value.riskVarianceWeight))
                ? Number(value.riskVarianceWeight)
                : DEFAULT_RISK_VARIANCE_WEIGHT,
            0,
            MAX_RISK_VARIANCE_WEIGHT
        ),
        boltzmannGumbelC: clamp(
            Number.isFinite(Number(value.boltzmannGumbelC))
                ? Number(value.boltzmannGumbelC)
                : DEFAULT_BOLTZMANN_GUMBEL_C,
            Number.EPSILON,
            MAX_BOLTZMANN_GUMBEL_C
        ),
        phePerturbationScale: clamp(
            Number.isFinite(Number(value.phePerturbationScale))
                ? Number(value.phePerturbationScale)
                : DEFAULT_PHE_PERTURBATION_SCALE,
            Number.EPSILON,
            MAX_PHE_PERTURBATION_SCALE
        ),
        latencyPenaltyWeight: clamp(
            Number.isFinite(Number(value.latencyPenaltyWeight))
                ? Number(value.latencyPenaltyWeight)
                : DEFAULT_LATENCY_PENALTY_WEIGHT,
            0,
            MAX_LATENCY_PENALTY_WEIGHT
        ),
        latencyTargetMs: clamp(
            Number.isFinite(Number(value.latencyTargetMs))
                ? Number(value.latencyTargetMs)
                : DEFAULT_LATENCY_TARGET_MS,
            1,
            MAX_LATENCY_TARGET_MS
        ),
        latencyAutoTarget: Boolean(value.latencyAutoTarget ?? DEFAULT_LATENCY_AUTO_TARGET),
        latencyAutoTargetPercentile: clamp(
            Number.isFinite(Number(value.latencyAutoTargetPercentile))
                ? Number(value.latencyAutoTargetPercentile)
                : DEFAULT_LATENCY_AUTO_TARGET_PERCENTILE,
            MIN_LATENCY_AUTO_TARGET_PERCENTILE,
            MAX_LATENCY_AUTO_TARGET_PERCENTILE
        ),
        latencyAutoTargetMinSamples: clamp(
            Number.isFinite(Number(value.latencyAutoTargetMinSamples))
                ? parsePositiveInt(value.latencyAutoTargetMinSamples, DEFAULT_LATENCY_AUTO_TARGET_MIN_SAMPLES)
                : DEFAULT_LATENCY_AUTO_TARGET_MIN_SAMPLES,
            1,
            MAX_LATENCY_AUTO_TARGET_MIN_SAMPLES
        ),
        latencyAutoTargetWindowSize: clamp(
            Number.isFinite(Number(value.latencyAutoTargetWindowSize))
                ? parsePositiveInt(value.latencyAutoTargetWindowSize, DEFAULT_LATENCY_AUTO_TARGET_WINDOW_SIZE)
                : DEFAULT_LATENCY_AUTO_TARGET_WINDOW_SIZE,
            1,
            MAX_LATENCY_AUTO_TARGET_WINDOW_SIZE
        ),
        latencyAutoTargetBlend: clamp(
            Number.isFinite(Number(value.latencyAutoTargetBlend))
                ? Number(value.latencyAutoTargetBlend)
                : DEFAULT_LATENCY_AUTO_TARGET_BLEND,
            0,
            MAX_LATENCY_AUTO_TARGET_BLEND
        ),
        reliabilityFloor: clamp(
            Number.isFinite(Number(value.reliabilityFloor))
                ? Number(value.reliabilityFloor)
                : DEFAULT_RELIABILITY_FLOOR,
            0,
            MAX_RELIABILITY_FLOOR
        ),
        reliabilityFloorMinAttempts: clamp(
            Number.isFinite(Number(value.reliabilityFloorMinAttempts))
                ? parsePositiveInt(value.reliabilityFloorMinAttempts, DEFAULT_RELIABILITY_FLOOR_MIN_ATTEMPTS)
                : DEFAULT_RELIABILITY_FLOOR_MIN_ATTEMPTS,
            1,
            MAX_RELIABILITY_FLOOR_MIN_ATTEMPTS
        ),
        latencySlaMs: clamp(
            Number.isFinite(Number(value.latencySlaMs))
                ? Number(value.latencySlaMs)
                : DEFAULT_LATENCY_SLA_MS,
            1,
            MAX_LATENCY_SLA_MS
        ),
        latencySlaFloor: clamp(
            Number.isFinite(Number(value.latencySlaFloor))
                ? Number(value.latencySlaFloor)
                : DEFAULT_LATENCY_SLA_FLOOR,
            0,
            MAX_LATENCY_SLA_FLOOR
        ),
        latencySlaMinAttempts: clamp(
            Number.isFinite(Number(value.latencySlaMinAttempts))
                ? parsePositiveInt(value.latencySlaMinAttempts, DEFAULT_LATENCY_SLA_MIN_ATTEMPTS)
                : DEFAULT_LATENCY_SLA_MIN_ATTEMPTS,
            1,
            MAX_LATENCY_SLA_MIN_ATTEMPTS
        ),
        latencyTailPenaltyWeight: clamp(
            Number.isFinite(Number(value.latencyTailPenaltyWeight))
                ? Number(value.latencyTailPenaltyWeight)
                : DEFAULT_LATENCY_TAIL_PENALTY_WEIGHT,
            0,
            MAX_LATENCY_TAIL_PENALTY_WEIGHT
        ),
        latencyTailPercentile: clamp(
            Number.isFinite(Number(value.latencyTailPercentile))
                ? Number(value.latencyTailPercentile)
                : DEFAULT_LATENCY_TAIL_PERCENTILE,
            MIN_LATENCY_TAIL_PERCENTILE,
            MAX_LATENCY_TAIL_PERCENTILE
        ),
        latencyTailMinSamples: clamp(
            Number.isFinite(Number(value.latencyTailMinSamples))
                ? parsePositiveInt(value.latencyTailMinSamples, DEFAULT_LATENCY_TAIL_MIN_SAMPLES)
                : DEFAULT_LATENCY_TAIL_MIN_SAMPLES,
            1,
            MAX_LATENCY_TAIL_MIN_SAMPLES
        ),
        latencyCvarPenaltyWeight: clamp(
            Number.isFinite(Number(value.latencyCvarPenaltyWeight))
                ? Number(value.latencyCvarPenaltyWeight)
                : DEFAULT_LATENCY_CVAR_PENALTY_WEIGHT,
            0,
            MAX_LATENCY_CVAR_PENALTY_WEIGHT
        ),
        latencyCvarPercentile: clamp(
            Number.isFinite(Number(value.latencyCvarPercentile))
                ? Number(value.latencyCvarPercentile)
                : DEFAULT_LATENCY_CVAR_PERCENTILE,
            MIN_LATENCY_CVAR_PERCENTILE,
            MAX_LATENCY_CVAR_PERCENTILE
        ),
        latencyCvarMinSamples: clamp(
            Number.isFinite(Number(value.latencyCvarMinSamples))
                ? parsePositiveInt(value.latencyCvarMinSamples, DEFAULT_LATENCY_CVAR_MIN_SAMPLES)
                : DEFAULT_LATENCY_CVAR_MIN_SAMPLES,
            1,
            MAX_LATENCY_CVAR_MIN_SAMPLES
        ),
        failureBurstPenaltyWeight: clamp(
            Number.isFinite(Number(value.failureBurstPenaltyWeight))
                ? Number(value.failureBurstPenaltyWeight)
                : DEFAULT_FAILURE_BURST_PENALTY_WEIGHT,
            0,
            MAX_FAILURE_BURST_PENALTY_WEIGHT
        ),
        failureBurstShortWindow: clamp(
            Number.isFinite(Number(value.failureBurstShortWindow))
                ? parsePositiveInt(value.failureBurstShortWindow, DEFAULT_FAILURE_BURST_SHORT_WINDOW)
                : DEFAULT_FAILURE_BURST_SHORT_WINDOW,
            2,
            MAX_FAILURE_BURST_SHORT_WINDOW
        ),
        failureBurstLongWindow: clamp(
            Number.isFinite(Number(value.failureBurstLongWindow))
                ? parsePositiveInt(value.failureBurstLongWindow, DEFAULT_FAILURE_BURST_LONG_WINDOW)
                : DEFAULT_FAILURE_BURST_LONG_WINDOW,
            2,
            MAX_FAILURE_BURST_LONG_WINDOW
        ),
        failureBurstMinAttempts: clamp(
            Number.isFinite(Number(value.failureBurstMinAttempts))
                ? parsePositiveInt(value.failureBurstMinAttempts, DEFAULT_FAILURE_BURST_MIN_ATTEMPTS)
                : DEFAULT_FAILURE_BURST_MIN_ATTEMPTS,
            1,
            MAX_FAILURE_BURST_MIN_ATTEMPTS
        ),
        failureBurstThreshold: clamp(
            Number.isFinite(Number(value.failureBurstThreshold))
                ? Number(value.failureBurstThreshold)
                : DEFAULT_FAILURE_BURST_THRESHOLD,
            1,
            MAX_FAILURE_BURST_THRESHOLD
        ),
        latencyBurstPenaltyWeight: clamp(
            Number.isFinite(Number(value.latencyBurstPenaltyWeight))
                ? Number(value.latencyBurstPenaltyWeight)
                : DEFAULT_LATENCY_BURST_PENALTY_WEIGHT,
            0,
            MAX_LATENCY_BURST_PENALTY_WEIGHT
        ),
        latencyBurstShortWindow: clamp(
            Number.isFinite(Number(value.latencyBurstShortWindow))
                ? parsePositiveInt(value.latencyBurstShortWindow, DEFAULT_LATENCY_BURST_SHORT_WINDOW)
                : DEFAULT_LATENCY_BURST_SHORT_WINDOW,
            2,
            MAX_LATENCY_BURST_SHORT_WINDOW
        ),
        latencyBurstLongWindow: clamp(
            Number.isFinite(Number(value.latencyBurstLongWindow))
                ? parsePositiveInt(value.latencyBurstLongWindow, DEFAULT_LATENCY_BURST_LONG_WINDOW)
                : DEFAULT_LATENCY_BURST_LONG_WINDOW,
            2,
            MAX_LATENCY_BURST_LONG_WINDOW
        ),
        latencyBurstMinAttempts: clamp(
            Number.isFinite(Number(value.latencyBurstMinAttempts))
                ? parsePositiveInt(value.latencyBurstMinAttempts, DEFAULT_LATENCY_BURST_MIN_ATTEMPTS)
                : DEFAULT_LATENCY_BURST_MIN_ATTEMPTS,
            1,
            MAX_LATENCY_BURST_MIN_ATTEMPTS
        ),
        latencyBurstThreshold: clamp(
            Number.isFinite(Number(value.latencyBurstThreshold))
                ? Number(value.latencyBurstThreshold)
                : DEFAULT_LATENCY_BURST_THRESHOLD,
            1,
            MAX_LATENCY_BURST_THRESHOLD
        )
    };
}

function normalizePolicyPerformanceStat(rawStat = {}) {
    const stat = rawStat && typeof rawStat === 'object' ? rawStat : {};
    const attempts = parseNonNegativeInt(stat.attempts, 0);
    const successes = clamp(parseNonNegativeNumber(stat.successes, 0), 0, attempts);
    const failures = clamp(parseNonNegativeNumber(stat.failures, 0), 0, attempts);
    const cumulativeReward = Number.isFinite(Number(stat.cumulativeReward))
        ? Math.max(0, Number(stat.cumulativeReward))
        : successes;
    const lastStatus = typeof stat.lastStatus === 'string' && stat.lastStatus.trim()
        ? normalizeStatus(stat.lastStatus)
        : null;
    const lastWave = Number.isFinite(Number(stat.lastWave))
        ? parseNonNegativeInt(stat.lastWave, 0)
        : null;
    const consecutiveFailures = clamp(
        parseNonNegativeInt(stat.consecutiveFailures, Math.ceil(failures)),
        0,
        attempts
    );
    const recentOutcomes = normalizeRecentOutcomes(stat.recentOutcomes);

    return {
        attempts,
        successes,
        failures,
        cumulativeReward,
        lastStatus,
        lastWave,
        consecutiveFailures,
        recentOutcomes
    };
}

function normalizePolicyPerformanceByLane(rawStats = {}) {
    const stats = rawStats && typeof rawStats === 'object' ? rawStats : {};
    const normalized = {};
    const trackedPolicies = new Set(SUPPORTED_SELECTION_POLICY_MODES);

    for (const key of Object.keys(stats)) {
        const normalizedKey = typeof key === 'string'
            ? key.trim().toLowerCase()
            : '';
        if (SUPPORTED_SELECTION_POLICY_MODE_SET.has(normalizedKey)) {
            trackedPolicies.add(normalizedKey);
        }
    }

    for (const policy of trackedPolicies) {
        normalized[policy] = normalizePolicyPerformanceStat(stats[policy]);
    }

    return normalized;
}

function normalizePolicyExecutionStats(rawStats = {}) {
    const stats = rawStats && typeof rawStats === 'object' ? rawStats : {};
    return {
        skills: normalizePolicyPerformanceByLane(stats.skills),
        capabilities: normalizePolicyPerformanceByLane(stats.capabilities)
    };
}

function normalizeWindowPolicyPerformanceByLane(rawStats = {}) {
    const stats = rawStats && typeof rawStats === 'object' ? rawStats : {};
    const normalized = {};
    for (const [windowKey, value] of Object.entries(stats)) {
        const parsedWindow = parsePositiveInt(windowKey, 0);
        if (parsedWindow <= 0) continue;
        normalized[String(parsedWindow)] = normalizePolicyPerformanceStat(value);
    }
    return normalized;
}

function normalizeWindowPolicyExecutionStats(rawStats = {}) {
    const stats = rawStats && typeof rawStats === 'object' ? rawStats : {};
    return {
        skills: normalizeWindowPolicyPerformanceByLane(stats.skills),
        capabilities: normalizeWindowPolicyPerformanceByLane(stats.capabilities)
    };
}

function createIdentityMatrix(size) {
    const n = parsePositiveInt(size, LINUCB_FEATURE_NAMES.length);
    const matrix = [];
    for (let row = 0; row < n; row++) {
        const values = new Array(n).fill(0);
        values[row] = 1;
        matrix.push(values);
    }
    return matrix;
}

function normalizeNumericVector(rawValues, size, fallback = 0) {
    const values = Array.isArray(rawValues) ? rawValues : [];
    const normalized = [];
    for (let i = 0; i < size; i++) {
        const numeric = Number(values[i]);
        normalized.push(Number.isFinite(numeric) ? numeric : fallback);
    }
    return normalized;
}

function normalizeNumericMatrix(rawValues, size, fallbackMatrix) {
    const values = Array.isArray(rawValues) ? rawValues : [];
    const fallback = Array.isArray(fallbackMatrix) ? fallbackMatrix : createIdentityMatrix(size);
    const matrix = [];
    for (let row = 0; row < size; row++) {
        const sourceRow = Array.isArray(values[row]) ? values[row] : fallback[row];
        matrix.push(normalizeNumericVector(sourceRow, size, fallback[row][row] ?? 0));
    }
    return matrix;
}

function normalizeContextualObservation(rawObservation = {}, dimension = LINUCB_FEATURE_NAMES.length) {
    const observation = rawObservation && typeof rawObservation === 'object' ? rawObservation : {};
    const reward = Number(observation.reward);
    return {
        reward: Number.isFinite(reward) ? clamp(reward, 0, 1) : 0,
        featureVector: normalizeNumericVector(observation.featureVector, dimension, 0)
    };
}

function normalizeContextualObservations(rawObservations = [], dimension = LINUCB_FEATURE_NAMES.length) {
    if (!Array.isArray(rawObservations)) return [];
    return rawObservations
        .map((entry) => normalizeContextualObservation(entry, dimension))
        .slice(-MAX_CONTEXTUAL_OBSERVATIONS_TRACKED);
}

function normalizeLinUcbModel(rawModel = {}) {
    const model = rawModel && typeof rawModel === 'object' ? rawModel : {};
    const dimension = LINUCB_FEATURE_NAMES.length;
    const defaultMatrix = createIdentityMatrix(dimension);
    return {
        dimension,
        featureNames: LINUCB_FEATURE_NAMES.slice(),
        samples: parseNonNegativeInt(model.samples, 0),
        matrixA: normalizeNumericMatrix(model.matrixA, dimension, defaultMatrix),
        vectorB: normalizeNumericVector(model.vectorB, dimension, 0),
        recentObservations: normalizeContextualObservations(model.recentObservations, dimension)
    };
}

function updateLinModelFromObservation(matrixA, vectorB, featureVector, reward) {
    const dimension = Math.min(matrixA.length, vectorB.length, featureVector.length);
    for (let row = 0; row < dimension; row++) {
        vectorB[row] += featureVector[row] * reward;
        for (let col = 0; col < dimension; col++) {
            matrixA[row][col] += featureVector[row] * featureVector[col];
        }
    }
}

function createLinUcbModelFromObservations(observations = [], dimension = LINUCB_FEATURE_NAMES.length) {
    const matrixA = createIdentityMatrix(dimension);
    const vectorB = normalizeNumericVector([], dimension, 0);
    for (const observation of observations) {
        updateLinModelFromObservation(matrixA, vectorB, observation.featureVector, observation.reward);
    }
    return {
        dimension,
        featureNames: LINUCB_FEATURE_NAMES.slice(),
        samples: observations.length,
        matrixA,
        vectorB,
        recentObservations: observations.slice(-MAX_CONTEXTUAL_OBSERVATIONS_TRACKED)
    };
}

function resolveContextualModelForScoring(contextualBanditModel, selectionPolicyConfig) {
    const normalizedModel = normalizeLinUcbModel(contextualBanditModel);
    const normalizedPolicy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    if (ADWIN_CONTEXTUAL_POLICY_MODES.has(normalizedPolicy.mode)) {
        const changeIndex = detectAdwinObservationChangeIndex(
            normalizedModel.recentObservations,
            normalizedPolicy
        );
        const observations = changeIndex > 0
            ? normalizedModel.recentObservations.slice(changeIndex)
            : normalizedModel.recentObservations;
        return createLinUcbModelFromObservations(observations, normalizedModel.dimension);
    }
    if (normalizedPolicy.mode !== 'sw_linucb' && normalizedPolicy.mode !== 'sw_lints') {
        return normalizedModel;
    }
    const observations = normalizedModel.recentObservations.slice(-normalizedPolicy.slidingWindowSize);
    return createLinUcbModelFromObservations(observations, normalizedModel.dimension);
}

function normalizeContextualBanditModels(rawModels = {}) {
    const models = rawModels && typeof rawModels === 'object' ? rawModels : {};
    return {
        skills: normalizeLinUcbModel(models.skills),
        capabilities: normalizeLinUcbModel(models.capabilities)
    };
}

function normalizeRecentOutcomeEntry(rawEntry = {}) {
    const entry = rawEntry && typeof rawEntry === 'object' ? rawEntry : {};
    const status = normalizeStatus(entry.status);
    const explicitReward = Number(entry.reward);
    const reward = Number.isFinite(explicitReward)
        ? clamp(explicitReward, 0, 1)
        : getStatusReward(status);
    const explicitPropensity = Number(entry.propensity);
    const propensity = Number.isFinite(explicitPropensity)
        ? clamp(explicitPropensity, Number.EPSILON, 1)
        : null;
    const explicitDurationMs = Number(entry.durationMs);
    const durationMs = Number.isFinite(explicitDurationMs) && explicitDurationMs > 0
        ? clamp(explicitDurationMs, 1, MAX_LATENCY_TARGET_MS)
        : null;
    return {
        wave: Number.isFinite(Number(entry.wave))
            ? parseNonNegativeInt(entry.wave, 0)
            : 0,
        status,
        reward,
        durationMs,
        propensity,
        didSucceed: SUCCESS_STATUSES.has(status)
    };
}

function getStatusReward(status) {
    const normalizedStatus = normalizeStatus(status);
    const reward = STATUS_REWARD[normalizedStatus];
    return Number.isFinite(reward) ? reward : 0;
}

function resolveOutcomeDurationMs(record) {
    const startedAt = Number.isFinite(Number(record?.request?.createdAt))
        ? Number(record.request.createdAt)
        : null;
    const completedAt = Number.isFinite(Number(record?.closedAt))
        ? Number(record.closedAt)
        : (Number.isFinite(Number(record?.updatedAt))
            ? Number(record.updatedAt)
            : null);
    if (!Number.isFinite(startedAt) || !Number.isFinite(completedAt)) return null;
    const elapsedMs = completedAt - startedAt;
    return elapsedMs > 0 ? elapsedMs : null;
}

function computePercentile(values = [], percentile = DEFAULT_LATENCY_AUTO_TARGET_PERCENTILE) {
    const sorted = values
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value))
        .sort((left, right) => left - right);
    if (sorted.length <= 0) return null;
    const boundedPercentile = clamp(
        Number.isFinite(Number(percentile)) ? Number(percentile) : DEFAULT_LATENCY_AUTO_TARGET_PERCENTILE,
        MIN_LATENCY_AUTO_TARGET_PERCENTILE,
        MAX_LATENCY_AUTO_TARGET_PERCENTILE
    );
    const index = clamp(
        Math.ceil(sorted.length * boundedPercentile) - 1,
        0,
        sorted.length - 1
    );
    const value = sorted[index];
    return Number.isFinite(value) ? value : null;
}

function computeWilsonLowerBound(successes = 0, attempts = 0, z = RELIABILITY_FLOOR_Z_SCORE) {
    const n = Number(attempts);
    if (!Number.isFinite(n) || n <= 0) return 0;
    const boundedSuccesses = clamp(Number(successes), 0, n);
    const pHat = boundedSuccesses / n;
    const zSquared = z * z;
    const denominator = 1 + (zSquared / n);
    const center = pHat + (zSquared / (2 * n));
    const marginBase = (pHat * (1 - pHat) / n) + (zSquared / (4 * n * n));
    const margin = z * Math.sqrt(Math.max(0, marginBase));
    return clamp((center - margin) / denominator, 0, 1);
}

function computeReliabilityFloorPenalty(stat, selectionPolicyConfig = null) {
    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const floor = clamp(policy.reliabilityFloor, 0, MAX_RELIABILITY_FLOOR);
    if (floor <= 0) return 0;

    const attempts = clamp(parseNonNegativeInt(stat?.attempts, 0), 0, Number.MAX_SAFE_INTEGER);
    const minAttempts = clamp(
        parsePositiveInt(policy.reliabilityFloorMinAttempts, DEFAULT_RELIABILITY_FLOOR_MIN_ATTEMPTS),
        1,
        MAX_RELIABILITY_FLOOR_MIN_ATTEMPTS
    );
    if (attempts < minAttempts) return 0;

    const successes = clamp(parseNonNegativeInt(stat?.successes, 0), 0, attempts);
    const lowerBound = computeWilsonLowerBound(successes, attempts);
    return clamp(floor - lowerBound, 0, 1);
}

function computeLatencySlaPenalty(stat, selectionPolicyConfig = null) {
    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const floor = clamp(policy.latencySlaFloor, 0, MAX_LATENCY_SLA_FLOOR);
    if (floor <= 0) return 0;

    const attempts = clamp(parseNonNegativeInt(stat?.attempts, 0), 0, Number.MAX_SAFE_INTEGER);
    const minAttempts = clamp(
        parsePositiveInt(policy.latencySlaMinAttempts, DEFAULT_LATENCY_SLA_MIN_ATTEMPTS),
        1,
        MAX_LATENCY_SLA_MIN_ATTEMPTS
    );
    if (attempts < minAttempts) return 0;

    const latencySlaMs = clamp(policy.latencySlaMs, 1, MAX_LATENCY_SLA_MS);
    const recentOutcomes = normalizeRecentOutcomes(stat?.recentOutcomes);
    if (recentOutcomes.length <= 0) return 0;

    const terminalRecentOutcomes = recentOutcomes.slice(-attempts);
    const measuredAttemptCount = clamp(
        terminalRecentOutcomes.filter((entry) => Number.isFinite(entry.durationMs) && entry.durationMs > 0).length,
        0,
        attempts
    );
    if (measuredAttemptCount < minAttempts) return 0;

    const deadlineHits = clamp(
        terminalRecentOutcomes.filter((entry) => Number.isFinite(entry.durationMs) && entry.durationMs > 0 && entry.durationMs <= latencySlaMs).length,
        0,
        measuredAttemptCount
    );
    const lowerBound = computeWilsonLowerBound(deadlineHits, measuredAttemptCount);
    return clamp(floor - lowerBound, 0, 1);
}

function computeLatencyTailPenalty(stat, selectionPolicyConfig = null) {
    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const penaltyWeight = clamp(policy.latencyTailPenaltyWeight, 0, MAX_LATENCY_TAIL_PENALTY_WEIGHT);
    if (penaltyWeight <= 0) return 0;

    const attempts = clamp(parseNonNegativeInt(stat?.attempts, 0), 0, Number.MAX_SAFE_INTEGER);
    const minSamples = clamp(
        parsePositiveInt(policy.latencyTailMinSamples, DEFAULT_LATENCY_TAIL_MIN_SAMPLES),
        1,
        MAX_LATENCY_TAIL_MIN_SAMPLES
    );
    if (attempts < minSamples) return 0;

    const recentOutcomes = normalizeRecentOutcomes(stat?.recentOutcomes);
    if (recentOutcomes.length <= 0) return 0;
    const terminalRecentOutcomes = recentOutcomes.slice(-attempts);
    const durations = terminalRecentOutcomes
        .map((entry) => Number(entry.durationMs))
        .filter((value) => Number.isFinite(value) && value > 0);
    if (durations.length < minSamples) return 0;

    const latencyTargetMs = resolveLatencyTargetMs(policy, terminalRecentOutcomes);
    const tailDurationMs = computePercentile(durations, policy.latencyTailPercentile);
    if (!Number.isFinite(tailDurationMs) || tailDurationMs <= latencyTargetMs) return 0;

    const overrunRatio = clamp((tailDurationMs - latencyTargetMs) / latencyTargetMs, 0, 1);
    return clamp(penaltyWeight * overrunRatio, 0, 1);
}

function computeLatencyCvarPenalty(stat, selectionPolicyConfig = null) {
    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const penaltyWeight = clamp(policy.latencyCvarPenaltyWeight, 0, MAX_LATENCY_CVAR_PENALTY_WEIGHT);
    if (penaltyWeight <= 0) return 0;

    const attempts = clamp(parseNonNegativeInt(stat?.attempts, 0), 0, Number.MAX_SAFE_INTEGER);
    const minSamples = clamp(
        parsePositiveInt(policy.latencyCvarMinSamples, DEFAULT_LATENCY_CVAR_MIN_SAMPLES),
        1,
        MAX_LATENCY_CVAR_MIN_SAMPLES
    );
    if (attempts < minSamples) return 0;

    const recentOutcomes = normalizeRecentOutcomes(stat?.recentOutcomes);
    if (recentOutcomes.length <= 0) return 0;
    const terminalRecentOutcomes = recentOutcomes.slice(-attempts);
    const durations = terminalRecentOutcomes
        .map((entry) => Number(entry.durationMs))
        .filter((value) => Number.isFinite(value) && value > 0);
    if (durations.length < minSamples) return 0;

    const latencyTargetMs = resolveLatencyTargetMs(policy, terminalRecentOutcomes);
    const tailThresholdMs = computePercentile(durations, policy.latencyCvarPercentile);
    if (!Number.isFinite(tailThresholdMs)) return 0;

    const tailDurations = durations.filter((durationMs) => durationMs >= tailThresholdMs);
    if (tailDurations.length <= 0) return 0;
    const cvarTailMs = tailDurations.reduce((sum, value) => sum + value, 0) / tailDurations.length;
    if (!Number.isFinite(cvarTailMs) || cvarTailMs <= latencyTargetMs) return 0;

    const overrunRatio = clamp((cvarTailMs - latencyTargetMs) / latencyTargetMs, 0, 1);
    return clamp(penaltyWeight * overrunRatio, 0, 1);
}

function computeWindowedBurstPenalty({
    attempts = 0,
    recentOutcomes = [],
    minAttempts = 1,
    shortWindow = 8,
    longWindow = 32,
    threshold = 1.5,
    penaltyWeight = 0,
    isFailure = () => false
} = {}) {
    const normalizedAttempts = clamp(parseNonNegativeInt(attempts, 0), 0, Number.MAX_SAFE_INTEGER);
    if (normalizedAttempts <= 0) return 0;

    const normalizedMinAttempts = clamp(parsePositiveInt(minAttempts, 1), 1, Number.MAX_SAFE_INTEGER);
    if (normalizedAttempts < normalizedMinAttempts) return 0;
    if (!Array.isArray(recentOutcomes) || recentOutcomes.length < normalizedMinAttempts) return 0;

    const normalizedShortWindow = clamp(parsePositiveInt(shortWindow, DEFAULT_FAILURE_BURST_SHORT_WINDOW), 2, Number.MAX_SAFE_INTEGER);
    const normalizedLongWindow = clamp(parsePositiveInt(longWindow, DEFAULT_FAILURE_BURST_LONG_WINDOW), normalizedShortWindow, Number.MAX_SAFE_INTEGER);
    const normalizedThreshold = clamp(Number(threshold), 1, Number.MAX_SAFE_INTEGER);
    const normalizedPenaltyWeight = clamp(Number(penaltyWeight), 0, 1);
    if (normalizedPenaltyWeight <= 0) return 0;

    const terminalRecentOutcomes = recentOutcomes.slice(-normalizedAttempts);
    const longOutcomes = terminalRecentOutcomes.slice(-normalizedLongWindow);
    const shortOutcomes = longOutcomes.slice(-normalizedShortWindow);
    if (shortOutcomes.length < Math.min(normalizedMinAttempts, normalizedShortWindow)) return 0;
    if (longOutcomes.length < Math.min(normalizedMinAttempts, normalizedLongWindow)) return 0;

    const shortFailures = shortOutcomes.filter((entry) => isFailure(entry)).length;
    const longFailures = longOutcomes.filter((entry) => isFailure(entry)).length;
    if (shortFailures <= 0) return 0;

    const shortFailureRate = shortFailures / shortOutcomes.length;
    const longFailureRate = longFailures / longOutcomes.length;
    const stabilizedLongRate = Math.max(longFailureRate, 1 / longOutcomes.length);
    const burstRatio = shortFailureRate / stabilizedLongRate;
    if (burstRatio <= normalizedThreshold) return 0;

    const normalizedBurst = clamp((burstRatio - normalizedThreshold) / normalizedThreshold, 0, 1);
    return clamp(normalizedPenaltyWeight * normalizedBurst, 0, 1);
}

function computeFailureBurstPenalty(stat, selectionPolicyConfig = null) {
    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const penaltyWeight = clamp(policy.failureBurstPenaltyWeight, 0, MAX_FAILURE_BURST_PENALTY_WEIGHT);
    if (penaltyWeight <= 0) return 0;

    const attempts = clamp(parseNonNegativeInt(stat?.attempts, 0), 0, Number.MAX_SAFE_INTEGER);
    const minAttempts = clamp(
        parsePositiveInt(policy.failureBurstMinAttempts, DEFAULT_FAILURE_BURST_MIN_ATTEMPTS),
        1,
        MAX_FAILURE_BURST_MIN_ATTEMPTS
    );
    if (attempts < minAttempts) return 0;

    const recentOutcomes = normalizeRecentOutcomes(stat?.recentOutcomes);
    return computeWindowedBurstPenalty({
        attempts,
        recentOutcomes,
        minAttempts,
        shortWindow: clamp(
            parsePositiveInt(policy.failureBurstShortWindow, DEFAULT_FAILURE_BURST_SHORT_WINDOW),
            2,
            MAX_FAILURE_BURST_SHORT_WINDOW
        ),
        longWindow: clamp(
            parsePositiveInt(policy.failureBurstLongWindow, DEFAULT_FAILURE_BURST_LONG_WINDOW),
            2,
            MAX_FAILURE_BURST_LONG_WINDOW
        ),
        threshold: clamp(policy.failureBurstThreshold, 1, MAX_FAILURE_BURST_THRESHOLD),
        penaltyWeight,
        isFailure: (entry) => !SUCCESS_STATUSES.has(entry?.status)
    });
}

function computeLatencyBurstPenalty(stat, selectionPolicyConfig = null) {
    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const penaltyWeight = clamp(policy.latencyBurstPenaltyWeight, 0, MAX_LATENCY_BURST_PENALTY_WEIGHT);
    if (penaltyWeight <= 0) return 0;

    const attempts = clamp(parseNonNegativeInt(stat?.attempts, 0), 0, Number.MAX_SAFE_INTEGER);
    const minAttempts = clamp(
        parsePositiveInt(policy.latencyBurstMinAttempts, DEFAULT_LATENCY_BURST_MIN_ATTEMPTS),
        1,
        MAX_LATENCY_BURST_MIN_ATTEMPTS
    );
    if (attempts < minAttempts) return 0;

    const recentOutcomes = normalizeRecentOutcomes(stat?.recentOutcomes);
    const latencySlaMs = clamp(policy.latencySlaMs, 1, MAX_LATENCY_SLA_MS);
    return computeWindowedBurstPenalty({
        attempts,
        recentOutcomes,
        minAttempts,
        shortWindow: clamp(
            parsePositiveInt(policy.latencyBurstShortWindow, DEFAULT_LATENCY_BURST_SHORT_WINDOW),
            2,
            MAX_LATENCY_BURST_SHORT_WINDOW
        ),
        longWindow: clamp(
            parsePositiveInt(policy.latencyBurstLongWindow, DEFAULT_LATENCY_BURST_LONG_WINDOW),
            2,
            MAX_LATENCY_BURST_LONG_WINDOW
        ),
        threshold: clamp(policy.latencyBurstThreshold, 1, MAX_LATENCY_BURST_THRESHOLD),
        penaltyWeight,
        isFailure: (entry) => {
            const durationMs = Number(entry?.durationMs);
            return !Number.isFinite(durationMs) || durationMs <= 0 || durationMs > latencySlaMs;
        }
    });
}

function resolveLatencyTargetMs(selectionPolicyConfig = null, historyOutcomes = []) {
    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const configuredTargetMs = clamp(policy.latencyTargetMs, 1, MAX_LATENCY_TARGET_MS);
    if (!policy.latencyAutoTarget) {
        return configuredTargetMs;
    }
    const durations = Array.isArray(historyOutcomes)
        ? historyOutcomes
            .map((entry) => normalizeRecentOutcomeEntry(entry).durationMs)
            .filter((value) => Number.isFinite(value) && value > 0)
        : [];
    const windowedDurations = durations.slice(
        -clamp(
            parsePositiveInt(policy.latencyAutoTargetWindowSize, DEFAULT_LATENCY_AUTO_TARGET_WINDOW_SIZE),
            1,
            MAX_LATENCY_AUTO_TARGET_WINDOW_SIZE
        )
    );
    if (windowedDurations.length < policy.latencyAutoTargetMinSamples) {
        return configuredTargetMs;
    }
    const adaptiveTargetMs = computePercentile(windowedDurations, policy.latencyAutoTargetPercentile);
    if (!Number.isFinite(adaptiveTargetMs) || adaptiveTargetMs <= 0) {
        return configuredTargetMs;
    }
    const blend = clamp(
        Number(policy.latencyAutoTargetBlend),
        0,
        MAX_LATENCY_AUTO_TARGET_BLEND
    );
    return clamp(
        (blend * adaptiveTargetMs) + ((1 - blend) * configuredTargetMs),
        1,
        MAX_LATENCY_TARGET_MS
    );
}

function getOutcomeReward(status, record = null, selectionPolicyConfig = null, historyOutcomes = []) {
    const baseReward = getStatusReward(status);
    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const latencyPenaltyWeight = clamp(policy.latencyPenaltyWeight, 0, MAX_LATENCY_PENALTY_WEIGHT);
    if (latencyPenaltyWeight <= 0) {
        return baseReward;
    }
    const durationMs = resolveOutcomeDurationMs(record);
    if (!Number.isFinite(durationMs) || durationMs <= 0) {
        return baseReward;
    }
    const latencyTargetMs = resolveLatencyTargetMs(policy, historyOutcomes);
    if (durationMs <= latencyTargetMs) {
        return baseReward;
    }
    const overrunRatio = clamp((durationMs - latencyTargetMs) / latencyTargetMs, 0, 1);
    const penalty = latencyPenaltyWeight * overrunRatio;
    return clamp(baseReward * (1 - penalty), 0, 1);
}

function normalizeRecentOutcomes(rawOutcomes = []) {
    if (!Array.isArray(rawOutcomes)) return [];
    const normalized = [];
    for (const rawEntry of rawOutcomes) {
        const entry = normalizeRecentOutcomeEntry(rawEntry);
        if (!TERMINAL_STATUSES.has(entry.status)) continue;
        normalized.push(entry);
    }
    return normalized.slice(-MAX_RECENT_OUTCOMES_TRACKED);
}

function normalizeExecutionStat(rawStat = {}) {
    const stat = rawStat && typeof rawStat === 'object' ? rawStat : {};
    const attempts = parseNonNegativeInt(stat.attempts, 0);
    const successes = clamp(parseNonNegativeInt(stat.successes, 0), 0, attempts);
    const failures = clamp(parseNonNegativeInt(stat.failures, 0), 0, attempts);
    const consecutiveFailures = clamp(parseNonNegativeInt(stat.consecutiveFailures, 0), 0, attempts);
    const lastStatus = typeof stat.lastStatus === 'string' && stat.lastStatus.trim()
        ? normalizeStatus(stat.lastStatus)
        : null;
    const lastAttemptAt = Number.isFinite(Number(stat.lastAttemptAt))
        ? Number(stat.lastAttemptAt)
        : null;
    const lastWave = Number.isFinite(Number(stat.lastWave))
        ? parseNonNegativeInt(stat.lastWave, 0)
        : null;
    const recentOutcomes = normalizeRecentOutcomes(stat.recentOutcomes);

    return {
        attempts,
        successes,
        failures,
        consecutiveFailures,
        lastStatus,
        lastAttemptAt,
        lastWave,
        recentOutcomes
    };
}

function normalizeSkillExecutionStats(rawStats = {}) {
    const stats = rawStats && typeof rawStats === 'object' ? rawStats : {};
    const normalized = {};

    for (const [key, value] of Object.entries(stats)) {
        const skillId = toSkillId(key);
        if (skillId === null) continue;
        normalized[String(skillId)] = normalizeExecutionStat(value);
    }

    return normalized;
}

function normalizeCapabilityExecutionStats(rawStats = {}) {
    const stats = rawStats && typeof rawStats === 'object' ? rawStats : {};
    const normalized = {};

    for (const [key, value] of Object.entries(stats)) {
        const capabilityId = normalizeCapabilityId(key);
        if (!capabilityId) continue;
        normalized[capabilityId] = normalizeExecutionStat(value);
    }

    return normalized;
}

function normalizeState(rawState = {}) {
    const state = rawState && typeof rawState === 'object' ? rawState : {};

    return {
        version: 1,
        runCount: parseNonNegativeInt(state.runCount, 0),
        skillCursor: parseNonNegativeInt(state.skillCursor, 0),
        capabilityCursor: parseNonNegativeInt(state.capabilityCursor, 0),
        successfulSkillIds: Array.isArray(state.successfulSkillIds)
            ? [...new Set(state.successfulSkillIds.map((value) => toSkillId(value)).filter(Boolean))].sort((a, b) => a - b)
            : [],
        successfulCapabilityIds: Array.isArray(state.successfulCapabilityIds)
            ? [...new Set(state.successfulCapabilityIds.map((value) => normalizeCapabilityId(value)).filter(Boolean))].sort()
            : [],
        failedSkillIds: Array.isArray(state.failedSkillIds)
            ? [...new Set(state.failedSkillIds.map((value) => toSkillId(value)).filter(Boolean))].sort((a, b) => a - b)
            : [],
        failedCapabilityIds: Array.isArray(state.failedCapabilityIds)
            ? [...new Set(state.failedCapabilityIds.map((value) => normalizeCapabilityId(value)).filter(Boolean))].sort()
            : [],
        skillExecutionStats: normalizeSkillExecutionStats(state.skillExecutionStats),
        capabilityExecutionStats: normalizeCapabilityExecutionStats(state.capabilityExecutionStats),
        policyExecutionStats: normalizePolicyExecutionStats(state.policyExecutionStats),
        windowPolicyExecutionStats: normalizeWindowPolicyExecutionStats(state.windowPolicyExecutionStats),
        contextualBanditModels: normalizeContextualBanditModels(state.contextualBanditModels),
        updatedAt: Number.isFinite(Number(state.updatedAt)) ? Number(state.updatedAt) : null
    };
}

export function loadAutonomousState(statePath) {
    if (!statePath || typeof statePath !== 'string') {
        return normalizeState();
    }
    const resolved = path.resolve(statePath);
    if (!fs.existsSync(resolved)) {
        return normalizeState();
    }

    try {
        const parsed = JSON.parse(fs.readFileSync(resolved, 'utf8'));
        return normalizeState(parsed);
    } catch {
        return normalizeState();
    }
}

export function saveAutonomousState(statePath, statePayload) {
    if (!statePath || typeof statePath !== 'string') {
        throw new Error('statePath is required');
    }
    const resolved = path.resolve(statePath);
    fs.mkdirSync(path.dirname(resolved), { recursive: true });
    fs.writeFileSync(resolved, `${JSON.stringify(normalizeState(statePayload), null, 2)}\n`);
}

export function loadCapabilityCatalog(repoRoot = detectOpenClawRepoRoot(process.cwd())) {
    const resolvedRoot = path.resolve(repoRoot);
    const entrypointPath = path.join(resolvedRoot, 'swarm-protocol', 'capabilities.ts');
    if (!fs.existsSync(entrypointPath)) {
        throw new Error(`Capability entrypoint not found: ${entrypointPath}`);
    }

    const content = fs.readFileSync(entrypointPath, 'utf8');
    const pattern = /^export \* from '\.\/src\/([^']+)\.js';$/gm;
    const moduleIds = [];
    let match;

    while ((match = pattern.exec(content)) !== null) {
        moduleIds.push(match[1]);
    }

    const capabilityIds = [...new Set(moduleIds
        .map((moduleId) => normalizeCapabilityId(moduleId.replace(/-/g, '_')))
        .filter(Boolean)
    )].sort();

    return capabilityIds;
}

export function loadExternalSkillCatalog(catalogPath) {
    if (!catalogPath || typeof catalogPath !== 'string') {
        throw new Error('catalogPath is required');
    }
    const resolvedPath = path.resolve(catalogPath);
    if (!fs.existsSync(resolvedPath)) {
        throw new Error(`Skill catalog file not found: ${resolvedPath}`);
    }

    const content = fs.readFileSync(resolvedPath, 'utf8');
    const lines = content.split('\n');
    const entries = [];
    const byId = new Map();

    let lastEntry = null;
    for (const line of lines) {
        const skillMatch = line.match(/^\d+\.\s+\[SK-(\d{5})\]\s+(.+?)\s*$/);
        if (skillMatch) {
            const id = Number(skillMatch[1]);
            const title = skillMatch[2].trim();
            if (Number.isInteger(id) && id > 0 && title) {
                const existing = byId.get(id);
                if (!existing) {
                    const entry = {
                        id,
                        code: `SK-${String(id).padStart(5, '0')}`,
                        name: `external-skill-${String(id).padStart(5, '0')}`,
                        title,
                        reason: '',
                        source: resolvedPath
                    };
                    entries.push(entry);
                    byId.set(id, entry);
                    lastEntry = entry;
                } else {
                    lastEntry = existing;
                }
            } else {
                lastEntry = null;
            }
            continue;
        }

        const reasonMatch = line.match(/^\s*Reason:\s*(.+)\s*$/i);
        if (reasonMatch && lastEntry) {
            lastEntry.reason = reasonMatch[1].trim();
        }
    }

    if (entries.length === 0) {
        throw new Error(`No skill entries found in catalog: ${resolvedPath}`);
    }

    entries.sort((a, b) => a.id - b.id);
    return entries;
}

function loadSkillCatalogSource({
    repoRoot,
    skillCatalogPath = null
}) {
    if (skillCatalogPath && typeof skillCatalogPath === 'string') {
        return {
            source: 'external',
            sourcePath: path.resolve(skillCatalogPath),
            entries: loadExternalSkillCatalog(skillCatalogPath)
        };
    }

    return {
        source: 'manifest',
        sourcePath: path.join(path.resolve(repoRoot), 'skills', 'generated', 'skills.manifest.json'),
        entries: loadSkillManifest(repoRoot)
    };
}

function computeCoverageSummary(catalogIds, successfulIds = [], failedIds = []) {
    const catalogSet = new Set((Array.isArray(catalogIds) ? catalogIds : []).map((value) => String(value)));
    const successfulSet = new Set((Array.isArray(successfulIds) ? successfulIds : []).map((value) => String(value)));
    const failedSet = new Set((Array.isArray(failedIds) ? failedIds : []).map((value) => String(value)));

    let successful = 0;
    let failed = 0;
    for (const id of catalogSet) {
        if (successfulSet.has(id)) successful++;
        else if (failedSet.has(id)) failed++;
    }

    const total = catalogSet.size;
    const pending = Math.max(0, total - successful - failed);

    return {
        total,
        successful,
        failed,
        pending,
        coverage: total > 0 ? Number((successful / total).toFixed(4)) : 1
    };
}

function buildSkillInput(skillId, waveIndex, nowMs) {
    const seed = makeDeterministicSeed(`${skillId}:${waveIndex}:${Math.floor(nowMs / 1000)}`);
    return {
        signalQuality: pseudoInRange(seed, 0, 52, 96),
        evidenceCoverage: pseudoInRange(seed, 1, 48, 94),
        confidenceHealth: pseudoInRange(seed, 2, 46, 92),
        operationalReadiness: pseudoInRange(seed, 3, 45, 91),
        harmPotential: pseudoInRange(seed, 4, 10, 65),
        resourcePressure: pseudoInRange(seed, 5, 12, 70),
        urgency: pseudoInRange(seed, 6, 35, 88),
        impactPotential: pseudoInRange(seed, 7, 50, 96),
        humanApprovalLatency: pseudoInRange(seed, 8, 5, 60)
    };
}

function buildCapabilityInput(capabilityId, waveIndex, nowMs) {
    const seed = makeDeterministicSeed(`${capabilityId}:${waveIndex}:${Math.floor(nowMs / 1000)}`);
    const entity = {
        entityId: `${capabilityId}-entity-${waveIndex + 1}`,
        name: `${capabilityId.replace(/_/g, ' ')} entity`,
        demand: pseudoInRange(seed, 0, 45, 92),
        capacity: pseudoInRange(seed, 1, 35, 85),
        risk: pseudoInRange(seed, 2, 20, 88),
        impact: pseudoInRange(seed, 3, 55, 98),
        readiness: pseudoInRange(seed, 4, 30, 85),
        resilience: pseudoInRange(seed, 5, 34, 87),
        equity: pseudoInRange(seed, 6, 40, 92),
        efficiency: pseudoInRange(seed, 7, 40, 90),
        quality: pseudoInRange(seed, 8, 45, 94),
        trust: pseudoInRange(seed, 9, 35, 92),
        opportunity: pseudoInRange(seed, 10, 45, 95),
        criticality: pseudoInRange(seed, 11, 45, 96)
    };

    return {
        entities: [entity],
        contexts: [
            {
                contextId: `${capabilityId}-context-${waveIndex + 1}`,
                ...entity
            }
        ],
        hypotheses: [
            {
                id: `${capabilityId}-hypothesis-${waveIndex + 1}`,
                statement: `Hypothesis for ${capabilityId}`,
                priorConfidence: Number((pseudoInRange(seed, 12, 35, 75) / 100).toFixed(2)),
                supportSignals: ['readiness_attention', 'incident'],
                contradictSignals: ['readiness_blocked'],
                criticality: 'normal'
            }
        ],
        capacity: {
            executionSlots: pseudoInRange(seed, 13, 2, 8),
            analysisHours: pseudoInRange(seed, 14, 40, 120),
            reviewHours: pseudoInRange(seed, 15, 20, 60)
        },
        readinessReport: {
            status: entity.readiness < 45 ? 'blocked' : entity.readiness < 65 ? 'needs_attention' : 'ready'
        },
        driftReport: {
            alerts: entity.risk > 65
                ? [{ id: `${capabilityId}-drift`, code: 'drift_alert', priority: entity.risk > 80 ? 'P1' : 'P2' }]
                : []
        },
        incidents: entity.risk > 75
            ? [{ id: `${capabilityId}-incident`, code: 'incident', priority: 'P1' }]
            : []
    };
}

function computeFailureCooldownWindow(stat, baseCooldownWaves, scopeKey = '') {
    const normalized = normalizeExecutionStat(stat);
    const baseCooldown = normalizeFailureCooldownWaves(baseCooldownWaves, 0);
    if (baseCooldown <= 0) return 0;
    const streak = parseNonNegativeInt(normalized.consecutiveFailures, 0);
    if (streak < FAILURE_COOLDOWN_MIN_STREAK) return 0;

    const backoffSteps = Math.min(
        MAX_FAILURE_COOLDOWN_BACKOFF_STEPS,
        Math.max(0, streak - FAILURE_COOLDOWN_MIN_STREAK)
    );
    const rawCooldown = baseCooldown * Math.pow(FAILURE_COOLDOWN_BACKOFF_MULTIPLIER, backoffSteps);
    // Jitter spreads retries for similarly failing candidates without random drift.
    const jitterSeed = makeDeterministicSeed(`${scopeKey}:${normalized.lastWave || 0}:${streak}`);
    const jitter = 0.85 + (0.3 * pseudoRatio(jitterSeed, 0));
    const jitteredCooldown = Math.max(baseCooldown, Math.ceil(rawCooldown * jitter));

    return clamp(
        jitteredCooldown,
        baseCooldown,
        MAX_EFFECTIVE_FAILURE_COOLDOWN_WAVES
    );
}

function isInFailureCooldown(stat, currentWave, cooldownWaves, scopeKey = '') {
    if (!stat || typeof stat !== 'object') return false;
    const normalized = normalizeExecutionStat(stat);
    const cooldownWindow = computeFailureCooldownWindow(normalized, cooldownWaves, scopeKey);
    if (cooldownWindow <= 0) return false;
    const lastWave = parseNonNegativeInt(normalized.lastWave, 0);
    if (lastWave <= 0) return false;
    return (currentWave - lastWave) < cooldownWindow;
}

function computeRecencyDecay(wavesAgo, halfLifeWaves) {
    if (wavesAgo <= 0) return 1;
    return Math.pow(0.5, wavesAgo / halfLifeWaves);
}

function computeAdaptiveAdjustments(stat, currentWave, adaptiveScoreConfig) {
    const normalized = normalizeExecutionStat(stat);
    const adaptive = normalizeAdaptiveScoreConfig(adaptiveScoreConfig);
    const lastWave = parseNonNegativeInt(normalized.lastWave, 0);
    const wavesAgo = lastWave > 0 && currentWave > 0
        ? Math.max(0, currentWave - lastWave)
        : 0;
    const failurePenalty = normalized.consecutiveFailures >= FAILURE_COOLDOWN_MIN_STREAK
        ? Math.min(0.45, normalized.consecutiveFailures * 0.08)
        : 0;

    let recentOutcomeBonus = 0;
    if (wavesAgo >= 0 && normalized.lastStatus) {
        const decay = computeRecencyDecay(wavesAgo, adaptive.recentOutcomeHalfLifeWaves);
        if (SUCCESS_STATUSES.has(normalized.lastStatus)) {
            recentOutcomeBonus = adaptive.recentOutcomeWeight * decay;
        } else if (TERMINAL_STATUSES.has(normalized.lastStatus)) {
            recentOutcomeBonus = -adaptive.recentOutcomeWeight * decay;
        }
    }

    const staleBoost = lastWave > 0 && currentWave > lastWave
        ? Math.min(adaptive.maxStaleBoost, wavesAgo * adaptive.staleWaveBoost)
        : 0;

    return {
        failurePenalty,
        recentOutcomeBonus,
        staleBoost
    };
}

function summarizeOutcomeStats(outcomes = [], fallbackStat = null, selectionPolicyConfig = null) {
    const normalizedFallback = normalizeExecutionStat(fallbackStat);
    const normalizedOutcomes = Array.isArray(outcomes)
        ? outcomes.map((entry) => normalizeRecentOutcomeEntry(entry))
        : [];
    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const useDiscounting = DISCOUNTED_POLICY_MODES.has(policy.mode);

    if (normalizedOutcomes.length <= 0) {
        return {
            attempts: normalizedFallback.attempts,
            successes: normalizedFallback.successes,
            failures: normalizedFallback.failures,
            lastStatus: normalizedFallback.lastStatus,
            lastWave: normalizedFallback.lastWave,
            consecutiveFailures: normalizedFallback.consecutiveFailures
        };
    }

    let attempts = 0;
    let successes = 0;
    for (let index = 0; index < normalizedOutcomes.length; index++) {
        const entry = normalizedOutcomes[index];
        const age = normalizedOutcomes.length - 1 - index;
        const weight = useDiscounting ? Math.pow(policy.discountFactor, age) : 1;
        attempts += weight;
        successes += entry.reward * weight;
    }

    let consecutiveFailures = 0;
    for (let index = normalizedOutcomes.length - 1; index >= 0; index--) {
        if (SUCCESS_STATUSES.has(normalizedOutcomes[index].status)) break;
        consecutiveFailures += 1;
    }

    const lastEntry = normalizedOutcomes[normalizedOutcomes.length - 1];
    return {
        attempts,
        successes,
        failures: Math.max(0, attempts - successes),
        lastStatus: lastEntry.status || normalizedFallback.lastStatus,
        lastWave: lastEntry.wave > 0 ? lastEntry.wave : normalizedFallback.lastWave,
        consecutiveFailures
    };
}

function computeWindowedStats(stat, selectionPolicyConfig) {
    const normalized = normalizeExecutionStat(stat);
    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const window = normalized.recentOutcomes.slice(-policy.slidingWindowSize);
    return summarizeOutcomeStats(window, normalized, {
        ...policy,
        mode: 'sw_ucb'
    });
}

function computeDiscountedStats(stat, selectionPolicyConfig) {
    const normalized = normalizeExecutionStat(stat);
    const outcomes = normalized.recentOutcomes;
    return summarizeOutcomeStats(outcomes, normalized, selectionPolicyConfig);
}

function computeRestartedExp3Stats(stat, selectionPolicyConfig, currentWave = 0) {
    const normalized = normalizeExecutionStat(stat);
    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const wave = parseNonNegativeInt(currentWave, 0);
    if (wave <= 0) return normalized;

    const restartInterval = parsePositiveInt(policy.exp3RestartInterval, DEFAULT_EXP3_RESTART_INTERVAL);
    const epochStartWave = wave - ((wave - 1) % restartInterval);
    const effective = normalized.recentOutcomes.filter((entry) => {
        const outcome = normalizeRecentOutcomeEntry(entry);
        return outcome.wave >= epochStartWave;
    });

    return summarizeOutcomeStats(effective, normalized, {
        mode: 'rexp3_ix'
    });
}

function computeAdaptiveHybridWindowWeight({
    outcomes = [],
    windowedAttempts = 0,
    discountedAttempts = 0,
    selectionPolicyConfig = null
}) {
    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const normalizedOutcomes = Array.isArray(outcomes)
        ? outcomes.map((entry) => normalizeRecentOutcomeEntry(entry))
        : [];
    if (normalizedOutcomes.length < 2) return 0.5;

    const recent = normalizedOutcomes.slice(-Math.max(2, policy.slidingWindowSize));
    const midpoint = Math.floor(recent.length / 2);
    if (midpoint <= 0 || midpoint >= recent.length) return 0.5;
    const older = recent.slice(0, midpoint);
    const newer = recent.slice(midpoint);
    if (older.length <= 0 || newer.length <= 0) return 0.5;

    const olderMean = older.reduce((sum, entry) => sum + entry.reward, 0) / older.length;
    const newerMean = newer.reduce((sum, entry) => sum + entry.reward, 0) / newer.length;
    const driftSignal = clamp(Math.abs(newerMean - olderMean), 0, 1);
    const windowReliability = windowedAttempts / (windowedAttempts + 4);
    const discountedReliability = discountedAttempts / (discountedAttempts + 4);
    const reliabilityTilt = (windowReliability - discountedReliability) * 0.15;

    return clamp((0.2 + (0.7 * driftSignal)) + reliabilityTilt, 0.1, 0.9);
}

function aggregateHybridPair({
    left,
    right,
    mode = DEFAULT_HYBRID_TS_AGGREGATION,
    adaptiveWeight = 0.5
}) {
    if (mode === 'min') return Math.min(left, right);
    if (mode === 'max') return Math.max(left, right);
    if (mode === 'adaptive') return (adaptiveWeight * left) + ((1 - adaptiveWeight) * right);
    return (left + right) / 2;
}

function computeHybridStats(stat, selectionPolicyConfig, windowMode, discountMode) {
    const normalized = normalizeExecutionStat(stat);
    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const windowed = computeWindowedStats(normalized, {
        ...policy,
        mode: windowMode
    });
    const discounted = computeDiscountedStats(normalized, {
        ...policy,
        mode: discountMode
    });
    const aggregationMode = policy.hybridTsAggregation;
    const adaptiveWeight = aggregationMode === 'adaptive'
        ? computeAdaptiveHybridWindowWeight({
            outcomes: normalized.recentOutcomes,
            windowedAttempts: windowed.attempts,
            discountedAttempts: discounted.attempts,
            selectionPolicyConfig: policy
        })
        : 0.5;
    const windowMean = windowed.attempts > 0 ? windowed.successes / windowed.attempts : 0.5;
    const discountedMean = discounted.attempts > 0 ? discounted.successes / discounted.attempts : 0.5;
    const attempts = Math.max(
        0,
        aggregateHybridPair({
            left: windowed.attempts,
            right: discounted.attempts,
            mode: aggregationMode,
            adaptiveWeight
        })
    );
    const successRate = aggregateHybridPair({
        left: windowMean,
        right: discountedMean,
        mode: aggregationMode,
        adaptiveWeight
    });
    const latestOutcome = normalized.recentOutcomes[normalized.recentOutcomes.length - 1] || null;

    return {
        attempts,
        successes: successRate * attempts,
        failures: Math.max(0, attempts - (successRate * attempts)),
        lastStatus: latestOutcome?.status || normalized.lastStatus,
        lastWave: latestOutcome?.wave > 0 ? latestOutcome.wave : normalized.lastWave,
        consecutiveFailures: Math.max(windowed.consecutiveFailures, discounted.consecutiveFailures)
    };
}

function computeHybridThompsonStats(stat, selectionPolicyConfig) {
    return computeHybridStats(stat, selectionPolicyConfig, 'sw_epsilon_ts', 'd_epsilon_ts');
}

function computeHybridUcbStats(stat, selectionPolicyConfig) {
    return computeHybridStats(stat, selectionPolicyConfig, 'sw_ucb', 'd_ucb');
}

function computeChangePointThompsonStats(stat, selectionPolicyConfig) {
    const normalized = normalizeExecutionStat(stat);
    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const outcomes = policy.mode === 'sw_cp_epsilon_ts'
        ? normalized.recentOutcomes.slice(-policy.slidingWindowSize)
        : normalized.recentOutcomes;
    if (outcomes.length === 0) return normalized;

    const priorMean = policy.thompsonPriorAlpha / (policy.thompsonPriorAlpha + policy.thompsonPriorBeta);
    let weightedSuccesses = 0;
    let weightedFailures = 0;

    for (const entry of outcomes) {
        const outcome = normalizeRecentOutcomeEntry(entry);
        const attempts = weightedSuccesses + weightedFailures;
        const posteriorMean = attempts > 0 ? (weightedSuccesses / attempts) : priorMean;
        const surprise = Math.abs(outcome.reward - posteriorMean);
        const hazard = clamp(
            policy.thompsonHazardRate + (surprise * policy.thompsonSurpriseSensitivity),
            policy.thompsonHazardRate,
            0.95
        );
        const retention = 1 - hazard;
        weightedSuccesses = (weightedSuccesses * retention) + outcome.reward;
        weightedFailures = (weightedFailures * retention) + (1 - outcome.reward);
    }

    let consecutiveFailures = 0;
    for (let i = outcomes.length - 1; i >= 0; i--) {
        const status = normalizeRecentOutcomeEntry(outcomes[i]).status;
        if (SUCCESS_STATUSES.has(status)) break;
        consecutiveFailures += 1;
    }
    const lastEntry = normalizeRecentOutcomeEntry(outcomes[outcomes.length - 1]);

    return {
        attempts: weightedSuccesses + weightedFailures,
        successes: weightedSuccesses,
        failures: weightedFailures,
        lastStatus: lastEntry.status || normalized.lastStatus,
        lastWave: lastEntry.wave > 0 ? lastEntry.wave : normalized.lastWave,
        consecutiveFailures
    };
}

function detectPageHinkleyChangeIndex(outcomes = [], selectionPolicyConfig = null) {
    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const values = Array.isArray(outcomes)
        ? outcomes.map((entry) => normalizeRecentOutcomeEntry(entry).reward)
        : [];
    const minSamples = parsePositiveInt(policy.changeDetectionMinSamples, DEFAULT_CD_MIN_SAMPLES);
    if (values.length < minSamples) return 0;

    let runningMean = 0;
    let upwardDeviation = 0;
    let downwardDeviation = 0;
    let changeIndex = 0;
    const detectUp = policy.changeDetectionDirection === 'up' || policy.changeDetectionDirection === 'both';
    const detectDown = policy.changeDetectionDirection === 'down' || policy.changeDetectionDirection === 'both';

    for (let i = 0; i < values.length; i++) {
        const reward = values[i];
        runningMean += (reward - runningMean) / (i + 1);
        const upwardCentered = reward - runningMean - policy.changeDetectionDelta;
        const downwardCentered = runningMean - reward - policy.changeDetectionDelta;
        upwardDeviation = Math.max(0, upwardDeviation + upwardCentered);
        downwardDeviation = Math.max(0, downwardDeviation + downwardCentered);
        const upTriggered = detectUp && upwardDeviation > policy.changeDetectionThreshold;
        const downTriggered = detectDown && downwardDeviation > policy.changeDetectionThreshold;
        if ((i + 1) >= minSamples && (upTriggered || downTriggered)) {
            changeIndex = i + 1;
            upwardDeviation = 0;
            downwardDeviation = 0;
        }
    }

    return clamp(changeIndex, 0, values.length);
}

function computeChangeDetectedStats(stat, selectionPolicyConfig) {
    const normalized = normalizeExecutionStat(stat);
    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const detectorInput = WINDOWED_CHANGE_DETECTION_POLICY_MODES.has(policy.mode)
        ? normalized.recentOutcomes.slice(-policy.slidingWindowSize)
        : normalized.recentOutcomes;
    const changeIndex = detectPageHinkleyChangeIndex(detectorInput, selectionPolicyConfig);
    const effective = changeIndex > 0
        ? detectorInput.slice(changeIndex)
        : detectorInput;
    return summarizeOutcomeStats(effective, normalized, {
        mode: 'cd_ucb'
    });
}

function detectCusumChangeIndex(outcomes = [], selectionPolicyConfig = null) {
    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const values = Array.isArray(outcomes)
        ? outcomes.map((entry) => normalizeRecentOutcomeEntry(entry).reward)
        : [];
    const minSamples = parsePositiveInt(policy.changeDetectionMinSamples, DEFAULT_CD_MIN_SAMPLES);
    if (values.length < minSamples) return 0;

    let baselineMean = 0.5;
    let positiveCusum = 0;
    let negativeCusum = 0;
    let changeIndex = 0;
    const threshold = policy.cusumThreshold;
    const baselineWeight = policy.cusumBaselineWeight;
    const detectUp = policy.changeDetectionDirection === 'up' || policy.changeDetectionDirection === 'both';
    const detectDown = policy.changeDetectionDirection === 'down' || policy.changeDetectionDirection === 'both';

    for (let i = 0; i < values.length; i++) {
        const reward = values[i];
        baselineMean = ((1 - baselineWeight) * baselineMean) + (baselineWeight * reward);
        const centered = reward - baselineMean;
        positiveCusum = Math.max(0, positiveCusum + centered);
        negativeCusum = Math.max(0, negativeCusum - centered);

        const upTriggered = detectUp && positiveCusum > threshold;
        const downTriggered = detectDown && negativeCusum > threshold;
        if ((i + 1) >= minSamples && (upTriggered || downTriggered)) {
            changeIndex = i + 1;
            positiveCusum = 0;
            negativeCusum = 0;
            baselineMean = reward;
        }
    }

    return clamp(changeIndex, 0, values.length);
}

function computeCusumDetectedStats(stat, selectionPolicyConfig) {
    const normalized = normalizeExecutionStat(stat);
    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const detectorInput = WINDOWED_CHANGE_DETECTION_POLICY_MODES.has(policy.mode)
        ? normalized.recentOutcomes.slice(-policy.slidingWindowSize)
        : normalized.recentOutcomes;
    const changeIndex = detectCusumChangeIndex(detectorInput, selectionPolicyConfig);
    const effective = changeIndex > 0
        ? detectorInput.slice(changeIndex)
        : detectorInput;
    return summarizeOutcomeStats(effective, normalized, {
        mode: 'cusum_ucb'
    });
}

function computeAdwinCutThreshold({
    leftCount,
    rightCount,
    totalCount,
    variance,
    delta
}) {
    if (leftCount <= 0 || rightCount <= 0 || totalCount <= 1) return Number.POSITIVE_INFINITY;
    const harmonic = 1 / ((1 / leftCount) + (1 / rightCount));
    const deltaPrime = clamp(delta / totalCount, Number.EPSILON, 1 - Number.EPSILON);
    const logTerm = Math.log(2 / deltaPrime);
    const varianceTerm = Math.sqrt(((2 * Math.max(0, variance)) * logTerm) / harmonic);
    const correctionTerm = (2 * logTerm) / (3 * harmonic);
    return varianceTerm + correctionTerm;
}

function detectAdwinChangeIndex(outcomes = [], selectionPolicyConfig = null) {
    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const values = Array.isArray(outcomes)
        ? outcomes.map((entry) => normalizeRecentOutcomeEntry(entry).reward)
        : [];
    return detectAdwinChangeIndexForValues({
        values,
        minSamples: policy.changeDetectionMinSamples,
        adwinDelta: policy.adwinDelta
    });
}

function detectAdwinChangeIndexForValues({
    values = [],
    minSamples = DEFAULT_CD_MIN_SAMPLES,
    adwinDelta = DEFAULT_ADWIN_DELTA
}) {
    const series = Array.isArray(values)
        ? values
            .map((value) => Number(value))
            .filter((value) => Number.isFinite(value))
            .map((value) => clamp(value, 0, 1))
        : [];
    const normalizedMinSamples = clamp(
        parsePositiveInt(minSamples, DEFAULT_CD_MIN_SAMPLES),
        2,
        MAX_CD_MIN_SAMPLES
    );
    const normalizedDelta = clamp(
        Number.isFinite(Number(adwinDelta)) ? Number(adwinDelta) : DEFAULT_ADWIN_DELTA,
        MIN_ADWIN_DELTA,
        MAX_ADWIN_DELTA
    );
    if (series.length < (2 * normalizedMinSamples)) return 0;

    const prefix = new Array(series.length + 1).fill(0);
    const prefixSquares = new Array(series.length + 1).fill(0);
    for (let i = 0; i < series.length; i++) {
        prefix[i + 1] = prefix[i] + series[i];
        prefixSquares[i + 1] = prefixSquares[i] + (series[i] * series[i]);
    }

    const totalCount = series.length;
    const totalSum = prefix[totalCount];
    const totalSquareSum = prefixSquares[totalCount];
    const windowMean = totalSum / totalCount;
    const windowVariance = Math.max(0, (totalSquareSum / totalCount) - (windowMean * windowMean));
    let changeIndex = 0;

    for (let split = normalizedMinSamples; split <= totalCount - normalizedMinSamples; split++) {
        const leftCount = split;
        const rightCount = totalCount - split;
        const leftMean = prefix[split] / leftCount;
        const rightMean = (totalSum - prefix[split]) / rightCount;
        const threshold = computeAdwinCutThreshold({
            leftCount,
            rightCount,
            totalCount,
            variance: windowVariance,
            delta: normalizedDelta
        });
        if (Math.abs(leftMean - rightMean) > threshold) {
            changeIndex = split;
        }
    }

    return clamp(changeIndex, 0, totalCount);
}

function detectAdwinObservationChangeIndex(observations = [], selectionPolicyConfig = null) {
    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const values = Array.isArray(observations)
        ? observations.map((entry) => normalizeContextualObservation(entry).reward)
        : [];
    return detectAdwinChangeIndexForValues({
        values,
        minSamples: policy.changeDetectionMinSamples,
        adwinDelta: policy.adwinDelta
    });
}

function computeAdwinDetectedStats(stat, selectionPolicyConfig) {
    const normalized = normalizeExecutionStat(stat);
    const changeIndex = detectAdwinChangeIndex(normalized.recentOutcomes, selectionPolicyConfig);
    const effective = changeIndex > 0
        ? normalized.recentOutcomes.slice(changeIndex)
        : normalized.recentOutcomes;
    return summarizeOutcomeStats(effective, normalized, {
        mode: 'adwin_ucb'
    });
}
function detectGlrKlUcbChangeIndex(outcomes = [], selectionPolicyConfig = null) {
    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const values = Array.isArray(outcomes)
        ? outcomes.map((entry) => normalizeRecentOutcomeEntry(entry).reward)
        : [];
    const minSamples = parsePositiveInt(policy.changeDetectionMinSamples, DEFAULT_CD_MIN_SAMPLES);
    if (values.length < (2 * minSamples)) return 0;

    const totalCount = values.length;
    const prefix = new Array(totalCount + 1).fill(0);
    for (let i = 0; i < totalCount; i++) {
        prefix[i + 1] = prefix[i] + values[i];
    }

    const detectUp = policy.changeDetectionDirection === 'up' || policy.changeDetectionDirection === 'both';
    const detectDown = policy.changeDetectionDirection === 'down' || policy.changeDetectionDirection === 'both';
    const delta = Math.max(Number.EPSILON, policy.changeDetectionDelta);
    const baseThreshold = policy.changeDetectionThreshold
        * (Math.log(Math.max(2, totalCount)) + Math.log(1 / delta));

    let changeIndex = 0;
    for (let split = minSamples; split <= totalCount - minSamples; split++) {
        const leftCount = split;
        const rightCount = totalCount - split;
        const leftSum = prefix[split];
        const rightSum = prefix[totalCount] - leftSum;
        const leftMean = leftSum / leftCount;
        const rightMean = rightSum / rightCount;

        const upShift = rightMean > leftMean;
        const downShift = rightMean < leftMean;
        const directionAllowed = (detectUp && upShift) || (detectDown && downShift);
        if (!directionAllowed) continue;

        const pooledMean = (leftSum + rightSum) / totalCount;
        const glrStatistic = (
            leftCount * computeBernoulliKlDivergence(leftMean, pooledMean)
        ) + (
            rightCount * computeBernoulliKlDivergence(rightMean, pooledMean)
        );
        if (glrStatistic > baseThreshold) {
            changeIndex = split;
        }
    }

    return clamp(changeIndex, 0, totalCount);
}

function computeGlrDetectedStats(stat, selectionPolicyConfig) {
    const normalized = normalizeExecutionStat(stat);
    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const detectorInput = WINDOWED_GLR_KL_UCB_POLICY_MODES.has(policy.mode)
        ? normalized.recentOutcomes.slice(-policy.slidingWindowSize)
        : normalized.recentOutcomes;
    const changeIndex = detectGlrKlUcbChangeIndex(detectorInput, policy);
    const effective = changeIndex > 0
        ? detectorInput.slice(changeIndex)
        : detectorInput;
    return summarizeOutcomeStats(effective, normalized, {
        mode: 'glr_kl_ucb'
    });
}

function mergeResolvedScoreStats(normalized, resolved) {
    return {
        ...normalized,
        attempts: resolved.attempts,
        successes: resolved.successes,
        failures: resolved.failures,
        lastStatus: resolved.lastStatus,
        lastWave: resolved.lastWave,
        consecutiveFailures: resolved.consecutiveFailures
    };
}

function resolveScoreStats(stat, selectionPolicyConfig, currentWave = 0) {
    const normalized = normalizeExecutionStat(stat);
    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    if (RESTARTED_EXP3_POLICY_MODES.has(policy.mode)) {
        return mergeResolvedScoreStats(
            normalized,
            computeRestartedExp3Stats(normalized, policy, currentWave)
        );
    }
    if (CHANGEPOINT_THOMPSON_POLICY_MODES.has(policy.mode)) {
        return mergeResolvedScoreStats(
            normalized,
            computeChangePointThompsonStats(normalized, policy)
        );
    }
    if (ADWIN_POLICY_MODES.has(policy.mode)) {
        return mergeResolvedScoreStats(
            normalized,
            computeAdwinDetectedStats(normalized, policy)
        );
    }
    if (GLR_KL_UCB_POLICY_MODES.has(policy.mode)) {
        return mergeResolvedScoreStats(
            normalized,
            computeGlrDetectedStats(normalized, policy)
        );
    }
    if (SLIDING_WINDOW_POLICY_MODES.has(policy.mode)) {
        return mergeResolvedScoreStats(
            normalized,
            computeWindowedStats(normalized, policy)
        );
    }
    if (DISCOUNTED_POLICY_MODES.has(policy.mode)) {
        return mergeResolvedScoreStats(
            normalized,
            computeDiscountedStats(normalized, policy)
        );
    }
    if (HYBRID_THOMPSON_POLICY_MODES.has(policy.mode)) {
        return mergeResolvedScoreStats(
            normalized,
            computeHybridThompsonStats(normalized, policy)
        );
    }
    if (HYBRID_UCB_POLICY_MODES.has(policy.mode)) {
        return mergeResolvedScoreStats(
            normalized,
            computeHybridUcbStats(normalized, policy)
        );
    }
    if (PAGE_HINKLEY_POLICY_MODES.has(policy.mode)) {
        return mergeResolvedScoreStats(
            normalized,
            computeChangeDetectedStats(normalized, policy)
        );
    }
    if (CUSUM_POLICY_MODES.has(policy.mode)) {
        return mergeResolvedScoreStats(
            normalized,
            computeCusumDetectedStats(normalized, policy)
        );
    }
    return normalized;
}

function invertMatrix(matrix) {
    const size = Array.isArray(matrix) ? matrix.length : 0;
    if (size <= 0) return null;
    const augmented = matrix.map((row, rowIndex) => {
        const left = normalizeNumericVector(row, size, 0);
        const right = new Array(size).fill(0);
        right[rowIndex] = 1;
        return [...left, ...right];
    });

    for (let pivot = 0; pivot < size; pivot++) {
        let pivotRow = pivot;
        let pivotValue = Math.abs(augmented[pivot][pivot]);
        for (let row = pivot + 1; row < size; row++) {
            const candidate = Math.abs(augmented[row][pivot]);
            if (candidate > pivotValue) {
                pivotValue = candidate;
                pivotRow = row;
            }
        }
        if (pivotValue <= Number.EPSILON) return null;
        if (pivotRow !== pivot) {
            const temp = augmented[pivot];
            augmented[pivot] = augmented[pivotRow];
            augmented[pivotRow] = temp;
        }
        const divisor = augmented[pivot][pivot];
        for (let col = 0; col < (size * 2); col++) {
            augmented[pivot][col] /= divisor;
        }
        for (let row = 0; row < size; row++) {
            if (row === pivot) continue;
            const factor = augmented[row][pivot];
            if (factor === 0) continue;
            for (let col = 0; col < (size * 2); col++) {
                augmented[row][col] -= factor * augmented[pivot][col];
            }
        }
    }

    return augmented.map((row) => row.slice(size));
}

function multiplyMatrixVector(matrix, vector) {
    const rows = Array.isArray(matrix) ? matrix : [];
    const values = Array.isArray(vector) ? vector : [];
    return rows.map((row) => {
        const normalizedRow = normalizeNumericVector(row, values.length, 0);
        let sum = 0;
        for (let i = 0; i < values.length; i++) {
            sum += normalizedRow[i] * values[i];
        }
        return sum;
    });
}

function dotProduct(left, right) {
    const l = Array.isArray(left) ? left : [];
    const r = Array.isArray(right) ? right : [];
    const size = Math.min(l.length, r.length);
    let total = 0;
    for (let i = 0; i < size; i++) {
        total += l[i] * r[i];
    }
    return total;
}

function choleskyDecomposition(matrix) {
    const size = Array.isArray(matrix) ? matrix.length : 0;
    if (size <= 0) return null;
    const lower = [];
    for (let row = 0; row < size; row++) {
        lower[row] = new Array(size).fill(0);
    }

    for (let row = 0; row < size; row++) {
        for (let col = 0; col <= row; col++) {
            let sum = matrix[row][col] || 0;
            for (let k = 0; k < col; k++) {
                sum -= lower[row][k] * lower[col][k];
            }
            if (row === col) {
                if (sum <= Number.EPSILON) return null;
                lower[row][col] = Math.sqrt(sum);
            } else {
                if (Math.abs(lower[col][col]) <= Number.EPSILON) return null;
                lower[row][col] = sum / lower[col][col];
            }
        }
    }

    return lower;
}

function multiplyLowerTriangularVector(lower, vector) {
    const size = Array.isArray(lower) ? lower.length : 0;
    const values = normalizeNumericVector(vector, size, 0);
    const result = new Array(size).fill(0);
    for (let row = 0; row < size; row++) {
        let sum = 0;
        for (let col = 0; col <= row; col++) {
            sum += (lower[row][col] || 0) * values[col];
        }
        result[row] = sum;
    }
    return result;
}

function computeSelectionFeatureVector(stat, currentWave) {
    const normalized = normalizeExecutionStat(stat);
    const attempts = Math.max(0, normalized.attempts);
    const successes = Math.max(0, normalized.successes);
    const failures = Math.max(0, normalized.failures);
    const lastWave = parseNonNegativeInt(normalized.lastWave, 0);
    const wavesSinceAttempt = currentWave > 0 && lastWave > 0
        ? Math.max(0, currentWave - lastWave)
        : currentWave > 0 && attempts <= 0 ? currentWave : 0;
    const successRate = attempts > 0 ? successes / attempts : 0.5;
    const failureRate = attempts > 0 ? failures / attempts : 0.5;
    const failureStreak = attempts > 0
        ? Math.min(1, normalized.consecutiveFailures / Math.max(1, attempts))
        : 0;
    const novelty = attempts > 0 ? 0 : 1;
    const staleness = Math.min(1, wavesSinceAttempt / 12);
    return [
        1,
        successRate,
        failureRate,
        failureStreak,
        novelty,
        staleness
    ];
}

function computeLinUcbScore({
    stat,
    currentWave,
    adaptiveScoreConfig,
    selectionPolicyConfig,
    contextualBanditModel
}) {
    const normalizedStat = resolveScoreStats(stat, selectionPolicyConfig);
    const normalizedPolicy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const normalizedModel = resolveContextualModelForScoring(contextualBanditModel, normalizedPolicy);
    const featureVector = computeSelectionFeatureVector(normalizedStat, currentWave);
    const inverse = invertMatrix(normalizedModel.matrixA);
    if (!inverse) {
        return {
            score: Number.NEGATIVE_INFINITY,
            featureVector
        };
    }
    const theta = multiplyMatrixVector(inverse, normalizedModel.vectorB);
    const expectedReward = dotProduct(theta, featureVector);
    const projected = multiplyMatrixVector(inverse, featureVector);
    const uncertainty = Math.sqrt(Math.max(0, dotProduct(featureVector, projected)));
    const adjustments = computeAdaptiveAdjustments(normalizedStat, currentWave, adaptiveScoreConfig);
    const score = expectedReward
        + (normalizedPolicy.linucbAlpha * uncertainty)
        - adjustments.failurePenalty
        + adjustments.recentOutcomeBonus
        + adjustments.staleBoost;
    return {
        score,
        featureVector
    };
}

function computeLinearThompsonScore({
    stat,
    currentWave,
    adaptiveScoreConfig,
    selectionPolicyConfig,
    contextualBanditModel,
    seedText
}) {
    const normalizedStat = resolveScoreStats(stat, selectionPolicyConfig);
    const normalizedPolicy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const normalizedModel = resolveContextualModelForScoring(contextualBanditModel, normalizedPolicy);
    const featureVector = computeSelectionFeatureVector(normalizedStat, currentWave);
    const inverse = invertMatrix(normalizedModel.matrixA);
    if (!inverse) {
        return {
            score: Number.NEGATIVE_INFINITY,
            featureVector
        };
    }
    const thetaMean = multiplyMatrixVector(inverse, normalizedModel.vectorB);
    const covarianceScale = normalizedPolicy.lintsAlpha * normalizedPolicy.lintsAlpha;
    const covariance = inverse.map((row) => row.map((value) => value * covarianceScale));
    let lower = choleskyDecomposition(covariance);
    if (!lower) {
        const jittered = covariance.map((row, rowIndex) => row.map((value, colIndex) => {
            if (rowIndex !== colIndex) return value;
            return value + 1e-8;
        }));
        lower = choleskyDecomposition(jittered);
    }
    const rng = createDeterministicRng(seedText);
    const noise = new Array(thetaMean.length).fill(0).map(() => sampleStandardNormal(rng));
    const sampledTheta = lower
        ? (() => {
            const projectedNoise = multiplyLowerTriangularVector(lower, noise);
            return thetaMean.map((value, index) => value + projectedNoise[index]);
        })()
        : thetaMean;
    const sampledReward = dotProduct(sampledTheta, featureVector);
    const adjustments = computeAdaptiveAdjustments(normalizedStat, currentWave, adaptiveScoreConfig);
    const score = sampledReward
        - adjustments.failurePenalty
        + adjustments.recentOutcomeBonus
        + adjustments.staleBoost;
    return {
        score,
        featureVector
    };
}

function computeUcbScore(stat, totalAttempts, currentWave, adaptiveScoreConfig, selectionPolicyConfig = null) {
    const normalized = resolveScoreStats(stat, selectionPolicyConfig);
    if (normalized.attempts <= 0) {
        return Number.POSITIVE_INFINITY;
    }

    const smoothedMean = (normalized.successes + 1) / (normalized.attempts + 2);
    const exploration = Math.sqrt((2 * Math.log(Math.max(1, totalAttempts))) / normalized.attempts);
    const adjustments = computeAdaptiveAdjustments(normalized, currentWave, adaptiveScoreConfig);

    return smoothedMean
        + exploration
        - adjustments.failurePenalty
        + adjustments.recentOutcomeBonus
        + adjustments.staleBoost;
}

function computeMultiWindowUcbScore(stat, totalAttempts, currentWave, adaptiveScoreConfig, selectionPolicyConfig = null) {
    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    let bestScore = Number.NEGATIVE_INFINITY;
    for (const windowSize of policy.multiWindowSizes) {
        const score = computeUcbScore(
            stat,
            totalAttempts,
            currentWave,
            adaptiveScoreConfig,
            {
                ...policy,
                mode: 'sw_ucb',
                slidingWindowSize: windowSize
            }
        );
        if (score > bestScore) {
            bestScore = score;
        }
    }
    return bestScore;
}

function resolveBobWindowDistribution(windowPolicyExecutionStats = {}, selectionPolicyConfig = null) {
    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const candidates = normalizeMultiWindowSizes(policy.multiWindowSizes);
    if (candidates.length <= 0) {
        return [{
            windowSize: DEFAULT_SLIDING_WINDOW_SIZE,
            probability: 1
        }];
    }

    const laneStats = windowPolicyExecutionStats && typeof windowPolicyExecutionStats === 'object'
        ? windowPolicyExecutionStats
        : {};
    const parsedStats = candidates.map((windowSize) => ({
        windowSize,
        stat: normalizePolicyPerformanceStat(laneStats[String(windowSize)])
    }));
    const totalMetaAttempts = Math.max(
        1,
        parsedStats.reduce((sum, entry) => sum + entry.stat.attempts, 0)
    );
    const scores = parsedStats.map(({ stat }) => {
        const rewardRate = (stat.cumulativeReward + 1) / (stat.attempts + 2);
        const exploration = Math.sqrt((2 * Math.log(totalMetaAttempts + 1)) / (stat.attempts + 1));
        return rewardRate + exploration;
    });
    const maxScore = Math.max(...scores);
    const expScores = scores.map((score) => Math.exp(clamp(score - maxScore, -50, 50)));
    const expTotal = expScores.reduce((sum, value) => sum + value, 0);
    const softmax = expTotal > 0
        ? expScores.map((value) => value / expTotal)
        : new Array(candidates.length).fill(1 / candidates.length);
    const floor = policy.bobGamma / candidates.length;

    return candidates.map((windowSize, index) => ({
        windowSize,
        probability: ((1 - policy.bobGamma) * softmax[index]) + floor
    }));
}

function computeUcbTunedScore(stat, totalAttempts, currentWave, adaptiveScoreConfig, selectionPolicyConfig = null) {
    const normalized = resolveScoreStats(stat, selectionPolicyConfig);
    if (normalized.attempts <= 0) {
        return Number.POSITIVE_INFINITY;
    }

    const horizon = Math.max(2, totalAttempts + 1);
    const empiricalMean = normalized.successes / normalized.attempts;
    const empiricalVariance = clamp(empiricalMean * (1 - empiricalMean), 0, 0.25);
    const varianceInflation = Math.sqrt((2 * Math.log(horizon)) / normalized.attempts);
    const tunedVariance = Math.min(0.25, empiricalVariance + varianceInflation);
    const exploration = Math.sqrt((Math.log(horizon) / normalized.attempts) * tunedVariance);
    const adjustments = computeAdaptiveAdjustments(normalized, currentWave, adaptiveScoreConfig);

    return empiricalMean
        + exploration
        - adjustments.failurePenalty
        + adjustments.recentOutcomeBonus
        + adjustments.staleBoost;
}

function computeUcbVarianceScore(stat, totalAttempts, currentWave, adaptiveScoreConfig, selectionPolicyConfig = null) {
    const normalized = resolveScoreStats(stat, selectionPolicyConfig);
    if (normalized.attempts <= 0) {
        return Number.POSITIVE_INFINITY;
    }

    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const empiricalMean = normalized.successes / normalized.attempts;
    const empiricalVariance = clamp(empiricalMean * (1 - empiricalMean), 0, 0.25);
    const horizon = Math.max(2, totalAttempts + 1);
    const logTerm = Math.log(horizon);
    const exploration = Math.sqrt(
        (2 * policy.ucbVExploration * empiricalVariance * logTerm) / normalized.attempts
    ) + ((3 * policy.ucbVExploration * logTerm) / normalized.attempts);
    const adjustments = computeAdaptiveAdjustments(normalized, currentWave, adaptiveScoreConfig);

    return empiricalMean
        + exploration
        - adjustments.failurePenalty
        + adjustments.recentOutcomeBonus
        + adjustments.staleBoost;
}

function resolveRiskAwareOutcomes(stat, selectionPolicyConfig = null) {
    const normalized = normalizeExecutionStat(stat);
    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    if (policy.mode === 'sw_mv_ucb') {
        return normalized.recentOutcomes.slice(-policy.slidingWindowSize);
    }
    return normalized.recentOutcomes;
}

function computeRewardVariance(outcomes, selectionPolicyConfig, fallbackMean) {
    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const normalizedOutcomes = Array.isArray(outcomes)
        ? outcomes.map((entry) => normalizeRecentOutcomeEntry(entry))
        : [];
    if (normalizedOutcomes.length <= 0) {
        return clamp((fallbackMean || 0) * (1 - (fallbackMean || 0)), 0, 0.25);
    }

    const useDiscounting = policy.mode === 'd_mv_ucb';
    let weightSum = 0;
    let weightedSum = 0;
    let weightedSquareSum = 0;
    for (let index = 0; index < normalizedOutcomes.length; index++) {
        const entry = normalizedOutcomes[index];
        const age = normalizedOutcomes.length - 1 - index;
        const weight = useDiscounting ? Math.pow(policy.discountFactor, age) : 1;
        weightSum += weight;
        weightedSum += entry.reward * weight;
        weightedSquareSum += (entry.reward * entry.reward) * weight;
    }
    if (weightSum <= Number.EPSILON) {
        return clamp((fallbackMean || 0) * (1 - (fallbackMean || 0)), 0, 0.25);
    }

    const mean = weightedSum / weightSum;
    return Math.max(0, (weightedSquareSum / weightSum) - (mean * mean));
}

function computeMeanVarianceUcbScore(stat, totalAttempts, currentWave, adaptiveScoreConfig, selectionPolicyConfig = null) {
    const normalized = resolveScoreStats(stat, selectionPolicyConfig);
    if (normalized.attempts <= 0) {
        return Number.POSITIVE_INFINITY;
    }

    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const attempts = Math.max(1, normalized.attempts);
    const empiricalMean = clamp(normalized.successes / attempts, 0, 1);
    const outcomes = resolveRiskAwareOutcomes(stat, policy);
    const outcomeVariance = computeRewardVariance(outcomes, policy, empiricalMean);
    const exploration = Math.sqrt((2 * Math.log(Math.max(2, totalAttempts + 1))) / attempts);
    const adjustments = computeAdaptiveAdjustments(normalized, currentWave, adaptiveScoreConfig);

    return empiricalMean
        - (policy.riskVarianceWeight * outcomeVariance)
        + exploration
        - adjustments.failurePenalty
        + adjustments.recentOutcomeBonus
        + adjustments.staleBoost;
}

function computeBernoulliKlDivergence(p, q) {
    const epsilon = 1e-12;
    const left = clamp(p, epsilon, 1 - epsilon);
    const right = clamp(q, epsilon, 1 - epsilon);
    return (left * Math.log(left / right))
        + ((1 - left) * Math.log((1 - left) / (1 - right)));
}

function computeKlUcbIndex(empiricalMean, attempts, horizon, confidence = DEFAULT_KL_UCB_CONFIDENCE) {
    if (attempts <= 0) return Number.POSITIVE_INFINITY;
    if (empiricalMean >= 1) return 1;

    const safeMean = clamp(empiricalMean, 0, 1);
    const safeHorizon = Math.max(2, horizon);
    const safeAttempts = Math.max(1, attempts);
    const bound = (
        Math.log(safeHorizon)
        + (confidence * Math.log(Math.max(1, Math.log(safeHorizon))))
    ) / safeAttempts;

    let low = safeMean;
    let high = 1;
    for (let i = 0; i < 28; i++) {
        const mid = (low + high) / 2;
        const divergence = computeBernoulliKlDivergence(safeMean, mid);
        if (divergence > bound) {
            high = mid;
        } else {
            low = mid;
        }
    }
    return low;
}

function createDeterministicRng(seedText) {
    const seed = makeDeterministicSeed(seedText);
    let offset = 0;
    return () => {
        const ratio = pseudoRatio(seed, offset++);
        if (ratio <= 0) return Number.EPSILON;
        if (ratio >= 1) return 1 - Number.EPSILON;
        return ratio;
    };
}

function sampleStandardNormal(rng) {
    const u1 = rng();
    const u2 = rng();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function sampleStandardGumbel(rng) {
    const u = clamp(rng(), Number.EPSILON, 1 - Number.EPSILON);
    return -Math.log(-Math.log(u));
}

function sampleBinomial(trials, probability, rng) {
    const n = Math.max(0, Math.floor(Number(trials) || 0));
    if (n <= 0) return 0;
    const p = clamp(Number(probability), 0, 1);
    let successes = 0;
    for (let i = 0; i < n; i++) {
        if (rng() < p) successes += 1;
    }
    return successes;
}

function sampleGamma(shape, rng) {
    if (!Number.isFinite(shape) || shape <= 0) return 0;
    if (shape < 1) {
        const u = rng();
        return sampleGamma(shape + 1, rng) * Math.pow(u, 1 / shape);
    }

    const d = shape - (1 / 3);
    const c = 1 / Math.sqrt(9 * d);
    for (let attempt = 0; attempt < 64; attempt++) {
        const x = sampleStandardNormal(rng);
        const onePlusCx = 1 + c * x;
        if (onePlusCx <= 0) continue;
        const v = onePlusCx * onePlusCx * onePlusCx;
        const u = rng();
        if (u < 1 - 0.0331 * x * x * x * x) {
            return d * v;
        }
        if (Math.log(u) < (0.5 * x * x) + d * (1 - v + Math.log(v))) {
            return d * v;
        }
    }
    return Math.max(Number.EPSILON, d);
}

function sampleBeta(alpha, beta, rng) {
    const x = sampleGamma(alpha, rng);
    const y = sampleGamma(beta, rng);
    if (x <= 0 && y <= 0) return 0.5;
    return x / (x + y);
}

function resolveBayesianPosteriorPrior(policy, bayesianMetaPrior = null) {
    const fallbackAlpha = clamp(policy.thompsonPriorAlpha, Number.EPSILON, MAX_THOMPSON_PRIOR);
    const fallbackBeta = clamp(policy.thompsonPriorBeta, Number.EPSILON, MAX_THOMPSON_PRIOR);
    if (!bayesianMetaPrior || typeof bayesianMetaPrior !== 'object') {
        return {
            alpha: fallbackAlpha,
            beta: fallbackBeta
        };
    }
    const maxMetaPrior = MAX_THOMPSON_PRIOR + MAX_THOMPSON_META_PRIOR_STRENGTH;
    return {
        alpha: clamp(Number(bayesianMetaPrior.alpha), Number.EPSILON, maxMetaPrior) || fallbackAlpha,
        beta: clamp(Number(bayesianMetaPrior.beta), Number.EPSILON, maxMetaPrior) || fallbackBeta
    };
}

function resolveBayesianMetaPrior(executionStats = {}, selectionPolicyConfig = null, currentWave = 0) {
    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const strength = clamp(
        Number(policy.thompsonMetaPriorStrength),
        0,
        MAX_THOMPSON_META_PRIOR_STRENGTH
    );
    if (strength <= Number.EPSILON) {
        return {
            alpha: policy.thompsonPriorAlpha,
            beta: policy.thompsonPriorBeta
        };
    }
    const stats = executionStats && typeof executionStats === 'object'
        ? Object.values(executionStats)
        : [];
    let attempts = 0;
    let successes = 0;
    for (const rawStat of stats) {
        const resolved = resolveScoreStats(rawStat, selectionPolicyConfig, currentWave);
        attempts += Math.max(0, Number(resolved.attempts) || 0);
        successes += Math.max(0, Number(resolved.successes) || 0);
    }
    if (attempts <= Number.EPSILON) {
        return {
            alpha: policy.thompsonPriorAlpha,
            beta: policy.thompsonPriorBeta
        };
    }
    const empiricalMean = clamp(successes / attempts, 0, 1);
    return {
        alpha: policy.thompsonPriorAlpha + (empiricalMean * strength),
        beta: policy.thompsonPriorBeta + ((1 - empiricalMean) * strength)
    };
}

function computeEpsilonThompsonScore(stat, currentWave, adaptiveScoreConfig, selectionPolicyConfig, seedText, bayesianMetaPrior = null) {
    const normalized = resolveScoreStats(stat, selectionPolicyConfig);
    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const adjustments = computeAdaptiveAdjustments(normalized, currentWave, adaptiveScoreConfig);
    const prior = resolveBayesianPosteriorPrior(policy, bayesianMetaPrior);
    const alpha = prior.alpha + normalized.successes;
    const beta = prior.beta + normalized.failures;
    const posteriorMean = alpha / (alpha + beta);
    const posteriorVariance = (alpha * beta) / (((alpha + beta) ** 2) * (alpha + beta + 1));
    const rng = createDeterministicRng(seedText);
    const posteriorSample = sampleBeta(alpha, beta, rng);
    const effectiveExploration = ADAPTIVE_THOMPSON_POLICY_MODES.has(policy.mode)
        ? clamp(
            policy.thompsonExploration
            + (
                policy.thompsonUncertaintyWeight
                * (
                    (2 * Math.sqrt(Math.max(0, posteriorVariance)))
                    + (1 / Math.sqrt(normalized.attempts + 1))
                )
            ),
            0,
            1
        )
        : policy.thompsonExploration;
    const blendedScore = ((1 - effectiveExploration) * posteriorMean)
        + (effectiveExploration * posteriorSample);

    return blendedScore
        - adjustments.failurePenalty
        + adjustments.recentOutcomeBonus
        + adjustments.staleBoost;
}

function resolveBayesianBootstrapOutcomes(stat, selectionPolicyConfig = null) {
    const normalized = normalizeExecutionStat(stat);
    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const outcomes = policy.mode === 'sw_bb_ts'
        ? normalized.recentOutcomes.slice(-policy.slidingWindowSize)
        : normalized.recentOutcomes;
    return outcomes.map((entry) => normalizeRecentOutcomeEntry(entry));
}

function computeBayesianBootstrapThompsonScore(stat, currentWave, adaptiveScoreConfig, selectionPolicyConfig, seedText) {
    const normalized = resolveScoreStats(stat, selectionPolicyConfig);
    if (normalized.attempts <= 0) {
        return Number.POSITIVE_INFINITY;
    }

    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const adjustments = computeAdaptiveAdjustments(normalized, currentWave, adaptiveScoreConfig);
    const outcomes = resolveBayesianBootstrapOutcomes(stat, policy);
    if (outcomes.length <= 0) {
        return Number.POSITIVE_INFINITY;
    }

    const rng = createDeterministicRng(seedText);
    let weightedReward = 0;
    let totalWeight = 0;
    for (let index = 0; index < outcomes.length; index++) {
        const outcome = outcomes[index];
        const age = outcomes.length - 1 - index;
        const recencyWeight = policy.mode === 'd_bb_ts'
            ? Math.pow(policy.discountFactor, age)
            : 1;
        const bootstrapWeight = sampleGamma(1, rng);
        const combinedWeight = recencyWeight * bootstrapWeight;
        totalWeight += combinedWeight;
        weightedReward += outcome.reward * combinedWeight;
    }
    const posteriorSample = totalWeight > 0 ? (weightedReward / totalWeight) : 0.5;
    const posteriorMean = clamp(
        normalized.successes / Math.max(Number.EPSILON, normalized.attempts),
        0,
        1
    );
    const blendedScore = ((1 - policy.thompsonExploration) * posteriorMean)
        + (policy.thompsonExploration * posteriorSample);

    return blendedScore
        - adjustments.failurePenalty
        + adjustments.recentOutcomeBonus
        + adjustments.staleBoost;
}

function computeBoltzmannGumbelScore(stat, currentWave, adaptiveScoreConfig, selectionPolicyConfig, seedText) {
    const normalized = resolveScoreStats(stat, selectionPolicyConfig);
    if (normalized.attempts <= 0) {
        return Number.POSITIVE_INFINITY;
    }

    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const attempts = Math.max(1, normalized.attempts);
    const empiricalMean = clamp(normalized.successes / attempts, 0, 1);
    const explorationScale = policy.boltzmannGumbelC / Math.sqrt(attempts);
    const rng = createDeterministicRng(seedText);
    const gumbel = sampleStandardGumbel(rng);
    const adjustments = computeAdaptiveAdjustments(normalized, currentWave, adaptiveScoreConfig);

    return empiricalMean
        + (explorationScale * gumbel)
        - adjustments.failurePenalty
        + adjustments.recentOutcomeBonus
        + adjustments.staleBoost;
}

function computePheScore(stat, currentWave, adaptiveScoreConfig, selectionPolicyConfig, seedText) {
    const normalized = resolveScoreStats(stat, selectionPolicyConfig);
    if (normalized.attempts <= 0) {
        return Number.POSITIVE_INFINITY;
    }

    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const attempts = Math.max(1, Math.round(normalized.attempts));
    const rewardSum = clamp(normalized.successes, 0, normalized.attempts);
    const pseudoCount = Math.max(1, Math.ceil(policy.phePerturbationScale * attempts));
    const rng = createDeterministicRng(seedText);
    const pseudoSuccesses = sampleBinomial(pseudoCount, 0.5, rng);
    const perturbedMean = (rewardSum + pseudoSuccesses) / (normalized.attempts + pseudoCount);
    const adjustments = computeAdaptiveAdjustments(normalized, currentWave, adaptiveScoreConfig);

    return perturbedMean
        - adjustments.failurePenalty
        + adjustments.recentOutcomeBonus
        + adjustments.staleBoost;
}

function computeKlUcbScore(stat, totalAttempts, currentWave, adaptiveScoreConfig, selectionPolicyConfig = null) {
    const normalized = resolveScoreStats(stat, selectionPolicyConfig);
    if (normalized.attempts <= 0) {
        return Number.POSITIVE_INFINITY;
    }

    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const empiricalMean = normalized.successes / normalized.attempts;
    const index = computeKlUcbIndex(
        empiricalMean,
        normalized.attempts,
        totalAttempts + 1,
        policy.klUcbConfidence
    );
    const adjustments = computeAdaptiveAdjustments(normalized, currentWave, adaptiveScoreConfig);

    return index
        - adjustments.failurePenalty
        + adjustments.recentOutcomeBonus
        + adjustments.staleBoost;
}

function computeStandardNormalQuantile(probability) {
    const p = clamp(Number(probability), Number.EPSILON, 1 - Number.EPSILON);
    const a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.38357751867269e+02, -3.066479806614716e+01, 2.506628277459239e+00];
    const b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01];
    const c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
    const d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00];
    const pLow = 0.02425;
    const pHigh = 1 - pLow;

    if (p < pLow) {
        const q = Math.sqrt(-2 * Math.log(p));
        return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5])
            / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
    }
    if (p > pHigh) {
        const q = Math.sqrt(-2 * Math.log(1 - p));
        return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5])
            / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
    }

    const q = p - 0.5;
    const r = q * q;
    return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q
        / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
}

function computeBayesUcbScore(stat, currentWave, adaptiveScoreConfig, selectionPolicyConfig = null, bayesianMetaPrior = null) {
    const normalized = resolveScoreStats(stat, selectionPolicyConfig);
    if (normalized.attempts <= 0) {
        return Number.POSITIVE_INFINITY;
    }

    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const adjustments = computeAdaptiveAdjustments(normalized, currentWave, adaptiveScoreConfig);
    const prior = resolveBayesianPosteriorPrior(policy, bayesianMetaPrior);
    const alpha = prior.alpha + normalized.successes;
    const beta = prior.beta + normalized.failures;
    const posteriorMean = alpha / (alpha + beta);
    const posteriorVariance = (alpha * beta)
        / (((alpha + beta) ** 2) * (alpha + beta + 1));
    const zScore = computeStandardNormalQuantile(policy.bayesUcbQuantile);
    const optimisticIndex = clamp(
        posteriorMean + (zScore * Math.sqrt(Math.max(0, posteriorVariance))),
        0,
        1
    );

    return optimisticIndex
        - adjustments.failurePenalty
        + adjustments.recentOutcomeBonus
        + adjustments.staleBoost;
}

function computeMossAnytimeScore(stat, totalAttempts, totalArms, currentWave, adaptiveScoreConfig, selectionPolicyConfig = null) {
    const normalized = resolveScoreStats(stat, selectionPolicyConfig);
    if (normalized.attempts <= 0) {
        return Number.POSITIVE_INFINITY;
    }

    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const empiricalMean = normalized.successes / normalized.attempts;
    const horizon = Math.max(2, totalAttempts + 1);
    const arms = Math.max(1, totalArms);
    const ratio = horizon / (arms * Math.max(1, normalized.attempts));
    const explorationTerm = Math.max(0, Math.log(ratio));
    const exploration = Math.sqrt(((1 + policy.mossAlpha) * explorationTerm) / (2 * normalized.attempts));
    const adjustments = computeAdaptiveAdjustments(normalized, currentWave, adaptiveScoreConfig);

    return empiricalMean
        + exploration
        - adjustments.failurePenalty
        + adjustments.recentOutcomeBonus
        + adjustments.staleBoost;
}

function computeAdversarialAutoEta(armCount, totalAttempts) {
    const safeArmCount = Math.max(1, parsePositiveInt(armCount, 1));
    const safeAttempts = Math.max(1, Number(totalAttempts) || 1);
    return Math.sqrt(
        (2 * Math.log(safeArmCount + 1))
        / (safeAttempts * safeArmCount)
    );
}

function computeAdversarialAutoExplorationGamma(armCount, totalAttempts) {
    const safeArmCount = Math.max(1, parsePositiveInt(armCount, 1));
    const safeAttempts = Math.max(1, Number(totalAttempts) || 1);
    // Horizon-aware EXP3 exploration schedule (Auer et al.):
    // gamma ~= sqrt((K * log(K + 1)) / ((e - 1) * N)).
    return Math.sqrt(
        (safeArmCount * Math.log(safeArmCount + 1))
        / ((Math.E - 1) * safeAttempts)
    );
}

function resolveCorralRuntimeParameters(policy, policyCount, effectiveAttempts) {
    let gamma = clamp(
        Number(policy.corralGamma),
        Number.EPSILON,
        MAX_CORRAL_GAMMA
    );
    if (policy.corralAutoGamma) {
        gamma = clamp(
            computeAdversarialAutoExplorationGamma(policyCount, effectiveAttempts),
            Number.EPSILON,
            MAX_CORRAL_GAMMA
        );
    }
    let eta = clamp(
        Number(policy.corralEta),
        Number.EPSILON,
        MAX_CORRAL_ETA
    );
    if (policy.corralAutoEta) {
        eta = clamp(
            computeAdversarialAutoEta(policyCount, effectiveAttempts),
            Number.EPSILON,
            MAX_CORRAL_ETA
        );
    }
    return {
        gamma,
        eta,
        effectiveAttempts: Math.max(1, Number(effectiveAttempts) || 1),
        autoGamma: Boolean(policy.corralAutoGamma),
        autoEta: Boolean(policy.corralAutoEta)
    };
}

function resolveCorralEffectiveAttempts(scoredPolicies, selectionPolicyConfig) {
    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    let effectiveAttempts = 0;
    for (const entry of scoredPolicies) {
        const outcomeCount = parseNonNegativeInt(entry.outcomeCount, 0);
        if (outcomeCount > 0) {
            if (DISCOUNTED_CORRAL_POLICY_MODES.has(policy.mode)) {
                effectiveAttempts += computeDiscountedEffectiveSampleSize(
                    outcomeCount,
                    policy.discountFactor
                );
            } else {
                effectiveAttempts += outcomeCount;
            }
        } else {
            effectiveAttempts += Math.max(0, Number(entry.attempts) || 0);
        }
    }
    return Math.max(1, effectiveAttempts);
}

function resolveCorralPolicyDistribution(policyExecutionStats, selectionPolicyConfig, currentWave = 0) {
    const laneStats = normalizePolicyPerformanceByLane(policyExecutionStats);
    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const corralPolicies = CORRAL_PLUS_POLICY_MODES.has(policy.mode)
        ? CORRAL_EXP3_PLUS_BASE_POLICIES
        : CORRAL_EXP3_BASE_POLICIES;
    const uniform = 1 / corralPolicies.length;
    const corralScoreConfig = SLIDING_WINDOW_CORRAL_POLICY_MODES.has(policy.mode)
        ? {
            mode: 'sw_ucb',
            slidingWindowSize: policy.slidingWindowSize
        }
        : (DISCOUNTED_CORRAL_POLICY_MODES.has(policy.mode)
            ? {
                mode: 'd_ucb',
                discountFactor: policy.discountFactor
            }
            : null);
    const scoredPolicySignals = corralPolicies.map((name) => {
        const rawStat = normalizePolicyPerformanceStat(laneStats[name]);
        const stat = corralScoreConfig
            ? resolveScoreStats(rawStat, corralScoreConfig, currentWave)
            : rawStat;
        const attempts = Math.max(0, Number(stat.attempts) || 0);
        const successes = clamp(Number(stat.successes) || 0, 0, attempts);
        const outcomes = resolveCorralRecentOutcomes(rawStat, policy);
        return {
            name,
            attempts,
            successes,
            outcomeCount: outcomes.length,
            outcomes
        };
    });
    const effectiveAttempts = resolveCorralEffectiveAttempts(scoredPolicySignals, policy);
    const corralRuntime = resolveCorralRuntimeParameters(policy, corralPolicies.length, effectiveAttempts);
    const gamma = corralRuntime.gamma;
    const implicitGamma = Math.max(Number.EPSILON, gamma);
    const scoredPolicies = scoredPolicySignals.map((entry) => {
        const cumulativeEstimatedLoss = entry.outcomes.length > 0
            ? computeExp3ImplicitEstimatedLoss(entry.outcomes, policy, uniform, implicitGamma)
            : ((entry.attempts - entry.successes) / (uniform + implicitGamma));
        return {
            name: entry.name,
            attempts: entry.attempts,
            outcomeCount: entry.outcomeCount,
            loss: cumulativeEstimatedLoss
        };
    });
    const totalCorralAttempts = scoredPolicies.reduce((sum, entry) => sum + entry.attempts, 0);
    const minimumLoss = scoredPolicies.reduce(
        (minimum, entry) => Math.min(minimum, entry.loss),
        Number.POSITIVE_INFINITY
    );
    const weighted = scoredPolicies.map((entry) => {
        const uncertaintyBonus = policy.corralUncertaintyWeight
            * Math.sqrt(
                Math.log(Math.max(2, totalCorralAttempts + corralPolicies.length + 1))
                / (entry.attempts + 1)
            );
        const centeredLoss = entry.loss - (Number.isFinite(minimumLoss) ? minimumLoss : 0);
        const scaled = clamp(
            (-corralRuntime.eta * centeredLoss) + uncertaintyBonus,
            -60,
            60
        );
        return {
            name: entry.name,
            weight: Math.exp(scaled)
        };
    });
    const sumWeights = weighted.reduce((sum, entry) => sum + entry.weight, 0);
    const safeSum = sumWeights > 0 ? sumWeights : corralPolicies.length;
    const baseDistribution = weighted.map((entry) => {
        const exploitation = entry.weight / safeSum;
        return {
            name: entry.name,
            probability: ((1 - corralRuntime.gamma) * exploitation) + (corralRuntime.gamma * uniform)
        };
    });
    const minPolicyAttempts = clamp(
        parseNonNegativeInt(policy.corralMinPolicyAttempts, DEFAULT_CORRAL_MIN_POLICY_ATTEMPTS),
        0,
        MAX_CORRAL_MIN_POLICY_ATTEMPTS
    );
    if (minPolicyAttempts <= 0) {
        return {
            distribution: baseDistribution,
            runtime: corralRuntime
        };
    }

    const underSampled = weighted
        .map((entry) => ({
            name: entry.name,
            deficit: Math.max(0, minPolicyAttempts - entry.attempts)
        }))
        .filter((entry) => entry.deficit > 0);
    if (underSampled.length === 0) {
        return {
            distribution: baseDistribution,
            runtime: corralRuntime
        };
    }

    const forcedMass = clamp(policy.corralForcedExploration, 0, MAX_CORRAL_FORCED_EXPLORATION);
    if (forcedMass <= 0) {
        return {
            distribution: baseDistribution,
            runtime: corralRuntime
        };
    }
    const totalDeficit = underSampled.reduce((sum, entry) => sum + entry.deficit, 0);
    const fallbackShare = 1 / underSampled.length;
    const underSampledShareByName = Object.fromEntries(underSampled.map((entry) => [
        entry.name,
        totalDeficit > 0 ? (entry.deficit / totalDeficit) : fallbackShare
    ]));

    return {
        distribution: baseDistribution.map((entry) => {
            const underShare = Number(underSampledShareByName[entry.name] || 0);
            return {
                name: entry.name,
                probability: ((1 - forcedMass) * entry.probability) + (forcedMass * underShare)
            };
        }),
        runtime: corralRuntime
    };
}

function pickPolicyFromDistribution(distribution, seedText) {
    const rng = createDeterministicRng(seedText);
    const roll = rng();
    let cumulative = 0;
    for (const item of distribution) {
        cumulative += item.probability;
        if (roll <= cumulative) return item.name;
    }
    return distribution[distribution.length - 1]?.name || DEFAULT_SELECTION_POLICY_MODE;
}

function resolveExp3RuntimeParameters(policy, armCount, totalAttempts) {
    let explorationGamma = clamp(
        Number(policy.exp3ExplorationGamma),
        Number.EPSILON,
        MAX_EXP3_IX_GAMMA
    );
    let eta = clamp(
        Number(policy.exp3IxEta),
        Number.EPSILON,
        MAX_EXP3_IX_ETA
    );
    if (policy.exp3AutoEta) {
        // Exp3-IX recommendation for adversarial horizon n with k arms:
        // eta = sqrt((2 * log(k + 1)) / (n * k)), gamma_implicit = eta / 2.
        const suggestedEta = computeAdversarialAutoEta(armCount, totalAttempts);
        eta = clamp(suggestedEta, Number.EPSILON, MAX_EXP3_IX_ETA);
    }
    if (policy.exp3AutoGamma) {
        explorationGamma = clamp(
            computeAdversarialAutoExplorationGamma(armCount, totalAttempts),
            Number.EPSILON,
            MAX_EXP3_IX_GAMMA
        );
    }
    const implicitGammaFromEta = clamp(eta / 2, Number.EPSILON, MAX_EXP3_IX_GAMMA);
    const implicitGamma = Number.isFinite(Number(policy.exp3ImplicitGamma))
        ? clamp(Number(policy.exp3ImplicitGamma), Number.EPSILON, MAX_EXP3_IX_GAMMA)
        : implicitGammaFromEta;
    return {
        eta,
        explorationGamma,
        implicitGamma
    };
}

function resolveExp3RecentOutcomes(stat, selectionPolicyConfig, currentWave = 0) {
    const normalized = normalizeExecutionStat(stat);
    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    let outcomes = normalized.recentOutcomes.slice();
    if (
        policy.mode === 'sw_exp3_ix'
        || policy.mode === 'sw_exp3_s'
        || policy.mode === 'sw_tsallis_inf'
    ) {
        outcomes = outcomes.slice(-policy.slidingWindowSize);
    } else if (
        policy.mode === 'adwin_exp3_ix'
        || policy.mode === 'adwin_exp3_s'
        || policy.mode === 'adwin_tsallis_inf'
    ) {
        const changeIndex = detectAdwinChangeIndex(outcomes, policy);
        outcomes = changeIndex > 0 ? outcomes.slice(changeIndex) : outcomes;
    } else if (policy.mode === 'rexp3_ix') {
        const restartInterval = parsePositiveInt(policy.exp3RestartInterval, DEFAULT_EXP3_RESTART_INTERVAL);
        const wave = parseNonNegativeInt(currentWave, 0);
        if (wave > 0 && restartInterval > 0) {
            const restartWave = wave - ((wave - 1) % restartInterval);
            outcomes = outcomes.filter((entry) => {
                const normalizedOutcome = normalizeRecentOutcomeEntry(entry);
                return normalizedOutcome.wave >= restartWave;
            });
        }
    }
    return outcomes.map((entry) => normalizeRecentOutcomeEntry(entry));
}

function resolveCorralRecentOutcomes(stat, selectionPolicyConfig) {
    const normalized = normalizePolicyPerformanceStat(stat);
    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    let outcomes = normalized.recentOutcomes.slice();
    if (SLIDING_WINDOW_CORRAL_POLICY_MODES.has(policy.mode)) {
        outcomes = outcomes.slice(-policy.slidingWindowSize);
    } else if (ADWIN_CORRAL_POLICY_MODES.has(policy.mode)) {
        const changeIndex = detectAdwinChangeIndex(outcomes, policy);
        outcomes = changeIndex > 0 ? outcomes.slice(changeIndex) : outcomes;
    }
    return outcomes.map((entry) => normalizeRecentOutcomeEntry(entry));
}

function computeExp3ImplicitEstimatedLoss(outcomes, policy, uniformPropensity, implicitGamma) {
    const normalizedOutcomes = Array.isArray(outcomes)
        ? outcomes.map((entry) => normalizeRecentOutcomeEntry(entry))
        : [];
    if (normalizedOutcomes.length <= 0) return 0;

    const useDiscounting = DISCOUNTED_ADVERSARIAL_POLICY_MODES.has(policy.mode);
    let cumulativeEstimatedLoss = 0;
    const importanceWeightCap = clamp(
        Number.isFinite(Number(policy.exp3ImportanceWeightCap))
            ? Number(policy.exp3ImportanceWeightCap)
            : DEFAULT_EXP3_IMPORTANCE_WEIGHT_CAP,
        1,
        MAX_EXP3_IMPORTANCE_WEIGHT_CAP
    );
    for (let index = 0; index < normalizedOutcomes.length; index++) {
        const entry = normalizedOutcomes[index];
        const age = normalizedOutcomes.length - 1 - index;
        const discountWeight = useDiscounting ? Math.pow(policy.discountFactor, age) : 1;
        const propensity = Number.isFinite(Number(entry.propensity))
            ? clamp(Number(entry.propensity), Number.EPSILON, 1)
            : uniformPropensity;
        const instantaneousLoss = 1 - clamp(Number(entry.reward), 0, 1);
        const denominator = propensity + implicitGamma;
        const importanceWeight = Math.min(importanceWeightCap, 1 / denominator);
        const estimatedLoss = instantaneousLoss * importanceWeight;
        cumulativeEstimatedLoss += discountWeight * estimatedLoss;
    }

    return Math.max(0, cumulativeEstimatedLoss);
}

function computeDiscountedEffectiveSampleSize(outcomeCount, discountFactor) {
    const count = Math.max(0, parsePositiveInt(outcomeCount, 0));
    if (count <= 0) return 0;
    const factor = clamp(
        Number(discountFactor),
        MIN_DISCOUNT_FACTOR,
        1
    );
    let sumWeights = 0;
    let sumSquaredWeights = 0;
    for (let age = 0; age < count; age++) {
        const weight = Math.pow(factor, age);
        sumWeights += weight;
        sumSquaredWeights += (weight * weight);
    }
    if (sumSquaredWeights <= 0) return 0;
    return (sumWeights * sumWeights) / sumSquaredWeights;
}

function resolveAdversarialEffectiveAttempts({
    catalog,
    executionStats,
    selectionPolicyConfig,
    currentWave = 0,
    fallbackAttempts = 1
}) {
    const list = Array.isArray(catalog) ? catalog : [];
    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const normalizedCurrentWave = parseNonNegativeInt(currentWave, 0);
    if (!ADVERSARIAL_RECENCY_POLICY_MODES.has(policy.mode)) {
        return Math.max(1, Number(fallbackAttempts) || 1);
    }
    let effectiveAttempts = 0;
    for (const candidate of list) {
        const key = String(candidate?.id ?? candidate);
        const outcomes = resolveExp3RecentOutcomes(
            executionStats?.[key],
            policy,
            normalizedCurrentWave
        );
        if (outcomes.length <= 0) continue;
        if (DISCOUNTED_ADVERSARIAL_POLICY_MODES.has(policy.mode)) {
            effectiveAttempts += computeDiscountedEffectiveSampleSize(
                outcomes.length,
                policy.discountFactor
            );
        } else {
            effectiveAttempts += outcomes.length;
        }
    }
    if (effectiveAttempts <= 0) {
        return Math.max(1, Number(fallbackAttempts) || 1);
    }
    return Math.max(1, effectiveAttempts);
}

function computeTsallisReducedVarianceEstimatedLoss(outcomes, policy, uniformPropensity, eta, implicitGamma) {
    const normalizedOutcomes = Array.isArray(outcomes)
        ? outcomes.map((entry) => normalizeRecentOutcomeEntry(entry))
        : [];
    if (normalizedOutcomes.length <= 0) return 0;

    const useDiscounting = policy.mode === 'd_tsallis_inf';
    const importanceWeightCap = clamp(
        Number.isFinite(Number(policy.exp3ImportanceWeightCap))
            ? Number(policy.exp3ImportanceWeightCap)
            : DEFAULT_EXP3_IMPORTANCE_WEIGHT_CAP,
        1,
        MAX_EXP3_IMPORTANCE_WEIGHT_CAP
    );
    const baselineThreshold = Math.max(Number.EPSILON, eta ** 2);
    let cumulativeEstimatedLoss = 0;

    for (let index = 0; index < normalizedOutcomes.length; index++) {
        const entry = normalizedOutcomes[index];
        const age = normalizedOutcomes.length - 1 - index;
        const discountWeight = useDiscounting ? Math.pow(policy.discountFactor, age) : 1;
        const propensity = Number.isFinite(Number(entry.propensity))
            ? clamp(Number(entry.propensity), Number.EPSILON, 1)
            : uniformPropensity;
        const instantaneousLoss = 1 - clamp(Number(entry.reward), 0, 1);
        const baseline = propensity >= baselineThreshold ? 0.5 : 0;
        const denominator = propensity + implicitGamma;
        const importanceWeight = Math.min(importanceWeightCap, 1 / denominator);
        const estimatedLoss = ((instantaneousLoss - baseline) * importanceWeight) + baseline;
        cumulativeEstimatedLoss += discountWeight * estimatedLoss;
    }

    return cumulativeEstimatedLoss;
}

function resolveTsallisRuntimeParameters(policy, armCount, effectiveAttempts) {
    const safeAttempts = Math.max(1, Number(effectiveAttempts) || 1);
    let explorationGamma = clamp(
        Number(policy.exp3ExplorationGamma),
        Number.EPSILON,
        MAX_EXP3_IX_GAMMA
    );
    if (policy.exp3AutoGamma) {
        explorationGamma = clamp(
            computeAdversarialAutoExplorationGamma(armCount, safeAttempts),
            Number.EPSILON,
            MAX_EXP3_IX_GAMMA
        );
    }
    const etaScale = clamp(
        Number(policy.tsallisEtaScale),
        Number.EPSILON,
        MAX_TSALLIS_ETA_SCALE
    );
    const suggestedEta = policy.tsallisAutoEta
        ? ((4 * etaScale) / Math.sqrt(safeAttempts))
        : (etaScale / Math.sqrt(safeAttempts));
    const eta = clamp(suggestedEta, Number.EPSILON, MAX_EXP3_IX_ETA);
    const implicitGamma = Number.isFinite(Number(policy.exp3ImplicitGamma))
        ? clamp(Number(policy.exp3ImplicitGamma), Number.EPSILON, MAX_EXP3_IX_GAMMA)
        : explorationGamma;
    return {
        eta,
        etaScale,
        explorationGamma,
        implicitGamma
    };
}

function solveTsallisSlack(losses, eta) {
    if (!Array.isArray(losses) || losses.length === 0) return null;
    const safeEta = clamp(Number(eta), Number.EPSILON, MAX_EXP3_IX_ETA);
    const finiteLosses = losses
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value));
    if (finiteLosses.length !== losses.length) {
        return null;
    }
    const minLoss = Math.min(...finiteLosses);
    const maxLoss = Math.max(...finiteLosses);
    const target = 1;
    const evaluate = (slack) => finiteLosses.reduce((sum, loss) => {
        const margin = Math.max(0, slack - loss);
        return sum + ((safeEta * margin) ** 2);
    }, 0);
    let low = minLoss;
    let high = Math.max(minLoss + (1 / safeEta), maxLoss + (1 / safeEta));
    let value = evaluate(high);
    let growthGuard = 0;
    while (value < target && growthGuard < 32) {
        high += Math.max(1 / safeEta, (high - low) || 1);
        value = evaluate(high);
        growthGuard += 1;
    }
    if (value < target) {
        return high;
    }
    for (let iteration = 0; iteration < 64; iteration++) {
        const mid = (low + high) / 2;
        const midValue = evaluate(mid);
        if (midValue >= target) {
            high = mid;
        } else {
            low = mid;
        }
    }
    return high;
}

function resolveTsallisInfDistribution({
    catalog,
    executionStats,
    effectiveAttempts,
    selectionPolicyConfig,
    currentWave
}) {
    const list = Array.isArray(catalog) ? catalog : [];
    const attemptsDenominator = Math.max(1, Number(effectiveAttempts) || 1);
    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const armCount = Math.max(1, list.length);
    const runtime = resolveTsallisRuntimeParameters(policy, armCount, attemptsDenominator);
    const uniform = 1 / armCount;
    const perArmLoss = list.map((candidate) => {
        const key = String(candidate?.id ?? candidate);
        const outcomes = resolveExp3RecentOutcomes(
            executionStats?.[key],
            selectionPolicyConfig,
            currentWave
        );
        const cumulativeEstimatedLoss = computeTsallisReducedVarianceEstimatedLoss(
            outcomes,
            policy,
            uniform,
            runtime.eta,
            runtime.implicitGamma
        );
        return {
            key,
            loss: cumulativeEstimatedLoss
        };
    });
    const minimumLoss = perArmLoss.reduce(
        (minimum, entry) => Math.min(minimum, entry.loss),
        Number.POSITIVE_INFINITY
    );
    const centeredLosses = perArmLoss.map((entry) => (
        entry.loss - (Number.isFinite(minimumLoss) ? minimumLoss : 0)
    ));
    const slack = solveTsallisSlack(centeredLosses, runtime.eta);
    const rawWeights = centeredLosses.map((loss) => {
        if (!Number.isFinite(slack)) return 0;
        const margin = Math.max(0, slack - loss);
        return (runtime.eta * margin) ** 2;
    });
    const rawSum = rawWeights.reduce((sum, weight) => sum + weight, 0);
    const safeRawSum = rawSum > 0 ? rawSum : armCount;
    const probabilities = {};

    for (let index = 0; index < perArmLoss.length; index++) {
        const key = perArmLoss[index].key;
        const exploitation = (rawWeights[index] || 0) / safeRawSum;
        probabilities[key] = ((1 - runtime.explorationGamma) * exploitation) + (runtime.explorationGamma * uniform);
    }

    return probabilities;
}

function resolveExp3IxDistribution({
    catalog,
    executionStats,
    effectiveAttempts,
    selectionPolicyConfig,
    currentWave
}) {
    const list = Array.isArray(catalog) ? catalog : [];
    const attemptsDenominator = Math.max(1, Number(effectiveAttempts) || 1);
    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const armCount = Math.max(1, list.length);
    const runtime = resolveExp3RuntimeParameters(policy, armCount, attemptsDenominator);
    const gamma = runtime.explorationGamma;
    const eta = runtime.eta;
    const implicitGamma = runtime.implicitGamma;
    const shareAlpha = policy.exp3ShareAlpha;
    const uniform = 1 / armCount;
    const perArmLoss = list.map((candidate) => {
        const key = String(candidate?.id ?? candidate);
        const outcomes = resolveExp3RecentOutcomes(
            executionStats?.[key],
            selectionPolicyConfig,
            currentWave
        );
        const cumulativeEstimatedLoss = computeExp3ImplicitEstimatedLoss(
            outcomes,
            policy,
            uniform,
            implicitGamma
        );
        return {
            key,
            loss: cumulativeEstimatedLoss
        };
    });
    const minimumLoss = perArmLoss.reduce(
        (minimum, entry) => Math.min(minimum, entry.loss),
        Number.POSITIVE_INFINITY
    );
    const weighted = perArmLoss.map((entry) => {
        const centeredLoss = entry.loss - (Number.isFinite(minimumLoss) ? minimumLoss : 0);
        const logWeight = clamp(-eta * centeredLoss, -60, 60);
        return {
            key: entry.key,
            weight: Math.exp(logWeight)
        };
    });
    const sharedWeights = EXP3_SHARE_POLICY_MODES.has(policy.mode)
        ? (() => {
            const rawSum = weighted.reduce((sum, entry) => sum + entry.weight, 0);
            const averageWeight = rawSum > 0 ? (rawSum / armCount) : 1;
            const boundedShare = clamp(shareAlpha, 0, 1);
            return weighted.map((entry) => ({
                ...entry,
                weight: ((1 - boundedShare) * entry.weight) + (boundedShare * averageWeight)
            }));
        })()
        : weighted;
    const sumWeights = sharedWeights.reduce((sum, entry) => sum + entry.weight, 0);
    const safeSum = sumWeights > 0 ? sumWeights : armCount;
    const probabilities = {};

    for (const entry of sharedWeights) {
        const exploitation = entry.weight / safeSum;
        probabilities[entry.key] = ((1 - gamma) * exploitation) + (gamma * uniform);
    }

    return probabilities;
}

function cursorDistance(index, pointer, total) {
    if (total <= 0) return 0;
    return (index - pointer + total) % total;
}

function selectCatalogSlice({
    catalog,
    cursor,
    limit,
    successfulSet,
    executionStats = {},
    currentWave = 0,
    failureCooldownWaves = DEFAULT_FAILURE_COOLDOWN_WAVES,
    adaptiveScoreConfig = null,
    selectionPolicyConfig = null,
    policyExecutionStats = {},
    windowPolicyExecutionStats = {},
    contextualBanditModel = null,
    selectionScope = 'catalog'
}) {
    const list = Array.isArray(catalog) ? catalog : [];
    if (list.length === 0 || limit <= 0) {
        return {
            selected: [],
            nextCursor: 0,
            selectedPolicy: normalizeSelectionPolicyConfig(selectionPolicyConfig).mode,
            appliedSelectionPolicyConfig: normalizeSelectionPolicyConfig(selectionPolicyConfig),
            selectedPolicyProbability: null,
            policyProbabilities: null,
            selectionFeatures: {},
            selectionProbabilities: {}
        };
    }

    const total = list.length;
    let pointer = ((Number(cursor) || 0) % total + total) % total;
    const selected = [];
    const selectedKeySet = new Set();

    let scanned = 0;
    while (selected.length < limit && scanned < total) {
        const candidate = list[pointer];
        const key = String(candidate?.id ?? candidate);
        const stat = normalizeExecutionStat(executionStats[key]);
        // Prioritize unseen items first for broad coverage.
        if (!selectedKeySet.has(key) && !successfulSet.has(key) && stat.attempts === 0) {
            selected.push(candidate);
            selectedKeySet.add(key);
        }
        pointer = (pointer + 1) % total;
        scanned++;
    }

    const normalizedPolicy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const normalizedCurrentWave = parseNonNegativeInt(currentWave, 0);
    let scoringPolicy = normalizedPolicy;
    let selectedPolicy = normalizedPolicy.mode;
    let appliedSelectionPolicyConfig = normalizedPolicy;
    let selectedPolicyProbability = null;
    let policyProbabilities = null;
    const selectionFeatures = {};
    let selectionProbabilities = {};
    const bayesianMetaPrior = resolveBayesianMetaPrior(
        executionStats,
        scoringPolicy,
        normalizedCurrentWave
    );

    if (CORRAL_POLICY_MODES.has(normalizedPolicy.mode)) {
        const { distribution, runtime } = resolveCorralPolicyDistribution(
            policyExecutionStats,
            normalizedPolicy,
            normalizedCurrentWave
        );
        selectedPolicy = pickPolicyFromDistribution(
            distribution,
            `${selectionScope}:${normalizedPolicy.mode}:${normalizedCurrentWave}:${pointer}:${total}`
        );
        scoringPolicy = {
            ...normalizedPolicy,
            mode: selectedPolicy
        };
        selectedPolicyProbability = Number(distribution.find((entry) => entry.name === selectedPolicy)?.probability || 0);
        policyProbabilities = Object.fromEntries(distribution.map((entry) => [
            entry.name,
            Number(entry.probability.toFixed(6))
        ]));
        policyProbabilities._runtime = {
            mode: normalizedPolicy.mode,
            gamma: Number(runtime.gamma.toFixed(6)),
            eta: Number(runtime.eta.toFixed(6)),
            effectiveAttempts: Number(runtime.effectiveAttempts.toFixed(6)),
            autoGamma: Boolean(runtime.autoGamma),
            autoEta: Boolean(runtime.autoEta)
        };
    } else if (BOB_WINDOW_UCB_POLICY_MODES.has(normalizedPolicy.mode)) {
        const distribution = resolveBobWindowDistribution(windowPolicyExecutionStats, normalizedPolicy);
        const selectedWindowSize = Number(pickPolicyFromDistribution(
            distribution.map((entry) => ({
                name: String(entry.windowSize),
                probability: entry.probability
            })),
            `${selectionScope}:${normalizedPolicy.mode}:window:${normalizedCurrentWave}:${pointer}:${total}`
        ));
        scoringPolicy = {
            ...normalizedPolicy,
            mode: 'sw_ucb',
            slidingWindowSize: selectedWindowSize
        };
        appliedSelectionPolicyConfig = {
            ...normalizedPolicy,
            selectedWindowSize
        };
        policyProbabilities = {
            mode: normalizedPolicy.mode,
            gamma: Number(normalizedPolicy.bobGamma.toFixed(6)),
            selectedWindowSize,
            windows: Object.fromEntries(distribution.map((entry) => [
                String(entry.windowSize),
                Number(entry.probability.toFixed(6))
            ]))
        };
    }

    const totalAttempts = Math.max(1, Object.values(executionStats)
        .reduce((sum, stat) => sum + resolveScoreStats(stat, scoringPolicy, normalizedCurrentWave).attempts, 0));
    if (EXP3_POLICY_MODES.has(scoringPolicy.mode) || TSALLIS_POLICY_MODES.has(scoringPolicy.mode)) {
        const effectiveAttempts = resolveAdversarialEffectiveAttempts({
            catalog: list,
            executionStats,
            selectionPolicyConfig: scoringPolicy,
            currentWave: normalizedCurrentWave,
            fallbackAttempts: totalAttempts
        });
        if (EXP3_POLICY_MODES.has(scoringPolicy.mode)) {
            const exp3Runtime = resolveExp3RuntimeParameters(scoringPolicy, total, effectiveAttempts);
            selectionProbabilities = resolveExp3IxDistribution({
                catalog: list,
                executionStats,
                effectiveAttempts,
                selectionPolicyConfig: scoringPolicy,
                currentWave: normalizedCurrentWave
            });
            policyProbabilities = {
                mode: scoringPolicy.mode,
                explorationGamma: Number(exp3Runtime.explorationGamma.toFixed(6)),
                implicitGamma: Number(exp3Runtime.implicitGamma.toFixed(6)),
                eta: Number(exp3Runtime.eta.toFixed(6)),
                effectiveAttempts: Number(effectiveAttempts.toFixed(6)),
                autoGamma: Boolean(scoringPolicy.exp3AutoGamma),
                autoEta: Boolean(scoringPolicy.exp3AutoEta),
                ...(EXP3_SHARE_POLICY_MODES.has(scoringPolicy.mode)
                    ? {
                        shareAlpha: Number(scoringPolicy.exp3ShareAlpha.toFixed(6))
                    }
                    : {}),
                ...(scoringPolicy.mode === 'rexp3_ix'
                    ? {
                        restartInterval: parsePositiveInt(
                            scoringPolicy.exp3RestartInterval,
                            DEFAULT_EXP3_RESTART_INTERVAL
                        )
                    }
                    : {})
            };
        } else {
            const tsallisRuntime = resolveTsallisRuntimeParameters(scoringPolicy, total, effectiveAttempts);
            selectionProbabilities = resolveTsallisInfDistribution({
                catalog: list,
                executionStats,
                effectiveAttempts,
                selectionPolicyConfig: scoringPolicy,
                currentWave: normalizedCurrentWave
            });
            policyProbabilities = {
                mode: scoringPolicy.mode,
                explorationGamma: Number(tsallisRuntime.explorationGamma.toFixed(6)),
                implicitGamma: Number(tsallisRuntime.implicitGamma.toFixed(6)),
                eta: Number(tsallisRuntime.eta.toFixed(6)),
                etaScale: Number(tsallisRuntime.etaScale.toFixed(6)),
                effectiveAttempts: Number(effectiveAttempts.toFixed(6)),
                autoGamma: Boolean(scoringPolicy.exp3AutoGamma),
                autoEta: Boolean(scoringPolicy.tsallisAutoEta)
            };
        }
    }

    const ranked = [];
    const cooled = [];
    for (let index = 0; index < total; index++) {
        const candidate = list[index];
        const key = String(candidate?.id ?? candidate);
        if (selectedKeySet.has(key)) continue;
        const stat = normalizeExecutionStat(executionStats[key]);
        const scoreStats = resolveScoreStats(stat, scoringPolicy, normalizedCurrentWave);
        let score;
        let featureVector = null;
        if (THOMPSON_POLICY_MODES.has(scoringPolicy.mode)) {
            score = computeEpsilonThompsonScore(
                stat,
                normalizedCurrentWave,
                adaptiveScoreConfig,
                scoringPolicy,
                `${selectionScope}:${scoringPolicy.mode}:${key}:${normalizedCurrentWave}:${scoreStats.attempts}:${scoreStats.successes}:${scoreStats.failures}`,
                bayesianMetaPrior
            );
        } else if (BAYESIAN_BOOTSTRAP_POLICY_MODES.has(scoringPolicy.mode)) {
            score = computeBayesianBootstrapThompsonScore(
                stat,
                normalizedCurrentWave,
                adaptiveScoreConfig,
                scoringPolicy,
                `${selectionScope}:${scoringPolicy.mode}:${key}:${normalizedCurrentWave}:${scoreStats.attempts}:${scoreStats.successes}:${scoreStats.failures}`
            );
        } else if (BOLTZMANN_GUMBEL_POLICY_MODES.has(scoringPolicy.mode)) {
            score = computeBoltzmannGumbelScore(
                stat,
                normalizedCurrentWave,
                adaptiveScoreConfig,
                scoringPolicy,
                `${selectionScope}:${scoringPolicy.mode}:${key}:${normalizedCurrentWave}:${scoreStats.attempts}:${scoreStats.successes}:${scoreStats.failures}`
            );
        } else if (PHE_POLICY_MODES.has(scoringPolicy.mode)) {
            score = computePheScore(
                stat,
                normalizedCurrentWave,
                adaptiveScoreConfig,
                scoringPolicy,
                `${selectionScope}:${scoringPolicy.mode}:${key}:${normalizedCurrentWave}:${scoreStats.attempts}:${scoreStats.successes}:${scoreStats.failures}`
            );
        } else if (KL_UCB_POLICY_MODES.has(scoringPolicy.mode)) {
            score = computeKlUcbScore(
                stat,
                totalAttempts,
                normalizedCurrentWave,
                adaptiveScoreConfig,
                scoringPolicy,
                bayesianMetaPrior
            );
        } else if (BAYES_UCB_POLICY_MODES.has(scoringPolicy.mode)) {
            score = computeBayesUcbScore(
                stat,
                normalizedCurrentWave,
                adaptiveScoreConfig,
                scoringPolicy
            );
        } else if (
            scoringPolicy.mode === 'moss_anytime'
            || scoringPolicy.mode === 'sw_moss_anytime'
            || scoringPolicy.mode === 'd_moss_anytime'
        ) {
            score = computeMossAnytimeScore(
                stat,
                totalAttempts,
                total,
                normalizedCurrentWave,
                adaptiveScoreConfig,
                scoringPolicy
            );
        } else if (
            scoringPolicy.mode === 'ucb_tuned'
            || scoringPolicy.mode === 'sw_ucb_tuned'
            || scoringPolicy.mode === 'd_ucb_tuned'
        ) {
            score = computeUcbTunedScore(
                stat,
                totalAttempts,
                normalizedCurrentWave,
                adaptiveScoreConfig,
                scoringPolicy
            );
        } else if (
            scoringPolicy.mode === 'ucb_v'
            || scoringPolicy.mode === 'sw_ucb_v'
            || scoringPolicy.mode === 'd_ucb_v'
        ) {
            score = computeUcbVarianceScore(
                stat,
                totalAttempts,
                normalizedCurrentWave,
                adaptiveScoreConfig,
                scoringPolicy
            );
        } else if (RISK_AWARE_UCB_POLICY_MODES.has(scoringPolicy.mode)) {
            score = computeMeanVarianceUcbScore(
                stat,
                totalAttempts,
                normalizedCurrentWave,
                adaptiveScoreConfig,
                scoringPolicy
            );
        } else if (MULTI_WINDOW_UCB_POLICY_MODES.has(scoringPolicy.mode)) {
            score = computeMultiWindowUcbScore(
                stat,
                totalAttempts,
                normalizedCurrentWave,
                adaptiveScoreConfig,
                scoringPolicy
            );
        } else if (
            scoringPolicy.mode === 'linucb'
            || scoringPolicy.mode === 'sw_linucb'
            || scoringPolicy.mode === 'd_linucb'
            || scoringPolicy.mode === 'adwin_linucb'
        ) {
            const linucb = computeLinUcbScore({
                stat,
                currentWave: normalizedCurrentWave,
                adaptiveScoreConfig,
                selectionPolicyConfig: scoringPolicy,
                contextualBanditModel
            });
            score = linucb.score;
            featureVector = linucb.featureVector;
        } else if (CONTEXTUAL_THOMPSON_POLICY_MODES.has(scoringPolicy.mode)) {
            const linearTs = computeLinearThompsonScore({
                stat,
                currentWave: normalizedCurrentWave,
                adaptiveScoreConfig,
                selectionPolicyConfig: scoringPolicy,
                contextualBanditModel,
                seedText: `${selectionScope}:${scoringPolicy.mode}:${key}:${normalizedCurrentWave}:${scoreStats.attempts}:${scoreStats.successes}:${scoreStats.failures}`
            });
            score = linearTs.score;
            featureVector = linearTs.featureVector;
        } else if (EXP3_POLICY_MODES.has(scoringPolicy.mode) || TSALLIS_POLICY_MODES.has(scoringPolicy.mode)) {
            const adjustments = computeAdaptiveAdjustments(scoreStats, normalizedCurrentWave, adaptiveScoreConfig);
            const probability = Number(selectionProbabilities[key] || 0);
            score = probability
                - adjustments.failurePenalty
                + adjustments.recentOutcomeBonus
                + adjustments.staleBoost;
        } else {
            score = computeUcbScore(
                stat,
                totalAttempts,
                normalizedCurrentWave,
                adaptiveScoreConfig,
                scoringPolicy
            );
        }
        score -= computeReliabilityFloorPenalty(scoreStats, scoringPolicy);
        score -= computeLatencySlaPenalty(scoreStats, scoringPolicy);
        score -= computeLatencyTailPenalty(scoreStats, scoringPolicy);
        score -= computeLatencyCvarPenalty(scoreStats, scoringPolicy);
        score -= computeFailureBurstPenalty(scoreStats, scoringPolicy);
        score -= computeLatencyBurstPenalty(scoreStats, scoringPolicy);

        const item = {
            candidate,
            key,
            score,
            featureVector,
            distance: cursorDistance(index, pointer, total),
            cooled: isInFailureCooldown(
                stat,
                normalizedCurrentWave,
                failureCooldownWaves,
                `${selectionScope}:${key}`
            )
        };
        if (item.cooled) cooled.push(item);
        else ranked.push(item);
    }

    ranked.sort((left, right) => {
        if (right.score !== left.score) return right.score - left.score;
        return left.distance - right.distance;
    });
    cooled.sort((left, right) => left.distance - right.distance);

    for (const item of [...ranked, ...cooled]) {
        if (selected.length >= limit) break;
        selected.push(item.candidate);
        selectedKeySet.add(item.key);
        if (Array.isArray(item.featureVector) && item.featureVector.length > 0) {
            selectionFeatures[item.key] = {
                names: LINUCB_FEATURE_NAMES.slice(),
                values: item.featureVector.map((value) => Number(Number(value).toFixed(6)))
            };
        }
    }

    return {
        selected,
        nextCursor: pointer,
        selectedPolicy,
        appliedSelectionPolicyConfig,
        selectedPolicyProbability,
        policyProbabilities,
        selectionFeatures,
        selectionProbabilities
    };
}

export function buildAutonomousBatchPlan({
    skillCatalog,
    capabilityCatalog,
    state,
    skillsPerWave = 20,
    capabilitiesPerWave = 10,
    failureCooldownWaves = DEFAULT_FAILURE_COOLDOWN_WAVES,
    adaptiveScoreConfig = null,
    selectionPolicyConfig = null,
    skillCatalogSource = 'manifest',
    waveIndex = 0,
    nowFactory = Date.now
}) {
    const normalizedState = normalizeState(state);
    const nowMs = safeNow(nowFactory);
    const normalizedWaveIndex = parseNonNegativeInt(waveIndex, normalizedState.runCount + 1);
    const normalizedAdaptiveScoreConfig = normalizeAdaptiveScoreConfig(adaptiveScoreConfig);
    const normalizedSelectionPolicyConfig = normalizeSelectionPolicyConfig(selectionPolicyConfig);

    const skillSuccessfulSet = new Set(normalizedState.successfulSkillIds.map((value) => String(value)));
    const capabilitySuccessfulSet = new Set(normalizedState.successfulCapabilityIds.map((value) => String(value)));

    const skillSelection = selectCatalogSlice({
        catalog: skillCatalog,
        cursor: normalizedState.skillCursor,
        limit: parseNonNegativeInt(skillsPerWave, 0),
        successfulSet: skillSuccessfulSet,
        executionStats: normalizedState.skillExecutionStats,
        currentWave: normalizedWaveIndex,
        failureCooldownWaves: normalizeFailureCooldownWaves(failureCooldownWaves),
        adaptiveScoreConfig: normalizedAdaptiveScoreConfig,
        selectionPolicyConfig: normalizedSelectionPolicyConfig,
        policyExecutionStats: normalizedState.policyExecutionStats.skills,
        windowPolicyExecutionStats: normalizedState.windowPolicyExecutionStats.skills,
        contextualBanditModel: normalizedState.contextualBanditModels.skills,
        selectionScope: 'skills'
    });

    const capabilitySelection = selectCatalogSlice({
        catalog: capabilityCatalog,
        cursor: normalizedState.capabilityCursor,
        limit: parseNonNegativeInt(capabilitiesPerWave, 0),
        successfulSet: capabilitySuccessfulSet,
        executionStats: normalizedState.capabilityExecutionStats,
        currentWave: normalizedWaveIndex,
        failureCooldownWaves: normalizeFailureCooldownWaves(failureCooldownWaves),
        adaptiveScoreConfig: normalizedAdaptiveScoreConfig,
        selectionPolicyConfig: normalizedSelectionPolicyConfig,
        policyExecutionStats: normalizedState.policyExecutionStats.capabilities,
        windowPolicyExecutionStats: normalizedState.windowPolicyExecutionStats.capabilities,
        contextualBanditModel: normalizedState.contextualBanditModels.capabilities,
        selectionScope: 'capabilities'
    });

    const tasks = [];

    for (let i = 0; i < skillSelection.selected.length; i++) {
        const entry = skillSelection.selected[i];
        const taskCreatedAt = nowMs + i;
        const skillCode = normalizeSkillCode(entry.code, entry.id);
        const featureKey = String(entry.id);
        const selectionFeatures = skillSelection.selectionFeatures[featureKey]
            || {
                names: LINUCB_FEATURE_NAMES.slice(),
                values: computeSelectionFeatureVector(
                    normalizedState.skillExecutionStats[featureKey],
                    normalizedWaveIndex
                )
            };
        tasks.push(buildTaskRequest({
            from: 'agent:autonomous-openclaw',
            target: 'agent:skills-runtime',
            priority: 'high',
            task: `[AUTO][${skillCode}] Execute ${entry.title}`,
            context: {
                planner: 'cognition-core/autonomous-openclaw',
                autonomy: {
                    lane: 'skills',
                    wave: waveIndex,
                    sourceCatalog: skillCatalogSource,
                    selectionPolicyApplied: skillSelection.selectedPolicy,
                    selectionPolicyConfig: skillSelection.appliedSelectionPolicyConfig,
                    selectionPolicyProbability: Number.isFinite(Number(skillSelection.selectedPolicyProbability))
                        ? Number(skillSelection.selectedPolicyProbability)
                        : null,
                    selectionFeatures,
                    selectionProbability: Number(skillSelection.selectionProbabilities[featureKey] || 0)
                },
                skillId: entry.id,
                skillCode,
                missionId: `autonomy-wave-${waveIndex}-skill-${entry.id}`,
                skillBlueprint: {
                    code: skillCode,
                    title: entry.title,
                    reason: typeof entry.reason === 'string' ? entry.reason : '',
                    sourceCatalog: skillCatalogSource
                },
                skillInput: buildSkillInput(entry.id, waveIndex, taskCreatedAt)
            },
            createdAt: taskCreatedAt
        }));
    }

    for (let i = 0; i < capabilitySelection.selected.length; i++) {
        const capabilityId = capabilitySelection.selected[i];
        const taskCreatedAt = nowMs + skillSelection.selected.length + i;
        const featureKey = String(capabilityId);
        const selectionFeatures = capabilitySelection.selectionFeatures[featureKey]
            || {
                names: LINUCB_FEATURE_NAMES.slice(),
                values: computeSelectionFeatureVector(
                    normalizedState.capabilityExecutionStats[featureKey],
                    normalizedWaveIndex
                )
            };
        tasks.push(buildTaskRequest({
            from: 'agent:autonomous-openclaw',
            target: 'agent:capability-runtime',
            priority: 'normal',
            task: `[AUTO][capability:${capabilityId}] Evaluate capability status`,
            context: {
                planner: 'cognition-core/autonomous-openclaw',
                autonomy: {
                    lane: 'capabilities',
                    wave: waveIndex,
                    selectionPolicyApplied: capabilitySelection.selectedPolicy,
                    selectionPolicyConfig: capabilitySelection.appliedSelectionPolicyConfig,
                    selectionPolicyProbability: Number.isFinite(Number(capabilitySelection.selectedPolicyProbability))
                        ? Number(capabilitySelection.selectedPolicyProbability)
                        : null,
                    selectionFeatures,
                    selectionProbability: Number(capabilitySelection.selectionProbabilities[featureKey] || 0)
                },
                capabilityId,
                capabilityInput: buildCapabilityInput(capabilityId, waveIndex, taskCreatedAt)
            },
            createdAt: taskCreatedAt
        }));
    }

    return {
        tasks,
        selection: {
            skillIds: skillSelection.selected.map((entry) => entry.id),
            capabilityIds: capabilitySelection.selected.slice(),
            policy: {
                skills: skillSelection.selectedPolicy,
                capabilities: capabilitySelection.selectedPolicy
            },
            policyProbabilities: {
                skills: skillSelection.policyProbabilities,
                capabilities: capabilitySelection.policyProbabilities
            }
        },
        nextCursor: {
            skillCursor: skillSelection.nextCursor,
            capabilityCursor: capabilitySelection.nextCursor
        }
    };
}

function recordRecentOutcome(stat, { status, wave, propensity = null, reward = null, durationMs = null }) {
    const normalized = normalizeExecutionStat(stat);
    const normalizedStatus = normalizeStatus(status);
    const explicitPropensity = Number(propensity);
    const normalizedPropensity = Number.isFinite(explicitPropensity)
        ? clamp(explicitPropensity, Number.EPSILON, 1)
        : null;
    const explicitReward = Number(reward);
    const explicitDurationMs = Number(durationMs);
    normalized.recentOutcomes.push({
        wave: parseNonNegativeInt(wave, 0),
        status: normalizedStatus,
        reward: Number.isFinite(explicitReward)
            ? clamp(explicitReward, 0, 1)
            : getStatusReward(normalizedStatus),
        durationMs: Number.isFinite(explicitDurationMs) && explicitDurationMs > 0
            ? clamp(explicitDurationMs, 1, MAX_LATENCY_TARGET_MS)
            : null,
        propensity: normalizedPropensity,
        didSucceed: SUCCESS_STATUSES.has(normalizedStatus)
    });
    normalized.recentOutcomes = normalized.recentOutcomes.slice(-MAX_RECENT_OUTCOMES_TRACKED);
    return normalized;
}

function extractSelectionFeatureVector(context) {
    const values = context?.autonomy?.selectionFeatures?.values;
    if (!Array.isArray(values)) return null;
    const vector = normalizeNumericVector(values, LINUCB_FEATURE_NAMES.length, 0);
    if (vector.length !== LINUCB_FEATURE_NAMES.length) return null;
    return vector;
}

function updateLinUcbModelDiscounted(model, featureVector, reward, discountFactor = 1) {
    const normalizedModel = normalizeLinUcbModel(model);
    const vector = normalizeNumericVector(featureVector, LINUCB_FEATURE_NAMES.length, 0);
    const boundedReward = clamp(Number(reward), 0, 1);
    const boundedDiscount = clamp(
        Number.isFinite(Number(discountFactor)) ? Number(discountFactor) : DEFAULT_DISCOUNT_FACTOR,
        MIN_DISCOUNT_FACTOR,
        1
    );
    for (let row = 0; row < vector.length; row++) {
        normalizedModel.vectorB[row] = (boundedDiscount * normalizedModel.vectorB[row])
            + (vector[row] * boundedReward);
        for (let col = 0; col < vector.length; col++) {
            normalizedModel.matrixA[row][col] *= boundedDiscount;
        }
        // Keep ridge regularization stable while discounting historical mass.
        normalizedModel.matrixA[row][row] += (1 - boundedDiscount);
        for (let col = 0; col < vector.length; col++) {
            normalizedModel.matrixA[row][col] += vector[row] * vector[col];
        }
    }
    normalizedModel.recentObservations = [
        ...normalizedModel.recentObservations,
        {
            reward: boundedReward,
            featureVector: vector
        }
    ].slice(-MAX_CONTEXTUAL_OBSERVATIONS_TRACKED);
    normalizedModel.samples += 1;
    return normalizedModel;
}

export async function collectAutonomousCoverage({
    storePath,
    nowFactory = Date.now
}) {
    const store = new FileTaskStore({
        filePath: storePath,
        now: nowFactory
    });
    const records = await store.loadRecords();

    const successfulSkillIds = new Set();
    const failedSkillIds = new Set();
    const successfulCapabilityIds = new Set();
    const failedCapabilityIds = new Set();
    const skillExecutionStats = {};
    const capabilityExecutionStats = {};
    const policyExecutionStats = normalizePolicyExecutionStats({});
    const windowPolicyExecutionStats = normalizeWindowPolicyExecutionStats({});
    const contextualBanditModels = normalizeContextualBanditModels({});

    for (const record of records) {
        const status = normalizeStatus(record?.status);
        if (!TERMINAL_STATUSES.has(status)) continue;

        const context = record?.request?.context && typeof record.request.context === 'object'
            ? record.request.context
            : {};
        const lane = context.autonomy?.lane === 'skills' || context.autonomy?.lane === 'capabilities'
            ? context.autonomy.lane
            : null;
        const selectedPolicy = typeof context.autonomy?.selectionPolicyApplied === 'string'
            ? context.autonomy.selectionPolicyApplied.trim().toLowerCase()
            : '';
        const selectedPolicyConfig = normalizeSelectionPolicyConfig(context.autonomy?.selectionPolicyConfig);

        const skillId = toSkillId(context.skillId);
        const capabilityId = normalizeCapabilityId(context.capabilityId);
        const attemptAt = Number.isFinite(Number(record?.updatedAt))
            ? Number(record.updatedAt)
            : (Number.isFinite(Number(record?.request?.createdAt))
                ? Number(record.request.createdAt)
                : safeNow(nowFactory));
        const attemptWave = parseNonNegativeInt(
            record?.request?.context?.autonomy?.wave ?? context.autonomy?.wave,
            0
        );
        const didSucceed = SUCCESS_STATUSES.has(status);
        const recordDurationMs = resolveOutcomeDurationMs(record);
        const selectionProbability = Number.isFinite(Number(context.autonomy?.selectionProbability))
            ? clamp(Number(context.autonomy.selectionProbability), Number.EPSILON, 1)
            : null;
        const selectionPolicyProbability = Number.isFinite(Number(context.autonomy?.selectionPolicyProbability))
            ? clamp(Number(context.autonomy.selectionPolicyProbability), Number.EPSILON, 1)
            : null;
        const skillHistoryOutcomes = skillId !== null
            ? normalizeExecutionStat(skillExecutionStats[String(skillId)]).recentOutcomes
            : [];
        const capabilityHistoryOutcomes = capabilityId
            ? normalizeExecutionStat(capabilityExecutionStats[capabilityId]).recentOutcomes
            : [];
        const policyHistoryOutcomes = lane && SUPPORTED_SELECTION_POLICY_MODE_SET.has(selectedPolicy)
            ? normalizePolicyPerformanceStat(policyExecutionStats[lane][selectedPolicy]).recentOutcomes
            : [];
        const latencyHistoryOutcomes = policyHistoryOutcomes.length > 0
            ? policyHistoryOutcomes
            : (skillHistoryOutcomes.length > 0 ? skillHistoryOutcomes : capabilityHistoryOutcomes);
        const reward = getOutcomeReward(
            status,
            record,
            selectedPolicyConfig,
            latencyHistoryOutcomes
        );

        if (skillId !== null) {
            const key = String(skillId);
            let current = normalizeExecutionStat(skillExecutionStats[key]);
            current.attempts += 1;
            if (didSucceed) {
                current.successes += 1;
                current.consecutiveFailures = 0;
                successfulSkillIds.add(skillId);
            } else {
                current.failures += 1;
                current.consecutiveFailures += 1;
                failedSkillIds.add(skillId);
            }
            current.lastStatus = status;
            current.lastAttemptAt = attemptAt;
            current.lastWave = attemptWave > 0 ? attemptWave : current.lastWave;
            current = recordRecentOutcome(current, {
                status,
                wave: attemptWave,
                propensity: selectionProbability,
                reward,
                durationMs: recordDurationMs
            });
            skillExecutionStats[key] = current;
        }

        if (capabilityId) {
            let current = normalizeExecutionStat(capabilityExecutionStats[capabilityId]);
            current.attempts += 1;
            if (didSucceed) {
                current.successes += 1;
                current.consecutiveFailures = 0;
                successfulCapabilityIds.add(capabilityId);
            } else {
                current.failures += 1;
                current.consecutiveFailures += 1;
                failedCapabilityIds.add(capabilityId);
            }
            current.lastStatus = status;
            current.lastAttemptAt = attemptAt;
            current.lastWave = attemptWave > 0 ? attemptWave : current.lastWave;
            current = recordRecentOutcome(current, {
                status,
                wave: attemptWave,
                propensity: selectionProbability,
                reward,
                durationMs: recordDurationMs
            });
            capabilityExecutionStats[capabilityId] = current;
        }

        if (lane && SUPPORTED_SELECTION_POLICY_MODE_SET.has(selectedPolicy)) {
            const currentPolicy = normalizePolicyPerformanceStat(policyExecutionStats[lane][selectedPolicy]);
            currentPolicy.attempts += 1;
            if (didSucceed) {
                currentPolicy.successes += 1;
                currentPolicy.consecutiveFailures = 0;
            } else {
                currentPolicy.failures += 1;
                currentPolicy.consecutiveFailures += 1;
            }
            currentPolicy.cumulativeReward += reward;
            currentPolicy.lastStatus = status;
            currentPolicy.lastWave = attemptWave > 0 ? attemptWave : currentPolicy.lastWave;
            const policyWithOutcome = recordRecentOutcome(currentPolicy, {
                status,
                wave: attemptWave,
                propensity: selectionPolicyProbability ?? selectionProbability,
                reward,
                durationMs: recordDurationMs
            });
            policyWithOutcome.cumulativeReward = currentPolicy.cumulativeReward;
            policyExecutionStats[lane][selectedPolicy] = policyWithOutcome;
        }

        if (lane && selectedPolicy === 'bob_sw_ucb') {
            const selectedWindowSize = parsePositiveInt(
                selectedPolicyConfig.selectedWindowSize,
                selectedPolicyConfig.slidingWindowSize
            );
            if (selectedWindowSize > 0) {
                const key = String(selectedWindowSize);
                const currentMeta = normalizePolicyPerformanceStat(windowPolicyExecutionStats[lane][key]);
                currentMeta.attempts += 1;
                if (didSucceed) {
                    currentMeta.successes += 1;
                    currentMeta.consecutiveFailures = 0;
                } else {
                    currentMeta.failures += 1;
                    currentMeta.consecutiveFailures += 1;
                }
                currentMeta.cumulativeReward += reward;
                currentMeta.lastStatus = status;
                currentMeta.lastWave = attemptWave > 0 ? attemptWave : currentMeta.lastWave;
                const metaWithOutcome = recordRecentOutcome(currentMeta, {
                    status,
                    wave: attemptWave,
                    propensity: selectionPolicyProbability ?? selectionProbability,
                    reward,
                    durationMs: recordDurationMs
                });
                metaWithOutcome.cumulativeReward = currentMeta.cumulativeReward;
                windowPolicyExecutionStats[lane][key] = metaWithOutcome;
            }
        }

        if (lane && (selectedPolicy === 'linucb'
            || selectedPolicy === 'sw_linucb'
            || selectedPolicy === 'd_linucb'
            || selectedPolicy === 'adwin_linucb'
            || selectedPolicy === 'lints'
            || selectedPolicy === 'sw_lints'
            || selectedPolicy === 'd_lints'
            || selectedPolicy === 'adwin_lints')) {
            const featureVector = extractSelectionFeatureVector(context);
            if (featureVector) {
                const discountFactor = selectedPolicy === 'd_linucb' || selectedPolicy === 'd_lints'
                    ? selectedPolicyConfig.discountFactor
                    : 1;
                contextualBanditModels[lane] = updateLinUcbModelDiscounted(
                    contextualBanditModels[lane],
                    featureVector,
                    reward,
                    discountFactor
                );
            }
        }
    }

    return {
        successfulSkillIds: [...successfulSkillIds].sort((a, b) => a - b),
        failedSkillIds: [...failedSkillIds].sort((a, b) => a - b),
        successfulCapabilityIds: [...successfulCapabilityIds].sort(),
        failedCapabilityIds: [...failedCapabilityIds].sort(),
        skillExecutionStats: normalizeSkillExecutionStats(skillExecutionStats),
        capabilityExecutionStats: normalizeCapabilityExecutionStats(capabilityExecutionStats),
        policyExecutionStats: normalizePolicyExecutionStats(policyExecutionStats),
        windowPolicyExecutionStats: normalizeWindowPolicyExecutionStats(windowPolicyExecutionStats),
        contextualBanditModels: normalizeContextualBanditModels(contextualBanditModels)
    };
}

function mergeUniqueNumeric(left = [], right = []) {
    return [...new Set([...left, ...right].map((value) => toSkillId(value)).filter(Boolean))].sort((a, b) => a - b);
}

function mergeUniqueString(left = [], right = []) {
    return [...new Set([...left, ...right].map((value) => normalizeCapabilityId(value)).filter(Boolean))].sort();
}

function mergeExecutionStats(existingStats = {}, incomingStats = {}) {
    const merged = {};
    const existing = existingStats && typeof existingStats === 'object' ? existingStats : {};
    const incoming = incomingStats && typeof incomingStats === 'object' ? incomingStats : {};
    const keys = new Set([...Object.keys(existing), ...Object.keys(incoming)]);

    for (const key of keys) {
        const previous = normalizeExecutionStat(existing[key]);
        const next = normalizeExecutionStat(incoming[key]);
        merged[key] = next.attempts >= previous.attempts ? next : previous;
    }

    return merged;
}

function mergePolicyExecutionStats(existingStats = {}, incomingStats = {}) {
    const existing = normalizePolicyExecutionStats(existingStats);
    const incoming = normalizePolicyExecutionStats(incomingStats);
    const merged = normalizePolicyExecutionStats({});

    for (const lane of ['skills', 'capabilities']) {
        for (const policy of SUPPORTED_SELECTION_POLICY_MODES) {
            const previous = normalizePolicyPerformanceStat(existing[lane][policy]);
            const next = normalizePolicyPerformanceStat(incoming[lane][policy]);
            merged[lane][policy] = next.attempts >= previous.attempts ? next : previous;
        }
    }

    return merged;
}

function mergeWindowPolicyExecutionStats(existingStats = {}, incomingStats = {}) {
    const previous = normalizeWindowPolicyExecutionStats(existingStats);
    const next = normalizeWindowPolicyExecutionStats(incomingStats);
    const merged = normalizeWindowPolicyExecutionStats({});

    for (const lane of ['skills', 'capabilities']) {
        const keys = new Set([
            ...Object.keys(previous[lane]),
            ...Object.keys(next[lane])
        ]);
        for (const key of keys) {
            const prior = normalizePolicyPerformanceStat(previous[lane][key]);
            const incomingStat = normalizePolicyPerformanceStat(next[lane][key]);
            merged[lane][key] = incomingStat.attempts >= prior.attempts ? incomingStat : prior;
        }
    }

    return merged;
}

function mergeLinUcbModels(existingModel = {}, incomingModel = {}) {
    const previous = normalizeLinUcbModel(existingModel);
    const next = normalizeLinUcbModel(incomingModel);
    return next.samples >= previous.samples ? next : previous;
}

function mergeContextualBanditModels(existingModels = {}, incomingModels = {}) {
    const previous = normalizeContextualBanditModels(existingModels);
    const next = normalizeContextualBanditModels(incomingModels);
    return {
        skills: mergeLinUcbModels(previous.skills, next.skills),
        capabilities: mergeLinUcbModels(previous.capabilities, next.capabilities)
    };
}

function createCoverageReport({
    skillCatalog,
    capabilityCatalog,
    state
}) {
    return {
        skills: computeCoverageSummary(
            skillCatalog.map((entry) => entry.id),
            state.successfulSkillIds,
            state.failedSkillIds
        ),
        capabilities: computeCoverageSummary(
            capabilityCatalog,
            state.successfulCapabilityIds,
            state.failedCapabilityIds
        )
    };
}

async function sleep(ms) {
    const duration = parseNonNegativeInt(ms, 0);
    if (duration <= 0) return;
    await new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
}

export function renderAutonomousRunMarkdown(reportPayload) {
    const report = reportPayload && typeof reportPayload === 'object' ? reportPayload : {};
    const coverage = report.coverage || {};

    const lines = [
        '# Autonomous OpenClaw Run',
        '',
        `- stopReason: ${report.stopReason || 'unknown'}`,
        `- wavesRun: ${report.wavesRun || 0}`,
        `- skillCatalogSource: ${report.config?.skillCatalogSource || 'unknown'}`,
        `- skillCatalogPath: ${report.config?.skillCatalogPath || 'n/a'}`,
        `- hardeningProfilePath: ${report.config?.skillHardeningProfilePath || 'n/a'}`,
        `- selectionPolicy: ${report.config?.selectionPolicy?.mode || 'unknown'}`,
        `- planned.skillTasks: ${report.totals?.plannedSkillTasks || 0}`,
        `- planned.capabilityTasks: ${report.totals?.plannedCapabilityTasks || 0}`,
        `- dispatched: ${report.totals?.dispatched || 0}`,
        `- resultsAccepted: ${report.totals?.resultsAccepted || 0}`,
        `- followupTasksSaved: ${report.totals?.followupTasksSaved || 0}`,
        `- botSkillHardeningBlocked: ${report.totals?.botSkillHardeningBlocked || 0}`,
        `- botRetriesAttempted: ${report.totals?.botRetriesAttempted || 0}`,
        `- botRetriesRecovered: ${report.totals?.botRetriesRecovered || 0}`,
        `- botRetriesExhausted: ${report.totals?.botRetriesExhausted || 0}`,
        `- botRetriesBudgetExhausted: ${report.totals?.botRetriesBudgetExhausted || 0}`,
        `- botAttemptTimeouts: ${report.totals?.botAttemptTimeouts || 0}`,
        `- botCircuitBreakerOpened: ${report.totals?.botCircuitBreakerOpened || 0}`,
        `- botCircuitBreakerOpenSkips: ${report.totals?.botCircuitBreakerOpenSkips || 0}`,
        `- botCircuitBreakerHalfOpenProbes: ${report.totals?.botCircuitBreakerHalfOpenProbes || 0}`,
        `- botCircuitBreakerClosed: ${report.totals?.botCircuitBreakerClosed || 0}`,
        '',
        '## Coverage',
        '',
        `- skills: ${(Number(coverage.skills?.coverage || 0) * 100).toFixed(2)}% (${coverage.skills?.successful || 0}/${coverage.skills?.total || 0})`,
        `- capabilities: ${(Number(coverage.capabilities?.coverage || 0) * 100).toFixed(2)}% (${coverage.capabilities?.successful || 0}/${coverage.capabilities?.total || 0})`,
        '',
        '## Waves',
        ''
    ];

    const waves = Array.isArray(report.waves) ? report.waves : [];
    if (waves.length === 0) {
        lines.push('- none');
    } else {
        for (const wave of waves) {
            lines.push(`- wave ${wave.wave}: skillTasks=${wave.planned.skillTasks} capabilityTasks=${wave.planned.capabilityTasks} policy.skills=${wave.selection?.policy?.skills || 'n/a'} policy.capabilities=${wave.selection?.policy?.capabilities || 'n/a'} accepted=${wave.enqueue.accepted} skipped=${wave.enqueue.skipped} stopReason=${wave.worker.stopReason}`);
        }
    }

    return lines.join('\n');
}

export async function writeAutonomousRunReport({
    report,
    jsonPath = null,
    markdownPath = null
}) {
    if (typeof jsonPath === 'string' && jsonPath.trim()) {
        const resolved = path.resolve(jsonPath);
        fs.mkdirSync(path.dirname(resolved), { recursive: true });
        fs.writeFileSync(resolved, `${JSON.stringify(report, null, 2)}\n`);
    }

    if (typeof markdownPath === 'string' && markdownPath.trim()) {
        const resolved = path.resolve(markdownPath);
        fs.mkdirSync(path.dirname(resolved), { recursive: true });
        fs.writeFileSync(resolved, `${renderAutonomousRunMarkdown(report)}\n`);
    }
}

export async function runAutonomousOpenClaw({
    repoRoot = detectOpenClawRepoRoot(process.cwd()),
    skillCatalogPath = null,
    storePath = path.resolve(process.cwd(), '../swarm-protocol/state/tasks.journal.jsonl'),
    outboxDir = path.resolve(process.cwd(), '../swarm-protocol/state/outbox'),
    archiveDir = path.join(path.resolve(process.cwd(), '../swarm-protocol/state/outbox'), 'processed'),
    statePath = path.resolve(process.cwd(), 'reports/autonomous-openclaw/state.json'),
    waves = 1,
    skillsPerWave = 25,
    capabilitiesPerWave = 12,
    dispatchLimit = 100,
    workerCycles = 12,
    workerIdleCycles = 2,
    sleepMs = 0,
    stopOnFullCoverage = true,
    failureRate = 0,
    botRuntime = true,
    botAgentId = 'agent:openclaw-bot',
    skillHardeningPolicy = 'enforce',
    skillHardeningMinScore = 82,
    skillDeployabilityIndexPath = null,
    skillHardeningProfilePath = null,
    botMaxAttempts = 2,
    botRetryBaseDelayMs = 200,
    botRetryMaxDelayMs = 5_000,
    botRetryJitter = 0.2,
    botAttemptTimeoutMs = 120_000,
    botRetryBudgetRatio = 0,
    botCircuitBreakerFailureThreshold = 0,
    botCircuitBreakerCooldownMs = 30_000,
    botCircuitBreakerCooldownBackoffMultiplier = 1,
    botCircuitBreakerMaxCooldownMs = 180_000,
    botCircuitBreakerHalfOpenMaxProbes = 1,
    botCircuitBreakerHalfOpenSuccessThreshold = 1,
    botCircuitBreakerFailureRateThreshold = 0,
    botCircuitBreakerFailureRateWindow = 20,
    botCircuitBreakerFailureRateMinSamples = 8,
    enqueueFollowupTasks = true,
    failureCooldownWaves = DEFAULT_FAILURE_COOLDOWN_WAVES,
    adaptiveScoreConfig = null,
    selectionPolicyConfig = null,
    nowFactory = Date.now
} = {}) {
    const resolvedRepoRoot = path.resolve(repoRoot);
    const resolvedStorePath = path.resolve(storePath);
    const resolvedOutboxDir = path.resolve(outboxDir);
    const resolvedArchiveDir = path.resolve(archiveDir);
    const resolvedDeployabilityIndexPath = typeof skillDeployabilityIndexPath === 'string' && skillDeployabilityIndexPath.trim()
        ? path.resolve(skillDeployabilityIndexPath)
        : path.join(resolvedRepoRoot, 'skills', 'state', 'skills.deployability.index.json');
    const effectiveDeployabilityIndexPath = fs.existsSync(resolvedDeployabilityIndexPath)
        ? resolvedDeployabilityIndexPath
        : null;
    const resolvedHardeningProfilePath = typeof skillHardeningProfilePath === 'string' && skillHardeningProfilePath.trim()
        ? path.resolve(skillHardeningProfilePath)
        : path.join(resolvedRepoRoot, 'skills', 'state', 'skills.hardening.profile.json');
    const effectiveHardeningProfilePath = fs.existsSync(resolvedHardeningProfilePath)
        ? resolvedHardeningProfilePath
        : null;

    const normalizedWaves = parsePositiveInt(waves, 1);
    const normalizedSkillsPerWave = parseNonNegativeInt(skillsPerWave, 0);
    const normalizedCapabilitiesPerWave = parseNonNegativeInt(capabilitiesPerWave, 0);
    const normalizedFailureCooldownWaves = normalizeFailureCooldownWaves(failureCooldownWaves);
    const normalizedAdaptiveScoreConfig = normalizeAdaptiveScoreConfig(adaptiveScoreConfig);
    const normalizedSelectionPolicyConfig = normalizeSelectionPolicyConfig(selectionPolicyConfig);

    const skillCatalogSource = loadSkillCatalogSource({
        repoRoot: resolvedRepoRoot,
        skillCatalogPath
    });
    const skillCatalog = skillCatalogSource.entries;
    const capabilityCatalog = loadCapabilityCatalog(resolvedRepoRoot);

    let state = loadAutonomousState(statePath);

    const totals = {
        plannedSkillTasks: 0,
        plannedCapabilityTasks: 0,
        enqueuedAccepted: 0,
        enqueuedSaved: 0,
        enqueuedSkipped: 0,
        dispatched: 0,
        resultsAccepted: 0,
        followupTasksSaved: 0,
        botTasksExecuted: 0,
        botTasksFailed: 0,
        botSkillHardeningBlocked: 0,
        botRetriesAttempted: 0,
        botRetriesRecovered: 0,
        botRetriesExhausted: 0,
        botRetriesBudgetExhausted: 0,
        botAttemptTimeouts: 0,
        botCircuitBreakerOpened: 0,
        botCircuitBreakerOpenSkips: 0,
        botCircuitBreakerHalfOpenProbes: 0,
        botCircuitBreakerClosed: 0
    };

    const waveReports = [];
    let stopReason = 'max_waves_reached';

    for (let wave = 1; wave <= normalizedWaves; wave++) {
        const plan = buildAutonomousBatchPlan({
            skillCatalog,
            capabilityCatalog,
            state,
            skillsPerWave: normalizedSkillsPerWave,
            capabilitiesPerWave: normalizedCapabilitiesPerWave,
            failureCooldownWaves: normalizedFailureCooldownWaves,
            adaptiveScoreConfig: normalizedAdaptiveScoreConfig,
            selectionPolicyConfig: normalizedSelectionPolicyConfig,
            skillCatalogSource: skillCatalogSource.source,
            waveIndex: state.runCount + 1,
            nowFactory
        });

        const entries = plan.tasks.map((request) => ({
            source: `autonomous-openclaw:wave-${wave}`,
            request
        }));

        // eslint-disable-next-line no-await-in-loop
        const enqueueResult = await enqueueTaskEntries({
            storePath: resolvedStorePath,
            entries,
            actor: 'agent:autonomous-openclaw',
            nowFactory
        });

        // eslint-disable-next-line no-await-in-loop
        const workerReport = await runBotWorkerLoop({
            storePath: resolvedStorePath,
            outboxDir: resolvedOutboxDir,
            archiveDir: resolvedArchiveDir,
            localAgentId: 'agent:main',
            dispatchLimit: parsePositiveInt(dispatchLimit, 100),
            includeAllCreated: false,
            maxCycles: parsePositiveInt(workerCycles, 12),
            idleCyclesToStop: parsePositiveInt(workerIdleCycles, 2),
            stopWhenOnlyApprovals: true,
            sleepMs: 0,
            etaMs: 1_000,
            resultDelayMs: 500,
            failureRate: normalizeFailureRate(failureRate),
            botRuntime,
            botAgentId,
            botRepoRoot: resolvedRepoRoot,
            skillHardeningPolicy,
            skillHardeningMinScore,
            skillDeployabilityIndexPath: effectiveDeployabilityIndexPath,
            skillHardeningProfilePath: effectiveHardeningProfilePath,
            botMaxAttempts,
            botRetryBaseDelayMs,
            botRetryMaxDelayMs,
            botRetryJitter,
            botAttemptTimeoutMs,
            botRetryBudgetRatio,
            botCircuitBreakerFailureThreshold,
            botCircuitBreakerCooldownMs,
            botCircuitBreakerCooldownBackoffMultiplier,
            botCircuitBreakerMaxCooldownMs,
            botCircuitBreakerHalfOpenMaxProbes,
            botCircuitBreakerHalfOpenSuccessThreshold,
            botCircuitBreakerFailureRateThreshold,
            botCircuitBreakerFailureRateWindow,
            botCircuitBreakerFailureRateMinSamples,
            enqueueFollowupTasks,
            nowFactory
        });

        // eslint-disable-next-line no-await-in-loop
        const coverage = await collectAutonomousCoverage({
            storePath: resolvedStorePath,
            nowFactory
        });

        state = normalizeState({
            ...state,
            runCount: state.runCount + 1,
            skillCursor: plan.nextCursor.skillCursor,
            capabilityCursor: plan.nextCursor.capabilityCursor,
            successfulSkillIds: mergeUniqueNumeric(state.successfulSkillIds, coverage.successfulSkillIds),
            failedSkillIds: mergeUniqueNumeric(state.failedSkillIds, coverage.failedSkillIds),
            successfulCapabilityIds: mergeUniqueString(state.successfulCapabilityIds, coverage.successfulCapabilityIds),
            failedCapabilityIds: mergeUniqueString(state.failedCapabilityIds, coverage.failedCapabilityIds),
            skillExecutionStats: mergeExecutionStats(state.skillExecutionStats, coverage.skillExecutionStats),
            capabilityExecutionStats: mergeExecutionStats(state.capabilityExecutionStats, coverage.capabilityExecutionStats),
            policyExecutionStats: mergePolicyExecutionStats(state.policyExecutionStats, coverage.policyExecutionStats),
            windowPolicyExecutionStats: mergeWindowPolicyExecutionStats(
                state.windowPolicyExecutionStats,
                coverage.windowPolicyExecutionStats
            ),
            contextualBanditModels: mergeContextualBanditModels(state.contextualBanditModels, coverage.contextualBanditModels),
            updatedAt: safeNow(nowFactory)
        });

        saveAutonomousState(statePath, state);

        const waveReport = {
            wave,
            skillCatalogSource: skillCatalogSource.source,
            selection: plan.selection,
            planned: {
                totalTasks: plan.tasks.length,
                skillTasks: plan.selection.skillIds.length,
                capabilityTasks: plan.selection.capabilityIds.length
            },
            enqueue: {
                accepted: enqueueResult.stats.accepted,
                saved: enqueueResult.stats.saved,
                skipped: enqueueResult.skipped.length
            },
            worker: {
                stopReason: workerReport.stopReason,
                cyclesRun: workerReport.cyclesRun,
                dispatched: workerReport.totals.dispatched,
                resultsAccepted: workerReport.totals.resultsAccepted,
                followupTasksSaved: workerReport.totals.followupTasksSaved,
                botTasksExecuted: workerReport.totals.botTasksExecuted,
                botTasksFailed: workerReport.totals.botTasksFailed,
                botSkillHardeningBlocked: workerReport.totals.botSkillHardeningBlocked,
                botRetriesAttempted: workerReport.totals.botRetriesAttempted,
                botRetriesRecovered: workerReport.totals.botRetriesRecovered,
                botRetriesExhausted: workerReport.totals.botRetriesExhausted,
                botRetriesBudgetExhausted: workerReport.totals.botRetriesBudgetExhausted,
                botAttemptTimeouts: workerReport.totals.botAttemptTimeouts,
                botCircuitBreakerOpened: workerReport.totals.botCircuitBreakerOpened,
                botCircuitBreakerOpenSkips: workerReport.totals.botCircuitBreakerOpenSkips,
                botCircuitBreakerHalfOpenProbes: workerReport.totals.botCircuitBreakerHalfOpenProbes,
                botCircuitBreakerClosed: workerReport.totals.botCircuitBreakerClosed,
                finalQueueOpen: workerReport.finalQueue.open
            }
        };
        waveReports.push(waveReport);

        totals.plannedSkillTasks += waveReport.planned.skillTasks;
        totals.plannedCapabilityTasks += waveReport.planned.capabilityTasks;
        totals.enqueuedAccepted += waveReport.enqueue.accepted;
        totals.enqueuedSaved += waveReport.enqueue.saved;
        totals.enqueuedSkipped += waveReport.enqueue.skipped;
        totals.dispatched += waveReport.worker.dispatched;
        totals.resultsAccepted += waveReport.worker.resultsAccepted;
        totals.followupTasksSaved += waveReport.worker.followupTasksSaved;
        totals.botTasksExecuted += waveReport.worker.botTasksExecuted;
        totals.botTasksFailed += waveReport.worker.botTasksFailed;
        totals.botSkillHardeningBlocked += waveReport.worker.botSkillHardeningBlocked;
        totals.botRetriesAttempted += waveReport.worker.botRetriesAttempted;
        totals.botRetriesRecovered += waveReport.worker.botRetriesRecovered;
        totals.botRetriesExhausted += waveReport.worker.botRetriesExhausted;
        totals.botRetriesBudgetExhausted += waveReport.worker.botRetriesBudgetExhausted;
        totals.botAttemptTimeouts += waveReport.worker.botAttemptTimeouts;
        totals.botCircuitBreakerOpened += waveReport.worker.botCircuitBreakerOpened;
        totals.botCircuitBreakerOpenSkips += waveReport.worker.botCircuitBreakerOpenSkips;
        totals.botCircuitBreakerHalfOpenProbes += waveReport.worker.botCircuitBreakerHalfOpenProbes;
        totals.botCircuitBreakerClosed += waveReport.worker.botCircuitBreakerClosed;

        const coverageReport = createCoverageReport({
            skillCatalog,
            capabilityCatalog,
            state
        });

        if (stopOnFullCoverage
            && coverageReport.skills.coverage >= 1
            && coverageReport.capabilities.coverage >= 1) {
            stopReason = 'full_coverage';
            break;
        }

        if (wave < normalizedWaves) {
            // eslint-disable-next-line no-await-in-loop
            await sleep(sleepMs);
        }
    }

    const coverage = createCoverageReport({
        skillCatalog,
        capabilityCatalog,
        state
    });

    return {
        stopReason,
        wavesRun: waveReports.length,
        requestedWaves: normalizedWaves,
        config: {
            skillCatalogSource: skillCatalogSource.source,
            skillCatalogPath: skillCatalogSource.sourcePath,
            skillsPerWave: normalizedSkillsPerWave,
            capabilitiesPerWave: normalizedCapabilitiesPerWave,
            dispatchLimit: parsePositiveInt(dispatchLimit, 100),
            workerCycles: parsePositiveInt(workerCycles, 12),
            workerIdleCycles: parsePositiveInt(workerIdleCycles, 2),
            stopOnFullCoverage,
            failureRate: normalizeFailureRate(failureRate),
            botRuntime,
            failureCooldownWaves: normalizedFailureCooldownWaves,
            adaptiveScore: normalizedAdaptiveScoreConfig,
            selectionPolicy: normalizedSelectionPolicyConfig,
            skillHardeningPolicy,
            skillHardeningMinScore,
            skillDeployabilityIndexPath: effectiveDeployabilityIndexPath,
            skillHardeningProfilePath: effectiveHardeningProfilePath,
            botMaxAttempts: parsePositiveInt(botMaxAttempts, 2),
            botRetryBaseDelayMs: parseNonNegativeInt(botRetryBaseDelayMs, 200),
            botRetryMaxDelayMs: parseNonNegativeInt(botRetryMaxDelayMs, 5_000),
            botRetryJitter: clamp(parseNonNegativeNumber(botRetryJitter, 0.2), 0, 1),
            botAttemptTimeoutMs: parseNonNegativeInt(botAttemptTimeoutMs, 120_000),
            botRetryBudgetRatio: clamp(parseNonNegativeNumber(botRetryBudgetRatio, 0), 0, 1),
            botCircuitBreakerFailureThreshold: parseNonNegativeInt(botCircuitBreakerFailureThreshold, 0),
            botCircuitBreakerCooldownMs: parseNonNegativeInt(botCircuitBreakerCooldownMs, 30_000),
            botCircuitBreakerCooldownBackoffMultiplier: clamp(
                parseNonNegativeNumber(botCircuitBreakerCooldownBackoffMultiplier, 1),
                1,
                10
            ),
            botCircuitBreakerMaxCooldownMs: parsePositiveInt(botCircuitBreakerMaxCooldownMs, 180_000),
            botCircuitBreakerHalfOpenMaxProbes: parsePositiveInt(botCircuitBreakerHalfOpenMaxProbes, 1),
            botCircuitBreakerHalfOpenSuccessThreshold: parsePositiveInt(botCircuitBreakerHalfOpenSuccessThreshold, 1),
            botCircuitBreakerFailureRateThreshold: clamp(parseNonNegativeNumber(botCircuitBreakerFailureRateThreshold, 0), 0, 1),
            botCircuitBreakerFailureRateWindow: parsePositiveInt(botCircuitBreakerFailureRateWindow, 20),
            botCircuitBreakerFailureRateMinSamples: parsePositiveInt(botCircuitBreakerFailureRateMinSamples, 8),
            enqueueFollowupTasks
        },
        coverage,
        totals,
        state,
        waves: waveReports
    };
}
