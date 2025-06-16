'use strict';
const test = require('node:test');

const { logger } = require('./function.js');

test.describe('Logger Function Tests', () => {
  const warning = logger('warning');
  const error = logger('error');
  const info = logger('info');
  test.it('should log warning messages with correct color', () => {
    warning('Test warning message');
  });

  test.it('should log error messages with correct color', () => {
    error('Test error message');
  });

  test.it('should log info messages with correct color', () => {
    info('Test info message');
  });
});
