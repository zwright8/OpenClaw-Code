import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ingestGatewaySignals } from '../src/ingest/gateway-ingest.js';
import { ingestRuntimeSignals } from '../src/ingest/runtime-ingest.js';
import { ingestBusinessSignals } from '../src/ingest/business-ingest.js';
import { normalizeEventBatch } from '../src/normalize/event-normalizer.js';
import { enrichEvents } from '../src/normalize/enrichment.js';
import { dedupeEvents } from '../src/normalize/dedupe.js';

interface CliArgs {
    gateway: string[];
    runtime: string[];
    business: string[];
    sinceHours: number;
    out?: string;
}

function splitMultiValue(input?: string): string[] {
    if (!input || typeof input !== 'string') return [];

    return input
        .split(',')
        .map((item) => item.trim())
        .filter((item) => Boolean(item));
}

function parseArgs(argv: string[]): CliArgs {
    const args: CliArgs = {
        gateway: splitMultiValue(process.env.COGNITION_INGEST_GATEWAY_PATHS),
        runtime: splitMultiValue(process.env.COGNITION_INGEST_RUNTIME_PATHS),
        business: splitMultiValue(process.env.COGNITION_INGEST_BUSINESS_PATHS),
        sinceHours: Number(process.env.COGNITION_INGEST_SINCE_HOURS) || 24,
        out: undefined
    };

    for (let i = 0; i < argv.length; i++) {
        const token = argv[i];
        const next = argv[i + 1];

        if ((token === '--gateway' || token === '-g') && next) {
            args.gateway.push(...splitMultiValue(next));
            i++;
            continue;
        }

        if ((token === '--runtime' || token === '-r') && next) {
            args.runtime.push(...splitMultiValue(next));
            i++;
            continue;
        }

        if ((token === '--business' || token === '-b') && next) {
            args.business.push(...splitMultiValue(next));
            i++;
            continue;
        }

        if (token === '--since-hours' && next) {
            const parsed = Number(next);
            if (Number.isFinite(parsed) && parsed > 0) {
                args.sinceHours = parsed;
            }
            i++;
            continue;
        }

        if (token === '--out' && next) {
            args.out = next;
            i++;
            continue;
        }
    }

    args.gateway = Array.from(new Set(args.gateway));
    args.runtime = Array.from(new Set(args.runtime));
    args.business = Array.from(new Set(args.business));

    return args;
}

function writeJson(filePath: string, value: unknown): void {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

(async () => {
    try {
        const args = parseArgs(process.argv.slice(2));
        const sinceMs = Date.now() - (args.sinceHours * 60 * 60 * 1000);

        const rawGateway = ingestGatewaySignals({ paths: args.gateway, sinceMs });
        const rawRuntime = ingestRuntimeSignals({ paths: args.runtime, sinceMs });
        const rawBusiness = ingestBusinessSignals({ paths: args.business, sinceMs });

        const rawSignals = [...rawGateway, ...rawRuntime, ...rawBusiness];
        const normalized = normalizeEventBatch(rawSignals);
        const enriched = enrichEvents(normalized);
        const deduped = dedupeEvents(enriched);

        const generatedAt = new Date().toISOString();
        const report = {
            generatedAt,
            window: {
                sinceHours: args.sinceHours,
                sinceMs,
                sinceIso: new Date(sinceMs).toISOString()
            },
            counts: {
                raw: rawSignals.length,
                normalized: normalized.length,
                deduped: deduped.events.length,
                duplicatesRemoved: deduped.duplicates,
                bySource: {
                    gateway: rawGateway.length,
                    runtime: rawRuntime.length,
                    business: rawBusiness.length
                }
            },
            inputPaths: {
                gateway: args.gateway,
                runtime: args.runtime,
                business: args.business
            },
            duplicateEventIds: deduped.duplicateEventIds,
            events: deduped.events
        };

        const scriptDir = path.dirname(fileURLToPath(import.meta.url));
        const reportsDir = path.resolve(path.join(scriptDir, '..', 'reports'));
        const stamp = generatedAt.replace(/[:.]/g, '-');
        const outputPath = args.out
            ? path.resolve(args.out)
            : path.join(reportsDir, `normalized-event-stream-${stamp}.json`);
        const latestPath = path.join(reportsDir, 'normalized-event-stream.latest.json');

        writeJson(outputPath, report);
        writeJson(latestPath, report);

        console.log(`Ingested raw signals: ${rawSignals.length}`);
        console.log(`Normalized events: ${normalized.length}`);
        console.log(`Deduped events: ${deduped.events.length} (removed ${deduped.duplicates})`);
        console.log(`Artifact: ${outputPath}`);
        console.log(`Latest: ${latestPath}`);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`cognition-core ingest failed: ${message}`);
        process.exit(1);
    }
})();
