'use strict';

// Task: refactor `Timer` to make the event name configurable
// (e.g., 'step' in the example) and not hardcoded into the `Timer`.
// Hint: You need Node.js >= v19.0.0

class Timer extends EventTarget {
  #counter = 0;
  constructor(delay, eventname = 'step') {
    super();
    setInterval(() => {
      const data = { detail: { [eventname]: this.#counter++ } };
      const event = new CustomEvent(eventname, data);
      this.dispatchEvent(event);
    }, delay);
  }
}

// Usage

const timer = new Timer(1000, 'tick');

timer.addEventListener('tick', (event) => {
  console.log({ event, detail: event.detail });
});
