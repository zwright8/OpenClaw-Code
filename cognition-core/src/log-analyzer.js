import fs from 'fs';
import readline from 'readline';
import path from 'path';

export class LogAnalyzer {
    constructor(logPath) {
        this.logPath = logPath;
        this.stats = {
            tools: {}, // { toolName: { calls: 0, errors: 0 } }
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
        // Tool Calls: "call:default_api:toolname"
        const toolMatch = line.match(/call:default_api:(\w+)/);
        if (toolMatch) {
            const tool = toolMatch[1];
            if (!this.stats.tools[tool]) this.stats.tools[tool] = { calls: 0, errors: 0 };
            this.stats.tools[tool].calls++;
        }

        // Tool Errors: "response:default_api:toolname{... error: ..."
        // or generic error logs associated with tools.
        // Simple heuristic: if line contains "error" and is a response, try to attribute it.
        
        // Detailed error check
        if (line.includes('"error"') || line.includes('level":"error"')) {
            this.stats.errors++;
            
            // Try to attribute to a tool if the line mentions it
            // Look for response:default_api:(\w+)
            const responseMatch = line.match(/response:default_api:(\w+)/);
            if (responseMatch) {
                const tool = responseMatch[1];
                if (this.stats.tools[tool]) {
                    this.stats.tools[tool].errors++;
                }
            }
        }
        
        // Models
        const modelMatch = line.match(/model[:=]"?([\w/-]+)"?/);
        if (modelMatch) {
             const model = modelMatch[1];
             this.stats.models[model] = (this.stats.models[model] || 0) + 1;
        }
    }

    report() {
        console.log('\n--- Cognition Core: Log Analysis ---');
        console.log(`Lines Processed: ${this.stats.lines}`);
        console.log(`Total Errors:    ${this.stats.errors}`);
        console.log('\nTool Performance:');
        
        const sortedTools = Object.entries(this.stats.tools)
            .sort(([,a], [,b]) => b.calls - a.calls);
        
        if (sortedTools.length === 0) console.log('  (No tool calls detected)');
        
        console.log(`  ${'TOOL'.padEnd(15)} | ${'CALLS'.padEnd(6)} | ${'ERRORS'.padEnd(6)} | ${'RATE'.padEnd(6)}`);
        console.log('  ' + '-'.repeat(40));
        
        for (const [tool, data] of sortedTools) {
            const rate = data.calls > 0 ? ((data.errors / data.calls) * 100).toFixed(1) + '%' : '0%';
            console.log(`  ${tool.padEnd(15)} | ${String(data.calls).padEnd(6)} | ${String(data.errors).padEnd(6)} | ${rate.padEnd(6)}`);
        }
        console.log('------------------------------------');
    }
}
