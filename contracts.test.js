"use strict";

const test = require("node:test");
const assert = require("node:assert");

const { PurchaseIterable, Basket } = require("./2-contracts.js");

const purchase = [
  { name: "Laptop", price: 1500 },
  { name: "Mouse", price: 25 },
  { name: "Keyboard", price: 100 },
  { name: "HDMI cable", price: 10 },
  { name: "Bag", price: 50 },
  { name: "Mouse pad", price: 5 },
];

test("Sync iterator basket.add items:", () => {
  const goods = PurchaseIterable.create(purchase);
  const basket = new Basket({ limit: 1050 });

  for (const item of goods) {
    basket.add(item);
  }
  basket.end().then((result) => {
    assert.strictEqual(result.items.length, 5);
    assert.strictEqual(result.total, 190);
    assert.strictEqual(result.errors.length, 1);
  });
});

test("Async iterator basket.add items:", async () => {
  const goods = PurchaseIterable.create(purchase);
  const basket = new Basket({ limit: 1050 });

  for await (const item of goods) {
    basket.add(item);
  }
  const result = await basket.end();
  assert.strictEqual(result.items.length, 5);
  assert.strictEqual(result.total, 190);
  assert.strictEqual(result.errors.length, 1);
});
