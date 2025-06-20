export class Strategy {
  constructor(strategyName: string, actions: Array<string>);
  registerBehaviour(implementationName: string, behaviour: object): void;
  getBehaviour(implementationName: string, actionName: string): Function;
}
