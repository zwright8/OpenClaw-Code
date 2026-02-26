import test from 'node:test';
import assert from 'node:assert/strict';
import { runCapabilityChecks } from './capability-test-utils.js';
import {
    consolidateLongTermMemory,
    memoryConsolidationToTasks,
    LongTermMemoryConsolidator
} from '../index.js';

test('capability 85 long-term memory consolidator', () => {
    runCapabilityChecks({
        buildReport: consolidateLongTermMemory,
        toTasks: memoryConsolidationToTasks,
        ClassCtor: LongTermMemoryConsolidator,
        input: {
            episodicMemories: [
                {
                    memoryId: 'mem-1',
                    topic: 'incident-recovery',
                    confidence: 74,
                    novelty: 82,
                    retentionValue: 38,
                    contradictionRisk: 62,
                    tags: ['incident', 'recovery'],
                    facts: ['rollback succeeded']
                },
                {
                    memoryId: 'mem-2',
                    topic: 'incident-recovery',
                    confidence: 68,
                    novelty: 76,
                    retentionValue: 42,
                    contradictionRisk: 58,
                    tags: ['incident'],
                    facts: ['rollback failed']
                }
            ],
            durableKnowledge: [
                { knowledgeId: 'k-1', topic: 'incident-recovery', supportCount: 5, confidence: 80 }
            ]
        },
        assertReport: (report) => {
            assert.equal(report.summary.clusterCount, 1);
            assert.equal(report.alerts.includes('memory_cluster_conflicts_detected'), true);
        }
    });
});
