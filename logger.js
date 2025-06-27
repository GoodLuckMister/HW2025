'use strict';

const COLORS = {
  warn: '\x1b[1;33m',
  error: '\x1b[0;31m',
  info: '\x1b[1;37m',
};

class Logger {
  constructor(instance) {
    this.instance = instance ?? console;
  }

  static create(instance) {
    return new Logger(instance);
  }

  log(level, s) {
    const date = new Date().toISOString();
    const color = COLORS[level] ?? COLORS.info;
    this.instance.log(color + date + '\t' + s + '\x1b[0m');
  }

  warn(s) {
    this.log('warn', s);
  }

  error(s) {
    this.log('error', s);
  }

  info(s) {
    this.log('info', s);
  }
}

module.exports = { Logger };
