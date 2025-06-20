'use strict';

// Task: implement cancellation by passing `AbortSignal` as an option
// to the promisified function (last argument, replacing the callback).
// Hint: Create `AbortController` or `AbortSignal` in the usage section.

const promisify =
  (fn) =>
  (...args) => {
    const promise = new Promise((resolve, reject) => {
      const options = args.at(-1);
      let signal = null;
      if (options?.AbortSignal) {
        signal = options.AbortSignal;
        if (signal.aborted) {
          reject(new Error('Operation aborted'));
        }
        signal.addEventListener('abort', () => {
          reject(new Error('Operation aborted event listener'));
        });
        args = args.slice(0, -1);
      }
      const callback = (err, data) => {
        if (err) reject(err);
        else resolve(data);
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
  const controller = new AbortController();
  controller.signal.addEventListener('abort', () => {
    console.log(
      `Operation aborted for file "${fileName}" AbortController.abort()`,
    );
  });
  controller.signal.addEventListener('error', (err) => {
    console.error(`Error: ${err.message} AbortController.abort()`);
  });
  setTimeout(() => {
    controller.abort();
  }, 0);

  try {
    const data = await read(fileName, 'utf8', {
      AbortSignal: controller.signal,
    });
    console.log(`File "${fileName}" size: ${data.length}`);
  } catch (err) {
    console.error(
      `Error reading file "${fileName}": ${err.message} AbortController.abort`,
    );
  }
};

const main2 = async () => {
  const fileName = '1-promisify.js';
  try {
    const data = await read(fileName, 'utf8', {
      AbortSignal: AbortSignal.timeout(1),
    });
    console.log(`File "${fileName}" size: ${data.length}`);
  } catch (err) {
    console.error(
      `Error reading file "${fileName}": ${err.message} AbortSignal.timeout(1)`,
    );
  }
};

main();
main2();
