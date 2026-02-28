import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

interface StageAttempt {
    script: string;
    args: string[];
}

interface Stage {
    name: 'ingest' | 'analyze' | 'plan' | 'evaluate' | 'report';
    required: boolean;
    attempts: StageAttempt[];
}

interface StageResult {
    name: Stage['name'];
    status: 'ok' | 'skipped' | 'failed';
    script: string | null;
    code: number | null;
    required: boolean;
    startedAt: string;
    finishedAt: string;
}

function stageExists(cognitionCoreDir: string, script: string): boolean {
    return fs.existsSync(path.join(cognitionCoreDir, script));
}

function runStageAttempt(
    cognitionCoreDir: string,
    attempt: StageAttempt
): { code: number; scriptPath: string } {
    const scriptPath = path.join(cognitionCoreDir, attempt.script);
    const child = spawnSync('tsx', [attempt.script, ...attempt.args], {
        cwd: cognitionCoreDir,
        stdio: 'inherit'
    });

    return {
        code: typeof child.status === 'number' ? child.status : 1,
        scriptPath
    };
}

function writeManifest(filePath: string, payload: unknown): void {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`);
}

(async () => {
    const scriptDir = path.dirname(fileURLToPath(import.meta.url));
    const cognitionCoreDir = path.resolve(scriptDir, '..');

    const stages: Stage[] = [
        {
            name: 'ingest',
            required: false,
            attempts: [{ script: 'scripts/ingest.ts', args: [] }]
        },
        {
            name: 'analyze',
            required: false,
            attempts: [{ script: 'scripts/analyze.ts', args: [] }]
        },
        {
            name: 'plan',
            required: false,
            attempts: [
                { script: 'scripts/plan.ts', args: [] },
                {
                    script: 'scripts/plan-remediation-tasks.ts',
                    args: ['--report', 'reports/cognition-report.json', '--out', 'reports/remediation-tasks.json']
                }
            ]
        },
        {
            name: 'evaluate',
            required: true,
            attempts: [{ script: 'scripts/evaluate.ts', args: [] }]
        },
        {
            name: 'report',
            required: true,
            attempts: [{ script: 'scripts/report.ts', args: [] }]
        }
    ];

    const results: StageResult[] = [];

    for (const stage of stages) {
        const startedAt = new Date().toISOString();
        let result: StageResult = {
            name: stage.name,
            status: 'skipped',
            script: null,
            code: null,
            required: stage.required,
            startedAt,
            finishedAt: startedAt
        };

        let ran = false;

        for (const attempt of stage.attempts) {
            if (!stageExists(cognitionCoreDir, attempt.script)) {
                continue;
            }

            ran = true;
            console.log(`\n=== ${stage.name.toUpperCase()} :: ${attempt.script} ===`);
            const execution = runStageAttempt(cognitionCoreDir, attempt);
            result = {
                ...result,
                script: execution.scriptPath,
                code: execution.code,
                status: execution.code === 0 ? 'ok' : 'failed',
                finishedAt: new Date().toISOString()
            };

            if (execution.code === 0) {
                break;
            }
        }

        if (!ran) {
            result = {
                ...result,
                status: 'skipped',
                finishedAt: new Date().toISOString()
            };
            console.log(`\n=== ${stage.name.toUpperCase()} skipped (no matching script) ===`);
        } else if (result.status === 'failed') {
            const stageLabel = stage.required ? 'required' : 'best-effort';
            console.log(`Stage ${stage.name} failed (${stageLabel}).`);
            if (stage.required) {
                results.push(result);
                break;
            }
        }

        results.push(result);
    }

    const manifestPath = path.join(cognitionCoreDir, 'reports/cognition-run.json');
    const manifest = {
        generatedAt: new Date().toISOString(),
        pipeline: ['ingest', 'analyze', 'plan', 'evaluate', 'report'],
        results
    };

    writeManifest(manifestPath, manifest);
    console.log(`\nRun manifest: ${manifestPath}`);

    const failedRequired = results.some((item) => item.required && item.status !== 'ok');
    if (failedRequired) {
        process.exit(1);
    }
})();
