

# Project Name 
dms-data-clean

## Description

This project handles processing and updating CSV data for bus-related records. It consists of three main scripts that help in updating, adding, and deleting the `file_url` column in the CSV data:

0. **`/src/data`** – Provide the csv file want to clean.

1. **`index.js`** – This script reads the CSV file, processes data, and stores it in the `file_url` column.
node src/index.js 


2. **`updatePollutionDocWithFileUrl.js`** – After the `file_url` column is populated, this script updates the respective data into the desired column of the CSV.
node src/updatePollutionDocWithFileUrl.js


3. **`deleteFileUrlColumn.js`** – This script deletes the `file_url` column from the CSV file once it's no longer needed.
node src/deleteFileUrlColumn.js

---

## Setup

Ensure you have all dependencies installed before running the scripts. You can install the required dependencies using the following command:

```bash
npm install



