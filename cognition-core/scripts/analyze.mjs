import path from 'path';
import { LogAnalyzer } from '../src/log-analyzer.js';

const HOME = process.env.HOME;
const LOG_FILE = path.join(HOME, '.openclaw/logs/gateway.log');

(async () => {
    try {
        const analyzer = new LogAnalyzer(LOG_FILE);
        await analyzer.analyze();
        analyzer.report();
    } catch (err) {
        console.error('Analysis failed:', err.message);
        process.exit(1);
    }
})();
