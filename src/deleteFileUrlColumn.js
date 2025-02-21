const fs = require('fs');
const path = require('path');
const fastcsv = require('fast-csv');
const { parse } = require('csv-parse');

// Define the file path (same path for reading and writing)
const csvFilePath = path.join(__dirname, 'data', 'testscript2.csv'); // Path to the CSV file

/**
 * Deletes the 'fileUrl' column from a CSV file and saves the modified file (overwriting the original file).
 * @param {string} inputFile - Path to the CSV file to be modified.
 */
function deleteFileUrlColumn(inputFile) {
  const rows = [];

  // Read and parse the CSV file
  fs.createReadStream(inputFile)
    .pipe(parse({ columns: true, skip_empty_lines: true }))
    .on('data', (row) => {
      // Delete the 'fileUrl' column from each row
      delete row['fileUrl'];
      rows.push(row);
    })
    .on('end', () => {
      // Get the headers from the first row, now excluding 'fileUrl'
      const headers = Object.keys(rows[0]);

      // Overwrite the original CSV file with the modified data
      const ws = fs.createWriteStream(inputFile);
      fastcsv
        .write(rows, { headers: headers, writeHeaders: true })
        .pipe(ws)
        .on('finish', () => {
          console.log(`Column 'fileUrl' has been deleted and the file has been updated at '${inputFile}'`);
        });
    })
    .on('error', (error) => {
      console.error('Error processing the file:', error);
    });
}

// Call the function with the CSV file path
deleteFileUrlColumn(csvFilePath);
