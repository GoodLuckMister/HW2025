export declare function createStrategy(
  strategyName: string,
  actions: Array<string>,
): {
  registerBehaviour: (implementationName: string, behaviour: object) => void;
  getBehaviour: (implementationName: string, actionName: string) => Function;
};
