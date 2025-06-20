'use strict';

// Task: refactor `Timer` to make the event name configurable
// (e.g., 'step' in the example) and not hardcoded into the `Timer`.
// Hint: You need Node.js >= v19.0.0

class Timer extends EventTarget {
  #counter = 0;
  constructor({ name = 'step', delay = 1000 } = {}) {
    super();
    setInterval(() => {
      const data = { detail: { [name]: this.#counter++ } };
      const event = new CustomEvent(name, data);
      this.dispatchEvent(event);
    }, delay);
  }
}

// Usage

const timer = new Timer({ name: 'tick', delay: 500 });

timer.addEventListener('tick', (event) => {
  console.log({ event, detail: event.detail });
});
