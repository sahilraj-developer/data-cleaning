// Load environment variables from .env file
require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { processCSVAndUpload } = require('./controllers/fileController');

// Use the environment variable for the CSV file path
const csvFilePath = process.env.CSV_FILE_PATH || path.join(__dirname, 'data', 'testscript2.csv');  // Default if not set in .env

console.log('Checking file at path:', csvFilePath);

// Check if the file exists
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

// Log the absolute path for debugging
console.log('Checking file at path:', csvFilePath);

try {
  // Try opening the file synchronously to catch any issues
  const fileDescriptor = fs.openSync(csvFilePath, 'r');
  console.log('File found and opened:', csvFilePath);

  // If file opened successfully, close it
  fs.closeSync(fileDescriptor);

  // Proceed with processing the file
  processCSVAndUpload(csvFilePath);

} catch (err) {
  console.error(`Error opening file at ${csvFilePath}:`, err);
}
