'use strict';

// Task: implement a cancelable promise by passing `timeout: number`
// as an option to the promisified function (last argument,
// replacing the callback).

const promisify =
  (fn) =>
  (...args) => {
    const promise = new Promise((resolve, reject) => {
      const options = args.at(-1);
      let timer = null;
      if (options?.timeout) {
        timer = setTimeout(() => {
          reject(new Error('Operation timed out'));
        }, options.timeout);
        args = args.slice(0, -1);
      }
      const callback = (err, data) => {
        if (err) reject(err);
        else resolve(data);
        if (timer) clearTimeout(timer);
      };
      fn(...args, callback);
    });
    return promise;
  };

// Usage

const fs = require('node:fs');
const read = promisify(fs.readFile);

const main = async () => {
  const fileName = '1-promisify.js';
  const data = await read(fileName, 'utf8', { timeout: 1 });
  console.log(`File "${fileName}" size: ${data.length}`);
};

main();
