import test from 'node:test';
import assert from 'node:assert/strict';
import { runCapabilityChecks } from './capability-test-utils.js';
import {
    brokerSecureDataCleanRooms,
    cleanRoomBrokerToTasks,
    SecureDataCleanRoomBroker
} from '../index.js';

test('capability 94 secure data clean room broker', () => {
    runCapabilityChecks({
        buildReport: brokerSecureDataCleanRooms,
        toTasks: cleanRoomBrokerToTasks,
        ClassCtor: SecureDataCleanRoomBroker,
        input: {
            cleanRooms: [{
                roomId: 'room-public',
                certLevel: 62,
                supportedDataClasses: ['public'],
                availability: 44,
                maxRetentionDays: 7,
                throughput: 52
            }],
            exchangeRequests: [{
                requestId: 'x-1',
                dataClass: 'restricted',
                retentionDays: 30,
                sensitivity: 82,
                computeIntensity: 70,
                urgency: 76
            }]
        },
        assertReport: (report) => {
            assert.equal(report.summary.blockedCount, 1);
            assert.equal(report.alerts.includes('clean_room_requests_blocked'), true);
        }
    });
});
