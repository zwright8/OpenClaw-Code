import crypto from 'crypto';
import fs from 'fs';
import http from 'http';
import os from 'os';
import path from 'path';
import { spawn } from 'child_process';

type BridgeHistoryEntry = {
    role: 'user' | 'assistant';
    content: string;
    at: string;
};

type ConversationState = {
    history: BridgeHistoryEntry[];
    lastStatus?: 'idle' | 'running' | 'failed';
    lastError?: string;
    updatedAt: string;
};

type BridgeState = {
    conversations: Record<string, ConversationState>;
};

type BridgeConfig = {
    host: string;
    port: number;
    publicBaseUrl?: string;
    twilioAccountSid: string;
    twilioAuthToken: string;
    twilioWhatsappFrom: string;
    codeWorkdir: string;
    codexModel?: string;
    codexDangerous: boolean;
    codexTimeoutMs: number;
    maxHistoryEntries: number;
    replyChunkChars: number;
    allowedSenders: Set<string>;
    allowUnlistedSenders: boolean;
    verifyTwilioSignatures: boolean;
};

const REPO_ROOT = process.cwd();
const STATE_DIR = path.join(REPO_ROOT, '.codex-whatsapp');
const STATE_PATH = path.join(STATE_DIR, 'state.json');
const runningSenders = new Set<string>();

function readRequiredEnv(name: string): string {
    const value = process.env[name]?.trim();
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

function readIntegerEnv(name: string, fallback: number): number {
    const value = process.env[name]?.trim();
    if (!value) return fallback;
    const parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) {
        throw new Error(`Environment variable ${name} must be a positive integer`);
    }
    return parsed;
}

function readBooleanEnv(name: string, fallback = false): boolean {
    const value = process.env[name]?.trim().toLowerCase();
    if (!value) return fallback;
    return ['1', 'true', 'yes', 'on'].includes(value);
}

function parseAllowedSenders(value: string | undefined): Set<string> {
    if (!value) return new Set();
    return new Set(
        value
            .split(',')
            .map((entry) => entry.trim())
            .filter(Boolean)
    );
}

function loadConfig(): BridgeConfig {
    const codeWorkdir = path.resolve(process.env.CODEX_WORKDIR?.trim() || REPO_ROOT);

    return {
        host: process.env.WHATSAPP_BRIDGE_HOST?.trim() || '0.0.0.0',
        port: readIntegerEnv('WHATSAPP_BRIDGE_PORT', 8787),
        publicBaseUrl: process.env.WHATSAPP_BRIDGE_BASE_URL?.trim(),
        twilioAccountSid: readRequiredEnv('TWILIO_ACCOUNT_SID'),
        twilioAuthToken: readRequiredEnv('TWILIO_AUTH_TOKEN'),
        twilioWhatsappFrom: readRequiredEnv('TWILIO_WHATSAPP_FROM'),
        codeWorkdir,
        codexModel: process.env.CODEX_MODEL?.trim() || undefined,
        codexDangerous: readBooleanEnv('CODEX_DANGEROUS', false),
        codexTimeoutMs: readIntegerEnv('CODEX_TIMEOUT_MS', 180000),
        maxHistoryEntries: readIntegerEnv('WHATSAPP_HISTORY_MESSAGES', 8),
        replyChunkChars: readIntegerEnv('WHATSAPP_REPLY_CHARS', 1400),
        allowedSenders: parseAllowedSenders(process.env.WHATSAPP_ALLOWED_SENDERS),
        allowUnlistedSenders: readBooleanEnv('WHATSAPP_ALLOW_UNLISTED_SENDERS', false),
        verifyTwilioSignatures: readBooleanEnv('TWILIO_VERIFY_SIGNATURES', true)
    };
}

function printHelp(): void {
    const help = `
Usage:
  npm run whatsapp:bridge

Required env:
  TWILIO_ACCOUNT_SID
  TWILIO_AUTH_TOKEN
  TWILIO_WHATSAPP_FROM

Recommended env:
  WHATSAPP_ALLOWED_SENDERS=whatsapp:+15551234567
  WHATSAPP_BRIDGE_BASE_URL=https://your-public-tunnel.example
  TWILIO_VERIFY_SIGNATURES=true

Optional Codex env:
  CODEX_WORKDIR=${REPO_ROOT}
  CODEX_MODEL=gpt-5-codex
  CODEX_TIMEOUT_MS=180000
  CODEX_DANGEROUS=false

Webhook route:
  POST /twilio/whatsapp
  GET  /health
`.trim();

    console.log(help);
}

function ensureStateDir(): void {
    fs.mkdirSync(STATE_DIR, { recursive: true });
}

function loadState(): BridgeState {
    ensureStateDir();
    if (!fs.existsSync(STATE_PATH)) {
        return { conversations: {} };
    }

    const raw = fs.readFileSync(STATE_PATH, 'utf8').trim();
    if (!raw) {
        return { conversations: {} };
    }

    try {
        const parsed = JSON.parse(raw) as BridgeState;
        return {
            conversations: parsed.conversations ?? {}
        };
    } catch {
        const backupPath = `${STATE_PATH}.corrupt.${Date.now()}`;
        fs.copyFileSync(STATE_PATH, backupPath);
        return { conversations: {} };
    }
}

function saveState(state: BridgeState): void {
    ensureStateDir();
    fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
}

function getConversation(state: BridgeState, sender: string): ConversationState {
    const existing = state.conversations[sender];
    if (existing) return existing;

    const created: ConversationState = {
        history: [],
        updatedAt: new Date().toISOString(),
        lastStatus: 'idle'
    };
    state.conversations[sender] = created;
    return created;
}

function pushHistory(
    conversation: ConversationState,
    role: 'user' | 'assistant',
    content: string,
    maxEntries: number
): void {
    conversation.history.push({
        role,
        content,
        at: new Date().toISOString()
    });
    if (conversation.history.length > maxEntries) {
        conversation.history.splice(0, conversation.history.length - maxEntries);
    }
    conversation.updatedAt = new Date().toISOString();
}

function resetConversation(state: BridgeState, sender: string): void {
    state.conversations[sender] = {
        history: [],
        updatedAt: new Date().toISOString(),
        lastStatus: 'idle'
    };
}

function escapeXml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function twimlMessage(message: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${escapeXml(message)}</Message></Response>`;
}

function sendTwiml(res: http.ServerResponse, message: string, statusCode = 200): void {
    const body = twimlMessage(message);
    res.writeHead(statusCode, {
        'Content-Type': 'text/xml; charset=utf-8',
        'Content-Length': Buffer.byteLength(body)
    });
    res.end(body);
}

function sendJson(res: http.ServerResponse, statusCode: number, payload: object): void {
    const body = JSON.stringify(payload, null, 2);
    res.writeHead(statusCode, {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(body)
    });
    res.end(body);
}

function buildRequestUrl(req: http.IncomingMessage, config: BridgeConfig): string {
    const host = config.publicBaseUrl
        ? config.publicBaseUrl.replace(/\/$/, '')
        : `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host || `localhost:${config.port}`}`;
    return `${host}${req.url || '/'}`;
}

async function readRawBody(req: http.IncomingMessage): Promise<string> {
    const buffers: Buffer[] = [];
    for await (const chunk of req) {
        buffers.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(buffers).toString('utf8');
}

function computeTwilioSignature(url: string, params: URLSearchParams, authToken: string): string {
    const sorted = [...params.entries()].sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey));
    const payload = sorted.reduce((accumulator, [key, value]) => accumulator + key + value, url);
    return crypto.createHmac('sha1', authToken).update(payload).digest('base64');
}

function timingSafeEqual(left: string, right: string): boolean {
    const leftBuffer = Buffer.from(left);
    const rightBuffer = Buffer.from(right);
    if (leftBuffer.length !== rightBuffer.length) return false;
    return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function stripAnsi(value: string): string {
    return value.replace(
        /\u001B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g,
        ''
    );
}

function normalizeMessage(value: string): string {
    return stripAnsi(value).replace(/\r\n/g, '\n').trim();
}

function splitIntoChunks(value: string, maxChars: number): string[] {
    const text = normalizeMessage(value);
    if (!text) return ['(no output)'];
    if (text.length <= maxChars) return [text];

    const chunks: string[] = [];
    let remaining = text;

    while (remaining.length > maxChars) {
        let splitAt = remaining.lastIndexOf('\n\n', maxChars);
        if (splitAt < 0) splitAt = remaining.lastIndexOf('\n', maxChars);
        if (splitAt < 0) splitAt = remaining.lastIndexOf(' ', maxChars);
        if (splitAt < Math.floor(maxChars * 0.5)) splitAt = maxChars;

        chunks.push(remaining.slice(0, splitAt).trim());
        remaining = remaining.slice(splitAt).trim();
    }

    if (remaining) chunks.push(remaining);
    return chunks;
}

async function sendWhatsappMessage(config: BridgeConfig, to: string, body: string): Promise<void> {
    const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${config.twilioAccountSid}/Messages.json`,
        {
            method: 'POST',
            headers: {
                Authorization: `Basic ${Buffer.from(`${config.twilioAccountSid}:${config.twilioAuthToken}`).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                To: to,
                From: config.twilioWhatsappFrom,
                Body: body
            })
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Twilio send failed (${response.status}): ${errorText.slice(0, 500)}`);
    }
}

function truncateForWhatsapp(value: string, maxChars: number): string {
    const normalized = normalizeMessage(value);
    if (normalized.length <= maxChars) return normalized;
    return `${normalized.slice(0, Math.max(0, maxChars - 3)).trimEnd()}...`;
}

function buildCodexPrompt(
    sender: string,
    latestMessage: string,
    conversation: ConversationState,
    config: BridgeConfig
): string {
    const recentHistory = conversation.history
        .slice(0, -1)
        .slice(-config.maxHistoryEntries)
        .map((entry) => `${entry.role === 'user' ? 'User' : 'Assistant'} (${entry.at}): ${entry.content}`)
        .join('\n');

    return [
        'You are Codex replying through WhatsApp.',
        'Keep the response concise, practical, and mobile-friendly.',
        'If you inspect or change code, mention only the most important file paths and outcomes.',
        'If the request is ambiguous, ask at most one short clarifying question.',
        `Repository root: ${config.codeWorkdir}`,
        `WhatsApp sender: ${sender}`,
        recentHistory ? `Recent WhatsApp context:\n${recentHistory}` : '',
        `Latest WhatsApp message:\n${latestMessage}`
    ]
        .filter(Boolean)
        .join('\n\n');
}

type CodexRunResult = {
    ok: boolean;
    output: string;
};

async function runCodex(prompt: string, config: BridgeConfig): Promise<CodexRunResult> {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'codex-whatsapp-'));
    const outputPath = path.join(tempDir, 'last-message.txt');
    const args = [
        'exec',
        config.codexDangerous ? '--dangerously-bypass-approvals-and-sandbox' : '--full-auto',
        '--ephemeral',
        '--color',
        'never',
        '--cd',
        config.codeWorkdir,
        '--output-last-message',
        outputPath
    ];

    if (config.codexModel) {
        args.push('--model', config.codexModel);
    }

    args.push(prompt);

    return await new Promise<CodexRunResult>((resolve) => {
        const child = spawn('codex', args, {
            cwd: config.codeWorkdir,
            env: process.env,
            stdio: ['ignore', 'pipe', 'pipe']
        });

        let stdout = '';
        let stderr = '';
        let finished = false;

        const finish = (result: CodexRunResult) => {
            if (finished) return;
            finished = true;
            clearTimeout(timeout);
            resolve(result);
        };

        const timeout = setTimeout(() => {
            child.kill('SIGTERM');
            setTimeout(() => child.kill('SIGKILL'), 3000).unref();
            finish({
                ok: false,
                output: `Codex timed out after ${Math.round(config.codexTimeoutMs / 1000)} seconds.`
            });
        }, config.codexTimeoutMs);

        child.stdout.on('data', (chunk) => {
            stdout += chunk.toString();
        });

        child.stderr.on('data', (chunk) => {
            stderr += chunk.toString();
        });

        child.on('error', (error) => {
            finish({
                ok: false,
                output: `Failed to launch Codex: ${error.message}`
            });
        });

        child.on('close', (code) => {
            const fileOutput = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, 'utf8') : '';
            const combinedOutput = normalizeMessage(fileOutput || stdout || stderr);
            const errorOutput = normalizeMessage(stderr || stdout || 'Codex exited without output.');
            finish({
                ok: code === 0,
                output: code === 0 ? combinedOutput : errorOutput
            });
        });
    });
}

async function sendCodexResult(config: BridgeConfig, to: string, message: string): Promise<void> {
    const chunks = splitIntoChunks(message, config.replyChunkChars);
    for (const chunk of chunks) {
        await sendWhatsappMessage(config, to, chunk);
    }
}

function isSenderAllowed(config: BridgeConfig, sender: string): boolean {
    if (config.allowUnlistedSenders) return true;
    if (config.allowedSenders.size === 0) return false;
    return config.allowedSenders.has(sender);
}

async function handleCodexTask(config: BridgeConfig, sender: string, body: string): Promise<void> {
    const state = loadState();
    const conversation = getConversation(state, sender);
    conversation.lastStatus = 'running';
    conversation.lastError = undefined;
    pushHistory(conversation, 'user', body, config.maxHistoryEntries);
    saveState(state);

    const prompt = buildCodexPrompt(sender, body, conversation, config);
    const result = await runCodex(prompt, config);

    const nextState = loadState();
    const nextConversation = getConversation(nextState, sender);
    nextConversation.lastStatus = result.ok ? 'idle' : 'failed';
    nextConversation.lastError = result.ok ? undefined : result.output;

    const responseText = result.ok
        ? result.output || 'Codex finished without a final message.'
        : `Codex hit an error:\n${truncateForWhatsapp(result.output, config.replyChunkChars * 2)}`;

    pushHistory(nextConversation, 'assistant', responseText, config.maxHistoryEntries);
    saveState(nextState);

    await sendCodexResult(config, sender, responseText);
}

function logStartup(config: BridgeConfig): void {
    const allowed = config.allowedSenders.size > 0
        ? [...config.allowedSenders].join(', ')
        : config.allowUnlistedSenders
            ? '(all senders allowed)'
            : '(none configured)';

    console.log('[whatsapp-bridge] starting');
    console.log(`[whatsapp-bridge] listening on http://${config.host}:${config.port}`);
    console.log(`[whatsapp-bridge] codex workdir: ${config.codeWorkdir}`);
    console.log(`[whatsapp-bridge] sender policy: ${allowed}`);
    console.log(`[whatsapp-bridge] twilio signature verification: ${config.verifyTwilioSignatures ? 'enabled' : 'disabled'}`);
    console.log(`[whatsapp-bridge] codex execution mode: ${config.codexDangerous ? 'dangerous' : 'full-auto'}`);
}

async function handleWebhook(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    config: BridgeConfig
): Promise<void> {
    const rawBody = await readRawBody(req);
    const params = new URLSearchParams(rawBody);
    const sender = params.get('From')?.trim() || '';
    const body = params.get('Body')?.trim() || '';

    if (!sender) {
        sendTwiml(res, 'Missing sender number.', 400);
        return;
    }

    if (config.verifyTwilioSignatures) {
        const signature = req.headers['x-twilio-signature'];
        if (typeof signature !== 'string' || !signature) {
            sendTwiml(res, 'Missing Twilio signature.', 403);
            return;
        }

        const requestUrl = buildRequestUrl(req, config);
        const expectedSignature = computeTwilioSignature(requestUrl, params, config.twilioAuthToken);
        if (!timingSafeEqual(signature, expectedSignature)) {
            sendTwiml(res, 'Twilio signature verification failed.', 403);
            return;
        }
    }

    if (!isSenderAllowed(config, sender)) {
        sendTwiml(
            res,
            'This WhatsApp number is not allowlisted for Codex. Add it to WHATSAPP_ALLOWED_SENDERS first.',
            403
        );
        return;
    }

    if (!body) {
        sendTwiml(res, 'Send a text message and I will route it to Codex.');
        return;
    }

    if (runningSenders.has(sender)) {
        sendTwiml(res, 'I am still working on your previous Codex request. Send /status for a quick check.');
        return;
    }

    const normalizedBody = body.trim();
    const lowerBody = normalizedBody.toLowerCase();

    if (lowerBody === '/help') {
        sendTwiml(
            res,
            'Send any request and I will run Codex in this repo. Commands: /status, /reset, /help.'
        );
        return;
    }

    if (lowerBody === '/status') {
        const state = loadState();
        const conversation = getConversation(state, sender);
        const status = runningSenders.has(sender) ? 'running' : (conversation.lastStatus || 'idle');
        sendTwiml(
            res,
            `Status: ${status}. Workdir: ${config.codeWorkdir}. Last update: ${conversation.updatedAt}.`
        );
        return;
    }

    if (lowerBody === '/reset') {
        const state = loadState();
        resetConversation(state, sender);
        saveState(state);
        sendTwiml(res, 'Reset your WhatsApp conversation history for this bridge.');
        return;
    }

    runningSenders.add(sender);
    sendTwiml(res, 'On it. I am handing this to Codex now and will send the result shortly.');

    void handleCodexTask(config, sender, normalizedBody)
        .catch(async (error: Error) => {
            console.error(`[whatsapp-bridge] sender=${sender} error=${error.message}`);
            try {
                await sendWhatsappMessage(
                    config,
                    sender,
                    truncateForWhatsapp(`Bridge failure: ${error.message}`, config.replyChunkChars)
                );
            } catch (sendError) {
                console.error(
                    `[whatsapp-bridge] sender=${sender} send-error=${sendError instanceof Error ? sendError.message : String(sendError)}`
                );
            }
        })
        .finally(() => {
            runningSenders.delete(sender);
        });
}

function createServer(config: BridgeConfig): http.Server {
    return http.createServer((req, res) => {
        void (async () => {
            if (!req.url) {
                sendJson(res, 404, { error: 'Missing request URL' });
                return;
            }

            if (req.method === 'GET' && req.url === '/health') {
                sendJson(res, 200, {
                    ok: true,
                    service: 'whatsapp-codex-bridge',
                    workdir: config.codeWorkdir,
                    runningSenders: runningSenders.size
                });
                return;
            }

            if (req.method === 'POST' && req.url.startsWith('/twilio/whatsapp')) {
                await handleWebhook(req, res, config);
                return;
            }

            sendJson(res, 404, {
                error: 'Not found',
                routes: ['GET /health', 'POST /twilio/whatsapp']
            });
        })().catch((error: Error) => {
            console.error(`[whatsapp-bridge] unhandled=${error.message}`);
            if (!res.headersSent) {
                sendJson(res, 500, { error: error.message });
            } else {
                res.end();
            }
        });
    });
}

async function main(): Promise<void> {
    if (process.argv.includes('--help') || process.argv.includes('-h')) {
        printHelp();
        return;
    }

    const config = loadConfig();
    if (!config.allowUnlistedSenders && config.allowedSenders.size === 0) {
        throw new Error(
            'Set WHATSAPP_ALLOWED_SENDERS to a comma-separated list or explicitly set WHATSAPP_ALLOW_UNLISTED_SENDERS=true.'
        );
    }

    if (!fs.existsSync(config.codeWorkdir)) {
        throw new Error(`CODEX_WORKDIR does not exist: ${config.codeWorkdir}`);
    }

    logStartup(config);
    const server = createServer(config);
    server.listen(config.port, config.host);
}

void main().catch((error: Error) => {
    console.error(`[whatsapp-bridge] startup failed: ${error.message}`);
    process.exitCode = 1;
});
