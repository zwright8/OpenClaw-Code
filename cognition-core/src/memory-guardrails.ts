import fs from 'fs';
import path from 'path';

const DEFAULT_REQUIRED_SECTIONS = [
    'Incident Signals',
    'Root Cause',
    'Lessons Learned',
    'Action Items',
    'Skill Tags'
];

const DEFAULT_MINIMAL_SECTIONS = [
    'Lessons Learned',
    'Action Items'
];

const DEFAULT_PROVENANCE_SECTIONS = [
    'Evidence',
    'Sources',
    'References',
    'Trace',
    'Provenance'
];

const ERROR_SIGNAL_REGEX = /\b(error|failed|failure|incident|regression|timeout|bug)\b/i;
const URL_REGEX = /\bhttps?:\/\/[^\s<>)\]]+/gi;
const INSTRUCTION_INJECTION_REGEXES = [
    /\b(ignore|disregard|override)\s+(all\s+)?(previous|prior|earlier)\s+(instructions|directives|messages)\b/i,
    /\b(reveal|print|dump|exfiltrate)\s+(the\s+)?(system|developer)\s+(prompt|message|instructions?)\b/i,
    /\bact\s+as\s+(system|developer|root|admin)\b/i,
    /\bdo\s+not\s+(tell|mention|disclose)\s+(the\s+)?(user|operator)\b/i,
    /\bexecute\s+this\s+(command|script)\s+without\s+(asking|approval|confirmation)\b/i
];

function round(value, decimals = 4) {
    if (!Number.isFinite(value)) return value;
    return Number(value.toFixed(decimals));
}

function normalizeHeadingLabel(value) {
    if (typeof value !== 'string') return '';
    return value
        .toLowerCase()
        .replace(/[`*_]/g, '')
        .replace(/[^a-z0-9\s-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function extractHeadings(markdown) {
    if (typeof markdown !== 'string') return [];
    const lines = markdown.split('\n');
    const headings = [];
    for (const line of lines) {
        const match = line.match(/^\s{0,3}#{1,6}\s+(.+?)\s*$/);
        if (!match) continue;
        headings.push(normalizeHeadingLabel(match[1]));
    }
    return headings;
}

function sectionPresent(headings, section) {
    const target = normalizeHeadingLabel(section);
    return headings.some((heading) => heading === target || heading.includes(target));
}

function provenanceSectionPresent(headings, section) {
    const target = normalizeHeadingLabel(section);
    return headings.some((heading) => heading === target || heading.startsWith(`${target} `));
}

function extractExternalLinks(content) {
    if (typeof content !== 'string' || !content.trim()) return [];
    return Array.from(new Set(content.match(URL_REGEX) || []));
}

function findInstructionSignals(content) {
    if (typeof content !== 'string' || !content.trim()) return [];
    return INSTRUCTION_INJECTION_REGEXES
        .filter((regex) => regex.test(content))
        .map((regex) => regex.source);
}

function listMarkdownFiles(root, output = []) {
    if (!fs.existsSync(root)) return output;
    const items = fs.readdirSync(root);
    for (const item of items) {
        if (item === 'node_modules' || item === '.git') continue;
        const fullPath = path.join(root, item);
        const stats = fs.statSync(fullPath);
        if (stats.isDirectory()) {
            listMarkdownFiles(fullPath, output);
            continue;
        }
        if (stats.isFile() && item.toLowerCase().endsWith('.md')) {
            output.push({ filePath: fullPath, mtimeMs: Number(stats.mtimeMs) });
        }
    }
    return output;
}

function evaluateEntryCompliance(
    content,
    requiredSections = DEFAULT_REQUIRED_SECTIONS,
    {
        minimalSections = DEFAULT_MINIMAL_SECTIONS,
        enforceAllSections = false,
        provenanceSections = DEFAULT_PROVENANCE_SECTIONS
    } = {}
) {
    const headings = extractHeadings(content);
    const hasErrorSignal = ERROR_SIGNAL_REGEX.test(content || '');
    const externalLinks = extractExternalLinks(content);
    const hasProvenanceSection = provenanceSections.some((section) => provenanceSectionPresent(headings, section));
    const instructionSignals = findInstructionSignals(content);
    const unprovenancedExternalLinks = externalLinks.length > 0 && !hasProvenanceSection;
    const applicableSections = hasErrorSignal || enforceAllSections
        ? requiredSections
        : minimalSections;
    const missingSections = applicableSections.filter((section) => !sectionPresent(headings, section));
    const score = applicableSections.length === 0
        ? 1
        : round((applicableSections.length - missingSections.length) / applicableSections.length, 4);

    let status = 'pass';
    if (missingSections.length > 0) {
        status = hasErrorSignal || enforceAllSections
            ? (missingSections.length <= 2 ? 'warn' : 'fail')
            : 'warn';
    }

    return {
        status,
        score,
        headings,
        applicableSections,
        missingSections,
        hasErrorSignal,
        externalLinks,
        hasProvenanceSection,
        unprovenancedExternalLinks,
        instructionSignals,
        hasInstructionRisk: instructionSignals.length > 0
    };
}

export function scanMemoryGuardrails(
    memoryRoot,
    {
        requiredSections = DEFAULT_REQUIRED_SECTIONS,
        minimalSections = DEFAULT_MINIMAL_SECTIONS,
        provenanceSections = DEFAULT_PROVENANCE_SECTIONS,
        enforceAllSections = false,
        rangeStartMs = null,
        rangeEndMs = null,
        maxEntries = Number.POSITIVE_INFINITY
    } = {}
) {
    if (!memoryRoot || typeof memoryRoot !== 'string') {
        throw new Error('scanMemoryGuardrails requires memoryRoot path');
    }

    const allFiles = listMarkdownFiles(memoryRoot)
        .filter((entry) => {
            if (Number.isFinite(rangeStartMs) && entry.mtimeMs < Number(rangeStartMs)) return false;
            if (Number.isFinite(rangeEndMs) && entry.mtimeMs >= Number(rangeEndMs)) return false;
            return true;
        })
        .sort((a, b) => b.mtimeMs - a.mtimeMs);

    const cap = Number(maxEntries);
    const files = Number.isInteger(cap) && cap > 0 ? allFiles.slice(0, cap) : allFiles;

    const entries = [];
    const missingSectionCounts = Object.fromEntries(requiredSections.map((section) => [section, 0]));
    let compliant = 0;
    let withErrorSignals = 0;

    for (const file of files) {
        const content = fs.readFileSync(file.filePath, 'utf8');
        const compliance = evaluateEntryCompliance(content, requiredSections, {
            minimalSections,
            enforceAllSections,
            provenanceSections
        });
        if (compliance.status === 'pass') compliant++;
        if (compliance.hasErrorSignal) withErrorSignals++;
        for (const section of compliance.missingSections) {
            missingSectionCounts[section] = (missingSectionCounts[section] || 0) + 1;
        }

        entries.push({
            filePath: file.filePath,
            relativePath: path.relative(memoryRoot, file.filePath),
            modifiedAt: new Date(file.mtimeMs).toISOString(),
            ...compliance
        });
    }

    const total = entries.length;
    const complianceRate = total > 0 ? round(compliant / total, 4) : 1;
    const averageScore = total > 0
        ? round(entries.reduce((acc, item) => acc + item.score, 0) / total, 4)
        : 1;

    const incidentEntries = entries.filter((entry) => entry.hasErrorSignal);
    const incidentCompliant = incidentEntries.filter((entry) => entry.status === 'pass').length;
    const incidentComplianceRate = incidentEntries.length > 0
        ? round(incidentCompliant / incidentEntries.length, 4)
        : 1;
    const entriesWithInstructionRisk = entries.filter((entry) => entry.hasInstructionRisk).length;
    const entriesWithUnprovenancedExternalLinks = entries.filter((entry) => entry.unprovenancedExternalLinks).length;
    const externalLinks = entries.reduce((acc, entry) => acc + entry.externalLinks.length, 0);

    let status = 'pass';
    if (incidentEntries.length > 0) {
        if (incidentComplianceRate < 0.5) status = 'fail';
        else if (incidentComplianceRate < 0.8 || complianceRate < 0.8) status = 'warn';
    } else {
        if (complianceRate < 0.3) status = 'warn';
    }
    if (status === 'pass' && (entriesWithInstructionRisk > 0 || entriesWithUnprovenancedExternalLinks > 0)) {
        status = 'warn';
    }

    const insights = [];
    if (total === 0) {
        insights.push('No memory markdown entries were found in the selected window.');
    } else {
        insights.push(`Scanned ${total} memory entries; compliance rate ${(complianceRate * 100).toFixed(1)}%.`);
    }
    if (withErrorSignals > 0 && complianceRate < 1) {
        insights.push('Some incident-like entries are missing one or more required reflection sections.');
    }
    const mostMissing = Object.entries(missingSectionCounts)
        .sort((a, b) => b[1] - a[1])[0];
    if (mostMissing && mostMissing[1] > 0) {
        insights.push(`Most-missed section: "${mostMissing[0]}" (${mostMissing[1]} entries).`);
    }
    if (entriesWithInstructionRisk > 0) {
        insights.push(`${entriesWithInstructionRisk} memory entries contain instruction-like text that should not be trusted without review.`);
    }
    if (entriesWithUnprovenancedExternalLinks > 0) {
        insights.push(`${entriesWithUnprovenancedExternalLinks} memory entries cite external links without a provenance/source heading.`);
    }

    const recommendedActions = [];
    if (status !== 'pass') {
        recommendedActions.push('Enforce the memory reflection template for all new entries.');
        recommendedActions.push('Backfill missing required sections in the most recent non-compliant entries.');
        if (entriesWithInstructionRisk > 0) {
            recommendedActions.push('Quarantine or rewrite instruction-like memory text before it is rehydrated into agent context.');
        }
        if (entriesWithUnprovenancedExternalLinks > 0) {
            recommendedActions.push('Add Evidence, Sources, References, Trace, or Provenance sections for externally sourced memory claims.');
        }
    } else {
        recommendedActions.push('Continue enforcing section coverage and monitor weekly compliance.');
    }

    return {
        generatedAt: new Date().toISOString(),
        memoryRoot,
        requiredSections,
        minimalSections,
        provenanceSections,
        enforceAllSections,
        status,
        totals: {
            entries: total,
            compliant,
            withErrorSignals,
            externalLinks,
            entriesWithInstructionRisk,
            entriesWithUnprovenancedExternalLinks,
            complianceRate,
            averageScore,
            incidentEntries: incidentEntries.length,
            incidentComplianceRate
        },
        missingSectionCounts,
        insights,
        recommendedActions,
        topNonCompliant: entries
            .filter((entry) => entry.status !== 'pass')
            .sort((a, b) => b.missingSections.length - a.missingSections.length)
            .slice(0, 10),
        topRisky: entries
            .filter((entry) => entry.hasInstructionRisk || entry.unprovenancedExternalLinks)
            .sort((a, b) => {
                const left = (a.hasInstructionRisk ? 2 : 0) + (a.unprovenancedExternalLinks ? 1 : 0);
                const right = (b.hasInstructionRisk ? 2 : 0) + (b.unprovenancedExternalLinks ? 1 : 0);
                return right - left;
            })
            .slice(0, 10),
        entries
    };
}

export function buildMemoryEntryTemplate({
    title = null,
    date = null,
    requiredSections = DEFAULT_REQUIRED_SECTIONS
} = {}) {
    const isoDate = date || new Date().toISOString().slice(0, 10);
    const heading = title || `Memory Entry - ${isoDate}`;
    const sections = requiredSections.map((section) => `## ${section}\n- `).join('\n\n');
    return [
        `# ${heading}`,
        '',
        '_Context: capture what happened, why, and what changes next._',
        '',
        sections,
        ''
    ].join('\n');
}

export function ensureMemoryTemplateFile(
    outputPath,
    {
        overwrite = false,
        title = null,
        date = null,
        requiredSections = DEFAULT_REQUIRED_SECTIONS
    } = {}
) {
    if (!outputPath || typeof outputPath !== 'string') {
        throw new Error('ensureMemoryTemplateFile requires outputPath');
    }

    if (fs.existsSync(outputPath) && !overwrite) {
        return {
            written: false,
            filePath: outputPath,
            reason: 'exists'
        };
    }

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    const content = buildMemoryEntryTemplate({ title, date, requiredSections });
    fs.writeFileSync(outputPath, `${content}\n`);

    return {
        written: true,
        filePath: outputPath
    };
}

export function backfillMemoryEntrySections(
    filePath,
    missingSections,
    {
        bullet = '- TODO',
        dryRun = false
    } = {}
) {
    if (!filePath || typeof filePath !== 'string') {
        throw new Error('backfillMemoryEntrySections requires filePath');
    }
    if (!Array.isArray(missingSections)) {
        throw new Error('backfillMemoryEntrySections requires missingSections array');
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Memory entry not found: ${filePath}`);
    }
    if (missingSections.length === 0) {
        return {
            updated: false,
            filePath,
            addedSections: []
        };
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const appendBlock = missingSections
        .map((section) => `## ${section}\n${bullet}`)
        .join('\n\n');
    const nextContent = `${content.replace(/\s*$/, '')}\n\n${appendBlock}\n`;

    if (!dryRun) {
        fs.writeFileSync(filePath, nextContent);
    }

    return {
        updated: true,
        filePath,
        addedSections: [...missingSections]
    };
}

export function backfillMemoryGuardrailSections(
    memoryRoot,
    {
        requiredSections = DEFAULT_REQUIRED_SECTIONS,
        minimalSections = DEFAULT_MINIMAL_SECTIONS,
        enforceAllSections = false,
        rangeStartMs = null,
        rangeEndMs = null,
        maxEntries = Number.POSITIVE_INFINITY,
        maxUpdates = Number.POSITIVE_INFINITY,
        dryRun = false
    } = {}
) {
    const initialRangeEndMs = Number.isFinite(rangeEndMs) ? Number(rangeEndMs) : null;
    const report = scanMemoryGuardrails(memoryRoot, {
        requiredSections,
        minimalSections,
        enforceAllSections,
        rangeStartMs,
        rangeEndMs: initialRangeEndMs,
        maxEntries
    });

    const updates = [];
    const limit = Number(maxUpdates);
    const capped = Number.isInteger(limit) && limit > 0
        ? report.topNonCompliant.slice(0, limit)
        : report.topNonCompliant;

    for (const entry of capped) {
        if (!entry.missingSections || entry.missingSections.length === 0) continue;
        const result = backfillMemoryEntrySections(entry.filePath, entry.missingSections, {
            dryRun
        });
        updates.push(result);
    }

    const postRangeEndMs = initialRangeEndMs === null
        ? null
        : Math.max(initialRangeEndMs, Date.now() + 1_000);

    const postReport = dryRun
        ? report
        : scanMemoryGuardrails(memoryRoot, {
            requiredSections,
            minimalSections,
            enforceAllSections,
            rangeStartMs,
            rangeEndMs: postRangeEndMs,
            maxEntries
        });

    return {
        dryRun,
        scanned: report.totals.entries,
        attemptedUpdates: capped.length,
        updatedFiles: updates.length,
        updates,
        before: report,
        after: postReport
    };
}

export const __memoryGuardrailsInternals = {
    extractHeadings,
    evaluateEntryCompliance
};
