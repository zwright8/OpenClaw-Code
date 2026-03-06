import type { RiskTier } from '../reasoning/anomaly.js';

export type ApprovalLevel = 'none' | 'team-lead' | 'security' | 'executive';

export interface ApprovalGateResult {
    required: boolean;
    level: ApprovalLevel;
    reason: string;
}

const LEVEL_ORDER: Record<ApprovalLevel, number> = {
    none: 0,
    'team-lead': 1,
    security: 2,
    executive: 3
};

export function determineApprovalRequirement(
    riskTier: RiskTier,
    confidence: number,
    hasRollbackPlan = true
): ApprovalGateResult {
    if (riskTier === 'critical') {
        return {
            required: true,
            level: 'executive',
            reason: 'Critical-risk recommendations require executive approval.'
        };
    }

    if (riskTier === 'high') {
        return {
            required: true,
            level: 'security',
            reason: 'High-risk recommendations require security approval.'
        };
    }

    if (riskTier === 'medium' && (confidence < 0.6 || !hasRollbackPlan)) {
        return {
            required: true,
            level: 'team-lead',
            reason: 'Medium-risk recommendations require team-lead approval when confidence is low or rollback is missing.'
        };
    }

    return {
        required: false,
        level: 'none',
        reason: 'No approval gate required for this recommendation.'
    };
}

export function isApprovalSatisfied(
    requiredLevel: ApprovalLevel,
    grantedLevels: ApprovalLevel[] = []
): boolean {
    if (requiredLevel === 'none') return true;

    const maxGranted = grantedLevels.reduce<ApprovalLevel>((current, granted) => {
        if (!LEVEL_ORDER[granted]) return current;
        return LEVEL_ORDER[granted] > LEVEL_ORDER[current] ? granted : current;
    }, 'none');

    return LEVEL_ORDER[maxGranted] >= LEVEL_ORDER[requiredLevel];
}
