export class Strategy {
  private name: string;
  private actions: Array<string>;
  private implementations: Map<string, object>;
  constructor(strategyName: string, actions: Array<string>);
  registerBehaviour(implementationName: string, behaviour: object): void;
  getBehaviour(implementationName: string, actionName: string): Function;
}
