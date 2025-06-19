'use strict';

const assert = require('node:assert');
const { test, describe, beforeEach, afterEach } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { FileStorage } = require('./factoryMethod.js');

const TMP_DIR = path.join(__dirname || process.cwd(), 'tmp_test_data');
const TEST_FILE = path.join(TMP_DIR, 'storage.dat');

function ensureTmpDir() {
  if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR);
}

function cleanTmpDir() {
  if (fs.existsSync(TEST_FILE)) fs.unlinkSync(TEST_FILE);
  if (fs.existsSync(TMP_DIR)) fs.rmSync(TMP_DIR, { recursive: true });
}

function writeTestData(records) {
  fs.writeFileSync(
    TEST_FILE,
    records.map((r) => JSON.stringify(r)).join('\n'),
    'utf8',
  );
}

describe('Integration: FileStorage and FileLineCursor with real FS', () => {
  beforeEach(() => {
    ensureTmpDir();
  });

  afterEach(() => {
    cleanTmpDir();
  });

  test('FileStorage.select iterates all === records from file', async () => {
    const records = [
      { name: 'Anna', city: 'Roma' },
      { name: 'Bruno', city: 'Paris' },
      { name: 'Carla', city: 'Roma' },
    ];
    writeTestData(records);

    const db = new FileStorage(TEST_FILE);
    const cursor = db.select({ city: 'Roma' });

    const results = [];
    for await (const record of cursor) {
      results.push(record);
    }

    assert.deepStrictEqual(results, [
      { name: 'Anna', city: 'Roma' },
      { name: 'Carla', city: 'Roma' },
    ]);
  });

  test('FileStorage.select returns empty when no record matches', async () => {
    const records = [
      { name: 'Anna', city: 'Roma' },
      { name: 'Bruno', city: 'Paris' },
    ];
    writeTestData(records);

    const db = new FileStorage(TEST_FILE);
    const cursor = db.select({ city: 'London' });

    const results = [];
    for await (const record of cursor) {
      results.push(record);
    }

    assert.deepStrictEqual(results, []);
  });

  test('FileStorage.select filters by multiple fields', async () => {
    const records = [
      { name: 'Anna', city: 'Roma', age: 22 },
      { name: 'Bruno', city: 'Roma', age: 25 },
      { name: 'Carla', city: 'Roma', age: 22 },
    ];
    writeTestData(records);

    const db = new FileStorage(TEST_FILE);
    const cursor = db.select({ city: 'Roma', age: 22 });

    const results = [];
    for await (const record of cursor) {
      results.push(record);
    }

    assert.deepStrictEqual(results, [
      { name: 'Anna', city: 'Roma', age: 22 },
      { name: 'Carla', city: 'Roma', age: 22 },
    ]);
  });

  test('FileStorage closes file stream after iteration', async () => {
    const records = [{ name: 'Anna', city: 'Roma' }];
    writeTestData(records);

    const db = new FileStorage(TEST_FILE);
    const cursor = db.select({ city: 'Roma' });

    for await (const record of cursor) {
      assert.deepStrictEqual(record, { name: 'Anna', city: 'Roma' });
    }

    assert.strictEqual(db.fileStream.destroyed, true);
  });
});
