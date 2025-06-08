'use strict';

// Create Iterator for given dataset with Symbol.asyncIterator
// Use for..of to iterate it and pass data to Basket
// Basket is limited to certain amount
// After iteration ended Basket should return Thenable
// to notify us with final list of items, total and
// escalated errors

const DONE = { done: true, value: undefined };

class AsyncifyIterator {
  #iterator = null;
  constructor(iterator) {
    this.#iterator = iterator;
  }

  async next() {
    return this.#iterator.next();
  }

  async return() {
    return this.#iterator.return();
  }

  async throw() {
    return this.#iterator.throw();
  }
}

class PurchaseIterator {
  #data = [];
  #index = 0;
  #done = false;
  constructor(data) {
    this.#data = data;
  }

  next() {
    if (this.#index < this.#data.length && !this.#done) {
      return { done: false, value: this.#data[this.#index++] };
    }
    this.#done = true;
    return DONE;
  }

  return() {
    this.#done = true;
    return DONE;
  }

  throw() {
    this.#done = true;
    return DONE;
  }
}

class PurchaseIterable {
  #iterator = null;
  constructor(data) {
    this.#iterator = new PurchaseIterator(data);
  }

  static create(data) {
    return new PurchaseIterable(data);
  }

  [Symbol.asyncIterator]() {
    return new AsyncifyIterator(this.#iterator);
  }

  [Symbol.iterator]() {
    return this.#iterator;
  }
}
class Basket {
  #limit = 0;
  items = [];
  total = 0;
  errors = [];
  constructor({ limit }) {
    this.#limit = limit;
  }

  add(item) {
    const isOverLimit = this.#checkLimit(item);
    if (!isOverLimit) {
      this.items.push(item);
      this.total += item.price;
    }
  }

  async end() {
    const { items, total, errors } = this;
    return { items, total, errors };
  }

  #checkLimit(item) {
    const isOverLimit = this.total + item.price > this.#limit;
    if (isOverLimit) {
      this.errors.push(
        `Exceeds limit with: ${item.name}, price: ${item.price}`,
      );
    }
    return isOverLimit;
  }
}

module.exports = {
  PurchaseIterable,
  Basket,
};
