'use strict';
const { describe, test } = require('node:test');
const assert = require('node:assert');

const { Strategy } = require('./agents');

describe('Strategy', () => {
  test('should register and get behaviour', () => {
    const notification = new Strategy('notification', ['notify', 'multicast']);
    notification.registerBehaviour('email', {
      notify: (to, message) => {
        assert.strictEqual(typeof to, 'string');
        assert.strictEqual(typeof message, 'string');
      },
      multicast: (message) => {
        assert.strictEqual(typeof message, 'string');
      },
    });
    notification.registerBehaviour('sms', {
      notify: (to, message) => {
        assert.strictEqual(typeof to, 'string');
        assert.strictEqual(typeof message, 'string');
      },

      multicast: (message) => {
        assert.strictEqual(typeof message, 'string');
      },
    });
    notification.registerBehaviour('push', {
      notify: (to, message) => {
        assert.strictEqual(typeof to, 'string');
        assert.strictEqual(typeof message, 'string');
      },
      multicast: (message) => {
        assert.strictEqual(typeof message, 'string');
      },
    });
    const notify = notification.getBehaviour('sms', 'notify');
    notify('+380501234567', 'Hello world');
    const multicast = notification.getBehaviour('email', 'multicast');
    multicast('Hello everyone');
    const pushNotify = notification.getBehaviour('push', 'notify');
    pushNotify('+380501234567', 'Push notification test');
    const pushMulticast = notification.getBehaviour('push', 'multicast');
    pushMulticast('Push multicast test');
  });

  test('should throw error for invalid behaviour registration', () => {
    const notification = new Strategy('notification', ['notify', 'multicast']);
    assert.throws(
      () => {
        notification.registerBehaviour('email', {
          notify: 'not a function',
        });
      },
      {
        message: 'Key notify expected to be function',
      },
    );
    assert.throws(
      () => {
        notification.registerBehaviour('email', {
          unknownAction: () => {},
        });
      },
      {
        message:
          'Action unknownAction is not allowed for strategy notification',
      },
    );
  });
  test('should throw error for non-existent behaviour', () => {
    const notification = new Strategy('notification', ['notify', 'multicast']);
    assert.throws(
      () => {
        notification.getBehaviour('nonExistent', 'notify');
      },
      {
        message: 'Action nonExistent for strategy notification is not found',
      },
    );
    assert.throws(
      () => {
        notification.getBehaviour('email', 'unknownAction');
      },
      {
        message: 'Action email for strategy notification is not found',
      },
    );
  });
});
