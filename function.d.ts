'use strict';

type Level = 'warning' | 'error' | 'info';

export declare function logger(
  level: Level,
  color: string,
): (message: string) => void;
