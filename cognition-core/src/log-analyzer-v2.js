import fs from 'fs';
import path from 'path';
import readline from 'readline';

export class LogAnalyzerV2 {
    constructor(sessionsJsonPath) {
        this.sessionsPath = sessionsJsonPath;
        this.stats = {
            sessionsScanned: 0,
            tools: {},
            errors: 0,
            models: {}
        };
    }

    async analyze(daysBack = 1) {
        if (!fs.existsSync(this.sessionsPath)) {
            throw new Error(`Sessions file not found: ${this.sessionsPath}`);
        }

        const sessionsData = JSON.parse(fs.readFileSync(this.sessionsPath, 'utf8'));
        const cutoff = Date.now() - (daysBack * 24 * 60 * 60 * 1000);

        console.log(`Scanning sessions updated since ${new Date(cutoff).toISOString()}...`);

        for (const [key, meta] of Object.entries(sessionsData)) {
            if (meta.updatedAt < cutoff) continue;
            if (!meta.sessionFile || !fs.existsSync(meta.sessionFile)) continue;

            this.stats.sessionsScanned++;
            await this._processSessionFile(meta.sessionFile);
        }

        return this.stats;
    }

    async _processSessionFile(filePath) {
        const fileStream = fs.createReadStream(filePath);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        for await (const line of rl) {
            try {
                if (!line.trim()) continue;
                const event = JSON.parse(line);
                this._processEvent(event);
            } catch (e) {
                // Ignore malformed lines
            }
        }
    }

    _processEvent(event) {
        if (!event.type === 'message' || !event.message) return;
        const msg = event.message;

        // 1. Tool Calls (Assistant Role)
        if (msg.role === 'assistant' && Array.isArray(msg.content)) {
            for (const item of msg.content) {
                if (item.type === 'toolCall') {
                    this._countTool(item.name);
                }
            }
        }

        // 2. Tool Errors (Tool Result Role)
        if (msg.role === 'toolResult') {
            if (msg.isError) {
                this._countError(msg.toolName);
            }
        }
    }

    _countTool(name) {
        if (!this.stats.tools[name]) this.stats.tools[name] = { calls: 0, errors: 0 };
        this.stats.tools[name].calls++;
    }

    _countError(name) {
        if (!this.stats.tools[name]) this.stats.tools[name] = { calls: 0, errors: 0 };
        this.stats.tools[name].errors++;
        this.stats.errors++;
    }

    report() {
        console.log('\n--- Cognition Core: Log Analysis v2 ---');
        console.log(`Sessions Scanned: ${this.stats.sessionsScanned}`);
        console.log(`Total Errors:     ${this.stats.errors}`);
        console.log('\nTool Performance (Last 24h):');
        
        const sortedTools = Object.entries(this.stats.tools)
            .sort(([,a], [,b]) => b.calls - a.calls);
        
        if (sortedTools.length === 0) console.log('  (No tool calls detected)');
        
        console.log(`  ${'TOOL'.padEnd(20)} | ${'CALLS'.padEnd(6)} | ${'ERRORS'.padEnd(6)} | ${'RATE'.padEnd(6)}`);
        console.log('  ' + '-'.repeat(45));
        
        for (const [tool, data] of sortedTools) {
            const rate = data.calls > 0 ? ((data.errors / data.calls) * 100).toFixed(1) + '%' : '0%';
            console.log(`  ${tool.padEnd(20)} | ${String(data.calls).padEnd(6)} | ${String(data.errors).padEnd(6)} | ${rate.padEnd(6)}`);
        }
        console.log('------------------------------------');
    }
}
