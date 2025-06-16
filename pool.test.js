'use strict';

const test = require('node:test');
const assert = require('assert');

const poolify = require('./closure');
const Poolify = require('./class');

test('poolify closure callback:', () => {
  let count = 0;
  const createCountEntity = () => ({ count: count++ });

  const size = 10;
  const max = 15;
  const pool = poolify(createCountEntity, { size, max });

  let expectedCount = 10;
  const acquireCallback = (err, instance) => {
    assert(!err, 'Error should be null');
    expectedCount--;
    assert.strictEqual(
      instance.count,
      expectedCount,
      `Instance count should be ${expectedCount}`,
    );
  };

  for (let i = 0; i < 10; i++) {
    pool.acquire(acquireCallback);
  }

  const acquireCallback2 = (err, instance) => {
    assert(!err, 'Error should be null');
    assert.strictEqual(instance.count, 11, 'Instance count should be 11');
  };

  pool.acquire(acquireCallback2);
  pool.acquire(acquireCallback2);
  const instance = { count: 11 };
  pool.release(instance);
  pool.release(instance);
});

test('poolify class callback:', () => {
  let count = 0;
  const createCountEntity = () => ({ count: count++ });

  const size = 10;
  const max = 15;
  const pool = new Poolify(createCountEntity, { size, max });

  let expectedCount = 10;
  const acquireCallback = (err, instance) => {
    assert(!err, 'Error should be null');
    expectedCount--;
    assert.strictEqual(
      instance.count,
      expectedCount,
      `Instance count should be ${expectedCount}`,
    );
  };

  for (let i = 0; i < 10; i++) {
    pool.acquire(acquireCallback);
  }

  const acquireCallback2 = (err, instance) => {
    assert(!err, 'Error should be null');
    assert.strictEqual(instance.count, 11, 'Instance count should be 11');
  };

  pool.acquire(acquireCallback2);
  pool.acquire(acquireCallback2);
  const instance = { count: 11 };
  pool.release(instance);
  pool.release(instance);
});
