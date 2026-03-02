import path from 'path';
import {
    loadJson,
    loadSkillPackageSpec,
    readContractSchemas,
    validateSchema,
    type SkillPackageSpec
} from './contracts.js';

type RunnerInput = {
    task: string;
    objective: string;
    constraints: string[];
    context: {
        urgency: 'low' | 'medium' | 'high';
        riskTolerance: 'low' | 'medium' | 'high';
        budgetTier: 'small' | 'medium' | 'large';
    };
};

type RunnerOutput = {
    status: 'ready' | 'needs_review';
    summary: string;
    plan: string[];
    controls: string[];
    kpis: string[];
    evidence: {
        sourceSkillId: number;
        sourceImplementationPath: string;
        generatedAt: string;
    };
};

type RunResult = {
    spec: SkillPackageSpec;
    input: RunnerInput;
    output: RunnerOutput;
    validation: {
        inputValid: boolean;
        outputValid: boolean;
        errors: string[];
    };
};

function clampPlan(steps: string[], max = 6): string[] {
    return steps.slice(0, max).map((step, index) => `${index + 1}. ${String(step || '').trim()}`);
}

function buildControls(spec: SkillPackageSpec, implementation: Record<string, unknown>): string[] {
    const guardrails = (implementation.improvementProfile as Record<string, unknown> | undefined)?.guardrails as Array<Record<string, unknown>> | undefined;
    if (!Array.isArray(guardrails) || guardrails.length === 0) {
        return ['Require contract validation and oversight review before execution.'];
    }

    return guardrails.slice(0, 6).map((guardrail) => {
        const kind = String(guardrail.kind || 'quality');
        const rule = String(guardrail.rule || 'Apply runtime guardrail.');
        return `[${kind}] ${rule}`;
    });
}

function buildKpis(implementation: Record<string, unknown>): string[] {
    const runtimeProfile = implementation.runtimeProfile as Record<string, unknown> | undefined;
    const kpiFocus = runtimeProfile?.kpiFocus as string[] | undefined;
    if (Array.isArray(kpiFocus) && kpiFocus.length > 0) {
        return kpiFocus.slice(0, 6).map((entry) => String(entry));
    }
    return ['outcome quality', 'cycle time', 'risk reduction'];
}

function normalizeStatus(input: RunnerInput): 'ready' | 'needs_review' {
    if (input.context.riskTolerance === 'low' && input.context.urgency === 'high') {
        return 'needs_review';
    }
    return 'ready';
}

export function runSkillPackage(packageDir: string, input: unknown): RunResult {
    const absolutePackageDir = path.resolve(packageDir);
    const spec = loadSkillPackageSpec(absolutePackageDir);
    const contracts = readContractSchemas(spec, absolutePackageDir);
    const inputValidation = validateSchema(input, contracts.inputSchema);

    if (!inputValidation.valid) {
        return {
            spec,
            input: input as RunnerInput,
            output: {
                status: 'needs_review',
                summary: 'Input contract validation failed.',
                plan: [],
                controls: [],
                kpis: [],
                evidence: {
                    sourceSkillId: spec.skill.id,
                    sourceImplementationPath: spec.references.implementationPath,
                    generatedAt: new Date().toISOString()
                }
            },
            validation: {
                inputValid: false,
                outputValid: false,
                errors: inputValidation.errors
            }
        };
    }

    const typedInput = input as RunnerInput;
    const implementationPath = path.resolve(absolutePackageDir, spec.references.implementationPath);
    const implementation = loadJson<Record<string, unknown>>(implementationPath);
    const implementationGuide = Array.isArray(implementation.implementationGuide)
        ? implementation.implementationGuide.map((step) => String(step))
        : [];

    const output: RunnerOutput = {
        status: normalizeStatus(typedInput),
        summary:
            `${spec.skill.title}: ${typedInput.objective}. ` +
            `Method=${spec.skill.method}; Archetype=${spec.skill.archetype}; Vertical=${spec.skill.verticalName}.`,
        plan: clampPlan(implementationGuide),
        controls: buildControls(spec, implementation),
        kpis: buildKpis(implementation),
        evidence: {
            sourceSkillId: spec.skill.id,
            sourceImplementationPath: spec.references.implementationPath,
            generatedAt: new Date().toISOString()
        }
    };

    const outputValidation = validateSchema(output, contracts.outputSchema);

    return {
        spec,
        input: typedInput,
        output,
        validation: {
            inputValid: true,
            outputValid: outputValidation.valid,
            errors: outputValidation.errors
        }
    };
}
