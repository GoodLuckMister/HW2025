'use strict';

class Strategy {
  #name;
  #actions;
  #implementations = new Map();
  constructor(strategyName, actions) {
    this.#name = strategyName;
    this.#actions = actions;
  }

  registerBehaviour(implementationName, behaviour) {
    if (typeof implementationName !== 'string') {
      throw new Error('Implementation name expected to be string');
    }
    for (const actionName of Object.keys(behaviour)) {
      if (!this.#actions.includes(actionName)) {
        throw new Error(
          `Action ${actionName} is not allowed for strategy ${this.#name}`,
        );
      }
      if (typeof behaviour[actionName] !== 'function') {
        throw new Error(`Key ${actionName} expected to be function`);
      }
    }
    this.#implementations.set(implementationName, behaviour);
  }

  getBehaviour(implementationName, actionName) {
    const behaviour = this.#implementations.get(implementationName);
    if (!behaviour) {
      throw new Error(
        `Action ${implementationName} for strategy ${this.#name} is not found`,
      );
    }
    const handler = behaviour[actionName];
    if (!handler) {
      throw new Error(
        `Action ${actionName} for strategy ${this.#name} is not found`,
      );
    }
    return handler;
  }
}

module.exports = { Strategy };
