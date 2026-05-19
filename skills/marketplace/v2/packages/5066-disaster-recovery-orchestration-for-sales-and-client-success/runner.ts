import { runSkillPackage } from '../../runtime/runner-core.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const input = {
    task: 'Execute skill package runner',
    objective: 'Generate a guardrail-compliant execution plan',
    constraints: ['Respect policy guardrails', 'Produce deterministic summary'],
    context: {
        urgency: 'medium',
        riskTolerance: 'medium',
        budgetTier: 'medium'
    }
};

const result = runSkillPackage(__dirname, input);
console.log(JSON.stringify(result, null, 2));
