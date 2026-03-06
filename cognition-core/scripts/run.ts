import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

type StageName = 'ingest' | 'analyze' | 'plan' | 'dispatch' | 'evaluate' | 'report';

interface RunOptions {
    dispatch: boolean;
    help: boolean;
}

interface StageAttempt {
    script: string;
    args: string[];
}

interface Stage {
    name: StageName;
    required: boolean;
    enabled: boolean;
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
    note?: string;
}

function printHelp(): void {
    console.log(`Run cognition-core pipeline (ingest -> analyze -> plan -> dispatch -> evaluate -> report)

Usage:
  tsx scripts/run.ts [options]

Options:
  --dispatch <true|false>    Enable dispatch stage (default: false)
  -h, --help                 Show help
`);
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
    if (!value) return fallback;
    const normalized = value.trim().toLowerCase();
    if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
    if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
    return fallback;
}

function parseArgs(argv: string[]): RunOptions {
    const options: RunOptions = {
        dispatch: false,
        help: false
    };

    for (let i = 0; i < argv.length; i++) {
        const token = argv[i];

        if (token === '--help' || token === '-h') {
            options.help = true;
            continue;
        }

        if (token === '--dispatch') {
            const value = argv[i + 1];
            options.dispatch = parseBoolean(value, true);
            if (value && !value.startsWith('--')) {
                i++;
            }
            continue;
        }

        throw new Error(`Unknown argument: ${token}`);
    }

    return options;
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
    try {
        const options = parseArgs(process.argv.slice(2));
        if (options.help) {
            printHelp();
            return;
        }

        const scriptDir = path.dirname(fileURLToPath(import.meta.url));
        const cognitionCoreDir = path.resolve(scriptDir, '..');

        const stages: Stage[] = [
            {
                name: 'ingest',
                required: false,
                enabled: true,
                attempts: [{ script: 'scripts/ingest.ts', args: [] }]
            },
            {
                name: 'analyze',
                required: false,
                enabled: true,
                attempts: [{ script: 'scripts/analyze.ts', args: [] }]
            },
            {
                name: 'plan',
                required: false,
                enabled: true,
                attempts: [
                    { script: 'scripts/plan.ts', args: [] },
                    {
                        script: 'scripts/plan-remediation-tasks.ts',
                        args: ['--report', 'reports/cognition-report.json', '--out', 'reports/remediation-tasks.json']
                    }
                ]
            },
            {
                name: 'dispatch',
                required: false,
                enabled: options.dispatch,
                attempts: [{ script: 'scripts/dispatch.ts', args: [] }]
            },
            {
                name: 'evaluate',
                required: true,
                enabled: true,
                attempts: [{ script: 'scripts/evaluate.ts', args: [] }]
            },
            {
                name: 'report',
                required: true,
                enabled: true,
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

            if (!stage.enabled) {
                result = {
                    ...result,
                    finishedAt: new Date().toISOString(),
                    note: 'disabled_by_flag'
                };
                results.push(result);
                console.log(`\n=== ${stage.name.toUpperCase()} skipped (disabled) ===`);
                continue;
            }

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
                    finishedAt: new Date().toISOString(),
                    note: 'no_matching_script'
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
            pipeline: stages.map((stage) => stage.name),
            options,
            results
        };

        writeManifest(manifestPath, manifest);
        console.log(`\nRun manifest: ${manifestPath}`);

        const failedRequired = results.some((item) => item.required && item.status !== 'ok');
        if (failedRequired) {
            process.exit(1);
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`Run failed: ${message}`);
        process.exit(1);
    }
})();
