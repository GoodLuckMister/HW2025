'use strict';

class Strategy {
  #name;
  #actions;
  #behaviors = new Map();
  constructor(strategyName, actions) {
    this.#name = strategyName;
    this.#actions = actions;
  }

  registerBehaviour(implementationName, behaviour) {
    if (typeof implementationName !== 'string') {
      throw new Error('Implementation name expected to be string');
    }
    const behaviourKeys = Object.keys(behaviour);
    for (const actionName of behaviourKeys) {
      if (!this.#actions.includes(actionName)) {
        throw new Error(
          `Action "${actionName}" is not allowed for strategy "${this.#name}"`,
        );
      }
      if (typeof behaviour[actionName] !== 'function') {
        throw new Error(`Key ${actionName} expected to be function`);
      }
    }
    this.#behaviors.set(implementationName, behaviour);
  }

  getBehaviour(implementationName, actionName) {
    const behaviour = this.#behaviors.get(implementationName);
    if (!behaviour) {
      throw new Error(`Strategy "${this.#name}" is not found`);
    }
    const handler = behaviour[actionName];
    if (!handler) {
      throw new Error(
        `Action "${actionName}" for strategy "${this.#name}" is not found`,
      );
    }
    return handler;
  }
}

const notification = new Strategy('notification', ['notify', 'multicast']);
notification.registerBehaviour('email', {
  notify: (to, message) => {
    console.log(`Sending "email" notification to <${to}>`);
    console.log(`message length: ${message.length}`);
  },
  multicast: (message) => {
    console.log(`Sending "email" notification to all`);
    console.log(`message length: ${message.length}`);
  },
});
notification.registerBehaviour('sms', {
  notify: (to, message) => {
    console.log(`Sending "sms" notification to <${to}>`);
    console.log(`message length: ${message.length}`);
  },
  multicast: (message) => {
    console.log(`Sending "sms" notification to all`);
    console.log(`message length: ${message.length}`);
  },
});

notification.registerBehaviour('push', {
  notifying: (to, message) => {
    console.log(`Sending "push" notification to <${to}>`);
    console.log(`message length: ${message.length}`);
  },
  multicasting: (message) => {
    console.log(`Sending "push" notification to all`);
    console.log(`message length: ${message.length}`);
  },
});

const notify = notification.getBehaviour('sms', 'notify');
notify('+380501234567', 'Hello world');
