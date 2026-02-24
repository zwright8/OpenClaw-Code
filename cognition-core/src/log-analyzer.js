import fs from 'fs';
import readline from 'readline';
import path from 'path';

export class LogAnalyzer {
    constructor(logPath) {
        this.logPath = logPath;
        this.stats = {
            tools: {},
            errors: 0,
            lines: 0,
            models: {}
        };
    }

    async analyze() {
        if (!fs.existsSync(this.logPath)) {
            throw new Error(`Log file not found: ${this.logPath}`);
        }

        const fileStream = fs.createReadStream(this.logPath);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        console.log(`Analyzing ${this.logPath}...`);

        for await (const line of rl) {
            this.stats.lines++;
            this._processLine(line);
        }

        return this.stats;
    }

    _processLine(line) {
        // Tool Calls (Approximate regex based on standard log format)
        // Format often varies, looking for "call:default_api:toolname" or JSON structures
        const toolMatch = line.match(/call:default_api:(\w+)/);
        if (toolMatch) {
            const tool = toolMatch[1];
            this.stats.tools[tool] = (this.stats.tools[tool] || 0) + 1;
        }

        // Errors (generic)
        if (line.includes('"error"') || line.includes('level":"error"')) {
            this.stats.errors++;
        }
        
        // Models (if logged)
        const modelMatch = line.match(/model[:=]"?([\w/-]+)"?/);
        if (modelMatch) {
             const model = modelMatch[1];
             this.stats.models[model] = (this.stats.models[model] || 0) + 1;
        }
    }

    report() {
        console.log('\n--- Cognition Core: Log Analysis ---');
        console.log(`Lines Processed: ${this.stats.lines}`);
        console.log(`Errors Found: ${this.stats.errors}`);
        console.log('\nTool Usage:');
        const sortedTools = Object.entries(this.stats.tools)
            .sort(([,a], [,b]) => b - a);
        
        if (sortedTools.length === 0) console.log('  (No tool calls detected in logs)');
        
        for (const [tool, count] of sortedTools) {
            console.log(`  ${tool.padEnd(15)}: ${count}`);
        }
        console.log('------------------------------------');
    }
}
