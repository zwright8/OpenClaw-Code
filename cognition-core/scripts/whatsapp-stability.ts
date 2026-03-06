import fs from 'node:fs';
import path from 'node:path';
import { analyzeWhatsAppStability, renderStabilityMarkdown } from '../src/whatsapp-stability-tracker.js';

function getArg(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx === -1 || idx + 1 >= process.argv.length) return undefined;
  return process.argv[idx + 1];
}

const logPath = getArg('--log')
  || process.env.OPENCLAW_GATEWAY_ERR_LOG
  || path.join(process.env.HOME || '.', '.openclaw/logs/gateway.err.log');

const lookbackHours = Number(getArg('--hours') || '24');
const outJson = getArg('--json');
const outMarkdown = getArg('--markdown');

const summary = analyzeWhatsAppStability(logPath, { lookbackHours });
const markdown = renderStabilityMarkdown(summary);

console.log(markdown);

if (outJson) {
  fs.mkdirSync(path.dirname(outJson), { recursive: true });
  fs.writeFileSync(outJson, `${JSON.stringify(summary, null, 2)}\n`);
}

if (outMarkdown) {
  fs.mkdirSync(path.dirname(outMarkdown), { recursive: true });
  fs.writeFileSync(outMarkdown, markdown);
}

if (summary.alerts.some((a) => a.severity === 'critical')) {
  process.exitCode = 2;
}
