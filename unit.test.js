'use strict';
const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert');
const readline = require('node:readline');
const { FileStorage, FileLineCursor } = require('./factoryMethod.js');

function makeMockLineIterator(linesArr) {
  let index = 0;
  return {
    async next() {
      if (index < linesArr.length) {
        const value = linesArr[index++];
        return { value, done: false };
      }
      return { done: true };
    },
    [Symbol.asyncIterator]() {
      return this;
    },
  };
}

function mockCreateInterface() {
  return makeMockLineIterator(mockCreateInterface.mockLines);
}
mockCreateInterface.mockLines = [];
readline.createInterface = mockCreateInterface;

describe('Class: FileStorage and FileLineCursor with mock FS', () => {
  let fileStorage;
  beforeEach(() => {
    fileStorage = Object.create(FileStorage.prototype);
    fileStorage.fileStream = {};
    fileStorage.fileName = 'dummy';
  });

  test('FileStorage.select returns FileLineCursor', () => {
    const query = { city: 'Roma' };
    const cursor = FileStorage.prototype.select.call(fileStorage, query);
    assert.ok(cursor instanceof FileLineCursor);
    assert.deepStrictEqual(cursor.query, query);
  });

  test('FileLineCursor filters records matching query', async () => {
    const records = [
      { name: 'A', city: 'Roma' },
      { name: 'B', city: 'Paris' },
      { name: 'C', city: 'Roma' },
    ];
    mockCreateInterface.mockLines = records.map((r) => JSON.stringify(r));
    const cursor = new FileLineCursor(fileStorage, { city: 'Roma' });
    const results = [];
    for await (const record of cursor) {
      results.push(record);
    }
    assert.deepStrictEqual(results, [
      { name: 'A', city: 'Roma' },
      { name: 'C', city: 'Roma' },
    ]);
  });

  test('FileLineCursor returns empty when no match', async () => {
    const records = [
      { name: 'A', city: 'Paris' },
      { name: 'B', city: 'Berlin' },
    ];
    mockCreateInterface.mockLines = records.map((r) => JSON.stringify(r));
    const cursor = new FileLineCursor(fileStorage, { city: 'Roma' });
    const results = [];
    for await (const record of cursor) {
      results.push(record);
    }
    assert.deepStrictEqual(results, []);
  });

  test('FileLineCursor filters by multiple fields', async () => {
    const records = [
      { name: 'A', city: 'Roma', age: 30 },
      { name: 'B', city: 'Roma', age: 25 },
      { name: 'C', city: 'Roma', age: 30 },
    ];
    mockCreateInterface.mockLines = records.map((r) => JSON.stringify(r));
    const cursor = new FileLineCursor(fileStorage, { age: 30 });
    const results = [];
    for await (const record of cursor) {
      results.push(record);
    }
    assert.deepStrictEqual(results, [
      { name: 'A', city: 'Roma', age: 30 },
      { name: 'C', city: 'Roma', age: 30 },
    ]);
  });
});
