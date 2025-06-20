'use strict';

const createStrategy = (strategyName, actions) => {
  const implementations = new Map();

  const registerBehaviour = (implementationName, behaviour) => {
    if (typeof implementationName !== 'string') {
      throw new Error('Implementation name expected to be string');
    }
    for (const actionName of Object.keys(behaviour)) {
      if (!actions.includes(actionName)) {
        throw new Error(
          `Action ${actionName} is not allowed for strategy ${strategyName}`,
        );
      }
      if (typeof behaviour[actionName] !== 'function') {
        throw new Error(`Key ${actionName} expected to be function`);
      }
    }
    implementations.set(implementationName, behaviour);
  };

  const getBehaviour = (implementationName, actionName) => {
    const behaviour = implementations.get(implementationName);
    if (!behaviour) {
      throw new Error(
        // eslint-disable-next-line max-len
        `Action ${implementationName} for strategy ${strategyName} is not found`,
      );
    }
    const handler = behaviour[actionName];
    if (!handler) {
      throw new Error(
        `Action ${actionName} for strategy ${strategyName} is not found`,
      );
    }
    return handler;
  };
  return { registerBehaviour, getBehaviour };
};

module.exports = { createStrategy };
