const PRIORITY_RANK = {
    critical: 1,
    high: 2,
    normal: 3,
    low: 4
};

function priorityRank(priority) {
    return PRIORITY_RANK[priority] || 99;
}

function safeNow(options) {
    const nowMs = Number(options?.nowMs);
    return Number.isFinite(nowMs) ? nowMs : Date.now();
}

export function buildApprovalQueue(taskRecords, options = {}) {
    const records = Array.isArray(taskRecords) ? taskRecords : [];
    const nowMs = safeNow(options);

    const items = records
        .filter((record) => record && typeof record === 'object')
        .filter((record) => record.status === 'awaiting_approval')
        .filter((record) => (record.approval?.status || 'pending') === 'pending')
        .map((record) => {
            const requestedAt = Number(record.approval?.requestedAt ?? record.createdAt ?? nowMs);
            const ageMs = Math.max(0, nowMs - requestedAt);
            return {
                taskId: record.taskId,
                target: record.target || null,
                priority: record.request?.priority || 'normal',
                task: record.request?.task || '',
                reviewerGroup: record.approval?.reviewerGroup || null,
                reason: record.approval?.reason || null,
                matchedRules: Array.isArray(record.approval?.matchedRules)
                    ? record.approval.matchedRules
                    : [],
                requestedAt,
                ageMs
            };
        })
        .sort((a, b) => {
            const priorityDelta = priorityRank(a.priority) - priorityRank(b.priority);
            if (priorityDelta !== 0) return priorityDelta;
            return b.ageMs - a.ageMs;
        });

    const byPriority = {};
    for (const item of items) {
        byPriority[item.priority] = (byPriority[item.priority] || 0) + 1;
    }

    return {
        generatedAt: new Date(nowMs).toISOString(),
        total: items.length,
        byPriority,
        items
    };
}

export function formatApprovalQueueMarkdown(queue) {
    const lines = [];
    lines.push('# Approval Queue');
    lines.push('');
    lines.push(`Generated: ${queue.generatedAt}`);
    lines.push(`Total pending approvals: ${queue.total}`);
    lines.push('');
    lines.push('| Priority | Task ID | Reviewer Group | Age (s) | Task | Reason |');
    lines.push('| --- | --- | --- | ---: | --- | --- |');

    for (const item of queue.items || []) {
        const ageSeconds = Math.floor(item.ageMs / 1000);
        lines.push(
            `| ${item.priority} | ${item.taskId} | ${item.reviewerGroup || '-'} | ${ageSeconds} | ${item.task} | ${item.reason || '-'} |`
        );
    }

    if (!queue.items || queue.items.length === 0) {
        lines.push('| - | - | - | 0 | (no pending approvals) | - |');
    }

    lines.push('');
    return lines.join('\n');
}
