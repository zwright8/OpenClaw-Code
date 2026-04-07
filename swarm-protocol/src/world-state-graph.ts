import { readMemoryContract } from './memory-contracts.js';

const DEFAULT_STOPWORDS = new Set([
    'the', 'and', 'for', 'with', 'that', 'this', 'from', 'into', 'onto',
    'were', 'was', 'have', 'has', 'had', 'will', 'shall', 'can', 'could',
    'should', 'would', 'about', 'under', 'over', 'after', 'before', 'during',
    'task', 'tasks', 'agent', 'agents', 'report', 'reports', 'decision',
    'decisions', 'handoff', 'handoffs', 'summary', 'objective', 'context'
]);

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function combineConfidence(current, incoming) {
    const existing = Number.isFinite(current) ? current : 0;
    const next = Number.isFinite(incoming) ? incoming : 0;
    return Number((1 - ((1 - existing) * (1 - next))).toFixed(4));
}

function normalizeEntityToken(token) {
    if (typeof token !== 'string') return null;
    const value = token.trim().toLowerCase();
    if (value.length < 3) return null;
    if (DEFAULT_STOPWORDS.has(value)) return null;
    return value;
}

export function extractEntitiesFromText(
    text,
    {
        maxEntities = 10
    } = {}
) {
    if (typeof text !== 'string' || !text.trim()) return [];

    const entities = new Set();

    const agentMatches = text.match(/agent:[a-z0-9:_-]+/gi) || [];
    for (const match of agentMatches) {
        const normalized = normalizeEntityToken(match);
        if (normalized) entities.add(normalized);
    }

    const tokenMatches = text.match(/[A-Za-z][A-Za-z0-9:_-]{2,}/g) || [];
    for (const token of tokenMatches) {
        const normalized = normalizeEntityToken(token);
        if (!normalized) continue;
        entities.add(normalized);
        if (entities.size >= maxEntities) break;
    }

    return [...entities].slice(0, maxEntities);
}

function contractBaseConfidence(contractType) {
    if (contractType === 'decision') return 0.88;
    if (contractType === 'handoff') return 0.8;
    return 0.75;
}

function appendTextAssertion(assertions, text, sourceField, baseConfidence, at, sourceContractId) {
    const entities = extractEntitiesFromText(text);
    if (entities.length === 0) return;

    const fieldWeights = {
        title: 1,
        summary: 0.9,
        finding: 0.92,
        action: 0.85,
        topic: 1,
        decision: 1,
        rationale: 0.88,
        objective: 0.92,
        question: 0.78,
        artifact: 0.72,
        context: 0.8
    };

    const weight = fieldWeights[sourceField] || 0.75;
    const confidence = clamp(baseConfidence * weight, 0.05, 0.99);

    assertions.push({
        entities,
        relation: 'co_mentioned',
        confidence,
        sourceField,
        at,
        sourceContractId
    });
}

function extractAssertionsFromContract(contract) {
    const payload = contract.payload || {};
    const base = contractBaseConfidence(contract.contractType);
    const at = Number(contract.createdAt) || 0;
    const sourceContractId = contract.id;
    const assertions = [];

    if (contract.contractType === 'report') {
        appendTextAssertion(assertions, payload.title, 'title', base, at, sourceContractId);
        appendTextAssertion(assertions, payload.summary, 'summary', base, at, sourceContractId);

        for (const finding of payload.findings || []) {
            appendTextAssertion(assertions, finding.statement, 'finding', base, at, sourceContractId);
            appendTextAssertion(assertions, finding.recommendation, 'action', base, at, sourceContractId);
        }

        for (const action of payload.actions || []) {
            appendTextAssertion(assertions, action, 'action', base, at, sourceContractId);
        }
    }

    if (contract.contractType === 'decision') {
        appendTextAssertion(assertions, payload.topic, 'topic', base, at, sourceContractId);
        appendTextAssertion(assertions, payload.decision, 'decision', base, at, sourceContractId);
        appendTextAssertion(assertions, payload.rationale, 'rationale', base, at, sourceContractId);
    }

    if (contract.contractType === 'handoff') {
        appendTextAssertion(assertions, payload.objective, 'objective', base, at, sourceContractId);
        appendTextAssertion(assertions, payload.context, 'context', base, at, sourceContractId);

        for (const question of payload.openQuestions || []) {
            appendTextAssertion(assertions, question, 'question', base, at, sourceContractId);
        }

        for (const artifact of payload.artifacts || []) {
            appendTextAssertion(assertions, artifact.name, 'artifact', base, at, sourceContractId);
        }
    }

    return assertions;
}

function buildGraphFromContracts(contracts, atMs = Number.POSITIVE_INFINITY) {
    const nodes = new Map();
    const edges = new Map();

    for (const contract of contracts) {
        if (!contract || typeof contract !== 'object') continue;
        if (Number(contract.createdAt) > atMs) continue;

        const assertions = extractAssertionsFromContract(contract);

        for (const assertion of assertions) {
            for (const entity of assertion.entities) {
                const current = nodes.get(entity) || {
                    entity,
                    firstSeenAt: assertion.at,
                    lastSeenAt: assertion.at,
                    confidence: 0,
                    sources: new Set(),
                    mentions: 0
                };

                current.firstSeenAt = Math.min(current.firstSeenAt, assertion.at);
                current.lastSeenAt = Math.max(current.lastSeenAt, assertion.at);
                current.confidence = combineConfidence(current.confidence, assertion.confidence);
                current.mentions += 1;
                current.sources.add(assertion.sourceContractId);
                nodes.set(entity, current);
            }

            for (let i = 0; i < assertion.entities.length; i++) {
                for (let j = i + 1; j < assertion.entities.length; j++) {
                    const left = assertion.entities[i];
                    const right = assertion.entities[j];
                    const edgeKey = left < right
                        ? `${left}|${right}|${assertion.relation}`
                        : `${right}|${left}|${assertion.relation}`;

                    const edge = edges.get(edgeKey) || {
                        edgeId: edgeKey,
                        from: left < right ? left : right,
                        to: left < right ? right : left,
                        relation: assertion.relation,
                        firstSeenAt: assertion.at,
                        lastSeenAt: assertion.at,
                        confidence: 0,
                        sources: new Set(),
                        mentions: 0
                    };

                    edge.firstSeenAt = Math.min(edge.firstSeenAt, assertion.at);
                    edge.lastSeenAt = Math.max(edge.lastSeenAt, assertion.at);
                    edge.confidence = combineConfidence(edge.confidence, assertion.confidence * 0.92);
                    edge.mentions += 1;
                    edge.sources.add(assertion.sourceContractId);
                    edges.set(edgeKey, edge);
                }
            }
        }
    }

    return {
        nodes: [...nodes.values()]
            .map((node) => ({
                ...node,
                sources: [...node.sources].sort()
            }))
            .sort((a, b) => b.confidence - a.confidence || a.entity.localeCompare(b.entity)),
        edges: [...edges.values()]
            .map((edge) => ({
                ...edge,
                sources: [...edge.sources].sort()
            }))
            .sort((a, b) => b.confidence - a.confidence || a.edgeId.localeCompare(b.edgeId))
    };
}

function indexBy(items, keyField) {
    const map = new Map();
    for (const item of items || []) {
        if (!item || typeof item !== 'object') continue;
        const key = item[keyField];
        if (!key || typeof key !== 'string') continue;
        map.set(key, item);
    }
    return map;
}

export function diffWorldStateSnapshots(beforeSnapshot, afterSnapshot) {
    const beforeNodes = indexBy(beforeSnapshot?.nodes || [], 'entity');
    const afterNodes = indexBy(afterSnapshot?.nodes || [], 'entity');
    const beforeEdges = indexBy(beforeSnapshot?.edges || [], 'edgeId');
    const afterEdges = indexBy(afterSnapshot?.edges || [], 'edgeId');

    const addedNodes = [];
    const removedNodes = [];
    const changedNodes = [];

    for (const [entity, node] of afterNodes.entries()) {
        if (!beforeNodes.has(entity)) {
            addedNodes.push(node);
            continue;
        }

        const previous = beforeNodes.get(entity);
        if (previous.confidence !== node.confidence || previous.mentions !== node.mentions) {
            changedNodes.push({
                entity,
                before: previous,
                after: node
            });
        }
    }

    for (const [entity, node] of beforeNodes.entries()) {
        if (!afterNodes.has(entity)) {
            removedNodes.push(node);
        }
    }

    const addedEdges = [];
    const removedEdges = [];
    const changedEdges = [];

    for (const [edgeId, edge] of afterEdges.entries()) {
        if (!beforeEdges.has(edgeId)) {
            addedEdges.push(edge);
            continue;
        }

        const previous = beforeEdges.get(edgeId);
        if (previous.confidence !== edge.confidence || previous.mentions !== edge.mentions) {
            changedEdges.push({
                edgeId,
                before: previous,
                after: edge
            });
        }
    }

    for (const [edgeId, edge] of beforeEdges.entries()) {
        if (!afterEdges.has(edgeId)) {
            removedEdges.push(edge);
        }
    }

    return {
        addedNodes,
        removedNodes,
        changedNodes,
        addedEdges,
        removedEdges,
        changedEdges
    };
}

export class WorldStateGraph {
    constructor({
        now = Date.now
    } = {}) {
        this.now = typeof now === 'function' ? now : Date.now;
        this.contracts = new Map();
    }

    ingestContract(contractPayload) {
        const contract = readMemoryContract(contractPayload, {
            migrate: true
        });
        this.contracts.set(contract.id, contract);
        return contract;
    }

    ingestContracts(contractPayloads) {
        const payloads = Array.isArray(contractPayloads) ? contractPayloads : [];
        const accepted = [];
        for (const payload of payloads) {
            accepted.push(this.ingestContract(payload));
        }
        return accepted;
    }

    removeContract(contractId) {
        return this.contracts.delete(contractId);
    }

    listContracts() {
        return [...this.contracts.values()]
            .sort((a, b) => a.createdAt - b.createdAt)
            .map((contract) => ({ ...contract }));
    }

    getSnapshot(atMs = Number.POSITIVE_INFINITY) {
        const cutoff = Number.isFinite(Number(atMs)) ? Number(atMs) : Number.POSITIVE_INFINITY;
        const contracts = this.listContracts();
        const graph = buildGraphFromContracts(contracts, cutoff);

        return {
            atMs: Number.isFinite(cutoff) ? cutoff : Number(this.now()),
            contractCount: contracts.filter((contract) => contract.createdAt <= cutoff).length,
            nodes: graph.nodes,
            edges: graph.edges
        };
    }

    diffSnapshots(fromMs, toMs) {
        const before = this.getSnapshot(fromMs);
        const after = this.getSnapshot(toMs);
        return {
            fromMs,
            toMs,
            ...diffWorldStateSnapshots(before, after)
        };
    }

    getMetrics(atMs = Number.POSITIVE_INFINITY) {
        const snapshot = this.getSnapshot(atMs);
        return {
            contracts: snapshot.contractCount,
            entities: snapshot.nodes.length,
            edges: snapshot.edges.length,
            avgEntityConfidence: snapshot.nodes.length > 0
                ? Number((snapshot.nodes.reduce((acc, node) => acc + node.confidence, 0) / snapshot.nodes.length).toFixed(4))
                : 0,
            avgEdgeConfidence: snapshot.edges.length > 0
                ? Number((snapshot.edges.reduce((acc, edge) => acc + edge.confidence, 0) / snapshot.edges.length).toFixed(4))
                : 0
        };
    }
}

export const __worldStateInternals = {
    extractAssertionsFromContract,
    buildGraphFromContracts,
    combineConfidence
};
