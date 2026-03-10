import fs from 'fs';
import path from 'path';

export class MemoryGraph {
    constructor(workspaceRoot) {
        this.root = workspaceRoot;
        this.nodes = new Set();
        this.edges = [];
    }

    async scan() {
        const files = this._findMarkdownFiles(this.root);
        
        for (const file of files) {
            const relativePath = path.relative(this.root, file);
            this.nodes.add(relativePath);
            
            const content = fs.readFileSync(file, 'utf8');
            this._extractLinks(relativePath, content);
        }
    }

    _findMarkdownFiles(dir, fileList = []) {
        const items = fs.readdirSync(dir);
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                if (item === 'node_modules' || item.startsWith('.')) continue;
                this._findMarkdownFiles(fullPath, fileList);
            } else if (item.endsWith('.md')) {
                fileList.push(fullPath);
            }
        }
        return fileList;
    }

    _extractLinks(source, content) {
        // Standard Markdown links: [Label](target)
        const mdLinkRegex = /\[.*?\]\((.*?)\)/g;
        let match;
        while ((match = mdLinkRegex.exec(content)) !== null) {
            let target = match[1];
            // Ignore external links
            if (target.startsWith('http') || target.startsWith('mailto')) continue;
            
            // Normalize path (simple resolution)
            // If target is relative, resolve it relative to source
            // Ideally we check if file exists, but for a graph, rough is ok.
            // Clean anchors
            target = target.split('#')[0];
            if (!target) continue;

            // Simple dedupe logic would go here
            this.edges.push({ from: source, to: target });
        }

        // Wiki Links: [[Target]]
        const wikiLinkRegex = /\[\[(.*?)\]\]/g;
        while ((match = wikiLinkRegex.exec(content)) !== null) {
            const target = match[1].split('|')[0]; // Handle [[Target|Label]]
            this.edges.push({ from: source, to: target + '.md' }); // Assume .md
        }
    }

    toDot() {
        let dot = 'digraph Memory {\n';
        dot += '  rankdir=LR;\n';
        dot += '  node [shape=box, style=filled, fillcolor="#f0f0f0", fontname="Helvetica"];\n';
        
        // Edges
        for (const edge of this.edges) {
            const from = JSON.stringify(edge.from);
            const to = JSON.stringify(edge.to);
            dot += `  ${from} -> ${to};\n`;
        }
        
        dot += '}';
        return dot;
    }
}
