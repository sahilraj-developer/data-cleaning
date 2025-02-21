const { readCSV, writeCSV } = require('../utils/csvUtils');
const { imageUploaderV2 } = require('../utils/uploadUtils');

const processCSVAndUpload = async (csvFilePath) => {
  try {
    // Step 1: Read the CSV and parse the rows
    const csvRows = await readCSV(csvFilePath);

    const files = csvRows.map(row => {
      console.log("row.pollution_doc", row.registrationCert_doc); // Debug log

      if (row.registrationCert_doc && row.registrationCert_doc.trim() !== "") {
        try {
          // Parse the pollution_doc field if it's a JSON string
          let pollutionDoc = null;
          try {
            pollutionDoc = JSON.parse(row.registrationCert_doc);  // Parse to handle JSON format
          } catch (error) {
            console.log(`Skipping file: ${row.name} because pollution_doc is not a valid JSON.`);
            return null;
          }

          // Handle the case where the pollution_doc has a URL
          if (pollutionDoc.imageUrl) {
            console.log(`Processing URL for ${row.name}`);

            // If the originalname is missing, fallback to the filename from the URL
            const fileNameFromUrl = pollutionDoc.imageUrl.split('/').pop(); // Get the file name from the URL
            return {
              originalname: fileNameFromUrl, // Fallback to filename from URL if missing
              mimetype: 'application/octet-stream', // Default mimetype if URL present
              url: pollutionDoc.imageUrl // URL already present, don't process it further
            };
          }

          // Otherwise, handle the buffer data (byte array)
          if (pollutionDoc.buffer && Array.isArray(pollutionDoc.buffer.data)) {
            console.log(`Processing buffer data for ${row.name}`);

            // Convert the buffer data (byte array) to a Buffer
            const fileBuffer = Buffer.from(pollutionDoc.buffer.data);

            // Assuming file name and size are provided in the pollution_doc
            const fileName = pollutionDoc.name || row.name; // Fallback to row.name if name is not provided
            const fileSize = pollutionDoc.size || fileBuffer.length; // Fallback to length of buffer if size is not provided

            // Determine mimetype based on the file extension
            const extension = fileName.split('.').pop().toLowerCase();
            let mimetype = '';

            switch (extension) {
              case 'jpg':
              case 'jpeg':
                mimetype = 'image/jpeg';
                break;
              case 'png':
                mimetype = 'image/png';
                break;
              case 'webp':
                mimetype = 'image/webp';
                break;
              case 'gif':
                mimetype = 'image/gif';
                break;
              case 'bmp':
                mimetype = 'image/bmp';
                break;
              // Add more formats as needed
              default:
                mimetype = 'application/octet-stream';
            }

            // Return the file object
            return {
              originalname: fileName,
              mimetype: mimetype,
              buffer: fileBuffer
            };
          } else {
            console.log(`Skipping file: ${row.name} because buffer is missing or invalid.`);
            return null;
          }
        } catch (error) {
          console.log(`Error processing pollution_doc for ${row.name}:`, error);
          return null;
        }
      } else {
        console.log(`Skipping file: ${row.name} because pollution_doc is missing.`);
        return null;
      }
    }).filter(file => file !== null); // Only keep valid files

    // Step 2: If there are valid files, proceed to upload
    if (files.length === 0) {
      console.log('No valid files to upload.');
      return;
    }

    // Upload files
    const uploadedUrls = await imageUploaderV2(files);

    // Step 3: Update CSV with URLs and write back to file
    const updatedRows = csvRows.map((row, index) => {
      const updatedRow = { ...row };
      if (files[index]) {
        updatedRow.fileUrl = files[index].url || uploadedUrls[index]; // Check if the file already has a URL
      }
      return updatedRow;
    });

    await writeCSV(csvFilePath, updatedRows);
    console.log('CSV updated with file URLs successfully!');
  } catch (err) {
    console.error('Error processing CSV:', err);
  }
};

module.exports = { processCSVAndUpload };
