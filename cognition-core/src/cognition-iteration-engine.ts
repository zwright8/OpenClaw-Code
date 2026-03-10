function round(value, decimals = 3) {
    if (!Number.isFinite(value)) return value;
    return Number(value.toFixed(decimals));
}

function normalizeText(input) {
    if (typeof input !== 'string') return '';
    return input.trim().toLowerCase();
}

function priorityRank(priority) {
    if (priority === 'P1') return 1;
    if (priority === 'P2') return 2;
    return 3;
}

function toToolList(analysisReport) {
    if (!analysisReport || typeof analysisReport !== 'object') return [];
    if (Array.isArray(analysisReport.topTools)) {
        return analysisReport.topTools.map((tool) => ({
            name: tool.name,
            calls: Number(tool.calls) || 0,
            errorRate: Number(tool.errorRate) || 0,
            avgDurationMs: Number.isFinite(Number(tool.avgDurationMs)) ? Number(tool.avgDurationMs) : null
        }));
    }
    return Object.entries(analysisReport.tools || {}).map(([name, stats]) => ({
        name,
        calls: Number(stats?.calls) || 0,
        errorRate: Number(stats?.errorRate) || 0,
        avgDurationMs: Number.isFinite(Number(stats?.avgDurationMs)) ? Number(stats.avgDurationMs) : null
    }));
}

function createHypothesis(input) {
    const confidence = Math.max(0, Math.min(1, Number(input.confidence) || 0));
    const impact = Math.max(0, Math.min(1, Number(input.impact) || 0));
    const novelty = Math.max(0, Math.min(1, Number(input.novelty) || 0));
    const score = round((impact * 0.45) + (novelty * 0.35) + (confidence * 0.2), 3);

    return {
        id: input.id,
        priority: input.priority || 'P3',
        title: input.title,
        question: input.question,
        rationale: input.rationale,
        evidence: input.evidence || {},
        metric: input.metric || null,
        target: input.target || null,
        experiment: input.experiment || null,
        stopCondition: input.stopCondition || null,
        confidence,
        impact,
        novelty,
        score
    };
}

function noveltyScoreForKey(key, history) {
    const normalizedKey = normalizeText(key);
    if (!normalizedKey) return 0.5;
    const recent = (Array.isArray(history) ? history : []).slice(-20);
    let seen = 0;
    for (const snapshot of recent) {
        const keys = Array.isArray(snapshot?.hypothesisKeys) ? snapshot.hypothesisKeys : [];
        if (keys.some((item) => normalizeText(item) === normalizedKey)) {
            seen++;
        }
    }
    return round(1 / (1 + seen), 3);
}

function derivePosture({ readinessStatus, learningDriftLevel, memoryDriftLevel }) {
    if (readinessStatus === 'fail' || learningDriftLevel === 'critical' || memoryDriftLevel === 'critical') {
        return 'recover';
    }
    if (readinessStatus === 'warn' || learningDriftLevel === 'watch' || memoryDriftLevel === 'watch') {
        return 'stabilize';
    }
    return 'explore';
}

function explorationBudgetForPosture(posture) {
    if (posture === 'recover') {
        return { exploitPct: 0.9, explorePct: 0.1 };
    }
    if (posture === 'stabilize') {
        return { exploitPct: 0.75, explorePct: 0.25 };
    }
    return { exploitPct: 0.6, explorePct: 0.4 };
}

function hypothesisToExperiment(hypothesis) {
    return {
        id: `exp-${hypothesis.id}`,
        priority: hypothesis.priority,
        title: hypothesis.title,
        setup: hypothesis.experiment,
        metric: hypothesis.metric,
        target: hypothesis.target,
        stopCondition: hypothesis.stopCondition,
        expectedImpact: hypothesis.impact,
        expectedConfidence: hypothesis.confidence
    };
}

export function buildCognitionIterationPlan(
    {
        analysisReport = null,
        learningReport = null,
        memoryGuardrailsReport = null,
        readinessReport = null,
        history = []
    },
    {
        underObservedToolMaxCalls = 3,
        toolConcentrationThreshold = 0.75
    } = {}
) {
    const readinessStatus = readinessReport?.status || 'warn';
    const learningDriftLevel = learningReport?.state?.driftLevel
        || learningReport?.errorTaxonomy?.driftLevel
        || 'stable';
    const memoryDriftLevel = analysisReport?.memoryDrift?.driftLevel || 'stable';
    const memoryGuardrailsStatus = memoryGuardrailsReport?.status || 'warn';
    const posture = derivePosture({ readinessStatus, learningDriftLevel, memoryDriftLevel });
    const budget = explorationBudgetForPosture(posture);

    const hypotheses = [];
    const toolList = toToolList(analysisReport).sort((a, b) => b.calls - a.calls);
    const totalToolCalls = toolList.reduce((acc, item) => acc + item.calls, 0);
    const topTool = toolList[0] || null;
    const topToolShare = topTool && totalToolCalls > 0
        ? round(topTool.calls / totalToolCalls, 4)
        : 0;
    const lowCoverageTools = toolList.filter((tool) => tool.calls > 0 && tool.calls <= underObservedToolMaxCalls);
    const outcomesTotal = Number(learningReport?.summary?.total) || 0;
    const recurringSignatures = Number(learningReport?.errorTaxonomy?.recurringSignatures) || 0;
    const focusAreas = Number(learningReport?.skillGrowthPlan?.focusAreas?.length) || 0;
    const memoryReflectionCoverage = Number(analysisReport?.memoryDrift?.currentWindow?.reflectionCoverage) || 0;
    const memoryGuardrailCompliance = Number(memoryGuardrailsReport?.totals?.complianceRate) || 0;

    if (outcomesTotal === 0) {
        hypotheses.push(createHypothesis({
            id: 'capture-task-outcomes',
            priority: posture === 'recover' ? 'P1' : 'P2',
            title: 'Increase outcome observability coverage',
            question: 'How can cognition-core learn faster if task outcomes are near-zero?',
            rationale: 'Learning loop has insufficient outcome volume, reducing signal quality for adaptation.',
            evidence: {
                outcomesTotal
            },
            metric: 'learning.summary.total',
            target: '>= 20 outcomes/week',
            experiment: 'Instrument additional task sources and schedule a daily synthetic outcome probe.',
            stopCondition: 'Stop after 7 days if outcomes remain < 10; escalate ingestion contract fixes.',
            confidence: 0.72,
            impact: 0.9,
            novelty: noveltyScoreForKey('capture-task-outcomes', history)
        }));
    }

    if (memoryDriftLevel !== 'stable' || memoryGuardrailsStatus !== 'pass') {
        hypotheses.push(createHypothesis({
            id: 'memory-reflection-acceleration',
            priority: memoryDriftLevel === 'critical' || memoryGuardrailsStatus === 'fail' ? 'P1' : 'P2',
            title: 'Accelerate reflection quality in memory stream',
            question: 'Can tighter post-incident reflection loops reduce cognitive drift within one iteration window?',
            rationale: 'Memory drift/guardrails indicate reflection quality is trailing operational activity.',
            evidence: {
                memoryDriftLevel,
                reflectionCoverage: memoryReflectionCoverage,
                guardrailCompliance: memoryGuardrailCompliance
            },
            metric: 'memory.reflectionCoverage',
            target: '>= 1.0',
            experiment: 'Require sections for incident logs and run auto-backfill daily for previous 7 days.',
            stopCondition: 'Stop if reflection coverage and guardrail compliance are both >= 0.95 for 3 runs.',
            confidence: 0.81,
            impact: 0.84,
            novelty: noveltyScoreForKey('memory-reflection-acceleration', history)
        }));
    }

    if (recurringSignatures > 0) {
        hypotheses.push(createHypothesis({
            id: 'recurring-error-extinction',
            priority: recurringSignatures >= 3 ? 'P1' : 'P2',
            title: 'Extinguish recurring failure signatures',
            question: 'Which recurring signature can be eliminated with one targeted patch?',
            rationale: 'Recurring signatures imply repeated mistakes and low policy learning velocity.',
            evidence: {
                recurringSignatures,
                topSignatures: (learningReport?.errorTaxonomy?.topSignatures || []).slice(0, 3).map((item) => item.signature)
            },
            metric: 'learning.errorTaxonomy.recurringSignatures',
            target: '<= 1',
            experiment: 'Select top recurring signature, patch dominant cause, and run canary workload for 72 hours.',
            stopCondition: 'Stop when recurring signatures drop below target for two consecutive runs.',
            confidence: 0.76,
            impact: 0.82,
            novelty: noveltyScoreForKey('recurring-error-extinction', history)
        }));
    }

    if (topTool && topToolShare >= toolConcentrationThreshold && totalToolCalls >= 15) {
        hypotheses.push(createHypothesis({
            id: 'tool-diversification-probe',
            priority: 'P2',
            title: 'Reduce single-tool cognitive concentration risk',
            question: `Can task decomposition reduce over-reliance on ${topTool.name}?`,
            rationale: 'High concentration on one tool can hide blind spots and increase systemic fragility.',
            evidence: {
                topTool: topTool.name,
                topToolShare,
                totalToolCalls
            },
            metric: 'analysis.topToolShare',
            target: `< ${round(toolConcentrationThreshold - 0.1, 2)}`,
            experiment: 'Route 20% of compatible tasks to alternate tools with instrumentation parity.',
            stopCondition: 'Stop if reliability drops by >2 points or error rate rises by >2pp.',
            confidence: 0.63,
            impact: 0.58,
            novelty: noveltyScoreForKey('tool-diversification-probe', history)
        }));
    }

    if (lowCoverageTools.length > 0) {
        hypotheses.push(createHypothesis({
            id: 'under-observed-tool-mapping',
            priority: posture === 'explore' ? 'P2' : 'P3',
            title: 'Map capabilities of under-observed tools',
            question: 'Which low-volume tools can unlock new cognition behaviors if intentionally exercised?',
            rationale: 'Low sample size prevents reliable quality estimates and limits curiosity-driven discovery.',
            evidence: {
                underObservedTools: lowCoverageTools.slice(0, 8).map((tool) => tool.name),
                count: lowCoverageTools.length
            },
            metric: 'analysis.lowCoverageToolCount',
            target: '<= 1',
            experiment: 'Create a micro-benchmark suite for each under-observed tool and run nightly for one week.',
            stopCondition: 'Stop once each target tool has >= 10 observed calls with outcome capture.',
            confidence: 0.67,
            impact: 0.61,
            novelty: noveltyScoreForKey('under-observed-tool-mapping', history)
        }));
    }

    if (posture === 'explore' && focusAreas === 0) {
        hypotheses.push(createHypothesis({
            id: 'curiosity-frontier-expansion',
            priority: 'P3',
            title: 'Expand curiosity frontier with proactive capability trials',
            question: 'What new skill can create a step-change in cognition quality despite current stability?',
            rationale: 'Stable posture with no active skill focus can lead to stagnation.',
            evidence: {
                posture,
                focusAreas
            },
            metric: 'learning.skillGrowthPlan.focusAreas',
            target: '>= 2 exploratory focuses/month',
            experiment: 'Schedule one weekly frontier experiment using low-utilization high-potential skills.',
            stopCondition: 'Stop if experiments show no measurable signal after 4 trials.',
            confidence: 0.55,
            impact: 0.52,
            novelty: noveltyScoreForKey('curiosity-frontier-expansion', history)
        }));
    }

    if (hypotheses.length === 0) {
        hypotheses.push(createHypothesis({
            id: 'baseline-maintenance-experiment',
            priority: 'P3',
            title: 'Maintain baseline and probe one micro-optimization',
            question: 'Which small process change yields measurable cognitive lift without risk?',
            rationale: 'No major instability detected; safe to run low-risk optimization probes.',
            evidence: {
                posture
            },
            metric: 'readiness.readinessScore',
            target: '>= current baseline',
            experiment: 'Run one low-risk optimization canary and compare against control for 72 hours.',
            stopCondition: 'Stop if canary fails to improve or increases risk.',
            confidence: 0.62,
            impact: 0.41,
            novelty: noveltyScoreForKey('baseline-maintenance-experiment', history)
        }));
    }

    const prioritized = hypotheses
        .sort((a, b) => {
            if (priorityRank(a.priority) !== priorityRank(b.priority)) {
                return priorityRank(a.priority) - priorityRank(b.priority);
            }
            return b.score - a.score;
        });

    const experiments = prioritized.map(hypothesisToExperiment);
    const curiosityPrompts = [
        'Which assumption in our routing or retry policy has the weakest evidence this week?',
        'What capability is currently under-measured but likely high leverage?',
        'Which failure mode would surprise us most if it repeated tomorrow?',
        'What one experiment could increase learning velocity without increasing risk posture?'
    ];
    if (lowCoverageTools.length > 0) {
        curiosityPrompts.push(`What does a controlled benchmark reveal about ${lowCoverageTools[0].name}?`);
    }

    const summaryText = posture === 'recover'
        ? 'Recovery posture: prioritize reliability and error extinction before exploration.'
        : posture === 'stabilize'
            ? 'Stabilization posture: reduce drift while preserving controlled curiosity.'
            : 'Exploration posture: system is stable enough for frontier experiments.';

    return {
        generatedAt: new Date().toISOString(),
        posture,
        summaryText,
        readinessStatus,
        learningDriftLevel,
        memoryDriftLevel,
        explorationBudget: budget,
        hypotheses: prioritized,
        experiments,
        curiosityPrompts,
        nextRunChecklist: [
            'Refresh cognition, memory, and learning reports.',
            'Verify readiness gates after applying remediation or experiments.',
            'Append this iteration snapshot to history.',
            'Convert top hypotheses into executable tasks.'
        ]
    };
}

export function renderCognitionIterationMarkdown(plan) {
    const lines = [];
    lines.push('# Cognition Iteration Plan');
    lines.push('');
    lines.push(`Generated: ${plan.generatedAt}`);
    lines.push(`Posture: **${plan.posture}**`);
    lines.push(`Summary: ${plan.summaryText}`);
    lines.push(`Exploration budget: ${(plan.explorationBudget.explorePct * 100).toFixed(0)}% explore / ${(plan.explorationBudget.exploitPct * 100).toFixed(0)}% exploit`);
    lines.push('');
    lines.push('## Hypotheses');
    lines.push('');
    for (const hypothesis of plan.hypotheses || []) {
        lines.push(`- [${hypothesis.priority}] ${hypothesis.title} (score ${hypothesis.score})`);
        lines.push(`  - Question: ${hypothesis.question}`);
        lines.push(`  - Metric/target: ${hypothesis.metric || 'n/a'} -> ${hypothesis.target || 'n/a'}`);
        lines.push(`  - Experiment: ${hypothesis.experiment}`);
        lines.push(`  - Stop condition: ${hypothesis.stopCondition}`);
    }
    if ((plan.hypotheses || []).length === 0) {
        lines.push('- No hypotheses generated.');
    }
    lines.push('');
    lines.push('## Curiosity Prompts');
    lines.push('');
    for (const prompt of plan.curiosityPrompts || []) {
        lines.push(`- ${prompt}`);
    }
    lines.push('');
    lines.push('## Checklist');
    lines.push('');
    for (const item of plan.nextRunChecklist || []) {
        lines.push(`- ${item}`);
    }
    lines.push('');
    return lines.join('\n');
}
