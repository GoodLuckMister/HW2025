'use strict';
const { describe, test } = require('node:test');
const assert = require('node:assert');
const { TimeoutCollection } = require('./1-proto');

describe('TimeoutCollection', () => {
  test('usage test', () => {
    const hash = new TimeoutCollection(3000);
    hash.set('uno', 1);
    assert.deepStrictEqual({ array: hash.toArray() }, { array: [['uno', 1]] });

    hash.set('due', 2);
    assert.deepStrictEqual(
      { array: hash.toArray() },
      {
        array: [
          ['uno', 1],
          ['due', 2],
        ],
      },
    );

    setTimeout(() => {
      hash.set('tre', 3);
      const array = hash.toArray();
      assert.deepStrictEqual(
        { array },
        {
          array: [
            ['uno', 1],
            ['due', 2],
            ['tre', 3],
          ],
        },
      );

      setTimeout(() => {
        hash.set('quattro', 4);
        assert.deepStrictEqual(
          { array: hash.toArray() },
          {
            array: [
              ['uno', 1],
              ['due', 2],
              ['tre', 3],
              ['quattro', 4],
            ],
          },
        );
      }, 500);
    }, 1500);
  });
});
