import path from 'path';
import fs from 'fs';
import { MemoryGraph } from '../src/memory-graph.js';

const WORKSPACE = path.resolve(process.env.HOME, '.openclaw/workspace');
const OUTPUT_FILE = path.join(process.cwd(), 'memory-graph.dot');

(async () => {
    try {
        console.log(`Scanning workspace: ${WORKSPACE}`);
        const graph = new MemoryGraph(WORKSPACE);
        await graph.scan();
        
        const dot = graph.toDot();
        fs.writeFileSync(OUTPUT_FILE, dot);
        
        console.log(`Graph generated at ${OUTPUT_FILE}`);
        console.log(`Nodes: ${graph.nodes.size}`);
        console.log(`Edges: ${graph.edges.length}`);
    } catch (err) {
        console.error('Graph generation failed:', err.message);
        process.exit(1);
    }
})();
