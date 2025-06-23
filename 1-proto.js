'use strict';

// Facade that wraps Map and Node.js Timers to provide a simple interface for a
// collection with values that have expiration timeout.

class TimeoutCollection {
  #collections = new Map();
  #timers = new Map();
  #timeout = 1000;
  constructor(timeout) {
    this.#timeout = timeout || this.#timeout;
  }
  set(key, value) {
    const timer = this.#timers.get(key);
    if (timer) clearTimeout(timer);
    const timeout = setTimeout(() => {
      this.delete(key);
    }, this.#timeout);
    timeout.unref();
    this.#collections.set(key, value);
    this.#timers.set(key, timeout);
  }
  get(key) {
    return this.#collections.get(key);
  }
  delete(key) {
    const timer = this.#timers.get(key);
    if (timer) {
      clearTimeout(timer);
      this.#collections.delete(key);
      this.#timers.delete(key);
    }
  }
  toArray() {
    return [...this.#collections.entries()];
  }
}

module.exports = { TimeoutCollection };
