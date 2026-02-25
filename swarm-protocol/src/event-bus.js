function safeNow(nowFn) {
    const value = Number(nowFn());
    return Number.isFinite(value) ? value : Date.now();
}

function matchChannel(pattern, channel) {
    if (pattern === '*') return true;
    if (pattern === channel) return true;
    if (pattern.endsWith('.*')) {
        const prefix = pattern.slice(0, -2);
        return channel === prefix || channel.startsWith(prefix + '.');
    }
    return false;
}

export class EventBus {
    constructor({ now = Date.now } = {}) {
        this.now = typeof now === 'function' ? now : Date.now;
        this.subscriptions = new Map();
        this.nextId = 1;
        this.history = [];
        this.maxHistory = 500;
    }

    subscribe(channel, handler) {
        if (typeof channel !== 'string' || !channel) {
            throw new Error('EventBus.subscribe requires a non-empty channel string');
        }
        if (typeof handler !== 'function') {
            throw new Error('EventBus.subscribe requires a handler function');
        }

        const id = String(this.nextId++);
        this.subscriptions.set(id, { channel, handler });
        return id;
    }

    unsubscribe(subscriptionId) {
        return this.subscriptions.delete(subscriptionId);
    }

    emit(channel, payload) {
        if (typeof channel !== 'string' || !channel) {
            throw new Error('EventBus.emit requires a non-empty channel string');
        }

        const event = {
            channel,
            payload,
            at: safeNow(this.now)
        };

        this.history.push(event);
        if (this.history.length > this.maxHistory) {
            this.history.splice(0, this.history.length - this.maxHistory);
        }

        const results = [];
        for (const [id, sub] of this.subscriptions) {
            if (matchChannel(sub.channel, channel)) {
                try {
                    const result = sub.handler(event);
                    results.push({ subscriptionId: id, ok: true, result });
                } catch (err) {
                    results.push({ subscriptionId: id, ok: false, error: err.message });
                }
            }
        }

        return { delivered: results.length, results };
    }

    async emitAsync(channel, payload) {
        if (typeof channel !== 'string' || !channel) {
            throw new Error('EventBus.emitAsync requires a non-empty channel string');
        }

        const event = {
            channel,
            payload,
            at: safeNow(this.now)
        };

        this.history.push(event);
        if (this.history.length > this.maxHistory) {
            this.history.splice(0, this.history.length - this.maxHistory);
        }

        const results = [];
        for (const [id, sub] of this.subscriptions) {
            if (matchChannel(sub.channel, channel)) {
                try {
                    const result = await sub.handler(event);
                    results.push({ subscriptionId: id, ok: true, result });
                } catch (err) {
                    results.push({ subscriptionId: id, ok: false, error: err.message });
                }
            }
        }

        return { delivered: results.length, results };
    }

    listSubscriptions() {
        const entries = [];
        for (const [id, sub] of this.subscriptions) {
            entries.push({ id, channel: sub.channel });
        }
        return entries;
    }

    getHistory({ channel, limit = 50 } = {}) {
        let entries = this.history;
        if (channel) {
            entries = entries.filter((event) => matchChannel(channel, event.channel));
        }
        return entries.slice(-Math.max(1, Number(limit) || 50));
    }

    clear() {
        this.subscriptions.clear();
        this.history = [];
    }
}

export const __eventBusInternals = { matchChannel };
