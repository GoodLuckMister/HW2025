'use strict';

const COLORS = {
  warning: '\x1b[1;33m',
  error: '\x1b[0;31m',
  info: '\x1b[1;37m',
};

const logger =
  (level = 'info', color = COLORS[level]) =>
  (message) => {
    const date = new Date().toISOString();
    console.log(`${color}${date}\t${message}`);
  };

module.exports = { logger };
