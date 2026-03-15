import path from 'path';
import {
    SUPPORTED_SELECTION_POLICY_MODES,
    runAutonomousOpenClaw,
    writeAutonomousRunReport
} from '../src/autonomous-openclaw.js';

function printHelp() {
    const policyModes = SUPPORTED_SELECTION_POLICY_MODES.join('|');
    console.log(`Run autonomous OpenClaw skill/capability waves

Usage:
  tsx scripts/run-autonomous-openclaw.ts [options]

Options:
  --repo-root <path>           Repo root for skill/capability catalogs (default: ..)
  --skill-catalog <path>       Optional external skill catalog markdown/JSON list
  --store <path>               Queue store path (default: ../swarm-protocol/state/tasks.journal.jsonl)
  --outbox-dir <path>          Outbox directory path (default: ../swarm-protocol/state/outbox)
  --archive-dir <path>         Processed outbox archive dir (default: <outbox-dir>/processed)
  --state <path>               Persistent autonomy state path (default: reports/autonomous-openclaw/state.json)
  --waves <n>                  Number of autonomous waves to run (default: 1)
  --skills-per-wave <n>        Skill tasks to plan per wave (default: 25)
  --capabilities-per-wave <n>  Capability tasks to plan per wave (default: 12)
  --dispatch-limit <n>         Dispatch limit per worker cycle (default: 100)
  --worker-cycles <n>          Max worker cycles per wave (default: 12)
  --worker-idle-cycles <n>     Idle cycles before worker stop (default: 2)
  --sleep-ms <n>               Delay between waves in milliseconds (default: 0)
  --failure-rate <0-1>         Failure injection probability after execution (default: 0)
  --no-stop-full-coverage      Continue waves even after full skill/capability coverage
  --no-bot-runtime             Disable bot runtime execution in worker loop
  --bot-agent <id>             Bot agent id for execution/followups (default: agent:openclaw-bot)
  --skill-hardening <mode>     Skill hardening policy: off|report|enforce (default: enforce)
  --skill-min-score <n>        Minimum hardening score for deployability (default: 82)
  --deploy-index <path>        Optional skill deployability index JSON path
  --hardening-profile <path>   Optional skill hardening profile JSON path
  --bot-max-attempts <n>       Max bot execution attempts for transient failures (default: 2)
  --bot-retry-base-ms <n>      Base backoff delay in milliseconds for retries (default: 200)
  --bot-retry-max-ms <n>       Max backoff delay in milliseconds for retries (default: 5000)
  --bot-retry-jitter <0-1>     Retry delay jitter ratio (default: 0.2)
  --bot-retry-jitter-strategy <mode> Retry jitter strategy: symmetric|full|decorrelated (default: symmetric)
  --bot-retry-hint-max-ms <n>  Max delay to honor Retry-After hints from bot failures (default: 120000; 0 disables)
  --bot-retry-hint-jitter <0-1> Jitter ratio applied to retry-hint delays (default: 0.1)
  --bot-attempt-timeout-ms <n> Max milliseconds per bot attempt before timeout failure/retry (default: 120000; 0 disables)
  --bot-retry-budget-ratio <0-1> Retry budget tokens earned per task to prevent retry storms (default: 0; disabled)
  --bot-circuit-breaker-failures <n> Open breaker after this many consecutive transient failures (default: 0; disabled)
  --bot-circuit-breaker-failure-rate-threshold <0-1> Open breaker when rolling transient failure rate crosses threshold (default: 0; disabled)
  --bot-circuit-breaker-failure-rate-window <n> Rolling sample window used for failure-rate thresholding (default: 20)
  --bot-circuit-breaker-failure-rate-min-samples <n> Min rolling samples before failure-rate threshold can open breaker (default: 8)
  --bot-circuit-breaker-slow-call-rate-threshold <0-1> Open breaker when rolling slow-call rate crosses threshold (default: 0; disabled)
  --bot-circuit-breaker-slow-call-duration-ms <n> Duration threshold in ms for classifying slow calls (default: 120000)
  --bot-circuit-breaker-slow-call-window <n> Rolling sample window used for slow-call thresholding (default: 20)
  --bot-circuit-breaker-slow-call-min-samples <n> Min rolling samples before slow-call threshold can open breaker (default: 8)
  --bot-circuit-breaker-cooldown-ms <n> Circuit-breaker cooldown before half-open probe (default: 30000)
  --bot-circuit-breaker-cooldown-backoff-multiplier <n> Circuit-breaker cooldown growth multiplier per consecutive reopen (1-10, default: 1)
  --bot-circuit-breaker-cooldown-jitter <0-1> Positive jitter added to breaker cooldown windows (default: 0; disabled)
  --bot-circuit-breaker-max-cooldown-ms <n> Max cooldown cap after repeated reopens (default: 180000)
  --bot-circuit-breaker-half-open-max-probes <n> Max probes allowed while half-open before reopening (default: 1)
  --bot-circuit-breaker-half-open-successes <n> Successful half-open probes required to close breaker (default: 1)
  --selection-policy <mode>    Selection policy: ${policyModes} (default: ucb)
  --linucb-alpha <n>           Exploration multiplier for linucb (0-5, default: 0.6)
  --lints-alpha <n>            Posterior covariance scale for lints (0-5, default: 0.5)
  --thompson-exploration <n>   Thompson posterior sampling weight 0-1 (default: 0.2)
  --thompson-prior-alpha <n>   Thompson prior alpha (>0, default: 1)
  --thompson-prior-beta <n>    Thompson prior beta (>0, default: 1)
  --thompson-meta-prior-strength <n>  Pseudocount strength for empirical global Bayesian prior (0-500, default: 0)
  --thompson-uncertainty-weight <n>  Uncertainty bonus scaling for auto_epsilon_ts* (0-2, default: 0.5)
  --thompson-hazard-rate <n>   Base changepoint hazard for cp_epsilon_ts* (0-0.5, default: 0.08)
  --thompson-surprise-sensitivity <n>  Surprise-to-hazard scaling for cp_epsilon_ts* (0-5, default: 1)
  --thompson-top-two-probability <n>  Leader probability for tt_epsilon_ts (0-1, challenger gets 1-p, default: 0.8)
  --hybrid-ts-aggregation <m>  Aggregation mode for fdsw_* hybrid policies: min|mean|max|adaptive (default: mean)
  --discount-factor <n>        Exponential forgetting factor for d_* policies (0.5-1, default: 0.97)
  --latency-penalty-weight <n> Latency penalty weight for reward shaping (0-1, default: 0)
  --latency-target-ms <n>      Reward-shaping latency target in milliseconds (1-3600000, default: 120000)
  --latency-auto-target        Auto-tune latency target from recent completion durations
  --latency-auto-target-percentile <n> Percentile for auto target (0.5-0.999, default: 0.9)
  --latency-auto-target-min-samples <n> Min recent samples before auto target activates (1-128, default: 8)
  --latency-auto-target-window-size <n> Recency window for latency auto target (1-128, default: 32)
  --latency-auto-target-blend <n> Blend adaptive and static latency targets (0-1, default: 1)
  --reliability-floor <n>      Reliability guardrail floor (Wilson LCB) subtracted from ranking gap (0-1, default: 0)
  --reliability-floor-min-attempts <n> Min attempts before reliability floor penalties activate (default: 8)
  --latency-sla-ms <n>         Latency SLA deadline in milliseconds for conservative on-time guardrail (1-3600000, default: 120000)
  --latency-sla-floor <n>      On-time SLA floor (Wilson LCB) subtracted from ranking gap when missed (0-1, default: 0)
  --latency-sla-min-attempts <n> Min measured attempts before latency SLA penalties activate (default: 8)
  --latency-tail-penalty-weight <n> Tail-latency ranking penalty weight against latency target overruns (0-1, default: 0)
  --latency-tail-percentile <n> Tail percentile used for risk penalty (0.5-0.999, default: 0.95)
  --latency-tail-min-samples <n> Min measured durations before tail-latency penalties activate (default: 8)
  --latency-cvar-penalty-weight <n> CVaR tail-latency ranking penalty weight against latency target overruns (0-1, default: 0)
  --latency-cvar-percentile <n> Tail percentile used to form CVaR tail set (0.5-0.999, default: 0.95)
  --latency-cvar-min-samples <n> Min measured durations before CVaR penalties activate (default: 8)
  --failure-burst-penalty-weight <n> Short-vs-long window failure-burst penalty weight (0-1, default: 0)
  --failure-burst-short-window <n> Short recency window used to estimate burst failures (2-64, default: 8)
  --failure-burst-long-window <n> Long recency window baseline for failure bursts (2-256, default: 32)
  --failure-burst-min-attempts <n> Min recent attempts before failure-burst penalties activate (default: 8)
  --failure-burst-threshold <n> Short/long failure-rate ratio threshold before penalties (1-5, default: 1.5)
  --latency-burst-penalty-weight <n> Short-vs-long window latency-SLA miss burst penalty weight (0-1, default: 0)
  --latency-burst-short-window <n> Short recency window used to estimate latency-SLA miss bursts (2-64, default: 8)
  --latency-burst-long-window <n> Long recency window baseline for latency-SLA miss bursts (2-256, default: 32)
  --latency-burst-min-attempts <n> Min measured attempts before latency-burst penalties activate (default: 8)
  --latency-burst-threshold <n> Short/long latency-SLA miss-rate ratio threshold before penalties (1-5, default: 1.5)
  --kl-ucb-confidence <n>      Confidence multiplier for kl_ucb* policies (default: 3)
  --bayes-ucb-quantile <n>     Bayes-UCB posterior quantile for optimistic index (0.5-0.999, default: 0.9)
  --exp3-ix-gamma <n>          Exploration mixing gamma for exp3_ix* (0-0.5, default: 0.07)
  --exp3-implicit-gamma <n>    Implicit-exploration denominator gamma for exp3_ix* (0-0.5, default: eta/2 unless overridden)
  --exp3-iw-cap <n>            Max implicit importance weight for exp3_ix*/corral_exp3* loss estimates (1-1000, default: 50)
  --exp3-ix-eta <n>            Exponential weight scale for exp3_ix* (>0 to 10, default: 1)
  --exp3-auto-gamma            Auto-tune adversarial exploration gamma via sqrt((K*log(K+1))/((e-1)*N))
  --exp3-auto-eta              Auto-tune exp3_ix eta via sqrt((2*log(K+1))/(N*K)); defaults implicit gamma to eta/2 unless overridden
  --exp3-share-alpha <n>       Share-mixing strength for exp3_s* (0-1, default: 0.08)
  --exp3-restart-interval <n>  Epoch length for rexp3_ix periodic restarts (default: 12)
  --tsallis-eta-scale <n>      Learning-rate scale for tsallis_inf* (0-10, default: 1)
  --tsallis-auto-eta           Auto-tune tsallis_inf* eta via (4*scale)/sqrt(N)
  --moss-alpha <n>             Exploration multiplier for moss_anytime (>0 to 10, default: 1)
  --ucb-v-exploration <n>      Exploration multiplier for ucb_v* (>0 to 5, default: 1)
  --risk-variance-weight <n>   Variance penalty for mv_ucb* risk-aware scoring (0-5, default: 0.6)
  --boltzmann-gumbel-c <n>     Exploration constant for bge* policies (>0 to 5, default: 0.5)
  --phe-perturbation-scale <n> Pseudoreward scale a for phe* policies (>0 to 10, default: 2)
  --bob-gamma <n>              Exploration floor for bob_sw_ucb window meta-bandit (0-0.8, default: 0.12)
  --window-size <n>            Sliding-window size for sw_* policies (default: 12)
  --multi-window-sizes <list>  Comma-separated window sizes for mw_ucb (default: 4,8,16,32)
  --cd-min-samples <n>         Min outcomes before change detection in cd_* / glr_* and sw_* variants (default: 8)
  --cd-threshold <n>           Drift threshold for cd_* Page-Hinkley and glr_* detectors (default: 1.5)
  --cd-delta <n>               Mean slack delta for cd_* detectors and GLR confidence term (default: 0.02)
  --adwin-delta <n>            ADWIN confidence delta for adwin_* modes (1e-6 to 0.5, default: 0.002)
  --cd-direction <m>           Drift direction for cd_*/cusum_* detectors: up|down|both (default: both)
  --cusum-threshold <n>        Drift threshold for cusum_* and sw_cusum_* modes (default: 1.2)
  --cusum-baseline-weight <n>  EWMA baseline weight for cusum_* and sw_cusum_* modes (0-1, default: 0.15)
  --corral-gamma <n>           Exploration mix for corral_exp3* (0-0.8, default: 0.12)
  --corral-auto-gamma          Auto-tune corral_exp3* gamma via sqrt((K*log(K+1))/((e-1)*N)) using effective expert horizon
  --corral-eta <n>             Exponential implicit-loss scaling for corral_exp3* (>0 to 5, default: 0.8)
  --corral-auto-eta            Auto-tune corral_exp3* eta via sqrt((2*log(K+1))/(N*K)) using effective expert horizon
  --corral-min-attempts <n>    Minimum expert attempts before corral_exp3* fully exploits (>=0, default: 0)
  --corral-forced-exploration <n> Forced probability mass for under-sampled corral experts (0-1, default: 0.25)
  --corral-uncertainty-weight <n>  UCB-style uncertainty bonus weight for under-sampled corral experts (0-3, default: 0.35)
  --no-enqueue-followups       Disable enqueueing generated follow-up tasks
  --json <path>                Optional JSON report output
  --markdown <path>            Optional markdown report output
  -h, --help                   Show help
`);
}

function parsePositiveInt(raw, flag, allowZero = false) {
    const value = Number(raw);
    const minimum = allowZero ? 0 : 1;
    if (!Number.isInteger(value) || value < minimum) {
        throw new Error(`${flag} must be an integer >= ${minimum}`);
    }
    return value;
}

function parseFailureRate(raw) {
    const value = Number(raw);
    if (!Number.isFinite(value) || value < 0 || value > 1) {
        throw new Error('--failure-rate must be between 0 and 1');
    }
    return value;
}

function parseHardeningPolicy(raw) {
    const value = String(raw || '').trim().toLowerCase();
    if (value !== 'off' && value !== 'report' && value !== 'enforce') {
        throw new Error('--skill-hardening must be one of: off, report, enforce');
    }
    return value;
}

function parseHardeningScore(raw) {
    const value = Number(raw);
    if (!Number.isFinite(value) || !Number.isInteger(value) || value < 1 || value > 100) {
        throw new Error('--skill-min-score must be an integer between 1 and 100');
    }
    return value;
}

function parseFloatInRange(raw, flag, min, max) {
    const value = Number(raw);
    if (!Number.isFinite(value) || value < min || value > max) {
        throw new Error(`${flag} must be a number between ${min} and ${max}`);
    }
    return value;
}

function parsePositiveFloat(raw, flag) {
    const value = Number(raw);
    if (!Number.isFinite(value) || value <= 0) {
        throw new Error(`${flag} must be a positive number`);
    }
    return value;
}

function parseRetryJitterStrategy(raw, flag) {
    const value = String(raw || '').trim().toLowerCase();
    if (value !== 'symmetric' && value !== 'full' && value !== 'decorrelated') {
        throw new Error(`${flag} must be one of: symmetric, full, decorrelated`);
    }
    return value;
}

function parseSelectionPolicy(raw) {
    const value = String(raw || '').trim().toLowerCase();
    if (!SUPPORTED_SELECTION_POLICY_MODES.includes(value)) {
        throw new Error(`--selection-policy must be one of: ${SUPPORTED_SELECTION_POLICY_MODES.join(', ')}`);
    }
    return value;
}

function parseChangeDetectionDirection(raw) {
    const value = String(raw || '').trim().toLowerCase();
    if (value !== 'up' && value !== 'down' && value !== 'both') {
        throw new Error('--cd-direction must be one of: up, down, both');
    }
    return value;
}

function parseMultiWindowSizes(raw) {
    const tokens = String(raw || '')
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);
    if (tokens.length === 0) {
        throw new Error('--multi-window-sizes must include at least one integer');
    }
    const values = tokens.map((value) => parsePositiveInt(value, '--multi-window-sizes'));
    return [...new Set(values)];
}

function parseArgs(argv) {
    const defaultOutbox = path.resolve(process.cwd(), '../swarm-protocol/state/outbox');
    const options = {
        repoRoot: path.resolve(process.cwd(), '..'),
        skillCatalogPath: null,
        storePath: path.resolve(process.cwd(), '../swarm-protocol/state/tasks.journal.jsonl'),
        outboxDir: defaultOutbox,
        archiveDir: path.join(defaultOutbox, 'processed'),
        statePath: path.resolve(process.cwd(), 'reports/autonomous-openclaw/state.json'),
        waves: 1,
        skillsPerWave: 25,
        capabilitiesPerWave: 12,
        dispatchLimit: 100,
        workerCycles: 12,
        workerIdleCycles: 2,
        sleepMs: 0,
        failureRate: 0,
        stopOnFullCoverage: true,
        botRuntime: true,
        botAgentId: 'agent:openclaw-bot',
        skillHardeningPolicy: 'enforce',
        skillHardeningMinScore: 82,
        skillDeployabilityIndexPath: null,
        skillHardeningProfilePath: null,
        botMaxAttempts: 2,
        botRetryBaseDelayMs: 200,
        botRetryMaxDelayMs: 5_000,
        botRetryJitter: 0.2,
        botRetryJitterStrategy: 'symmetric',
        botRetryHintMaxDelayMs: 120_000,
        botRetryHintJitter: 0.1,
        botAttemptTimeoutMs: 120_000,
        botRetryBudgetRatio: 0,
        botCircuitBreakerFailureThreshold: 0,
        botCircuitBreakerFailureRateThreshold: 0,
        botCircuitBreakerFailureRateWindow: 20,
        botCircuitBreakerFailureRateMinSamples: 8,
        botCircuitBreakerSlowCallRateThreshold: 0,
        botCircuitBreakerSlowCallDurationMs: 120_000,
        botCircuitBreakerSlowCallWindow: 20,
        botCircuitBreakerSlowCallMinSamples: 8,
        botCircuitBreakerCooldownMs: 30_000,
        botCircuitBreakerCooldownBackoffMultiplier: 1,
        botCircuitBreakerCooldownJitter: 0,
        botCircuitBreakerMaxCooldownMs: 180_000,
        botCircuitBreakerHalfOpenMaxProbes: 1,
        botCircuitBreakerHalfOpenSuccessThreshold: 1,
        enqueueFollowupTasks: true,
        selectionPolicyConfig: {
            mode: 'ucb',
            linucbAlpha: 0.6,
            lintsAlpha: 0.5,
            thompsonExploration: 0.2,
            thompsonPriorAlpha: 1,
            thompsonPriorBeta: 1,
            thompsonMetaPriorStrength: 0,
            thompsonUncertaintyWeight: 0.5,
            thompsonHazardRate: 0.08,
            thompsonSurpriseSensitivity: 1,
            thompsonTopTwoProbability: 0.8,
            hybridTsAggregation: 'mean',
            discountFactor: 0.97,
            latencyPenaltyWeight: 0,
            latencyTargetMs: 120_000,
            latencyAutoTarget: false,
            latencyAutoTargetPercentile: 0.9,
            latencyAutoTargetMinSamples: 8,
            latencyAutoTargetWindowSize: 32,
            latencyAutoTargetBlend: 1,
            reliabilityFloor: 0,
            reliabilityFloorMinAttempts: 8,
            latencySlaMs: 120_000,
            latencySlaFloor: 0,
            latencySlaMinAttempts: 8,
            latencyTailPenaltyWeight: 0,
            latencyTailPercentile: 0.95,
            latencyTailMinSamples: 8,
            latencyCvarPenaltyWeight: 0,
            latencyCvarPercentile: 0.95,
            latencyCvarMinSamples: 8,
            failureBurstPenaltyWeight: 0,
            failureBurstShortWindow: 8,
            failureBurstLongWindow: 32,
            failureBurstMinAttempts: 8,
            failureBurstThreshold: 1.5,
            latencyBurstPenaltyWeight: 0,
            latencyBurstShortWindow: 8,
            latencyBurstLongWindow: 32,
            latencyBurstMinAttempts: 8,
            latencyBurstThreshold: 1.5,
            klUcbConfidence: 3,
            bayesUcbQuantile: 0.9,
            exp3ExplorationGamma: 0.07,
            exp3ImplicitGamma: null,
            exp3IxEta: 1,
            exp3AutoGamma: false,
            exp3AutoEta: false,
            exp3ShareAlpha: 0.08,
            exp3RestartInterval: 12,
            tsallisEtaScale: 1,
            tsallisAutoEta: false,
            mossAlpha: 1,
            ucbVExploration: 1,
            riskVarianceWeight: 0.6,
            boltzmannGumbelC: 0.5,
            bobGamma: 0.12,
            phePerturbationScale: 2,
            slidingWindowSize: 12,
            multiWindowSizes: [4, 8, 16, 32],
            changeDetectionMinSamples: 8,
            changeDetectionThreshold: 1.5,
            changeDetectionDelta: 0.02,
            adwinDelta: 0.002,
            changeDetectionDirection: 'both',
            cusumThreshold: 1.2,
            cusumBaselineWeight: 0.15,
            corralGamma: 0.12,
            corralEta: 0.8,
            corralAutoGamma: false,
            corralAutoEta: false,
            corralMinPolicyAttempts: 0,
            corralForcedExploration: 0.25,
            corralUncertaintyWeight: 0.35
        },
        jsonPath: null,
        markdownPath: null,
        help: false
    };

    for (let i = 0; i < argv.length; i++) {
        const token = argv[i];

        if (token === '--help' || token === '-h') {
            options.help = true;
            continue;
        }
        if (token === '--no-stop-full-coverage') {
            options.stopOnFullCoverage = false;
            continue;
        }
        if (token === '--no-bot-runtime') {
            options.botRuntime = false;
            continue;
        }
        if (token === '--no-enqueue-followups') {
            options.enqueueFollowupTasks = false;
            continue;
        }
        if (token === '--exp3-auto-eta') {
            options.selectionPolicyConfig.exp3AutoEta = true;
            continue;
        }
        if (token === '--exp3-auto-gamma') {
            options.selectionPolicyConfig.exp3AutoGamma = true;
            continue;
        }
        if (token === '--tsallis-auto-eta') {
            options.selectionPolicyConfig.tsallisAutoEta = true;
            continue;
        }
        if (token === '--corral-auto-eta') {
            options.selectionPolicyConfig.corralAutoEta = true;
            continue;
        }
        if (token === '--corral-auto-gamma') {
            options.selectionPolicyConfig.corralAutoGamma = true;
            continue;
        }
        if (token === '--latency-auto-target') {
            options.selectionPolicyConfig.latencyAutoTarget = true;
            continue;
        }

        const value = argv[i + 1];
        if (value === undefined) {
            throw new Error(`Missing value for ${token}`);
        }

        if (token === '--repo-root') {
            options.repoRoot = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--skill-catalog') {
            options.skillCatalogPath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--store') {
            options.storePath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--outbox-dir') {
            options.outboxDir = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--archive-dir') {
            options.archiveDir = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--state') {
            options.statePath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--waves') {
            options.waves = parsePositiveInt(value, '--waves');
            i++;
            continue;
        }
        if (token === '--skills-per-wave') {
            options.skillsPerWave = parsePositiveInt(value, '--skills-per-wave', true);
            i++;
            continue;
        }
        if (token === '--capabilities-per-wave') {
            options.capabilitiesPerWave = parsePositiveInt(value, '--capabilities-per-wave', true);
            i++;
            continue;
        }
        if (token === '--dispatch-limit') {
            options.dispatchLimit = parsePositiveInt(value, '--dispatch-limit');
            i++;
            continue;
        }
        if (token === '--worker-cycles') {
            options.workerCycles = parsePositiveInt(value, '--worker-cycles');
            i++;
            continue;
        }
        if (token === '--worker-idle-cycles') {
            options.workerIdleCycles = parsePositiveInt(value, '--worker-idle-cycles');
            i++;
            continue;
        }
        if (token === '--sleep-ms') {
            options.sleepMs = parsePositiveInt(value, '--sleep-ms', true);
            i++;
            continue;
        }
        if (token === '--failure-rate') {
            options.failureRate = parseFailureRate(value);
            i++;
            continue;
        }
        if (token === '--bot-agent') {
            options.botAgentId = value;
            i++;
            continue;
        }
        if (token === '--skill-hardening') {
            options.skillHardeningPolicy = parseHardeningPolicy(value);
            i++;
            continue;
        }
        if (token === '--skill-min-score') {
            options.skillHardeningMinScore = parseHardeningScore(value);
            i++;
            continue;
        }
        if (token === '--deploy-index') {
            options.skillDeployabilityIndexPath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--hardening-profile') {
            options.skillHardeningProfilePath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--bot-max-attempts') {
            options.botMaxAttempts = parsePositiveInt(value, '--bot-max-attempts');
            i++;
            continue;
        }
        if (token === '--bot-retry-base-ms') {
            options.botRetryBaseDelayMs = parsePositiveInt(value, '--bot-retry-base-ms', true);
            i++;
            continue;
        }
        if (token === '--bot-retry-max-ms') {
            options.botRetryMaxDelayMs = parsePositiveInt(value, '--bot-retry-max-ms', true);
            i++;
            continue;
        }
        if (token === '--bot-retry-jitter') {
            options.botRetryJitter = parseFloatInRange(value, '--bot-retry-jitter', 0, 1);
            i++;
            continue;
        }
        if (token === '--bot-retry-jitter-strategy') {
            options.botRetryJitterStrategy = parseRetryJitterStrategy(value, '--bot-retry-jitter-strategy');
            i++;
            continue;
        }
        if (token === '--bot-retry-hint-max-ms') {
            options.botRetryHintMaxDelayMs = parsePositiveInt(value, '--bot-retry-hint-max-ms', true);
            i++;
            continue;
        }
        if (token === '--bot-retry-hint-jitter') {
            options.botRetryHintJitter = parseFloatInRange(value, '--bot-retry-hint-jitter', 0, 1);
            i++;
            continue;
        }
        if (token === '--bot-attempt-timeout-ms') {
            options.botAttemptTimeoutMs = parsePositiveInt(value, '--bot-attempt-timeout-ms', true);
            i++;
            continue;
        }
        if (token === '--bot-retry-budget-ratio') {
            options.botRetryBudgetRatio = parseFloatInRange(value, '--bot-retry-budget-ratio', 0, 1);
            i++;
            continue;
        }
        if (token === '--bot-circuit-breaker-failures') {
            options.botCircuitBreakerFailureThreshold = parsePositiveInt(value, '--bot-circuit-breaker-failures', true);
            i++;
            continue;
        }
        if (token === '--bot-circuit-breaker-failure-rate-threshold') {
            options.botCircuitBreakerFailureRateThreshold = parseFloatInRange(value, '--bot-circuit-breaker-failure-rate-threshold', 0, 1);
            i++;
            continue;
        }
        if (token === '--bot-circuit-breaker-failure-rate-window') {
            options.botCircuitBreakerFailureRateWindow = parsePositiveInt(value, '--bot-circuit-breaker-failure-rate-window');
            i++;
            continue;
        }
        if (token === '--bot-circuit-breaker-failure-rate-min-samples') {
            options.botCircuitBreakerFailureRateMinSamples = parsePositiveInt(value, '--bot-circuit-breaker-failure-rate-min-samples');
            i++;
            continue;
        }
        if (token === '--bot-circuit-breaker-slow-call-rate-threshold') {
            options.botCircuitBreakerSlowCallRateThreshold = parseFloatInRange(value, '--bot-circuit-breaker-slow-call-rate-threshold', 0, 1);
            i++;
            continue;
        }
        if (token === '--bot-circuit-breaker-slow-call-duration-ms') {
            options.botCircuitBreakerSlowCallDurationMs = parsePositiveInt(value, '--bot-circuit-breaker-slow-call-duration-ms');
            i++;
            continue;
        }
        if (token === '--bot-circuit-breaker-slow-call-window') {
            options.botCircuitBreakerSlowCallWindow = parsePositiveInt(value, '--bot-circuit-breaker-slow-call-window');
            i++;
            continue;
        }
        if (token === '--bot-circuit-breaker-slow-call-min-samples') {
            options.botCircuitBreakerSlowCallMinSamples = parsePositiveInt(value, '--bot-circuit-breaker-slow-call-min-samples');
            i++;
            continue;
        }
        if (token === '--bot-circuit-breaker-cooldown-ms') {
            options.botCircuitBreakerCooldownMs = parsePositiveInt(value, '--bot-circuit-breaker-cooldown-ms', true);
            i++;
            continue;
        }
        if (token === '--bot-circuit-breaker-cooldown-backoff-multiplier') {
            options.botCircuitBreakerCooldownBackoffMultiplier = parseFloatInRange(
                value,
                '--bot-circuit-breaker-cooldown-backoff-multiplier',
                1,
                10
            );
            i++;
            continue;
        }
        if (token === '--bot-circuit-breaker-cooldown-jitter') {
            options.botCircuitBreakerCooldownJitter = parseFloatInRange(
                value,
                '--bot-circuit-breaker-cooldown-jitter',
                0,
                1
            );
            i++;
            continue;
        }
        if (token === '--bot-circuit-breaker-max-cooldown-ms') {
            options.botCircuitBreakerMaxCooldownMs = parsePositiveInt(value, '--bot-circuit-breaker-max-cooldown-ms');
            i++;
            continue;
        }
        if (token === '--bot-circuit-breaker-half-open-max-probes') {
            options.botCircuitBreakerHalfOpenMaxProbes = parsePositiveInt(value, '--bot-circuit-breaker-half-open-max-probes');
            i++;
            continue;
        }
        if (token === '--bot-circuit-breaker-half-open-successes') {
            options.botCircuitBreakerHalfOpenSuccessThreshold = parsePositiveInt(value, '--bot-circuit-breaker-half-open-successes');
            i++;
            continue;
        }
        if (token === '--selection-policy') {
            options.selectionPolicyConfig.mode = parseSelectionPolicy(value);
            i++;
            continue;
        }
        if (token === '--thompson-exploration') {
            options.selectionPolicyConfig.thompsonExploration = parseFloatInRange(value, '--thompson-exploration', 0, 1);
            i++;
            continue;
        }
        if (token === '--linucb-alpha') {
            options.selectionPolicyConfig.linucbAlpha = parseFloatInRange(value, '--linucb-alpha', Number.EPSILON, 5);
            i++;
            continue;
        }
        if (token === '--lints-alpha') {
            options.selectionPolicyConfig.lintsAlpha = parseFloatInRange(value, '--lints-alpha', Number.EPSILON, 5);
            i++;
            continue;
        }
        if (token === '--thompson-prior-alpha') {
            options.selectionPolicyConfig.thompsonPriorAlpha = parsePositiveFloat(value, '--thompson-prior-alpha');
            i++;
            continue;
        }
        if (token === '--thompson-prior-beta') {
            options.selectionPolicyConfig.thompsonPriorBeta = parsePositiveFloat(value, '--thompson-prior-beta');
            i++;
            continue;
        }
        if (token === '--thompson-meta-prior-strength') {
            options.selectionPolicyConfig.thompsonMetaPriorStrength = parseFloatInRange(value, '--thompson-meta-prior-strength', 0, 500);
            i++;
            continue;
        }
        if (token === '--thompson-uncertainty-weight') {
            options.selectionPolicyConfig.thompsonUncertaintyWeight = parseFloatInRange(value, '--thompson-uncertainty-weight', 0, 2);
            i++;
            continue;
        }
        if (token === '--thompson-hazard-rate') {
            options.selectionPolicyConfig.thompsonHazardRate = parseFloatInRange(value, '--thompson-hazard-rate', 0, 0.5);
            i++;
            continue;
        }
        if (token === '--thompson-surprise-sensitivity') {
            options.selectionPolicyConfig.thompsonSurpriseSensitivity = parseFloatInRange(value, '--thompson-surprise-sensitivity', 0, 5);
            i++;
            continue;
        }
        if (token === '--thompson-top-two-probability') {
            options.selectionPolicyConfig.thompsonTopTwoProbability = parseFloatInRange(value, '--thompson-top-two-probability', 0, 1);
            i++;
            continue;
        }
        if (token === '--hybrid-ts-aggregation') {
            const mode = String(value || '').trim().toLowerCase();
            if (!['min', 'mean', 'max', 'adaptive'].includes(mode)) {
                throw new Error('--hybrid-ts-aggregation must be one of: min, mean, max, adaptive');
            }
            options.selectionPolicyConfig.hybridTsAggregation = mode;
            i++;
            continue;
        }
        if (token === '--discount-factor') {
            options.selectionPolicyConfig.discountFactor = parseFloatInRange(value, '--discount-factor', 0.5, 1);
            i++;
            continue;
        }
        if (token === '--latency-penalty-weight') {
            options.selectionPolicyConfig.latencyPenaltyWeight = parseFloatInRange(value, '--latency-penalty-weight', 0, 1);
            i++;
            continue;
        }
        if (token === '--latency-target-ms') {
            options.selectionPolicyConfig.latencyTargetMs = parsePositiveInt(value, '--latency-target-ms');
            i++;
            continue;
        }
        if (token === '--latency-auto-target-percentile') {
            options.selectionPolicyConfig.latencyAutoTargetPercentile = parseFloatInRange(value, '--latency-auto-target-percentile', 0.5, 0.999);
            i++;
            continue;
        }
        if (token === '--latency-auto-target-min-samples') {
            options.selectionPolicyConfig.latencyAutoTargetMinSamples = parsePositiveInt(value, '--latency-auto-target-min-samples');
            i++;
            continue;
        }
        if (token === '--latency-auto-target-window-size') {
            options.selectionPolicyConfig.latencyAutoTargetWindowSize = parsePositiveInt(value, '--latency-auto-target-window-size');
            i++;
            continue;
        }
        if (token === '--latency-auto-target-blend') {
            options.selectionPolicyConfig.latencyAutoTargetBlend = parseFloatInRange(value, '--latency-auto-target-blend', 0, 1);
            i++;
            continue;
        }
        if (token === '--reliability-floor') {
            options.selectionPolicyConfig.reliabilityFloor = parseFloatInRange(value, '--reliability-floor', 0, 1);
            i++;
            continue;
        }
        if (token === '--reliability-floor-min-attempts') {
            options.selectionPolicyConfig.reliabilityFloorMinAttempts = parsePositiveInt(value, '--reliability-floor-min-attempts');
            i++;
            continue;
        }
        if (token === '--latency-sla-ms') {
            options.selectionPolicyConfig.latencySlaMs = parsePositiveInt(value, '--latency-sla-ms');
            i++;
            continue;
        }
        if (token === '--latency-sla-floor') {
            options.selectionPolicyConfig.latencySlaFloor = parseFloatInRange(value, '--latency-sla-floor', 0, 1);
            i++;
            continue;
        }
        if (token === '--latency-sla-min-attempts') {
            options.selectionPolicyConfig.latencySlaMinAttempts = parsePositiveInt(value, '--latency-sla-min-attempts');
            i++;
            continue;
        }
        if (token === '--latency-tail-penalty-weight') {
            options.selectionPolicyConfig.latencyTailPenaltyWeight = parseFloatInRange(value, '--latency-tail-penalty-weight', 0, 1);
            i++;
            continue;
        }
        if (token === '--latency-tail-percentile') {
            options.selectionPolicyConfig.latencyTailPercentile = parseFloatInRange(value, '--latency-tail-percentile', 0.5, 0.999);
            i++;
            continue;
        }
        if (token === '--latency-tail-min-samples') {
            options.selectionPolicyConfig.latencyTailMinSamples = parsePositiveInt(value, '--latency-tail-min-samples');
            i++;
            continue;
        }
        if (token === '--latency-cvar-penalty-weight') {
            options.selectionPolicyConfig.latencyCvarPenaltyWeight = parseFloatInRange(value, '--latency-cvar-penalty-weight', 0, 1);
            i++;
            continue;
        }
        if (token === '--latency-cvar-percentile') {
            options.selectionPolicyConfig.latencyCvarPercentile = parseFloatInRange(value, '--latency-cvar-percentile', 0.5, 0.999);
            i++;
            continue;
        }
        if (token === '--latency-cvar-min-samples') {
            options.selectionPolicyConfig.latencyCvarMinSamples = parsePositiveInt(value, '--latency-cvar-min-samples');
            i++;
            continue;
        }
        if (token === '--failure-burst-penalty-weight') {
            options.selectionPolicyConfig.failureBurstPenaltyWeight = parseFloatInRange(value, '--failure-burst-penalty-weight', 0, 1);
            i++;
            continue;
        }
        if (token === '--failure-burst-short-window') {
            options.selectionPolicyConfig.failureBurstShortWindow = parsePositiveInt(value, '--failure-burst-short-window');
            if (options.selectionPolicyConfig.failureBurstShortWindow < 2 || options.selectionPolicyConfig.failureBurstShortWindow > 64) {
                throw new Error('--failure-burst-short-window must be an integer between 2 and 64');
            }
            i++;
            continue;
        }
        if (token === '--failure-burst-long-window') {
            options.selectionPolicyConfig.failureBurstLongWindow = parsePositiveInt(value, '--failure-burst-long-window');
            if (options.selectionPolicyConfig.failureBurstLongWindow < 2 || options.selectionPolicyConfig.failureBurstLongWindow > 256) {
                throw new Error('--failure-burst-long-window must be an integer between 2 and 256');
            }
            i++;
            continue;
        }
        if (token === '--failure-burst-min-attempts') {
            options.selectionPolicyConfig.failureBurstMinAttempts = parsePositiveInt(value, '--failure-burst-min-attempts');
            i++;
            continue;
        }
        if (token === '--failure-burst-threshold') {
            options.selectionPolicyConfig.failureBurstThreshold = parseFloatInRange(value, '--failure-burst-threshold', 1, 5);
            i++;
            continue;
        }
        if (token === '--latency-burst-penalty-weight') {
            options.selectionPolicyConfig.latencyBurstPenaltyWeight = parseFloatInRange(value, '--latency-burst-penalty-weight', 0, 1);
            i++;
            continue;
        }
        if (token === '--latency-burst-short-window') {
            options.selectionPolicyConfig.latencyBurstShortWindow = parsePositiveInt(value, '--latency-burst-short-window');
            if (options.selectionPolicyConfig.latencyBurstShortWindow < 2 || options.selectionPolicyConfig.latencyBurstShortWindow > 64) {
                throw new Error('--latency-burst-short-window must be an integer between 2 and 64');
            }
            i++;
            continue;
        }
        if (token === '--latency-burst-long-window') {
            options.selectionPolicyConfig.latencyBurstLongWindow = parsePositiveInt(value, '--latency-burst-long-window');
            if (options.selectionPolicyConfig.latencyBurstLongWindow < 2 || options.selectionPolicyConfig.latencyBurstLongWindow > 256) {
                throw new Error('--latency-burst-long-window must be an integer between 2 and 256');
            }
            i++;
            continue;
        }
        if (token === '--latency-burst-min-attempts') {
            options.selectionPolicyConfig.latencyBurstMinAttempts = parsePositiveInt(value, '--latency-burst-min-attempts');
            i++;
            continue;
        }
        if (token === '--latency-burst-threshold') {
            options.selectionPolicyConfig.latencyBurstThreshold = parseFloatInRange(value, '--latency-burst-threshold', 1, 5);
            i++;
            continue;
        }
        if (token === '--kl-ucb-confidence') {
            options.selectionPolicyConfig.klUcbConfidence = parseFloatInRange(value, '--kl-ucb-confidence', 0, 20);
            i++;
            continue;
        }
        if (token === '--bayes-ucb-quantile') {
            options.selectionPolicyConfig.bayesUcbQuantile = parseFloatInRange(value, '--bayes-ucb-quantile', 0.5, 0.999);
            i++;
            continue;
        }
        if (token === '--moss-alpha') {
            options.selectionPolicyConfig.mossAlpha = parseFloatInRange(value, '--moss-alpha', Number.EPSILON, 10);
            i++;
            continue;
        }
        if (token === '--ucb-v-exploration') {
            options.selectionPolicyConfig.ucbVExploration = parseFloatInRange(value, '--ucb-v-exploration', Number.EPSILON, 5);
            i++;
            continue;
        }
        if (token === '--risk-variance-weight') {
            options.selectionPolicyConfig.riskVarianceWeight = parseFloatInRange(value, '--risk-variance-weight', 0, 5);
            i++;
            continue;
        }
        if (token === '--boltzmann-gumbel-c') {
            options.selectionPolicyConfig.boltzmannGumbelC = parseFloatInRange(value, '--boltzmann-gumbel-c', Number.EPSILON, 5);
            i++;
            continue;
        }
        if (token === '--phe-perturbation-scale') {
            options.selectionPolicyConfig.phePerturbationScale = parseFloatInRange(value, '--phe-perturbation-scale', Number.EPSILON, 10);
            i++;
            continue;
        }
        if (token === '--bob-gamma') {
            options.selectionPolicyConfig.bobGamma = parseFloatInRange(value, '--bob-gamma', 0, 0.8);
            i++;
            continue;
        }
        if (token === '--exp3-ix-gamma') {
            options.selectionPolicyConfig.exp3ExplorationGamma = parseFloatInRange(value, '--exp3-ix-gamma', Number.EPSILON, 0.5);
            i++;
            continue;
        }
        if (token === '--exp3-implicit-gamma') {
            options.selectionPolicyConfig.exp3ImplicitGamma = parseFloatInRange(value, '--exp3-implicit-gamma', Number.EPSILON, 0.5);
            i++;
            continue;
        }
        if (token === '--exp3-iw-cap') {
            options.selectionPolicyConfig.exp3ImportanceWeightCap = parseFloatInRange(value, '--exp3-iw-cap', 1, 1000);
            i++;
            continue;
        }
        if (token === '--exp3-ix-eta') {
            options.selectionPolicyConfig.exp3IxEta = parseFloatInRange(value, '--exp3-ix-eta', Number.EPSILON, 10);
            i++;
            continue;
        }
        if (token === '--exp3-share-alpha') {
            options.selectionPolicyConfig.exp3ShareAlpha = parseFloatInRange(value, '--exp3-share-alpha', 0, 1);
            i++;
            continue;
        }
        if (token === '--exp3-restart-interval') {
            options.selectionPolicyConfig.exp3RestartInterval = parsePositiveInt(value, '--exp3-restart-interval');
            i++;
            continue;
        }
        if (token === '--tsallis-eta-scale') {
            options.selectionPolicyConfig.tsallisEtaScale = parseFloatInRange(value, '--tsallis-eta-scale', Number.EPSILON, 10);
            i++;
            continue;
        }
        if (token === '--window-size') {
            options.selectionPolicyConfig.slidingWindowSize = parsePositiveInt(value, '--window-size');
            i++;
            continue;
        }
        if (token === '--multi-window-sizes') {
            options.selectionPolicyConfig.multiWindowSizes = parseMultiWindowSizes(value);
            i++;
            continue;
        }
        if (token === '--cd-min-samples') {
            options.selectionPolicyConfig.changeDetectionMinSamples = parsePositiveInt(value, '--cd-min-samples');
            i++;
            continue;
        }
        if (token === '--cd-threshold') {
            options.selectionPolicyConfig.changeDetectionThreshold = parseFloatInRange(value, '--cd-threshold', Number.EPSILON, 10);
            i++;
            continue;
        }
        if (token === '--cd-delta') {
            options.selectionPolicyConfig.changeDetectionDelta = parseFloatInRange(value, '--cd-delta', 0, 0.5);
            i++;
            continue;
        }
        if (token === '--adwin-delta') {
            options.selectionPolicyConfig.adwinDelta = parseFloatInRange(value, '--adwin-delta', 1e-6, 0.5);
            i++;
            continue;
        }
        if (token === '--cd-direction') {
            options.selectionPolicyConfig.changeDetectionDirection = parseChangeDetectionDirection(value);
            i++;
            continue;
        }
        if (token === '--cusum-threshold') {
            options.selectionPolicyConfig.cusumThreshold = parseFloatInRange(value, '--cusum-threshold', Number.EPSILON, 20);
            i++;
            continue;
        }
        if (token === '--cusum-baseline-weight') {
            options.selectionPolicyConfig.cusumBaselineWeight = parseFloatInRange(value, '--cusum-baseline-weight', Number.EPSILON, 1);
            i++;
            continue;
        }
        if (token === '--corral-gamma') {
            options.selectionPolicyConfig.corralGamma = parseFloatInRange(value, '--corral-gamma', 0, 0.8);
            i++;
            continue;
        }
        if (token === '--corral-eta') {
            options.selectionPolicyConfig.corralEta = parseFloatInRange(value, '--corral-eta', Number.EPSILON, 5);
            i++;
            continue;
        }
        if (token === '--corral-min-attempts') {
            options.selectionPolicyConfig.corralMinPolicyAttempts = parsePositiveInt(value, '--corral-min-attempts', true);
            i++;
            continue;
        }
        if (token === '--corral-forced-exploration') {
            options.selectionPolicyConfig.corralForcedExploration = parseFloatInRange(value, '--corral-forced-exploration', 0, 1);
            i++;
            continue;
        }
        if (token === '--corral-uncertainty-weight') {
            options.selectionPolicyConfig.corralUncertaintyWeight = parseFloatInRange(value, '--corral-uncertainty-weight', 0, 3);
            i++;
            continue;
        }
        if (token === '--json') {
            options.jsonPath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--markdown') {
            options.markdownPath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }

        throw new Error(`Unknown argument: ${token}`);
    }

    if (!argv.includes('--archive-dir')) {
        options.archiveDir = path.join(options.outboxDir, 'processed');
    }

    return options;
}

function printSummary(report) {
    console.log(`Stop reason: ${report.stopReason}`);
    console.log(`Waves run: ${report.wavesRun}`);
    console.log(`Skill catalog source: ${report.config.skillCatalogSource}`);
    console.log(`Skill catalog path: ${report.config.skillCatalogPath}`);
    console.log(`Skill coverage: ${(report.coverage.skills.coverage * 100).toFixed(2)}% (${report.coverage.skills.successful}/${report.coverage.skills.total})`);
    console.log(`Capability coverage: ${(report.coverage.capabilities.coverage * 100).toFixed(2)}% (${report.coverage.capabilities.successful}/${report.coverage.capabilities.total})`);
    console.log(`Selection policy: ${report.config.selectionPolicy?.mode || 'unknown'}`);
    console.log(`Hardening profile: ${report.config.skillHardeningProfilePath}`);
    console.log(`Planned skill tasks: ${report.totals.plannedSkillTasks}`);
    console.log(`Planned capability tasks: ${report.totals.plannedCapabilityTasks}`);
    console.log(`Dispatched: ${report.totals.dispatched}`);
    console.log(`Results accepted: ${report.totals.resultsAccepted}`);
    console.log(`Follow-up tasks saved: ${report.totals.followupTasksSaved}`);
    console.log(`Bot skill hardening blocked: ${report.totals.botSkillHardeningBlocked}`);
    console.log(`Bot retries attempted: ${report.totals.botRetriesAttempted || 0}`);
    console.log(`Bot retries recovered: ${report.totals.botRetriesRecovered || 0}`);
    console.log(`Bot retries exhausted: ${report.totals.botRetriesExhausted || 0}`);
    console.log(`Bot retries budget exhausted: ${report.totals.botRetriesBudgetExhausted || 0}`);
    console.log(`Bot attempt timeouts: ${report.totals.botAttemptTimeouts || 0}`);
    console.log(`Bot circuit-breaker opened: ${report.totals.botCircuitBreakerOpened || 0}`);
    console.log(`Bot circuit-breaker open skips: ${report.totals.botCircuitBreakerOpenSkips || 0}`);
    console.log(`Bot circuit-breaker half-open probes: ${report.totals.botCircuitBreakerHalfOpenProbes || 0}`);
    console.log(`Bot circuit-breaker closed: ${report.totals.botCircuitBreakerClosed || 0}`);
}

(async () => {
    try {
        const options = parseArgs(process.argv.slice(2));
        if (options.help) {
            printHelp();
            return;
        }

        const report = await runAutonomousOpenClaw({
            repoRoot: options.repoRoot,
            skillCatalogPath: options.skillCatalogPath,
            storePath: options.storePath,
            outboxDir: options.outboxDir,
            archiveDir: options.archiveDir,
            statePath: options.statePath,
            waves: options.waves,
            skillsPerWave: options.skillsPerWave,
            capabilitiesPerWave: options.capabilitiesPerWave,
            dispatchLimit: options.dispatchLimit,
            workerCycles: options.workerCycles,
            workerIdleCycles: options.workerIdleCycles,
            sleepMs: options.sleepMs,
            stopOnFullCoverage: options.stopOnFullCoverage,
            failureRate: options.failureRate,
            botRuntime: options.botRuntime,
            botAgentId: options.botAgentId,
            skillHardeningPolicy: options.skillHardeningPolicy,
            skillHardeningMinScore: options.skillHardeningMinScore,
            skillDeployabilityIndexPath: options.skillDeployabilityIndexPath,
            skillHardeningProfilePath: options.skillHardeningProfilePath,
            botMaxAttempts: options.botMaxAttempts,
            botRetryBaseDelayMs: options.botRetryBaseDelayMs,
            botRetryMaxDelayMs: options.botRetryMaxDelayMs,
            botRetryJitter: options.botRetryJitter,
            botRetryJitterStrategy: options.botRetryJitterStrategy,
            botRetryHintMaxDelayMs: options.botRetryHintMaxDelayMs,
            botRetryHintJitter: options.botRetryHintJitter,
            botAttemptTimeoutMs: options.botAttemptTimeoutMs,
            botRetryBudgetRatio: options.botRetryBudgetRatio,
            botCircuitBreakerFailureThreshold: options.botCircuitBreakerFailureThreshold,
            botCircuitBreakerFailureRateThreshold: options.botCircuitBreakerFailureRateThreshold,
            botCircuitBreakerFailureRateWindow: options.botCircuitBreakerFailureRateWindow,
            botCircuitBreakerFailureRateMinSamples: options.botCircuitBreakerFailureRateMinSamples,
            botCircuitBreakerSlowCallRateThreshold: options.botCircuitBreakerSlowCallRateThreshold,
            botCircuitBreakerSlowCallDurationMs: options.botCircuitBreakerSlowCallDurationMs,
            botCircuitBreakerSlowCallWindow: options.botCircuitBreakerSlowCallWindow,
            botCircuitBreakerSlowCallMinSamples: options.botCircuitBreakerSlowCallMinSamples,
            botCircuitBreakerCooldownMs: options.botCircuitBreakerCooldownMs,
            botCircuitBreakerCooldownBackoffMultiplier: options.botCircuitBreakerCooldownBackoffMultiplier,
            botCircuitBreakerCooldownJitter: options.botCircuitBreakerCooldownJitter,
            botCircuitBreakerMaxCooldownMs: options.botCircuitBreakerMaxCooldownMs,
            botCircuitBreakerHalfOpenMaxProbes: options.botCircuitBreakerHalfOpenMaxProbes,
            botCircuitBreakerHalfOpenSuccessThreshold: options.botCircuitBreakerHalfOpenSuccessThreshold,
            enqueueFollowupTasks: options.enqueueFollowupTasks,
            selectionPolicyConfig: options.selectionPolicyConfig
        });

        await writeAutonomousRunReport({
            report,
            jsonPath: options.jsonPath,
            markdownPath: options.markdownPath
        });

        printSummary(report);
    } catch (error) {
        console.error(`run-autonomous-openclaw failed: ${error.message}`);
        process.exit(1);
    }
})();
