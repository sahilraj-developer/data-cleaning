const fs = require('fs');
const path = require('path');

const csvFilePath = path.join(__dirname, 'data', 'cond.csv');  // Adjust this path accordingly

console.log('Checking file at path:', csvFilePath);

fs.open(csvFilePath, 'r', (err, fd) => {
  if (err) {
    console.error('Error opening file:', err);
  } else {
    console.log('File found and opened:', csvFilePath);
    fs.close(fd, (closeErr) => {
      if (closeErr) {
        console.error('Error closing file:', closeErr);
      }
    });
  }
});
