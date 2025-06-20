'use strict';

const selectStrategy = (strategy, name) =>
  name in strategy ? strategy[name] : strategy.abstract;

const RENDERERS = {
  abstract: () => {
    console.log('Not implemented');
  },

  console: (data) => {
    const keys = Object.keys(data[0]);
    const line = (row, index) =>
      `${index}, ` + keys.map((key) => `${row[key]}`).join(',') + '\n';
    const output = [
      `index,` + keys.map((key) => `${key}`).join(',') + '\n',
      data.map(line).join(''),
    ];
    return output.join('');
  },

  web: (data) => {
    const keys = Object.keys(data[0]);
    const line = (row) =>
      '<tr>' + keys.map((key) => `<td>${row[key]}</td>`).join('') + '</tr>';
    const output = [
      '<table><tr>',
      keys.map((key) => `<th>${key}</th>`).join(''),
      '</tr>',
      data.map(line).join(''),
      '</table>',
    ];
    return output.join('');
  },

  markdown: (data) => {
    const keys = Object.keys(data[0]);
    const line = (row) =>
      '|' + keys.map((key) => `${row[key]}`).join('|') + '|\n';
    const output = [
      '|',
      keys.map((key) => `${key}`).join('|'),
      '|\n',
      '|',
      keys.map(() => '---').join('|'),
      '|\n',
      data.map(line).join(''),
    ];
    return output.join('');
  },
};

const context = (rendererName) => {
  const renderer = selectStrategy(RENDERERS, rendererName);
  return (data) => renderer(data);
};

// Usage

const png = context('png');
const con = context('console');
const web = context('web');
const mkd = context('markdown');

const persons = [
  { name: 'Marcus Aurelius', city: 'Rome', born: 121 },
  { name: 'Victor Glushkov', city: 'Rostov on Don', born: 1923 },
  { name: 'Ibn Arabi', city: 'Murcia', born: 1165 },
  { name: 'Mao Zedong', city: 'Shaoshan', born: 1893 },
  { name: 'Rene Descartes', city: 'La Haye en Touraine', born: 1596 },
];

console.group('Unknown Strategy:\n', png(persons));
console.groupEnd();

console.group('\nConsoleRenderer:\n', con(persons));
console.groupEnd();

console.group('\nWebRenderer:\n', web(persons));
console.groupEnd();

console.group('\nMarkdownRenderer:\n', mkd(persons));
console.groupEnd();
