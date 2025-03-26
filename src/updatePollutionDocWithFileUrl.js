// const { readCSV, writeCSV } = require('./utils/csvUtils');
// const path = require('path');
// const lockfile = require('lockfile');
// const fs = require('fs');

// // Function to write to CSV with file locking
// const writeCSVWithLock = async (csvFilePath, csvRows) => {
//   const lockPath = `${csvFilePath}.lock`; // Create a lock file with the .lock extension

//   // Try to acquire the lock
//   lockfile.lock(lockPath, { retries: 5, retryWait: 500 }, (err) => {
//     if (err) {
//       console.error('Error acquiring lock:', err);
//       return;
//     }

//     // Proceed with writing to the CSV after acquiring the lock
//     try {
//       writeCSV(csvFilePath, csvRows); // Call your existing write function
//       console.log('CSV updated successfully!');
//     } catch (err) {
//       console.error('Error writing CSV:', err);
//     } finally {
//       // Release the lock after writing
//       lockfile.unlock(lockPath, (err) => {
//         if (err) {
//           console.error('Error unlocking file:', err);
//         } else {
//           console.log('Lock released.');
//         }
//       });
//     }
//   });
// };

// // Function to update fitness_doc with fileUrl
// const updatePollutionDocWithFileUrl = async (csvFilePath) => {
//   try {
//     const csvRows = await readCSV(csvFilePath);
//     if (!csvRows || csvRows.length === 0) {
//       console.log('No rows found in the CSV file.');
//       return;
//     }

//     // Iterate over rows to update fitness_doc with fileUrl
//     for (let row of csvRows) {
//       if (row.fileUrl && row.fileUrl.trim() !== "") {
//         const updatedPollutionDoc = { imageUrl: row.fileUrl };
//         row.fitness_doc = JSON.stringify(updatedPollutionDoc);
//         console.log(`Successfully updated fitness_doc for ${row.name}`);
//       } else {
//         console.log(`Skipping row with name: ${row.name} because fileUrl is missing or empty.`);
//       }
//     }

//     // Write to the CSV with lock to avoid concurrent access
//     await writeCSVWithLock(csvFilePath, csvRows);
//   } catch (err) {
//     console.error('Error processing CSV:', err);
//   }
// };

// // Predefined path to the CSV file
// const csvFilePath = path.join(__dirname, 'data', 'testscript2.csv');
// updatePollutionDocWithFileUrl(csvFilePath);


const { readCSV, writeCSV } = require('./utils/csvUtils');
const path = require('path');
const lockfile = require('lockfile');
const fs = require('fs');

// Function to write to CSV with file locking
const writeCSVWithLock = async (csvFilePath, csvRows) => {
  const lockPath = `${csvFilePath}.lock`; // Create a lock file with the .lock extension

  // Try to acquire the lock
  lockfile.lock(lockPath, { retries: 5, retryWait: 500 }, (err) => {
    if (err) {
      console.error('Error acquiring lock:', err);
      return;
    }

    // Proceed with writing to the CSV after acquiring the lock
    try {
      writeCSV(csvFilePath, csvRows); // Call your existing write function
      console.log('CSV updated successfully!');
    } catch (err) {
      console.error('Error writing CSV:', err);
    } finally {
      // Release the lock after writing
      lockfile.unlock(lockPath, (err) => {
        if (err) {
          console.error('Error unlocking file:', err);
        } else {
          console.log('Lock released.');
        }
      });
    }
  });
};

// Function to update adhar_doc with fileUrl and then delete fileUrl
const updatePollutionDocWithFileUrl = async (csvFilePath) => {
  try {
    const csvRows = await readCSV(csvFilePath);
    if (!csvRows || csvRows.length === 0) {
      console.log('No rows found in the CSV file.');
      return;
    }

    // The first row should contain the headers. If it's not in the expected format, we need to handle it.
    const headers = Object.keys(csvRows[0]);  // This ensures we have an array of headers.
    const fileUrlIndex = headers.indexOf('fileUrl');

    if (fileUrlIndex === -1) {
      console.log('No "fileUrl" column found.');
      return;
    }

    // Iterate over rows to update adhar_doc with fileUrl and delete fileUrl after update
    for (let row of csvRows) {
      if (row[headers[fileUrlIndex]] && row[headers[fileUrlIndex]].trim() !== "") {
        // Update the adhar_doc field with the imageUrl
        const updatedPollutionDoc = { imageUrl: row[headers[fileUrlIndex]] };
        row['adhar_doc'] = JSON.stringify(updatedPollutionDoc); // Update the adhar_doc field
        console.log(`Successfully updated adhar_doc for ${row.name}`);

        // Delete the fileUrl field after updating
        delete row[headers[fileUrlIndex]];
        console.log(`Deleted fileUrl for ${row.name}`);
      } else {
        console.log(`Skipping row with name: ${row.name} because fileUrl is missing or empty.`);
      }
    }

    // Remove 'fileUrl' column heading from the header row
    headers.splice(fileUrlIndex, 1);

    // Write the updated rows back to the CSV with file lock to avoid concurrent access
    await writeCSVWithLock(csvFilePath, csvRows);
  } catch (err) {
    console.error('Error processing CSV:', err);
  }
};

// Predefined path to the CSV file
const csvFilePath = path.join(__dirname, 'data', 'cond.csv');
updatePollutionDocWithFileUrl(csvFilePath);

