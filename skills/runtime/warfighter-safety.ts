import fs from 'fs';
import path from 'path';

export type WarfighterSafetyFinding = {
    ruleId: string;
    severity: 'critical' | 'high' | 'medium';
    message: string;
    matchedText?: string;
};

export type WarfighterSkillAuditResult = {
    skillPath: string;
    skillName: string;
    title: string;
    description: string;
    isSupportOriented: boolean;
    prohibitedFindings: WarfighterSafetyFinding[];
    structuralFindings: WarfighterSafetyFinding[];
};

export type WarfighterSafetyAuditSummary = {
    generatedAt: string;
    scannedSkillCount: number;
    supportSkillCount: number;
    prohibitedSkillCount: number;
    structuralGapSkillCount: number;
    prohibitedFindingCount: number;
    structuralFindingCount: number;
    findingsByRule: Array<{
        ruleId: string;
        count: number;
    }>;
};

export type WarfighterSafetyAuditReport = {
    generatedAt: string;
    corpusRoot: string;
    summary: WarfighterSafetyAuditSummary;
    results: WarfighterSkillAuditResult[];
};

type Metadata = {
    skillName: string;
    description: string;
    title: string;
};

type Rule = {
    id: string;
    severity: 'critical' | 'high' | 'medium';
    message: string;
    pattern: RegExp;
};

type HeadingRule = {
    id: string;
    message: string;
    matches: RegExp[];
    evidenceMatches?: RegExp[];
};

const PROHIBITED_METADATA_RULES: Rule[] = [
    {
        id: 'prohibited-targeting',
        severity: 'critical',
        message: 'Metadata indicates targeting, CDE, or no-strike governance content that falls outside the noncombat companion scope.',
        pattern: /\btargeting\b|\btarget validation\b|\btarget recognition\b|\btarget nomination\b|\bretarget(?:ing)?\b|\bcollateral damage estimate\b|\bcde\b|\bno-strike\b|\brestricted target\b/i
    },
    {
        id: 'prohibited-missile-or-munitions',
        severity: 'critical',
        message: 'Metadata indicates missile, munitions, or weapon-employment support.',
        pattern: /\bmissile\b|\bmunitions?\b|\bwarhead\b|\btorpedo\b|\bweapon(?:s)? employment\b/i
    },
    {
        id: 'prohibited-fires-or-strike',
        severity: 'critical',
        message: 'Metadata indicates fires, strike, aimpoint, or kill-chain support.',
        pattern: /\bjoint fires\b|\bfire support\b|\bfires and effects\b|\bfires clearance\b|\bfires deconfliction\b|\bprecision fires?\b|\blong-range fires?\b|\bprecision strike\b|\bhypersonic strike\b|\bstrike package\b|\bstrike support\b|\bstrike authorization\b|\battack geometry\b|\baimpoint\b|\bbattle damage assessment\b|\breattack\b|\bkill[- ]?chain\b|\bkill[- ]?web\b/i
    },
    {
        id: 'prohibited-air-defense-or-counter-uas',
        severity: 'critical',
        message: 'Metadata indicates air-defense, anti-ship, or counter-UAS combat support.',
        pattern: /\banti-ship\b|\bcounter[- ]?uas\b|\bair defense\b|\bweapon release\b/i
    },
    {
        id: 'prohibited-roe-or-fire-control',
        severity: 'critical',
        message: 'Metadata indicates ROE, fire-control, or live-fire weapon control support outside the noncombat companion scope.',
        pattern: /\brules? of engagement\b|\bdigital roe\b|\broe\b|\bfire control\b|\bweapon systems?\b|\bweapons? loading\b|\barmament\b|\blive fire\b|\bdirected energy engagement\b|\bautonomous weapons?\b/i
    },
    {
        id: 'prohibited-combat-force-employment',
        severity: 'critical',
        message: 'Metadata indicates direct combat force-employment or battle-management content outside the noncombat companion scope.',
        pattern: /\boffensive counter[- ]air\b|\bclose air support\b|\bsurface warfare\b|\banti-submarine warfare\b|\bamphibious assault\b|\bterminal attack control\b|\bforce employment\b|\bsea-control\b|\bair tasking\b|\bsuppress or destroy adversary\b/i
    },
    {
        id: 'prohibited-isr-or-ew',
        severity: 'critical',
        message: 'Metadata indicates ISR, sensor-tasking, or electronic-warfare attack support outside the noncombat companion scope.',
        pattern: /\bisr\b|\bsensor tasking\b|\bpriority intelligence requirements?\b|\belectronic warfare\b|\belectronic attack\b|\bcounter-space\b|\bmission data reprogramming\b/i
    },
    {
        id: 'prohibited-intel-led-harm-or-evasion',
        severity: 'critical',
        message: 'Metadata indicates intelligence-led harm, exfiltration, or counter-targeting support.',
        pattern: /\bpattern[- ]of[- ]life\b|\bcounter-targeting\b|\bbiometric exfiltration\b|\bspecial operations\b.*\bexfiltration\b/i
    }
];

const SUPPORT_DOMAIN_HINTS = [
    'logistics',
    'supply',
    'maintenance',
    'repair',
    'training',
    'rehearsal',
    'after-action',
    'after action',
    'medical',
    'health',
    'triage',
    'readiness',
    'scheduling',
    'handoff',
    'knowledge',
    'disaster',
    'humanitarian',
    'cyber defense',
    'cyber',
    'hardening',
    'recovery',
    'communications',
    'compliance',
    'audit',
    'safety',
    'interoperability',
    'continuity',
    'resilience',
    'evacuation',
    'mass care',
    'hospital',
    'clinic',
    'port',
    'rail',
    'water',
    'power',
    'microgrid'
];

const REQUIRED_SUPPORT_HEADINGS: HeadingRule[] = [
    {
        id: 'missing-mission-scope',
        message: 'Support-oriented skills should declare a mission scope or problem statement.',
        matches: [/mission scope/i, /problem statement/i]
    },
    {
        id: 'missing-workflow',
        message: 'Support-oriented skills should include a concrete workflow section.',
        matches: [/workflow/i]
    },
    {
        id: 'missing-output-format',
        message: 'Support-oriented skills should define expected outputs or a required output format.',
        matches: [/required output format/i, /expected outputs?/i]
    },
    {
        id: 'missing-required-inputs',
        message: 'Support-oriented skills should define required inputs, source expectations, or freshness constraints.',
        matches: [/required inputs?/i, /input requirements?/i, /core inputs?/i],
        evidenceMatches: [
            /frame the mission problem using these core inputs:/i,
            /for each external (?:tool|dependency).*required inputs/i,
            /confirm [^\n.]+ before recommending action/i
        ]
    },
    {
        id: 'missing-tool-protocol',
        message: 'Support-oriented skills should define exact external tool or protocol usage.',
        matches: [/tool invocation contract/i, /tool protocol playbooks?/i, /external tools? and protocol integration/i, /domain tooling and protocol baseline/i]
    },
    {
        id: 'missing-validation',
        message: 'Support-oriented skills should include an interoperability, validation, or assurance section.',
        matches: [/validation/i, /assurance/i]
    },
    {
        id: 'missing-failure-handling',
        message: 'Support-oriented skills should include explicit failure handling, degraded operations, or fallback recovery guidance.',
        matches: [/failure handling/i, /failure modes/i, /degraded operations/i, /fallback and recovery/i, /contingencies/i],
        evidenceMatches: [
            /degraded-mode|degraded mode/i,
            /manual workaround/i,
            /downgrade to advisory-only/i,
            /fallback path/i,
            /no-go status/i,
            /revalidation trigger/i,
            /if [^\n.]{0,80}(?:fail|fails|failed|unavailable|uncertain)/i
        ]
    },
    {
        id: 'missing-guardrails',
        message: 'Support-oriented skills should define guardrails or allowed-use boundaries.',
        matches: [/guardrails/i, /allowed use boundaries/i]
    }
];

function normalizeText(value: string): string {
    return String(value || '')
        .trim()
        .toLowerCase();
}

function parseMetadata(markdown: string): Metadata {
    const frontmatterMatch = markdown.match(/^---\n([\s\S]*?)\n---\n?/);
    const frontmatter = frontmatterMatch?.[1] || '';

    const nameMatch = frontmatter.match(/(?:^|\n)name:\s+(.+?)(?:\n|$)/);
    const descriptionMatch = frontmatter.match(/(?:^|\n)description:\s+(.+?)(?:\n|$)/);
    const titleMatch = markdown.match(/^#\s+(.+?)$/m);

    return {
        skillName: String(nameMatch?.[1] || '').trim(),
        description: String(descriptionMatch?.[1] || '').trim(),
        title: String(titleMatch?.[1] || '').trim()
    };
}

function extractHeadings(markdown: string): string[] {
    const headings = markdown.match(/^##+\s+.+$/gm) || [];
    return headings.map((heading) => heading.replace(/^##+\s+/, '').trim());
}

function matchesAny(text: string, values: string[]): boolean {
    const normalized = normalizeText(text);
    if (!normalized) return false;
    return values.some((value) => normalized.includes(value));
}

function hasHeadingOrEvidence(markdown: string, headings: string[], rule: HeadingRule): boolean {
    if (rule.matches.some((pattern) => headings.some((heading) => pattern.test(heading)))) {
        return true;
    }

    if (!rule.evidenceMatches || rule.evidenceMatches.length === 0) {
        return false;
    }

    return rule.evidenceMatches.some((pattern) => pattern.test(markdown));
}

function createFinding(rule: Rule, matchedText?: string): WarfighterSafetyFinding {
    return {
        ruleId: rule.id,
        severity: rule.severity,
        message: rule.message,
        matchedText
    };
}

export function auditWarfighterSkillMarkdown({
    skillPath,
    markdown
}: {
    skillPath: string;
    markdown: string;
}): WarfighterSkillAuditResult {
    const metadata = parseMetadata(markdown);
    const metadataText = [metadata.skillName, metadata.title, metadata.description]
        .filter(Boolean)
        .join(' ');
    const headings = extractHeadings(markdown);

    const prohibitedFindings = PROHIBITED_METADATA_RULES
        .map((rule) => {
            const match = metadataText.match(rule.pattern);
            return match ? createFinding(rule, match[0]) : null;
        })
        .filter((finding): finding is WarfighterSafetyFinding => Boolean(finding));

    const isSupportOriented = matchesAny(metadataText, SUPPORT_DOMAIN_HINTS);
    const structuralFindings = isSupportOriented && prohibitedFindings.length === 0
        ? REQUIRED_SUPPORT_HEADINGS
            .filter((rule) => !hasHeadingOrEvidence(markdown, headings, rule))
            .map((rule) => ({
                ruleId: rule.id,
                severity: 'medium' as const,
                message: rule.message
            }))
        : [];

    return {
        skillPath,
        skillName: metadata.skillName,
        title: metadata.title,
        description: metadata.description,
        isSupportOriented,
        prohibitedFindings,
        structuralFindings
    };
}

function walkSkillFiles(root: string): string[] {
    if (!fs.existsSync(root)) return [];
    const results: string[] = [];
    const pending = [root];

    while (pending.length > 0) {
        const current = pending.pop();
        if (!current) continue;
        const entries = fs.readdirSync(current, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(current, entry.name);
            if (entry.isDirectory()) {
                if (entry.name === '_shared') continue;
                pending.push(fullPath);
                continue;
            }
            if (entry.isFile() && entry.name === 'SKILL.md') {
                results.push(fullPath);
            }
        }
    }

    return results.sort((a, b) => a.localeCompare(b));
}

function summarizeFindings(results: WarfighterSkillAuditResult[]): WarfighterSafetyAuditSummary {
    const findingsByRule = new Map<string, number>();
    let supportSkillCount = 0;
    let prohibitedSkillCount = 0;
    let structuralGapSkillCount = 0;
    let prohibitedFindingCount = 0;
    let structuralFindingCount = 0;

    for (const result of results) {
        if (result.isSupportOriented) supportSkillCount += 1;
        if (result.prohibitedFindings.length > 0) prohibitedSkillCount += 1;
        if (result.structuralFindings.length > 0) structuralGapSkillCount += 1;

        for (const finding of result.prohibitedFindings) {
            prohibitedFindingCount += 1;
            findingsByRule.set(finding.ruleId, (findingsByRule.get(finding.ruleId) || 0) + 1);
        }
        for (const finding of result.structuralFindings) {
            structuralFindingCount += 1;
            findingsByRule.set(finding.ruleId, (findingsByRule.get(finding.ruleId) || 0) + 1);
        }
    }

    return {
        generatedAt: new Date().toISOString(),
        scannedSkillCount: results.length,
        supportSkillCount,
        prohibitedSkillCount,
        structuralGapSkillCount,
        prohibitedFindingCount,
        structuralFindingCount,
        findingsByRule: Array.from(findingsByRule.entries())
            .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
            .map(([ruleId, count]) => ({ ruleId, count }))
    };
}

export function auditWarfighterSkillCorpus(repoRoot: string): WarfighterSafetyAuditReport {
    const corpusRoot = path.join(repoRoot, 'skills', 'warfighter');
    const skillFiles = walkSkillFiles(corpusRoot);
    const results = skillFiles.map((skillFile) => {
        const markdown = fs.readFileSync(skillFile, 'utf8');
        return auditWarfighterSkillMarkdown({
            skillPath: path.relative(repoRoot, skillFile),
            markdown
        });
    });

    return {
        generatedAt: new Date().toISOString(),
        corpusRoot: path.relative(repoRoot, corpusRoot),
        summary: summarizeFindings(results),
        results
    };
}

export function renderWarfighterSafetyAuditMarkdown(report: WarfighterSafetyAuditReport): string {
    const prohibited = report.results
        .filter((result) => result.prohibitedFindings.length > 0)
        .slice(0, 25);
    const structural = report.results
        .filter((result) => result.structuralFindings.length > 0)
        .slice(0, 25);

    const lines = [
        '# Warfighter Safety Audit',
        '',
        `- generatedAt: ${report.generatedAt}`,
        `- corpusRoot: ${report.corpusRoot}`,
        `- scannedSkillCount: ${report.summary.scannedSkillCount}`,
        `- supportSkillCount: ${report.summary.supportSkillCount}`,
        `- prohibitedSkillCount: ${report.summary.prohibitedSkillCount}`,
        `- structuralGapSkillCount: ${report.summary.structuralGapSkillCount}`,
        `- prohibitedFindingCount: ${report.summary.prohibitedFindingCount}`,
        `- structuralFindingCount: ${report.summary.structuralFindingCount}`,
        '',
        '## Findings By Rule',
        ''
    ];

    if (report.summary.findingsByRule.length === 0) {
        lines.push('- none');
    } else {
        for (const item of report.summary.findingsByRule) {
            lines.push(`- ${item.ruleId}: ${item.count}`);
        }
    }

    lines.push('', '## Prohibited Skills', '');
    if (prohibited.length === 0) {
        lines.push('- none');
    } else {
        for (const result of prohibited) {
            const finding = result.prohibitedFindings[0];
            lines.push(`- ${result.skillPath}: ${finding?.ruleId || 'prohibited'}${finding?.matchedText ? ` match=${finding.matchedText}` : ''}`);
        }
    }

    lines.push('', '## Support Skill Structural Gaps', '');
    if (structural.length === 0) {
        lines.push('- none');
    } else {
        for (const result of structural) {
            const finding = result.structuralFindings[0];
            lines.push(`- ${result.skillPath}: ${finding?.ruleId || 'gap'}`);
        }
    }

    return lines.join('\n');
}
