export class TimeoutCollection {
  private timers = Map<string, NodeJS.Timeout>;
  private collections: Map<string, number>;
  private timeout: number;
  constructor(timeout?: number);
  set(key: string, value: number): void;
  get(key: string): number | undefined;
  delete(key: string): void;
  toArray(): Array<{ key: string; value: number }>;
}
