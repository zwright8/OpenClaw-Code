import { randomUUID } from 'crypto';

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function safeNow(nowFn) {
    const value = Number(nowFn());
    return Number.isFinite(value) ? value : Date.now();
}

function safeNumber(value, fallback = 0) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : fallback;
}

export class TelemetryPipeline {
    constructor({
        maxEvents = 10_000,
        maxAgeMs = 3_600_000,
        now = Date.now
    } = {}) {
        this.maxEvents = Number.isInteger(maxEvents) && maxEvents > 0
            ? maxEvents
            : 10_000;
        this.maxAgeMs = safeNumber(maxAgeMs, 3_600_000);
        this.now = typeof now === 'function' ? now : Date.now;
        this.events = [];
        this.subscribers = new Map();
    }

    emit(event) {
        if (!event || typeof event !== 'object') {
            throw new Error('emit requires an event object');
        }

        const eventType = String(event.eventType || 'unknown');
        const source = String(event.source || 'unknown');

        const record = {
            id: event.id || randomUUID(),
            eventType,
            source,
            payload: event.payload != null ? clone(event.payload) : {},
            at: Number.isFinite(Number(event.at))
                ? Number(event.at)
                : safeNow(this.now)
        };

        this.events.push(record);

        if (this.events.length > this.maxEvents) {
            this.events.splice(0, this.events.length - this.maxEvents);
        }

        for (const [, subscriber] of this.subscribers) {
            if (subscriber.filter && typeof subscriber.filter === 'function') {
                if (!subscriber.filter(record)) continue;
            }
            try {
                subscriber.handler(clone(record));
            } catch {
                // subscriber errors must not break the pipeline
            }
        }

        return clone(record);
    }

    subscribe(handler, { filter } = {}) {
        if (typeof handler !== 'function') {
            throw new Error('subscribe requires a handler function');
        }

        const id = randomUUID();
        this.subscribers.set(id, {
            handler,
            filter: typeof filter === 'function' ? filter : null
        });

        return id;
    }

    unsubscribe(subscriptionId) {
        return this.subscribers.delete(subscriptionId);
    }

    query({
        eventType,
        source,
        since,
        until,
        limit = 100
    } = {}) {
        let results = this.events;

        if (eventType) {
            const types = Array.isArray(eventType) ? eventType : [eventType];
            results = results.filter((e) => types.includes(e.eventType));
        }

        if (source) {
            const sources = Array.isArray(source) ? source : [source];
            results = results.filter((e) => sources.includes(e.source));
        }

        if (Number.isFinite(Number(since))) {
            const sinceTs = Number(since);
            results = results.filter((e) => e.at >= sinceTs);
        }

        if (Number.isFinite(Number(until))) {
            const untilTs = Number(until);
            results = results.filter((e) => e.at <= untilTs);
        }

        const cap = Math.max(1, safeNumber(limit, 100));
        return results.slice(-cap).map((e) => clone(e));
    }

    aggregate({
        windowMs,
        groupBy = 'eventType'
    } = {}) {
        const now = safeNow(this.now);
        const cutoff = Number.isFinite(Number(windowMs))
            ? now - Number(windowMs)
            : 0;

        const window = this.events.filter((e) => e.at >= cutoff);
        const groups = {};

        for (const event of window) {
            const key = String(event[groupBy] || 'unknown');
            if (!groups[key]) {
                groups[key] = { count: 0, earliest: event.at, latest: event.at };
            }
            groups[key].count += 1;
            if (event.at < groups[key].earliest) groups[key].earliest = event.at;
            if (event.at > groups[key].latest) groups[key].latest = event.at;
        }

        return {
            windowMs: Number.isFinite(Number(windowMs)) ? Number(windowMs) : null,
            cutoff,
            totalEvents: window.length,
            groups
        };
    }

    flush() {
        const now = safeNow(this.now);
        const cutoff = now - this.maxAgeMs;
        const before = this.events.length;

        this.events = this.events.filter((e) => e.at >= cutoff);

        if (this.events.length > this.maxEvents) {
            this.events.splice(0, this.events.length - this.maxEvents);
        }

        return {
            removedCount: before - this.events.length,
            remainingCount: this.events.length
        };
    }

    stats() {
        const now = safeNow(this.now);
        const totalEvents = this.events.length;
        const subscriberCount = this.subscribers.size;
        const oldestAt = totalEvents > 0 ? this.events[0].at : null;
        const newestAt = totalEvents > 0 ? this.events[totalEvents - 1].at : null;

        return {
            totalEvents,
            subscriberCount,
            oldestAt,
            newestAt,
            ageMs: oldestAt !== null ? now - oldestAt : 0
        };
    }
}
