'use strict';

const poolify = (factory, { size, max }) => {
  const instances = new Array(size).fill(null).map(factory);
  const queue = [];

  const acquire = (callback) => {
    const instance = instances.pop();
    if (instance) {
      callback(null, instance);
    } else {
      queue.push(callback);
    }
  };

  const release = (instance) => {
    if (queue.length > 0) {
      const callback = queue.shift();
      callback(null, instance);
    } else if (instances.length < max) {
      instances.push(instance);
    }
  };

  return { acquire, release };
};

module.exports = poolify;
