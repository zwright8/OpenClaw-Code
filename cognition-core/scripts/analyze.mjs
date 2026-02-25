import path from 'path';
import { LogAnalyzerV2 } from '../src/log-analyzer-v2.js';

const HOME = process.env.HOME;
const SESSIONS_FILE = path.join(HOME, '.openclaw/agents/main/sessions/sessions.json');

(async () => {
    try {
        const analyzer = new LogAnalyzerV2(SESSIONS_FILE);
        // Analyze last 7 days to get more data
        await analyzer.analyze(7);
        analyzer.report();
    } catch (err) {
        console.error('Analysis failed:', err.message);
        process.exit(1);
    }
})();
