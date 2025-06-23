'use strict';

const timeoutCollection = (interval) => {
  const collection = new Map();
  const expirations = new Map();

  const clear = setInterval(() => {
    const entries = expirations.entries();
    if (!entries.length) {
      clearInterval(clear);
      return;
    }
    const now = Date.now();
    for (const [key, expires] of entries) {
      if (now >= expires) {
        collection.delete(key);
        expirations.delete(key);
      }
    }
  }, interval);

  const set = (key, value) => {
    const expires = Date.now() + interval;
    collection.set(key, value);
    expirations.set(key, expires);
  };

  const get = (key) => {
    const value = collection.get(key);
    return { value };
  };

  const remove = (key) => {
    const existingValue = collection.get(key);
    if (existingValue) {
      collection.delete(key);
      expirations.delete(key);
    }
  };

  const toArray = () => [...collection.entries()];

  return {
    set,
    get,
    delete: remove,
    toArray,
  };
};

// Usage

const hash = timeoutCollection(1000);
hash.set('uno', 1);
console.dir({ array: hash.toArray() });
console.log(hash.get('uno'));

hash.set('due', 2);
console.dir({ array: hash.toArray() });

setTimeout(() => {
  hash.set('tre', 3);
  console.dir({ array: hash.toArray() });

  setTimeout(() => {
    hash.set('quattro', 4);
    console.dir({ array: hash.toArray() });
  }, 500);
}, 1500);
