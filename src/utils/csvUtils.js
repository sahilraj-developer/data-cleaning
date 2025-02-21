const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { writeFileSync } = require('fs');
const { parse } = require('json2csv');

const readCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
};

const writeCSV = (filePath, data) => {
  const csvData = parse(data);
  writeFileSync(filePath, csvData);
};

module.exports = { readCSV, writeCSV };
