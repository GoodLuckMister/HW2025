'use strict';

const { EventEmitter } = require('node:events');
const { Logger } = require('./logger');

const timerStrategy = {
  number: {
    getTime: (time) => Date.now() + time,
    set: setTimeout,
    clear: clearTimeout,
  },
  string: {
    getTime: (time) => new Date(time).getTime(),
    set: setTimeout,
    clear: clearTimeout,
  },
};

class Task extends EventEmitter {
  constructor(name, time, exec) {
    super();
    this.name = name;
    this.exec = exec;
    this.running = false;
    this.count = 0;
    this.timer = null;
    const { getTime, set, clear } =
      timerStrategy[typeof time] || timerStrategy.string;
    this.time = getTime(time);
    this.set = set;
    this.clear = clear;
  }

  get active() {
    return !!this.timer;
  }

  start() {
    this.stop();
    if (this.running) return false;
    const time = this.time - Date.now();
    if (time < 0) return false;
    this.timer = this.set(() => {
      this.run();
    }, time);
    return true;
  }

  stop() {
    if (!this.active || this.running) return false;
    this.clear(this.timer);
    this.timer = null;
    return true;
  }

  run() {
    if (!this.active || this.running) return false;
    this.running = true;
    this.emit('begin', this);
    this.exec((err, res) => {
      if (err) this.emit('error', err, this);
      this.emit('end', res, this);
      this.count++;
      this.running = false;
    });
    return true;
  }
}

class Scheduler extends EventEmitter {
  constructor({ logger } = {}) {
    super();
    this.tasks = new Map();
    this.logger = logger || Logger.create(console);
  }

  task(name, time, exec) {
    this.stop(name);
    const task = new Task(name, time, exec);
    this.tasks.set(name, task);
    task.on('error', (err) => {
      this.logger.error(task.name + '\t' + err.message);
      this.emit('error', err, task);
    });
    task.on('begin', () => {
      this.logger.info(task.name + '\tbegin');
    });
    task.on('end', (res = '') => {
      this.logger.warn(task.name + '\tend\t' + res);
    });
    task.start();
    return task;
  }

  stop(name) {
    const task = this.tasks.get(name);
    if (task) {
      task.stop();
      this.tasks.delete(name);
    }
  }

  stopAll() {
    for (const name of this.tasks.keys()) {
      this.stop(name);
    }
  }
}

// Usage
const logger = Logger.create(console);
const scheduler = new Scheduler({ output: logger });

scheduler.on('error', (err, task) => {
  console.log(`Error in ${task.name}:\n ${err.stack}`);
  //process.exit(1);
});

scheduler.task('name1', '2019-03-12T14:37Z', (done) => {
  setTimeout(() => {
    done(null, 'task successed');
  }, 1000);
});

scheduler.task('name2', '2019-03-12T14:37Z', (done) => {
  setTimeout(() => {
    done(new Error('task failed'));
  }, 1100);
});

scheduler.task('name3', 500, (done) => {
  setTimeout(() => {
    done(null, 'task successed');
  }, 1200);
});

scheduler.task('name4', 800, (done) => {
  setTimeout(() => {
    done(new Error('task failed'));
  }, 2000);
});
