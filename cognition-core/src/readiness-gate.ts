function round(value, decimals = 3) {
    if (!Number.isFinite(value)) return value;
    return Number(value.toFixed(decimals));
}

function toToolList(report) {
    if (!report || typeof report !== 'object') return [];
    if (Array.isArray(report.topTools)) {
        return report.topTools.map((item) => ({
            name: item.name,
            calls: Number(item.calls) || 0,
            errorRate: Number(item.errorRate) || 0
        }));
    }
    return Object.entries(report.tools || {}).map(([name, item]) => ({
        name,
        calls: Number(item?.calls) || 0,
        errorRate: Number(item?.errorRate) || 0
    }));
}

function createGate(id, status, summary, details = {}) {
    return { id, status, summary, details };
}

function stateToStatus(level) {
    if (level === 'critical') return 'fail';
    if (level === 'watch') return 'warn';
    return 'pass';
}

function observabilityStatus({ total, failureCount, traceCoverage, failureErrorDetailCoverage }, {
    minTraceCoverage,
    minFailureErrorDetailCoverage
}) {
    if (total <= 0) return 'warn';
    if (traceCoverage < minTraceCoverage) return 'fail';
    if (failureCount > 0 && failureErrorDetailCoverage < minFailureErrorDetailCoverage) return 'fail';
    return 'pass';
}

export function evaluateCognitionCoreReadiness(
    {
        analysisReport = null,
        learningReport = null,
        memoryGuardrailsReport = null,
        remediationTasks = [],
        skillGrowthTasks = []
    },
    {
        minReliabilityScore = 90,
        maxFrequentToolErrorRate = 5,
        frequentToolMinCalls = 5,
        minTraceCoverage = 0.8,
        minFailureErrorDetailCoverage = 0.8
    } = {}
) {
    const gates = [];

    const requiredArtifacts = {
        analysisReport: !!analysisReport,
        learningReport: !!learningReport
    };
    const missingArtifacts = Object.entries(requiredArtifacts)
        .filter(([, present]) => !present)
        .map(([key]) => key);

    gates.push(createGate(
        'artifacts',
        missingArtifacts.length > 0 ? 'fail' : 'pass',
        missingArtifacts.length > 0
            ? `Missing required artifacts: ${missingArtifacts.join(', ')}`
            : 'Required artifacts are present.',
        { requiredArtifacts, missingArtifacts }
    ));

    const reliabilityScore = Number(analysisReport?.reliabilityScore);
    gates.push(createGate(
        'reliability',
        Number.isFinite(reliabilityScore) && reliabilityScore >= minReliabilityScore ? 'pass' : 'fail',
        Number.isFinite(reliabilityScore)
            ? `Reliability score ${reliabilityScore}/100 (target >= ${minReliabilityScore}).`
            : 'Reliability score is unavailable.',
        { reliabilityScore, minReliabilityScore }
    ));

    const frequentToolViolations = toToolList(analysisReport)
        .filter((tool) => tool.calls >= frequentToolMinCalls && tool.errorRate > maxFrequentToolErrorRate)
        .sort((a, b) => b.errorRate - a.errorRate);

    gates.push(createGate(
        'tool_error_rate',
        frequentToolViolations.length === 0 ? 'pass' : 'fail',
        frequentToolViolations.length === 0
            ? `No frequent tools exceed ${maxFrequentToolErrorRate}% error rate.`
            : `${frequentToolViolations.length} frequent tool(s) exceed ${maxFrequentToolErrorRate}% error rate.`,
        {
            frequentToolMinCalls,
            maxFrequentToolErrorRate,
            violations: frequentToolViolations
        }
    ));

    const memoryDriftLevel = analysisReport?.memoryDrift?.driftLevel || 'stable';
    gates.push(createGate(
        'memory_drift',
        stateToStatus(memoryDriftLevel),
        `Memory drift level is ${memoryDriftLevel}.`,
        {
            driftLevel: memoryDriftLevel,
            driftScore: analysisReport?.memoryDrift?.driftScore ?? null
        }
    ));

    if (memoryGuardrailsReport && typeof memoryGuardrailsReport === 'object') {
        const guardrailStatus = memoryGuardrailsReport.status || 'warn';
        gates.push(createGate(
            'memory_guardrails',
            guardrailStatus === 'fail' ? 'fail' : (guardrailStatus === 'warn' ? 'warn' : 'pass'),
            `Memory guardrail status is ${guardrailStatus} (compliance ${(Number(memoryGuardrailsReport?.totals?.complianceRate || 0) * 100).toFixed(1)}%).`,
            {
                status: guardrailStatus,
                complianceRate: Number(memoryGuardrailsReport?.totals?.complianceRate || 0),
                entries: Number(memoryGuardrailsReport?.totals?.entries || 0)
            }
        ));
    }

    const learningDriftLevel = learningReport?.state?.driftLevel || learningReport?.errorTaxonomy?.driftLevel || 'stable';
    gates.push(createGate(
        'learning_drift',
        stateToStatus(learningDriftLevel),
        `Learning drift level is ${learningDriftLevel}.`,
        {
            driftLevel: learningDriftLevel,
            runCount: Number(learningReport?.state?.runCount) || 0
        }
    ));

    const runCount = Number(learningReport?.state?.runCount) || 0;
    gates.push(createGate(
        'state_continuity',
        runCount >= 1 ? 'pass' : 'fail',
        runCount >= 1
            ? `Learning state run count is ${runCount}.`
            : 'Learning state run count is missing.',
        { runCount }
    ));

    if (learningReport?.summary && typeof learningReport.summary === 'object') {
        const total = Number(learningReport.summary.total) || 0;
        const failureCount = Number(learningReport.summary.failure) || 0;
        const traceCoverage = Number(learningReport.summary.traceCoverage) || 0;
        const evidenceCoverage = Number(learningReport.summary.evidenceCoverage) || 0;
        const failureErrorDetailCoverage = Number.isFinite(Number(learningReport.summary.failureErrorDetailCoverage))
            ? Number(learningReport.summary.failureErrorDetailCoverage)
            : (failureCount > 0 ? 0 : 1);
        const status = observabilityStatus({
            total,
            failureCount,
            traceCoverage,
            failureErrorDetailCoverage
        }, {
            minTraceCoverage,
            minFailureErrorDetailCoverage
        });

        gates.push(createGate(
            'outcome_observability',
            status,
            total <= 0
                ? 'No learning outcomes are available for observability checks.'
                : `Outcome trace coverage ${(traceCoverage * 100).toFixed(1)}%; failure detail coverage ${(failureErrorDetailCoverage * 100).toFixed(1)}%.`,
            {
                total,
                failureCount,
                traceCoverage,
                evidenceCoverage,
                failureErrorDetailCoverage,
                minTraceCoverage,
                minFailureErrorDetailCoverage
            }
        ));
    }

    const needsRemediation = (Number(analysisReport?.errors) || 0) > 0
        || analysisReport?.comparison?.status === 'regressing'
        || ['watch', 'critical'].includes(memoryDriftLevel);
    const remediationCount = Array.isArray(remediationTasks) ? remediationTasks.length : 0;
    gates.push(createGate(
        'remediation_coverage',
        needsRemediation && remediationCount === 0 ? 'fail' : 'pass',
        needsRemediation
            ? `Remediation tasks generated: ${remediationCount}.`
            : 'No remediation required by current gates.',
        {
            needsRemediation,
            remediationCount
        }
    ));

    const focusCount = Number(learningReport?.skillGrowthPlan?.focusAreas?.length) || 0;
    const skillTaskCount = Array.isArray(skillGrowthTasks) ? skillGrowthTasks.length : 0;
    const skillCoverageStatus = focusCount > 0 && skillTaskCount === 0
        ? 'fail'
        : (focusCount === 0 && skillTaskCount > 0 ? 'warn' : 'pass');

    gates.push(createGate(
        'skill_growth_coverage',
        skillCoverageStatus,
        `Skill focus areas: ${focusCount}; skill tasks: ${skillTaskCount}.`,
        {
            focusCount,
            skillTaskCount
        }
    ));

    const failures = gates.filter((gate) => gate.status === 'fail');
    const warnings = gates.filter((gate) => gate.status === 'warn');
    const status = failures.length > 0 ? 'fail' : (warnings.length > 0 ? 'warn' : 'pass');

    const readinessScoreRaw = (
        (gates.filter((gate) => gate.status === 'pass').length * 1)
        + (warnings.length * 0.5)
    ) / Math.max(gates.length, 1);

    const recommendedActions = [];
    for (const gate of failures) {
        recommendedActions.push(`Fix failing gate: ${gate.id} (${gate.summary})`);
    }
    for (const gate of warnings) {
        recommendedActions.push(`Review warning gate: ${gate.id} (${gate.summary})`);
    }

    return {
        generatedAt: new Date().toISOString(),
        status,
        readinessScore: round(readinessScoreRaw, 3),
        totals: {
            gates: gates.length,
            pass: gates.filter((gate) => gate.status === 'pass').length,
            warn: warnings.length,
            fail: failures.length
        },
        gates,
        recommendedActions
    };
}

export function renderCognitionCoreReadinessMarkdown(readiness) {
    const lines = [];
    lines.push('# Cognition Core Readiness');
    lines.push('');
    lines.push(`Generated: ${readiness.generatedAt}`);
    lines.push(`Status: **${readiness.status}**`);
    lines.push(`Readiness score: ${readiness.readinessScore}`);
    lines.push('');
    lines.push('| Gate | Status | Summary |');
    lines.push('| --- | --- | --- |');

    for (const gate of readiness.gates || []) {
        lines.push(`| ${gate.id} | ${gate.status} | ${gate.summary} |`);
    }
    if ((readiness.gates || []).length === 0) {
        lines.push('| (none) | fail | No gates evaluated |');
    }

    lines.push('');
    lines.push('## Actions');
    lines.push('');
    for (const action of readiness.recommendedActions || []) {
        lines.push(`- ${action}`);
    }
    if ((readiness.recommendedActions || []).length === 0) {
        lines.push('- No actions required.');
    }
    lines.push('');

    return lines.join('\n');
}
