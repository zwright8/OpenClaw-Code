import { randomUUID } from 'node:crypto';
import type { ContractValidationIssue, ContractValidationResult } from '../contracts/events.js';

export interface CognitionMemoryNode {
    nodeId: string;
    kind: string;
    title: string;
    content?: string;
    tags: string[];
    entityRefs: string[];
    ts: number;
    metadata?: Record<string, unknown>;
}

export interface CognitionMemoryEdge {
    edgeId: string;
    from: string;
    to: string;
    relation: string;
    weight: number;
    ts: number;
    metadata?: Record<string, unknown>;
}

export interface CognitionMemoryIndexData {
    version: number;
    updatedAt: number;
    nodes: Record<string, CognitionMemoryNode>;
    edges: Record<string, CognitionMemoryEdge>;
    tags: Record<string, string[]>;
    entities: Record<string, string[]>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function normalizeString(value: unknown): string | null {
    if (typeof value !== 'string') return null;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
}

function normalizeTimestamp(value: unknown): number | null {
    if (typeof value === 'number' && Number.isFinite(value)) return Math.floor(value);
    if (typeof value === 'string') {
        const trimmed = value.trim();
        if (!trimmed) return null;

        const asNumber = Number(trimmed);
        if (Number.isFinite(asNumber)) return Math.floor(asNumber);

        const asDate = Date.parse(trimmed);
        if (Number.isFinite(asDate)) return Math.floor(asDate);
    }

    return null;
}

function normalizeNonNegativeNumber(value: unknown): number | null {
    const numeric = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(numeric) || numeric < 0) return null;
    return numeric;
}

function normalizeStringArray(value: unknown, path: string): ContractValidationResult<string[]> {
    if (!Array.isArray(value)) {
        return { ok: false, errors: [{ path, message: 'must be an array of strings.' }] };
    }

    const errors: ContractValidationIssue[] = [];
    const seen = new Set<string>();
    const out: string[] = [];

    for (let index = 0; index < value.length; index += 1) {
        const normalized = normalizeString(value[index]);
        if (!normalized) {
            errors.push({ path: `${path}[${index}]`, message: 'must be a non-empty string.' });
            continue;
        }
        if (seen.has(normalized)) continue;
        seen.add(normalized);
        out.push(normalized);
    }

    if (errors.length > 0) {
        return { ok: false, errors };
    }

    return { ok: true, value: out };
}

export function createEmptyMemoryIndexData(now = Date.now()): CognitionMemoryIndexData {
    return {
        version: 1,
        updatedAt: now,
        nodes: {},
        edges: {},
        tags: {},
        entities: {}
    };
}

export function validateMemoryNode(value: unknown, pathPrefix = 'node'): ContractValidationResult<CognitionMemoryNode> {
    if (!isRecord(value)) {
        return { ok: false, errors: [{ path: pathPrefix, message: 'must be an object.' }] };
    }

    const errors: ContractValidationIssue[] = [];

    const nodeId = normalizeString(value.nodeId) ?? normalizeString(value.id);
    if (!nodeId) errors.push({ path: `${pathPrefix}.nodeId`, message: 'nodeId is required.' });

    const kind = normalizeString(value.kind);
    if (!kind) errors.push({ path: `${pathPrefix}.kind`, message: 'kind is required.' });

    const title = normalizeString(value.title);
    if (!title) errors.push({ path: `${pathPrefix}.title`, message: 'title is required.' });

    const contentRaw = value.content;
    const content = contentRaw === undefined ? undefined : normalizeString(contentRaw) ?? undefined;

    const tagsResult = normalizeStringArray(value.tags ?? [], `${pathPrefix}.tags`);
    if (!tagsResult.ok) errors.push(...tagsResult.errors);

    const entityRefsResult = normalizeStringArray(value.entityRefs ?? [], `${pathPrefix}.entityRefs`);
    if (!entityRefsResult.ok) errors.push(...entityRefsResult.errors);

    const ts = normalizeTimestamp(value.ts ?? value.timestamp ?? value.createdAt);
    if (ts === null) errors.push({ path: `${pathPrefix}.ts`, message: 'ts must be a timestamp.' });

    const metadataRaw = value.metadata;
    if (metadataRaw !== undefined && !isRecord(metadataRaw)) {
        errors.push({ path: `${pathPrefix}.metadata`, message: 'metadata must be an object.' });
    }

    if (
        errors.length > 0 ||
        !nodeId ||
        !kind ||
        !title ||
        !tagsResult.ok ||
        !entityRefsResult.ok ||
        ts === null
    ) {
        return { ok: false, errors };
    }

    return {
        ok: true,
        value: {
            nodeId,
            kind,
            title,
            content,
            tags: tagsResult.value,
            entityRefs: entityRefsResult.value,
            ts,
            metadata: metadataRaw as Record<string, unknown> | undefined
        }
    };
}

export function validateMemoryEdge(value: unknown, pathPrefix = 'edge'): ContractValidationResult<CognitionMemoryEdge> {
    if (!isRecord(value)) {
        return { ok: false, errors: [{ path: pathPrefix, message: 'must be an object.' }] };
    }

    const errors: ContractValidationIssue[] = [];

    const edgeId = normalizeString(value.edgeId) ?? normalizeString(value.id);
    if (!edgeId) errors.push({ path: `${pathPrefix}.edgeId`, message: 'edgeId is required.' });

    const from = normalizeString(value.from);
    if (!from) errors.push({ path: `${pathPrefix}.from`, message: 'from is required.' });

    const to = normalizeString(value.to);
    if (!to) errors.push({ path: `${pathPrefix}.to`, message: 'to is required.' });

    const relation = normalizeString(value.relation) ?? normalizeString(value.type);
    if (!relation) errors.push({ path: `${pathPrefix}.relation`, message: 'relation is required.' });

    const weight = normalizeNonNegativeNumber(value.weight ?? 1);
    if (weight === null) errors.push({ path: `${pathPrefix}.weight`, message: 'weight must be a non-negative number.' });

    const ts = normalizeTimestamp(value.ts ?? value.timestamp ?? value.createdAt);
    if (ts === null) errors.push({ path: `${pathPrefix}.ts`, message: 'ts must be a timestamp.' });

    const metadataRaw = value.metadata;
    if (metadataRaw !== undefined && !isRecord(metadataRaw)) {
        errors.push({ path: `${pathPrefix}.metadata`, message: 'metadata must be an object.' });
    }

    if (errors.length > 0 || !edgeId || !from || !to || !relation || weight === null || ts === null) {
        return { ok: false, errors };
    }

    return {
        ok: true,
        value: {
            edgeId,
            from,
            to,
            relation,
            weight,
            ts,
            metadata: metadataRaw as Record<string, unknown> | undefined
        }
    };
}

function validateIndexLookupTable(value: unknown, path: string): ContractValidationResult<Record<string, string[]>> {
    if (!isRecord(value)) {
        return { ok: false, errors: [{ path, message: 'must be an object mapping keys to string arrays.' }] };
    }

    const errors: ContractValidationIssue[] = [];
    const out: Record<string, string[]> = {};

    for (const [key, rawNodeIds] of Object.entries(value)) {
        const arrayResult = normalizeStringArray(rawNodeIds, `${path}.${key}`);
        if (!arrayResult.ok) {
            errors.push(...arrayResult.errors);
            continue;
        }
        out[key] = arrayResult.value;
    }

    if (errors.length > 0) {
        return { ok: false, errors };
    }

    return { ok: true, value: out };
}

export function validateMemoryIndexData(value: unknown): ContractValidationResult<CognitionMemoryIndexData> {
    if (!isRecord(value)) {
        return { ok: false, errors: [{ path: '$', message: 'memory index data must be an object.' }] };
    }

    const errors: ContractValidationIssue[] = [];

    const version = normalizeNonNegativeNumber(value.version);
    if (version === null || !Number.isInteger(version) || version <= 0) {
        errors.push({ path: 'version', message: 'version must be a positive integer.' });
    }

    const updatedAt = normalizeTimestamp(value.updatedAt);
    if (updatedAt === null) errors.push({ path: 'updatedAt', message: 'updatedAt must be a timestamp.' });

    const nodesRaw = value.nodes;
    const nodes: Record<string, CognitionMemoryNode> = {};
    if (!isRecord(nodesRaw)) {
        errors.push({ path: 'nodes', message: 'nodes must be an object keyed by nodeId.' });
    } else {
        for (const [nodeId, rawNode] of Object.entries(nodesRaw)) {
            const result = validateMemoryNode(rawNode, `nodes.${nodeId}`);
            if (!result.ok) {
                errors.push(...result.errors);
                continue;
            }
            nodes[nodeId] = result.value;
        }
    }

    const edgesRaw = value.edges;
    const edges: Record<string, CognitionMemoryEdge> = {};
    if (!isRecord(edgesRaw)) {
        errors.push({ path: 'edges', message: 'edges must be an object keyed by edgeId.' });
    } else {
        for (const [edgeId, rawEdge] of Object.entries(edgesRaw)) {
            const result = validateMemoryEdge(rawEdge, `edges.${edgeId}`);
            if (!result.ok) {
                errors.push(...result.errors);
                continue;
            }
            edges[edgeId] = result.value;
        }
    }

    const tagsResult = validateIndexLookupTable(value.tags ?? {}, 'tags');
    if (!tagsResult.ok) errors.push(...tagsResult.errors);

    const entitiesResult = validateIndexLookupTable(value.entities ?? {}, 'entities');
    if (!entitiesResult.ok) errors.push(...entitiesResult.errors);

    if (
        errors.length > 0 ||
        version === null ||
        !Number.isInteger(version) ||
        version <= 0 ||
        updatedAt === null ||
        !isRecord(nodesRaw) ||
        !isRecord(edgesRaw) ||
        !tagsResult.ok ||
        !entitiesResult.ok
    ) {
        return { ok: false, errors };
    }

    return {
        ok: true,
        value: {
            version,
            updatedAt,
            nodes,
            edges,
            tags: tagsResult.value,
            entities: entitiesResult.value
        }
    };
}

function addLookup(map: Record<string, Set<string>>, key: string, value: string): void {
    if (!map[key]) map[key] = new Set<string>();
    map[key].add(value);
}

function removeLookup(map: Record<string, Set<string>>, key: string, value: string): void {
    const entry = map[key];
    if (!entry) return;
    entry.delete(value);
    if (entry.size === 0) {
        delete map[key];
    }
}

function toRecordOfArrays(map: Record<string, Set<string>>): Record<string, string[]> {
    const out: Record<string, string[]> = {};
    for (const [key, ids] of Object.entries(map)) {
        out[key] = Array.from(ids).sort((a, b) => a.localeCompare(b));
    }
    return out;
}

export class CognitionMemoryIndex {
    private readonly nodes = new Map<string, CognitionMemoryNode>();
    private readonly edges = new Map<string, CognitionMemoryEdge>();
    private readonly tags: Record<string, Set<string>> = {};
    private readonly entities: Record<string, Set<string>> = {};
    private version: number;
    private updatedAt: number;

    constructor(initial: CognitionMemoryIndexData = createEmptyMemoryIndexData()) {
        const result = validateMemoryIndexData(initial);
        if (!result.ok) {
            const message = result.errors.map((issue) => `${issue.path}: ${issue.message}`).join(' | ');
            throw new Error(`Invalid initial memory index data: ${message}`);
        }

        this.version = result.value.version;
        this.updatedAt = result.value.updatedAt;

        for (const node of Object.values(result.value.nodes)) {
            this.nodes.set(node.nodeId, node);
            for (const tag of node.tags) addLookup(this.tags, tag, node.nodeId);
            for (const entity of node.entityRefs) addLookup(this.entities, entity, node.nodeId);
        }

        for (const edge of Object.values(result.value.edges)) {
            this.edges.set(edge.edgeId, edge);
        }
    }

    private touch(now = Date.now()): void {
        this.updatedAt = now;
    }

    upsertNode(nodeLike: Omit<CognitionMemoryNode, 'nodeId'> & { nodeId?: string }, now = Date.now()): CognitionMemoryNode {
        const nodeId = nodeLike.nodeId ?? randomUUID();
        const result = validateMemoryNode({ ...nodeLike, nodeId }, 'node');
        if (!result.ok) {
            const message = result.errors.map((issue) => `${issue.path}: ${issue.message}`).join(' | ');
            throw new Error(`Invalid memory node: ${message}`);
        }

        const node = result.value;
        const existing = this.nodes.get(node.nodeId);
        if (existing) {
            for (const tag of existing.tags) removeLookup(this.tags, tag, existing.nodeId);
            for (const entity of existing.entityRefs) removeLookup(this.entities, entity, existing.nodeId);
        }

        this.nodes.set(node.nodeId, node);
        for (const tag of node.tags) addLookup(this.tags, tag, node.nodeId);
        for (const entity of node.entityRefs) addLookup(this.entities, entity, node.nodeId);

        this.touch(now);
        return node;
    }

    upsertEdge(edgeLike: Omit<CognitionMemoryEdge, 'edgeId'> & { edgeId?: string }, now = Date.now()): CognitionMemoryEdge {
        const edgeId = edgeLike.edgeId ?? randomUUID();
        const result = validateMemoryEdge({ ...edgeLike, edgeId }, 'edge');
        if (!result.ok) {
            const message = result.errors.map((issue) => `${issue.path}: ${issue.message}`).join(' | ');
            throw new Error(`Invalid memory edge: ${message}`);
        }

        const edge = result.value;
        if (!this.nodes.has(edge.from)) {
            throw new Error(`Cannot create edge ${edge.edgeId}: source node ${edge.from} not found.`);
        }
        if (!this.nodes.has(edge.to)) {
            throw new Error(`Cannot create edge ${edge.edgeId}: destination node ${edge.to} not found.`);
        }

        this.edges.set(edge.edgeId, edge);
        this.touch(now);
        return edge;
    }

    removeNode(nodeId: string, now = Date.now()): boolean {
        const node = this.nodes.get(nodeId);
        if (!node) return false;

        this.nodes.delete(nodeId);

        for (const tag of node.tags) removeLookup(this.tags, tag, nodeId);
        for (const entity of node.entityRefs) removeLookup(this.entities, entity, nodeId);

        for (const [edgeId, edge] of this.edges.entries()) {
            if (edge.from === nodeId || edge.to === nodeId) {
                this.edges.delete(edgeId);
            }
        }

        this.touch(now);
        return true;
    }

    removeEdge(edgeId: string, now = Date.now()): boolean {
        const didDelete = this.edges.delete(edgeId);
        if (didDelete) this.touch(now);
        return didDelete;
    }

    getNode(nodeId: string): CognitionMemoryNode | undefined {
        return this.nodes.get(nodeId);
    }

    getEdge(edgeId: string): CognitionMemoryEdge | undefined {
        return this.edges.get(edgeId);
    }

    findNodesByTag(tag: string): CognitionMemoryNode[] {
        const nodeIds = this.tags[tag];
        if (!nodeIds) return [];

        const out: CognitionMemoryNode[] = [];
        for (const nodeId of nodeIds.values()) {
            const node = this.nodes.get(nodeId);
            if (node) out.push(node);
        }
        return out;
    }

    findNodesByEntity(entityId: string): CognitionMemoryNode[] {
        const nodeIds = this.entities[entityId];
        if (!nodeIds) return [];

        const out: CognitionMemoryNode[] = [];
        for (const nodeId of nodeIds.values()) {
            const node = this.nodes.get(nodeId);
            if (node) out.push(node);
        }
        return out;
    }

    getNeighbors(nodeId: string): CognitionMemoryNode[] {
        const neighborIds = new Set<string>();
        for (const edge of this.edges.values()) {
            if (edge.from === nodeId) neighborIds.add(edge.to);
            if (edge.to === nodeId) neighborIds.add(edge.from);
        }

        const out: CognitionMemoryNode[] = [];
        for (const neighborId of neighborIds) {
            const node = this.nodes.get(neighborId);
            if (node) out.push(node);
        }
        return out;
    }

    toJSON(): CognitionMemoryIndexData {
        const nodes: Record<string, CognitionMemoryNode> = {};
        for (const node of this.nodes.values()) {
            nodes[node.nodeId] = node;
        }

        const edges: Record<string, CognitionMemoryEdge> = {};
        for (const edge of this.edges.values()) {
            edges[edge.edgeId] = edge;
        }

        return {
            version: this.version,
            updatedAt: this.updatedAt,
            nodes,
            edges,
            tags: toRecordOfArrays(this.tags),
            entities: toRecordOfArrays(this.entities)
        };
    }

    getStats(): { nodeCount: number; edgeCount: number; updatedAt: number } {
        return {
            nodeCount: this.nodes.size,
            edgeCount: this.edges.size,
            updatedAt: this.updatedAt
        };
    }
}
