'use strict';

class Poolify {
  #factory = null;
  #max = 0;
  #instances = [];
  #queue = [];
  constructor(factory, { size, max }) {
    this.#factory = factory;
    this.#max = max;
    this.#instances = new Array(size);
    for (let i = 0; i < size; i++) {
      this.#instances[i] = this.#factory();
    }
  }

  acquire(callback) {
    const instance = this.#instances.pop();
    if (instance) {
      callback(null, instance);
    } else {
      this.#queue.push(callback);
    }
  }

  release(instance) {
    if (this.#queue.length > 0) {
      const callback = this.#queue.shift();
      callback(null, instance);
    } else if (this.#instances.length < this.#max) {
      this.#instances.push(instance);
    }
  }
}

module.exports = Poolify;
